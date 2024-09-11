import React, { useState } from 'react';
import "../styles/AddComponent.css";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Uarw from '../../../assets/Images/u-arw.png'
import { addCategories, getCategories } from '../slice/ComponentSlice';
import { useDispatch } from 'react-redux';
import arw from '../../../assets/Images/left-arw.svg';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useReducer } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import "react-toastify/ReactToastify.min.css";

const initialState = {
  category: "",
  categoryImage: null,
  imageType: "jpg",
  sub_categories: [''],
  product_attributes: ['']
}
const reducer = (state, action) =>{
   switch(action.type) {
    case 'CHANGE': 
    return {...state, [action.field]: action.value};
    case 'UPLOAD_IMAGE': 
     return {...state, categoryImage: action.categoryImage};
    case 'ADD_INPUT': 
      return {...state, sub_categories: [...state.sub_categories, '']}
    case 'REMOVE_INPUT':
      const filteredInputs = state.sub_categories.filter((_, index) => index !== action.index);
      return { ...state, sub_categories: filteredInputs };
      case 'ADD_PRODUCT_ATTRIBUTE':
        return { ...state, product_attributes: [...state.product_attributes, ''] };
      case 'REMOVE_PRODUCT_ATTRIBUTE':
        const filteredProductAttributesInputs = state.product_attributes.filter((_, index) => index !== action.index);
        return { ...state, product_attributes: filteredProductAttributesInputs };
    case 'RESET': 
      return initialState;
    default: 
      return state;
   }
}
const AddCategory = (props) => {
  const navigate = useNavigate();
  const [newattributeFields, setnewAttributeFields] = useState(['']);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [department, setDepartment] = useState("Electronic");
  const [categotyForm, setCategoryForm] = useState({
    "category": "",
    "categoryImage": "",
    "imageType": "jpg"
  });
  /////
  const [state, dispatchAction] = useReducer(reducer, initialState);
  var addCategoryObject = {};
  const dispatch = useDispatch();

  const handleAddAttribute = () => {
    setnewAttributeFields([...newattributeFields, ""]);
  }

  const handleChange = (index, value) => {
    const santiziedValue = value.replace(/[^\w\s]/gi, '');
    const updatedInputs = [...newattributeFields];
    updatedInputs[index] = santiziedValue;
    setnewAttributeFields(updatedInputs);
  }

  const onUpdateField = (e) => {
    const nextFormState = {
      ...categotyForm,
      [e.target.name]: e.target.value.replace(/[^\w\s]/gi, ''),
    };
    setCategoryForm(nextFormState);
  };

  const handleCloseModal = () => {
    props.hide();
  }

  const handleDeleteAttribute = (index) => {
    const deletingInputs = [...newattributeFields];
    deletingInputs.splice(index, 1);
    setnewAttributeFields(deletingInputs);
  }

  const handleDepartment = (e) => {
    setDepartment(e.target.value);
    handleInputChange('category', '');
    dispatchAction({ type: 'RESET' });
    handleCancelImagePreview();
  }
  const handleImageChange = (e) => {
    
    const file = e.target.files[0];
    if (file.type !== "image/jpeg") {
      toast.error("Only JPEG files are allowed");
    }
    else{
    const fileName = file?.name;
    const reader = new FileReader();
    let encodedFile;
    let nextFormState = {};
    reader.onload = (fileOutput) => {
      setImagePreview(reader.result);
      encodedFile = fileOutput.target.result.split(',')[1];
      dispatchAction({type: 'UPLOAD_IMAGE', categoryImage: encodedFile});
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
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const formData = {
      categoryName: state.category,
      category_image: state.categoryImage,
      ct_type: department,
      image_type: "jpg",
      sub_categories: {},
      product_attributes: {},
    }

    state.sub_categories.forEach((inputValue, index) => {
      formData.sub_categories[`sub_category${index + 1}`] = inputValue;
    });
  
    state.product_attributes.forEach((attributeValue, index) => {
      formData.product_attributes[`attribute${index + 1}`] = attributeValue;
    });
    console.log(JSON.stringify(formData, null, 2))
    const response = await dispatch(addCategories(formData));
    if (response.payload?.statusCode === 200){
    handleCancelImagePreview();
    dispatchAction({type: 'RESET'});
    // navigate(-1);
  }
}

  const handleInputChange = (field, value) =>{
      dispatchAction({type: 'CHANGE', field, value});
  }

  const handleAddInput = () => {
    dispatchAction({ type: 'ADD_INPUT' });
  };

  const handleRemoveInput = (index) =>{
    dispatchAction({type: 'REMOVE_INPUT', index});
  }

  const handleAddProductAttribute = () =>{
    dispatchAction({type: 'ADD_PRODUCT_ATTRIBUTE'});
  }
  const handleRemoveProductAttribute = (index) =>{
    dispatchAction({type: 'REMOVE_PRODUCT_ATTRIBUTE', index});
  }
  return (
    <>
      <div className='wrap'>
        <div className='d-flex justify-content-between'>
          <h1 className='title-tag'><img src={arw} alt="" className='me-3' onClick={() => navigate("/components")} /> Add Category</h1>
          <div className='d-flex align-items-center'>
            <Form.Group className='d-flex align-items-center' >
              <Form.Label className='mb-0'>Department</Form.Label>
            <Form.Select
             value={department}
             onChange={handleDepartment} className='ms-2 dep-dropdown'
            >
                <option value="Electronic">Electronic</option>
                <option value="Mechanic">Mechanic</option>
            </Form.Select>
            </Form.Group>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className='content-sec'>

            <h3 className='inner-tag mb-10-align'>Category <span className='text-danger' > *</span></h3>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className='mb-3'>
                  <Form.Control
                    type="text"
                    placeholder="Category Name"
                    className="mb-4 add_category_fields"
                    value={state.category.trimStart()}
                    onChange={(e) => handleInputChange('category',e.target.value)}
                    required={true}                   
                  />
                  <div className="upload-btn-wrapper">
                    {imagePreview ? (
                      <>
                        <div className='image-preview-wrapper'>
                        <img src={imagePreview} alt="img_preview" className="image-preview" />
                        </div>
                        <button className="close" onClick={handleCancelImagePreview}>
                          &times;
                        </button>
                      </>
                    ) : (
                      <button className="btn">
                        <img src={Uarw} alt="" />
                        <span className='uploadtext'> Upload Image</span>
                        <input
                          type="file"
                          name="categoryImage"
                          accept="image/jpeg"
                          onChange={handleImageChange}
                        />
                      </button>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {department === "Electronic" && (
              <>
              <div className='d-flex justify-content-between align-items-center mt-4 mb-4'>
              <h3 className='inner-tag'>Sub Category <span className='text-danger'>*</span></h3>
              <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={handleAddInput} >+ Add Sub Category</Button>
            </div>


            <Row>   
              {state.sub_categories.map((inputValue, index) => (
                <Col xs={12} md={3}>
                <Form.Group className='mb-3 d-flex'>
                  <Form.Control
                    value={inputValue.trimStart()}                     
                    type="text"
                    placeholder="Sub Category Name"  
                    className="mb-4"
                    onChange={(e) => {
                      const updatedInputs = [...state.sub_categories]
                      updatedInputs[index] = e.target.value;
                      dispatchAction({type: 'CHANGE', field: 'sub_categories', value: updatedInputs})
                    }}                    
                    required={true}
                  />
                  <span className='delete_attribute' onClick={() => handleRemoveInput(index)} >&#10005;</span>
                </Form.Group>
              </Col>
              ))}          
            </Row>


            <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
              <h3 className='inner-tag'>Product Attributes<span className='text-danger'>*</span></h3>
              <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={handleAddProductAttribute}>+ Add Attributes</Button>
            </div>
            <Row>
              {state.product_attributes.map((newattributeField, index) => (
                <Col xs={12} md={3}>
                  <Form.Group className='mb-3 d-flex'>
                    <Form.Control
                      value={newattributeField.trimStart()}
                      onChange={(e) => {
                        const updatedInputs = [...state.product_attributes]
                        updatedInputs[index] = e.target.value;
                        dispatchAction({type: 'CHANGE', field: 'product_attributes', value: updatedInputs})
                      }}    
                      type="text"
                      placeholder="Attribute Name"
                      className="mb-4 category-input"
                      required={true}
                    />
                    <span className='delete_attribute' onClick={() => handleRemoveProductAttribute(index)}>&#10005;</span>
                  </Form.Group>
                </Col>
              ))}
            </Row>
              </>
            )}

            {department === "Mechanic" && (
              <>
              <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
              <h3 className='inner-tag'>Product Details</h3>
              <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={handleAddProductAttribute}>+ Add Product details</Button>
            </div>
            <Row>
              {state.product_attributes.map((newattributeField, index) => (
                <Col xs={12} md={3}>
                  <Form.Group className='mb-3 d-flex'>
                    <Form.Control
                      value={newattributeField.trimStart()}
                      onChange={(e) => {
                        const updatedInputs = [...state.product_attributes]
                        updatedInputs[index] = e.target.value;
                        dispatchAction({type: 'CHANGE', field: 'product_attributes', value: updatedInputs})
                      }}    
                      type="text"
                      placeholder="Product Detail Name"
                      className="mb-4 category-input"
                      required={true}
                    />
                    <span className='delete_attribute' onClick={() => handleRemoveProductAttribute(index)}>&#10005;</span>
                  </Form.Group>
                </Col>
              ))}
            </Row>
              </>
            )}
            
            <div className='mt-3 d-flex justify-content-end mt-2 pb-3'>
              <Button type="button" className='cancel me-2' onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" className='submit'>Create</Button>
            </div>
          </div>
        </Form>
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
        transition={Zoom} />
      </div>
    </>
  )
};

export default AddCategory;
