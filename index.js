const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.static(__dirname + '/build'))


app.use(cors())
app.use(bodyParser.json())
morgan.token('json-data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json-data'))




let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/test', (req, res) => {
  res.sendfile(path.resolve('/build/index.html')) //500 internal error
})

app.get('/test2', (req, res) => {
  res.sendfile(__dirname + '/build/index.html') // 404 js files not found
})

app.get('/test3', (req, res) => {
  res.sendFile('index.html', { root: './build' }) // 404 js files not found
})

app.get('/hello', (req, res) => {
  res.sendFile('hello.html', { root: './build' }) //200 ok
})

app.get('/hello2', (req, res) => {
  res.sendfile(__dirname + '/build/hello.html') // 200 ok
})

app.get('/', (req, res) => {
  res.sendfile(__dirname + '/build/index.html') // 404 js files not found
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('requested person', id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if (persons.filter(person => person.name === body.name).length !== 0) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (req, res) => {
  res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot </p>'
    + Date())
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})