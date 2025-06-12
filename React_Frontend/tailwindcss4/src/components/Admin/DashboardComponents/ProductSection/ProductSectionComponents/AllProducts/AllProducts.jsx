import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { safe } from '../../../../../../utils/safeAccess';

const AllProducts = ({searchTerm,setnewCurrentView,viewall,setallView}) => {

  const [productarr, setProductarr] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);
  const [filteredProducts,setFilteredProducts]=useState([]);
  const [products,setProducts]=useState([]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        'https://127.0.0.1:8000/api/admin/view_all_product/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      setProductarr(response.data);
    } catch (errors) {
      console.error(errors);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(()=>{
    console.log("Product",searchTerm);

    if(searchTerm.trim()==="")
    {
      setFilteredProducts(productarr)
    }else{
      const filtered=productarr.filter(product=>{
        const productName = product.product.product_name.toLowerCase();
        const search = searchTerm.toLowerCase();
        return productName.includes(search);
      });
      setFilteredProducts(filtered);

    }

  },[searchTerm,productarr])



  
  const ViewProduct=async(id)=>{
    setallView(false);
    console.log("R",id);

    try{
      const response=await axios.get(`https://127.0.0.1:8000/api/admin/view_product/${id}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log("ii",response.data[0])
      setProducts(response.data[0])
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response.data);
    }

  }


  const Reject=async(id)=>{

    const adminData={
      "reason":"No",
    }

    try{
      const response=await axios.post(`https://127.0.0.1:8000/api/admin/reject_product/${id}/`,adminData,{
        "Content-Type":"application/json",
        headers:{
          Authorization:`Bearer ${accessToken}`,
        }
      });
      console.log(response);
      console.log(response.data);
      alert(response.data.message);
      fetchAllProducts();
    }catch(errors)
    {
      console.log(errors);
      console.log(errors.response);
    }
  }




  return (

    <div className="min-h-screen bg-gray-100">
      { viewall ?(
 <>
        <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    <span className="text-indigo-600">All Products</span>
                </h1>
            </div>
            <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                <th className="border border-gray-200 px-4 py-2">No.</th>
                <th className="border border-gray-200 px-4 py-2">Image</th>
                <th className="border border-gray-200 px-4 py-2">Product</th>
                <th className="border border-gray-200 px-4 py-2">Description</th>
                <th className="border border-gray-200 px-4 py-2">Price</th>
                <th className="border border-gray-200 px-4 py-2">Product Info</th>
                <th className="border border-gray-200 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product,key) => (
                <tr
                  key={safe(product,'id')}
                  className="hover:bg-gray-100 text-sm text-gray-700"
                >
                  <td className="border border-gray-200 px-4 py-2">
                    {key+1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <img
                      src={
                        safe(product,'images') &&
                        product.images.length > 0 &&
                        `https://127.0.0.1:8000${product.images[0].main_image}`
                      }
                      alt="category"
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {safe(product,'product.product_name','Not Added')}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                      {safe(product,'product.product_description','Not Added')}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                      Rs.{safe(product,'sale_price','Not Added')}
                  </td>
                    <td className="border border-gray-200 px-4 py-2">
                    <button onClick={()=>ViewProduct(product.id)} className="px-3 py-1 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600">
                      View
                    </button>
                  </td>
                  
                  <td className="border border-gray-200 px-4 py-2">
                    <button  onClick={()=>Reject(product.id)} className="px-3 py-1 text-white bg-red-500 rounded-lg shadow hover:bg-red-600">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 </>
        ):(
<div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-6 p-6 space-y-6">
        {/* Main Image */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-gray-700">Main Image</h2>
        {/* <p>{products.images?.main_image||""}</p> */}
        <img
          src={
            safe(products,'images') &&
            products.images.length > 0 &&
            `https://127.0.0.1:8000${products.images[0].main_image}`
          }
          alt="Main Product"
          className="w-48 h-48 object-cover border border-gray-200 rounded-lg mt-4"
        />
      </div>

      {/* Sub Images */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Sub Images</h3>
        <div className="flex space-x-4 mt-4">
          <img
          src={
            safe(products,'images') &&
            products.images.length > 0 &&
            `https://127.0.0.1:8000${products.images[0].sub_image_1}`
          }
            alt="Sub Image 1"
            className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
          />
          <img
          src={
            safe(products,'images') &&
            products.images.length > 0 &&
            `https://127.0.0.1:8000${products.images[0].sub_image_2}`
          }
            alt="Sub Image 2"
            className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
          />
          <img
          src={
            safe(products,'images') &&
            products.images.length > 0 &&
            `https://127.0.0.1:8000${products.images[0].sub_image_3}`
          }
            alt="Sub Image 3"
            className="w-24 h-24 object-cover border border-gray-200 rounded-lg"
          />
        </div>
      </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {[
    { label: "Product Name", placeholder: "Pant", value: products?.product?.product_name || "" },
    { label: "Product Description", placeholder: "", value: products?.product?.product_description || "" },
    { label: "Category", placeholder: "", value: products.category?.category_name  || "" },
    { label: "Sub category", placeholder: "", value: products.category?.category_description  || "" },
    { label: "Brand", placeholder: "", value: products.brand?.brand_name || "" },
    { label: "Shop", placeholder: "", value: products.shop?.shop_name || "" },
    { label: "Model Height", placeholder: "", value: products.product?.model_height || "" },
    { label: "Model Wearing", placeholder: "", value: products.product?.model_wearing || "" },
    { label: "Care Instruction", placeholder: "", value: products.product?.care_instructions || "" },
    { label: "About", placeholder: "", value: products.product?.about || "" },
    { label: "Color", placeholder: "", value: products.color?.color_name || "" },
    { label: "Size", placeholder: "", value: products.size?.size_name || "" },
    { label: "Quantity in Stock", placeholder: "", value: products?.quantity_in_stock || "" },
    { label: "Original Price", placeholder: "", value: products?.original_price || "" },
    { label: "Sale Price", placeholder: "", value: products?.sale_price || "" },
    { label: "Product Code", placeholder: "", value: products?.product_code || "" },
  ].map((field, index) => (
    <div key={index} className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 mb-1">
        {field.label}
      </label>
      <input
        type="text"
        placeholder={field.placeholder}
        value={safe(field,'value')}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        readOnly
      />
    </div>
  ))}

</div>


  </div>
        )}
      
    </div>
  )
}

export default AllProducts
