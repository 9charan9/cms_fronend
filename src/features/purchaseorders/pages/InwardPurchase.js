import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import Table from "react-bootstrap/Table";
import Upload from "../../../assets/Images/upload.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {Spinner } from 'react-bootstrap';
import { getinwardpurchaseOrders, postinwardPurchase, selectInwardPurchaseOrders, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import { ToastContainer, Zoom } from "react-toastify";
import { String } from "../../../resources/Strings";
import { gateEntryTable } from "../../../utils/TableContent";

const InwardPurchaseStep3 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {po_id, inward_id} = location.state;
  const isLoading = useSelector(selectLoadingStatus);
  const inwardPurchaseBody = useSelector(selectInwardPurchaseOrders);
  const inwardPurchaseDetails =  inwardPurchaseBody?.body;
  const [inwardPurchase, setInwardPurchase] = useState({
    order_no: "",
    vendor_id: "",
    order_date: "",
    description: "",
    invoice_num : "",
    parts: [],
    documents: [],
  });
  const [invoicePreview, setInvoicePreview] = useState(null);
  const [disablebtn, setDisablebtn] = useState(false);
  const [qatestDocPreview, setQatestDocPreview] = useState(null);
  const [imageSetted, setImageSetted] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() =>{
    const request = {
      "po_id": po_id,
      "inward_id": inward_id
    }
    dispatch(getinwardpurchaseOrders(request));
  }, [])

  useEffect(() => {
    if(!isLoading){
      setInwardPurchase(inwardPurchaseDetails);
      setImagePreviews(inwardPurchaseDetails?.invoice_photo || {});
      setInvoicePreview(true);
      setQatestDocPreview(true);
      setImageSetted(true);
      setImagePreview(inwardPurchaseDetails?.photo);
    }
  }, [inwardPurchaseBody])
  console.log(imagePreview);
  // const handleFileInputChange = (e, docType) => {
  //   const files = e.target.files;
  //   const promises = Array.from(files)?.map((file) => {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //        const encodedFile = event.target.result.split(",")[1];
  //         resolve({
  //           doc_type: docType,
  //           doc_name: file.name,
  //           doc_body: encodedFile, // Set doc_body as base64 data
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     });
  //   });
  
  //   Promise.all(promises).then((newDocuments) => {
  //     setInwardPurchase((prevDetails) => ({
  //       ...prevDetails,
  //       documents: [...(prevDetails.documents || []), ...newDocuments],
  //     }));
  //   });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInwardPurchase({
      ...inwardPurchase,
      [name]: value,
    });
  };

  const handleInventoryPositionChange = (e, index) => {
    const newValue = e.target.value;
    setInwardPurchase((prevDetails) => {
      const updatedParts = prevDetails.parts.map((part, i) =>
        i === index ? { ...part, inventory_position: newValue } : part
      );
      return {
        ...prevDetails,
        parts: updatedParts,
      };
    }); 
  };
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setDisablebtn(true);
   await dispatch(postinwardPurchase(inwardPurchase));
   setTimeout(() => {
    navigate(-1)
   }, 2000)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the focused element is not a textarea
      if (event.target.tagName.toLowerCase() !== 'textarea') {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  //Calculate Total Parts Quatity
  const totalQty = inwardPurchaseDetails?.parts?.reduce((total, part) => {
    const qty = parseInt(part.quantity, 10);
    return total + qty;
  }, 0);
  const totalPassQty = inwardPurchaseDetails?.parts?.reduce((total, part) => {
    const qty = parseInt(part.pass_qty, 10);
    return total + qty;
  }, 0);
  return (
    <>
    {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden">{String.Loading_text}</span>
                    </Spinner>
                </div>
    )}
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => navigate(-1)}
            />
            {String.inward_purchase}
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="content-sec">
            <h3 className="inner-tag">{String.order_details_text}</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.ordered_numbered_text}</Form.Label>
                  <Form.Control
                    className="ordered-number-txt"
                    type="text"
                    name="order_no"
                    value={inwardPurchase?.order_no}
                    required={true}
                    disabled={true}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.vendor_id}</Form.Label>
                  <Form.Control
                    type="text"
                    name="vendor_id"
                    value={inwardPurchase?.vendor_id}
                    required={true}
                    disabled={true}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.order_date}</Form.Label>
                  <Form.Control type="text" required={true} name="order_date" disabled={true}  value={inwardPurchase?.order_date} onChange={handleInputChange}/>
                </Form.Group>
              </Col>
              
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.invoice_number}</Form.Label>
                  <Form.Control type="text" required={true} name="invoice_num" disabled={true}  value={inwardPurchase?.invoice_num} onChange={handleInputChange}/>
                </Form.Group>
              </Col>
            </Row>

            <h3 className="inner-tag mt-4">{String.upload_confirmation_documents}</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label>{String.upload_invoice}</Form.Label>
                  <div class="upload-btn-wrapper">
                    {invoicePreview ? (
                        <>
                          <img
                            style={{ maxwidth: "100px", maxHeight: "100px" }}
                            src={pdfImage}
                            alt="pdf preview"
                          />
                        </>
                      ) : (
                        <>
                          <img src={Upload} alt="" />
                          <input
                    type="file"
                    name="Invoice"
                    accept="application/pdf"
                    required={true}
                  />
                        </>
                      )}
                  </div>
                  <div>{inwardPurchase?.invoice_name && <p className="uploadimg-tag">{inwardPurchase?.invoice_name}</p>}</div>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label>{String.qa_test_document}</Form.Label>
                  <div class="upload-btn-wrapper">
                    {qatestDocPreview ? (
                        <>
                          <img
                            style={{ maxwidth: "100px", maxHeight: "100px" }}
                            src={pdfImage}
                            alt="pdf preview"
                          />
                        
                        </>
                      ) : (
                        <>
                          <img src={Upload} alt="" />
                          <input
                      type="file"
                      name="data_sheet"
                      accept="application/pdf"
                      required={true}
                    />
                        </>
                      )}
                  </div>
                  <div>{inwardPurchase?.qa_test_document_name && <p className="uploadimg-tag">{inwardPurchase?.qa_test_document_name}</p>}</div>
                </Form.Group>
              </Col>
              
                  {Object.keys(imagePreviews).map((imageName) => (
                    <Col xs={12} md={3} key={imageName}>
                    <Form.Group className="mb-0 position-relative">
                      <Form.Label>{imageName}</Form.Label>
                      <div class="upload-btn-wrapper">
                      <div>
                        {/* <img
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                          src={imagePreviews[imageName]}
                          alt={imageName}
                        />                        */}

                   <span className="picsec position-relative" >
                    <img style={{ maxWidth: "100px", maxHeight: "100px" }}
                     src={imagePreviews[imageName]}
                     alt={imageName} />
                      {/* <img
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                        src={imagePreviews[imageName]}
                        alt={imageName}
                      /> */}
                      </span>
                      </div>
                         </div>                 
                         </Form.Group>
                       </Col>
                    ))}
               
                <Col xs={12} md={3}>
                              <Form.Group className="mb-3">
                                  <Form.Label>{String.description}</Form.Label>
                                  <Form.Control as="textarea" name="description" rows={4} 
                                  className="description-tab"
                                  value={inwardPurchase?.description ? inwardPurchase?.description.trimStart() : ''} 
                                  onChange={handleInputChange} required={true} />
                              </Form.Group> 
                          </Col>
             
            </Row>

            <div className="table-responsive mt-4">
              <Table className="bg-header">
                <thead>
                  <tr>
                    <th>{gateEntryTable.sNo}</th>
                    <th>{gateEntryTable.partNo}</th>
                    <th>{gateEntryTable.partName}</th>
                    <th>{gateEntryTable.manufacturer}</th>
                    <th>{gateEntryTable.description}</th>
                    {/* <th>{gateEntryTable.packaging}</th> */}
                    <th>Received Qty</th>
                    <th>lot Id</th>
                    <th>{gateEntryTable.passQuantity}</th>
                    <th>{gateEntryTable.inventory_position}</th>
                    <th>{gateEntryTable.batch_no}</th>
                  </tr>
                </thead>
                <tbody>
                {inwardPurchase?.parts?.map((part, index) => {
                  return(
                  <tr key={index}>
                  <td>{index+1}</td>
                  <td>{part?.part_no}</td>
                  <td>{part?.part_name}</td>
                  <td>{part?.manufacturer || "-"}</td>
                  <td>{part?.description}</td>
                  {/* <td>{part?.packaging}</td> */}
                  <td>{part?.quantity}</td>      
                  <td>{part?.lot_id}</td>          
                  <td>{part?.pass_qty}</td>
                  <td>
                  <input
                  type="text"
                  value={part?.inventory_position.trimStart()} className="rack"
                  onChange={(e) => handleInventoryPositionChange(e, index)} required
                  />
                  </td>
                  <td>{part?.batchId}</td>
                </tr>
                  )
                })}
              </tbody>
                <tfoot>
                  <tr className="border-top">
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>                    
                    <td>{totalQty}</td>
                    <td></td>
                    <td>{totalPassQty}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button type="button" className="cancel me-2" onClick={() => navigate(-1)}>
              {String.cancel_btn}
            </Button>
            <Button type="submit" className="submit" disabled={disablebtn}>
              {String.mark_as_received_btn}
            </Button>
          </div>
        </form>
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
        transition={Zoom}
      />
    </>
  );
};

export default InwardPurchaseStep3;
