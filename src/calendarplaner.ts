import * as server from './server/server';

import options from './server/options';

server.startServer(options).then((_serverObj) => {
  console.log("server starting on port : " + options.back.port);
});