import React from 'react'
import Image from "next/image";
import Link from "next/link";
function Showcase() {
  return (
    <div className="w-full flex flex-col  bg-custom-image bg-cover h-128 pt-28 lg:flex-row">
        <div className="container mt-6 p-4 w-full lg:w-1/2">
          <h1 className=" text-3xl md:text-4xl xl:text-5xl font-bold m-3">
            Contribute to the wonders of nature with
            <br />
            <span className="text-yellow-500"> Sustainable Products </span>
          </h1>
        </div>
      </div>
  )
}

export default Showcase