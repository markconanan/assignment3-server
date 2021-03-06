const express = require ('express');
const router = express.Router();
const Unit = require('../models/unit');
const Program = require('../models/program')
const User = require('../models/user')
const {requireJwt} = require('../middleware/auth')


// GET /units (R)
router.get('/', (req, res, next) => {
  //this will return all the data
  Unit.find({})
    .then(data => res.json(data))
    .catch(next)
});

router.get('/myUnit',requireJwt ,async(req, res) => {
  //this will return one data, exposing only the id and important fields to the client
  try {
    const unit = await Unit.findById(req.user.unit)
    if (!unit) res.status(404).json({error: "Error Unit ID not found"})
    const programs = await Program.find({unit})
    const users = await User.find({unit})
    res.json({unit,programs,users})
  }
  catch(error) { res.json({error}) }  
});

// Only allow registered users to post and delete units
// router.use(requireJwt)

// POST /units (C)
router.post('/', (req, res, next) => {
  if(req.body){
    Unit.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: "You need to write something here." // input field is empty
    })
  }
});

// router.post('/:id/addUser/', requireJwt, async (req, res) => {
  
//   const addUserToUnit = await Unit.findByIdAndUpdate(
//     req.params.id, 
//     {$addToSet: {users: req.user._id}}, // addToSet adds an element to a field
//     {new: true} // setting to return the updated property
//     )
//   if (!addUserToUnit) res.status(404).json({
//     error: "Unit Id not found"
//   })
//   res.json(addUserToUnit)
// })


// DELETE /units/:id (D)
router.delete('/:id', (req, res, next) => {
  Unit.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;
