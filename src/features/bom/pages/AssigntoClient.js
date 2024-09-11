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
import { getcmsClientAgainstPO, selectClientAgainPo, selectLoadingState } from "../slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import {
  formFieldsVendor,
  tableBOM,
  tableContent,
  gateEntryTable,
} from "../../../utils/TableContent";
import {
  listSelection,
  selectGetClientList,
} from "../../clients/slice/ClientSlice";
import {
  selectClientGetInfo,
  getClientinfo,
  saveClientData,
  selectClientSaveInfo,
} from "../slice/BomSlice";
import { Tabs, Tab } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelect from "../../../components/MultiSelect";
import ReactSelect from "react-select";

const AssigntoClient = () => {
  const [key, setKey] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [options, setOptions] = useState([]);
  console.log(options);
  const [selectedAgainstpo, setSelectedAgainstpo] = useState(null);
  console.log(selectedAgainstpo?.value);
  const [disableButton, setDisableButton] = useState(false);
  const [fileBase64, setFileBase64] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const outward_id = location?.state?.outward_id;
  const finalBoards = location?.state?.finalBoards;
  const bom_id = location?.state?.bom_id;
  console.log(finalBoards);
  const isLoading = useSelector(selectLoadingState);
  const typeSelection = useSelector(selectGetClientList);
  const clientBody = typeSelection?.body;
  const clientData = useSelector(selectClientGetInfo);
  const AgainstPoData = useSelector(selectClientAgainPo);
  const {client_id, client_name, against_po} = {...AgainstPoData?.body};
  console.log(AgainstPoData);
 const emptybody= clientData?.body?.message;
  let clientBodyData;
  {
    clientData?.statusCode === 200 && (clientBodyData = clientData?.body);
  }
  const kits = clientBodyData?.kits || "";
  const  againstPoValue = clientBodyData?.against_po|| "NO PO for BOM"
  console.log(againstPoValue);
  const ClientQuantity = clientData?.body?.quantity;
  useEffect(() => {
    const requestobj = {
      status: "Active",
    };
    dispatch(listSelection(requestobj));

    const requestBody = {
      status: "FinalProduct",
      outward_id: outward_id,
    };
    dispatch(getClientinfo(requestBody));
    const request = {
      "bom_id": bom_id
    }
    dispatch(getcmsClientAgainstPO(request))
  }, [dispatch]);


  const renderTabContent = (kitKey) => {
    if (!finalBoards) {
      return <p>No content available for this kit</p>;
    }
    const kitData = finalBoards[kitKey];
    if (Array.isArray(kitData) && kitData.length === 0) {
      return <p>No data available for {kitKey}</p>;
    }
    const finalProduct = kitKey.startsWith("Final_product");
    if (finalProduct) {
      const headers = kitKey.startsWith("Final_product")
        ? [
               "S.No",
               "Product ID",
               "PCBA ID",
               "ALS ID",
               "Display Number",
               "SOM ID/ IMEI ID",
               "ESIM NO",
               "E-SIM ID",
               "Date of EMS",
               "ICT",
               "FCT",
               "EOL",
               "Date of EOL",
               "EOL Document",
               "Status",
               "Comment",
          ]
        : [];
      const renderDataFields = (part, index) => {
        if (kitKey.startsWith("Final_product")) {
          return (
            <>
              <td>{index + 1}</td>
              <td>{part?.product_id}</td>
              <td>{part?.pcba_id}</td>
              <td>{part?.als_id}</td>
              <td>{part?.display_number}</td>
              <td>{part?.som_id_imei_id}</td>
              <td>{part?.e_sim_no}</td>
              <td>{part?.e_sim_id}</td>
              <td>{part?.date_of_ems}</td>
              <td>{part?.ict}</td>
              <td>{part?.fct}</td>
              <td>{part?.eol}</td>
              <td>{part?.date_of_eol}</td>
              <td>{part?.eol_document?.doc_name}</td>
              <td>{part?.product_status}</td>
              <td>{part?.comment}</td>

            </>
          );
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
              {Object.keys(kitData)
                .sort(
                  (a, b) =>
                    parseInt(a.replace("kit", ""), 50) -
                    parseInt(b.replace("kit", ""), 50)
                ) // Sort the keys
                .map((partKey, index) => {
                  const part = kitData[partKey];
                  return <tr key={index}>{renderDataFields(part, index)}</tr>;
                })}
            </tbody>
          </Table>
        </div>
      );
    }
  };

  const currentDate = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    outward_id: outward_id,
    sender_name: "",
    contact_details: "",
    receiver_name: "",
    receiver_contact_num: "",
    against_po: "",
    ded: "",
    client_id: "",
    client_name: "",
    quantity: ClientQuantity,
    ship_to: "",
  });
  console.log(JSON.stringify(form, null,2));
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

