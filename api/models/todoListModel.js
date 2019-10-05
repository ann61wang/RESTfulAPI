'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  imgSrc: {
    type: String
  },
  imgAlt: {
    type: String
  },
  title: {
    type: String,
    Required: 'Kindly enter the title of the task'
  },
  desc: {
    type: String
  },
  isNumMaker: {
    type: Boolean,
    Required: 'Judge label type'
  },
  listMessage: {
    type: Object,
    Required: 'Kindly enter the message of the task'
  },
  author: {
    type: String,
    ref: 'User'
  },
  category: {
    type: String,
    ref: 'Category'
  },
  lastCategory: {
    type: 'String'
  },
  likes: {
    type: Number,
    default: 0
  },
  isClickLike: {
    type: Boolean,
    default: false,
    Require: 'Judge user like this task'
  },
  likeUser: {
    type: Array
  },
  copy: {
    type: Number,
    default: 0
  },
  pv: {
    type: Number,
    default: 0
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Task', TaskSchema);
