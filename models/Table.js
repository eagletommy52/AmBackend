const mongoose = require('mongoose');
const { format } = require('date-fns');
const now = Date.now();

const TableSchema = new mongoose.Schema({
  tableNo: {type: Number, required:true, unique:true},
  attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'Attendee'}],
  timestamp: { type: String, default: format(now, 'dddd, MMMM, do YYYY, h:mm:ss a') },
})

module.exports = mongoose.model('Table', TableSchema)