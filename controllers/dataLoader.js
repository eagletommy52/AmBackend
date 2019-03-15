const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(()=>console.log('MongoDB Connected'))
  .catch(err=>{console.log(err)})

const csv=require('csvtojson');
const path = require('path');
const Invite = require('../models/Invite');
const Attendee = require('../models/Attendee');
const Table = require('../models/Table');
const csvFilePath = path.join(__dirname,'../data','input.csv')

console.log(csvFilePath)

csv()
.fromFile(csvFilePath)
.then((inviteList)=>{
    const aInvites = inviteList.filter(invite=>{return invite.Family && invite.Name && invite.Cat == 'A'})
    console.log('Starting to iterate through the invites...')
    aInvites.map(invite=>{
      let {Title1, FirstName1, LastName1, Guests, FirstName2, LastName2, Title2, Address, Address2, City, State, Zipcode, code, CustomMsg} = invite;
      let allAttendees = []
      //console.log(FirstName1 + ' ' + LastName1);
      //Create the Main/first attendee for the invite
      const attendee1 = new Attendee(
        {title: Title1,
        firstName: FirstName1,
        lastName: LastName1,
        amendedName: `${Title1} ${FirstName1} ${LastName1}`})
      attendee1.save()
        .then(attend1=>{
          allAttendees.push(attend1._id)
          //check if the invite is allocated more than one guest
      if(Guests>1){
        //check if we have a name for the second guest
        if(FirstName2){
          const attendee2 = new Attendee(
            {title: Title2,
            firstName: FirstName2,
            lastName: LastName2||LastName1,
            amendedName: `${Title2} ${FirstName2} ${LastName2||LastName1}`,})
          attendee2.save();
          allAttendees.push(attendee2._id)
          Guests--;
        } 
        for(let i = 1; i < Guests; i++) {
          let attendee = new Attendee(
            {firstName: `Guest`,
            lastName: '',
            amendedName: `${LastName1} Guest ${i}`,})
          attendee.save();
          allAttendees.push(attendee._id)
        }
      }  
      const newInvite = new Invite({
        code,
        address: Address + Address2,
        city: City,
        state: State,
        zipcode: Zipcode,
        attendeesAuth: invite.Guests,
        attendees: allAttendees,
        customMsg: CustomMsg,
      })
      newInvite.save()
        .then(result=>console.log('saved an invite to db'))
        .catch(err=>console.log('there was the following error: ', err))
        })
    }) 
    console.log('Finished!')
})