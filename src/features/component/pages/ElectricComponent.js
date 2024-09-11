import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import "../styles/Components.css";
import "react-toastify/ReactToastify.min.css";
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, getCategories, replaceCategoryImage, selectCategory, selectDeleteCategory, selectLoadingState, selectProductAttributes, updateCategory } from '../slice/ComponentSlice';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import {toast, ToastContainer, Zoom } from 'react-toastify';
import Upload from '../../../assets/Images/upload.svg';
import noImageFound from '../../../assets/Images/noimagefound.jpg';
import { useNavigate } from "react-router-dom";


const ElectricComponent = () => {
  const [jpegTypeError, setJpegTypeError] = useState(false);
  const dispatch = useDispatch();
  const category = useSelector(selectCategory);
  console.log(category);
  const isLoading = useSelector(selectLoadingState);
  const productAttributes = useSelector(selectProductAttributes);
  const deleteCat = useSelector(selectDeleteCategory);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showimage, setShowimage] = useState(false);
  const [showdelete, setShowdelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  console.log("electronical categoryData", categoryData)
  const [editCategory, setEditCategory] = useState("");
  const [editCategoryForm, setEditCategoryForm] = useState({
    "category_name": "",
    "new_category": "",
  });
  const [updateCategoryObject, setUpdateCategoryObject] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [updateCategoryImage, setUpdatedCategoryImage] = useState({
    "dep_type": "Electronic",
    "category_name": "",
    "img": "",
    "image_type": "jpg"
  });

  useEffect(() => {
    const nextFormState = {
      ...editCategoryForm,
      ["new_category"]: editCategory,
      ["category_name"]: editCategory
    };
    setEditCategoryForm(nextFormState);
    setUpdateCategoryObject({ ...editCategoryForm });
  }, [editCategory, productAttributes])


  useEffect(() => {
    getImageData();
  }, [dispatch]);

  const getImageData = () => {
    const request = {
      "ct_type": "Electronic"
    }
    dispatch(getCategories(request));
  }

  useEffect(() => {
    if (!isLoading) {
      setCategoryData(category?.body);
    }
  }, [category])

  const imageShowModal = async (item) => {
    const nextFormState = {
      ...updateCategoryImage,
      ['category_name']: item
    }
    setUpdatedCategoryImage(nextFormState);
    setShowimage(true);
  }

  const handleCloseimage = async () => {
    setShowimage(false)
  }

  const deleteShowModal = (ctgr_id) => {
    console.log(ctgr_id);
    setCategoryToDelete(ctgr_id);
    setShowdelete(true);
  }

  const handleClosedelete = async () => {
    setCategoryToDelete(null);
    setShowdelete(false);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "image/jpeg") {
      setJpegTypeError(true);
      toast.error("Only jpeg type are allowed");
    } else {
      setJpegTypeError(false);
    const fileName = file?.name;
    const reader = new FileReader();
    let encodedFile;
    let nextFormState = {};
    reader.onload = (fileOutput) => {
      setImagePreview(reader.result);
      encodedFile = fileOutput.target.result.split(',')[1];
      nextFormState = {
        ...updateCategoryImage,
        [e.target.name]: encodedFile,
      };
      setUpdatedCategoryImage(nextFormState);
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

  const onSubmitImage = async (e) => {
    e.preventDefault();
    await dispatch(replaceCategoryImage(updateCategoryImage));
    console.log(updateCategoryImage, 'datadjkgfjdgfkj');
    // Update the categoryData state with the new image data
    const updatedCategoryData = categoryData.map((item) => {
      if (item.ctgr_name === updateCategoryImage.category_name) {
        return {
          ...item,
          ctgr_image: `data:image/${updateCategoryImage.image_type};base64,${updateCategoryImage.img}`,
        };
      }
      return item;
    });

    setCategoryData([...updatedCategoryData]);
    handleCancelImagePreview();
    handleCloseimage();
    // getImageData();

  }

  const handleCategoryDelete = async () => {
    if (categoryToDelete) {
      var deleteCategoryRequest = {
        "ctgr_id": categoryToDelete,
        "type": "Electronic",
      }
      handleClosedelete();
      const response = await dispatch(deleteCategory(deleteCategoryRequest));
      if (response.payload?.statusCode === 200) {
        const updatedCategoryData = categoryData.filter(item => item.ctgr_id !== categoryToDelete);
        setCategoryData(updatedCategoryData);
      }
      else {
        console.log(response.payload?.body);
      }
    }
  }

  const routeeditcategory = (ctgr_id, ctgr_name) => {
    let path = `/editcategory`;
    navigate(path, {
      state: {
        ctgr_id: ctgr_id,
        ctgr_name: ctgr_name
      }
    });
  }
  const routeproducts = (ctgr_id, ctgr_name) => {
    let path = `/products`;
    navigate(path, {
      state: {
        ctgr_id: ctgr_id,
        ctgr_name: ctgr_name
      }
    });
  }
  //  console.log(categoryData);
  return (
    <div className="wrap">
      <div className="search-sec">
        <ul>

          {isLoading ? (
            <div className="spinner-backdrop">
              <Spinner animation="border" role="status" variant="light" />
            </div>
          ) : Array.isArray(categoryData) && categoryData.length > 0 ? (
            categoryData?.map((item, index) => (
              <li key={index}>
                <div className="test">
                  <Dropdown className="options">
                    <Dropdown.Toggle variant="none"><span className='rotated-element'>&#8943;</span></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => routeeditcategory(item.ctgr_id, item.ctgr_name)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => deleteShowModal(item.ctgr_id)}>
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => imageShowModal(item.ctgr_name)}>
                        Replace Image
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="listimg" onClick={() => routeproducts(item.ctgr_id, item.ctgr_name)}>
                  <img src={item.ctgr_image !== "" ? item.ctgr_image : noImageFound} alt={item.ctgr_name} />
                  {/* <img src={item.ctgr_image !== "" ? `data:image/jpeg;base64, ${item.ctgr_image}` : noImageFound} alt={item.ctgr_name} /> */}
                </div>
                <p>{item.ctgr_name}</p>
              </li>
            ))
          ) : (
            <div className='text-center w-100'>No categories to display</div>
          )}

        </ul>
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
        transition={Zoom} />

      <Modal show={showimage} onHide={handleCloseimage} centered>
        <Form onSubmit={onSubmitImage}>
          <Modal.Body>
            <div className="upload-btn-wrapper position-relative">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Image preview" />
                  <button className="close" onClick={handleCancelImagePreview}>
                    &times;
                  </button>
                </>
              ) : (
                <button class="btn">
                  <img src={Upload} alt='' />
                  <input type="file" name="img" accept='image/jpeg' onChange={handleImageChange} required={true} />
                </button>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className='border-0 justify-content-center'>
            <div className='mt-3 d-flex justify-content-end'>
              <Button type="button" className='cancel me-2' onClick={handleCloseimage}>Cancel</Button>
              <Button type="submit" className='submit' onSubmit={onSubmitImage} disabled={jpegTypeError}>Submit</Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showdelete} onHide={handleClosedelete} centered>
        <Modal.Body className='text-center pb-0'>
          Are you sure you want to delete ?
        </Modal.Body>
        <Modal.Footer className='border-0 justify-content-center'>
          <div className='mt-3 d-flex justify-content-center'>
            <Button type="button" className='cancel me-2' onClick={handleClosedelete}>No</Button>
            <Button type="submit" className='submit' onClick={handleCategoryDelete}>Yes</Button>
          </div>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ElectricComponent;
