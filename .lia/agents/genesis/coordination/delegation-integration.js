/**
 * 🤖 GENESIS DELEGATION INTEGRATION SYSTEM
 * Sistema que integra as delegações LIA com GENESIS Local autonomous
 */

const fs = require('fs');
const path = require('path');

class DelegationIntegration {
    constructor() {
        this.genesisPath = __dirname + '/..';
        this.coordinationPath = path.join(this.genesisPath, 'coordination');
        this.tasksPath = path.join(this.genesisPath, 'tasks');
        this.statusPath = path.join(this.genesisPath, 'status');

        this.delegationConfig = null;
        this.autoCoordConfig = null;
        this.lastProcessed = null;

        this.initializeDelegationSystem();
    }

    initializeDelegationSystem() {
        console.log('🧠 LIA DELEGATION SYSTEM: Initializing integration with GENESIS Local...');

        // Load delegation configuration
        this.loadDelegationConfig();
        this.loadAutoCoordinationConfig();

        // Process pending delegations
        this.processPendingDelegations();

        // Setup monitoring
        this.setupDelegationMonitoring();

        console.log('✅ LIA DELEGATION SYSTEM: Integration complete, monitoring active');
    }

    loadDelegationConfig() {
        try {
            const configPath = path.join(this.coordinationPath, 'task-delegation.json');
            this.delegationConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log(`📋 Loaded ${Object.keys(this.delegationConfig.critical_tasks).length} critical tasks for delegation`);
        } catch (error) {
            console.error('❌ Failed to load delegation config:', error.message);
        }
    }

    loadAutoCoordinationConfig() {
        try {
            const configPath = path.join(this.coordinationPath, 'auto-coordination-config.json');
            this.autoCoordConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log('🤖 Auto-coordination system configured');
        } catch (error) {
            console.error('❌ Failed to load auto-coordination config:', error.message);
        }
    }

    processPendingDelegations() {
        if (!this.delegationConfig) {
            console.log('⚠️ No delegation config available');
            return;
        }

        console.log('🎯 Processing critical task delegations...');

        const tasks = this.delegationConfig.critical_tasks;
        const prioritySequence = this.delegationConfig.priority_sequence;

        // Process each task in priority order
        prioritySequence.forEach((taskId, index) => {
            const task = tasks[taskId];
            if (task && task.auto_start) {
                this.createTaskDelegation(taskId, task, index);
            }
        });

        this.updateCoordinationStatus();
    }

    createTaskDelegation(taskId, task, priority) {
        const delegation = {
            id: taskId,
            title: task.title,
            agent: task.agent,
            priority: task.priority,
            description: task.description,
            files: task.files,
            estimated_time: task.estimated_time,
            success_criteria: task.success_criteria,
            business_impact: task.business_impact,
            validation_steps: task.validation_steps,
            dependencies: task.dependencies || [],
            status: 'delegated',
            delegated_at: new Date().toISOString(),
            delegated_by: 'LIA_COORDINATOR',
            auto_execution: true,
            coordination_mode: this.delegationConfig.coordination_mode
        };

        // Create task file for GENESIS to process
        const taskFilePath = path.join(this.tasksPath, `${taskId}-delegation.json`);
        fs.writeFileSync(taskFilePath, JSON.stringify(delegation, null, 2));

        console.log(`📋 ${task.agent}: Delegated ${taskId} - ${task.title}`);
        console.log(`   🎯 Priority: ${task.priority}`);
        console.log(`   ⏰ Estimated: ${task.estimated_time}`);
        console.log(`   💼 Impact: ${task.business_impact}`);
    }

