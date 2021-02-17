const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controller/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer_config')


// récupérer tous les sauces 
router.get('/',auth, multer, sauceCtrl.getAllSauces)

// récupérer une sauce particulière
router.get('/:id',auth, multer, sauceCtrl.getOneSauce)

// enregistrer nouvelle sauce

router.post('/',auth, multer, sauceCtrl.createSauce )

// modifier une sauce
router.put('/:id',auth, multer, sauceCtrl.modifySauce);


//supprimer une sauce avec id fourni
router.delete('/:id',auth, multer, sauceCtrl.deleteSauce);

// liked ou disliked une sauce
router.post('/:id/like',auth, sauceCtrl.likeSauce);


module.exports = router;