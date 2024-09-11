import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../styles/BomDetails.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getBomDetails, selectBomDetails } from "../slice/BomSlice";
import { textToast, tableBOM, tableContent } from "../../../utils/TableContent";

const PtgnoDetails = ({ props, id }) => {
  const [key, setKey] = useState("Mcategoryinfo");
  const categoryInfoData = props.bom_name;
  const categoryObjectkeys = props.bom_id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bomdata = useSelector(selectBomDetails);
  const [isLoading, setIsLoading] = useState(true);
  // const bomdetailsdata = bomdata?.body?.parts;
  const [bomdetailsdata, setBomdetailsdata] = useState([]);
  useEffect(() => {
    if (bomdata?.body?.parts) {
      setBomdetailsdata([...bomdata?.body?.parts])
    } else {
      // Handle the case where parts is null or undefined
      setBomdetailsdata([]);
    }
    setIsLoading(false);
  }, [bomdata])

  useEffect(() => {
    const request = {
      bom_name: categoryInfoData,
      bom_id: categoryObjectkeys,
      dep_type: key === "Mcategoryinfo" ? "Mechanic" : "Electronic",
    };
    dispatch(getBomDetails(request));
    setIsLoading(true);  
    setBomdetailsdata([])
  }, [dispatch, categoryInfoData, categoryObjectkeys, key]);


  if (!bomdetailsdata) {
    return null;
  }
  const estimatematerial = () => {
    navigate("/estimatematerial", { state: { bomdata, dep_type: key } });
  };

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative w-100 border-bottom d-flex-mobile">
          <div className="d-flex align-items-center">
            <div className="partno-sec">
              <div className="tab-sec">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  <Tab eventKey="Mcategoryinfo" title="M - Category Info">
                    <div className="table-responsive mt-4">
                      <Table className="b-table">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>{tableContent.ptg}</th>
                            <th>{tableContent.partName}</th>
                            <th>{tableBOM.material}</th>
                            <th>{tableBOM.technicalDetails}</th>
                            <th>{tableBOM.description}</th>
                            <th>{tableBOM.qtyPerBoard}</th>
                          </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (                            
                            <tr>
                              <td colSpan="6" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                            Array.isArray(bomdetailsdata) && bomdetailsdata.length > 0 ? (
                              bomdetailsdata.map((item, index) => (
                                <tr key={index}>
                                  <td>{index+1}</td>
                                  <td>{item?.ptg_prt_num}</td>
                                  <td>{item?.part_name}</td>
                                  <td>{item?.material}</td>
                                  <td>{item?.technical_details}</td>
                                  <td>{item?.description}</td>
                                  <td>{item?.qty_per_board}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className='text-center'>{textToast.noData}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                  <Tab eventKey="Ecategoryinfo" title="E - Category Info">
                    <div className="table-responsive mt-4" id={id}>
                      <Table className="b-table">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>{tableContent.ptg}</th>
                            <th>{tableContent.partName}</th>
                            <th>{tableBOM.Mftr}</th>
                            <th>{tableBOM.deviceCat}</th>
                            <th>{tableBOM.mountingType}</th>
                            <th>{tableBOM.reqQty}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (                            
                            <tr>
                              <td colSpan="6" className="text-center">Loading...</td>
                            </tr>
                          ) : (Array.isArray(bomdetailsdata) && bomdetailsdata.length > 0 ? (
                            bomdetailsdata.map((item, index) => (
                              <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item?.ptg_prt_num}</td>
                                <td>{item?.part_name}</td>
                                <td>{item?.manufacturer}</td>
                                <td>{item?.device_category}</td>
                                <td>{item?.mounting_type}</td>
                                <td>{item?.required_quantity}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className='text-center'>{textToast.noData}</td>
                            </tr>
                          )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                  <Tab eventKey="Description" title="Description">
                    <p className="mt-4">{bomdata?.body?.description}</p>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>

          {/* <div className="mobilemargin-top">
            <Button
              className="submit mb-1 submit-block"
              onClick={estimatematerial}
            >
              {tableBOM.estMaterials}
            </Button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default PtgnoDetails;
