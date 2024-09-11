import React , { useEffect, useState }  from 'react'
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import view from "../../../assets/Images/view.svg";
import download from "../../../assets/Images/download.svg";
import pdf from "../../../assets/Images/pdf.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  selectUploadDoc, uploadDocEms
} from "../slice/BomSlice";

const CategoryInfo = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const kit1Details = props?.props?.topDetailsInfo?.body
    console.log(kit1Details , "kit1Detailskit1Detailskit1Details")
    const kits = kit1Details?.KITS;
    const type = kit1Details?.type;
    const outward_id = kit1Details?.outward_id;
    const bom_id = kit1Details?.bom_id;
   const  againstPoValue = props?.props?.againstPoValue;
    console.log(againstPoValue, "45678986756");
    const [key, setKey] = useState("");
    const [disableButton, setDisableButton] = useState(false);
    const [balanceQty, setBalanceQty] = useState("")

    const upload = useSelector(selectUploadDoc);
    const assignUpload = upload?.body;
    console.log(assignUpload,"jjjjjjj")   

//     const documents= upload?.body;
//       console.log(documents,"kjhjkhj")
  
//   const documentUrls =
//   Array.isArray(upload?.body) ? 
//   upload.body.map((document) => document.doc_name) : 
//   [];
  
// console.log('documentUrls:', documentUrls);


