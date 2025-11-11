const express = require('express');
const winston = require('./loggers');
const morgan = require('morgan');
const app = express();

// middlewares
app.use(express.json());

app.use(express.static('dist'));

app.use(morgan('combined'));

let contacts = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  try {
    res.json(contacts);
    winston.info(`'GET api/persons' - Fetch contacts from server`);
  } catch (error) {
    winston.error(
      `'GET api/persons' - Failed to fetch data from server, ${error.message}`
    );
    res.status(500).end();
  }
});

app.get('/info', (req, res) => {
  try {
    const countPersons = contacts.length;
    const date = new Date();

    res.send(`
      <p>Phonebook has info for ${countPersons} people</p>
      <p>${date}</P>
    `);
    winston.info(`'GET /info' fetched info sucessfully`);
  } catch (error) {
    winston.error(
      `'GET /info' Failed to fetch data from server, ${error.message}`
    );
    res.status(500).end();
  }
});

app.get('/api/persons/:id', (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      winston.warn(`'GET /api/persons/:id' - ID is missing`);
      return res.status(400).json({ error: 'invalid id' });
    }
    const person = contacts.find((n) => n.id === id);
    if (person) {
      res.json(person);
      winston.info(`'GET api/persons/:id' - person with ID ${id} found`);
    } else {
      winston.warn(`'GET api/person/:id' -  id ${id} is invalid`);
      res.status(404).end();
    }
  } catch (error) {
    winston.error(
      `'GET api/persons/:ID' - Failed to fetch data from server, ${error.message}`
    );
    res.status(500).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      winston.warn(`'DELETE' api/persons/:id - ID is missing`);
      return res.status(400).json({ error: 'ID missing' });
    }

    contacts = contacts.filter((n) => n.id !== id);
    res.status(204).end();
    winston.info(`'DELETE' api/persons/:id - person with ID ${id} deleted`);
  } catch (error) {
    res.status(500).end();
    winston.error(
      `'DELETE' api/persons/:id - Error deleting person with ID ${id} from server', ${error.message}`
    );
  }
});

const generatedID = (min, max) => {
  const ceiledMin = Math.ceil(min);
  const flooredMax = Math.floor(max);
  return Math.floor(Math.random() * (flooredMax - ceiledMin) + ceiledMin);
};
app.post('/api/persons', (req, res) => {
  try {
    const { name, number } = req.body;
    if (!name || !number) {
      winston.warn(`'POST api/persons/' - Missing required fields`);
      return res.status(400).json({ error: 'Missing name or number' });
    }

    const trimmer = (value) => {
      return typeof value === 'string' ? value.trim().toLowerCase() : '';
    };

    const existingName = contacts.find(
      (p) => trimmer(p.name) === trimmer(name)
    );
    if (existingName) {
      winston.warn(`'POST api/persons/' - name:${name} must be unique`);
      return res.status(400).json({ error: 'name must be unique' });
    }

    const newObject = {
      id: generatedID(10000, 100000),
      name: name,
      number: number,
    };
    contacts = contacts.concat(newObject);

    res.status(201).json(newObject);
    winston.info(`'POST api/persons' - name:${name} is created sucessfully`);
  } catch (error) {
    res.status(500).end();
    winston.error(
      `'POST' api/persons - Failed to add name:${name} to server, ${error.message}`
    );
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
