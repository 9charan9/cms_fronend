import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import dndarw from '../../../assets/Images/download-up-arw.svg'
import excel from '../../../assets/Images/excel.svg'
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Papa from 'papaparse';
import { SaveclientexcelData, getClinetInnerdata } from "../slice/ClientSlice"
export default function ExcelUpload(props) {
    const [showexcel, setShowexcel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [eCategoryData, setECategoryData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [selectedVendorsMCategory, setSelectedVendorsMCategory] = useState([]);
    const [selectedVendorsECategory, setSelectedVendorsECategory] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clientId = props?.clientId;
    console.log(clientId, "clientId")


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;

                 parseMCategoryCSV(text);

                setFileUploaded(true);
            };
            reader.readAsText(file);

            setSelectedVendorsMCategory([]);
            setSelectedVendorsECategory([]);
            // uncheckAllCheckboxes();

            setTimeout(() => {
                setFileUploaded(false);
            }, 1000);
        }
       
        props.hide();
       
    };
    const parseMCategoryCSV = (csvText) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                setECategoryData(result.data);
            },
            error: (error) => {
                console.error('CSV parsing error:', error.message);
            },
        });
    };


    // useEffect(() => {
    //     if (fileUploaded) {
    //         console.log(eCategoryData, "eCategoryData");
    //         const request = {
    //             client_id: clientId,
    //             po_information: eCategoryData
    //         };
    //         dispatch(SaveclientexcelData(request));

    //         const requestobj = {
    //             client_id: clientId
    //         }
    //         dispatch(getClinetInnerdata(requestobj));


    //     }
    // }, [handleFileUpload]);

    useEffect(() => {
        if (fileUploaded) {
            console.log(eCategoryData, "eCategoryData");
            const request = {
                client_id: clientId,
                po_information: eCategoryData
            };
            dispatch(SaveclientexcelData(request))
                .then(() => {
                    const requestobj = {
                        client_id: clientId
                    };
                    return dispatch(getClinetInnerdata(requestobj));
                })
                .then(() => {
                    setFileUploaded(false); // Reset only after successful dispatch
                })
                .catch((error) => {
                    console.error('Error dispatching actions:', error);
                    setFileUploaded(false); // Reset in case of an error
                });
        }
    }, [fileUploaded, eCategoryData, dispatch, clientId]);

    return (
        <>
            <div className="upload-btn-wrapper position-relative">
                <button className="btn">
                    <img src={dndarw} alt="" className="dounload-img mb-2" />
                    <span className='uploadtext'>Drag and drop to upload your CSV File</span>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        id="fileInput"
                    />
                </button>


            </div>

{/* 
            <ToastContainer
                limit={1}
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ minWidth: "100px" }}
                transition={Zoom}
            />  */}
        </>
    );
}
