/**
 * This is a utility function that can be used to access the database
 * anywhere in the backend codebase. It handles all of the connection
 * logic and handles general errors.
 *
 * @ops - An async anonymous function that consumes a variable (db)
 * @res - The response object if this function is called from a
 *        REST route handler.
 */

const MongoClient = require('mongodb').MongoClient;

async function withDB(ops, res) {
  try {
    const uri = 'mongodb://localhost:27017';
    const dbName = 'checkfold_db';
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log(`Connected!`);
    const db = client.db(dbName);
    console.log(`Database Name: ${db.databaseName}`);

    console.log(`Commence Operations`);
    await ops(db);
    console.log(`Operations Finished`);

    client.close();
    console.log(`Database Closed`);
  } catch (err) {
    console.log(err);
    if (res) {
      res.status(500).json({
        message: err.errmsg,
        err,
      });
    }
  }
}

module.exports = withDB;
