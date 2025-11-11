"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [city, setCity] = useState("Detecting...");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pgs, setPgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hyderabadAreas = [
    "KPHB",
    "Manikonda",
    "Gachibowli",
    "Madhapur",
    "Kondapur",
    "Ameerpet",
    "Banjara Hills",
    "Jubilee Hills",
  ];

  const filterTags = ["AC", "WiFi"];

  useEffect(() => {
    async function detectCity() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          const components = data.results[0].address_components;
          const cityComponent = components.find((c: any) =>
            c.types.includes("locality") ||
            c.types.includes("administrative_area_level_2") ||
            c.types.includes("administrative_area_level_1") ||
            c.types.includes("postal_town")
          );
          const cityName = cityComponent ? cityComponent.long_name : "Unknown";
          setCity(cityName);
        } else {
          setCity("Unknown");
        }
      });
    }
    detectCity();
  }, []);

  async function fetchPGs() {
    if (!selectedArea) return setError("Please select an area.");
    if (selectedTags.length === 0) return setError("Please select at least one filter.");

    setError("");
    setLoading(true);

    const query = `PG with ${selectedTags.join(" and ")} in ${selectedArea} ${city}`;
    const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.status === "OK") {
      const filtered = data.results.filter((pg: any) => pg.rating >= 4).slice(0, 10);
      setPgs(filtered);
    } else {
      setPgs([]);
    }

    setLoading(false);
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-start justify-start px-4 py-6 sm:px-6 md:px-10 space-y-6">
      <div className="text-black text-xl sm:text-2xl font-semibold">{city}</div>

      <>
        <div className="w-full max-w-xs">
          <label htmlFor="area" className="block text-black text-sm font-medium mb-2">
            Select Area
          </label>
          <select
            id="area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full border border-gray-400 rounded-md p-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Choose an area</option>
            {hyderabadAreas.map((area) => (
              <option key={area} value={area} className="text-black">
                {area}
              </option>
            ))}
          </select>
        </div>

        {selectedArea && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm border rounded-full transition ${
                  selectedTags.includes(tag)
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-400 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={fetchPGs}
          disabled={!selectedArea}
          className="mt-4 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:bg-gray-400"
        >
          Search PGs
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {loading && <p className="text-gray-500 text-sm mt-4">Loading PGs...</p>}

        {!loading && pgs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-6">
            {pgs.map((pg, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200 bg-white"
              >
                <h3 className="text-lg font-semibold text-gray-900">{pg.name}</h3>
                <p className="text-sm text-gray-600">{pg.formatted_address}</p>
                {pg.rating && (
                  <p className="text-sm text-yellow-600 mt-1 font-medium">
                    Rating: {pg.rating}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && pgs.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">No PGs found for this filter.</p>
        )}
      </>
    </main>
  );
}
//shit