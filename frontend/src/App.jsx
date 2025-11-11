import { useState, useEffect } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import PersonItem from "./components/PersonItem"
import userServices from "./services/users.js"
import Notification from "./components/Notification.jsx"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null })

  const hook = () => {
    userServices
      .getAll()
      .then(allObjects => {
        setPersons(allObjects)
      })
      .catch(error => {
        setNotificationMessage({ message: 'Server connection is lost', type: 'error' })
        setTimeout(() => {
          setNotificationMessage({ message: 'null', type: 'null' })
        }, 3000);
      })
  }
  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()

    const normalize = str => str.trim().toLowerCase()
    const existingPerson = persons.find(person => normalize(person.name) === normalize(newName))

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new number`)) {
        const newPersonObject = { ...existingPerson, number: newNumber }

        userServices
          .update(existingPerson.id, newPersonObject)
          .then(returnedObject => {
            setPersons(prev =>
              prev.map(person => person.id === existingPerson.id ? returnedObject : person)
            )
            setNewName('')
            setNewNumber('')
            setNotificationMessage({ message: `Updated ${returnedObject.name}`, type: 'success' })
            setTimeout(() => {
              setNotificationMessage({ message: 'null', type: 'null' })
            }, 3000);
          })
          .catch(error => {
            setNotificationMessage({ message: `${newPersonObject.name} is already removed from the server, ${error}`, type: 'error' })
            setTimeout(() => {
              setNotificationMessage({ message: 'null', type: 'null' })
            }, 3000);
          })
      }
      return
    }
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    userServices
      .create(newPerson)
      .then(newObject => {
        setPersons(prev => prev.concat(newObject))
        setNewName('')
        setNewNumber('')
        setNotificationMessage({ message: `Added ${newObject.name}`, type: 'success' })
        setTimeout(() => {
          setNotificationMessage({ message: null, type: null })
        }, 3000);
      })
      .catch(error => {
        setNotificationMessage({ message: `Failed to create ${newPerson.name}`, type: 'error' })
        setTimeout(() => {
          setNotificationMessage({ message: 'null', type: 'null' })
        }, 3000);
      })
  }

  const handleNewName = (event) => setNewName(event.target.value)

  const handleNewNumber = (event) => setNewNumber(event.target.value)

  const handleSearchName = (event) => setSearchName(event.target.value)


  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`))
      userServices
        .remove(person.id)
        .then(removedObject => {
          setPersons(prev => prev.filter(p => p.id !== person.id))
          setNotificationMessage({ message: `${removedObject.name} is successfully removed `, type: 'success' })
          setTimeout(() => {
            setNotificationMessage({ message: 'null', type: 'null' })
          }, 3000);
        })
    setPersons(prev => prev.filter(p => p.id !== person.id))
      .catch(error => {
        setNotificationMessage({ message: `${person.name} is already removed from the server`, type: 'error' })
        setTimeout(() => {
          setNotificationMessage({ message: 'null', type: 'null' })
        }, 3000);
      })
  }

  const filteredPersons = persons.filter(p => p.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage.message} type={notificationMessage.type} />
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      {filteredPersons.map(person => {
        return (
          <PersonItem
            key={person.id}
            name={person.name}
            number={person.number}
            handleDelete={() => handleDelete(person)} />
        )
      })}
    </div>
  )
}

export default App