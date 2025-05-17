import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Product Approved',
        message: 'Your product "Premium Wireless Headphones" has been approved and is now live.',
        isRead: false,
        createdAt: '2023-05-15T10:30:00Z',
        priority: 'high',
        redirectUrl: '/products/123'
      },
      {
        id: 2,
        type: 'error',
        title: 'Product Rejected',
        message: 'Your product "Leather Wallet" was rejected due to quality issues.',
        isRead: false,
        createdAt: '2023-05-14T15:45:00Z',
        priority: 'high',
        redirectUrl: '/products/456'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Only 5 units left of "Smart Watch Pro". Consider restocking soon.',
        isRead: true,
        createdAt: '2023-05-13T09:20:00Z',
        priority: 'high',
        redirectUrl: '/inventory'
      },
      {
        id: 4,
        type: 'success',
        title: 'New Order Received',
        message: 'You have a new order #ORD-7894 for "Wireless Earbuds".',
        isRead: true,
        createdAt: '2023-05-12T14:10:00Z',
        priority: 'high',
        redirectUrl: '/orders/7894'
      },
      {
        id: 5,
        type: 'error',
        title: 'Order Cancelled',
        message: 'Order #ORD-6543 has been cancelled by the customer.',
        isRead: false,
        createdAt: '2023-05-11T11:25:00Z',
        priority: 'high',
        redirectUrl: '/orders/6543'
      },
      {
        id: 6,
        type: 'warning',
        title: 'Return Request',
        message: 'Customer has requested return for order #ORD-3217.',
        isRead: false,
        createdAt: '2023-05-10T16:40:00Z',
        priority: 'high',
        redirectUrl: '/returns/3217'
      },
      {
        id: 7,
        type: 'info',
        title: 'New Customer Question',
        message: 'Question received about "Bluetooth Speaker": "Is this waterproof?"',
        isRead: true,
        createdAt: '2023-05-09T13:15:00Z',
        priority: 'medium',
        redirectUrl: '/questions/123'
      },
      {
        id: 8,
        type: 'warning',
        title: 'Customer Complaint',
        message: 'Complaint received about delayed shipping for order #ORD-9876.',
        isRead: true,
        createdAt: '2023-05-08T10:05:00Z',
        priority: 'medium',
        redirectUrl: '/complaints/9876'
      },
      {
        id: 9,
        type: 'info',
        title: 'New Product Review',
        message: 'You received a 4-star review for "Wireless Charger".',
        isRead: true,
        createdAt: '2023-05-07T08:30:00Z',
        priority: 'medium',
        redirectUrl: '/reviews/456'
      },
      {
        id: 10,
        type: 'success',
        title: 'Payment Processed',
        message: 'Your payment of $1,245.00 for last week\'s sales has been processed.',
        isRead: false,
        createdAt: '2023-05-06T12:00:00Z',
        priority: 'high',
        redirectUrl: '/payments'
      },
      {
        id: 11,
        type: 'admin',
        title: 'Platform Update',
        message: 'New seller dashboard features will be rolled out next week.',
        isRead: true,
        createdAt: '2023-05-05T09:00:00Z',
        priority: 'medium',
        redirectUrl: '/announcements/1'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => 
      ({ ...notification, isRead: true })
    );
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const getIcon = (type) => {
    switch(type) {
      case 'success':
        return <i className="fa-solid fa-circle-check text-green-500 text-icon-md" />;
      case 'error':
        return <i className="fa-solid fa-circle-xmark text-red-500 text-icon-md" />;
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-icon-md" />;
      case 'admin':
        return <i className="fa-solid fa-shield-halved text-blue-500 text-icon-md" />;
      case 'seller':
        return <i className="fa-solid fa-cube text-indigo-500 text-icon-md" />;
      case 'info':
      default:
        return <i className="fa-solid fa-circle-info text-blue-400 text-icon-md" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">High</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">Medium</span>;
      case 'low':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">Low</span>;
      default:
        return null;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.redirectUrl) {
      navigate(notification.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm py-4 px-6">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700">
          Dashboard &gt; <span className="text-indigo-600">Notifications</span>
        </h1>
      </div>

      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fa-solid fa-bell text-indigo-500 text-icon-sm mr-2" />
                Notifications
              </h2>
              
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>All Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('success')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'success' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-circle-check text-green-500 text-icon-xs mr-2" />
                  <span>Approvals & Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('error')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'error' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-circle-xmark text-red-500 text-icon-xs mr-2" />
                  <span>Rejections & Issues</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('warning')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'warning' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-icon-xs mr-2" />
                  <span>Alerts</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'info' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-comment-dots text-blue-400 text-icon-xs mr-2" />
                  <span>Messages</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-shield-halved text-blue-500 text-icon-xs mr-2" />
                  <span>Announcements</span>
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={markAllAsRead}
                  className="w-full text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {activeTab === 'all' ? 'All Notifications' : 
                     activeTab === 'success' ? 'Approvals & Orders' :
                     activeTab === 'error' ? 'Rejections & Issues' :
                     activeTab === 'warning' ? 'Alerts' :
                     activeTab === 'info' ? 'Messages' : 'Announcements'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredNotifications.length} items
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-6 py-4 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(notification.priority)}
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="ml-2 flex-shrink-0">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <i className="fa-solid fa-bell-slash text-gray-400 text-4xl mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any {activeTab === 'all' ? '' : activeTab + ' '}notifications yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;