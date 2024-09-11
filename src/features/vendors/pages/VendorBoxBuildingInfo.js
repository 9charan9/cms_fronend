import React , { useEffect, useState }  from 'react'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {useNavigate, useLocation } from "react-router-dom";
import {useDispatch, useSelector } from 'react-redux';
import { getBoxBuildingInfoDetails, selectGetBoxBuildingData } from '../slice/VendorSlice';

const VendorBoxBuildingInfo = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const kit1Details = props?.props?.topDetailsInfo?.body
  // const quantity  = props?.props?.topDetailsInfo?.qty
  console.log(kit1Details , "kit1Detailskit1Detailskit1Details")
  const kits = kit1Details?.KITS;
  const type = kit1Details?.type;
  const bom_id = props?.bom_Id;
  console.log("bomid", bom_id);
  const qty = kit1Details?.qty
  const quantity = props?.qnty
  console.log("qtyyyyyyyyyyyyyy", quantity)
  const [key, setKey] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [balanceQty, setBalanceQty] = useState("")
  const getData = useSelector(selectGetBoxBuildingData);
  const outward_id = props?.outwardID
  console.log(outward_id)
  console.log("getDatatttt", getData);
  const body = getData?.body
  const boards = body?.boards || "";
  const getMparts = getData?.body || "";
  console.log("getMparts....", getMparts)
  const qntities = location?.state?.qty;

  useEffect(() => {
    const mKitTabKey = Object.keys(getMparts || {}).find(kitKey => kitKey.startsWith("M_KIT"));
    if (mKitTabKey) {
      setKey(mKitTabKey);
    }
  }, [getMparts]);

  const [mcategoryBatchNoValues, setMCategoryBatchNoValues] = useState([]);
  const [mcategoryProvidedQty, setMCategoryProvidedQty] = useState([]);

  const handleBatchNoChange = (e, index) => {
    const newValues = [...mcategoryBatchNoValues];
    newValues[index] = e.target.value;
    setMCategoryBatchNoValues(newValues);
  };

  const handleProvidedQtyChange = (e, index) => {
    const newValues = [...mcategoryProvidedQty];
    newValues[index] = parseInt(e.target.value, 10) || 0;
    setMCategoryProvidedQty(newValues);
  };
  
  useEffect(() => {
    const request = {
      "outward_id": outward_id,
       "bom_id" : bom_id
    }
     dispatch(getBoxBuildingInfoDetails(request))
  },[])

  const [selectedBoards, setSelectedBoards] = useState({});


  const Sendkit = () =>{
    navigate("/sendkit", {state:{outward_id:outward_id , bom_id:bom_id, type:type}})
  }

  const SendSample = () =>{
    // navigate("/assinBoxBuilding", {state:{outward_id:outward_id}})
    navigate("/assignBoxBuilding", {
      state: {
        outward_id: outward_id,
        bom_id: bom_id,
        qty : quantity,
        type: "sendBoxBuildingInfo"
      },
    });
  }

  const renderMpartsTabContent = (kitKey) => {
    if (!getMparts?.boards) {
      return <p>No content available for this kit</p>;
    }
    const kitData = getMparts[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");
    const currentTab = "M_KIT1";

    const finalProduct = kitKey.startsWith("M_KIT");
    if (finalProduct) {
      const headers = kitKey.startsWith("M_KIT") ?
        [
          "VIC Part No",
          "Part Name",
          "Material",
          "Technical Details",
          "Description",
          "Qty Per Board",
          "Batch No",
          "Provided Qty",
        ] : []
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("M_KIT")) {
          return (
            <>
              {/* <td>{index + 1}</td> */}
              <td>{part?.vic_part_number}</td>
              <td>{part?.prdt_namel}</td>
              <td>{part?.material}</td>
              <td>{part?.technical_details}</td>
              <td>{part?.description}</td>
              <td>
                <input
                className="input-50"
                type="number"
                value={part?.qty_per_board || 0}
                />
              </td>
              <td>
                <input
                className="input-50"
                value={part?.batch_no}
                />
              </td>
              <td>
                <input
                className="input-50"
                type="number"
                value={part?.provided_qty || 0}/>
              </td>
              {/* <td>{part?.qty_per_board || 0}</td>
              <td>{part?.batch_no}</td>
              <td>{part?.provided_qty}</td> */}
              {/* <td>{}</td> */}
              {/* {currentTab === "M_KIT1" ? (
                <>
                <td>{parseInt(part?.qty_per_board * qntities) || 0}</td>
                </>
              ) : (
                <>
                <td>{part?.qty_per_board}</td>
                </>
              )} */}

              {/* <td><input className="input-50" value={mcategoryBatchNoValues[index]?.trimStart()} onChange={(e) => handleBatchNoChange(e, index)} required={true} /></td>
              <td><input className="input-50" type="number" min={0} value={mcategoryProvidedQty[index]} onChange={(e) => handleProvidedQtyChange(e, index)} required={true} /></td>
              <td>{parseInt(mcategoryProvidedQty[index] - parseInt(part?.qty_per_board * qntities)) || 0}</td> */}
            </>
          );
        }
        else {
          return <></>;
        }
      };
      return (
        <div className="table-responsive mt-4" id="tableData">
          <Table className="bg-header">
            <thead>
              <tr>
                {headers.map((header, index) => (

                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(kitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) // Sort the keys
                .map((partKey, index) => {
                  const part = kitData[partKey];
                  return (
                    <tr key={index}>
                      {renderDataFields(part, index)}
                    </tr>)
                })}
            </tbody>
          </Table>
        </div>
      );
    }
    else {
      console.log("no dataaaaaa")
    }
  };

  const renderTabContent = (kitKey) => {
    if (!body?.boards) {
      return <p>No content available for this kit</p>;
    }
    const kitData = body.boards[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");

    const finalProduct = kitKey.startsWith("boards_kit");
    if (finalProduct) {
      const headers = kitKey.startsWith("boards_kit") ?
        [
          "S.No",
          "SVIC PCBA",
          "ALS PCBA",
          "Display Number",
          "SOM ID/IMEI ID",
          "E SIM No",
          "E SIM ID"
        ] : []
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("boards_kit")) {
          return (
            <>
              <td>{index + 1}</td>
              <td>{part?.svic_pcba}</td>
              <td>{part?.als_pcba}</td>
              <td>{part?.display_number}</td>
              <td>{part?.som_id_imei_id}</td>
              <td>{part?.e_sim_no}</td>
              <td>{part?.e_sim_id}</td>
            </>
          );
        }
        else {
          return <></>;
        }
      };
      return (
        <div className="table-responsive mt-4" id="tableData">
          <Table className="bg-header">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(kitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) // Sort the keys
                .map((partKey, index) => {
                  const part = kitData[partKey];
                  return (
                    <tr key={index}>
                      {renderDataFields(part, index)}
                    </tr>)
                })}
            </tbody>
          </Table>
        </div>
      );
    }
    else {
      console.log("no dataaaaaa")
    }
  };

  const [selectedParts, setSelectedParts] = useState([]);
  useEffect(() => {
    if (boards) {
      const tableBorads = Object.values(body?.boards || {})
      console.log("tablePartstableParts", tableBorads)
      setSelectedBoards([...tableBorads]);
    }
  }, [boards])

  useEffect(() => {
    if (getMparts) {
      const tableMparts = Object.values(getMparts?.M_KIT || {})
      console.log("tablePartstableParts", tableMparts)
      setSelectedParts([...tableMparts]);
    }
  }, [getMparts]);

