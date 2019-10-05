'use strict';

var mongoose = require('mongoose'),
  Category = mongoose.model('Category');

  exports.list_all_categories = function(req, res) {
    Category.find(function(err, categoriesInfo) {
      if (err)
        res.send(err);
      if(req.session.uid) {
        res.json({ret_code: 0, user: req.session.name, categories: categoriesInfo});
      }else {
        res.json({message: '未登陆状态', categories: categoriesInfo});
      }
    });
  };

  exports.create_a_category = function(req, res) {
    var new_category = new Category(req.body);
    new_category.save(function(err, categoryInfo) {
      if (err)
        res.send(err);
      res.json(categoryInfo);
    });
  };

  exports.read_a_category = function(req, res) {
    Category.findById(req.params.categoryId)
            .populate('tasks')
            .exec(function(err, categoriesInfo) {
              if (err)
                res.send(err);
              res.json(categoriesInfo);
            });
  };

  exports.update_a_category = function(req, res) {
    Category.findById(req.params.categoryId, function(err, categoriesInfo) {
      if (err)
        res.send(err);
      if(req.session.name == 'admin') {
        Category.findOneAndUpdate({_id:req.params.categoryId}, req.body, {new: true}, function(err, categoryInfo) {
          if (err)
            res.send(err);
          res.json(categoryInfo);
        });
      }else {
        res.json({message: '没有权限'});
      }
    });
  };

  // User.remove({}).exec(function(){});
  exports.delete_a_category = function(req, res) {
    Category.findById(req.params.categoryId, function(err, categoriesInfo) {
      if (err)
        res.send(err);
      if(req.session.name == 'admin') {
        Category.remove({_id: req.params.categoryId}, function(err, categoryInfo) {
          if (err)
            res.send(err);
          res.json({ message: 'Category successfully deleted' });
        });
      }else {
        res.json({message: '没有权限'});
      }
    });
  };
