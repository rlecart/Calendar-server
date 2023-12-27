const options = require('./server/options.js');
const server = require('./server/server.js');

server.startServer(options).then((serverObj) => {
  console.log("server starting on port : " + options.back.port);
});