import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import Table from "react-bootstrap/Table";
import { useEffect } from "react";
import Upload from "../../../assets/Images/upload.svg";
import pdfImage from "../../../assets/Images/pdf.svg"
import { toast, ToastContainer, Zoom } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Spinner } from 'react-bootstrap';
import { selectGetOrderIds, getOrderidList, selectGetInwardIds, getInwardidList, getReturnpoCList, selectGetreturnpoClist, selectLoadingStatus, saveReturnpo, selectEditreturnpoList, EditReturnpodetails, saveeditReturnpo } from "../slice/PurchaseOrderSlice";
import moment from "moment";
import { buttonTexts, formFieldsVendor, returnPOText, tableContent } from '../../../utils/TableContent';
const ReturnPurchase = ({ isEdit }) => {

  let totalQty = 0;
  let totalPrice = 0;
  const isLoading = useSelector(selectLoadingStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  const [showdivs, setshowdivs] = useState(false);
  const orderidDetails = useSelector(selectGetOrderIds);
  //console.log(orderidDetails, "orderidDetails");
  const orderids = orderidDetails?.body;

  const inwardDetails = useSelector(selectGetInwardIds);
  // console.log(inwardDetails, "inwardDetails");
  const inwardids = inwardDetails?.body;
  // returpo components table data


  const returnpoList = useSelector(selectGetreturnpoClist);
  console.log(returnpoList, "returnpoList");

  const [retpodata, setRetpodata] = useState(null);

  const [podata, setPodata] = useState([]);


  // console.log(returnpoList, "returnpoList");
  const [selectedDate, setSelectedDate] = useState(new Date());
  // orderid
  const [selectedOption, setSelectedOption] = useState("");
  //inwardid
  const [selectedInwardid, setSelectedInwardid] = useState("");
  // Edit returnpo getting selector
  const returnpoIdata = useSelector(selectEditreturnpoList);

  //first pdf
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  //image   
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [selectedImageBase64, setSelectedImageBase64] = useState("");
  //second pdf  
  const [pdfFileName1, setPdfFileName1] = useState("");
  const [pdfPreview1, setPdfPreview1] = useState(null);
  const [selectedFilesBase641, setSelectedFilesBase641] = useState([]);
  const [fileNames1, setFileNames1] = useState([]);
  const [selectedFiles1, setSelectedFiles1] = useState([]);

  const [orderidset, setgetOrderid] = useState("");
  const [inwardidset, setgetInwarid] = useState("");
  const photoUrls = retpodata?.photo || {};

  const [imagePreviews, setImagePreviews] = useState({});
  console.log(retpodata?.photo);


  useEffect(() => {
    if (returnpoList.statusCode === 200 && returnpoList  && selectedInwardid) {
      setForm(prevForm => ({
        ...prevForm,
        qa_date: returnpoList.body[0]?.qa_date || "",
        s_name: returnpoList.body[0]?.sender_name || "",
        s_no: returnpoList.body[0]?.sender_contact_number || "",
      }));
      const polList = Object.keys(returnpoList.body[0]?.parts).map((part) => {
        return returnpoList.body[0]?.parts[part];
      });
      console.log(polList)

      setPodata(polList)
      setRetpodata(returnpoList?.body ? returnpoList?.body[0] : null);
      const photoUrls = returnpoList?.body[0]?.photo || {};
      setImagePreviews(photoUrls);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX", retpodata);

    } else {
      setRetpodata(null);
      toast.error(returnpoList?.body);
    }
  }, [returnpoList])


  useEffect(() => {
    if (!selectedInwardid) {
      setRetpodata(null);
    }

  }, [])

  const getOrderids = () => {
    if (Array.isArray(orderids)) {
      return orderids?.map((value, index) => {
        return (
          <option value={value} key={index}>
            {value}
          </option>
        );
      });
    }
  };
  const getInwardids = () => {
    if (Array.isArray(inwardids)) {
      return inwardids?.map((value, index) => {
        return (
          <option value={value} key={index}>
            {value}
          </option>
        );
      });
    }
  };


  const [form, setForm] = useState({
    "order_id": "",
    "inward_id": "",
    "qa_date": "",
    "s_name": "",
    "s_no": "",
    "description": "",
    "status": ""
  });

  //orderid

  const handleSelectChange = async (value) => {
    setshowdivs(false)
    setSelectedOption(value);
    setPodata([]);
    setImagePreviews("");
    setRetpodata(null);
    setForm(prevForm => ({
      ...prevForm,
      qa_date: "",
      s_name: "",
      s_no: "",
    }));
    setSelectedInwardid("");
  };

  const inwardList = (value) => {
    const requestobj = {
      po_order_id: value
    };
    dispatch(getInwardidList(requestobj))
  }


  useEffect(() => {
    if (selectedOption) {
      inwardList(selectedOption)
    }
  }, [selectedOption])


  const handleSelectInward = async (e) => {
    setSelectedInwardid(e.target.value);
    const requestobj = {
      po_order_id: selectedOption,
      inwardId: e.target.value,
    };
    await dispatch(getReturnpoCList(requestobj))

    setshowdivs(true)

  };

  const handleCancelPdfPreview = () => {
    setPdfPreview(null);
    setPdfFileName("");
    setSelectedFilesBase64([]);
  };
  //invoice
  const handlePdfChange = (e) => {
    const selectedFiles = e.target.files;
    handleFileChange(selectedFiles, setFileNames, setPdfPreview, setPdfFileName, setSelectedFilesBase64);
  };

  const handlePdfChangeinvoice = (e) => {
    const selectedFiles = e.target.files;
    handleFileChange(selectedFiles, setFileNames1, setPdfPreview1, setPdfFileName1, setSelectedFilesBase641);
  };

  const handleFileChange = (selectedFiles, setFileNames, setPdfPreview, setPdfFileName, setSelectedFilesBase64) => {
    const newFileNames = [];
    const newFilesBase64 = [];
    let invalidFileType = false;

    Array.from(selectedFiles).forEach((selectedFile) => {
      if (selectedFile.type !== "application/pdf") {
        invalidFileType = true;
        showToast("Please select a PDF file.");
      } else {
        newFileNames.push(selectedFile.name);
        const reader = new FileReader();
        reader.onload = (fileOutput) => {
          setPdfFileName(selectedFile?.name);
          setPdfPreview(reader.result);
          const encodedFile = fileOutput.target.result.split(",")[1];
          newFilesBase64.push(encodedFile);
          console.log("Base64 doc:", encodedFile);
        };
        reader.readAsDataURL(selectedFile);
      }
    });

    if (!invalidFileType) {
      setFileNames(newFileNames);
      setSelectedFilesBase64(newFilesBase64);
    }
  };

  function showToast(message) {
    toast.error(message);
  }



  //2nd doc


  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      if (imageFile.type === 'image/jpeg') {
        // setSelectedImageFile(imageFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(reader.result);
          setSelectedImageBase64(e.target.result);
          setImageName(imageFile.name);
        };
        reader.readAsDataURL(imageFile);
      } else {
        showToast("Please select a JPG file.");
      }
    }
  };

  const handleCancelImagePreview = () => {
    setImagePreview(null);
    setImageName("");
    setSelectedImageBase64("");
  };

  const onUpdateField = (e) => {
    const { name, value } = e.target;
    const nextFormState = {
      ...form,
      [name]: value
    }
    setForm(nextFormState);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split('T')[0];
      setForm((prevDetails) => ({
        ...prevDetails,
        qa_date: isoDate,
      }));
    }
    else {
      setForm((prevDetails) => ({
        ...prevDetails,
        qa_date: '',
      }));
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      const formData = {
        return_id: orderidset,
        description: form.description,
        status: form.status
      };

      const requestBody = {
        ...formData,

      };
      // Replace 'updateClient' with the actual action for updating a client
      // Handle the response as needed updateClient
      console.log("Form Data:", requestBody);
      const response = await dispatch(saveeditReturnpo(requestBody));
      if (response.payload?.statusCode === 200) {

        setTimeout(() => {
          navigate(-1)
        }, 2000);
      }


    } else {
      const formData = {
        order_id: selectedOption,
        inward_id: selectedInwardid,
        qa_date: retpodata?.qa_date,
        sender_name: retpodata?.sender_name,
        sender_contact_number: retpodata?.sender_contact_number,
        description: form.description,
        status: form.status
      };
      const parts = retpodata?.parts || {};

      // Create an array to store the parts data
      const partsArray = Object.values(parts).map((part) => ({
        mfr_prt_num: part.mfr_prt_num || "",
        prdt_name: part.prdt_name || "",
        description: part.description || "",
        packaging: part.packaging || "",
        qty: part.fail_qty || "",
        // status: part.status || "",
        price_per_piece: part.price_per_piece || "",
        price: part.price.toString() || "",
        manufacturer: part.manufacturer || "",
        department: part.department || "",
        cmpt_id: part.cmpt_id || "",
        ctgr_id: part.ctgr_id || "",
        batchId: part.batchId || "",
        fail_qty: part.fail_qty || "",
        pass_qty: part.pass_qty || ""

      }));


      // const documents = fileNames.map((fileName, index) => ({
      //   invoice: selectedFilesBase64[index],
      //   qa_test_doc: selectedFilesBase641[index],
      //   image: selectedImageBase64.split(',')[1],
      //   image_type: "jpg",
      //   file_type: "pdf",
      // }));

      const invoice = retpodata?.invoice;
      // const invoice1 = selectedFilesBase64[0];
      const qa_test = retpodata?.qa_test;
      const photo = imagePreviews;
      const image_type = "jpg";
      const file_type = "pdf";
      const requestBody = {
        ...formData,
        invoice,
        qa_test,
        photo,
        // invoice1,
        image_type,
        file_type,
        parts: partsArray,

      };
      console.log(requestBody, "requestBody");
      const response = await dispatch(saveReturnpo(requestBody));
      if (response.payload?.statusCode === 200) {

        setTimeout(() => {
          navigate(-1)
        }, 2000);
      }
      // Handle the response as needed
    }


  }

  useEffect(() => {
    if (isEdit) {
      setshowdivs(true)
      const return_id = location.state;
      const requestobj = {
        return_id: return_id
      };
      console.log(requestobj, "requestobj");
      dispatch(EditReturnpodetails(requestobj)).then((response) => {
        if (response.payload?.statusCode === 200) {
          // Update the form state with the fetched client details
          const returnDetails = response.payload?.body[0];
          console.log(returnDetails, "returnDetails");
          let obj = {
            order_id: returnDetails.return_id || "",
            inward_id: returnDetails.inward_id || "",
            qa_date: returnDetails.qa_date || "",
            s_name: returnDetails.sender_name || "",
            s_no: returnDetails.sender_contact_number || "",
            description: returnDetails.description || "",
            status: returnDetails.status || "",
            // Add other form fields as needed
          }
          console.log(obj, 'obj');
          setForm({ ...obj });

          setPdfPreview(returnDetails?.invoice);
          setPdfPreview1(returnDetails?.qa_test);
          setImagePreviews(returnDetails?.photo);
          setSelectedFilesBase64(returnDetails?.invoice);
          setSelectedFilesBase641(returnDetails?.qa_test);
          setSelectedImageBase64(returnDetails?.photo);



          // Update 'parts' state variable
          const parts = returnDetails.parts || {};
          const partArray = Object.values(parts).map(item => ({

            mfr_prt_num: item.mfr_prt_num || "",
            prdt_name: item.prdt_name || "",
            description: item.description || "",
            packaging: item.packaging || "",
            fail_qty: item.fail_qty || "",
            status: item.status || "",
            price_per_piece: item.price_per_piece || "",
            price: item.price.toString() || "",
            manufacturer: item.manufacturer || "",
          }));

          console.log(partArray, "partArray");
          setPodata(partArray);
          // Update the state for order ID, inward ID, and QA date
          setgetOrderid(returnDetails?.return_id || "");
          setgetInwarid(returnDetails?.inward_id || "");
          const qaDateValue = returnDetails.qa_date;
          console.log(qaDateValue, "qaDateValue qaDateValue");
          setSelectedDate(returnDetails?.qa_date ? moment(qaDateValue, 'YYYY-MM-DD').toDate() : new Date());

        }
      });
    }
  }, [isEdit]);


  useEffect(() => {
    if (!isEdit) {
      setPodata([]);
    }
  }, [!isEdit])


  useEffect(() => {
    dispatch(getOrderidList());

  }, [dispatch])






  const calculatePricePerPiece = (qty, price) => {
    if (qty && price) {
      return (parseFloat(price) * parseFloat(qty)).toFixed(2);
    }
    return "-";
  };


  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => navigate(-1)}
            />
            {isEdit ? 'Edit Purchase Return' : 'Purchase Return'}

          </h1>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            <h3 className="inner-tag">{returnPOText?.orderDetails}</h3>
            <Row>
              <Col xs={12} md={3}>
                {isEdit ? (
                  /* Show your new input field for edit mode here */
                  <Form.Group className="mb-3">
                    <Form.Label>{returnPOText?.orderId}</Form.Label>
                    <Form.Control
                      type="text"
                      name="return_id"
                      value={orderidset}
                      required={true}
                      disabled={true}
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label>{returnPOText?.orderId}</Form.Label>
                    <Form.Select
                      name="order_id"
                      value={selectedOption}
                      onChange={(e) => {
                        handleSelectChange(e.target.value);
                      }}
                      required={true}
                    >
                      <option value="">Select</option>
                      {getOrderids()}
                    </Form.Select>
                  </Form.Group>
                )}
              </Col>
              <Col xs={12} md={3}>

                {isEdit ? (
                  /* Show your new input field for edit mode here */
                  <Form.Group className="mb-3">
                    <Form.Label>{returnPOText?.inwardId}</Form.Label>
                    <Form.Control
                      type="text"
                      name="inward_id"
                      value={inwardidset}
                      required={true}
                      disabled={true}
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label>{returnPOText?.inwardId}</Form.Label>
                    <Form.Select name="inward_id" value={selectedInwardid} onChange={handleSelectInward} required={true}>
                      <option value="">Select</option>
                      {getInwardids()}
                    </Form.Select>
                  </Form.Group>
                )}

              </Col>


              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{returnPOText?.qaDate}</Form.Label>
                  {/* <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    name="qa_date"
                    className="form-control"
                    onFocus={(e) => e.target.readOnly = true}
                    minDate={new Date()}
                    disabled={isEdit}
                  /> */}
                  <Form.Control type="text" name="qa_date" value={form?.qa_date} required={true} maxLength={30} disabled={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{returnPOText?.senderName}</Form.Label>
                  <Form.Control type="text" name="s_name" value={form?.s_name} required={true} maxLength={30} disabled={true} />
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{returnPOText?.sendcontactNumber}</Form.Label>
                  <Form.Control type="text" name="s_no" pattern="[0-9]*"
                    minLength={10}
                    maxLength={10} value={form?.s_no} required={true} disabled={true} />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>{returnPOText?.status}</Form.Label>
                  <Form.Select required={true} name="status" value={form?.status} onChange={onUpdateField}>
                    <option value="">Select</option>
                    <option value="POGenerated">PO Generated</option>
                    <option value="POIssued">PO Issued</option>
                    <option value="Ordered">Ordered</option>
                    <option value="EmailConfirmation">Email Confirmation</option>
                    <option value="VendorAckknowledged">Vendor Ackknowledged</option>
                    <option value="PartiallyReceived">Partially Received</option>
                    <option value="Received">Received</option>
                    <option value="Cancel">Cancel</option>
                    <option value="Return Initiated">Return Initiated</option>
                    <option value="Return Completed">Return Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>

            </Row>

            <Row>
              {showdivs && (
                <>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-0 position-relative">
                      <Form.Label>{returnPOText?.uploadInvoice} </Form.Label>
                      <div className="upload-btn-wrapper">
                        <img
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                          src={pdfImage}
                          alt="pdf preview"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-0 position-relative">
                      <Form.Label>{returnPOText?.qaTextdoc}</Form.Label>
                      <div className="upload-btn-wrapper">
                        <img
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                          src={pdfImage}
                          alt="pdf preview"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </>
              )}
              {/* 
              <Col xs={12} md={3}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label>{returnPOText?.uploadPhoto}</Form.Label>
                  <div className="upload-btn-wrapper position-relative">

                    <img
                      style={{ maxwidth: "100px", maxHeight: "100px" }}
                      src={retpodata?.photo}
                      alt="img-preview"
                    />

                  </div>
                  <div>{imageName && <p className="uploadimg-tag">{imageName}</p>}</div>
                </Form.Group>
              </Col> */}

              {Object.keys(imagePreviews).map((imageName) => (
                <Col xs={12} md={3} key={imageName}>
                  <Form.Group className="mb-0 position-relative">
                    <Form.Label>{imageName}</Form.Label>
                    <div class="upload-btn-wrapper">
                      <div>
                        {/* <img
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                          src={imagePreviews[imageName]}
                          alt={imageName}
                        /> */}
                        <span className="picsec position-relative" >
                    <img style={{ maxWidth: "100px", maxHeight: "100px" }}
                     src={imagePreviews[imageName]}
                     alt={imageName} />
                      </span>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              ))}

              <Col xs={12} md={3}>
                <Form.Group className="mb-0 position-relative">
                  <Form.Label>{returnPOText?.desc}</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={form?.description}
                    required={true}
                    maxLength={500}
                    style={{ height: "100px" }}
                    onChange={onUpdateField}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="table-responsive mt-4">
              <Table className="bg-header table-nowrap">
                <thead>
                  <tr>
                    <th>{returnPOText?.sno}</th>
                    <th>{returnPOText?.mPartno}</th>
                    <th>{returnPOText?.partName}</th>
                    <th>{returnPOText?.manufacturer}</th>
                    <th>{returnPOText?.desc}</th>
                    {/* <th>{returnPOText?.packaging}</th> */}
                    <th>{returnPOText?.qty}</th>
                    <th>{returnPOText?.price}</th>
                    <th>{returnPOText?.pricePiece}</th>
                    <th>{returnPOText?.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(podata) && podata.length > 0 ? (
                    podata.map((data, index) => {
                      totalQty += +data?.fail_qty || 0;
                      totalPrice += +data?.price || 0;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data?.mfr_prt_num}</td>
                          <td>{data?.prdt_name}</td>
                          <td>{data?.manufacturer ? data?.manufacturer : "-"}</td>
                          <td>{data?.description}</td>
                          {/* <td>{data?.packaging || "-"}</td> */}
                          <td>{data?.fail_qty}</td>
                          <td>&#8377; {data?.price || "-"}</td>
                          <td>&#8377; {data?.price_per_piece || "-"}</td>
                          {/* <td>{data?.qty * data?.price}</td> */}
                          <td>
                            <Button className="fail-btn btn">Fail</Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">{tableContent?.nodata}</td>
                    </tr>
                  )}

                </tbody>
                <tfoot>
                  <tr>
                    <td>{returnPOText?.total}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{totalQty}</td>
                    <td>&#8377; {totalPrice}</td>
                    <td></td>
                    <td>&nbsp;</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button type="button" className="cancel me-2" onClick={() => {
              navigate(-1);
            }}>
              {buttonTexts?.cancel}
            </Button>

            {isEdit ?
              <>
                <Button type="submit" className="submit">
                  {buttonTexts?.markUpdate}
                </Button></> :
              <>
                <Button type="submit" className="submit">
                  {buttonTexts?.markReturn}
                </Button>
              </>}
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">{formFieldsVendor.loader}</span>
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
        transition={Zoom} />


    </>
  );
};

export default ReturnPurchase;
