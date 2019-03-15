const Invite = require('../models/Invite');
const Attendee = require('../models/Attendee');

module.exports = {
  retrieveInvite: query => {
    return new Promise((resolve, reject) => {

      let { invite } = query;
      //do request validation
      if (invite==='undefined') {
        reject("Please input a code below:");
      }
      invite = invite.replace(/1/g, 'I').replace(/0/g, 'O').toUpperCase();
      console.log(invite)
      
      Invite.findOne({code:invite}).populate('attendees')
        .then(result=>{
          console.log('result', result)
          if(!result){
            reject(`No record of invite code ${invite}, please recheck it and try again below...`)
          }
          resolve(result)})
        .catch(err=>reject("Something is wrong with the server"))
      
    });
  }, 
  respondInvite: invite => {
    return new Promise((resolve, reject) => {
      const {_id, phone, attendees} = invite;
      attendees.map(attendee=>{
        Attendee.findById(attendee._id)
          .then(retrievedAttendee=>{
            retrievedAttendee.attending = attendee.attending;
            retrievedAttendee.amendedName = attendee.amendedName;
            retrievedAttendee.save()
            .catch(err=>reject(err))
          })
          .catch(err=>reject(err))
      })
      Invite.findById(_id)
        .then( retrievedInvite =>{
          retrievedInvite.phone = phone;
          retrievedInvite.responded = true;
          retrievedInvite.save()
            .then(result=>{
              resolve({msg:'success'})
            })
            .catch(err=>reject(err))
        })
    }) 
  }
};
  