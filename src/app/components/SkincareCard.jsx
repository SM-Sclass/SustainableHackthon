"use client";
import React from "react";
import Image from "next/image";

function SkincareCard({ product_name, image_url, price, link, ingredients = [], reason, rating }) {
  const getBorderColor = (rating) => {
    if (rating <= 2) return "text-red-600";
    else if (rating > 2 && rating <= 5) return "text-orange-600";
    else if (rating > 5 && rating <= 7) return "text-yellow-600";
    else if (rating > 7) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 shadow-lg bg-white p-4 h-80 w-64 hover:cursor-pointer hover:-translate-y-1 duration-200 overflow-hidden">
      <div className="h-32 w-full flex justify-center items-center mb-3">
        {image_url ? (
          <Image src={image_url} alt={product_name} width={100} height={100} className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
          <p className="text-sm text-neutral-400">No image available</p>
        )}
      </div>
      <p className="text-neutral-800 font-semibold text-sm">{product_name || "Unknown Product"}</p>
      <a href={link} className="text-blue-600 text-sm mt-1 hover:underline">
        {price || "Price not available"}
      </a>
    </div>
  );
}

export default SkincareCard;
