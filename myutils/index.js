var crypto = require('crypto');

exports.getPassword = function(password){
	//生成口令的散列值
	md5 = crypto.createHash('md5');
	return md5.update(password).digest('base64');
};