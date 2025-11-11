/**
 * PersonForm Component
 * @prop {function} addPerson - event handler for adding a new person
 * @prop {string} newName - The current value of the name input filed
 * @prop {function} hnadleNewName - event handler for updating the name input field
 * @prop {string} nawNUmber - The current value of the number input field
 * @prop {function} handleNewName - eent handler for updating the number input field
 */
const PersonForm = ({ addPerson, newName, handleNewName, newNumber, handleNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm