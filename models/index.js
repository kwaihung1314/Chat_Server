const mongoose = require('mongoose');
const config = require('../config');

// TODO: change to process.env
const dbUri = `mongodb+srv://${config.db.username}:${config.db.password}@firstcluster-dpxbb.gcp.mongodb.net/${config.db.name}?retryWrites=true`;

mongoose.connect(dbUri, {useNewUrlParser: true})
    .then(() => {
        console.log('connected to database.');
        console.log(mongoose.connection.db);
    })
    .catch((err) => {
        console.log(err);
    });

let db = mongoose.connection;
console.log('this is db connection: ', db);
