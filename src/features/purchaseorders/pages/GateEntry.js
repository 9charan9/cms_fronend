import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import Table from "react-bootstrap/Table";
import "react-toastify/ReactToastify.min.css";
import { useNavigate } from "react-router-dom";
import Upload from "../../../assets/Images/upload.svg";
import { useDispatch, useSelector } from "react-redux";
import { createPoDetailsGateEntry, getPoDetailsGateEntry, setGateEntryGetPoDeatils, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import { useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer, Zoom } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pdfImage from "../../../assets/Images/pdf.svg"
import { tableContent, gateEntryTable } from "../../../utils/TableContent";
import { String } from "../../../resources/Strings";
const GateEntry = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getPoDetails = useSelector(setGateEntryGetPoDeatils)
  console.log(getPoDetails, "142543544");
  const getPoDetailsData = getPoDetails?.body || {}
  console.log("getPoDetailsData", getPoDetailsData)
  const location = useLocation();
  const { getOrderNumber, date, status, return_id } = location.state;
  // console.log("date ", date)
  const OrderNo = getOrderNumber;
  console.log(status, "status ommqa status")
  console.log(return_id, "qa return id oommmmmm");
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [fileNamespdf, setFileNamespdf] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImageBase64, setSelectedImageBase64] = useState([]);
  const [imageName, setImageName] = useState("");
  const isLoading = useSelector(selectLoadingStatus);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const [totalQtyPerBoard, setTotalQtyPerBoard] = useState(0);
  const [totalRecQty, setTotalRecQty] = useState(0)
  const [totalBalnceQty, settotalBalnceQty] = useState(0)

  const [form, setForm] = useState({
    "order_number": "",
    "received_date": "",
    "sender_name": "",
    "sender_contact_number": "",
    "invoice_num": "",
    "rec_qty": "",
    "receiver_name": "",
    "receiver_contact": "",
  });

  const handleBackNavigation = () => {   
    if (return_id) {
      navigate(-1)
    }
    else {
      navigate(-1);
    }
  };
  const onUpdateField = (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...form,
      [name]: value
    }
    setForm(nextFormState);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      setForm((prevDetails) => ({
        ...prevDetails,
        received_date: isoDate,
      }));
    }
    else {
      setForm((prevDetails) => ({
        ...prevDetails,
        received_date: '',
      }));
    }
  };
  const onUpdateFieldPhoneNumber = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
    setForm({ ...form, sender_contact_number: sanitizedValue });
  };
  useEffect(() => 
    {
 
    if (return_id && status) {
      const requestobj = {
        "po_id": getOrderNumber,
        "return_id": return_id,
        "status": status,
      }
      dispatch(getPoDetailsGateEntry(requestobj))
    }
    else {
      const requestobj = {
        "po_id": getOrderNumber,

      }
      dispatch(getPoDetailsGateEntry(requestobj))
    }
  }, [])

  useEffect(() => 
    {
    setForm({
      "order_number": getOrderNumber,
      // "sender_name":getPoDetailsData?.vendor_poc_name,
      // "sender_contact_number": getPoDetailsData?.vendor_poc_contact_num,
      // "receiver_name": getPoDetailsData?.receiver,
      // "receiver_contact": getPoDetailsData?.receiver_contact,
    })
  
  }, [return_id,getPoDetails])

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    const newFileNames = [...fileNames];
    const newFilesBase64 = [...selectedFilesBase64];
    let invalidFileType = false;
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        invalidFileType = true;
        showToast(String.please_select_pdf);
      } else if (selectedFile.size > 500 * 1024) { // Check if size is more than 500KB
        invalidFileType = true;
        showToast("PDF size should not exceed 500KB");
      } else {
        newFileNames.push(selectedFile.name);
        const reader = new FileReader();
        setPdfFileName(selectedFile?.name)
        reader.onload = (fileOutput) => {
          setPdfPreview(reader.result);
          const encodedFile = fileOutput.target.result.split(",")[1];
          newFilesBase64.push(encodedFile);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
    if (invalidFileType) {     
      e.target.value = ""; // Reset the input value
    }
    setSelectedFiles([selectedFile]);
    setFileNamespdf(newFileNames);
    setSelectedFilesBase64(newFilesBase64);
  };
  function showToast(message) {
    toast.error(message);
  }
  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setPdfFileName("");
    setSelectedFilesBase64([]);
  };

  const readAsDataURLAsync = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e.target.error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const imageFiles = e.target.files;
    const newFileNames = [];
    const newFilesBase64 = [];
    let invalidFileSize = false;

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      if (imageFile.size > 200 * 1024) { // Check if size is more than 200KB
        invalidFileSize = true;
        showToast("Image size should not exceed 200KB");
        return; // Skip processing this file
      }
      if (imageFile.type === 'image/jpeg') {
        if (fileNames.includes(imageFile.name)) {
          showToast("Duplicate images not allowed");
          return; // Skip processing this file
        }
        newFileNames.push(imageFile.name);
        let blob = await readAsDataURLAsync(imageFiles[i]);
        newFilesBase64.push(blob);

      } else {
        showToast(String.please_select_jpg);
      }
    }
    if (invalidFileSize) {      
      e.target.value = ""; // Reset the input value
    }
    setSelectedFiles([...selectedFiles, ...imageFiles]);
    setFileNames([...fileNames, ...newFileNames]);
    setImagePreview([...imagePreview, ...newFilesBase64]);
    // console.log(newFilesBase64)
    setSelectedImageBase64([...selectedImageBase64, ...newFilesBase64]);
  };
  // Function to handle canceling image preview
  const handleCancelImagePreview = (index) => {
    const updatedFileNames = [...fileNames];
    const updatedFilesBase64 = [...selectedImageBase64];
    const updatedSelectedFiles = [...selectedFiles];
    updatedFileNames.splice(index, 1);
    updatedFilesBase64.splice(index, 1);
    updatedSelectedFiles.splice(index, 1);
    setFileNames(updatedFileNames);
    setSelectedImageBase64(updatedFilesBase64);
    setSelectedFiles(updatedSelectedFiles);
    setImagePreview([...updatedFilesBase64]); // Update imagePreview with the remaining images
    const inputElement = document.querySelector('input[type="file"][name="image"]')[index];
    if (inputElement) {
      inputElement(index).value = '';
    }
  };

  const handleclear = () => {
    setSelectedFiles([]);
    setSelectedFilesBase64([]);
    setFileNames([]);
    setSelectedImageBase64("");
    setPdfPreview(null);
    setPdfFileName("");
    setImageName("");
    setImagePreview(null)
    setForm({
      "order_number": getOrderNumber,
      "received_date": "",
      "sender_name": "",
      "sender_contact_number": "",
    });
  };

  useEffect(() => {
    let sumofQuantities = 0;
    let sumofRecQuantities = 0;
    let sumofBlnceQuantities = 0;
    if (selectedData && selectedData.length > 0) {
      selectedData.forEach((part) => {
        sumofQuantities += parseInt(part.qty, 10) || 0;
        sumofRecQuantities += parseInt(part.rec_qty, 10) || 0;
        sumofBlnceQuantities += parseInt(part.balance_qty, 10) || 0;

      });
    }
    setTotalQtyPerBoard(sumofQuantities);
    setTotalRecQty(sumofRecQuantities);
    settotalBalnceQty(sumofBlnceQuantities)
    setForm((prevForm) => ({
      ...prevForm,
      totalQuantity: sumofQuantities,
      totalRecQty: sumofRecQuantities,
      totalBlnceQty: sumofBlnceQuantities
    }));
    // if (sumofRecQuantities === 0 && totalRecQty !== 0) {
    //   setErrorDisplayed(true);
    //    toast.error("Total received quantity must not be zero.");
    // }
  }, [selectedData]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (totalRecQty === 0) {
      //setErrorDisplayed(true);
      toast.error("Total received quantity must not be zero.");
      return
    }
    const imageBase64Array = selectedImageBase64.map((base64, index) => ({
      image: base64.split(',')[1],
      image_type: 'jpg',
      file_type: fileNames[index],
    }));

    // Convert PDF to base64
    const pdfBase64 = pdfPreview ? pdfPreview.split(',')[1] : '';
    const formData = {
      order_number: form.order_number,
      sender_name: form.sender_name,
      received_date: selectedDate.toISOString().split('T')[0],
      sender_contact_number: form.sender_contact_number,
      invoice_num: form.invoice_num,
      receiver_name: form.receiver_name,
      receiver_contact: form.receiver_contact,

    };

    if (return_id && status) {
      formData.return_id = return_id
    }
    const parts =
      (selectedData) && selectedData.length > 0
        ? selectedData.map((part) => ({
          cmpt_id: part.cmpt_id,
          ctgr_id: part.ctgr_id,
          ctgr_name: part.ctgr_name,
          price: part.price,
          unit_price: part.unit_price,
          mfr_prt_num: part.mfr_prt_num,
          prdt_name: part.prdt_name,
          description: part.description,
          packaging: part.packaging,
          qty: part.qty,
          received_qty: part.rec_qty,
          manufacturer: part.manufacturer,
          department: part.department
        }))
        : [];
    // console.log("partsssssssssss", parts)
    // const documents = fileNames.map((fileName, index) => ({
    //   invoice: selectedFilesBase64[index],
    //   invoice_photo: selectedImageBase64.split(',')[1],
    //   image_type: "jpg",
    //   file_type: "pdf"
    // }));
    const requestBody = {
      ...formData,
      parts,
      documents: {
        invoice: pdfBase64,
        file_type: "pdf"
      },
      images: imageBase64Array,
    };

    console.log(requestBody, "requestBody requestBody");
    const response = await dispatch(createPoDetailsGateEntry(requestBody))
  
    if (response.payload?.statusCode === 200) {
      handleclear();
      setTimeout(() => {
        if (return_id && status) {
          let path = `/cpodetails?tab=inwardcategoryinfo`;
          navigate(path, { state: OrderNo })
        }
        else {
          navigate(-1);
        }
        // navigate("/cpodetails?tab=inwardcategoryinfo")
  
      }, 2000);
    }
   
  }

  useEffect(() => {
    if (getPoDetailsData) {
      const tableParts = Object.values(getPoDetailsData?.parts || {})
      // console.log("tablePartstableParts", tableParts)
      setSelectedProducts([...tableParts]);
    }
  }, [getPoDetailsData]);
  const [errorDisplayed, setErrorDisplayed] = useState(false);

  const handleQtyPerBoardChange = (newValue, index, part) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        // parseInt(newValue, 10) !== 0 &&
        // parseInt(newValue, 10) >= 1  &&
        parseInt(newValue, 10) <= part.balance_qty
      )
    ) {
      setErrorDisplayed(false);
      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[index] = {
          ...updatedSelectedData[index],
          rec_qty: newValue === "" ? "" : parseInt(newValue, 10).toString(),
        };
        return updatedSelectedData;
      });
    } else {
      if (!errorDisplayed) {
        toast.error("quantity should not be more than balance");
        setErrorDisplayed(true);
        setSelectedProducts((prevSelectedData) => {
          const updatedSelectedData = [...prevSelectedData];
          updatedSelectedData[index] = {
            ...updatedSelectedData[index],
            rec_qty: "",
          };
          return updatedSelectedData;
        });
      }
    }
    console.log(newValue, "quantityyyyyy");
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  // useEffect(() => {
  //   if(getPoDetailsData?.body){
  //     const detailsData = getPoDetailsData?.body
  //     setForm({
  //       sender_name: detailsData?.vendor_poc_name,
  //     })
  //   }
    
  // })
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
        transition={Zoom} />
      <div className="wrap">
        <div className="d-flex  mt-3">
          <h1 className="title-tag"><img
            src={arw}
            alt=""
            className="me-3 "
            onClick={handleBackNavigation}
          /> {String.gate_entry}</h1>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            <h3 className='inner-tag'>{String.order_details_text} </h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.order_num_text}</Form.Label>
                  <Form.Control type="text" placeholder="" name="order_number" value={form.order_number} onChange={onUpdateField} maxLength={30} required={true} disabled />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.received_data_text}</Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    name="received_date"
                    className="form-control"
                    onFocus={(e) => e.target.readOnly = true}
                    // maxDate={new Date()}
                    // minDate={new Date(date)}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.sender_name}</Form.Label>
                  <Form.Control type="text" placeholder="" name="sender_name" value={form.sender_name} onChange={onUpdateField} maxLength={30} required  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.sender_contact_number}</Form.Label>
                  <Form.Control type="text"
                    name="sender_contact_number"
                    value={form.sender_contact_number}
                    onChange={onUpdateFieldPhoneNumber}                   
                    minLength={10}
                    required />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.invoice_number}</Form.Label>
                  <Form.Control type="text" placeholder="" name="invoice_num" value={form.invoice_num} onChange={onUpdateField}  required={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver Name</Form.Label>
                  <Form.Control type="text" placeholder="" name="receiver_name" value={form.receiver_name} onChange={onUpdateField} maxLength={30} required={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver Contact</Form.Label>
                  <Form.Control type="text" placeholder="" name="receiver_contact" value={form.receiver_contact?.replace(/\D/g, "")} onChange={onUpdateField}  pattern="[0-9]*" minLength={10} required={true} />
                </Form.Group>
              </Col>
            </Row>
            <Row>

              <Col xs={12} md={3}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label className="mt-3 mt-md-0">{String.upload_invoice}</Form.Label>
                  <div class="upload-btn-wrapper">
                    {pdfPreview ? (
                      <>
                        <img
                          style={{ maxwidth: "100px", maxHeight: "100px" }}
                          src={pdfImage}
                          alt="pdf preview"
                        />
                        <span
                          className="close cursor-pointer"
                          onClick={handleCancelPdfPreview}
                        >
                          &times;
                        </span>
                      </>
                    ) : (
                      <>
                        <img src={Upload} alt="" />
                        <input
                          type="file"
                          name="data_sheet"
                          accept="application/pdf"
                          onChange={handlePdfChange}
                        // required={true}
                        />
                      </>
                    )}
                  </div>
                  <div>{pdfFileName && <p className="uploadimg-tag">{pdfFileName}</p>}</div>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label>{String.upload_photo}</Form.Label>
                  <div className="upload-btn-wrapper position-relative" >
                    <div className="preview-container">
                      <img src={Upload} alt="" />
                      <input
                        tabIndex={0}
                        type="file"
                        name="image"
                        accept="image/jpeg"
                        onChange={handleImageChange}                        
                        multiple
                      />

                    </div>
                  </div>
                  {/* <div>{imageName && <p className="uploadimg-tag">{imageName}</p>}</div> */}
                </Form.Group>
              </Col>


              {imagePreview && imagePreview.length > 0 ? (
                imagePreview.map((preview, index) => (
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-0 position-relative">
                      <Form.Label>&nbsp;</Form.Label>
                      <div className="upload-btn-wrapper position-relative" key={index}>
                        <div className="preview-container">
                          <img
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                            src={preview}
                            alt={`img-preview-${index}`}
                          />
                          <span
                            className="close cursor-pointer"
                            onClick={() => handleCancelImagePreview(index)}
                          >
                            &times;
                          </span>

                        </div>
                      </div>
                    </Form.Group>
                    <p className="uploadimg-tag">{fileNames[index]}</p>
                  </Col>
                ))
              ) : (
                null
              )}

            </Row>

            <div className="table-responsive mt-4">
              <Table className="bg-header">
                <thead>
                  <tr>
                    <th>{gateEntryTable?.sNo}</th>
                    <th>{gateEntryTable?.partNo}</th>
                    <th>{gateEntryTable?.partName}</th>
                    <th>{gateEntryTable?.manufacturer}</th>
                    <th>{gateEntryTable?.description}</th>
                    {/* <th>{gateEntryTable?.packaging}</th> */}
                    <th>Ordered Quantity</th>
                    <th>Balance Quantity</th>
                    <th>Received Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData && selectedData.map((part, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{part.mfr_prt_num}</td>
                      <td>{part.prdt_name}</td>
                      <td>{part.manufacturer}</td>
                      <td>{part.description}</td>
                      {/* <td>{part.packaging}</td> */}
                      <td>{part.qty}</td>
                      <td>{part.balance_qty}</td>
                      <td>
                        <input
                          type="text"
                          className="input-50"
                          // value={part.qty}
                          onInput={(e) => {
                            e.target.value =
                              e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                          }}
                          onChange={(e) =>
                            handleQtyPerBoardChange(
                              e.target.value,
                              index,
                              part
                            )
                          }
                          onKeyUp={(e) => {
                            if (errorDisplayed) {
                              e.target.value = "";                             

                            }
                          }} 
                          onKeyDown={(e) => {
                            if (errorDisplayed) {
                              e.target.value = ""; 
                              setTotalRecQty(0) 
                            }
                          }} 
                                             
                          required
                        />
                      </td>
                    </tr>
                  ))}
                  {(!selectedData || selectedData.length === 0) && (
                    <tr>
                      <td colSpan="9" className="text-center">{tableContent?.nodata}</td>
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
                    <td>{totalQtyPerBoard}</td>
                    <td>{totalBalnceQty}</td>
                    <td>{totalRecQty}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button type="button" className="me-3 cancel" onClick={() => navigate(-1)}>
              {String.cancel_btn}
            </Button>
            <Button type="submit" className="submit">
              {String.mark_as_received_btn}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">{String.Loading_text}</span>
          </Spinner>
        </div>
      )}
    </>
  );
};

export default GateEntry;