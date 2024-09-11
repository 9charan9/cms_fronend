import React from 'react'
import { Button, Col, Row, Spinner, Tab, TabPane, Table, Tabs, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { formFieldsVendor, tableBOM, tableContent } from '../../../utils/TableContent';
import VendorRating from './VendorRating';
import arw from "../../../assets/Images/left-arw.svg";
import view from "../../../assets/Images/view.svg";
import pdf from "../../../assets/Images/pdf.svg";
import { getCategoryInfoDetails, selectCategoryInfoData, selectLoadingStatus, UpdatePartnersDoc } from '../slice/VendorSlice';
import { selectGetpartnersdoc, getPartnersDoc } from '../slice/VendorSlice';
import { useEffect, useState } from 'react';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import ProductionLineTab from './ProductionLineTab';
import queryString from "query-string";
import BoardsInfo from './BoardsInfo';
import BoxBuildingInfo from '../../bom/pages/BoxBuildingInfo';
import VendorBoxBuildingInfo from './VendorBoxBuildingInfo';
import Modal from 'react-bootstrap/Modal';

const OrdersInnerDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = queryString.parse(location.search);
    const [key, setKey] = useState(queryParams.tab || 'catinfo');

    const [activeTabName, setActiveTabName] = useState('');
    const { outward_id, partner_type } = location?.state;
    // console.log(partner_type, outward_id);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [showpn, setShowpn] = useState(false);
    //gate entry
    const [pdfFileName, setPdfFileName] = useState("");
    const [pdfPreview, setPdfPreview] = useState(null);
    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [fileNamespdf, setFileNamespdf] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    //qa entry
    const [pdfFileName1, setPdfFileName1] = useState("");
    const [pdfPreview1, setPdfPreview1] = useState(null);
    const [selectedFilesBase641, setSelectedFilesBase641] = useState([]);
    const [fileNames1, setFileNames1] = useState([]);
    const [fileNamespdf1, setFileNamespdf1] = useState([]);
    const [selectedFiles1, setSelectedFiles1] = useState([]);
    //inward entry
    const [pdfFileName2, setPdfFileName2] = useState("");
    const [pdfPreview2, setPdfPreview2] = useState(null);
    const [selectedFilesBase642, setSelectedFilesBase642] = useState([]);
    const [fileNames2, setFileNames2] = useState([]);
    const [fileNamespdf2, setFileNamespdf2] = useState([]);
    const [selectedFiles2, setSelectedFiles2] = useState([]);
    const [tabkey, setTabkey] = useState("");
    const isLoading = useSelector(selectLoadingStatus);
    const data = useSelector(selectCategoryInfoData);
    // const categoryinfoData = data?.body || {};
    const getdocs = useSelector(selectGetpartnersdoc);
    const getdocslist = getdocs?.body;
    console.log(getdocs);
    const [categoryinfoData, setcategoryinfoData] = useState({});

    useEffect(() => {
        if (data?.body) {
            setcategoryinfoData(data?.body)
        } else {
            // Handle the case where parts is null or undefined
            setcategoryinfoData({});
        }

    }, [data])
    // console.log(categoryinfoData, "ommmmmmmmmmmmmmmmm");
    const bom_id = categoryinfoData?.bom_id;
    const outwardId = categoryinfoData?.outward_id
    // console.log(outwardId)
    const [activeKey, setActiveKey] = useState(null);
    const [key1, setKey1] = useState("");

    const handleClose = () => {
        setShow(false);
        setModalIsOpen(false);
        setShowpn(false); // Close the modal when the modal is closed.
        setPdfPreview2(null);
        setPdfFileName2("");
        setSelectedFilesBase642([]);
        setPdfPreview1(null);
        setPdfFileName1("");
        setSelectedFilesBase641([]);
        setPdfPreview(null);
        setPdfFileName("");
        setSelectedFilesBase64([]);
    };

    const handleShow = () => {
        setShow(true);
        setModalIsOpen(true); // Open the modal when the modal is shown.
    };
    const handleNavigateBack = () => {
        navigate(-1);
    }

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
    const handleCancelPdfPreview1 = () => {
        setPdfPreview1(null);
        setPdfFileName1("");
        setSelectedFilesBase641([]);
        const inputElement = document.querySelector('input[type="file"][name="data_sheet1"]');
        if (inputElement) {
            inputElement.value = '';
        }
    };
    const handleCancelPdfPreview2 = () => {
        setPdfPreview2(null);
        setPdfFileName2("");
        setSelectedFilesBase642([]);
        const inputElement = document.querySelector('input[type="file"][name="data_sheet2"]');
        if (inputElement) {
            inputElement.value = '';
        }
    };

    const handlePdfChange1 = (e) => {
        const selectedFile1 = e.target.files[0];
        const newFileNames1 = [...fileNames1];
        const newFilesBase641 = [...selectedFilesBase641];
        let invalidFileType = false;
        if (selectedFile1) {
            if (selectedFile1.size > 200 * 1024) {
                // Show toast message for file size exceeding limit
                invalidFileType = true;
                const inputElement = document.querySelector('input[type="file"][name="data_sheet1"]');
                if (inputElement) {
                    inputElement.value = '';
                }
                toast.error("File size should not exceed 300KB.");
            }
            if (!invalidFileType) {
                newFileNames1.push(selectedFile1.name);
                const reader = new FileReader();
                setPdfFileName1(selectedFile1?.name)
                reader.onload = (fileOutput) => {
                    setPdfPreview1(reader.result);
                    const encodedFile = fileOutput.target.result.split(",")[1];
                    newFilesBase641.push(encodedFile);
                };
                if (selectedFile1.type === 'application/pdf' || selectedFile1.type.startsWith('image/')) {
                    reader.readAsDataURL(selectedFile1);
                } else {
                    alert('Please select a PDF or image file.');
                    return;
                }
            }
        }

        setSelectedFiles1([selectedFile1]);
        setFileNamespdf1(newFileNames1);
        setSelectedFilesBase641(newFilesBase641);
    };

    const handlePdfChange2 = (e) => {
        const selectedFile2 = e.target.files[0];
        const newFileNames2 = [...fileNames2];
        const newFilesBase642 = [...selectedFilesBase642];
        let invalidFileType = false;
        if (selectedFile2) {
            if (selectedFile2.size > 200 * 1024) {
                // Show toast message for file size exceeding limit
                invalidFileType = true;
                const inputElement = document.querySelector('input[type="file"][name="data_sheet2"]');
                if (inputElement) {
                    inputElement.value = '';
                }
                toast.error("File size should not exceed 300KB.");
            }
            if (!invalidFileType) {
                newFileNames2.push(selectedFile2.name);
                const reader = new FileReader();
                setPdfFileName2(selectedFile2?.name)
                reader.onload = (fileOutput) => {
                    setPdfPreview2(reader.result);
                    const encodedFile = fileOutput.target.result.split(",")[1];
                    newFilesBase642.push(encodedFile);
                };
                if (selectedFile2.type === 'application/pdf' || selectedFile2.type.startsWith('image/')) {
                    reader.readAsDataURL(selectedFile2);
                } else {
                    alert('Please select a PDF or image file.');
                    return;
                }
            }
        }

        setSelectedFiles2([selectedFile2]);
        setFileNamespdf2(newFileNames2);
        setSelectedFilesBase642(newFilesBase642);
    };

    const handleupload = (currentTabKey) => {
        setShowpn(true);
        setTabkey(currentTabKey)
    }

    const routeBoards = () => {
        let path = `/sendboards`;
        navigate(path, {
            state: {
                outward_id: outward_id,
                bom_id: categoryinfoData?.bom_id,
                partner_id: categoryinfoData?.partner_id,
                qty: categoryinfoData?.qty,
                tab: key,
                categoryinfoData: categoryinfoData,
                against_po: categoryinfoData?.against_po,
            }


        });
    }
    const handleTabChange = (selectedKey) => {
        console.log('Current active tab key:', selectedKey);

        console.log('Tab changed to:', selectedKey);
        setKey1(selectedKey);
        getDocuments(selectedKey)
    };


    const getDocuments = (key) => {
        if (key?.length) {
            const request = {
                "event_key": key,
                "outward_id": outward_id,
                // "dep_type": partner_type,
                "bom_id": categoryinfoData?.bom_id,
                "partner_id": categoryinfoData?.partner_id,
            }
            dispatch(getPartnersDoc(request));
        }
    }



    useEffect(() => {
        if (categoryinfoData) {
            // Update activeTabName when key1 changes
            console.log(Object.keys(categoryinfoData?.KITS ?? {})[0])
            console.log(Object.keys(Object.keys(categoryinfoData).filter(kitKey => kitKey.startsWith('M_KIT'))))
            const mkitKeys = Object.keys(categoryinfoData).filter(kitKey => kitKey.startsWith('M_KIT'));
            const kkitkeys = Object.keys(categoryinfoData?.KITS ?? {})[0]
            console.log(console.log(mkitKeys[0]));
            setActiveTabName(Object.keys(categoryinfoData?.KITS ?? {})[0] || mkitKeys);
            setKey1(kkitkeys || mkitKeys[0]);
            getDocuments(kkitkeys || mkitKeys[0])
        }
    }, [categoryinfoData]); // Depend on key1 to update activeTabName
    // console.log(key);
    const renderTabContent = (kitKey) => {
        const kitData = categoryinfoData?.KITS[kitKey];
        if (Array.isArray(kitData) && kitData.length === 0) {
            return <p>No data available for {kitKey}</p>;
        }
        return (
            <div className="table-responsive mt-4" id="tableData">
                <Table className='bg-header'>
                    <thead>
                        <tr>
                            {kitKey.startsWith('E-KIT') ? (
                                <>
                                    <th>{formFieldsVendor?.sno}</th>
                                    <th>{formFieldsVendor?.manufactnum}</th>
                                    <th>Part Name</th>
                                    <th>Manufacturer</th>
                                    <th>Device Category</th>
                                    <th>Mounting Type</th>
                                    <th>Batch No</th>
                                    <th>Required Quantity</th>
                                    <th>Provided Quantity</th>
                                    <th>Balance Quantity</th>
                                </>
                            ) : (
                                []
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(kitData)?.map((partKey, index) => {
                            const part = kitData[partKey];
                            return (
                                <tr key={index}>
                                    {kitKey.startsWith('E-KIT') ? (
                                        <>
                                            <td>{index + 1}</td>
                                            <td>{part?.mfr_part_number}</td>
                                            <td>{part?.part_name}</td>
                                            <td>{part?.manufacturer}</td>
                                            <td>{part?.device_category}</td>
                                            <td>{part?.mounting_type}</td>
                                            <td>{part?.batch_no}</td>
                                            <td>{part?.required_quantity}</td>
                                            <td>{part?.provided_qty}</td>
                                            <td>{part?.balance_qty}</td>
                                        </>
                                    ) : ([])}

                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </Table>
            </div>
        );
    };

    const renderMpartsTabContent = (kitKey) => {
        // const kitData = categoryinfoData && categoryinfoData[kitKey] ;
        const kitData = categoryinfoData && categoryinfoData[kitKey] ? categoryinfoData[kitKey] : {};

        if (typeof kitData !== 'object' || kitData === null || (Array.isArray(kitData) && kitData.length === 0)) {
            return <p>No Data Available for {kitKey}</p>;
        }
        // console.log(kitData, "kitkeyyyyyyyyyyyyyyyyyyyy");
        const finalProduct = kitKey.startsWith("M_KIT");
        if (finalProduct) {
            const headers = kitKey.startsWith("M_KIT") ?
                [
                    "VIC Part No",
                    "Part Name",
                    "Material",
                    "Technical Details",
                    "Description",
                    "Qty per Board",
                    "Batch No",
                    "Provided Qty",
                    "Balance Qty"
                ] : []
            const renderDataFields = (part, index) => {
                if (kitKey.startsWith("M_KIT")) {
                    return (
                        <>
                            <td>{part?.vic_part_number}</td>
                            <td>{part?.prdt_name}</td>
                            <td>{part?.material}</td>
                            <td>{part?.technical_details}</td>
                            <td>{part?.description}</td>
                            <td>{part?.qty_per_board}</td>
                            <td>{part?.batch_no}</td>
                            <td>{part?.provided_qty || 0}</td>
                            <td>{part?.balance_qty}</td>
                        </>
                    );
                }
                else {
                    return <></>;
                }
            };
            return (
                <div className="table-responsive mt-4" id="tableData">
                    <Table className="bg-header">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(kitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10)) // Sort the keys
                                .map((partKey, index) => {
                                    const part = kitData[partKey];
                                    console.log(part);
                                    return (
                                        <tr key={index}>
                                            {renderDataFields(part, index)}
                                        </tr>)
                                })}
                        </tbody>
                    </Table>
                </div>
            );
        }
        else {
            console.log("no dataaaaaa")
        }
    };

    const renderCommonRow = () => (
        <Row>
            <Col xs={12} md={4}>
                <h5 className="bomtag mt-3 mb-2 text-667 font-500">{formFieldsVendor.orderId} : {categoryinfoData?.outward_id}</h5>
                {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">{formFieldsVendor.bomId} : {categoryinfoData?.bom_id}</h5> */}
                <h5 className='mb-2 bomtag text-667 font-500'>{tableContent.qty} : {categoryinfoData?.qty}</h5>
                <h5 className='bomtag mb-2 text-667 font-500'>{tableBOM.receiverName}: {categoryinfoData?.receiver_name}</h5>

            </Col>

            <Col xs={12} md={4}>
                <h5 className='mb-2 mt-3 bomtag text-667 font-500'>{tableBOM.senderName}: {categoryinfoData?.sender_name}</h5>
                <h5 className='bomtag mb-2 text-667 font-500'>{tableBOM.receiverCntNum} : {categoryinfoData?.receiver_contact_num}</h5>
                <h5 className="bomtag text-667 font-500">{formFieldsVendor.orderDate}: {categoryinfoData?.order_date}</h5>
            </Col>

            <Col xs={12} md={4}>

                <h5 className='mb-2 mt-3 bomtag text-667 font-500'>{tableBOM.senderCnt} : {categoryinfoData?.contact_details}</h5>
                <h5 className='bomtag text-667 font-500 mb-2'>{formFieldsVendor.material}: {categoryinfoData?.mtrl_prcnt}</h5>
                <h5 className="bomtag text-667 font-500">Type : {partner_type}</h5>
            </Col>
        </Row>
    );

    // useEffect(() => {
    //     if (outward_id) {
    //         navigate(`?tab=${key}`, { state: outward_id });
    //     }
    // }, [key, navigate, outward_id]);

    useEffect(() => {
        const request = {
            "outward_id": outward_id,
            "dep_type": partner_type
        };
        setcategoryinfoData({});
        dispatch(getCategoryInfoDetails(request));
    }, []);

    const handleTabSelect = (key) => {
        setActiveKey(key);
    };



    const onSubmitforecast = async (e) => {
        e.preventDefault();
        const pdfBase64 = pdfPreview ? pdfPreview.split(',')[1] : '';
        const pdfBase641 = pdfPreview1 ? pdfPreview1.split(',')[1] : '';
        const pdfBase642 = pdfPreview2 ? pdfPreview2.split(',')[1] : '';
        const requestBody = {
            "event_key": tabkey,
            "outward_id": outward_id,
            // "dep_type": partner_type,
            "bom_id": categoryinfoData?.bom_id,
            "partner_id": categoryinfoData?.partner_id,

            gateentry: {
                doc_body: pdfBase64,
                doc_name: pdfFileName
            },
            qatest: {
                doc_body: pdfBase641,
                doc_name: pdfFileName1
            },
            inward: {
                doc_body: pdfBase642,
                doc_name: pdfFileName2
            },
        };

        console.log(requestBody);
        const response = await dispatch(UpdatePartnersDoc(requestBody));
        if (response.payload?.statusCode === 200) {
            setShowpn(false);
            getDocuments(key1)
            setPdfPreview2(null);
            setPdfFileName2("");
            setSelectedFilesBase642([]);
            setPdfPreview1(null);
            setPdfFileName1("");
            setSelectedFilesBase641([]);
            setPdfPreview(null);
            setPdfFileName("");
            setSelectedFilesBase64([]);
        }

    };

    return (
        <>

            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'><img src={arw} alt="" className='me-3' onClick={handleNavigateBack} />{outward_id}</h1>

                    </div>
                    <div className='tab-sec'>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="catinfo" title="Category Info">

                                {renderCommonRow()}
                                <div className='d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5'>
                                    <div className='d-flex align-items-center'>
                                        <div className='partno-sec vendorpartno-sec' >
                                            <div className='tab-sec'>
                                                <Tabs
                                                    id="controlled-tab-example"
                                                    onSelect={handleTabChange}
                                                >


                                                    {(typeof categoryinfoData === 'object' && categoryinfoData?.KITS) ? (
                                                        Object.keys(categoryinfoData?.KITS)
                                                            .filter(kitKey => kitKey.startsWith('E-KIT'))
                                                            .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                                                            .map((kitKey, index) => (

                                                                <Tab eventKey={kitKey} title={kitKey} key={index} >
                                                                    <div className='text-end'><button onClick={() => handleupload(kitKey)} className='submit btn btn-primary'>Attach Documents</button></div>

                                                                    <Row className="partners-docs">
                                                                        {getdocslist?.gateentry && (
                                                                            <Col xs={12} md={2}>
                                                                                <p className="pdf-tag">Gate Entry  <br/> {getdocslist?.gateentry?.doc_name} </p>
                                                                                <div className="doc-card position-relative">
                                                                                    <div className="pdfdwn">
                                                                                        <img src={pdf} alt="" />
                                                                                    </div>
                                                                                    <div className="doc-sec position-absolute">
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                                <a
                                                                                                    href={getdocslist?.gateentry?.doc_url}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                >
                                                                                                    <img src={view} alt="" />
                                                                                                </a>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                        {getdocslist?.qatest && (
                                                                            <Col xs={12} md={2}>
                                                                                <p className="pdf-tag">QA Test <br/> {getdocslist?.qatest?.doc_name}</p>
                                                                                <div className="doc-card position-relative">
                                                                                    <div className="pdfdwn">
                                                                                        <img src={pdf} alt="" />
                                                                                    </div>
                                                                                    <div className="doc-sec position-absolute">
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                                <a
                                                                                                    href={getdocslist?.qatest?.doc_url}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                >
                                                                                                    <img src={view} alt="" />
                                                                                                </a>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                        {getdocslist?.inward && (
                                                                            <Col xs={12} md={2}>
                                                                                <p className="pdf-tag">Inward <br/> {getdocslist?.inward?.doc_name} </p>
                                                                                <div className="doc-card position-relative">
                                                                                    <div className="pdfdwn">
                                                                                        <img src={pdf} alt="" />
                                                                                    </div>
                                                                                    <div className="doc-sec position-absolute">
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                                <a
                                                                                                    href={getdocslist?.inward?.doc_url}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                >
                                                                                                    <img src={view} alt="" />
                                                                                                </a>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                    </Row>


                                                                    {renderTabContent(kitKey)}
                                                                </Tab>
                                                            ))

                                                    ) : null}

                                                    {(typeof categoryinfoData === "object" && categoryinfoData) ? (
                                                        Object.keys(categoryinfoData)
                                                            .filter(kitKey => kitKey.startsWith('M_KIT'))
                                                            .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                                                            .map((kitKey, index) => (
                                                                <Tab eventKey={kitKey} title={kitKey} key={index}>
                                                                    {console.log(kitKey)}
                                                                    <div className='text-end'> <button onClick={() => handleupload(kitKey)} className='submit btn btn-primary'>Attach Documents</button></div>
                                                                    <Row className="partners-docs">
                                                                        {getdocslist?.gateentry && (
                                                                            <Col xs={12} md={2}>
                                                                                <p className="pdf-tag">Gate Entry : {getdocslist?.gateentry?.doc_name} </p>
                                                                                <div className="doc-card position-relative">
                                                                                    <div className="pdfdwn">
                                                                                        <img src={pdf} alt="" />
                                                                                    </div>
                                                                                    <div className="doc-sec position-absolute">
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                                <a
                                                                                                    href={getdocslist?.gateentry?.doc_url}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                >
                                                                                                    <img src={view} alt="" />
                                                                                                </a>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                        {getdocslist?.qatest && (
                                                                            <Col xs={12} md={2}>
                                                                                <p className="pdf-tag">QA Test : {getdocslist?.qatest?.doc_name}</p>
                                                                                <div className="doc-card position-relative">
                                                                                    <div className="pdfdwn">
                                                                                        <img src={pdf} alt="" />
                                                                                    </div>
                                                                                    <div className="doc-sec position-absolute">
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                                <a
                                                                                                    href={getdocslist?.qatest?.doc_url}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                >
                                                                                                    <img src={view} alt="" />
                                                                                                </a>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                        {getdocslist?.inward && (
                                                                            <Col xs={12} md={2}>
                                                                                <p className="pdf-tag">Inward : {getdocslist?.inward?.doc_name} </p>
                                                                                <div className="doc-card position-relative">
                                                                                    <div className="pdfdwn">
                                                                                        <img src={pdf} alt="" />
                                                                                    </div>
                                                                                    <div className="doc-sec position-absolute">
                                                                                        <div className="d-flex justify-content-between">

                                                                                            <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                                                                                <a
                                                                                                    href={getdocslist?.inward?.doc_url}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                >
                                                                                                    <img src={view} alt="" />
                                                                                                </a>
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )}
                                                                    </Row>
                                                                    {renderMpartsTabContent(kitKey)}
                                                                </Tab>
                                                            ))

                                                    ) : null}
                                                </Tabs>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="boards" title="Boards Info">
                                {renderCommonRow()}
                                {key == "boards" ? (<BoardsInfo outward_id={outwardId} dep_type={partner_type}></BoardsInfo>) : (null)}
                            </Tab>
                            {categoryinfoData.type !== "EMS" ? (<Tab eventKey="productioninfo" title="Final Product Info">
                                {renderCommonRow()}
                                <ProductionLineTab modalIsOpen={modalIsOpen} handleClose={handleClose} handleShow={handleShow} categoryData={categoryinfoData} outward_id={outward_id} />
                            </Tab>) : null
                            }
                        </Tabs>
                    </div>
                    <div className='mobilemargin-top'>
                        {key === 'productioninfo' && (
                            <Button className='submit me-2 md-me-2 submitmobile' onClick={routeBoards}>
                                Send Final Products
                            </Button>
                        )}
                        {key === 'boards' && categoryinfoData?.type === "EMS" && (
                            <Button className='submit me-2 md-me-2 submitmobile' onClick={routeBoards}>
                                Upload Boards
                            </Button>
                        )}
                    </div>
                </div>


            </div>

            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">{formFieldsVendor.loader}</span>
                    </Spinner>
                </div>
            )}

            <Modal show={showpn} onHide={handleClose}>
                <Modal.Header closeButton className='p-1'>
                    <h6 className='text-center w-100'>Upload Documents</h6>
                </Modal.Header>
                <Modal.Body>
                    <p className='mb-1 font-13'>Gate Entry</p>
                    <div class="upload-btn-wrap w-100">
                        <button class="btn w-100">Upload  Doc</button>
                        <input type="file"
                            onChange={handlePdfChange}
                            accept="application/pdf, image/jpeg, image/png"
                            name="data_sheet" />
                    </div>
                    {pdfFileName && <p className="m-0 attachment-sec1">
                        {pdfFileName}
                        <span
                            role="button" tabindex="0" className="py-1 px-2"
                            onClick={handleCancelPdfPreview}
                        >
                            &times;
                        </span></p>}

                    <p className='mb-1 font-13'>QA Test</p>
                    <div class="upload-btn-wrap w-100">
                        <button class="btn w-100">Upload  Doc</button>
                        <input type="file"
                            onChange={handlePdfChange1}
                            accept="application/pdf, image/jpeg, image/png"
                            name="data_sheet1" />
                    </div>
                    {pdfFileName1 && <p className="m-0 attachment-sec1">
                        {pdfFileName1}
                        <span
                            role="button" tabindex="0" className="py-1 px-2"
                            onClick={handleCancelPdfPreview1}
                        >
                            &times;
                        </span></p>}
                    <p className='mb-1 font-13'>Inward</p>
                    <div class="upload-btn-wrap w-100">
                        <button class="btn w-100">Upload  Doc</button>
                        <input type="file"
                            onChange={handlePdfChange2}
                            accept="application/pdf, image/jpeg, image/png"
                            name="data_sheet2" />
                    </div>
                    {pdfFileName2 && <p className="m-0 attachment-sec1">
                        {pdfFileName2}
                        <span
                            role="button" tabindex="0" className="py-1 px-2"
                            onClick={handleCancelPdfPreview2}
                        >
                            &times;
                        </span></p>}
                </Modal.Body>
                <Modal.Footer className='p-0'>
                    <Button className='cancel' onClick={handleClose}>
                        CANCEL
                    </Button>
                    <Button className="submitmobile submit" onClick={onSubmitforecast}>
                        SUBMIT
                    </Button>
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
        </>
    )
}

export default OrdersInnerDetails;