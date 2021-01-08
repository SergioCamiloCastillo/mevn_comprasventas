const mongoose = require('mongoose')

const DBconnection = async () => {
  const dbUrl = 'mongodb://localhost:27017/idev';

  const conn = await mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }).then(mongoose=>console.log('Conectado a la bd'))
    .catch(err => {
      console.log(`For some reasons we couldn't connect to the DB`.red, err)
    })

}

module.exports = DBconnection