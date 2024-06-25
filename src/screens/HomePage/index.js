import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable } from "react-table";
import debounce from "lodash.debounce";
import "./HomePage.css";

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [populationFilter, setPopulationFilter] = useState("");

  const fetchCountries = () => {
    setLoading(true);
    axios
      .get("https://api.sampleapis.com/countries/countries")
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setCountries(res.data);
          setFilteredCountries(res.data);
          setDataLoaded(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("[err]", err);
      });
  };

  const handleSearch = debounce((term) => {
    console.log("[term==== in debounce]", term);
    if (term) {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredCountries(countries);
    }
  }, 300);

  const handleFilterByPopulation = (e) => {
    const value = e.target.value;
    setPopulationFilter(value);
    let threshold = parseInt(value, 10);
    if (threshold) {
      setFilteredCountries(
        countries.filter((country) => country.population < threshold)
      );
    } else {
      setFilteredCountries(countries);
    }
  };

  const handleClearFilters = () => {
    setFilteredCountries(countries);
    setSearchTerm("");
    setPopulationFilter("");
  };

  return (
    <div className="Home">
      <h1>Countries</h1>
      {!dataLoaded ? (
        <button onClick={fetchCountries} className="show-button">
          Show all Countries
        </button>
      ) : (
        <>
          <div className="filters">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search by country name"
              className="search-input"
            />
            <select
              value={populationFilter}
              className="population-select"
              onChange={handleFilterByPopulation}
            >
              <option value="">Select Population Filter</option>
              <option value="1000000">&lt; 1M</option>
              <option value="5000000">&lt; 5M</option>
              <option value="10000000">&lt; 10M</option>
            </select>
            <button onClick={handleClearFilters} className="clear-button">
              Clear
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Country Name</th>
                  <th>Code</th>
                  <th>Capital</th>
                  <th>Ph Code</th>
                  <th>Population</th>
                  <th>Flag</th>
                  <th>Emblem</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map((country, index) => (
                  <tr key={index}>
                    <td>{country && country?.name ? country?.name : "-"}</td>
                    <td>
                      {country && country?.abbreviation
                        ? country?.abbreviation
                        : "-"}
                    </td>
                    <td>
                      {country && country?.capital ? country?.capital : "-"}
                    </td>
                    <td>{country && country?.phone ? country?.phone : "-"}</td>
                    <td>
                      {country && country?.population
                        ? country?.population
                        : "-"}
                    </td>
                    <td>
                      {country && country?.media && country?.media?.flag ? (
                        <img src={country?.media?.flag} className="flag" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {country && country?.media && country?.media?.emblem ? (
                        <img src={country?.media?.emblem} className="emblem" />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
