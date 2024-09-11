import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import { Modal, Spinner } from 'react-bootstrap';
import {
    selectLoadingStatus, setStatusUpdate, getstatusofpo, createpo
} from "../slice/VendorSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import { toast } from 'react-toastify';
import attahment from "../../../assets/Images/attachment.svg"
import jsPDF from "jspdf";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GeneratePo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        VendorcatDetailsdata,
        selectedPartsArray, selectedElectronicPartData, selectMandEdata, selectedTab,cmptIdArray, ctgrIdArray,department,subCtgrArray } = location.state;
  
  
  console.log(selectedElectronicPartData, "cmptIdArray");
  
        const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    console.log(VendorcatDetailsdata, "vendors")
    console.log(selectedPartsArray, "parts");
    console.log(VendorcatDetailsdata?.vendor_id, "VendorcatDetailsdata?.vendor_id,");
    const isLoading = useSelector(selectLoadingStatus);
    const [fileNames, setFileNames] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const dispatch = useDispatch();
    const statusUpdate = useSelector(setStatusUpdate);
    const [selectedStatus, setSelectedStatus] = useState("PO Generated");
    const [selectedDate, setSelectedDate] = useState(new Date());


    const [form, setForm] = useState({
        "vendor_id": "",
        "receiver": "",
        "receiver_contact": "",
        "status": selectedStatus,
        "ordered_by": "",
        "ordered_by_contact": "",
        "billing_address": "",
        "shipping_address": "",
        "terms_and_conditions": "",
        "payment_terms": "",
        // "address2":currentDate,
        deo:"",
        // "address1":"",
        "against_po" : "",
    });
    const [isFormValid, setIsFormValid] = useState(true);

