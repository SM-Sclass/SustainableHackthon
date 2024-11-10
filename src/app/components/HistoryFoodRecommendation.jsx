"use client"
import React, { useEffect,useState } from 'react'
import HistoryFood from './HistoryFood'
import Image from "next/image";
function HistoryFoodRecommendation() {
    //db fetch


    const[history, setHistory] = useState([])
    const fetchHistory = async () => {
        try {
          const res = await fetch('http://127.0.0.1:5000/product-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": "8445290728791" }),  // adjust key based on backend expectation
          });
          if (res.ok) {
            const data = await res.json();
            setHistory(data);
          } else {
            console.error('Error in API response:', res.statusText);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
    
      // Call fetchHistory once when the component mounts
      useEffect(() => {
        fetchHistory();
      }, []); 
  return (
    <div className="m-3 p-4">
        <h3 className="text-lg font-bold text-neutral-500 p-2">Recommended Products</h3>
        <div className="w-full flex items-end p-2 hover:cursor-pointer"> <Image src="/SVGs/reload-arrow-svgrepo-com.svg" alt="Reload" width="25" height="25"/></div>
        <div className="p-2 grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-5">
            {history.map((historyFoodData) => (
                <HistoryFood key={historyFoodData._id} {...historyFoodData}/>
            ))}
        </div>
    </div>
  )
}

export default HistoryFoodRecommendation