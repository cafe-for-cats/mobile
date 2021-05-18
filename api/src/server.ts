import { createServer, IncomingMessage, ServerResponse } from 'http';
import app from './app';
const { port } = require('./config');

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server started on port ${port} 🖥️`);
});
