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
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Spinner } from 'react-bootstrap';
import { selectLoadingState, selectGetClientInnerdata, getClinetInnerdata } from '../slice/ClientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ExcelUpload from "./ExcelUpload";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { tableContent, ordersTable, textToast, formFieldsVendor } from "../../../utils/TableContent";

const ClientDetails = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [showdelete, setShowdelete] = useState(false);
  const location = useLocation()
  const client_id = location.state;
  console.log(client_id, "client_idclient_id")
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingState)
  const clientIdata = useSelector(selectGetClientInnerdata);
  const clientDtetails = clientIdata?.body;
  console.log(clientDtetails, "clientIdata");

  const documentUrls =
    (clientDtetails?.documents || [])?.map(
      (document) => document.content
    ) || [];

  const deleteShowModal = (e) => {
    setShowdelete(true);
  };

  const handleClosedelete = async () => {
    setShowdelete(false);
  };

  useEffect(() => {
    const requestobj = {
      client_id: client_id
    }
    dispatch(getClinetInnerdata(requestobj));
    setKey("Bominfo");
  }, [dispatch])


  useEffect(() => {
    const prevIousActivekey = localStorage.getItem("clientDetails");
    console.log(prevIousActivekey);
    setKey(prevIousActivekey);
  }, [key])



  // const downloadDocument = (documentUrl, documentName) => {
  //   fetch(documentUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = documentName;
  //       link.click();
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading PDF:", error);
  //     });
  // };
   //download  csv
   const exportExcel = () => {
    let headers = [
      "bom_id,po_id,description,qty,unit,rate,discount,gst,basic_amount",
    ];

    headers = headers.map(header => '"' + header.split(",").join('","') + '"');

    downloadFile({
      data: headers.join("\n"),
      fileName: "ClientOrders.csv",
      fileType: "text/csv",
    });
  };
  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const downloadpdf = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
      const vendorId = clientDtetails?.client_id;
      const vendorName = clientDtetails?.client_name;
      const createdDate = clientDtetails?.created_date;
      const contactNo = clientDtetails?.contact_number;
      const Email = clientDtetails?.email;
      const Location = clientDtetails?.client_location;

    const input = document.getElementById("tableData");
    if (!input) return;
    const tableElement = input.querySelector("table");
    if (!tableElement) return;
    const imgWidth = 500;
    const imgHeight =
      (tableElement.offsetHeight * imgWidth) / tableElement.offsetWidth;

    pdf.setFontSize(12);
     // Function to add text with automatic line break
  const addTextWithLineBreak = (text, x, y, maxWidth) => {
    const textLines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(textLines, x, y);
  };

  // Adding text with automatic line break
  addTextWithLineBreak(`Client ID : ${vendorId}`, 40, 35, 500);
  addTextWithLineBreak(`Client Name : ${vendorName}`, 40, 55, 500);
  addTextWithLineBreak(`Client Created Date : ${createdDate}`, 40, 75, 500);
  addTextWithLineBreak(`Contact No : ${contactNo}`, 40, 95, 500);
  addTextWithLineBreak(`Location : ${Location}`, 40, 115, 500);
  addTextWithLineBreak(`Email : ${Email}`, 40, 140, 500);
    // pdf.text(`Client ID : ${vendorId}`, 40, 35);
    // pdf.text(`Client Name : ${vendorName}`, 40, 50);
    // pdf.text(`Client Created Date : ${createdDate}`, 40, 65);
    // pdf.text(`Contact No : ${contactNo}`, 40, 80);
    // pdf.text(`Location : ${Location}`, 40, 95);
    // pdf.text(`Email : ${Email}`, 40, 110);
    // Define an array of light pastel colors
    const pastelColors = ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff"];

    const headers = ['Bom Name', 'Categories', 'Moq', 'Warranty ( yrs )', 'Lead Time(wks)', 'Price', 'GST %'];
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
      startY: 175,
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

    pdf.save("Clientinfo.pdf");
  };
  const handleTableRowClick = (event, item) => {
    const clickedCell = event.target;
    const lastThreeCells = Array.from(clickedCell.parentElement.children).slice(-3);
    if (!lastThreeCells.includes(clickedCell)) {
      let path = `/bomlistdetails`;
      navigate(path, {
        state: {
          bom_name: item?.bom_name,
          bom_id: item?.bom_id,
          created_date: item?.created_date
        },
      });
    }
  };

  const handleClientOrderPage = (item) => {
    console.log(item)
    navigate("/clientOrderPage" , {
      state : {
      bom_id : item?.bom_id,
      po_id : item?.po_id,       
      }  
    })  
    
  }
  


  const handleTabChange = (tab) => {
    localStorage.setItem("clientDetails", tab);
    setKey(tab);
  }

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
      <div className="wrap">
        <h1 className="title-tag">Client Details</h1>
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center width-left">
            <h1 className="title-tag mb-0 titletag-length-fix" title={clientDtetails?.client_name}>
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => { 
                  navigate(-1);
                  localStorage.setItem("clientDetails", "Bominfo")
                }}
              />
              {clientDtetails?.client_name}
            </h1>
           
          </div>
          <div className="mobilemargin-top width-right">
            <Button className="submit me-2 md-me-2 submitmobile" onClick={downloadpdf} disabled={!clientDtetails?.boms || Object.keys(clientDtetails?.boms || {}).length === 0}>
              {ordersTable?.pdf}
            </Button>
            {/* <Button
              className="btn-outline-dark submit-85 submit-block"
              onClick={OpenInwardPurchase}
            >
              Inward Purchase
            </Button> */}
          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.clientCreatedDate} : {clientDtetails?.created_date}</h5>
          </Col>
          <Col xs={12} md={8}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.location} : {clientDtetails?.client_location}</h5>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <h5 className="bomtag text-667 font-500">{tableContent?.contact}  : {clientDtetails?.contact_number}</h5>
          </Col>
          <Col xs={12} md={8}>
            <h5 className="bomtag text-667 font-500">{tableContent?.email} : {clientDtetails?.email}</h5>
          </Col>
        </Row>
        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="partno-sec">
              <div className="tab-sec">
                <Tabs
                  className="tabs-header"
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={handleTabChange}
                >
                  <Tab eventKey="Bominfo" title="BOM's Info">
                    <div className="table-responsive mt-4 ms-4" id="tableData">
                      <Table className="bg-header">
                        <thead>
                          <tr>
                            {/* <th>{tableContent?.bomId}</th> */}
                            <th>{tableContent?.bomName}</th>
                            <th>{tableContent?.categories}</th>
                            <th>{tableContent?.moq}</th>
                            <th>{tableContent?.warranty}</th>
                            <th>{tableContent?.leadTime}</th>
                            <th>Unit Price</th>
                            <th>{tableContent?.GST}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                            <>
                              {Object.keys(clientDtetails?.boms || {}).length === 0 ? (
                                <tr>
                                  <td colSpan="8" className="text-center">
                                    {tableContent?.nodata}
                                  </td>
                                </tr>
                              ) : (
                                Object.keys(clientDtetails?.boms || {}).map((bomKey, index) => {
                                  const bom = clientDtetails.boms[bomKey];
                                  return (
                                    <tr key={index} onClick={(e) => handleTableRowClick(e, bom)}>
                                      {/* <td>{bom?.bom_id}</td> */}
                                      <td>{bom?.bom_name}</td>
                                      <td>{bom?.total_categories}</td>
                                      <td>{bom?.moq}</td>
                                      <td>{bom?.warranty}</td>
                                      <td>{bom?.lead_time}</td>
                                      <td>{bom?.price}</td>
                                      <td>{bom?.gst}</td>
                                    </tr>
                                  );
                                })
                              )}
                            </>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="otherinfo" title="Other Info">
                    <div className="ms-4">
                      <p className="mt-4 mb-2 font-bold">{ordersTable?.termsText}</p>
                      {/* <div className="pterms">
                       {extractTextFromHtml(clientDtetails?.terms_and_conditions).split('\n').map((item, index) => (
                        <p key={index}>{item.trim()}</p>
                      ))}
                      </div> test */}
                      <div className="pterms" dangerouslySetInnerHTML={{ __html: clientDtetails?.terms_and_conditions }} />
                      <p className="mt-4 mb-2 font-bold">{ordersTable?.paymentText}</p>
                      {/* <div className="pterms" dangerouslySetInnerHTML={{ __html: clientDtetails?.payment_terms }} /> */}

                      {/* {clientDtetails?.payment_terms.split('\n').map((item, index) => (
                        <div key={index} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}                   */}
                      {/* <div className="pterms">
                      {extractTextFromHtml(clientDtetails?.payment_terms).split('\n').map((item, index) => (
                        <p key={index}>{item.trim()}</p>
                      ))}
                     </div> */}
                      <div className="pterms" dangerouslySetInnerHTML={{ __html: clientDtetails?.payment_terms }} />
                    </div>
                  </Tab>

                  <Tab eventKey="documents" title="Documents">
                    <p className="ms-4 font-bold">Conversation Documents</p>
                    {clientDtetails?.documents &&
                      clientDtetails.documents.length > 0 ? (
                      <Row className="mt-4">
                        {clientDtetails.documents.map(
                          (document, index) => (
                            <Col xs={12} md={2} key={index}>
                              <p className="pdf-tag">{document.document_name}</p>
                              <div className="doc-card position-relative">
                                <div className="pdfdwn">
                                  <img src={pdf} alt="" />
                                </div>
                                <div className="doc-sec position-absolute">
                                  <div className="d-flex justify-content-between">                      
                                    <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                      <a
                                        href={documentUrls[index]}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img src={view} alt="" />
                                      </a>{" "}
                                    </Button>
                                    {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTab(`data:application/pdf;base64,${documentUrls[index]}`)}>                                  
                                        <img src={view} alt="" />                                    
                                    </Button> */}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          )
                        )}
                      </Row>
                    ) : (
                      <p>{textToast?.noDoc}</p>
                    )}

                  </Tab>

                  <Tab
                    eventKey="Orders"
                    title="Orders"
                  >
                    <div className="table-responsive" id="tableData">
                      <Table className="bg-header">
                        <thead>
                          <tr>
                            <th>{ordersTable?.Sno}</th>
                            <th>{ordersTable?.bomId}</th>
                            <th>{ordersTable?.poId}</th>
                            <th>{ordersTable?.description}</th>
                            <th>{tableContent?.qty}</th>
                            <th>{ordersTable?.unit}</th>
                            <th>{ordersTable?.rate}</th>
                            <th>{ordersTable?.discount}</th>
                            <th>{tableContent?.GST}</th>
                            <th>{ordersTable?.basicAmount}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan="8" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                            <>
                              {Object.keys(clientDtetails?.orders || {}).length === 0 ? (
                                <tr>
                                  <td colSpan="10" className="text-center">
                                    {tableContent?.nodata}
                                  </td>
                                </tr>
                              ) : (
                                Object.keys(clientDtetails?.orders || {}).map((orderkey, index) => {
                                  const item = clientDtetails.orders[orderkey];
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td >{item?.bom_id}</td>
                                      <td onClick={() => handleClientOrderPage(item)}><span className="border-item">{item?.po_id}</span></td>
                                      <td>{item?.description}</td>
                                      <td>{item?.qty}</td>
                                      <td>{item?.unit}</td>
                                      <td>{item?.rate}</td>
                                      <td>{item?.discount}</td>
                                      <td>{item?.gst}</td>
                                      <td>{item?.basic_amount}</td>
                                    </tr>
                                  );
                                })
                              )}
                            </>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
            {/* <Button className='submit mb-1 submit-block' onClick={(e) => deleteShowModal(e)}>
              Upload CSV
            </Button> */}
            {key === "Orders" && (
              <div>
               <Button className='submit submit-block me-2 mb-1' onClick={exportExcel}>
               Download Csv Format
             </Button>
              <Button className='submit submit-block mb-1' onClick={(e) => deleteShowModal(e)}>
                Upload CSV
              </Button>
              </div>
            )}


          </div>
        </div>
      </div>

      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="grow" role="status" variant="light">
            <span className="visually-hidden">{formFieldsVendor?.loader}</span>
          </Spinner>
        </div>
      )}

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

      <Modal show={showdelete} onHide={handleClosedelete} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center modal-title-tag w-100">
            Upload CSV File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExcelUpload hide={handleClosedelete} clientId={clientDtetails?.client_id} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ClientDetails;

