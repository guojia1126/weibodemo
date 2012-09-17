
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js');

exports.index = function(req, res){
  res.render('index', { title: '首页'});
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
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  console.log(password);
  var newUser = new User({
    name: req.body.username,
    password: password
  });

  //检查用户名是否已经存在了
  User.get(newUser.name, function(err, user) {
    if(user)
      err = 'Username already exists.';
    if(err){
      req.flash('error', err);
      //req.session.error = err;
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save(function(err){
      if(err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功');
      //req.session.success = '注册成功';
      res.redirect('/');
    });
  });
};

exports.login = function(req, res){
};

exports.doLogin = function(req, res){
};

exports.logout = function(req, res){
};