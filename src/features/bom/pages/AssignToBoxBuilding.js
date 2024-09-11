import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import { Spinner } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, Zoom,toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import attahment from "../../../assets/Images/attachment.svg";
import { getAssignBoxBuildingDetails, getAssignBoxBuildingKitDetails, getPatnersList, selectAssignBoxBuildingData, selectAssignBoxBuildingKitData, selectBomDetails, selectLoadingState, selectPartnerList, updateBoxBuildingData, updateBoxBuildingData2Api } from "../slice/BomSlice";

const AssignToBoxBuilding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [key, setKey] = useState("");
  const [type, setType] = useState('BOX BUILDING');
  const [partnerId, setPartnerId] = useState('');
  const qntities = location?.state?.qty;
  const [form, setForm] = useState({
    partner_id: "",
    sender_name: "",
    contact_details: "",
    qty: qntities,
    receiver_name: "",
    receiver_contact_num: "",
    date: "",
    against_po: "",
  });
  const currentDate = new Date().toISOString().split('T')[0];
  const [deliveryEndDate, setDeliveryEndDate] = useState(currentDate);
  const partnerslist = useSelector(selectPartnerList);
  const isLoading = useSelector(selectLoadingState);
  const [mcategoryInfobomData, setmcategoryInfoBomData] = useState([]);
  const [qnty, setQty] = useState("")
  const Allpartners = partnerslist?.body;
  const getData = useSelector(selectAssignBoxBuildingData);
  const getMparts = getData?.body || "";
  //  console.log(getMparts , "12221212")
  const bomId = location?.state?.bom_id;
  const outward_id = location?.state?.outward_id;
  const checkTab = location?.state?.type;
  const checkAssign = location?.state?.outwardType;
  const getMpartUpdatedKitsData = useSelector(selectAssignBoxBuildingKitData);
  console.log(getMpartUpdatedKitsData)
  const updatedMkits = getMpartUpdatedKitsData?.body || "";
  console.log(updatedMkits)
  const againstPoValue = getMparts?.against_po || updatedMkits?.against_po
  const boardsKit1Data = updatedMkits?.boards_kit1 || {};
  const mKit_bb_id = updatedMkits?.BB_id
  const partnerid = location?.state?.partnerId
  const senderName = location?.state?.senderName;
  const contactDetails = location?.state?.contactDetails;
  const receiverName = location?.state?.receiverName;
  const receiverContactNum = location?.state?.receiverContactNum;
  const outwardDate = location?.state?.outwardDate;
  const boards_id = getData?.body?.boards_id
  const [mcategoryBatchNoValues, setMCategoryBatchNoValues] = useState([]);
  const [mcategoryProvidedQty, setMCategoryProvidedQty] = useState([]);
  const [lot_id , setLot_Id] = useState([])
  console.log(lot_id)


  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);



  const handlePdfChange = (e) => {
    const newFiles = [...selectedFiles];
    const newFileNames = [...fileNames];
    const newFilesBase64 = [...selectedFilesBase64];
    let hasNonPdfFile = false;
    let hasDuplicateFile = false;
  
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (
        file.type === "application/pdf" ||
        file.type === "image/jpeg"  // Allow JPEG images
       
      ) {
        if (newFileNames.includes(file.name)) {
          hasDuplicateFile = true;
          break;
        } else {
          newFileNames.push(file.name);
          newFiles.push(file);
          const reader = new FileReader();
          reader.onload = (fileOutput) => {
            const encodedFile = fileOutput.target.result.split(",")[1];
            newFilesBase64.push(encodedFile);
          };
          reader.readAsDataURL(file);
        }
      } else {
        hasNonPdfFile = true;
      }
    }
  
    if (hasNonPdfFile) {
      toast.error("Only PDF, and JPG files are allowed.");
    }
  
    if (hasDuplicateFile) {
      toast.warning("Duplicate files are not allowed.");
    }
  
    // Clear the input value to trigger change event on re-upload of the same file
    if (!hasDuplicateFile) {
      e.target.value = "";
    }
  
    setSelectedFiles(newFiles);
    setFileNames(newFileNames);
    setSelectedFilesBase64(newFilesBase64);
  };
  
  
  const removeattachment = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
    const updatedFileNames = fileNames.filter((_, i) => i !== index);
    // Update the state with the updated arrays
    setSelectedFiles(updatedFiles);
    setSelectedFilesBase64(updatedFilesBase64);
    setFileNames(updatedFileNames);
    const inputElement = document.querySelector('input[type="file"][name="upload"]');
    if (inputElement) {
      inputElement.value = '';
    }
  };

  const handlePartnerChange = (e) => {
    setPartnerId(e.target.value);
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  }

  const handleLotChange = (e, index) => {
    const newValues = [...lot_id];
    newValues[index] = e.target.value;
    setLot_Id(newValues)
  }

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

  let totalProvidedQuantity = 0;
  const renderMpartsTabContent = (kitKey) => {
    const kitData = updatedMkits[kitKey] || getMparts[kitKey]
    console.log(kitData)

    if (kitKey === undefined || kitData === undefined || (Array.isArray(kitData) && kitData.length === 0)) {
      return <p>No data available for {kitKey}</p>;
    }
    // console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");

    const finalProduct = kitKey.startsWith("M_KIT");
    if (finalProduct) {
      const headers = kitKey.startsWith("M_KIT") ?
        [
          "VIC Part No",
          "Part Name",
          "Material",
          "Technical Details",
          "Description",
          "Qty per Board",
          "PTG Stock",
          "lot_Id",
          "Batch.no",
          "Provided Qty",
          "Balance Qty"
        ] : []
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("M_KIT")) {
          totalProvidedQuantity += parseInt(mcategoryProvidedQty[index]) || 0; // Add current provided quantity to total

          return (
            <>
              <td>{part?.vic_part_number}</td>
              <td>{part?.prdt_name}</td>
              <td>{part?.material}</td>  
              <td>{part?.technical_details}</td>
              <td>{part?.description}</td>
              <td>
                {kitKey.startsWith("M_KIT1")
                  ? parseInt(part?.qty_per_board * qntities) || 0
                  : part?.qty_per_board || 'Not M_KIT1'}
              </td>
              <td>{part?.ptg_stock || "-"}</td>
              <td><input className="input-50"  value={lot_id[index]}  onChange={(e) => handleLotChange(e,index)} required/></td>
              <td><input className="input-50" value={mcategoryBatchNoValues[index]?.trimStart()} onChange={(e) => handleBatchNoChange(e, index)} required={true} /></td>
              <td><input className="input-50" type="number" min={0} value={mcategoryProvidedQty[index]} onChange={(e) => handleProvidedQtyChange(e, index)} required={true} /></td>
              <td>
                {kitKey.startsWith("M_KIT1")
                  ? parseInt(mcategoryProvidedQty[index] - parseInt(part?.qty_per_board * qntities)) || 0
                  : parseInt(mcategoryProvidedQty[index] - parseInt(part?.qty_per_board)) || 0}
              </td>
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
            <tfoot>
              <tr className="border-top">
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{totalProvidedQuantity}</td>
                <td></td>
              </tr>
            </tfoot>
          </Table>

        </div>
      );
    }
    else {
      console.log("no dataaaaaa")
    }
  };

  const renderTabContent = (kitKey) => {
    const kitData = updatedMkits[kitKey] || getMparts?.boards[kitKey];
    console.log(kitData)
    if (kitKey === undefined || kitData === undefined || (Array.isArray(kitData) && kitData.length === 0)) {
      return <p>No data available for {kitKey}</p>;
    }
    // console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");

    const finalProduct = kitKey.startsWith("boards_kit");
    if (finalProduct) {
      const headers = kitKey.startsWith("boards_kit") ?
        [
          "S.No",
          "PCBA ID",
          "SOM ID/IMEI ID",
          "E SIM ID",
          "E SIM No",
          "ICT",
          "FCT",
          "Status",
          "Comment"
        ] : []
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("boards_kit")) {
          return (
            <>
              <td>{index + 1}</td>
              <td>{part?.pcba_id}</td>
              <td>{part?.som_id_imei_id}</td>
              <td>{part?.e_sim_id}</td>
              <td>{part?.e_sim_no || "-"}</td>
              <td>{part?.ict}</td>
              <td>{part?.fct}</td>
              <td>{part?.board_status}</td>
              <td>{part?.comment}</td>
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

  const getPartnersOptions = () => {
    if (Array.isArray(Allpartners) && Allpartners.length > 0) {
      return Allpartners?.map((value) => {
        return (
          <option value={`${value?.partner_id}`}>
            {value?.partner_id} - {value?.partner_name}
          </option>
        );
      });
    }
    else {
      return (
        <option disabled={true}>
          No Partners
        </option>
      )
    }
  }

  const kitKeys = Object.keys(getMpartUpdatedKitsData?.body || {}).filter(key => key.startsWith('M_KIT') || "");

  let highestValue = 0;
  let highestValueKey = null;

  kitKeys.forEach(kitKey => {
    const match = kitKey.match(/\d+/);
    if (match) {
      const value = parseInt(match[0], 10);
      if (value > highestValue) {
        highestValue = value;
        highestValueKey = kitKey;
      }
    }
  });

  // const resultVariable = {
  //   highestValue,
  //   data: getMpartUpdatedKitsData?.body?.[highestValueKey] || {}
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkAssign) {
      const documents = fileNames.map((fileName, index) => ({
        doc_name: fileName,
        doc_body: selectedFilesBase64[index],
    }));
      let mKitData = {};
      let totalBalanceQuantity = 0;
      Object.keys(getMparts)
        .filter((kitKey) => kitKey.startsWith("M_KIT"))
        .forEach((kitKey) => {
          const kitData = getMparts[kitKey];
          // console.log(getMparts, 'getMparts');
          // console.log(kitData, 'kitData');
          const updatedKitData = Object.entries(kitData).map(([part, partData], index) => ({
            ...partData,
            qty_per_board: parseInt(partData?.qty_per_board * qntities).toString() || 0,
            batch_no: mcategoryBatchNoValues[index],
            lot_id : lot_id[index],
            provided_qty: mcategoryProvidedQty[index].toString(),
            balance_qty: parseInt(mcategoryProvidedQty[index] - parseInt(partData?.qty_per_board * qntities)).toString() || 0,
          }));
          mKitData[kitKey] = updatedKitData.reduce((obj, item, index) => {
            obj[`part${index + 1}`] = item;
            return obj;
          }, {});
        });
      const partsData = getMparts?.boards || {};
      const requestBody = {
        ...form,
        documents,
        bom_id: bomId,
        boards_id: boards_id,
        outward_id: outward_id,
        ...mKitData,
        boards: partsData,
        against_po: againstPoValue
      };
      // console.log(requestBody, "requestBody requestBody");
      const response = await dispatch(updateBoxBuildingData(requestBody));
      if (response.payload?.statusCode === 200) {
        setTimeout(() => {
          navigate(-1);
        }, 2500);
      }
    }
    else if (checkTab) {
      const documents = fileNames.map((fileName, index) => ({
        doc_name: fileName,
        doc_body: selectedFilesBase64[index],
    }));
      const calculationForSecondSaveLambda = {};
      Object.keys(updatedMkits)
        .filter((kitKey) => kitKey.startsWith("M_KIT"))
        .forEach((kitKey) => {
          const kitData = updatedMkits[kitKey];
          // console.log(updatedMkits, 'getMparts');
          // console.log(kitData, 'kitData');
          const updatedKitData = Object.entries(kitData).map(([part, partData], index) => ({
            ...partData,
            qty_per_board: parseInt(partData?.qty_per_board).toString() || 0,
            batch_no: mcategoryBatchNoValues[index],
             lot_id : lot_id[index],
            provided_qty: mcategoryProvidedQty[index],
            balance_qty: parseInt(mcategoryProvidedQty[index] - parseInt(partData?.qty_per_board)).toString() || 0,
          }));
          calculationForSecondSaveLambda[kitKey] = updatedKitData.reduce((obj, item, index) => {
            obj[`part${index + 1}`] = item;
            return obj;
          }, {});
        });
      // console.log(calculationForSecondSaveLambda)
      const boardsData = {};
      Object.keys(updatedMkits)
        .filter((kitKey) => kitKey.startsWith("boards_kit"))
        .forEach((kitKey) => {
          boardsData[kitKey] = updatedMkits[kitKey];
        });
        const formData = {
          partner_id: partnerid,
          sender_name: senderName,
          contact_details: contactDetails,
          qty: qntities,
          receiver_name: receiverName,
          receiver_contact_num:receiverContactNum,
          date: outwardDate,
          against_po: againstPoValue,
        };
      const request = {
        ...formData,
        documents,
        bom_id: bomId,
        boards_id: boards_id,
        outward_id: outward_id,
        BB_id: mKit_bb_id,
        // boards: boardsKit1Data,
        boards: boardsData,
        against_po: againstPoValue,
        ...calculationForSecondSaveLambda,
      }
      // console.log(request)
      const response = await dispatch(updateBoxBuildingData2Api(request));
      if (response.payload?.statusCode === 200) {
        setTimeout(() => {
          navigate(-1);
        }, 2500);
      }
    }
  }

  const updateformfield = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  }
  const handleKeyDown = (e) => {
    e.preventDefault();
  };

  const handleDeliveryData = (e) => {
    const selectedDate = e.target.value;
    setDeliveryEndDate(selectedDate);
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: selectedDate,
    }));
  }
  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQty(newQuantity);
    const updatedBomData = mcategoryInfobomData.map((item) => ({
      ...item,
      qnty: newQuantity > 0 ? item.qty_per_board * newQuantity : item.qnty,
    }));
    setmcategoryInfoBomData(updatedBomData);
    const nextFormState = {
      ...form,
      [e.target.name]: newQuantity,
    };
    setForm(nextFormState);

    // console.log(qnty, "quantityyyyyyyyyyyyyyyyyy")
  }

  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (getMpartUpdatedKitsData?.statusCode === 404) {
      setDisableButton(true);
    }
    else {
      setDisableButton(false);
    }
  }, [getMpartUpdatedKitsData]);

  useEffect(() => {
    setQty(qntities)
  }, [location])

  useEffect(() => {
    const mKitNumbers = Object.keys(checkTab === "sendBoxBuildingInfo" ? updatedMkits : getMparts)
      .filter((kitKey) => kitKey.startsWith("M_KIT"))
      .map((kitKey) => parseInt(kitKey.replace("M_KIT", ""), 10));

    const highestMKitNumber = Math.min(...mKitNumbers);
    console.log(`M_KIT${highestMKitNumber}`);
    setKey(`M_KIT${highestMKitNumber}`);
  }, [getMparts, updatedMkits]);

  useEffect(() => {
    const request = {
      "partner_type": type
    }
    dispatch(getPatnersList(request));
  }, [])

  useEffect(() => {
    if (checkAssign === "outwardAssignBoxBuild") {
      const request = {
        "bom_id": bomId,
        "outward_id": outward_id,
        "boards_id": boards_id,
      }
      // console.log(request,"ommmmmmmmmmmmmmmmmm");
      dispatch(getAssignBoxBuildingDetails(request));
    }
    else if (checkTab === "sendBoxBuildingInfo") {
      const request = {
        "bom_id": bomId,
        "outward_id": outward_id,
        "qnty": qntities
      }
      dispatch(getAssignBoxBuildingKitDetails(request));
    }
  }, []);

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between w-100">
          <h1 className="title-tag">
            <img
              src={arw}
              alt="back-buttton"
              className="me-3"
              onClick={() => navigate(-1)}
            />
            Assigning to BoxBuilding
          </h1>
        </div>

        {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        <div className="content-sec">
          <form onSubmit={handleSubmit} >

            <h3 className="inner-tag">Details</h3>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Outward ID</Form.Label>
                  <Form.Control type="text"
                    placeholder=""
                    name="outwardId"
                    value={outward_id}
                    required={true}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                {checkAssign ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Partner ID</Form.Label>
                    <Form.Select
                      name="partner_id"
                      value={partnerId}
                      onChange={handlePartnerChange}
                      required={true}
                    >
                      <option value="">Select a Partner</option>
                      {getPartnersOptions()}
                    </Form.Select>
                  </Form.Group>
                ) : checkTab ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Partner ID</Form.Label>
                    <Form.Control type="text"
                      placeholder=""
                      name="partner_id"
                      value={partnerid}
                      required={true}
                      disabled
                    />
                  </Form.Group>
                ) : null}
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    name="qty"
                    value={qnty}
                    onChange={handleQuantityChange}
                    required={true}
                    disabled

                  />
                </Form.Group>
              </Col>
              {/* <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Sender Name</Form.Label>
                  <Form.Control type="text"
                    placeholder="" name="sender_name" value={form?.sender_name}
                    onChange={updateformfield}
                    required={true} />
                </Form.Group>
              </Col> */}
              <Col xs={12} md={3}>
                {checkAssign ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Sender Name</Form.Label>
                    <Form.Control
                      name="sender_name"
                      value={form?.sender_name}
                      onChange={updateformfield}
                      required={true}
                    >
                    </Form.Control>
                  </Form.Group>
                ) : checkTab ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Sender Name</Form.Label>
                    <Form.Control type="text"
                      name="sender_name"
                      value={senderName}
                      disabled
                    />
                  </Form.Group>
                ) : null}
              </Col>
              <Col xs={12} md={3}>
                {checkAssign ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Contact Details</Form.Label>
                    <Form.Control type="text" placeholder=""
                      name="contact_details"
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      value={form?.contact_details.replace(/\D/g, "")}
                      onChange={updateformfield}
                      required={true} />
                  </Form.Group>
                ) : checkTab ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Contact Details</Form.Label>
                    <Form.Control type="text" placeholder=""
                      name="contact_details"
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      value={contactDetails}
                      // onChange={updateformfield}
                      disabled
                      required={true} />
                  </Form.Group>
                ) : null}

              </Col>
              <Col xs={12} md={3}>
                {checkAssign ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Receiver name</Form.Label>
                    <Form.Control type="text"
                      placeholder=""
                      name="receiver_name"
                      onChange={updateformfield}
                    />
                  </Form.Group>
                ) : checkTab ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Receiver name</Form.Label>
                    <Form.Control type="text"
                      placeholder=""
                      name="receiver_name"
                      value={receiverName}
                      disabled
                    // onChange={updateformfield}
                    />
                  </Form.Group>
                ) : null}
              </Col>
              <Col xs={12} md={3}>
                {checkAssign ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Receiver Contact Number</Form.Label>
                    <Form.Control type="text"
                      placeholder=""
                      name="receiver_contact_num"
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      value={form?.receiver_contact_num.replace(/\D/g, "")}
                      onChange={updateformfield}
                    />
                  </Form.Group>
                ) : checkTab ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Receiver Contact Number</Form.Label>
                    <Form.Control type="text"
                      placeholder=""
                      name="receiver_contact_num"
                      value={receiverContactNum}
                      disabled
                    />
                  </Form.Group>
                ) : null}
              </Col>
              <Col xs={12} md={3}>
                {checkAssign ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="text" placeholder="" name="date"
                      onChange={updateformfield}
                    />
                  </Form.Group>
                ) : checkTab ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="text" placeholder="" name="date"
                      value={outwardDate}
                      disabled
                    />
                  </Form.Group>
                ) : null}
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Against PO</Form.Label>
                  <Form.Control type="text" placeholder="" name="against_po"
                    value={againstPoValue}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Delivery End date</Form.Label>
                  <Form.Control type="date" min={currentDate} value={deliveryEndDate} onKeyDown={handleKeyDown} name="ded" onChange={handleDeliveryData} required={true} />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Docs</Form.Label>
                  <div>
                    <input
                      type="file"
                      id="upload"
                      name="upload"                    
                      hidden
                      multiple
                      onChange={handlePdfChange}
                      accept=".pdf, .jpg, .gif"
                  
                    />
                    <label for="upload" className="cfile">
                      <img src={attahment} alt="" />
                    </label>
                  </div>
                </Form.Group>
              </Col>

              {selectedFiles.map((file, index) => (
                <Col xs={12} md={3} key={index}>
                  <Form.Group className="mb-1">
                    <Form.Label>&nbsp;</Form.Label>
                    <div className="attachment-sec">
                      <span className="attachment-name">{file.name}</span>
                      <span
                        className="attachment-icon"
                        onClick={() => removeattachment(index)}
                      >
                        x
                      </span>
                    </div>
                  </Form.Group>
                </Col>
              ))}


            </Row>
            <div className="w-100 border-bottom mt-5">
              <div className="partno-sec">
                <div className="tab-sec-sendkit">
                  <Tabs
                    className="tabs-header"
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                  >
                    {typeof getMparts === "object" || typeof updatedMkits === "object" ?
                      Object.keys(checkTab === "sendBoxBuildingInfo" ? updatedMkits : getMparts)
                        .filter(kitKey => kitKey.startsWith("M_KIT"))
                        .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                        .map((kitKey, index) => (
                          <Tab eventKey={kitKey} title={kitKey} key={index}>
                            {renderMpartsTabContent(kitKey)}
                          </Tab>
                        )) : (<></>)
                    }

                    {typeof updatedMkits === "object" || typeof getMparts === "object" && getMparts.boards ? (
                      Object.keys(checkTab === "sendBoxBuildingInfo" ? updatedMkits : getMparts?.boards)
                        .filter(kitKey => kitKey.startsWith('boards_kit'))
                        .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                        .map((kitKey, index) => (
                          <Tab eventKey={kitKey} key={index}
                            title={kitKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}>
                            {renderTabContent(kitKey)}
                          </Tab>
                          // <Tab eventKey={kitKey} title={convertToCamelCase(kitKey)} key={index}></Tab>
                        ))
                    ) : null}

                  </Tabs>
                </div>
              </div>

            </div>


            <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
              <Button type="button" className="cancel me-2" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              {/* <Button type="submit" className="submit">
                Assign
              </Button> */}
              {disableButton ? (
                <Button type="submit" className="submit" disabled>
                  Assign
                </Button>
              ) : (
                <Button type="submit" className="submit" disabled={totalProvidedQuantity == 0}>
                  Assign
                </Button>
              )}

            </div>
          </form>
        </div>
      </div>
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

export default AssignToBoxBuilding;
