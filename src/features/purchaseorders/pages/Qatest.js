import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import Table from "react-bootstrap/Table";
import "react-toastify/ReactToastify.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import pdfImage from "../../../assets/Images/pdf.svg";
import Upload from "../../../assets/Images/upload.svg";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { ToastContainer, Zoom, toast } from "react-toastify";
import {
  getcmsGetGateEntryIdForNewPo,
  getcmsNewPurchaseOrderQaTestGetDetails,
  getinwardqatest,
  postinwardQatest,
  resetNewPurchaseOrderQaTestGetDetails,
  saveQATest,
  selectGateEntryDetails,
  selectGateEntryIds,
  selectInwardQatest,
  selectLoadingStatus,
} from "../slice/PurchaseOrderSlice";
import { gateEntryTable } from "../../../utils/TableContent";
import { String } from "../../../resources/Strings";
import { name } from "@azure/msal-browser/dist/packageMetadata";
import attahment from "../../../assets/Images/attachment.svg";
const InwardPurchaseStep2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { po_id, inward_id, iqc } = location.state;
  console.log(po_id, "===================");
  const inwardqatestDetails = useSelector(selectInwardQatest);
  console.log(inwardqatestDetails);
  const isLoading = useSelector(selectLoadingStatus);
  const [qatestDetails, setQatestDetails] = useState({
    order_no: "",
    QA_date: "",
    inwardId: "",
    sender_name: "",
    sender_contact_number: "",
    description: "",
    invoice_num: "",
    invoice_photo: "",
    documents: [],
    parts: [],
  });
  const [invoicePreview, setInvoicePreview] = useState(false);
  const [invoiceFileName, setInvoiceFileName] = useState("");
  const [qatestDocPreview, setQatestDocPreview] = useState(null);
  const [qatestFileName, setQatestFileName] = useState("");
  const [imageSetted, setImageSetted] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({});
  const [imageFileName, setImageFileName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [disablebtn, setDisablebtn] = useState(false);

  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  console.log(selectedFilesBase64)
  const [selectedFiles1, setSelectedFiles1] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [uploadFiles, setUpload] = useState("");


  const gateEntryOptions = useSelector(selectGateEntryIds);
  const gateEntryDetailsData = useSelector(selectGateEntryDetails);
  const gateEntryIds = gateEntryOptions?.body;
  const gateEntryDetails = gateEntryDetailsData?.body;
  const [options, setOptions] = useState([]);
  const [selectedGateEntry, setSelectedGateEntry] = useState('');
  console.log(gateEntryDetails);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQatestDetails({
      ...qatestDetails,
      [name]: value,
    });
  };

  const handleFileInputChange = (e, docType) => {
    const files = e.target.files;
    const promises = Array.from(files).map((file) => {
      // setUploadedFileNames((prevFileNames) => [...prevFileNames, file.name]);
      return new Promise((resolve) => {
        const reader = new FileReader();
        if (docType === "Invoice") {
          if (file.type !== "application/pdf") {
            toast.error(String.please_select_pdf);
          }else if (file.size > 500 * 1024) { // Check if file size is greater than 200KB
            toast.error("File size should be less than 2MB.");
          } else {
            setInvoiceFileName(file.name);
            setInvoicePreview(true);
            reader.onload = (event) => {
              const encodedFile = event.target.result.split(",")[1];
              resolve(encodedFile);
            };
            reader.readAsDataURL(file);
          }
        }
        if (docType === "QA-Test") {
          if (file.type !== "application/pdf") {
            toast.error(String.please_select_pdf);
          }else if (file.size > 500 * 1024) { // Check if file size is greater than 200KB
            toast.error("File size should be less than 500KB.");
          } else {
            setQatestFileName(file.name);
            setQatestDocPreview(true);
            reader.onload = (event) => {
              const encodedFile = event.target.result.split(",")[1];
              resolve({
                doc_type: docType,
                doc_name: file.name,
                doc_body: encodedFile,
              });
            };
            reader.readAsDataURL(file);
          }
        }
        if (docType === "Photo") {
          if (file.type !== "image/jpeg") {
            toast.error(String.please_select_jpg);
          } else {
            setImageSetted(true);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
            setImageFileName(file.name);
          }
        }
        
      });
    });
    Promise.all(promises).then((newDocuments) => {
      if(docType === "Invoice"){
        setQatestDetails((prevDetails) => ({
          ...prevDetails,
          invoice_document: newDocuments[0],
        }));
      }
      else{
      setQatestDetails((prevDetails) => ({
        ...prevDetails,
        documents: [...(prevDetails.documents || []), ...newDocuments],
      }));
    }
    });
  };
  

  
  const handleDeleteFile = (docType) => {
    setQatestDetails((prevDetails) => {
      const updatedDocuments = prevDetails.documents?.filter(
        (doc) => doc.doc_type !== docType
      );
      return {
        ...prevDetails,
        documents: updatedDocuments || [],
      };
    });
    if (docType === "Invoice") {
      setInvoiceFileName("");
      setInvoicePreview(false);
    } else if (docType === "QA-Test") {
      setQatestFileName("");
      setQatestDocPreview(false);
    } else if (docType === "Photo") {
      setImageFileName("");
      setImageSetted(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split("T")[0];
      setQatestDetails((prevDetails) => ({
        ...prevDetails,
        QA_date: isoDate,
      }));
    } else {
      setQatestDetails((prevDetails) => ({
        ...prevDetails,
        QA_date: "",
      }));
    }
  };

  const handleLotChange = (e,index) => {
    const newValue = e.target.value;
    console.log(newValue)
    setQatestDetails((prevDetails) => ({
      ...prevDetails,
      parts : prevDetails.parts.map((part,i) => 
        i === index ? {...part,lot_id : newValue} : part
      )
    }))

  }
  console.log(qatestDetails)

  const handlePassQtyChange = (e, index) => {
    const newValue = e.target.value;
    setQatestDetails((prevDetails) => ({
      ...prevDetails,
      parts: prevDetails.parts.map((part, i) =>
        i === index ? { ...part, pass_qty: newValue } : part
      ),
    }));
  };
  console.log(qatestDetails)

  const handleFailQtyChange = (e, index) => {
    const newValue = e.target.value;
    setQatestDetails((prevDetails) => ({
      ...prevDetails,
      parts: prevDetails.parts.map((part, i) =>
        i === index ? { ...part, fail_qty: newValue } : part
      ),
    }));
  };
  const calculateTotalQty = () => {
    let totalpassQty = 0;
    let totalfailQty = 0;
    let totalreceivedQty = 0;

    if (Array.isArray(qatestDetails?.parts)) {
      qatestDetails.parts.forEach((part) => {
        totalpassQty += parseFloat(part.pass_qty, 10) || 0;
        totalfailQty += parseFloat(part.fail_qty, 10) || 0;
        totalreceivedQty += parseFloat(part.received_qty, 10) || 0;
      });
    }
    return { totalpassQty, totalfailQty, totalreceivedQty };
  };

  const { totalfailQty, totalpassQty, totalreceivedQty } = calculateTotalQty();

  useEffect(() => {
    if(iqc === "IQC"){
      const request = {
        "po_id": po_id || "OPTG3"
      }
      dispatch(getcmsGetGateEntryIdForNewPo(request))
    }
    else{
    const requestObj = {
      po_id: po_id,
      inwardId: inward_id,
    };
    dispatch(getinwardqatest(requestObj));
  }
  }, []);
  console.log(JSON.stringify(qatestDetails, null, 2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisablebtn(false);
    console.log(selectedFilesBase64)
    const excleBase64Array = selectedFilesBase64.map((base64,index) => ({
      excle: base64,
      excle_type:fileNames[index].split('.').pop(),
      file_type: fileNames[index],
    }))
    const detailsToSubmit = {
      ...qatestDetails,
      description: qatestDetails.description || "",
      excle : excleBase64Array,
      ...(iqc === "IQC" && { document_id: po_id })
    };
    if(iqc === "IQC"){
      delete detailsToSubmit?.documents;
    }

    console.log(JSON.stringify(qatestDetails, null, 2));
    if(iqc === "IQC"){
      dispatch(saveQATest(detailsToSubmit)).then((res) => {
        if(res?.payload?.statusCode === 200){
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      })
    }
    else{
    const response = await dispatch(postinwardQatest(detailsToSubmit));
    if (response.payload?.statusCode === 200){
       setTimeout(() => {
      navigate(-1);
    }, 2000);
    setDisablebtn(true);
    }
  }
}
   

  //Function to Split the File Name with extension
  const getFileNameFromURL = (url) => {
    if (typeof url === "string") {
      const parts = url?.split("/");
      return parts[parts?.length - 1];
    }
  };

  useEffect(() => {
    if (!isLoading && iqc !== "IQC") {
      // setQatestDetails(inwardqatestDetails?.body);
      const updatedDetails = {
        ...inwardqatestDetails?.body,
        description: inwardqatestDetails?.body?.description || "",
      };
  
      setQatestDetails(updatedDetails);
      setImageSetted(true);
      setImagePreviews(inwardqatestDetails?.body?.invoice_photo || {});
      if (inwardqatestDetails?.body?.invoice_document === ""){
        setInvoicePreview(false);
      }
     else {
      setInvoicePreview(true);
     }
      setImageFileName(() =>
        getFileNameFromURL(inwardqatestDetails?.body?.invoice_photo)
      );
      setInvoiceFileName(() =>
        getFileNameFromURL(inwardqatestDetails?.body?.invoice_document)
      );
    }
  }, [inwardqatestDetails]);


  useEffect(() => {
    if(!isLoading && iqc === "IQC"){
      setQatestDetails((prevDetails) => ({
        ...prevDetails,
        ...gateEntryDetails
      }))
      setImageSetted(true);
      setImagePreviews(gateEntryDetails?.invoice_photo || {});
    }
  }, [gateEntryDetails, isLoading])

  useEffect(() => {
    setOptions(gateEntryIds);
  }, [gateEntryIds]);

  const handleBackNavigation = () => {
    navigate(-1);
    dispatch(resetNewPurchaseOrderQaTestGetDetails());
  };

  const handleOptionChange = (e) => {
      const {value, name} = e.target;
      setSelectedGateEntry(value);
      if(value !== ""){
      const requestobj = {
        "po_id": po_id ,
        "inwardId": value
      }
      dispatch(getcmsNewPurchaseOrderQaTestGetDetails(requestobj));
    }
      setQatestDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value
      }))
  }

  const updateInputFields = (e) => {
    const { value } = e.target;
    const nextFormState = {
      ...qatestDetails,
      [e.target.name]: value,
    };
    setQatestDetails(nextFormState);
  };
  const handleFileInputFocus = (e) => {
    e.preventDefault();
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

  const handleExcleChange = (e) => {
    const newFiles = [...selectedFiles1];
    const newFileNames = [...fileNames];
    const newFilesBase64 = [...selectedFilesBase64];
    let hasNonPdfFile = false;
    let hasDuplicateFile = false;

    
    for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.type === "text/csv" || file.type === "application/pdf" || file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            if (newFileNames.includes(file.name)) {
                hasDuplicateFile = true;
            } 
            else if (file.size > 500 * 1024) { // Check if file size is greater than 200KB
              toast.error("File size should be less than 500KB.");
            }
            else {
                newFileNames.push(file.name);
                newFiles.push(file);
                const reader = new FileReader();
                reader.onload = (fileOutput) => {
                    const encodedFile = fileOutput.target.result.split(",")[1];
                    newFilesBase64.push(encodedFile);
                    // Update state only after file is read
                    setSelectedFiles1([...newFiles]);
                    setFileNames([...newFileNames]);
                    setSelectedFilesBase64([...newFilesBase64]);
                };
                reader.readAsDataURL(file);
            }
        } else {
            hasNonPdfFile = true;
        }
    }

    if (hasNonPdfFile) {
        toast.error("Only CSV & PDF files are allowed.");
    }

    if (hasDuplicateFile) {
        toast.warning("Duplicate files are not allowed.");
    }

    // Clear the input value to trigger change event on re-upload of the same file
    e.target.value = "";
};

