
/*
 * GET home page.
 */
var crypto = require('crypto');

exports.index = function(req, res){
  res.render('index', { title: '首页' });
};

exports.user = function(req, res){
};

exports.post = function(req, res){
};

exports.reg = function(req, res){
  res.render('reg', { title: '用户注册' });
};

exports.doReg = function(req, res){
  console.log(req.body);
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  console.log(password);
  res.redirect('/reg');
};

exports.login = function(req, res){
};

exports.doLogin = function(req, res){
};

exports.logout = function(req, res){
};