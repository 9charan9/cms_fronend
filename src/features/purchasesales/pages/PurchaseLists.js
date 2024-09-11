import React, { useEffect, useState } from "react";
import {
  CmsForcastPurchaseOrderUploadPO,
  CmsGetInnerForcastPurchaseOrderDetails,
  selectPurchaseList,
  selectForecastClient,
  selectPDFPODetails,
  getPDFPOData,
  savepurchaseOrderCancel,
  getPurchaseOrderCancelledListDetials,
} from "../slice/SalesSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, Table, Button, Tab } from "react-bootstrap";
import arwdown from "../../../assets/Images/down_arw.svg";
import arwup from "../../../assets/Images/up_arrow.svg";
import editfill from "../../../assets/Images/editfill.svg";
import cancelfill from "../../../assets/Images/cancelfill.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import Uarw from "../../../assets/Images/u-arw.png";
import { useNavigate } from "react-router";
import { salesTable, textToast } from '../../../utils/TableContent';
import { PDFViewer } from "@react-pdf/renderer";
import Quixote from "../../../components/PDF";

  const PurchaseLists = () => {
  const [show, setShow] = useState(false);
  const [showDataIndex, setShowDataIndex] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [uploadpoevent, setUploadpoevent] = useState({});
  // console.log(JSON.stringify(uploadpoevent, null, 2));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const purchaseListdata = useSelector(selectPurchaseList);
  const purchaseList = purchaseListdata?.body;
  // console.log(purchaseList,"kkkkkkkkkkkkkkkkkkkkkk")
  const [showpdfPreview, setshowpdfPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleToggleInnerTable = (index) => {
    setShowDataIndex(index === showDataIndex ? null : index);
  };
  const pdfData = useSelector(selectPDFPODetails);
  console.log(pdfData?.body?.length);
  const data = pdfData?.body[0];
  // console.log(JSON.stringify(data, null, 2));
  const handleDocumentClick = (poId) => {
    const POID = poId.split("/");
    let splitedpoId = POID[1];
    const request = {
      "poall_id": poId
    }
    dispatch(getPDFPOData(request)).then((res) => {
      if(res?.payload?.statusCode === 200){
        setSelectedDocument(splitedpoId);
        setshowpdfPreview(true);
      }
      else{
        toast.error("No Data Avaiable")
      }
    });
    // window.open(documentUrl, '_parent');
  };
  const handleOpenModal = (fcid) => {
    const nextFormState = {
      ...uploadpoevent,
      fc_id: fcid,
    };
    setUploadpoevent(nextFormState);
    handleShow();
  };

  const handleDateChange = (event) => {
    const { value, name } = event.target;
    const formattedDate = formatDate(value);
    setUploadpoevent((prevForm) => ({
      ...prevForm,
      [name]: formattedDate,
    }));
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf" && file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Only PDF && Image type files are allowed");
    } else {
      const fileName = file?.name;
      const parts = fileName.split(".");
      const extension = parts[parts.length - 1];
      const fileNameWithoutExtension = fileName
        .split(".")
        .slice(0, -1)
        .join(".");

      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setPdfPreview(reader.result);
        encodedFile = fileOutput.target.result.split(",")[1];
        nextFormState = {
          ...uploadpoevent,
          [e.target.name]: encodedFile,
          doc_name: fileName,
        };
        setUploadpoevent(nextFormState);
      };
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }
  };
  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setUploadpoevent((prevForm) => ({
      ...prevForm,
      doc_body: "",
      doc_name: "",
    }));
  };

  const handleResetUploadPo = () => {
    handleClose();
    setPdfPreview(null);
      setUploadpoevent({});
  }

  
  const navigateFcPoDetails = (po_name, fc_po_ids, order_value, due_date, fc_date, status) => {
    if(status){
    console.log(fc_po_ids, po_name, order_value, due_date ,status )                        
    navigate("/forecastpoDetails", {
        // state: item?.bom_name
        state: {
            fc_po_id: fc_po_ids,
            poName: po_name,
            orderValue : order_value,
            dueDate : due_date,
            fcDate : fc_date
          },
    });
  }
}

const handleOpenShowModal = (id) => {
  console.log(id);
  handleShowModal();
  setSelectedId(id);
}

