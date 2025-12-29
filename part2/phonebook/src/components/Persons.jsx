
const Person = (props) => {
    const {person} = props
    return (
        <p>{person.name} {person.number}</p>
    )
}




const Persons = (props) => {
    const { personsToShow } = props

    return (
        <>
            {personsToShow.map(person => <Person key={person.id} person={person} />)}
        </>
    )
}
export default Persons