import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import InputGroup from "react-bootstrap/InputGroup";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import Delete from "../../../assets/Images/Delete.svg";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  getBomEdit,
  getSearchcategory,
  getSearchcomponentdata,
  selectBomEditDetails,
  selectLoadingState,
  selectSearchCategory,
  selectSearchcomponentdata,
  updatedBom,
} from "../slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import {
  tableBOM,
  textToast,
  formFieldsVendor,
  tableContent,
} from "../../../utils/TableContent";

const EditBom = () => {
  let i=1;
  let j= 1;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const editBomDetails = useSelector(selectBomEditDetails);
  const isLoading = useSelector(selectLoadingState);
  const state = location.state;
  const BomName = state.bomName;
  const BomId = state.bomId;
  console.log("bomId", BomId);
  const getBomEditDetails = editBomDetails?.body;
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermvalue, setSearchTermvalue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const [errorDisplayed, setErrorDisplayed] = useState(false);
  const getSearch = useSelector(selectSearchCategory);
  const getCategory = useSelector(selectSearchcomponentdata);
  const [key, setKey] = useState("Mechanic");
  const data = getSearch?.body;
  console.log(getBomEditDetails,"----------------");

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

  const searchContainerRef = useRef(null);
  const [form, setForm] = useState({
    bom_id: "",
    bom_name: "",
    description: "",
    created_time: "",
  });

  const updateInputFields = (e) => {
    const { value } = e.target;
    const nextFormState = {
      ...form,
      [e.target.name]: value.trimStart(),
    };
    setForm(nextFormState);
  };

  const handleSubmitBomdata = async (e) => {
    e.preventDefault();
    if (selectedData.length === 0) {
      toast.error("Please add components before updating.");
      return;
    }
    const formData = {
      bom_id: form.bom_id,
      bom_name: form.bom_name,
      description: form.description,
      created_time: form.created_time,
    };
    const M_parts = selectedData
      ? Object.keys(selectedData)
          .filter((partKey) => selectedData[partKey].department === "Mechanic")
          .map((partKey) => ({
            vic_part_number: selectedData[partKey].vic_part_number,
            prdt_name: selectedData[partKey].prdt_name,
            ctgr_name: selectedData[partKey].ctgr_name,
            technical_details: selectedData[partKey].technical_details,
            description: selectedData[partKey].description,
            qty_per_board: selectedData[partKey].qty_per_board,
            ptg_prt_num: selectedData[partKey].ptg_prt_num,
            cmpt_id: selectedData[partKey].cmpt_id,
            ctgr_id: selectedData[partKey].ctgr_id,
            department: selectedData[partKey].department,
            material: selectedData[partKey].material,
          }))
      : [];

    console.log("mParts....", M_parts);
    const E_parts = selectedData
      ? Object.keys(selectedData)
          .filter(
            (partKey) => selectedData[partKey].department === "Electronic"
          )
          .map((partKey) => ({
            mfr_prt_num: selectedData[partKey].mfr_prt_num,
            sub_ctgr: selectedData[partKey].sub_ctgr,
            ctgr_name: selectedData[partKey].ctgr_name,
            qty_per_board: selectedData[partKey].qty_per_board,
            mounting_type: selectedData[partKey].mounting_type,
            ptg_prt_num: selectedData[partKey].ptg_prt_num,
            cmpt_id: selectedData[partKey].cmpt_id,
            ctgr_id: selectedData[partKey].ctgr_id,
            department: selectedData[partKey].department,
            sub_category: selectedData[partKey].sub_category,
            description: selectedData[partKey].description,
            manufacturer: selectedData[partKey].manufacturer,
          }))
      : [];
    console.log("eParts....", E_parts);

    let requestBody = {
      ...formData,
      M_parts,
      E_parts,
    };
    console.log("getMparts", M_parts);
    console.log("getEparts", E_parts);
    console.log("tequest", requestBody);
    await dispatch(updatedBom(requestBody));
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  const handleItemClick = (item) => {
    setSearchTerm(item[0]?.[0]);
    setSearchTermvalue(item[0]?.[1]);    
    setFilteredData([]);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    setSearchTermvalue(searchTerm);

    if (searchTerm.trim().length < 2) {
      setFilteredData([]);
      return;
    }
    const request = {
      category_name: searchTerm,
      component_type: key,
    };
    setFilteredData([]);
    dispatch(getSearchcategory(request));
  };

  const addItem = async () => {
    setFilteredData([]);
    if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
      return;
    }
    const department = key === "Mechanic" ? "Mechanic" : "Electronic";

    const request = {
      category_type: key,
      component_id: searchTerm,
      department: department,
    };

    try {
      const response = await dispatch(getSearchcomponentdata(request));
      const newItem = response.payload?.body;
      console.log(newItem, "newiTEM ");
      if (newItem) {
        if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
          setSelectedProducts([...selectedData, newItem]);
        } else {
          toast.error("Item already added.");
        }
        setSearchTerm("");
        setSearchTermvalue("");
      } else {
        toast.error("Item not found.");
        setSearchTerm("");
        setSearchTermvalue("");
      }
    } catch (error) {
      toast.error("Error adding item.");
      setSearchTerm("");
      setSearchTermvalue("");
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
          console.log(data, "dataaaaaa");

          console.log(filteredCategory, "filtereddddddddddd");
          return filteredCategory.map((item) => [category]);
        }
        return [];
      });
      console.log(searchData, "searchData");

      const flatFilteredData = searchData
        .flat()
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v[0] === value[0]) === index
        );

      setFilteredData(flatFilteredData);
    }
  }, [getSearch]);

  useEffect(() => {
    setSelectedProducts([]);
    const request = {
      bom_name: BomName,
      bom_id: BomId,
    };
    dispatch(getBomEdit(request));
  }, []);

  useEffect(() => {
    if (getBomEditDetails) {
      const electronicParts = Object.values(getBomEditDetails.E_parts).filter(
        (part) => part.department === "Electronic"
      );
      const mechanicParts = Object.values(getBomEditDetails.M_parts).filter(
        (part) => part.department === "Mechanic"
      );
      setSelectedProducts([...electronicParts, ...mechanicParts]);
    }
  }, [getBomEditDetails]);

  useEffect(() => {
    if (getBomEditDetails !== undefined) {
      setForm({
        bom_id: getBomEditDetails?.bom_id,
        bom_name: getBomEditDetails?.bom_name,
        // "bom_price": getBomEditDetails?.bom_price,
        description: getBomEditDetails?.description,
        created_time: getBomEditDetails?.created_time,
      });
    }
  }, [getBomEditDetails]);

  useEffect(() => {
    if (getBomEditDetails !== undefined) {
      setIsDeleteButtonDisabled(getBomEditDetails.status === "Bom_assigned");
    }
  }, [getBomEditDetails]);

  const handleQtyPerBoardChange = (newValue, rowIndex) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        parseInt(newValue, 10) !== 0 &&
        parseInt(newValue, 10) >= 1)
    ) {
      setErrorDisplayed(false);

      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          qty_per_board: newValue === "" ? "" : String(newValue, 10),
        };
        return updatedSelectedData;
      });
    } else {
      if (!errorDisplayed) {
        toast.error("Qty per board must be a non-zero number");
        setErrorDisplayed(true);
      }
    }
  };

  const deleterow = (index, department) => {
    const updatedSelectedData = [...selectedData];
    const filteredData = updatedSelectedData.filter(
      (product, i) => i !== index || product.department !== department
    );
    setSelectedProducts(filteredData);
    console.log(updatedSelectedData, "checkingggggg");
  };
  const handleTabChange = (newTab) => {
    setKey(newTab);
    setSearchTerm("");
    setSearchTermvalue("");
    setFilteredData([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setFilteredData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h3>
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => {
                navigate(-1);
              }}
            />
            {tableBOM.editBOM}
          </h3>
        </div>
        <form onSubmit={handleSubmitBomdata}>
          <div className="content-sec">
            <h5>{tableBOM.bomInfo}</h5>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.bomID}</Form.Label>
                  <Form.Control
                    type="text"
                    name="bom_id"
                    placeholder=""
                    value={form.bom_id}
                    onChange={updateInputFields}
                    required={true}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.bomName}</Form.Label>
                  <Form.Control
                    type="text"
                    name="bom_name"
                    placeholder=""
                    value={form.bom_name.trimStart()}
                    onChange={updateInputFields}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.date}</Form.Label>
                  <Form.Control
                    type="text"
                    name="created_time"
                    placeholder=""
                    value={form.created_time}
                    onChange={updateInputFields}
                    required={true}
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    {tableBOM.description}
                    {textToast.maxlength}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    value={form.description.trimStart()}
                    onChange={updateInputFields}
                    required={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <>
              <div>
                <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                  <div className="position-relative" ref={searchContainerRef}>
                    <InputGroup className="mb-0 search-add search-add-align">
                      <Form.Control
                        placeholder="Search components"
                        aria-label="Search components"
                        aria-describedby="basic-addon2"
                        type="search"
                        value={searchTermvalue.trimStart()}
                        onChange={handleSearch}
                      />
                      <Button
                        variant="secondary"
                        id="button-addon2"
                        disabled={!searchTerm.trimStart() || isDeleteButtonDisabled}
                        onClick={addItem}
                      >
                        {" "}
                        + Add
                      </Button>
                    </InputGroup>
                    <ul className="position-absolute searchul" hidden={searchTermvalue.trim().length==0?true:false}>
                      {filteredData &&
                        filteredData?.map((item, index) => (
                          <li key={index} onClick={() => handleItemClick(item)}>
                            {/* {item[0].join(" , ")} */}
                            {/* {item[0]?.[1]} */}
                            {item[0].slice(1).join(" , ")}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => handleTabChange(k)}
                >
                  <Tab eventKey="Mechanic" title="M-Category Info">
                    {key === "Mechanic" ? (
                      <>
                        <div className="table-responsive mt-4">
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th>S.NO</th>
                                <th>{tableBOM.vicNo}</th>
                                <th>{tableBOM.prodName}</th>
                                <th>{tableBOM.category}</th>
                                <th>{tableBOM.technicalDetails}</th>
                                <th>{tableBOM.description}</th>
                                <th>{tableBOM.qtyPerBoard}</th>
                                <th>{tableContent.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                            {selectedData.length > 0 ? (
                                selectedData.map((product, rowIndex) => (
                                  <tr key={product.mfr_prt_num}>
                                    {product.department === "Mechanic" && (
                                      <>
                                        <td>{i++}</td>
                                        <td>{product?.vic_part_number}</td>
                                        <td>{product?.prdt_name}</td>
                                        <td>{product?.ctgr_name}</td>
                                        <td>{product?.technical_details}</td>
                                        <td>{product?.description}</td>
                                        <td>
                                          {" "}
                                          <input
                                            type="text"
                                            className="input-50"
                                            value={product.qty_per_board}
                                            onInput={(e) => {
                                              e.target.value =
                                                e.target.value.replace( /[^0-9]/g, "" );
                                            }}
                                            onChange={(e) =>
                                              handleQtyPerBoardChange( e.target.value, rowIndex)
                                            }
                                            required
                                          />
                                        </td>
                                        {/* <td
                                          onClick={() =>
                                            deleterow(
                                              rowIndex,
                                              product.department
                                            )
                                          }
                                        >
                                          <img src={Delete} />
                                        </td> */}

<td onClick={() => openDeleteModal(rowIndex, product.department)}>
                                          <img src={Delete} alt="Delete Icon" />
                                        </td>

                                      </>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      {textToast.noData}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                  <Tab eventKey="Electronic" title="E- Category Info">
                    {key == "Electronic" ? (
                      <>
                        <div className="table-responsive mt-4">
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th>S.NO</th>
                                <th>{tableBOM.mfrPartNo}</th>
                                <th>{tableBOM.subCategory}</th>
                                <th>{tableBOM.deviceCat}</th>
                                <th>{tableBOM.qtyPerBoard}</th>
                                <th>{tableBOM.mountingType}</th>
                                <th>{tableContent.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                            {selectedData.length > 0 ? (
                                selectedData.map((product, rowIndex) => (
                                  <tr key={product.mfr_prt_num}>
                                    {product.department === "Electronic" && (
                                      <>
                                        <td>{j++}</td>
                                        <td>{product?.mfr_prt_num}</td>
                                        <td>{product?.sub_category}</td>
                                        <td>{product?.ctgr_name}</td>
                                        <td>
                                          <input
                                            type="text"
                                            className="input-50"
                                            value={product.qty_per_board}
                                            onInput={(e) => {
                                              e.target.value =
                                                e.target.value.replace(
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
                                        <td>{product?.mounting_type}</td>
                                        {/* <td>
                                          <button  onClick={() =>
                                            deleterow(
                                              rowIndex,
                                              product.department
                                            )
                                          }  disabled={isDeleteButtonDisabled}> <img src={Delete} /></button>                                         
                                        </td> */}
                                        <td onClick={() => openDeleteModal(rowIndex, product.department)}>
                                          <img src={Delete} alt="Delete Icon" />
                                        </td>
                                                                               
                                      </>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      {textToast.noData}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                </Tabs>
              </div>
            </>
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              {formFieldsVendor.btnCancel}
            </Button>
            <Button type="submit" className="submit">
              {formFieldsVendor.btnUpdate}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">{formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}

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

export default EditBom;
