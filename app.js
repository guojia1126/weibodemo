
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      db: settings.db
    })
  }));
  //app.use(express.router(routes));
  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    console.log('error==='+req.session.error);
    res.locals.error = req.session.error;
    console.log('success==='+req.session.success);
    res.locals.success = req.session.success;
    next();
    console.log(res.locals.user+"/"+res.locals.error+"/"+res.locals.success);
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



/*app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  },
  error: function(req, res) {
    // var err = req.flash('error');
    if(err.length)
      return err;
    else
      return null;
  },
  success: function(req, res) {
    // var succ = req.flash('success');
    if(succ.length)
      return succ;
    else
      return null;
  }
});*/

app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
