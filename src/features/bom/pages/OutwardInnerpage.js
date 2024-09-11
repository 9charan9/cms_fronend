import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BomDetails.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import arw from "../../../assets/Images/left-arw.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import {
  selectAllVendorsData,
  selectLoadingState,
  selectOutwardTopInfo,
  outwardTopDetails,
} from "../slice/BomSlice";
import { ToastContainer, Zoom } from "react-toastify";
import "jspdf-autotable";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CategoryInfo from "./CategoryInfo";
import Button from "react-bootstrap/Button";
import BoxBuildingInfo from "./BoxBuildingInfo";
import {
  formFieldsVendor,
  tableBOM,
  tableContent,
} from "../../../utils/TableContent";
import ProductionLineTab from '../../vendors/pages/ProductionLineTab';
import BomBoardsInfo from "./BomBoardsInfo";
import { selectGetSendboards } from "../../vendors/slice/VendorSlice";
import {selectAgainstPO , getagainstPO} from "../../clients/slice/ClientSlice"
import FinalProductTab from "../../vendors/pages/FinalProductTab";

const Outwardinnerpage = () => {
  const a = localStorage.getItem('finalBoardKey') ;
  const [key, setKey] = useState(a || "CategoryInfo");
  const location = useLocation();
  const {outward_id_info, dep_type} = location?.state
  console.log(outward_id_info,dep_type)
  const AllVendors = useSelector(selectAllVendorsData);
  const topDetailsInfo = useSelector(selectOutwardTopInfo);
  console.log(topDetailsInfo, "topDetailsInfotopDetailsInfo");
  const bom_id = topDetailsInfo?.body?.bom_id
  console.log("bom_id", bom_id)
  const quantity = topDetailsInfo?.body?.qty
  console.log("quantityyyy", quantity)
  const vendors = AllVendors.body;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDisable,setDisable]=useState(true)
  const isLoading = useSelector(selectLoadingState);
  const [bomDetailsData, setBomDetailsData] = useState([]);
  const [againstPoValue, setAgainstPoValue] = useState("");
  const [finalBoards, setFinalBoards] = useState({});
  const againstPOdata = useSelector(selectAgainstPO);
  console.log(againstPoValue, "againstPoValueagainstPoValue");
  const getData = useSelector(selectGetSendboards);
    const finalBoarddata = getData?.body;
    console.log("sianl..", finalBoarddata)
    

  const handleBomDetailsData = (data) => {
    setBomDetailsData(data);
  };

  const handleNavigateBack = () => {
    navigate(-1);
    localStorage.setItem("finalBoardKey", "CategoryInfo")
  };
  


  useEffect(() => {
    const requestBody = {
       outward_id: outward_id_info,
       dep_type : dep_type,
    };
    dispatch(outwardTopDetails(requestBody));
  }, [selectOutwardTopInfo]);
  const navigateAssignBoxBuild = () => {
    navigate("/assignBoxBuilding", {
      state: {
        outward_id: outward_id_info,
        bom_id: topDetailsInfo.body?.bom_id,
        qty: topDetailsInfo.body?.qty,
        outwardType : "outwardAssignBoxBuild",
        againstPoValue:againstPoValue
      },
      
    });
  };

  const handleRecieveFinalBoards = (boards) => {
    console.log(JSON.stringify(boards, null, 2))
   setFinalBoards(boards);
  }
  const AssigntoClient = () => {
    navigate("/assigntoclient", { state: { outward_id: outward_id_info,  againstPoValue:againstPoValue , finalBoards: finalBoards, bom_id: bom_id} });
  };

  const renderCommonRow = () => (
    <Row className="bom">
      <Col>
        {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">
          {formFieldsVendor.bomId} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.bom_id}
        </h5> */}
        <h5 className="mb-2 mt-3 bomtag text-667 font-500">
          {tableContent.qty} : {topDetailsInfo && topDetailsInfo.body?.qty}
        </h5>
        <h5 className="bomtag mb-2 text-667 font-500">
          {tableBOM.receiverName} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.receiver_name}
        </h5>
        <h5 className="bomtag mb-2 text-667 font-500">
          {tableBOM.outwardId} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.outward_id}
        </h5>

        <h5 className="bomtag text-667 font-500">
          Partner Name : {" "}
          {topDetailsInfo && topDetailsInfo.body?.partner_name || "-"}
        </h5>
      </Col>
      <Col>
        
        <h5 className="mb-2 mt-3 bomtag text-667 font-500">
          {tableBOM.senderName}:{" "}
          {topDetailsInfo && topDetailsInfo.body?.sender_name}
        </h5>
        <h5 className="bomtag mb-2 text-667 font-500">
          {tableBOM.receiverCnt} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.receiver_contact_num}
        </h5>
        <h5 className="bomtag text-667 font-500">
          {tableBOM.partnerId} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.partner_id}
        </h5>
      </Col>
      <Col>
       
        <h5 className="mb-2 mt-3 bomtag text-667 font-500">
          {tableBOM.senderCnt} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.contact_details}
        </h5>
        <h5 className="bomtag text-667 font-500 mb-2">
          {tableBOM.outwardDate} :{" "}
          {topDetailsInfo && topDetailsInfo.body?.created_date}
        </h5>

        <h5 className="bomtag text-667 font-500">
          Type : {topDetailsInfo && topDetailsInfo.body?.type}
        </h5>
      </Col>
    </Row>
  );



  // ------------Active Tab Selection ---------------//

  useEffect(() => {
    const currentActiveKey = localStorage.getItem("finalBoardKey", key);
    if(currentActiveKey){
    setKey(currentActiveKey);
    }

    return () => {
      localStorage.setItem("finalBoardKey", "CategoryInfo")
    }
  }, []);



  useEffect(()=>{
    const requestBody = 
    {
      bom_id: bom_id
  }
  dispatch(getagainstPO(requestBody))
  },[dispatch, bom_id,selectAgainstPO])
  
  useEffect(()=>{
    if (againstPOdata?.statuscode === 200){
      setAgainstPoValue(againstPOdata?.body?.po_id)
      }
      else if (againstPOdata?.statuscode === 404){
        setAgainstPoValue("NO PO for Bom")
      }
  },[selectAgainstPO, location,dispatch])
  return (
    <>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="grow" role="status" variant="light">
            <span className="visually-hidden">{formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => handleNavigateBack()}
              />
              {outward_id_info}
            </h1>
            <div className="tab-sec">
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => {
                  setKey(k);
                  localStorage.setItem("finalBoardKey", k);
                }}
              >
                <Tab eventKey="CategoryInfo" title="Category Info">
                  {renderCommonRow()}

                  {key == "CategoryInfo" ? (
                    <CategoryInfo
                      id="tableDataOriginalpartnoDetails"
                      props={{ topDetailsInfo: topDetailsInfo ,  againstPoValue:againstPoValue}}
                      onBomDetailsData={handleBomDetailsData}
                    />
                  ) : null}
                </Tab>
                <Tab eventKey="BoardsInfo" title="Boards Info">
                  {renderCommonRow()}
                 
                  {key == "BoardsInfo" ? (<BomBoardsInfo setDisable={setDisable} outward_id={outward_id_info}  againstPoValue= {againstPoValue}></BomBoardsInfo>) : (null)}
                </Tab>
                <Tab eventKey="BoxBuildingInfo" title="Box Building Info">
                  {key == "BoxBuildingInfo" ? (<BoxBuildingInfo outward_id={outward_id_info} againstPoValue= {againstPoValue} bom_Id={bom_id} qnty = {quantity} ></BoxBuildingInfo>) : (null)}
                </Tab>
                
                <Tab eventKey="FinalProductInfo" title="Final Product Info">
                  {renderCommonRow()}
                {key === "FinalProductInfo" ? (<FinalProductTab outward_id={outward_id_info} againstPoValue= {againstPoValue}  handleSendFinalBoards={handleRecieveFinalBoards} />) : null}
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className="mobilemargin-top">
            {key === "FinalProductInfo" && (
              <Button
                className="submit mb-1 submit-block"
                onClick={AssigntoClient}
                disabled={Object.keys(finalBoards).length === 0}
              >
                Assign to Client
              </Button>
            )}
          </div>
          <div className="mobilemargin-top">
            {key === "BoardsInfo" && (
              <Button
                className="submit mb-1 submit-block"
                onClick={navigateAssignBoxBuild}
                disabled={isDisable} >
                Assign to BOX Building
              </Button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        limit={1}
        position="top-center"
        autoClose={1000}
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

export default Outwardinnerpage;