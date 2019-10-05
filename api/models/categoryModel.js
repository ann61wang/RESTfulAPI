'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sequence = require('../sequence');

var CategoryInfo = new Schema({
  _id: {
    type: String,
    Required: 'unique ID'
  },
  id: {
    type: Number,
    index: { unique: true }
  },
  name: {
    type: String,
    Required: 'name of category'
  },
  imageUrl: {
    type: String,
    Required: 'imageUrl of category'
  },
  imageAlt: {
    type: String,
    Required: 'imageAlt of category'
  },
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
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


CategoryInfo.pre('save', function(next) {
  var self = this;
  if( self.isNew ) {
    Sequence.increment('Category',function (err, result) {
      if (err)
        throw err;
      self.id = result.value.next;
      next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('Category', CategoryInfo);
