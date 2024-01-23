// src/App.js

import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://usable-phoenix-67.hasura.app/api/rest/getpage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query getPage  {
                plant_api {
                    id
                    flower_name
                    Latin_name
                    attribute
                    flower_color
                    place
                    season
                }
              }
              
            `,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          setError(result.errors[0].message);
        } else {
          setData(result.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return (
    <div>
    <h1>Plant Data</h1>
    <ul>
        {data.plant_api.map(plant => (
        <li key={plant.id}>
            <p>ID: {plant.id}</p>
            <p>Flower Name: {plant.flower_name}</p>
            <p>Latin Name: {plant.Latin_name}</p>
            <p>Attribute: {plant.attribute}</p>
            <p>Flower Color: {plant.flower_color}</p>
            <p>Place: {plant.place}</p>
            <p>Season: {plant.season}</p>
        </li>
        ))}
    </ul>
    </div>
    );
}

export default App;
