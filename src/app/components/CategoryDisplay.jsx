"use client"
import React from 'react'
import Image from "next/image";
import Link from "next/link";
function CategoryDisplay(category) {
    const {categoryImg, categoryBrands, categoryName, categoryRoute} = category;
  return (
    <div className="w-9/12 bg-white h-40 rounded-lg mt-5">
        <Link className="" href={categoryRoute}>
        <div className="flex items-center justify-center p-3">  
            <div className="bg-white px-2 h-min">
                <Image src={categoryImg} alt={categoryName} width="100" height="100"></Image>
            </div>
            <div className="hidden w-full item-center justify-center gap-x-10 md:hidden lg:flex">
                {categoryBrands.map(brand=> (
                    <CategoryDisplayCard key={brand.id} {...brand}/>
                ) )}
            </div>
        </div>
        </Link>
        
    </div>
  )
}

const CategoryDisplayCard= (brand)=>{
    const {image, brandName} = brand;
    return (
        <div className="flex flex-col items-center justify-center rounded-lg bg-">
            <div className="h-28 flex justify-center items-center">
            <Image src={image} alt={brandName} width="100" height="100"></Image>
            </div>
            <p className="text-neutral-500 text-xs p-1">{brandName}</p>
        </div>
    )
}

export default CategoryDisplay