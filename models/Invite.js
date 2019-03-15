const mongoose = require('mongoose');
const { format } = require('date-fns');
const now = Date.now();

const InviteSchema = new mongoose.Schema({
  code: {type: String, unique:true},
  address: {type: String, default: ''},
  city: String,
  state: String,
  zipcode: String,
  phone: String,
  customMsg: String,
  attendeesAuth: {type: Number, default: 1},
  attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'Attendee'}],
  responded: {type: Boolean, default: false},
  timestamp: { type: String, default: format(now, 'dddd, MMMM, do YYYY, h:mm:ss a') },
})

module.exports = mongoose.model('Invite', InviteSchema)