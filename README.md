# 🛒 Fitza - AI-Powered Dress Selling E-commerce Platform

## 📖 Project Overview

**Fitza** is a modern, full-stack e-commerce platform for buying and selling dresses, built with AI integration and robust, scalable architecture. The platform serves customers, sellers, and administrators with a seamless experience across web and mobile devices.

---

## 🚀 Key Technologies Used

### Frontend

* React + Vite
* TailwindCSS
* React Redux

### Backend

* Django
* Django Rest Framework (DRF)
* JWT Token-based Authentication
* PostgreSQL Database
* Nginx & Gunicorn
* AWS for Backend Hosting

### Other Integrations

* Google OAuth2 Sign-In
* Razorpay Payment Gateway
* AI-Powered Product Recommendations
* AI Chatbot for Customer Support
* Netlify for Frontend Hosting

---

## 🌐 Live Demo

[https://fitza.netlify.app/] (https://fitza.netlify.app/)


---

## 👨‍💻 User-Facing Features

### Authentication & Account Management

* Email Registration with Verification
* Google OAuth Sign-In
* Password Reset
* Secure JWT Authentication

### Profile & Orders

* View & Edit Profile Details
* Address Book for Shipping/Billing
* Comprehensive Order History with Filters
* Detailed Order View with Tracking & Return Options
* Product Feedback & Reviews
* Account Deletion Option

### Product Discovery & Interaction

* Home, Men, Women, Kids, Offers Navigation
* Search & Filter Products by Category, Brand, Price, Color, Size
* Compare Similar Products Side by Side
* AI-Powered Product Recommendations
* Favourite Products List
* Deals of the Day & Offers Sections
* Product Quick View with Complete Details
* Add to Cart, Apply Coupons, Shipping Fee Calculation
* Razorpay & Cash on Delivery Payment Options

### Notifications & AI Features

* Product Offers & Refund Updates
* AI Chatbot for Customer Support
* AI-Powered Recommendations Based on Purchase History

---

## 🛍️ Seller Dashboard Features

### Business Insights

* Real-Time Metrics: Users, Products, Orders, Sales, Earnings, Reviews
* Top Selling Products & Sales Trends Chart
* Performance Analytics & Order Overview
* Live Notification System

### Product Management

* Add Products with Attribute & Image Management
* QC Approval Workflow (In Progress, Approved, Rejected)
* Product Filtering by Status

### Orders & Revenue

* View & Update Order Status (New, Confirmed, Shipped, Delivered, Cancelled)
* Revenue Dashboard with Earnings & Refund Tracking
* Detailed Recent Orders with Filtering Options

### Additional Features

* Q\&A Section for Customer Inquiries
* Reviews Management with Filtering
* Return & Refund Process with Escalation Handling
* Complaints & Feedback Management
* Seller Profile & Bank Details Management

---

## 🛠️ Admin Panel Functionalities

### System Management

* User & Seller Management with Approval Workflow
* Product Approval, Category & Attribute Control
* Banner Management for Homepage Promotions
* Discount & Coupon Campaigns Management
* Full Platform Revenue Tracking with Graphical Insights

### Operations

* Order Oversight & Seller Assignments
* Review Moderation Before Public Display
* Return & Refund Approvals
* Complaint Resolution with Seller Communication
* Feedback Collection from Sellers & Users

---

## 📂 Project Structure

```
Fitza_Ecommerce/
├── Backend/                # Django Backend API
│   ├── manage.py
│   ├── fitza/              # Django Project
│   └── api/                # Django Apps (Users, Orders, Products, etc.)
├── React_Frontend/         # React Frontend
│   ├── src/
│   ├── public/
│   └── tailwind.config.js
├── README.md
├── requirements.txt
```

---

## 📦 Backend Dependencies (requirements.txt highlights)

* Django 5.1.7
* djangorestframework 3.15.2
* djangorestframework\_simplejwt 5.5.0
* psycopg2-binary 2.9.10 (PostgreSQL Driver)
* django-cors-headers 4.7.0
* django-redis 6.0.0
* razorpay 1.4.2
* social-auth-app-django 5.4.3 (Google Sign-In)
* django-storages 1.14.6 (AWS S3 Integration)
* gunicorn 23.0.0 (Production WSGI Server)
* tensorflow\_cpu 2.19.0 (AI Features)
* AI Chatbot Dependencies
* Other essential utilities: numpy, requests, pillow, etc.

Full dependency list available in `requirements.txt`

---

## ⚙️ Setup Instructions

### Backend Setup

```bash
cd Backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd React_Frontend
npm install
npm run dev
```

### Environment Variables

Create `.env` files for both frontend and backend:

#### Django `.env`

```
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_postgres_db_url
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### React `.env`

```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 🤝 Contributing

* Fork the repository
* Create your feature branch (`git checkout -b feature/YourFeature`)
* Commit your changes (`git commit -m 'Add YourFeature'`)
* Push to the branch (`git push origin feature/YourFeature`)
* Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abhinand Bhaskar**
[LinkedIn](https://www.linkedin.com/in/abhinandbhaskar-m) | [GitHub](https://github.com/abhinandbhaskar) | [Portfolio](#)

---

## 📷 Screenshots 


### 🏠 Homepage
![Homepage](Fitza_Ecommerce/screenshots/fitzahome.jpg)
![Deals of the day section](Fitza_Ecommerce/screenshots/fitzadeals.jpg)
![Top collections section](Fitza_Ecommerce/screenshots/fitzatopcollections.jpg)

### 🛍️ Product Page
![Product Page](Fitza_Ecommerce/screenshots/fitzaproductview.jpg)

### 📊 Seller Dashboard
![Seller Dashboard](Fitza_Ecommerce/screenshots/sellerdashboard.jpg)

### ⚙️ Admin Panel
![Admin Panel](Fitza_Ecommerce/screenshots/admindashboard.jpg)

---

**Fitza** combines AI innovation, secure transactions, and a scalable structure to deliver a premium e-commerce experience for both customers and sellers.
