import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import attachment from "../../../assets/Images/attachment.svg";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import {
 
  createpo,

  serachComponentinPO,
  selectSearchComponentData,
  addComponentinpo,

} from "../slice/PurchaseOrderSlice";

import Toast from "react-bootstrap/Toast";
import { toast } from "react-toastify";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { Spinner } from "react-bootstrap";
import Delete from "../../../assets/Images/Delete.svg";
import { useRef } from "react";


const CreatePurchase = () => {
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
 //addd parts
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermvalue, setSearchTermvalue] = useState("");
  const [selectedData, setSelectedProducts] = useState([]);
  const [totalQtyPerBoard, setTotalQtyPerBoard] = useState(0);
  const [totalUnitPrice, setTotalUnitPrice] = useState(0);
  const [filteredData, setFilteredData] = useState([]);  
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const searchedData = useSelector(selectSearchComponentData); 
  const data = searchedData?.body;
  const searchComponentRef = useRef(null);
  const [calculatedPrices, setCalculatedPrices] = useState([]);
  

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const parts = selectedData.map((item) => ({
      cmpt_id: item.cmpt_id,
      manufacturer: item.manufacturer,
      prdt_name: item.prdt_name,
      description: item.description,
      qty: item.qty,
      ctgr_id: item.ctgr_id
  }));

    const requestBody = {
      parts // Change from array to object
    };

