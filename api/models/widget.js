var mongoose = require('mongoose')
var Schema = mongoose.Schema

const WidgetSchema = new Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  item: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Widget', WidgetSchema)
