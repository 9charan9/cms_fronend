import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { selectActiveclientpos, selectLoadingState, getActiveClientPos, selectEditPoform, editPoForm, updateAndSend, SelectUpDateAndSend, } from '../slice/ForecastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from "react-bootstrap"
import { toast } from "react-toastify";
import numberToWords from 'number-to-words';
import Delete from "../../../assets/Images/Delete.svg";
import { ToastContainer, Zoom } from 'react-toastify';
import Modal from "react-bootstrap/Modal"
import moment from 'moment';
import { createdpoform, tableContent } from '../../../utils/TableContent';
import MultiSelect from '../../../components/MultiSelect';
import { useRef } from "react";


import {
    serachComponentinPO,
    selectSearchComponentData,
    addComponentinpo,
} from '../../purchaseorders/slice/PurchaseOrderSlice';


const EditForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { poid, vendorid } = location.state || {};
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermvalue, setSearchTermvalue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const isLoading = useSelector(selectLoadingState)
    const editPodata = useSelector(selectEditPoform)
    // const EditpoData = editPodata?.body
    // console.log(EditpoData)
    const searchedData = useSelector(selectSearchComponentData);
    const data = searchedData?.body;
    // console.log(poid,"omm poid")
    const searchComponentRef = useRef(null);
    // const update = useSelector(SelectUpDateAndSend)
    const activeclients = useSelector(selectActiveclientpos)
    const vendorSelection = activeclients?.body || [];
    const [selectedData, setSelectedProducts] = useState([]);
    const [totalQtyPerBoard, setTotalQtyPerBoard] = useState(0);
    const [unitValues, setUnitValues] = useState([]);
    const [totalUnitPrice, setTotalUnitPrice] = useState(0);
    const [calculatedPrices, setCalculatedPrices] = useState([]);
    const [selectbtn, setSelectbtn] = useState("");
    const [revValues, setRevValues] = useState([]);
    const [deliveryDateValues, setDeliveryDateValues] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [totalObjValue, setTotal] = useState({})
    const [optionSelected, setSelected] = useState(null); // clientpo dpdwn
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [startdocDate1, setStartdocDate1] = useState(new Date());
    const [startdocDate2, setStartdocDate2] = useState(new Date());
    // modal delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRowIndex, setDeleteRowIndex] = useState(null);
    const [deleteDepartment, setDeleteDepartment] = useState(null);
    const [options, setOptions] = useState([]);
    //validations
    const [quantityValues, setQuantityValues] = useState([]);
    const [rateValues, setRateValues] = useState([]);
    const [basicAmounts, setBasicAmounts] = useState([]);
    const [gstPercentages, setGstPercentages] = useState([]);
    const [gstAmounts, setGstAmounts] = useState([]);
    const [totalsWithGst, setTotalsWithGst] = useState([]);
    // Cumulative totals
    const [totalBasicAmount, setTotalBasicAmount] = useState(0);
    const [totalGst, setTotalGst] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [grandTotalInWords, setGrandTotalInWords] = useState('');
    const [shippingCharges, setShippingCharges] = useState("");

    const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion"];

    const numberToWords = (num) => {
        if (num === 0) return "zero";

        let words = '';

        // Helper function to convert a three-digit number to words
        const threeDigitsToWords = (n) => {
            let str = '';
            if (n > 99) {
                str += units[Math.floor(n / 100)] + ' hundred ';
                n %= 100;
            }
            if (n > 10 && n < 20) {
                str += teens[n - 10] + ' ';
            } else {
                str += tens[Math.floor(n / 10)] + ' ';
                n %= 10;
                str += units[n] + ' ';
            }
            return str.trim();
        };

        let i = 0;
        while (num > 0) {
            let part = num % 1000;
            if (part > 0) {
                words = threeDigitsToWords(part) + ' ' + thousands[i] + ' ' + words;
            }
            num = Math.floor(num / 1000);
            i++;
        }

        return words.trim();
    };

    const amountToWords = (amount) => {
        const [rupees, paise] = amount.toFixed(2).split('.').map(Number);
        let words = numberToWords(rupees) + ' rupees';
        if (paise > 0) {
            words += ' and ' + numberToWords(paise) + ' paise';
        }
        words += ' only';
        return words;
    };

    useEffect(() => {
        if (selectedData) {
            const initialQuantities = selectedData.map(product => product.qty || 0);
            const initialRates = selectedData.map(product => product.rate || product.price || 0);
            const initialBasicAmounts = initialQuantities.map((qty, index) => qty * initialRates[index]);
            const initialGstPercentages = selectedData.map(product => product.gst || 0);
            const initialGstAmounts = initialBasicAmounts.map((amount, index) => (amount * initialGstPercentages[index]) / 100);
            const initialTotalsWithGst = initialBasicAmounts.map((amount, index) => amount + initialGstAmounts[index]);
            console.log(initialGstPercentages);
            console.log(initialGstAmounts);
            console.log(initialTotalsWithGst);
            setQuantityValues(initialQuantities);
            setRateValues(initialRates);
            setBasicAmounts(initialBasicAmounts);
            setGstPercentages(initialGstPercentages);
            setGstAmounts(initialGstAmounts);
            setTotalsWithGst(initialGstAmounts);
        }
    }, [selectedData]);

    useEffect(() => {
        // const totalBasic = basicAmounts.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        // setTotalBasicAmount(totalBasic.toFixed(2));
        // const totalGstAmount = totalsWithGst.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        // const grandTotalAmount = totalsWithGst.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        // console.log(totalGstAmount);
        // setTotalGst(totalGstAmount.toFixed(2));

        // setGrandTotal((parseFloat(basicAmounts) + parseFloat(grandTotalAmount) + parseFloat(shippingCharges || 0)).toFixed(2));
        // const newGrandTotal = (parseFloat(basicAmounts) + parseFloat(grandTotalAmount) + parseFloat(shippingCharges || 0)).toFixed(2);
        // console.log(shippingCharges);
        // console.log(newGrandTotal);
        // setGrandTotalInWords(numberToWords.toWords(newGrandTotal));
        // Calculate total basic amount
        const totalBasic = basicAmounts.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        setTotalBasicAmount(totalBasic.toFixed(2));

        // Calculate total GST amount
        const totalGstAmount = totalsWithGst.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        setTotalGst(totalGstAmount.toFixed(2));

        // Calculate grand total amount
        const grandTotalAmount = totalsWithGst.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);
        const shipping = parseFloat(shippingCharges || 0);

        // Ensure basicAmounts is handled correctly
        const totalBasicParsed = basicAmounts.reduce((acc, amount) => acc + parseFloat(amount || 0), 0);

        // Calculate the new grand total
        const newGrandTotal = totalBasicParsed + grandTotalAmount + shipping;
        setGrandTotal(newGrandTotal.toFixed(2));

        // Convert the grand total to words
        const grandTotalInWords = amountToWords(parseFloat(newGrandTotal));
        setGrandTotalInWords(grandTotalInWords);
    }, [basicAmounts, totalsWithGst, shippingCharges]);



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

    const handleGstChange = (value, index) => {
        const newGstPercentages = [...gstPercentages];
        newGstPercentages[index] = value;
        setGstPercentages(newGstPercentages);

        const newGstAmounts = basicAmounts.map((amount, i) => (amount * newGstPercentages[i]) / 100);
        setGstAmounts(newGstAmounts);

        const newTotalsWithGst = basicAmounts.map((amount, i) => amount + newGstAmounts[i]);
        setTotalsWithGst(newGstAmounts);
    };

    const handleSelectChange = async (value) => {
        setSelectedOption(value);
    };


    useEffect(() => {
        if (vendorSelection?.length) {
            let opts = vendorSelection.map((obj) => {
                return { value: obj.client_po, label: obj.client_po }
            });

            setOptions(opts);
        }
    }, [vendorSelection]);


    const handleChange = (selected) => {
        setSelected(selected);
    };


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
        termsandConditions: "",
        requestLine: "",
        transactionName: "",
        status: "",
        poDate: "",
        amendmentNo: "",
        deliveryDateinWeeks: "",
        amendmentDate: "",
        quoteReference: "",
        quoteDate: "",
        buyerCode: "",
        currency: "",
        clientPo: "",
        preparedBy: "",
        checkedBy: "",
        authorizedSignatory: "",
        note: "",
        tConditions: "",
        pitemNo: "",
        prev: "",
        pDescription: "",
        pdeliverydate: "",
        pquantity: "",
        punit: "",
        prate: "",
        pgst: "",

    })
    useEffect(() => {
        if (poid && vendorid) {
            const request = {
                "po_id": poid,
                "vendor_id": vendorid

            }
            dispatch(editPoForm(request))
        }
    }, [poid, vendorid])

    useEffect(() => {
        dispatch(getActiveClientPos());
    }, []);

    const kindHandle = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trimStart(); // Trim leading spaces    
        setForm({ ...form, [name]: trimmedValue });
    }


    useEffect(() => {

        if (editPodata?.body) {
            const EditpoData = editPodata?.body;

            const quoteDate = EditpoData?.primary_document_details?.quote_date;
            const amendmentdate = EditpoData?.primary_document_details?.amendment_date;
            const po_date = EditpoData?.primary_document_details?.po_date;
            if (quoteDate) {
                const parsedQuoteDate = new Date(quoteDate);
                if (!isNaN(parsedQuoteDate)) { // Check if the date is valid
                    setStartdocDate2(parsedQuoteDate);
                } else {
                    console.error('Invalid quote date:', quoteDate);
                }
            }
            if (amendmentdate) {
                const parsedamendmentdate = new Date(amendmentdate);
                if (!isNaN(parsedamendmentdate)) { // Check if the date is valid
                    setStartdocDate1(parsedamendmentdate);
                } else {
                    console.error('Invalid quote date:', amendmentdate);
                }
            }
            if (po_date) {
                const parsedpo_date = new Date(po_date);
                if (!isNaN(parsedpo_date)) { // Check if the date is valid
                    setStartdocDate(parsedpo_date);
                } else {
                    console.error('Invalid quote date:', parsedpo_date);
                }
            }
            setSelectedOption(EditpoData?.primary_document_details?.status);
            setForm({
                kcompanyName: EditpoData?.kind_attn?.company_name,
                kgstNo: EditpoData?.kind_attn?.gst_no,
                kpanNo: EditpoData?.kind_attn?.pan_no,
                kcontactDetails: EditpoData?.kind_attn?.contact_details,
                kphoneNo: EditpoData?.kind_attn?.phone_number,
                kAddress: EditpoData?.kind_attn?.address,
                scompanyName: EditpoData?.ship_to?.company_name,
                sgstNo: EditpoData?.ship_to?.gst_no,
                spanNo: EditpoData?.ship_to?.pan_no,
                scontactDetails: EditpoData?.ship_to?.contact_details,
                sphoneNo: EditpoData?.kind_attn?.phone_number,
                sAddress: EditpoData?.kind_attn?.address,
                termsandConditions: EditpoData?.po_terms_conditions,
                requestLine: EditpoData?.req_line,
                transactionName: EditpoData?.primary_document_details?.transaction_name,
                amendmentNo: EditpoData?.primary_document_details?.amendment_no,
                deliveryDateinWeeks: EditpoData?.primary_document_details?.delivery_dely_in_weeks,
                quoteReference: EditpoData?.primary_document_details?.quote_reference,
                buyerCode: EditpoData?.primary_document_details?.buyer_code,
                currency: EditpoData?.primary_document_details?.currency,
                delivery_dely_in_weeks: EditpoData?.primary_document_details?.delivery_dely_in_weeks,
                preparedBy: EditpoData?.secondary_doc_details?.prepared_by,
                checkedBy: EditpoData?.secondary_doc_details?.checked_by,
                authorizedSignatory: EditpoData?.secondary_doc_details?.authorized_signatory,
                note: EditpoData?.secondary_doc_details?.note,
                tConditions: EditpoData?.secondary_doc_details?.terms_conditions,
            });
            const cpo = EditpoData?.primary_document_details?.client_po;
            // console.log(cpo, "omcpo");
            let opts = [];
            opts = cpo.map((obj) => {
                return { value: obj.create_po, label: obj.create_po }
            });
            // console.log('Options:', opts);
            setSelected([...opts]);
            setTotalBasicAmount(EditpoData?.total_amount?.total_basic_amount)
            setTotalGst(EditpoData?.total_amount?.total_basic_amount_gst)
            setGrandTotal(EditpoData?.total_amount?.grand_total)
            setShippingCharges(EditpoData?.total_amount?.shipping_charges)
            console.log(EditpoData?.total_amount?.total_basic_amount_gst, "ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
            const deliveryDates = EditpoData?.purchase_list?.map(item => new Date(item.delivery_date)) || [];
            const purchaseList = EditpoData?.purchase_list?.map(item => ({
                ...item
            })) || [];

            setSelectedProducts(purchaseList);
            setDeliveryDateValues(deliveryDates);

        }
    }, [poid, vendorid, editPodata])


    //add parts
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
        dispatch(serachComponentinPO(request));
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
            component_id: searchTerm,
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
            const response = await dispatch(addComponentinpo(request));
            const newItem = response.payload?.body;
            // console.log(newItem, "newiTEM ")
            if (response.payload?.statusCode != 400) {
                if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id || item.item_no === newItem.item_no)) {
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
    const handleShippingChargesChange = (event) => {
        const value = event.target.value;
        // Ensure the value is a valid number with decimals allowed
        if (/^\d*\.?\d*$/.test(value)) {
            setShippingCharges(value);
        }
    };

    //ommm
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent the default action of the Enter key
        }
    };
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

    useEffect(() => {
        // Calculate totals on initial render
        let totalQty = 0;
        let totalPrice = 0;
        selectedData?.forEach((product) => {
            totalQty += Number(product.qty || 0);
            totalPrice += parseFloat(product.price || 0);
        });

        setTotalQtyPerBoard(totalQty);
        setTotalUnitPrice(totalPrice);
    }, [selectedData]);



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
    //close add parts ommmm

    const handleSubmit = async (e) => {
        e.preventDefault()

        let selectedPos = optionSelected?.map((obj) => {
            return { create_po: obj.value }
        })
        const formData = {
            kind_attn: {
                company_name: form.kcompanyName,
                gst_no: form.kgstNo?.toString(),
                pan_no: form.kpanNo?.toString(),
                contact_details: form.kcontactDetails?.toString(),
                phone_number: form.kphoneNo?.toString(),
                address: form.kAddress,
            },
            ship_to: {
                company_name: form.scompanyName,
                gst_no: form.sgstNo?.toString(),
                pan_no: form.spanNo?.toString(),
                contact_details: form.scontactDetails?.toString(),
                phone_number: form.sphoneNo?.toString(),
                address: form.sAddress,
            },
            po_terms_conditions: form.termsandConditions,
            req_line: form.requestLine,
            primary_document_details: {
                transaction_name: form.transactionName,
                status: selectedOption,
                po_date: moment(startdocDate).format('YYYY-MM-DD'),
                amendment_no: form.amendmentNo,
                delivery_dely_in_weeks: form.deliveryDateinWeeks,
                amendment_date: moment(startdocDate1).format('YYYY-MM-DD'),
                quote_reference: form.quoteReference,
                quote_date: moment(startdocDate2).format('YYYY-MM-DD'),
                buyer_code: form.buyerCode,
                currency: form.currency,
                client_po: selectedPos,
            },
            secondary_doc_details: {
                prepared_by: form.preparedBy,
                checked_by: form.checkedBy,
                authorized_signatory: form.authorizedSignatory,
                note: form.note,
                terms_conditions: form.tConditions
            },

        }
        const total_amount = {
            total_basic_amount: totalBasicAmount.toString(),
            total_basic_amount_gst: totalGst.toString(),
            grand_total: grandTotal.toString(),
            shipping_charges: shippingCharges.toString(),
            amount_in_words: grandTotalInWords.toString()
        }
        console.log(selectedData);

        if (!selectedData || selectedData.length === 0) {
            // Notify user about empty required fields
            toast.error("Please Add Components.");
            return;
        }

        const list = selectedData.map((product, index) => ({
            itemNo: product.mfr_prt_num || product.item_no,
            cmpt_id:product?.cmpt_id,
            ctgr_id:product?.ctgr_id,
            ctgr_name:product?.ctgr_name,
            department:product?.department,
            manufacturer:product?.manufacturer,
            prdt_name:product?.prdt_name,
            packaging:product?.packaging,
            rev: revValues[index] || product.rev,
            description: product.description,
            deliveryDate: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
            qty: quantityValues[index] || product.qty,
            unit: unitValues[index] || product.unit,
            rate: rateValues[index],
            gst: gstPercentages[index],
            basicAmount: basicAmounts[index],
            gstAmount: gstAmounts[index],
        }));
        console.log(list);

        const purchase_list = list.reduce((acc, product, index) => {
            const partKey = `part${index + 1}`;
            acc[partKey] = {
                item_no: product.itemNo,
                cmpt_id:product?.cmpt_id,
                ctgr_id:product?.ctgr_id,
                ctgr_name:product?.ctgr_name,
                department:product?.department,
                manufacturer:product?.manufacturer,
                prdt_name:product?.prdt_name,
                packaging:product?.packaging || "",
                rev: revValues[index] || product.rev,
                description: product.description,
                delivery_date: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
                qty: quantityValues[index] || product.qty,
                unit: unitValues[index] || product.unit,
                rate: rateValues[index],
                gst: gstPercentages[index],
                basic_amount: basicAmounts[index].toString(),
                gst_amount: gstAmounts[index].toString(),
            };
            return acc;
        }, {});
        const request = {
            vendor_id: vendorid,
            po_id: poid,
            ...formData,
            purchase_list,
            total_amount
        }
        console.log(request, "0ommm");

        const response = await dispatch(updateAndSend(request));
        if (response.payload?.statusCode === 200) {
            setTimeout(() => {
                navigate(-1)
            }, 2000);
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
                        <span>Edit Purchase Order</span>
                    </h6>
                </div>

                <h5 className="inner-tag my-2">Kind Attn</h5>
                <div>
                    <form onSubmit={handleSubmit}>

                        <div className="content-sec">
                            <Row>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Company Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder=""
                                            name="kcompanyName"
                                            value={form?.kcompanyName}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">GST No  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="kgstNo"
                                            placeholder=""
                                            value={form?.kgstNo}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Pan No  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="kpanNo"
                                            value={form?.kpanNo}
                                            placeholder=""
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Contact Details  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="kcontactDetails"
                                            placeholder=""
                                            value={form?.kcontactDetails}
                                            onChange={kindHandle}
                                            required

                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Phone No  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="kphoneNo"
                                            placeholder=""
                                            value={form?.kphoneNo}
                                            onChange={kindHandle}
                                            required

                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Address  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="kAddress"
                                            placeholder=""
                                            value={form?.kAddress}
                                            onChange={kindHandle}
                                            required

                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        <h5 className="inner-tag my-2">Ship To</h5>
                        <div className="content-sec">
                            <Row>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Company Name  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="scompanyName"
                                            placeholder=""
                                            value={form?.scompanyName}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">GST No  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="sgstNo"
                                            placeholder=""
                                            value={form?.sgstNo}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Pan No  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="spanNo"
                                            placeholder=""
                                            value={form?.spanNo}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Contact Details  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="scontactDetails"
                                            placeholder=""
                                            value={form?.scontactDetails}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Phone No  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="sphoneNo"
                                            placeholder=""
                                            value={form?.sphoneNo}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Address  <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="sAddress"
                                            placeholder=""
                                            value={form?.sAddress}
                                            onChange={kindHandle}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        <div className="content-sec">
                            <Row>

                                <Col xs={6} md={6} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Po Terms And Conditions <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="termsandConditions"
                                            placeholder=""
                                            value={form?.termsandConditions}
                                            onChange={kindHandle}
                                            className="supplierheight"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} md={6} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Request Line <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="requestLine"
                                            placeholder=""
                                            value={form?.requestLine}
                                            onChange={kindHandle}
                                            className="supplierheight"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        <div className="wrap1">
                            <h5 className="inner-tag my-2">Primary Document Details</h5>
                            <div className="content-sec">
                                <Row>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Transaction Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="transactionName"
                                                placeholder=""
                                                value={form?.transactionName}
                                                onChange={kindHandle}
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
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
                                            <Form.Label className="mb-0"> {createdpoform?.PODate}<span className="text-danger">*</span></Form.Label>

                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.AmendmentNo}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="amendmentNo"
                                                value={form?.amendmentNo}
                                                placeholder=""
                                                onChange={kindHandle}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Amendment Date </Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                name='amendmentDate'
                                                selected={startdocDate1} onChange={(date) => setStartdocDate1(date)}
                                                onFocus={(e) => e.target.readOnly = true}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Delivery Delay in Weeks</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="deliveryDateinWeeks"
                                                placeholder=""
                                                value={form?.deliveryDateinWeeks}
                                                onChange={kindHandle}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> Quote Reference </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="quoteReference"
                                                placeholder=""
                                                value={form?.quoteReference}
                                                onChange={kindHandle}

                                            />

                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Quote Date</Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                name='quoteDate'
                                                selected={startdocDate2} onChange={(date) => setStartdocDate2(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Buyer Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="buyerCode"
                                                placeholder=""
                                                value={form?.buyerCode}
                                                onChange={kindHandle}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Currency <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="currency"
                                                placeholder=""
                                                value={form?.currency}
                                                onChange={kindHandle}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> Client Po <span className="text-danger">*</span></Form.Label>

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

                                </Row>
                            </div>


                            <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                                <div className="position-relative">
                                    <InputGroup className="mb-0 search-add">
                                        <Form.Control
                                            placeholder="Search add items"
                                            aria-label="search add items"
                                            aria-describedby="basic-addon2"
                                            type="search"
                                            value={searchTerm}
                                            onChange={handleSearchComponent}
                                            onKeyDown={handleKeyPress}
                                        />
                                        <Button
                                            variant="secondary"
                                            id="button-addon2"
                                            disabled={!searchTerm.trim() || isAddButtonDisabled}
                                            onClick={addItem}
                                        >
                                            {createdpoform?.Add}

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

                            <h5 className="inner-tag">{createdpoform?.Addingproductstopurchaselist}</h5>
                            <div className="wrap2">
                                <div className="table-responsive mt-4">
                                    <Table className="bg-header">
                                        <thead>
                                            <tr>
                                                <th>{createdpoform?.SNo}</th>
                                                <th>{createdpoform?.ItemNo}</th>
                                                <th>{createdpoform?.Rev}</th>
                                                <th>{createdpoform?.desc}</th>
                                                <th>{createdpoform?.DeliveryDate}</th>
                                                <th>{createdpoform?.Qty}</th>
                                                <th>{createdpoform?.Unit}</th>
                                                <th>{createdpoform?.Rate}</th>
                                                <th>{createdpoform?.BasicAmount}</th>
                                                <th>{tableContent?.GST}</th>
                                                <th>{createdpoform?.GST}</th>
                                                <th>{createdpoform?.Actions}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedData?.length > 0 ? (
                                                selectedData?.map((product, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{product?.item_no || product?.mfr_prt_num}</td>
                                                        <td> <input
                                                            type="text"
                                                            value={product?.rev || revValues[index] || ""}
                                                            onChange={(e) =>
                                                                handleRevChange(e.target.value, index)
                                                            }
                                                            disabled={product.isFetched}
                                                        /></td>
                                                        <td>{product?.description}</td>
                                                        <td>
                                                            <DatePicker
                                                                selected={deliveryDateValues[index]}
                                                                onChange={(date) =>
                                                                    handleDeliveryDateChange(date, index)
                                                                }
                                                                dateFormat="dd/MM/yyyy"
                                                                required

                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="input-50"
                                                                value={quantityValues[index]}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(
                                                                        /[^0-9]/g,
                                                                        ""
                                                                    );
                                                                }}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                                                    handleQtyChange(value, index);
                                                                }}
                                                                required

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

                                                            />
                                                        </td>

                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={rateValues[index]}
                                                                onChange={(e) => handleRateChange(e.target.value, index)}
                                                                required

                                                            />
                                                        </td>

                                                        <td><input type="text" value={basicAmounts[index]} disabled /></td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={gstPercentages[index]}
                                                                onChange={(e) => handleGstChange(e.target.value, index)}
                                                                required

                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={totalsWithGst[index]}

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

                                    <h6 className="inner-tag my-2">{createdpoform?.TotalAmount}</h6>
                                    <p>{createdpoform?.TotalBasic}  : {totalBasicAmount}</p>
                                    <p>{createdpoform?.TotalGST} : {totalGst}</p>
                                    <p>{createdpoform?.ShippingCharges} : <input type="text" value={shippingCharges} onChange={handleShippingChargesChange} /></p>
                                    <p>{createdpoform?.GrandTotal} : {grandTotal}</p>
                                    <p>{createdpoform?.AmountInWords}  : {grandTotalInWords}</p>
                                </div>
                            </div>
                            <div className="wrap4 pb-3">
                                <h5 className="inner-tag my-2">Secondary Document Details</h5>
                                <div className="content-sec">
                                    <Row>
                                        <Col xs={12} md={4} className="mb-2">
                                            <Form.Group>
                                                <Form.Label className="mb-0">Prepared By <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="preparedBy"
                                                    placeholder=""
                                                    value={form?.preparedBy}
                                                    onChange={kindHandle}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={4} className="mb-2">
                                            <Form.Group>
                                                <Form.Label className="mb-0">Checked By <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="checkedBy"
                                                    placeholder=""
                                                    value={form?.checkedBy}
                                                    onChange={kindHandle}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={4} className="mb-2">
                                            <Form.Group>
                                                <Form.Label className="mb-0">Authorized Signatory<span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="authorizedSignatory"
                                                    placeholder=""
                                                    value={form?.authorizedSignatory}
                                                    onChange={kindHandle}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={12} className="mb-2">
                                            <Form.Group>
                                                <Form.Label className="mb-0">Note <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="note"
                                                    placeholder=""
                                                    value={form?.note}
                                                    onChange={kindHandle}
                                                    style={{ height: "100px" }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={12} className="mb-2">
                                            <Form.Group>
                                                <Form.Label className="mb-0">Terms & Conditions </Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="tConditions"
                                                    placeholder=""
                                                    value={form?.tConditions}
                                                    onChange={kindHandle}
                                                    style={{ height: "100px" }}

                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end mt-2">
                                        <Button type="button" className="cancel me-2" onClick={() => {navigate(-1)}}>CANCEL</Button>
                                        <Button type="submit" className="submitmobile submit">UPDATE & SUBMIT</Button>
                                    </div>
                                </div>

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
                {/* //ommmmmmmmmmmmmmmmmmmmm ommmm ommm */}


            </div>
        </>
    )
}
export default EditForm;

