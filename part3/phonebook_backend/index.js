require('dotenv').config()

const express = require('express')
var morgan = require('morgan')

const app = express()

const PORT = process.env.PORT
const Person = require('./models/person')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use(express.static('dist'))

app.use(express.json())
const cors = require('cors')
app.use(cors())
// morgan('tiny')
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))
// app.use(morgan('tiny'))
let persons = [
    {
        'id': '1',
        'name': 'Arto Hellas',
        'number': '040-123456'
    },
    {
        'id': '2',
        'name': 'Ada Lovelace',
        'number': '39-44-5323523'
    },
    {
        'id': '3',
        'name': 'Dan Abramov',
        'number': '12-43-234345'
    },
    {
        'id': '4',
        'name': 'Mary Poppendieck',
        'number': '39-23-6423122'
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Phonebook Backend!</h1>')
})

app.get('/api/persons', (req, res) => {
    console.log('fetching persons from database')
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const date = new Date()
    Person.countDocuments().then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end()
    }).catch(error => {
        next(error)
    })
})




// const generateId = () => {
//     let randomID = Math.floor(Math.random() * 10000)
//     while (persons.some(person => person.id === randomID.toString())) {
//         randomID = Math.floor(Math.random() * 10000)
//     }
//     return randomID.toString()
// }

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    }).catch(error => {
        next(error)
    })

})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body

    const updatedPerson = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(id, updatedPerson, { new: true }).then(result => {
        res.json(result)
    }).catch(error => {
        next(error)
    })
})


const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
