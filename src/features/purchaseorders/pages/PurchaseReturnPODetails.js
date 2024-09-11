import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import view from "../../../assets/Images/view.svg";
import download from "../../../assets/Images/download.svg";
import pdf from "../../../assets/Images/pdf.svg";
import Table from "react-bootstrap/Table";
import "../styles/PurchaseOrder.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { selectReturnPoInnerList, InnerReturnpodetails, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PdfModal from './PdfModal';
import { formFieldsVendor, returnPOText} from '../../../utils/TableContent';
const PurchaseReturnPODetails = () => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  let totalQty = 0;
  let totalPrice = 0;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [key, setKey] = useState("CategoryInfo");
  const location = useLocation()
  const return_id = location.state;
  console.log(return_id, "client_idclient_id")
  const isLoading = useSelector(selectLoadingStatus);
  const returnpoIdata = useSelector(selectReturnPoInnerList);
  const returnpoI = returnpoIdata?.body;
  console.log(returnpoI, "returnpoIdata");


  const downloadpdf = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
      const vendorId = returnpoI?.vendor_id;
      const vendorName = returnpoI?.vendor_name;
      const OrderDate = returnpoI?.order_date;
      const contactNo = returnpoI?.contact_number;
      const Email = returnpoI?.email;
      const Location = returnpoI?.address1;
      const InwardID = returnpoI?.inward_id;
      const QADate   = returnpoI?.qa_date;
      const ReceivedDate    = returnpoI?.received_date;
      const ReturndDate    = returnpoI?.return_date;
  

    const input = document.getElementById("tableData");
    if (!input) return;
    const tableElement = input.querySelector("table");
    if (!tableElement) return;
    const imgWidth = 500;
    const imgHeight =
      (tableElement.offsetHeight * imgWidth) / tableElement.offsetWidth;

    pdf.setFontSize(12);
    const addTextWithLineBreak = (text, x, y, maxWidth) => {
      const textLines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(textLines, x, y);
  };

  // Adding text with automatic line break
  addTextWithLineBreak(`Vendor ID : ${vendorId}`, 40, 35, 500);
  addTextWithLineBreak(`Vendor Name : ${vendorName}`, 40, 55, 500);
  addTextWithLineBreak(`Order Date : ${OrderDate}`, 40, 75, 500);
  addTextWithLineBreak(`Contact No : ${contactNo}`, 40, 95, 500);
  addTextWithLineBreak(`Inward ID : ${InwardID}`, 40, 115, 500);
  addTextWithLineBreak(`QA Date : ${QADate}`, 40, 135, 500);
  addTextWithLineBreak(`Received Date : ${ReceivedDate}`, 40, 155, 500);
  addTextWithLineBreak(`Return Date : ${ReturndDate}`, 40, 175, 500);
  addTextWithLineBreak(`Email : ${Email}`, 40, 195, 500);
  addTextWithLineBreak(`Location : ${Location}`, 40, 225, 600);
  
    // Define an array of light pastel colors
    const pastelColors = ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff"];

    const headers = ['S.No', 'Manufacturer Part No', 'Part Name', 'Description', 'Quantity', 'Price', 'Price Per Piece', 'Status'];
    const data = [];
    const rows = tableElement.querySelectorAll("tbody tr");
    rows.forEach((row, rowIndex) => {
      const rowData = [];
      const cells = row.querySelectorAll("td");

      cells.forEach((cell, columnIndex) => {
        const backgroundColor =
          pastelColors[(rowIndex + columnIndex) % pastelColors.length];
        rowData.push({
          content: cell.textContent,
          styles: { fillColor: backgroundColor },
        });
      });

      data.push(rowData);
    });

    pdf.autoTable({
      head: [headers],
      body: data,
      startY: 250,
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: [0, 0, 0], // Table text color
        lineColor: [0, 0, 0], // Table border color
        lineWidth: 0.1, // Table border line width
      },
      headerStyles: {
        fillColor: false, // Disable header background color
        textColor: [0, 0, 0], // Table header text color
        fontStyle: "bold",
      },
    });

    pdf.save('ReturnPo.pdf');
  };
  // Function to open the PDF modal
  const openPdfModal = (pdfUrl) => {
    setSelectedPdfUrl(pdfUrl);
    setShowPdfModal(true);
  };

  // Function to close the PDF modal
  const closePdfModal = () => {
    setShowPdfModal(false);
  };

  // ... (your existing code)



