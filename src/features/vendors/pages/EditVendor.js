import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import attahment from "../../../assets/Images/attachment.svg";
import "../styles/Vendors.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  selectSearchCategory,
  selectSearchcomponentdata,
  getSearchcomponentdata,
  selectLoadingState,
} from "../../bom/slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  getVendorEditDetails,
  selectLoadingStatus,
  selectVendorData,
  updateVendorDetails,
} from "../slice/VendorSlice";
import { formFieldsVendor } from "../../../utils/TableContent";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const EditVendor = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorHtml, setEditorHtml] = useState('');
  const [dataeditor, setDataeditor] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [vendortype, setVendortype] = useState("");
  const [activeTab, setActiveTab] = useState("M");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getVendorEditData = useSelector(selectVendorData);
  const getSearch = useSelector(selectSearchCategory);
  const getCategory = useSelector(selectSearchcomponentdata);
  const isLoading = useSelector(selectLoadingState);
  const isLoadingEditData = useSelector(selectLoadingStatus);
  const location = useLocation();
  const { vendor_id, vendor_name, type, category } = location.state;
  console.log(category)
  const data = getSearch?.body;
  const productDetails = getCategory?.body;
  const vendorEditData = getVendorEditData?.body;
  console.log(vendorEditData, "edit data fetchinggg")
  const parts = vendorEditData?.parts;
  console.log(parts)
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [form, setForm] = useState({
    vendor_type: "",
    vendor_id: "",
    vendor_name: "",
    partner_id: "",
    partner_name: "",
    email: "",
    contact_number: "",
    address1: "",
    address2: "",
    landmark: "",
    city_name: "",
    pin_code: "",
    country: "",
    holder_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    gst_number: "",
    pan_number: "",
    partner_poc_name:"",
    partner_poc_contact_num:"",
    vendor_poc_name:"",
    vendor_poc_contact_num:"",
    ptg_poc_name: "",
    ptg_poc_contact_num:"",
    state : "",
    // point_of_contact_name: "",
    // point_of_contact_number: "",
    // reciever: "",
    // reciever_contact: "",
    branch_name: "",
    documents: [],
    partner_type: [],
    // payments: "",
    state:""
  });
  const [selectedPartnerTypes, setSelectedPartnerTypes] = useState(() => {
    if (Array.isArray(form.partner_type)) {
      return form.partner_type;
    }
    return [];
  });

  const removeattachment = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
    const updateFileName = fileNames.filter((_, i) => i !== index);
    

    // Update the documents field in the form
    const updatedDocuments = form.documents.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setSelectedFilesBase64(updatedFilesBase64);
    setFileNames(updateFileName);
    const inputElement = document.querySelector('input[type="file"][name="upload"]');
    if (inputElement) {
      inputElement.value = '';
    }
    // Update the form state with the updated documents
    setForm((prevForm) => ({
      ...prevForm,
      documents: updatedDocuments,
    }));
    
  };
  const handlePdfChange = async (e) => {
    const files = e.target.files;
    const newDocuments = [];
    let isDuplicate = false; // Declare isDuplicate outside the loop

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64String = await fileToBase64String(file);
      const newDocument = {
        content: base64String,
        document_name: file.name,
      };

      // Check if the document with the same name already exists
      const isFileDuplicate = form.documents.some(
        (existingDocument) => existingDocument.name === newDocument.name
      );

      if (isFileDuplicate) {
        isDuplicate = true; // Set isDuplicate to true if any file is a duplicate
      } else {
        newDocuments.push(newDocument);
      }
    }

    if (isDuplicate) {
      toast.warning("Duplicate files are not allowed.");
      // Clear the file input value if there is a duplicate
    }
    if (!isDuplicate) {
      e.target.value = "";
    }
    setForm((prevForm) => ({
      ...prevForm,
      documents: [...prevForm.documents, ...newDocuments],
    }));
  };

  const fileToBase64String = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setButtonDisable(true)
    const requiredFields = ["partner_type"];
    const missingFields = requiredFields.filter((field) => {
      // Check if the field is an array and is empty
      // if (Array.isArray(form[field])) {
      //   return form[field].length === 0;
      // }
      // // Check if the field is falsy (handles other types like empty strings)
      // return !form[field];
    });

    if (missingFields.length > 0 && vendortype === "Partners") {
      toast.error(
        `Please Select  ${missingFields.join(", ")}`
      );
      return;
    }
    console.log("vendors==> " + JSON.stringify(form, null, 2));

    // dispatch(updateVendorDetails(requestBody));
    const requestBody = {
      ...form,
      terms_and_conditions: form.terms_and_conditions,
      payments : editorHtml,

    };
    console.log(requestBody, "ommmmmmmmmmmmmm");
    const request = await dispatch(updateVendorDetails(requestBody));
    // if (request?.payload?.statusCode === 404) {
    //   toast.error(request.payload.body);
    // }
    if (request.payload?.statusCode === 200) {
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  };
  //search add vendor components to table

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const searchData = data.map((category) => {
        if (Array.isArray(category) && category.length > 0) {
          const filteredCategory = category.filter(
            (item) =>
              typeof item === "string" &&
              item.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return filteredCategory.map((item) => [category]);
        }
        return []; // Return an empty array if the category is not an array
      });
      setFilteredData(searchData.flat());
    }
  }, [getSearch]);


  const onUpdateField = (e) => {
    const { name, value, type, checked } = e.target;
    const trimmedValue = value.trimStart();
    if (type === "checkbox") {
      // Handle checkbox updates
      const updatedPartnerTypes = [...selectedPartnerTypes];

      if (checked) {
        // Add the selected partner type as an object
        updatedPartnerTypes.push(trimmedValue);
      } else {
        // Remove the unselected partner type
        const index = updatedPartnerTypes.indexOf(e.target.value);
        if (index !== -1) {
          updatedPartnerTypes.splice(index, 1);
        }
      }

      // Update the form with the selected partner types
      setForm((prevForm) => ({
        ...prevForm,
        [name]: updatedPartnerTypes,
      }));
      setSelectedPartnerTypes(updatedPartnerTypes);
    } else {
      // Handle other field updates
      const nextFormState = {
        ...form,
        [name]: trimmedValue,
      };
      setForm(nextFormState);
    }
  };



  useEffect(() => {
    if (productDetails?.length > 0) {
      if (searchTerm.trim() === "" && searchTerm.trim()?.length == 0) {
        if (
          !selectedData.some(
            (item) =>
              item.mfr_part_number === productDetails[0]?.mfr_part_number
          )
        ) {
          const newItem = {
            ...productDetails[0],
          };
          setSelectedProducts((prevProducts) => [...prevProducts, newItem]);
        } else {
          toast.error("Already Data Added");
        }
      }
    }
  }, [productDetails]);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (vendorEditData !== undefined) {
      const nextFormState = {
        ...form,
        ...vendorEditData,
      };
      setForm(nextFormState);
      setVendortype(vendorEditData?.vendor_type);
      setDataeditor(vendorEditData?.terms_and_conditions)
      setEditorHtml(vendorEditData?.payments)
    }
  }, [vendorEditData]);
  console.log(form);

  //editor
  const handleChange = (html) => {
    setEditorHtml(html);
  };
  const modules = {
    toolbar: [     
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
      ['clean']
    ],
  };
  useEffect(() => {
    if (vendorEditData !== undefined) {
      let nestedObjectkeys;
      nestedObjectkeys = Object.keys(vendorEditData).filter((key) =>
        key.startsWith("part")
      );
      if (typeof nestedObjectkeys === "object") {
        setSelectedProducts([]);
        nestedObjectkeys.map((partkey) => {
          const part = vendorEditData[partkey];
          setSelectedProducts((prevProducts) => [...prevProducts, part]);
        });
      }
    }
  }, [vendorEditData]);

  useEffect(() => {
    setSelectedProducts([]);
    const vendorRequest = {
      vendor_name: vendor_name,
      vendor_id: vendor_id,
      type: type,
    };
    dispatch(getVendorEditDetails(vendorRequest));
  }, []);

  useEffect(() => {
    if (Array.isArray(form.partner_type) && form.partner_type.length > 0) {
      setSelectedPartnerTypes(form.partner_type);
    }
  }, [form.partner_type]);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          {vendortype === "Partners" ? (
            <h1 className="title-tag">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {formFieldsVendor.editPartner}
            </h1>) : (<h1 className="title-tag">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {formFieldsVendor.editVendor}
            </h1>)}
        </div>

        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            {vendortype === "Partners" ? (
              <h3 className="inner-tag">{formFieldsVendor.FormSubHeaderP}</h3>
            ) : (
              <h3 className="inner-tag">{formFieldsVendor.FormSubHeaderV}</h3>
            )}

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.vendorType}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Select
                    name="vendor_type"
                    value={vendortype}
                    required={true}    
                    // onChange={handleSelectChange}
                    disabled={true}       
                  >
                    <option value="Mechanic">{formFieldsVendor.mCat}</option>
                    <option value="Electronic">{formFieldsVendor.eCat}</option>
                    {/* <option value="Mec&Ele">{formFieldsVendor.emCat}</option> */}
                    <option value="Partners">{formFieldsVendor.partnersCat}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {/* <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {vendortype === "Partners" ? "Partner ID" : "Vendor ID"}{" "}
                    <span className="red-asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    disabled
                    name={vendortype === "Partners" ? "partner_id" : "vendor_id"}
                    value={
                      vendortype === "Partners"
                        ? form.partner_id?.trimStart()
                        : form.vendor_id?.trimStart()
                    }
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col> */}
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {vendortype === "Partners"
                      ? "Partners Name"
                      : "Vendor Name"}.
                      <span className="red-asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name={
                      vendortype === "Partners" ? "partner_name" : "vendor_name"
                    }
                    value={
                      vendortype === "Partners"
                        ? form.partner_name?.trimStart()
                        : form.vendor_name?.trimStart()
                    }
                    onChange={onUpdateField}
                    required={true}
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
                    // pattern="[0-9]*"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.contact_number}
                    // maxLength={10}
                    onChange={onUpdateField}
                    required={true}
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
                    value={form.email?.trimStart()}
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.address1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="address1"
                    value={form.address1?.trimStart()}
                    onChange={onUpdateField}
                    // required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.address2}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="address2"
                    value={form.address2?.trimStart()}
                    onChange={onUpdateField}
                    // required={true}
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
                    value={form.landmark?.trimStart()}
                    onChange={onUpdateField}
                    // required={true}
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
                    value={form.city_name?.trimStart()}
                    onChange={onUpdateField}
                    // required={true}
                  />
                </Form.Group>
              </Col>
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
                    // required={true}
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
                    // required
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
                    // required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
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
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.panNumber}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="pan_number"
                    value={form.pan_number?.replace(/[^a-zA-Z0-9]/g, "")}
                    maxLength={10}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>

              {vendortype === "Partners" ? (
                <Col xs={18} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{formFieldsVendor.partnerType}
                    <span className="red-asterisk">*</span></Form.Label>
                    {Array.isArray(selectedPartnerTypes) &&
                      ["EMS", "BOX BUILDING"].map((type) => (
                        <label key={type}>
                          &nbsp;
                          <input
                            type="checkbox"
                            name="partner_type"
                            value={type}
                            checked={selectedPartnerTypes.includes(type)}
                            onChange={onUpdateField} disabled
                          />
                          &nbsp;{type}
                        </label>
                      ))}
                  </Form.Group>
                </Col>
              ) : (<></>)}
            </Row>
            <h3 className="inner-tag mt-4">{formFieldsVendor.contactInfo}</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                {vendortype === "Partners" ? (<>
                  <Form.Label>Partner POC Name
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="partner_poc_name"
                    value={form.partner_poc_name}
                    onChange={onUpdateField}
                    required={true}
                  />
                  </>
                  ) : (<>
                  <Form.Label>{formFieldsVendor.vendorPointofContactName}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="vendor_poc_name"
                    value={form.vendor_poc_name}
                    onChange={onUpdateField}
                    required={true}
                  />
                  </>)}
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                {vendortype === "Partners" ? (<>
                  <Form.Label>Partner POC Contact Number
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="partner_poc_contact_num"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.partner_poc_contact_num}
                    onChange={onUpdateField}
                    required={true}
                  />
                  </>
                  ): (<>
                  <Form.Label>{formFieldsVendor.vendorPointofContactNum}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="vendor_poc_contact_num"
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.vendor_poc_contact_num}
                    onChange={onUpdateField}
                    required={true}
                  />
                  </>)}
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.pointofContactName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="ptg_poc_name"
                    value={form.ptg_poc_name?.trimStart()}
                    onChange={onUpdateField}
                    // required={true}
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
                    pattern="[0-9]*[\s\-()/]*" 
                    value={form.ptg_poc_contact_num}
                    onChange={onUpdateField}
                    // required={true}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h3 className="inner-tag mt-4">{formFieldsVendor.bankInfo}</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.holderName}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="holder_name"
                    value={form.holder_name?.trimStart()}
                    onChange={onUpdateField}
                    required={true}
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
                    value={form.bank_name?.trimStart()}
                    onChange={onUpdateField}
                    required={true}
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
                    value={form.account_number?.trimStart()}
                    onChange={onUpdateField}
                    required={true}
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
                    value={form.ifsc_code?.trimStart()}
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.branchName}
                  <span className="red-asterisk">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="branch_name"
                    value={form.branch_name?.trimStart()}
                    onChange={onUpdateField}
                    required={true}
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
                    required={true}
                  />
                  {/* <VendorTermsEditor
                    name="terms_and_conditions"
                    onChange={(data) => {
                      setDataeditor(data);
                    }}
                    value={dataeditor}
                    editorLoaded={editorLoaded}
                  /> */}
                </Form.Group>
              </Col>
              {vendortype === "Partners" ? (
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{formFieldsVendor.payment}</Form.Label>
                    {/* <Form.Control
                      as="textarea"
                      rows={5}
                      name="payments"
                      value={form.payments}
                      onChange={onUpdateField}
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
            <h3 className="inner-tag mt-4">{formFieldsVendor.titlePdf}</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{formFieldsVendor.documents}</Form.Label>
                  <div>
                    <input
                      type="file"
                      id="upload"
                      name="upload"
                      accept="application/pdf"
                      hidden
                      multiple
                      onChange={handlePdfChange}
                    />
                    <label for="upload" className="cfile">
                      <img src={attahment} alt="" />
                    </label>
                  </div>
                </Form.Group>
              </Col>
              {Array.isArray(form.documents) &&
                form?.documents?.map((file, index) => (
                  <Col xs={12} md={3} key={index}>
                    <Form.Group className="mb-1">
                      <Form.Label>&nbsp;</Form.Label>
                      <div className="attachment-sec">
                        <span className="attachment-name">{file.document_name}</span>
                        <span
                          className="attachment-icon"
                          onClick={() => removeattachment(index)}
                        > x
                        </span>
                      </div>
                    </Form.Group>
                  </Col>
                ))}
            </Row>

            {vendortype !== "Partners" && (
              <>
                <div className="d-flex justify-content-between align-center mt-4 d-flex-mobile-align">
                  {vendortype === "m-cat" || vendortype === "e-cat" ? (
                    <h3 className="inner-tag mb-0">{formFieldsVendor.categoryInfo}</h3>
                  ) : null}
                  {vendortype === "m&e-Cat" ? (
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={activeTab}
                      onSelect={handleTabSelect}
                    >
                      <Tab eventKey="M" title="M- Category info"></Tab>
                      <Tab eventKey="E" title="E- Category Info"></Tab>
                    </Tabs>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => navigate(-1)}
            >
              {formFieldsVendor.btnCancel}
            </Button>
            <Button type="submit" className="submit" disabled={buttonDisable}>
              {formFieldsVendor.btnUpdate}
            </Button>
          </div>
        </form>
        {(isLoading || isLoadingEditData) && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">{formFieldsVendor.loader}</span>
            </Spinner>
          </div>
        )}
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
        style={{ minWidth: "100px" }}
        transition={Zoom}
        onClose={() => setButtonDisable(false)}
      />
    </>
  );
};

export default EditVendor;
