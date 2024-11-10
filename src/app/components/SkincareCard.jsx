"use client";
import React from "react";
import Image from "next/image";

function SkincareCard({ product_name, image_url, price, link, ingredients = [], reason, rating }) {
  const getBorderColor = (rating) => {
    if (rating <= 2) return "text-red-500";
    else if (rating > 2 && rating <= 5) return "text-orange-500";
    else if (rating > 5 && rating <= 7) return "text-yellow-500";
    else if (rating > 7) return "text-green-500";
    return "text-gray-500";
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-white h-60 p-4 hover:cursor-pointer hover:-translate-y-1 duration-200">
      <div className="h-28 flex justify-center items-center">
        {image_url ? (
          <Image src={image_url} alt={product_name} width={100} height={100} />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <p className="text-neutral-500 text-xs">{product_name || "Unknown Product"}</p>
      <a href={link} className="text-blue-500">
        {price || "Price not available"}
      </a>
      <p className={`${getBorderColor(rating)} text-xs mt-2`}>{reason || "No reason provided"}</p>
      <h4 className="font-semibold text-neutral-600 mt-2">Ingredients:</h4>
      <ul className="text-xs text-neutral-600 list-disc pl-4">
        {ingredients.length > 0
          ? ingredients.map((ingredient, idx) => <li key={idx}>{ingredient}</li>)
          : "No ingredients listed"}
      </ul>
    </div>
  );
}

export default SkincareCard;
