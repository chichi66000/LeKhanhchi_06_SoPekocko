const Sauce = require('../models/sauce');
const fs = require('fs');

// enregistrer nouvelle sauce
exports.createSauce = (req, res, next) => {  
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ,
        likes:0,
        dislikes:0, 
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'sauce crée!'}))
        .catch((error) => res.status(400).json({error}))
};

// modifier une sauce
exports.modifySauce = (req, res) => {
    let sauceObject = {};
    req.file? // condition si la modification avec photo ou sans photo
    (Sauce.findOne({_id: req.params.id}) // chercher id et supprimer la photo
        .then( (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`)
        })
        .catch((error) => res.status(400).json({error})),
        (sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // mettre à jour nouvelle photo
        }) 
    )
    : (sauceObject = { ...req.body}); // modif sans photo, mise à jour req.body
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: "sauce modifié"}))
        .catch((error) => res.status(404).json({error}))
};

// récupérer tous les sauces 
exports.getAllSauces =  (req, res) => {
    Sauce.find()
        .then( (sauces) => res.status(200).json(sauces))
        .catch(error =>  res.status(404).json({error}))
};

// récupérer une sauce particulière
exports.getOneSauce =  (req, res) => {
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({error}))
};

//supprimer une sauce avec id fourni
exports.deleteSauce =  (req, res) => {
    Sauce.findOne({_id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Supprimé'}))
                    .catch((error) => res.status(404).json({error}));
            })}
        )
        .catch((error) => res.status(500).json({error}))  
};

// liked ou disliked une sauce
exports.likeSauce =  (req, res, next) => {
    switch(req.body.like) {
        case 0: // annuler likes et disliked
            Sauce.findOne({_id: req.params.id})
                .then((sauce) => {
                    // si user a déjà likes la sauce
                    if(sauce.usersLiked.find((userId) => userId === req.body.userId)) {
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {likes: -1}, //retirer 1 likes
                            $pull: {usersLiked: req.body.userId}, // retirer le userId dans array
                            _id:req.params.id,
                        } )
                            .then( () => res.status(200).json({message: "Votre avis a été pris en compte"}))
                            .catch((error) => res.status(400).json({error}))
                    }

                    // si user a déjà dislikes la sauce
                    if(sauce.usersDisliked.find((userId) => userId === req.body.userId)) {
                        Sauce.updateOne({_id:req.params.id}, {
                            $inc: {dislikes: -1},
                            $pull: {usersDisliked: req.body.userId},
                            _id:req.params.id,
                        })
                            .then(() => res.status(200).json({message: 'Votra avis a été pris en compte'}))
                            .catch((error)=> res.status(400).json({error}))
                    }
                })
                .catch((error) => res.status(400).json({error}))
            break;

        case 1: // ajouter 1 likes
            Sauce.updateOne({_id:req.params.id}, {
                $inc: {likes: 1}, // +1 likes
                $push: {usersLiked: req.body.userId}, // ajouter userId dans array
                _id:req.params.id,
            })
                .then(() => res.status(200).json({message: 'Votre avis a été pris en compte'}))
                .catch((error) => res.status(400).json({error}));
            break;

        case -1: // ajouter dislikes
            Sauce.updateOne({_id:req.params.id}, {
                $inc: {dislikes: 1}, // +1 dislikes
                $push: {usersDisliked: req.body.userId}, // ajouter userId dans array 
                _id:req.params.id,
        })
            .then(() => res.status(200).json({message: 'Votre avis a été pris en compte'}))
            .catch((error) => res.status(400).json({error}));
            break;
        default:
            alert(' Erreur, retentez plus tard');
    }
    
};

// switch (req.body.like) {
    //     case 0: // si on veut annuler likes et dilikes
    //         Sauce.findOne({_id:req.params.id})
    //             .then( (sauce) => {
    //              // si on a aimé la sauce, retirer userId du tableau userLiked
    //                 if (sauce.usersLiked.find((user) => user === req.body.userId)) {
    //                     Sauce.updateOne({_id:req.params.id}, {
    //                         $inc: {likes: -1},
    //                         $pull: {userLiked: req.body.userId},
    //                         _id:req.params.id,
    //                     })
    //                     .then( () => res.status(200).json({message: 'Votre avis a été pris en compte'}))
    //                     .catch((error) => res.status(400).json({error}))
    //                 } ;
                    
    //                 // si on a disliked la sauce, retirer userId du tableau userDisliked
    //                 if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
    //                     Sauce.updateOne({_id:req.params.id}, {
    //                         $inc: {dislikes: -1},
    //                         $pull: {userDisliked: req.body.userId},
    //                         _id:req.params.id,
    //                     })
    //                     .then( () => res.status(200).json({message: 'Votre avis a été pris en compte'}))
    //                     .catch((error) => res.status(400).json({error}))
    //                 }; 

    //             })
    //             .catch((error) => res.status(400).json({error}))
    //         break;

    //     case 1: // si on aimer la sauce
    //         Sauce.findOne({_id: req.body.id})
    //             .then((sauce) => {
    //                 for ( let i=0; i<sauce.userLiked.length; i++) {
    //                     if( sauce.userLiked[i]!== req.body.userId) {
    //                         Sauce.updateOne({_id: req.body.id}, {
    //                             $inc: { likes: 1},
    //                             $push: {userLiked: req.body.userId},
    //                             _id: req.params.id,})
    //                     }
    //                     else{ alert('Vous avez déjà voté pour cette sauce')}
    //                 }
    //             })
    //             .catch((error) => res.status(400).json({error}));           
    //         break;

    //     case -1: // si on n'aime pas la sauce
    //     Sauce.findOne({_id: req.body.id})
    //     .then((sauce) => {
    //         for ( let i=0; i<sauce.userDisliked.length; i++) {
    //             if( sauce.userDisliked[i]!== req.body.userId) {
    //                 Sauce.updateOne({_id: req.body.id}, {
    //                     $inc: { dislikes: 1},
    //                     $push: {userDisliked: req.body.userId},
    //                     _id: req.params.id,})
    //             }
    //             else{ alert('Vous avez déjà voté pour cette sauce')}
    //         }
    //     })
    //     .catch((error) => res.status(400).json({error}));
        
    //         break;
    //     default: console.error('Erreur, Retentez plus tard');
    // }
    // Sauce.findOne({_id: req.params.id})
    //     .then((sauce) => {
    //         switch ( req.body.like) {
    //             case 0:
    //                 break;
    //             case 1:
    //                 break;
    //             case -1:
    //                 break;
    //             default: 
    //                 console.error('Erreur, retentez plus tard');
    //         }
    //     })
    //     .catch((error) => res.status(400).json({error}))