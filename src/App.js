import React, { useState } from "react";

import "./App.css";
import InfoBox from "./infoBox";

import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect } from "react";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCaseType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            active: country.active,
            cases: country.cases,
            continent: country.continent,
            countryInfo: country.countryInfo,
            time: country.updated,
          }));

          const sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  // https://disease.sh/v3/covid-19/countries

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        countryCode !== "worldwide"
          ? setMapCenter([data.countryInfo.lat, data.countryInfo.long]) &&
            setMapZoom(4)
          : setMapCenter({ lat: 34.80746, lng: -40.4796 }) && setMapZoom(4);
      });
  };

  const handleCase = (e) => {
    setCaseType(e);
  };

  return (
    <div>
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>Covid-19 Tracker</h1>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries
                  ? countries.map((country) => (
                      <MenuItem key={country.name} value={country.value}>
                        {country.name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox
              title="Coronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0,0")}
              handleCase={handleCase}
              casesType="cases"
              active={casesType === "cases"}
              time={mapCountries[0]}
            />
            <InfoBox
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0,0")}
              handleCase={handleCase}
              casesType="recovered"
              active={casesType === "recovered"}
              time={mapCountries[0]}
            />
            <InfoBox
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0,0")}
              handleCase={handleCase}
              casesType="deaths"
              active={casesType === "deaths"}
              time={mapCountries[0]}
            />
          </div>
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        <Card className="app__right">
          <CardContent>
            <h3>Live Case by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">
              Worldwide new <em>{casesType}</em>
            </h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
          {/* Graph */}
        </Card>
      </div>
      <div className="app__footer">
        <p style={{ margin: "auto" }}>Made With Love Solomon &copy;2020</p>
      </div>
    </div>
  );
};

export default App;
