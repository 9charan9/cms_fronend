import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadCsv } from "../slice/ComponentSlice";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import dndarw from '../../../assets/Images/download-up-arw.svg'
import excel from '../../../assets/Images/excel.svg'
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
export default function ExcelUpload(props) {
    const [showexcel, setShowexcel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [celldata, setcellData] = useState([])
    const handleCloseexcel = () => setShowexcel(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowexcel = () => setShowexcel(true);
    const [excelData, setExcelData] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploadEnabled, setUploadEnabled] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onChange = (e) => {
        const [file] = e.target.files;
        if (!file) {
            // File is null (upload cancelled), so do nothing
            return;
        }
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
            // Display an error toast for unsupported file types
            toast.error("Unsupported file type. Please upload only Excel (.xlsx) or CSV (.csv) files.");
            // Clear the file input and return
            e.target.value = null;
            return;
        }

        setSelectedFiles([...selectedFiles, ...e.target.files]);
        const reader = new FileReader();

        reader.onload = async (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
            // Check if the CSV file matches either the "Electronic" or "Mechanic" format
            // Check if the CSV file matches either the "Electronic" or "Mechanic" format
            if (isElectronicFormat(data)) {
                // Continue with your logic for processing the data
                console.log(data, "Data");
            } else if (isMechanicFormat(data)) {
                // Continue with your logic for processing the data
                console.log(data, "Data");
            } else {
                // Display an error toast for incorrect CSV format
                console.log(data, "Data");
                toast.error("Incorrect CSV format. Please upload the correct CSV file.");
                // Clear the file input and return
                e.target.value = null;
                return;
            }
            console.log(data, "om dataaaaa");


            const formatDate = (dateString) => {
                const dateParts = dateString.split("/");
                const day = dateParts[0].padStart(2, "0");
                const month = dateParts[1].padStart(2, "0");
                const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2]; // Convert 2-digit year to 4-digit year if needed
                return `${day}/${month}/${year}`;
            };

            // Convert numeric date values to actual date objects
            const convertedData = data.map((row) => {
                return row.map((cell) => {
                    if (cell instanceof Date) {
                        // Format Date objects as needed
                        return cell.toLocaleDateString('en-GB'); // Example format: "12/10/2024"
                    } else if (typeof cell === "string" && cell.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
                        // Format eolDate in "DD/MM/YYYY" format
                        return formatDate(cell);
                    } else {
                        return cell;
                    }
                });
            });

            const trimmedData = convertedData.map((row) => {
                return row.map((cell) => {
                    if (typeof cell === "string") {
                        return cell.trim().replace(/\s+/g, ' '); // Remove leading and trailing spaces
                    }
                    return cell;
                });
            });

            // Check for empty cells in the Excel data
            let emptyCellDetails = [];
            for (let rowIndex = 0; rowIndex < trimmedData.length; rowIndex++) {
                const row = trimmedData[rowIndex];
                for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                    const cell = row[columnIndex];
                    if (!cell || (typeof cell === "string" && cell.trim() === "")) {
                        const cellDetails = { row: rowIndex + 1, column: columnIndex + 1 };
                        emptyCellDetails.push(cellDetails);
                    }
                }
            }

            if (emptyCellDetails.length > 0) {
                setShowModal(true);
                setcellData(emptyCellDetails);
                return;
            }
            console.log(trimmedData, "ommmmmmmm");
            setExcelData(trimmedData);
            setUploadEnabled(true);
        };
        reader.readAsBinaryString(file);

    };

    const isElectronicFormat = (data) => {
        const electronicColumns = [
            "department", "categoryName", "productName", "manufacturer", "mfrPartNumber",
            "mountingType", "foot_print", "quantity", "lifeCycle", "rohs", "msl", "hsn_code",
            "description", "eol_date", "replacement_part_number", "image", "dataSheet", "image_type",
            "file_type", "value", "operatingTemperature"
        ];
        const headerRow = data[0];
        const requiredColumnsPresent = electronicColumns.every(column => headerRow.includes(column));
        return requiredColumnsPresent && data.length > 1; // Check if at least one data row exists
    };

    const isMechanicFormat = (data) => {
        const mechanicColumns = [
            "department", "categoryName", "productName", "mfrPartNumber", "quantity",
            "description", "image", "dataSheet", "image_type", "file_type",
            "technical_details", "mold_required", "material"
        ];
        const headerRow = data[0];
        const requiredColumnsPresent = mechanicColumns.every(column => headerRow.includes(column));
        return requiredColumnsPresent && data.length > 1; // Check if at least one data row exists
    };
    const onCsvSubmit = () => {
        if (excelData.length <= 1) {
            setShowModal(true);
            setcellData([{ row: 1, column: 1 }]);
            return;
        }

        // Convert the Excel data to JSON format based on CSV format
        let jsonData;
        if (excelData[0].includes("lifeCycle")) {
            // Map columns for the first CSV format
            jsonData = excelData.slice(1).map((row) => {
                const eolDate = row[13];
                const dateParts = eolDate.split("/") || eolDate.split("-");
                const formattedEolDate = `${dateParts[0]}-${dateParts[1]}-20${dateParts[2]}`;
                return {
                    department: row[0],
                    categoryName: row[1],
                    productName: row[2],
                    manufacturer: row[3],
                    mfrPartNumber: row[4],
                    mountingType: row[5],
                    footPrint: row[6],
                    quantity: row[7],
                    lifeCycle: row[8],
                    rohs: row[9],
                    msl: row[10],
                    hsn_code: row[11],
                    description: row[12],
                    eolDate: formattedEolDate,
                    replacementPartNumber: row[14],
                    image: row[15],
                    dataSheet: row[16],
                    imageType: row[17],
                    fileType: row[18],
                    value: row[19],
                    opt_tem: row[20],
                };
            });
        } else {
            // Map columns for the second CSV format
            jsonData = excelData.slice(1).map((row) => {
                return {
                    department: row[0],
                    categoryName: row[1],
                    productName: row[2],
                    mfrPartNumber: row[3],
                    quantity: row[4],
                    description: row[5],
                    image: row[6],
                    dataSheet: row[7],
                    imageType: row[8],
                    fileType: row[9],
                    technicalDetails: row[10],
                    mold_required: row[11],
                    material: row[12],

                };
            });
        }

        const jsonObject = {
            parts: jsonData
        };

        // Dispatch the JSON object instead of an array
        dispatch(uploadCsv(jsonObject));
        console.log(jsonObject, "jsonObject");

        // Clear the excelData state
        setExcelData([]);
        props.hide();
    };
    const removeattachment = () => {
        // const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles([]);
        setExcelData([]);
        setUploadEnabled(false);
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.value = null;
        }
    }

    return (
        <>
            <div className="upload-btn-wrapper position-relative">
                <button className="btn">
                    <img src={dndarw} alt="" className="dounload-img mb-2" />
                    <span className='uploadtext'>Drag and drop to upload your CSV File</span>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={onChange}
                        id="fileInput"
                    />
                </button>

                {selectedFiles.map((file, index) => (
                    <div key={index} className="excel-uploadsec">
                        <div className='attachment-sec w-100'>
                            <span className="attachment-name"><img src={excel} alt="" className="dounload-img" /> {file.name}</span>
                            <span className="attachment-icon" onClick={removeattachment}> x </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-3 d-flex justify-content-end'>
                <Button type="button" className='cancel me-2' onClick={handleShowexcel} disabled={!isUploadEnabled}>Preview</Button>
                <Button type="button" className='submit submit-min' onClick={onCsvSubmit} disabled={!isUploadEnabled}>Upload</Button>
            </div>

            <Modal show={showexcel} onHide={handleCloseexcel} className="csvdata">
                <Modal.Header closeButton className="border-0 pb-0">
                </Modal.Header>
                <Modal.Body>
                    {excelData.length > 0 && (
                        <div className="preview-table">
                            <div className='table-responsive'>
                                <Table className='bg-header'>

                                    <tbody>
                                        {excelData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {Object.values(row).map((value, columnIndex) => (
                                                    <td key={columnIndex}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>


            <Modal show={showModal} onHide={handleCloseModal} className="csvdata">
                <Modal.Header closeButton className="border-0 pb-0 text-center">
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h5 className="mb-3">Uploaded CSV File</h5>
                    <table className="bg-header">
                        <thead>
                            <tr>
                                <th>Error Positions</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {celldata.map((cell, index) => (
                                <tr key={index}>
                                    <td> Empty Cell found at Row: {cell.row}, Column: {cell.column}</td>
                                    <td>Should Not be empty</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-5">Please fix the errors in your CSV and <span className="text-danger">reupload CSV</span></p>
                </Modal.Body>
            </Modal>
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
            />
        </>
    );
}
