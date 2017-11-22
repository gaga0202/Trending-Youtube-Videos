var mongoose = require('mongoose');
var videoSchema = mongoose.Schema({
  videoId:            { type: String, unique: true, required: true },
  title:              { type: String },
  description:        { type: String },
  channelId:          { type: String },
  channelTitle:       { type: String },
  duration:           { type: Number },
  thumbnailUrl:       { type: String },
  timePublished:      { type: Date },
  reactions:          {
    likes:            { type: Number, default: 0 },
    dislikes:         { type: Number, default: 0 },
  },
  views:              { type: Number, default: 0 },
});

module.exports = mongoose.model('Video', videoSchema, 'Videos');