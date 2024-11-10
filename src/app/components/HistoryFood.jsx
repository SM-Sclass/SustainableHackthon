"use client"
import React from 'react'
import Image from "next/image";
function HistoryFood(historyFoodData) {
    //dbpush id

    const {product_name, img, ecoscore_grade} = historyFoodData;
    const getBorderColor = () => {
        if (ecoscore_grade >= 20) return 'border-orange-500';  // Low harm
        else if (ecoscore_grade >= 50) return 'border-yellow-500';  // Moderate harm
        else if (ecoscore_grade >= 80) return 'border-green-500';  // Significant harm
        return 'border-red-500';  // High harm
    };
    return (
        <div className={`flex flex-col items-center justify-center rounded-lg border-2 ${getBorderColor()} bg-white h-40 hover:cursor-pointer hover:-translate-y-1 duration-200`} onClick="">
            <div className="h-28 flex justify-center items-center">
            <Image src={img} alt={product_name} width="100" height="100"></Image>
            </div>
            <p className="text-neutral-500 text-xs p-1">{product_name}</p>
        </div>
    )
}

export default HistoryFood