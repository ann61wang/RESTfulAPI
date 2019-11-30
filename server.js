var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'),
  User = require('./api/models/userInfoModel'),
  Category = require('./api/models/categoryModel'),
  bodyParser = require('body-parser'),
  cors = require('cors');
  session = require('express-session');
  MongoStore = require("connect-mongo")(session);

mongoose.Promise = global.Promise;

if(process.env.NODE_ENV == "production"){
    mongoose.connect('mongodb://wangjingru:3030790wjl@cluster0-shard-00-00-rxamc.mongodb.net/todoList?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', { useMongoClient: true })
            .then(()=>{
              console.log('MongoDB is connected');
            }).catch(err=>{
              console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
            });

    app.use(session({
        secret: 'billy',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({url:'mongodb://wangjingru:3030790wjl@cluster0-shard-00-00-rxamc.mongodb.net/todoList?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'}),
        cookie: {
            maxAge: 18000000
        },
    }));
}else{
    console.log('connected local MongoDB');
    mongoose.connect('mongodb://localhost/todoList', { useMongoClient: true });
    app.use(session({
        secret: 'billy',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({url:'mongodb://localhost/todoList'}),
        cookie: {
            maxAge: 18000000
        },
    }));
}


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



var routes = require('./api/routes/index');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
