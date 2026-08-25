const Persons = ({ persons,handleDelete }) => (
  <div>
    {/* {personsToShow.map((person, index) => (
      <p key={index}>{person.name} {person.number}</p>
    ))} */}
    <ul>
        {persons.map(person=>(
            <li key={person.id}>
            {person.name}{person.number}
            <button onClick={()=> handleDelete(person.id, person.name)}>delete</button>
            </li>
        ))}
    </ul>
  </div>
)
export default Persons
