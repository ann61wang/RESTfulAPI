'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

  exports.list_all_users = function(req, res) {
    User.find(function(err, usersInfo) {
      if (err)
        res.send(err);
      res.json(usersInfo);
    });
  };

  exports.create_a_user = function(req, res) {
    var new_user = new User(req.body);
    new_user.save(function(err, userInfo) {
      if (err)
        res.send(err);
      res.json(userInfo);
    });
  };

  exports.read_a_user = function(req, res) {
    User.findById(req.params.userId)
        .populate('tasks')
        .exec(function(err, userInfo) {
          if (err)
            res.send(err);

          if(req.session) {
            if (!req.session.time) {
              req.session.time = Date();
            }
            if(!req.session.uid) {
              req.session.uid = userInfo.id
            }
            if(!req.session.name) {
              req.session.name = userInfo.name
            }
          }
          res.json(userInfo);
        });
  };

  exports.logout = function(req, res) {
    req.session.cookie.maxAge=0;
    req.session.destroy()
    if(!req.session)
      res.json({ message: 'session successfully deleted' })
  };

  exports.update_a_user = function(req, res) {
    User.findById(req.params.userId, function(err, userInfo) {
      if (err)
        res.send(err);
      if(req.session.name == 'admin') {
        User.findOneAndUpdate({_id:req.params.userId}, req.body, {new: true}, function(err, userInfo) {
          if (err)
            res.send(err);
          res.json(uerInfo);
        });
      }else {
        res.json({message: '没有权限'});
      }
    });
  };

  // User.remove({}).exec(function(){});
  exports.delete_a_user = function(req, res) {
    User.findById(req.params.userId, function(err, userInfo) {
      if (err)
        res.send(err);
      if(req.session.name == 'admin') {
        User.remove({_id: req.params.userId}, function(err, userInfo) {
          if (err)
            res.send(err);
          req.session.cookie.maxAge=0;
          req.session.destroy();
          res.json({ message: 'User successfully deleted' });
        });
      }else {
        res.json({message: '没有权限'});
      }
    });
  };
