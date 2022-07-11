const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Type

let typeSchema = Schema({
    id: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 4
    },
    name: {
        type: String,
        required: true,
        minlength: [2, "The type's name is pretty short..."],
        maxlength: [50, "The type's name is probably too long..."]
    }

});

// check if a type exists in the type database
typeSchema.statics.Validate = function(type, callback) {
    for (let i = 0; i < type.length; i++){
        this.find().where("id").equals(type[i]).exec(callback);
    }
}

module.exports = mongoose.model("Type", typeSchema);
