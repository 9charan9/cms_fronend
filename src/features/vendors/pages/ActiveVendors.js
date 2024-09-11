import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import edit from '../../../assets/Images/edit.svg';
import Active from '../../../assets/Images/active.svg';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { changeVendorStatus, selectLoadingStatus ,selectVendorType, listSelection } from '../slice/VendorSlice';
import{tableContent, textToast, formFieldsVendor} from "../../../utils/TableContent"

const ActiveVendors = (props) => {
    const [showdelete, setShowdelete] = useState(false);
    const [vendorId, setVendorId] = useState(""); 
    const [partnerId, setPartnerId] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingStatus)
    const typeSelection = useSelector(selectVendorType);
    console.log(typeSelection);
    const activeVendorsData = typeSelection?.body;
    const vendorListType = props?.type;
    console.log(props?.type);
    console.log(activeVendorsData,"typeSelectiontypeSelection")

    const deleteShowModal = (e, vendor) => {
        if (vendorListType !== "Partners"){
            setVendorId(vendor.vendor_id)
            setShowdelete(true);
        }
        else {
            setPartnerId(vendor.partner_id)
            setShowdelete(true);  
        }
       
    }

    const handleClosedelete = async () => {
        setShowdelete(false)
    }
    const handleTableRowClick = (event, vendor) => {
        if (!event.target.parentElement.lastElementChild.isSameNode(event.target)) {
            let path;
            if (vendorListType !== "Partners") {
                path = `/vendorsdetails`;
            } else {
                path = `/vendorpartnersdetails`;
            }
            navigate(path, {
                state: {
                    vendor_id: vendor?.vendor_id || vendor?.partner_id,
                    vendor_name: vendor?.vendor_name || vendor?.partner_name,
                    partner_type : vendor?.partner_type
                },
            });
        };
        }

    const handleStatusChange = async (e) => {
        handleClosedelete()
        let requestBody;
        if (vendorListType !== "Partners"){
             requestBody = {
                "vendor_id": vendorId,
                "status": "InActive"
            }
        }
        else {
            requestBody = {
                "partner_id": partnerId,
                "status": "InActive"
            }
        }
      
        await dispatch(changeVendorStatus(requestBody))
        console.log(requestBody);
        const requestobj ={
            status:"Active",
            type:props.type
        }
        await dispatch(listSelection(requestobj))
        handleClosedelete()
    }

    const editvendor = (vendor) => {
        const type = vendorListType !== "Partners" ? "Vendor" : "Partner";
        navigate('/editvendor', { 
        state: {
            vendor_id: vendor?.vendor_id || vendor?.partner_id,
            vendor_name: vendor?.vendor_name || vendor?.partner_name,
            type: type, category : vendor?.categories
        },
    });
    }
    useEffect(()=>{
        const requestobj ={
            status:"Active",
            type:props.type
        }
        console.log(props.type,"typeeeeeeeeeee ")
        dispatch(listSelection(requestobj))
    },[props.type])
   
    return (
        <>

            <div className='wrap'>
                <div className='table-responsive mt-4'>
                    <Table className='b-table b-tablefirsttd'>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                {/* <th>{vendorListType !== "Partners" ? "Vendor Id" : "Partner Id"}</th> */}
                                <th>{vendorListType !== "Partners" ? "Vendor Name" : "Partner Name"}</th>
                                <th>{vendorListType !== "Partners" ? "Vendor Type" : "Partner Type"}</th>
                                {vendorListType !== "Partners" && <th>{tableContent.categories}</th>}
                                {/* {vendorListType !== "Partners" && <th>{tableContent.prodType}</th>} */}
                                <th>{tableContent.contactDetails}</th>
                                <th>{tableContent.email}</th>
                                <th>{tableContent.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                           <tr>
                             <td colSpan="8" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                            {activeVendorsData && Array.isArray(activeVendorsData) && activeVendorsData?.map((vendor, index) => (
                                <tr key={index} onClick={(e) => handleTableRowClick(e, vendor)}>
                                    <td>{index + 1}</td>
                                    {/* <td>{vendorListType !== "Partners" ? vendor.vendor_id : vendor?.partner_id}</td> */}
                                    <td>{vendorListType !== "Partners" ? vendor.vendor_name : vendor?.partner_name}</td>
                                    <td>{vendorListType !== "Partners" ? vendor.vendor_type : Array.isArray(vendor?.partner_type) ? vendor.partner_type.join(' & ') : vendor?.partner_type}</td>
                                    {vendorListType !== "Partners" && <td>{vendor.categories}</td>}
                                    {/* {vendorListType !== "Partners" && <td>{vendor.product_types}</td>} */}
                                    {/* <td>{vendor.contact_details}</td> */}
                                    <td className="contact-details-column">{vendor.contact_details}</td>
                                    <td className="contact-details-column">{vendor.email}</td>
                                    <td>
                                        <Button className='td-btn border-0 p-0 me-2' onClick={(e) => editvendor(vendor)} >
                                            <img src={edit} alt="" />
                                        </Button>
                                        <Button className='td-btn border-0 p-0'>
                                            <img src={Active} alt="" onClick={(e) => deleteShowModal(e, vendor)} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {(!activeVendorsData || activeVendorsData.length === 0) && (
                                <tr>
                                    <td colSpan="8" className="text-center">{textToast.noData}</td>
                                </tr>
                            )}
                            </>
                          )}
                        </tbody>
                    </Table>
                </div>
            </div>
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">{formFieldsVendor.loader}</span>
                    </Spinner>
                </div>
            )}
            <Modal show={showdelete} onHide={handleClosedelete} centered>
                <Modal.Body className='text-center pb-0'>
                    {textToast.actTOinact}
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>
                    <div className='mt-3 d-flex justify-content-center'>
                        <Button type="button" className='cancel me-2' onClick={handleClosedelete}>No</Button>
                        <Button type="submit" className='submit submit-min' onClick={handleStatusChange}>Yes</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ActiveVendors;
