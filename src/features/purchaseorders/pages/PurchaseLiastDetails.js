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
import { tableContent,tableBOM } from "../../../utils/TableContent";
const PurchaseLiastDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const orderNo = location.state;
  console.log("ORDERNOOOOOO", orderNo)
  const [showdelete, setShowdelete] = useState(false);
  const [photoUrls, setPhotoUrls] = useState({});
  const navigate = useNavigate();
  let totalfQty = 0;
  let totalpqty = 0;
  let totalgeqty = 0;
  const vendordetails = useSelector(selectcreatedPOinnervendorList)
  const vendordata = vendordetails?.body;
  const orderCategoryinfo = useSelector(selectcreatedPOCategoryinfoList);
  const orderCategoryinfodata = orderCategoryinfo?.body;
  const inWardList = useSelector(selectCreatedPOInwardList);
  const inWardListData = inWardList?.body;
  const bankDetails = useSelector(selectBankDetails);
  const otherInfo = useSelector(selectCreatedPOOtherInfo);
  const isLoading = useSelector(selectLoadingStatus)
    //inwardmodal
  const onwardModalList = useSelector(selectCreatedPOInwardModal);
  const onwardModalListdata = onwardModalList?.body;
   //docs
   const createpoDocs = useSelector(selectcreatePODocs);
   const createpoDocsdata = createpoDocs?.body;
   console.log(createpoDocsdata);
useEffect(()=> {
  
    dispatch(fetchCreatePOInnerVendorDetails(orderNo));  
    dispatch(fetchCreatedpoOrderedInfo(orderNo));
    dispatch(fetchCreatedpoDocuments(orderNo));
    dispatch(fetchCreatedpoBankdetails(orderNo));
    dispatch(fetchCreatedpoOtherInfo(orderNo));
    dispatch(fetchCreatedpoInwardList(orderNo));
}, [])

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
const downloadQadoc = (qadocUrl, qadocName) => {
  downloadFile(qadocUrl, qadocName);
};
  //modal qadoc download
  const downloadmodalqaDoc = (invoicemUrl, invoicemName) => {
    downloadFile(invoicemUrl, invoicemName);
  };
  //modal invoice download
  const downloadmodalInvoice = (invoicemUrl, invoicemName) => {
    downloadFile(invoicemUrl, invoicemName);
  };
const routeCreatepo = () => {
  let path = `/purchaseorders?tab=purchaselist`;
  navigate(path);
}

useEffect(() => {
  if (onwardModalListdata?.photo) {
    setPhotoUrls(onwardModalListdata?.photo);
  }
}, [onwardModalListdata]);
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
          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>         
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.vendorName} : {vendordata?.vendor_name} </h5>
            <h5 className="bomtag text-667 font-500">Contact : {vendordata?.contact} </h5>
          </Col>

          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.location} : {vendordata?.location} </h5>
            <h5 className="mb-2 bomtag text-667 font-500">Email : {vendordata?.email} </h5>
       
          </Col>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">{tableContent?.status} : {vendordata?.status} </h5>
            <h5 className="bomtag text-667 font-500">{tableContent?.orderDate} : {vendordata?.ordered_date} </h5>
          </Col>
          <h5 className="bomtag text-667 font-500">{tableBOM?.againstPO} : {vendordata?.against_po}</h5>
        </Row>

        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center">
            <div className="partno-sec">
              <div className="tab-sec">
                <Tabs
                  className="tabs-header"
                  id="controlled-tab-example"
                  // activeKey={key}
                  // onSelect={(k) => setKey(k)}
                >
                  {/* //order category List */}
                  <Tab eventKey="CategoryInfo" title="Ordered Category Info">
                    <div className="table-responsive mt-4 ms-2" id="tableData">
                      <Table className="bg-header gateentytable">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Manufacturer Part No</th>
                            <th>Part Name</th>
                            {/* <th>Manufacturer</th> */}
                            <th>Description</th>
                            {/* <th>Packaging</th> */}
                            {/* <th>Orderded Quantity</th> */}
                            <th>Quantity</th>
                            {/* <th>Recived Quantity</th> */}
                            <th>Price</th>
                            <th>Price Per Piece</th>
                          </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                           <tr>
                             <td colSpan="6" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                          {Array.isArray(orderCategoryinfodata) && orderCategoryinfodata.length > 0 ? (
                            orderCategoryinfodata.map((item, index) => (
                              <tr key={index} >
                                <td>{index + 1}</td>
                                <td>{item?.mfr_part_num}</td>
                                <td>{item?.part_name}</td>
                                {/* <td>{item.manufacturer}</td> */}
                                <td>{item?.description}</td>
                                {/* <td>{item?.packaging}</td> */}
                                <td>{item?.quantity}</td>
                                {/* <td>-</td> */}
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
                        {/* <tfoot>
                          <tr className="border-top">
                            <td> Total</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td> */}
                            {/* <td>{orderCategorytvalues?.total_quantity}</td>
                            <td>{orderCategorytvalues?.total_price}</td> */}
                            
                          {/* </tr>
                        </tfoot> */}
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
                          </tr>
                        </thead>
                        <tbody>

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
                                ) : "-"}
                              </td>
                              <td>
                              {item?.QA_document_name ? (
                                  <a className='dwn-doc text-dark' href={item.QA_document} target="_blank">
                                    {item.QA_document_name}
                                  </a>
                                ) : "-"}
                              </td>
                             
                            </tr>
                          ))}
                          {(!inWardListData || inWardListData.length === 0) && (
                            <tr>
                              <td colSpan="8" className="text-center">No Data Available</td>
                            </tr>
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
                      <p className="ms-4 ">Conversation Documents</p>
                      <Row>

                        {Array.isArray(createpoDocsdata) && createpoDocsdata.length > 0 ? (
                          createpoDocsdata.map((document, index) => (
                            <Col xs={12} md={3} key={index}>
                              <p className="pdf-tag">{document.document_name}</p>
                              <div className='doc-card position-relative'>
                                <div className='pdfdwn'><img src={pdf} alt="" /></div>
                                <div className='doc-sec position-absolute'>
                                  <div className='d-flex justify-content-end'>
                                    {/* <Button className='view' onClick={() => downloadDocument(document.presigned_url, document.document_name)}>
                                      <img src={download} alt="" />
                                    </Button> */}
                                    <Button className='view'><a href={document?.content} target="_blank" rel="noreferrer"><img src={view} alt="" /></a> </Button>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          ))
                        ) : (
                          <Col xs={12} md={12} className="text-center">
                            <p>No documents available.</p>
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
            className="linkformodal"
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
                              
                  ) : "-"}                 
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Photo : 
              {/* <span className="picsec position-relative" key={key}><span className="picdwn position-absolute" onClick={() => downloadmodalpic()}><img src={download} alt="" /></span><img src={url} /> </span> */}
              {Object.entries(photoUrls).map(([key, url]) => (
                 <span className="picsec position-relative" key={key}> <img src={url} /></span>
                 ))}
                 </h5>
               
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

export default PurchaseLiastDetails;
