import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { createdpoform, createclientforecastPOText, tableContent } from '../../../utils/TableContent';

import MultiSelect from '../../../components/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import {getActiveClientPos,selectActiveclientpos, piGetClientdetails, selectPigetClientdetails,saveCreatePi, selectLoadingState,proformaInvoiceDraft} from '../slice/ForecastSlice'
import moment from "moment/moment";
import numberToWords from 'number-to-words';
import { toWords } from 'number-to-words';
import { toast,ToastContainer, Zoom } from "react-toastify";
import { Spinner } from "react-bootstrap";


const ProformaInvoice = () => {
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingState);
    const location = useLocation();
    const dispatch = useDispatch()
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [startdocDate1, setStartdocDate1] = useState(new Date());
    const [startdocDate2, setStartdocDate2] = useState(new Date());
    const [selectedInwardid, setSelectedInwardid] = useState(null);
    const [isChecked, setIsChecked] = useState(true);
    const [selectbtn, setSelectbtn] = useState(""); // for client button 
    

    

    const [form, setForm] = useState({
        kind_attn: {
            kcompanyName: "",
            kgstNo: "",
            kpanNo: "",
            kcontactDetails: "",
            kphoneNo: "",
            kAddress: ""
        },
        ship_to:{
            scompanyName: "",
            sgstNo: "",
            spanNo: "",
            scontactDetails: "",
            sphoneNo: "",
            sAddress: "",
        },
        termsandConditions: "",
        requestLine: "",
        primary_document_details:{
            transactionName: "",
            status: "",
            piDate: "",
            amendmentNo: "",
            amendmentDate: "",
            quoteReference: "",
            quoteDate: "",
            buyerCode: "",
            currency: "",
            clientPo: ""
        },
        secondary_doc_details:{
            preparedBy: "",
            checkedBy: "",
            authorizedSignatory: "",
            note: "",
            tConditions: ""
        },
        


    });
    console.log(form,"lllllllllllllllll")
    
    // PROFORMA INVOICE get lambda for client details 

    const onUpdateField = (e) => {
        const { name, value } = e.target;
        console.log(e.target.value,"data gettttt")
        const trimmedValue = value.trimStart(); // Trim leading spaces    
        setForm({ ...form, [name]: trimmedValue });
        
    };
    console.log(form, "get dattattattaat")

    const { clientId } = location.state || {}; // Destructure and provide default
    // console.log(vendorId, "Received vendorId");

    useEffect(() => {
        if (clientId) {
            dispatch(piGetClientdetails({ client_id: clientId }));
        }
    }, [clientId, dispatch]);

    const getclientdata = useSelector(selectPigetClientdetails);
        useEffect(() => {
            if(getclientdata?.body){
                const clientDetails = getclientdata?.body

                setForm({
                    kcompanyName: clientDetails?.client_name,
                    kgstNo: clientDetails?.kind_attn?.gst_number,
                    kpanNo: clientDetails?.kind_attn?.pan_number,
                    kcontactDetails: clientDetails?.kind_attn?.contact_details,
                    kphoneNo: clientDetails?.kind_attn?.contact_number,
                    kAddress: clientDetails?.kind_attn?.address,
                    scompanyName: clientDetails?.client_name,
                    sgstNo: clientDetails?.ship_to?.gst_number,
                    spanNo: clientDetails?.ship_to?.pan_number,
                    scontactDetails: clientDetails?.ship_to?.contact_details,
                    sphoneNo: clientDetails?.ship_to?.contact_number,
                    sAddress: clientDetails?.ship_to?.address,
                    requestLine: clientDetails?.request_line,
                })
            }
        },[getclientdata]) 

        console.log(form?.kcontactDetails, "kkkkkkkkkkkkkkkk")
    


    

    // PROFORMA INVOICE for get client po's
    const activeclients = useSelector(selectActiveclientpos)
    const clientSelection = activeclients?.body || [];
    const [options, setOptions] = useState([]);
    const [optionSelected, setSelected] = useState(null);

    useEffect(() => {
        if (clientSelection?.length) {
            let opts = clientSelection.map((obj) => {
                return { value: obj.client_po, label: obj.client_po }
            });
            console.log(opts,"ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
            setOptions(opts);
        }
    }, [clientSelection]);

    const handleChange = (selected) => {
        setSelected(selected);
    };

    useEffect(() => {
        dispatch(getActiveClientPos())
    }, []);

    
    // PROFORMA INVOICE for updating the input value 
    const [product_list, setRows] = useState([
        { item_no: '', description : '', quantity: '', unit: '', rate: '', gst: '', basic_amount:'',gst_amount:'' }
    ]);

    // PROFORMA INVOICE for increasing the list 
    const addRow = () => {
        let obj =  {item_no: '', description: '', quantity: '', unit: '', rate:'',gst: '', basic_amount:'',gst_amount:'' }
        setRows([...product_list, obj]);
    };

     // PROFORMA INVOICE for decreasing the list 
     const handleRemoveRow = (index) => {
        
        const updatedForecastDetails = product_list.filter((_, idx) => idx !== index);
        setRows(updatedForecastDetails);
    };


    // PROFORMA INVOICE  Adding products to purchase list changes when we give inputs
    
    const handleChangeInput = (index, field, value) => {
        const updatedForecastDetails = [...product_list];
        console.log(updatedForecastDetails, "ssssssssssss")
        updatedForecastDetails[index][field] = value;
        if (field === 'quantity' || field === 'rate' || field === 'gst') {
            const quantity = parseFloat(updatedForecastDetails[index]['quantity']) || 0;
            const rateprice = parseFloat(updatedForecastDetails[index]['rate']) || 0;
            const gstpersentage = parseFloat(updatedForecastDetails[index]["gst"]) || 0;
            
            const basicamount = quantity * rateprice
            updatedForecastDetails[index]['basic_amount'] = basicamount;
            
            let gstcalculate = null
            if(gstpersentage !== 0){
                gstcalculate =   (basicamount * gstpersentage) / 100;
            }
            else{
                gstcalculate = 0
            }
            
            
            updatedForecastDetails[index]["gst_amount"] =  gstcalculate.toFixed(2)
            
        }
        
        setRows([...updatedForecastDetails]);
        
    };

    // PORFORMA INVOICE Adding products to purchase list calculation
    const calculateTotalBeforeTax = () => {
        return product_list.reduce((total, item) => {
            const itemTotal = parseFloat(item.quantity) * parseFloat(item.rate) || 0;
        
            return total + itemTotal;
        }, 0);
    };

    const calculateTotalIGST = () => {
        return product_list.reduce((total, item) => {
            const itemTotal = parseFloat(item.quantity) * parseFloat(item.rate) || 0;
            const gst_amount = parseFloat(itemTotal * (parseFloat(item.gst) / 100)) || 0;
             
            
            return total + gst_amount;
        }, 0);
    };

    const calculateTotalAfterTax = () => {
        const totalBeforeTax = calculateTotalBeforeTax();
        const totalIGST = calculateTotalIGST();
        return totalBeforeTax + totalIGST + shippingCharges;
    };
    
    // PORFORMA INVOICE for amount calculation 
    const [grandTotalInWords, setGrandTotalInWords] = useState(''); // amount in words
    const [shippingCharges, setShippingCharges] = useState(0); // set shipping charges 
    const [grandTotal, setGrandTotal] = useState(0); //grand total

    // PROFORMA INVOICE for shipping charges change  
    const handleShippingChargesChange = (event) => {
        const value = event.target.value;
        setShippingCharges(parseFloat(value) || 0);
    };

    // PROFORMA INVOICE for changeing total amount number to words 
    const  totalBeforeTax = calculateTotalBeforeTax()
    const totalIGST = calculateTotalIGST();
    const grandTotalAmount = totalBeforeTax + totalIGST

    const amountToWords = (amount) => {
        const rupees = Math.floor(amount);
        const paisa = Math.round((amount - rupees) * 100);
      
        let rupeeWords = toWords(rupees).replace(/-/g, ' ') + ' rupees';
        let paisaWords = '';
      
        if (paisa > 0) {
            paisaWords = ' and ' + toWords(paisa).replace(/-/g, ' ') + ' paisa';
        }
      
        return rupeeWords + paisaWords;
      };

    useEffect(() => {
        const newGrandTotal =  grandTotalAmount + shippingCharges;
        setGrandTotal(newGrandTotal);
        setGrandTotalInWords(amountToWords(newGrandTotal));
    }, [totalBeforeTax, grandTotalAmount, shippingCharges]);

    // PROFORMA INVOICE for changing status open and close
    const [selectedOption, setSelectedOption] = useState("");
    const handleSelectChange = async (value) => {
        setSelectedOption(value);
    };

    {/*
    // PROFORMA INVOICE for upload pdf

    const [fileNames, setFileNames] = useState([]);
    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const [pdfFileName, setPdfFileName] = useState("");
    const [pdfPreview, setPdfPreview] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNamespdf, setFileNamespdf] = useState([]);

    // PROFORMA INVOICE FOR PDF UPLOAD FILES 
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
    }; */}

    {/*
    // PROFORMA INVOICE for cancel pdf
    const handleCancelPdfPreview = () => {
        setPdfPreview(null);
        setPdfFileName("");
        setSelectedFilesBase64([]);
        const inputElement = document.querySelector('input[type="file"][name="data_sheet"]');
        if (inputElement) {
            inputElement.value = '';
        }
    }; */}

    const handleSubmit = async (e) => {
        e.preventDefault();
        let selectedPos= optionSelected?.map((obj)=>{
            return {create_po:obj.value}
        })

        // 
        const totalBeforeTax = calculateTotalBeforeTax().toFixed(2);
        const totalTaxGST = calculateTotalIGST().toFixed(2);
        const totalAfterTax = (calculateTotalBeforeTax() + calculateTotalIGST() + shippingCharges).toFixed(2);
        console.log(form.requestLine,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
        const formData = {
            kind_attn:{
                company_name: form.kcompanyName,
                gst_number: form.kgstNo.toString(),
                pan_number: form.kpanNo.toString(),
                contact_number: form.kcontactDetails.toString(),
                contact_details: form.kphoneNo.toString(),
                address: form.kAddress,
            },
            ship_to:{
            company_name: form.scompanyName,
            gst_number: form.sgstNo.toString(),
            pan_number: form.spanNo.toString(),
            contact_number: form.scontactDetails.toString(),
            contact_details: form.sphoneNo.toString(),
            address: form.sAddress,
            },           
            pi_terms_conditions: form.termsandConditions,
            req_line: form.requestLine,
            primary_document_details:{
                transaction_name: form.transactionName,
                status: selectedOption,
                PI_date:  moment(startdocDate).format('YYYY-MM-DD'),
                amendment_no: form.amendmentNo,
                amendment_date: form.amendmentDate,
                quote_reference: form.quoteReference,
                quote_date: moment(startdocDate2).format('YYYY-MM-DD'),
                buyer_code: form.buyerCode,
                currency: form.currency,
                client_po: selectedPos,
            },
            secondary_doc_details:{
                prepared_by: form.preparedBy,
                checked_by: form.checkedBy,
                authorized_signatory: form.authorizedSignatory,
                note: form.note,
                terms_conditions: form.tConditions
            },
           
        };
        // const purchase_list = selectedData.map((product, index) => ({
        //     itemNo: product.mfr_prt_num,
        //     rev: revValues[index],
        //     description: product.description,
        //     deliveryDate: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
        //     qty: product.qty,
        //     unit: unitValues[index],
        //     rate: product.price,
        //     gst: product.gst,
        //     basicAmount: basicAmounts[index],
        //     gst_amount: gst_amounts[index],
        // }));

        const total_amount = {
            total_basic_amount:totalBeforeTax,
            GST:totalTaxGST,
            grand_total:totalAfterTax,
            shipping_charges:shippingCharges.toString(),
            amount_in_words:grandTotalInWords
        }

        let productlistArray = product_list.reduce((acc,item,index) => {
            acc[`part${index+1}`] = {
                s_no:(index+1).toString(),
                item_no:item.item_no.toString(),
                description:item.description,
                qty:item.quantity,
                unit:item.unit,
                rate:item.rate,
                gst:item.gst,
                basic_amount:item.basic_amount.toString(),
                gst_amount:item.gst_amount.toString()


            }
            return acc;
        },{})

        console.log(productlistArray,"zzzzzzzzzzzzzzzzz")
        
        

        const requestBody = {
            client_id:clientId,
            ...formData,
            product_list: productlistArray,
            //   total_amount,
            total_amount
             
        };

        console.log(requestBody);
        if (selectbtn === 'SAVEANDSEND') {
            const response = await dispatch(saveCreatePi(requestBody));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        }  else if (selectbtn === 'SAVEDRAFT') { // Change to else if
            const response = await dispatch(proformaInvoiceDraft(requestBody));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        } 
        
    };

    return (
        <>
            <div className="wrap">
             <form onSubmit={handleSubmit}>
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
                        <span>Proforma Invoice</span>
                    </h6>
                          {/* <div>
                               <div class="upload-btn-wrap ms-3">
                                    <button class="btn">Upload doc</button>
                                    <input type="file"
                                        // onChange={handlePdfChange}
                                        //accept="application/pdf, image/jpeg, image/png"
                                        //name="data_sheet" 
                                        //multiple
                                        //disabled={pdfPreview !== null}
                                         />
                                     <span className="text-danger">*</span> 
                                </div>
                        </div> */}
                    </div>
                <div class="content-sec">
                    <h5 className="inner-tag my-2"> {createdpoform?.KindAttn}</h5>
                    <div className="content-sec">
                        <Row>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.CompanyName}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="kcompanyName"
                                        value={form?.kcompanyName}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {createdpoform?.GSTNo}   <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="kgstNo"
                                        value={form.kgstNo}
                                        maxLength={15}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {createdpoform?.PanNo}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="kpanNo"
                                        value={form.kpanNo?.replace(/[^a-zA-Z0-9]/g, "")}
                                        maxLength={10}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.ContactDetails}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="kcontactDetails"
                                        value={form.kcontactDetails}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {createdpoform?.PhoneNo} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="kphoneNo"
                                        value={form.kphoneNo}
                                        placeholder=""
                                        pattern="[0-9]*[\s\-()/]*" 
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{tableContent?.address}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="kAddress"
                                        value={form.kAddress}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    <h5 className="inner-tag my-2"> {createdpoform?.ShipTo}</h5>
                    <div className="content-sec">
                        <Row>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {createdpoform?.CompanyName} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="scompanyName"
                                        value={form.scompanyName}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {createdpoform?.GSTNo}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sgstNo"
                                        value={form.sgstNo}
                                        maxLength={15}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.PanNo}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="spanNo"
                                        value={form.spanNo?.replace(/[^a-zA-Z0-9]/g, "")}
                                        maxLength={10}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.ContactDetails}   <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="scontactDetails"
                                        value={form.scontactDetails}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.PhoneNo}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sphoneNo"
                                        value={form.sphoneNo}
                                        pattern="[0-9]*[\s\-()/]*" 
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {tableContent?.address}<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="sAddress"
                                        value={form.sAddress}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    <div class="content-sec">
                        <Row>

                            <Col xs={6} md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.piTerms} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="termsandConditions"
                                        value={form.termsandConditions}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {createdpoform?.RequestLine}<span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="requestLine"
                                        value={form.requestLine}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="wrap2">
                        <h5 className="inner-tag my-2"> {createdpoform?.PrimaryDocumentDetails}</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.TransactionName} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="transactionName"
                                                value={form.transactionName}
                                                placeholder=""
                                                required
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{tableContent?.status} <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={selectedOption}
                                                onChange={(e) => {
                                                  handleSelectChange(e.target.value);
                                                }}
                                                required
                                            >
                                                <option value="">Select</option>
                                                <option value="Open">Open</option>
                                                <option value="Close">Close</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.PIDate}<span className="text-danger">*</span></Form.Label>

                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.AmendmentNo}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="amendmentNo"
                                                value={form.amendmentNo}
                                                placeholder=""
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.AmendmentDate} </Form.Label>
                                            <Form.Control
                                                type='date'
                                                name='amendmentDate'
                                                value={form.amendment_date}
                                                placeholder="YYYY-MM-DD"
                                                onChange={onUpdateField}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.QuoteReference} </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="quoteReference"
                                                placeholder=""
                                                value={form.quoteReference}
                                                onChange={onUpdateField}
                                            />

                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{createdpoform?.QuoteDate} </Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                              selected={startdocDate2} onChange={(date) => setStartdocDate2(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{createdpoform?.BuyerCode} </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="buyerCode"
                                                value={form.buyerCode}
                                                placeholder=""
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.Currency} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="currency"
                                                value={form.currency}
                                                placeholder=""
                                                required
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Client Po <span className="text-danger">*</span></Form.Label>

                                            <Form.Select
                                                name="clientPo"
                                                required
                                                value={selectedVendor}
                                                onChange={handleVendorChange}

                                            >
                                                <option value="">Select Client PO</option>
                                                {Array.isArray(vendorSelection) && vendorSelection.length > 0 ? (
                                                    vendorSelection.map(vendor => (
                                                        <option key={vendor.client_po} value={vendor.client_po}>{vendor.client_po}</option>
                                                    ))
                                                ) : (
                                                    <option value="">No Clientpo available</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col> */}

                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.ClientPo}</Form.Label>

                                            <MultiSelect
                                                key="example_id"
                                                options={options}
                                                onChange={handleChange}
                                                value={optionSelected}
                                                isSelectAll={true}
                                                menuPlacement={"bottom"}
                                                /> 
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/*
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
                                */}
                            </div>
                            </div>
                        </div>
                        {/* PROFORMA INVOICE for increasing the list UI */}
                            <h5 className="inner-tag">{createclientforecastPOText?.FormSubHeadePL}</h5>
                            <div className="wrap3 forecasttablealign">
                                <div className="table-responsive mt-4 mb-4">
                                    <Table className="dark-header">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Item No</th>
                                                        <th>Description (HSN/SAC)</th>
                                                        <th>Quantity</th>
                                                        <th>Unit</th>
                                                        <th>Rate</th>
                                                        <th>Gst %</th>
                                                        <th>GST Amount</th>
                                                        <th>Basic Amount</th>
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                {product_list.map((row,index) => (
                                                    <tr key = {index}>
                                                        <td>{index+1}</td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.item_no}
                                                                onChange={(e) => handleChangeInput(index,"item_no", e.target.value)} 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.description}
                                                                required
                                                                onChange={(e) => handleChangeInput(index, 'description', e.target.value)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.quantity}
                                                                required
                                                                onChange={(e) => handleChangeInput(index, 'quantity', e.target.value = e.target.value.replace(/[^0-9]/g, ''))} 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.unit}
                                                                required
                                                                onChange={(e) => handleChangeInput(index, 'unit', e.target.value,)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.rate}
                                                                required
                                                                onChange={(e) => handleChangeInput(index, 'rate', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.gst}
                                                                required
                                                                onChange={(e) => handleChangeInput(index, 'gst', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.gst_amount}
                                                                onChange={(e) => handleChangeInput(index, 'gst_amount', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.basic_amount}
                                                                onChange={(e) => handleChangeInput(index, 'basic_amount', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            {index === product_list.length - 1 && product_list.length < 15 && (
                                                                <button type="button" onClick={addRow}>+</button>
                                                            )}
                                                            {index !== product_list.length - 1 && (
                                                                <button type="button" onClick={() => handleRemoveRow(index)}>-</button>
                                                            )}
                                                            {index === 14 && (
                                                                <button type="button" onClick={() => handleRemoveRow(index)}>-</button>
                                                            )}
                                                            
                                                        </td>  
                                                    </tr>
                                                    ))}
                                                </tbody>
                                    </Table>
                            
                                </div>
                            </div>
                            <div className="wrap4 mt-3">
                                <div className="content-sec1">
                                    {/* <div>Total Quantity Per Board: {totalQtyPerBoard}</div> */}
                                    <h6 className="inner-tag my-2">{createdpoform?.TotalAmount}</h6>
                                    {/* <p>Total( Basic )     : {totalUnitPrice}</p> */}
                                    <p>{createdpoform?.TotalBasic}  : {calculateTotalBeforeTax().toFixed(2)}</p>
                                    <p>{createdpoform?.TotalGST} : {calculateTotalIGST().toFixed(2)}</p>
                                    <p>{createdpoform?.ShippingCharges} : <input type="text" onChange={handleShippingChargesChange}/></p>
                                    <p>{createdpoform?.GrandTotal} : {calculateTotalAfterTax().toFixed(2)}</p>
                                    <p>{createdpoform?.AmountInWords}  : {grandTotalInWords}</p>
                                </div>
                            </div> 
                            
                            <div className="wrap5">
                                <h5 className="inner-tag my-2 mt-2">{createdpoform?.SecondaryDocumentDetails}</h5>
                                <div className="content-sec1">
                                    <Row>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{createdpoform?.PreparedBy} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="preparedBy"
                                                    value={form.preparedBy}
                                                    placeholder=""
                                                    required
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{createdpoform?.CheckedBy} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="checkedBy"
                                                    value={form.checkedBy}
                                                    placeholder=""
                                                    required
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{createdpoform?.AuthorizedSignatory} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="authorizedSignatory"
                                                    value={form.authorizedSignatory}
                                                    placeholder=""
                                                    required
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{createdpoform?.Note}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="note"
                                                    value={form.note}
                                                    placeholder=""
                                                    onChange={onUpdateField}
                                                    style={{ height: "100px" }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0"> {createdpoform?.terms}</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="tConditions"
                                                    value={form.tConditions}
                                                    placeholder=""
                                                    onChange={onUpdateField}
                                                    style={{ height: "100px" }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </div>



                            <div className="d-flex justify-content-end mt-2">
                            <Button type="submit" onClick={(e) => setSelectbtn('SAVEDRAFT')} className="cancel" >{createdpoform?.SaveAsDraft}</Button>
                            <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={(e) => setSelectbtn('SAVEANDSEND')} >{createdpoform?.Create}</Button>
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
export default ProformaInvoice;
