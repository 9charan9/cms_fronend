import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import Table from "react-bootstrap/Table";
import "react-toastify/ReactToastify.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCreatedEditPo, selectLoadingStatus, getstatusofpo, selectEditPoDetails, setStatusUpdate, updateCreatedPoDetails } from "../slice/PurchaseOrderSlice";
import { Spinner } from "react-bootstrap";
import { selectLoadingState } from "../../bom/slice/BomSlice";
import { ToastContainer, Zoom } from 'react-toastify';
import { toast } from 'react-toastify';
import attahment from "../../../assets/Images/attachment.svg"

const EditPurchaseOrder = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const navigate = useNavigate();
  const getPoDetails = useSelector(selectEditPoDetails);
  const getPurchaseEditDetails = getPoDetails?.body;
  console.log(getPurchaseEditDetails);
  const location = useLocation();
  const state = location.state;
  const vendorId = state.vendorId;
  const orderNo = state.orderNo;
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusUpdate = useSelector(setStatusUpdate);
  const [errorInput, setErrorInput] = useState("");
  const tableData = getPurchaseEditDetails?.parts
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const isLoading = useSelector(selectLoadingState);
  const isLoadingEditData = useSelector(selectLoadingStatus);

  const [form, setForm] = useState({
    "vendor_id": "",
    "order_id": "",
    "orderDate": "",
    "terms_and_conditions": "",
    "payment_terms": "",
    "status":""
  });

  const onUpdateField = (e) => {
    const { value } = e.target;
    const nextFormState = {
      ...form,
      [e.target.name]: value,
    };
    setForm(nextFormState);
  }


  useEffect(() => {
    const request = {
      "vendor_id": vendorId,
      "order_id": orderNo
    }
    setSelectedFiles([]);
    setFileNames([]);
    dispatch(getCreatedEditPo(request))
  }, [dispatch])


  useEffect(() => {
    if (getPurchaseEditDetails !== undefined) {
      setForm({
        "vendor_id": getPurchaseEditDetails?.vendor_id,
        "order_id": getPurchaseEditDetails?.order_id,
        "orderDate": getPurchaseEditDetails?.orderDate,
        "status": getPurchaseEditDetails?.status,
        "terms_and_conditions": getPurchaseEditDetails?.termsConditions,
        "payment_terms": getPurchaseEditDetails?.paymentTerms
      })
      setSelectedFiles(getPurchaseEditDetails?.documents);
      console.log(getPurchaseEditDetails?.documents, "PDF's")
      if (Array.isArray(getPurchaseEditDetails?.documents)) {
        getPurchaseEditDetails?.documents.map((item) => {
          selectedFilesBase64.push(item.doc_body)
          fileNames.push(item.doc_name)
        })
      }
    }
  }, [getPurchaseEditDetails])

  const handleStatusChange = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
    setSelectedStatus(e.target.value)
  };
  console.log(JSON.stringify(form, null, 2))

  const onFormSubmit = async (e) => {
    e.preventDefault();
    // if(!status)
    // Extract form values
    const formData = {
      vendor_id: form.vendor_id,
      order_id: form.order_id,
      orderDate: form.orderDate,
      status: form.status,
      termsConditions: form.terms_and_conditions,
      paymentTerms: form.payment_terms,
    };

    // Extract document data
    const documents = fileNames.map((fileName, index) => ({
      doc_name: fileName,
      doc_body: selectedFilesBase64[index],
    }));

    // Extract table values (parts data)
    const parts =
      Array.isArray(tableData) && tableData.length > 0
        ? tableData.map((vendor) => ({
          ptg_part_number: vendor.ptg_part_number,
          part_name: vendor.partName,
          manufacturer: vendor.manufacturer,
          description: vendor.description,
          packaging: vendor.packaging,
          quantity: vendor.quantity,
          price: vendor.price,
          price_per_piece: vendor.pricePerPiece,
          total_price: vendor.total_price,
        }))
        : [];

    // Combine all data into requestBody
    const requestBody = {
      ...formData,
      parts,
      documents,
      //  ...buildObject(selectedData, "part"),
      // ...buildObject(selectedFilesBase64, "document")
    };

    console.log(JSON.stringify(requestBody, null, 2));
    dispatch(updateCreatedPoDetails(requestBody));
    // navigate(-1);
  };



  useEffect(() => {
    // Calculating the total quantity of items & price
    let sumofQuantities = 0;
    let sumofPrice = 0;
    if (Array.isArray(tableData) && tableData.length > 0) {
      tableData.forEach((vendor) => {
        sumofQuantities += parseInt(vendor.quantity, 10) || 0;
        sumofPrice += parseFloat(vendor.price) || 0;
      });
    }
    setTotalQuantity(sumofQuantities);
    setTotalPrice(sumofPrice);
    setForm((prevForm) => ({
      ...prevForm,
      totalQuantity: sumofQuantities,
      totalPrice: sumofPrice,
    }));
  }, [tableData]);


  useEffect(() => {
    dispatch(getstatusofpo())
  }, [])
  
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
    if(!hasDuplicateFile){
    e.target.value = "";
    }

    setSelectedFiles(newFiles);
    setFileNames(newFileNames);
    setSelectedFilesBase64(newFilesBase64);
};
  console.log(selectedFilesBase64);
  const removeattachment = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
    const updateFileName = fileNames.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setSelectedFilesBase64(updatedFilesBase64);
    setFileNames(updateFileName);
    console.log(updateFileName)
  }


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
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => navigate(-1)}
            />
            Edit Purchase Order
          </h1>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            <h4 className="mb-3">Order Details</h4>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">Vendor ID</Form.Label>
                  <Form.Control type="text" placeholder="" name="vendor_name" value={form.vendor_id?.trimStart()} onChange={onUpdateField} required={true} disabled />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">Ordered Number</Form.Label>
                  <Form.Control type="text" placeholder="" name="vendor_name" value={form.order_id?.trimStart()} onChange={onUpdateField} required={true} disabled />

                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">Order Date</Form.Label>
                  <Form.Control type="text" placeholder="" name="vendor_name" value={form.orderDate?.trimStart()} onChange={onUpdateField} required={true} disabled />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">Status</Form.Label>
                  {/* <Form.Select
                    value={form.status?.trimStart()}
                    onChange={handleStatusChange}
                    required={true}>
                    <option value=""></option>
                    {getStatus()}
                  </Form.Select> */}
                   <Form.Select
                    name="status"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="PO Generated">PO Generated</option>  
                    <option value="PO Issued">PO Issued</option>
                    <option value="Vendor Acknowledged">Vendor Acknowledged</option>
                      <option value="Partially Received">Partially Received</option>
                    <option value="Received">Received</option>
                    <option value="Cancel">Cancel</option>
                   
                    {/* {getStatusOptions()} */}
                  </Form.Select>
                  {errorInput && (
                    <span style={{ color: "red" }}>{errorInput}</span>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <h4 className="mb-3">Others Info</h4>
              <Col xs={18} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">
                    Terms & Conditions
                  </Form.Label>
                  <Form.Control as="textarea" rows={3} name="terms_and_conditions" value={form.terms_and_conditions?.trimStart()} onChange={onUpdateField} required={true} />
                </Form.Group>
              </Col>
              <Col xs={18} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">Payment Terms</Form.Label>
                  <Form.Control as="textarea" rows={3} name="payment_terms" value={form.payment_terms?.trimStart()} onChange={onUpdateField} required={true} />
                </Form.Group>
              </Col>
            </Row>
            <h3 className="mt-4">Documents</h3>
           
            <Row className="main-div-attach">
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="doc-header">Attach Documents</Form.Label>
                  <div>
                    <input name="doc_name"
                      type="file"
                      accept=".pdf"
                      id="upload"
                      hidden
                      multiple onChange={handlePdfChange} />
                    <label for="upload" className='cfile'> <img src={attahment} alt="" /> </label>
                  </div>
                </Form.Group>
              </Col>
              {Array.isArray(selectedFiles) && selectedFiles.map((file, index) => (
                <Col xs={12} md={3} key={index}>
                  <Form.Group>
                   
                    <div className='attachment-sec' >
                      <span className="attachment-name">{fileNames[index]}</span>
                      <span className="attachment-icon" onClick={() => removeattachment(index)}> x </span>
                    </div>
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <h5>Adding products to purchase list</h5>
            <div className="table-responsive mt-4">
              <Table className="bg-header">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Part No</th>
                    <th>Part Name</th>
                    <th>Manufacturer</th>
                    <th>Description</th>
                    {/* <th>Packaging</th> */}
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Price per piece</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(tableData) && tableData.length > 0 ? (
                    tableData?.map((vendor, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{vendor?.ptg_part_number}</td>
                        <td>{vendor?.partName}</td>
                        <td>{vendor?.manufacturer}</td>
                        <td>{vendor?.description}</td>
                        {/* <td>{vendor?.packaging}</td> */}
                        <td>{vendor?.quantity}</td>
                        <td>{vendor?.price} </td>
                        <td>{vendor?.pricePerPiece}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td colSpan="9" className="text-center">No Data Available</td>
                      </tr>
                    </>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>                    
                    <td>{totalQuantity}</td>
                    <td>{totalPrice}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="submit" >
              Update
            </Button>
          </div>
        </form>
        {(isLoading || isLoadingEditData) && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      </div>

    </>
  );
};

export default EditPurchaseOrder;
