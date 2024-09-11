import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import "react-toastify/ReactToastify.min.css";
import { Form, Table } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import { Spinner } from "react-bootstrap";
import {toast, ToastContainer, Zoom } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pdfImage from "../../../assets/Images/pdf.svg"
import { String } from "../../../resources/Strings";
import { useDispatch, useSelector } from "react-redux";
import { poGateEnteryCardDetails, SavePoGateEntery, selectGetPoCardInnerDetails, selectLoadingState } from "../slice/SalesSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { name } from "@azure/msal-browser/dist/packageMetadata";
import attahment from "../../../assets/Images/attachment.svg";
import GateEntry from "../../purchaseorders/pages/GateEntry";
import { MdDelete } from "react-icons/md";
import { useRef } from "react";

const GateEnteryInnerDetailsList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const fileInputRef = useRef(null)
    console.log(fileInputRef)
    const gateEnteryDetails = useSelector(selectGetPoCardInnerDetails);
    const isLoading = useSelector(selectLoadingState);
    const gateEnteryMainDetails = gateEnteryDetails?.body;
    // console.log(gateEnteryMainDetails, "==========================")
    // console.log(Object.keys(gateEnteryMainDetails?.parts || {}))
    const Tab = location?.state;

    const [orderQuantity,setorderQuantity] = useState(0)
    const [Selectbtn,setSelectbtn] = useState("")
    console.log(Selectbtn)
    const [balanceQuantity,setBalanceQuantity] = useState(0)
    const [getGateEntery , setGateEntery] = useState({})
    // console.log(getGateEntery)
    const [selectedFiles1, setSelectedFiles1] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    // console.log(selectedFiles)
    const [imagePreview, setImagePreview] = useState([]);
    const [base64Images, setBase64Images] = useState([]);  // Store base64 strings for display
   const [totalAmount , setTotalAmount] = useState()
  //  console.log(totalAmount)


    const [uploadFiles, setUpload] = useState("")
   


const handleBackNavigation = () => {
            navigate(-1)
}

const [allDetails,setAllDetails] = useState("")
// console.log(allDetails)

const handlechange = (e) => {
const {name,value} = e.target
setGateEntery((prevesvalue) => ({
  ...prevesvalue,
  [name] : value
}))

}

// const [inputValueChange,setInputValueChange] = useState(0)
// const [RecivedQuantiy,setRecivedQuantiy] = useState({
//     parts: []
// })
// console.log(getGateEntery)



const handleInputValue = (e, key , balance) => {
  const {value} = e.target;
  const recivedQty = value === "" ? 0 : parseInt(value, 10);

  if( recivedQty <= balance  && recivedQty  >= 0){
    // const newValue = e.target.value;
    // Update the specific part's pass_qty in the parts object
    setGateEntery((prevDetails) => ({
        ...prevDetails,
        parts: {
            ...prevDetails.parts,
            [key]: { 
                ...prevDetails.parts[key], 
                "received_qty": recivedQty // Add the pass_qty field or update it
            }
        }
    }));
  }
  else{
    toast.error("recived qty must be less then balance qty")
  }

  
}

const [totalReceivedQty, setTotalReceivedQty] = useState(0);

