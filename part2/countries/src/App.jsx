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

const Weather = ({ country, weather }) => {
  if (!country) {
    return null
  }

  const capital = Array.isArray(country.capital)
    ? country.capital[0]
    : country.capital

  if (!capital) {
    return null
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      {!weather ? (
        <div>loading...</div>
      ) : (
        <div>
          <div>temperature {weather.temp} C</div>
          {weather.iconUrl ? <img src={weather.iconUrl} alt={weather.description} /> : null}
          <div>wind {weather.wind} m/s</div>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

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

  const visibleCountry = matching.length === 1 ? matching[0] : selectedCountry

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey || !visibleCountry) {
      setWeather(null)
      setError(`Config error: Missing API key or country`)
      setTimeout(() => setError(null), 500)
      return
    }

    const coords = visibleCountry.capitalInfo?.latlng
    if (!coords || coords.length < 2) {
      setWeather(null)
      return
    }

    const [lat, lon] = coords
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (!data || !data.main || !data.weather || !data.weather[0]) {
          setWeather(null)
          return
        }
        setWeather({
          temp: data.main.temp,
          wind: data.wind?.speed ?? null,
          iconUrl: data.weather[0].icon
            ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            : null,
          description: data.weather[0].description || 'weather',
        })
      })
      .catch(() => {
        setWeather(null)
      })
  }, [visibleCountry])
  
  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      {error ? <div>{error}</div> : null}
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
          <Weather country={selectedCountry} weather={weather} />
        </div>
      ) : (
        <div>
          <CountryDetails country={matching[0]} />
          <Weather country={matching[0]} weather={weather} />
        </div>
      )}
    </div>
  )
}


export default App
