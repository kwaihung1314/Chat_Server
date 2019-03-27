module.exports = {
  secret: process.env.NODE_ENV === 'Production'? process.env.SECRET : 'secret',

  // mongoDB
  db: {
    username: process.env.DB_USER || 'kwaihung1314',
    password: process.env.DB_PASSWORD || 'admin',
    name: process.env.DB_NAME || 'chatroom'
  }
}