const InvoiceView = () => {
  // Get the invoice URL from the backend response or props
  const invoiceUrl = returnpoI?.invoice;

  if (invoiceUrl) {
    openPdfModal(invoiceUrl);
  } else {
    // Handle the case where the invoice URL is not available
    console.error('Invoice URL not found');
  }
};

  const documentUrl = returnpoI?.qa_test;

  useEffect(() => {
    const requestobj = {
      return_id: return_id
    }
    dispatch(InnerReturnpodetails(requestobj));
  }, [dispatch])


  const navigateToGateEntry = () => {
    let path = `/gateEntry`;
    navigate(path, { state:{
      getOrderNumber:returnpoI?.order_id,
      date: returnpoI?.order_date,
      status:"PurchaseReturn",
      return_id:return_id      
    }
    });
  };

  const openPDFInNewTab = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  return (
    <>
     <PdfModal show={showPdfModal} handleClose={closePdfModal} pdfUrl={selectedPdfUrl} />
      <div className="wrap">
        <h1 className="title-tag">Purchase Orders</h1>
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {return_id}
            </h1>
            <div className="ms-3"></div>
          </div>
          <div className="mobilemargin-top">
            <Button className="submit me-2 md-me-2 submitmobile"  onClick={downloadpdf}>
              Download as pdf
            </Button>
            <Button
              className="btn-outline-dark submit-85 submit-block btn-gate-entry"
              onClick={(e) => navigateToGateEntry()}          
            >
              Gate Entry
            </Button>
          </div>
        </div>

        <Row>
          <Col xs={12} md={3}>
            {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">Vendor  ID : {returnpoI?.vendor_id}</h5> */}
            <h5 className="mt-3 mb-2 bomtag text-667 font-500">Vendor Name : {returnpoI?.vendor_name}</h5>
            <h5 className="bomtag mb-2 text-667 font-500">Contact : {returnpoI?.contact_number}</h5>
            <h5 className="bomtag text-667 font-500">Order Date : {returnpoI?.order_date}</h5>
          </Col>

          <Col xs={12} md={3}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">Location : {returnpoI?.address1}</h5>
            <h5 className="mb-2 bomtag text-667 font-500">Email : {returnpoI?.email}</h5>
            
          </Col>
          <Col xs={12} md={3}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Received Date : {returnpoI?.received_date}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">QA Date : {returnpoI?.qa_date}</h5>
         
          </Col>
          <Col xs={12} md={3}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Inward ID : {returnpoI?.inward_id}
            </h5>
            <h5 className="bomtag text-667 font-500">Return Date : {returnpoI?.return_date}</h5>

          </Col>

        </Row>

        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center">
            <div className="partno-sec">
              <div className="tab-sec">
                <Tabs
                  className="tabs-header"
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  <Tab eventKey="CategoryInfo" title="Category Info">
                    <div className="table-responsive mt-4 ms-4" id="tableData">
                      <Table className="bg-header table-nowrap">
                        <thead>
                          <tr>
                            <th>{returnPOText?.sno}</th>
                            <th>{returnPOText?.mPartno}</th>
                            <th>{returnPOText?.partName}</th>
                            <th>{returnPOText?.desc}</th>
                            {/* <th>{returnPOText?.packaging}</th> */}
                            <th>{returnPOText?.qty}</th>
                            <th>{returnPOText?.price}</th>
                            <th>{returnPOText?.pricePiece}</th>
                            <th>{returnPOText?.status}</th>
                          </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                           <tr>
                             <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                              {Object.keys(returnpoI?.parts || {}).map((partKey, index) => {
                              const part = returnpoI.parts[partKey];
                              // Accumulate total qty and total price 
                              totalQty += +part?.fail_qty || 0;
                              totalPrice += +part?.price || 0;
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{part?.mfr_prt_num}</td>
                                  <td>{part?.prdt_name}</td>
                                  <td>{part?.description}</td>
                                  {/* <td>{part?.packaging || "-"}</td> */}
                                  <td>{part?.fail_qty}</td>
                                  <td>&#8377; {part?.price || "-"}</td>
                                  <td>&#8377;{part?.price_per_piece}</td>
                                  <td><Button className="fail-btn btn">
                                    {/* {part?.status} */}
                                    Fail
                                  </Button></td>
                                </tr>
                              );
                            })}
                          {Object.keys(returnpoI?.parts || {}).length === 0 && (
                            <tr>
                              <td colSpan="9" className="text-center">
                                No Data Available
                              </td>
                            </tr>
                          )}
</>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-top">
                            <td>{returnPOText?.total}</td>
                            <td></td>
                            <td></td>
                            <td></td>                            
                            <td>{totalQty}</td>
                            <td>&#8377; {totalPrice}</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="bankdetails" title="Bank Details">
                    <Row className="mt-4 ms-4">
                      <Col xs={12} md={4}>
                        <p className="mb-2">Bank Name : {returnpoI?.bank_name}</p>                      
                      </Col>
                      <Col xs={12} md={8}>
                        <p className="mb-2">Account Number : {returnpoI?.account_number}</p>                       
                      </Col>
                    </Row>
                    <Row className="mt-2 ms-4">
                      <Col xs={12} md={4}>                       
                        <p>IFSC Code : {returnpoI?.ifsc_code}</p>
                      </Col>

                      <Col xs={12} md={8}>                       
                        <p>GST Number : {returnpoI?.gst_number}</p>
                      </Col>
                    </Row>


                  </Tab>

                  <Tab eventKey="otherinfo" title="Other Info">
                    <div className="ms-4">
                      <p className="mt-4 mb-2">Description</p>
                      <p>
                        {returnpoI?.description}
                      </p>
                    </div>
                  </Tab>

                  <Tab eventKey="documents" title="Documents">
                    <Row className="mt-4">
                      <Col xs={12} md={2} className="ms-4 display-flex">
                        <text className="documentsheader">
                          QA Document
                        </text>
                        <div className="doc-card position-relative">
                          <div className="pdfdwn">
                            <img src={pdf} alt="" />
                          </div>
                          <div className="doc-sec position-absolute">
                            <div className="d-flex justify-content-between">
                              {/* <Button className="view"
                               onClick={downloadDoc}>
                                <img src={download} alt="" />
                              </Button> */}
                              <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                    <a
                                        href={documentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img src={view} alt="" />
                                      </a>
                              </Button>
                               {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTab(`data:application/pdf;base64,${documentUrl}`)}>                                  
                                        <img src={view} alt="" />                                    
                                    </Button> */}
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={2} className="ms-4 display-flex">
                        <text className="documentsheader">
                          Invoice
                        </text>
                        <div className="doc-card position-relative">
                          <div className="pdfdwn">
                            <img src={pdf} alt="" />
                          </div>
                          <div className="doc-sec position-absolute">
                            <div className="d-flex justify-content-between">
                              {/* <Button className="view" onClick={downloadInvoice}>
                                <img src={download} alt="" />
                              </Button> */}
                              {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={InvoiceView}>
                             
                                        <img src={view} alt="" />
                                    
                              </Button> */}
                                <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                <a
                                        href={returnpoI?.invoice}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img src={view} alt="" />
                                    </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="grow" role="status" variant="light">
            <span className="visually-hidden">{formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}


    </>
  );
};

export default PurchaseReturnPODetails;
