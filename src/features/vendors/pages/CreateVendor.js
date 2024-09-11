import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import attahment from "../../../assets/Images/attachment.svg";
import "../styles/Vendors.css";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { createVendor, selectLoadingStatus } from "../slice/VendorSlice";
import "react-toastify/dist/ReactToastify.css";
import { formFieldsVendor } from "../../../utils/TableContent"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateVendor = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const [dataeditor, setDataeditor] = useState("");
  const [paymentseditor, setPaymenteditor] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [selectedPartnerTypes, setSelectedPartnerTypes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoadingStatus);
  const [form, setForm] = useState({
    type: "",
    name: "",
    vendor_location: "",
    email: "",
    contact_number: "",
    holder_name: "",
    bank_name: "",
    account_number: "",
    branch_name: "",
    ifsc_code: "",
    gst_number: "",
    partnername: "",
    address1: "",
    address2: "",
    landmark: "",
    vendor_poc_name:"",
    partner_poc_name:"",
    partner_poc_contact:"",
    vendor_poc_contact_num:"",
    ptg_poc_name: "",
    ptg_poc_contact_num:"",
    pin_code: "",
    city_name: "",
    country: "",
    state: "",
    // payments: "",
    pan_number: "",
    partner_type: [],
  });

  const removeattachment = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
    const updatedFileNames = fileNames.filter((_, i) => i !== index);
    // Update the state with the updated arrays
    setSelectedFiles(updatedFiles);
    setSelectedFilesBase64(updatedFilesBase64);
    setFileNames(updatedFileNames);
    const inputElement = document.querySelector('input[type="file"][name="upload"]');
    if (inputElement) {
      inputElement.value = '';
    }
  };

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
  const handleClearForm = () => {
    setForm({
      type: "",
      name: "",
      vendor_location: "",
      email: "",
      contact_number: "",
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      gst_number: "",
      partnername: "",
      address1: "",
      address2: "",
      landmark: "",
      ptg_poc_contact_num: "",
      ptg_poc_name: "",
      vendor_poc_name : "",
      vendor_poc_contact_num:"",
      partner_poc_name:"",
      partner_poc_contact:"",
      pin_code: "",
      city_name: "",
      country: "",
      state: "",
      terms_and_conditions:"",
      // payments: "",
      pan_number: "",
      branch_name: "",
      holder_name: "",
      partner_type: [],
    });
    setSelectedFiles([]);
    setSelectedFilesBase64([]);
    setFileNames([]);
    setSelectedPartnerTypes([]);
    setDataeditor("");
    setEditorHtml("");

  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const isPdfTooLarge = selectedFiles.some((file, index) => {
      const fileSizeInKB = file.size / 1024;
      return file.type === "application/pdf" && fileSizeInKB > 300;
    });

    if (isPdfTooLarge) {
      toast.error("One or more PDF documents exceed the maximum size of 300 KB.");
      return;
    }

    // Custom validation for required fields
    const requiredFields = [     
      "partner_type",    
    ];
    console.log(requiredFields)
    const missingFields = requiredFields.filter((field) => {
      // Check if the field is an array and is empty
      if (Array.isArray(form[field])) {
        return form[field].length === 0;
      }
      return !form[field];
    });
    if (missingFields.length > 0 && selectedOption === "Partners") {
      toast.error(
        `Please Select  ${missingFields.join(", ")}`
      );
      return;
    }
    else {
      const documents = fileNames.map((fileName, index) => ({
        document_name: fileName,
        content: selectedFilesBase64[index],
      }));
      const bank_info = {
        holder_name: form.holder_name,
        bank_name: form.bank_name,
        account_number: form.account_number,
        ifsc_code: form.ifsc_code,
        branch_name: form.branch_name,
      };

      const requestBody = {
        ...form,
        payments : editorHtml,
        terms_and_conditions: form.terms_and_conditions,
        bank_info,
        documents,
      };

      console.log("vendors==> " + JSON.stringify(requestBody, null, 2));
      const response = await dispatch(createVendor(requestBody));

      if (response.payload?.statusCode === 200) {
      setFilteredData([]);
      setSelectedProducts([]);
      setSelectedFiles([]);
      setSelectedFilesBase64([]);
      setFileNames([]);
      setSelectedPartnerTypes([]); 
      setSelectedOption("");    
      handleClearForm();
    }
      
     }
  };
  const onUpdateField = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target);
    const trimmedValue = value.trimStart();
    if (type === "radio") {
      // const updatedPartnerTypes = [...selectedPartnerTypes];
      // if (checked) {
      //   updatedPartnerTypes.push(trimmedValue);
      // } else {
      //   const index = updatedPartnerTypes.indexOf(trimmedValue);
      //   if (index !== -1) {
      //     updatedPartnerTypes.splice(index, 1);
      //   }
      // }
      setForm((prevForm) => ({
        ...prevForm,
        [name]: [value],
      }));

      // setSelectedPartnerTypes(updatedPartnerTypes);
    } else {
      const nextFormState = {
        ...form,
        [name]: trimmedValue,
      };
      setForm(nextFormState);
    }
  };

  console.log(JSON.stringify(form, null, 2))

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    const selectedValue = e.target.value;
    const type = selectedValue;

    // handleClearForm();
    setForm((prevForm) => ({
      ...prevForm,
      vendor_type: type,
      [e.target.name]: selectedValue,
    }));
    setSelectedPartnerTypes([]);
  };

  useEffect(() => {
    setSelectedProducts([]);
  }, []);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const handleChange = (html) => {
    setEditorHtml(html);
  };
  const modules = {
    toolbar: [     
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
      ['clean']
    ],
  };

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
      <div className="wrap">
        <div className="d-flex justify-content-between">
          {selectedOption === "Partners" ? (
            <h2 className="title-tag">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {formFieldsVendor.createFormHeaderP}
            </h2>
          ) : (
            <h2 className="title-tag">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {formFieldsVendor.createFormHeaderV}
            </h2>
          )}
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            {selectedOption === "Partners" ? (
              <h4 className="inner-tag">{formFieldsVendor.FormSubHeaderP}</h4>
            ) : (
              <h4 className="inner-tag">{formFieldsVendor.FormSubHeaderV}</h4>
            )}
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.vendorType}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Select
                    type="text"
                    placeholder=""
                    name="type"
                    value={form.type}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">{formFieldsVendor.selectVendor}</option>
                    <option value="Mechanic">{formFieldsVendor.mCat}</option>
                    <option value="Electronic">{formFieldsVendor.eCat}</option>                   
                    <option value="Partners">{formFieldsVendor.partnersCat}</option>
                     {/* <option value="Mec&Ele">{formFieldsVendor.emCat}</option> */}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  {selectedOption === "Partners" ? (
                    <Form.Label>{formFieldsVendor.partnerName}
                    <span className="red-asterisk">*</span></Form.Label>
                  ) : (
                    <Form.Label>{formFieldsVendor.vendorName}
                    <span className="red-asterisk">*</span></Form.Label>
                  )}
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="name"
                    value={form.name}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.contactnum}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="contact_number"
                    //pattern="[0-9]*"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.contact_number}
                    // minLength={10}
                    // maxLength={10}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.email}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="email"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.email}
                    onChange={onUpdateField}
                    required                    
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.email}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="email"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.email}
                    onChange={onUpdateField}
                    required                    
                  />
                </Form.Group>
              </Col> */}
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.address1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="address1"
                    value={form.address1}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.address2}</Form.Label>
                  <Form.Control
                    type="address"
                    placeholder=""
                    name="address2"
                    value={form.address2}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.landmark}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="landmark"
                    value={form.landmark}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.cityName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="city_name"
                    value={form.city_name}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.cityName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="city_name"
                    value={form.city_name}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col> */}
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.pinCode}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="pin_code"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.pin_code}                  
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.state}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="state"
                    value={form.state}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.country}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="country"
                    value={form.country}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>   
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.gstNumber}
                  <span className="red-asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="gst_number"
                    value={form.gst_number?.replace(/[^a-zA-Z0-9]/g, "")}
                    // minLength={15}
                    maxLength={15}
                    onChange={onUpdateField}
                    // required
                  />
                </Form.Group>
              </Col>          
            </Row>

            <Row>
            {/* <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.gstNumber}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="gst_number"
                    value={form.gst_number?.replace(/[^a-zA-Z0-9]/g, "")}
                    // minLength={15}
                    maxLength={15}
                    onChange={onUpdateField}
                    // required
                  />
                </Form.Group>
              </Col> */}
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.panNumber}
                  <span className="red-asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="pan_number"
                    // value={form.pan_number}
                    value={form.pan_number?.replace(/[^a-zA-Z0-9]/g, "")}
                    maxLength={10}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              {selectedOption === "Partners" ? (
                <Col xs={18} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{formFieldsVendor.partnerType}
                    <span className="red-asterisk">*</span></Form.Label>
                    <label>
                      &nbsp;
                      <input
                        type="radio"
                        id="EMS"
                        name="partner_type"
                        value="EMS"
                        onChange={onUpdateField}
                      />
                      <span className="textfont_type" for="EMS">&nbsp;{formFieldsVendor.ems}</span>
                    </label>
                    <label>
                      &nbsp;
                      <input
                        id="BOX BUILDING"
                        type="radio" 
                        name="partner_type"
                        value="BOX BUILDING"
                        onChange={onUpdateField}
                      />
                      <span className="textfont_type" for="BOX BUILDING">&nbsp;{formFieldsVendor.boxBuilding}</span>
                    </label>
                  </Form.Group>
                </Col>                             
              ) : (
                <></>
              )}
            </Row>

            <h3 className="inner-tag mt-4">{formFieldsVendor.contactInfo}</h3>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                {selectedOption === "Partners" ? (
                  <>
                  <Form.Label>Partner POC Name
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="partner_poc_name"
                    value={form.partner_poc_name}
                    onChange={onUpdateField}
                    required
                  /> </>) : (<>
                  <Form.Label>{formFieldsVendor.vendorPointofContactName}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="vendor_poc_name"
                    value={form.vendor_poc_name}
                    onChange={onUpdateField}
                    required
                  />
                  </>)}
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  {selectedOption === "Partners" ? (
                    <>
                    <Form.Label>Partner POC Contact Number
                    <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="partner_poc_contact"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.partner_poc_contact}
                    onChange={onUpdateField}
                    required
                  /> </>) : (  <>
                    <Form.Label>{formFieldsVendor.vendorPointofContactNum}
                    <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="vendor_poc_contact_num"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.vendor_poc_contact_num}
                    // minLength={10}
                    // maxLength={10}
                    onChange={onUpdateField}
                    required
                  /> </>)}
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.pointofContactName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="ptg_poc_name"
                    value={form.ptg_poc_name}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.pointofContactNum}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="ptg_poc_contact_num"
                    // pattern="[0-9]*"
                    // value={form.reciever_contact?.replace(/\D/g, "")}
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.ptg_poc_contact_num}
                    onChange={onUpdateField}
                    // minLength={10}
                    // maxLength={10}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h3 className="inner-tag mt-4">{formFieldsVendor.bankInfo}</h3>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Name
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="holder_name"
                    value={form.holder_name}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.bankName}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="bank_name"
                    value={form.bank_name.replace(/^[ ]+/, "")}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.ACnum}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="account_number"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.account_number}
                    // maxLength={17}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.ifscCode}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="ifsc_code"
                    value={form.ifsc_code}
                    onChange={onUpdateField}
                    // maxLength={11}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.branchName}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="branch_name"
                    value={form.branch_name}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h3 className="inner-tag mt-4">{formFieldsVendor.otherInfo}</h3>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.terms}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="terms_and_conditions"
                    value={form.terms_and_conditions}
                    onChange={onUpdateField}
                    required
                  />
               
                </Form.Group>
              </Col>
              {selectedOption === "Partners" ? (
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{formFieldsVendor.payment}</Form.Label>
                    {/* <Form.Control
                      as="textarea"
                      rows={5}
                      name="payments"
                      value={form.payments}
                      onChange={onUpdateField}
                      // required
                    /> */}
                       <ReactQuill
                          theme="snow"
                          value={editorHtml}
                          modules={modules}
                          onChange={handleChange}                          
                        />
                  </Form.Group>
                </Col>
              ) : (
                <></>
              )}
            </Row>

            <h3 className="inner-tag mt-4">{formFieldsVendor.documentsTitle}</h3>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.documents}</Form.Label>
                  <div>
                    <input
                      type="file"
                      id="upload"
                      name="upload"
                      hidden
                      multiple
                      onChange={handlePdfChange}
                      accept=".pdf"
                    />
                    <label for="upload" className="cfile">
                      <img src={attahment} alt="" />
                    </label>
                  </div>
                </Form.Group>
              </Col>

              {selectedFiles.map((file, index) => (
                <Col xs={12} md={3} key={index}>
                  <Form.Group className="mb-1">
                    <Form.Label>&nbsp;</Form.Label>
                    <div className="attachment-sec">
                      <span className="attachment-name">{file.name}</span>
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
            </Row>
          </div>
          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => navigate(-1)}
            >
              {formFieldsVendor.btnCancel}
            </Button>
            <Button type="submit" className="submit">
              {formFieldsVendor.btnCreate}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">{formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}
    </>
  );
};

export default CreateVendor;
