import React, { useState } from 'react';
import { Form, useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast, ToastContainer, Zoom } from "react-toastify";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import SalesPurchaseListDetails from "./SalespurchaseListDetails";
import QuotationsListDetails from './QuotationsListDetails';
import ApprovalsListDetails from './ApprovalsListDetails';
import Modal from 'react-bootstrap/Modal';
import arw from "../../../assets/Images/left-arw.svg";
import arwdown from "../../../assets/Images/down_arw.svg";
import { fetchVendorList, selectActivevendorslist,fetchPartnerList,selectPartnerFetchingList} from '../../purchaseorders/slice/PurchaseOrderSlice';
import {selectActiclientslist, fetchClientList} from '..//../purchasesales/slice/SalesSlice'
const SalespurchaseList = () => {

    const [key, setKey] = useState('SalesPurchase');
    const [showPurchaseOrderModal, setPurchaseOrderShowModal] = useState(false);
    const [showInvoiceModal, setInvoiceShowModal] = useState(false);
    const [showproformaModal, setProformaShowModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState('');
    const [showServiceOrderModel , setShowServiceOrdershowModel] = useState(false)
    const [selectPartner , setSelectPartner] = useState("")
    const [vendorType,setVendortype] = useState('');
    // fetch client 
    const [selectedClient, setSelectedClient] = useState('');
    const handleClose1 = () => setInvoiceShowModal(false);
    const handleCloseSo = () => setShowServiceOrdershowModel(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const vendorSelectiondata = useSelector(selectActivevendorslist);
    const vendorSelection = vendorSelectiondata?.body;
    console.log(vendorSelection, "vendorSelection");

    const fetchPartnerListData = useSelector(selectPartnerFetchingList)
    const getpartnerList = fetchPartnerListData?.body
    console.log(getpartnerList)


    // fetch client data from get lambda
    const clientSelectiondata = useSelector(selectActiclientslist)
    const clientSelection = clientSelectiondata?.body;
    console.log(clientSelection, "get data details")
    

    const handleClose = () => {
        setPurchaseOrderShowModal(false);
        setProformaShowModal(false);

    }
    

    const handlePurchaseOrderClick = () => {
        setPurchaseOrderShowModal(true);
    };

    const handleInvoiceClick = () => {
        setInvoiceShowModal(true);
    };

    const handleProformaInvoiceClick = () => {
        setProformaShowModal(true);
    };
    // const handleVendorChange = (event) => {
    //     console.log(event.target.options[event.target.selectedIndex].getAttribute('data-vendor-type'),"ommmmmmm");
    //     const selectedVendorType = event.target.options[event.target.selectedIndex].getAttribute('data-vendor-type');       
    //     setSelectedVendor(event.target.value);
    //     setVendortype(selectedVendorType);
    // };

    const handleVendorChange = (event) => {
        console.log(event.target.options[event.target.selectedIndex].getAttribute('data-vendor-type'),"ommmmmmm");
        const selectedVendorType = event.target.options[event.target.selectedIndex].getAttribute('data-vendor-type');       
        setSelectedVendor(event.target.value);
        setVendortype(selectedVendorType);
    };
  

    const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
    };

    useEffect(() => {
        dispatch(fetchVendorList());
    }, [dispatch]);

    // useEffect(() => {
    //     if (vendorSelection.length > 0 && !selectedVendor) {
    //         setSelectedVendor(vendorSelection[0].vendor_id);
    //         setVendortype(vendorSelection[0].vendor_type);
    //     }
    // }, [vendorSelection, selectedVendor]);

    // const routePo = () => {
    //  console.log(selectedVendor,"selectedVendor selectedVendor");
    //     navigate("/PoForm", {
    //         state: { vendorId: selectedVendor, vendorType:vendorType } // Ensure this is an object     
    //     });
    // }

    useEffect(() => {
        if (vendorSelection?.length > 0 && !selectedVendor) {
            setSelectedVendor(vendorSelection[0]?.vendor_id);
            setVendortype(vendorSelection[0]?.vendor_type);
        }
    }, [vendorSelection, selectedVendor]);
    const routePo = () => {
        console.log(selectedVendor,"selectedVendor selectedVendor");
           navigate("/PoForm", {
               state: { vendorId: selectedVendor, vendorType: vendorType } // Ensure this is an object     
           });
       }

    const routeSo = () => {
        navigate('/serviceorder' , {
            state :  selectPartner 
        })
    }


    const handleServiceOrderClick = () => {
        setShowServiceOrdershowModel(true)

    }

    const handlePartnerChange = (event) => {
        setSelectPartner(event.target.value)
        console.log(event.target.value)

    }
    

    useEffect(() => {
        dispatch(fetchPartnerList())
    },[dispatch])

    useEffect(() => {
        if (getpartnerList && getpartnerList.length > 0 && !selectPartner) {
            setSelectPartner(getpartnerList[0].partnerId);
        }
    }, [getpartnerList])

    

    const routeClients = () => {
        //console.log(selectedVendor,"selectedVendor selectedVendor");
           navigate("/Invoice", {
               state: { clientId: selectedClient } // Ensure this is an object     
           });
       }


    // PROFORMA INVOICE fetch client get lambda
    useEffect(() => {
        dispatch(fetchClientList());
    }, [dispatch]);

    useEffect(() => {
         if (clientSelection?.length > 0 && !selectedClient) {
             setSelectedClient(clientSelection[0].client_id);
         }
     }, [clientSelection, selectedClient]);
    const routePI = () => {
     console.log(selectedClient,"selectedClient selectedClient");
        navigate("/ProformaInvoice", {
            state: { clientId: selectedClient } // Ensure this is an object     
        });
    }

 

    return (
        <>

            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile border-bottom'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'>Sales & Purchase</h1>
                        <div className='tab-sec'>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            >
                                <Tab eventKey="SalesPurchase" title="Sales & Purchase">
                                    <SalesPurchaseListDetails />
                                </Tab>
                                <Tab eventKey="Quotations" title="Quotations">
                                    <QuotationsListDetails />
                                </Tab>
                                <Tab eventKey="Approvals" title="Approvals">
                                    <ApprovalsListDetails />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>


                    <Dropdown className="customdropdwn">
                        <Dropdown.Toggle id="dropdown-autoclose-true" className='p-2 bg-white border' align={{ lg: 'start', md: 'start', sm: 'start' }}>
                        Create Document
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handlePurchaseOrderClick}>Purchase Order</Dropdown.Item>
                            {/* <Dropdown.Item href="/serviceorder">Service Order</Dropdown.Item> */}
                            <Dropdown.Item onClick={handleServiceOrderClick}>Service Order </Dropdown.Item>
                            <Dropdown.Item onClick={handleInvoiceClick}>Invoice</Dropdown.Item>
                            <Dropdown.Item onClick={handleProformaInvoiceClick}>Proforma Invoice</Dropdown.Item>
                            <Dropdown.Item href="/clientpo">Client Purchase Order</Dropdown.Item>
                            <Dropdown.Item href="/poreturn">Return Purchase Order</Dropdown.Item>
                            <Dropdown.Item href="/forecastpo">Forecast Purchase Order</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>


                </div>
            </div>

            <ToastContainer
                limit={1}
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ minWidth: "100px" }}
                transition={Zoom} />


            {/* Po vendor select Module */}

            <Modal show={showPurchaseOrderModal} centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between border-bottom border-dark">
                        <h6 className="title-tag">
                            <img
                                 src={arw}
                                alt=""
                                className="me-3"
                                onClick={handleClose}
                            />
                            <span>Please Add/Select Vendor</span>
                        </h6>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Partner</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={() => navigate('/createvendor')}>+ Add New Vendor</Button>
                    </div>
                       <select
                        name="vendor"
                        required
                        value={selectedVendor}
                        onChange={handleVendorChange}
                        className='vendorsname border-top-0 border-left-0 border-right-0'
                    >
                        {Array.isArray(vendorSelection) && vendorSelection.length > 0 ? (
                            vendorSelection?.map(vendor => (
                                <option key={vendor.vendor_id} value={vendor.vendor_id} data-vendor-type={vendor.vendor_type}>{vendor.vendor_name}</option>
                            ))
                        ) : (
                            <option value="">No vendors available</option>
                        )}
                    </select>

                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'  onClick={routePo}>Ok</Button>
                    </div>
                </div>
            </Modal>

            {/* Po vendor select Module closed */}

            {/* service order select Module */}

            <Modal show={showServiceOrderModel} centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between border-bottom border-dark">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                                onClick={handleCloseSo}
                            />
                            <span>Please Add/Select Partner</span>
                        </h6>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Partner</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={() => navigate('/createvendor')}>+ Add New Partner</Button>
                    </div>
                       <select
                        name="partner"
                        required
                        value={selectPartner}
                        onChange={handlePartnerChange}
                        className='vendorsname border-top-0 border-left-0 border-right-0'
                    >
                        {Array.isArray(getpartnerList) && getpartnerList.length > 0 ? (
                            getpartnerList?.map(partner => (
                                <option key={partner.partnerId} value={partner.partnerId}>{partner.partnerName}</option>
                            ))
                        ) : (<option value="">No vendors available</option>)
                        }
                    </select>

                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={handleCloseSo}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'  onClick={routeSo}>Ok</Button>
                    </div>
                </div>
            </Modal>
             {/* service order select Module */}

            {/* PI client select Module */}

            <Modal show={showproformaModal} centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between border-bottom border-dark">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                                onClick={handleClose}
                            />
                            <span>Please Add/Select Client</span>
                        </h6>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Client</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={() => navigate('/CreateClient')}>+ Add New Client</Button>
                    </div>
                       <select
                        name="vendor"
                        required
                        value={selectedClient}
                        onChange={handleClientChange}
                        className='vendorsname border-top-0 border-left-0 border-right-0'
                    >
                        {Array.isArray(clientSelection) && clientSelection.length > 0 ? (
                            clientSelection?.map(client => (
                                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
                            ))
                        ) : (
                            <option value="">No clients available</option>
                        )}
                    </select>

                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'  onClick={routePI}>Ok</Button>
                    </div>
                </div>
            </Modal>

            {/* Po vendor select Module closed */}

            <Modal show={showInvoiceModal} centered className="sm-modal">
                <div className="wrap">
                    <div className="d-flex justify-content-between border-bottom border-dark">
                        <h6 className="title-tag">
                            <img
                                src={arw}
                                alt=""
                                className="me-3"
                                onClick={handleClose1}
                            />
                            <span>Please Add/Select Client</span>
                        </h6>
                    </div>

                    <div className='d-flex justify-content-between align-items-center mb-4 mt-4'>
                        <span>Select Client</span>
                        <Button size='sm' className='addcategory-btn' variant='outline-dark' onClick={() => navigate('/CreateClient')}>+ Add New Client</Button>
                    </div>
                       <select
                        name="vendor"
                        required
                        value={selectedClient}
                        onChange={handleClientChange}
                        className='vendorsname border-top-0 border-left-0 border-right-0'
                    >
                        {Array.isArray(clientSelection) && clientSelection.length > 0 ? (
                            clientSelection?.map(client => (
                                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
                            ))
                        ) : (
                            <option value="">No clients available</option>
                        )}
                    </select>

                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={handleClose1}>
                            Cancel
                        </Button>
                        <Button type="submit" className='submit submit-min'  onClick={routeClients}>Ok</Button>
                    </div>
                </div>
            </Modal>

        </>
    );
};

export default SalespurchaseList;