const removeattachment1 = (index) => {
  const updatedFiles = selectedFiles1.filter((_, i) => i !== index);
  const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
  const updatedFileNames = fileNames.filter((_, i) => i !== index);
  // Update the state with the updated arrays
  setSelectedFiles1(updatedFiles);
  setSelectedFilesBase64(updatedFilesBase64);
  setFileNames(updatedFileNames);
  const inputElement = document.querySelector('input[type="file"][name="upload"]');
  if (inputElement) {
      inputElement.value = '';
  }
};


  return (
    <>
      <div className="wrap">
        {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">{String.Loading_text}</span>
            </Spinner>
          </div>
        )}
        <div className="d-flex mt-3">
          <img
            src={arw}
            alt=""
            className="me-3 "
            onClick={handleBackNavigation}
          />
          <h4 className="title-tag">{iqc === "IQC" ? "IQC Test" : String.qa_test}</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="content-sec">
            <h3 className="inner-tag">{String.order_details_text}</h3>

            <Row>
              {iqc === "IQC" &&
              (
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                <Form.Label>Gate Entry Id</Form.Label>
                <Form.Select 
                  name="gate_entry_id"
                  value={selectedGateEntry}
                  onChange={(e) => handleOptionChange(e)}
                >
                  <option value="">Select a Gate Entry</option>
                  {Array.isArray(options) && options?.flatMap((item) => (
                    <option>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              </Col>
              )}

              <Col xs={12} md={3}>
              {iqc === "IQC" ? (
                <Form.Group className="mb-3">
                <Form.Label>{String.order_num_text}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="order_no"
                  value={qatestDetails?.order_no}
                  onChange={handleInputChange}
                  required={true}
                  disabled={true}
                />
              </Form.Group>
              ) : (
                  <Form.Group className="mb-3">
                  <Form.Label>{String.inward_id_text}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="inwardId"
                    value={qatestDetails?.inwardId}
                    onChange={handleInputChange}
                    required={true}
                    disabled={true}
                  />
                </Form.Group>
              )}
                
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{iqc === "IQC" ? "IQC Date" : String.qa_date}</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd" 
                    name="QA_date"
                    className="form-control"
                    onFocus={(e) => (e.target.readOnly = true)}
                    // maxDate={new Date()}
                    // minDate={new Date()}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.sender_name}</Form.Label>
                  <Form.Control
                    type="text"
                    name="sender_name"
                    value={qatestDetails?.sender_name}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.sender_contact_number}</Form.Label>
                  <Form.Control
                    name="sender_contact_number"
                    value={qatestDetails?.sender_contact_number}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.invoice_number}</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice_num"
                    value={qatestDetails?.invoice_num}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                  <Form.Group className="mb-0">
                      <Form.Label>IQC Documents</Form.Label>
                        <div>
                            <input
                              type="file"
                              id="upload"
                              name="upload"
                              value={uploadFiles}
                              hidden
                              multiple
                              onChange={handleExcleChange}
                              accept=".pdf,.csv,.xlsx,.xls,"
                              />
                              <label htmlFor="upload" className="cfile">
                                <img src={attahment} alt="" />
                             </label>
                        </div>
                  </Form.Group>
              </Col>

              {selectedFiles1.map((file, index) => (
                               <Col xs={12} md={3} key={index}>
                               <Form.Group className="mb-1">
                                 {index === 0 ? <Form.Label>&nbsp;</Form.Label> : null}
                                 <div className="attachment-sec">
                                   <span className="attachment-name">{file.name}</span>
                                   <span
                                     className="attachment-icon"
                                     onClick={() => removeattachment1(index)}
                                   >
                                     x
                                   </span>
                                 </div>
                               </Form.Group>
                             </Col>
                ))}
            </Row>

            <Row>
              {iqc !== "IQC" && (
              <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{String.upload_invoice}</Form.Label>
                <div class="upload-btn-wrapper">
                  {invoicePreview ? (
                    <>
                      <img
                        style={{ maxwidth: "100px", maxHeight: "100px" }}
                        src={pdfImage}
                        alt="pdf preview"
                      />
                      <span
                        className="close"
                        onClick={() => handleDeleteFile("Invoice")}
                      >
                        &times;
                      </span>
                    </>
                  ) : (
                    <>
                      <img src={Upload} alt="" />
                      <input
                        type="file"
                        name="Invoice"
                        accept="application/pdf"
                        required={true}
                        tabIndex={0}
                        onChange={(e) => handleFileInputChange(e, "Invoice")}
                      />
                    </>
                  )}
                </div>
                <div>
                  {invoiceFileName && (
                    <p className="uploadimg-tag">{invoiceFileName}</p>
                  )}
                </div> 
              </Form.Group>
            </Col>
              )}

              {iqc !=="IQC" &&
              (<Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.qa_test_document}</Form.Label>
                  <div class="upload-btn-wrapper">
                    {qatestDocPreview ? (
                      <>
                        <img
                          style={{ maxwidth: "100px", maxHeight: "100px" }}
                          src={pdfImage}
                          alt="pdf preview"
                        />
                        <span
                          className="close"
                          onClick={() => handleDeleteFile("QA-Test")}
                        >
                          &times;
                        </span>
                      </>
                    ) : (
                      <>
                        <img src={Upload} alt="" />
                        <input
                          type="file"
                          name="qatest"
                          accept="application/pdf"
                          required={true}
                          tabIndex={0}
                          onChange={(e) => handleFileInputChange(e, "QA-Test")}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    {qatestFileName && (
                      <p className="uploadimg-tag">{qatestFileName}</p>
                    )}
                  </div>
                </Form.Group>
              </Col>)}
              
              {iqc !== "IQC" && Object.keys(imagePreviews).map((imageName) => (
                <Col xs={12} md={3}  key={imageName}>
                  <Form.Group className="mb-3">
                    <Form.Label>{imageName}</Form.Label>
                    <div class="upload-btn-wrapper">
                    <div>
                    <span className="picsec position-relative" >
                    {/* <img style={{ maxWidth: "100px", maxHeight: "100px" }}
                     src={`data:image/jpeg;base64, ${imagePreviews[imageName]}`}
                     alt={imageName} /> */}
                      <img
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                        src={imagePreviews[imageName]}
                        alt={imageName}
                      />
                      </span>
                    </div>
                    </div>
                  </Form.Group>
                </Col>
              ))}
              
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    className="description-tab"
                    rows={3}
                    value={
                      qatestDetails?.description
                        ? qatestDetails?.description.trimStart()
                        : ""
                    }
                    onChange={handleInputChange}
                  
                  />
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
                    <th>Received Quantity</th>
                    <th>Lot Id</th>
                    <th>{gateEntryTable.pass_qty}</th>
                    <th>{gateEntryTable.fail_qty}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(qatestDetails?.parts)
                    ? qatestDetails?.parts.map((part, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{part?.part_no}</td>
                        <td>{part?.part_name}</td>
                        <td>{part?.manufacturer}</td>
                        <td>{part?.description}</td>
                        {/* <td>{part?.packaging}</td> */}
                        <td>{part?.received_qty}</td>
                        <td>
                          <input 
                          type="text"
                          name="lot_id"
                          value={part?.lot_id !== "0"? part?.lot_id : null}
                          onChange={(e) => handleLotChange(e,index)}
                          required

                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            style={{width:'100px'}}
                            className="inputno"
                            value={part?.pass_qty !== "0" ? part?.pass_qty : null}
                            min={0}
                            onChange={(e) => handlePassQtyChange(e, index)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            style={{width:'100px'}}
                            className="inputno"
                            value={part?.fail_qty !== "0" ? part?.fail_qty : null}
                            min={0}
                            onChange={(e) => handleFailQtyChange(e, index)}
                            required
                          />
                        </td>
                      </tr>
                    ))
                    : null}
                </tbody>
                <tfoot>
                  <tr className="border-top">
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>                   
                    <td>{totalreceivedQty}</td>
                    <td></td>
                    <td className="tdfix" title={totalpassQty}>
                      {totalpassQty}
                    </td>
                    <td className="tdfix" title={totalfailQty}>
                      {totalfailQty}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
          <div className="d-flex justify-content-end mb-4">
            <Button
              type="button"
              className="cancel me-3"
              onClick={() => navigate(-1)}
            >
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

export default InwardPurchaseStep2;
