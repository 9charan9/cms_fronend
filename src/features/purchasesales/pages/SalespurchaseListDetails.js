import React, { lazy, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { Form, useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import arwdown from "../../../assets/Images/down_arw.svg";
import arwup from "../../../assets/Images/up_arrow.svg"
import editfill from "../../../assets/Images/editfill.svg";
import cancelfill from "../../../assets/Images/cancelfill.svg";
import pdfImage from "../../../assets/Images/pdf.svg";
import Uarw from "../../../assets/Images/u-arw.png"
import { getPDFDocumentDeatilsForAll, getPurchaseOrderCancelledListDetials, selectGetAllPDFData, selectLoadingState, selectPurchaseOrderCancelledList, deleteDraftListDetials } from '../slice/SalesSlice';
import { PurchaseLists } from './PurchaseLists';
import { poDraftForm, selectgetDraftpoList } from '../../forecastpo/slice/ForecastSlice';
import { PDFViewer } from '@react-pdf/renderer';
import Quixote from '../../../components/PDF';
import { approvaltab, tableContent, textToast } from '../../../utils/TableContent';



const SalespurchaseList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const draftdetails = useSelector(selectgetDraftpoList);
    const getCancelledList = useSelector(selectPurchaseOrderCancelledList);
    const CancelledList = getCancelledList?.body;
    console.log(CancelledList, "===================");
    const getdraftList = draftdetails?.body;
    const pdfData = useSelector(selectGetAllPDFData);
    const data = pdfData?.body;
    const [draftList, setdraftList] = useState([])
    const [key, setKey] = useState('Active');
    const isLoading = useSelector(selectLoadingState);
    const [showpdfPreview, setshowpdfPreview] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const PurchaseListsLazy = React.lazy(() => import('./PurchaseLists'));
    const [showdelete, setShowdelete] = useState(false);
    const [poId, setPOId] = useState("");
    const handleClose = () => setShowdelete(false);
    useEffect(() => {
        dispatch(poDraftForm());
        dispatch(getPurchaseOrderCancelledListDetials());
    }, [dispatch])

    // const editpo = (item) => {
    //     if (item?.po_id && item?.vendor_id) {
    //         console.log(item.vendor_id, "om");
    //         let path = `/editPoForm`;
    //         navigate(path, { state: { poid: item.po_id, vendorid: item.vendor_id } });
    //     }
    // }

    const handleDocumentClick = async (poId) => {
        const POID = poId.split("/");
        let splitedpoId = POID[1].replace(/^D/, '');
        const request = {
            "document_id": poId
        }
        try {
            const promise = await dispatch(getPDFDocumentDeatilsForAll(request));
            setSelectedDocument(splitedpoId);
            setshowpdfPreview(true);
        }
        catch (err) {
            console.log(err);
        }

    };
    const deletedraft = (po_ids) => {
        console.log(po_ids, "ommm");
        setPOId(po_ids);
        setShowdelete(true);

    }

    const handleClosedelete = async () => {
        const request = {
            "pk_id": poId
        }
        dispatch(deleteDraftListDetials(request)).then(() => {
            // After deleting, fetch and update the product list           
            dispatch(poDraftForm());
            setShowdelete(false)
        });
    }



    const editdraft = (item) => {
        console.log(item)
        if (item?.inv_id) {
            // console.log(item.inv_id,"ommm");
            let path = `/editinvoice`;
            navigate(path, { state: { inv_id: item.inv_id, "draftinvoice": "draftinvoice" } });
        } else if (item?.so_id) {
            let path = "/EditServiceOrder";
            navigate(path, { state: { so_id: item?.so_id, tab: "Draft" } });
        } else if (item?.pi_id) {
            let path = `/editproformainvoice`;
            navigate(path, { state: { pi_id: item.pi_id } });
        } else if (item?.po_id && item?.vendor_id) {
            let path = `/editPoForm`;
            navigate(path, { state: { poid: item.po_id, vendorid: item.vendor_id } });
        } else if (item?.Client_Purchaseorder_num) {
            let path = `/editclientpo`;
            navigate(path, { state: { clientpurchaseordernum: item.Client_Purchaseorder_num } })
        } else if (item?.dfcpo_id) {
            let path = `/editforecastpo`;
            navigate(path, { state: { fcpo_id: item.dfcpo_id, "isDraft": "isDraft" } })
        }


    };

    const loader = (
        <div className="spinner-backdrop">
            <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );



    return (
        <>

            <div className='d-flex justify-content-between position-relative d-flex-mobile pt-2'>
                <div className='d-flex align-items-center'>

                    <div className='innertab-sec'>
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="Active" title="Active">
                                <React.Suspense fallback={loader}>
                                    <PurchaseListsLazy />
                                </React.Suspense>
                            </Tab>
                            <Tab eventKey="Quotations" title="Cancelled">
                                <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr className='cancle_tr'>
                                                    <th>{tableContent?.orderNo}</th>
                                                    <th>{approvaltab?.companyName}</th>
                                                    <th>{approvaltab?.transactionName}</th>
                                                    <th>{approvaltab?.documentNumber}</th>
                                                    <th>{approvaltab?.status}</th>
                                                    <th>{approvaltab?.lastDateModified}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(CancelledList) && CancelledList?.map((item, index) => {
                                                    const allpo_ids = item?.Client_Purchaseorder_num || item?.po_id || item?.pi_id || item?.inv_id || item?.so_id || item?.fcpo_id;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item?.ship_to?.company_name || item?.primary_document_details?.client_name}</td>
                                                            <td><span className='border-item'>{item?.primary_document_details?.transaction_name || item?.primary_document_details?.document_title}</span></td>
                                                            <td onClick={() => handleDocumentClick(allpo_ids)}><span className='border-item'>{item?.Client_Purchaseorder_num || item?.po_id || item?.pi_id || item?.inv_id || item?.so_id || item?.fcpo_id}</span></td>
                                                            <td className="text-danger text-capitalize">Cancelled</td>
                                                            <td>{item?.last_modified_date || "-"}</td>
                                                        </tr>
                                                    )
                                                })}

                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Drafts" title="Drafts">
                                <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr>
                                                    <th>{approvaltab?.sNo}</th>
                                                    <th>{approvaltab?.companyName}</th>
                                                    <th>{approvaltab?.transactionName}</th>
                                                    <th>{approvaltab?.documentNumber}</th>
                                                    <th>{approvaltab?.status}</th>
                                                    <th>{approvaltab?.lastDateModified}</th>
                                                    <th>{approvaltab?.actions}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(getdraftList) && getdraftList.length > 0 ? (
                                                    getdraftList.map((item, index) => {
                                                        const po_ids = item?.dfcpo_id || item?.po_id || item?.inv_id || item?.so_id || item?.pi_id || item?.Client_Purchaseorder_num;
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item?.kind_attn?.company_name || item?.company_name || item?.primary_document_details?.client_name}</td>
                                                                <td>{item?.primary_document_details?.transaction_name || item?.transaction_name || item?.primary_document_details?.document_title}</td>
                                                                <td style={{ textDecorationLine: "underline" }} onClick={() => handleDocumentClick(po_ids)}>{item?.dfcpo_id || item?.po_id || item?.inv_id || item?.so_id || item?.pi_id || item?.Client_Purchaseorder_num}</td>
                                                                <td className="text-success text-capitalize">{item.status}</td>
                                                                <td>{item?.modified_date}</td>
                                                                <td> <MdEdit onClick={(e) => editdraft(item)} role="button" /> <MdDelete onClick={(e) => deletedraft(po_ids)} role="button" /></td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className='text-center'>{textToast?.noData}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="ReturnOrder" title="Return Order">
                                <div className='salestablealign'>
                                    <div className='table-responsive mt-2'>
                                        <Table className='salestable'>
                                            <thead>
                                                <tr>
                                                    <th>Order No</th>
                                                    <th>Company Name</th>
                                                    <th>Transaction Name</th>
                                                    <th>Document Number</th>
                                                    <th>Request Status</th>
                                                    <th>Tracking</th>
                                                    <th>Status</th>
                                                    <th>Last Date Modified</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>PTG-1</td>
                                                    <td>Excel Electronics</td>
                                                    <td><span className='border-item'>Client order for final product</span></td>
                                                    <td><span className='border-item'>CPO-PO00001</span></td>
                                                    <td>Return Requested</td>
                                                    <td>Received</td>
                                                    <td>Open</td>
                                                    <td>27/11/2023,10:53 Am</td>
                                                    <td><img src={editfill} /></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>

                <Modal
                    show={showpdfPreview}
                    size="lg"
                    centered
                    onHide={() => setshowpdfPreview(false)}
                >
                    <Modal.Header closeButton>
                        {""}
                    </Modal.Header>
                    {selectedDocument && (
                        <div>
                            <PDFViewer style={{ width: "100%", height: "700px" }}>
                                <Quixote data={data} type={selectedDocument} />
                            </PDFViewer>

                        </div>
                    )}
                </Modal>

                <Modal show={showdelete} onHide={handleClose} centered>
                    {/* <Modal.Header closeButton>
                    </Modal.Header> */}
                    <Modal.Body className='text-center'>Are you sure you want to delete ? </Modal.Body>
                    <Modal.Footer className='text-center border-0 justify-content-center'>
                        <Button className='cancel' onClick={handleClose}>
                            No
                        </Button>
                        <Button className='submit' onClick={handleClosedelete}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
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

export default SalespurchaseList;