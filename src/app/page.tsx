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
    <main className="flex min-h-screen flex-wrap items-center justify-between p-24">
      {/* ... (既存のコードをそのままコピー) */}
      {data && data.map(plant => (
        <div key={plant.id} className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">{plant.flower_name}</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Latin Name: {plant.Latin_name}<br />
            Attribute: {plant.attribute}<br />
            Flower Color: {plant.flower_color}<br />
            Place: {plant.place}<br />
            Season: {plant.season}
          </p>
        </div>
      ))}
    </main>
  );
};

export default Page;
