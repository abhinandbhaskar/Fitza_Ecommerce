import React, { useState, useEffect } from 'react';
import Header from '../../../components/User/Header/Header';
import Footer from '../../../components/User/Footer/Footer';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'warning',
        title: 'Items in your cart',
        message: 'You have 3 items left in your cart. Complete your purchase now!',
        isRead: false,
        createdAt: '2023-05-15T10:30:00',
        priority: 'high',
        redirectUrl: '/cart'
      },
      {
        id: 2,
        type: 'success',
        title: 'Order confirmed',
        message: 'Your order #12345 has been confirmed and is being processed.',
        isRead: true,
        createdAt: '2023-05-14T14:15:00',
        priority: 'high',
        redirectUrl: '/orders/12345'
      },
      {
        id: 3,
        type: 'success',
        title: 'Order shipped',
        message: 'Your order #12345 has been shipped. Expected delivery: May 18, 2023.',
        isRead: false,
        createdAt: '2023-05-15T09:00:00',
        priority: 'high',
        redirectUrl: '/orders/12345'
      },
      {
        id: 4,
        type: 'info',
        title: 'Password changed',
        message: 'Your account password was changed on May 13, 2023 at 4:30 PM.',
        isRead: true,
        createdAt: '2023-05-13T16:30:00',
        priority: 'high',
        redirectUrl: '/account/security'
      },
      {
        id: 5,
        type: 'error',
        title: 'Order cancelled',
        message: 'Your order #12346 has been cancelled as per your request.',
        isRead: false,
        createdAt: '2023-05-12T11:45:00',
        priority: 'high',
        redirectUrl: '/orders/12346'
      },
      {
        id: 6,
        type: 'success',
        title: 'New offer available',
        message: 'Get 20% off on summer dresses! Use code SUMMER20 at checkout.',
        isRead: true,
        createdAt: '2023-05-10T08:00:00',
        priority: 'medium',
        redirectUrl: '/offers'
      },
      {
        id: 7,
        type: 'success',
        title: 'Refund processed',
        message: 'Your refund for order #12344 has been processed. Amount will be credited within 3-5 business days.',
        isRead: false,
        createdAt: '2023-05-11T15:20:00',
        priority: 'high',
        redirectUrl: '/orders/12344'
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
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.isRead) 
      : notifications.filter(n => n.priority === activeTab);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success':
        return <i className="fa-solid fa-circle-check text-green-500 text-icon-xs mr-2" />;
      case 'error':
        return <i className="fa-solid fa-circle-xmark text-red-500 text-icon-xs mr-2" />;
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-icon-xs mr-2" />;
      case 'info':
        return <i className="fa-solid fa-circle-info text-blue-500 text-icon-xs mr-2" />;
      default:
        return <i className="fa-solid fa-bell text-purple-500 text-icon-xs mr-2" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>;
      case 'low':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Low</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-sm text-gray-600">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'unread' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setActiveTab('high')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'high' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  High Priority
                </button>
              </nav>
            </div>

            <div className="px-4 py-2 bg-gray-50 flex justify-end">
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                <i className="fa-solid fa-check-double mr-1" /> Mark all as read
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            {getPriorityBadge(notification.priority)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            <i className="fa-regular fa-clock mr-1" /> 
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                          <div className="flex space-x-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-purple-600 hover:text-purple-800"
                              >
                                <i className="fa-solid fa-check mr-1" /> Mark as read
                              </button>
                            )}
                            {notification.redirectUrl && (
                              <a 
                                href={notification.redirectUrl} 
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                <i className="fa-solid fa-arrow-up-right-from-square mr-1" /> View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-12 text-center">
                  <i className="fa-regular fa-bell-slash text-4xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'unread' 
                      ? "You don't have any unread notifications." 
                      : "You don't have any notifications in this category."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotificationPage;
