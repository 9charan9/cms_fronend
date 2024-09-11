import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { Spinner } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import { SelectservicepartnerDetails, getActiveClientPos, getServicePartnerDetails, saveServiceOrder, selectActiveclientpos, selectLoadingState, selectDraftServiceorder, draftServiceorder } from '../slice/ForecastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, Zoom } from 'react-toastify';
import ReactSelect from 'react-select';
import { ToWords } from 'to-words';
import MultiSelect from '../../../components/MultiSelect';


const ServiceOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const towords = new ToWords();
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [selectedInwardid, setSelectedInwardid] = useState(null);
    const [isChecked, setIsChecked] = useState(true);
    const [Selectbtn, setSelectbtn] = useState("")
    const [ship_to, setship_to] = useState({})
    const [ReqLine, setReqLine] = useState("")
    const [allGrandTotal, setAllGrandTotal] = useState(0); //grand total
    console.log(allGrandTotal)
    const [grandTotalInWords, setGrandTotalInWords] = useState('');
    const [kind_attn, setkind_attn] = useState({})
    const [selectStatus, setSelectStatus] = useState("")
    const [primaryDocumentDetails, setprimaryDocumentDetails] = useState({})
    const [soTermsCondition, setsoTermsCondition] = useState("")
    const isLoading = useSelector(selectLoadingState);

    const [secondaryDocumentDetails, setsecondaryDocumentDetails] = useState({})
    const PartnerDeatils = useSelector(SelectservicepartnerDetails)
    const getpartnerdetails = PartnerDeatils?.body
    const partner_id = location?.state;
    useEffect(() => {
        const request = {
            "env_type": "Development",
            "partner_id": partner_id,

        }

        dispatch(getServicePartnerDetails(request))
        dispatch(getActiveClientPos())

    }, [])






    useEffect(() => {
        if (getpartnerdetails?.kind_Attn) {
            setkind_attn({
                company_name: getpartnerdetails?.kind_Attn?.company_name,
                gst_number: getpartnerdetails?.kind_Attn?.gst_number,
                pan_number: getpartnerdetails?.kind_Attn?.pan_number,
                contact_number: getpartnerdetails?.kind_Attn?.contact_number,
                contact_details: getpartnerdetails?.kind_Attn?.contact_details,
                address: getpartnerdetails?.kind_Attn?.address,
            });
        }
    }, [getpartnerdetails?.kind_Attn]);

    const kindHandle = (e) => {
        const { name, value } = e.target;
        setkind_attn((prevValue) => ({
            ...prevValue,
            [name]: value
        }))

    }

    useEffect(() => {
        if (getpartnerdetails?.ship_to) {
            setship_to({
                company_name: getpartnerdetails?.ship_to?.company_name,
                gst_number: getpartnerdetails?.ship_to?.gst_number,
                pan_number: getpartnerdetails?.ship_to?.pan_number,
                contact_details: getpartnerdetails?.ship_to?.contact_details,
                contact_number: getpartnerdetails?.ship_to?.contact_number,
                address: getpartnerdetails?.ship_to?.address,
            });
        }
    }, [getpartnerdetails?.ship_to]);

    const shipHandle = (e) => {
        const { name, value } = e.target;
        setship_to((prevValue) => ({
            ...prevValue,
            [name]: value

        }))

    }
    //dividing reqline from api

    const reqkindHandle = (e) => {
        const { value } = e.target;
        setReqLine(value)
    }
    console.log(JSON.stringify(ReqLine, null))
    useEffect(() => {
        setReqLine(getpartnerdetails?.req_line);
    }, [getpartnerdetails?.req_line]);



    // console.log(req_line)

    // useEffect(() => {
    //     // Simulating fetching data from an API and setting it in the form state

    //     const fetchedData = {

    //         ship_to: {
    //             company_name: getpartnerdetails?.ship_to?.company_name,
    //             gst_number: getpartnerdetails?.ship_to?.gst_number,
    //             pan_number: getpartnerdetails?.ship_to?.pan_number ,
    //             contact_details: getpartnerdetails?.ship_to?.contact_details ,
    //             contact_number: getpartnerdetails?.ship_to?.contact_number ,
    //             address: getpartnerdetails?.ship_to?.address,
    //         },
    //         kind_Attn: {
    //             company_name: getpartnerdetails?.kind_Attn?.company_name,
    //             gst_number: getpartnerdetails?.kind_Attn?.gst_number,
    //             pan_number:getpartnerdetails?.kind_Attn?.pan_number,
    //             contact_number: getpartnerdetails?.kind_Attn?.contact_number,
    //             contact_details: getpartnerdetails?.kind_Attn?.contact_details ,
    //             address: getpartnerdetails?.kind_Attn?.address
    //         },
    //         req_line: getpartnerdetails?.req_line,
    //     };

    //     setFormData(fetchedData);
    // }, []); 
    //         console.log(formData)



    const [rows, setRows] = useState([
        { slno: 1, scopeOfJobWork: '', qty: '', rate: '', gstPercent: '', gst: '', basicAmount: '', delivery_date: "" },
    ]);

    const job_work_table = rows.reduce((acc, row, index) => {
        acc[`part${index + 1}`] = {
            sn_no: row.slno.toString(),
            scope_of_job_work: row.scopeOfJobWork,
            qty: row.qty,
            unit: row.unit,

            rate: row.rate,
            discount: row.discount,
            "gst%": row.gstPercent,
            gst: row.gst,
            basic_amount: row.basicAmount,
            delivery_date: row.delivery_date,
        };
        return acc;
    }, {});


    const calculateRow = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        const qty = parseFloat(updatedRows[index].qty) || 0;
        const rate = parseFloat(updatedRows[index].rate) || 0;
        const gstPercent = parseFloat(updatedRows[index].gstPercent) || 0;

        const basicAmount = (qty * rate)
        const gst = (basicAmount * gstPercent) / 100;


        updatedRows[index].gst = gst.toFixed(2);
        updatedRows[index].basicAmount = basicAmount.toFixed(2);

        setRows(updatedRows);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const addRow = () => {
        const newRow = {
            slno: rows.length + 1,
            scopeOfJobWork: '',
            qty: '',
            unit: '',
            rate: '',
            discount: '',
            gstPercent: '',
            gst: '',
            basicAmount: '',
            delivery_date: "",

        };
        setRows([...rows, newRow]);
    };

    const removeRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index).map((row, idx) => ({
            ...row,
            slno: idx + 1
        }));
        setRows(updatedRows);
    };
    const [shippingCharges, setShippingCharges] = useState(0)

    const handleShippingCharges = (e) => {
        setShippingCharges(Number(e.target.value));
    };

    const [TotalBasicAmount, setTotalBasicAmount] = useState(0)
    const [TotalBasicAmountGst, setTotalBasicAmountGst] = useState(0)

    useEffect(() => {
        const total = rows.reduce((acc, curr) => acc + (parseFloat(curr.basicAmount) || 0), 0)
        setTotalBasicAmount(total)
        const totalGst = rows.reduce((acc, curr) => acc + (parseFloat(curr.gst) || 0), 0)
        setTotalBasicAmountGst(totalGst)
    }, [rows])

    const grandTotal = (TotalBasicAmount + TotalBasicAmountGst + shippingCharges);
    const shipping_charges = shippingCharges


    useEffect(() => {

        const newGrandTotal = parseFloat(TotalBasicAmount) + parseFloat(TotalBasicAmountGst) + parseFloat(shippingCharges)
        // console.log(newGrandTotal)
        // setAllGrandTotal(newGrandTotal)
        // console.log(allGrandTotal)
        let Words = towords.convert(newGrandTotal, { currency: true });
        // console.log(Words);
        setGrandTotalInWords(Words);
        // setGrandTotalInWords(numberToWords.toWords(newGrandTotal))
    }, [TotalBasicAmount, TotalBasicAmountGst, shippingCharges])



    const [date, setDate] = useState("")
    //  console.log(date)
    // console.log(primaryDocumentDetails)
    // const handleDate = (e) => {
    //     const inputData = e.target.value 
    //     const [year , month , day] = inputData.split("-")
    //     const regularFormDate = `${day}-${month}-${year}`
    //     setDate(regularFormDate);
    //     setprimaryDocumentDetails((prevValues) => ({
    //         ...prevValues,
    //         "so_date" : regularFormDate
    //        }))
    // }

    const primaryUpdateField = (e) => {
        const { name, value } = e.target;
        console.log(name)
        console.log(value)
        setprimaryDocumentDetails((prevValues) => ({
            ...prevValues,
            [name]: value

        }))

    }


    const handleSelectStatus = (e) => {
        const { name, value } = e.target;
        setSelectStatus(value);
        setprimaryDocumentDetails((prevVal) => ({
            ...prevVal,
            [name]: value
        }))
    }

    const SotermUpdateField = (e) => {
        const { value } = e.target;
        setsoTermsCondition(value);
    }


    const getActiveClientDetails = useSelector(selectActiveclientpos)
    const getClientPodetails = getActiveClientDetails?.body
    const [options, setOptions] = useState([])
    const [optionSelected, setSelected] = useState(null);
    //    console.log(options)
    useEffect(() => {
        let opts = getClientPodetails?.map((obj) => {
            return { value: obj.client_po, label: obj.client_po }
        })
        setOptions(opts);
    }, [getClientPodetails])

    const clientPohandle = (selected) => {
        setSelected(selected)
        const createPo = selected?.map((item) => {
            return {
                "create_po": item?.value
            }
        });
        setprimaryDocumentDetails((prevState) => ({
            ...prevState,
            "client_po": createPo
        }))
        setSelected(selected);
    }

    const secondaryUpdateField = (e) => {
        const { name, value } = e.target
        // console.log(e)
        setsecondaryDocumentDetails((prevValues) => ({
            ...prevValues,
            [name]: value
        }))

    }


    const handleOnSubmite = async (e) => {

        e.preventDefault()


        const req_update = {
            "kind_attn": kind_attn,
            "ship_to": ship_to,
            "req_line": ReqLine,
            "so_terms_conditions": soTermsCondition,
            "primary_document_details": primaryDocumentDetails,
            "secondary_doc_details": secondaryDocumentDetails,
            "job_work_table": job_work_table,
            "partner_id": partner_id,
            "total_amount": {
                "total_basic_amount": TotalBasicAmount.toString(),
                "total_basic_amount_gst": TotalBasicAmountGst.toString(),
                "grand_total": grandTotal.toString(),
                "shipping_charges": shipping_charges.toString(),
                "amount_in_words": grandTotalInWords
            },

        }
        // console.log(req_update)
        if (Selectbtn === "SAVEANDSEND") {

            const response = await dispatch(saveServiceOrder(req_update));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)

                }, 2000)
            }
        }
        else if (Selectbtn === 'SAVEDRAFT') { // Change to else if
            const response = await dispatch(draftServiceorder(req_update));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        }
    }




    return (
        <>
            <div className="wrap">
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
                        <span>Create Service Order</span>
                    </h6>
                </div>
                <form onSubmit={handleOnSubmite}>
                    <div class="content-sec">

                        <Row>
                            <h5 className="inner-tag my-2">Kind Attn</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Company Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="company_name"
                                                value={kind_attn?.company_name}
                                                placeholder=""
                                                required
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">GST No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_number"
                                                value={kind_attn?.gst_number}
                                                maxLength={15}
                                                placeholder=""
                                                required
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Pan No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pan_number"
                                                value={kind_attn?.pan_number}
                                                maxLength={10}
                                                placeholder=""
                                                required
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Contact Details <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_details"
                                                value={kind_attn?.contact_details}
                                                placeholder=""
                                                required
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Phone No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_number"
                                                value={kind_attn?.contact_number}
                                                placeholder=""
                                                pattern="[0-9]*[\s\-()/]*"
                                                required
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Address <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="address"
                                                value={kind_attn?.address}
                                                placeholder=""
                                                required
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>


                            <h5 className="inner-tag my-2"> Ship To</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Company Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="company_name"
                                                value={ship_to?.company_name}
                                                placeholder=""
                                                required
                                                onChange={shipHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">GST No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_number"
                                                value={ship_to?.gst_number}
                                                maxLength={15}
                                                placeholder=""
                                                required
                                                onChange={shipHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Pan No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pan_number"
                                                value={ship_to?.pan_number}
                                                maxLength={10}
                                                placeholder=""
                                                required
                                                onChange={shipHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Contact Details <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_details"
                                                value={ship_to?.contact_details}
                                                placeholder=""
                                                required
                                                onChange={shipHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Phone No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_number"
                                                value={ship_to?.contact_number}
                                                pattern="[0-9]*[\s\-()/]*"
                                                placeholder=""
                                                required
                                                onChange={shipHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Address <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="address"
                                                value={ship_to?.address}
                                                placeholder=""
                                                required
                                                onChange={shipHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>


                        </Row>

                        <Row>

                            <Col xs={6} md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">SO Terms and Conditions <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="soTermsCondition"
                                        value={soTermsCondition}
                                        placeholder=""
                                        required
                                        onChange={SotermUpdateField}
                                        className="supplierheight"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> Request Line <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="req_line"
                                        value={ReqLine}
                                        placeholder=""
                                        required
                                        onChange={reqkindHandle}
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
                                            <Form.Label className="mb-0">Transaction Name<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="transaction_name"
                                                placeholder=""
                                                onChange={primaryUpdateField}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Reference Client Po No<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="reference_client_po_no"
                                                placeholder=""
                                                // value={primaryDocumentDetails}
                                                onChange={primaryUpdateField}
                                                required
                                            />
                                            {/* <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        /> */}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Status <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={selectStatus}
                                                onChange={handleSelectStatus}
                                            >
                                                <option value="">Select</option>
                                                <option value="NotDispatched">Not Dispatched</option>
                                                <option value="InTransit">In Transit</option>
                                                <option value="Received">Received</option>
                                                <option value="Delayed" >Delayed</option>
                                                required
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">SO Date <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="so_date"
                                                placeholder="YYYY-MM-DD"
                                                onChange={primaryUpdateField}
                                                required

                                            />
                                            {/* <DatePicker className="form-control"
                                            name='po_date'
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={handleChange}
                                            onFocus={(e) => e.target.readOnly = true}
                                        /> */}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Amendment No<span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="amendment_no"
                                                placeholder=""
                                                onChange={primaryUpdateField}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Delivery Delay In Weeks <span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="delivery_dely_in_weeks"
                                                placeholder=""
                                                onChange={primaryUpdateField}

                                                disabled={selectStatus === "" || selectStatus === "NotDispatched" || selectStatus === "InTransit" || selectStatus === "Received"}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Quote Date <span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="quote_date"
                                                placeholder="YYYY-MM-DD"
                                                // value={form.primaryDocumentDetails.document_date}
                                                onChange={primaryUpdateField}
                                            />
                                            {/* <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        /> */}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Amendment Date<span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="AmendmentDate"
                                                placeholder="YYYY-MM-DD"
                                                onChange={primaryUpdateField}
                                            />
                                            {/* <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        /> */}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Quote Reference <span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="quote_reference"
                                                placeholder=""
                                                onChange={primaryUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> Client Po <span className="text-danger">*</span></Form.Label>

                                            <MultiSelect
                                                isMulti
                                                key="example_id"
                                                options={options}
                                                onChange={clientPohandle}
                                                value={optionSelected}
                                                isSelectAll={true}
                                                menuPlacement={"bottom"}
                                                required

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Buyer Code <span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="buyer_code"
                                                placeholder=""
                                                onChange={primaryUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Currency<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="currency"
                                                placeholder=""
                                                onChange={primaryUpdateField}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>


                            <h1 className='inner-tag'>Job Work Table</h1>
                            <div className='table-responsive'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Sl.No</th>
                                            <th>Scope of Job Work</th>
                                            <th>Qty</th>
                                            <th>Rate</th>
                                            <th>GST %</th>
                                            <th>GST</th>
                                            <th>Basic Amount</th>
                                            <th>Delivery Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={row.slno}
                                                        readOnly
                                                        className=''
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={row.scopeOfJobWork}
                                                        onChange={(e) => calculateRow(index, 'scopeOfJobWork', e.target.value)}
                                                        required
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        value={row.qty}
                                                        onChange={(e) => calculateRow(index, 'qty', e.target.value)}
                                                        required
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        value={row.rate}
                                                        onChange={(e) => calculateRow(index, 'rate', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={row.gstPercent}
                                                        onChange={(e) => calculateRow(index, 'gstPercent', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input type="number" value={row.gst} readOnly />
                                                </td>
                                                <td>
                                                    <input type="number" value={row.basicAmount} readOnly />
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        value={row.delivery_date ? formatDate(row.delivery_date) : ''}
                                                        onChange={(e) => calculateRow(index, 'delivery_date', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    {index === rows.length - 1 ? (
                                                        <span className="icon add   py-0 px-1" onClick={addRow}>+</span>
                                                    ) : (
                                                        <span className="icon remove  py-0 px-1" onClick={() => removeRow(index)}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="content-sec1 mt-3">
                                <h6 className="inner-tag my-2">Total Amount</h6>

                                <label htmlFor="totalBasic" className='mb-3 mr-3'>Total Basic:</label>
                                <input type='number' id='totalBasic' value={TotalBasicAmount} readOnly className='ml-2' />
                                <br />

                                <label htmlFor="totalBasicgst" className='mb-2 mr-5'>Total GST:</label>
                                <input type='number' id='totalBasicgst' value={TotalBasicAmountGst} readOnly />
                                <br />

                                <label htmlFor="shippingCharges" className='mb-3 mr-3'>Shipping Charges:</label>
                                <input type='number' id='shippingCharges' value={shippingCharges} onChange={handleShippingCharges} />
                                <br />

                                <label htmlFor="grandTotal" className='mb-3 mr-3'>Grand Total:</label>
                                <input type='number' id='grandTotal' value={grandTotal} readOnly required />

                                <br />

                                <p>Amount in Words : {grandTotalInWords} </p>
                            </div>

                        </div>
                    </div>

                    <div className="wrap4">
                        <h5 className="inner-tag my-2">Secondary Document Details</h5>
                        <div className="content-sec">
                            <Row>
                                <Col xs={12} md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Prepared By <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="prepared_by"
                                            // value={form.preparedBy}
                                            placeholder=""
                                            onChange={secondaryUpdateField}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Checked By <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="checked_by"
                                            // value={form.checkedBy}
                                            placeholder=""
                                            required
                                            onChange={secondaryUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Authorized Signatory <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="authorized_signatory"
                                            // value={form.authorizedSignatory}
                                            placeholder=""
                                            required
                                            onChange={secondaryUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Note <span className="text-danger"></span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="note"
                                            // value={form.note}
                                            placeholder=""
                                            onChange={secondaryUpdateField}
                                            style={{ height: "100px" }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0"> TERMS AND CONDITIONS   <span className="text-danger"></span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="terms_conditions"
                                            // value={form.tConditions}
                                            placeholder=""
                                            onChange={secondaryUpdateField}
                                            style={{ height: "100px" }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                    </div>
                    <div className="d-flex justify-content-end mt-2">
                        <Button type="submit" onClick={(e) => setSelectbtn('SAVEDRAFT')} className="cancel" >Save As Draft</Button>
                        <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={() => setSelectbtn("SAVEANDSEND")}>Create</Button>
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
export default ServiceOrder;
