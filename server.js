'use strict';

import express from 'express';

const app = express();
app.use(express.static('./'));

function run(port) {
	app.listen(port, function () {
	  console.log(`p5 server started at http://localhost:${port}`);
  });
}

const server = {
	app: app,
	run: run
}

export default server;