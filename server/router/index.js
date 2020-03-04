var Router = require('koa-router');
var API = require('../api/interface.js');

// 登录相关
router = new Router();
router.get('/auth/login', API.login)

module.exports = router;