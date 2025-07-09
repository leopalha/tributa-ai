const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <h1>Test Server Working!</h1>
        <p>Node.js ${process.version}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

const port = 3000;
server.listen(port, () => {
  console.log(`✅ Test server running on http://localhost:${port}`);
});

// Keep server alive
process.on('SIGINT', () => {
  console.log('\n👋 Server shutting down...');
  server.close(() => {
    process.exit(0);
  });
}); 