var koa = require('koa');
var path = require('path');
var staticServ = require('koa-static');
var router = require('./server/router');
var app = new koa();
const PORT = 3000

var client = staticServ(path.join(__dirname) + '/web');

app.use(router.routes());
app.use(client);

app.use(router.allowedMethods());

app.listen(PORT)
console.log('Server is running at ', PORT)
