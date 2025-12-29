import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

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
      alert(`${newName} is already added to phonebook`)
      return
    }
    else {
    const nameObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
    }
  }

  const personstoShow = filterName.length ? persons.filter(person => 
    person.name.toLowerCase().includes(filterName.toLowerCase())
  ) : persons


  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with: <input value={filterName} onChange={handleFilterNameChange} />
      </div>

      <h2>Add a new</h2>
      <form onSubmit={addNewNumber}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personstoShow.map(person => 
          <li key={person.name}>{person.name} {person.number}</li>
        )}
      </ul>
      <div>debug: 
        filterName: {filterName}, newName: {newName}, personstoShow: {JSON.stringify(personstoShow)}</div>
    </div>    
  )
}

export default App