useEffect(() => {
  setTotalReceivedQty(
    Object.values(getGateEntery?.parts || {}).reduce(
      (acc, part) => acc + parseInt(part.received_qty || 0, 10),
      0
    )
  );
}, [getGateEntery]);
console.log(totalReceivedQty)

 


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
            else if (file.size > 2 * 1024 * 1024) { // Check if file size is greater than 2MB
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


  function showToast(message) {
    toast.error(message);
  }

  // const readAsDataURLAsync = async (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => resolve(e.target.result);
  //     reader.onerror = (e) => reject(e.target.error);
  //     reader.readAsDataURL(file);
  //   });
  // };

   const [images, setImages] = useState([]); // Store the image files
  // const [base64Images, setBase64Images] = useState([]); // Store base64 strings for display

  const handleImageChange = (e) => {
    const files = e.target.files;
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
      "image/tiff",
      "image/x-icon",
    ];

    const invalidFile = Array.from(files).some(
      (file) => !validImageTypes.includes(file.type)
    );

    // If any invalid file is detected, show toast and reset the file input
    if (invalidFile) {
      toast.error("Please Select JPG image file.");
      fileInputRef.current.value = ""; // Clear the file input
      return; // Prevent further processing of files
    }

    // Loop through the selected files and add valid ones to state
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Base64 without the prefix

        setBase64Images((prevImages) => [
          ...prevImages,
          {
            base64: base64String, // Base64 string
            name: file.name, // File name
            type: file.type, // File type
            url: reader.result, // Complete base64 URL (for preview)
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (index) => {
    setBase64Images((prevImages) => prevImages.filter((_, i) => i !== index));

    // Clear the file input field if all images are deleted
    if (base64Images.length === 1) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };


  // const handleImageChange = async (e) => {
  //   const imageFiles = e.target.files;
  //   const newFileNames = [];
  //   const newFilesBase64 = [];
  //   let invalidFileSize = false;

  //   for (let i = 0; i < imageFiles.length; i++) {
  //     const imageFile = imageFiles[i];
  //     if (imageFile.size > 200 * 1024) { // Check if size is more than 200KB
  //       invalidFileSize = true;
  //       showToast("Image size should not exceed 200KB");
  //       return; // Skip processing this file
  //     }
  //     if (imageFile.type === 'image/jpeg') {
  //       if (fileNames.includes(imageFile.name)) {
  //         showToast("Duplicate images not allowed");
  //         return; // Skip processing this file
  //       }
  //       newFileNames.push(imageFile.name);
  //       let blob = await readAsDataURLAsync(imageFiles[i]);
  //       newFilesBase64.push(blob);

  //     } else {
  //       showToast(String.please_select_jpg);
  //     }
  //   }
  //   if (invalidFileSize) {      
  //     e.target.value = ""; // Reset the input value
  //   }
  //   setSelectedFiles([...selectedFiles, ...imageFiles]);
  //   setFileNames([...fileNames, ...newFileNames]);
  //   setImagePreview([...imagePreview, ...newFilesBase64]);
  //   // console.log(newFilesBase64)
  //   setBase64Images([...base64Images, ...newFilesBase64]);
    
  // };

  // Function to handle image deletion
  // const handleCancelImagePreview = (index) => {
  //   const updatedFileNames = [...fileNames];
  //   const updatedFilesBase64 = [...base64Images];
  //   const updatedSelectedFiles = [...selectedFiles];
  //   updatedFileNames.splice(index, 1);
  //   updatedFilesBase64.splice(index, 1);
  //   updatedSelectedFiles.splice(index, 1);
  //   setFileNames(updatedFileNames);
  //   setBase64Images(updatedFilesBase64);
  //   setSelectedFiles(updatedSelectedFiles);
  //   setImagePreview([...updatedFilesBase64]); // Update imagePreview with the remaining images
  //   const inputElement = document.querySelector('input[type="file"][name="image"]') ;
  //   console.log(inputElement)
  //   if (inputElement) {
  //     inputElement(index).value = '';
  //   }
  // };


const onFormSubmit = async (e) => {
    e.preventDefault();
    const all_documnets = selectedFilesBase64?.flatMap((base64, index) => ({
            "doc_name": fileNames[index],
            "doc_body": base64
    }))
    // console.log(JSON.stringify(all_documnets, null, 2))

    const base64Data = base64Images.map((image) => ({
      doc_body: image.base64, // Key 'k' for base64 string
      // doc_name: image.name, // Key 'y' for image name
      doc_name: image.type, // Key 't' for image type
    }));
      // console.log(imageBase64Array)


    //   const parts = (getGateEntery?.parts) &&
    //     getGateEntery?.parts?.map((part) => ({
    //       cmpt_id: part.cmpt_id,
    //       ctgr_id: part.ctgr_id,
    //       ctgr_name: part.ctgr_name,
    //       price: part.price,
    //       unit_price: part.unit_price,
    //       mfr_prt_num: part.mfr_prt_num,
    //       prdt_name: part.prdt_name,
    //       description: part.description,
    //       packaging: part.packaging,
    //       qty: part.qty,
    //       received_qty: part.received_qty,
    //       manufacturer: part.manufacturer,
    //       department: part.department
    //     }));
    //     console.log(parts)

    const partsCon = Object.values(getGateEntery?.parts);
        

    const reqUpdate = {
      ...getGateEntery,
       "documents" : all_documnets,
     "parts"  : partsCon,
     "images" : base64Data,
     "total_amount" : totalAmount,
     "total_ordered_quantity" : orderQuantity,
     "total_received_quantity" : totalReceivedQty
 }
     if (Selectbtn === "MarkasRead"){
      const response = await dispatch(SavePoGateEntery(reqUpdate))

      if(response.payload?.statusCode === 200){
        setTimeout(() => {
         navigate(-1)
        }, 2000);
     }
 
     }
    
    
   
    else if(Selectbtn === "Cancle"){
      setTimeout(() => {
        navigate(-1) 
      }, 2000);
    }
}

// useEffect(() => {
//     if(gateEnteryMainDetails){
//         const tableParts = Object.values(gateEnteryMainDetails?.parts || {})
//       console.log("tablePartstableParts", tableParts)
//       setTableData([...tableParts]);
//     }
// },[gateEnteryMainDetails])

let totalQuantity = 0
let totalBalanceQuantity = 0

useEffect(() => {
    if(gateEnteryMainDetails?.parts && typeof gateEnteryMainDetails?.parts === 'object' ){
        Object.keys(gateEnteryMainDetails?.parts).forEach(key => {
           totalQuantity += parseInt(gateEnteryMainDetails?.parts[key].qty)
            setorderQuantity(totalQuantity)
        })
    }
    if(gateEnteryMainDetails?.parts && typeof gateEnteryMainDetails?.parts === 'object' ){
      Object.keys(gateEnteryMainDetails?.parts).forEach(key => {
          totalBalanceQuantity += parseInt(gateEnteryMainDetails?.parts[key].balance_qty)
          setBalanceQuantity(totalBalanceQuantity)
      })
  }
//   if(getGateEntery?.parts && typeof getGateEntery?.parts === 'object' ){
//   Object.values(getGateEntery?.parts).reduce((acc, part) => {
//     const total = acc + (parseInt(part.received_qty) || 0);
//     setTotalAmount(total);
//   }, 0);
// }
   
},[getGateEntery])


useEffect(() => {
  const request = {
       "env_type" : "Development",
       "po_id" : Tab
       }

   dispatch(poGateEnteryCardDetails(request))
},[dispatch, Tab])

    useEffect(() => {
         setGateEntery(gateEnteryMainDetails);
    },[gateEnteryDetails])

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
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.order_num_text}</Form.Label>
                  <Form.Control type="text" placeholder="" name="order_id" value={getGateEntery?.order_id}  onChange={handlechange} maxLength={30} required={true} disabled />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.received_data_text}</Form.Label>
                  <Form.Control
                     type="date"
                    name="received_date"
                     placeholder="YYYY-MM-DD"
                      value={getGateEntery?.received_date}
                     onChange={handlechange}
                     required
                    />

                  {/* <DatePicker
                    // selected={selectedDate}
                    onChange={handlechange}
                    dateFormat="yyyy-MM-dd"
                    name="received_date"
                    className="form-control"
                    // onFocus={(e) => e.target.readOnly = true}
                    // maxDate={new Date()}
                    // minDate={new Date(date)}
                    value={getGateEntery?.order_date}
                  /> */}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.sender_name}</Form.Label>
                  <Form.Control type="text" placeholder="" name="vendor_poc_name" onChange={handlechange} value= {getGateEntery?.vendor_poc_name} maxLength={30} required  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.sender_contact_number}</Form.Label>
                  <Form.Control type="text"
                    name="vendor_poc_contact_num"
                    value={getGateEntery?.vendor_poc_contact_num}
                    // onChange={onUpdateFieldPhoneNumber} 
                    onChange={handlechange}                   
                    minLength={10}
                    required />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{String.invoice_number}</Form.Label>
                  <Form.Control type="text" placeholder="" name="invoice_num" onChange={handlechange}  value={getGateEntery?.invoice_num}   required={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver Name</Form.Label>
                  <Form.Control type="text" placeholder="" name="receiver" onChange={handlechange} value={getGateEntery?.receiver}  maxLength={50} required={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver Contact</Form.Label>
                  <Form.Control type="text" placeholder="" name="receiver_contact" value={getGateEntery?.receiver_contact} onChange={handlechange}   pattern="[0-9]*" minLength={10} required={true} />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
            <Form.Group className="mb-4">
            <Form.Label>Partner Name</Form.Label>
            <Form.Control type="text" placeholder="" name="partner_name" onChange={handlechange} value={getGateEntery?.partner_name}  maxLength={30} required={true} />
            </Form.Group>
            </Col>
          
            {/* <Col xs={12} md={3}>
            <Form.Group className="mb-3">
            <Form.Label>Partner Name</Form.Label>
            <Form.Control type="text" placeholder="" name="receiver_name" onChange={handlechange} value={gateEnteryMainDetails?.partner_name}  maxLength={30} required={true} />
            </Form.Group>
            </Col> */}
            <Col xs={12} md={4}>
            <Form.Group className="mb-3">
            <Form.Label>Tracking Id</Form.Label>
            <Form.Control type="text" placeholder="" name="tracking_id" onChange={handlechange} value={getGateEntery?.tracking_id}  maxLength={30} required={true} />
            </Form.Group>
            </Col>
            </Row>


            
            <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                      <Form.Label>Upload Invoice</Form.Label>
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
                    <Col>
                      <Form.Group className="mb-4">
                        <div>
                          <Form.Label>Upload Box Photo</Form.Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                             ref={fileInputRef} // Attach the ref to the file input
                             required
                          />

                          <div style={{ marginTop: "20px" }}>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                              {base64Images.map((item, index) => (
                                <div key={index} style={{ margin: "10px" }}>
                                  <img
                                    src={item.url}
                                    alt={`uploaded-${index}`}
                                    style={{ width: "100px", height: "100px" }}
                                  />
                                  <br />
                                  <span>{item.name}</span>
                                  <br />
                                  <MdDelete onClick={() => handleDelete(index)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Form.Group>
                      {/* Button to trigger form submission */}
                      {/* <button onClick={handleSubmit}>Submit Images</button> */}
                    </Col>
                    {/* <ToastContainer /> */}
                  </Row>
                {/* <Row>
              <Col xs={12} md={9}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label>{String.upload_photo}</Form.Label>
                  <div className="upload-btn-wrapper position-relative" >
                    <div className="preview-container">
                      <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                <div
                    style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "20px",
                    }}
                >
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
                </div>
                </div>
                </div>
                </Form.Group>
            </Col>
                 
               

            </Row> */}

            <div className="table-responsive mt-4">
              <Table className="bg-header">
                <thead>
                    <tr>
                        <th>
                            SL.NO
                        </th>
                        <th>
                            Part No
                        </th>
                        <th>
                           Part Name
                        </th>
                        <th>
                            Manufacturer
                        </th>
                        <th>
                            Description
                        </th>
                        <th>
                            Ordered Quantity
                        </th>
                        <th>
                            Balance Quantity
                        </th>
                        <th>
                            Received Quantity
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(getGateEntery?.parts || {}).map((item,index) => {
                        const details = getGateEntery?.parts[item];
                        const balanceQty = parseInt(details?.balance_qty)
                        return(
                        <tr key={index}>
                            <td>
                                {index + 1}
                            </td>
                            <td>
                               {details?.mfr_prt_num} 
                            </td>
                            <td>
                                {details?.prdt_name}
                            </td>
                            <td>
                                {details?.manufacturer}
                            </td>
                            <td>
                                {details?.description}
                            </td>
                            <td>
                                {details?.qty}
                            </td>
                            <td>
                            {balanceQty}
                            </td>
                            <td>
                                <input
                                name="received_qty"
                                    type="number"
                                      // value={getGateEntery?.parts[item] || ''}
                                    onChange={(e) => handleInputValue(e, item, balanceQty)}
                                />
                            </td>

                        </tr>

                    )})
                    
                    }
                </tbody>
                <tfoot>
                  <tr className="border-top">
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{orderQuantity}</td>
                    <td>{balanceQuantity}</td>
                    <td>{totalReceivedQty}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button type="submit" className="me-3 cancel"  onClick={() => setSelectbtn("Cancle")}>
              {String.cancel_btn}
            </Button>
            <Button type="submit" onClick={() => setSelectbtn('MarkasRead')} className="submit" >Mark as Received</Button>
            {/* <Button type="submit" className="submit">
              {String.mark_as_received_btn}
            </Button> */}
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
  )
}

export default GateEnteryInnerDetailsList
