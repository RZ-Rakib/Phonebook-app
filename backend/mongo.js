const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const cliName = process.argv[3]
const cliNumber = process.argv[4]

const MONGO_URI = `mongodb+srv://rzrakib:${password}@cluster1.n9nf6.mongodb.net/phonebook?appName=Cluster1`

mongoose.set('strictQuery', false)
mongoose.connect(MONGO_URI)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })

    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: cliName,
    number: cliNumber,
  })  
  person.save().then(() => {
    console.log(`Added '${cliName}' number:${cliNumber} to Phonebook DB`);

    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log(`node mongo.js <password>    # shows all entries`);
  console.log(`node mongo.js <password> <name> <number>   # add a single entry`);

  mongoose.connection.close()
}