//om

    // Calculate total_qty and total_price
    const totalQtyPerBoard = Object.values(requestBody.parts)
      .reduce((total, part) => total + parseInt(part.qty || 0), 0)
      .toString();
    const totalUnitPrice = Object.values(requestBody.parts)
      .reduce((total, part) => total + (parseFloat(part.price) || 0), 0)
      .toString();

    // Set total_qty as total_qty and total_price as total_price
    requestBody.total_qty = totalQtyPerBoard;
    requestBody.total_price = totalUnitPrice;

    const response = await dispatch(createpo(requestBody));
  };
  

  const handleSearchComponent = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    setSearchTermvalue(searchTerm);

    if (searchTerm.trim().length < 2) {
      setFilteredData([]);
      return;
    }
    const request = {
      name: searchTerm,
     
    };
    setFilteredData([]);
    dispatch(serachComponentinPO(request));
  };

  const handleItemClick = (item) => {
    // console.log(item[0][0]);
    setSearchTerm(item[0]?.[0]);
    setSearchTermvalue(item[0]?.[1]);
    setIsAddButtonDisabled(false);
    setFilteredData([]);
  };

  const addItem = async () => {
    setFilteredData([]);
    if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
      return;
    }

    const request = {
      component_id: searchTerm,
    };
    const newTotalQtyPerBoard = selectedData.reduce(
      (total, product) => total + parseInt(product.qty, 10),
      0
    );
    const newTotalUnitPrice = selectedData.reduce(
      (total, product) => total + parseFloat(product.price),
      0
    );

    // Update state or perform any other necessary actions with the new totals
    setTotalQtyPerBoard(newTotalQtyPerBoard);
    setTotalUnitPrice(newTotalUnitPrice);
    try {
      const response = await dispatch(addComponentinpo(request));
      const newItem = response.payload?.body;
      // console.log(newItem, "newiTEM ")
      if (response.payload?.statusCode!=400) {
        if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
          setSelectedProducts([...selectedData, newItem]);
          setIsAddButtonDisabled(true);
        } else {
          toast.error("Item already added.");
        }
        setSearchTerm("");
        setSearchTermvalue('');
      } else {
        toast.error("Item not found.");
        setSearchTerm("");
        setSearchTermvalue('');
      }
    } catch (error) {
      toast.error("Error adding item.");
      setSearchTerm("");
      setSearchTermvalue('');
    }
  };

  const deleterow = (index) => {
    const updatedSelectedData = [...selectedData];
    updatedSelectedData.splice(index, 1);

    const updatedCalculatedPrices = [...calculatedPrices];
    updatedCalculatedPrices.splice(index, 1);

    // Update state with the modified arrays
    setSelectedProducts(updatedSelectedData);
    setCalculatedPrices(updatedCalculatedPrices);

    const updatedTotalQtyPerBoard = updatedSelectedData.reduce(
      (total, product) => total + parseInt(product.qty),
      0
    );
    const updatedTotalUnitPrice = updatedSelectedData.reduce(
      (total, product) => total + parseFloat(product.price),
      0
    );

    // Update state with the new totals
    setTotalQtyPerBoard(updatedTotalQtyPerBoard);
    setTotalUnitPrice(updatedTotalUnitPrice);
  };

  const [errorDisplayed, setErrorDisplayed] = useState(false);

  const handleQtyPerBoardChange = (newValue, rowIndex) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        parseInt(newValue, 10) !== 0 &&
        parseInt(newValue, 10) >= 1)
    ) {
      // Clear the error message if it was previously displayed
      setErrorDisplayed(false);
      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          qty: newValue === "" ? "" : String(newValue, 10),
        };
        const updatedCalculatedPrices = [...calculatedPrices];
        updatedCalculatedPrices[rowIndex] = calculatePricePerPiece(
          newValue,
          updatedSelectedData[rowIndex].price
        );
        setCalculatedPrices(updatedCalculatedPrices);
        const updatedTotalQtyPerBoard = calculatedPrices.reduce(
          (total, price, index) => {
            const qty = parseInt(updatedSelectedData[index]?.qty, 10) || 0;
            return total + qty;
          },
          0
        );
        setTotalQtyPerBoard(updatedTotalQtyPerBoard);
        return updatedSelectedData;
      });
    } else {
      // Display the error message only if it hasn't been displayed already
      if (!errorDisplayed) {
        toast.error("Qty per board must be a non-zero number");
        setErrorDisplayed(true);
      }
    }
  };

  const handlePriceChange = (newValue, rowIndex) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        parseFloat(newValue, 10) !== 0 &&
        parseFloat(newValue, 10) >= 1)
    ) {
      // Clear the error message if it was previously displayed
      setErrorDisplayed(false);
      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          price: newValue === "" ? "" : String(newValue, 10),
        };
        const updatedCalculatedPrices = [...calculatedPrices];
        updatedCalculatedPrices[rowIndex] = calculatePricePerPiece(
          updatedSelectedData[rowIndex].qty,
          newValue
        );
        setCalculatedPrices(updatedCalculatedPrices);
        const updatedTotalUnitPrice = calculatedPrices.reduce(
          (total, price, index) => {
            const unitPrice =
              parseFloat(updatedSelectedData[index]?.price) || 0;
            return total + unitPrice;
          },
          0
        );
        setTotalUnitPrice(updatedTotalUnitPrice);
        return updatedSelectedData;
      });
    } else {
      // Display the error message only if it hasn't been displayed already
      if (!errorDisplayed) {
        toast.error("Price must be a non-zero number");
        setErrorDisplayed(true);
      }
    }
  };

  const calculatePricePerPiece = (qtyPerBoard, unitPrice) => {
    const qty = parseInt(qtyPerBoard, 10);
    const price = parseFloat(unitPrice);
    return isNaN(qty) || isNaN(price) || qty === 0
      ? ""
      : (price / qty).toFixed(2);
  };

 
