import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { getClients } from "../../redux/slices/ledgerSlice";
import { useDispatch, useSelector } from "react-redux";

const SchedulerReportDropDown = ({
    selectedReport,
    setSelectedReport,
    allModule,
    clients,
    setLedger_client_id
}) => {
    const dispatch = useDispatch()
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSelect = (reportName) => {
        setSelectedReport(reportName);
    };
    // console.log("Dropdown Page", selectedReport)
    // const handleClientSelect = (clientsId) => {
    //     console.log("clientsId", clientsId)
    //     setLedger_client_id(clientsId);
    //     handleSelect(`CLIENT_LEDGER`);
    //     setShowDropdown(false);
    // };
    const handleClientSelect = (clientsId) => {
        // console.log("Clicked ID:", clientsId);
        setLedger_client_id(clientsId);
        handleSelect(`CLIENT_LEDGER`);
        setShowDropdown(false);
        if (!clientsId) {
            console.warn("Client ID missing!");
            return;
        }
    };

    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);

    return (
        <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
            <Dropdown.Toggle
                className="cmn-btn-2 blue-bg"
                style={{
                    width: "300px",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {selectedReport ? selectedReport.replaceAll("_", " ") : "Select For Month Report"}
            </Dropdown.Toggle>

            <Dropdown.Menu
                style={{
                    backgroundColor: "#0b0c2a",
                    color: "#fff",
                    padding: "10px",
                    minWidth: "300px",
                }}
            >
                {Object.values(allModule).map((item, index) => (
                    // console.log(item),
                    item == "CLIENT_LEDGER" ? (
                        <div
                            key={index}
                            style={{
                                position: "relative",
                                padding: "5px 10px",
                                color: "#fff",
                                fontWeight: "bold",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                const submenu = e.currentTarget.querySelector(".submenu");
                                if (submenu) submenu.style.display = "block";
                            }}
                            onMouseLeave={(e) => {
                                const submenu = e.currentTarget.querySelector(".submenu");
                                if (submenu) submenu.style.display = "none";
                            }}
                        >
                            CLIENT LEDGER
                            <span
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    right: "10px",
                                    fontSize: "18px",
                                    color: "#fff",
                                }}
                            >
                                ▼
                            </span>
                            {
                                // clients?.length > 0 && (
                                <div
                                    className="submenu"
                                    style={{
                                        display: "none",
                                        position: "absolute",
                                        right: "100%",
                                        top: 0,
                                        backgroundColor: clients?.length > 0 ? "#0b0c2a" : "",
                                        padding: "5px 0",
                                        minWidth: "180px",
                                        boxShadow: clients?.length > 0 ? "0px 0px 10px rgba(0, 0, 0, 0.3)" : "",
                                        zIndex: 9999,
                                        borderRadius: "10px",
                                    }}
                                >
                                    {clients?.map((client, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "5px 15px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleClientSelect(client?.id ?? "")}
                                        >
                                            {client?.client_name}
                                        </div>
                                    ))}
                                </div>
                                // )
                            }

                        </div>
                    ) : (
                        <Dropdown.Item
                            key={index}
                            onClick={() => {
                                handleSelect(item);
                                setShowDropdown(false);
                            }}
                            style={{
                                color: "#fff",
                                padding: "5px 15px",
                                fontSize: "14px",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#77778aff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {item.replaceAll("_", " ")}
                        </Dropdown.Item>
                    )
                ))}
            </Dropdown.Menu>
        </Dropdown>

    )
}

export default SchedulerReportDropDown
