const router = require("express").Router(); 
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
    const newPin = new Pin(req.body);
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err)
    }
})


//add a like
router.put("/:id/like", async (req, res) => {
    try{
        const pin = await Pin.findById(req.params.id);
        if(!pin.likes.includes(req.body.username)){
            await pin.updateOne({$push : {likes: req.body.username}});
            res.status(200).json("Location liked updated")
        } else {
            await pin.updateOne({$pull : {likes: req.body.username}});
            res.status(200).json("Location liked updated")
        }
    }catch(err){
        res.status(500).json(err)
    }

})



//get all pins  
router.get("/", async (req, res) => {
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch(err){
        res.status(500).json(err);
    }
})




module.exports = router;