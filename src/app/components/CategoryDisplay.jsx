"use client"
import React from 'react'
import Image from "next/image";
function CategoryDisplay(category) {
    const {categoryImg, categoryBrands, categoryName, categoryRoute} = category;
  return (
    <div className="w-full bg-white">
        <Link className="h-32" href={categoryRoute}>
        <div className="flex">  
            <div className="">
                <Image src={categoryImg} alt={categoryName}></Image>
            </div>
            <div>
                {categoryBrands.map(brand=> (
                    <div className="hover:shadow-2xl hover:-translate-y-1 duration-200 relative w-full h-full flex flex-col items-center justify-center">
                        <Image src={brand.image} alt={brand.brandName} fill></Image>
                        <span className="text-neutral-600">{brand.brandName}</span>
                    </div>
                ) )}
            </div>
        </div>
        </Link>
        
    </div>
  )
}

export default CategoryDisplay