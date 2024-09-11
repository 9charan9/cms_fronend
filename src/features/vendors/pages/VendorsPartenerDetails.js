
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import arw from '../../../assets/Images/left-arw.svg';
import view from '../../../assets/Images/view.svg';
import pdf from '../../../assets/Images/pdf.svg';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import 'jspdf-autotable';
import { selectVendorsCategoryDetails, getVendorcategoryDetails, selectLoadingStatus, getOrdersList, selectOrdersList, selectUpdateStockDetailsData, getUpdateStockDetails, selectSaveUpdateStock, saveUpdateStockDetails, selectBomList, getBomList, getBomListFetch, selectBomListData, getBomListBBFetch, selectBbBomListData, saveBbUpdateStockDetails,selectpartnerAvailableStock, partnerAvailableStock } from '../slice/VendorSlice';
import { formFieldsVendor, tableContent, textToast } from "../../../utils/TableContent"
import "../styles/Vendors.css";
import Modal from "react-bootstrap/Modal";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaSort } from "react-icons/fa";

const VendorsPartenerDetails = () => {
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [key, setKey] = useState('bankdetails');
    const [tabKey, setTabKey] = useState('components');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { vendor_id, vendor_name, partner_type } = location.state;
    console.log(partner_type);
    const VendorcatDetails = useSelector(selectVendorsCategoryDetails);
    const orderslist = useSelector(selectOrdersList);
    const PartnerStockDetails = useSelector(selectpartnerAvailableStock);
    const orderslistData = orderslist?.body;
    console.log(orderslistData);
    const isLoading = useSelector(selectLoadingStatus);
    const PartnerStockData = PartnerStockDetails?.body;
    console.log(PartnerStockData);
    const VendorcatDetailsdata = VendorcatDetails?.body;
    console.log(VendorcatDetailsdata);
    const updateStockData = useSelector(selectBomListData);
    // const getStockData = updateStockData?.body || [];
    const [getStockData, setGetStockData] = useState([]);

    console.log(getStockData)
    const documentUrls = (VendorcatDetailsdata?.documents || [])?.map(document => document.content) || [];
    const saveUpdateStockData = useSelector(selectSaveUpdateStock);
    console.log(saveUpdateStockData)
    const bomNamelist = useSelector(selectBomList);
    const bomNamesdata = bomNamelist?.body
    console.log(bomNamesdata, "bomlistDataaaa......")
    const bbData = useSelector(selectBbBomListData);
    console.log(bbData, "bbDataaaaa...........")
    const [getBbData, setGetBbData] = useState([]);
    console.log(getBbData)

    useEffect(() => {
        if (updateStockData?.body) {
            setGetStockData(updateStockData.body);
        }
        if (bbData?.body) {
            setGetBbData(bbData?.body);
        }
    }, [updateStockData, bbData]);

    const [utilizedQuantities, setUtilizedQuantities] = useState(
        Array.isArray(getStockData) ? getStockData.reduce((acc, item, index) => {
            acc[index] = item.utilized_qty || 0;
            return acc;
        }, {}) : {}
    );

    const [damagedQuantites, setDamagedQuantites] = useState(
        Array.isArray(getStockData) ? getStockData.reduce((acc, item, index) => {
            acc[index] = item.damaged_qty || 0;
            return acc;
        }, {}) : {}
    );

    const handleUtilizedQtyChange = (e, index) => {
        const value = e.target.value;
        setUtilizedQuantities(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const handleDamagedQtyChange = (e, index) => {
        const value = e.target.value;
        setDamagedQuantites(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const handleSelectInward = async (e) => {
        const requestobj = {
            "partner_id": vendor_id,
            bom_id: e.target.value ,
            partner_type: partner_type
        };
        console.log(requestobj, "bomnameee");
        if (partner_type == "EMS") {
            await dispatch(getBomListFetch(requestobj))
        } else {
            await dispatch(getBomListBBFetch(requestobj))
        }
    };

    // const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    // const handleSort = (key) => {
    //     let direction = 'asc';
    //     if (sortConfig.key === key && sortConfig.direction === 'asc') {
    //         direction = 'desc';
    //     }
    //     setSortConfig({ key, direction });
    // };

    // const sortedData = Array.isArray(PartnerStockData)
    // ? [...PartnerStockData].sort((a, b) => {
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //         return sortConfig.direction === 'asc' ? -1 : 1;
    //     }
    //     if (a[sortConfig.key] > b[sortConfig.key]) {
    //         return sortConfig.direction === 'asc' ? 1 : -1;
    //     }
    //     return 0;
    // })
    // : [];

    // const filteredData = sortedData.filter((item1) => {
    //     const lowerCaseQuery = searchQueries[key].toLowerCase();
    //     const nameIndex = (item1.prdt_name  || '' ||item1.device_category  ).toLowerCase().indexOf(lowerCaseQuery);
    //     return (
    //         (nameIndex !== -1 && (item1.prdt_name|| item1.device_category || '').toLowerCase().startsWith(lowerCaseQuery)) ||
    //         (item1.ctgr_name || '').toLowerCase().includes(lowerCaseQuery) ||
    //         (item1.quantity || '').toString().includes(lowerCaseQuery) ||
    //         (item1.mfr_prt_num || '').toLowerCase().includes(lowerCaseQuery) ||
    //         (item1.ptg_prt_num || '').toLowerCase().includes(lowerCaseQuery) ||
    //         (item1.status || '').toLowerCase().includes(lowerCaseQuery)
    //     );
    // });


    //     const [searchQueries, setSearchQueries] = useState({
    //     Electronic: '',
    //     Mechanic: '',
    // });
    const getInwardids = () => {
        if (Array.isArray(bomNamesdata) && bomNamesdata) {
            return bomNamesdata?.map((value, index) => {
                return (

                    <option value={value.bom_id} key={index}>
                        {value.bom_name}
                    </option>
                );
            });
        }
    };

    useEffect(() => {
        const request = {
            "vendor_id": vendor_id,
            "vendor_name": vendor_name,
            "type": "Partners",
        }
        const requestBody = {
            "partner_id": vendor_id,
            "dep_type": partner_type && partner_type[0] ? partner_type[0].replace(/ /, '') : null
        }
        dispatch(getOrdersList(requestBody))
        dispatch(getVendorcategoryDetails(request))
    }, []);

    useEffect(() => {

    }, [dispatch])

    useEffect(() => {
        const request = {
          "partner_id": vendor_id,
          "status": partner_type[0],
          
        }
        dispatch(partnerAvailableStock(request))
      }, [])

    const handleNavigate = (item) => {
        navigate("/ordersinnerDetails", {
            state: {
                outward_id: item,
                partner_type: partner_type[0]
            }
        })
    }
    if (!VendorcatDetailsdata) {
        return null;
    }

    const openPDFInNewTab = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error("Error loading PDF:", error);
        }
    };

    const handleShowOrderModal = (e) => {
        const request = {
            "partner_id": vendor_id,
            "status": partner_type[0]
        }
        setShowOrderModal(true);
        dispatch(getBomList(request))
    };

    const handleUpdateData = async (e) => {
        const hasEmptyFields = (data) => {
            return data.some((item, index) => {
                return utilizedQuantities[index] === undefined || damagedQuantites[index] === undefined;
            });
        };
        if (partner_type == "EMS") {
            const parts =
                (getStockData) && getStockData.length > 0
                    ? getStockData.map((item, index) => ({
                        part_name: item?.part_name,
                        mfr_part_number: item?.mfr_part_number,
                        device_category: item?.device_category,
                        required_quantity: item?.required_quantity,
                        provided_qty: item?.provided_qty,
                        //received_qty: item?.available_qty,
                         cmpt_id:item?.cmpt_id,
                         available_qty:item?.available_qty,
                        utilized_qty: utilizedQuantities[index],
                        damaged_qty: damagedQuantites[index],
                    }))
                    : [];
                    if (hasEmptyFields(getStockData)) {
                        toast.error('Please fill in all utilized and damaged quantities.');
                        return;
                    }
            const request = {
                "partner_id": vendor_id,
                update_stock: parts,
                partner_type: partner_type[0],
            }
            const response = await dispatch(saveUpdateStockDetails(request));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    handleCloseDeleteModal();
                }, 2000);
            }
        } else {
            const bbParts =
                (getBbData) && getBbData.length > 0
                    ? getBbData.map((item, index) => ({
                        part_name: item?.prdt_name,
                        mfr_part_number: item?.vic_part_number,
                        device_category: item?.ctgr_name,
                        balance_qty: item?.balance_qty,
                        provided_qty: item?.provided_qty,
                       // received_qty: item?.available_qty,
                        cmpt_id:item?.cmpt_id,
                        available_qty:item?.available_qty,
                        utilized_qty: utilizedQuantities[index],
                        damaged_qty: damagedQuantites[index],
                    }))
                    : [];
                    if (hasEmptyFields(getBbData)) {
                        toast.error('Please fill in all utilized and damaged quantities.');
                        return;
                    }
            const requestObj = {
                "partner_id": vendor_id,
                update_stock: bbParts,
                partner_type: partner_type[0]
            }
            const response = await dispatch(saveBbUpdateStockDetails(requestObj));
            if (response.payload?.statusCode === 200) {
                setTimeout(() => {
                    handleCloseDeleteModal();
                }, 2000);
            }
        }      
     
        setUtilizedQuantities([]);
        setDamagedQuantites([]);
        setGetStockData([]);
        setGetBbData([]);
       
    };

    const handleCloseDeleteModal = () => {
        setShowOrderModal(false);
        setUtilizedQuantities([]);
        setDamagedQuantites([]);
        setGetStockData([]);
        setGetBbData([]);
         window.location.reload();
    };

    const renderTableRows = () => {
        if (partner_type == "EMS") {
            if (!getStockData || getStockData.length === 0) {
                return (
                    <tr>
                        <td colSpan="7" className="text-center">No data available</td>
                    </tr>
                );
            } else {
                return Array.isArray(getStockData) && getStockData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.part_name}</td>
                        <td>{item.mfr_part_number}</td>
                        <td>{item.device_category}</td>
                        <td>{item.required_quantity}</td>
                        <td>{item.provided_qty}</td>
                        <td>{item.available_qty}</td>
                        <td>
                            <input
                                type="number"
                                className="inputno"
                                value={utilizedQuantities[index]}
                                min={0}
                                onChange={(e) => handleUtilizedQtyChange(e, index)}
                                required
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                className="inputno"
                                value={damagedQuantites[index]}
                                min={0}
                                onChange={(e) => handleDamagedQtyChange(e, index)}
                                required
                            />
                        </td>
                    </tr>
                ));
            }
        } else {
            return Array.isArray(getBbData) && getBbData.map((item, index) => (
                <tr key={index}>
                    <td>{item.prdt_name}</td>
                    <td>{item.vic_part_number}</td>
                    <td>{item.ctgr_name}</td>
                    <td>{item.balance_qty}</td>
                    <td>{item.provided_qty}</td>
                    <td>{item.available_qty}</td>
                    <td>
                        <input
                            type="number"
                            className="inputno"
                            value={utilizedQuantities[index]}
                            min={0}
                            onChange={(e) => handleUtilizedQtyChange(e, index)}
                            required
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            className="inputno"
                            value={damagedQuantites[index]}
                            min={0}
                            onChange={(e) => handleDamagedQtyChange(e, index)}
                            required
                        />
                    </td>
                </tr>
            ));
        }
    };

    return (
        <>
            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'><img src={arw} alt="" className='me-3' onClick={() => navigate(-1)} />{VendorcatDetailsdata?.partner_name} </h1>
                    </div>
                </div>

                <Row>
                    <Col xs={12} md={4}>

                        <h5 className='mb-2 mt-3 bomtag text-667 font-500'>
                            {formFieldsVendor.partnertype} : {Array.isArray(VendorcatDetailsdata?.partner_type)
                                ? VendorcatDetailsdata.partner_type.join(' & ')
                                : VendorcatDetailsdata?.partner_type}
                        </h5>
                        <h5 className='bomtag mb-2 text-667 font-500'>{formFieldsVendor.partnerDate} : {VendorcatDetailsdata?.vendor_date}</h5>
                        <h5 className="bomtag mb-2 text-667 font-500">
                            Address : {
                                [
                                    VendorcatDetailsdata?.address1,
                                    VendorcatDetailsdata?.address2,
                                    VendorcatDetailsdata?.landmark,
                                    VendorcatDetailsdata?.pin_code,
                                    VendorcatDetailsdata?.city_name,
                                    VendorcatDetailsdata?.state,
                                    VendorcatDetailsdata?.country
                                ]
                                    .filter(value => value !== undefined && value !== '' && value !== 'NA' && value !== 'na' && value !== '-' && value !== 'Nill' && value !== 'nill' && value !== 'NILL')
                                    .join(', ')
                            }
                        </h5>

                    </Col>

                    <Col xs={12} md={4}>

                        <h5 className='mb-2 mt-3 bomtag text-667 font-500'>{formFieldsVendor.contact} : {VendorcatDetailsdata?.contact_number}</h5>
                        <h5 className='bomtag mb-2 text-667 font-500'>{tableContent.email} : {VendorcatDetailsdata?.email}</h5>
                    </Col>

                    <Col xs={12} md={4}>
                        <h5 className="mb-2 mt-3 bomtag text-667 font-500">{formFieldsVendor.gstNumber} : {VendorcatDetailsdata?.gst_number} </h5>
                        <h5 className='mb-2 bomtag text-667 font-500'>{formFieldsVendor.panNumber} : {VendorcatDetailsdata?.pan_number}</h5>

                    </Col>

                </Row>

                <div className='d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5'>
                    <div className='d-flex align-items-center'>
                        <div className='partno-sec vendorpartno-sec' >
                            <div className='tab-sec'>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}

                                >

                                    <Tab eventKey="bankdetails" title="Bank Details">
                                        <Row className='mt-4'>
                                            <Col xs={12} md={4}>
                                                <p className="mb-2">{formFieldsVendor.holderName} :  {VendorcatDetailsdata?.holder_name}</p>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <p className="mb-2">{formFieldsVendor.bankName} :  {VendorcatDetailsdata?.bank_name}</p>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <p className="mb-2 d-flex" style={{ "white-space": "nowrap" }} title={VendorcatDetailsdata?.account_number}>{formFieldsVendor.ACnum} : <span className="accnotag ps-1"> {VendorcatDetailsdata?.account_number} </span></p>
                                            </Col>
                                        </Row>

                                        <Row className='mt-2'>
                                            <Col xs={12} md={4}>
                                                <p>{formFieldsVendor.branchName} :  {VendorcatDetailsdata?.branch_name}</p>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <p>{formFieldsVendor.ifscCode} :  {VendorcatDetailsdata?.ifsc_code}</p>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="otherinfo" title="Other Info">
                                        <p className='mt-4 mb-2 font-bold'>{formFieldsVendor.terms} :</p>
                                        {/* <p>{VendorcatDetailsdata?.terms_and_conditions}</p> */}
                                        <div className="pterms" dangerouslySetInnerHTML={{ __html: VendorcatDetailsdata?.terms_and_conditions }} />
                                        <p className='mt-4 mb-2 font-bold'>Custom Payment :</p>
                                        <div className="payments pterms" dangerouslySetInnerHTML={{ __html: VendorcatDetailsdata?.payments }} />
                                    </Tab>

                                    <Tab eventKey="documents" title="Documents">

                                        {VendorcatDetailsdata?.documents && VendorcatDetailsdata.documents.length > 0 ? (
                                            <Row className='mt-4'>

                                                {VendorcatDetailsdata.documents.map((document, index) => (
                                                    <Col xs={12} md={2} key={index}>
                                                        <p className='pdf-tag'>{document.document_name}</p>
                                                        <div className='doc-card position-relative'>
                                                            <div className='pdfdwn'><img src={pdf} alt="" /></div>
                                                            <div className='doc-sec position-absolute'>
                                                                <div className='d-flex justify-content-between'>
                                                                    {/* <Button className='view' onClick={() => downloadDocument(document.document, document.name)}>
                                                                        <img src={download} alt="" />
                                                                    </Button> */}
                                                                    {/* <Button className='view' style={{ marginLeft: 'auto', fontSize: '1.5rem' }}  ><a href={documentUrls[index]} target="_blank" rel="noreferrer"><img src={view} alt="" /></a> </Button> */}
                                                                    <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTab(`data:application/pdf;base64,${documentUrls[index]}`)}>
                                                                        <img src={view} alt="" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))

                                                }
                                            </Row>
                                        ) : (
                                            <p>{textToast.noDoc}</p>
                                        )}

                                    </Tab>

                                    <Tab eventKey="orders" title="Orders">
                                        <div className="table-responsive mt-4 ms-4" id="tableData">
                                            <Table className="bg-header">
                                                <thead>
                                                    <tr>
                                                        <th>{formFieldsVendor.sno}</th>
                                                        <th>Bom Name</th> 
                                                        <th>{formFieldsVendor.orderId}</th>
                                                        <th>{formFieldsVendor.orderDate}</th>
                                                        <th>{formFieldsVendor.boardsQty}</th>
                                                        <th>{formFieldsVendor.material}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(orderslistData) && orderslistData.length > 0 ? (
                                                        orderslistData?.map((item, index) => (
                                                            <tr key={index} >
                                                                <td>{index + 1}</td>
                                                                <td>{item.bom_name}</td>
                                                                <td className='outward_underline' onClick={() => handleNavigate(item?.outward_id, item?.bom_id)}>{item?.outward_id}</td>
                                                                <td>{item?.order_date}</td>
                                                                <td>{item?.qty}</td>
                                                                <td>{item?.mtrl_prcnt}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className='text-center'>no Data Available</td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </Table>
                                        </div>

                                    </Tab>

                                    <Tab eventKey="stockinward" title="Stock Inward">
                                        <p className='mt-4 mb-2'>Coming Soon</p>
                                    </Tab>
                                    <Tab eventKey="availablestock" title="Available Stock">
                                   
                                    <div className="table-responsive mt-1 ms-1" id="tableData">
                                            <Table className="b-table table">
                                                <thead>
                                                    <tr>
                                                        <th>Part Name<FaSort /></th>
                                                        <th>M.Part Number<FaSort /></th>
                                                        <th>Category<FaSort /></th>
                                                        <th>Available Qty<FaSort /></th>
                                                        <th>Utilized Qty<FaSort /></th>
                                                        <th>Damaged Qty<FaSort /></th>
                                                        <th>Price<FaSort /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(PartnerStockData) && PartnerStockData.length > 0 ? (
                                                        PartnerStockData?.map((item1) => (
                                                            <tr>
                                                                <td>{item1?.part_name}</td>
                                                                <td>{item1?.mfr_part_number}</td>
                                                                <td>{item1?.device_category}</td>
                                                                <td>{item1?.available_qty}</td>
                                                                <td>{item1?.utilized_qty}</td>
                                                                <td>{item1?.damaged_qty}</td>
                                                                <td>{item1?.unit_price}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className='text-center'>no Data Available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>


                    <div className='mobilemargin-top'>

                        <Button
                            className="submit mb-1 submit-block"
                            onClick={() => handleShowOrderModal()}
                            disabled={key == 'bankdetails' || key == 'otherinfo'
                                || key == 'documents' || key == 'stockinward' || key == 'availablestock'}
                        >
                            Update Stock
                        </Button>
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

            <Modal show={showOrderModal} onHide={handleCloseDeleteModal} centered className="cmodal">
                <Modal.Header closeButton className="border-0 mb-3 p-0"></Modal.Header>
                <div>
                    <h6>  Update Stock  </h6>
                    <Form.Group>
                        <Form.Label className="mb-0">Bom Names <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            name="primaryDocumentDetails.bom_name"
                            onChange={handleSelectInward}
                        >
                            <option value="">Select</option>
                            {/* <option value="All">All</option> */}
                            {getInwardids()}
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="table-responsive mt-4" id="tableData">
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={tabKey}
                        onSelect={(k) => setTabKey(k)} >
                        <Tab eventKey="components" title="Components">
                            <Table className="bg-header">
                                <thead>
                                    <tr>
                                        <th>Part Name</th>
                                        <th>M.PartNumber</th>
                                        <th>Category</th>
                                        <th>Required Qty</th>
                                        <th>Received Qty</th>
                                        <th>Available Qty</th>
                                        <th>Utilized Qty</th>
                                        <th>Damaged Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </Table>
                        </Tab>
                    </Tabs>

                </div>

                <div className='mobilemargin-top d-flex justify-content-end'>

                    <Button
                        className="submit mb-1 submit-block"
                        onClick={() => handleUpdateData()}
                        disabled={getStockData.length === 0 && getBbData.length === 0}
                    >
                        Update
                    </Button>
                </div>

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

export default VendorsPartenerDetails;