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
function validateQuery(req,res,next){
    let properties = ['name','type'];
    
    for (property of properties){
        if (!req.query.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }

    next();
}

// Get /search/items and return the all of the items satisfying the queries
router.get("/items", validateQuery, (req, res)=>{
    let queries = req.query;
    if (queries !== undefined && queries.type !== "error"){
        let query = Item.find().byID(queries.id).byName(queries.name).byType(queries.type).byIMG(queries.img);
        query.exec(function( err, result){
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                res.status(200);
                res.set("Content-Type", "application/json");
                res.json(result);
            }else{
                res.status(404);
                res.send("Cannot find the item...");
            }
        });
    }else{
        res.status(400);
        res.send("Bad request...");
    }
})


module.exports = router;