const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://aku:${password}@ds125125.mlab.com:25125/fullstack2019persons`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('puhelinluettelo')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}


if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: Math.floor(Math.random() * 10000),
  })
  console.log('lisätään ' + person.name + ' numero ' + person.number + ' luetteloon')
  person.save().then(response => {
    console.log('lisätty!');
    mongoose.connection.close();
  })
}