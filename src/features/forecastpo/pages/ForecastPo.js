import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Row, Table } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { selectbomPrice, getbomprice, addForecast, clientlistSelection, selectLoadingState, selectForecastClientList, draftForecast, selecteditForecastList, geteditForecast, selectbomList, getbomnames, updateForecast,updatedraftForecast } from '../slice/ForecastSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";
const ForecastPo = ({ isEdit }) => {
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [bompricevalue, setBompricevalue] = useState("");
    //selected month
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectbtn, setSelectbtn] = useState("");
    //client useselectot
    const clientnamelist = useSelector(selectForecastClientList);
    const clientnamesdata = clientnamelist?.body
    //clent names
    const [selectedOption, setSelectedOption] = useState("");
    //inwardid
    const [selectedInwardid, setSelectedInwardid] = useState("");
    //editor
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [dataeditor, setDataeditor] = useState("");
    const [dataeditorterms, setDataeditorterms] = useState("");
    //editor
    const [pdfFileName, setPdfFileName] = useState("");
    const [pdfPreview, setPdfPreview] = useState(null);
    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [fileNamespdf, setFileNamespdf] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const fcpo_id = location.state || {};

    const isDraft = location.state?.isDraft || "";
    console.log(isDraft,":om isDraft");
    const isStatus = location.state?.isStatus || "";
    console.log(isStatus,":om isStatus");   

    const isLoading = useSelector(selectLoadingState);
    const clientbomnamelist = useSelector(selectbomList);
    const clientbomnamesdata = clientbomnamelist?.body
    //console.log(clientbomnamesdata, "ommm");
    const returnpoList = useSelector(selectbomPrice);
    // console.log(returnpoList, "bom price");
    //getedit forecast
    const ForecastList = useSelector(selecteditForecastList);
    const geteditdata = ForecastList
    // console.log(geteditdata, "om111111111111111");

    const getOrderids = () => {
        if (Array.isArray(clientnamesdata)) {
            return clientnamesdata?.map((value, index) => {
                return (
                    <option value={value.client_name.trim()} key={index}>
                        {value.client_name}
                    </option>
                );
            });
        }
    };

    const getInwardids = () => {
        if (Array.isArray(clientbomnamesdata)) {
            return clientbomnamesdata?.map((value, index) => {
                return (
                    <option value={value.bom_name} key={index}>
                        {value.bom_name}
                    </option>
                );
            });
        }
    };

    const getMonthsOptions = (selected) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months.map((month) => (
            <option key={month} value={month} disabled={forecastDetails?.some((item) => item?.month == month)}>
                {month}
            </option>
        ));
    };

    const [form, setForm] = useState({
        buyerDetails: "",
        deliveryLocation: "",
        supplierDetails: "",
        supplierLocation: "",
        primaryDocumentDetails: {
            document_title: "",
            document_date: "",
            delivery_date: "",
            client_name: "",
            bom_name: "",
            payment_terms: "",
            note: ""
        },

    });
    useEffect(() => {
        setEditorLoaded(true);
    }, []);
    const [forecastDetails, setRows] = useState([
        { month: '', due_date: '', description: '', quantity: '', unit_price: "", order_value: '' }
    ]);
    const addRow = () => {
        let obj = isEdit ? { month: '', due_date: '', description: "", quantity: '', unit_price: forecastDetails[0]?.unit_price, order_value: '', order_status: '', payment_status: '' } : { month: '', due_date: '', description: "", quantity: '', unit_price: bompricevalue, order_value: '' }
        setRows([...forecastDetails, obj]);
    };
    const handleChange = (index, field, value) => {
        const updatedForecastDetails = [...forecastDetails];
        updatedForecastDetails[index][field] = value;
        if (field === 'quantity' || field === 'unit_price') {
            const quantity = parseFloat(updatedForecastDetails[index]['quantity']) || 0;
            const unitPrice = parseFloat(updatedForecastDetails[index]['unit_price']) || 0;
            updatedForecastDetails[index]['order_value'] = (quantity * unitPrice);
        }
        setRows([...updatedForecastDetails]);

    };

    const handlePdfChange = (e) => {
        const selectedFile = e.target.files[0];
        const newFileNames = [...fileNames];
        const newFilesBase64 = [...selectedFilesBase64];
        let invalidFileType = false;
        if (selectedFile) {
            if (selectedFile.size > 700 * 1024) {
                // Show toast message for file size exceeding limit
                invalidFileType = true;
                const inputElement = document.querySelector('input[type="file"][name="data_sheet"]');
                if (inputElement) {
                    inputElement.value = '';
                }
                toast.error("File size should not exceed 700KB.");
            }
            if (!invalidFileType) {
                newFileNames.push(selectedFile.name);
                const reader = new FileReader();
                setPdfFileName(selectedFile?.name)
                reader.onload = (fileOutput) => {
                    setPdfPreview(reader.result);
                    const encodedFile = fileOutput.target.result.split(",")[1];
                    newFilesBase64.push(encodedFile);
                };
                if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
                    reader.readAsDataURL(selectedFile);
                } else {
                    alert('Please select a PDF or image file.');
                    return;
                }
            }
        }

        setSelectedFiles([selectedFile]);
        setFileNamespdf(newFileNames);
        setSelectedFilesBase64(newFilesBase64);
    };

    const handleCancelPdfPreview = () => {
        setPdfPreview(null);
        setPdfFileName("");
        setSelectedFilesBase64([]);
        const inputElement = document.querySelector('input[type="file"][name="data_sheet"]');
        if (inputElement) {
            inputElement.value = '';
        }
    };
    //client list api
    useEffect(() => {
        dispatch(clientlistSelection());
    }, [])

    const inwardList = (value) => {
        const requestobj = {
            client_name: value
        };
        dispatch(getbomnames(requestobj))
    }

    useEffect(() => {
        if (selectedOption) {
            inwardList(selectedOption)
        }
    }, [selectedOption])

    const handleSelectChange = async (value) => {
        setSelectedOption(value);
    };

    const handleSelectInward = async (e) => {
        setSelectedInwardid(e.target.value);
        const requestobj = {
            client_name: selectedOption,
            bom_name: e.target.value,
        };
        console.log(requestobj, "bomnameee");
        await dispatch(getbomprice(requestobj))
    };

    useEffect(() => {
        if (returnpoList && selectedInwardid) {
            console.log(returnpoList?.body?.bom_price);
            setRows([...forecastDetails?.map((item) => ({ ...item, unit_price: returnpoList?.body?.bom_price }))])
            setBompricevalue(returnpoList?.body?.bom_price)
        }
    }, [returnpoList])

    useEffect(() => {
        if (!selectedInwardid) {
            setBompricevalue(null);
        }

    }, [])

    const onUpdateField = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trimStart();  // Trim leading spaces    
        let nextFormState = { ...form };
        let nestedObj = nextFormState;
        // Handle nested objects
        if (name.includes('.')) {
            const keys = name.split('.');
            const topLevelKey = keys.shift();  // Get the top-level key
            nestedObj = nestedObj[topLevelKey];  // Point to the nested object    
            // Traverse the nested object to the correct level
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    nestedObj[key] = trimmedValue;
                } else {
                    nestedObj = nestedObj[key];
                }
            });
        } else {
            // If not a nested object, update directly
            nestedObj[name] = trimmedValue;
        }

        setForm({ ...form, ...nextFormState });
    };
    //edit
    useEffect(() => {
        if (isEdit) {
            const requestobj = {
                "fcpo_id": fcpo_id
            };
            console.log(requestobj?.fcpo_id, "ommmm");
            dispatch(geteditForecast(fcpo_id)).then((response) => {
                if (response.payload?.statusCode === 200) {
                    // Update the form state with the fetched client details
                    const geteditforecastdetails = response.payload?.body;
                    console.log(geteditforecastdetails, "ommmm gettttt");
                    setForm({
                        buyerDetails: geteditforecastdetails.buyer_details,
                        deliveryLocation: geteditforecastdetails?.delivery_location,
                        supplierDetails: geteditforecastdetails?.supplier_details,
                        supplierLocation: geteditforecastdetails?.supplierLocation,
                        primaryDocumentDetails: {
                            document_title: geteditforecastdetails.primary_document_details?.document_title,
                            document_number: geteditforecastdetails.primary_document_details?.document_number,
                            payment_terms: geteditforecastdetails.primary_document_details?.payment_terms,
                            note: geteditforecastdetails.primary_document_details?.note
                        },
                    })
                    setSelectedInwardid(geteditforecastdetails.primary_document_details?.bom_name)
                    setSelectedOption(geteditforecastdetails.primary_document_details?.client_name)
                    setStartDate(new Date(geteditforecastdetails.primary_document_details?.delivery_date))
                    setStartdocDate(new Date(geteditforecastdetails.primary_document_details?.document_date))
                    // setDataeditor(geteditforecastdetails[0]?.all_attributes?.primary_document_details?.payment_terms)
                    // setDataeditorterms(geteditforecastdetails[0]?.all_attributes?.primary_document_details?.note)
                    setPdfFileName(geteditforecastdetails?.documents?.doc_name)
                    setPdfPreview(geteditforecastdetails?.documents?.doc_body);

                    // Update 'boms' state variable
                    const boms = geteditforecastdetails.forecast_details || {};
                    const bomArray = Object.values(boms).map(bom => ({ ...bom, due_date: new Date(bom?.due_date) }));
                    console.log(bomArray, 'bomArry');
                    setRows(bomArray);

                }
            });
        }
    }, [isEdit]);
    //edit



    const onSubmitforecast = async (e) => {
        e.preventDefault();
        // const pdfBase64 = pdfPreview ? pdfPreview.split(',')[1] : '';
        // const pdfBase64 = pdfPreview.startsWith('data:') ? pdfPreview.split(',')[1] : pdfPreview;
        const pdfBase64 = pdfPreview && pdfPreview.startsWith('data:') ? pdfPreview.split(',')[1] : pdfPreview || "";
        const formData = {
            buyerDetails: form.buyerDetails.trim(),
            deliveryLocation: form.deliveryLocation.trim(),
            supplierDetails: form.supplierDetails.trim(),
            supplierLocation: form.supplierLocation.trim(),
            primaryDocumentDetails: {
                document_title: form.primaryDocumentDetails.document_title.trim(),
                document_date: moment(startdocDate).format('YYYY-MM-DD'),
                // document_number: form.primaryDocumentDetails.document_number.trim(),
                delivery_date: moment(startDate).format('YYYY-MM-DD'),
                client_name: selectedOption.trim(),
                bom_name: selectedInwardid.trim(),
                payment_terms: form.primaryDocumentDetails.payment_terms,
                note: form.primaryDocumentDetails.note
            }
        };

        const isFormValid = Object.values(formData).every(value => {
            if (typeof value === 'object') {
                return Object.values(value).every(val => val !== '');
            } else {
                return value !== '';
            }
        });
        const areRowsValid = forecastDetails.every(row => {
            return Object.values(row).every(val => val !== '');
        });

        const isFileSelected = pdfFileName !== '';

        if (!isFormValid || !isFileSelected) {
            // Notify user about empty required fields
            toast.error("Please fill in all required fields and upload a file.");
            setIsErrorToastVisible(true);
            return;
        }
        let forcastArray = forecastDetails?.map((item) => ({ ...item, due_date: moment(item?.due_date).format('YYYY-MM-DD') }))
        const requestBody = {
            ...formData,
            forecastDetails: forcastArray,
            forecastInvoice: {
                doc_body: pdfBase64,
                doc_name: pdfFileName
            },
        };

        // console.log(requestBody);
        if (isEdit) {
            const requestBody = {
                ...fcpo_id,
                ...formData,               
                forecastDetails: forcastArray,
                forecastInvoice: {
                    doc_body: pdfBase64,
                    doc_name: pdfFileName
                }
            };
           
            if (selectbtn === 'SAVEANDUPDATE') {
                // console.log(requestBody, "rebody");
                // let method = isDraft ? updatedraftForecast(requestBody) : updateForecast(requestBody);  

                const draftRequestBody = {
                    ...requestBody,
                  
                  }; 
                const updatedRequestBody = {
                    ...requestBody,
                    updatestatus: isStatus,
                  };  
                console.log("isDraft value:", isDraft, "Type:", typeof isDraft);         
                const isDraftBoolean = isDraft === "isDraft" || isDraft === "1";
                console.log(isDraftBoolean,"omm");                

                // Assign the function, not the function call
                let method = isDraftBoolean ? updatedraftForecast : updateForecast;
                let reqbodymedthod = isDraftBoolean ? draftRequestBody : updatedRequestBody;
                const response = await dispatch(method(reqbodymedthod));
                if (response.payload?.statusCode === 200) {
                    setIsErrorToastVisible(true);
                    handleClear();
                    setTimeout(() => {
                        navigate(-1)
                    }, 2000);
                }
                else { setIsErrorToastVisible(true); }
            }

        } else {

            if (selectbtn === 'SAVEANDSEND') {
                const response = await dispatch(addForecast(requestBody));
                if (response.payload?.statusCode === 200) {
                    setIsErrorToastVisible(true);
                    handleClear();
                    setTimeout(() => {
                        navigate(-1)
                    }, 2000);
                }
                else { setIsErrorToastVisible(true); }

            } else if (selectbtn === 'SAVEDRAFT') {
                const response = await dispatch(draftForecast(requestBody));
                if (response.payload?.statusCode === 200) {
                    setIsErrorToastVisible(true);
                    handleClear();
                    setTimeout(() => {
                        navigate(-1)
                    }, 2000);
                }
                else { setIsErrorToastVisible(true); }
            }

        }

    };

    const handleClear = () => {
        setForm({
            buyerDetails: "",
            deliveryLocation: "",
            supplierDetails: "",
            supplierLocation: "",
            primaryDocumentDetails: {
                document_title: "",
                document_date: "",
                // document_number: "",
                delivery_date: "",
                client_name: "",
                payment_terms: "",
                note: ""
            },

        });
        setPdfPreview(null);
        setPdfFileName("");
        setSelectedFilesBase64([]);
        setDataeditor("");
        setDataeditorterms("");
        setSelectedOption("");
        setRows([{ month: '', due_date: '', bom_name: '', quantity: '', order_value: '' }]);

    }

    const getMinDate = (month) => {
        const minDate = moment(month, 'MMMM').startOf('month').toDate();
        return minDate
    }

    const getMaxDate = (month) => {
        const maxDate = moment(month, 'MMMM').add(0, 'months').endOf('month').toDate();
        return maxDate
    }
    const handleRemoveRow = (index) => {
        const removedMonth = forecastDetails[index].month;
        const updatedForecastDetails = forecastDetails.filter((_, idx) => idx !== index);
        const updatedSelectedMonths = selectedMonths.filter((month) => month !== removedMonth);
        setRows(updatedForecastDetails);
        setSelectedMonths(updatedSelectedMonths);
    };
    return (
        <>
            <div className="wrap">
                <form onSubmit={onSubmitforecast}>
                    <div className="d-flex justify-content-between">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            />
                            {isEdit ? 'Edit forecast Purchase Order' : 'Create forecast Purchase Order'}

                        </h6>
                        <div className="d-flex">
                            <Form.Group >
                                <Form.Select aria-label="Default select example" className="clientselect" style={{ maxWidth: '150px', textAlign: 'center' }}
                                    type="text"
                                    placeholder=""
                                    name="type"
                                    required
                                >
                                    <option>Clients</option>
                                </Form.Select>

                            </Form.Group>
                            <div>

                                <div class="upload-btn-wrap ms-3">
                                    <button class="btn" disabled={pdfPreview !== null || isEdit}>Upload Forecast Doc</button>
                                    <input type="file"
                                        onChange={handlePdfChange}
                                        accept="application/pdf, image/jpeg, image/png"
                                        name="data_sheet" disabled={pdfPreview !== null} />
                                    <span className="text-danger">*</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="content-sec">
                        <Row>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">Buyer Details <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="buyerDetails"
                                        value={form.buyerDetails}
                                        onChange={onUpdateField}
                                        style={{ height: "100px" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">Delivery Location <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="deliveryLocation"
                                        value={form.deliveryLocation}
                                        onChange={onUpdateField}
                                        style={{ height: "100px" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">Supplier Details <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="supplierDetails"
                                        value={form.supplierDetails}
                                        onChange={onUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">Supplier Location <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="supplierLocation"
                                        value={form.supplierLocation}
                                        onChange={onUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
                        <div className="wrap2">
                            <h5 className="inner-tag my-2">Primary Document Details</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Document Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="primaryDocumentDetails.document_title"
                                                value={form.primaryDocumentDetails.document_title}
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Document Date <span className="text-danger">*</span></Form.Label>
                                            {/* <Form.Control
                                                type="date"
                                                name="primaryDocumentDetails.document_date"
                                                placeholder="YYYY-MM-DD"
                                                value={form.primaryDocumentDetails.document_date}
                                                onChange={onUpdateField}
                                            /> */}
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Document Number <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="primaryDocumentDetails.document_number"
                                                value={form.primaryDocumentDetails.document_number}
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col> */}
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Delivery Date <span className="text-danger">*</span></Form.Label>
                                            {/* <Form.Control
                                                type="date"
                                                name="primaryDocumentDetails.delivery_date"
                                                placeholder="YYYY-MM-DD"
                                                value={form.primaryDocumentDetails.delivery_date}
                                                onChange={onUpdateField}                                              
                                            /> */}
                                            <DatePicker
                                                className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startDate} onChange={(date) => setStartDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Client Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="primaryDocumentDetails.client_name"
                                                value={selectedOption}
                                                onChange={(e) => {
                                                    handleSelectChange(e.target.value);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {getOrderids()}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Bom Names <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="primaryDocumentDetails.bom_name"
                                                value={selectedInwardid}
                                                onChange={handleSelectInward}
                                            >
                                                <option value="">Select</option>
                                                {getInwardids()}
                                            </Form.Select>
                                        </Form.Group>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={6} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Payment Terms <span className="text-danger">*</span></Form.Label>
                                            {/* <TermsEditor
                                                name="primaryDocumentDetails.payment_terms"
                                                onChange={(data) => {
                                                    setDataeditorterms(data);
                                                }}
                                                value={dataeditorterms}
                                                editorLoaded={editorLoaded}

                                            /> */}
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="primaryDocumentDetails.payment_terms"
                                                value={form.primaryDocumentDetails.payment_terms}
                                                onChange={onUpdateField}
                                                required={true}
                                                maxLength={500}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Note <span className="text-danger">*</span></Form.Label>

                                            {/* <TermsEditor
                                                name="primaryDocumentDetails.note"
                                                onChange={(data) => {
                                                    setDataeditor(data);
                                                }}
                                                value={dataeditor}
                                                editorLoaded={editorLoaded}

                                            /> */}
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="primaryDocumentDetails.note"
                                                value={form.primaryDocumentDetails.note}
                                                onChange={onUpdateField}
                                                required={true}
                                                maxLength={500}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div>
                                            {pdfFileName && <p className="m-0 attachment-sec1">
                                                {pdfFileName}
                                                <span
                                                    role="button" tabindex="0" className="py-1 px-2"
                                                    onClick={handleCancelPdfPreview}
                                                >
                                                    &times;
                                                </span></p>}</div>
                                    </Col>
                                </Row>
                            </div>
                            <h5 className="inner-tag my-2">Adding to forecast list</h5>

                            <div className="wrap3 forecasttablealign">
                                <div className="table-responsive mt-4">
                                    <Table className="dark-header">
                                        <thead>
                                            <tr>
                                                <th>Month <span className="text-danger">*</span></th>
                                                <th>Due Date <span className="text-danger">*</span></th>
                                                <th>Description <span className="text-danger">*</span></th>
                                                <th>Quantity <span className="text-danger">*</span></th>
                                                <th>Unit Price <span className="text-danger">*</span></th>
                                                <th>Order Value <span className="text-danger">*</span></th>
                                                {isEdit ? (
                                                    <>
                                                        <th>Order Status <span className="text-danger">*</span></th>
                                                        <th>Payment Status <span className="text-danger">*</span></th>
                                                    </>
                                                ) : null}
                                                <th>&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {forecastDetails.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <select
                                                            value={row.month}
                                                            // disabled={row.due_date}
                                                            onChange={(e) => handleChange(index, 'month', e.target.value)}
                                                            required
                                                        >   <option value="">Select A Month</option>
                                                            {getMonthsOptions(selectedMonths)}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            disabled={!row.month}
                                                            minDate={getMinDate(row?.month)}
                                                            maxDate={getMaxDate(row?.month)}
                                                            selected={row.due_date}
                                                            onChange={(e) => handleChange(index, 'due_date', e)}
                                                            dateFormat="yyyy-MM-dd"
                                                            placeholderText="YYYY-MM-DD"
                                                            onFocus={(e) => e.target.readOnly = true}
                                                            required={true}

                                                        />

                                                    </td>

                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={row.description}
                                                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="input-50"
                                                            value={row.quantity}
                                                            required
                                                            onChange={(e) => handleChange(index, 'quantity', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className="input-100"
                                                            type="text"
                                                            value={row.unit_price}
                                                            disabled={true}
                                                            onChange={(e) => handleChange(index, 'unit_price', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-100"
                                                            type="text"
                                                            disabled
                                                            value={row.order_value}
                                                            onChange={(e) => handleChange(index, 'order_value', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </td>
                                                    {isEdit ? (
                                                        <>
                                                            <td> <select value={row?.order_status} required onChange={(e) => handleChange(index, 'order_status', e.target.value)} >
                                                               <option value="">Select</option>
                                                                <option value="Created">Created</option>
                                                                <option value="Completed">Completed</option>

                                                            </select>
                                                            </td>
                                                            <td>
                                                                <select value={row?.payment_status} required onChange={(e) => handleChange(index, 'payment_status', e.target.value)} >
                                                                    <option value="">Select</option>
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Completed">Completed</option>
                                                                </select>
                                                            </td>
                                                        </>
                                                    ) : null}
                                                    <td>

                                                        {index === forecastDetails.length - 1 && forecastDetails.length < 12 && (
                                                            <button onClick={addRow}>+</button>
                                                        )}
                                                        {index !== forecastDetails.length - 1 && (
                                                            <button onClick={() => handleRemoveRow(index)}>-</button>
                                                        )}
                                                        {index === 11 && (
                                                            <button onClick={() => handleRemoveRow(index)}>-</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="d-flex justify-content-end mt-2">
                                    {/*                                     
                                    <Button type="submit" onClick={(e) => setSelectbtn('SAVEDRAFT')} className="cancel" disabled={isErrorToastVisible}>SAVE DRAFT</Button>
                                    <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={(e) => setSelectbtn('SAVEANDSEND')} disabled={isErrorToastVisible}>SAVE AND SEND</Button> */}
                                    {isEdit ? (

                                        <>
                                            <Button type="submit" className="cancel" onClick={() => {navigate(-1)}} disabled={isErrorToastVisible}>
                                                CANCEL
                                            </Button>
                                            <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={() => setSelectbtn('SAVEANDUPDATE')} disabled={isErrorToastVisible}>
                                              UPDATE & SUBMIT
                                            </Button>
                                        </>
                                    ) : (

                                        <>
                                            <Button type="submit" onClick={() => setSelectbtn('SAVEDRAFT')} className="cancel" disabled={isErrorToastVisible}>
                                                SAVE DRAFT
                                            </Button>
                                            <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={() => setSelectbtn('SAVEANDSEND')} disabled={isErrorToastVisible}>
                                                 UPDATE & SUBMIT
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
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
                onClose={() => setIsErrorToastVisible(false)}
            />
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

        </>
    );
};
export default ForecastPo;
