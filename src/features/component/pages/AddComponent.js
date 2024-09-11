import React, { useEffect, useState, useRef } from "react";
import "../styles/AddComponent.css";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import AddAttribute from "./AddAttribute";
import Upload from "../../../assets/Images/upload.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addNewPart,
  checkReplacementprtnumAPI,
  generatePTGPartNumber,
  getCategories,
  getCategoryinAddComponent,
  getProductAttributes,
  getsubCategories,
  selectCategories,
  selectCategory,
  selectLoadingState,
  selectPTGPartNumber,
  selectReplacementprtnum,
  selectSubCategories,
} from "../slice/ComponentSlice";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Modal from "react-bootstrap/Modal";
import ExcelUpload from "./ExcelUpload";

const AddComponent = () => {
  const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
  const [disableSubmitbtn, setDisableSubmitbtn] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [subCategoryoption, setSubCategoryoption] = useState("");
  console.log(selectedOption);
  const [errorInput, setErrorInput] = useState("");
  const [lifecycleoption, setLifeCycleOption] = useState("");
  const [moldtype, setMoldtype] = useState("");
  const [ROHS, setROHS] = useState("");
  const [removeimagehint, setremoveimagehint] = useState(false);
  const [removepdfhint, setRemovePdfHint] = useState(false);
  const [mountingtype, setMountingType] = useState("");
  const [department, setDepartment] = useState("Electronic");
  console.log(department);
  const isLoading = useSelector(selectLoadingState);
  const ptgPartNo = useSelector(selectPTGPartNumber);
  const category = useSelector(selectCategory);
  const categories = useSelector(selectCategories);
  const rplprtnumErrmsg = useSelector(selectReplacementprtnum);
  console.log(rplprtnumErrmsg?.body);
  const Categories = categories?.body;
  console.log(Categories);
  const subCategory = useSelector(selectSubCategories);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    ctgr_name: "",
    mfr_prt_num: "",
    manufacturer: "",
    image_type: "jpg",
    ptg_prt_num: "",
    image: "",
    data_sheet: "",
    mounting_type: mountingtype,
    life_cycle: lifecycleoption,
    sub_category: "",
    qty: "",
    description: "",
    department: department,
    prdt_name: "",
    material: "",
    foot_print: "",
    eol_date: "",
    rpl_prt_num: "",
    strg_rcmd: "",
    hsn_code: "",
    technical_details: "",
    mold_required: moldtype,
    rohs: ROHS,
    module: "",
    qty:"",
    prt_image_name: "",
    value: "",
    opt_tem: ""
  });
  const [attributeFields, setAttributeFields] = useState([]);
  const [prodAttributes, setProdAttributes] = useState(null);
  console.log(prodAttributes);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file?.type !== "image/jpeg") {
      toast.error("Only jpeg type images are allowed");
    } else {
      const fileSize = file.size; // Get file size in bytes
  
      // Check if the file size is within the allowed limit (200 KB in this case)
      if (fileSize > 200 * 1024) {
        toast.error("File size exceeds the limit of 200 KB. Please select a smaller image.");
      } else {
        const fileName = file?.name;
        const reader = new FileReader();
        let encodedFile;
        let nextFormState = {};
  
        reader.onload = (fileOutput) => {
          setImagePreview(reader.result);
          encodedFile = fileOutput.target.result.split(",")[1];
          nextFormState = {
            ...form,
            [e.target.name]: encodedFile,
            prt_image_name: fileName
          };
          setForm(nextFormState);
  
          if (file) {
            setremoveimagehint(true);
            setImageFileName(fileName);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
          } else {
            setImageFileName("");
            setImagePreview(null);
          }
        };
  
        if (file != null) {
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleCancelImagePreview = () => {
    setImagePreview(null);
    setImageFileName("");
    setForm((prevForm) => ({
      ...prevForm,
      image: "",
      prt_image_name: "",
    }));
    setremoveimagehint(false);
  };
  
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
    } else {
      const fileSize = file.size;
      if(fileSize >= 3.5 * 1024 * 1024){
        toast.error("File size exceeds the limit of 3.5 MB. Please select a smaller File.");
      }
      else{
      const fileName = file?.name;
      setPdfFileName(fileName);
      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setPdfPreview(reader.result);
        encodedFile = fileOutput.target.result.split(",")[1];
        nextFormState = {
          ...form,
          [e.target.name]: encodedFile,
          data_sheet_name: fileName,
        };
        setForm(nextFormState);
        setRemovePdfHint(true);
      };
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }
    }
  };
  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setPdfFileName("");
    setForm((prevForm) => ({
      ...prevForm,
      data_sheet: "",
      data_sheet_name: ""
    }));
    setRemovePdfHint(false);
  };

  const onUpdateField = (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...form,
      [name]: value.trimStart(),
    };
    console.log(JSON.stringify(nextFormState, null, 2));
    setForm(nextFormState);
  };

  const callback = async (ex) =>{
    try{
    const sam = await dispatch(checkReplacementprtnumAPI(ex));
    if(sam.payload.statusCode === 200){
      setDisableSubmitbtn(true);
    }
    else{
      setDisableSubmitbtn(false);
    }
  }
  catch(error){
    console.error(error);
  }

  }

  const handleReplacementprtnumChange = (e) =>{
    const { name, value } = e.target;
    e.preventDefault();
    const nextFormState = {
      ...form,
      [name]: value,
    };
    callback(value);
    console.log(JSON.stringify(nextFormState, null, 2))
    setForm(nextFormState);
  } 

  const handleAttributeChange = (e) => {
    const { value } = e.target;
    const nextFormState = {
      ...form,
      [e.target.name]: value,
    };
    const prodAttributesData = {
      [e.target.name]: value
    }
    console.log(JSON.stringify(nextFormState, null, 2));
    setProdAttributes(prodAttributesData);
    setForm(nextFormState);
  };
  const handleDeleteAttributeInForm = (deletedAttribute) => {
    // Create a copy of the form state
    const updatedForm = { ...form };

    // Remove the deleted attribute from the form state
    delete updatedForm[deletedAttribute.name];
    console.log(JSON.stringify(updatedForm, null, 2))
    // Update the form state
    setForm(updatedForm);
  };

  const handleSelectChange = (e) => {
    const selectedCategory = Categories.find(category => category?.ctgr_name == e.target.value);
    setSelectedOption(e.target.value);
    const request = {
      ctgr_name: e.target.value,
      ctgr_id : selectedCategory?.ctgr_id,     
    }
    dispatch(getProductAttributes(request));
    dispatch(getsubCategories(selectedCategory?.ctgr_id));
    setSubCategoryoption("");
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);

    setErrorInput("");
  };

  const handlePartnoChange =  (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...form,
      [name]: value,
    };
    setForm(nextFormState);
    if(department === "Electronic"){
    const request = {
      ctgr_name: form.ctgr_name,
      sub_category: form.sub_category,
      department: department,
      mfr_prt_num : value
    }
    dispatch(generatePTGPartNumber(request));
  }
  else if(department === "Mechanic"){
    const request = {
      ctgr_name: form.ctgr_name,
      department: department,
      prdt_name: form.prdt_name,
      mfr_prt_num : value
    }
    dispatch(generatePTGPartNumber(request));
  }
    if (selectedOption === "") {
      setErrorInput("Please select a category");
    } else {
      setErrorInput("");
    }
  };
  console.log(Object.entries(form));

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (form.mfr_prt_num === form.rpl_prt_num) {
      toast.error("Manufacturer Part Number and Replacement Part Number can't be the same");
      return;
    }
    let boolValue = true;
    if (form.ptg_prt_num.trim().length === 0) {
      boolValue = false;
      toast.error("PTG Part Number is required.");
    }
    else{
      if(prodAttributes !== null || undefined){
      Object.values(prodAttributes).map((item) => {
        console.log(item.trim().toString().length);
        if (item.trim().toString().length == 0) {
          boolValue = false;
        } else {
          boolValue = true;
        }
      });
    }
    else{
      boolValue = true;
    }
    console.log(boolValue);
    if (boolValue) {
      let filteredData;
      if(department === "Electronic"){
        filteredData = Object.entries(form).reduce((acc, [key, value]) => {
        if (key === 'data_sheet' || key === 'image'  || key ==="eol_date" || key === "rpl_prt_num" || key === "hsn_code" || value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});
    }
    else if(department === "Mechanic"){
      filteredData = Object.fromEntries(
        Object.entries(form).filter(
          ([key, value]) => value !== "" || key === 'data_sheet' || key === 'image')
      );
      console.log(JSON.stringify(filteredData, null, 2));
    }
      const response = await dispatch(addNewPart(filteredData));
      if (response?.payload.statusCode === 200) {
        setImagePreview(null);
        setImageFileName("");
        setPdfFileName("");
        handleClear();
        setTimeout(() => {
          navigate("/components");
        }, 1500);
      }
    } 
    else {
      setIsErrorToastVisible(true);
      toast.error(`please check and fill all the Product Attributes field!!`);
    }
  }
  };
  
  const getCategory = () => {
    if (Categories !== undefined) {
      return Categories?.map((value, index) => {
        return <option key={index}>{value.ctgr_name}</option>;
      });
    }
  };

  const subCategories = () => {
    if (Array.isArray(subCategory?.sub_categories)) {
      return subCategory?.sub_categories?.map((value, index) => {
        return (
          <option value={value} key={index}>
            {value}
          </option>
        );
      });
    }
  };
  const handlelifecycleOptionChange = (e) => {
    setLifeCycleOption(e.target.value);
    if(e.target.value !== "Active"){
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  }
  else{
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
      rpl_prt_num: "",
    };
    setForm(nextFormState);
    setDisableSubmitbtn(false);
  }
  };
  const handleMoutingtype = (e) => {
    setMountingType(e.target.value);
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  };
  const handledepartment = (e) => {
    const newDepartment = e.target.value;
    setIsErrorToastVisible(false);
    setShow(false);
    setImagePreview(null);
    setPdfPreview(null);
    setImageFileName("");
    setPdfFileName("");
    setSelectedOption("");
    setLifeCycleOption("");
    setMountingType("");
    setErrorInput("");
    setMoldtype("");
    setForm({
      ctgr_name: "",
      mfr_prt_num: "",
      manufacturer: "",
      image_type: "jpg",
      ptg_prt_num: "",
      image: "",
      data_sheet: "",
      mounting_type: "",
      life_cycle: "",
      sub_category: "",
      qty: "",
      description: "",
      department: newDepartment,
      prdt_name: "",
      material: "",
      foot_print: "",
      eol_date: "",
      rpl_prt_num: "",
      strg_rcmd: "",
      hsn_code: "",
      technical_details: "",
      mold_required: "",
      rohs: "",
      module: ""
    });
    const request = {
      ctgr_name: "",
      ctgr_id: "",
    }
    dispatch(getProductAttributes(request));
    // Continue with other logic
    setDepartment(newDepartment);
    dispatch(getCategoryinAddComponent(newDepartment));
    dispatch(getsubCategories());
    // resetState();
  };
  

  const handlemoldrequire = (e) =>{
    setMoldtype(e.target.value);
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  }
  const handleRohs = (e) =>{
    setROHS(e.target.value);
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
    console.log(JSON.stringify(form, null, 2))
  }
  const handleFocus = (event) => {
    // Prevent the default behavior of selecting all text
    event.target.setSelectionRange(0, 0);
  };
  const handleClear = () => {
    setForm({
      ctgr_name: "",
      mfr_prt_num: "",
      manufacturer: "",
      image_type: "jpg",
      ptg_prt_num: "",
      image: "",
      data_sheet: "",
      mounting_type: "",
      life_cycle: "",
      sub_category: "",
      qty: "",
      description: "",
      foot_print: "",
      eol_date: "",
      rpl_prt_num: "",
      strg_rcmd: "",
      hsn_code: "",
    });
    setImagePreview(null);
    setImageFileName("");
    setPdfFileName("");
    setSelectedOption("");
    setLifeCycleOption("");
    setMountingType("");
    setErrorInput("");
    const request = {
      ctgr_name: "",
      ctgr_id: "",
    }
    dispatch(getProductAttributes(request));
    dispatch(getsubCategories());
  };

  const routecomponent = () => {
    let path = `/components`;
    navigate(path);
    const request = {
      ctgr_name: "",
      ctgr_id: "",
    }
    dispatch(getProductAttributes(request));
  };

  const handlesubcategoryChange = (e) => {
    setSubCategoryoption(e.target.value);
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  };
  //download electonic csv
  const exportExcel = () => {
    let headers = [
      "department,categoryName,productName,manufacturer,mfrPartNumber,mountingType,foot_print,quantity,lifeCycle,rohs,msl,hsn_code,description,eol_date,replacement_part_number,image,dataSheet,image_type,file_type,value,operatingTemperature",
    ];

    headers = headers.map(header => '"' + header.split(",").join('","') + '"');

    downloadFile({
      data: headers.join("\n"),
      fileName: "ElectronicComponent.csv",
      fileType: "text/csv",
    });
  };
  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };


