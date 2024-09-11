import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Form, Row, Spinner, Button } from "react-bootstrap";
import arw from "../../../assets/Images/left-arw.svg"
import { getActiveClientPos, getEditServiceOrderDetails, resetServiceOrderDetails, selectActiveclientpos, SelectEditSoFormDetails, selectLoadingState, updateDraftServiceOrder, updateEditSoData } from '../slice/ForecastSlice';
import { ToastContainer, Zoom } from 'react-toastify';
import numberToWords from 'number-to-words';
import { useSelector, useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { ToWords } from 'to-words';
import MultiSelect from '../../../components/MultiSelect';

const EditServiceOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const towords = new ToWords()
    const location = useLocation();
    const [isChecked, setIsChecked] = useState(true);
    const [Selectbtn, setSelectbtn] = useState("")
    const [shipTo, setShipTo] = useState({})
    const [allGrandTotal, setAllGrandTotal] = useState(0); //grand total
    const [grandTotalInWords, setGrandTotalInWords] = useState('');
    const [kindAttn, setkindAttn] = useState({})
    const [selectStatus, setSelectStatus] = useState("")
    // console.log(selectStatus)
    const [primaryDocumentDetails, setprimaryDocumentDetails] = useState({})
    // const [TotalAmount , SetTotalAmount] = useState(0)
    const [soTermsCondition, setsoTermsCondition] = useState("")
    const isLoading = useSelector(selectLoadingState);

    const [secondaryDocumentDetails, setsecondaryDocumentDetails] = useState({})
    const editdetails = useSelector(SelectEditSoFormDetails)
    const geteditdetails = editdetails?.body
    // console.log(geteditdetails)
    const { so_id, tab, isStatus } = location.state
    const partnerId = geteditdetails?.partner_id
    // console.log(partnerId)
    console.log(so_id)
    console.log(isStatus)
    useEffect(() => {
        const request = {
            "env_type": "Development",
            "so_id": so_id
        }
        dispatch(getActiveClientPos())
        dispatch(getEditServiceOrderDetails(request))
        return () => {
            dispatch(resetServiceOrderDetails());
        }
    }, [])

    const [formData, setFormData] = useState({
        shipTo: {
            company_name: "",
            gst_number: "",
            pan_number: "",
            contact_details: "",
            contact_number: "",
            address: ""
        },
        kind_Attn: {
            company_name: "",
            gst_number: "",
            pan_number: "",
            contact_details: "",
            contact_number: "",
            address: ""
        },
        req_line: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [category, field] = name.split('.');
        setFormData((prevState) => {
            if (category === 'shipTo' || category === 'kind_Attn') {
                return {
                    ...prevState,
                    [category]: {
                        ...prevState[category],
                        [field]: value
                    }
                };
            } else {
                return {
                    ...prevState,
                    [name]: value
                };
            }
        });
    };


    useEffect(() => {
        if (geteditdetails?.kind_attn) {
            setkindAttn(geteditdetails?.kind_attn);
        }
    }, [geteditdetails]);


    const kindhandleChange = (e) => {
        const { name, value } = e.target;
        setkindAttn((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    }


    useEffect(() => {
        if (geteditdetails?.ship_to) {
            setShipTo(geteditdetails?.ship_to)
        }
    }, [geteditdetails])


    const shipHandleChange = (e) => {
        const { name, value } = e.target;
        setShipTo((prevValue) => ({
            ...prevValue,
            [name]: value
        }))

    }
    //  console.log(shipTo)

    useEffect(() => {
        if (geteditdetails?.primary_document_details) {
            setprimaryDocumentDetails(geteditdetails?.primary_document_details)
            setSelectStatus(geteditdetails?.primary_document_details?.status)
        }
    }, [geteditdetails])

    const primaryUpdateField = (e) => {
        const { name, value } = e.target;
        setprimaryDocumentDetails((prevValues) => ({
            ...prevValues,
            [name]: value

        }))
    }

    const [ReqLine, setRequestLine] = useState({})

    useEffect(() => {
        if (geteditdetails?.req_line) {
            setRequestLine(geteditdetails?.req_line)
        }
    }, [geteditdetails])

    const RequestFiled = (e) => {
        const { value } = e.target
        setRequestLine(value)

    }


    useEffect(() => {
        if (geteditdetails?.secondary_doc_details) {
            setsecondaryDocumentDetails(geteditdetails?.secondary_doc_details)
        }
    }, [geteditdetails])

    const secondaryUpdateField = (e) => {
        const { name, value } = e.target
        setsecondaryDocumentDetails((prevValues) => ({
            ...prevValues,
            [name]: value
        }))

    }
   
    useEffect(() => {
        if (geteditdetails?.so_terms_conditions) {
            setsoTermsCondition(geteditdetails?.so_terms_conditions)
        }
    }, [geteditdetails])
    const SotermUpdateField = (e) => {
        const { value } = e.target;
        setsoTermsCondition(value);
    }
    const [shippingCharges, setShippingCharges] = useState(0)
    useEffect(() => {
        if (geteditdetails?.total_amount) {
            setShippingCharges(parseFloat(geteditdetails?.total_amount?.shipping_charges))
        }

    }, [geteditdetails])


    const [jobWorkData, setJobWorkData] = useState({
        part1: {
            sn_no: "",
            scope_of_job_work: "",
            qty: "",
            rate: "",
            gst_percent: "",
            gst: "",
            basic_amount: "",
            delivery_date: ""
        },
        part2: {
            sn_no: "",
            scope_of_job_work: "",
            qty: "",
            rate: "",
            gst_percent: "",
            gst: "",
            basic_amount: "",
            delivery_date: ""
        }
    });


    const [rows, setRows] = useState([
        { slno: 1, scopeOfJobWork: '', qty: '', unit: '', rate: '', gstPercent: '', gst: '', basicAmount: '', delivery_date: "" },
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
        const rate = updatedRows[index].rate || 0;
        const gstPercent = updatedRows[index].gstPercent || 0;

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


    const handleShippingCharges = (e) => {
        const { value } = e.target
        setShippingCharges(value)
    };

    const [TotalBasicAmount, setTotalBasicAmount] = useState(0)
    const [TotalBasicAmountGst, setTotalBasicAmountGst] = useState(0)

    useEffect(() => {
        setTotalBasicAmount(rows.reduce((acc, curr) => acc + (parseFloat(curr.basicAmount) || 0), 0));
    }, [rows]);

    useEffect(() => {
        const total = rows.reduce((acc, curr) => acc + (parseFloat(curr.basicAmount) || 0), 0)
        setTotalBasicAmount(total)
        const totalGst = rows.reduce((acc, curr) => acc + (parseFloat(curr.gst) || 0), 0)
        setTotalBasicAmountGst(totalGst)
    }, [rows])

    let total = parseFloat(TotalBasicAmount) + parseFloat(TotalBasicAmountGst)
    const grandTotal = shippingCharges ? parseFloat(TotalBasicAmount) + parseFloat(TotalBasicAmountGst) + parseFloat(shippingCharges) : total || 0
    const shipping_charges = shippingCharges

    useEffect(() => {
        const newGrandTotal = (parseFloat(TotalBasicAmount) + parseFloat(TotalBasicAmountGst) + parseFloat(shipping_charges)) || 0;
        setAllGrandTotal(newGrandTotal)
        let Words = towords.convert(newGrandTotal, { currency: true })
        setGrandTotalInWords(Words)
        // setGrandTotalInWords(numberToWords.toWords(newGrandTotal))
    }, [TotalBasicAmount, TotalBasicAmount, shippingCharges])

    const handleSelectStatus = (e) => {
        const { name, value } = e.target;
        setSelectStatus(value);
        setprimaryDocumentDetails((prevVal) => ({
            ...prevVal,
            [name]: value
        }))
    }

    const getActiveClientDetails = useSelector(selectActiveclientpos)
    const getClientPodetails = getActiveClientDetails?.body
    const [options, setOptions] = useState([])
    const [optionSelected, setSelected] = useState(null);

    useEffect(() => {
        const opts = geteditdetails?.primary_document_details?.client_po?.map((obj) => ({
            value: obj.create_po,
            label: obj.create_po
        })) || [];

        const opts1 = getClientPodetails?.map((obj) => ({
            value: obj.client_po,
            label: obj.client_po
        })) || [];

        setSelected(opts);
        setOptions([...opts, ...opts1]);
    }, [geteditdetails, getClientPodetails])

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
    }

    const handleOnSubmite = async (e) => {
        e.preventDefault()
        const req_update = {
            "kind_attn": kindAttn,
            "ship_to": shipTo,
            "req_line": ReqLine,
            "so_terms_conditions": soTermsCondition,
            "primary_document_details": primaryDocumentDetails,
            "secondary_doc_details": secondaryDocumentDetails,
            "job_work_table": job_work_table,
            "so_id": so_id,
            "partner_id": partnerId,
            "total_amount": {
                "total_basic_amount": TotalBasicAmount.toString(),
                "total_basic_amount_gst": TotalBasicAmountGst.toString(),
                "grand_total": grandTotal.toString(),
                "shipping_charges": shipping_charges.toString(),
                "amount_in_words": grandTotalInWords,

            },

        }

        if (Selectbtn === "UPDATEANDSEND" && tab !== "Draft") {
            console.log(req_update)
            const updatedRequestBody = {
                ...req_update,
                updatestatus: isStatus,
              };
            const response = await dispatch(updateEditSoData(updatedRequestBody));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                    dispatch(resetServiceOrderDetails())

                }, 2000)
            }
        }

        else if (Selectbtn === "Cancle") {
            setTimeout(() => {
                navigate(-1)
            }, 1000);
        }
        else {
            const response = await dispatch(updateDraftServiceOrder(req_update))
            if (response?.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 1000);
            }
        }
    }

    useEffect(() => {
        if (geteditdetails?.job_work_table) {
            const newRows = Object.keys(geteditdetails?.job_work_table).map(key => {
                const { sn_no, scope_of_job_work, qty, unit, rate, gst: gstValue, basic_amount, delivery_date } = geteditdetails?.job_work_table[key];
                return {
                    slno: parseInt(sn_no),
                    scopeOfJobWork: scope_of_job_work,
                    qty: parseInt(qty),
                    unit: unit,
                    rate: parseFloat(rate),
                    gstPercent: parseFloat(gstValue),
                    gst: parseFloat(gstValue),
                    basicAmount: parseFloat(basic_amount),
                    delivery_date: delivery_date
                };
            });
            setRows(newRows);
        }
    }, [geteditdetails?.job_work_table])

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
                                dispatch(resetServiceOrderDetails())

                            }}
                        />
                        <span>Edit Service Order</span>
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
                                                value={kindAttn?.company_name}
                                                placeholder=""
                                                required
                                                onChange={kindhandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">GST No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_number"
                                                value={kindAttn?.gst_number}
                                                maxLength={15}
                                                placeholder=""
                                                required
                                                onChange={kindhandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Pan No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pan_number"
                                                value={kindAttn?.pan_number}
                                                maxLength={10}
                                                placeholder=""
                                                required
                                                onChange={kindhandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Contact Details <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_details"
                                                value={kindAttn?.contact_details}
                                                placeholder=""
                                                required
                                                onChange={kindhandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Phone No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_number"
                                                value={kindAttn?.contact_number}
                                                placeholder=""
                                                pattern="[0-9]*[\s\-()/]*"
                                                required
                                                onChange={kindhandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Address <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="address"
                                                value={kindAttn?.address}
                                                placeholder=""
                                                required
                                                onChange={kindhandleChange}
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
                                                value={shipTo?.company_name}
                                                placeholder=""
                                                required
                                                onChange={shipHandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">GST No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_number"
                                                value={shipTo?.gst_number}
                                                maxLength={15}
                                                placeholder=""
                                                required
                                                onChange={shipHandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Pan No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pan_number"
                                                value={shipTo?.pan_number}
                                                maxLength={10}
                                                placeholder=""
                                                required
                                                onChange={shipHandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Contact Details <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_details"
                                                value={shipTo?.contact_details}
                                                placeholder=""
                                                required
                                                onChange={shipHandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Phone No <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="contact_number"
                                                value={shipTo?.contact_number}
                                                pattern="[0-9]*[\s\-()/]*"
                                                placeholder=""
                                                required
                                                onChange={shipHandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">address <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="address"
                                                value={shipTo?.address}
                                                placeholder=""
                                                required
                                                onChange={shipHandleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>


                        </Row>

                        <Row>

                            <Col xs={6} md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">So Terms and Conditions <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="so_terms_conditions"
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
                                        onChange={RequestFiled}
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
                                                required
                                                value={primaryDocumentDetails?.transaction_name}
                                            // onChange={primaryUpdateField}
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
                                                required
                                                value={primaryDocumentDetails?.reference_client_po_no}
                                            // onChange={primaryUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Status <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={primaryDocumentDetails?.status}
                                                onChange={handleSelectStatus}
                                                required

                                            >    <option value="">Select</option>
                                                <option value="NotDispatched">Not Dispatched</option>
                                                <option value="InTransit">In Transit</option>
                                                <option value="Received">Received</option>
                                                <option value="Delayed">Delayed</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">So Date <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="so_date"
                                                placeholder="YYYY-MM-DD"
                                                value={primaryDocumentDetails?.so_date}
                                                onChange={primaryUpdateField}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Amendment No<span className="text-danger"></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="amendment_no"
                                                placeholder=""
                                                value={primaryDocumentDetails?.amendment_no}
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
                                                value={primaryDocumentDetails?.delivery_dely_in_weeks}
                                                disabled={selectStatus === "" || selectStatus === "NotDispatched" || selectStatus === "InTransit" || selectStatus === "Received"}
                                                onChange={primaryUpdateField}
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
                                                value={primaryDocumentDetails?.quote_date}
                                            // onChange={primaryUpdateField}
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
                                                value={primaryDocumentDetails?.AmendmentDate}
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
                                                value={primaryDocumentDetails?.quote_reference}
                                            //    onChange={primaryUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Kind Attention <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="kind_attention"
                                            placeholder=""
                                         onChange={primaryUpdateField}
                                        />
                                    </Form.Group>
                                </Col> */}
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> Client Po <span className="text-danger">*</span></Form.Label>

                                            <MultiSelect
                                                isMulti
                                                options={options}
                                                onChange={clientPohandle}
                                                value={optionSelected}
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
                                                value={primaryDocumentDetails?.buyer_code}
                                            // onChange={primaryUpdateField}
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
                                                value={primaryDocumentDetails?.currency}
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
                                                        <span className="icon add  py-0 px-1" onClick={addRow}>+</span>
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
                                            value={secondaryDocumentDetails?.prepared_by}
                                            placeholder=""
                                            // onChange={secondaryUpdateField}
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
                                            value={secondaryDocumentDetails?.checked_by}
                                            placeholder=""
                                            required
                                        // onChange={secondaryUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Authorized Signatory <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="authorized_signatory"
                                            value={secondaryDocumentDetails?.authorized_signatory}
                                            placeholder=""
                                            required
                                        // onChange={secondaryUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Note <span className="text-danger"></span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="note"
                                            value={secondaryDocumentDetails?.note}
                                            placeholder=""
                                            onChange={secondaryUpdateField}
                                            style={{ height: "100px" }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={12} className="mb-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0"> TERMS AND CONDITIONS  <span className="text-danger"></span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="terms_conditions"
                                            value={secondaryDocumentDetails?.terms_conditions}
                                            placeholder=""
                                            // required
                                            onChange={secondaryUpdateField}
                                            style={{ height: "100px" }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                    </div>
                    <div className="d-flex justify-content-end mt-2">
                        <Button type="submit" className="cancel" onClick={() => setSelectbtn("Cancle")}>CANCEL</Button>
                        <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={() => setSelectbtn("UPDATEANDSEND")}>UPDATE & SUBMIT</Button>
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
export default EditServiceOrder;
