// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';



interface PlantData {
  id: number;
  flower_name: string;
  Latin_name: string;
  attribute: string;
  flower_color: string;
  place: string;
  season: string;
}

const Page = () => {
  const [data, setData] = useState<PlantData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://usable-phoenix-67.hasura.app/v1/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query getPage {
                plant_api(order_by: { id: asc }) {
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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
        }

        const result = await response.json();

        if (result.errors) {
          setError(result.errors[0].message);
        } else {
          setData(result.data.plant_api);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">  
      <h1 className="mb-3 text-2xl font-semibold">新潟県立植物園の植物</h1>  
      {data && data.map(plant => (
      <div key={plant.id} className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
        <div style={{ maxWidth: '400px' }}>
        <h2 className="mb-3 text-2xl font-semibold">{plant.flower_name}</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Latin Name: {plant.Latin_name}<br />
            Attribute: {plant.attribute}<br />
            Flower Color: {plant.flower_color}<br />
            Place: {plant.place}<br />
            Season: {plant.season}
          </p>
          </div>
        </div>
      ))}
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.262398173277!2d139.10968623969575!3d37.76044511310291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4dbb8ed5c5377%3A0xff48a0701b799b9f!2z5paw5r2f55yM56uL5qSN54mp5ZyS!5e0!3m2!1sja!2sjp!4v1706593789740!5m2!1sja!2sjp" 
        width="400" 
        height="400" 
        style= {{border:'0'}} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms">
</iframe>

    </main>
  );
};

export default Page;
