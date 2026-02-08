import { makeServer } from './server.js';

const PORT = process.env.PORT || 3001;
const server = makeServer();

server.listen(PORT, () => {
  console.log(`API is running on ${PORT}`);
});
