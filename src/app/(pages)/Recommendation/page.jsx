"use client";
import React, { useState, useEffect } from 'react'
import HistoryFoodRecommendation from '@/app/components/HistoryFoodRecommendation';
import HistoryFood from '@/app/components/HistoryFood';
import SkincareCard from '@/app/components/SkincareCard';
import { auth } from '@/app/utils/firebase';

function page() {

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('food-beverage');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const [user, setUser] = useState(null);
1

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // If user is authenticated, store user data
      } else {
        setUser(null); // If no user, set user state to null
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);





function getFirstTwoWords(sentence) {
  if (typeof sentence !== 'string' || sentence.trim() === '') {
    return '';  // Return an empty string or a default value if the sentence is invalid
  }
  const words = sentence.split(" ");
  return words.slice(0, 2).join(' ');
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search || !category) {
      setError("Please enter a search term and select a category");
      return;
    }

    setError("");
    setFetching(true);
    try {
      let res;
      if (category === "cosmetic") {
        res = await fetch("http://127.0.0.1:5000/cosmetic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_name: search }),
        });
      } else if (category === "food-beverage") {
        res = await fetch("http://127.0.0.1:5000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search }),
        });
      } else if (category === "cooling-appliance") {
        res = await fetch("http://127.0.0.1:5000/recommend_air_conditioner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_name: search }),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "An error occurred.");
        setResponse(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Unable to fetch data. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <>
      <div className="h-32 bg-white"></div>
      <div className="container w-full flex justify-center my-5 flex-col items-center">
        <form onSubmit={handleSubmit} className="flex relative w-3/4 sm:flex-col">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="food-beverage">Food & Beverage</option>
            <option value="cooling-appliance">Cooling Appliance</option>
            <option value="cosmetic">Cosmetics</option>
          </select>
          <input
            type="text"
            placeholder="Look for Sustainable"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-5 pr-12 py-3 text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            className={`absolute right-0 inset-y-0 pr-3 ${fetching ? "bg-blue-500" : "bg-transparent"}`}
            type="submit"
            disabled={fetching}
          >
            <svg
              className="svg-icon search-icon w-6 h-6 text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 19.9 19.7"
            >
              <g className="search-path" fill="none" stroke="#848F91">
                <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                <circle cx="8" cy="8" r="7" />
              </g>
            </svg>
          </button>
        </form>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="m-2 p-4">
        <h3 className="text-lg font-bold text-neutral-500 p-2">Search Results</h3>
        {response && category === "cosmetic" && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-neutral-600 my-2 p-2">{response.product_name || "No product name"}</p>
            <p className="text-sm my-1">{response.reason || "No reason provided"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {response.suggested_products?.map((product) => (
                <SkincareCard key={product.link} {...product} />
              ))}
            </div>
          </div>
        )}
        {
          response && category === "food-beverage" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {response.map((food) => (
                <HistoryFood key={food._id} {...food} />
              ))}
            </div>
          )
        }
      </div>

      {user && <HistoryFoodRecommendation />}
    </>
  );
}

export default Page;
