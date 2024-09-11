import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs, Modal, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getFinalBoardsDocuments,
  getFinalProducts,
  getFinalProductsData,
  selectGetFinalBoards,
  selectGetFinalDocuments,
  selectGetFinalProducts,
} from "../slice/VendorSlice";
import "../styles/Vendors.css";
import {sendBoardsText} from '../../../utils/TableContent';
import view from "../../../assets/Images/view.svg";
import pdf from "../../../assets/Images/pdf.svg";
const FinalProductTab = ({outward_id, handleSendFinalBoards}) => {
  const dispatch = useDispatch();
  const getData = useSelector(selectGetFinalProducts);
  const finalBoardsDetails = useSelector(selectGetFinalBoards);
  const Documents = useSelector(selectGetFinalDocuments);
  const finalBoarddetails = finalBoardsDetails?.body;
  const documents = Documents?.body;
  console.log(documents);
  const [finalBoarddata, setFinalBoarddata] = useState();
  // Final Info States 
  const [changeStatus,setStatusChange] = useState("All"); 
  console.log(changeStatus);

  const [sendFinalBoards, setSendFinalBoards] = useState({});
  const handleCheckbox = (e, item, productKey,productdata) => {
    const isChecked = e.target.checked;
    console.log(productdata);
    const selectedItems = {...sendFinalBoards}

    if(!selectedItems[productdata]){
      selectedItems[productdata] = {}
    }
    if (isChecked) {
      selectedItems[productdata][productKey]  = { ...item, checked: isChecked};
    }
    else
    {
      delete selectedItems[productdata][productKey];

      if (Object.keys(selectedItems[productdata]).length === 0) {
        delete selectedItems[productdata];
    }
    }
    setSendFinalBoards(selectedItems);
    handleSendFinalBoards(selectedItems);
  }

  console.log(sendFinalBoards);
  const renderTabContent = (productdata) => {
    const productKeys = Object.keys(finalBoarddata[productdata]);
     // Filtering out the "status" key
    const filteredProductKeys = productKeys.filter(key => key !== "status");
    if (filteredProductKeys.length === 0) {
      return <p>No data available for {productdata}</p>
    }
  
    return (
      <div className="table-responsive mt-4">
        <Table className="bg-header">
          <thead>
            <tr>
              <th></th>
              <th>S.No</th>
              <th>Product ID</th>
              <th>PCBA ID</th>
              <th>ALS ID</th>
              <th>Display Number</th>
              <th>SOM ID/ IMEI ID</th>
              <th>ESIM NO</th>
              <th>E-SIM ID</th>
              <th>Date of EMS</th>
              <th>ICT</th>
              <th>FCT</th>
              <th>EOL</th>
              <th>Date of EOL</th>
              <th>EOL Document</th>
              <th>Status</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductKeys.map((productKey, index) => {
              const item = finalBoarddata[productdata][productKey];
              return (
                <tr key={index}>
                  <td>{item?.select_check === true ? (<input type="checkbox" onChange={(e) => handleCheckbox(e, item, productKey, productdata)} />) : null}</td>
                  <td>{index + 1}</td>
                  <td>{item["product_id"] || "-"}</td>
                  <td>{item["pcba_id"] || "-"}</td>
                  <td>{item["als_id"] || "-"}</td>
                  <td>{item["display_number"] || "-"}</td>
                  <td>{item["som_id_imei_id"] || "-"}</td>
                  <td>{item["e_sim_no"] || "-"}</td>
                  <td>{item["e_sim_id"] || "-"}</td>
                  <td>{item["date_of_ems"] || "-"}</td>
                  <td>{item["ict"] || "-"}</td>
                  <td>{item["fct"] || "-"}</td>
                  <td>{item["eol"] || "-"}</td>
                  <td>{item["date_of_eol"] || "-"}</td>
                  <td><a href={item?.eol_document?.doc_url} rel="noreferrer" target="_blank" className="linka">{item["eol_document"]?.doc_name || "-"}</a></td>
                  <td>{item["product_status"] || "-"}</td>
                  <td>{item["comment"] || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };
  
  // Final Info Status Change 
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setStatusChange(value) 
    
    const request = {
      "outward_id" : outward_id,
      "status": value
    }
      dispatch((getFinalProductsData(request)))
    }
  
  useEffect(() => {
    const request = {
      "outward_id":outward_id,
      "status": "All"
    };
    dispatch(getFinalProductsData(request));

    const request2 = {
      "outward_id": outward_id
    }
    dispatch(getFinalBoardsDocuments(request2));
  }, [dispatch, outward_id]);

  useEffect(() => {
    setFinalBoarddata(finalBoarddetails);
  }, [finalBoarddetails])
  // Check if there is an error response
  if (finalBoardsDetails?.statusCode === 404) {
    return (
      <div className='coming-sec'>
            <h4 className='mt-5'>No Data Available</h4>
        </div>
    );
  }
  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative w-100 align-items-end d-flex-mobile mt-5 w-100">
          <div className="d-flex align-items-center w-100">
            <div className="partno-sec vendorpartno-sec w-100">
              <h1 className="title-tag mb-4">{sendBoardsText?.finalInfo}</h1>
            <div style={{display:"flex", justifyContent:"flex-end"}}>
                  <select value={changeStatus} onChange={handleStatusChange}>
                    <option value= "All">All</option>
                    <option value= "EOL">EOL</option>
                    <option value= "Rejected">Rejected</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Product Ready">Product Ready</option>
                  </select>
                </div>
                <div>
                  <Row className="partners-docs">
                    {Array.isArray(documents) ? documents?.map((doc, index) => {
                      return (
                        <Col xs={12} md={2}>
                        <p>{doc?.doc_name}</p>
                        <div className="doc-card position-relative">
                          <div className="pdfdwn">
                              <img src={pdf} alt="" />
                          </div>
                          <div className="doc-sec position-absolute">
                              <div className="d-flex justify-content-between">

                               <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                   <a
                                       href={doc?.doc_url}
                                       target="_blank"
                                       rel="noreferrer"
                                   >
                                       <img src={view} alt="" />
                                   </a>
                               </Button>
                            </div>
                        </div>
                    </div>
                 </Col>
                      )
                    }) : null}
                  </Row>
                </div>
              <div className="tab-sec-sendkit">
                <Tabs id="controlled-tab-example scrollable-tabs">
                  {typeof finalBoarddata === "object" && Object.keys(finalBoarddata).length !== 0  ? (
                    Object.keys(finalBoarddata)?.map((productdata, index) => {
                      return(
                      <Tab
                        eventKey={productdata}
                        title={productdata.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}
                        key={index}
                      >
                        {renderTabContent(productdata)}
                      </Tab>
                    )})
                  ) : (
                    <></>
                  )}
                </Tabs>

                {typeof finalBoarddata === "object" && Object.keys(finalBoarddata).length === 0 ? (
                  <div className='coming-sec'>
                  <h4 className='mt-5'>No Data Available</h4>
              </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinalProductTab;