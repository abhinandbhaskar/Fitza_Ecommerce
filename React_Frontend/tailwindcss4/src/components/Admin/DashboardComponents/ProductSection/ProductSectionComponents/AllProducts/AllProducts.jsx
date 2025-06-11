import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AllProducts = ({searchTerm}) => {

  const [productarr, setProductarr] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);
  const [filteredProducts,setFilteredProducts]=useState([]);

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

  },[searchTerm])


  return (
    <div className="min-h-screen bg-gray-100">
                    <div className="w-full bg-white shadow-md py-4 px-6">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
                    <span className="text-indigo-600">All Products</span>
                </h1>
            </div>
            <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                <th className="border border-gray-200 px-4 py-2">ID</th>
                <th className="border border-gray-200 px-4 py-2">Image</th>
                <th className="border border-gray-200 px-4 py-2">Product</th>
                <th className="border border-gray-200 px-4 py-2">Description</th>
                <th className="border border-gray-200 px-4 py-2">Action</th>
                <th className="border border-gray-200 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-100 text-sm text-gray-700"
                >
                  <td className="border border-gray-200 px-4 py-2">
                    #{product.id}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <img
                      src={
                        product.images &&
                        product.images.length > 0 &&
                        `https://127.0.0.1:8000${product.images[0].main_image}`
                      }
                      alt="category"
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {product.product.product_name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {/* Description field */}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button onClick={()=>Approve(product.id)} className="px-3 py-1 text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-600">
                      Approve
                    </button>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button className="px-3 py-1 text-white bg-red-500 rounded-lg shadow hover:bg-red-600">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
    </div>
  )
}

export default AllProducts
