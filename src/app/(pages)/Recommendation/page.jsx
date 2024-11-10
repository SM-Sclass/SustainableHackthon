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
  const[rating, setRating] = useState(0);
  const [active, setActive] = useState(null);
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
          body: JSON.stringify({"search": search }),  // adjust key based on backend expectation
        });
        if (res.ok) {
          const data = await res.json();
          setResponse(data);
          console.log(data)
        }
        console.log(response)
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
        const productrating= getBorderColor(data.rating)
        setRating(productrating)
        setFetching(false);
      } 
    }
      catch (error) {
        console.error('Fetch error:', error);
        setFetching(false);
      }
    };

    const renderCategoryComponent = () => {
      if (category === 'food-beverage') {
        return response.map((item) => <HistoryFood key={item._id} {...item} />);
      } else if (category === 'cooling-appliance') {
        return response.map((item) => <HistoryFood key={item._id} {...item} />);
      } else if (category === 'cosmetic') {
        return response.map((item)=> <SkincareCard {...item}/>);
      } else {
        return <p>No data available for this category</p>;
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
              className="absolute right-12 cursor-pointer top-1/2 transform -translate-y-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white md:absolute focus:outline-none focus:ring-2 focus:ring-green-300 lg:absolute xl:absolute"
            >
              <option value="food-beverage" className='cursor-pointer'>Food & Beverage</option>
              <option value="cooling-appliance" className='cursor-pointer'>Cooling appliance</option>
              <option value="cosmetic" className='cursor-pointer'>Cosmetics</option>
            </select>
            <input type="text" placeholder="Look for Sustainable"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-12 py-3 text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            <button
              className={`absolute right-0 inset-y-0 pr-3 ${fetching ? 'bg-lime-600' : 'bg-white'}`}
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
          {renderCategoryComponent()}
        </div>
          {user && <HistoryFoodRecommendation />}
        
      </>


    )
  }

  export default page