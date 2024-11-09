"use client";
import React, { useState }from 'react'
import Form from 'next/form'
function page() {
  const [search, setSearch] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    // const res = await
  }
  return (
    <>
      <div className='h-32 bg-white'></div>
      <div className='container w-full flex justify-center my-5'>
        <Form onSubmit={handleSubmit} className="flex relative w-3/4">
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
      </div>
    </>


  )
}

export default page