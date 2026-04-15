import React from "react";
import "./PaymentStatus.css";

const Cancel = () => {
  return (
    <div className="payment-status-page payment-cancel">
      <div className="payment-status-card">
        <div className="payment-icon">❌</div>
        <h2 className="payment-title">Payment Cancelled</h2>
        <p className="payment-message">
          Oops! Your payment was not completed. You can try again or choose
          another plan.
        </p>
        <a href="/subscription-plan" className="payment-btn">
          Try Again
        </a>
      </div>
    </div>
  );
};

export default Cancel;
