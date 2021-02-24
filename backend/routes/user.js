const express = require('express');
const router = express.Router();

const ExpressBrute = require('express-brute'); // contre attaque force-brute
const store = new ExpressBrute.MemoryStore(); //===> Stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);

const userCtrl = require('../controller/user');

const bodyParser = require('body-parser');// validator pour formulaire signup
const jsonParser = bodyParser.json();
const {check, valideResult} = require('express-validator'); 
router.post('/signup', jsonParser, [
    check ('email', 'Email is not valid')
        .isEmail()
        .bail()
        .normalizeEmail(),
    check('password', 'Password must be +8 characters long')
        .isLength({min: 8})
        .isLowercase({min:1})
        .isUppercase({min: 1})
        .isStrongPassword()
        
], (req, res) => {
    const errors = valideResult(req)
    if(!errors.isEmpty()) { 
        const alert = errors.array();
        res.render('/signup', {alert})
    }
    else{ userCtrl.signup}
})

// router.post('/signup', userCtrl.signup);
router.post('/login', bruteforce.prevent, userCtrl.login);

module.exports = router