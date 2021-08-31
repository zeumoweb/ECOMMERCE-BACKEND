// import the required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

// app
const app = express();

// Middlewares
app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser())
// routes middleware
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', categoryRoute)
app.use('/api', productRoute)

// database connection
mongoose.connect("mongodb://localhost/ecommerce", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, autoIndex: true });
const db = mongoose.connection
db.on('error', () => console.error('connection error'))
db.once('open', () => {
  console.log('connected')
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log('Listening to port', port);
})