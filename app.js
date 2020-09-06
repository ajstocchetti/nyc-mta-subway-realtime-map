const Koa = require('koa');
const cors = require('@koa/cors');
const kr = require('koa-route');
const serve = require('koa-static');
const {getAllFeeds} = require('./subway-lookup.js');



const app = new Koa();
app.use(cors());

// static files
app.use(serve('./ui'));

app.use(kr.get('/trains', async ctx => {
  const feeds = await getAllFeeds();
  ctx.body = feeds;
}));


const port = 3000;
app.listen(port);
console.log(`Listening on port ${port}`);
