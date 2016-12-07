var mongoose = require('mongoose');
var schema = mongoose.Schema;

var reviewSchema = new schema({
  content: { type: String, required: [true, 'Please Write Your Comment'] },
  user: { type: String, default: 'Anonymous' },
  dateCreated: { type: Date, default: Date.now },
  belongsTo: { type: String, required: [true, 'You Need To Be A User To Review'] },
  like: { type: Number, default: 0 }
});

module.exports = mongoose.model('Review', reviewSchema);
