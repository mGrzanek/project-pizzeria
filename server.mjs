import path from 'path';
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router(path.join('docs', 'db', 'app.json'));
const middlewares = jsonServer.defaults({
  static: 'docs',
  noCors: true
});
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3131;

server.use(middlewares);
server.use(router);

server.listen(port);

export default server;