// const handleSelectAgainPo = (selected) => {
//   setSelectedAgainstpo(selected);
// }
  const handleClearForm = () => {
    setForm({
      outward_id: outward_id,
      sender_name: "",
      contact_details: "",
      receiver_name: "",
      receiver_contact_num: "",
      against_po: "",
      ded: "",
      client_id: "",
      client_name: "",
      quantity: ClientQuantity,
    });
    setDisableButton(false);
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };
  const onSubmitBom = async (e) => {
    e.preventDefault();

    const {
      outward_id,
      sender_name,
      contact_details,
      receiver_name,
      receiver_contact_num,
      documents,
      ship_to
    } = form;

    const requestBody = {
      sender_name,
      receiver_name,
      receiver_contact_num,
      outward_id,
      ded: selectedDate.toISOString().split('T')[0],
      contact_details,
      documents: documents || "",
      ship_to,
      against_po: against_po || selectedAgainstpo?.value,
      // eslint-disable-next-line no-dupe-keys
      outward_id: outward_id,
      qty: ClientQuantity,
      client_id: client_id,
      client_name: client_name,
    };

    // Data from both tabs
    const allKitData = {};

    // Process each tab's data
    Object.keys(finalBoards).forEach((tabKey) => {
      const kitData = finalBoards[tabKey];
      const tabData = [];

      if (kitData) {
        Object.keys(kitData).forEach((partKey) => {
          const partData = kitData[partKey];

          const kitItem = {
            "pcba_id": partData?.pcba_id,
            "product_id": partData?.product_id,
            "e_sim_id": partData?.e_sim_id,
            "unit_no": partData?.unit_no,
            "display_number": partData?.display_number,
            "e_sim_no": partData?.e_sim_no,
            "als_id": partData?.als_id,
            "date_of_ems": partData?.date_of_ems,
            "ict": partData?.ict,
            "fct": partData?.fct,
            "eol": partData?.eol,
            "date_of_eol": partData?.date_of_eol,
            "eol_document": partData?.eol_document,
            "product_status": partData?.product_status,
            "final_product_kit_id": partData?.final_product_kit_id,
            "som_id_imei_id": partData?.som_id_imei_id,
          };

          tabData.push(kitItem);
        });
      }

      allKitData[tabKey] = tabData;
    });

    // Add all tab data to the request body
    requestBody["kits"] = allKitData;

    console.log(requestBody, "response of send kit");

    // Dispatch your action or handle the API call here
    const response = await dispatch(saveClientData(requestBody));

    if (response.payload?.statusCode !== 200) {
      await toast.error(response?.payload?.body);
      return;
    } else {
      await toast.success(response?.payload?.body);
      handleClearForm();
    }
  };

  // const handleSelectChange = async (e) => {
  //   setSelectedOption(e.target.value);
  //   const selectedValue = e.target.value;
  //   const [client_id, client_name] = selectedValue.split(" , ");
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     client_id: client_id,
  //     client_name: client_name,
  //   }));
  //   const request = {
  //     "client_id": client_id,
  //     "client_name": client_name
  //   }
  //   await dispatch(getcmsClientAgainstPO(request)).then((res) => {
  //     const againstPO = res.payload?.body;
  //     if(res.payload?.statusCode === 200 && againstPO.length > 0){
  //     let opts = res.payload?.body?.map((item) => {
  //       return { value: item.po_id, label: item.po_id }
  //   });
  //   setOptions(opts);
  // }
  // else{
  //   setOptions([]);
  // }
  //   });
  //   console.log(selectedValue);
  // };

  // const getCategoryOptions = () => {
  //   if (Array.isArray(clientBody)) {
  //     return clientBody.map((value) => {
  //       return (
  //         <option value={`${value?.client_id} , ${value?.client_name}`}>
  //           {value?.client_id} - {value?.client_name}
  //         </option>
  //       );
  //     });
  //   }
  // };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if(file){
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let encodedFile;
    reader.onload = (fileOutput) => {
      encodedFile = fileOutput.target.result.split(",")[1];
      setForm((prevstate) => ({
        ...prevstate,
        documents: [
          {
          "doc_name": file.name,
          "doc_body": encodedFile
          }
        ]
      }))
    };
    reader.onerror = (error) => {
      console.error('Error converting file to base64:', error);
    };
  }
  }



  useEffect(() => {
    if(AgainstPoData?.statusCode === 404){
      toast.error(AgainstPoData?.body);
    }
  }, [AgainstPoData])


  useEffect(() => {
    setKey(Object.keys(finalBoards)[0]);
  }, []);

  return (
      <>
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
              {tableBOM.assignHeader}
            </h3>
          </div>
          <form onSubmit={(e) => onSubmitBom(e)}>
            <div className="content-sec">
              <h5> {tableBOM.assignSubHeader}</h5>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.outwardId}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="outward_id"
                      value={outward_id}
                      onChange={onUpdateField}
                      disabled
                      required={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableContent.clientId}</Form.Label>
                    <Form.Control
                      name="client_id"
                      value={client_id && client_name !== undefined ? (`${client_id}-${client_name}`) : null}
                      readOnly
                      disabled={true}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group className="mb-4">
                    <Form.Label>{tableBOM.againstPO}</Form.Label>
                     <Form.Control 
                      name="against_po"
                      value={against_po || ""}
                      readOnly
                      disabled={true}
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
                      value={form.sender_name}
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
                      value={form.receiver_name}
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
                    <Form.Label>{gateEntryTable.quantity}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      name="quantity"
                      value={ClientQuantity}
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
                                <Form.Group controlId="formFile" className="mb-4">
                                    <Form.Label>Document</Form.Label>
                                     <Form.Control type="file" onChange={handleDocumentUpload}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group controlId="formFile" className="mb-4">
                                    <Form.Label>Ship To</Form.Label>
                                    <Form.Control
                                      as="textarea"
                                      placeholder=""
                                      name="ship_to"
                                      required={true}
                                      value={form?.ship_to}
                                      onChange={onUpdateField}
                                      />
                                </Form.Group>
                            </Col>
              </Row>
              <div className="tab-sec-sendkit">
                {typeof finalBoards === 'object' ? (
                  <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                  >
                    {typeof finalBoards === "object"  && finalBoards !== undefined ? (
                      Object.keys(finalBoards)
                        .sort(
                          (a, b) =>
                            parseInt(a.replace("kit", ""), 50) -
                            parseInt(b.replace("kit", ""), 50)
                        )
                        .map((kitKey, index) => {
                          console.log(kitKey);
                          return (
                          <Tab eventKey={kitKey} title={kitKey} key={index}>
                            {renderTabContent(kitKey)}
                          </Tab>
                        )
                        })
                    ) : (
                      <></>
                    )}
                  </Tabs>
                ) : (
                  <h5 className="d-flex justify-content-center coming-sec">
                  {emptybody}
                  </h5>
                )}
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
                  {formFieldsVendor.btnAssign}
                </Button>
              
            </div>
          </form>
        </div>
        {isLoading && (
          <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
              <span className="visually-hidden">
                {" "}
                {formFieldsVendor.loader}
              </span>
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

export default AssigntoClient;
