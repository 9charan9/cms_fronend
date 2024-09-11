import React, { useRef, useState } from "react";
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
import Table from "react-bootstrap/Table";
import { cmsGetForcastInnerDetails, poAddingComments,selectaddingCommentsPo,selectForecastData, selectLoadingState,pogetcomments,selectpurchaseordercomments,selectgateentrymodel, popupgate,selectqamodelpopup,qamodel,selectinwardmodelpopup,inwardpopup,selectCardsData,getcmsPOCardDetails, cmsMultipleCardComments, selectMultipleCardDetails} from "../slice/SalesSlice";
import cancel from "../../../assets/Images/cancel.svg";
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
import { Check } from '@mui/icons-material';
import { Modal } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import view from "../../../assets/Images/view.svg";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, } from '@mui/lab';

const InnerdetailsList= () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [key, setKey] = useState("Overview");
  const dispatch = useDispatch();
  const foreCastData = useSelector(selectForecastData)
  const getForeCastData = foreCastData?.body;
  //console.log(getForeCastData,"getForeCastData getForeCastData");
  const documentsUrl = getForeCastData?.documents?.content;
  //console.log(documentsUrl)
  
  const multileCardCommentDetails = useSelector(selectMultipleCardDetails)
  const { po_id, grand_total, po_date } = location.state|| {};
  console.log(po_id,":::poo")
  console.log(po_id, ":::poo");

  const pocomments = useSelector(selectpurchaseordercomments)
  const getcomments = pocomments?.body
  console.log(getcomments," pooodataa");  
  const documents = getcomments?.Attachments;
  console.log(documents);


  const poData = useSelector(selectpurchaseordercomments)
  const getpoData = poData?.body;
  console.log(getpoData," pooodataa");
  
  const isLoading = useSelector(selectLoadingState);
  const [comment, setComment] = useState('');
  const [newComment , setNewComment] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [commentsList1, setCommentsList1] = useState([]);
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  console.log(selectedFilesBase64)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const foreCastDoc = getForeCastData?.forecast_document;
  //console.log(foreCastDoc)
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  const [attached, setAttached] = useState(false);
  const [activeStep, setActiveStep] = useState(true);
  const [getinwardModal , setinwardShowModal] = useState(false)
  const [getiqcModal , setiqcShowModal] = useState(false)
  const [gateShowModal,setShowGateModal] = useState(false)
  const [commentsList, setCommentsList] = useState([]);
  const [commentsList2, setCommentsList2] = useState([]);  const [multipleCardComment , setMultipleComment] = useState([])
  const commentInputValue = useRef();
  const {splited_id} = location.state || {}
  console.log(commentInputValue)

  // const po_id = location.state?.po_id || {};
  // console.log(po_id,":::poo")

//gateentry
const popups = useSelector(selectgateentrymodel)
const modelpopup = popups?.body
console.log(modelpopup,"kkk");

//qatest
const qapopup =useSelector(selectqamodelpopup)
const modelqa = qapopup?.body
console.log(modelqa,"qaa");

//inward
const inward =useSelector(selectinwardmodelpopup)
const modelinward = inward?.body
console.log(modelinward,"qaa");

  const list = ["Gate Entry","QA Test","Inward"]

  const steps = [
    { label: 'Gate Entry', completed: true },
    { label: 'IQC', completed: true },
    { label: 'Inward', completed: false },
  ];

  const cardsData = useSelector(selectCardsData);
  const cardsDetails = cardsData?.body;
  console.log(cardsDetails)
  
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
    
    
    dispatch(cmsGetForcastInnerDetails())
  }, [])

//comment input 
  const handleInputChange = (e) => {
   setComment(e.target.valeu)

  };




  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleShowModelgate = () => {
    setShowGateModal(true);
  };

  const handlegatedelete = () => {
    setShowGateModal(false);
  };
  const handleShowModeliqc = (e) => {
    
    setiqcShowModal(true)
  }
  const handleiqcDelete = () => {
    setiqcShowModal(false)
}
  const handleShowModelinward = (e) => {
    
    setinwardShowModal(true)
  }

 const handleinwardDelete = () => {
  setinwardShowModal(false)
}

