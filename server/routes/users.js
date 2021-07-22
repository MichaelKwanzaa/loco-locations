const router = require("express").Router(); 
const User = require("../models/User")
const bcrypt = require("bcrypt");

//register new user

router.post("/register", async (req, res) => {
    try{
        //generate a hashed/secured password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user with the hashedPassword
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user & send to db
        const user = await newUser.save();
        res.status(200).json(user._id)

    }catch(err){
        res.status(500).json(err);
    }
})

//login existing user
router.post("/login", async (req, res) => {
    try{
        //checking if the user passing in exists in mongodb
        const user = await User.findOne({email:req.body.email})
        //if not true, display wrong user & password (for security, don't tell user which one)
        !user && res.status(400).json("Wrong email or password");

        //if correct validate the password to see if it's true
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Wrong email or password");

        //send a valid message if no issue with either username or password
        res.status(200).json({ _id: user._id, username: user.username});

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router; 