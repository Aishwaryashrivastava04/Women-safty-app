
const http = require('http');
const PORT = process.env.PORT || 3000;

const users = {};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const path = req.url;

  if (path === '/api' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: "Backend is working 💚" }));
    return;
  }

  if (path === '/users/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, email, password } = JSON.parse(body);
        if (!email || !password) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: "Missing email/password" }));
          return;
        }
        if (users[email]) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: "Email already exists" }));
          return;
        }
        users[email] = { name: name || "User", email, password };
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, message: "Registered successfully", user: { name, email } }));
      } catch(e) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: e.message }));
      }
    });
    return;
  }

  if (path === '/users/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        if (!email || !password) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: "Missing email/password" }));
          return;
        }
        const user = users[email];
        if (!user) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: "User not found" }));
          return;
        }
        if (user.password !== password) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: "Wrong password" }));
          return;
        }
        const token = Buffer.from(email + ":" + Date.now()).toString('base64');
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: "Login successful", token, user: { name: user.name, email } }));
      } catch(e) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 Server listening on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});
