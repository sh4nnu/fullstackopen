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

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(null)

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
  }

  const normalizedFilter = filter.trim().toLowerCase()
  const matching = normalizedFilter
    ? countries.filter(country =>
        country.name?.common?.toLowerCase().includes(normalizedFilter)
      )
    : []

  if (error) {
    return (
      <div>
        <div>
          find countries <input value={filter} onChange={handleFilterChange} />
        </div>
        <div>{error}</div>
      </div>
    )
  }

  if (normalizedFilter.length === 0) {
    return (
      <div>
        <div>
          find countries <input value={filter} onChange={handleFilterChange} />
        </div>
      </div>
    )
  }

  if (matching.length > 10) {
    return (
      <div>
        <div>
          find countries <input value={filter} onChange={handleFilterChange} />
        </div>
        <div>Too many matches, specify another filter</div>
      </div>
    )
  }

  if (matching.length > 1) {
    return (
      <div>
        <div>
          find countries <input value={filter} onChange={handleFilterChange} />
        </div>
        <ul>
          {matching.map(country => (
            <li key={country.cca3 || country.name?.common}>{country.name?.common}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <CountryDetails country={matching[0]} />
    </div>
  )
}

export default App
