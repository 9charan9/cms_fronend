import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import { toast } from "react-toastify";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Delete from "../../../assets/Images/Delete.svg";
import { useRef } from "react";
import { poGetVendordetails, getActiveClientPos, selectPogetVendordetails, selectActiveclientpos, saveCreatePo, selectLoadingState, draftCreatePo} from '../slice/ForecastSlice';
import { addComponentinpo, serachComponentinPO, selectSearchComponentData } from '../../purchaseorders/slice/PurchaseOrderSlice';
import numberToWords from 'number-to-words';
import MultiSelect from '../../../components/MultiSelect';
import moment from "moment/moment";
import { createdpoform, tableContent } from '../../../utils/TableContent';
const PoForm = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingState);
    // const { vendorId,vendorType } = location.state || {}; // Destructure and provide default
    const { vendorId,vendorType } = location.state || {}; // Destructure and provide default
    // console.log(vendorType, "Received vendorType ommmmmmmmmmm");
    const getvendordata = useSelector(selectPogetVendordetails); //vendors data
    const activeclients = useSelector(selectActiveclientpos);//active clients
    const vendorSelection = activeclients?.body || [];
    //console.log(vendorSelection,"ommmmmmmmmmmmmmm pooooooooooo");
    const [selectbtn, setSelectbtn] = useState("");
    const [options, setOptions] = useState([]);
    useEffect(() => {
        if (vendorSelection?.length) {
            let opts = vendorSelection.map((obj) => {
                return { value: obj.client_po, label: obj.client_po }
            });
            console.log(opts,"ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
            setOptions(opts);
        }
    }, [vendorSelection]);
    const [optionSelected, setSelected] = useState(null);

    //   useEffect(() => {
    //     setOptions(vendorSelection)
    //   }, [activeclients]);

    const handleChange = (selected) => {
        setSelected(selected);
    };
    //
    // console.log(getvendordata?.body?.kind_Attn?.company_name);
    const [startdocDate, setStartdocDate] = useState(new Date());
    const [startdocDate1, setStartdocDate1] = useState(new Date());
    const [startdocDate2, setStartdocDate2] = useState(new Date());
    // const [selectedInwardid, setSelectedInwardid] = useState(null);
    // const [isChecked, setIsChecked] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(''); //clentpo sate
    const [selectedOption, setSelectedOption] = useState("");
    const handleSelectChange = async (value) => {
        setSelectedOption(value);
    };
    const handleVendorChange = (event) => {
        setSelectedVendor(event.target.value);
    };
    //addd parts
    const [basicAmounts, setBasicAmounts] = useState([]); // basic amount
    const [gstAmounts, setGstAmounts] = useState([]);
    const [totalGst, setTotalGst] = useState(0);
    const [totalBasicAmount, setTotalBasicAmount] = useState(0);
    const [shippingCharges, setShippingCharges] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0); //grand total
    const [grandTotalInWords, setGrandTotalInWords] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermvalue, setSearchTermvalue] = useState("");
    const [selectedData, setSelectedProducts] = useState([]);
    const [totalQtyPerBoard, setTotalQtyPerBoard] = useState(0);
    const [totalUnitPrice, setTotalUnitPrice] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const searchedData = useSelector(selectSearchComponentData);
    const data = searchedData?.body;
    const searchComponentRef = useRef(null);
    const [calculatedPrices, setCalculatedPrices] = useState([]);
    // New state variables for rev, delivery date, and unit
    const [revValues, setRevValues] = useState([]);
    const [deliveryDateValues, setDeliveryDateValues] = useState([]);
    const [unitValues, setUnitValues] = useState([]);
    const [gstpercal, setgstpercal] = useState([]);

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

    const handleSearchComponent = (event) => {
        const searchTerm = event.target.value.trim();
        setSearchTerm(searchTerm);
        setSearchTermvalue(searchTerm);

        if (searchTerm.trim().length < 2) {
            setFilteredData([]);
            return;
        }
        const request = {
            department:vendorType,
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
                if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
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

    const [errorDisplayed, setErrorDisplayed] = useState(false);
    const handleQtyPerBoardChange = (newValue, rowIndex) => {
        if (newValue === "" || (!isNaN(newValue) && parseInt(newValue, 10) > 0)) {
            setErrorDisplayed(false);
            setSelectedProducts((prevSelectedData) => {
                const updatedSelectedData = [...prevSelectedData];
                updatedSelectedData[rowIndex] = {
                    ...updatedSelectedData[rowIndex],
                    qty: newValue,
                };
                const updatedBasicAmounts = [...basicAmounts];
                updatedBasicAmounts[rowIndex] = calculateBasicAmount(newValue, updatedSelectedData[rowIndex].price);
                setBasicAmounts(updatedBasicAmounts);

                const updatedGstAmounts = [...gstAmounts];
                updatedGstAmounts[rowIndex] = calculateGstAmount(updatedBasicAmounts[rowIndex], updatedSelectedData[rowIndex].gst);
                setGstAmounts(updatedGstAmounts);

                const updatedTotalQtyPerBoard = updatedBasicAmounts.reduce((total, amount, index) => {
                    const qty = parseInt(updatedSelectedData[index]?.qty, 10) || 0;
                    return total + qty;
                }, 0);
                const updatedTotalGst = updatedGstAmounts.reduce((total, gst) => total + parseFloat(gst), 0);
                const updatedTotalBasicAmount = updatedBasicAmounts.reduce((total, amount) => total + parseFloat(amount || 0), 0);
                setTotalQtyPerBoard(updatedTotalQtyPerBoard);
                setTotalGst(updatedTotalGst);
                setTotalBasicAmount(updatedTotalBasicAmount);
                return updatedSelectedData;
            });
        } else {
            if (!errorDisplayed) {
                toast.error("Qty per board must be a positive number");
                setErrorDisplayed(true);
            }
        }
    };

    const handlePriceChange = (newValue, rowIndex) => {
        if (newValue === "" || (!isNaN(newValue) && parseFloat(newValue) > 0)) {
            setErrorDisplayed(false);
            setSelectedProducts((prevSelectedData) => {
                const updatedSelectedData = [...prevSelectedData];
                updatedSelectedData[rowIndex] = {
                    ...updatedSelectedData[rowIndex],
                    price: newValue,
                };
                const updatedBasicAmounts = [...basicAmounts];
                updatedBasicAmounts[rowIndex] = calculateBasicAmount(updatedSelectedData[rowIndex].qty, newValue);
                setBasicAmounts(updatedBasicAmounts);

                const updatedGstAmounts = [...gstAmounts];
                updatedGstAmounts[rowIndex] = calculateGstAmount(updatedBasicAmounts[rowIndex], updatedSelectedData[rowIndex].gst);
                setGstAmounts(updatedGstAmounts);

                const updatedTotalUnitPrice = updatedBasicAmounts.reduce((total, amount, index) => {
                    const unitPrice = parseFloat(updatedSelectedData[index]?.price) || 0;
                    return total + unitPrice;
                }, 0);
                const updatedTotalGst = updatedGstAmounts.reduce((total, gst) => total + parseFloat(gst), 0);
                const updatedTotalBasicAmount = updatedBasicAmounts.reduce((total, amount) => total + parseFloat(amount || 0), 0);
                setTotalUnitPrice(updatedTotalUnitPrice);
                setTotalGst(updatedTotalGst);
                setTotalBasicAmount(updatedTotalBasicAmount);
                return updatedSelectedData;
            });
        } else {
            if (!errorDisplayed) {
                toast.error("Unit price must be a non-zero number");
                setErrorDisplayed(true);
            }
        }
    };

    const handleGstChange = (newValue, rowIndex) => {
        if (newValue === "" || (!isNaN(newValue) && parseFloat(newValue) >= 1)) {
            setErrorDisplayed(false);
            setSelectedProducts((prevSelectedData) => {
                const updatedSelectedData = [...prevSelectedData];
                updatedSelectedData[rowIndex] = {
                    ...updatedSelectedData[rowIndex],
                    gst: newValue,
                };

                const updatedGstAmounts = [...gstAmounts];
                updatedGstAmounts[rowIndex] = calculateGstAmount(basicAmounts[rowIndex], newValue);
                setGstAmounts(updatedGstAmounts);

                const updatedTotalGst = updatedGstAmounts.reduce((total, gst) => total + parseFloat(gst), 0);
                setTotalGst(updatedTotalGst);
                return updatedSelectedData;
            });
        } else {
            if (!errorDisplayed) {
                toast.error("GST must be a non-zero number");
                setErrorDisplayed(true);
            }
        }
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
            // const totalAmountWithGst = parsedBasicAmount + gstAmount;
            const totalAmountWithGst = gstAmount;
            setgstpercal(gstAmount)
            console.log(gstAmount, "om gstAmount");
            console.log(totalAmountWithGst,"om totalAmountWithGst");
            return totalAmountWithGst; // Return the amount including GST
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
    const handleShippingChargesChange = (event) => {
        const value = event.target.value;
        setShippingCharges(parseFloat(value) || 0);
    };

    // useEffect(() => {
    //     const newGrandTotal = totalGst + shippingCharges;
    //     setGrandTotal(newGrandTotal);
    //     setGrandTotalInWords(numberToWords.toWords(newGrandTotal));
    // }, [totalBasicAmount, totalGst, shippingCharges]);

    useEffect(() => {   
        const parsedBasicAmount = parseFloat(totalBasicAmount);     
        const parsedTotalGst = parseFloat(totalGst);
        const parsedShippingCharges = parseFloat(shippingCharges);
        if (!isNaN(parsedTotalGst) && isFinite(parsedTotalGst) && !isNaN(parsedBasicAmount) && isFinite(parsedBasicAmount) &&
            !isNaN(parsedShippingCharges) && isFinite(parsedShippingCharges)) {
            const newGrandTotal = parsedBasicAmount + parsedTotalGst + parsedShippingCharges;
            setGrandTotal(newGrandTotal);
            const grandTotalInWords = amountToWords(parseFloat(newGrandTotal));
            setGrandTotalInWords(grandTotalInWords); // Uncomment if needed
        } else {           
            console.error("Invalid totalGst or shippingCharges:", totalGst, shippingCharges);           
        }
    }, [totalBasicAmount, totalGst, shippingCharges]);
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
    //close add parts

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
        tConditions: ""


    });
    const onUpdateField = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trimStart(); // Trim leading spaces    
        setForm({ ...form, [name]: trimmedValue });
    };

    useEffect(() => {
        if (vendorId) {
            dispatch(poGetVendordetails({ vendor_id: vendorId }));
        }
    }, [vendorId, dispatch]);

    useEffect(() => {
        if (getvendordata?.body) {
            const vendorDetails = getvendordata?.body;
           // console.log(vendorDetails, "ommmmmmmmm");
            setForm({
                kcompanyName: vendorDetails?.kind_Attn?.company_name,
                kgstNo: vendorDetails?.kind_Attn?.gst_number,
                kpanNo: vendorDetails?.kind_Attn?.pan_number,
                kcontactDetails: vendorDetails?.kind_Attn?.contact_number,
                kphoneNo: vendorDetails?.kind_Attn?.contact_number,
                kAddress: vendorDetails?.kind_Attn?.address,
                scompanyName: vendorDetails?.ship_to?.company_name,
                sgstNo: vendorDetails?.ship_to?.gst_number,
                spanNo: vendorDetails?.ship_to?.pan_number,
                scontactDetails: vendorDetails?.ship_to?.contact_details,
                sphoneNo: vendorDetails?.ship_to?.contact_number,
                sAddress: vendorDetails?.ship_to?.address,
                requestLine: vendorDetails?.req_line,
            });
        }
    }, [getvendordata, vendorId]);

    useEffect(() => {
        dispatch(getActiveClientPos());
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let selectedPos= optionSelected.map((obj)=>{
            return {create_po:obj.value}
        })

        const formData = {
            kind_attn:{
                company_name: form.kcompanyName,
                gst_no: form.kgstNo.toString(),
                pan_no: form.kpanNo.toString(),
                contact_details: form.kcontactDetails.toString(),
                phone_number: form.kphoneNo.toString(),
                address: form.kAddress,
            },
            ship_to:{
            company_name: form.scompanyName,
            gst_no: form.sgstNo.toString(),
            pan_no: form.spanNo.toString(),
            contact_details: form.scontactDetails.toString(),
            phone_number: form.sphoneNo.toString(),
            address: form.sAddress,
            },           
            po_terms_conditions: form.termsandConditions,
            req_line: form.requestLine,
            primary_document_details:{
                transaction_name: form.transactionName,
                status: selectedOption,
                po_date:  moment(startdocDate).format('YYYY-MM-DD'),
                amendment_no: form.amendmentNo,
                delivery_dely_in_weeks:form.deliveryDateinWeeks,
                amendment_date: moment(startdocDate1).format('YYYY-MM-DD'),
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
        //     gstAmount: gstAmounts[index],
        // }));
        console.log(selectedData,"ommmm");
        
        const list = selectedData.map((product, index) => ({
            itemNo: product.mfr_prt_num,
            cmpt_id:product?.cmpt_id,
            ctgr_id:product?.ctgr_id,
            ctgr_name:product?.ctgr_name,
            department:product?.department,
            manufacturer:product?.manufacturer,
            prdt_name:product?.prdt_name,
            packaging:product?.packaging,
            rev: revValues[index],
            description: product.description,
            deliveryDate: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
            qty: product.qty,
            unit: unitValues[index],
            rate: product.price,
            gst: product.gst,
            basicAmount: basicAmounts[index],
            gstAmount: gstAmounts[index],
        }));
        
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
                rev: revValues[index],
                description: product.description,
                delivery_date: moment(deliveryDateValues[index]).format('YYYY-MM-DD'),
                qty: product.qty,
                unit: unitValues[index],
                rate: product.rate,
                gst: product.gst,
                basic_amount: basicAmounts[index].toString(),
                gst_amount: gstAmounts[index].toString(),
            };
            return acc;
        }, {});
        
       // console.log(purchase_list,"ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

        const total_amount = {
            total_basic_amount:totalBasicAmount.toString(),
            total_basic_amount_gst:totalGst.toString(),
            grand_total:grandTotal.toString(),
            shipping_charges:shippingCharges.toString(),
            amount_in_words:grandTotalInWords.toString()
        }
        const requestBody = {
            vendor_id:vendorId,
            ...formData,
            purchase_list,           
            total_amount             
        };

       // console.log(requestBody);
        if (selectbtn === 'SAVEANDSEND') {
            const response = await dispatch(saveCreatePo(requestBody));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
        } else if (selectbtn === 'SAVEDRAFT') { // Change to else if
            const response = await dispatch(draftCreatePo(requestBody));
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
                            <span> {createdpoform?.cpo}</span>
                        </h6>
                    </div>

                    <h5 className="inner-tag my-2"> {createdpoform?.KindAttn}</h5>
                    <div className="content-sec">
                        <Row>
                            <Col xs={6} md={4} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="mb-0">{createdpoform?.CompanyName}  <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="mb-0">{createdpoform?.poTerms} <span className="text-danger">*</span></Form.Label>
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
                        <div className="wrap1">
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
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.AmendmentNo}<span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="amendmentNo"
                                                value={form.amendmentNo}
                                                placeholder=""
                                                required
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {selectedOption === "Delayed" && (
                                        <Col xs={12} md={4} className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="mb-0">Delivery Delay in Weeks</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="deliveryDateinWeeks"
                                                    value={form.deliveryDateinWeeks?.replace(/[^a-zA-Z0-9]/g, "")}
                                                    placeholder=""
                                                    onChange={onUpdateField}
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}

                                    {/* <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Delivery Delay in Weeks </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="deliveryDateinWeeks"
                                                value={form.deliveryDateinWeeks?.replace(/[^a-zA-Z0-9]/g, "")}
                                                placeholder=""
                                                
                                                onChange={onUpdateField}
                                            />
                                        </Form.Group>
                                    </Col> */}

                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.AmendmentDate} <span className="text-danger">*</span></Form.Label>
                                            <DatePicker className="form-control"
                                                placeholder="YYYY-MM-DD"
                                                selected={startdocDate1} onChange={(date) => setStartdocDate1(date)}
                                                onFocus={(e) => e.target.readOnly = true}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0"> {createdpoform?.QuoteReference} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="quoteReference"
                                                placeholder=""
                                                required
                                                value={form.quoteReference}
                                                onChange={onUpdateField}
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
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="mb-0">{createdpoform?.BuyerCode} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="buyerCode"
                                                value={form.buyerCode}
                                                // value={form.buyerCode?.replace(/[^a-zA-Z0-9]/g, "")}
                                                placeholder=""
                                                required
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
                                                value={form.currency?.replace(/[^a-zA-Z0-9]/g, "")}
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
                                            <Form.Label className="mb-0"> {createdpoform?.ClientPo} <span className="text-danger">*</span></Form.Label>

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

                            <div className="d-flex justify-content-end align-center d-flex-mobile-align">
                                <div className="position-relative">
                                    <InputGroup
                                        className="mb-0 search-add search-add-align"
                                        ref={searchComponentRef}
                                    >
                                        <Form.Control
                                            placeholder="Search components"
                                            aria-label="Search components"
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
                            <div className="wrap2 forecasttablealign">
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
                                                {/* <th>GST</th>                                                  */}
                                                <th>{createdpoform?.GST}</th>
                                                <th>{createdpoform?.Actions}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedData?.length > 0 ? (
                                                selectedData?.map((product, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{product?.mfr_prt_num}</td>
                                                        <td> <input
                                                            type="text"
                                                            value={revValues[index] || ""}
                                                            required
                                                            onChange={(e) =>
                                                                handleRevChange(e.target.value, index)
                                                            }
                                                        /></td>
                                                        <td>{product?.description}</td>
                                                        <td>    <DatePicker
                                                            selected={deliveryDateValues[index]}
                                                            onChange={(date) =>
                                                                handleDeliveryDateChange(date, index)
                                                            }
                                                            dateFormat="dd/MM/yyyy"
                                                            required
                                                        /></td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="input-50"
                                                                min={1}
                                                                value={product.qty}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(
                                                                        /[^0-9]/g,
                                                                        ""
                                                                    );
                                                                }}
                                                                onChange={(e) =>
                                                                    handleQtyPerBoardChange(
                                                                        e.target.value,
                                                                        index
                                                                    )
                                                                }
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={unitValues[index] || ""}
                                                                onChange={(e) =>
                                                                    handleUnitChange(e.target.value, index)
                                                                }
                                                                required
                                                            />
                                                        </td>

                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={product.price}
                                                                onChange={(e) => handlePriceChange(e.target.value, index)}
                                                                required
                                                            />
                                                        </td>
                                                        <td><input type="text" value={basicAmounts[index]} disabled /></td>

                                                        <td>  
                                                            <input
                                                            type="number"
                                                            value={product.gst}
                                                            onChange={(e) => handleGstChange(e.target.value, index)}
                                                            required
                                                        /></td>

                                                         {/* <td>  
                                                            <input
                                                            type="text"
                                                            value={gstpercal[index] || ""}
                                                            required
                                                        /></td> */}
                                                        
                                                        <td><input
                                                            type="text"
                                                            value={gstAmounts[index] || ""}
                                                            readOnly
                                                        /></td>
                                                        <td onClick={() => openDeleteModal(index, product.department)}>
                                                            <img src={Delete} alt="Delete Icon" />
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
                                    <h6 className="inner-tag my-2">{createdpoform?.TotalAmount}</h6>
                                    {/* <p>Total( Basic )     : {totalUnitPrice}</p> */}
                                    <p>{createdpoform?.TotalBasic}  : {totalBasicAmount}</p>
                                    <p>Total With GST : {totalGst}</p>
                                    <p>{createdpoform?.ShippingCharges} : <input type="text" onChange={handleShippingChargesChange} /></p>
                                    <p>{createdpoform?.GrandTotal} : {grandTotal}</p>
                                    <p>{createdpoform?.AmountInWords}  : {grandTotalInWords}</p>
                                </div>
                            </div>
                            <div className="wrap4">
                                <h5 className="inner-tag my-2">{createdpoform?.SecondaryDocumentDetails}</h5>
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
                                                <Form.Label className="mb-0"> {createdpoform?.terms} </Form.Label>
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
                                    <Button type="submit" onClick={(e) => setSelectbtn('SAVEDRAFT')} className="cancel" >{createdpoform?.SaveAsDraft}</Button>
                                    <Button type="submit" className="ms-3 submitmobile submit me-3" onClick={(e) => setSelectbtn('SAVEANDSEND')} >{createdpoform?.Create}</Button>
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

            {/* //ommmmmmmmmm */}
        </>
    );
};
export default PoForm;