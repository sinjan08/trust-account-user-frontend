import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchigAllLien, resolveLien } from "../../redux/slices/lienSlice";


const ResolveStatus = ({ resolveId, handleClose, show }) => {
    const dispatch = useDispatch();
    console.log(resolveId, "resolveId")

    const handleResolveLien = () => {
        let formData = {
            resolve_status: true
        }
        console.log(formData)

        dispatch(resolveLien({ resolveId, formData }))
        dispatch(fetchigAllLien())
        handleClose()
    }
    return (
        <Modal show={show} onHide={handleClose} centered size="md" className="add-notes" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: '1000000000'
        }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    borderRadius: "10px",
                    maxWidth: "100%",
                }}
            >
                <div
                    className="close-btn"
                    onClick={handleClose}
                    style={{
                        alignSelf: "flex-end",
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    ×
                </div>
            </div>
            <div style={{
                padding: '10px',
                margin: '10px ',
            }}>
                <Modal.Body>
                    <div className="text-center mt-4 mb-2 text-white p-4">
                        <h5 style={{ color: '#2d2f54', fontSize: '26px' }}>Do you want to resolve your lien?</h5>
                    </div>
                    <Form >
                        <div className="dsbdy-frm-btn-grp mt-4 d-flex" style={{
                            padding: '40px',
                            justifyContent: 'space-around'
                        }} >
                            <Button type="button" className="cmn-btn-2 blue-bg" onClick={handleClose} >
                                No
                            </Button>
                            <Button type="button" className="cmn-btn-2 blue-bg" onClick={() => handleResolveLien()}>
                                Yes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </div>
        </Modal>
    );
};

export default ResolveStatus;
