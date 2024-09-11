import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import arw from "../../../assets/Images/left-arw.svg";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/ProductDetails.css";
// import productimg from '../../../assets/Images/product-img.svg';
// import bom from '../../../assets/Images/bom.svg';
// import checklist from '../../../assets/Images/checklist.svg';
// import change from '../../../assets/Images/change.svg';
import pdf from "../../../assets/Images/pdf.svg";
import undo from "../../../assets/Images/undo.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  selectProductDetails,
  selectLoadingState,
  getTop5Vendors,
  selectTop5vendorDetails,
  selectRackDetails,
  rackDetails,
  InventoryUpdateStockDetails,
  DamagedQtyAPI,
  selectDamagedData,
} from "../slice/ComponentSlice";
import { useEffect } from "react";
import PdfDownload from "../../../components/PdfDownload";
import { Form, Modal, Spinner } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ComponentVendorDetails from "./ComponentVendorDetails";
import noImageFound from "../../../assets/Images/noimagefound.jpg";
import { FaStar } from "react-icons/fa";
import { getRackDetailsURL } from "../../../utils/constant";
import ActivityDetails from "./ActivityDetails";
import { Bounce, ToastContainer, Zoom, toast } from "react-toastify";
import Select from 'react-select';
import ReactSelect from "react-select";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ProductDetails = () => {
  const [key, setKey] = useState("productdetails");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoading = useSelector(selectLoadingState);
  const top5VendorsDetails = useSelector(selectTop5vendorDetails);
  const top5vendors = top5VendorsDetails?.body;
  const { details, componentName } = location.state;
  const [show, setShow] = useState(false);
  const [activitydetails, setActivityDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [formfields, setFormfields] = useState(['Quantity', 'date', 'name', 'emp_id', 'description']);
  const getproduct = useSelector(selectProductDetails);
  const productatrr = getproduct?.body?.product_attributes;
  console.log(productatrr);
  const pdfUrl = getproduct?.body?.data_sheet;
  const subcategory = details?.sub_ctgr;
  const categoryname = details?.ctgr_name;
  const cmpt_id = details?.cmpt_id;
  console.log(details?.cmpt_id, "=============");
  const comp_id = location.state?.cmpt_id;
  const DamagedData = useSelector(selectDamagedData);
  const batches = DamagedData?.body;
  console.log(batches, "batches");
  console.log(componentName, "componentName ommm");
  console.log(comp_id, "cmpt_id ommmmmm");
  // console.log(categoryname,"categoryname categoryname categoryname")
  const excludedKeys = ["fail_qty", "rcd_qty", "out_going_qty", "rtn_qty"];
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const handleClose = () => {
    setShow(false);
    setSelectedAction("");
    setIsDropdownVisible(false);
    setFormData({});
    setSelectedOption([]);
  }
  const renderedAttributes =
    productatrr &&
    Object.entries(productatrr).map(
      ([key, value]) =>
        !excludedKeys.includes(key) && (
          <ul key={key}>
            <li>
              {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </li>
            <li>{value}</li>
          </ul>
        )
    );
  const rackData = useSelector(selectRackDetails);
  const racklist = rackData?.body;
  console.log(racklist, "lllllllllll");

  const redirectoCreatePO = () => {
    navigate("/createpo", {
      state: {
        component: "singlecomponent",
        purchaselist: getproduct?.body,
      },
    });
  };
  
  const handleActionChange = async (e) => {
    const {name, value} = e.target;
    setSelectedAction(value);
    let updatedFormFields = [...formfields];
    if (value === "Damaged_Stock" && !updatedFormFields.includes('batch_id')) {
      setIsDropdownVisible(true);
      const request = {
        cmpt_id: cmpt_id,
      }
      await dispatch(DamagedQtyAPI(request)).then((res) => {
        if(res?.payload?.statusCode === 200){
          const data =res?.payload?.body.map(item => ({
            value: item.batchId,
            label: `${item.batchId}-${item.batch_qty}`
        }));
            setOptions(data);
        }
        else{
          return;
        }
      });
    } else if (value === "Add_Stock" || value === "Reduced_Stock") {
      // Remove 'batch_id' if it exists
      updatedFormFields = updatedFormFields.filter(field => field !== 'batch_id');
      setIsDropdownVisible(false);
    }
    setFormfields(updatedFormFields);
    setFormData((prevData) => ({
      ...prevData,
      [name]:value
    }))
  }
  const handleBatchChange = (selected) => {
    const batchIds = selected ? selected.map(option => option.value) : [];
    console.log(batchIds);
    setSelectedOption(selected);
    setFormData((prevValues) => ({
      ...prevValues,
      batch_id: batchIds
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "Quantity"){
      const inHouseQty = getproduct?.body?.qty;
      const numericValue = Number(value);
      if(numericValue > inHouseQty && selectedAction === "Reduced_Stock"){
          toast.error("Can't enter more than In-House Qty");
          return;
      }
    }
    setFormData(prevState => ({
      ...prevState,
      [name]:value
    }));
  };
  console.log(JSON.stringify(formData, null, 2));
  const handleUpdatestockSubmit = (e) => {
    e.preventDefault();
    const request = {
      ...formData,
      cmpt_id: cmpt_id
    }
    dispatch(InventoryUpdateStockDetails(request)).then((response) => {
      if(response?.payload?.statusCode === 200){
        handleClose();
        const request = {
          department: "Electronic",
          ctgr_name: componentName,
          cmpt_id: details?.cmpt_id || comp_id,
        };
        dispatch(fetchProductDetails(request));
      }
    })
    .catch((Err) => {
      console.error(Err);
    })
  }

  const handleActivityDetails = (data) => {
    setActivityDetails(data);
  }

  const exportToExcel = () => {
    if (!activitydetails || activitydetails.length === 0) {
      toast.error("No data available to export.");
      return;
    }
   // Exclude specific keys from the data
   const keysToExclude = ["cmpt_id", "ctgr_id", "used_qty", "lot_no"];
   const filteredActivityDetails = activitydetails.map(item => {
       const filteredItem = { ...item };
       keysToExclude.forEach(key => delete filteredItem[key]);
       return filteredItem;
   });

   const worksheet = XLSX.utils.json_to_sheet(filteredActivityDetails);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

   const excelBuffer = XLSX.write(workbook, {
       bookType: "xlsx",
       type: "array"
   });

   const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
   saveAs(dataBlob, "Activity Details.xlsx");
  };

  useEffect(() => {
    const request = {
      department: "Electronic",
      ctgr_name: componentName,
      cmpt_id: details?.cmpt_id || comp_id,
    };
    dispatch(fetchProductDetails(request));
  }, []);

  useEffect(() => {
    const request = {
      cmpt_id: details?.cmpt_id || comp_id,
    };
    dispatch(getTop5Vendors(request));
  }, []);

  useEffect(() => {
    const request = {
      department: "Electronic",
      cmpt_id: details?.cmpt_id || comp_id,
    };
    dispatch(rackDetails(request));
  }, []);

  const routeedit = (item) => {
    let path = `/editcomponent`;
    navigate(path, {
      state: {
        detailsProp1: details?.cmpt_id || comp_id,
        detailsProp2: componentName,
        checkProctDetails: "productDetails",
      },
    });
  };

  return (
    <>
      <div className="wrap">
        <div className="d-flex position-relative d-flex-mobile-align">
          <h1
            className="title-tag tageclipse"
            title={getproduct?.body?.sub_ctgr}
          >
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => navigate(-1)}
            />
            E - {getproduct?.body?.sub_ctgr}{" "}
          </h1>

          <div className="tab-sec">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab eventKey="productdetails" title="Product Details">
                <div className="productdetails-sec mt-2">
                  <Row>
                    <Col xs={12} md={4}>
                      <div className="product-img">
                        <img
                          src={
                            getproduct?.body?.prt_img !== ""
                              ? getproduct?.body?.prt_img
                              : noImageFound
                          }
                          alt=""
                        />
                      </div>
                    </Col>

                    <Col xs={12} md={4}>
                      <div className="w-100 product-details list-align">
                        <div className="d-flex justify-content-end mb-3">
                          <Button
                            variant="outline-dark"
                            className="editbtn"
                            onClick={() => routeedit()}
                          >
                            Edit details
                          </Button>
                        </div>
                        <ul>
                          <li>PTG Part Number</li>
                          <li>{getproduct?.body?.ptg_prt_num}</li>
                          <li>Category Name</li>
                          <li>{getproduct?.body?.ctgr_name}</li>
                          <li>Manufacturer</li>
                          <li>{getproduct?.body?.mfr}</li>
                          <li>Manufacturer Part No</li>
                          <li>{getproduct?.body?.mfr_prt_num}</li>
                          <li>Value</li>
                          <li>{getproduct?.body?.value}</li>
                          <li>Operating Temperature</li>
                          <li>{getproduct?.body?.opt_tem}</li>
                          <li>Mounting Type</li>
                          <li>{getproduct?.body?.mounting_type}</li>
                          <li>Foot Print/Package</li>
                          <li>{getproduct?.body?.foot_print}</li>

                          <li>Datasheet</li>
                          <li>
                            {pdfUrl !== "" ? (
                              <PdfDownload pdfUrl={pdfUrl} />
                            ) : (
                              "-"
                            )}
                          </li>
                          {/* <li>{pdfUrl !== "" ?  <button  className='pdf-btn' onClick={() => openPDFInNewTab(`data:application/pdf;base64,${pdfUrl}`)}>
                                                                    <img src={pdf} alt="" /> Datasheet
                                                    </button> : "-"}</li> */}
                        </ul>
                      </div>
                    </Col>

                    <Col xs={12} md={4}>
                      <div className="product-qty">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h3 className="qty-tag">QTY.</h3>
                          {/* <div className='d-flex justify-content-between align-items-center'>
                                                        <a><img src={bom} alt='' className='me-2' /></a>
                                                        <a><img src={checklist} alt='' className='me-2' /></a>
                                                        <a><img src={change} alt='' /></a>
                                                    </div> */}
                        </div>

                        <h2 className="amount-tag">{getproduct?.body?.qty}</h2>
                        <h3 className="qty-tag">Inventory place</h3>
                        {racklist &&
                          racklist.inventory_position &&
                          racklist.inventory_position.length > 0 && (
                            <ul className="listrack">
                              {racklist.inventory_position.map(
                                (position, index) => (
                                  <li key={index}>
                                    {position?.inventory_position || "-"}
                                    {index + 1 !=
                                      racklist?.inventory_position?.length && (
                                      <span>,</span>
                                    )}
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                        <div className="mt-3">
                          <Button className="c-btn me-3" onClick={() => setShow(true)}>
                            Update Stock
                          </Button>
                          <Button className="c-btn" onClick={redirectoCreatePO}>
                            Create order
                          </Button>
                        </div>
                        <div className="d-flex justify-content-between align-items-start mt-4 mb-3">
                          <h3 className="qty-tag">Return storage QTY.</h3>
                          {/* <a><img src={undo} alt='' /></a> */}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex">
                            <h2 className="amount-tag">
                              {rackData?.body?.rtn_qty || "-"}
                            </h2>
                            <h4 className="rack-tag ms-2">(Stored)</h4>
                          </div>
                          {/* <div className='d-flex'>
                                                        <h2 className='amount-tag'>4</h2>
                                                        <h4 className='rack-tag ms-2'>(Analysis)</h4>
                                                    </div> */}
                        </div>
                        {/* <h3 className='qty-tag'>Inventory place</h3>
                                                <h4 className='rack-tag'>Rack 4</h4> */}
                      </div>
                      <div className="d-flex justify-content-between align-items-start mt-4 mb-3">
                          <h3 className="qty-tag">Damage QTY.</h3>
                          {/* <a><img src={undo} alt='' /></a> */}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex">
                            <h2 className="amount-tag">
                              {/* {rackData?.body?.rtn_qty || "-"} */}
                            </h2>
                            <h4 className="rack-tag ms-2">(Stored)</h4>
                          </div>
                          </div>
                    </Col>
                  </Row>
                </div>

                <div className="productdetails-sec mt-4">
                  <Row>
                    <Col xs={12} md={8}>
                      <div className="product-details margin-top-align pb-3">
                        <ul className="my-3">
                          <li>Life Cycle</li>
                          <li>{getproduct?.body?.life_cycle}</li>
                          <li>ROHS</li>
                          <li>{getproduct?.body?.rohs}</li>
                          <li>MSL</li>
                          <li>{getproduct?.body?.strg_rcmd}</li>
                          <li>HSN Code</li>
                          <li>{getproduct?.body?.hsn_code}</li>
                          <li>Description</li>
                          <li>{getproduct?.body?.description} </li>
                          {["EOL", "NRND", "Obsolete"].includes(
                            getproduct?.body?.life_cycle
                          ) && (
                            <>
                              <li>EOL Date</li>
                              <li>{getproduct?.body?.eol_date || "-"}</li>
                              <li>RPL Part No</li>
                              <li>{getproduct?.body?.rpl_prt_num || "-"}</li>
                            </>
                          )}
                        </ul>

                        <div className="d-flex justify-content-between align-items-center">
                          <h3 className="attr-tag">Product Attributes</h3>
                        </div>
                        <ul>
                          <li>
                            <b>Type</b>
                          </li>
                          <li>
                            <b>Description</b>
                          </li>
                        </ul>

                        {!isLoading ? (
                          renderedAttributes
                        ) : (
                          <div className="spinner-backdrop">
                            <Spinner
                              animation="grow"
                              role="status"
                              variant="light"
                              lo
                            />
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col xs={12} md={4}>
                      <div className="text-right">
                        <h3 className="qty-tag">Top 5 Vendors</h3>
                        <div className="table-responsive mt-3">
                          <Table className="cp-table">
                            <thead>
                              <tr>
                                <th>Vendor ID</th>
                                <th>MOQ</th>
                                <th>Price Per Pc</th>
                              </tr>
                            </thead>
                            <tbody>
                              {top5vendors && top5vendors.length > 0 ? (
                                top5vendors.map((vendor, index) => (
                                  <tr key={index}>
                                    <td>
                                      {vendor?.vendor_id} <br />
                                      <div className="rating">
                                        {[...Array(5)].map((star, i) => {
                                          const ratingValue = i + 1;
                                          return (
                                            <label key={i}>
                                              <FaStar
                                                className="star"
                                                color={
                                                  ratingValue <= vendor?.rating
                                                    ? "#ffc107"
                                                    : "#000"
                                                }
                                                size={10}
                                              />
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </td>
                                    <td>{vendor?.moq}</td>
                                    <td>&#8377; {vendor?.unit_price}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3} className="text-center">
                                    No Data Available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

               
              </Tab>
              <Tab eventKey="vendordetails" title="Vendor Details">
                {key == "vendordetails" ? (
                  <ComponentVendorDetails cmpt_id={cmpt_id || comp_id} />
                ) : null}
              </Tab>
              <Tab eventKey="activitydetails" title="Activity Details">
                {key === "activitydetails" && (
                  <ActivityDetails cmpt_id={cmpt_id || comp_id} handleActivityDetails={handleActivityDetails} />
                )}
              </Tab>
            </Tabs>
          </div>
          {key === "activitydetails" && (
            <div style={{marginLeft: "150px"}}>
            <Button className="c-btn" onClick={exportToExcel}>Download Details</Button>
          </div>
          )}
        </div>

        <Modal show={show} onHide={handleClose} centered className="update_stock_modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-left update_stock-header w-100">
            Update Product Stock
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleUpdatestockSubmit}>
        <Form.Group className="mb-4">
          <Form.Select name="action" value={selectedAction} onChange={handleActionChange}>
            <option value="">-- Select a option --</option>
            <option value="Add_Stock">Add Stock</option>
            <option value="Reduced_Stock">Reduced Stock</option>
            <option value="Damaged_Stock">Damaged Stock</option>
          </Form.Select>
          </Form.Group>
          {isDropdownVisible && (
        <Form.Group className="mb-4">
          <ReactSelect 
           isMulti 
           options={options} 
           value={selectedOption}
           onChange={handleBatchChange} 
           />
        </Form.Group>
      )}
          <Form.Group>
          {formfields.map((formfield, index) => {
            let inputType;
            let minDate = '';
            let maxDate = '';
            if (formfield === "date") {
                inputType = "date";
                minDate = '1900-01-01';
                maxDate = '2100-12-31';
            } else if (formfield === "Quantity" || formfield === "emp_id") {
                inputType = "number";
            } else {
                inputType = "text";
            }
            return (
            <Form.Control
              key={index}
              type={inputType}
              name={formfield}
              required={true}
              placeholder={formfield.charAt(0).toUpperCase() + formfield.slice(1).replace('_', ' ')}
              onChange={handleChange}
              className="mb-4 "
              min={minDate}
              max={maxDate}
            />
          );
        })}
        </Form.Group>
            <div className='mt-3 d-flex justify-content-end'>
                <Button type="button" className='cancel me-2' onClick={handleClose}>Cancel</Button>
                <Button type="submit" className='submit submit-min'>Submit</Button>
            </div>
        </Form>
        </Modal.Body>
      </Modal>
      </div>

      <ToastContainer
        limit={3}
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
        transition={Bounce}
      />
    </>
  );
};

export default ProductDetails;
