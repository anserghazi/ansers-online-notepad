const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;


const routes = require('./routes/api');


require('dotenv').config();
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB database connection established successfully!');
})


// Middleware that parses incoming json 
app.use(express.json());
app.use(express.urlencoded({extended: false}));



// HTTP request logger
app.use(morgan('tiny'));

app.use('/api', routes);



app.use(express.static('client/build'));



app.listen(PORT, console.log(`Server is running at ${PORT}`));