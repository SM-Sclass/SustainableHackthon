import React from 'react'
import { useParams } from 'next/navigation'
function page() {
    const { productdetail } = useParams()
  return (
    <div>page</div>
  )
}

export default page