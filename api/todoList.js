var mongoose = require('mongoose');
var Task = mongoose.model('Task');

module.exports = {
  getTaskById: function getTaskById (taskId) {
    return Task
      .findById({ _id: taskId })
      .populate(['author', 'category'])
      .exec()
  },

  incPv: function incPv (taskId) {
    return Task
      .update({ _id: taskId }, { $inc: { pv: 1 } })
      .exec()
  },

  incLike: function incLike (taskId, value, bool) {
    return Task
      .update({ _id: taskId }, { $inc: { likes: 1 }, $push: { likeUser: value }, isClickLike: bool })
      .exec()
  },

  decLike: function decLike (taskId, value, bool) {
    return Task
      .update({ _id: taskId }, { $inc: { likes: -1 }, $pull: { likeUser: value }, isClickLike: bool })
      .exec()
  },

  incCopy: function incCopy (taskId) {
    return Task
      .update({ _id: taskId }, { $inc: { copy: 1 } })
      .exec()
  }
}
