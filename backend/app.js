const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
// pour une protection api
const helmet = require('helmet')

const app = express();
app.use(helmet());

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://lekhanhchi:Elisekhanh1984@cluster0.k0wlm.mongodb.net/projet6?retryWrites=true&w=majority',
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

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;