import React from 'react'
import CategoryDisplay from '../../components/CategoryDisplay'
import { suggestionBrand } from '@/app/utils/suggestionBrand'


function page() {

  return (
    <>
    <div className="h-32 bg-white">
    </div>
    <div className="m-2 flex flex-col justify-center items-center">
        <h1 className="text-neutral-800">Sustainable Brands</h1>
        {suggestionBrand.map(category => (
        <CategoryDisplay key={category.id} {...category}/>))}
      </div>
    </>
    
  )
}

export default page