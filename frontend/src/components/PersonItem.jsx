/**
 * PersonItem Component
 * @prop {string} name - The name of the person
 * @prop {string} number - The phone number of the person
 * @prop {function} handleDelete - event handler for deleting the person
 */
const PersonItem = ({ name, number, handleDelete }) => {
  return (
    <div>
      <li> {name} {number}
        {' '}<button onClick={handleDelete}>delete</button>
      </li>
    </div>
  )
}

export default PersonItem