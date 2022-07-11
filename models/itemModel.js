const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for an Item

let itemSchema = Schema({
    id: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 4
    },
    name: {
        type: String,
        required: [true, "You need a name..."],
        minlength: [2, "The item's name is pretty short..."],
        maxlength: [50, "The item's name is probably too long..."]
    },
    type: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true,
        minlength: [5, "The file path is too short..."],
        maxlength: [100, "The file path is probably too long..."]
    }

});

// check if an item exist in the items database
itemSchema.statics.Validate = function(items, callback) {
    for (let i = 0; i < items.length; i++){
        
        this.find().where("id").equals(items[i].id).exec(callback);
    }
}

// search by ID
itemSchema.query.byID = function(ID){
    return this.where({id: new RegExp(ID, 'i')});
}

// search by Name
itemSchema.query.byName = function(name){
    return this.where({name: new RegExp(name, 'i')});
}

// search by Type
itemSchema.query.byType = function(type){
    return this.where({type: new RegExp(type, 'i')});
}

// search by IMG
itemSchema.query.byIMG = function(IMG){
    return this.where({img: new RegExp(IMG, 'i')});
}

module.exports = mongoose.model("Item", itemSchema);
