import { useState, useEffect } from 'react'

const CountryDetails = ({ country }) => {
  if (!country) {
    return null
  }

  const name = country.name?.common || 'Unknown'
  const capital = Array.isArray(country.capital) ? country.capital.join(', ') : country.capital
  const languages = country.languages ? Object.values(country.languages) : []
  const flagSrc = country.flags?.png || country.flags?.svg
  const flagAlt = country.flags?.alt || `Flag of ${name}`

  return (
    <div>
      <h2>{name}</h2>
      <div>capital {capital || 'N/A'}</div>
      <div>area {country.area || 'N/A'}</div>
      <h3>languages:</h3>
      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      {flagSrc ? <img src={flagSrc} alt={flagAlt} width="160" /> : null}
    </div>
  )
}

/**
 * App component for searching and displaying country information.
 * 
 * Fetches a list of all countries from the REST Countries API and allows users to:
 * - Filter countries by name using a search input
 * - View matching countries in a list with a "show" button
 * - Display detailed information for a selected country
 * 
 * @component
 * @returns {React.ReactElement} The rendered App component with filter input and country details
 * 
 * @example
 * return <App />
 * 
 * @state {Array} countries - List of all countries fetched from the API
 * @state {string} filter - Current filter string entered by the user
 * @state {Object|null} selectedCountry - The currently selected country object, or null if none selected
 * 
 * Behavior:
 * - Shows "Too many matches" message when more than 10 countries match the filter
 * - Shows a list of countries when 2-10 countries match the filter
 * - Shows country details directly when exactly 1 country matches
 * - Shows nothing when filter is empty
 */
const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => {
        setCountries(data)
      })
      .catch(() => {
        setError('Failed to load countries')
      })
  }, [])

  const handleFilterChange = event => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const normalizedFilter = filter.trim().toLowerCase()
  const matching = normalizedFilter
    ? countries.filter(country =>
        country.name?.common?.toLowerCase().includes(normalizedFilter)
      )
    : []
  
  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      {normalizedFilter.length === 0 ? null : matching.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : matching.length > 1 ? (
        <div>
          <ul>
            {matching.map(country => (
              <li key={country.cca3 || country.name?.common}>
                {country.name?.common}
                <button type="button" onClick={() => setSelectedCountry(country)}>
                  show
                </button>
              </li>
            ))}
          </ul>
          <CountryDetails country={selectedCountry} />
        </div>
      ) : (
        <CountryDetails country={matching[0]} />
      )}
    </div>
  )
}


export default App
