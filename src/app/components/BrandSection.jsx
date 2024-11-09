import React from 'react'
import { product } from '../utils/homepageproducts'
import BrandproductCard from './BrandproductCard'
function BrandSection() {

  return (
    <div className="w-full p-4">
        <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-5">
            {product.map((product) => (
                <BrandproductCard key={product.id} {...product} />
            ))}
        </div>
    </div>
  )
}

export default BrandSection