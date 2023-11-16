import React, { useState, useEffect } from "react";

function App() {
  const [drivers, setDrivers] = useState([]);

  const fetchDriverData = () => {
    fetch("http://localhost:3000/drivers")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDrivers(data);
      });
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  return (
    <>
      <h1>Express + React</h1>
      {drivers.map((driver) => (
        <div key={driver.id}>
          <div>{driver.id}</div>
          <div>{driver.name}</div>
          <div>{driver.team}</div>
        </div>
      ))}
    </>
  );
}

export default App;
