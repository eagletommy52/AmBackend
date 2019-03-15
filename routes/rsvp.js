const router = require('express').Router();
const rsvpController = require('../controllers/rsvpController');
router.get('/', (req, res)=>{
  res.json({"Message":"Andrew Marries Beth!"})
})
router.get('/retrieveInvite', (req, res)=>{
  rsvpController.retrieveInvite(req.query)
    .then(result=>{
      res.json(result)
    })
    .catch(err=>{
      res.json({"error": err})
    })
})

router.post('/respondInvite', (req, res)=>{
  rsvpController.respondInvite(req.body)
    .then(result=>{
      res.json(result)
    })
    .catch(err=>{
      res.json({"error": err})
    })
})  
module.exports = router;