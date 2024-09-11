import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Products.css";
import Table from 'react-bootstrap/Table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductList, getvendorDetails, selectCategory, selectLoadingState, selectVendorDetails } from '../slice/ComponentSlice';
import { Spinner } from 'react-bootstrap';
import { ToastContainer, Zoom } from 'react-toastify';


const ComponentVendorDetails = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const vendorDetails = useSelector(selectVendorDetails);
    const isLoading = useSelector(selectLoadingState);
    const vendorItems = vendorDetails?.body;    
    const cmpt_id = props.cmpt_id
    console.log(cmpt_id,"cmpt_id  cmpt_id")
    const handleTableRowClick = (item) => {
        let path = `/vendorsdetails`;
        navigate(path, {
            state: item?.vendor_name,
            state: {
                vendor_id: item.vendor_id,
                vendor_name: item?.vendor_name,
                
            }
        });
    };
    useEffect(() => {
        const request = {
            "cmpt_id": cmpt_id
        }
        dispatch(getvendorDetails(request));
    }, [])
    return (

        <>
            <div className='wrap'>
                <div className='table-responsive mt-4'>
                    <Table className='c-table'>
                        <thead>
                            <tr>
                                {/* <th>Vendor Id</th> */}
                                <th>Vendor Name</th>
                                <th>Manufacturer Part No</th>
                                <th>Lead Time (weeks)</th>
                                <th>Warranty (yrs) </th>
                                <th>Price</th>
                                <th>GST %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendorItems && vendorItems.length > 0 ? (
                                vendorItems.map((item, index) => (
                                    <tr key={index} onClick={(e) => handleTableRowClick(item)}>
                                        {/* <td>{item?.vendor_id}</td> */}
                                        <td>{item?.vendor_name}</td>
                                        <td>{item?.mfr_part_number}</td>
                                        <td>{item?.lead_time || "-"}</td>
                                        <td>{item?.warranty || "-"}</td>
                                        <td>{item?.price + "Rs/-"}</td>
                                        <td>{item?.tax + "%"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center'>
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>


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
                    transition={Zoom} />
            </div>
        </>
    );
};

export default ComponentVendorDetails;
