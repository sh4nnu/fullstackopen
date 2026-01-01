
const Person = (props) => {
    const {person, deletePerson} = props
    return (
        <li>{person.name} {person.number}
        <button onClick={props.deletePerson}>delete</button>
        </li>
    )
}




const Persons = (props) => {
    const { personsToShow, deletePerson } = props

    return (
        <ul>
            {personsToShow.map(person => <Person key={person.id} person={person} deletePerson={() => {deletePerson(person.id)}} />)}
        </ul>
    )
}
export default Persons