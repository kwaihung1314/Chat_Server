const MongoClient = require('mongodb').MongoClient;

const dbUri = 'mongodb+srv://kwaihung1314:admin@firstcluster-dpxbb.gcp.mongodb.net/test?retryWrites=true';
const dbClient = new MongoClient(dbUri, { useNewUrlParser: true });

dbClient.connect()
.then((client) => {
    const db = client.db('chatroom');
    const collection = db.collection('test');
    console.log('successful connected to collection ' + collection.collectionName + ' of mongo');
})
.catch((err) => {
    console.log(err);
})

function getDb() {
    return dbClient;
}

module.exports = getDb;