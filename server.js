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
    mongoose.connect('mongodb://wangjingru:3030790wjl@cluster0-rxamc.mongodb.net/admin?retryWrites=true&w=majority', { useMongoClient: true })
            .then(()=>{
              console.log('MongoDB is connected')
            }).catch(err=>{
              console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
              console.log(err)
            });
}else{
    mongoose.connect('mongodb://wangjingru:3030790wjl@cluster0-rxamc.mongodb.net/admin?retryWrites=true&w=majority', { useMongoClient: true });
}



app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'billy',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({url:'mongodb://localhost/my_web_session'}),
    cookie: {
        maxAge: 18000000
    },
}));

var routes = require('./api/routes/index');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
