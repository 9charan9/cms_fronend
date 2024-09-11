import React, { useState, useEffect } from 'react';
import "../styles/AddComponent.css";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getProductAttributes, selectLoadingState, selectProductAttributes, updateCategory } from '../slice/ComponentSlice';
import { useDispatch, useSelector } from 'react-redux';
import arw from '../../../assets/Images/left-arw.svg';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Spinner } from "react-bootstrap";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import "react-toastify/ReactToastify.min.css";
const Editcategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {ctgr_id, ctgr_name} = location.state;
  const isLoading = useSelector(selectLoadingState);
  const productAttributes = useSelector(selectProductAttributes);
  console.log("productAttributes", productAttributes)
  const [form, setForm] = useState({});
  const [disableButton, setDisableButton] = useState(false);

  console.log(JSON.stringify(form, null, 2));
  const handleChange = (event, section, key) => {
    const { value } = event.target;
    setForm((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: value
      }
    }));
    console.log(JSON.stringify(form, null, 2));
  };
  const handleCategoryChange = event => {
    const { value } = event.target;
    setForm(prevData => ({
      ...prevData,
      "new_category": value
    }));
    console.log(JSON.stringify(form, null, 2));
  };

  const handleClear=() => {
    setForm((prevData) => ({
      ...prevData,
      "new_category": "" // Reset the new_category field to an empty string
    }));
  }

  // const handleDelete = (section, key) => {
  //   const updatedSection = { ...form[section] };
  //   delete updatedSection[key];
  //   setForm((prevData) => ({
  //     ...prevData,
  //     [section]: updatedSection
  //   }));
  //   console.log(JSON.stringify(form, null, 2));
  // };
  // const handleAddAttribute = () => {
  //   const existingKeys = Object.keys(form.product_attributes);
  //   const highestNumber = existingKeys.reduce((max, key) => {
  //     const keyNumber = parseInt(key.replace("attribute", ""));
  //     return keyNumber > max ? keyNumber : max;
  //   }, 0);
  //   const nextKey = `attribute${highestNumber + 1}`;
  //   setForm((prevData) => ({
  //     ...prevData,
  //     product_attributes: {
  //       ...prevData.product_attributes,
  //       [nextKey]: ""
  //     }
  //   }));
  //   console.log(JSON.stringify(form, null, 2));
  // };

  const handleDelete = (section, key) => {
    const updatedSection = { ...form[section] };
    delete updatedSection[key];
    setForm((prevData) => ({
      ...prevData,
      [section]: updatedSection
    }));
    console.log(JSON.stringify(form, null, 2));
  };
  
  const handleAddAttribute = () => {
    const existingKeys = Object.keys(form.product_attributes);
    const highestNumber = existingKeys.reduce((max, key) => {
      const keyNumber = parseInt(key.replace("attribute", ""));
      return keyNumber > max ? keyNumber : max;
    }, 0);
    const nextKey = `attribute${highestNumber + 1}`;
    setForm((prevData) => ({
      ...prevData,
      product_attributes: {
        ...prevData.product_attributes,
        [nextKey]: ""
      }
    }));
    console.log(JSON.stringify(form, null, 2));
  };
  
  

  const handleAddSubCategory = () => {
    const existingKeys = Object.keys(form?.sub_categories);
    const highestNumber = existingKeys.reduce((max, key) => {
      const keyNumber = parseInt(key.replace("sub_category", ""));
      return keyNumber > max ? keyNumber : max;
    }, 0);
    console.log(highestNumber);
    const nextKey = `sub_category${highestNumber + 1}`;
    setForm((prevData) => ({
      ...prevData,
      sub_categories: {
        ...prevData.sub_categories,
        [nextKey]: ""
      }
    }));
  };
  

  const renderInputs = (section, obj) => {
    if (obj && typeof obj === "object") {
    return Object.keys(obj)?.map((key) => (
      <Col xs={12} md={3}>
                  <Form.Group className='mb-3 d-flex' key={key}>
                    <Form.Control
                      value={form[section][key].trimStart()}                     
                      type="text"
                      placeholder={section === "product_attributes" ? "Attribute Name" : "Sub Category Name"}  
                      className="mb-4"                    
                      required={true}
                      onChange={(e) =>
                        handleChange(e, section, key)}
                    />
                    <span className='delete_attribute' onClick={() => handleDelete(section, key)}>&#10005;</span>
        </Form.Group>
      </Col>
    ));
    }
    return null
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(form, null, 2)); 
    const request = {
      ...form,
      "dep_type": "Electronic"
    }
    const response = await dispatch(updateCategory(request));
    if(response?.payload.statusCode === 200){
    setForm(prevData => ({
      ...prevData,
      "ctgr_name": prevData.new_category
    }));
    setDisableButton(true);
    const request = {
      ctgr_name: "",
      ctgr_id: "",
    }
    dispatch(getProductAttributes(request));
    setTimeout(() => {
      navigate(-1)
    }, 2000);
    handleClear();
  }   
  }
  
  useEffect(() => {
    const request = {
      "ctgr_name": ctgr_name,
       "ctgr_id" : ctgr_id,
    }
    dispatch(getProductAttributes(request))
  },[])

  useEffect(() => {
    if(productAttributes !== undefined && productAttributes !== null){
      setForm(productAttributes?.body);
      setForm(preData => ({
        ...preData,
        "ctgr_id": ctgr_id
      })) 
    }
  }, [productAttributes])

  return (
    <>
      <div className='wrap'>
      {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        <div className='d-flex justify-content-between'>
          <h1 className='title-tag'><img src={arw} alt="" className='me-3' onClick={() => navigate(-1)} /> Edit Category</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className='content-sec'>

            <h3 className='inner-tag'>Category <span className='text-danger' > *</span></h3>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type="text"
                    placeholder="Category Name"
                    className="mb-4 add_category_fields"
                    name="new_category"
                    value={form?.new_category?.replace(/\s+/g, ' ').trimStart()}
                    required={true}                   
                    onChange={(e) => handleCategoryChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            
            <div className='d-flex justify-content-between align-items-center mt-4 mb-4'>
              <h3 className='inner-tag'>Sub Category <span className='text-danger' > *</span></h3>
              <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={handleAddSubCategory}>+ Add Sub Category</Button>
            </div>

            <Row> 
                {renderInputs("sub_categories", form?.sub_categories)}
            </Row>


            <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
              <h3 className='inner-tag'>Product Attributes <span className='text-danger' > *</span></h3>
              <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={handleAddAttribute}>+ Add Attribute</Button>
            </div>
            <Row> 
                {renderInputs("product_attributes", form?.product_attributes)}
            </Row>


            <div className='mt-3 d-flex justify-content-end mt-2 pb-3'>
              <Button type="button" className='cancel me-2' onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" className='submit' disabled={disableButton}>Update</Button>
            </div> 
          </div>
        </Form>
      </div>
      <ToastContainer 
        limit={1}
        position="top-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ minWidth: "100px" }}
        onClose={() => setDisableButton(false)}
        transition={Zoom} />
    </>
  )
};

export default Editcategory;