const handleMovetoCancle = async () => {
  if(!selectedId) return;

  const request = {
    "pos_id": selectedId,
    "status":'Cancel'
  }
  try{
  const response = await dispatch(savepurchaseOrderCancel(request));
  if(response?.payload?.statusCode === 200){
    await Promise.all([
      dispatch(CmsGetInnerForcastPurchaseOrderDetails()),
      dispatch(getPurchaseOrderCancelledListDetials())
    ]);     
     handleCloseModal(); 
  }
  else{
    toast.error(`${response?.payload?.body}`)
  }
}
catch(err){
  console.error(err);
}
}




  const handlePOsubmit = async (e) => {
    e.preventDefault();
    if(uploadpoevent.fc_date === undefined){
      toast.error("Kindly Choose Date");
      return;
    }
    if (uploadpoevent.doc_body && uploadpoevent.fc_date !== undefined) {
      handleClose();
      await dispatch(CmsForcastPurchaseOrderUploadPO(uploadpoevent));
      setPdfPreview(null);
      // setUploadpoevent((prevForm) => ({
      //   ...prevForm,
      //   doc_name: "",
      // }));
      setUploadpoevent({});
      dispatch(CmsGetInnerForcastPurchaseOrderDetails());
    } else {
      toast.error("Please Upload Mandatory File");
    }
  };
  

  useEffect(() => {
    dispatch(CmsGetInnerForcastPurchaseOrderDetails());
  }, []);

  const handleNavigate = (clickedvalue, item) => {
    console.log(clickedvalue,"ommmmmmmmmmmmmmmmmmmmm");
    console.log(item,"itrm ommmmmmmmmmmmmm");
    console.log(item?.primary_document_details?.po_date);
    console.log(item?.total_amount?.grand_total);
    
    
     
     const splited_id = clickedvalue?.split('/')[1];
      console.log(splited_id)
     if(splited_id === "PO" || splited_id === "SO" || splited_id === "PI" || splited_id === "INV"){
       navigate('/innerdetailslist', {
         state:{splited_id,po_id:clickedvalue,"Tab" : clickedvalue,po_date:item?.primary_document_details?.po_date,grand_total:item?.total_amount?.grand_total} 
         
       })
     }
    
   }

  const handleEditForms = (purchaselistdetails) => {
    let fcpo_id = purchaselistdetails?.fcpo_id;
    let uniqID = purchaselistdetails?.pi_id?.slice(4, 6);
    if (uniqID === "PI") {
      let pi_id = purchaselistdetails?.pi_id;
      navigate("/editproformainvoice", {
        state: {pi_id: pi_id, isStatus:"Approved"}
      });
    } 
    else if(purchaselistdetails?.so_id){
      navigate("/EditServiceOrder", {
        state : {so_id : purchaselistdetails?.so_id, isStatus:"Approved"}         
      })
}  

else if(purchaselistdetails?.fcpo_id){
  console.log(fcpo_id,"ommmmmmmmmmmmmmmm");
  navigate("/editforecastpo", {
    state : {fcpo_id:fcpo_id, isStatus:"Approved"}     
  })
} 

    
else {
  if (purchaselistdetails?.inv_id && purchaselistdetails?.client_id) {
    let ID = purchaselistdetails.inv_id.slice(4, 7);
    let client = purchaselistdetails.client_id;
    console.log(client, "iddd");
    
    if (ID === "INV") {
      let inv_id = purchaselistdetails.inv_id;
      let client_id = purchaselistdetails.client_id;
      navigate("/EditInvoice", {
        state: { inv_id, client_id, isStatus:"Approved"}
      });
    }
  }
}
}

  
  return (
    <div className="salestablealign">
      <div className="table-responsive mt-2">
        <Table className="salestable">
          <thead>
            <tr>
              <th>{salesTable?.sNo}</th> 
              <th>{salesTable?.companyName}</th>
              <th>{salesTable?.transactionName}</th>
              <th>{salesTable?.documentNumber}</th>
              <th>{salesTable?.dueDate}</th>
              <th>{salesTable?.status}</th>
              <th>{salesTable?.lastDuedate}</th>
              <th>{salesTable?.actions}</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(purchaseList) && purchaseList.length > 0 ) ? (
              purchaseList?.map((purchaselistdetails, index) => {
                let text = purchaselistdetails?.fcpo_id;
                const splitedDocNo = text?.split("/")[1];
                const purchaseOrderId =
                purchaselistdetails?.Client_Purchaseorder_num ||
                purchaselistdetails?.po_id ||
                purchaselistdetails?.pi_id ||
                purchaselistdetails?.inv_id ||
                purchaselistdetails?.so_id || 
                purchaselistdetails?.fcpo_id || "";
                return (
                  <>
                    <tr key={index}>
                        <td>{index+1}</td>
                      {/* <td>{purchaselistdetails?.fc_po_ids}</td> */}
                      <td>{purchaselistdetails?.primary_document_details?.client_name || purchaselistdetails?.kind_attn?.company_name}</td>
                      <td>
                        <span className="border-item" onClick={() => handleNavigate(purchaselistdetails?.po_id || purchaselistdetails?.pi_id || purchaselistdetails?.so_id || purchaselistdetails?.inv_id, purchaselistdetails)}>
                          {purchaselistdetails?.primary_document_details?.document_title || purchaselistdetails?.primary_document_details?.transaction_name}
                        </span>
                      </td>
                      <td
                        onClick={() =>
                          handleDocumentClick(purchaselistdetails?.fcpo_id || purchaselistdetails?.Client_Purchaseorder_num || purchaselistdetails?.po_id || purchaselistdetails?.pi_id  || purchaselistdetails?.inv_id || purchaselistdetails?.so_id)
                        }
                      >
                        <span className="border-item">
                          {purchaselistdetails?.fcpo_id || purchaselistdetails?.Client_Purchaseorder_num || purchaselistdetails?.po_id || purchaselistdetails?.pi_id || purchaselistdetails?.inv_id ||  purchaselistdetails?.so_id}
                        </span>
                      </td>
                      <td>{purchaselistdetails?.delivery_date || purchaselistdetails?.due_date || "NA"}</td>
                      <td className="text-success text-capitalize">{purchaselistdetails?.status || purchaselistdetails?.payment_status}</td>
                      <td>{purchaselistdetails?.last_modified_date || purchaselistdetails?.modified_date}</td>
                      <td>
                        
                        {splitedDocNo === "FCPO" ? (<img
                        alt="sample_img"
                          style={{ cursor: "pointer" }}
                          src={showDataIndex !== index ? arwdown : arwup}
                          onClick={() => handleToggleInnerTable(index)}
                        />) : null}{" "}
                        <img src={editfill} onClick={() => handleEditForms(purchaselistdetails)} role="button" /> <img onClick={() => handleOpenShowModal(purchaseOrderId)} src={cancelfill} role="button" />{" "}
                      </td>
                    </tr>
                    {showDataIndex === index && (
                      <tr>
                        <td colSpan="9" className="text-center">
                          <div className="text-right">
                            <Button
                              size="sm"
                              className="upload_po_btn"
                              onClick={() =>
                                handleOpenModal(purchaselistdetails?.fc_po_ids)
                              }
                            >
                              Upload PO
                            </Button>
                          </div>
                          <Table responsive="xl" className="innerTable">
                            <thead>
                              <tr>
                                <th>Month</th>
                                <th>Document Date</th>
                                <th>Purchase Order</th>
                                <th>Quantity</th>
                                <th>Due Date</th>
                                <th>Order value</th>
                                <th>Order Status</th>
                                <th>Payment Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {purchaselistdetails?.forecast_details.map(
                                (forecast, index) => {
                                  const key = Object.keys(forecast)[0];
                                  const data = forecast[key];
                                  console.log(purchaselistdetails);
                                  return (
                                    <tr key={index}>
                                      <td>{data.month}</td>
                                      <td>{data?.fc_date || "-"}</td>
                                      {/* <td>{data?.po_name}</td> */}
                                      <td style={{textDecoration: "underline"}} onClick={() => navigateFcPoDetails(data?.po_name, purchaselistdetails?.fc_po_ids, data?.order_value, data?.due_date, data?.fc_date, data?.monthly_status )}>{data?.po_name?.replace(/\.[^.]+$/, '')}</td>
                                      <td>{data?.quantity}</td>
                                      <td>{data?.due_date}</td>
                                      <td>{data?.order_value}</td>
                                      <td>{data?.order_status}</td>
                                      <td>{data?.payment_status}</td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            ) : null}
            {Array.isArray(purchaseList) && purchaseList.length === 0 && 
               (
              <tr>
                <td colSpan="6" className="text-center">
                  No Data Avaiable
                </td>
              </tr>
            )}
            <Modal
              show={showpdfPreview}
              size="lg"
              centered
              onHide={() => setshowpdfPreview(false)}
            >
                <Modal.Header closeButton>
                    {""}
                </Modal.Header>
              {selectedDocument && (
              <div>
              <PDFViewer style={{ width: "100%", height: "700px" }}>
                    <Quixote data={data} type={selectedDocument}/>
              </PDFViewer>
                 
              </div>
              )}
            </Modal>
          </tbody>
        </Table>
      </div>
      <Modal show={show} onHide={handleResetUploadPo} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="d-flex flex-column mb-4">
              <label
                htmlFor="date"
                style={{ fontSize: "14px", marginBottom: "2px" }}
              >
                Choose Month<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="date"
                name="fc_date"
                style={{ width: "50%" }}
                type="date"
                onChange={handleDateChange}
                required={true}
              />
            </div>
            <div className="upload-btn-wrapper">
              {pdfPreview ? (
                <>
                  <img
                    style={{ maxwidth: "100px", maxHeight: "100px" }}
                    src={pdfImage}
                    alt="pdf preview"
                  />
                  <button className="close" onClick={handleCancelPdfPreview}>
                    &times;
                  </button>
                </>
              ) : (
                <>
                  <button className="btn">
                    <img src={Uarw} alt="" />
                    <span className="uploadtext">Upload</span>
                    <input
                      type="file"
                      name="doc_body"
                      onChange={handleFileUpload}
                      required={true}
                    />
                  </button>
                </>
              )}
            </div>
            <div>
              {uploadpoevent.doc_name && (
                <p className="uploadimg-tag">{uploadpoevent.doc_name}</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleResetUploadPo}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handlePOsubmit}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showModal} onHide={handleCloseModal} closeButton centered>

          <Modal.Body className="text-center pb-0">
            {textToast.approvedCancle}
          </Modal.Body>
          <Modal.Footer className='border-0 justify-content-center'>
          <div className='mt-3 d-flex justify-content-center'>
          <Button variant="light" className='cancel me-2' onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="secondary" className='submit submit-min' onClick={handleMovetoCancle}>
            Yes
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PurchaseLists;