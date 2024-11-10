"use client"
import React from 'react'
import Image from "next/image";
function SkiincareCard(skincareData) {
    //dbpush id
    function getFirstTwoWords(sentence) {
        if (typeof sentence !== 'string' || sentence.trim() === '') {
            return '';  // Return an empty string or a default value if the sentence is invalid
          }
        // Split the sentence by spaces and return the first two words
        const words = sentence.split(' ');
        return words.slice(0, 2).join(' ');
      }
    const {product_name, image_url} = SkincareData;
    const getBorderColor = () => {
        if(ecoscore_grade <= 20) return 'border-red-500';  // No harm
        else if (ecoscore_grade >= 20) return 'border-orange-500';  // Low harm
        else if (ecoscore_grade >= 50) return 'border-yellow-500';  // Moderate harm
        else if (ecoscore_grade >= 80) return 'border-green-500';  // Significant harm
        return 'border-grey-500';  // High harm
    };
    return (
        <div className={`flex flex-col items-center justify-center rounded-lg border-2 ${getBorderColor()} bg-white h-40 hover:cursor-pointer hover:-translate-y-1 duration-200`}>
            <div className="h-28 flex justify-center items-center">
            <Image src={image_url} alt={product_name} width="100" height="100"/>
            </div>
            <p className="text-neutral-500 text-xs p-1">{getFirstTwoWords(product_name)}</p>
        </div>
    )
}

export default SkiincareCard