const handleClosedelete = async () => {
  setShowGateModal(false);
};
const handleClosedelete1 = async () => {
  setiqcShowModal(false);
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
  const handleGateEntery = (e) => {
//"/innerDetailsListGateEntery" 
//praticeeeee"
    navigate("/innerDetailsListGateEntery"  , {
      state : po_id
    })
  }


  const handlePdfChange = (e) => {
    const newFiles = [...selectedFiles];
    const newFileNames = [...fileNames];
    const newFilesBase64 = [...selectedFilesBase64];
    let hasNonPdfFile = false;
    let hasDuplicateFile = false;

    for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.type === "application/pdf") {
            if (newFileNames.includes(file.name)) {
                hasDuplicateFile = true;
                break;
            } else {
                newFileNames.push(file.name);
                newFiles.push(file);
                const reader = new FileReader();
                reader.onload = (fileOutput) => {
                    const encodedFile = fileOutput.target.result.split(",")[1];
                    newFilesBase64.push(encodedFile);
                };
                reader.readAsDataURL(file);
            }
        } else {
            hasNonPdfFile = true;
        }
    }

    if (hasNonPdfFile) {
        toast.error("Only PDF files are allowed.");
    }

    if (hasDuplicateFile) {
        toast.warning("Duplicate files are not allowed.");
    }

    // Clear the input value to trigger change event on re-upload of the same file
    if (!hasDuplicateFile) {
        e.target.value = "";
    }

    setSelectedFiles(newFiles);
    setFileNames(newFileNames);
    setSelectedFilesBase64(newFilesBase64);
};

  const handleUpdateComments = async (event) => {
    event.preventDefault();  
  
    
    const newDocuments = fileNames.map((fileName, index) => ({
      doc_name: fileName,
      doc_body: selectedFilesBase64[index],
    }));
  
    
    const newComment = {
      type: 'comment',
      comment: comment,
      attachment: newDocuments, 
      created_at: new Date().toISOString(), 
    };
    const updatedCommentsList = [...commentsList1];
    updatedCommentsList.push(newComment);
   
    setCommentsList1((prevComments) => [...prevComments, newComment]);
  
  
    
      const request = {
       "comment": comment,
       "attachment": newDocuments,
        po_id: po_id,  
      };
      await dispatch(poAddingComments(request));
      dispatch(pogetcomments({ po_id: po_id }));
      
      
      setComment('');
      setCommentsList1(updatedCommentsList);
      setSelectedFiles([]);
      setFileNames([]);
      setIsCollapsed(true);
      // window.location.reload();
   
  };

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${po_id}`);
    if (savedComments) {
      setCommentsList1(JSON.parse(savedComments));
    }
  }, [po_id]);
    
  useEffect(() => {
    localStorage.setItem(`comments-${po_id}`, JSON.stringify(commentsList1));
  }, [commentsList1]);

  useEffect(() => {
    if (po_id) {
      const request = { po_id: po_id };
      dispatch(pogetcomments(request));
    }
  }, [po_id]);

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

  const handleInputChangeComment = (e, index) => {
    const {value} = e.target;
    const nextFormState = {
      [index] : value
    }
    setMultipleComment(nextFormState);
    // console.log(event.target.value)
  }
  const handleCommentBtn = async (gate_id, index) => {
    
    const newDocuments = fileNames.map((fileName, index) => ({
      //type: 'document',
      doc_name: fileName,
      doc_body: selectedFilesBase64[index],
    }));
    // console.log(newDocuments)
    // const newComment = { type: 'comment', comment: multipleCardComment };
    // console.log(newComment)
  
     const request = {
      "comment" : multipleCardComment[index],
      "inward_id"  : gate_id,
      "attachment": newDocuments,
      "po_id" : po_id
      
     } 
     try {
      await dispatch(cmsMultipleCardComments(request)).then(async (res) => {
        if(res?.payload?.statusCode === 200){
          const request = {
            "po_id": po_id
        }
        setMultipleComment((prevState) => ({
          ...prevState,
          [index]: '',
        }));
        await dispatch(getcmsPOCardDetails(request));
        }
        else{
          toast.error("Failed to Add Comment");
        }
      })
     }
     catch (error){
      console.log(error)
     }
  }
  


  //navigation to IQC
  const handleNavigateToQA = () => {
    navigate("/inwardpurchase2", {
      state: {
        iqc: "IQC",
        po_id: po_id
      }
    })
  }

 

  useEffect(() => {
    const request = {
        "po_id": po_id
    } //  po_id
    dispatch(getcmsPOCardDetails(request));
  },[]);
 
  useEffect(() => {
    if (getcomments && Array.isArray(getcomments?.comment)) {
      const commentsAttachments = Object.values(getcomments.comment);
      setCommentsList1((prev) => [...prev, ...commentsAttachments]);
    }
  }, [getcomments]);

  useEffect(() => {
    if (cardsDetails && cardsDetails.length > 0) {
      cardsDetails.forEach((cardsDetails) => {
        const gateEntryId = cardsDetails?.GateEntry?.gate_entry_id;
  
        if (gateEntryId) {
          const request = {
            gate_entry_id: gateEntryId,
          };
          dispatch(popupgate(request));
        }
      });
    }
  }, [cardsDetails, dispatch]);
  
  useEffect(() => {
    const request = {
       "iqc_id": "OPTG1_QAID01"
    }
    dispatch(qamodel(request));
  }, [])
  
  useEffect(() => {
    const request = {
    "inward_id": "OPTG11_INWARDId01"
    }
    dispatch(inwardpopup(request));
  }, [])

  const totalOrderedQuantity = modelpopup?.parts
  ? Object.values(modelpopup.parts).reduce((total, part) => {
      const qty = Number(part.qty); // Ensure qty is treated as a number
      return total + (isNaN(qty) ? 0 : qty);
    }, 0)
  : 0;

  return (
    <>
   <Modal show = {gateShowModal} onHide={handlegatedelete} centered className="inward-modal">
    <Modal.Header className="text-center pb-0 d-flex justify-content-between align-items-center">
          <h6>Gate Entry ID - {modelpopup?.inwardId} </h6>
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
                Sender Name : {modelpopup?.sender_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Contact : {modelpopup?.sender_contact_number}
              </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Name : {modelpopup?.rec_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Contact : {modelpopup?.rec_cont}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Gate Entry Date : {modelpopup?.gate_entry_date}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Invoice Number : {modelpopup?.invoice_num}</h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Tracking Id : {modelpopup?.tracking_id}</h5>
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
                  {/* <th>Packaging</th>  */}
                  <th>Orderded Qty</th>
                  <th>Received Qty</th>
                </tr>
              </thead>
              <tbody className="border-top">
    {modelpopup?.parts && Object.keys(modelpopup.parts).length > 0 ? (
      Object.keys(modelpopup.parts).map((key, index) => {
        const part = modelpopup.parts[key];
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{part.mfr_prt_num}</td>
            <td>{part.prdt_name}</td>
            <td>{part.manufacturer}</td>
            <td>{part.description}</td>
            {/* <td>{part.packaging}</td> */}
            <td>{part.qty}</td>
            <td>{part.received_qty}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="7" className="text-center">No Data Available</td>
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
                  <td>{totalOrderedQuantity}</td>
                  <td>{modelpopup?.total_recieved_quantity}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
          
        
        </Modal.Body>
    </Modal>
    <Modal show = {getiqcModal} onHide={handleiqcDelete} centered className="inward-modal">
    <Modal.Header className="text-center pb-0 d-flex justify-content-between align-items-center">
          <h6>IQC ID -  </h6>
          <img
            src={cancel}
            onClick={handleClosedelete1}
            className="linkformodal"
          ></img>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Name : {modelpopup?.sender_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Contact : {modelpopup?.sender_contact_number}
              </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Name : {modelpopup?.rec_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Contact : {modelpopup?.rec_cont}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Gate Entry Date : {modelqa?.gate_entry_date}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
               QA Date : {modelqa?.QA_date}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Invoice Number : {modelqa?.invoice_num}</h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
               Comment : {modelqa?.comment}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Invoice Number : {modelqa?.invoice_num}</h5>
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
                  <th>Packaging</th> 
                  <th>Orderded Qty</th>
                  <th>Received Qty</th>
                </tr>
              </thead>
              <tbody className="border-top">
    {modelqa?.parts && Object.keys(modelqa.parts).length > 0 ? (
      Object.keys(modelqa.parts).map((key, index) => {
        const part = modelqa.parts[key];
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{part.mfr_prt_num}</td>
            <td>{part.prdt_name}</td>
            <td>{part.manufacturer}</td>
            <td>{part.description}</td>
            <td>{part.packaging}</td>
            <td>{part.qty}</td>
            <td>{part.received_qty}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="7" className="text-center">No Data Available</td>
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
                  <td></td>
                  <td></td>
                  <td></td>                 
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </div>
          
        
        </Modal.Body>
    </Modal>
    <Modal show = {getinwardModal} onHide={handleinwardDelete} centered className="inward-modal">
    <Modal.Header className="text-center pb-0">
          <h6>Inward ID -  {modelinward?.inwardId}</h6>
          {/* <img
            src={cancel}
            onClick={handleClosedelete}
            className="linkformodal"
          ></img> */}
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Name : {modelinward?.sender_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Sender Contact : {modelinward?.sender_contact_number}
              </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Name : {modelinward?.rec_name}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Reciever Contact : {modelinward?.rec_cont}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
                Gate Entry Date : {modelinward?.gate_entry_date}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
               QA Date : {modelinward?.QA_date}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
               Inward Date : {modelinward?.inward_date}
              </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">Invoice Number : {modelinward?.invoice_num}</h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="bomtag text-667 font-500">
               Comment : {modelinward?.comment}
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
                  <th>Packaging</th> 
                  <th>Orderded Qty</th>
                  <th>Received Qty</th>
                </tr>
              </thead>
              <tbody className="border-top">
    {modelinward?.parts && Object.keys(modelinward.parts).length > 0 ? (
      Object.keys(modelinward.parts).map((key, index) => {
        const part = modelinward.parts[key];
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{part.mfr_prt_num}</td>
            <td>{part.prdt_name}</td>
            <td>{part.manufacturer}</td>
            <td>{part.description}</td>
            <td>{part.packaging}</td>
            <td>{part.qty}</td>
            <td>{part.received_qty}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="7" className="text-center">No Data Available</td>
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
                  <td></td>
                  <td></td>
                  <td></td>                 
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </div>
          
        
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
      <PdfModal show={showPdfModal} handleClose={closePdfModal} pdfUrl={selectedPdfUrl} />
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center same-length">
            <h6 className="title-tag">
                <img
                    src={arw}
                    alt=""
                    className="me-3"
                    onClick={() => {
                    navigate(-1);
                    }}
                />
                <span className="main-tag">Overview</span>
            </h6>
          </div>
        </div>
        <div className="customcard background mt-4">
            <h5 className="mt-3">
                {splited_id === "PO" ? "Purchase Order for Raw Material" : 
                splited_id === "SO" ? "Service Order" : 
                splited_id === "PI" ? "Proforma Invoice" : 
                splited_id === "INV" ? "Invoice" : 
                null}
            </h5>
        </div>
        <div className="d-flex justify-content-between mt-4">
            <h5 className="card-title">Buyer : <span className="span-data">Peopletech Group</span></h5>
            <h5 className="card-title">Supplier : <span className="span-data">Demo Supplier</span></h5>
            <h5 className="card-title">Start Date : <span className="span-data">27/08/2024</span></h5>
        </div>
        {splited_id === "PO" ? (
            <div className="customcard mt-4 pt-2 ps-4"> 
            <h5 className="timeline-name">Transaction Timeline</h5>
                <div className="background justify-content-between w-100">
                    <div className = "timeline-container">
                        <Timeline id="timeline">
                            <TimelineItem className = "timeline-item">
                                <TimelineSeparator className = "timeline-separator">
                                    <TimelineDot className = "timeline-dot">
                                        {activeStep === true && <Check className = "check-mark"/>}
                                    </TimelineDot>
                                    <TimelineConnector className = "timeline-connector"/>
                                </TimelineSeparator>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                    Gate Entry
                                </TimelineContent>
                                <TimelineContent className = "timeline-content"sx={{ marginTop: -1, marginLeft: -5}}>
                                    22/08/2024
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem className = "timeline-item">
                                <TimelineSeparator className = "timeline-separator">
                                    <TimelineDot className = "timeline-dot">
                                        {activeStep === true && <Check className = "check-mark" />}
                                    </TimelineDot>
                                    <TimelineConnector className = "timeline-connector" />
                                </TimelineSeparator>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                    QA Test
                                </TimelineContent>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                    22/08/2024
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem className = "timeline-item">
                                <TimelineSeparator className = "timeline-separator">
                                    <TimelineDot className = "timeline-dot">
                                        {activeStep === true && <Check className="check-mark" />}
                                    </TimelineDot>
                                </TimelineSeparator>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -3}}>
                                    Inward
                                </TimelineContent>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                    22/08/2024
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </div>
                    
                    <Dropdown className="customdropdwn ml-auto">
                        <Dropdown.Toggle id="dropdown-autoclose-true" className='p-2 bg-white border' align={{ lg: 'start', md: 'start', sm: 'start' }} >
                            Create Document
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Proforma Invoice</Dropdown.Item>
                            <Dropdown.Item onClick={handleGateEntery}>Gate Entry</Dropdown.Item>
                            <Dropdown.Item onClick={handleNavigateToQA}>IQC Test</Dropdown.Item>
                            <Dropdown.Item>Inward</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    
            </div>
            </div>
        ): splited_id === "SO" ? (
            <div className="customcard mt-4 pt-2 ps-3"> 
                <h5>Transaction Timeline</h5>
            <div className="background d-flex justify-content-between w-100">
            <div className = "timeline-container">
                        <Timeline id="timeline">
                            <TimelineItem className = "timeline-item">
                                <TimelineSeparator className = "timeline-separator">
                                    <TimelineDot className = "timeline-dot">
                                        {activeStep === true && <Check className = "check-mark"/>}
                                    </TimelineDot>
                                    <TimelineConnector className = "timeline-connector"/>
                                </TimelineSeparator>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                    Service Order
                                </TimelineContent>
                                <TimelineContent className = "timeline-content"sx={{ marginTop: -1, marginLeft: -5}}>
                                    22/08/2024
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem className = "timeline-item">
                                <TimelineSeparator className = "timeline-separator">
                                    <TimelineDot className = "timeline-dot">
                                        {activeStep === true && <Check className = "check-mark" />}
                                    </TimelineDot>
                                    <TimelineConnector className = "timeline-connector" />
                                </TimelineSeparator>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                    Proforma Invoice
                                </TimelineContent>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                    22/08/2024
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem className = "timeline-item">
                                <TimelineSeparator className = "timeline-separator">
                                    <TimelineDot className = "timeline-dot">
                                        {activeStep === true && <Check className="check-mark" />}
                                    </TimelineDot>
                                </TimelineSeparator>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                    Tax Invoice
                                </TimelineContent>
                                <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                    22/08/2024
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </div>
                
                <Dropdown className="customdropdwn ml-auto">
                    <Dropdown.Toggle id="dropdown-autoclose-true" className='p-2 bg-white border' align={{ lg: 'start', md: 'start', sm: 'start' }} >
                        Create Document
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Delivery Challan</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                
        </div>
        </div>
        ):splited_id === "PI" || splited_id === "INV" ? (
            <div className="customcard mt-4 pt-2 ps-3"> 
                <h5>Transaction Timeline</h5>
                <div className="background d-flex justify-content-between w-100">
                    <div className = "timeline-container">
                            <Timeline id="timeline">
                                <TimelineItem className = "timeline-item">
                                    <TimelineSeparator className = "timeline-separator">
                                        <TimelineDot className = "timeline-dot">
                                            {activeStep === true && <Check className = "check-mark"/>}
                                        </TimelineDot>
                                        <TimelineConnector className = "timeline-connector"/>
                                    </TimelineSeparator>
                                    <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                        Porchase Order
                                    </TimelineContent>
                                    <TimelineContent className = "timeline-content"sx={{ marginTop: -1, marginLeft: -5}}>
                                        22/08/2024
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem className = "timeline-item">
                                    <TimelineSeparator className = "timeline-separator">
                                        <TimelineDot className = "timeline-dot">
                                            {activeStep === true && <Check className = "check-mark" />}
                                        </TimelineDot>
                                        <TimelineConnector className = "timeline-connector" />
                                    </TimelineSeparator>
                                    <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                        Proforma Invoice
                                    </TimelineContent>
                                    <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -5}}>
                                        22/08/2024
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem className = "timeline-item">
                                    <TimelineSeparator className = "timeline-separator">
                                        <TimelineDot className = "timeline-dot">
                                            {activeStep === true && <Check className="check-mark" />}
                                        </TimelineDot>
                                    </TimelineSeparator>
                                    <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                        Tax Invoice 
                                    </TimelineContent>
                                    <TimelineContent className = "timeline-content" sx={{ marginTop: -1, marginLeft: -4}}>
                                        22/08/2024
                                    </TimelineContent>
                                </TimelineItem>
                            </Timeline>
                        </div>
                    </div>
            </div>
        ):null}
        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-3">
          <div className="d-flex align-items-center w-100">
            <div className="partno-sec w-100">
              <div className="w-100">
                    <div className="row mt-4">
                      <div className='mt-4'>
                        {splited_id === "PO" ||splited_id === "SO" ? ( 
                        <>
                        <Col xs={12} md={8}>
                        <Card className='customcard mb-4' style={{ width: '100%' }}>
                            <Card.Body>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>{po_date}</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                <div className='w-100'>
                                  <h3 className='card-title' >
                                    Purchase Order :
                                    <span className="ms-2 text-invoice" onClick={InvoiceView}>{po_id || getcomments?.po_id}</span>

                                  </h3>
                                  {/* <h3 className='card-title' style={{textDecoration: "underline"}} onClick={InvoiceView}>Purchase Order: {poName}</h3> */}
                                  <div className='d-flex justify-content-between mt-3'>
                                    <h3 className='card-title'>Number of Items : {"-"}</h3>
                                    <h3 className='card-title'>Amount : {grand_total||getcomments?.grand_total}</h3>
                                    <h3 className='card-title'>Due Date : {getcomments?.max_delivery_date || "-"}</h3>
                                </div>
                                </div>

                              </div>
                              <Accordion defaultActiveKey="0">
  <Accordion.Item eventKey="0">
    <Accordion.Header>
      <div className="rectangular-box d-flex align-items-center">
        <TiMessages />
        <p className="mb-0 ps-3">
          Comments: {getcomments?.comment_count} | Attachments: {getcomments?.attachments_count}
        </p>
      </div>
    </Accordion.Header>
    <Accordion.Body>
    
      {commentsList1.length === 0 ? (
        <div className="textcomment text-center w-100">No comments added.</div>
      ) : (
        commentsList1.map((item, index) => (
          <div key={index} className="commentsul mt-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="card-title mb-0 d-flex justify-content-between align-items-center">
                <span className="card-circle me-2"></span> Super Admin
                <span className="card-smalltag">(People Tech Group)</span>
              </h3>
              <h3 className="card-title">{moment(item.doc_time).format('YYYY-MM-DD, HH:mm:ss')}</h3>
            </div>
            <div className="textcomment">{item.comment}</div>

            {item.attachment.length > 0 && (
              <div className="attachments-section">
                {item.attachment.map((doc, docIndex) => (
                  <a
                    key={docIndex}
                    href={`data:${doc.doc_type};base64,${doc.doc_body}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="textcomment"
                    download={doc.doc_name} 
                  >
                    {doc.doc_name}
                  </a>
                ))}
              </div>
            )}
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
                                        multiple
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
                                     // disabled={!comment.trimStart() && selectedFiles.length === 0}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </div>

                              )}
                              
                              </Card.Body>
                          </Card>
                        </Col>
                        <Col xs={12} md={8}>
                          <Card className='customcard mb-4' style={{ width: '100%' }}>
                            <Card.Body>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>22/08/2024</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                <div className='w-100'>
                                  <h3 className='card-title' >
                                    {splited_id === "PO" ? "Proforma Invoice : " : "Deliver Chalana : "} 
                                    <span className="ms-2 text-invoice" onClick={InvoiceView}>{splited_id === "PO" ? "PI0001" : "DA0001"}</span>
                                  </h3>
                                  {/* <h3 className='card-title' style={{textDecoration: "underline"}} onClick={InvoiceView}>Purchase Order: {poName}</h3> */}
                                  <div className='d-flex justify-content-between mt-3'>
                                    <h3 className='card-title'>Number of Items: 1</h3>
                                    <h3 className='card-title'>Amount: 20,000</h3>
                                    <h3 className='card-title'>Due Date: 22/08/2024</h3>
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

                                    {commentsList.length === 0 ? (
                                      <div className="textcomment text-center w-100">No comments added.</div>
                                    ) : (
                                      commentsList && commentsList.map((item, index) => (
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
                                      //disabled={!comment.trimStart() && selectedFiles.length === 0}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </div>

                              )}
                              
                              </Card.Body>
                          </Card>
                        </Col>
                        <Col xs={12} md={8}>
                          <Card className='customcard mb-4' style={{ width: '100%' }}>
                            <Card.Body>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>22/08/2024</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                <div className='w-100'>
                                  <h3 className='card-title' >
                                    {splited_id === "PO" ? "GST Invoice : " : "Invoice : "}
                                    <span className="ms-2 text-invoice" onClick={InvoiceView}>{splited_id === "PO" ? "GST0001" : "INV0001"}</span>
                                  </h3>
                                  {/* <h3 className='card-title' style={{textDecoration: "underline"}} onClick={InvoiceView}>Purchase Order: {poName}</h3> */}
                                  <div className='d-flex justify-content-between mt-3'>
                                    <h3 className='card-title'>Number of Items: 1</h3>
                                    <h3 className='card-title'>Amount: 20,000</h3>
                                    <h3 className='card-title'>Due Date: 22/08/2024</h3>
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

                                    {commentsList2.length === 0 ? (
                                      <div className="textcomment text-center w-100">No comments added.</div>
                                    ) : (
                                      commentsList2 && commentsList2.map((item, index) => (
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
                                      //disabled={!comment.trimStart() && selectedFiles.length === 0}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </div>

                              )}
                              
                              </Card.Body>
                          </Card>
                        </Col>
                        {/* --------------------------------------------------------------------- */}
                      {Array.isArray(cardsDetails) && cardsDetails?.map((entry, index) => (
                        <Col xs={12} md={8} key={index}>
                        <Card className='customcard mb-4'>
                            <Card.Body>
                                <div className="card-container">
                                    <Timeline id="timeline">
                                        <TimelineItem className="timeline-item">
                                            <TimelineSeparator className="timeline-separator">
                                                <TimelineDot className={entry?.tick >= 0 ? "timeline-dot" : "befor-timeline-dot"}>
                                                    {entry?.tick >= 0 && <Check className="check-mark"/>}
                                                </TimelineDot>
                                                <TimelineConnector className="card-timeline-connector"/>
                                            </TimelineSeparator>
                                            <TimelineContent className = "timeline-content"sx={{ marginTop: -1, marginLeft: -4}}>
                                                Gate Entry
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem className="timeline-item">
                                            <TimelineSeparator className="timeline-separator">
                                                <TimelineDot className={entry?.tick >= 1 ? "timeline-dot" : "befor-timeline-dot"}>
                                                    {entry?.tick >= 1 && <Check className="check-mark"/>}
                                                </TimelineDot>
                                                <TimelineConnector className="card-timeline-connector"/>
                                            </TimelineSeparator>
                                            <TimelineContent className = "timeline-content"sx={{ marginTop: -1, marginLeft: -3}}>
                                                QA Test
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem className="timeline-item">
                                            <TimelineSeparator className="timeline-separator">
                                                <TimelineDot className={entry?.tick >= 2  ? "timeline-dot" : "befor-timeline-dot"}>
                                                    {entry?.tick >= 2  && <Check className="check-mark"/>}
                                                </TimelineDot>
                                            </TimelineSeparator>
                                            <TimelineContent className = "timeline-content"sx={{ marginTop: -1, marginLeft: -3}}>
                                                Inward
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                </div>
                      {/* multiple cards      GATE ENTERY       QA   INW  */}
                              {entry?.GateEntry?.gate_entry_id && (
                                <>
                                 <div className='d-flex justify-content-between align-items-center mb-3'>
                                 <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                 <h3 className="card-title">Date : {entry?.GateEntry?.date_time}</h3>
                               </div>
                                                              <div className='d-flex align-items-center'>
                                                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                                                <div className='w-100'>
                                                                  <div className='d-flex justify-content-between mt-3'>
                                                                    <div className='d-flex justify-content-between w-50'>
                                                                     <h3 className='card-title'onClick={handleShowModelgate}>Gate Entry:{entry?.GateEntry?.gate_entry_id}</h3>
                                                                      <h3 className='card-title'>Invoice: {entry?.GateEntry?.invoice_num}</h3>
                                                                    </div>
                                                                  </div>
                                                                  <div className='d-flex justify-content-between mt-3'>
                                                                    <div className='d-flex justify-content-between w-50'>
                                                                      <h3 className='card-title'>Number of items: {entry?.GateEntry?.items}</h3>
                                                                      <h3 className="card-title">Amount : {entry?.GateEntry?.total_price}</h3>
                                                                    </div>
                                                                    {/* <h3 className="card-title">Date : {entry?.GateEntry?.gate_entry_date}</h3> */}
                                                                  </div>
                                                                <div className="w-100">
                                                                  {entry?.GateEntry?.images &&
                                                                    entry?.GateEntry?.images?.length > 0 ? (
                                                                    <Row>
                                                                      {entry?.GateEntry?.images?.map(
                                                                        (image, index) => (
                                                                          <Col xs={12} md={2} key={index}>
                                                                            <div className="doc-card position-relative" style={{width: "80px", height: "50px"}}>
                                                                              <div>
                                                                                <img src={image?.doc_url} alt="" />
                                                                              </div>
                                                                              <div className="doc-sec position-absolute">
                                                                                <div className="d-flex justify-content-between">
                                                                                  <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                    <a
                                                                                      href={image?.doc_url}
                                                                                      target="_blank"
                                                                                      rel="noreferrer"
                                                                                    >
                                                                                      <img src={view} alt="" />
                                                                                    </a>{" "}
                                                                                  </Button>
                                                                                </div>
                                                                              </div>
                                                                            </div>
                                                                          </Col>
                                                                        )
                                                                      )}
                                                                    </Row>
                                                                  ) : (
                                                                    <p>No Images Available.</p>
                                                                  )}</div>
                                                              </div>
                                                            </div>
                                                            </>
                              )}
                              <hr/>
                              
                              {entry?.QATest?.qa_test && (
                                <>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>{entry?.GateEntry?.date}</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                              <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                <div className='w-100'>
                                  <div className='d-flex justify-content-between mt-3'>
                                    <div className='d-flex justify-content-between w-50'>
                                      <h3 className='card-title'onClick={handleShowModeliqc}>QA Test: GE0001</h3>
                                      <h3 className='card-title'>Invoice: INV0001</h3>
                                    </div>
                                  </div>
                                  <div className='d-flex justify-content-between mt-3'>
                                    <div className='d-flex justify-content-between w-50'>
                                      <h3 className='card-title'>Number of items: 4</h3>
                                      <h3 className="card-title">Amount : 20,000</h3>
                                    </div>
                                    <h3 className="card-title">Date : 7/08/2024</h3>
                                  </div>
                              </div>
                            </div>
                            <hr/>
                            </>
                              )}
                            {entry?.inward?.iwd_id && (
                              <>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>22/08/2024</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                  <div className='w-100'>
                                    <div className='d-flex justify-content-between mt-3'>
                                      <div className='d-flex justify-content-between w-75'>
                                        <h3 className='card-title'>Inward Document: GE0001</h3>
                                        <h3 className='card-title'>Invoice: INV0001</h3>
                                      </div>
                                    </div>
                                    <div className='d-flex justify-content-between mt-3'>
                                      <div className='d-flex justify-content-between w-50'>
                                        <h3 className='card-title'>Number of items: 4</h3>
                                      </div>
                                      <h3 className="card-title">Date : 7/08/2024</h3>
                                    </div>
                                </div>
                              </div>
                              </>
                            )}
                              {entry?.comments?.length === 0 ? (
                                      <div className="textcomment text-center w-100">No comments added.</div>
                                    ) : (
                                      entry?.comments && entry?.comments.map((item, index) => (
                                        <div key={index} className="commentsul mt-2">
                                          <div className='d-flex justify-content-between align-items-center mb-1'>
                                            <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'>
                                              <span className='card-circle me-2'></span> Super Admin
                                              <span className='card-smalltag'>(People Tech Group)</span></h3>
                                            <h3 className='card-title'>{moment(item.created_time).format('YYYY-MM-DD, HH:mm:ss')}</h3>
                                          </div>
                                          <div className="textcomment">{item.comment_text}</div>
                                          {item.attachments?.length > 0 ? (
                                            item.attachments?.map((attachment, index) => (
                                                        <div key={index}>
                                                            {/* Render attachment details here */}
                                                           {attachment?.file_name.length < 25 ? <p>{attachment.file_name}</p> : null}
                                                            <a href={attachment.file_url}>Download</a>
                                                        </div>
                                                    ))
                                                ) : null}
                                        
                                          {/* <div className="textcomment">{item.doc_name}</div> */}
                                          {/* <a className="textcomment" href={item?.attachments?.file_url} target="_blank" rel="noopener noreferrer">{item?.attachments?.file_name}</a> */}
                                        </div>
                                      ))
                                    )}
                              <Accordion defaultActiveKey="0">
                               
                                <Accordion.Item >
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
                                      value={multipleCardComment[index]}
                                      onChange={(e) => handleInputChangeComment(e, index)}
                                    />
                                    <div className="attachment upload-btn-comment">
                                      <button class="btn" ><img src={attachment} /></button>
                                      <input
                                        type="file"
                                        accept="application/pdf, image/jpeg, image/png"
                                        id="upload"
                                        multiple
                                        onChange={handlePdfChange}
                                      />
                                    </div>
                                  </div>
                                  {Array.isArray(selectedFiles) && selectedFiles.map((file, index) => (
                                    <Col xs={12} md={12} key={index} className="mt-2">
                                      <Form.Group>
                                        <div className="attachment-sec">
                                          <span className="attachment-name">
                                            {file.name}
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
                                      onClick={() => handleCommentBtn(entry?.GateEntry?.gate_entry_id, index)}
                                      // disabled={!multipleCardComment.trimStart() && selectedFiles.length  < 0}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                       
                        </>
                        ) :  splited_id === "PI" || splited_id === "INV" ? (
                            <Col xs={12} md={8}>
                          <Card className='customcard mb-4'>
                            <Card.Body>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> Super Admin<span className='card-smalltag'>(People Tech Group)</span></h3>
                                <h3 className='card-title'>22/08/2024</h3>
                              </div>
                              <div className='d-flex align-items-center'>
                                <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                                <div className='w-100'>
                                  <h3 className='card-title' >
                                    {splited_id === "PI" ? "Proforma Invoice : " : " Tax Invoice : "}
                                    <span className="ms-2 text-invoice" onClick={InvoiceView}>{splited_id === "PI" ? "PI0001" : "INV0001"}</span>
                                  </h3>
                                  {/* <h3 className='card-title' style={{textDecoration: "underline"}} onClick={InvoiceView}>Purchase Order: {poName}</h3> */}
                                  <div className='d-flex justify-content-between mt-3'>
                                    <h3 className='card-title'>Number of Items: 1</h3>
                                    <h3 className='card-title'>Amount: 20,000</h3>
                                    <h3 className='card-title'>Due Date: 22/08/2024</h3>
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
                                    <Button type="button" className="submit submitmobile"
                                      onClick={handleUpdateComments}
                                     // disabled={!comment.trimStart() && selectedFiles.length === 0}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </div>
                              )}

                              </Card.Body>
                          </Card>
                        </Col>
                        ) : null}
                      </div>
                    </div>
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

export default InnerdetailsList;