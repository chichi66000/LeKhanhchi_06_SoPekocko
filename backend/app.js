const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// pour une protection api
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});
require('dotenv').config(); // load .env file pour garder secret les infos confidentiels

const app = express();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.MGD_URI,
 {useNewUrlParser:true,
  useUnifiedTopology:true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error =>console.log(error));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
    next();
})

app.use(bodyParser.json());

app.use(helmet());
app.use(cors({origin: 'http://localhost:4200'}));
app.use(limiter);

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;