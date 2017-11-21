var mongoose = require('mongoose');
var videoSchema = mongoose.Schema({
  videoId:            { type: String, unique: true, required: true },
  title:              { type: String },
  description:        { type: String },
  channelId:          { type: String },
  channelName:        { type: String },
  duration:           { type: Number },
  thumbnailUrl:       { type: String },
  timePublished:      { type: Date },
  reaction:           {
    like:             { type: Number, default: 0 },
    dislike:          { type: Number, default: 0 },
  },
  views:              { type: Number, default: 0 },
  trendNo:            { type: Number },
});

module.exports = mongoose.model('Video', videoSchema, 'Videos');