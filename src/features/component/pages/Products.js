import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import arw from "../../../assets/Images/left-arw.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
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
import { tableContent } from "../../../utils/TableContent";
import jsPDF from "jspdf";

const Products = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const location = useLocation();
  const category = useSelector(selectCategory);
  const isLoading = useSelector(selectLoadingState);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);
  const [showSingleDeleteModal, setShowSingleDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  console.log(products.length);
  const { ctgr_id, ctgr_name } = location.state;
  const routecomponent = () => {
    let path = `/components`;
    navigate(path);
  };

  const routeedit = (item) => {
    let path = `/editcomponent`;
    navigate(path, {
      state: {
        prop1: item,
        prop2: ctgr_name,
        checkProducts : "productsPage"
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
      let path = `/productdetails`;
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
      type: "Electronic",
    };
    dispatch(deleteProduct(deleteObject)).then(() => {
      // After deleting, fetch and update the product list
      const request = {
        department: "Electronic",
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
    setSelectAllChecked(false);
    closeDeleteModal();
  };

  const openSingleDeleteModal = (item) => {
    setItemToDelete(item);
    setShowSingleDeleteModal(true);
  };

  const closeSingleDeleteModal = () => {
    setShowSingleDeleteModal(false);
  };

  const uncheckAllCheckboxes = () => {
    setChecked([]);
    setSelectAllChecked(false);
  };
  const handleSingleDelete = (item) => {
    let deleteObject = {
      cmpt_id: [item],
      type: "Electronic",
    };
    dispatch(deleteProduct(deleteObject)).then(() => {
      // After deleting, fetch and update the product list
      const request = {
        department: "Electronic",
        category_name: ctgr_name,
        category_id: ctgr_id,
      };
      dispatch(getProductList(request));
    });
    const updatedProducts = products.filter(
      (product) => product.cmpt_id !== item
    );
    setProducts(updatedProducts);
    // Remove the item's ID from the 'checked' array
    const updatedChecked = checked.filter(
      (checkedItem) => checkedItem !== item
    );
    setChecked(updatedChecked);
    // Check if any checkboxes are checked and set showDeleteButton accordingly
    setShowDeleteButton(updatedChecked.length > 1);
    closeSingleDeleteModal();
    setSelectAllChecked(false);
    // Uncheck all checkboxes
    uncheckAllCheckboxes();
  };

  useEffect(() => {
    if (!isLoading) {
      setProducts(category?.body || []);
    }
  }, [category, isLoading]);

  useEffect(() => {
    const request = {
      department: "Electronic",
      category_name: ctgr_name,
      category_id: ctgr_id,
    };
    dispatch(getProductList(request));
  }, [ctgr_id, ctgr_name, dispatch]);
  useEffect(() => {
    // Check if any checkboxes are checked and set showDeleteButton accordingly
    setShowDeleteButton(checked.length > 0);
    // console.log("checkedddddddddddddd")
  }, [checked]);
 

  // useEffect(() => {
  //   if (listdelete?.body) {
  //     if (
  //       Array.isArray(listdelete.body) &&
  //       listdelete.body.includes("Components Deleted Successfully")
  //     ) {
  //       console.log("Components Deleted Successfully");
  //       const request = {
  //         department: "Electronic",
  //         category_name: ctgr_name,
  //         category_id: ctgr_id,
  //       };
  //       dispatch(getProductList(request));
  //     } else {
  //       console.log("Condition did not match:", listdelete.body);
  //     }
  //   }
  // }, [listdelete, ctgr_name, ctgr_id, dispatch]);

  const generatepdf = () => {
    const doc = new jsPDF();

    // Set the title for the PDF
    doc.text("Quantity Values", 10, 10);

    // Create a data array for the selected items
    const selectedItems = products.filter((item) =>
      checked.includes(item.cmpt_id)
    );

    // Calculate the total sum of quantity for all selected items
    const selectedQtySum = selectedItems.reduce(
      (total, item) => total + item.qty,
      0
    );

    // Create a table for the selected items
    const tableData = selectedItems.map((item) => [item.sub_ctgr, item.qty]);
    tableData.push(["Total Quantity", selectedQtySum]);

    doc.autoTable({
      head: [["Part Name", "Quantity"]],
      body: tableData,
    });

    const pdfDataURL = doc.output("datauristring");

    // Set the PDF data in the state
    setPdfData(pdfDataURL);

    // Show the PDF modal
    setShowPdfModal(true);
  };
  const handleClosePdfModal = () => {
    setShowPdfModal(false);
  };

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img src={arw} alt="" className="me-3" onClick={routecomponent} />
            {ctgr_name}
          </h1>
          {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
          <div className="d-flex align-items-center">
            <div style={{marginRight: "25px"}}>
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
            

            {/* <Button className='border-0' onClick={(e) => generatepdf(e)} >Generate pdf</Button> */}
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
                <th>Manufacturer</th>
                <th>{tableContent?.mfNo}</th>
                <th>{tableContent?.qty}</th>
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
              {Array.isArray(products) && products.length > 0 ? (
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
                        <td>{item.sub_ctgr}</td>
                        <td>{item.ptg_prt_num}</td>
                        <td>{item?.manufacturer}</td>
                        <td>{item.mfr_prt_num}</td>
                        <td>{item.qty}</td>
                        <td>
                          <Button
                            variant="outline-dark"
                            className="filter-btn border-0 p-0 bg-transparent h-auto me-2"
                            onClick={() => routeedit(item)}
                          >
                            {" "}
                            <img src={edit} alt="" />
                          </Button>
                          <Button
                            variant="outline-dark"
                            className="filter-btn border-0 p-0 bg-transparent h-auto"
                            onClick={() => openSingleDeleteModal(item.cmpt_id)}
                          >
                            {" "}
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
          <Modal.Body className="text-center pb-0">
            Are you sure you want to delete ?
          </Modal.Body>
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
          <Modal.Body className="text-center pb-0">
            Are you sure you want to delete?
          </Modal.Body>
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
        <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Generated PDF</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              title="Generated PDF"
              src={pdfData}
              width="100%"
              height="500px"
              frameBorder="0"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePdfModal}>
              Close
            </Button>
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

export default Products;
