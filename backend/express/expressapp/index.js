// index.js

console.log("INDEX: starting main server...");

try {
  require('./server');
} catch (err) {
  console.error("INDEX: Failed to start server.js");
  console.error(err);
}
