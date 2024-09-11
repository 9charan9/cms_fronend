import React, { useState, useEffect } from "react";
import { Tabs, Tab, Form, Table } from 'react-bootstrap';
import cancelfill from "../../../assets/Images/cancelfill.svg";
import approve from "../../../assets/Images/approve.png";
import { useSelector, useDispatch } from "react-redux";
import { cmsPsApprovalsTab, selectPsApprovalsData, selectLoadingState, cmsChnageStatusPendiing, getPDFDocumentDeatilsForAll, selectGetAllPDFData, CmsGetInnerForcastPurchaseOrderDetails } from "../slice/SalesSlice";
import { tableContent, textToast, formFieldsVendor } from "../../../utils/TableContent"
import { Modal, Spinner, Alert } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { approvaltab } from "../../../utils/TableContent";
import { MdEdit } from "react-icons/md";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import Quixote from "../../../components/PDF";
import { useNavigate } from "react-router";

const ApprovalsListDetails = () => {
    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(true);
    const getApprovalsData = useSelector(selectPsApprovalsData);
    console.log(getApprovalsData,"getApprovalsData==========================");
    const approvalsData = getApprovalsData?.body;
    const [key, setKey] = useState("Pending");
    const [showRejected, setShowRejected] = useState(false);
    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoadingState)

    const pdfData = useSelector(selectGetAllPDFData);
    const data = pdfData?.body;

    const [showdelete, setShowdelete] = useState(false);
    const [poId, setPOId] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successPopUp, setSuccessPopUp] = useState("")
    const [approvalInProgress, setApprovalInProgress] = useState("");
    const [showpdfPreview, setshowpdfPreview] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    // const handleSuccessModalClose = async () => {
    //  setShowSuccessModal(false);
    //    handleClosedelete()
    //}


    const HandleTabChange = (key) => {
        console.log(key);
        setKey(key)
        if (key === "Pending") {
            const request = {
                "status": "Pending"
            }
            dispatch(cmsPsApprovalsTab(request))
        }
        else if (key === "Approved") {
            const request = {
                "status": "Approved"
            }
            dispatch(cmsPsApprovalsTab(request))
        }
        else if (key === "Rejected") {
            const request = {
                "status": "Rejected"
            }
            dispatch(cmsPsApprovalsTab(request));
        }
    }
    console.log(poId);
    const approvalShowModal = (data, reject) => {
        console.log(reject)
        setPOId(data?.po_id);
        setShowdelete(true);
        if (reject === false) {
            setApprovalInProgress("Approve")
            setSuccessPopUp("Approve")
        }
        else {
            setApprovalInProgress("Reject")
            setSuccessPopUp("Reject")
        }
    }

    const handleEdit = (data) => {
        console.log(data)
        let uniqID = data?.po_id?.slice(4, 6);
        console.log(uniqID, "ommmmmm");

        if (uniqID === "FC") {
            console.log(data?.po_id, "ommmmmmmmmmmmmmmm");
            navigate("/editforecastpo", {
                state: { fcpo_id: data?.po_id, isStatus: "Rejected" }
            })
        }
        else if (uniqID === "SO") {
            navigate("/EditServiceOrder", {
                state: { so_id: data?.po_id, isStatus: "Rejected" }

            })
        }
        else if (uniqID === "PI") {          
            navigate("/editproformainvoice", {
              state: { pi_id: data?.po_id, isStatus: "Rejected" }
            });
          } 

          else if (uniqID === "PO") {   
            return;       
            // navigate("/editPoForm", {
            //   state: { po_id: data?.po_id, isStatus: "Rejected" }
            // });
          }   

          else if (uniqID === "IN") {          
            navigate("/editinvoice", {
              state: { inv_id: data?.po_id, isStatus: "Rejected" }
            });
          } 

          else if (uniqID === "CF") { 
            // alert("Omm")   
            return; 
            // navigate("/editclientpo", {
            //   state: { inv_id: data?.po_id, isStatus: "Rejected" }
            // });
          }
    }

    const handleDocumentClick = (poId) => {
        const POID = poId.split("/");
        let splitedpoId = POID[1];
        const request = {
            "document_id": poId
        }
        dispatch(getPDFDocumentDeatilsForAll(request));
        setSelectedDocument(splitedpoId);
        setshowpdfPreview(true);
    };


    const handleClosedelete = async () => {
        setShowdelete(false)
        setShowRejected(false)
    }

    const handleStatusChangeApprove = async () => {
        const requestBody = {
            "po_id": poId,
            "status": "Approved"
        }
        await dispatch(cmsChnageStatusPendiing(requestBody))
        const request = {
            "status": "Pending"
        }
        dispatch(cmsPsApprovalsTab(request))
        dispatch(CmsGetInnerForcastPurchaseOrderDetails());
        handleClosedelete()
        // setShowSuccessModal(true) 

    }

    const handleStatusChangeReject = async () => {
        const requestBody = {
            "po_id": poId,
            "status": "Rejected"
        }
        await dispatch(cmsChnageStatusPendiing(requestBody))
        const request = {
            "status": "Pending"
        }
        dispatch(cmsPsApprovalsTab(request))
        handleClosedelete()
        //setShowSuccessModal(true)

    }

    useEffect(() => {
        const request = {
            "status": "Pending"
        }
        dispatch(cmsPsApprovalsTab(request))
    }, [])


    return (
        <>
            <div className='d-flex justify-content-between position-relative d-flex-mobile pt-2'>
                <div className='d-flex align-items-center'>
                    <div className='innertab-sec'>
                        <Tabs
                            id="innerTabs"
                            activeKey={key}
                            onSelect={HandleTabChange}

                        >
                            <Tab eventKey="Pending" title="Pending">
                                {key === "Pending" ? (
                                    <>
                                        <div className='salestablealign'>
                                            <div className='table-responsive mt-2'>
                                                <Table className='salestable'>
                                                    <thead>
                                                        <tr>
                                                            <th>{approvaltab?.sNo}</th>
                                                            <th>{approvaltab?.documentNumber}</th>
                                                            <th>{approvaltab?.companyName}</th>
                                                            <th>{approvaltab?.transactionName}</th>
                                                            <th>{approvaltab?.creationdate}</th>
                                                            <th>{approvaltab?.dueDate}</th>
                                                            <th>{approvaltab?.amount}</th>
                                                            <th>{approvaltab?.actions}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(approvalsData) && approvalsData?.length > 0 ? (approvalsData?.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td style={{ textDecorationLine: "underline" }} onClick={() => handleDocumentClick(data?.po_id)}> {data?.po_id || "-"}</td>
                                                                <td> {data?.kind_attn?.company_name || data?.ship_to?.client_name || "-"} </td>
                                                                <td> {data?.primary_document_details?.transaction_name || data?.ship_to?.document_title || "-"} </td>
                                                                <td> {data?.primary_document_details?.po_date || data?.primary_document_details?.so_date || data?.primary_document_details?.invoice_date || data?.primary_document_details?.document_date || "-"} </td>
                                                                <td> {data?.days_difference || "-"} </td>
                                                                <td> {data?.total_amount?.grand_total || data?.total_amount?.grandTotal || data?.grand_total || "-"} </td>
                                                                <td>
                                                                    <Button className='td-btn border-0 p-0'>
                                                                        <img src={approve} className="approve" alt="" onClick={() => approvalShowModal(data, false)} />
                                                                    </Button>
                                                                    <Button className='td-btn border-0 p-0'>
                                                                        <img src={cancelfill} alt="" onClick={() => approvalShowModal(data, true)} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        ) : (
                                                            <>
                                                                <tr>
                                                                    <td colSpan="11" className="text-center">
                                                                        {textToast.noData}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </tbody>

                                                </Table>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </Tab>
                            <Tab eventKey="Approved" title="Approved">
                                {key == "Approved" ? (
                                    <>
                                        {/* Content for Approved inner tab */}
                                        <div className='salestablealign'>
                                            <div className='table-responsive mt-2'>
                                                <Table className='salestable'>
                                                    <thead>
                                                        <tr>
                                                            <th>{approvaltab?.sNo}</th>
                                                            <th>{approvaltab?.documentNumber}</th>
                                                            <th>{approvaltab?.companyName}</th>
                                                            <th>{approvaltab?.transactionName}</th>
                                                            <th>{approvaltab?.creationdate}</th>
                                                            <th>{approvaltab?.dueDate}</th>
                                                            <th>{approvaltab?.amount}</th>
                                                            <th>{approvaltab?.status}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {Array.isArray(approvalsData) && approvalsData?.length > 0 ? (approvalsData?.map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td style={{ textDecorationLine: "underline" }} onClick={() => handleDocumentClick(data?.po_id)}> {data?.po_id}</td>
                                                                    <td> {data?.kind_attn?.company_name || data?.ship_to?.client_name || "-"} </td>
                                                                    <td> {data?.primary_document_details?.transaction_name || data?.ship_to?.document_title || "-"} </td>
                                                                    <td> {data?.primary_document_details?.po_date || data?.primary_document_details?.so_date || data?.primary_document_details?.invoice_date || data?.primary_document_details?.document_date} </td>
                                                                    <td> {data?.days_difference} </td>
                                                                    <td> {data?.total_amount?.grand_total || data?.total_amount?.grandTotal || data?.grand_total} </td>
                                                                    <td className="text-success"> {data?.status}</td>

                                                                </tr>
                                                            )
                                                        })
                                                        ) : (
                                                            <>
                                                                <tr>
                                                                    <td colSpan="11" className="text-center">
                                                                        {textToast.noData}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                        }

                                                    </tbody>

                                                </Table>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </Tab>
                            <Tab eventKey="Rejected" title="Rejected">
                                {key == "Rejected" ? (
                                    <>
                                        {/* Content for Rejected inner tab */}
                                        <div className='salestablealign'>
                                            <div className='table-responsive mt-2'>
                                                <Table className='salestable'>
                                                    <thead>
                                                        <tr>
                                                            <th>{approvaltab?.sNo}</th>
                                                            <th>{approvaltab?.documentNumber}</th>
                                                            <th>{approvaltab?.companyName}</th>
                                                            <th>{approvaltab?.transactionName}</th>
                                                            <th>{approvaltab?.creationdate}</th>
                                                            <th>{approvaltab?.dueDate}</th>
                                                            <th>{approvaltab?.amount}</th>
                                                            <th>{approvaltab?.status}</th>
                                                            <th>actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(approvalsData) && approvalsData?.length > 0 ? (approvalsData?.map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td style={{ textDecorationLine: "underline" }} onClick={() => handleDocumentClick(data?.po_id)}> {data?.po_id}</td>
                                                                    <td> {data?.kind_attn?.company_name || data?.ship_to?.client_name || "_"} </td>
                                                                    <td> {data?.primary_document_details?.transaction_name || data?.primary_document_details?.document_title || "-"} </td>
                                                                    <td> {data?.primary_document_details?.po_date || data?.primary_document_details?.so_date || data?.primary_document_details?.PI_date || data?.primary_document_details?.invoice_date || "-"} </td>
                                                                    <td> {data?.days_difference || "_"} </td>
                                                                    <td> {data?.total_amount?.grand_total || data?.grand_total} </td>
                                                                    <td className="text-danger"> {data?.status}</td>
                                                                    <td><MdEdit onClick={(e) => handleEdit(data)} role="button" /></td>

                                                                </tr>
                                                            )
                                                        })
                                                        ) : (
                                                            <>
                                                                <tr>
                                                                    <td colSpan="11" className="text-center">
                                                                        {textToast.noData}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                        }
                                                    </tbody>

                                                </Table>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </Tab>
                        </Tabs>

                    </div>
                </div>
                <div className="d-flex justify-content-end align-center mt-0 d-flex-mobile-align">
                    <Form.Group className="mb-0">
                        <Form.Control type="search" placeholder="Search" />
                    </Form.Group>
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
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">{formFieldsVendor.loader}</span>
                    </Spinner>
                </div>
            )}
            <Modal show={showdelete} onHide={handleClosedelete} centered>
                <Modal.Body className='text-center pb-0'>
                    {textToast.approvedtext}
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>

                    <div className='mt-3 d-flex justify-content-center'>
                        <Button type="button" className='cancel me-2' onClick={handleClosedelete}>Cancel</Button>
                        {approvalInProgress === "Approve" ?
                            <Button type="submit" className='submit submit-min' onClick={handleStatusChangeApprove}>Approve</Button>
                            : <Button type="submit" className='submit submit-min' onClick={handleStatusChangeReject}>Reject</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
            {/*<Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
                <Modal.Body className='text-center pb-0'>
                    {successPopUp === "Approve" ? "Approved successfully" : "Rejected successfully"}
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>
                    
                </Modal.Footer>
                    </Modal>*/}
        </>
    );
};

export default ApprovalsListDetails;
