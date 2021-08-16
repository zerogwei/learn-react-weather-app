import React, { useState, useEffect } from 'react'; 
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import moment from 'moment';

function TempChart(props) {
  // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 300, pv: 2400, amt: 2400}, {name: 'Page C', uv: 250, pv: 2400, amt: 2400}];

  return (
    <LineChart width={600} height={300} data={props.data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="temp2m.min" stroke="#8884d8" />
    <Line type="monotone" dataKey="temp2m.max" stroke="#d88488" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
  </LineChart>
  );
}

function DayOfWeek(props) {
  return (
    <div className="dayOfWeek">{props.text}</div>
  )
}

function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataseries, setDataseries] = useState([]);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const weatherImages = {
    "clear":"http://www.7timer.info/img/misc/about_two_clear.png",
    "cloudy":"http://www.7timer.info/img/misc/about_two_cloudy.png",
    "pcloudy":"http://www.7timer.info/img/misc/about_two_pcloudy.png",
    "lightrain":"http://www.7timer.info/img/misc/about_two_rain.png"
  };

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });

    console.log("Fetching API at:", `https://www.7timer.info/bin/civillight.php?lon=${lng},13&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`);

    fetch(`https://www.7timer.info/bin/civillight.php?lon=-122.431297,13&lat=37.773972&ac=0&unit=metric&output=json&tzshift=0`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          
          // Transform result
          for (const [key, value] of Object.entries(result.dataseries)) {
            result.dataseries[key]['moment'] = moment(result.dataseries[key]['date'], "YYYYMMDD");
          }

          setDataseries(result.dataseries);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        Remove: { lat }, { lng }
        <div className="container">
          <div className="row">
            {dataseries.map(item => (
              <div className="col" key={item.date}>
                <DayOfWeek text={item.moment.format('dddd')} />
                <br></br>
                <img src={weatherImages[item.weather]}/>
                <br></br>
                {item.weather}
                <br></br>
                {item.temp2m.min}-{item.temp2m.max}
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col">
            <TempChart data={dataseries}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function WeatherDisplay(props) {
  return (
    <div>
      <div id="header">
        <h1>Weather Forecast</h1>

      </div>

      <MyComponent />

      <div className="container">
        <div className="disclaimer">
          Data sourced from <i><a href="http://www.7timer.info/">7timer!</a></i>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <WeatherDisplay />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
