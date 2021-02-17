const Sauce = require('../models/sauce');
const fs = require('fs');

// récupérer tous les sauces 
exports.getAllSauces =  (req, res, next) => {
    Sauce.find()
        .then( sauces => res.status(200).json({sauces}))
        .catch(error =>  res.status(404).json({error}))
};

// enregistrer nouvelle sauce
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauce = new Sauce({
        // userId: req.params.userId,
        // name: req.body.name,
        // manufacturer: req.body.manufacturer,
        // description: req.body.description,
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // mainPepper : req.body.mainPepper,
        // heat: req.body.heat,
        ...JSON.parse(req.body.sauce),
        likes:0,
        dislikes:0
    })
    sauce.save()
        .then(() => res.status.apply(201).json({message: 'sauce crée!'}))
        .catch(error => res.status(400).json({error}))
}

// récupérer une sauce particulière
exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({ id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
}

// modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file? // condition si la modification avec photo ou sans photo
    {...JSON.parse(req.body),
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}` } : {...req.body};
    Sauce.updateOne({id: req.params.id}, {...sauceObject, id: req.params.id})
        .then(() => res.status(200).json({message: "sauce modifié"}))
        .catch(error => res.status(404).json({error}))
}

//supprimer une sauce avec id fourni
exports.deleteSauce =  (req, res, next) => {
    Sauce.findOne({id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({id: req.params.id})
        .then(() => res.status(200).json({message: 'Supprimé'}))
        .catch(error => res.status(404).json({error}))
            })}
        )
        .catch(error => res.status(500).json({error}))  
}

// liked ou disliked une sauce
exports.likeSauce =  (req, res, next) => {

}