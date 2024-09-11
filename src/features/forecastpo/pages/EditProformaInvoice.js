import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { createdpoform, createclientforecastPOText, tableContent, ProformaINvoice } from '../../../utils/TableContent';

import MultiSelect from '../../../components/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import {getActiveClientPos,selectActiveclientpos, piGetClientdetails, selectPigetClientdetails,saveCreatePi, selectLoadingState, editCreatePi, selectEditPiForm,editsaveCreatePi, resetEditGetPI,drafteditsaveCreatePi} from '../slice/ForecastSlice'
import moment from "moment/moment";
import numberToWords from 'number-to-words';
import { toWords } from 'number-to-words';
import { ToastContainer, Zoom } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { array } from 'i/lib/util';

const EditProformaInvoice= () => {
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingState);
    const location = useLocation();
    
    const dispatch = useDispatch();
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
        product_list:{
            s_no:"",
            item_no: "",
            description: "",
            qty: "",
            rate: "",
            unit: "",
            discount:"",
            gst: "",
            gst_amount: "",
            basic_amount: ""
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

    const { pi_id,client_id } = location.state || {}; // Destructure and provide default
    // console.log(vendorId, "Received vendorId");
    const isStatus = location.state?.isStatus || "";
    console.log(isStatus,":om isStatus"); 

    let uniqID = pi_id?.slice(4, 6);
    console.log(uniqID)

    useEffect(() => {
        if (pi_id) {
            dispatch(editCreatePi({ pi_id}));
        }
        return() => {
            dispatch(resetEditGetPI())
        }
    }, [pi_id, dispatch]);
    
    


    

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
        { item_no: '', description : '', qty: '', unit: '', rate: '', gst: '', basic_amount:'',gst_amount:'' }
    ]);
    console.log(product_list);
    // PROFORMA INVOICE for increasing the list 
    const addRow = () => {
        let obj =  { item_no: '', description: '', qty: '', unit: '', rate:'',gst: '', basic_amount:'',gst_amount:'' }
        setRows([...product_list, obj]);
    };

     // PROFORMA INVOICE for decreasing the list 
     const handleRemoveRow = (index) => {
        const updatedproduct_list = product_list.filter((_, idx) => idx !== index);
        setRows(updatedproduct_list);
    };


    // PROFORMA INVOICE  Adding products to purchase list changes when we give inputs
    
    const handleChangeInput = (index, field, value) => {
        const updatedproduct_list = [...product_list];
        console.log(updatedproduct_list, "ssssssssssss")
        updatedproduct_list[index][field] = value;
        if (field === 'qty' || field === 'rate' || field === 'gst') {
            const qty = parseFloat(updatedproduct_list[index]['qty']) || 0;
            const rateprice = parseFloat(updatedproduct_list[index]['rate']) || 0;
            const gstpersentage = parseFloat(updatedproduct_list[index]["gst"]) || 0;
            
            const basic_amount = qty * rateprice
            updatedproduct_list[index]['basic_amount'] = basic_amount;
            
            let gstcalculate = null
            if(gstpersentage !== 0){
                gstcalculate = (basic_amount * gstpersentage) / 100;
            }
            else{
                gstcalculate = 0
            }
            
            
            updatedproduct_list[index]["gst_amount"] =  gstcalculate.toFixed(2)
            
        }
        
        setRows([...updatedproduct_list]);
        
    };

    // PORFORMA INVOICE Adding products to purchase list calculation
    const calculateTotalBeforeTax = () => {
        return product_list.reduce((total, item) => {
            const itemTotal = parseFloat(item.qty) * parseFloat(item.rate) || 0;
        
            return total + itemTotal;
        }, 0);
    };

    const calculateTotalIGST = () => {
        return product_list.reduce((total, item) => {
            const itemTotal = parseFloat(item.qty) * parseFloat(item.rate) || 0;
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
    const handleSelectChange = (value) => {
        setSelectedOption(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(optionSelected)
        let selectedPos= optionSelected?.map((obj)=>{
            return {create_po:obj.value}
        })

        const totalBeforeTax = calculateTotalBeforeTax().toFixed(2);
        const totalTaxGST = calculateTotalIGST().toFixed(2);
        const totalAfterTax = (calculateTotalBeforeTax() + calculateTotalIGST() + shippingCharges).toFixed(2);

        const formData = {            
            kind_attn:{
                company_name: form.kcompanyName,
                gst_number: form?.kgstNo.toString(),
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
            request_line: form.requestLine,
            primary_document_details:{
                transaction_name: form.transactionName,
                status: selectedOption,
                Pi_date:  moment(startdocDate).format('YYYY-MM-DD'),
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
        //     basic_amount: basic_amounts[index],
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
                qty:item.qty,
                unit:item.unit,
                rate:item.rate,
                gst:item.gst,
                basic_amount:item.basic_amount.toString(),
                gst_amount:item.gst_amount.toString()


            }
            return acc;
        },{})

        console.log(formData,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
        const requestBody = {            
            client_id:client_id,
            client_name:form.kcompanyName,
            pi_id:pi_id,
            ...formData,
            products_list: productlistArray,
            //   total_amount,
            total_amount
             
        };

        console.log(requestBody);
        if (uniqID === 'PI') {
            const updatedRequestBody = {
                ...requestBody,
                updatestatus: isStatus,
              };
            const response = await dispatch(editsaveCreatePi(updatedRequestBody));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        }   else{
            const response = await dispatch(drafteditsaveCreatePi(requestBody));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        } 
        
    };

    const getclientdata = useSelector(selectEditPiForm);
    const savedData = getclientdata?.body;
    
    const table = savedData?.products_list;
    
        useEffect(() => {
            if(getclientdata?.body){
                
                const clientDetails = getclientdata?.body;
                console.log(clientDetails?.kind_attn?.contact_number,"!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(clientDetails?.primary_document_details?.amendment_date,"ddddddddddddddd")

                setForm({
                    kcompanyName: clientDetails?.kind_attn?.company_name,
                    kgstNo: clientDetails?.kind_attn?.gst_number,
                    kpanNo: clientDetails?.kind_attn?.pan_number,
                    kcontactDetails: clientDetails?.kind_attn?.contact_details,
                    kphoneNo: clientDetails?.kind_attn?.contact_number,
                    kAddress: clientDetails?.kind_attn?.address,
                    scompanyName: clientDetails?.ship_to?.company_name,
                    sgstNo: clientDetails?.ship_to?.gst_number,
                    spanNo: clientDetails?.ship_to?.pan_number,
                    scontactDetails: clientDetails?.ship_to?.contact_details,
                    sphoneNo: clientDetails?.ship_to?.contact_number,
                    sAddress: clientDetails?.ship_to?.address,
                    termsandConditions:clientDetails?.pi_terms_conditions,
                    requestLine: clientDetails?.req_line,
                    transactionName: clientDetails?.primary_document_details?.transaction_name,
                    amendmentNo: clientDetails?.primary_document_details?.amendment_no,
                    amendmentDate:clientDetails?.primary_document_details?.amendment_date,
                    status: clientDetails?.primary_document_details?.status,
                    quoteReference: clientDetails?.primary_document_details?.quote_reference,
                    buyerCode: clientDetails?.primary_document_details?.buyer_code,
                    currency: clientDetails?.primary_document_details?.currency,
                    preparedBy: clientDetails?.secondary_doc_details?.prepared_by,
                    checkedBy: clientDetails?.secondary_doc_details?.checked_by,
                    authorizedSignatory: clientDetails?.secondary_doc_details?.authorized_signatory,
                    note: clientDetails?.secondary_doc_details?.note,
                    tConditions: clientDetails?.secondary_doc_details?.terms_conditions,
                   
                })
                console.log(clientDetails?.primary_document_details?.currency)
                const cpo = clientDetails?.primary_document_details?.client_po;
                console.log(cpo,"gggggggggggggggggg")
                if(cpo !== undefined){
                    console.log(cpo, "omcpo");
                    let opts = [];
                    opts = cpo?.map((obj) => {
                    return { value: obj.create_po, label: obj.create_po }
                 });
                console.log('Options:', opts);
                setSelected([...opts]);
                }
                
            
            
                const tableArray = Object.values(table);
                setRows(tableArray?.map((item) => ({
                    item_no: item.item_no || '',
                    description: item.description || '',
                    hsn_Code: item.hsn_Code || '',
                    qty: item.qty || '',
                    unit: item.unit || '',
                    rate: item.rate || '',
                    gst: item.gst || '',
                    basic_amount: item.basic_amount || '',
                    gst_amount: item.gst_amount || ''
                })));
                setSelectedOption(clientDetails?.primary_document_details?.status);
                setShippingCharges(parseFloat(clientDetails.total_amount?.shipping_charges))
            
            }
            // setProductList(clientDetails?.product_list);
        },[getclientdata]) 

        console.log(form?.kcontactDetails, "kkkkkkkkkkkkkkkk")
        console.log(form,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

    console.log(typeof product_list,"------------------------------------------")
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
                                dispatch(resetEditGetPI())
                            }}
                        />
                        {uniqID === "PI" ? (<span>Edit Proforma Invoice</span>) : 
                        (<span>Draft Edit Proforma Invoice</span>)
                        }
                    </h6>
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
                                        value={form?.kgstNo}
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
                                                disabled
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
                                                disabled
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
                                            <Form.Label className="mb-0"> {createdpoform?.AmendmentDate}</Form.Label>
                                            <Form.Control
                                                type='date'
                                                name='amendmentDate'
                                                value={form.amendmentDate}
                                                placeholder="YYYY-MM-DD"
                                                onChange={onUpdateField}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.QuoteReference}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="quoteReference"
                                                placeholder=""
                                                value={form.quoteReference}
                                                onChange={onUpdateField}
                                                disabled
                                            />

                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{createdpoform?.QuoteDate} <span className="text-danger">*</span></Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                              selected={startdocDate2} onChange={(date) => setStartdocDate2(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{createdpoform?.BuyerCode}</Form.Label>
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
                                                        <th>Description</th>
                                                        <th>qty</th>
                                                        <th>Unit</th>
                                                        <th>Rate</th>
                                                        <th>Gst %</th>
                                                        <th>Basic Amount</th>
                                                        <th>Gst Amount</th>
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
                                                                onChange={(e) => handleChangeInput(index, 'description', e.target.value)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.qty}
                                                                 onChange={(e) => handleChangeInput(index, 'qty', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                 required 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.unit}
                                                                onChange={(e) => handleChangeInput(index, 'unit', e.target.value)}
                                                                required 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.rate}
                                                                onChange={(e) => handleChangeInput(index, 'rate', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                required 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.gst}
                                                                onChange={(e) => handleChangeInput(index, 'gst', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                required 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.basic_amount}
                                                                onChange={(e) => handleChangeInput(index, 'basic_amount', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                readOnly
                                                                disabled
                                                                required 
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={row.gst_amount}
                                                                onChange={(e) => handleChangeInput(index, 'gst_amount', e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                                                readOnly
                                                                disabled
                                                                required 
                                                            />
                                                        </td>
                                                        <td>
                                                            {index === product_list.length - 1 && product_list.length < 12 && (
                                                                <button type="button" onClick={addRow}>+</button>
                                                            )}
                                                            {index !== product_list.length - 1 && (
                                                                <button type="button" onClick={() => handleRemoveRow(index)}>-</button>
                                                            )}
                                                            {index === 11 && (
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
                                    {/* <div>Total qty Per Board: {totalQtyPerBoard}</div> */}
                                    <h6 className="inner-tag my-2">{createdpoform?.TotalAmount}</h6>
                                    {/* <p>Total( Basic )     : {totalUnitPrice}</p> */}
                                    <p>{createdpoform?.TotalBasic}  : {calculateTotalBeforeTax().toFixed(2)}</p>
                                    <p>{createdpoform?.TotalGST} : {calculateTotalIGST().toFixed(2)}</p>
                                    <p>{createdpoform?.ShippingCharges} : <input type="text" value = {shippingCharges} onChange={handleShippingChargesChange} /></p>
                                    <p>{createdpoform?.GrandTotal} : {calculateTotalAfterTax()?.toFixed(2)}</p>
                                    <p>{createdpoform?.AmountInWords}  : {grandTotalInWords}</p>
                                </div>
                            </div> 
                            
                            <div className="wrap5">
                                <h5 className="inner-tag my-2 mt-2">{createdpoform?.SecondaryDocumentDetails}</h5>
                                <div className="content-sec">
                                    <Row>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{createdpoform?.PreparedBy} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="preparedBy"
                                                    value={form.preparedBy}
                                                    placeholder=""
                                                    disabled
                                                    onChange={onUpdateField}
                                                    required 
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
                                                    disabled
                                                    onChange={onUpdateField}
                                                    required 
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
                                                    disabled
                                                    onChange={onUpdateField}
                                                    required 
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{createdpoform?.Note} </Form.Label>
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
                                                <Form.Label className="mb-0">{createdpoform?.terms}</Form.Label>
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
                                    <Button type="button" className="cancel me-2" onClick={() => {navigate(-1)}} >CANCEL</Button>
                                    <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={(e) => setSelectbtn('UpdateBtn')} >UPDATE & SUBMIT</Button>
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
export default EditProformaInvoice;
