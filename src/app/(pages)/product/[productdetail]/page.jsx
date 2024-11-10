import React from 'react'
import { useParams } from 'next/navigation'
function page() {
    const { productdetail } = useParams()
    const [productDetails, setProductDetails] = useState('');
    useEffect( async() => {
        if(productdetail)
        {
            const res = await fetch("http://127.0.0.1:5000/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "prod_id": productdetail }),
              });
              const productDetail = await res.json();
              setProductDetails(productDetail);
        }
        console.log(productDetails)
    }, [productdetail])
    console.log(productdetail)
  return (
    <div>
        {productdetail}
    </div>
  )
}

export default page