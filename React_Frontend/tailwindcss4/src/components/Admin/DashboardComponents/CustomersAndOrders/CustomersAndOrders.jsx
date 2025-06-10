const CustomersAndOrders = () => {
  // Sample order data
  const orders = [
    {
      id: '#ORD-1001',
      customer: 'John Doe',
      date: '2023-05-15',
      amount: '$125.99',
      status: 'Pending',
      items: 3,
    },
    {
      id: '#ORD-1002',
      customer: 'Jane Smith',
      date: '2023-05-16',
      amount: '$89.50',
      status: 'Pending',
      items: 2,
    },
    {
      id: '#ORD-1003',
      customer: 'Robert Johnson',
      date: '2023-05-17',
      amount: '$234.75',
      status: 'Pending',
      items: 5,
    },
    {
      id: '#ORD-1004',
      customer: 'Emily Davis',
      date: '2023-05-18',
      amount: '$56.20',
      status: 'Pending',
      items: 1,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders and Customer Management</h1>
      <p className="mb-8">This page handles all order and customer-related administrative tasks.</p>
      
      <div className="grid gap-8">
        {/* Order Management Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-clipboard-list mr-2 text-blue-500"></i>
            Order Management
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        <i className="fas fa-check-circle mr-1"></i> Approve
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <i className="fas fa-times-circle mr-1"></i> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
         
        </div>
        
      
      </div>
    </div>
  )
}

export default CustomersAndOrders
