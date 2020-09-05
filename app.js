const Koa = require('koa');
const cors = require('@koa/cors');
const kr = require('koa-route');
const {getAllFeeds} = require('./index.js');

const app = new Koa();
app.use(cors());

app.use(kr.get('/trains', async ctx => {
  const feeds = await getAllFeeds();
  ctx.body = feeds;
}));


const port = 3000;
app.listen(port);
console.log(`Listening on port ${port}`);
