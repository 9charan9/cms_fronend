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
  selectSearchCategory,
  getSearchcategory,
  getSearchcomponentdata,
  selectLoadingState,
  addBOM,
  getBomEdit,
  selectBomEditDetails,
} from "../slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { envtypekey } from "../../../utils/common";

const CloneBom = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editBomDetails = useSelector(selectBomEditDetails);
  const isLoading = useSelector(selectLoadingState);
  const state = location.state;
  const BomId = state.bomId;
  console.log("bomId", BomId)
  const getBomEditDetails = editBomDetails?.body;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const getSearch = useSelector(selectSearchCategory);
  const [key, setKey] = useState("Mechanic");
  const data = getSearch?.body
  const searchContainerRef = useRef(null);
  const [form, setForm] = useState({
      "bom_name": "",
      "description": "",
  });

  const updateInputFields = (e) => {
      const { value } = e.target;;
      const nextFormState = {
          ...form,
          [e.target.name]: value,
      };
      setForm(nextFormState);
  }

  const handleClearForm = () => {
    setForm({
      bom_name: "",
      bom_description: "",
    });
    setSearchTerm("")
  }

  const onSubmitBom = async (e) => {
    e.preventDefault();
    const requestBody = {
      env_type: envtypekey,
      bom_name: form.bom_name,
      bom_description: form.description,
      "M-Category_info": selectedData
      .filter((product) => product.department === "Mechanic")
      .map((product, index) => ({
      "cmpt_id": product.cmpt_id,
      "ctgr_id": product.ctgr_id,
      "ctgr_name": product.ctgr_name,
      "department": "Mechanic",
      "description": product.description,
      "vic_part_number": product.vic_part_number,
      "ptg_prt_num": product.ptg_prt_num,
      "technical_details": product.technical_details,
      "prdt_name": product.prdt_name,
      "qty_per_board": product.qty_per_board,
      "material":product.material
        })),
      "E-Category_info": selectedData
      .filter((product) => product.department === "Electronic")
      .map((product) => ({
        "cmpt_id": product.cmpt_id,
        "ctgr_id": product.ctgr_id,
        "ctgr_name": product.ctgr_name,
        "department": "Electronic",
        "description":product.description,
        "mfr_prt_num": product.mfr_prt_num,
        "ptg_prt_num": product.ptg_prt_num,
        "mounting_type":  product.mounting_type,
        "sub_ctgr": product.sub_ctgr,
        "sub_category": product.sub_category,
        "qty_per_board": product.qty_per_board,
        "manufacturer":product.manufacturer
      })),
    };
    const response = await dispatch(addBOM(requestBody));
    if (response.payload?.statusCode === 200) {
        handleClearForm();
      setSelectedProducts([]);
    }
  };

  const handleItemClick = item => {
      setSearchTerm(item[0]?.[0]);
  setFilteredData([]);
  };

  const handleSearch = (event) => {
      const searchTerm = event.target.value;
      setSearchTerm(searchTerm);
  
      if (searchTerm.trim().length < 2) {
        setFilteredData([]);
        return;
      }
      const request = {
        category_name: searchTerm,
        component_type: key ,
      };
      setFilteredData([]);
      dispatch(getSearchcategory(request)) 
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
          console.log(newItem, "newiTEM ")
          if (newItem) {
           console.log( selectedData , "selectedddd dataaaaaa")
           console.log(newItem.cmpt_id," new cmptd ID")
            if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
              setSelectedProducts([...selectedData, newItem]);
              
            } else {
              toast.error("Item already added.");
            }
            setSearchTerm("");
          } else {
            toast.error("Item not found.");
            setSearchTerm("");
          }
        } catch (error) {
          toast.error("Error adding item.");
          setSearchTerm("");
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
          "bom_name": "",
          "bom_id": BomId,
      }
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
              "description": getBomEditDetails?.description,
          })
      }
  }, [getBomEditDetails])

//   const handleQtyPerBoardChange = (newValue, rowIndex) => {
//       if (newValue === '' || (!isNaN(newValue) && String(newValue, 10) !== 0)) {
//           setSelectedProducts((prevSelectedData) => {
//               const updatedSelectedData = [...prevSelectedData];
//               updatedSelectedData[rowIndex] = {
//                   ...updatedSelectedData[rowIndex],
//                   qty_per_board: newValue === '' ? '' : String(newValue, 10),
//               };
//               return updatedSelectedData;
//           });
//       } else {
//           toast.error("Qty per board must be a non-zero number");
//       }
//       console.log(newValue, "quantityyyyyy");
//   };

const [errorDisplayed, setErrorDisplayed] = useState(false);

