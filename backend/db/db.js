const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

// db variable to be set to the connected database
let _db;

// connect to the db
const connect = () => {
  mongo.connect(
    url,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.log(err);
        // exit the process if error in connection
        process.exit(0);
      }
      // set _db variable to the mongoDB
      _db = client.db('checkfold_db');
      console.log(`Connected to ${url}`);
    }
  );
};

const getDB = () => _db;

const closeDB = () => _db.close();

module.exports = {connect, getDB, closeDB};
