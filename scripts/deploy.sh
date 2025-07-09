#!/bin/bash

# =================================================================
# TRIBUTA.AI - PRODUCTION DEPLOYMENT SCRIPT
# =================================================================
# This script handles the complete deployment process for the
# Tributa.AI platform with all necessary checks and configurations
# =================================================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="tributa-ai-web"
NODE_VERSION="18.17.0"
REQUIRED_MEMORY="4096"  # MB
REQUIRED_DISK="10240"   # MB

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking deployment prerequisites..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    local node_version=$(node --version | cut -d'v' -f2)
    if [[ $(echo "$node_version < $NODE_VERSION" | bc -l) -eq 1 ]]; then
        log_warning "Node.js version $node_version is older than recommended $NODE_VERSION"
    else
        log_success "Node.js version $node_version is compatible"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check available memory
    if command -v free &> /dev/null; then
        local available_memory=$(free -m | awk 'NR==2{printf "%d", $7}')
        if [[ $available_memory -lt $REQUIRED_MEMORY ]]; then
            log_warning "Available memory ($available_memory MB) is less than recommended ($REQUIRED_MEMORY MB)"
        else
            log_success "Memory check passed ($available_memory MB available)"
        fi
    fi
    
    # Check disk space
    local available_disk=$(df -m . | awk 'NR==2{printf "%d", $4}')
    if [[ $available_disk -lt $REQUIRED_DISK ]]; then
        log_error "Insufficient disk space. Available: $available_disk MB, Required: $REQUIRED_DISK MB"
        exit 1
    else
        log_success "Disk space check passed ($available_disk MB available)"
    fi
}

check_environment() {
    log_info "Checking environment configuration..."
    
    # Check if .env.production exists
    if [[ ! -f ".env.production" ]]; then
        log_warning ".env.production not found. Checking .env.local..."
        if [[ ! -f ".env.local" ]]; then
            log_error "No environment configuration found. Please create .env.production or .env.local"
            log_info "Use docs/environment-template.env as a reference"
            exit 1
        fi
    fi
    
    # Check required environment variables
    local required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    log_success "Environment configuration validated"
}

install_dependencies() {
    log_info "Installing dependencies..."
    
    # Clean install
    if [[ -d "node_modules" ]]; then
        log_info "Removing existing node_modules..."
        rm -rf node_modules
    fi
    
    if [[ -f "package-lock.json" ]]; then
        log_info "Removing package-lock.json..."
        rm package-lock.json
    fi
    
    # Install dependencies
    npm install --production=false
    
    log_success "Dependencies installed successfully"
}

run_security_checks() {
    log_info "Running security audit..."
    
    # npm audit
    if npm audit --audit-level=high; then
        log_success "Security audit passed"
    else
        log_warning "Security vulnerabilities found. Consider running 'npm audit fix'"
    fi
    
    # Check for sensitive files
    local sensitive_files=(".env" ".env.local" ".env.production" "*.key" "*.pem")
    for pattern in "${sensitive_files[@]}"; do
        if ls $pattern 1> /dev/null 2>&1; then
            log_warning "Sensitive files found: $pattern. Ensure they are not committed to version control"
        fi
    done
}

run_tests() {
    log_info "Running tests..."
    
    # Type checking
    if npm run type-check; then
        log_success "Type checking passed"
    else
        log_error "Type checking failed"
        exit 1
    fi
    
    # Linting
    if npm run lint; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        exit 1
    fi
    
    # Unit tests (if available)
    if npm run test --if-present; then
        log_success "Tests passed"
    else
        log_warning "Tests failed or not available"
    fi
}

build_application() {
    log_info "Building application..."
    
    # Clean previous build
    if [[ -d ".next" ]]; then
        log_info "Removing previous build..."
        rm -rf .next
    fi
    
    # Build application
    if npm run build; then
        log_success "Application built successfully"
    else
        log_error "Build failed"
        exit 1
    fi
    
    # Verify build output
    if [[ ! -d ".next" ]]; then
        log_error "Build output directory not found"
        exit 1
    fi
    
    local build_size=$(du -sh .next | cut -f1)
    log_info "Build size: $build_size"
}

