// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");
const { MongoErrorLabel } = require('mongodb');

app.use(express.json()); // body-parser middleware

// Middleware function: this validates the contents of request body, verifies item data
function validateItemBody(req,res,next){
    let properties = ['name','type','img'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}

// Post /items adds a new item into the items database
router.post("/", validateItemBody, (req, res)=>{
	let body = req.body;

    // check if the type exists in the type database
    Type.findOne().where("id").equals(body.type).exec(function(err, result){
        if (err) throw err;
        if (result !== null){
            // check if the item already exist in the items database
            Item.findOne().where("name").equals(body.name).exec(function(err, result){
                if (err) throw err;
                if (result === null){
                    // find the latest item in the database to generate a new unique ID
                    Item.findOne().sort({_id: -1}).exec(function(err, result){
                        if (err) throw err;
                        // creates a new unique ID by incrementing the latest ID
                        let nextID = parseInt(result.id) + 1;
                        let newID = nextID +"";
                        
                        let newItem = new Item({
                            id: newID,
                            name: body.name,
                            type: body.type,
                            img: body.img
                        });
                        console.log(newItem);

                        // saves the new item
                        newItem.save(function(err, result){
                            if (err) throw err;
                            console.log(result);
                            if (result !== undefined) {
                                res.status(200);
                                res.send(result);
                            }else{
                                res.status(400);
                                res.send("Failed to add new item...");
                            }
                        });
                    });
        
                }else{
                    res.status(409);
                    res.send("New item is a duplicate...");
                }
            });

        }else{
            res.status(404);
            res.send("Type does not exist...");
        }
    });
})

module.exports = router;