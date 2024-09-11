import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from "react-bootstrap";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";
import numberToWords from 'number-to-words';
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {createclientforecastPOText} from '../../../utils/TableContent';
import { selectLoadingState, selectclientforecast, clientforecast, getbomnames, selectbomList, getbomprice, selectbomPrice, selectForecastClientList, clientlistSelection,clientdraft,selectEditclient,editclient,clientpoeditget,selectEditclientget } from "../slice/ForecastSlice";

const EditClientPo = () => {
    const navigate = useNavigate();
    const [selectbtn, setSelectbtn] = useState("");
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
    const [documentDate, setDocumentDate] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [selectedInwardid, setSelectedInwardid] = useState(null);
    const [isChecked, setIsChecked] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [dataeditor, setDataeditor] = useState("");
    const [dataeditorterms, setDataeditorterms] = useState("");
    const [gst, setgst] = useState(0);
    //editor
    const [pdfFileName, setPdfFileName] = useState("");
    const [pdfPreview, setPdfPreview] = useState(null);
    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [fileNamespdf, setFileNamespdf] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const isLoading = useSelector(selectLoadingState);
    const dispatch = useDispatch();
    const [advanceToPay, setAdvanceToPay] = useState(0);
    const [balanceToPay, setBalanceToPay] = useState(0);
    const [selectedData, setSelectedProducts] = useState([]);

    const location = useLocation();
    const {clientpurchaseordernum} = location.state || {};
    console.log(clientpurchaseordernum,"ommmmmmmmmmmmmmmmmmmmmmmmmmmm");
    const isStatus = location.state?.isStatus || "";
    console.log(isStatus,":om isStatus");

    const [bomname, setBomname] = useState("");

    const clientnamelist = useSelector(selectForecastClientList);
    const clientnamesdata = clientnamelist?.body
    // console.log(clientnamelist, "clientt");

    const clientbomnamelist = useSelector(selectbomList);
    const clientbomnamesdata = clientbomnamelist?.body
    // console.log(clientbomnamesdata, "ommm");

    const returnpoList = useSelector(selectbomPrice);
    // console.log(returnpoList, "bom price");

    const clientcreate = useSelector(selectclientforecast);
    const clientdata = clientcreate?.body
    // console.log(clientdata, "clientttttt");

    // const clientget = useSelector(selectEditclientget)
    // const Edit = clientget?.body
    //  console.log(Edit)

    const [productlistDetails, setRows] = useState([
        { item_no: bomname, hsn_sac_code: '', qty: '', unit: "", price: '', gst: "", total_price: "" }
    ]);

 
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


    useEffect(() => {
        dispatch(getbomnames())
        dispatch(getbomprice());
        // dispatch(clientforecast())
    }, []);

    useEffect(() => {
        calculateBalanceToPay(advanceToPay);
    }, [productlistDetails]);
    

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

    useEffect(() => {
        dispatch(clientlistSelection());
    }, [])

    const handleSelectInward = async (e) => {
        setSelectedInwardid(e.target.value);
        const selectedBomName = e.target.value;
        // Update the item_no field in productlistDetails with the selected BOM name
        const updatedProductlistDetails = productlistDetails.map(item => ({
            ...item,
            item_no: selectedBomName // Update item_no with the selected BOM name
        }));
        setRows(updatedProductlistDetails); // Update the state with the modified productlistDetails
    };
  
    useEffect(() => {
        if (clientbomnamesdata && selectedInwardid) {
            const bomName = clientbomnamesdata?.find(bom => bom.bom_name === selectedInwardid)?.bom_name;
            if (bomName) {
                setRows([...productlistDetails.map((item) => ({ ...item, item_no: bomName }))]);
                setBomname(bomName);
            }
        }
    }, [clientbomnamesdata, selectedInwardid]);

    useEffect(() => {
        if (!selectedInwardid) {
            setBomname(null);
        }

    }, [])
    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const handleSelectChange = async (value) => {
        setSelectedOption(value);
    };

    const [form, setForm] = useState({
        buyerDetails: "",
        deliveryLocation: "",
        supplierDetails: "",
        supplierLocation: "",
        primary_document_details: {
            document_title: "",
            document_date: "",
            document_number: "",
            delivery_date: "",
            client_name: "",
            bom_name: "",
            payment_terms: "",
            // note: ""
        },
        total_amount: {
            total_before_tax: "",
            total_tax_gst: "",
            total_after_tax: "",
        },
        grand_total: {
            advance_to_pay: "",
            balance_to_pay: "",
        }

    })

    useEffect(() => {
        const request ={
            Client_Purchaseorder_num : clientpurchaseordernum
        }
        dispatch(clientpoeditget(request));
        
    }, [clientpurchaseordernum]);

    const clientget = useSelector(selectEditclientget)
    const Edit = clientget?.body
    const clientgetdata = clientget?.body
    //  console.log(Edit)

    useEffect(() => {
        if (clientget?.body) {
            const client = clientget?.body
            const documentDate = client?.primary_document_details?.document_date;
            const deliveryDate = client?.primary_document_details?.delivery_date;
            if (documentDate) {
                const parsedDocumentDate = new Date(documentDate);
                if (!isNaN(parsedDocumentDate)) { // Check if the date is valid
                    setDocumentDate(parsedDocumentDate);
                } 
            }
            if (deliveryDate) {
                const parsedDeliveryDate = new Date(deliveryDate);
                if (!isNaN(parsedDeliveryDate)) { // Check if the date is valid
                    setDeliveryDate(parsedDeliveryDate);
                } 
            }
            //  console.log(client, "cccc");
            //  console.log(client?.productlistdoc?.doc_name);
             setPdfFileName(client?.productlistdoc?.doc_name)
             setPdfPreview(client?.productlistdoc?.doc_body);
             setAdvanceToPay(client?.grand_total?.advance_to_pay);
           // setSelectedOption(client?.primary_document_details?.status);
           setSelectedOption(client?.primary_document_details?.client_name)
           setSelectedInwardid(client?.primary_document_details?.bom_name)
            setForm({
                buyerDetails:client?.buyer_details,
                deliveryLocation:client?.delivery_location,
                supplierDetails:client?.supplier_details,
                supplierLocation:client?.supplierLocation,
               document_title:client?.primary_document_details?.document_title,
               setSelectedOption:(client?.primary_document_details?.client_name ),              
               payment_terms:client?.primary_document_details?.payment_terms,

               total_amount: {
                total_before_tax: calculateTotalBeforeTax(),
                total_tax_gst: calculateTotalIGST(),
                total_after_tax: calculateTotalAfterTax(),
            },
            grand_total: {
                advance_to_pay: advanceToPay,
                balance_to_pay: balanceToPay,
            }
            });
            
            const productListDetails = client?.productlistDetails || {};
            const updatedProductlistDetails = Object.keys(productListDetails).map(key => ({
                item_no: productListDetails[key].item_no || "",
                hsn_sac_code: productListDetails[key].hsn_sac_code || "",
                qty: productListDetails[key].qty || "",
                unit: productListDetails[key].unit || "",
                price: productListDetails[key].price || "",
                gst: productListDetails[key].gst || "",
                total_price: productListDetails[key].total_price || "",
                total_igst: productListDetails[key].total_igst || "",
            }));
    
            // console.log(updatedProductlistDetails, "Updated Product List");
            setRows(updatedProductlistDetails);

        }
            // setProductList(clientDetails?.product_list);
        },[clientget,clientpurchaseordernum]) 
        // console.log(clientget, "kkkkkkkkkkkkkk")

    const onSubmitclient = async (e) => {
        e.preventDefault();
        
        // const pdfBase64 = pdfPreview ? pdfPreview.split(',')[1] : '';
        const pdfBase64 = pdfPreview.startsWith('data:') ? pdfPreview.split(',')[1] : pdfPreview;

        const totalBeforeTax = calculateTotalBeforeTax().toFixed(2);
        const totalTaxGST = calculateTotalIGST().toFixed(2);
        const totalAfterTax = (calculateTotalBeforeTax() + calculateTotalIGST()).toFixed(2);
         

        const formData = {
            buyer_details: form.buyerDetails,
            delivery_location: form.deliveryLocation,
            supplier_details: form.supplierDetails,
            supplierLocation: form.supplierLocation,
            primary_document_details: {
                document_title: form.document_title,
                document_date: moment(documentDate).format('YYYY-MM-DD'),
                // document_number: form.document_number.trim(),
                status : "Not dispatched",
                delivery_date: moment(deliveryDate).format('YYYY-MM-DD'),
                client_name: selectedOption,
                bom_name: selectedInwardid,
                payment_terms: form.payment_terms,
            },
            total_amount: {
                total_before_tax: totalBeforeTax,
                total_tax_gst: totalTaxGST,
                total_after_tax: totalAfterTax,
            },
            grand_total: {
                advance_to_pay: advanceToPay,
                balance_to_pay: balanceToPay,
            }
        };
       

        const isFormValid = Object.values(formData).every(value => {
            if (typeof value === 'object') {
                return Object.values(value).every(val => val !== '');
            } else {
                return value !== '';
            }
        });
           const areRowsValid = productlistDetails.every(row => {
            return Object.values(row).every(val => val !== '');
        });

        const isFileSelected = pdfFileName !=='';

        if (!isFormValid || !isFileSelected || !areRowsValid) {
            // Notify user about empty required fields
            toast.error("Please fill in all required fields and upload a file.");
            setIsErrorToastVisible(true);
            return;
        }

        let productlistArray = productlistDetails?.map((item) => ({ ...item,item_no: bomname}))

        console.log(productlistArray,"ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

        let productlistDetailsObj = productlistDetails.reduce((acc, item, index) => {
            acc[`product${index + 1}`] = {
              ...item,
              item_no: bomname,
            };
            return acc;
          }, {});
        
        
        const requestBody = {
            Client_Purchaseorder_num: clientpurchaseordernum,
            ...formData,
            productlistDetails: productlistDetailsObj,
            productlistdoc: {
                doc_body:  pdfBase64,
                doc_name: pdfFileName
            },
        };

        console.log(requestBody);

        if (selectbtn === 'SAVEANDSEND') { // Change to else if
            const response = await dispatch(editclient(requestBody));
            if (response.payload?.statusCode === 200) {
                setIsErrorToastVisible(true);
                handleClear();
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        }
    };

    const handleClear = () => {
        setForm({
            buyerDetails: "",
            deliveryLocation: "",
            supplierDetails: "",
            supplierLocation: "",
            primary_document_details: {
                document_title: "",
                document_date: "",
                status:"",
                delivery_date: "",
                client_name: "",
                bom_name:"",
                payment_terms: "",
                 },

        });
        setPdfPreview(null);
        setPdfFileName("");
        setSelectedFilesBase64([]);
        setDataeditor("");
        setDataeditorterms("");
        setSelectedOption("");
       // setRows([{delivery_date}]);

    }

    const [terms, setTerms] = useState("");

    const onUpdateField = (e) => {
        const value = e.target.value.trimStart();
        setTerms(value);
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: value,
        }));
    };


    const handlePdfChange = (e) => {
        const selectedFile = e.target.files[0];
        const newFileNames = [...fileNames];
        const newFilesBase64 = [...selectedFilesBase64];
        let invalidFileType = false;
        if (selectedFile) {
            if (selectedFile.size > 200 * 1024) {
                // Show toast message for file size exceeding limit
                invalidFileType = true;
                const inputElement = document.querySelector('input[type="file"][name="data_sheet"]');
                if (inputElement) {
                    inputElement.value = '';
                }
                toast.error("File size should not exceed 300KB.");
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

    const handleChange = (index, field, value) => {
        const updatedProductlistDetails = [...productlistDetails];
        const alphanumericRegex = /^[a-zA-Z0-9]*$/;
        updatedProductlistDetails[index][field] = value;

        if ((field === 'hsn_sac_code' || field === 'unit') && !alphanumericRegex.test(value)) {
            return; // Do not update if the value contains special characters
        }
    
        updatedProductlistDetails[index][field] = value;

        if (field === 'qty' || field === 'price') {
            updatedProductlistDetails[index].total_price = calculateTotal(updatedProductlistDetails[index].qty, updatedProductlistDetails[index].price);
        }

        if (field === 'gst') {
            updatedProductlistDetails[index].total_igst = parseFloat(value) || 0;
        }

        setRows(updatedProductlistDetails);
    };

    const calculateTotal = (qty, price) => {
        const quantity = parseFloat(qty) || 0;
        const unitPrice = parseFloat(price) || 0;
        return quantity * unitPrice;
    };

    const calculateTotalBeforeTax = () => {
        return productlistDetails.reduce((total, item) => {
            const itemTotal = parseFloat(item.qty) * parseFloat(item.price) || 0;
            return total + itemTotal;
        }, 0);
    };
    
    
    const calculateTotalIGST = () => {
        return productlistDetails.reduce((total, item) => {
            const itemTotal = parseFloat(item.qty) * parseFloat(item.price) || 0;
            const gstAmount = itemTotal * (parseFloat(item.gst) / 100) || 0;
            return total + gstAmount;
        }, 0);
    };
    
   
    const calculateTotalAfterTax = () => {
        const totalBeforeTax = calculateTotalBeforeTax();
        const totalIGST = calculateTotalIGST();
        return totalBeforeTax + totalIGST;
    };
    
    const handleAdvanceChange = (e) => {
        const advance = parseFloat(e.target.value) || 0;
        const totalAfterTax = calculateTotalAfterTax();
        console.log(totalAfterTax);
        if (advance > totalAfterTax) {
            toast.error("Advance to pay Can't be more than Total", {
                
            });
             setAdvanceToPay(totalAfterTax);
            calculateBalanceToPay(totalAfterTax);
        } else {
            setAdvanceToPay(advance);
            calculateBalanceToPay(advance);
        }
    };
    
    const calculateBalanceToPay = (advance) => {
        const totalAfterTax = calculateTotalAfterTax();
        const balance = totalAfterTax - (advance || 0);
        setBalanceToPay(balance);
    };

    const convertNumberToWords = (number) => {
        const [integerPart, decimalPart] = number.toString().split('.');
        let words = numberToWords.toWords(integerPart);
    
        if (decimalPart) {
            words += ' and';
            for (let digit of decimalPart) {
                words += ` ${numberToWords.toWords(digit)}`;
            }
            words += ' paise only';
        } else {
            words += ' only';
        }
    
        return words.charAt(0).toUpperCase() + words.slice(1); // Capitalize the first letter
    };
    
    const AmountInWords = convertNumberToWords(calculateTotalAfterTax());


    return (
        <>
            <div className="wrap">
                <form onSubmit={onSubmitclient}>
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
                            <span>Edit Client Purchase Order</span>
                        </h6>

                        <div>

                            <div class="upload-btn-wrap ms-3">
                                <button class="btn"
                                 disabled={pdfPreview !== null }
                                >Upload Doc</button>
                                <input type="file"
                                    onChange={handlePdfChange}
                                    accept="application/pdf, image/jpeg, image/png"
                                    name="data_sheet"
                                    multiple
                                disabled={pdfPreview !== null } 
                                />
                                <span className="text-danger">*</span>
                            </div>
                        </div>
                    </div>
                    <div class="content-sec">

                        <Row>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createclientforecastPOText?.buyerDetails}<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="buyerDetails"
                                        value={form.buyerDetails}
                                        placeholder=""
                                        onChange={onUpdateField}
                                        style={{ height: "100px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createclientforecastPOText?.deliveryLocation} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="deliveryLocation"
                                        value={form.deliveryLocation}
                                        placeholder=""
                                        onChange={onUpdateField}
                                        style={{ height: "100px" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createclientforecastPOText?.supplierDetails}<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="supplierDetails"
                                        value={form.supplierDetails}
                                        placeholder=""
                                        onChange={onUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-2">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createclientforecastPOText?.placeofSupply} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="supplierLocation"
                                        value={form.supplierLocation}
                                        placeholder=""
                                        onChange={onUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
                        <div className="wrap2">
                            <h5 className="inner-tag my-2">{createclientforecastPOText?.FormSubHeaderC}</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label  className="mb-0">{createclientforecastPOText?.documentTitle} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="document_title"
                                                value={form.document_title}
                                                onChange={(e) => onUpdateField(e)}
                                                placeholder=""
                                                required={true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label  className="mb-0">{createclientforecastPOText?.documentdate} <span className="text-danger">*</span></Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={documentDate}
                                                onChange={(date) => setDocumentDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            //onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label  className="mb-0">{createclientforecastPOText?.status} <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="text"
                                                value=""
                                            >
                                                <option value="">Not dispatched</option>
                                                {/* <option value="">In Transit</option>
                                                <option value="">Receieved</option>
                                                <option value="">Delayed</option> */}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                   </Row>
                                   <Row>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                        <Form.Label className="mb-0">{createclientforecastPOText?.deliveryDate} <span className="text-danger">*</span></Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={deliveryDate}
                                                onChange={(date) => setDeliveryDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label  className="mb-0">{createclientforecastPOText?.clientName} <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="primary_document_details.client_name"
                                                value={selectedOption}
                                                onChange={(e) => {
                                                    handleSelectChange(e.target.value);
                                                }}
                                                required
                                            >
                                                <option value="">Select</option>
                                                {getOrderids()}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label  className="mb-0">{createclientforecastPOText?.bomNames} <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="primary_document_details.bom_name"
                                                value={selectedInwardid}
                                                onChange={handleSelectInward}
                                                required
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
                                            <Form.Label  className="mb-0">{createclientforecastPOText?.paymentTerms}
                                                <span className="text-danger">*</span>
                                            </Form.Label>
                                            {/* <TermsEditor
                                                name="primary_document_details.payment_terms"
                                                onChange={(data) => {
                                                    setDataeditorterms(data);
                                                }}
                                                value={dataeditorterms}
                                                editorLoaded={editorLoaded}

                                            /> */}
                                              <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="payment_terms"
                                        value={form.payment_terms}
                                        onChange={onUpdateField}
                                        required={true}
                                        maxLength={500}
                                    />
                                        </Form.Group>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col xs={12} md={6}>
                                        <div>
                                            {pdfFileName && <p className="mb-0 attachment-sec1">
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

                            <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                                <h5 className="inner-tag">{createclientforecastPOText?.FormSubHeadePL}</h5>
                                <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">

                                </div>
                            </div>
                            <div className="wrap3 forecasttablealign">
                                <div className="table-responsive mt-4">
                                    <Table className="bg-header">
                                        <thead>
                                            <tr>
                                                <th>{createclientforecastPOText?.sNo}</th>
                                                <th>{createclientforecastPOText?.itemNo}</th>
                                                <th>{createclientforecastPOText?.hsnsaccode}</th>
                                                {/* <th>{createclientforecastPOText?.deliveryDate}</th> */}
                                                <th>{createclientforecastPOText?.qty}</th>
                                                <th>{createclientforecastPOText?.unit}</th>
                                                <th>{createclientforecastPOText?.rate}</th>
                                                <th>{createclientforecastPOText?.gst}</th>
                                                <th>{createclientforecastPOText?.total}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productlistDetails.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <input
                                                            className="input-100"
                                                            type="text"
                                                            value={row.item_no}
                                                            readOnly
                                                            onChange={(e) => handleChange(index, 'item_no', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-100"
                                                            type="text"
                                                            value={row.hsn_sac_code}
                                                            onChange={(e) => handleChange(index, 'hsn_sac_code', e.target.value)}
                                                        />
                                                    </td>
                                                    {/* <td>
                                                        <DatePicker 
                                                            placeholder="YYYY-MM-DD"
                                                            selected={row.delivery_date}
                                                            onChange={(e) => handleChange(index, 'delivery_date', e)}
                                                            onFocus={(e) => e.target.readOnly = true}
                                                        />
                                                    </td> */}
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="input-50"
                                                            value={row.qty}
                                                            onChange={(e) => handleChange(index, 'qty', e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="input-50"
                                                            value={row.unit}
                                                            onChange={(e) => handleChange(index, 'unit', e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="input-50"
                                                            value={row.price}
                                                            onChange={(e) => handleChange(index, 'price', e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="input-50"
                                                            value={row.gst}
                                                            onChange={(e) => handleChange(index, 'gst', e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="input-100"
                                                            type="text"
                                                            value={row.total_price}
                                                            readOnly
                                                            onChange={(e) => handleChange(index, 'total_price', e.target.value)}
                                                        />
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                            </div>
                            <div className="wrap3">
                                <div className="content-sec1">
                                    <h6 className="inner-tag my-2">{createclientforecastPOText?.FormSubHeadeTM}</h6>
                                    <p>{createclientforecastPOText?.totalbeforetax}: {calculateTotalBeforeTax().toFixed(2)}</p>
                                    <p>{createclientforecastPOText?.totalTaxGST}: {calculateTotalIGST().toFixed(2)}</p>
                                    <p>{createclientforecastPOText?.totalaftertax}: {calculateTotalAfterTax().toFixed(2)}</p>
                                    <p>Amount In Words : {AmountInWords}</p>
                                    {/* <p>Other Charges  :  <input
                                                    type="text"
                                                    className="input-50"
                                                  
                                                /></p> */}
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0"></Form.Label>
                                            <Form.Select
                                                name="text"
                                                value=""
                                            >
                                                <option value="">Non Taxable extra charges</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <h6 className="inner-tag my-2">{createclientforecastPOText?.FormSubHeadeGT} : </h6>
                                    <p>{createclientforecastPOText?.advanceTopay}   : <input
                                        type="text"
                                        className="input-50"
                                        value={advanceToPay}
                                        onChange={handleAdvanceChange}
                                    /></p>
                                    <p>{createclientforecastPOText?.balanceTopay}  : <input
                                        type="text"
                                        className="input-50"
                                        value={balanceToPay.toFixed(2)}
                                        readOnly
                                    /></p>
                                    <div className="d-flex justify-content-end mt-2">
                                    <Button type="button" className="cancel me-2" onClick={() => {navigate(-1)}} >CANCEL</Button>
                                    <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={(e) => setSelectbtn('SAVEANDSEND')} >UPDATE & SUBMIT</Button>
                                    </div>
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
            {/* {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )} */}
        </>
    );
};
export default EditClientPo;