//ommm
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action of the Enter key
    }
  };
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const searchData = data.map((category) => {
        if (Array.isArray(category) && category.length > 0) {
          const filteredCategory = category.filter(
            (item) =>
              typeof item === "string" &&
              item.toLowerCase().includes(searchTerm.toLowerCase())
          );
          // console.log(filteredCategory, "filtereddddddddddd");
          return filteredCategory.map((item) => [category]);
        }
        return [];
      });

      const flatFilteredData = searchData
        .flat()
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v[0] === value[0]) === index
        );

      setFilteredData(flatFilteredData);
    }
  }, [searchedData]);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchComponentRef.current &&
        !searchComponentRef.current.contains(event.target)
      ) {
        setFilteredData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

 

 

  useEffect(() => {
    if (selectedData?.length === 0) {
      setTotalQtyPerBoard(0);
      setTotalUnitPrice(0);
    }
  }, [selectedData]);

  useEffect(() => {
    // Calculate totals on initial render
    let totalQty = 0;
    let totalPrice = 0;

    selectedData?.forEach((product) => {
      totalQty += Number(product.qty || 0);
      totalPrice += parseFloat(product.price || 0);
    });

    setTotalQtyPerBoard(totalQty);
    setTotalUnitPrice(totalPrice);
  }, [selectedData]);

 // modal delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);

  const openDeleteModal = (rowIndex, department) => {
    setDeleteRowIndex(rowIndex);
    setDeleteDepartment(department);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteRowIndex(null);
    setDeleteDepartment(null);
  };

  const confirmDelete = () => {
    // Perform the delete action
    if (deleteRowIndex !== null && deleteDepartment !== null) {
      deleterow(deleteRowIndex, deleteDepartment);
    }
    handleCloseDeleteModal();
  }

  return (
    <>
      <div className="wrap">
     
        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            
                <div className="d-flex justify-content-end align-center d-flex-mobile-align">
                  <div className="position-relative">
                    <InputGroup
                      className="mb-0 search-add search-add-align"
                      ref={searchComponentRef}
                    >
                      <Form.Control
                        placeholder="Search components"
                        aria-label="Search components"
                        aria-describedby="basic-addon2"
                        type="search"
                        value={searchTermvalue.trimStart()}
                        onChange={handleSearchComponent}
                        onKeyDown={handleKeyPress}
                      />
                      <Button
                        variant="secondary"
                        id="button-addon2"
                        disabled={!searchTerm.trim() || isAddButtonDisabled}
                        onClick={addItem}
                      >
                        + Add
                      </Button>
                    </InputGroup>
                    <ul className="position-absolute searchul" hidden={searchTermvalue.trim().length==0?true:false}>
                      {filteredData ? (
                        filteredData?.map((item, index) => (
                          <li key={index} onClick={() => handleItemClick(item)}>                         
                            {item[0].slice(1).join(" , ")}
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <div>
                              <Spinner
                                animation="border"
                                role="status"
                                variant="dark"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
           
              <div className="table-responsive mt-4">
                <h5 className="inner-tag">Adding products to purchase list</h5>
                <Table className="bg-header">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Manufacturer Part No</th>
                      <th>Part Name</th>
                      <th>Description</th>                     
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Price per piece</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData?.length > 0 ? (
                      selectedData?.map((product, rowIndex) => (
                        <tr key={product.mfr_prt_num}>
                          <td>{rowIndex + 1}</td>
                          <td>{product?.mfr_prt_num}</td>
                          <td>{product?.prdt_name}</td>
                          <td>{product?.description}</td>
                        
                          <td>                          
                            <input
                              type="text"
                              className="input-50"
                              min={1}
                              value={product.qty}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              onChange={(e) =>
                                handleQtyPerBoardChange(
                                  e.target.value,
                                  rowIndex
                                )
                              }
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-50"
                              min={1}
                              value={product?.price}
                              pattern="^\d+(\.\d+)?$"
                              step="any"
                              onChange={(e) =>
                                handlePriceChange(e.target.value, rowIndex)
                              }
                              required={true}
                            />
                          </td>

                          <td>
                            {calculatedPrices[rowIndex] !== undefined
                              ? calculatedPrices[rowIndex]
                              : "-"}
                          </td>

                          {/* <td
                            onClick={() =>
                              deleterow(rowIndex, product.mfr_prt_num)
                            }
                          >
                            <img src={Delete} />
                          </td> */}
                          <td onClick={() => openDeleteModal(rowIndex, product.department)}>
                            <img src={Delete} alt="Delete Icon" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td colSpan="11" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{totalQtyPerBoard}</td>
                      <td>{totalUnitPrice}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
           
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="submit">
             Create
            </Button>
          </div>
        </form>
      </div>
     

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Body>
          Are you sure you want to delete the selected item?
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <div className="mt-3 d-flex justify-content-center">
            <Button
              type="button"
              className="cancel me-2"
              onClick={handleCloseDeleteModal} >
              No
            </Button>
            <Button type="submit" className="submit" onClick={confirmDelete}>
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>


    </>
  );
};

export default CreatePurchase;
