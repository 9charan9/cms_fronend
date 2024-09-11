import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import edit from '../../../assets/Images/edit.svg';
import Active from '../../../assets/Images/active.svg';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { selectGetClientList, selectLoadingState, listSelection } from '../slice/ClientSlice';
import { tableContent, formFieldsVendor } from "../../../utils/TableContent";
const ClientList = () => {
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingState)
    const typeSelection = useSelector(selectGetClientList);
    console.log(typeSelection);
    const activeClientdata = typeSelection?.body;
    

  
    const handleTableRowClick = (event, item) => {
        if (!event.target.parentElement.lastElementChild.isSameNode(event.target)) {
            let path = `/clientdetails`;
            navigate(path, { state: item?.client_id });
        };
        }

    
    const routeadclent = () => {
        navigate('/createclient')
    }

    const editclient = (item) => {  
        let path = `/editclient`;
        navigate(path, { state: item?.client_id });
    }
  
    useEffect(()=>{
        const requestobj ={
            status: "Active"
        }        
        dispatch(listSelection(requestobj))
    },[dispatch])
    return (
        <>

            <div className='wrap'>
            <div className='d-flex justify-content-between position-relative'>                    
                        <h1 className='title-tag mb-0 mb-responsive'>List of Clients</h1> 
                    <Button variant="outline-dark" className='add_new_category' onClick={routeadclent}>
                        Create Client
                    </Button>                    
                </div>
                <div className='table-responsive mt-4'>
                    <Table className='b-table client-table'>
                        <thead>
                            <tr>
                                {/* <th>{tableContent?.clientId}</th> */}
                                <th>{tableContent?.clientName}</th>
                                <th>{tableContent?.typesofBOMs}</th>
                                <th>{tableContent?.contactDetails}</th>
                                <th>{tableContent?.email}</th>
                                <th>{tableContent?.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                           <tr>
                             <td colSpan="6" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                        {activeClientdata && Array.isArray(activeClientdata) && activeClientdata?.map((item, index) => (
                                <tr key={index} onClick={(e) => handleTableRowClick(e, item)}>
                                    {/* <td>{item?.client_id}</td> */}
                                    <td>{item?.client_name}</td>
                                    <td>{item?.types_of_boms}</td>
                                    <td className="contact-details-column">{item?.contact_number}</td>
                                    <td className="contact-details-column">{item?.email}</td>
                                    <td>
                                        <Button className='td-btn border-0 p-0 me-2' onClick={(e) => editclient(item)} >
                                            <img src={edit} alt="" />
                                        </Button>                                      
                                    </td>
                                </tr>
                            ))}
                            {(!activeClientdata || activeClientdata.length === 0) && (
                                <tr>
                                    <td colSpan="6" className="text-center">{tableContent?.nodata}</td>
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
                        <span className="visually-hidden">{formFieldsVendor?.loader}</span>
                    </Spinner>
                </div>
            )}
         
        </>
    );
};

export default ClientList;
