import React from 'react'
import Link from 'next/link'
import BrandSection from './BrandSection'


function BrandsSuggest() {
  return (
    <div className="w-full bg-[rgb(63,53,195)] p-5">
      <div className="mb-3 px-5">
      <Link className="text-white font-bold border border-yellow-500 rounded-md hover:bg-yellow-500 hover:border-yellow-500 hover:text-white px-4 py-2 transition-all duration-100"
              href={"/Brands"}>
              Brand Suggestion <i className="ri-leaf-line"></i>
        </Link>
      </div>
        
        <BrandSection/>
    </div>
  )
}

export default BrandsSuggest