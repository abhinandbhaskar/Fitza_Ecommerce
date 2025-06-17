import React, { useState } from 'react';
import "./DeleteAccount.css";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  const handleDeactivate = async () => {
    if (!confirmDeactivate) {
      alert("Please confirm to deactivate your account.");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        "https://127.0.0.1:8000/api/accountDeactivate/",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Account deactivated successfully.");
      navigate('/login');
    } catch (errors) {
      console.log(errors);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account-container">
      <div className="delete-account-header">
        <div className="delete-icon">
          <i class="fa-solid fa-trash text-4xl"></i>
        </div>
        <h1>Account Deactivation</h1>
      </div>

      <div className="delete-account-content">
        <div className="deactivate-card">
          <div className="deactivate-form">
            <h2>Deactivate Account?</h2>
            <div className="confirmation-checkbox">
              <input
                id="confirmDeactivate"
                type="checkbox"
                checked={confirmDeactivate}
                onChange={(e) => setConfirmDeactivate(e.target.checked)}
              />
              <label htmlFor="confirmDeactivate">
                Yes, I want to deactivate my account
              </label>
            </div>
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className={`deactivate-button ${loading ? 'loading' : ''}`}
            >
              {loading ? "Deactivating..." : "Deactivate Account"}
            </button>
          </div>

          <div className="deactivate-info">
            <h3>What happens when you deactivate your account</h3>
            <ul>
              <li><i class="fa-solid fa-circle-exclamation"></i> Permanent loss of access to your profile, orders, and preferences</li>
              <li><i class="fa-solid fa-circle-exclamation"></i> Cancellation of any ongoing subscriptions</li>
              <li><i class="fa-solid fa-circle-exclamation"></i> Removal of your data from our platform</li>
              <li><i class="fa-solid fa-circle-exclamation"></i> This action is irreversible</li>
            </ul>
            <p className="consideration">
              Consider logging out instead if you just need a break. Contact support at 
              <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a> 
              if you have any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;