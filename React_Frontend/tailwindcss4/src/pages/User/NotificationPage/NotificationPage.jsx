import React, { useState, useEffect } from 'react';
import Header from '../../../components/User/Header/Header';
import Footer from '../../../components/User/Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { safe } from '../../../utils/safeAccess';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from "react-router-dom";

const NotificationPage = ({countsN,setNcounts,cartCount}) => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [recommendations, setRecommendations] = useState({ products: [], message: '' });
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchNotifications = async() => {
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/view_user_all_notifications/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log("BlooBlooo", response.data);
      setNotifications(safe(response, 'data'));
      setUnreadCount(response.data.filter(n => !n.is_read).length);
      setNcounts(response.data.filter(n => !n.is_read).length);
    } catch(errors) {
      console.log("errors:", errors);
      console.log("errors:", errors.response.data);
    }
  }

  const fetchRecommendations = async() => {
    setIsLoadingRecs(true);
    try {
      const response = await axios.get("https://127.0.0.1:8000/api/recommendations/ai/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log("recommendations", response.data);
      setRecommendations({
        products: response.data.products || [],
        message: response.data.message || ''
      });
    } catch(error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to load recommendations");
      setRecommendations({
        products: [],
        message: 'Failed to load recommendations'
      });
    } finally {
      setIsLoadingRecs(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    
  }, []);

  useEffect(() => {
    if (activeTab === 'recommendations') {
      fetchRecommendations();
    }
  }, [activeTab]);

  const markAsRead = async(id) => {
    console.log("MarksAs", id);
    try {
      const response = await axios.post(
        `https://127.0.0.1:8000/api/marks_user_read/${id}/`,
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
      toast.success('mark as read');
      fetchNotifications();
    } catch (errors) {
      console.log(errors);
      console.log(errors.response.data);
      toast.error("error");
    }
  };


  const AddToCart = (id) => {
      console.log("clicked");
      if(!accessToken || accessToken.length === 0) {
          toast.error("You need to login first!");
          return;
      }
      console.log("Yo Yo", id);
      navigate(`/productview/${id}`);
      
     
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.is_read) 
      : activeTab === 'high'
        ? notifications.filter(n => n.priority === activeTab)
        : [];

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
      <Header countsN={countsN} cartCount={cartCount} />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-sm text-gray-600">
              {activeTab !== 'recommendations' && (unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!')}
              {activeTab === 'recommendations' && 'Personalized recommendations just for you'}
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
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'recommendations' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <i className="fa-solid fa-robot mr-1" /> Recommendations
                </button>
              </nav>
            </div>

            <div className="divide-y divide-gray-200">
              {activeTab !== 'recommendations' ? (
                filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <div 
                      key={safe(notification,'id')} 
                      className={`px-4 py-4 hover:bg-gray-50 ${!safe(notification,'isRead') ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!safe(notification,'isRead') ? 'text-gray-900' : 'text-gray-600'}`}>
                              {safe(notification,'title')}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              {getPriorityBadge(notification.priority)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {safe(notification,'message')}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              <i className="fa-regular fa-clock mr-1" /> 
                              {new Date(safe(notification,'created_at')).toLocaleString()}
                            </p>
                            <div className="flex space-x-2">
                              {!safe(notification,'is_read') && (
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
                )
              ) : (
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <i className="fa-solid fa-robot text-purple-500 mr-2" /> AI-Powered Recommendations
                  </h3>
                  
                  {isLoadingRecs ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : recommendations.products && recommendations.products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.products.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start">
                            {product.items?.[0]?.images?.[0]?.main_image && (
                              <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
                                <img 
                                  // src={product.items[0].images[0].main_image} 
                                  src={'https://127.0.0.1:8000'+product.items?.[0]?.images?.[0]?.main_image || ''} 
                                  alt={product.product_name} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/96";
                                  }}
                                />
                              </div>
                            )}
                            <div className="ml-4 flex-1">
                              <h4 className="font-medium text-gray-900">{product.product_name}</h4>
                              <p className="text-sm text-gray-500 mt-1">{product.about}</p>
                              <div className="mt-2 flex items-center">
                                {product.items?.[0]?.final_price && (
                                  <span className="text-sm font-medium text-purple-600">
                                    ₹{product.items[0].final_price}
                                  </span>
                                )}
                                {product.category?.category_name && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {product.category.category_name}
                                  </span>
                                )}
                              </div>
                              <button
                                // href={`/product/${product.id}`}
                                onClick={() => AddToCart(product.id)}
                                className="mt-3 inline-block w-full bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium py-1 px-3 rounded-md text-center transition-colors"
                              >
                                View Product
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <i className="fa-solid fa-magnifying-glass text-4xl text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {recommendations.message || "No recommendations found"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {recommendations.message 
                          ? recommendations.message 
                          : "We couldn't find any personalized recommendations for you at this time."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />    
      </div>
      <Footer />
    </>
  );
};

export default NotificationPage;