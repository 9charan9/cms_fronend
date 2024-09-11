import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  selectLoadingState,
  selectOutwardBlncInfo,
  outwardBlncDetails,
  sendKitSave,
} from "../slice/BomSlice";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { formFieldsVendor, tableBOM, tableContent } from "../../../utils/TableContent";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { envtypekey } from "../../../utils/common";
import attahment from "../../../assets/Images/attachment.svg";


const SendKit = () => {
  const [key, setKey] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [requiredQuantities, setRequiredQuantities] = useState({});
  const [formEKitBatchNo, setFormEKitBatchNo] = useState({});
  const [LOTID,setLotId] = useState({})
  console.log(LOTID)
  const [formMKitBatchNo, setFormMKitBatchNo] = useState({});
  const [formEKitProvidedQty, setFormEKitProvidedQty] = useState({});
  const [formMKitProvidedQty, setFormMKitProvidedQty] = useState({});
  const [balanceQtyE, setBalanceQtyE] = useState({});
  const [balanceQtyM, setBalanceQtyM] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadFiles, setUpload] = useState("")
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
         file.type === "image/jpeg" // Allow JPEG images
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
  const outward_id = location?.state?.outward_id;
  console.log(outward_id);
  const typeofbuild = location?.state?.type;
  console.log(typeofbuild);
  const bom_id = location?.state?.bom_id;
  const [balanceQty, setBalanceQty] = useState({
    bom_id: bom_id,
    outward_id: "",
    partner_id: "",
    qty: "",
    sender_name: "",
    contact_details: "",
    receiver_name: "",
    receiver_contact_num: "",
    date: "",
    against_po: "",
    ded: "",
    type: typeofbuild,
    batch_no: "",
    provided_qty: "",
    balance_qty: "",
  });

  const isLoading = useSelector(selectLoadingState);
  const blnceDetails = useSelector(selectOutwardBlncInfo);
  const balanceQuantity = blnceDetails?.body;
  const againstPoValue = balanceQuantity?.against_po;
  // const ctgr_id =
  // const cmpt_id
  console.log(blnceDetails?.body, "35678");
  useEffect(() => {
    if (blnceDetails?.body !== null) {
      setBalanceQty(blnceDetails?.body);
    }
  }, [blnceDetails?.body]);

  const renderTabContent = (kitKey) => {
    if (!balanceQuantity?.KITS) {
      return <p>No content available for this kit</p>;
    }
    const kitData = balanceQuantity?.KITS[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    const headers = kitKey.startsWith("E-KIT")
      ? [
          "Manufacturer Part No",
          "Part Name",
          "Manufacturer",
          "Device Category",
          "Mounting Type",
          "Required Quantity",
          "PTG Stock",
          "Lot Id",
          "Batch no",
          "Provided Quantity",
          "Balance Quantity",
         
          // "Damage Quantity",
        ]
      : [
          "VIC.Part.no",
          "Part Name",
          "Device Category",
          "Material",
          "Required Quantity",
          "Batch no",
          "Provided Quantity",
          "Balance Quantity",
          "Lot Id",
          // "Damage Quantity",
        ];
    const renderDataFields = (part, partKey) => {
      const handleChangeBatchNoEKit = (e, index) => {
        let obj = { ...formEKitBatchNo };
        obj[partKey] = e.target.value;
        setFormEKitBatchNo({ ...formEKitBatchNo, ...obj });
      };

      const handleLotId = (e,index) => {
        let obj = {...formEKitBatchNo};
        obj[partKey] = e.target.value
        setLotId((prevDetails) => ({
          ...prevDetails,
          ...obj
        }))
      }

      const handleChangeBatchNoMKit = (e, index) => {
        let obj = { ...formMKitBatchNo };
        obj[partKey] = e.target.value;
        setFormMKitBatchNo({ ...formMKitBatchNo, ...obj });
      };

      const handleChangeProvidedQtyEKit = (e, index) => {
        const providedQty = parseInt(e.target.value, 10) || 0 ;
        const requiredQty = requiredQuantities[partKey] || 0;
        // Calculate and update balance quantity in the state
        const updatedBalanceQtyE = {
          ...balanceQtyE,
          [partKey]: providedQty - requiredQty,
        };

        setBalanceQtyE(updatedBalanceQtyE);
        let obj = { ...formEKitProvidedQty };
        obj[partKey] = e.target.value;
        setFormEKitProvidedQty({ ...formEKitProvidedQty, ...obj });
      };

      const handleChangeProvidedQtyMKit = (e, index) => {
        const providedQty = parseInt(e.target.value, 10) || 0;
        const requiredQty = requiredQuantities[partKey] || 0;
        // Calculate and update balance quantity in the state
        const updatedBalanceQtyM = {
          ...balanceQtyM,
          [partKey]: providedQty - requiredQty,
        };
        setBalanceQtyM(updatedBalanceQtyM);
        let obj = { ...formMKitProvidedQty };
        obj[partKey] = e.target.value;
        setFormMKitProvidedQty({ ...formMKitProvidedQty, ...obj });
      };

      if (kitKey.startsWith("E-KIT")) {
        return (
          <>
            <td>{part?.mfr_part_number}</td>
            <td>{part?.part_name}</td>
            <td>{part?.manufacturer}</td>
            <td>{part?.device_category}</td>
            <td>{part?.mounting_type}</td>
            <td>{part?.required_quantity}</td>
            <td>{part?.ptg_stock}</td>
            <td>
              <input 
              type="text"
              className="input-50"
              onChange={(e) => handleLotId(e)}
              required
              />
            </td>
            <td>
              <input
                type="text"
                className="input-50"
                onChange={(e) => handleChangeBatchNoEKit(e)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9],[a-z]/g, "");
                }}
                required={true}
              />
            </td>
            <td>
              <input
                type="number"
                className="input-50"
                onChange={(e) => handleChangeProvidedQtyEKit(e)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                required={true}
              />
            </td>
            <td>
              {balanceQtyE[partKey]} 
            </td>
            {/* <td>{part?.damage_qty}</td> */}
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
            <td>
              <input
                type="text"
                className="input-50"
                onChange={(e) => handleChangeBatchNoMKit(e)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9],[a-z]/g, "");
                }}
                required={true}
              />
            </td>
            <td>
              <input
                type="number"
                className="input-50"
                onChange={(e) => handleChangeProvidedQtyMKit(e)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                required={true}
              />
            </td>
            <td>
             {balanceQtyM[partKey]} 
            </td>
            {/* <td>{part?.damage_qty}</td> */}
          </>
        );
      }
    };
    const calculateTotalProvidedQty = (kitData) => {
      let [totalProvidedQty ,totalBalanceQty,totalDamageQty,totalRequiredQty] = [0,0,0,0];
      
        Object.keys(kitData)
          .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
          .forEach((partKey) => {
            const part = kitData[partKey];
            const providedQty = parseFloat(formEKitProvidedQty[partKey])|| 0;
            const balanceQty = parseFloat(balanceQtyE[partKey]) || 0;
            const damageQty = parseFloat(part?.damage_qty) || 0;
            const reqQty = parseFloat(part?.required_quantity)
            totalProvidedQty += providedQty;
            totalBalanceQty +=balanceQty;
            totalDamageQty +=damageQty;
            totalRequiredQty +=reqQty;
          });       
          console.log( totalProvidedQty ,totalBalanceQty ,totalDamageQty,totalRequiredQty)
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
     <td> </td>  
     <td> </td>
     <td> </td>
     <td></td>
     <td> </td>
     <td> {totalRequiredQty}</td>
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
            {Object.keys(kitData)?.map((partKey, index) => {
              const part = kitData[partKey];
              return <tr key={index}>{renderDataFields(part, partKey)}</tr>;
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
  };
  const currentDate = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    bom_id: bom_id,
    outward_id: "",
    partner_id: "",
    qty: "",
    sender_name: "",
    contact_details: "",
    receiver_name: "",
    receiver_contact_num: "",
    date: "",
    against_po: "",
    ded: "",
    type: typeofbuild,
    batch_no: "",
    provided_qty: "",
    balance_qty: "",
    required_quantity: "",
  });

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    };
    setForm(nextFormState);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
        const isoDate = date.toISOString().split('T')[0];
        setForm((prevDetails) => ({
            ...prevDetails,
            delivery_date: isoDate,
        }));
    }
    else {
        setForm((prevDetails) => ({
            ...prevDetails,
            delivery_date: '',
        }));
    }
};
  const handleClearForm = () => {
    setForm({
      bom_name: "",
      outward_id: "",
      partner_id: "",
      qty: "",
      sender_name: "",
      contact_details: "",
      receiver_name: "",
      receiver_contact_num: "",
      date: "",
      against_po: "",
      ded: "",
      type: "",
      outward_id: "",
      partner_id: "",
      qty: "",
      balanceQuantity: "",
    });
  };

  useEffect(() => {
    // Update the balanceQuantity state when the form state changes
    const updatedBalanceQuantity = {
      ...balanceQuantity,
      outward_id: form.outward_id,
      partner_id: form.partner_id,
      qty: form.qty,
      sender_name: form.sender_name,
      contact_details: form.contact_details,
      receiver_name: form.receiver_name,
      receiver_contact_num: form.receiver_contact_num,
      date: form.date,
      against_po: againstPoValue,
      ded: form.ded,
      batch_no: form.batch_no,
      provided_qty: form.provided_qty,
    };

    setBalanceQty(updatedBalanceQuantity);
  }, [form]);
  const onSubmitBom = async (e) => {
    e.preventDefault();

    const {
      sender_name,
      contact_details,
      receiver_name,
      receiver_contact_num,
      against_po,
      ded,
      outward_id,
      partner_id,
      qty,
    } = form;

    // Use the currently selected tab as the key
    const kitKey = key;
    const documents = fileNames.map((fileName, index) => ({
      doc_name: fileName,
      doc_body: selectedFilesBase64[index],
  }));
  

    const requestBody = {
      env_type: envtypekey,
      type: typeofbuild,
      sender_name,
      receiver_name,
      receiver_contact_num,
      qty,
      partner_id,
      outward_id,
      ded,
      contact_details,
      bom_id: bom_id,
      against_po:againstPoValue,
      outward_id: balanceQuantity?.outward_id,
      partner_id: balanceQuantity?.partner_id,
      qty: balanceQuantity?.qty,
      documents,
    };
console.log(requestBody)
    if (kitKey && kitKey.startsWith("E-KIT")) {
      const kitData = balanceQuantity?.KITS[kitKey];
      const eKitData = kitData
        ? Object.keys(kitData).map((partKey) => {
            const partData2 = kitData[partKey];
            return {
              required_quantity: partData2.required_quantity,
              manufacturer: partData2.manufacturer,
              mfr_part_number: partData2.mfr_part_number,
              device_category: partData2.device_category,
              batch_no: formEKitBatchNo[partKey],
              lot_id : LOTID[partKey],
              mounting_type: partData2.mounting_type,
              qty: partData2.qty,
              ptg_stock: partData2.ptg_stock,
              balance_qty: balanceQtyE[partKey],
              damage_qty: partData2.damage_qty,
              part_name: partData2.part_name,
              provided_qty: formEKitProvidedQty[partKey],
              ctgr_id: partData2.ctgr_id,
              cmpt_id: partData2.cmpt_id,
            };
          })
        : [];
        console.log(requestBody)
      requestBody["E-KIT"] = eKitData;
      const response = await dispatch(sendKitSave(requestBody));
      console.log(response, "response of send kit");

      if (response.payload?.statusCode === 200) {
        handleClearForm();
        toast.success(response?.payload?.body);
        navigate(-1);
      } else {
        toast.error(response?.payload?.body);
      }
    } else {
      const kitData2 = balanceQuantity?.KITS[kitKey];
      const mKitData = kitData2
        ? Object.keys(kitData2).map((partKey) => {
            const partData1 = kitData2[partKey];
            return {
              required_quantity: partData1.required_quantity,
              vic_part_number: partData1.vic_part_number,
              batch_no: formMKitBatchNo[partKey],
              material: partData1.material,
              qty: partData1.qty,
              balance_qty: balanceQtyM[partKey],
              damage_qty: partData1.damage_qty,
              part_name: partData1.part_name,
              provided_qty: formMKitProvidedQty[partKey],
              ctgr_name: partData1.ctgr_name,
            };
          })
        : [];
      requestBody["M-KIT"] = mKitData;
      const response = await dispatch(sendKitSave(requestBody));
      if (response.payload?.statusCode === 200) {
        handleClearForm();
        toast.success(response?.payload?.body);
        navigate(-1);
      } else {
        toast.error(response?.payload?.body);
      }
    }
  };

  useEffect(() => {
    const requestBody = {
      outward_id: outward_id,
    };
    dispatch(outwardBlncDetails(requestBody));
  }, []);

  useEffect(() => {
    if (balanceQuantity) {
      if (typeofbuild === "EMS") {
        console.log(balanceQuantity, "balanceQuantity");
        const eKitNumbers = Object.keys(balanceQuantity?.KITS ?? {})
          .filter((key) => key.startsWith("E-KIT"))
          .map((key) => parseInt(key.replace("E-KIT", ""), 10));
        console.log(eKitNumbers, "eKitNumbers");
        const highestEKitNumber = Math.max(...eKitNumbers);
        console.log(highestEKitNumber, "highestEKitNumber");
        setKey(`E-KIT${highestEKitNumber}`);
      } else if (typeofbuild === "BOX BUILDING") {
        const mKitKeys = Object.keys(balanceQuantity?.KITS ?? {}).filter(
          (key) => key.startsWith("M-KIT")
        );
        setKey(mKitKeys[0]);
      }
    }
  }, [location, balanceQuantity]);

  useEffect(() => {
    if (blnceDetails?.body !== undefined || null) {
      setBalanceQty(blnceDetails?.body);
      const initialRequiredQuantities = {};
      Object.keys(blnceDetails?.body.KITS).forEach((kitKey) => {
        const kitData = blnceDetails?.body.KITS[kitKey];
        Object.keys(kitData).forEach((partKey) => {
          const partData = kitData[partKey];
          initialRequiredQuantities[partKey] = partData.required_quantity || 0;
        });
      });
      setRequiredQuantities(initialRequiredQuantities);
    }
  }, [blnceDetails?.body]);
  return (
    <>
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
           {tableBOM.sendKit}
          </h3>
        </div>
        <form onSubmit={(e) => onSubmitBom(e, balanceQuantity?.KITS[key])}>
          <div className="content-sec">
            <h5> {tableBOM.details}</h5>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.outwardId}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="outward_id"
                    value={balanceQuantity?.outward_id}
                    onChange={onUpdateField}
                    disabled
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.partnerId}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="partner_id"
                    value={balanceQuantity?.partner_id}
                    onChange={onUpdateField}
                    disabled
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableContent.qty}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="qty"
                    value={balanceQuantity?.qty}
                    onChange={onUpdateField}
                    disabled
                    required={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.senderName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="sender_name"
                    value={form.sender_name.trimStart()}
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableContent.contactDetails}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="contact_details"
                    value={form.contact_details.replace(/\D/g, "")}
                    onChange={onUpdateField}
                    pattern="[0-9]*"
                    minLength={10}
                    maxLength={10}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.receiverName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="receiver_name"
                    value={form.receiver_name.trimStart()}
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.receiverCntNum}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="receiver_contact_num"
                    minLength={10}
                    maxLength={10}
                    value={form.receiver_contact_num.replace(/\D/g, "")}
                    onChange={onUpdateField}
                    pattern="[0-9]*"
                    required={true}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>{tableBOM.againstPO}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="against_po"
                    value={againstPoValue}
                    disabled
                    // onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{tableBOM.DED}</Form.Label>
                                    <DatePicker
                                    selected={selectedDate}
                                    minDate={new Date()}
                                     onChange={handleDateChange}
                                     required={true}
                                        dateFormat="yyyy-MM-dd"
                                        name="ded"
                                        className="form-control"
                                        onFocus={(e) => e.target.readOnly = true}
                                    />
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
                      value={uploadFiles}
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
            <h5>{tableBOM.headerComponentsList}</h5>
            <div className="position-relative w-100 border-bottom align-items-end d-flex-mobile mt-2">
       
                <div className="tab-sec-sendkit">
                  {typeof balanceQuantity === "object" ? (
                    Object.keys(balanceQuantity?.KITS)?.map((kitKey, index) =>
                      renderTabContent(kitKey)
                    )
                  ) : (
                    <></>
                  )}
                </div>
           
            </div>
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
              {formFieldsVendor.btnSend}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden"> {formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}
    </>
  );
};

export default SendKit;
