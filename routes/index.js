
/*
 * GET home page.
 */
var myUtils = require('../myutils');
var User = require('../models/user.js');

exports.index = function(req, res){
  res.render('index', { title: '首页'});
};

exports.user = function(req, res){
  User.get(req.params.user, function(err, user){
    if(!user){
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Post.get(user.name, function(err,posts){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user',{
        title: user.name
        posts: posts;
      });
    });
  });
};

exports.post = function(req, res){
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err){
    if(err){
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发票成功');
    res.redirect('/u/' + currentUser.name);
  });
};

exports.reg = function(req, res){
  res.render('reg', { title: '用户注册' });
};

exports.doReg = function(req, res){
  console.log(req.body);
  //生成口令的散列值
  //var md5 = crypto.createHash('md5');
  var password = myUtils.getPassword(req.body.password);
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
  res.render('login', {title: '用户登入'});
};

exports.doLogin = function(req, res){
  var password = myUtils.getPassword(req.body.password);

  User.get(req.body.username, function(err, user) {
    if(!user){
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if(user.password != password) {
      req.flash('error', '用户口令错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/');
  });
};

exports.logout = function(req, res){
  req.session.user = null;
  req.flash('success', '登出成功');
  res.redirect('/');
};

exports.checkLogin = function(req, res, next) {
  if(!req.session.user){
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
};

exports.checkNotLogin = function(req, res, next){
  if(req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
};