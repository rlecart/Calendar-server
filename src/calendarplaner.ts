import options from './server/options';
import * as server from './server/server';


server.startServer(options).then((_serverObj) => {
  console.log("server starting on port : " + options.back.port);
});