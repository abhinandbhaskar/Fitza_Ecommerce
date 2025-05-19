import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const NotificationSection = ({countN,setCountN}) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();




    const fetchNotifications=async()=>{
      try{
        const response=await axios.get("https://127.0.0.1:8000/api/seller/view_sellerall_notifications/",{
          headers:{
            Authorization:`Bearer ${accessToken}`,
          }
        });
        console.log("BlooBlooo",response.data);
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.is_read).length);
        setCountN(response.data.filter(n => !n.is_read).length);
      }catch(errors){
        console.log("errors:",errors);
        console.log("errors:",errors.response.data);
      }
    }
  
    useEffect(()=>{
      fetchNotifications();
    },[]);
  


  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.redirect_url === activeTab);

  const getIcon = (type) => {
    switch(type) {
      case '/approvals/orders':
        return <i className="fa-solid fa-circle-check text-green-500 text-icon-md" />;
      case '/rejects':
        return <i className="fa-solid fa-circle-xmark text-red-500 text-icon-md" />;
      case '/seller/questions/':
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
    if (notification.redirectUrl) {
      navigate(notification.redirectUrl);
    }
  };

  const markAsRead=async(id)=>{

    console.log("OOO",id);

            try {
            const response = await axios.post(
                `https://127.0.0.1:8000/api/seller/marks_seller_read/${id}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(response);
            console.log(response.data);
            fetchNotifications();
          
        } catch (errors) {
            console.log(errors);
            console.log(errors.response.data);
        }

  }

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
                  onClick={() => setActiveTab('/approvals/orders')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'success' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-circle-check text-green-500 text-icon-xs mr-2" />
                  <span>Approvals & Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('/rejects')}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeTab === 'error' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <i className="fa-solid fa-circle-xmark text-red-500 text-icon-xs mr-2" />
                  <span>Rejections & Issues</span>
                </button>
                
                
                <button
                  onClick={() => setActiveTab('/seller/questions/')}
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
                                {new Date(notification.created_at).toLocaleDateString('en-US', {
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
                        {!notification.is_read && (
                          <div className="ml-2 flex-shrink-0">
                          
                           <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-gray-400 hover:text-gray-500"
                                                        title="Mark as read"
                                                    >
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>

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