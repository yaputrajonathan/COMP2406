let config = {};
config.db = {};

// create properties on the config.db object for the host and database names
const username = "jonathannotapplicable"; // username for the MongoDB Atlas on cloud
const password = "xR3oITI4BZAPiJeF"; // password for the MongoDB on cloud
const dbname = "community-fridge-101161272"; // name of the database that we want to connect to

const connectionURL = `mongodb+srv://${username}:${password}@cluster0.sfzat.mongodb.net/${dbname}?retryWrites=true&w=majority`; // full URL for connecting to our MongoDB database; includes the database username, password, and the database name

// create properties on the config.db object for the host and database names
config.db.host = connectionURL;
config.db.name = dbname;

module.exports = config;
