import React, { useEffect, useState } from "react";
import "./PaymentStatus.css";
import { useDispatch, useSelector } from "react-redux";
import { newSubscription } from "../../../redux/slices/subscriptionPlanSlice";




const Success = () => {

  const dispatch = useDispatch();
  const { subscriptionData } = useSelector((state) => state.subscriptionPlan)
  useEffect(() => {
    dispatch(newSubscription());
  }, [dispatch])

  const userData = JSON.parse(localStorage.getItem('trust-account'));
  
  if (userData && userData.userData) {
    userData.userData.super_admin_selected_plan = '';
  }

  localStorage.setItem('trust-account', JSON.stringify(userData));

  console.log("object", userData)
  // const subscriptionData = {
  //   subscriptionId: '165784',  // Clear key name
  // };
  console.log("fiystugsiogos", subscriptionData)
  useEffect(() => {
    if (subscriptionData) {
      localStorage.setItem('isSubscribed', JSON.stringify(subscriptionData))
    }
  }, [subscriptionData])

  const handleRediractUrl = () => {
    const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
    const firstAccessible = permissionsList.find(
      item => item?.has_read_permission === 1 || item?.has_read_permission === '1'
    );
    if (firstAccessible?.url) {
      window.location.href = firstAccessible.url;
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return (
    <div className="payment-status-page payment-success">
      <div className="payment-status-card">
        <div className="payment-icon">✅</div>
        <h2 className="payment-title">Payment Successful</h2>
        <p className="payment-message">
          Thank you! Your subscription has been activated. A confirmation email
          has been sent to you.
        </p>
        <a onClick={() => handleRediractUrl()} href="#" className="payment-btn">
          Go to dashboard
        </a>
      </div>
    </div>
  );
};

export default Success;
