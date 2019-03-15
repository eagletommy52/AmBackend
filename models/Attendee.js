const mongoose = require('mongoose');
const { format } = require('date-fns');
const now = Date.now();

const AttendeeSchema = new mongoose.Schema({
  title: {type:String, trim:true},
  firstName: {type:String, trim:true},
  lastName: {type:String, trim:true},
  amendedName: {type: String, default: ''},
  attending: {type: Boolean, default: true},
  table: {type: mongoose.Schema.Types.ObjectId, ref:'Table'},
  timestamp: { type: String, default: format(now, 'dddd, MMMM, do YYYY, h:mm:ss a') },
})

module.exports = mongoose.model('Attendee', AttendeeSchema)