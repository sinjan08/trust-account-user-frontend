import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { formatDateDisplay } from "../../utils/helper";

const DetailTransactionsPopup = ({ isOpen, onClose, accountSummary }) => {
  const [formattedDate, setFormattedDate] = useState('');


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

  useEffect(() => {
    if (accountSummary?.date) {
      const [y, m, d] = accountSummary.date.split("-");
      setFormattedDate(`${d}/${m}/${y}`);
    }
  }, [accountSummary]);

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="sm"
      aria-labelledby="modal-title"
      backdrop="static"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: '1000000000',
        background: "none",
      }}
    >
      <div style={{ position: "relative", marginBottom: "5px" }}>

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
            fontSize: '22px'

          }}
        >
          Detail Transactions
        </h5>
      </div>
      <div
        style={{
          // backgroundColor: "#fff",
          // borderRadius: "12px",
          padding: "5px",
          maxHeight: "100%",
          maxWidth: "100%",
        }}
      >
        <Modal.Body>
          {accountSummary ? (
            <div style={{ fontSize: "16px", color: "#333" }}>
              {/* Date */}
              <div className="d-flex mb-2" style={{ gap: "145px", alignItems: "center" }}>
                <strong style={{ color: '#000429' }}>Date:</strong>
                <span style={{ color: '#000400' }}>{formatDateDisplay(accountSummary?.date) || "N/A"}</span>
              </div>

              {/* Transaction Type */}
              <div className="d-flex mb-2" style={{ gap: "98px", alignItems: "center" }}>
                <strong style={{ color: '#000429' }}>Transaction:</strong>
                <span className="text-capitalize" style={{ color: '#000400' }}>{accountSummary.transaction_details?.type || "N/A"}</span>
              </div>

              {/* Balance */}
              <div className="d-flex mb-2" style={{ gap: "120px", alignItems: "center" }}>
                <strong style={{ color: '#000429' }}>Balance:</strong>
                <span style={{ color: '#000400' }}>${accountSummary.daily_balance ?? "0"}</span>
              </div>

              {/* Reconciled */}
              <div className="d-flex mb-2" style={{ gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                <strong style={{ color: '#000429', wordBreak: 'break-word' }}>
                  Reconciled to Account <br /> Journal:
                </strong>
                <span style={{ color: '#000400', wordBreak: 'break-word' }}>
                  {accountSummary.reconciled_to_journal === '1' ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "gray" }}>
              No transaction data available.
            </div>
          )}
        </Modal.Body>
      </div >
    </Modal >
  )
};
export default DetailTransactionsPopup;

