import { useState, useEffect, use } from 'react'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'  

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')


  useEffect(() => {
    personService.getAll()
      .then(personsData => {
        setPersons(personsData)
      })
  }, [])

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addNewNumber = (event) => {
    event.preventDefault()
    
    if (persons.some(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to the phonebook, replace the old
        number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const updatedPerson = {...person, number: newNumber}
        personService.update(updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        }
      return
    }
    else {
    const newObject = {
      name: newName,
      number: newNumber
    }
    personService.create(newObject)
    .then (createdPerson => {
      setPersons(persons.concat(createdPerson))
      setNewName('')
      setNewNumber('')
    })
    
    }
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deletePerson(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      }) 
    }
  }

  const personstoShow = filterName.length ? persons.filter(person => 
    person.name.toLowerCase().includes(filterName.toLowerCase())
  ) : persons


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filterName} handleFilterChange={handleFilterNameChange} />

      <h2>Add a new</h2>

      <PersonForm 
        addNewNumber={addNewNumber} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons personsToShow={personstoShow} deletePerson={deletePerson}  />

    </div>
  )
}

export default App
