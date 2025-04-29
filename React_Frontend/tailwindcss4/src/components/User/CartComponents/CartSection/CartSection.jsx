import React from 'react'

const CartSection = ({setCartView}) => {

    const cartItems = [
        { id: 1, name: "Product Name 1", price: 100, size: "M", quantity: 1 },
        { id: 2, name: "Product Name 2", price: 100, size: "L", quantity: 1 },
      ];
    
      const totalMRP = cartItems.reduce((acc, item) => acc + item.price, 0);
      const discount = 20;
      const shippingFee = 15;
      const platformFee = 10;
      const orderTotal = totalMRP - discount + shippingFee + platformFee;

  return (
    <div>
              {/* Cart Content */}
              <div className="container mx-auto px-[200px] py-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">My Cart</h3>
          <p className="text-gray-600 mb-8">You have {cartItems.length} item(s) in your cart.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Product Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row items-center"
                >
                  <img
                    src="https://via.placeholder.com/80"
                    alt={`${item.name} Image`}
                    className="w-24 h-24 rounded-md object-cover border"
                  />
                  <div className="flex-1 ml-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">
                      Price: <span className="font-bold">${item.price}</span>
                    </p>
                    <p className="text-gray-600">Size: {item.size}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <button className="text-red-600 font-semibold text-sm hover:underline mb-2">
                      Remove
                    </button>
                    <div className="flex items-center space-x-4">
                      Size : <select
                        name="size"
                        className="border border-gray-300 rounded-md px-3 py-1"
                      >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                      Quantity : <input
                        type="number"
                        className="border border-gray-300 rounded-md w-16 px-2 py-1"
                        placeholder="Qty"
                        defaultValue={item.quantity}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Price Details ({cartItems.length} items)
              </h2>
              <div className="border-b pb-4 mb-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP:</span>
                  <span>${totalMRP}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <span>-${discount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee:</span>
                  <span>${shippingFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee:</span>
                  <span>${platformFee}</span>
                </div>
              </div>
              <div className="flex justify-between text-gray-800 text-lg font-bold">
                <span>Order Total:</span>
                <span>${orderTotal}</span>
              </div>
              <button onClick={()=>setCartView("address")} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CartSection
