// import React from 'react'
// import { Modal } from 'react-bootstrap'

// const NotificationsPopup = () => {
//     return (
        // <div className="popup-wrp notification" style={{
        //     backgroundColor: "revert",
        //     // height:"200px",
        //     position:'absolute',
        //     // zIndex:1000000000,
        //     left :150,
        //     top:55,
        //      backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // backdropFilter: 'blur(5px)',

        // }}>
        //     {/* <div className="pop-overlay"></div> */}
        // <Modal style={{
        // }}>
        //     {/* < div className="pop-up-inr-wrp " style={{
        //         //  backgroundColor: "revert",
        //         //   position:'absolute',
        //     }}> */}
        //         {/* <div className='pop-wrp notification'> */}
        //         <div className="sign-popup ">
        //             <div className="close-btn">
        //                 <i className="fa-solid fa-times"></i>
        //             </div>
        //             <div className="sign-pop-head mb-4">
        //                 <div className="modal-icon">
        //                     <img src="./images/notification-icon.svg" alt="Icon" />
        //                 </div>
        //                 <h2>Notifications</h2>
        //             </div>
        //             <div className="pop-bdy-content">
        //                 <div className="notifications-card-wrp">

        //                     <div className="notification-card">
        //                         <div className="notification-card__icon">
        //                             <img src="./images/notification-icon.svg" alt="User" />
        //                         </div>
        //                         <div className="notification-card__body">
        //                             <h4 className="notification-card__title">New Message from Alice</h4>
        //                             <p className="notification-card__text">
        //                                 Hey, just wanted to let you know the report is ready.
        //                             </p>
        //                         </div>
        //                         <div className="notification-card__time">2h ago</div>
        //                     </div>

        //                     <div className="notification-card">
        //                         <div className="notification-card__icon">
        //                             <img src="./images/notification-icon.svg" alt="System" />
        //                         </div>
        //                         <div className="notification-card__body">
        //                             <h4 className="notification-card__title">Server Maintenance</h4>
        //                             <p className="notification-card__text">
        //                                 Scheduled maintenance tonight at 11:00 PM.
        //                             </p>
        //                         </div>
        //                         <div className="notification-card__time">4h ago</div>
        //                     </div>

        //                 </div>
        //             </div>
        //         </div>
        //     {/* </div > */}
        // </Modal>
        // </div >



        import { Modal, Button } from 'react-bootstrap';

    const NotificationModal = ({ show, onClose }) => {
        return (
            <Modal
                show={show}
                onHide={onClose}
                centered
                className="notification-modal"
                style={{ zIndex: 1050, top:-70, left:90 }}
                size='lg'
            >
                <style>{`
        .notification-modal .modal-content {
          border-radius: 15px;
          padding: 20px;
          top:'100px'
        }
        .sign-pop-head {
          text-align: center;
        }
        .modal-icon img {
          width: 40px;
          margin-bottom: 10px;
        }
        .notification-card {
          display: flex;
          align-items: flex-start;
          padding: 12px;
          border-bottom: 1px solid #eee;
          height:'150px'
        }
        .notification-card__icon img {
          width: 50px;
          margin-right: 12px;
        }
        .notification-card__body {
          flex: 1;
        }
        .notification-card__title {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 4px;
        }
        .notification-card__text {
          font-size: 14px;
          margin: 0;
        }
        .notification-card__time {
          font-size: 12px;
          color: #999;
          margin-left: 8px;
          white-space: nowrap;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          cursor: pointer;
          font-size: 20px;
        }
      `}</style>
                <div className="close-btn" onClick={onClose}>
                    <i className="fa-solid fa-times"></i>
                </div>

                <div className="sign-pop-head mb-3">
                    <div className="modal-icon">
                        <img src="./images/notification-icon.svg" alt="Icon" />
                    </div>
                    <h2>Notifications</h2>
                </div>

                <div className="notifications-card-wrp">
                    <div className="notification-card">
                        <div className="notification-card__icon">
                            <img src="./images/notification-icon.svg" alt="User" />
                        </div>
                        <div className="notification-card__body">
                            <h4 className="notification-card__title">New Message from Alice</h4>
                            <p className="notification-card__text">
                                Hey, just wanted to let you know the report is ready.
                            </p>
                        </div>
                        <div className="notification-card__time">2h ago</div>
                    </div>

                    <div className="notification-card">
                        <div className="notification-card__icon">
                            <img src="./images/notification-icon.svg" alt="System" />
                        </div>
                        <div className="notification-card__body">
                            <h4 className="notification-card__title">Server Maintenance</h4>
                            <p className="notification-card__text">
                                Scheduled maintenance tonight at 11:00 PM.
                            </p>
                        </div>
                        <div className="notification-card__time">4h ago</div>
                    </div>
                </div>
            </Modal>
        );
    };

    export default NotificationModal;


//     )
// }

// export default NotificationsPopup
