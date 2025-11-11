/**
 * Filter Component
 * @prop {string} searchName - The current search term for filering names
 * @prop {function} handleSearchName - event handler for updating the current search term
 */
const Filter = ({ searchName, handleSearchName }) => {
  return (
    <div>
      filter shown with <input value={searchName} onChange={handleSearchName} />
    </div>
  )
}


export default Filter