"use client";
import React, { useState } from 'react'
import Form from 'next/form'
function page() {

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!search || !category){
      setError('Please enter a search term and select a category');
      return;
    } 
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:5000/search', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(search),  // adjust key based on backend expectation
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      } else {
        console.error('Error in API response:', res.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  return (
    <>
      <div className='h-32 bg-white'></div>
      <div className='container w-full flex justify-center my-5 flex-col items-center'>
        <Form onSubmit={handleSubmit} className="flex relative w-3/4 sm:flex-col">
          <select
            value={category}  // category state to track selected option
            onChange={(e) => setCategory(e.target.value)}  // update category on change
            className="absolute right-12 top-1/2 transform -translate-y-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white md:absolute focus:outline-none focus:ring-2 focus:ring-green-300 lg:absolute xl:absolute"
          >
            <option value="skincare">Skincare</option>
            <option value="food-beverage">Food & Beverage</option>
            <option value="home-appliance">Home Appliance</option>
          </select>
          <input type="text" placeholder="Look for Sustainable"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-5 pr-12 py-3 text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
          <button className='absolute right-0 inset-y-0 pr-3' type="submit"><svg
            className="svg-icon search-icon w-6 h-6 text-black"
            aria-labelledby="title desc"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 19.9 19.7"
          >
            <title id="title">Search Icon</title>
            <desc id="desc">A magnifying glass icon.</desc>
            <g className="search-path" fill="none" stroke="#848F91">
              <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
              <circle cx="8" cy="8" r="7" />
            </g>
          </svg></button>
        </Form>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </>


  )
}

export default page