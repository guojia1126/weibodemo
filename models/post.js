var mongodb = require('./db');

function Post(username, post, time) {
  this.user = username;
  this.post = post;
  if(time) {
    this.time = time;
  }else{
    this.time = new Date();
  }
}
module.exports = Post;

Post.prototype.save = function save(callback) {
  // 存入 Mongodb 的文档
  var post = {
    user: this.user,
    post: this.post,
    time: this.time
  };
  mongodb.open(function(err, db){
    if(err) {
      return callback(err);
    }
    // 读取 posts 集合
    db.collection('posts', function(err, collection) {
      if(err) {
        db.close();
        return callback(err);
      }
      // 为 user 属性添加索引
      collection.ensureIndex('user', {unique: true});
      // 写入 post 文档
      collection.insert(post, {safe: true}, function(err, user) {
        db.close();
        console.log('post saved');
        callback(err, post);
      });
    });
  });
};

Post.get = function get(username, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err);
    }
    // 读取 posts 集合
    db.collection('posts', function(err, collection) {
      if(err) {
        db.close();
        return callback(err);
      }
      // 查找 user 属性为username 的文档,如果 username 是 null 则匹配全部
      var query = {};
      if(username) {
        query.user = username;
      }
      collection.find(query).sort({time: -1}).toArray(function (err, docs) {
        db.close();
        if (err){
          callback(err, null);
        }
        //封装posts 为 Post 对象
        var posts = [];
        docs.forEach(function(doc, index){
          var post = new Post(doc.user, doc.post, doc.time);
          posts.push(post);
        });
        callback(err, posts);
      });
    });
  });
};
