import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import MultiSelect from '../../../components/MultiSelect';
import Delete from "../../../assets/Images/Delete.svg";
import moment from "moment/moment";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, Zoom } from "react-toastify";
import numberToWords from 'number-to-words';
import { toast } from "react-toastify";
import { useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { invoiceform, tableContent } from '../../../utils/TableContent';
import { getActiveClientPos, selectActiveclientpos, selectEditInvoiceform, invoiceedit, selectInvoicebomsearch, componentBomSearch, selectInvoiceSearchadd, invoiceSearchAdd, selectLoadingState, invoiceCreate, selectInvoiceCreate, selectInvoiceGet, invoiceeditget, draftinvoiceedit } from '../slice/ForecastSlice'
import { selectActiclientslist, fetchClientkindattnList, selectclientskindattnlist } from '..//../purchasesales/slice/SalesSlice';


const EditInvoice = () => {
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingState);
    const dispatch = useDispatch();
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [startdocDate1, setStartdocDate1] = useState(new Date());
    const [selectedInwardid, setSelectedInwardid] = useState(null);
    const [isChecked, setIsChecked] = useState(true);
    const handleChange = (selected) => {
        setSelected(selected);
    };

    const location = useLocation();
    const { inv_id, client_id, draftinvoice } = location.state || {};
    console.log(draftinvoice, "draftinvoice");
    const isStatus = location.state?.isStatus || "";
    console.log(isStatus,":om isStatus");
    const [calculatedPrices, setCalculatedPrices] = useState([]);
    const [basicAmounts, setBasicAmounts] = useState([]); // basic amount
    const [gstAmounts, setGstAmounts] = useState([]);
    const [desc, setDesc] = useState([]);
    const [totalGst, setTotalGst] = useState(0);
    const [totalsWithGst, setTotalsWithGst] = useState([]);
    const [quantityValues, setQuantityValues] = useState([]);
    const [rateValues, setRateValues] = useState([]);
    const [gstPercentages, setGstPercentages] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0); //grand total
    const [grandTotalInWords, setGrandTotalInWords] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermvalue, setSearchTermvalue] = useState("");
    const [selectedData, setSelectedProducts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const [totalBasicAmount, setTotalBasicAmount] = useState(0);
    const [shippingCharges, setShippingCharges] = useState("");
    const [freightCharges, setfreightCharges] = useState("");
    const searchComponentRef = useRef(null);
    const [totalUnitPrice, setTotalUnitPrice] = useState(0);
    const [totalQtyPerBoard, setTotalQtyPerBoard] = useState(0);
    const [optionSelected, setSelected] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectbtn, setSelectbtn] = useState("");
    const [startdocDate2, setStartdocDate2] = useState(new Date());
    const [revValues, setRevValues] = useState([]);
    const [deliveryDateValues, setDeliveryDateValues] = useState([]);
    const [unitValues, setUnitValues] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [getclientId, setgetClientId] = useState("");
    const activeclients = useSelector(selectActiveclientpos);//active clients
    const vendorSelection = activeclients?.body || [];
    const searchedData = useSelector(selectInvoicebomsearch);
    const data = searchedData?.body;
    // const clientDetails = useSelector(selectInvoiceCreate);
    // const client = clientDetails?.body;
    // console.log(client,"clienttttttttt");
    const clientSelectiondata = useSelector(selectclientskindattnlist)
    const clientSelection = clientSelectiondata?.body || [];
    // console.log(clientSelection, "clientttttttt")
    const invoiceGet = useSelector(selectInvoiceGet)
    const Edit = invoiceGet?.body
    // console.log(Edit)
    useEffect(() => {
        if (vendorSelection?.length) {
            let opts = vendorSelection.map((obj) => {
                return { value: obj.client_po, label: obj.client_po }
            });
            // console.log(opts,"ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
            setOptions(opts);
        }
    }, [vendorSelection]);
    const handleSelectChange = async (value) => {
        setSelectedOption(value);
    };

    const handleSearchComponent = (event) => {
        const searchTerm = event.target.value.trim();
        setSearchTerm(searchTerm);
        setSearchTermvalue(searchTerm);
        if (searchTerm.trim().length < 2) {
            setFilteredData([]);
            return;
        }
        const request = {
            name: searchTerm,
        };
        setFilteredData([]);
        dispatch(componentBomSearch(request));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default action of the Enter key
        }
    };

    const handleItemClick = (item) => {
        // console.log(item[0][0]);
        setSearchTerm(item[0]?.[0]);
        setSearchTermvalue(item[0]?.[1]);
        setIsAddButtonDisabled(false);
        setFilteredData([]);
    };

    const addItem = async () => {
        setFilteredData([]);
        if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
            return;
        }
        const request = {
            "search": searchTerm,
        };
        const newTotalQtyPerBoard = selectedData.reduce(
            (total, product) => total + parseInt(product.qty, 10),
            0
        );
        const newTotalUnitPrice = selectedData.reduce(
            (total, product) => total + parseFloat(product.price),
            0
        );
        // Update state or perform any other necessary actions with the new totals
        setTotalQtyPerBoard(newTotalQtyPerBoard);
        setTotalUnitPrice(newTotalUnitPrice);
        try {
            const response = await dispatch(invoiceSearchAdd(request));
            const newItem = response.payload?.body;
            console.log(newItem, "ommmmmmmmmmmmmmmmmmmmmmmmm");
            if (response.payload?.statusCode != 400) {
                if (!selectedData.some((item) => item.bom_name === newItem.bom_name && item.cmpt_id === newItem.cmpt_id)) {
                    setSelectedProducts([...selectedData, newItem]);
                    setIsAddButtonDisabled(true);
                } else {
                    toast.error("Item already added.");
                }
                setSearchTerm("");
                setSearchTermvalue('');
            } else {
                toast.error("Item not found.");
                setSearchTerm("");
                setSearchTermvalue('');
            }
        } catch (error) {
            toast.error("Error adding item.");
            setSearchTerm("");
            setSearchTermvalue('');
        }
    };
    //  console.log(selectedData);   

    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const searchData = data.map((category) => {
                if (Array.isArray(category) && category.length > 0) {
                    const filteredCategory = category.filter(
                        (item) =>
                            typeof item === "string" &&
                            item.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    // console.log(filteredCategory, "filtereddddddddddd");
                    return filteredCategory.map((item) => [category]);
                }
                return [];
            });

            const flatFilteredData = searchData
                .flat()
                .filter(
                    (value, index, self) =>
                        self.findIndex((v) => v[0] === value[0]) === index
                );

            setFilteredData(flatFilteredData);
        }
    }, [searchedData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchComponentRef.current &&
                !searchComponentRef.current.contains(event.target)
            ) {
                setFilteredData([]);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedData?.length === 0) {
            setTotalQtyPerBoard(0);
            setTotalUnitPrice(0);
        }
    }, [selectedData]);

    // modal delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRowIndex, setDeleteRowIndex] = useState(null);
    const [deleteDepartment, setDeleteDepartment] = useState(null);
    const openDeleteModal = (rowIndex, department) => {
        setDeleteRowIndex(rowIndex);
        setDeleteDepartment(department);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteRowIndex(null);
        setDeleteDepartment(null);
    };
    const confirmDelete = () => {
        // Perform the delete action
        if (deleteRowIndex !== null && deleteDepartment !== null) {
            deleterow(deleteRowIndex, deleteDepartment);
        }
        handleCloseDeleteModal();
    }

    const deleterow = (index) => {
        const updatedSelectedData = [...selectedData];
        updatedSelectedData.splice(index, 1);
        const updatedCalculatedPrices = [...calculatedPrices];
        updatedCalculatedPrices.splice(index, 1);
        const updatedBasicAmounts = [...basicAmounts];
        updatedBasicAmounts.splice(index, 1);
        const updatedGstAmounts = [...gstAmounts];
        updatedGstAmounts.splice(index, 1);
        setSelectedProducts(updatedSelectedData);
        setCalculatedPrices(updatedCalculatedPrices);
        setBasicAmounts(updatedBasicAmounts);
        setGstAmounts(updatedGstAmounts);

        const updatedTotalQtyPerBoard = updatedSelectedData.reduce(
            (total, product) => total + parseInt(product.qty),
            0
        );
        const updatedTotalUnitPrice = updatedSelectedData.reduce(
            (total, product) => total + parseFloat(product.price),
            0
        );
        const updatedTotalGst = updatedGstAmounts.reduce(
            (total, gst) => total + parseFloat(gst),
            0
        );
        setTotalQtyPerBoard(updatedTotalQtyPerBoard);
        setTotalUnitPrice(updatedTotalUnitPrice);
        setTotalGst(updatedTotalGst);

        const updatedTotalBasicAmount = updatedBasicAmounts.reduce(
            (total, amount) => total + parseFloat(amount || 0),
            0
        );
        setTotalBasicAmount(updatedTotalBasicAmount);
    };

    const handleRateChange = (value, index) => {
        const newRateValues = [...rateValues];
        newRateValues[index] = value;
        setRateValues(newRateValues);

        const newBasicAmounts = quantityValues.map((qty, i) => qty * newRateValues[i]);
        setBasicAmounts(newBasicAmounts);

        const newGstAmounts = newBasicAmounts.map((amount, i) => (amount * gstPercentages[i]) / 100);
        setGstAmounts(newGstAmounts);

        const newTotalsWithGst = newBasicAmounts.map((amount, i) => amount + newGstAmounts[i]);
        setTotalsWithGst(newGstAmounts);
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

        return words;
    };
    const handleQtyChange = (value, index) => {
        const newQtyValues = [...quantityValues];
        newQtyValues[index] = value;
        setQuantityValues(newQtyValues);

        const newBasicAmounts = newQtyValues.map((qty, i) => qty * (rateValues[i] || 0));
        setBasicAmounts(newBasicAmounts);

        const newGstAmounts = newBasicAmounts.map((amount, i) => (amount * gstPercentages[i]) / 100);
        setGstAmounts(newGstAmounts);

        const newTotalsWithGst = newBasicAmounts.map((amount, i) => amount + newGstAmounts[i]);
        setTotalsWithGst(newGstAmounts);
    };

    const handleGstChange = (value, index) => {
        const newGstPercentages = [...gstPercentages];
        newGstPercentages[index] = value;
        setGstPercentages(newGstPercentages);

        const newGstAmounts = basicAmounts.map((amount, i) => (amount * newGstPercentages[i]) / 100);
        setGstAmounts(newGstAmounts);

        const newTotalsWithGst = basicAmounts.map((amount, i) => amount + newGstAmounts[i]);
        setTotalsWithGst(newGstAmounts);
    };

    const calculateBasicAmount = (qty, price) => {
        const parsedQty = parseInt(qty, 10);
        const parsedPrice = parseFloat(price);
        if (!isNaN(parsedQty) && !isNaN(parsedPrice)) {
            return parsedQty * parsedPrice;
        }
        return 0;
    };

    const calculateGstAmount = (basicAmount, gstRate) => {
        const parsedBasicAmount = parseFloat(basicAmount);
        const parsedGstRate = parseFloat(gstRate);
        if (!isNaN(parsedBasicAmount) && !isNaN(parsedGstRate)) {
            const gstAmount = (parsedBasicAmount * parsedGstRate) / 100;
            return gstAmount; // Return only the GST amount
        }
        return 0;
    };
    const handleRevChange = (newValue, index) => {
        const updatedRevValues = [...revValues];
        updatedRevValues[index] = newValue;
        setRevValues(updatedRevValues);
    };

    const handleDeliveryDateChange = (date, index) => {
        const updatedDeliveryDateValues = [...deliveryDateValues];
        updatedDeliveryDateValues[index] = date;
        setDeliveryDateValues(updatedDeliveryDateValues);
    };

    const handleUnitChange = (newValue, index) => {
        const updatedUnitValues = [...unitValues];
        updatedUnitValues[index] = newValue;
        setUnitValues(updatedUnitValues);
    };

    const handleDescChange = (newValue, index) => {
        const updatedDesc = [...desc];
        updatedDesc[index] = newValue;
        setDesc(updatedDesc);
    };

    const handleShippingChargesChange = (event) => {
        const value = event.target.value;
        setShippingCharges(parseFloat(value) || 0);
    };

    const handleFreightCharges = (event) => {
        const value = event.target.value;
        setfreightCharges(parseFloat(value) || 0);
    };

    const isNewlyAdded = (product) => {
        return !product.isFetched; // or any other condition to identify newly added items
    };
    useEffect(() => {
        if (selectedData) {
            const initialQuantities = selectedData.map(product => product.qty || 0);
            const initialRates = selectedData.map(product => product.rate || product.price || 0);
            const initialBasicAmounts = initialQuantities.map((qty, index) => qty * initialRates[index]);
            const initialGstPercentages = selectedData.map(product => product.gst || 0);
            const initialGstAmounts = initialBasicAmounts.map((amount, index) => (amount * initialGstPercentages[index]) / 100);
            const initialTotalsWithGst = initialBasicAmounts.map((amount, index) => amount + initialGstAmounts[index]);
            // console.log(initialGstPercentages);
            // console.log(initialGstAmounts);
            // console.log(initialTotalsWithGst);
            setQuantityValues(initialQuantities);
            setRateValues(initialRates);
            setBasicAmounts(initialBasicAmounts);
            setGstPercentages(initialGstPercentages);
            setGstAmounts(initialGstAmounts);
            setTotalsWithGst(initialGstAmounts);
        }
    }, [selectedData]);

    useEffect(() => {
        // Calculate total basic amount
        const totalBasic = basicAmounts.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        setTotalBasicAmount(totalBasic.toFixed(2));
        // Calculate total GST amount
        const totalGstAmount = totalsWithGst.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        setTotalGst(totalGstAmount.toFixed(2));
        // Calculate grand total amount
        const grandTotalAmount = totalsWithGst.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        const shipping = parseFloat(shippingCharges || 0);
        const freight = parseFloat(freightCharges || 0);
        // Ensure basicAmounts is handled correctly
        const totalBasicParsed = basicAmounts.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);

        // Calculate the new grand total
        const newGrandTotal = totalBasicParsed + grandTotalAmount + shipping + freight;
        setGrandTotal(newGrandTotal.toFixed(2));

        // Convert the grand total to words
        setGrandTotalInWords(convertNumberToWords(newGrandTotal));
        
    }, [basicAmounts, totalsWithGst, shippingCharges, freightCharges]);

    useEffect(() => {
        dispatch(getActiveClientPos());
    }, []);


    const [form, setForm] = useState({
        kcompanyName: "",
        kgstNo: "",
        kpanNo: "",
        kcontactDetails: "",
        kphoneNo: "",
        kAddress: "",
        scompanyName: "",
        sgstNo: "",
        spanNo: "",
        scontactDetails: "",
        sphoneNo: "",
        sAddress: "",
        sstateName: "",
        sstateCode: "",
        termsandConditions: "",
        requestLine: "",
        transactionName: "",
        status: "",
        poDate: "",
        amendmentNo: "",
        // deliveryDateinWeeks: "",
        amendmentDate: "",
        quoteReference: "",
        quoteDate: "",
        buyerCode: "",
        currency: "",
        //invoiceNo:"",
        poNo: "",
        clientPo: "",
        preparedBy: "",
        checkedBy: "",
        authorizedSignatory: "",
        note: "",
        tConditions: ""
    });

    const onUpdateField = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trimStart(); // Trim leading spaces    
        setForm({ ...form, [name]: trimmedValue });
    };
    // console.log(form, "invoiceee")

    useEffect(() => {
        if (inv_id) {
            dispatch(invoiceeditget({ inv_id }));
        }
    }, [inv_id, dispatch]);

    const clientdata = useSelector(selectInvoiceGet);
    // console.log(clientdata,"hhhhhhhhhhh")

    useEffect(() => {
        if (clientdata?.body) {
            const client = clientdata?.body;
            const invoice = client?.purchase_list;
            // console.log(invoice, "ommmmmmmmm");
            setSelectedOption(client?.primary_document_details?.status);
            setForm({
                kcompanyName: client?.kind_attn?.company_name,
                kgstNo: client?.kind_attn?.gst_no,
                kpanNo: client?.kind_attn?.pan_no,
                kcontactDetails: client?.kind_attn?.contact_details,
                kphoneNo: client?.kind_attn?.phone_number,
                kAddress: client?.kind_attn?.address,
                scompanyName: client?.ship_to?.company_name,
                sgstNo: client?.ship_to?.gst_no,
                spanNo: client?.ship_to?.pan_no,
                scontactDetails: client?.ship_to?.contact_details,
                sphoneNo: client?.ship_to?.phone_number,
                sAddress: client?.ship_to?.address,
                sstateName: client?.ship_to?.state_name,
                sstateCode: client?.ship_to?.state_code,
                transactionName: client?.primary_document_details?.transaction_name,
                invoiceDate: client?.primary_document_details?.invoice_date,
                amendmentNo: client?.primary_document_details?.amendment_no,
                amendmentDate: client?.primary_document_details?.amendment_date,
                quoteReference: client?.primary_document_details?.quote_reference,
                quoteDate: client?.primary_document_details?.quote_date,
                buyerCode: client?.primary_document_details?.buyer_code,
                currency: client?.primary_document_details?.currency,
                poNo: client?.primary_document_details?.po_no,
                clientPo: client?.primary_document_details?.client_po,
                preparedBy: client?.secondary_doc_details?.prepared_by,
                checkedBy: client?.secondary_doc_details?.checked_by,
                authorizedSignatory: client?.secondary_doc_details?.authorized_signatory,
                note: client?.secondary_doc_details?.note,
                tConditions: client?.secondary_doc_details?.terms_conditions,
                requestLine: client?.primary_document_details?.req_line,

            });

            const cpo = client?.primary_document_details?.client_po;
            // console.log(cpo, "omcpo");
            let opts = [];
            opts = cpo.map((obj) => {
                return { value: obj.create_po, label: obj.create_po }
            });
            // console.log('Options:', opts);
            setSelected([...opts]);
            setTotalBasicAmount(client?.total_amount?.total_basic_amount)
            setTotalGst(client?.total_amount?.total_basic_amount_gst)
            setGrandTotal(client?.total_amount?.grand_total)
            setShippingCharges(client?.total_amount?.shipping_charges)
            setfreightCharges(client?.total_amount?.freight_charges)
            // console.log(client?.total_amount?.total_basic_amount_gst, "mmmmmmmmmm");
            const deliveryDates = client?.purchase_list?.map(item => new Date(item.delivery_date)) || [];
            const purchaseList = client?.purchase_list?.map(item => ({
                ...item,
                isFetched: true
            })) || [];
            setSelectedProducts(purchaseList);
            setDeliveryDateValues(deliveryDates);
            setgetClientId(client?.client_id)

        }
        // setProductList(clientDetails?.product_list);
    }, [inv_id, client_id, clientdata])

    // console.log(client_id, "kkkkkkkkkkkkkkkk")
    // console.log(form,"mmmmmmmmmmmmmmmmmmmmmmm");

    const handleSubmit = async (e) => {
        e.preventDefault();
        let selectedPos = optionSelected.map((obj) => {
            return { create_po: obj.value }
        })

        const formData = {
            kind_attn: {
                company_name: form?.kcompanyName,
                gst_no: form.kgstNo.toString(),
                pan_no: form.kpanNo.toString(),
                contact_details: form.kcontactDetails.toString(),
                phone_number: form.kphoneNo.toString(),
                address: form.kAddress,
            },
            ship_to: {
                company_name: form.scompanyName,
                gst_no: form.sgstNo.toString(),
                pan_no: form.spanNo.toString(),
                contact_details: form.scontactDetails.toString(),
                phone_number: form.sphoneNo.toString(),
                address: form.sAddress,
                state_code: form.sstateCode,
                state_name: form.sstateName,
            },
            // po_terms_conditions: form.termsandConditions,
            primary_document_details: {
                transaction_name: form.transactionName,
                status: selectedOption,
                invoice_date: moment(startdocDate).format('YYYY-MM-DD'),
                amendment_no: form.amendmentNo,
                // delivery_dely_in_weeks:form.deliveryDateinWeeks,
                amendment_date: moment(startdocDate1).format('YYYY-MM-DD'),
                quote_reference: form.quoteReference,
                quote_date: moment(startdocDate2).format('YYYY-MM-DD'),
                buyer_code: form.buyerCode,
                currency: form.currency,
                client_po: selectedPos,
                req_line: form.requestLine,
                po_no: form.poNo,
            },
            secondary_doc_details: {
                prepared_by: form.preparedBy,
                checked_by: form.checkedBy,
                authorized_signatory: form.authorizedSignatory,
                note: form.note,
                terms_conditions: form.tConditions
            },

        };

        const list = selectedData.map((product, index) => ({
            itemNo: product.bom_name || product.mfr_prt_num || product.item_no,
            rev: revValues[index] || product.rev,
            description: desc[index] || product.description,
            deliveryDate: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
            qty: quantityValues[index] || product.qty,
            unit: unitValues[index] || product.unit,
            rate: rateValues[index] || product.price,
            gst: gstPercentages[index],
            basicAmount: basicAmounts[index],
            gstAmount: gstAmounts[index],

        }));

        const purchase_list = list.reduce((acc, product, index) => {
            const partKey = `part${index + 1}`;
            acc[partKey] = {
                item_no: product.itemNo,
                rev: revValues[index] || product.rev,
                description: desc[index] || product.description,
                delivery_date: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
                qty: quantityValues[index] || product.qty,
                unit: unitValues[index] || product.unit,
                rate: rateValues[index],
                gst: gstPercentages[index],
                basic_amount: basicAmounts[index],
                gst_amount: gstAmounts[index],

            };
            return acc;
        }, {});


        // console.log(purchase_list,"ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

        const total_amount = {
            total_basic_amount: totalBasicAmount.toString(),
            total_basic_amount_gst: totalGst.toString(),
            grand_total: grandTotal.toString(),
            shipping_charges: shippingCharges.toString(),
            freight_charges: freightCharges.toString()
        }
        const requestBody = {
            client_id: client_id || getclientId,
            inv_id: inv_id,
            ...formData,           
            purchase_list,
            //total_amount,
            total_amount
        };
        console.log(requestBody);
        //     if(draftinvoice){
        //         console.log("ommmmmmmmmmmm");
        //     }
        //     else {
        //  if (selectbtn === 'SAVEANDSEND') {
        //         const response = await dispatch(invoiceedit(requestBody));
        //         if (response.payload?.statusCode === 200) {
        //             setTimeout(() => {
        //                navigate(-1)
        //             }, 2000);
        //         }
        //     }
        //     }

        if (draftinvoice) {
            console.log("ommmmmmmmmmmm");
            // Call the API for draftinvoice here
            const draftResponse = await dispatch(draftinvoiceedit(requestBody));
            if (draftResponse.payload?.statusCode === 200) {
                // Handle success if needed
                console.log("Draft invoice API call was successful");
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            } else {
                // Handle failure if needed
                console.log("Draft invoice API call failed");
            }
        } else {
            if (selectbtn === 'SAVEANDSEND') {
                // console.log("ommmmmmmmmmmm SAVEANDSEND");
                const updatedRequestBody = {
                    ...requestBody,
                    updatestatus: isStatus,
                  };
                const response = await dispatch(invoiceedit(updatedRequestBody));
                if (response.payload?.statusCode === 200) {
                    setTimeout(() => {
                        navigate(-1)
                    }, 2000);
                }
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
                            <span> Edit Invoice</span>
                        </h6>
                    </div>

                    <h5 className="inner-tag my-2"> {invoiceform?.KindAttn}</h5>
                    <div className="content-sec">
                        <Row>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{invoiceform?.CompanyName}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="kcompanyName"
                                        value={form.kcompanyName}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {invoiceform?.GSTNo}   <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0"> {invoiceform?.PanNo}  <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0">{invoiceform?.ContactDetails}  <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0"> {invoiceform?.PhoneNo} <span className="text-danger">*</span></Form.Label>
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
                    <h5 className="inner-tag my-2"> {invoiceform?.ShipTo}</h5>
                    <div className="content-sec">
                        <Row>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {invoiceform?.CompanyName} <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0"> {invoiceform?.GSTNo}  <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0">{invoiceform?.PanNo}  <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0">{invoiceform?.ContactDetails}   <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0">{invoiceform?.PhoneNo}  <span className="text-danger">*</span></Form.Label>
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
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{invoiceform?.StateCode}  <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sstateCode"
                                        value={form.sstateCode}
                                        pattern="[0-9]*[\s\-()/]*"
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0"> {invoiceform?.StateName} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="sstateName"
                                        value={form.sstateName}
                                        placeholder=""
                                        required
                                        onChange={onUpdateField}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {/* <h5 className="inner-tag my-2"> {invoiceform?.ShipTo}</h5> */}
                    <div class="content-sec">

                        <div className="wrap1">
                            <h5 className="inner-tag my-2"> {invoiceform?.PrimaryDocumentDetails}</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.TransactionName} <span className="text-danger">*</span></Form.Label>
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
                                                <option value="NotDispatched">Not Dispatched</option>
                                                <option value="InTransit">In Transit</option>
                                                <option value="Received">Received</option>
                                                <option value="Delayed">Delayed</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.InvoiceDate}<span className="text-danger">*</span></Form.Label>

                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.AmendmentNo}</Form.Label>
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
                                            <Form.Label className="mb-0"> {invoiceform?.AmendmentDate} </Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate1} onChange={(date) => setStartdocDate1(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.QuoteReference} </Form.Label>
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
                                            <Form.Label className="mb-0">{invoiceform?.QuoteDate} </Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate2} onChange={(date) => setStartdocDate2(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{invoiceform?.BuyerCode} </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="buyerCode"
                                                value={form.buyerCode?.replace(/[^a-zA-Z0-9]/g, "")}
                                                placeholder=""
                                                readOnly
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.Currency} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="currency"
                                                value={form.currency?.replace(/[^a-zA-Z0-9]/g, "")}
                                                placeholder=""
                                                required
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.PoNo} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="poNo"
                                                value={form.poNo?.replace(/[^a-zA-Z0-9]/g, "")}
                                                placeholder=""
                                                required
                                                readOnly
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.ClientPo} <span className="text-danger">*</span></Form.Label>

                                            <MultiSelect
                                                key="example_id"
                                                options={options}
                                                onChange={handleChange}
                                                value={optionSelected}
                                                isSelectAll={true}
                                                menuPlacement={"bottom"}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {invoiceform?.RequestLine}<span className="text-danger">*</span></Form.Label>
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
                            </div>
                            <div className="d-flex justify-content-end align-center d-flex-mobile-align">
                                <div className="position-relative">
                                    <InputGroup
                                        className="mb-0 search-add search-add-align"
                                        ref={searchComponentRef}
                                    >
                                        <Form.Control
                                            placeholder="Search components and Bom"
                                            aria-label="Search components and Bom"
                                            aria-describedby="basic-addon2"
                                            type="search"
                                            value={searchTermvalue.trimStart()}
                                            onChange={handleSearchComponent}
                                            onKeyDown={handleKeyPress}
                                        />
                                        <Button
                                            variant="secondary"
                                            id="button-addon2"
                                            disabled={!searchTerm.trim() || isAddButtonDisabled}
                                            onClick={addItem}
                                        >
                                            {invoiceform?.Add}

                                        </Button>
                                    </InputGroup>
                                    <ul className="position-absolute searchul" hidden={searchTermvalue.trim().length == 0 ? true : false}>
                                        {filteredData ? (
                                            filteredData?.map((item, index) => (
                                                <li key={index} onClick={() => handleItemClick(item)}>
                                                    {item[0].slice(1).join(" , ")}
                                                </li>
                                            ))
                                        ) : (
                                            <>
                                                <li>
                                                    <div>
                                                        <Spinner
                                                            animation="border"
                                                            role="status"
                                                            variant="dark"
                                                        >
                                                            <span className="visually-hidden">
                                                                Loading...
                                                            </span>
                                                        </Spinner>
                                                    </div>
                                                </li>
                                            </>
                                        )}
                                    </ul>

                                </div>
                            </div>

                            <h5 className="inner-tag">{invoiceform?.Addingproductstopurchaselist}</h5>
                            <div className="wrap2 forecasttablealign">
                                <div className="table-responsive mt-4">

                                    <Table className="bg-header">
                                        <thead>
                                            <tr>
                                                <th>{invoiceform?.SNo}</th>
                                                <th>{invoiceform?.ItemNo}</th>
                                                <th>{invoiceform?.Rev}</th>
                                                <th>{invoiceform?.desc}</th>
                                                <th>{invoiceform?.DeliveryDate}</th>
                                                <th>{invoiceform?.Qty}</th>
                                                <th>{invoiceform?.Unit}</th>
                                                <th>{invoiceform?.Rate}</th>
                                                <th>{tableContent?.GST}</th>
                                                <th>{invoiceform?.BasicAmount}</th>
                                                <th>{invoiceform?.GST}</th>
                                                <th>{invoiceform?.Actions}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedData?.length > 0 ? (
                                                selectedData?.map((product, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {isNewlyAdded(product) ? (
                                                                <span>
                                                                    {product.bom_name || product.mfr_prt_num}
                                                                </span>
                                                            ) : (
                                                                product.item_no || product.cmpt_id || product.bom_name
                                                            )}
                                                        </td>
                                                        <td> <input
                                                            type="text"
                                                            value={product?.rev || revValues[index]}
                                                            required
                                                            onChange={(e) =>
                                                                handleRevChange(e.target.value, index)
                                                            }
                                                            disabled={product.isFetched}
                                                        /></td>
                                                        <td><input
                                                            type="text"
                                                            value={product?.description || desc[index]}
                                                            onChange={(e) => handleDescChange(e.target.value, index)}
                                                            disabled={product.isFetched}
                                                            required

                                                        /></td>
                                                        <td>    <DatePicker
                                                            selected={deliveryDateValues[index]}
                                                            onChange={(date) =>
                                                                handleDeliveryDateChange(date, index)
                                                            }
                                                            dateFormat="dd/MM/yyyy"
                                                            required
                                                            disabled={product.isFetched}
                                                        /></td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="input-50"
                                                                min={1}
                                                                value={quantityValues[index]}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(
                                                                        /[^0-9]/g,
                                                                        ""
                                                                    );
                                                                }}
                                                                onChange={(e) =>
                                                                    handleQtyChange(
                                                                        e.target.value,
                                                                        index
                                                                    )
                                                                }
                                                                required
                                                                disabled={product.isFetched}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={product?.unit || unitValues[index]}
                                                                onChange={(e) =>
                                                                    handleUnitChange(e.target.value, index)
                                                                }
                                                                required
                                                                disabled={product.isFetched}
                                                            />
                                                        </td>

                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={rateValues[index]}
                                                                onChange={(e) => handleRateChange(e.target.value, index)}
                                                                required
                                                                disabled={product.isFetched}
                                                            />
                                                        </td>
                                                        <td>  <input
                                                            type="number"
                                                            value={gstPercentages[index]}
                                                            onChange={(e) => handleGstChange(e.target.value, index)}
                                                            required
                                                            disabled={product.isFetched}
                                                        /></td>
                                                        <td><input type="text"
                                                            value={product?.basic_amount || basicAmounts[index]}
                                                            disabled={product.isFetched}
                                                        /></td>

                                                        <td><input
                                                            type="text"
                                                            value={product?.total_gst || totalsWithGst[index]}
                                                            disabled={product.isFetched}

                                                        /></td>
                                                        <td>
                                                            {product.isFetched ? (
                                                                <span><img src={Delete} alt="Delete Icon" style={{ opacity: 0.5 }} /></span>
                                                            ) : (
                                                                <span role='button' onClick={() => openDeleteModal(index, product.department)}><img src={Delete} alt="Delete Icon" /></span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <>
                                                    <tr>
                                                        <td colSpan="12" className="text-center">
                                                            {tableContent?.nodata}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>


                            <div className="wrap3 mt-3">
                                <div className="content-sec1">
                                    {/* <div>Total Quantity Per Board: {totalQtyPerBoard}</div> */}
                                    <h6 className="inner-tag my-2">{invoiceform?.TotalAmount}</h6>
                                    {/* <p>Total( Basic )     : {totalUnitPrice}</p> */}
                                    <p>{invoiceform?.TotalBasic}  : {totalBasicAmount}</p>
                                    <p>{invoiceform?.TotalGST} : {totalGst}</p>
                                    <p>{invoiceform?.ShippingCharges} : <input type="text" value={shippingCharges} onChange={handleShippingChargesChange} /></p>
                                    <p>{invoiceform?.FreightCharges} : <input type="text" value={freightCharges} onChange={handleFreightCharges} /></p>
                                    <p>{invoiceform?.GrandTotal} : {grandTotal}</p>
                                    <p>{invoiceform?.AmountInWords}  : {grandTotalInWords}</p>
                                </div>
                            </div>
                            <div className="wrap4">
                                <h5 className="inner-tag my-2">{invoiceform?.SecondaryDocumentDetails}</h5>
                                <div className="content-sec">
                                    <Row>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{invoiceform?.PreparedBy} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="preparedBy"
                                                    value={form.preparedBy}
                                                    placeholder=""
                                                    required
                                                    readOnly
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{invoiceform?.CheckedBy} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="checkedBy"
                                                    value={form.checkedBy}
                                                    placeholder=""
                                                    required
                                                    readOnly
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{invoiceform?.AuthorizedSignatory} <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="authorizedSignatory"
                                                    value={form.authorizedSignatory}
                                                    placeholder=""
                                                    required
                                                    readOnly
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={12} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">{invoiceform?.Note} </Form.Label>
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
                                                <Form.Label className="mb-0"> {invoiceform?.terms} </Form.Label>
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
                            {/* //omm */}
                        </div>

                        <div className="d-flex justify-content-end mt-2">
                            <Button type="submit" onClick={() => {
                                navigate(-1);
                            }} className="cancel">CANCEL</Button>
                            <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={(e) => setSelectbtn('SAVEANDSEND')} >UPDATE & SUBMIT</Button>
                        </div>
                    </div>


                </form>
            </div>
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Body>
                    Are you sure you want to delete the selected item?
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                    <div className="mt-3 d-flex justify-content-center">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={handleCloseDeleteModal} >
                            No
                        </Button>
                        <Button type="submit" className="submit" onClick={confirmDelete}>
                            Yes
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
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
export default EditInvoice;