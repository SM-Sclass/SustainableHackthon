"use client";
import React, { useState } from 'react'
import HistoryFoodRecommendation from '@/app/components/HistoryFoodRecommendation';
import HistoryFood from '@/app/components/HistoryFood';
import SkiincareCard from '@/app/components/SkincareCard';
function page() {

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search || !category) {
      setError('Please enter a search term and select a category');
      return;
    }
    setError('');
    console.log("Here222 ")
    try {
      if (category === 'food-beverage') {
        console.log("entere")
        setFetching(true);
        const res = await fetch('http://127.0.0.1:5000/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ search }),  // adjust key based on backend expectation
        });
        if (res.ok) {
          const data = await res.json();
          setResponse(data);
        }
        setFetching(false);
      }
      else if (category === 'cooling-appliance') {
        setFetching(true);
        const res = await fetch('http://127.0.0.1:5000/recommend_air_conditioner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "product_name": search }),  // adjust key based on backend expectation
        });
        if (res.ok) {
          const data = await res.json();
          setResponse(data);
        }
        setFetching(false);
      }
      else if (category === 'cosmetic') {
        setFetching(true);
        const res = await fetch('http://127.0.0.1:5000/cosmetic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "product_name": search }),  // adjust key based on backend expectation
        });
        if (res.ok) {
          const data = await res.json();
          setResponse(data);
        }
        setFetching(false);
      } 
    }
      catch (error) {
        console.error('Fetch error:', error);
        setFetching(false);
      }
    };
    return (
      <>
        <div className='h-32 bg-white'></div>
        <div className='container w-full flex justify-center my-5 flex-col items-center'>
          <form onSubmit={handleSubmit} className="flex relative w-3/4 sm:flex-col">
            <select
              value={category}  // category state to track selected option
              onChange={(e) => setCategory(e.target.value)}  // update category on change
              className="absolute right-12 top-1/2 transform -translate-y-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white md:absolute focus:outline-none focus:ring-2 focus:ring-green-300 lg:absolute xl:absolute"
            >
              <option value="food-beverage">Food & Beverage</option>
              <option value="cooling-appliance">Cooling appliance</option>
              <option value="cosmetic">Cosmetics</option>
            </select>
            <input type="text" placeholder="Look for Sustainable"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-12 py-3 text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            <button
              className={`absolute right-0 inset-y-0 pr-3 ${fetching ? 'bg-blue-500' : 'bg-transparent'}`}
              type="submit"
              disabled={fetching}
            >
              <svg className="svg-icon search-icon w-6 h-6 text-black" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7">
                <title id="title">Search Icon</title>
                <desc id="desc">A magnifying glass icon.</desc>
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
          <div className="p-2 grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-5">
          {(category==='skincare') && Objects.value(response).map((responseData) => (
              <SkiincareCard key={responseData._id} {...responseData} />
            ))}
            {(category==='food-bevarage' || category==='cooling-appliance')&& response.map((responseData) => (
              <HistoryFood key={responseData._id} {...responseData} />
            ))}
          </div>
        </div>
        <HistoryFoodRecommendation />
      </>


    )
  }

  export default page