return (
  <>
  <div className='wrap'>         
      <div className='d-flex justify-content-between position-relative w-100 border-bottom d-flex-mobile'>
          <div className='d-flex align-items-center'>
              <div className='partno-sec'>
                  <h5>Boards Info</h5>
                  <div className='tab-sec'>
                          <Tabs
                               id="controlled-tab-example"
                               activeKey={key}
                               onSelect={(k) => setKey(k)}
                              >

{typeof getMparts === "object" ?
                      Object.keys(getMparts)
                        .filter(kitKey => kitKey.startsWith("M_KIT"))
                        .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                        .map((kitKey, index) => (
                          <Tab eventKey={kitKey} title={kitKey} key={index}>
                            {renderMpartsTabContent(kitKey)}
                          </Tab>
                        )) : (<></>)
                    }

                          {typeof body === "object" && body.boards ? (
  Object.keys(body?.boards).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
    .map((kitKey, index) => (
      <Tab eventKey={kitKey} title={kitKey} key={index}>
        {renderTabContent(kitKey)}
      </Tab>
    ))
) : null}
                                  
                              </Tabs>
                  </div>
              </div>
          </div>

          <div className='mobilemargin-top'>       
             <Button
            className="submit mb-1 submit-block"
            onClick={Sendkit}
            disabled={disableButton}
          >
            Send Kit
          </Button>
          &nbsp;
          <Button
            className="submit mb-1 submit-block"
            onClick={SendSample}
            disabled={disableButton}
          >
            Assign To Box Building
          </Button>
         &nbsp;
          <Button
            className="submit mb-1 submit-block"
          >
            Share Deliver Challan
          </Button>
                  </div>
      </div>
  </div>

</>
)
}
export default VendorBoxBuildingInfo;
