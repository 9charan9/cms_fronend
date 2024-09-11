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
import "../styles/PurchaseOrder.css";
import { Modal } from "react-bootstrap";
import cancel from "../../../assets/Images/cancel.svg";
import { selectcreatedPOinnervendorList, fetchCreatePOInnerVendorDetails, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import { selectcreatedPOCategoryinfoList, fetchCreatedpoOrderedInfo } from "../slice/PurchaseOrderSlice";
import { selectcreatePODocs, fetchCreatedpoDocuments } from "../slice/PurchaseOrderSlice";
import { selectBankDetails, fetchCreatedpoBankdetails } from "../slice/PurchaseOrderSlice";
import { fetchCreatedpoOtherInfo, selectCreatedPOOtherInfo } from "../slice/PurchaseOrderSlice";
import { selectCreatedPOInwardModal, fetchCreatedpoInwardModalList } from "../slice/PurchaseOrderSlice";
import { selectCreatedPOInwardList, fetchCreatedpoInwardList } from "../slice/PurchaseOrderSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast, ToastContainer, Zoom } from "react-toastify";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import queryString from "query-string";
import { tableContent, tableBOM } from "../../../utils/TableContent";
const CreatedPODetails = () => {
  let totalfQty = 0;
  let totalpqty = 0;
  let totalgeqty = 0;
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [photoUrls, setPhotoUrls] = useState({});
  const navigate = useNavigate();
  const [showdelete, setShowdelete] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [key, setKey] = useState(queryParams.tab || "CategoryInfo");
  const orderNo = location.state;
  const vendordetails = useSelector(selectcreatedPOinnervendorList)
  const isLoading = useSelector(selectLoadingStatus)

  const [selectedUrl,setSelectedUrl] = useState("");

  //categoryinfo
  const orderCategoryinfo = useSelector(selectcreatedPOCategoryinfoList);
  const totalRecQty = orderCategoryinfo?.rcvd_qty
  console.log(orderCategoryinfo, "totalll")

  //docs
  const createpoDocs = useSelector(selectcreatePODocs);
  const createpoDocsdata = createpoDocs?.body;
  console.log(createpoDocsdata);
  // const documentUrls = (createpoDocsdata || [])?.map(document => document.presigned_url) || [];
  const documentUrls = Array.isArray(createpoDocsdata)
    ? createpoDocsdata.map(document => document.presigned_url)
    : [];
  //bank
  const bankDetails = useSelector(selectBankDetails);
  console.log(bankDetails);
  //otherInfo
  const otherInfo = useSelector(selectCreatedPOOtherInfo);
  console.log(otherInfo);
  const vendordata = vendordetails?.body;
  // console.log(vendordata?.order_id, "poid");
  const po_id = vendordata?.order_id;
  const orderCategoryinfodata = orderCategoryinfo?.body;
  const totalQuantity = Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.reduce((sum, item) => sum + parseInt(item.quantity) || 0, 0);
  const totalReceivedQuantity = Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.reduce((sum, item) => sum + parseInt(item.received_qty) || 0, 0);
  const totalPrice = Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.reduce((sum, item) => sum + parseInt(item.price) || 0, 0);
  //inwardmodal
  const onwardModalList = useSelector(selectCreatedPOInwardModal);
  const onwardModalListdata = onwardModalList?.body;
  // console.log(onwardModalListdata?.total_quantity,"onwardModalListdata onwardModalListdata onwardModalListdata")
  //inward List
  const inWardList = useSelector(selectCreatedPOInwardList);
  const inWardListData = inWardList?.body;
  console.log(inWardListData);
  const getOrderNumber = vendordata?.order_id
  //console.log("getOrderId.............", getOrderNumber)

  let pdfUrl = "";
  if (createpoDocsdata && createpoDocsdata.length > 0) {
    pdfUrl = createpoDocsdata[0].presigned_url;
  }

  const deleteShowModal = (item) => {
    //setInwardid(item?.inward_id)
    // console.log("Inward ID:", item);
    const request = {
      "inward_id": item?.inward_id,
      "status": item?.status
    }
    dispatch(fetchCreatedpoInwardModalList(request));
    setShowdelete(true);
  };

  const handleClosedelete = async () => {
    setShowdelete(false);
  };
  // Create a reusable function for downloading files
  const downloadFile = (fileUrl, fileName) => {
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .catch(error => {
        console.error(`Error downloading file: ${fileName}`, error);
      });
  };

  const downloadInvoice = (invoiceUrl, invoiceName) => {
    downloadFile(invoiceUrl, invoiceName);
  };
  //modal pic download
  const downloadmodalpic = () => {
    const modalPicUrl = onwardModalListdata?.photo // Change this URL to your modal pic URL
    // Extract the file name from the URL
    const fileName = modalPicUrl.substring(modalPicUrl.lastIndexOf("/") + 1);
    fetch(modalPicUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .catch(error => {
        console.error("Error downloading modal pic:", error);
      });

  };
  //modal qadoc download
  const downloadmodalqaDoc = (invoicemUrl, invoicemName) => {
    downloadFile(invoicemUrl, invoicemName);
  };
  //modal invoice download
  const downloadmodalInvoice = (invoicemUrl, invoicemName) => {
    downloadFile(invoicemUrl, invoicemName);
  };
  //download QA doc
  const downloadQadoc = (qadocUrl, qadocName) => {
    downloadFile(qadocUrl, qadocName);
  };
  // const downloadDocument = (documentUrl, documentName) => {
  //   downloadFile(documentUrl, documentName);
  // };

  const downloadpdf = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const vendorId = vendordata?.vendor_id;
    const vendorName = vendordata?.vendor_name;
    const createdDate = vendordata?.ordered_date;
    const contactNo = vendordata?.contact;
    const Email = vendordata?.email;
    const Location = vendordata?.location;
    const Status = vendordata?.status;
    const input = document.getElementById('tableData');
    if (!input) return;
    const tableElement = input.querySelector('table');
    if (!tableElement) return;
    const imgWidth = 500;
    const imgHeight = (tableElement.offsetHeight * imgWidth) / tableElement.offsetWidth;

    pdf.setFontSize(12);
    const addTextWithLineBreak = (text, x, y, maxWidth) => {
      const textLines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(textLines, x, y); 
  };

    // Adding text with automatic line break
  addTextWithLineBreak(`Status : ${Status}`, 40, 35, 500);
  addTextWithLineBreak(`Email : ${Email}`, 40, 55, 500);
  addTextWithLineBreak(`Location : ${Location}`, 40, 85, 500);

  // Define an array of light pastel colors
    const pastelColors = ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'];
    const headers = ['S No', 'Part No', 'Part Name', 'Description', 'Quantity', 'Received Quantity', 'Price', 'Price Per Piece'];
    const data = [];
    const rows = tableElement.querySelectorAll('tbody tr');
    rows.forEach((row, rowIndex) => {
      const rowData = [];
      const cells = row.querySelectorAll('td');

      cells.forEach((cell, columnIndex) => {
        const backgroundColor = pastelColors[(rowIndex + columnIndex) % pastelColors.length];
        rowData.push({ content: cell.textContent, styles: { fillColor: backgroundColor } });
      });

      data.push(rowData);
    });

    // Calculate the table footer data

    const totalQuantity = Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.reduce((sum, item) => sum + parseInt(item.quantity) || 0, 0);
    const totalReceivedQuantity = Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.reduce((sum, item) => sum + parseInt(item.received_qty) || 0, 0);
    const totalPrice = Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.reduce((sum, item) => sum + parseInt(item.price) || 0, 0);
    // const totalQuantity =  || 0;
    // const totalPrice = orderCategorytvalues?.total_price || 0;
    const tableFooterData = [
      ['Total', '', '', '', totalQuantity, totalReceivedQuantity, totalPrice, ''],
    ];
    // Calculate the height of the table based on the number of rows and other factors
    const tableHeight = 500; // Adjust this value as needed

    // Add the table to the PDF
    pdf.autoTable({
      head: [headers],
      body: data,
      startY: 115, // Add a little padding
      styles: {
        cellPadding: 5,
        fontSize: 7,
        textColor: [0, 0, 0], // Table text color
        lineColor: [0, 0, 0], // Table border color
        lineWidth: 0.1, // Table border line width
      },
      headerStyles: {
        fillColor: false, // Disable header background color
        textColor: [0, 0, 0], // Table header text color
        fontStyle: 'bold',
      },
      foot: tableFooterData,
    });

    pdf.save('CreatedPoOrderedInfo.pdf');
  };

  const routeInward = (item) => {
    navigate(`/inwardpurchase3`, {
      state: {
        po_id: po_id,
        inward_id: item?.inward_id,
      },
    });
  };

  const routeQatest = (item) => {
    console.log(item?.inward_id);
    navigate(`/inwardpurchase2`, {
      state: {
        po_id: po_id,
        inward_id: item?.inward_id,
      },
    });
  };
  const forceRender = () => {
    setForceUpdateKey(forceUpdateKey + 1);
  };
  useEffect(() => {
    if (onwardModalListdata?.photo) {
      setPhotoUrls(onwardModalListdata?.photo);
    }
  }, [onwardModalListdata]);
  useEffect(() => {
    dispatch(fetchCreatePOInnerVendorDetails(orderNo));
    dispatch(fetchCreatedpoOrderedInfo(orderNo));
    dispatch(fetchCreatedpoDocuments(orderNo));
    dispatch(fetchCreatedpoBankdetails(orderNo));
    dispatch(fetchCreatedpoOtherInfo(orderNo));
    dispatch(fetchCreatedpoInwardList(orderNo));

  }, [dispatch])

  // useEffect(() => {
  //   dispatch(fetchCreatedpoInwardList(orderNo));
  //   forceRender();
  // }, [dispatch, orderNo]);

  useEffect(() => {
    // Check if vendordata is available
    if (vendordata && vendordata?.order_id) {
      const poId = vendordata?.order_id;
      // Now you can safely navigate with the poId
      navigate(`?tab=${key}`, { state: poId });
    }
  }, [vendordata, key, navigate]);

  if (!vendordetails) {
    return null;
  }
  const routeCreatepo = () => {
    let path = `/purchaseorders?tab=createdpos`;
    navigate(path);
  }

  const navigateToGateEntry = () => {
    let path = `/gateEntry`;
    navigate(path, {
      state: {
        getOrderNumber: getOrderNumber,
        date: vendordata?.ordered_date
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
 
  const handleChange = (event) => {
    const url = event.target.value;
    setSelectedUrl(url);
  };
 
  const handleDownload = () => {
    if (!selectedUrl) {
      alert("Please select a file to download.");
      return;
    }
 
    const link = document.createElement("a");
    link.href = selectedUrl;
    link.download = selectedUrl.substring(selectedUrl.lastIndexOf("/") + 1);
    link.target = "_blank"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <div className="wrap">
        <h1 className="title-tag">Purchase orders</h1>
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => routeCreatepo()}
              />
              {vendordata?.order_id}
            </h1>
            <div className="ms-3"></div>
          </div>
          <div className="mobilemargin-top">
            <Button className="submit me-2 md-me-2 submitmobile" onClick={downloadpdf}>
              Download as pdf
            </Button>
            {totalQuantity === totalReceivedQuantity ? (

              <Button
                className="submit mb-1 submit-block" disabled
              >
                Gate Entry
              </Button>) : (<Button
                className="btn-outline-dark submit-85 submit-block btn-gate-entry"
                onClick={(e) => navigateToGateEntry()}
                disabled={vendordata?.status === 'PO Issued' || vendordata?.status === 'PO Generated' || vendordata?.status === 'Cancel' || vendordata?.status === 'Received'}
              // onClick={() => navigate("/gateEntry")}
              >
                Gate Entry
              </Button>)
            }
          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>
            {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.vendorId} : {vendordata?.vendor_id}</h5> */}
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.vendorName} : {vendordata?.vendor_name}</h5>
            <h5 className="mb-2 bomtag text-667 font-500">Contact : {vendordata?.contact}</h5>
            <h5 className="bomtag text-667 font-500">{tableContent?.location} : {vendordata?.location} </h5>
            <h5 className="bomtag text-667 font-500">Shipping Address : {vendordata?.shipping_address} </h5>
          </Col>

          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">Email : {vendordata?.email}</h5>
            <h5 className="mb-2 bomtag text-667 font-500">{tableContent?.orderDate} : {vendordata?.ordered_date}</h5>
            <h5 className="bomtag text-667 font-500">Status : {vendordata?.status}</h5>
          </Col>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableBOM?.DED} : {vendordata?.deo}</h5>
            <h5 className="bomtag text-667 font-500">{tableBOM?.againstPO} : {vendordata?.against_po}</h5>
            <h5 className="bomtag text-667 font-500">Billing Address : {vendordata?.billing_address} </h5>
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
                  {/* //order category List */}
                  <Tab eventKey="CategoryInfo" title="Ordered Category Info">
                    <div className="table-responsive mt-4 ms-2" id="tableData">
                      <Table className="bg-header gateentytable">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Part No</th>
                            <th>Part Name</th>
                            <th>Category Name</th> 
                            <th>Description</th>
                            {/* <th>Packaging</th> */}
                            <th>Orderded Quantity</th>
                            <th>Received Quantity</th>
                            <th>Price</th>
                            <th>Price Per Piece</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                            <>
                              {Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.length > 0 ? (
                                orderCategoryinfodata.map((item, index) => (
                                  <tr key={index} >
                                    <td>{index + 1}</td>
                                    <td>{item?.mfr_part_num}</td>
                                    <td>{item.part_name}</td>
                                    <td>{item.ctgr_name || "-"}</td> 
                                    <td>{item.description}</td>
                                    {/* <td>{item.packaging}</td> */}
                                    <td>{item.quantity}</td>
                                    <td>{item.received_qty}</td>
                                    <td>
                                      {item?.price}
                                    </td>
                                    <td>
                                      {item?.price_per_piece}
                                    </td>
                                  </tr>
                                ))) :
                                (!orderCategoryinfodata || orderCategoryinfodata.length === 0) && (
                                  <tr>
                                    <td colSpan="9" className="text-center">No Data Available</td>
                                  </tr>
                                )}
                            </>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-top">
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalQuantity}</td>
                            <td>{totalReceivedQuantity}</td>
                            <td>{totalPrice}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Tab>
                  {/* //inward List */}
                  <Tab
                    eventKey="inwardcategoryinfo"
                    title="Inward Category info"
                  >
                    <div className="table-responsive mt-4 ms-2">
                      <Table className="bg-header">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>Inward ID</th>
                            <th>No. of Parts</th>
                            <th>Gate Entry Date</th>
                            <th>QA Date</th>
                            <th>Inward Date</th>
                            <th>Invoice</th>
                            <th>QA Document</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                            <>
                              {inWardListData && Array.isArray(inWardListData) && inWardListData?.map((item, index) => (
                                <tr key={item.inward_id} >
                                  <td>{index+1}</td>
                                  <td> <a
                                    onClick={() => deleteShowModal(item)}
                                    className="text-black linkformodal"
                                  >
                                    {item?.inward_id}
                                  </a></td>
                                  <td>{item?.no_of_parts}</td>
                                  <td>{item?.gate_entry_date || "-"}</td>
                                  <td>{item?.QA_date || "-"}</td>
                                  <td>{item?.inward_date || "-"}</td>
                                  <td>
                                  {item?.invoice_name ? (
                                    <a className='dwn-doc text-dark' href={item.invoice} target="_blank">
                                    {item.invoice_name}
                                  </a>
                                  
                  //                   <span className="dwn-doc text-667"                        
                  // onClick={() => openPDFInNewTab(`data:application/pdf;base64,${item.invoice}`)}
                  //                   > {item?.invoice_name}</span>            
                                           
                                    ) : "-"} 
                                
                                  </td>
                                  <td>
                                  {item?.QA_document_name ? (
                                   <a className='dwn-doc text-dark' href={item.QA_document} target="_blank">
                                   {item.QA_document_name}
                                 </a>
                                  // <span className="dwn-doc text-667"                        
                                  // onClick={() => openPDFInNewTab(`data:application/pdf;base64,${item.QA_document}`)}
                                  //                   > {item.QA_document_name}</span>  
                                ) : "-"}
                                  </td>
                                  <td>
                                    {/* <Button
                                  className="submit rounded-pill"
                                  id=""
                                  onClick={() => {
                                    navigate("/inwardpurchase2");
                                  }}
                                >
                                  {item?.actions}
                                </Button> */}


                                    {item?.actions === "QA_test" ? (
                                      <Button
                                        className="submit rounded-pill"
                                        onClick={() => routeQatest(item)}
                                      >
                                        QA Test
                                      </Button>
                                    ) : item?.btn === 0 ? (
                                      <Button
                                        className="submit rounded-pill"
                                        disabled
                                      // onClick={() => routeQatest(item)}
                                      >
                                        QA Test
                                      </Button>
                                    ) : (
                                      <Button
                                        className="submit rounded-pill"
                                        onClick={() => routeInward(item)}
                                        disabled={item?.actions === "inwarded"}
                                      >
                                        {item?.actions === "inwarded" ? `Inwarded` : `Inward`}
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              {(!inWardListData || inWardListData.length === 0) && (
                                <tr>
                                  <td colSpan="8" className="text-center">No Data Available</td>
                                </tr>
                              )}
                            </>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="bankdetails" title="Bank Details">
                    <Row className="mt-4 ms-4">
                      <Col xs={12} md={5}>
                        <p className="mb-2">Bank Name : {bankDetails?.body?.bank_name} </p>                       
                      </Col>
                      <Col xs={12} md={6}>
                        <p className="mb-2">Account Number :  {bankDetails?.body?.account_number} </p>                       
                      </Col>
                    </Row>
                    <Row className="mt-2 ms-4">
                      <Col xs={12} md={5}>                       
                        <p>IFSC Code : {bankDetails?.body?.ifsc_code} </p>
                      </Col>
                      <Col xs={12} md={6}>                       
                        <p>GST Number : {bankDetails?.body?.gst_number} </p>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="otherinfo" title="Other Info">
                    <div className="ms-4">
                      <p className="mt-4 mb-2 font-bold">Terms & Conditions</p>
                      <p>
                        {otherInfo?.body?.terms_and_conditions}
                      </p>
                      <p className="mt-4 mb-2 font-bold">Payment Terms</p>
                      <p>
                        {otherInfo?.body?.payment_terms}
                      </p>
                    </div>
                  </Tab>

                  <Tab eventKey="documents" title="Documents">
                    <div className="w-100">
                      <p className="ms-4 font-bold">Conversation Documents</p>
                      <Row>

                        {Array.isArray(createpoDocsdata) && createpoDocsdata.length > 0 ? (
                          createpoDocsdata.map((document, index) => (
                            <Col xs={12} md={3} key={index}>
                              <p className="pdf-tag">{document.document_name}</p>
                              <div className='doc-card position-relative'>
                                <div className='pdfdwn'><img src={pdf} alt="" /></div>
                                <div className='doc-sec position-absolute'>
                                  <div className='d-flex justify-content-between'>
                                    {/* <Button className='view' onClick={() => downloadDocument(document.presigned_url, document.document_name)}>
                                      <img src={download} alt="" />
                                    </Button> */}
                                     {/* <a href={documentUrls[index]} target="_blank" rel="noreferrer"></a> */}
                                    {/* <Button className='view'
                                      style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                      <a href={document?.presigned_url} target="_blank" rel="noreferrer">
                                        <img src={view} alt="" /></a>
                                    </Button> */}
                                    {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTab(`data:application/pdf;base64,${document?.content}`)}>                                  
                                        <img src={view} alt="" />                                    
                                    </Button> */}
                                     <Button className='view'
                                      style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                      <a href={document?.content} target="_blank" rel="noreferrer">
                                        <img src={view} alt="" /></a>
                                    </Button> 
                                  </div>
                                </div>
                              </div>
                            </Col>
                          ))
                        ) : (
                          <Col xs={12} md={12} className="text-center">
                            <p>No Documents Available.</p>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* //modal */}
      <Modal show={showdelete} onHide={handleClosedelete} centered className="inward-modal">
        <Modal.Header className="text-center pb-0">
          <h6>Inward ID - {onwardModalListdata?.inward_id}</h6>
          <img
            src={cancel}
            onClick={handleClosedelete}
            className="linkformodal ms-auto mb-2"
          ></img>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Name : {onwardModalListdata?.sender_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Contact : {onwardModalListdata?.sender_contact_number}
              </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Name : {onwardModalListdata?.receiver_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Contact : {onwardModalListdata?.receiver_contact}
              </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Invoice :               
              {onwardModalListdata?.invoice_name ? (
                 <a className="dwn-doc text-667" href={onwardModalListdata?.invoice} target="_blank"> {onwardModalListdata?.invoice_name}</a>
//                   <span className="dwn-doc text-667" 
                  
// onClick={() => openPDFInNewTab(`data:application/pdf;base64,${onwardModalListdata?.invoice}`)}
//                   > {onwardModalListdata?.invoice_name}</span>            
                         
                  ) : "-"}                 
              </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Gate Entry Date : {onwardModalListdata?.gate_entry_date || "-"}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Inward Date : {onwardModalListdata?.inward_date || "-"}</h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">QA Date : {onwardModalListdata?.qa_date || "-"}</h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">QA Document :
              {onwardModalListdata?.qa_document_name ? (
                  <a className="dwn-doc text-667" href={onwardModalListdata?.qa_document} target="_blank" rel="noopener noreferrer">{onwardModalListdata?.qa_document_name}</a>
//                   <span className="dwn-doc text-667" 
                  
// onClick={() => openPDFInNewTab(`data:application/pdf;base64,${onwardModalListdata?.qa_document}`)}
//                   > {onwardModalListdata?.qa_document_name}</span>
                              
                  ) : "-"}                              
              </h5>
           
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Photo :
                {/* <span className="picsec position-relative" key={key}><span className="picdwn position-absolute" onClick={() => downloadmodalpic()}><img src={download} alt="" /></span><img src={url} /> </span> */}
                {Object.entries(photoUrls).map(([key, url]) => (
                  <span className="picsec position-relative" key={key}> 
                  <img src={url} />
                  {/* <img src={item.ctgr_image !== "" ? `data:image/jpeg;base64, ${item.ctgr_image}` : noImageFound} alt={item.ctgr_name} /> */}
                  </span>
                ))}
              </h5>

            </Col>
            
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Comments : {onwardModalListdata?.description || "-"}</h5>
            </Col>

            <Col xs={12} md={4}>
            <div className="d-flex align-items-center">
              <h5 className="bomtag text-667  me-2 mt-2">IQC Documents:</h5>
                <select value={selectedUrl} onChange={handleChange} className="form-select me-2 mb-2">
                  <option value="">Select a file...</option>
                    {onwardModalListdata?.excel?.map((file, index) => (
                  <option key={index} value={file.url}>
                    {file.name.split('.')[0]}
                  </option>
                    ))}
                  </select>
              <Button onClick={handleDownload} className="submit mb-2">Download</Button>
            </div>
            </Col>
          </Row>
          <div className="table-responsive">
            <Table className="bg-header gateentytable">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Part No</th>
                  <th>Part Name</th>
                  <th>Manufacturer</th>
                  <th>Description</th>
                  <th>lot Id</th>
                  {/* <th>Packaging</th> */}
                  <th>Orderded Qty</th>
                  <th>Received Qty</th>
                  <th>Pass Qty</th>
                  <th>Fail Qty</th>
                  <th>Inventory Position</th>
                  <th>Batch No</th>
                </tr>
              </thead>
              <tbody className="border-top">
                {onwardModalListdata?.parts && Array.isArray(onwardModalListdata?.parts) && onwardModalListdata?.parts?.map((item, index) => {
                  totalfQty += +item?.fail_quantity || 0;
                  totalpqty += +item?.pass_quantity || 0;
                  totalgeqty += +item?.gate_entry_qty || 0;
                  return (

                    <tr>
                      <td>{index + 1}</td>
                      <td>{item?.part_no}</td>
                      <td>{item?.part_name}</td>
                      <td>{item?.manufacturer}</td>
                      <td>{item?.description}</td>
                      <td>{item?.lot_id}</td>
                      {/* <td>{item?.packaging}</td> */}
                      <td>
                        {item?.quantity}
                      </td>
                      <td>
                        {item?.gate_entry_qty}
                      </td>
                      <td>
                        {item?.pass_quantity || "-"}
                      </td>
                      <td>
                        {item?.fail_quantity || "-"}
                      </td>
                      <td>
                        {item?.inventory_position}
                      </td>
                      <td>
                        {item?.batch_no}
                      </td>
                    </tr>
                  );
                })}
                {(!onwardModalListdata?.parts || onwardModalListdata?.parts.length === 0) && (
                  <tr>
                    <td colSpan="10" className="text-center">No Data Available</td>
                  </tr>
                )}

              </tbody>
              <tfoot>
                <tr className="border-top">
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{onwardModalListdata?.total_quantity}</td>
                  <td>{totalgeqty}</td>
                  <td>{totalpqty}</td>
                  <td>{totalfQty}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center"></Modal.Footer>
      </Modal>

      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="grow" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
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
        transition={Zoom}
      />


    </>
  );
};

export default CreatedPODetails;
