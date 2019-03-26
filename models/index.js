const mongoose = require('mongoose');

const dbUri = 'mongodb+srv://kwaihung1314:admin@firstcluster-dpxbb.gcp.mongodb.net/chatroom?retryWrites=true';

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
