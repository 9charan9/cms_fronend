import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import "react-toastify/ReactToastify.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, Zoom } from 'react-toastify';
import { toast } from 'react-toastify';
import Upload from '../../../assets/Images/upload.svg';
import pdfImage from "../../../assets/Images/pdf.svg"
import { Spinner } from 'react-bootstrap';
import { getCategories, getEditComponentData, selectEditComponent, updateComponentDetails, selectLoadingState, resetEditProductAttributes } from "../slice/ComponentSlice";
import AddAttribute from "./AddAttribute";

const EditMechanicalComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { prop1, prop2 } = location.state;
  const { productDetailsMechProp1, productDetailsMechPprop2 } = location.state;
  console.log(productDetailsMechProp1, productDetailsMechPprop2)
  const [pdfFileName, setPdfFileName] = useState('');
  const isLoading = useSelector(selectLoadingState);
  const editComponents = useSelector(selectEditComponent);
  const fetchingDetails = editComponents?.body;
  console.log("fetchingDetails", fetchingDetails);
  const [pdfPreview, setPdfPreview] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFileName, setImageFileName] = useState('');
  const [mountingtype, setMountingType] = useState("");
  const [moldtype, setMoldtype] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const checkTabOuterEdit = location?.state?.mechanicProducts;
  const checkTabInnerEdit = location?.state?.productMechInnerDetails;
  console.log(checkTabInnerEdit, checkTabOuterEdit)

  const [formValues, setFormValues] = useState({
    "department": "",
    "ctgr_name": "",
    "file_type": "pdf",
    "data_sheet": "",
    "prt_img": "",
    "img_type": "jpg",
    "product_attributes": {},
    "mfr_prt_num": "",
    "ptg_prt_num": "",
    "qty": "",
    "prdt_name": "",
    "material": "",
    "description": "",
    "technical_details": ""
  });
  console.log(JSON.stringify(formValues, null, 2))
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formValues.product_attributes) {
      setFormValues({
        ...formValues,
        product_attributes: {
          ...formValues.product_attributes,
          [name]: value.trimStart()
        }
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value.trimStart()
      });
    }
  }
  const handlemoldrequire = (e) =>{
    setMoldtype(e.target.value);
    const nextFormState = {
      ...formValues,
      [e.target.name]: e.target.value,
    };
    setFormValues(nextFormState);
  }

  const handleAttributeFieldsChange = (updatedFields) => {
    const nextFormState = {
      ...formValues,
      product_attributes: updatedFields,
    };
    console.log(JSON.stringify(nextFormState, null, 2))
    setFormValues(nextFormState);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
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
    console.log("generatedObjects", generatedObjects)
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
    
    const filteredObject = Object.fromEntries(
      Object.entries(generatedObjects).filter(([key, value]) => {
        // Check if the key is "prt_img" or "data_sheet"
        if (key === "prt_img" || key === "data_sheet" || key === "prt_image_name" || key === "data_sheet_name") {
          return true;  // Include these keys regardless of their values
        }
        // Exclude key-value pairs where the value is an empty string
        return value !== "";
      })
    );
    if (boolValue) {
      console.log(JSON.stringify(filteredObject, null, 2))
      dispatch(updateComponentDetails(filteredObject));
      setDisableButton(true);
      navigate("/mechanicalproducts", {
        state: {
          ctgr_id: fetchingDetails?.ctgr_id,
          ctgr_name: fetchingDetails?.ctgr_name
        }
      });
    } else {
      toast.error(`please check and fill all the Product Attributes field!!`);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "image/jpeg") {
      toast.error("Only JPEG type are allowed");
    }
    else {
      const fileName = file?.name;
      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setImagePreview(reader.result);
        encodedFile = fileOutput.target.result.split(',')[1];
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
        }
        else {
          setImageFileName('');
          setImagePreview(null);
        }
      }
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }
  }

  const handleCancelImagePreview = () => {
    setImagePreview(null);
    setImageFileName('');
    setFormValues((prevForm) => ({
      ...prevForm,
      prt_img: "",
      prt_image_name: ""
    }));
  }

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Only PDF type are allowed");
    }
    else {
      const fileName = file?.name;
      setPdfFileName(fileName);
      const reader = new FileReader();
      let encodedFile;
      let nextFormState = {};
      reader.onload = (fileOutput) => {
        setPdfPreview(reader.result);
        encodedFile = fileOutput.target.result.split(',')[1];
        nextFormState = {
          ...formValues,
          [e.target.name]: encodedFile,
          data_sheet_name: fileName
        };
        setFormValues(nextFormState);
      }
      if (file != null) {
        reader.readAsDataURL(file);
      }
    }
  }

  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setPdfFileName("");
    setFormValues((prevForm) => ({
      ...prevForm,
      data_sheet: "",
      data_sheet_name: ""
    }));
  }

  useEffect(() => {
    if(checkTabOuterEdit === "mechanicalProductDetails"){
      console.log("Exceuted =========================>");
    const requestObject = {
      "ctgr_name": prop2,
      "cmpt_id": prop1?.cmpt_id,
      "department": "Mechanic"
    }
    dispatch(getEditComponentData(requestObject));
  } else if(checkTabInnerEdit === "productDetailsMechanical"){
    console.log("Exceuted products=========================>");
    const requestObject = {
      "ctgr_name": productDetailsMechPprop2,
      "cmpt_id": productDetailsMechProp1,
      "department": "Mechanic"
    }
    dispatch(getEditComponentData(requestObject));
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
        ...fetchingDetails
      }
      setFormValues(nextFormState);
      setImagePreview(fetchingDetails?.prt_img);
      setMoldtype(fetchingDetails?.mold_required);
      setPdfPreview(fetchingDetails?.data_sheet);
      setImageFileName(fetchingDetails?.prt_image_name);
      setPdfFileName(fetchingDetails?.data_sheet_name);
    }
  }, [fetchingDetails])

  const handleAddProductAttribute = (newAttributeName) =>{
    if (newAttributeName) {
      setFormValues({
        ...formValues,
        product_attributes: {
          ...formValues.product_attributes,
          [newAttributeName]: ""
        }
      });
    }
  }
  const handleDeleteAttribute = (deletedAttribute) => {
    const updatedAttributes = { ...formValues.product_attributes };
    delete updatedAttributes[deletedAttribute];
  
    // Update the formValues state with the modified product_attributes
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      product_attributes: updatedAttributes,
    }));
  };

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...formValues,
      product_attributes: {
        ...formValues.product_attributes,
        [name]: value
      }
    }
    console.log("===>", JSON.stringify(nextFormState, null, 2));
    setFormValues(nextFormState);
  }

  const handleProductAttributesChange = (updatedAttributes) => {
    const nextFormState = {
      ...formValues,
      product_attributes: updatedAttributes,
    };
    console.log(JSON.stringify(nextFormState, null, 2));
    setFormValues(nextFormState);
  };

  const handleRouteBack = () => {
    navigate("/mechanicalproducts", {
      state: {
        ctgr_id: fetchingDetails?.ctgr_id,
        ctgr_name: fetchingDetails?.ctgr_name
      }
    });
  }

  


  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={handleRouteBack}
            />
            {prop2 || productDetailsMechPprop2}
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
          <h3 className="inner-tag">Product details </h3>
          <form onSubmit={handleSubmit}>  
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="Mechanic"
                    value={formValues?.department}
                    placeholder=''
                    disabled={true}
                    required={true}
                  >
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="category_name"
                    value={formValues?.ctgr_name}
                    disabled={true}
                    required={true}
                  >
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Part Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="product_name"
                    value={formValues?.prdt_name}
                    disabled={true}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>PTG Part Number </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    disabled={true}
                    name="ptg_prt_num"
                    value={
                      formValues.ptg_prt_num
                        ? formValues.ptg_prt_num
                        : ""
                    }
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label> Part Number <span className="text-danger">*</span></Form.Label>
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
              <Form.Group className="mb-3">
              <Form.Label>Material <span className="text-danger">*</span></Form.Label>
              <Form.Control
                    // as="textarea"
                    // rows={3}
                    type="text"
                    name="material"
                    value={
                      formValues.material
                        ? formValues.material
                        : ""
                    }
                    required={true}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Mold Required <span className="text-danger">*</span> </Form.Label>
                  <Form.Select
                    name="mold_required"
                    className="d-flex justify-content-center"
                    value={moldtype}
                    onChange={handlemoldrequire}
                    required
                    >
                    <option value="req">Required</option>
                    <option value="notreq">Not-Required</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    name="qty"
                    value={formValues.qty}
                    onChange={handleChange}
                    min={0}
                    disabled
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                    <Form.Group className="mb-4">
                      <Form.Label>HSN Code <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="hsn_code"
                        value={formValues?.hsn_code}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <col xs={12} md={3}></col>
                  <col xs={12} md={3}></col>
              
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Technical Details <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="technical_details"
                    value={
                      formValues.technical_details
                        ? formValues.technical_details
                        : ""
                    }
                    required={true}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={
                      formValues.description
                        ? formValues.description
                        : ""
                    }
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
                handleAddProductAttribute = {handleAddProductAttribute}
                parentcallBack={handleAttributeChange}
                onProductAttributesChange={handleProductAttributesChange}
                onDeleteAttribute={handleDeleteAttribute}
              />
             </div>
            <div className="mt-3">
              <h3 className="inner-tag">Documents</h3>
              <Row>

                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>Drawing</Form.Label>
                    <div class="upload-btn-wrapper">
                      {imagePreview ? (
                        <>
                          <img
                            style={{ maxwidth: "100px", maxHeight: "100px" }}
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
                      ) : (
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
                      <button class="btn"></button>
                    </div>
                    <div>{imageFileName && <p>{imageFileName}</p>}</div>
                  </Form.Group>
                </Col>

                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>Data Sheet</Form.Label>
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
                            onChange={handlePdfFileChange}
                          />
                        </>
                      )}
                    </div>
                    <div>{pdfFileName && <p>{pdfFileName}</p>}</div>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
              <Button
                type="button"
                className="cancel me-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="submit">
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
export default EditMechanicalComponent;
