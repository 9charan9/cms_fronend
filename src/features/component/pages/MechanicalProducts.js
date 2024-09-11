import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import arw from "../../../assets/Images/left-arw.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import filter from "../../../assets/Images/filter.svg";
import edit from "../../../assets/Images/edit.svg";
import Delete from "../../../assets/Images/Delete.svg";
import "../styles/Products.css";
import Table from "react-bootstrap/Table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getProductList,
  selectCategory,
  selectLoadingState,
  selectListDelete,
} from "../slice/ComponentSlice";
import { Spinner } from "react-bootstrap";
import { ToastContainer, Zoom } from "react-toastify";
import { tableContent, textToast } from "../../../utils/TableContent";

const MechanicalProducts = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const location = useLocation();
  const category = useSelector(selectCategory);
  const listdelete = useSelector(selectListDelete);
  const isLoading = useSelector(selectLoadingState);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [showSingleDeleteModal, setShowSingleDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const { ctgr_id, ctgr_name } = location.state;
  console.log(ctgr_id, ctgr_name)

  const routecomponent = () => {
    navigate('/components?tab=mechanicComponent');
  };

  const routeedit = (item) => {
    let path = `/editMechanicComponent`;
    navigate(path, {
      state: {
        prop1: item,
        prop2: ctgr_name,
        mechanicProducts : "mechanicalProductDetails"
      },
    });
  };

  const handleTableRowClick = (event, item) => {
    const { tagName } = event.target;
    // Check if the clicked element is a <td> and is not the first or last child
    if (
      tagName === "TD" &&
      !event.target.parentElement.firstChild.isEqualNode(event.target) &&
      !event.target.parentElement.lastChild.isEqualNode(event.target)
    ) {
      // Perform the navigation here
      let path = `/productdetailsmech`;
      navigate(path, {
        state: { details: item, componentName: ctgr_name },
      });
    }
  };

  const handleCheckbox = (e) => {
    console.log("handleCheckbox - Before:", { selectAllChecked, checked });
    if (selectAllChecked) {
      setSelectAllChecked(false);
      setChecked([]);
    } else {
      // If "Select All" is unchecked, check it and select all items.
      setSelectAllChecked(true);
      const allItemIds = products.map((item) => item.cmpt_id);
      setChecked(allItemIds);
    }
    console.log("handleCheckbox - After:", { selectAllChecked, checked });
  };

  const handleCheck = (event, item) => {
    console.log("handleCheck - Before:", { checked });
    let updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, item];
    } else {
      updatedList.splice(checked.indexOf(item), 1);
    }
    setChecked(updatedList);
    console.log("handleCheck - After:", { checked });
    setSelectAllChecked(updatedList.length === products.length);
  };

  const openDeleteModal = (items) => {
    setItemsToDelete(items);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const handleDelete = () => {
    let deleteObject = {
      cmpt_id: checked,
      type: "Mechanic",
    };
    dispatch(deleteProduct(deleteObject)).then(() => {
      // After deleting, fetch and update the product list
      const request = {
        department: "Mechanic",
        category_name: ctgr_name,
        category_id: ctgr_id,
      };
      dispatch(getProductList(request));
    });
    const updatedProducts = products.filter(
      (product) => !checked.includes(product.cmpt_id)
    );
    setProducts(updatedProducts);
    setChecked([]);
    setShowDeleteButton(false);
    closeDeleteModal();
    setSelectAllChecked(false);
  };
  const openSingleDeleteModal = (item) => {
    setItemToDelete(item);
    setShowSingleDeleteModal(true);
  };

  const closeSingleDeleteModal = () => {
    setShowSingleDeleteModal(false);
  };

  const handleSingleDelete = (item) => {
    let deleteObject = {
      cmpt_id: [item],
      type: "Mechanic",
    };
    dispatch(deleteProduct(deleteObject)).then(() => {
      // After deleting, fetch and update the product list
      const request = {
        department: "Mechanic",
        category_name: ctgr_name,
        category_id: ctgr_id,
      };
      dispatch(getProductList(request));
    });

    // Filter out the deleted item from the products
    const updatedProducts = products.filter(
      (product) => product.cmpt_id !== item
    );
    setProducts(updatedProducts);
    // Update the 'checked' state by removing the item's ID
    const updatedChecked = checked.filter(
      (checkedItem) => checkedItem !== item
    );
    setChecked(updatedChecked);
    // Check if any checkboxes are checked and set showDeleteButton accordingly
    const anyChecked = updatedChecked.length > 0;
    setShowDeleteButton(anyChecked);
    // Clear the 'checked' state, uncheck all checkboxes, and reset 'selectAllChecked'
    setChecked([]);
    setSelectAllChecked(false);
    closeSingleDeleteModal();
  };

  useEffect(() => {
    if (!isLoading) {
      setProducts(category?.body || []);
    }
  }, [category, isLoading]);

  useEffect(() => {
    const request = {
      department: "Mechanic",
      category_name: ctgr_name,
      category_id: ctgr_id,
    };
    dispatch(getProductList(request));
  }, [ctgr_id, ctgr_name, dispatch]);
  useEffect(() => {
    setShowDeleteButton(checked.length > 0);
  }, [checked]);

  // useEffect(() => {
  //   if (listdelete?.body) {
  //     if (
  //       Array.isArray(listdelete.body) &&
  //       listdelete.body.includes("Component Deleted Successfully")
  //     ) {
  //       console.log("Component Deleted Successfully");
  //       const request = {
  //         department: "Mechanic",
  //         category_name: ctgr_name,
  //         category_id: ctgr_id,
  //       };
  //       dispatch(getProductList(request));
  //     } else {
  //       console.log("Condition did not match:", listdelete.body);
  //     }
  //   }
  // }, [listdelete, ctgr_name, ctgr_id, dispatch]);

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
        
          <h1 className="title-tag">
            <img src={arw} alt="" className="me-3" onClick={routecomponent} />
            {ctgr_name}
          </h1>
          
          <div className="d-flex justify--content-evenly align-items-center">
          <div style={{marginRight: "10px"}}>
            <h5>Total Component's Count : {products.length}</h5>
            </div>
            {showDeleteButton && (
              <Button
                variant="outline-dark"
                className="delete-btn border-0 me-4"
                onClick={() => openDeleteModal(itemsToDelete)}
              >
                Delete
              </Button>
            )}

            <Button variant="outline-dark" className="filter-btn border-0 p-0">
              Fiter <img src={filter} alt="" />
            </Button>
          </div>
        </div>

        <div className="table-responsive mt-4">
          <Table className="c-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckbox(e)}
                    checked={selectAllChecked}
                  />
                </th>
                <th>{tableContent?.partName}</th>
                <th>{tableContent?.ptg}</th>
                <th>{tableContent?.mfNo}</th>
                <th>{tableContent?.qty}</th>
                <th>Material</th>
                <th>{tableContent?.actions}</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                           <tr>
                             <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
              {Array.isArray(products) ? (
                products?.length > 0 ? (
                  products?.map((item, index) => {
                    return (
                      <tr
                        onClick={(e) => handleTableRowClick(e, item)}
                        key={index}
                      >
                        <td>
                          <input
                            type="checkbox"
                            onChange={(e) => handleCheck(e, item.cmpt_id)}
                            checked={checked.includes(item.cmpt_id)}
                          />
                        </td>
                        <td>{item.prdt_name}</td>
                        <td>{item.ptg_prt_num}</td>
                        <td>{item.mfr_prt_num}</td>
                        <td>{item.qty}</td>
                        <td>{item.material}</td>
                        <td>
                          <Button
                            variant="outline-dark"
                            className="filter-btn border-0 p-0 bg-transparent h-auto me-2"
                            onClick={() => routeedit(item)}
                          >
                            <img src={edit} alt="" />
                          </Button>
                          <Button
                            variant="outline-dark"
                            className="filter-btn border-0 p-0 bg-transparent h-auto"
                            onClick={() => openSingleDeleteModal(item.cmpt_id)}
                          >
                            <img src={Delete} alt="" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {tableContent?.nodata}
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                    <td colSpan="7" className="text-center">
                      {tableContent?.nodata}
                    </td>
                  </tr>
              )}
              </>
                          )}
            </tbody>
          </Table>
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
        />

        <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
          <Modal.Body className="text-center pb-0">{textToast ?.deletetext}</Modal.Body>
          <Modal.Footer className="border-0 justify-content-center">
            <div className="mt-3 d-flex justify-content-center">
              <Button
                type="button"
                className="cancel me-2"
                onClick={closeDeleteModal}
              >
                No
              </Button>
              <Button type="submit" className="submit" onClick={handleDelete}>
                Yes
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showSingleDeleteModal}
          onHide={closeSingleDeleteModal}
          centered
        >
          <Modal.Body className="text-center pb-0">{textToast ?.deletetext}</Modal.Body>
          <Modal.Footer className="border-0 justify-content-center">
            <div className="mt-3 d-flex justify-content-center">
              <Button
                type="button"
                className="cancel me-2"
                onClick={closeSingleDeleteModal}
              >
                No
              </Button>
              <Button
                type="submit"
                className="submit"
                onClick={() => handleSingleDelete(itemToDelete)}
              >
                Yes
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
      {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
    </>
  );
};

export default MechanicalProducts;
