const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Map each entity to its JSON file
const dbFiles = {
  users: path.join(__dirname, 'users.json'),
  categories: path.join(__dirname, 'categories.json'),
  expenses: path.join(__dirname, 'expenses.json'),
  currencies: path.join(__dirname, 'currencies.json'),
  debtors: path.join(__dirname, 'debtors.json'),
  debts: path.join(__dirname, 'debts.json')
};

// Ensure all database files exist on disk
Object.entries(dbFiles).forEach(([key, filepath]) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify([], null, 2));
  }
});

// Helper to read all files and assemble a single in-memory database object
function readDb() {
  const db = {};
  Object.entries(dbFiles).forEach(([key, filepath]) => {
    try {
      db[key] = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (e) {
      db[key] = [];
    }
  });
  return db;
}

// Router interceptor for writing back data to the individual files
server.use((req, res, next) => {
  // Generate the database instance dynamically on each request
  const router = jsonServer.router(readDb());
  
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.on('finish', () => {
      const data = router.db.getState();
      Object.entries(dbFiles).forEach(([key, filepath]) => {
        try {
          fs.writeFileSync(filepath, JSON.stringify(data[key], null, 2));
        } catch (err) {
          console.error(`Failed to write database file for ${key}:`, err);
        }
      });
    });
  }

  router(req, res, next);
});

const os = require('os');
const PORT = process.env.PORT || 5000;

// Find local IPv4 address
const nets = os.networkInterfaces();
let localIp = 'localhost';
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      break;
    }
  }
}

server.listen(PORT, () => {
  console.log(`JSON Server is running at: http://${localIp}:${PORT}`);
  console.log(`JSON Server also listening on: http://localhost:${PORT}`);
  console.log('Database split into individual files in db/:');
  Object.entries(dbFiles).forEach(([key, file]) => {
    console.log(`  - ${key} -> ${path.basename(file)}`);
  });
});
