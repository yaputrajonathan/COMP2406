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

// Get /fridges and return the all of the fridges based on requested format
router.get('/', (req,res)=> {
    res.format({
		'text/html': ()=> {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname,'public','view_pickup.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
		'application/json': ()=> {
			let query = Fridge.find();
			query.exec(function(err, result){
				if (err) throw err;
				console.log(result);
				if (result !== undefined) {
					res.status(200);
					res.set("Content-Type", "application/json");
					res.json(result);
				}else{
					res.status(404);
					res.send("No Fridges...");
				}

			});
        },
        'default' : ()=> {
            res.status(406).send('Not acceptable');
        }
    })
});
// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page
router.get("/types", function(req, res, next){
	let types = [];
  Object.entries(req.app.locals.items).forEach(([key, value]) => {
    if(!types.includes(value["type"])){
      types.push(value["type"]);
    }
  });
	res.status(200).set("Content-Type", "application/json").json(types);
});

// Middleware function: this function validates the contents of the request body associated with adding a new fridge into the application. At the minimimum, it currently validates that all the required fields for a new fridge are provided.
function validateFridgeBody(req,res,next){
    let properties = ['name','can_accept_items','accepted_types','contact_person','contact_phone','address'];

    for(property of properties){
      // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
        if (!req.body.hasOwnProperty(property)){
            return res.status(400).send("Bad request");
        }
    }
    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}
// Middleware function: this validates the contents of request body, verifies item data
function validateItemBody(req,res,next){
    let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}
// Adds a new fridge, returns newly created fridge
router.post('/', validateFridgeBody, (req,res)=> {
	let f_ID = null;
	let fName = req.body.name;
	let canacceptitems = req.body.can_accept_items;
	let acceptedtypes = req.body.accepted_types;
	let contactperson = req.body.contact_person;
	let contactphone = req.body.contact_phone;
	let fAddress = req.body.address;

	// finds the last fridge in order to generate a new ID properly
	Fridge.findOne().sort({_id: -1}).exec(function(err, result){
		if (err) throw err;

		// this generate a new unique ID which is based on the last fridge's ID and increments it
		let nextID = ((result.id).match(/\d+\.\d+|\d+\b|\d+(?=\w)/g) || [] ).map(function (v) {return +v;}).pop() + 1;
		f_ID = "fg-" + nextID;
		let newFridge = new Fridge({
			id: f_ID,
			name: fName,
			canAcceptItems: canacceptitems,
			contactInfo: {
				contactPerson: contactperson,
				contactPhone: contactphone
			},
			address: {
				street: fAddress.street,
				postalCode: fAddress.postalCode,
				city: fAddress.city,
				province: fAddress.province,
				country: fAddress.country
			},
			acceptedTypes: acceptedtypes,
			items: []
		});
		console.log(newFridge);

		// saves the new fridge
		newFridge.save(function(err, result){
			if (err) throw err;
			console.log(result);
			if (result !== undefined) {
				res.status(200);
				res.send(result);
			}else{
				res.status(400);
				res.send("Failed to add new fridge...");
			}
		});
	});
});

// Get /fridges/{fridgeID}. Returns the data associated with the requested fridge.
router.get("/:fridgeId", function(req, res, next){
	let f_ID = req.params.fridgeId;

	// finds the fridge in the database
	let query = Fridge.find().where("id").equals(f_ID);

	query.exec(function(err, result){
		if (err) throw err;
		console.log(result);
		if (result.length > 0) {
			res.status(200);
			res.set("Content-Type", "application/json");
			res.json(result);
		}else{
			res.status(404);
			res.send("Cannot find fridge...");
		}
	});
});

// Updates a fridge and returns the data associated.
// Should probably also validate the item data if any is sent, oh well :)
router.put("/:fridgeId", (req, res) =>{
	let f_ID = req.params.fridgeId;
	let body = req.body;
	let item = req.body.items;
	let type = req.body.acceptedTypes;
	let itemValidated = true;
	let typeValidated = true;

	// cannot update more than 1 items
	if (item !== undefined) {
		
		Item.Validate(item, function(err, result){
			if (err) throw err;
			console.log("Item Result: " + result);
			if (result.length < 1) {
				itemValidated = false;
				res.status(404);
				res.send("Cannot find item...");
			}
			// cannot update more than 1 accepted types
			if (type !== undefined) {
				Type.Validate(type, function(err, result){
					if (err) throw err;
					console.log("Type Result: " + result);
					if (result.length < 1) {
						typeValidated = false;
						res.status(404);
						res.send("Cannot find type...");
					}
					if (itemValidated && typeValidated){
				
						Fridge.findOne().where("id").equals(f_ID).exec(function(err, result){
							if (err) throw err;
							// console.log(result);
							result.update(body, function(err, result){
								if (err) {
									console.log("Error updating the fridge...");
									res.status(400);
									res.send(err.message);
								}
								console.log(result);
								res.status(200);
								res.send(result);
							});
						});
					}
				});
				
			}else{
				if (itemValidated){

					Fridge.findOne().where("id").equals(f_ID).exec(function(err, result){
						if (err) throw err;
						// console.log(result);
						result.update(body, function(err, result){
							if (err) {
								console.log("Error updating the fridge...");
								res.status(400);
								res.send(err.message);
							}
							console.log(result);
							res.status(200);
							res.send(result);
						});
					});
				}

			}

		});
	}else{
		if (type !== undefined) {
			
			Type.Validate(type, function(err, result){
				if (err) throw err;
				console.log("Type Result: " + result);
				if (result.length < 1) {
					typeValidated = false;
					res.status(404);
					res.send("Cannot find type...");
				}
				if (typeValidated){
					Fridge.findOne().where("id").equals(f_ID).exec(function(err, result){
						if (err) throw err;
						// console.log(result);
						result.update(body, function(err, result){
							if (err) {
								console.log("Error updating the fridge...");
								res.status(400);
								res.send(err.message);
							}
							console.log(result);
							res.status(200);
							res.send(result);
						});
					});
				}
			});
			
		}else{
			Fridge.findOne().where("id").equals(f_ID).exec(function(err, result){
				if (err) throw err;
				// console.log(result);
				result.update(body, function(err, result){
					if (err) {
						console.log("Error updating the fridge...");
						res.status(400);
						res.send(err.message);
					}
					console.log(result);
					res.status(200);
					res.send(result);
				});
			});
		}
	}

});

// Adds an item to specified fridge
router.post("/:fridgeId/items", validateItemBody, (req,res)=>{
	let f_ID = req.params.fridgeId;
	let item = req.body;

	// find fridge with matching f_ID
	let query = Fridge.findOne().where("id").equals(f_ID);

	// find item with matching i_ID
	let findItem = Item.findOne().where("id").equals(item.id);

	findItem.exec(function(err, result){
		if (err) throw err;

		// if the item exists, continue
		if (result !== null){
			query.exec(function(err, result){
				if (err) throw err;
				// if the fridge exists, continue
				if (result !== null){

					// adds the item into the items array
					result.addItem(item, function(err, result){
						
						console.log(result);
						if (result !== undefined){
							res.status(200);
							res.send(result);
						}else{
							res.status(409);
							res.send("Item is a duplicate...");
						}
					});

				}else{
					res.status(404);
					res.send("Cannot find fridge...");
				}
			});

		}else{
			res.status(404);
			res.send("Item does not exist...");
		}
	});

})

// Deletes an item from specified fridge
router.delete("/:fridgeId/items/:itemId", (req,res)=>{
	let f_ID = req.params.fridgeId;
	let i_ID = req.params.itemId;

	// find fridge with matching f_ID
	let query = Fridge.findOne().where("id").equals(f_ID);

	query.exec(function(err, result){
		if (err) throw err;
		// console.log(result);
		if (result !== null){

			// deletes the item from the items array
			result.deleteItem(i_ID, function(err, result){
				console.log(result);
				if (result !== undefined){
					res.status(200);
					res.send(result);
				}else{
					res.status(404);
					res.send("Item cannot be found in the array...");
				}
			});

		}else{
			res.status(404);
			res.send("Fridge cannot be found...");
		}
	});

})

router.delete("/:fridgeId/items", (req,res)=>{
	let f_ID = req.params.fridgeId;
	let itemsID = req.query.item;

	// find fridge with matching f_ID
	let query = Fridge.findOne().where("id").equals(f_ID);

	query.exec(function(err, result){
		if (err) throw err;
		// console.log(result);
		if (result !== null){

			// if the user has provided queries 
			if(itemsID !== undefined){

				// deletes the list of items
				result.deleteManyItem(itemsID, function(err, result){
					if (err) throw err;
					console.log(result);
					if (result !== undefined){
						res.status(200);
						res.send(result);
					}else{
						res.status(404);
						res.send("Item cannot be found in the array...");
					}
				});
			
			// if the user did not provide any queries
			}else{

				// deletes all the items in the items array
				result.deleteAllItem(function(err, result){
					if (err) throw err;
					console.log(result);
					if (result !== undefined){
						res.status(200);
						res.send(result);
					}else{
						res.status(404);
						res.send("Item cannot be found in the array...");
					}
				});
			}
		}else{
			res.status(404);
			res.send("Fridge cannot be found...");
		}
	});

})

router.put("/:fridgeId/items/:itemId", (req,res)=>{
	let f_ID = req.params.fridgeId;
	let i_ID = req.params.itemId;
	let newQTY = req.body.quantity;

	// find fridge with matching f_ID
	let query = Fridge.findOne().where("id").equals(f_ID);

	query.exec(function(err, result){
		if (err) throw err;
		if (result !== null){

			// updates the quantity of the item with i_ID
			result.updateItemQuantity(i_ID, newQTY, function(err, result){
				console.log(result);
				if (result !== undefined){
					res.status(200);
					res.send(result);
				}else{
					res.status(404);
					res.send("Item does not exist in the array...");
				}
			});
		}else{
			res.status(404);
			res.send("Fridge does not exist...");
		}
	});

})



module.exports = router;

function itemValidation(item) {
	let query = Item.find().where("id").equals(item);
	query.exec(function(err, result){
		if (err) throw err;
		if (result.length > 0){
			console.log("in item validation: " + result);
			return true;
		}else{
			return false;
		}
	});
}

function typeValidation(type) {
	let query = Type.find().where("id").equals(type);
	query.exec(function(err, result){
		if (err) throw err;
		if (result.length > 0){
			return true;
		}else{
			return false;
		}
	});
}