    updateCoordinationStatus() {
        const status = {
            delegation_system_active: true,
            last_delegation_run: new Date().toISOString(),
            tasks_delegated: Object.keys(this.delegationConfig.critical_tasks).length,
            coordination_mode: this.delegationConfig.coordination_mode,
            mission: this.delegationConfig.mission,
            business_objectives: this.delegationConfig.business_objectives,
            success_tracking: {
                tasks_pending: Object.keys(this.delegationConfig.critical_tasks).length,
                tasks_in_progress: 0,
                tasks_completed: 0,
                estimated_completion: '6-8 hours',
                next_milestone: 'EXECUTOR_001 completion'
            }
        };

        const statusPath = path.join(this.coordinationPath, 'delegation-status-live.json');
        fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));

        console.log('📊 Coordination status updated');
    }

    setupDelegationMonitoring() {
        console.log('👁️ Setting up delegation monitoring...');

        // Monitor task completion
        const monitorInterval = setInterval(() => {
            this.monitorTaskProgress();
        }, 30000); // Check every 30 seconds

        // Monitor GENESIS status
        this.monitorGenesisStatus();
    }

    monitorTaskProgress() {
        // Check for completed tasks
        const taskFiles = fs.readdirSync(this.tasksPath).filter(f => f.endsWith('-delegation.json'));

        taskFiles.forEach(taskFile => {
            const taskPath = path.join(this.tasksPath, taskFile);
            try {
                const task = JSON.parse(fs.readFileSync(taskPath, 'utf8'));

                // Check if task status changed
                if (task.status !== this.lastProcessed?.[task.id]?.status) {
                    console.log(`📈 ${task.agent}: ${task.id} status changed to ${task.status}`);
                    this.reportTaskProgress(task);
                }
            } catch (error) {
                console.error(`❌ Error monitoring task ${taskFile}:`, error.message);
            }
        });
    }

    monitorGenesisStatus() {
        const statusFile = path.join(this.statusPath, 'genesis-status.json');

        if (fs.existsSync(statusFile)) {
            try {
                const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
                console.log(`🤖 GENESIS Status: ${status.status} - ${status.message}`);
                console.log(`📊 Tasks Completed: ${status.executionStats.tasksCompleted}`);
            } catch (error) {
                console.error('❌ Error reading GENESIS status:', error.message);
            }
        }
    }

    reportTaskProgress(task) {
        const report = {
            timestamp: new Date().toISOString(),
            agent: task.agent,
            task_id: task.id,
            task_title: task.title,
            status: task.status,
            progress: task.progress || 'unknown',
            business_impact: task.business_impact,
            next_action: task.next_action || 'continuing execution'
        };

        console.log('📋 TASK PROGRESS REPORT:');
        console.log(`   🤖 Agent: ${report.agent}`);
        console.log(`   📝 Task: ${report.task_title}`);
        console.log(`   📊 Status: ${report.status}`);
        console.log(`   💼 Impact: ${report.business_impact}`);

        // Save progress report
        const reportPath = path.join(this.genesisPath, 'reports', `progress-${task.id}-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    }

    // Method for LIA to get real-time status
    getCurrentDelegationStatus() {
        const taskFiles = fs.readdirSync(this.tasksPath).filter(f => f.endsWith('-delegation.json'));
        const activeAgents = {};

        taskFiles.forEach(taskFile => {
            try {
                const task = JSON.parse(fs.readFileSync(path.join(this.tasksPath, taskFile), 'utf8'));
                if (!activeAgents[task.agent]) {
                    activeAgents[task.agent] = [];
                }
                activeAgents[task.agent].push({
                    id: task.id,
                    title: task.title,
                    status: task.status,
                    priority: task.priority
                });
            } catch (error) {
                console.error(`Error reading task ${taskFile}:`, error.message);
            }
        });

        return {
            system_status: 'ACTIVE',
            delegation_mode: this.delegationConfig?.coordination_mode || 'UNKNOWN',
            active_agents: Object.keys(activeAgents),
            task_distribution: activeAgents,
            last_update: new Date().toISOString()
        };
    }
}

// Auto-initialize if run directly
if (require.main === module) {
    console.log('🧠 LIA v4.1 DELEGATION INTEGRATION SYSTEM');
    console.log('🚀 Initializing delegation system...');

    const delegationSystem = new DelegationIntegration();

    // Keep monitoring active
    console.log('👁️ Delegation monitoring active. Press Ctrl+C to stop.');

    process.on('SIGINT', () => {
        console.log('\n🛑 Delegation system shutting down...');
        process.exit(0);
    });
}

module.exports = DelegationIntegration;