console.log(form);
    useEffect(() => {
        console.log(selectedElectronicPartData[0]?.bom_id);
        setForm({
            "vendor_id": VendorcatDetailsdata?.vendor_id,
            "vendor_name": VendorcatDetailsdata?.vendor_name,
            "receiver": "",
            "receiver_contact": "",
            "status": selectedStatus,
            "ordered_by": "",
            "ordered_by_contact": "",
            "billing_address": "",
            "shipping_address": "",
            "terms_and_conditions": "",
            "payment_terms": "",
            "bom_id": selectedElectronicPartData[0]?.bom_id || selectedPartsArray[0]?.bom_id,
            deo:"",
            "against_po":"",
        })
    }, [VendorcatDetailsdata, selectedPartsArray, selectedElectronicPartData])

    

    const handlePdfChange = (e) => {
        const newFiles = [...selectedFiles];
        const newFileNames = [...fileNames];
        const newFilesBase64 = [...selectedFilesBase64];
        const uniqueFileNames = new Set(fileNames);
        let hasNonPdfFile = false; // Flag to track if any non-PDF file is uploaded
        let hasDuplicateFile = false; // Flag to track if a duplicate file is uploaded
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            if (file.type === "application/pdf" && !uniqueFileNames.has(file.name)) {
                newFileNames.push(file.name);
                newFiles.push(file);
                const reader = new FileReader();
                reader.onload = (fileOutput) => {
                    const encodedFile = fileOutput.target.result.split(",")[1];
                    newFilesBase64.push(encodedFile);
                };
                reader.readAsDataURL(file);
            }
            else if (file.type !== "application/pdf") {
                hasNonPdfFile = true; // Set the flag to true if a non-PDF file is found
            } else {
                hasDuplicateFile = true; // Set the flag to true if a duplicate file is found
            }
        }
        if (hasNonPdfFile) {
            // Show a toast message for non-PDF files
            toast.error("Only PDF files are allowed.");
        }
        if (hasDuplicateFile) {
            // Show a warning message for duplicate files
            toast.warning("Duplicate files are not allowed.");
        }
        // If no duplicates or non-PDF files, update the state with file names and base64 data
        setSelectedFiles(newFiles);
        setFileNames(newFileNames);
        setSelectedFilesBase64(newFilesBase64);
        hasDuplicateFile = false;
        hasNonPdfFile = false;
    };

    const removeattachment = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
        const updateFileName = fileNames.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        setSelectedFilesBase64(updatedFilesBase64);
        setFileNames(updateFileName);
    }

    const onUpdateField = (e) => {
        const { name, value } = e.target;
        const nextFormState = {
            ...form,
            [name]: value
        }
        setForm(nextFormState);
        console.log(JSON.stringify(nextFormState, null, 2)); 
        const isValid = value.trim() !== '';
        setIsFormValid(isValid);
    };

    const handleClosePdfModal = () => {
        setShowPdfModal(false);
    };

    const navigateToPo = () => {
        navigate('/purchaseorders?tab=createdpos')
    };

    const [pdfGenerated, setPdfGenerated] = useState(false);


    const generatePdf = () => {
        if (
            !form.vendor_id ||
            !selectedStatus ||
            !form.against_po ||
            !form.deo ||
            !form.ordered_by ||
            !form.ordered_by_contact ||
            !form.receiver ||
            !form.receiver_contact ||
            !form.billing_address ||
            !form.shipping_address ||
            !form.terms_and_conditions ||
            !form.payment_terms
        ) {
            toast.error("Please fill all required fields before generating the PDF.");
            return;
        } else {
        const doc = new jsPDF();
        let title = "";
        var tableHeaders = [];
        if (selectedTab === 'M-Category Info') {
            title = "Category Info (Mechanic)";
            tableHeaders = ['S. No', 'Part No',  'Part Name', 'Module', 'Part Description', 'Material', 'Quantity', 'Price per Piece (Rs /-)', 'GST (%)'];
        } else if (selectedTab === 'E-categoryInfo') {
            title = "Category Info (Electronic)";
            tableHeaders = ['S. No', 'Manufacturer Part No', 'Part Name', 'Manufacturer',  'Description', 'Device Category', 'Quantity', 'Price per Piece (Rs /-)', 'GST (%)'];
        } else if (VendorcatDetailsdata?.vendor_type === "Electronic") {
            title = "Category Info (Electronic)";
            tableHeaders = ['S. No', 'Manufacturer Part No', 'Part Name', 'Manufacturer', 'Description', 'Device Category', 'Quantity', 'Price per Piece (Rs /-)', 'GST (%)'];
        } else if (VendorcatDetailsdata?.vendor_type === "Mechanic") {
            title = "Category Info";
            tableHeaders = ['S. No', 'Part No', 'Part Name', 'Module', 'Part Description', 'Material', 'Quantity', 'Price per Piece (Rs /-)', 'GST (%)'];
        }
        doc.text(title, 10, 10);
        const tableData = [];
        let totalPrice = 0;
        let totalQuantity = 0;
        Object.keys(selectMandEdata).forEach((partKey, index) => {
            const part = selectMandEdata[partKey];
            if ((selectedTab === "E-categoryInfo")) {
                // const packagingOptionalValue = part["part_packaging(optional)"];
                const rowData = [
                    index + 1,
                    part?.mfr_prt_num || "-",
                    part?.prdt_name || "-",
                    part?.manufacturer || "-",
                    // (selectedTab === "E-categoryInfo") ? (packagingOptionalValue || "-") : (part?.material || "-"),
                    part?.description || "-",
                    part?.ctgr_name || "-",
                    part?.qty || "-",
                    part?.unit_price ? part.unit_price : "-",
                    part?.gst ? part.gst : "-"
                ];
                    totalQuantity += parseInt(part.qty)
                    // totalPrice += parseInt(part.unit_price);
                tableData.push(rowData);
            } else {
                if (selectedTab === "M-Category Info") {
                    const rowData = [
                        index + 1,
                        part?.mfr_prt_num || "-",
                        part?.prdt_name || "-",
                        part?.module || "-",
                        part?.description || "-",
                        part?.material || "-",
                        part?.qty || "-",
                        part?.unit_price ? part.unit_price : "-",
                        part?.gst ? part.gst : "-"
                    ];
                    totalQuantity += parseInt(part.qty)
                    // totalPrice += parseInt(part.unit_price);
                    tableData.push(rowData);
                }
            }
        });
        if (VendorcatDetailsdata?.vendor_type === "Electronic") {
            Object.keys(selectedElectronicPartData).forEach((partKey, index) => {
                const part = selectedElectronicPartData[partKey];
                if (part?.department === "Electronic") {
                    const rowData = [
                        index + 1,
                        part?.mfr_prt_num || "-",
                        part?.prdt_name || "-",
                        part?.manufacturer || "-",
                        part?.description || "-",
                        part?.ctgr_name || "-",
                        part?.qty || "-",
                        part?.unit_price ? part.unit_price : "-",
                        part?.gst ? part.gst : "-"
                    ];
                        // totalPrice += parseInt(part?.unit_price);
                        totalQuantity += parseInt(part?.qty)
                        tableData.push(rowData);
                }
            });
        } else if (VendorcatDetailsdata?.vendor_type === "Mechanic") {
            Object.keys(selectedPartsArray).forEach((partKey, index) => {
                const part = selectedPartsArray[partKey];
                if (part?.department === "Mechanic") {
                    const rowData = [
                        index + 1,
                        part?.mfr_prt_num || "-",
                        part?.prdt_name || "-",
                        part?.module || "-",
                        part?.description || "-",
                        part?.material || "-",
                        part?.qty || "-",
                        part?.unit_price ? part.unit_price : "-",
                        part?.gst ? part.gst : "-"
                    ];
                    totalQuantity += parseInt(part.qty)
                    // totalPrice += parseInt(part.unit_price);
                    tableData.push(rowData);
                }
            });
        }
        const totalRow = ["Total", "", "", "", "", "", totalQuantity.toFixed(0), "", ""];
        tableData.push(totalRow);

        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 20,
        });

        doc.text(title, 10, 10);
        const pdfDataURL = doc.output('datauristring');
        setPdfData(pdfDataURL);
        setShowPdfModal(true);
    };
    setPdfGenerated(true)
};

    const handleStatusChange = (e) => {
        const nextFormState = {
            ...form,
            [e.target.name]: e.target.value,
        };
        setForm(nextFormState);
        setSelectedStatus(e.target.value)
    };
     useEffect(() => {
        const request = {
            "status": "Create"
        }
        dispatch(getstatusofpo(request));
    }, [])

        const totalQuantity = selectedElectronicPartData.reduce((sum, part) => {
            const quantity = parseInt(part.qty);
            return sum + (isNaN(quantity) ? 0 : quantity);
          }, 0);
          console.log(totalQuantity)
        
          const totalPrice = selectedElectronicPartData.reduce((sum, part) => {
            const price = parseInt(part.price);
            return sum + (isNaN(price) ? 0 : price);
          }, 0);
          console.log(totalPrice)

          const totalMechQuantity = selectedPartsArray.reduce((sum, part) => {
            const quantity = parseInt(part.qty);
            return sum + (isNaN(quantity) ? 0 : quantity);
          }, 0);
          console.log(totalMechQuantity)
        
          const totalMechPrice = selectedPartsArray.reduce((sum, part) => {
            const price = parseInt(part.price);
            return sum + (isNaN(price) ? 0 : price);
          }, 0);
        

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (!form.against_po || !form.deo || !form.ordered_by || !form.ordered_by_contact || !form.receiver || !form.receiver_contact || !form.billing_address || !form.shipping_address || !form.terms_and_conditions || !form.payment_terms) {
            // Alert the user to fill out all the required fields
            // alert("Please fill all the required fields.");
            return;
        }
        const documents = fileNames.map((fileName, index) => ({
            doc_name: fileName,
            doc_body: selectedFilesBase64[index],
        }));
        const partsObject = [selectedPartsArray, selectedElectronicPartData, selectMandEdata].reduce((result, partsArray) => {
            partsArray.forEach((part, index) => {
                result[`part${index + 1}`] = { ...part };
            });
            return result;
        }, {});

        console.log(partsObject)
        const requestBody = {
            ...form,
            "status" :selectedStatus,
            documents,
            parts : partsObject,
            created_from : 'Vendor',
        };

        if(VendorcatDetailsdata?.vendor_type === 'Electronic'){
            requestBody.total_qty = totalQuantity;
            requestBody.total_price = totalPrice;
        } else if(VendorcatDetailsdata?.vendor_type === 'Mechanic') {
            requestBody.total_qty = totalMechQuantity;
            requestBody.total_price = totalMechPrice;
        } else if(selectedTab === 'E-categoryInfo'){
            requestBody.total_qty = totalQuantity;
            requestBody.total_price = totalPrice;
        } else if(selectedTab === 'M-Category Info'){
            requestBody.total_qty = totalMechQuantity;
            requestBody.total_price = totalMechPrice;
        }
        console.log(requestBody, "---------------------");
        const response = await dispatch(createpo(requestBody));
        // if (response.payload?.statusCode === 200){
        //     setTimeout(() => {
        //         // navigate(-1)
        //       }, 2000);
        // }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
          const isoDate = date.toISOString().split("T")[0];
          setForm((prevDetails) => ({
            ...prevDetails,
            deo: isoDate,
          }));
        } else {
          setForm((prevDetails) => ({
            ...prevDetails,
            deo: "",
          }));
        }
      };

    return (
        <>
            <div className='wrap'>
                <div className='d-flex justify-content-between'>
                    <h1 className='title-tag'><img src={arw} alt="" className='me-3' onClick={() => navigate(-1)} />Generate Purchase Order</h1>
                </div>

                <form>
                    <div className='content-sec'>
                        <h3 className='inner-tag'>Vendor Info</h3>
                        <Row>

                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vendor ID</Form.Label>
                                    <Form.Control type="text" placeholder="" name="vendor_id" value={form.vendor_id} onChange={onUpdateField} required={true} disabled />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        required
                                    >
                                        <option value="PO Generated">PO Generated</option>  
                                        <option value="PO Issued">PO Issued</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>


                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Against PO</Form.Label>
                                    <Form.Control type="text" placeholder="" name="against_po" onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Delivery End Date</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    placeholder=""
                    onChange={handleDateChange}
                    required={true}
                    dateFormat="yyyy-MM-dd"
                    name="deo"
                    value={form.deo}
                    className="form-control"
                    onFocus={(e) => (e.target.readOnly = true)}
                  />
                </Form.Group>
              </Col>
                            {/* <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Delivery End Date</Form.Label>
                                    <Form.Control type="text" placeholder="" name="address2" onChange={onUpdateField} required={true} />
                                   </Form.Group>
                            </Col> */}

                        </Row>
                        <h3 className='inner-tag mt-4'>Contact Info</h3>
                        <Row>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ordered By</Form.Label>
                                    <Form.Control type="text" placeholder="" name="ordered_by" value={form?.ordered_by} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact (Ordered By)</Form.Label>
                                    <Form.Control type="text" placeholder="" name="ordered_by_contact"  pattern="[0-9]*" minLength={10} maxLength={10} value={form?.ordered_by_contact ? form.ordered_by_contact.replace(/\D/g, "") : ""} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vendor POC</Form.Label>
                                    <Form.Control type="text" placeholder="" name="receiver" value={form?.receiver} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vendor POC Contact Number</Form.Label>
                                    <Form.Control type="text" placeholder="" name="receiver_contact"  pattern="[0-9]*" minLength={10} maxLength={10}  value={form?.receiver_contact ? form.receiver_contact.replace(/\D/g, "") : ""}  onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h3 className='inner-tag mt-4'>Address</h3>

                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Billing Address</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="billing_address" value={form?.billing_address} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Shipping Address</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="shipping_address" value={form?.shipping_address} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h3 className='inner-tag mt-4'>Other Info</h3>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Terms & Conditions</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="terms_and_conditions" value={form?.terms_and_conditions} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Terms</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="payment_terms" value={form?.payment_terms} onChange={onUpdateField} required={true} />
                                </Form.Group>
                            </Col>

                        </Row>
                        <h3 className='inner-tag mt-4'>Registration Documents</h3>

                        <Row className="main-div-attach">
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Attach Documents</Form.Label>

                                    <div>
                                        <input
                                            name="doc_name"
                                            type="file"
                                            accept=".pdf"
                                            id="upload"
                                            hidden
                                            multiple
                                            onChange={handlePdfChange}
                                        />

                                        <label for="upload" className="cfile">
                                            <img src={attahment} alt="" />
                                        </label>
                                    </div>
                                </Form.Group>
                            </Col>
                            {Array.isArray(selectedFiles) &&
                                selectedFiles.map((file, index) => (
                                    <Col xs={12} md={3} key={index}>
                                        <Form.Group >
                                            <div className="attachment-sec">
                                                <span className="attachment-name">{file.name}</span>
                                                <span
                                                    className="attachment-icon"
                                                    onClick={() => removeattachment(index)}
                                                >x
                                                </span>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                ))}
                        </Row>

                        <div className="table-responsive mt-4" id="tableData">
                            {selectedTab === 'M-Category Info' && (
                                <Table className="b-table">

                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Part No</th>
                                            {/* <th>BOM ID</th> */}
                                            <th>Part Name</th>
                                            <th>Module</th>
                                            <th>Part Description</th>
                                            <th>Material</th>
                                            <th>Qty Per Board</th>
                                            <th>Price per Piece (Rs /-)</th>
                                            <th>GST (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(selectedPartsArray).map((partKey, index) => {
                                            const part = selectedPartsArray[partKey];
                                            if (part?.department === "Mechanic") {
                                                const gstOptionalValue = part["gst(optional)"];
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{part?.mfr_prt_num || "-"}</td>
                                                        <td>{part?.prdt_name || "-"}</td>
                                                        <td>{part?.module || "-"}</td>
                                                        <td>{part?.description || "-"}</td>
                                                        <td>{part?.material || "-"}</td>
                                                        <td>{part?.qty || "-"}</td>
                                                        <td>
                                                            {part?.unit_price ? part.unit_price : "-"}
                                                        </td>
                                                       <td>{part?.gst ? part.gst : "-"}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                    </tbody>
                                </Table>
                            )}
                            {selectedTab === 'E-categoryInfo' && (
                                <Table className="b-table">

                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Manufacturer Part No</th>
                                            <th>Part Name</th>
                                            <th>Manufacturer</th>
                                            {/* <th>Packaging</th> */}
                                            <th>Description</th>
                                            <th>Device Category</th>
                                            <th>Quantity</th>
                                            <th>Price per Piece (Rs/-)</th>
                                            <th>GST (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(selectedElectronicPartData).map((partKey, index) => {
                                            const part = selectedElectronicPartData[partKey];
                                            if (part?.department === "Electronic") {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{part?.mfr_prt_num || "-"}</td>
                                                        <td>{part?.prdt_name || "-"}</td>
                                                        <td>{part?.manufacturer || "-"}</td>
                                                         {/* <td>{part?.package}</td> */}
                                                        <td>{part?.description || "-"}</td>
                                                        <td>{part?.ctgr_name || "-"}</td>
                                                        <td>{part?.qty || "-"}</td>
                                                        <td>
                                                            {part?.unit_price ? part.unit_price : "-"}
                                                        </td>
                                                        <td>{part?.gst ? part.gst : "-"}</td>
                                                    </tr>
                                                )
                                            }
                                            return null
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </div>


                        <div className="table-responsive mt-4" id="tableData">
                            {VendorcatDetailsdata?.vendor_type === "Electronic" && (
                                <>
                                    <Table className="b-table">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Manufacturer Part No</th>
                                                <th>Part Name</th>
                                                <th>Manufacturer</th>
                                                {/* <th>Packaging</th> */}
                                                <th>Description</th>
                                                <th>Device Category</th>
                                                <th>Quantity</th>
                                                <th>Price per Piece (Rs/-)</th>
                                                <th>GST (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(selectedElectronicPartData).map((partKey, index) => {
                                                const part = selectedElectronicPartData[partKey];
                                                if (part?.department === "Electronic") {
                                              
                                                    return (
                                                        <tr key={index}>

                                                            <td>{index + 1}</td>
                                                            <td>{part?.mfr_prt_num || "-"}</td>
                                                            <td>{part?.prdt_name || "-"}</td>
                                                            <td>{part?.manufacturer || "-"}</td>
                                                            {/* <td>{part?.package}</td> */}
                                                            <td>{part?.description || "-"}</td>
                                                            <td>{part?.ctgr_name || "-"}</td>
                                                            <td>{part?.qty || "-"}</td>
                                                            <td>
                                                                {part?.unit_price ? part.unit_price : "-"}
                                                            </td>
                                                            <td>{part?.gst ? part.gst : "-"}</td>
                                                        </tr>
                                                    )
                                                }
                                                return null
                                            })}
                                        </tbody>
                                    </Table>
                                </>
                            )}
                            {VendorcatDetailsdata?.vendor_type === "Mechanic" && (
                                <Table className="b-table">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Part No</th>
                                            {/* <th>BOM ID</th> */}
                                            <th>Part Name</th>
                                            <th>Module</th>
                                            <th>Part Description</th>
                                            <th>Material</th>
                                            <th>Quantity</th>
                                            <th>Price per Piece (Rs /-)</th>
                                            <th>GST (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(selectedPartsArray).map((partKey, index) => {
                                            const part = selectedPartsArray[partKey];
                                            if (part?.department === "Mechanic") {
                                                const gstOptionalValue = part["gst(optional)"];
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{part?.mfr_prt_num || "-"}</td>
                                                        {/* <td>{part?.bom_id || "-"}</td> */}
                                                        <td>{part?.prdt_name || "-"}</td>
                                                        <td>{part?.module || "-"}</td>
                                                        <td>{part?.description || "-"}</td>
                                                        <td>{part?.material || "-"}</td>
                                                        <td>{part?.qty || "-"}</td>
                                                        <td>
                                                            {part?.unit_price ? part.unit_price : "-"}
                                                        </td>
                                                        <td>{part?.gst ? part.gst : "-"}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                    </tbody>
                                </Table>)}

                        </div>

                        <div className='mt-3 d-flex justify-content-end mt-2 pb-3'>
                            <Button type="button" className='cancel me-2' onClick={() => navigate(-1)}>Cancel</Button>
                           
                            <Button type="submit" className='submit'
                                // onClick={generatePdf}
                                // disabled={pdfGenerated}
                                onClick={(e) => {
                                    e.preventDefault();
                                    generatePdf();
                                    onFormSubmit(e);
                                }}
                                disabled={pdfGenerated}
                            >Generate</Button>

                        </div>
                    </div>
                </form>
                {isLoading && (
                    <div className="spinner-backdrop">
                        <Spinner animation="grow" role="status" variant="light">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}

                <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
                    <Modal.Header>
                        <Modal.Title>Generated PDF</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <iframe
                            title="Generated PDF"
                            src={pdfData}
                            width="100%"
                            height="500px"
                            frameBorder="0"
                        />
                    </Modal.Body>
                    <Modal.Footer>

                        <Button variant="secondary" onClick={navigateToPo}>
                            Ok
                        </Button>

                    </Modal.Footer>
                </Modal>
            </div>
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
                transition={Zoom} />
        </>
    );
};

export default GeneratePo;
