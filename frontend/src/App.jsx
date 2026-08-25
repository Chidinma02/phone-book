import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './Components/filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'
import Notification from './Components/Notification' // new component

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = async (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setMessage(`Updated ${newName}'s number successfully`)
            setMessageType('success')
            setTimeout(() => setMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage(`Information of ${newName} has already been removed from the server`)
            setMessageType('error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setTimeout(() => setMessage(null), 5000)
          })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }
    // personService.create(personObject)
    //   .then(returnedPerson => {
    //     setPersons(persons.concat(returnedPerson))
    //     setMessage(`Added ${newName} successfully`)
    //     setMessageType('success')
    //     setTimeout(() => setMessage(null), 5000)
    //     setNewName('')
    //     setNewNumber('')
    //   })
    //   .catch(error => {
    //     setMessage(`Failed to add ${newName}`)
    //     setMessageType('error')
    //     setTimeout(() => setMessage(null), 5000)
    //   })

    try {
    const returnedPerson = await personService.create(personObject);
    setPersons(persons.concat(returnedPerson));
    setMessage(`Added ${newName} successfully`);
    setMessageType('success');
    setNewName('');
    setNewNumber('');
  } catch (error) {
    // Only show the backend error message (e.g. Mongoose validation)
    if (error.response?.data?.error) {
      setMessage(error.response.data.error);
    }
    setMessageType('error');
  }

  setTimeout(() => setMessage(null), 5000);

  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage(`${name} deleted successfully`)
          setMessageType('success')
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          setMessage(`Information of ${name} has already been removed from server`)
          setMessageType('error')
          setPersons(persons.filter(p => p.id !== id))
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
