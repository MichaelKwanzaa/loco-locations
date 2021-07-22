const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");

//routers
const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users');

const port = 8000;

const app = express();

//configurations
dotenv.config();
app.use(express.json());
app.use(cors());

//start of application
mongoose
.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
     useUnifiedTopology: true })
.then(() => {
    console.log("Connected to DB")
})
.catch((err) => {
    console.log(err);
})

app.use('/api/pins', pinRoute)
app.use('/api/users', userRoute)

app.listen(port, () => {
    console.log(`listening on http://localhost/${port}`);
})