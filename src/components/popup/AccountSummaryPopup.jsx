// export default AccountSummaryPopup;
import { Modal } from "react-bootstrap";
import { formatDateDisplay } from '../../utils/helper'

const AccountSummaryPopup = ({ isOpen, onClose, accountSummary }) => {


  const closeButton = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#000",
    color: "white",
    fontWeight: "500",
    fontSize: "20px",
    height: "25px",
    width: "25px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
  }
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="md"
      aria-labelledby="modal-title"
      backdrop="static"
      style={{
        // borderRadius: '15px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: '1000000000'
      }}
    >
      {/* Header with custom close button */}
      <div style={{ position: "relative", marginBottom: "15px" }}>
        {/* Circular Close Button */}
        <div
          onClick={onClose}
          style={closeButton}
        >
          ×
        </div>
        <h5
          id="modal-title"
          style={{
            textAlign: "center",
            fontWeight: "500",
            color: "#000429",
            marginTop: 0,
            paddingTop: "70px",
            fontSize: '28px'

          }}
        >
          Account Summary
        </h5>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "100%",
          width: "100%",
          minHeight: "250px",
        }}
      >
        {/* Body */}
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto", paddingTop: 0 }}>
          {accountSummary ? (
            <div style={{ fontSize: "16px", color: "#333" }}>
              {/* Start Date */}
              <div className="mb-3 d-flex">
                <strong style={{ color: '#000429' }}>Start Date:</strong>
                <span style={{ marginLeft: "5%", color: "#000400" }}>
                  {formatDateDisplay(accountSummary.account_start_date) || "N/A"}
                </span>
              </div>

              {/* End Date */}
              <div className="mb-3 d-flex">
                <strong style={{ color: '#000429' }}>End Date:</strong>
                <span style={{ marginLeft: "7%", color: "#000" }}>
                  {formatDateDisplay(accountSummary.account_end_date) || "N/A"}
                </span>
              </div>

              {/* Description */}
              <div className="mb-2">
                <strong style={{ color: '#000429' }}>Description:</strong>
              </div>
              <div
                style={{
                  fontWeight: 500,
                  borderRadius: "5px",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  maxHeight: "100px",
                  overflowY: "auto",
                  padding: "5px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {accountSummary.account_description || "...."}
              </div>

              {/* Amount and Interest */}
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <strong style={{ color: '#000429' }}>Amount:</strong>
                  <span style={{ marginLeft: "18%", color: "#000" }}>
                    ${parseFloat(accountSummary.daily_balance.toFixed(2)) ?? "0.00"}
                  </span>
                </div>
                <div style={{ marginRight: "25px" }}>
                  <strong style={{ color: '#000429' }}>Interest:</strong>
                  <span style={{ marginLeft: "18%", color: "#000" }}>
                    {parseFloat(accountSummary.interest_rate.toFixed(2)) ?? "0.00"}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>
          )}
        </Modal.Body>
      </div>
    </Modal >
  );
};

export default AccountSummaryPopup;