useEffect(() => {
  if (key) {
    const requestBody = {
      outward_id,
      dep_type: type,
      bom_id,
      partner_id: kit1Details?.partner_id,
      event_key: key,
    };
    dispatch(uploadDocEms(requestBody));
  }
}, [dispatch, outward_id, type, bom_id, kit1Details?.partner_id, key]);

    const renderTabContent = (kitKey) => {
        const kitData = kit1Details?.KITS[kitKey];
        if (Array.isArray(kitData) && kitData.length === 0) {
          return <p>No data available for {kitKey}</p>;
        }
        const headers =
        key.startsWith("E-KIT")
          ? [
              "S.NO",
              "Manufacturer Part No",
              "Part Name",
              "Manufacturer",
              "Device Category",
              "Mounting Type",
              "Required Quantity",
              "lot_Id",
              "Batch no",
              "Provided Quantity",
              "Balance Quantity",
              "Damage Quantity",
            ]
          :[
            "S.NO",
            "VIC.Part.no",
            "Part Name",
            "Device Category",
            "Material",
            "Required Quantity",
            "Batch no",
            "Provided Quantity",
            "Balance Quantity",
            "Damage Quantity",
            ];

            const renderDataFields = (part,index) => {
                if (kitKey.startsWith("E-KIT")) {
                  return (
                    <>
                    <td>{index+1}</td>
                    <td>{part?.mfr_part_number}</td>
                      <td>{part?.part_name}</td>
                      <td>{part?.manufacturer}</td>
                      <td>{part?.device_category}</td>
                      <td>{part?.mounting_type}</td>
                      <td>{part?.required_quantity}</td>
                      <td>{part?.lot_id}</td>
                      <td>{part?.batch_no}</td>
                      <td>{part?.provided_qty}</td>
                      <td>{part?.balance_qty}</td>
                      <td>{part?.damage_qty}</td>
                    </>
                  );
                } else {
                  return (
                    <>
                      <td>{part?.vic_part_number}</td>
                      <td>{part?.part_name}</td>
                      <td>{part?.ctgr_name}</td>
                      <td>{part?.material}</td>
                      <td>{part?.required_quantity}</td>
                      <td>{part?.batch_no}</td>
                      <td>{part?.provided_qty}</td>
                      <td>{part?.balance_qty}</td>
                      <td>{part?.damage_qty}</td>
                    </>
                  );
                }
              };

              const calculateTotalProvidedQty = (kitData) => {
              let [totalProvidedQty ,totalBalanceQty,totalDamageQty, totalRequiredQty] = [0,0,0,0];
              
                Object.keys(kitData)
                  .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                  .forEach((partKey) => {
                    const part = kitData[partKey];
                    const providedQty = parseFloat(part?.provided_qty) || 0;
                    const balanceQty = parseFloat(part?.balance_qty) || 0;
                    const damageQty = parseFloat(part?.damage_qty) || 0;
                    const reqQty = parseFloat(part?.required_quantity) || 0;
                    totalProvidedQty += providedQty;
                    totalBalanceQty +=balanceQty;
                    totalDamageQty +=damageQty;
                    totalRequiredQty += reqQty;
                  });
                  // console.log( totalProvidedQty ,totalBalanceQty ,totalDamageQty)
                return [totalProvidedQty ,totalBalanceQty ,totalDamageQty, totalRequiredQty]
               
              };
              const totalProvidedQty = calculateTotalProvidedQty(kitData)[0];
              const totalBalanceQty = calculateTotalProvidedQty(kitData)[1];
              const totalDamageQty = calculateTotalProvidedQty(kitData)[2];
              const totalRequiredQty = calculateTotalProvidedQty(kitData)[3];
            const footer  =  key.startsWith("E-KIT")
            ? [
              <>
             <td> Total</td>
             <td></td>
             <td> </td>  
             <td> </td>
             <td> </td>
             <td> </td>
             <td> {totalRequiredQty}</td>
             <td> </td>
             <td> </td>
             <td> {totalProvidedQty}</td> 
             <td> {totalBalanceQty}</td>
            <td> {totalDamageQty}</td> 
            </>
              ]
            : [

              <>
              <td> Total</td>
              <td> </td>  
              <td></td>
              <td> </td>
              <td> </td>
              <td> {totalRequiredQty}</td>
              <td> </td>
              <td> {totalProvidedQty}</td> 
              <td> {totalBalanceQty}</td>
             <td> {totalDamageQty}</td> 
             </>
              
              ];
        return (
            <div className="table-responsive mt-4 ms-4" id="tableData">
            <Table className='bg-header'>
                <thead>
                  <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
                </thead>
                <tbody>
                {Object.keys(kitData)
              .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) // Sort the keys
              .map((partKey, index) => {
                const part = kitData[partKey];
            return (
              <tr key={index}>
                {renderDataFields(part,index)}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
           {footer}
          </tr>
        </tfoot>
            </Table>
        </div>
        );
            }
      useEffect(() => {
      if (type === 'EMS') {
        const eKitNumbers = Object.keys(kits)
          .filter((kitKey) => kitKey.startsWith('E-KIT'))
          .map((kitKey) => parseInt(kitKey.replace('E-KIT', ''), 10));
  
        const highestEKitNumber = Math.max(...eKitNumbers);
        setKey(`E-KIT${highestEKitNumber}`);
       setBalanceQty(kit1Details?.status); 
       setDisableButton(kit1Details?.status)
      } else if (type === 'BOX BUILDING') {
        const mKitNumbers = Object.keys(kits)
        .filter((kitKey) => kitKey.startsWith('M-KIT'))
        .map((kitKey) => parseInt(kitKey.replace('M-KIT', ''), 10));

      const highestMKitNumber = Math.max(...mKitNumbers);
      setKey(`M-KIT${highestMKitNumber}`);
        setDisableButton(kit1Details?.status)
      }
    }, [kit1Details]);

    const Sendkit = () =>{
      navigate("/sendkit", {state:{outward_id:outward_id , bom_id:bom_id, type:type ,  againstPoValue:againstPoValue}})
    }

  return (
    <>
    <div className='wrap'>         
        <div className='d-flex justify-content-between position-relative w-100 border-bottom d-flex-mobile'>
            <div className='d-flex align-items-center'>
                <div className='partno-sec'>
                    <h5>Category Info</h5>
                    <div className='tab-sec'>
                            <Tabs
                                 id="controlled-tab-example"
                                 activeKey={key}
                                 onSelect={(k) => setKey(k)}
                                >
                                     {typeof kit1Details === 'object'
                                ? Object.keys(kit1Details?.KITS)
                                .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) 
                                 .map((kitKey, index) => (
                                        <Tab eventKey={kitKey} title={kitKey} key={index}>
                                         
                                       <p className="ms-4 font-bold">Documents</p>

                                       <Row>
                                  {Array.isArray(assignUpload) && assignUpload.length > 0 ? (
                                    assignUpload.map((document, index) => (
                                      <Col xs={12} md={3} key={index}>
                                        <p className="pdf-tag">{document.doc_name}</p>
                                        <div className='doc-card position-relative'>
                                          <div className='pdfdwn'><img src={pdf} alt="" /></div>
                                          <div className='doc-sec position-absolute'>
                                            <div className='d-flex justify-content-between'>
                                            
                                              <Button className='view'
                                                style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                <a href={document?.doc_url} target="_blank" rel="noreferrer">
                                                  <img src={view} alt="" /></a>
                                              </Button> 
                                            </div>
                                          </div>
                                        </div>
                                      </Col>
                                    ))
                                  ) : (
                                    <Col xs={12} md={12} className="text-center">
                                      <p>No Documents Available.</p>
                                    </Col>
                                  )}
                                  </Row>
                                         

                                            {renderTabContent(kitKey)}
                                        </Tab>
                                    )) : (<></>)}
                                    
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
            >
              Share Deliver Challan
            </Button>
                    </div>
        </div>
    </div>

</>
  )
}

export default CategoryInfo;