//download csv mechanic
const exportExcel1 = () => {
  let headers = [
    "department,categoryName,productName,mfrPartNumber,quantity,description,image,dataSheet,image_type,file_type,technical_details,mold_required,material",
  ];

  downloadFile1({
    data: [...headers].join("\n"),
    fileName: "MechanicComponent.csv",
    fileType: "text/csv",
  });
};
const downloadFile1 = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

const handleAttributeFieldsChange = (updatedFields) => {
  console.log(updatedFields);
   setForm(prevState => ({
    ...prevState,
    ...updatedFields
   }));
   setProdAttributes((prev) => ({
    ...prev,
    ...updatedFields
   }))
};

  useEffect(() => {
    setAttributeFields([]);
  }, [department]);

  useEffect(() => {
    if (form.mfr_prt_num.length > 0) {
    if (ptgPartNo?.statusCode === 200) {
            const nextFormState = {
              ...form,
              ptg_prt_num: ptgPartNo.body,
            };
            setForm(nextFormState);
          } else if (ptgPartNo?.statusCode === 401) {
            toast.error(`${ptgPartNo?.body}`);
            const ptgPartnoempty = {
              ...form,
              ptg_prt_num: "",
            };
            setForm(ptgPartnoempty);
          }
        }
        
        else {
          setForm((prevForm) => ({
            ...prevForm,
            ptg_prt_num: "",
          }));
        }
      console.log("rendereddd=================")
  }, [form.mfr_prt_num, form.prdt_name, ptgPartNo])

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getCategoryinAddComponent(department));
  }, []);
  
  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between d-flex-mobile-align">
          <h1 className="title-tag">
            <img src={arw} alt="" className="me-3" onClick={routecomponent} />
            Add Component
          </h1>
          <div className="mobilemargin-top">
            <Button
              className="submit me-2 md-me-2 submitmobile"
              onClick={exportExcel}
            >
              Download Electronic Csv Format 
            </Button>
            
            <Button
              className="submit me-2 md-me-2 submitmobile"
              onClick={exportExcel1 }
            >
              Download Mechanic Csv Format 
            </Button>



            <Button
              variant="outline-dark"
              className="small-uploadbtn"
              onClick={handleShow}
            >
              Upload Csv
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        <div className="content-sec">
          <h3 className="inner-tag">Product details</h3>
          <form onSubmit={onSubmitForm}>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Department<span className='text-danger'> *</span></Form.Label>
                  <Form.Select
                    name="department"
                    value={department}
                    onChange={handledepartment}
                    required={true}
                  >
                    <option value="Electronic">Electronic</option>
                    <option value="Mechanic">Mechanic</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {department === "Electronic" && (
                <>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Category<span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="ctgr_name"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        required={true}
                      >
                        <option value="">-- Select a category --</option>
                        <option value= "partame">partName</option>
                        {getCategory()}
                      </Form.Select>
                      {errorInput && (
                        <span style={{ color: "red" }}>{errorInput}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Sub Category<span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="sub_category"
                        value={subCategoryoption}
                        onChange={handlesubcategoryChange}
                        required={true}
                      >
                        <option value="">-- Select a sub category --</option>
                        {subCategories()}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Manufacturer <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="manufacturer"
                        value={form.manufacturer}
                        required={true}
                        onChange={onUpdateField}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Manufacturer Part No <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="mfr_prt_num"
                        value={form.mfr_prt_num?.trimStart()}
                        onChange={handlePartnoChange}
                        autoComplete="off"
                        autoSave="off"
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>PTG Part Number <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        disabled={true}
                        name="ptg_prt_num"
                        value={form.ptg_prt_num}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Mounting Type <span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="mounting_type"
                        value={mountingtype}
                        onChange={handleMoutingtype}
                        required={true}
                      >
                        <option value="">Select an option</option>
                        <option value="SMD">SMD</option>
                        <option value="TH">Through Hole</option>
                        <option value="Others">Others</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Foot Print/Package <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        name="foot_print"
                        value={form?.foot_print}
                        onChange={onUpdateField}
                        required={true}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Quantity <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="qty"
                        value={form.qty}
                        onChange={onUpdateField}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Life Cycle <span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="life_cycle"
                        value={lifecycleoption}
                        onChange={handlelifecycleOptionChange}
                        required={true}
                      >
                        <option value="">Select a life cycle</option>
                        <option value="EOL">EOL</option>
                        <option value="NRND">
                          NRND
                        </option>
                        <option value="Active">
                          Active
                        </option>
                        <option value="Obsolete">Obsolete</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>ROHS <span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="rohs"
                        value={form.rohs}
                        onChange={handleRohs}
                        required={true}
                      >
                        <option value="">Select Yes or No</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {["EOL", "NRND", "Obsolete"].includes(lifecycleoption) && (
                    <>
                      <Col xs={12} md={3}>
                        <Form.Group className="mb-4">
                          <Form.Label>EOL Date</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="eol_date"
                            value={form.eol_date?.trimStart()}
                            onChange={onUpdateField}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={3}>
                        <Form.Group className="mb-4">
                          <Form.Label>Replacement Part Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            name="rpl_prt_num"
                            value={form.rpl_prt_num?.trimStart()}
                            onChange={handleReplacementprtnumChange}
                          />
                          {form.rpl_prt_num !== "" && rplprtnumErrmsg.statusCode === 200 && (
                            <p style={{ color: "red" }}>{rplprtnumErrmsg?.body}</p>
                          )}
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>MSL<span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="strg_rcmd"
                        value={form.strg_rcmd?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Value<span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="value"
                        value={form.value?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Operating Temperature <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="opt_tem"
                        value={form.opt_tem?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>HSN Code <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="hsn_code"
                        value={form.hsn_code?.trimStart()}
                        onChange={onUpdateField}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Description (max 500 characters) <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={form.description?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                        maxLength={500}
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
              {department === "Mechanic" && (
                <>
                <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Category <span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="ctgr_name"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        required={true}
                      >
                        <option value="">-- Select a category --</option>
                        {getCategory()}
                      </Form.Select>
                      {errorInput && (
                        <span style={{ color: "red" }}>{errorInput}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Part Name <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="prdt_name"
                        value={form.prdt_name}
                        required={true}
                        onChange={onUpdateField}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Part Number <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="mfr_prt_num"
                        value={form.mfr_prt_num?.trimStart()}
                        onChange={handlePartnoChange}
                        autoComplete="off"
                        autoSave="off"
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>PTG Part Number <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="ptg_prt_num"
                        value={form.ptg_prt_num}
                        disabled={true}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Material <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="material"
                        value={form.material?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Mold Required <span className='text-danger'> *</span></Form.Label>
                      <Form.Select
                        name="mold_required"
                        value={moldtype}
                        onChange={handlemoldrequire}
                        required
                      >
                        <option value="">Select a Type</option>
                        <option value="req">Required</option>
                        <option value="notreq">
                          Not-Required
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Quantity <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        name="qty"
                        placeholder=""
                        value={form.qty}
                        onChange={onUpdateField}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>HSN Code<span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="hsn_code"
                        value={form.hsn_code?.trimStart()}
                        onChange={onUpdateField}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                  </Col>
                  <Col xs={12} md={3}></Col>

                  <Col xs={12} md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Techanical Details(max 500 characters) <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="technical_details"
                        value={form.technical_details?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                        maxLength={500}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Description (max 500 characters) <span className='text-danger'> *</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={form.description?.trimStart()}
                        onChange={onUpdateField}
                        required={true}
                        maxLength={500}
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            <div>
              <AddAttribute
                parentCallBack={handleAttributeChange}
                onAttributeFieldsChange = {handleAttributeFieldsChange}
                onDeleteAttribute={handleDeleteAttributeInForm}
                department={department}
                attributeFields={attributeFields}
              />
            </div>
            <div className="attributed"> </div>
            <div className="mt-3">
              <h3 className="inner-tag">Documents</h3>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-0 position-relative">
                  {department === "Mechanic" ? (
                    <Form.Label>Drawing</Form.Label>
                  ):(
                  <Form.Label>Product Image</Form.Label>
                  )}
                    <div className="upload-btn-wrapper position-relative">
                      {imagePreview ? (
                        <>
                          <img
                            style={{ maxwidth: "100px", maxHeight: "100px" }}
                            src={imagePreview}
                            alt="img-preview"
                          />
                          <button
                            className="close"
                            onClick={handleCancelImagePreview}
                          >
                            &times;
                          </button>
                        </>
                      ) : (
                        <>
                          <img src={Upload} alt="" />
                          <input
                            type="file"
                            name="image"
                            accept="image/jpeg"
                            onChange={handleImageChange}
                          />
                        </>
                      )}
                    </div>
                    {!removeimagehint ? (<p style={{fontSize: "10px", color: "red"}}>max size upto 200kb*</p>) : null}
                    <div>
                      {imageFileName && (
                        <p className="uploadimg-tag">{imageFileName}</p>
                      )}
                    </div>
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group className="mb-0 position-relative">
                    <Form.Label className="mt-3 mt-md-0">
                      Data Sheet
                    </Form.Label>
                    <div class="upload-btn-wrapper">
                      {pdfPreview ? (
                        <>
                          <img
                            style={{ maxwidth: "100px", maxHeight: "100px" }}
                            src={pdfImage}
                            alt="pdf preview"
                          />
                          <button
                            className="close"
                            onClick={handleCancelPdfPreview}
                          >
                            &times;
                          </button>
                        </>
                      ) : (
                        <>
                          <img src={Upload} alt="" />
                          <input
                            type="file"
                            name="data_sheet"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                          />
                        </>
                      )}
                    </div>
                    {!removepdfhint ? (<p style={{fontSize: "10px", color: "red"}}>max size upto 3.5mb*</p>) : null}
                    <div>
                      {pdfFileName && (
                        <p className="uploadimg-tag">{pdfFileName}</p>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="mt-3 d-flex justify-content-end">
              <Button
                type="button"
                className="cancel me-2"
                onClick={routecomponent}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="submit"
                disabled={disableSubmitbtn}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
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
        onClose={() => setIsErrorToastVisible(false)}
      />

      <Modal show={show} onHide={handleClose} centered className="upload-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center modal-title-tag w-100">
            Upload CSV File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExcelUpload hide={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddComponent;
