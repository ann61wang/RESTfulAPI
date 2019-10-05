'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Sequence = require('../sequence');

var UserInfo = new Schema({
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
    Required: 'Kindly upload name'
  },
  pass: {
    type: String,
    Required: 'Kindly upload pass'
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


UserInfo.pre('save', function(next) {
  var self = this;
  if( self.isNew ) {
    Sequence.increment('User',function (err, result) {
      if (err)
        throw err;
      self.id = result.value.next;
      next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('User', UserInfo);