setup_production_environment() {
    log_info "Setting up production environment..."
    
    # Set NODE_ENV
    export NODE_ENV=production
    
    # Create logs directory
    mkdir -p logs
    
    # Create uploads directory
    mkdir -p uploads
    
    # Set appropriate permissions
    chmod 755 logs uploads
    
    log_success "Production environment configured"
}

create_systemd_service() {
    if command -v systemctl &> /dev/null; then
        log_info "Creating systemd service..."
        
        local service_file="/etc/systemd/system/$PROJECT_NAME.service"
        local current_dir=$(pwd)
        local user=$(whoami)
        
        sudo tee $service_file > /dev/null <<EOF
[Unit]
Description=Tributa.AI Web Application
After=network.target

[Service]
Type=simple
User=$user
WorkingDirectory=$current_dir
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$PROJECT_NAME

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable $PROJECT_NAME
        
        log_success "Systemd service created and enabled"
    else
        log_warning "Systemd not available. Manual process management required"
    fi
}

setup_nginx() {
    if command -v nginx &> /dev/null; then
        log_info "Setting up Nginx configuration..."
        
        local nginx_config="/etc/nginx/sites-available/$PROJECT_NAME"
        
        sudo tee $nginx_config > /dev/null <<EOF
server {
    listen 80;
    server_name tributaai.com.br www.tributaai.com.br;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
EOF
        
        sudo ln -sf $nginx_config /etc/nginx/sites-enabled/
        sudo nginx -t
        sudo systemctl reload nginx
        
        log_success "Nginx configuration updated"
    else
        log_warning "Nginx not available. Manual reverse proxy setup required"
    fi
}

create_backup_script() {
    log_info "Creating backup script..."
    
    local backup_script="scripts/backup.sh"
    
    cat > $backup_script <<'EOF'
#!/bin/bash

# Tributa.AI Backup Script
BACKUP_DIR="/var/backups/tributa-ai"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database (if PostgreSQL)
if command -v pg_dump &> /dev/null; then
    pg_dump $DATABASE_URL > $BACKUP_DIR/database_$TIMESTAMP.sql
fi

# Backup uploads directory
if [[ -d "uploads" ]]; then
    tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz uploads/
fi

# Backup logs
if [[ -d "logs" ]]; then
    tar -czf $BACKUP_DIR/logs_$TIMESTAMP.tar.gz logs/
fi

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
EOF
    
    chmod +x $backup_script
    
    # Add to crontab
    if command -v crontab &> /dev/null; then
        (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/$backup_script") | crontab -
        log_success "Backup script created and scheduled"
    else
        log_success "Backup script created (manual scheduling required)"
    fi
}

run_health_check() {
    log_info "Running health check..."
    
    # Start application in background for testing
    npm start &
    local app_pid=$!
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_error "Health check failed"
        kill $app_pid 2>/dev/null || true
        exit 1
    fi
    
    # Stop test instance
    kill $app_pid 2>/dev/null || true
    sleep 2
}

main() {
    log_info "Starting Tributa.AI deployment process..."
    
    # Run all deployment steps
    check_prerequisites
    check_environment
    install_dependencies
    run_security_checks
    run_tests
    build_application
    setup_production_environment
    create_systemd_service
    setup_nginx
    create_backup_script
    run_health_check
    
    log_success "Deployment completed successfully!"
    log_info "To start the application:"
    log_info "  sudo systemctl start $PROJECT_NAME"
    log_info "  sudo systemctl status $PROJECT_NAME"
    log_info ""
    log_info "To view logs:"
    log_info "  sudo journalctl -u $PROJECT_NAME -f"
    log_info ""
    log_info "Health check URL: http://localhost:3000/api/health"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 