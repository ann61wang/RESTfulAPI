'use strict';
var Events = require('events');
var todoList = require('../todoList');
var mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  User = mongoose.model('User'),
  Category = mongoose.model('Category');

exports.list_all_tasks = function(req, res) {
  if(req.query.keyword) {
    let event = new Events.EventEmitter();
    let keyword= req.query.keyword;
    let result = [];
    event.on('add', function(task) {
      result.push(task);
    });
    Task.find()
        .populate('category')
        .exec(function(err, tasks) {
          if (err)
            res.send(err);

          tasks.forEach((task) => {
            if(task.title.indexOf(keyword)>-1 ||
               task.desc.indexOf(keyword)>-1 ||
               task.author.indexOf(keyword)>-1 ||
               task.category.name.indexOf(keyword)>-1
            ) {
              event.emit('add', task);
            }else {
              for(let i in task.listMessage) {
                if(task.listMessage[i].content.indexOf(keyword)>-1) {
                  event.emit('add', task);
                  return;
                }
              }
            }
          });
          res.json(result);
        });
  }else if(req.query.trending || req.query.new) {
    if(req.query.trending) {
      //从大到小排列，取九个
      Task.find({}).sort({'likes': -1}).limit(9).exec(function(err, tasks) {
        if (err)
          res.send(err);
        res.json(tasks);
      });
    }
    if(req.query.new) {
      //从最新开始排列，取九个
      Task.find({}).sort({'Created_date': -1}).limit(9).exec(function(err, tasks) {
        if (err)
          res.send(err);
        res.json(tasks);
      });
    }
  }else if(req.query.category) {
    Task.find({category: req.query.category}).sort({'likes': -1}).limit(3).exec(function(err, tasks) {
      if (err)
        res.send(err);
      res.json(tasks);
    });
  }else {
    Task.find(function(err, tasks) {
      if (err)
        res.send(err);
      res.json(tasks);
    });
  }
};

exports.create_a_task = function(req, res) {
  if(!req.session.uid) {
    res.json({message: '请重新登陆'});
    return
  }
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    User.findById(task.author).update({_id: task.author},{$push: {tasks: task._id}}).exec()
    Category.findById(task.category).update({_id: task.category},{$push: {tasks: task._id}}).exec()

    res.json(task);
  });
};

exports.read_a_task = function(req, res, next) {
  if(!req.session.uid) {
    res.json({message: '请重新登陆'});
    return
  }
  const taskId = req.params.taskId;
  const uId = req.session.uid;

  if(req.query.like) {
    Task.findById(taskId)
        .populate(['author', 'category'])
        .then((task) => {
          if(task.likeUser.length) {
            task.isClickLike = (task.likeUser.indexOf(uId) > -1) ? true : false;
          }
          //为什么第一次点击数据更新失败？因为对数据库更新操作是异步的，所以会往下执行，所以console.log或者res.json会先执行，导致执行的是还没有更新好的值
          if(task.isClickLike) {
            todoList.decLike(taskId, uId, false);
          }else {
            todoList.incLike(taskId, uId, true);
          }
          res.json(task);
        })
        .catch(next)
  }else if(req.query.copy) {
    Promise.all([
      todoList.getTaskById(taskId), // 获取清单信息
      todoList.incCopy(taskId)// copy 加 1
    ])
      .then(function (result) {
        const task = result[0]
        res.json(task);
      })
      .catch(next)
  }else {
    Promise.all([
      todoList.getTaskById(taskId), // 获取清单信息
      todoList.incPv(taskId)// pv 加 1
    ])
      .then(function (result) {
        const task = result[0]
        if(task.likeUser.length) {
          task.isClickLike = (task.likeUser.indexOf(uId) > -1) ? true : false;
        }
        res.json(task);
      })
      .catch(next)
  }
};

exports.update_a_task = function(req, res) {
  if(!req.session.uid) {
    res.json({message: '请重新登陆'});
    return
  }
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    if(req.session.name == task.author) {
      Task.findOneAndUpdate({_id:req.params.taskId}, req.body, {new: true}, function(err, task) {
        if (err)
          res.send(err);
        if(task.lastCategory) {
          Category.findById(task.lastCategory).update({_id: task.lastCategory},{$pull: {tasks: task._id}}).exec()
        }
        Category.findById(task.category).update({_id: task.category},{$push: {tasks: task._id}}).exec()
        res.json(task);
      });
    }else {
      res.json({message: '没有权限'});
    }
  });
};
// Task.remove({}).exec(function(){});
exports.delete_a_task = function(req, res) {
  if(!req.session.uid) {
    res.json({message: '请重新登陆'});
    return
  }
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);

    if(req.session.name == task.author) {
      User.findById(task.author).update({_id: task.author},{$pull: {tasks: task._id}}).exec()
      Category.findById(task.category).update({_id: task.category},{$pull: {tasks: task._id}}).exec()
      Task.remove({_id: req.params.taskId}, function(err, task) {
        if (err)
          res.send(err);
        res.json({ message: 'Task successfully deleted' });
      });
    }else {
      res.json({message: '没有权限'});
    }

  });
};
