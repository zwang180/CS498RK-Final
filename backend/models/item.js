var mongoose = require('mongoose');
var schema = mongoose.Schema;

var itemSchema = new schema({
    name: { type: String, required: [true, 'An Item Name Is Required!'] },
    type: { type: String, enum: ['Top', 'Bottom', 'Coat', 'Shoes', 'Accessories'], required: [true, 'An Item Type Is Required!'] },
    year: { type: String },
    size: { type: String },
    material: { type: String} ,
    belongsTo: { type: String }
});

module.exports = mongoose.model('Item', itemSchema);
