import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InventoryStock from "./InventoryStock";
import { SlArrowDownCircle } from "react-icons/sl";
import { SlArrowUpCircle } from "react-icons/sl";
import { AiOutlineEnter } from "react-icons/ai";
import Select from "react-select";
import "../styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBomIdsAPI,
  getEstimateBomListAPI,
  getPartsQuantityAPI,
  getclassificationofPartsQauntityAPI,
  getsubcategoryListAPI,
  selectAllBomIdsList,
  selectEstimateBomListData,
  selectIsLoadingInventory,
  selectIsSelectLoading,
  selectPartsQuantity,
  selectPartsQuantityData,
  selectsubcategoriesListData,
} from "../slice/InventorySlice";
import { textToast } from "../../../utils/TableContent";
import { useFetcher } from "react-router-dom";
const Inventory = () => {
  const dispatch = useDispatch();
  const bomIdsList = useSelector(selectAllBomIdsList);
  const estimatebomlist = useSelector(selectEstimateBomListData);
  const isLoading = useSelector(selectIsLoadingInventory);
  const subcategoriesList = useSelector(selectsubcategoriesListData);
  const partsqty = useSelector(selectPartsQuantity);
  const isSelectLoading = useSelector(selectIsSelectLoading);
  const parts_qty = partsqty?.body;
  const subcategories = subcategoriesList?.body;
  const estimatebomdata = estimatebomlist?.body?.parts;
  // console.log(estimatebomlist);
  const bom_ids = bomIdsList?.body;
  // console.log(bom_ids);
  const [bomId, setBomId] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedsubCategoryOption, setSelectedsubCategoryOption] = useState(null);
  const [selectedDepartmentType, setSelectedDepartmentType] = useState("Electronic");
  const [subcategoriesSelect, setSubcategoriesSelect] = useState();
  // console.log(selectedDepartmentType);
  const [estimateqty, setEstimateQty] = useState(1);
  // console.log(estimateqty);
  const sub = [];
  subcategoriesSelect?.forEach(item => {
   Object.keys(item).forEach(key => {
      if (key.startsWith("sub_category")) {
        sub.push({ value: item[key], label: ` ${item[key]}, ${item.mfr_prt_num}`, mfr_part_number: item.mfr_prt_num });
      }
    });
  });
  // console.log(sub);

  const handlesubcategoryChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedsubCategoryOption(selectedOption);
    const request = {
      part_name: selectedOption?.value,
      mfr_prt_num : selectedOption?.mfr_part_number
    };
    dispatch(getclassificationofPartsQauntityAPI(request));
  };

  const handleEstimateQtyChange = (val) => {
    // const newEstimateQty = e.target.value;
    setEstimateQty(val);
  };

  const options = bom_ids?.map((bom) => ({
    value: bom.bom_id,
    label: bom.bom_name,
  }));
  // console.log(options);

  const handleChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
    const request = {
      bom_name: selectedOption?.label,
      bom_id: selectedOption?.value,
      dep_type: selectedDepartmentType,
    };
    dispatch(getEstimateBomListAPI(request));
  };

  const dispatchEstimateBomListAPI = () => {
    
  };
  const filteredBOMs = bom_ids?.filter((bom) =>
    bom.bom_name
      .toLowerCase()
      .includes(selectedOption?.label.toLowerCase().substring(0, 3))
  );

  useEffect(() => {
    dispatch(getAllBomIdsAPI());
    dispatch(getsubcategoryListAPI());

    return () => {
      dispatch(getclassificationofPartsQauntityAPI());
      dispatch(getEstimateBomListAPI());
    };
  }, []);

  useEffect(() => {
    if(!isLoading){
      setSubcategoriesSelect(subcategories);
    }
  })

  useEffect(() => {
    const request = {
      bom_name: selectedOption?.label,
      bom_id: selectedOption?.value,
      dep_type: selectedDepartmentType,
    };
    dispatch(getEstimateBomListAPI(request));
  }, [selectedDepartmentType])

  return (
    <>
      <div className="wrap">
        <div className="bg-content">
          <Row className="mb-3">
            <Col sm={12}>
              <div className="bg-white p-3 shadow-sm cop_main">
                <div className="clasofprts_main">
                  <div>
                    <h6>Classification of Parts</h6>
                  </div>

                  <div>
                    <Select
                      value={selectedsubCategoryOption}
                      onChange={handlesubcategoryChange}
                      options={sub}
                      isSearchable
                      isClearable={true}
                      isLoading={isSelectLoading}
                      placeholder="Search sub-categories"
                      className="ss"
                      styles={{
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? 'transparent' : provided.backgroundColor,
                          color: state.isSelected ? 'inherit' : provided.color,
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }),
                      }}
                    />
                  </div>
                  
                </div>
                <div className="parts-container">
                  <div>
                    <p>
                      <SlArrowDownCircle style={{ marginRight: "5px" }} />
                      Recieved Parts
                      <p style={{ textAlign: "center" }}>
                        {parts_qty?.received_parts || 0}
                      </p>
                    </p>
                  </div>
                  <div>
                    <p>
                      <SlArrowUpCircle style={{ marginRight: "5px" }} />
                      Outgoing Parts
                      <p style={{ textAlign: "center" }}>
                        {parts_qty?.outgoing_parts || 0}
                      </p>
                    </p>
                  </div>
                  <div>
                    <p>
                      <AiOutlineEnter style={{ marginRight: "5px" }} />
                      Returned Parts
                      <p style={{ textAlign: "center" }}>
                        {parts_qty?.returned_parts || 0}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
         
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <div className="bg-white p-3 shadow-sm cop_main">
              
                  <h6>Estimating BOM's</h6>

                  <div className="d-flex">
                  <div>
                  <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                    isSearchable
                    isClearable
                    placeholder="Search by bom_name"
                    className="ss"
                    styles={{
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? 'transparent' : provided.backgroundColor,
                        color: state.isSelected ? 'inherit' : provided.color,
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }),
                    }}
                  />
                  </div>
                  <div className="d-flex align-items-center ms-3">
                  <div>
                    <p className="req_qty">
                      Req Sets<span style={{ color: "red" }}>*</span>
                    </p>
                    <input
                      type="number"
                      className="estimation_bom"
                      min={1}
                      onChange={(e) =>
                        handleEstimateQtyChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div  className="ms-3 me-3 mt-3">
                    <input
                      type="radio"
                      id="electric"
                      value="Electronic"
                      checked={selectedDepartmentType === "Electronic"}
                      onChange={() => {setSelectedDepartmentType("Electronic");}}
                    />
                    <label htmlFor="electric" className="ps-1">Electronic</label>
                  </div>
                  <div className="mt-3">
                    <input
                      type="radio"
                      id="mechanic"
                      value="Mechanic"
                      checked={selectedDepartmentType === "Mechanic"}
                      onChange={() => {setSelectedDepartmentType("Mechanic");}}
                    />
                    <label htmlFor="mechanic" className="ps-1">Mechanic</label>
                  </div>
                  </div>

                  </div>
               
            
                

                <div>
                  <div className="table-responsive mt-4">
                    <Table className="b-table">
                      <thead>
                        {selectedDepartmentType === "Electronic" ?
                        <tr>
                          <th>S.No</th>
                          <th>Manufacturer Part No</th>
                          <th>Manufacturer</th>
                          <th>Category</th>
                          <th>Part Name</th>
                          <th>Req sets qty</th>
                          <th>Qty Per Board</th>
                          <th>Qty in Stock</th>
                          <th>Procure</th>
                        </tr> : (
                          <tr>
                            <th>S.No</th>
                            <th>Part Name</th>
                            <th>Vic Part Number</th>
                            <th>Category</th>
                            <th>Req sets qty</th>
                            <th>Qty Per Board</th>
                            <th>Qty in Stock</th>
                            <th>Procure</th>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                      {isLoading ? (
                           <tr>
                             <td colSpan ="9" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                        {Array.isArray(estimatebomdata) &&
                        estimatebomdata.length > 0 ? (
                          estimatebomdata?.map((item, index) => {
                            const updatedRequiredQty =
                              item?.required_quantity * estimateqty;
                            const procure = updatedRequiredQty > item?.qty ? updatedRequiredQty - item?.qty : "-";
                            return (
                              <tr key={index}> 
                                <td>{index + 1 }</td>
                                <td>{selectedDepartmentType === "Electronic" ? item?.mfr_part_number : item?.part_name}</td>
                                 <td>{selectedDepartmentType === "Electronic" ?item?.manufacturer : item?.vic_part_number}</td>
                                <td>{item?.ctgr_name}</td>
                                {selectedDepartmentType === "Electronic" ? (<td>{item?.sub_category}</td>) : null}
                                <td>{updatedRequiredQty}</td>
                                <td>{item?.required_quantity}</td>
                                <td>{item?.qty}</td>
                                <td>{procure}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">
                              {textToast.noData}
                            </td>
                          </tr>
                        )}
                        </>
                          )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Col>
         
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <div className="bg-white p-3 shadow-sm">
                <InventoryStock></InventoryStock>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Inventory;
