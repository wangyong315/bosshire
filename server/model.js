const mongoose = require('mongoose');
// 链接mongo 并且使用imooc这个集合 
const DB_URL = 'mongodb://localhost:27017/bosshire';
mongoose.connect(DB_URL);
mongoose.connection.on('connected', function(){
    console.log('mongo has connect sucessly');
});