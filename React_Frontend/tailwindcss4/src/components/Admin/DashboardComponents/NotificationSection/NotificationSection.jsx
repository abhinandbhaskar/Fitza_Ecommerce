import React, { useState } from 'react';

const NotificationSection = () => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'seller_approval',
      title: 'New Seller Approval Pending',
      message: 'Seller "ElectroMart" has submitted documents for verification.',
      priority: 'high',
      status: 'pending',
      timestamp: '2023-05-20T10:30:00Z',
      metadata: { sellerId: 789 },
      read: false
    },
    {
      id: 2,
      type: 'refund_request',
      title: 'Refund Approval Needed',
      message: 'Order #456 - $120 refund requested for defective product.',
      priority: 'high',
      status: 'pending',
      timestamp: '2023-05-20T09:15:00Z',
      metadata: { orderId: 456, amount: 120 },
      read: false
    },
    {
      id: 3,
      type: 'product_approval',
      title: 'Product Flagged',
      message: 'Product #321 (Wireless Earbuds) reported for counterfeit branding.',
      priority: 'medium',
      status: 'pending',
      timestamp: '2023-05-19T14:20:00Z',
      metadata: { productId: 321 },
      read: true
    },
    {
      id: 4,
      type: 'system_alert',
      title: 'High Server Load',
      message: 'API response times are slower than usual (avg. 1200ms).',
      priority: 'high',
      status: 'pending',
      timestamp: '2023-05-19T11:05:00Z',
      read: false
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Tabs configuration
  const tabs = [
    { id: 'all', name: 'All Notifications', count: notifications.length },
    { id: 'high', name: 'Critical', count: notifications.filter(n => n.priority === 'high').length },
    { id: 'pending', name: 'Pending Actions', count: notifications.filter(n => n.status === 'pending').length },
    { id: 'seller', name: 'Seller Approvals', count: notifications.filter(n => n.type.includes('seller')).length },
    { id: 'orders', name: 'Order Approvals', count: notifications.filter(n => n.type.includes('order') || n.type.includes('refund')).length },
    { id: 'orders', name: 'Product Approvals', count: notifications.filter(n => n.type.includes('order') || n.type.includes('refund')).length },
    { id: 'orders', name: 'Return Refund Issues', count: notifications.filter(n => n.type.includes('order') || n.type.includes('refund')).length },
    { id: 'orders', name: 'complaints feedback', count: notifications.filter(n => n.type.includes('order') || n.type.includes('refund')).length }
  ];

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'high') return notification.priority === 'high';
    if (activeTab === 'pending') return notification.status === 'pending';
    if (activeTab === 'seller') return notification.type.includes('seller');
    if (activeTab === 'orders') return notification.type.includes('order') || notification.type.includes('refund');
    return true;
  });

  // Mark as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Resolve notification
  const resolveNotification = (id, action) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: action, read: true } : n
    ));
  };

  // Priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'seller_approval': return <i className="fa-solid fa-user-plus text-purple-500"></i>;
      case 'refund_request': return <i className="fa-solid fa-dollar-sign text-green-500 h-5 w-5"></i>;
      case 'product_approval': return <i className="fa-solid fa-tag text-blue-500 h-5 w-5"></i>;
      case 'system_alert': return <i className="fa-solid fa-server text-orange-500 h-5 w-5"></i>;
   
      default: return <i className="fa-solid fa-bell"></i>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              Admin Dashboard <span className="text-gray-400">/</span> <span className="text-indigo-600">Notifications</span>
            </h1>
            <div className="flex space-x-3">
              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200">
                Mark All as Read
              </button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Critical Alerts</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {notifications.filter(n => n.priority === 'high').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">Pending Actions</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {notifications.filter(n => n.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500">Seller Approvals</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {notifications.filter(n => n.type.includes('seller')).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Resolved Today</h3>
            <p className="text-2xl font-semibold text-gray-900">8</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 rounded-full py-0.5 px-2 text-xs font-medium ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Notifications List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-bell"></i>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">Everything looks good!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li key={notification.id} className={`${!notification.read ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-500'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.metadata && (
                          <button
                            onClick={() => setExpandedNotification(expandedNotification === notification.id ? null : notification.id)}
                            className="ml-2 flex items-center text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Details
                            {/* <ChevronDownIcon className={`ml-1 h-4 w-4 ${expandedNotification === notification.id ? 'transform rotate-180' : ''}`} /> */}
                            <i className="fa-solid fa-chevron-down text-icon-xs" />
                          </button>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm sm:mt-0 space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Mark as read"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                        {notification.status === 'pending' && (
                          <>
                            <button
                              onClick={() => resolveNotification(notification.id, 'approved')}
                              className="px-2 py-1 border border-green-300 rounded-md text-green-700 bg-green-50 text-sm hover:bg-green-100"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => resolveNotification(notification.id, 'rejected')}
                              className="px-2 py-1 border border-red-300 rounded-md text-red-700 bg-red-50 text-sm hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {expandedNotification === notification.id && notification.metadata && (
                      <div className="mt-2 bg-gray-50 p-3 rounded-md">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {JSON.stringify(notification.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;