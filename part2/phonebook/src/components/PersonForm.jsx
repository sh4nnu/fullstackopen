const PersonForm = (props) => {
    const {addNewNumber, newName, handleNameChange, newNumber, handleNumberChange} = props
    return (
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
    )
}
export default PersonForm