import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import Upload from "../../../assets/Images/upload.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import "../styles/EditComponent.css";
import { useDispatch, useSelector } from "react-redux";
import {
  checkReplacementprtnumAPI,
  getCategories,
  getEditComponentData,
  resetEditProductAttributes,
  selectCategory,
  selectEditComponent,
  selectLoadingState,
  selectProductAttributes,
  selectReplacementprtnum,
  updateComponentDetails,
} from "../slice/ComponentSlice";
import AddAttribute from "./AddAttribute";
import { Spinner } from "react-bootstrap";
import { ToastContainer, Zoom, toast } from "react-toastify";

const EditComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { prop1, prop2 } = location.state;
  const {detailsProp1, detailsProp2} = location.state
  console.log(detailsProp1, detailsProp2)
  const checkProduct = location?.state?.checkProducts;
  const checkProductDetails = location?.state?.checkProctDetails;
  console.log(checkProduct)

  const [pdfFileName, setPdfFileName] = useState("");
  const category = useSelector(selectCategory);
  const isLoading = useSelector(selectLoadingState);
  const editComponents = useSelector(selectEditComponent);
  console.log("Sravanthi........", editComponents);
console.log(!isLoading);
  const subCategoriesBody = useSelector(selectProductAttributes);
  const rplprtnumErrmsg = useSelector(selectReplacementprtnum);
  const subCategories = subCategoriesBody?.body?.sub_categories;
  const fetchingDetails = editComponents?.body;
  console.log("fetchingDetails", fetchingDetails);
  const [pdfPreview, setPdfPreview] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [lifecycleoption, setLifeCycleOption] = useState("");
  const [selectedOption, setSelectedOption] = useState(prop2);
  const [selected, setSelected] = useState(detailsProp2);
  const [disableSubmitbtn, setDisableSubmitbtn] = useState(false);
  console.log(disableSubmitbtn);
  const [mountingtype, setMountingType] = useState("");
  const [footPrint, setFootPrint] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const mfrPartNumber = prop1?.mfr_prt_num;
  const subCategory = prop1?.sub_ctgr;
  const manufacturer = prop1?.manufacturer;
  const [ROHS, setROHS] = useState("");

  const [formValues, setFormValues] = useState({
    department: "",
    category_name: selectedOption || selected,
    description: "",
    file_type: "pdf",
    mfr: "",
    life_cycle: "",
    data_sheet: "",
    img_type: "jpg",
    sub_ctgr: "",
    mounting_type: mountingtype,
    product_attributes: {},
    mfr_prt_num: "",
    ptg_prt_num: "",
    foot_print: footPrint,
    qty: "",
    strg_rcmd: "",
    hsn_code: "",
    eol_date: "",
    rpl_prt_num: "",
    rohs: "",
  });
  console.log(formValues?.qty);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formValues.product_attributes) {
      setFormValues({
        ...formValues,
        product_attributes: {
          ...formValues.product_attributes,
          [name]: value.trimStart(),
        },
      });
      console.log(formValues, "after updating quantity");
    } else {
      setFormValues({
        ...formValues,
        [name]: value.trimStart(),
      });
      console.log(formValues?.qty);
    }
  };

  const handleAddProductAttribute = (newAttributeName) => {
    if (newAttributeName) {
      setFormValues({
        ...formValues,
        product_attributes: {
          ...formValues.product_attributes,
          [newAttributeName]: "",
        },
      });
    }
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...formValues,
      product_attributes: {
        ...formValues.product_attributes,
        [name]: value.trimStart(),
      },
    };
    console.log("===>", JSON.stringify(nextFormState, null, 2));
    setFormValues(nextFormState);
  };

  const handleDeleteAttribute = (deletedAttribute) => {
    const updatedAttributes = { ...formValues.product_attributes };
    delete updatedAttributes[deletedAttribute.name];
  
    // Update the formValues state with the modified product_attributes
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      product_attributes: updatedAttributes,
    }));
  };
  console.log(JSON.stringify(formValues, null, 2));

  const handleAttributeFieldsChange = (updatedFields) => {
    const nextFormState = {
      ...formValues,
      product_attributes: updatedFields,
    };
    console.log(JSON.stringify(nextFormState, null, 2))
    setFormValues(nextFormState);
  };
  const handleProductAttributesChange = (updatedAttributes) => {
    const nextFormState = {
      ...formValues,
      product_attributes: updatedAttributes,
    };
    console.log(JSON.stringify(nextFormState, null, 2));
    setFormValues(nextFormState);
  };
  console.log(formValues.lifecycleoption)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValues.mfr_prt_num === formValues.rpl_prt_num) {
      toast.error("Manufacturer Part Number and Replacement Part Number can't be the same");
      return;
    }
    let cleanedPrtImg = formValues.prt_img;
    if (cleanedPrtImg && cleanedPrtImg.startsWith('data:image/jpeg;base64,')) {
      // Remove the 'data:image/jpeg;base64,' prefix from the image data
      cleanedPrtImg = cleanedPrtImg.split(',')[1];
    }
    const generatedObjects = {
      ...formValues,
      ...formValues.product_attributes,
      prt_img: cleanedPrtImg, // Use the cleaned image data
    };
    if (formValues.life_cycle === "Active") {
      delete generatedObjects.eol_date;
      delete generatedObjects.rpl_prt_num;
    }
  
    console.log("generatedObjects", generatedObjects);
    delete generatedObjects.product_attributes;
    let boolValue = true;
    // Object.values(generatedObjects).map((item) => {
    //   if (item.trim().toString().length == 0) {
    //     boolValue = false;
    //   } else {
    //     boolValue = true;
    //   }
    // });
    Object.values(generatedObjects).map((item) => {
      if (typeof item === 'string' && item.trim().length === 0) {
        boolValue = false;
      } else {
        boolValue = true;
      }
    });
    if (boolValue) {
      dispatch(updateComponentDetails(generatedObjects));
      setImageFileName("");
      setPdfFileName("");
      setDisableButton(true);
      setDisableSubmitbtn(false);
      dispatch(getEditComponentData());
      navigate("/products", {
        state: {
          ctgr_id: fetchingDetails?.ctgr_id,
          ctgr_name: fetchingDetails?.ctgr_name
        }
      });
    } else {
      toast.error(`please check and fill all the Product Attributes field!!`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "image/jpeg") {
      toast.error("Only JPEG type are allowed");
    } else {
      const fileName = file?.name;
      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setImagePreview(reader.result);
        encodedFile = fileOutput.target.result.split(",")[1];
        nextFormState = {
          ...formValues,
          [e.target.name]: encodedFile,
          prt_image_name: fileName
        };
        setFormValues(nextFormState);
        if (file) {
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
  
  const handleReplacementprtnumChange = async (e) =>{
    const { name, value } = e.target;
    const nextFormState = {
      ...formValues,
      [name]: value,
    };
    setFormValues(nextFormState);
    await callback(value);
  } 

  const handlelifecycleOptionChange = (e) => {
    setLifeCycleOption(e.target.value);
    if(e.target.value !== "Active"){
    const nextFormState = {
      ...formValues,
      [e.target.name]: e.target.value,
    };
    setFormValues(nextFormState);
  }
  else{
    const nextFormState = {
      ...formValues,
      [e.target.name]: e.target.value,
      rpl_prt_num: "",
    };
    setFormValues(nextFormState);
    setDisableSubmitbtn(false);
  }
  };
  const handleMoutingtype = (e) => {
    setMountingType(e.target.value);
    const nextFormState = {
      ...formValues,
      [e.target.name]: e.target.value,
    };
    setFormValues(nextFormState);
  };

  const handleCancelImagePreview = () => {
    setImagePreview(null);
    setImageFileName("");
    setFormValues((prevForm) => ({
      ...prevForm,
      prt_img: "",
      prt_image_name: "",
    }));
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Only PDF type are allowed");
    } else {
      const fileName = file?.name;
      setPdfFileName(fileName);
      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setPdfPreview(reader.result);
        encodedFile = fileOutput.target.result.split(",")[1];
        nextFormState = {
          ...formValues,
          [e.target.name]: encodedFile,
          data_sheet_name: fileName,
        };
        setFormValues(nextFormState);
      };
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setPdfFileName("");
    setFormValues((prevForm) => ({
      ...prevForm,
      data_sheet: "",
      data_sheet_name: ""
    }));
  };


  console.log(fetchingDetails);
  const handleRoutingBack = () => {
    navigate(-1);
  };

  const hanldeCancleEditForm = () => {
    setImagePreview(null);
    setImageFileName("");
    setPdfFileName("");
    navigate(-1);
  };
  console.log(formValues?.life_cycle);

  const onUpdateField = (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...formValues,
      [name]: value,
    };
    console.log(JSON.stringify(nextFormState, null, 2));
    setFormValues(nextFormState);
  };
  const handleRohs = (e) => {
    setROHS(e.target.value);
    const nextFormState = {
      ...formValues,
      [e.target.name]: e.target.value,
    };
    setFormValues(nextFormState);
    console.log(JSON.stringify(formValues, null, 2));
  };

  useEffect(() => {
    if(checkProduct === "productsPage"){
     const requestObject = {
       ctgr_name: prop2,
       cmpt_id: prop1?.cmpt_id,
       department: "Electronic",
     };
     dispatch(getEditComponentData(requestObject));
   } else if(checkProductDetails ===  "productDetails"){
     const request = {
       ctgr_name : detailsProp2,
       cmpt_id : detailsProp1,
       department : "Electronic"
     }
     dispatch(getEditComponentData(request));
   }
   return () => {
    dispatch(resetEditProductAttributes());
  };
   }, []);
 
   useEffect(() => {
     if (!isLoading) {
       dispatch(getCategories());
       const nextFormState = {
         ...formValues,
         ...fetchingDetails,
       };
       setFormValues(nextFormState);
       setImagePreview(fetchingDetails?.prt_img);
       setPdfPreview(fetchingDetails?.data_sheet);
       setImageFileName(fetchingDetails?.prt_image_name);
       setPdfFileName(fetchingDetails?.data_sheet_name);
     }
   }, [fetchingDetails]);
 
  //  useEffect(() => {
  //    if(rplprtnumErrmsg.statusCode === 200){
  //      setDisableSubmitbtn(true);
  //    }
  //    else{
  //      setDisableSubmitbtn(false);
  //    }
  //  }, [rplprtnumErrmsg])

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={handleRoutingBack}
            />
            {prop2 || detailsProp2}
          </h1>
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

          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Department <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    name="Electronic"
                    value={formValues?.department}
                    placeholder=""
                    disabled={true}
                    required={true}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Category <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    name="category_name"
                    value={formValues?.category_name}
                    disabled={true}
                    required={true}
                  ></Form.Control>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Sub Category <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="sub_ctgr"
                    required={true}
                    disabled={true}
                    value={formValues?.sub_ctgr}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Manufacturer <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="mfr"
                    required={true}
                    value={formValues?.mfr}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Manufacturer Part No <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="mfr_prt_num"
                    required={true}
                    disabled={true}
                    value={formValues?.mfr_prt_num}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>PTG Part Number <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    disabled={true}
                    name="ptg_prt_num"
                    value={formValues.ptg_prt_num ? formValues.ptg_prt_num : ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Mounting Type <span className='text-danger' > *</span></Form.Label>
                  <Form.Select
                    name="mounting_type"
                    value={formValues?.mounting_type}
                    onChange={handleMoutingtype}
                    required={true}
                    disabled={true}
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
                  <Form.Label>Foot Print/Package <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="foot_print"
                    required={true}
                    value={formValues?.foot_print}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Quantity <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="qty"
                    placeholder=""
                    value={formValues.qty}
                    min={0}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Life Cycle <span className='text-danger' > *</span></Form.Label>
                  <Form.Select
                    name="life_cycle"
                    value={formValues.life_cycle}
                    onChange={handlelifecycleOptionChange}
                    required={true}
                  >
                    <option value="">Select an option</option>
                    <option value="EOL">EOL</option>
                    <option value="NRND">NRND</option>
                    <option value="Active">Active</option>
                    <option value="Obsolete">Obsolete</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>ROHS <span className='text-danger' > *</span></Form.Label>
                  <Form.Select
                    name="rohs"
                    value={formValues.rohs}
                    onChange={handleRohs}
                    required={true}
                  >
                    <option value="">Select Yes or Nos</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {["EOL", "NRND", "Obsolete"].includes(formValues.life_cycle) && (
                <>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>EOL Date <span className='text-danger' > *</span> </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="eol_date"
                        value={formValues.eol_date?.trimStart()}
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
                        value={formValues.rpl_prt_num?.trimStart()}
                        onChange={handleReplacementprtnumChange}
                      />
                      {formValues.rpl_prt_num !== "" && rplprtnumErrmsg.statusCode === 200 && (
                            <p style={{ color: "red" }}>{rplprtnumErrmsg?.body}</p>
                      )}
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>MSL <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="strg_rcmd"
                    value={formValues.strg_rcmd}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Value <span className='text-danger' > *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="value"
                        value={formValues?.value}
                        onChange={handleChange}
                        required={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>Operating Temperature <span className='text-danger' > *</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="opt_tem"
                        value={formValues?.opt_tem}
                        onChange={handleChange}
                        required={true}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>HSN Code <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="hsn_code"
                    value={formValues.hsn_code}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Description (max 500 characters) <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formValues.description ? formValues.description : ""}
                    required={true}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div>
              <AddAttribute
                routingComponent="edit"
                productAttributes={formValues?.product_attributes}
                onAttributeFieldsChange = {handleAttributeFieldsChange}
                handleAddProductAttribute={handleAddProductAttribute}
                parentcallBack={handleAttributeChange}
                onProductAttributesChange={handleProductAttributesChange}
                onDeleteAttribute={handleDeleteAttribute}
              />
            </div>
            <div className="attributed"> </div>
            <div className="mt-3">
              <h3 className="inner-tag">Documents</h3>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>Product Image</Form.Label>
                    <div className="upload-btn-wrapper">
                      {imagePreview && (
                        <>
                          <img
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                            src={imagePreview}
                            alt="Image preview"
                          />
                          <button
                            className="close"
                            onClick={handleCancelImagePreview}
                          >
                            &times;
                          </button>
                        </>
                      )}
                      {!imagePreview && (
                        <>
                          <img src={Upload} alt="" />
                          <input
                            type="file"
                            name="prt_img"
                            accept="image/jpeg"
                            onChange={handleImageChange}
                          />
                        </>
                      )}
                    </div>
                    <div>{imageFileName && <p className="uploadimg-tag">{imageFileName}</p>}</div>
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>Data Sheet</Form.Label>
                    <div className="upload-btn-wrapper">
                      {pdfPreview && (
                        <>
                          <img
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
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
                      )}
                      {!pdfPreview && (
                        <>
                          <img src={Upload} alt="" />
                          <input
                            type="file"
                            name="data_sheet"
                            accept="application/pdf"
                            onChange={handlePdfFileChange}
                          />
                        </>
                      )}
                    </div>
                    {pdfFileName && <p className="uploadimg-tag">{pdfFileName}</p>}
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="mt-3 d-flex justify-content-end">
              <Button
                type="button"
                className="cancel me-2"
                onClick={hanldeCancleEditForm}
              >
                Cancel
              </Button>
              <Button type="submit" className="submit" disabled={disableSubmitbtn}>
                Update
              </Button>
            </div>
          </form>
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
            onClose={() => setDisableButton(false)}
          />
        </div>
      </div>
    </>
  );
};

export default EditComponent;
