import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import "jspdf-autotable";
import { cmsGetForcastInnerDetails, cmsUpdateForcastPostComments, selectForecastData, selectForecastUpdateComments, selectForecatCardData, selectLoadingState } from "../slice/SalesSlice";
import Card from 'react-bootstrap/Card';
import pdficon from "../../../assets/Images/pdficon.svg";
import "../styles/purchaseSales.css";
import { TiMessages } from "react-icons/ti";
import { BiMessageDetail } from "react-icons/bi";
import { IoIosAttach } from "react-icons/io";
import attachment from "../../../assets/Images/attachment.svg";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Form from "react-bootstrap/Form";
import PdfModal from "../../purchaseorders/pages/PdfModal";
import moment from "moment/moment";
import Accordion from 'react-bootstrap/Accordion';
import "react-toastify/dist/ReactToastify.css";


const ForecastPoDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [key, setKey] = useState("Overview");
  const dispatch = useDispatch();
  const foreCastData = useSelector(selectForecastData)
  const getForeCastData = foreCastData?.body;
  //console.log(getForeCastData,"getForeCastData getForeCastData");
  const documentsUrl = getForeCastData?.documents?.content;
  //console.log(documentsUrl)
  const { fc_po_id, poName, orderValue, dueDate, fcDate } = location.state
  console.log(fc_po_id,"Ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
  const isLoading = useSelector(selectLoadingState);
  const [comment, setComment] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [commentsList1, setCommentsList1] = useState([]);
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const foreCastDoc = getForeCastData?.forecast_document;
  //console.log(foreCastDoc)
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [attached, setAttached] = useState(false);


  const openPdfModal = (pdfUrl) => {
    setSelectedPdfUrl(pdfUrl);
    setShowPdfModal(true);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
  };

  const InvoiceView = () => {
    const invoiceUrl = documentsUrl;
    if (invoiceUrl) {
      openPdfModal(invoiceUrl);
    } else {
      console.error('Invoice URL not found');
    }
  };

  useEffect(() => {
    const request = {
      "fc_po_id": fc_po_id,
      "po_name": poName
    }
    console.log(request,"request");
    dispatch(cmsGetForcastInnerDetails(request))
  }, [])

  const handleInputChange = (event) => {
    setComment(event.target.value);

  };
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  //   const handlePdfChange = (e) => {
  //     // if (e.target.files.length > 0){
  //     const newFiles = [...selectedFiles];
  //     const newFileNames = [...fileNames];
  //     const newFilesBase64 = [...selectedFilesBase64];
  //     let hasNonPdfFile = false;
  //     let hasDuplicateFile = false;
  //     // for (let i = 0; i < e.target.files.length; i++) {
  //       const file = e.target.files[0];
  //       if (file.type === "application/pdf" || file.type.startsWith('image/')) {
  //         if (newFileNames.includes(file.name)) {
  //           hasDuplicateFile = true;
  //           // break;
  //         } else {
  //           newFileNames.push(file.name);
  //           newFiles.push(file);
  //           const reader = new FileReader();
  //           reader.onload = (fileOutput) => {
  //             const encodedFile = fileOutput.target.result.split(",")[1];
  //             newFilesBase64.push(encodedFile);
  //           };
  //           reader.readAsDataURL(file);
  //         }
  //       } else {
  //         hasNonPdfFile = true;
  //       }
  //     // }
  //     if (hasNonPdfFile) {
  //       toast.error("Only PDF and PNG files are allowed.");
  //     }
  //     if (hasDuplicateFile) {
  //       toast.warning("Duplicate files are not allowed.");
  //     }
  //     // Clear the input value to trigger change event on re-upload of the same file
  //     if (!hasDuplicateFile) {
  //       e.target.value = "";
  //     }
  //     setSelectedFiles(newFiles);
  //     setFileNames(newFileNames);
  //     setSelectedFilesBase64(newFilesBase64);
  //     setAttached(true);
  // } 


  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf" && file.type !== 'image/jpeg' && file.type !== 'image/png') {
      toast.error("Only PDF, PNG and JPG files are allowed.");
    } else {
      setSelectedFiles([file]);
      setFileNames([file.name]);
      const reader = new FileReader();
      reader.onload = (fileOutput) => {
        const encodedFile = fileOutput.target.result.split(",")[1];
        setSelectedFilesBase64([encodedFile]);
      };
      reader.readAsDataURL(file);
      setAttached(true);
    }
    e.target.value = "";
  };

  const handleUpdateComments = async (event) => {
    event.preventDefault();
    const newDocuments = fileNames.map((fileName, index) => ({
      type: 'document',
      doc_name: fileName,
      doc_body: selectedFilesBase64[index],
    }));
    console.log(newDocuments)
    const newComment = { type: 'comment', comment: comment };
    // const initialCommentsList = Array.isArray(commentsList1) ? commentsList1 : [];
    // const mergedCommentsList = [...initialCommentsList, newComment];
    // console.log(mergedCommentsList)
    const updatedCommentsList = [...commentsList1];
    updatedCommentsList.push(newComment);


    const request = {
      "fc_po_id": fc_po_id,
      "po_name": poName,
      "comment": comment,
      "attachment": newDocuments
    };

    try {
      await dispatch(cmsUpdateForcastPostComments(request));
      // Update local state only after successful dispatch
      setCommentsList1(updatedCommentsList);
      setComment('');
      setSelectedFiles([]);
      setSelectedFilesBase64([]);
      setFileNames([]);
      setIsCollapsed(true);
      window.location.reload();
    } catch (error) {
      console.error('Error updating comments:', error);
    }
  };

  const removeattachment = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFilesBase64 = selectedFilesBase64.filter(
      (_, i) => i !== index
    );
    const updateFileName = fileNames.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setSelectedFilesBase64(updatedFilesBase64);
    setFileNames(updateFileName);
    setAttached(false)
  };


  useEffect(() => {
    if (getForeCastData && typeof getForeCastData === 'object') {
      const commentsAttachments = Object.values(getForeCastData?.attachments_cmnts || {})
      setCommentsList1([...commentsAttachments]);
    }
  }, [getForeCastData]);
  const fileNameWithoutExtension = poName.split('.').slice(0, -1).join('.');

  return (
    <>
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
      <PdfModal show={showPdfModal} handleClose={closePdfModal} pdfUrl={selectedPdfUrl} />
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {fileNameWithoutExtension}
            </h1>
          </div>
          <div className="mobilemargin-top">
            <Button
              className="submit me-2 md-me-2 submitmobile">
              Download Details
            </Button>
          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Month : {getForeCastData?.month}
            </h5>
            <h5 className="bomtag mb-2 text-667 font-500">
              Quantity : {getForeCastData?.quantity}
            </h5>
            <h5 className="bomtag text-667 font-500">
              Payment Status : {getForeCastData?.payment_status}
            </h5>
          </Col>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Date : {getForeCastData?.date}{" "}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              Order Value : {getForeCastData?.order_value}
            </h5>
          </Col>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Bom Name : {getForeCastData?.bom_name}{" "}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              Order Status : {getForeCastData?.order_status}
            </h5>
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
                  onSelect={(k) => setKey(k)} >

                  <Tab eventKey="Overview" title="Overview">
                    <div className="table-responsive mt-4 ms-2" id="tableData">
                      <div className='mt-4'>
                        <Col xs={12} md={8}>
                          <Card className='customcard mb-4'>
                            <Card.Body>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>{fcDate}</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                <div className='w-100'>
                                  <h3 className='card-title' >
                                    Purchase Order :
                                    <span className="ms-2 text-invoice" onClick={InvoiceView}> {poName}</span>
                                  </h3>
                                  {/* <h3 className='card-title' style={{textDecoration: "underline"}} onClick={InvoiceView}>Purchase Order: {poName}</h3> */}
                                  <div className='d-flex justify-content-between mt-3'>
                                    <h3 className='card-title'>Number of Items: 1</h3>
                                    <h3 className='card-title'>Amount: {orderValue}</h3>
                                    <h3 className='card-title'>Due Date: {dueDate}</h3>
                                  </div>
                                </div>

                              </div>
                              <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>
                                    <div className="rectangular-box d-flex align-items-center">
                                      <TiMessages />
                                      <p className="mb-0 ps-3">Comments: {getForeCastData?.comment} | Attachments: {getForeCastData?.doc_count}</p>
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body>

                                    {commentsList1.length === 0 ? (
                                      <div className="textcomment text-center w-100">No comments added.</div>
                                    ) : (
                                      commentsList1 && commentsList1.map((item, index) => (
                                        <div key={index} className="commentsul mt-2">
                                          <div className='d-flex justify-content-between align-items-center mb-1'>
                                            <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'>
                                              <span className='card-circle me-2'></span> Super Admin
                                              <span className='card-smalltag'>(People Tech Group)</span></h3>
                                            <h3 className='card-title'>{moment(item.doc_time).format('YYYY-MM-DD, HH:mm:ss')}</h3>
                                          </div>
                                          <div className="textcomment">{item.comment}</div>
                                          {/* <div className="textcomment">{item.doc_name}</div> */}
                                          <a className="textcomment" href={item.doc_body} target="_blank" rel="noopener noreferrer">{item.doc_name}</a>
                                        </div>
                                      ))
                                    )}
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>

                              <div className="d-flex align-items-center mb-2">
                                <BiMessageDetail onClick={handleToggleCollapse} />
                                <div className="ms-3" style={{ textDecoration: "underline" }} onClick={handleToggleCollapse} role="button" tabindex="0">Post Comments</div>
                              </div>
                              {!isCollapsed && (
                                <div>
                                  <div className="position-relative attachmentsec mt-2">
                                    <input 
                                      type="text"
                                      className="textdoc"
                                      placeholder="Type comments here"
                                      value={comment}
                                      onChange={handleInputChange}
                                    />
                                    <div className="attachment upload-btn-comment">
                                      <button class="btn" ><img src={attachment} /></button>
                                      <input
                                        type="file"
                                        accept="application/pdf, image/jpeg, image/png"
                                        id="upload"
                                        onChange={handlePdfChange}
                                      />
                                    </div>
                                  </div>
                                  {Array.isArray(selectedFiles) && selectedFiles.map((file, index) => (
                                    <Col xs={12} md={12} key={index} className="mt-2">
                                      <Form.Group>
                                        <div className="attachment-sec">
                                          <span className="attachment-name">
                                            {fileNames[index]}
                                          </span>
                                          <span
                                            className="attachment-icon"
                                            onClick={() => removeattachment(index)}
                                          >
                                            x
                                          </span>
                                        </div>
                                      </Form.Group>
                                    </Col>
                                  ))}
                                  <div className="text-end mt-2">
                                    <Button className="submit submitmobile"
                                      onClick={handleUpdateComments}
                                      disabled={!comment.trimStart() && selectedFiles.length === 0}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </div>

                              )}

                            </Card.Body>
                          </Card>
                        </Col>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="Transactions" title="Transactions">
                    <div className="table-responsive mt-4 ms-2" id="tableData">

                    </div>
                  </Tab>
                  <Tab eventKey="Boards Info" title="Boards Info">
                    <div className="table-responsive mt-4 ms-2" id="tableData">

                    </div>
                  </Tab>
                  <Tab eventKey="Final products Info" title="Final products Info">
                    <div className="table-responsive mt-4 ms-2" id="tableData">

                    </div>
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
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </>
  );
};

export default ForecastPoDetails;