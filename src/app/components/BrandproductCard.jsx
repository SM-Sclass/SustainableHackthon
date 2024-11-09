import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
function BrandproductCard(product) {
    const { title, webUrl, category,imagepath } = product;
  return (
    <div className="h-60">
        <Link href={webUrl} className="h-32">
        <div className="hover:shadow-2xl hover:-translate-y-1 duration-200 relative w-full h-full flex flex-col items-center justify-center">
            <div>
                <Image src={imagepath} alt={title} className="rounded-lg" fill></Image>
            </div>
            <div>
                <h3>{title}</h3>
                <p>{category}</p>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default BrandproductCard