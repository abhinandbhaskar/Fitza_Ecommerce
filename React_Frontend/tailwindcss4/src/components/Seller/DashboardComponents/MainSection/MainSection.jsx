import React from 'react'
import profile from "../../../../assets/profile.jpg";
const MainSection = () => {
  return (
    <>
    {/* Header Section */}
    <div className="bg-amber-500 rounded-lg shadow-md mb-4">
        <div className="bg-white border border-gray-300 flex items-center px-6 py-3 rounded-t-lg">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard &gt;</h1>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-800 p-4 flex gap-4 rounded-b-lg">
            <div className="grid grid-cols-3 gap-4 flex-grow">
                {[
                    { title: "Total Users", count: 277, bgColor: "bg-green-500" },
                    { title: "Total Sellers", count: 277, bgColor: "bg-pink-500" },
                    { title: "Total Orders", count: 277, bgColor: "bg-violet-500" },
                    { title: "Total Products", count: 277, bgColor: "bg-blue-500" },
                    { title: "Total Revenue", count: 277, bgColor: "bg-yellow-500" },
                    { title: "Total Reviews", count: 277, bgColor: "bg-red-500" },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className={`h-40 flex flex-col items-start justify-center p-4 rounded-2xl shadow-md ${stat.bgColor}`}
                    >
                        <h1 className="text-white text-lg font-semibold">{stat.title}</h1>
                        <h3 className="text-white text-3xl font-bold">{stat.count}</h3>
                    </div>
                ))}
            </div>

            <div className="w-1/4 bg-orange-300 rounded-2xl shadow-md flex items-center justify-center text-xl font-semibold text-gray-700">
                Total Sales
            </div>
        </div>
    </div>

    {/* Seller Approvals Section */}
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">Seller Approvals</h1>
        <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        {[
                            "SellerId",
                            "Seller Name",
                            "Shop",
                            "Email",
                            "Phone",
                            "Photo",
                            "More Info",
                            "Approve",
                            "Reject",
                        ].map((heading, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 border-b"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">#111</td>
                        <td className="px-4 py-2 border-b">Ajitha</td>
                        <td className="px-4 py-2 border-b">Lavanya Silks</td>
                        <td className="px-4 py-2 border-b">aji@gmail.com</td>
                        <td className="px-4 py-2 border-b">8848993973</td>
                        <td className="px-4 py-2 border-b">
                            <img
                                src={profile}
                                className="h-16 w-16 rounded-full object-cover"
                                alt="Seller"
                            />
                        </td>
                        <td className="px-4 py-2 border-b">More Info</td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                Approve
                            </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Reject
                            </button>
                        </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">#111</td>
                        <td className="px-4 py-2 border-b">Ajitha</td>
                        <td className="px-4 py-2 border-b">Lavanya Silks</td>
                        <td className="px-4 py-2 border-b">aji@gmail.com</td>
                        <td className="px-4 py-2 border-b">8848993973</td>
                        <td className="px-4 py-2 border-b">
                            <img
                                src={profile}
                                className="h-16 w-16 rounded-full object-cover"
                                alt="Seller"
                            />
                        </td>
                        <td className="px-4 py-2 border-b">More Info</td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                Approve
                            </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Reject
                            </button>
                        </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">#111</td>
                        <td className="px-4 py-2 border-b">Ajitha</td>
                        <td className="px-4 py-2 border-b">Lavanya Silks</td>
                        <td className="px-4 py-2 border-b">aji@gmail.com</td>
                        <td className="px-4 py-2 border-b">8848993973</td>
                        <td className="px-4 py-2 border-b">
                            <img
                                src={profile}
                                className="h-16 w-16 rounded-full object-cover"
                                alt="Seller"
                            />
                        </td>
                        <td className="px-4 py-2 border-b">More Info</td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                Approve
                            </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Reject
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">Best Selling Products</h1>
        <div className="w-full h-[100px] flex flex-row gap-8">
          <div className="flex flex-col">
            <label htmlFor=" " className="text-sm font-bold">SHOW BY</label>
           
              <select name="" className="pr-32 pl-2 py-2 bg-gray-400 rounded-md" id="">
                <option value="">10 Row</option>
                <option value="">12 Row</option>
                <option value="">14 Row</option>
              </select>
            
          </div>

          <div className="flex flex-col">
            <label htmlFor=" " className="text-sm font-bold">CATEGORY BY</label>
           
              <select name="" className="pr-32 pl-2 py-2 bg-gray-400 rounded-md" id="">
                <option value="">Mans</option>
                <option value="">Womens</option>
                <option value="">Childrens</option>
              </select>
            
          </div>

          <div className="flex flex-col">
            <label htmlFor=" " className="text-sm font-bold">BRAND BY</label>
           
              <select name="" className="pr-32 pl-2 py-2 bg-gray-400 rounded-md" id="">
                <option value="">Ecstasy</option>
                <option value="">Zoodio</option>
            
              </select>
            
          </div>

          <div className="flex flex-col">
            <label htmlFor=" " className="text-sm font-bold">SEARCH BY</label>
           
           <input type="text" className="pr-22 pl-2 py-2 bg-gray-400 rounded-md" placeholder="id/name/category/brand" />
            
          </div>


        </div>
        <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        {[
                            "SellerId",
                            "Seller Name",
                            "Shop",
                            "Email",
                            "Phone",
                            "Photo",
                            "More Info",
                            "Approve",
                            "Reject",
                        ].map((heading, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 border-b"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">#111</td>
                        <td className="px-4 py-2 border-b">Ajitha</td>
                        <td className="px-4 py-2 border-b">Lavanya Silks</td>
                        <td className="px-4 py-2 border-b">aji@gmail.com</td>
                        <td className="px-4 py-2 border-b">8848993973</td>
                        <td className="px-4 py-2 border-b">
                            <img
                                src={profile}
                                className="h-16 w-16 rounded-full object-cover"
                                alt="Seller"
                            />
                        </td>
                        <td className="px-4 py-2 border-b">More Info</td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                Approve
                            </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Reject
                            </button>
                        </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">#111</td>
                        <td className="px-4 py-2 border-b">Ajitha</td>
                        <td className="px-4 py-2 border-b">Lavanya Silks</td>
                        <td className="px-4 py-2 border-b">aji@gmail.com</td>
                        <td className="px-4 py-2 border-b">8848993973</td>
                        <td className="px-4 py-2 border-b">
                            <img
                                src={profile}
                                className="h-16 w-16 rounded-full object-cover"
                                alt="Seller"
                            />
                        </td>
                        <td className="px-4 py-2 border-b">More Info</td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                Approve
                            </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Reject
                            </button>
                        </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">#111</td>
                        <td className="px-4 py-2 border-b">Ajitha</td>
                        <td className="px-4 py-2 border-b">Lavanya Silks</td>
                        <td className="px-4 py-2 border-b">aji@gmail.com</td>
                        <td className="px-4 py-2 border-b">8848993973</td>
                        <td className="px-4 py-2 border-b">
                            <img
                                src={profile}
                                className="h-16 w-16 rounded-full object-cover"
                                alt="Seller"
                            />
                        </td>
                        <td className="px-4 py-2 border-b">More Info</td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                Approve
                            </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Reject
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div className="w-full px-4 border-1 border-gray-500 shadow-xl mb-2 mt-2 rounded-2xl">
      <h1>Recent Orders</h1>
    </div>

    <div className="w-full px-4 border-1 border-gray-500 shadow-xl mb-2 mt-2 rounded-2xl" >
      <h1>Platform Revenue & Report</h1>
    </div>
</>
  )
}

export default MainSection
