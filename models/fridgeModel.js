const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Fridge

let fridgeSchema = Schema({
    id: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 6
    },
    name: {
        type: String,
        required: [true, "You need a name..."],
        minlength: [3, "Your name is pretty short..."],
        maxlength: [50, "Your name is probably too long..."]
    },
    numItemsAccepted: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    canAcceptItems: {
        type: Number,
        required: true,
        min: [0, "You cannot have negative items..."],
        max: [100, "Unable to accept more items..."]
    },
    contactInfo: {
        contactPerson: {
            type: String,
            required: true
        },
        contactPhone: {
            type: String,
            required: true
        }
    },
    address: {
        street: {
            type: String
        },
        postalCode: {
            type: String
        },
        city: {
            type: String
        },
        province: {
            type: String
        },
        country: {
            type: String
        }
    },
    acceptedTypes: {
        type: [String],
        required: true
    },
    items: [{
        id: String,
        quantity: Number
    }]

});

// updates the fridge's information 
fridgeSchema.methods.update = function(body, callback) {
    if (body.name !== undefined){
        this.name = body.name;
    }
    if (body.numItemsAccepted !== undefined){
        this.numItemsAccepted = body.numItemsAccepted;
    }
    if (body.canAcceptItems !== undefined){
        this.canAcceptItems = body.canAcceptItems;
    }
    if(body.contactInfo !== undefined){
        if (body.contactInfo.contactPerson !== undefined){
            this.contactInfo.contactPerson = body.contactInfo.contactPerson;
        }
        if (body.contactInfo.contactPhone !== undefined){
            this.contactInfo.contactPhone = body.contactInfo.contactPhone;
        }

    }

    if (body.address !== undefined){
        if(body.address.street !== undefined){
            this.address.street = body.address.street;
        }
        if(body.address.postalCode !== undefined){
            this.address.postalCode = body.address.postalCode;
        }
        if(body.address.city !== undefined){
            this.address.city = body.address.city;
        }
        if(body.address.province !== undefined){
            this.address.province = body.address.province;
        }
        if(body.address.country !== undefined){
            this.address.country = body.address.country;
        }

    }
    if(body.acceptedTypes !== undefined){
        if(body.acceptedTypes.length > 0){
            this.acceptedTypes = body.acceptedTypes;

        }
    }
    if(body.items !== undefined) {
        if (body.items.length > 0) {
            this.items = body.items;

        }
    }
    this.save(callback);
    return;

}

// adds an item to the items array 
fridgeSchema.methods.addItem = function(item, callback) {
    for (let i = 0; i < this.items.length; i++) {
        // console.log(this.items[i].id);
        if (this.items[i].id === item.id){
            callback("Item is a duplicate");
            return;
        }
    }
 
    this.items.push(item);
    this.save(callback);
    return;
    
}

// deletes an item from the items array
fridgeSchema.methods.deleteItem = function(itemID, callback) {
    for( let i = 0; i < this.items.length; i++) {
        if (this.items[i].id === itemID) {
            this.items[i].remove();
            this.save(callback);
            return;
        }
    }
    callback("Item does not exist in the array...");
}

// deletes multiple items from the items array
fridgeSchema.methods.deleteManyItem = function(itemID, callback) {
    let isExist = false;
    for( let i = 0; i < itemID.length; i++) {
        // console.log("i: "+i);
        for( let j = 0; j < this.items.length; j++) {
            // console.log("j: "+j);
            if (this.items[j].id === itemID[i]) {
                isExist = true;
                this.items[j].remove();
            }
        }
        
    }
    if (isExist){
        this.save(callback);
        return;

    }else{

        callback(undefined);
    }
}

// delete all items from the items array
fridgeSchema.methods.deleteAllItem = function(callback) {
    this.items = [];
    this.save(callback);
    return;
}

// update the quantity of an item
fridgeSchema.methods.updateItemQuantity = function(itemID, qty, callback) {
    for( let i = 0; i < this.items.length; i++){
        if (this.items[i].id === itemID){
            this.items[i].quantity = qty;
            this.save(callback);
            return;
        }
    }
    callback(undefined);
}

// checks if item exists in the items array
fridgeSchema.methods.checkItem = function(item, callback) {
    return this.items.find( {id: item.id});
}

module.exports = mongoose.model("Fridge", fridgeSchema);