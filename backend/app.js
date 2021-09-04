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
const expressSanitizer = require('express-sanitizer')
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
    res.setHeader('Access-Control-Allow-Credentials', true);

    // res.setHeader("Content-Security-Policy", "default-src 'self' https://use.fontawesome.com  ; script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    next();
})

app.use(bodyParser.json());

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    "default-src": ["'self'", "https://fonts.gstatic.com/", "https://use.fontawesome.com", "https://fonts.googleapis.com", "*"],
    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    "style-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "fonts.googleapis.com", "use.fontawesome.com"],
    "font-src": ["https://fonts.gstatic.com/", "https://use.fontawesome.com"]
  },
}));
app.use(cors());
app.use(limiter);
app.use (expressSanitizer());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.static(__dirname + '/public'))

// handle Angular as entry point
app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));

module.exports = app;