const handleQtyPerBoardChange = (newValue, rowIndex) => {
    if (newValue === '' || (!isNaN(newValue) && parseInt(newValue, 10) !== 0) && parseInt(newValue, 10) >= 1) {
        // Clear the error message if it was previously displayed
        setErrorDisplayed(false);

        setSelectedProducts((prevSelectedData) => {
            const updatedSelectedData = [...prevSelectedData];
            updatedSelectedData[rowIndex] = {
                ...updatedSelectedData[rowIndex],
                qty_per_board: newValue === '' ? '' : String(newValue, 10),
            };
            return updatedSelectedData;
        });
    } else {
        // Display the error message only if it hasn't been displayed already
        if (!errorDisplayed) {
            toast.error("Qty per board must be a non-zero number");
            setErrorDisplayed(true);
        }
    }
    console.log(newValue, "quantityyyyyy");
};

  const deleterow = (index, department) => {
      const updatedSelectedData = [...selectedData];
      const filteredData = updatedSelectedData.filter((product, i) => i !== index || product.department !== department);
      setSelectedProducts(filteredData);
      console.log(updatedSelectedData, "checkingggggg")
  };
  const handleTabChange = (newTab) => {
      setKey(newTab);
      setSearchTerm('');
      setFilteredData([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        // setSearchTerm("");
        setFilteredData([]); // Close the search list when a click occurs outside
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
                  <h3 className="title-tag">
                      <img
                          src={arw}
                          alt=""
                          className="me-3"
                          onClick={() => {
                              navigate(-1);
                          }}
                      />
                      Duplicate BOM
                  </h3>
              </div>
              <form onSubmit={onSubmitBom}>
                  <div className="content-sec">
                      <h5 className="inner-tag">BOM Info</h5>
                      <Row>
                         
                          <Col xs={12} md={3}>
                              <Form.Group className="mb-4">
                                  <Form.Label>BOM Name</Form.Label>
                                  <Form.Control type="text" name='bom_name' placeholder="" 
                                  value={form.bom_name ? form.bom_name.trimStart() : ''} 
                                  onChange={updateInputFields} required={true} />
                              </Form.Group>
                          </Col>
                          

                          <Col xs={12} md={12}>
                              <Form.Group className="mb-4">
                                  <Form.Label>Description (max 500 characters)</Form.Label>
                                  <Form.Control as="textarea" name="description" rows={3} 
                                  value={form.description ? form.description.trimStart() : ''} onChange={updateInputFields} required={true} />
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
                                              value={searchTerm.trimStart()}
                                              onChange={handleSearch}
                                          />
                                          <Button
                                              variant="secondary"
                                              id="button-addon2"
                                              disabled={!searchTerm.trimStart()}
                                              onClick={addItem}
                                          >
                                              + Add
                                          </Button>
                                      </InputGroup>
                                      <ul className="position-absolute searchul">
                                          {filteredData &&
                                              filteredData?.map((item, index) => (
                                                  <li
                                                      key={index}
                                                      onClick={() => handleItemClick(item)}
                                                  >
                                                      {item[0].join(" , ")}
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
                                                              <th>VIC Part No</th>
                                                              <th>Product Name</th>
                                                              <th>Category</th>
                                                              <th>Technical Details</th>
                                                              <th>Description</th>
                                                              <th>Qty Per Board</th>
                                                              <th>Actions</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          {selectedData.length > 0 ? (
                                                              selectedData.map((product, rowIndex) => (
                                                                  <tr key={product.mfr_prt_num}>
                                                                      {product.department === "Mechanic" && (
                                                                          <>    
                                                                              <td>{rowIndex+1}</td>
                                                                              <td>{product?.vic_part_number}</td>
                                                                              <td>{product?.prdt_name}</td>
                                                                              <td>{product?.ctgr_name}</td>
                                                                              <td>{product?.technical_details}</td>
                                                                              <td>{product?.description}</td>
                                                                              <td> <input
                                                                                  type="text"
                                                                                  className="input-50"
                                                                                  value={product.qty_per_board}
                                                                                  onInput={(e) => {
                                                                                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                                                  }}
                                                                                  onChange={(e) => handleQtyPerBoardChange(e.target.value, rowIndex)}
                                                                                  required
                                                                              /></td>
                                                                              <td onClick={() => deleterow(rowIndex, product.department)}><img src={Delete} /></td>
                                                                          </>
                                                                      )}
                                                                  </tr>
                                                              ))
                                                          ) : (
                                                              <>
                                                                  <tr>
                                                                      <td colSpan="11" className="text-center">
                                                                          No data available
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
                                                              <th>Manufacturer Part No</th>
                                                              <th>Sub Category</th>
                                                              <th>Device Category</th>
                                                              <th>Qty Per Board</th>
                                                              <th>Mounting Type</th>
                                                              <th>Actions</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          {selectedData.length > 0 ? (
                                                              selectedData.map((product, rowIndex) => (
                                                                  <tr key={product.mfr_prt_num}>
                                                                      {product.department === "Electronic" && (
                                                                          <>
                                                                              <td>{rowIndex+1}</td>
                                                                              <td>{product?.mfr_prt_num}</td>
                                                                              <td>{product?.sub_category}</td>
                                                                              <td>{product?.ctgr_name}</td>
                                                                              <td><input
                                                                                  type="text"
                                                                                  className="input-50"
                                                                                  value={product.qty_per_board}
                                                                                  onInput={(e) => {
                                                                                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                                                  }}
                                                                                  onChange={(e) => handleQtyPerBoardChange(e.target.value, rowIndex)}
                                                                                  required
                                                                              /></td>
                                                                              <td>{product?.mounting_type}</td>
                                                                              <td onClick={() => deleterow(rowIndex, product.department)}><img src={Delete} /></td>
                                                                          </>
                                                                      )}
                                                                  </tr>
                                                              ))
                                                          ) : (
                                                              <>
                                                                  <tr>
                                                                      <td colSpan="11" className="text-center">
                                                                          No data available
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
                          Cancel
                      </Button>
                      <Button type="submit" className="submit">
                          Create
                      </Button>
                  </div>
              </form>
          </div>
          {isLoading && (
              <div className="spinner-backdrop">
                  <Spinner animation="border" role="status" variant="light">
                      <span className="visually-hidden">Loading...</span>
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
      </>
  );
};

export default CloneBom;
