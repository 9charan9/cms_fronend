import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import edit from '../../../assets/Images/edit.svg';
import Delete from '../../../assets/Images/Delete.svg';
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { getbomlistingdetails, getBomList, selectLoadingState, deleteBOM, selectBomDeleted } from '../slice/BomSlice';
import { useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { ToastContainer, Zoom } from 'react-toastify';
import Dropdown from 'react-bootstrap/Dropdown';

const BomList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectLoadingState);
    const bomdetailsdata = useSelector(getbomlistingdetails);
    const [showdelete, setShowdelete] = useState(false);
    const [deleteBomName, setDeleteBomName] = useState('');
    const [deleteBomId, setDeleteBomId] = useState('');
    const bomDetails = bomdetailsdata?.body;
    const [bomlist, setBomlist] = useState([]);
    console.log(bomdetailsdata);
    const editRoute = (item) => {
        navigate("/editbom", {
            // state: item?.bom_name
            state: {
                bomName: item?.bom_name,
                bomId: item?.bom_id,
              },
        });
    }

    const duplicateRoute = (item) => {
        navigate("/cloneBom", {
            // state: item?.bom_name
            state: {
                bomName: item?.bom_name,
                bomId: item?.bom_id,
              },
        });
    }

    const deleteShowModal = (item) => {
        setDeleteBomName(item.bom_name);
        setDeleteBomId(item.bom_id);
        setShowdelete(true);
    }

    const handleClosedelete = async () => {
        setShowdelete(false)
    }

    const deletingBOM = async() => {
        let requestBody = {
            "bom_name": deleteBomName,
            "bom_id":deleteBomId,
        }
        // dispatch(deleteBOM(requestBody));
        try {
            const response = await dispatch(deleteBOM(requestBody));
            console.log("Delete BOM Response:", response?.payload?.statuscode);
            if (response?.payload?.statuscode === 200){
            const updatedBomlist = bomlist.filter((item) => item.bom_name !== deleteBomName);
            setBomlist(updatedBomlist);
        }
        handleClosedelete();
        await dispatch(getBomList());
        } catch (error) {
            console.error("Error deleting BOM:", error);
        }
       
    }
    const handleTableRowClick = (event, item) => {
        const clickedCell = event.target;
        const lastThreeCells = Array.from(clickedCell.parentElement.children).slice(-3);
        if (!lastThreeCells.includes(clickedCell)) {
            let path = `/bomlistdetails`;
            navigate(path, {               
                state: {
                    bom_name: item?.bom_name,
                    bom_id: item?.bom_id,
                    created_date:item?.created_date
                },
            });
        }
    };
    useEffect(() => {
        dispatch(getBomList());
    }, []);
    useEffect(() =>{
        if(!isLoading){
            setBomlist(bomDetails);
        }
    }, [bomDetails])
    return (
        <>

            <div className='wrap'>
                <div className='table-responsive mt-4 bomtable'>
                    <Table className='b-table b-tablefirsttd'>
                        <thead>
                            <tr>
                                {/* <th>Bom Id</th> */}
                                <th>S.NO</th>
                                <th>Bom Name</th>
                                <th>Categories</th>
                                <th>Components</th>
                                <th>Created Date</th>
                                {/* <th>Estimated Price</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                           <tr>
                             <td colSpan={7} className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                            {Array.isArray(bomlist) && bomlist.length > 0 ? bomlist.map((item,index) => {
                                return (
                                    <tr onClick={(e) => handleTableRowClick(e, item)}>
                                        {/* <td>{item?.bom_id}</td> */}
                                        <td>{index+1}</td>
                                        <td>{item?.bom_name}</td>
                                        <td>{item?.total_categories}</td>
                                        <td>{item?.total_components}</td>
                                        <td>{item?.created_date}</td>
                                        {/* <td>{item?.bom_price || "-"}</td> */}
                                        <td>
                                            {/* <Button className='td-btn border-0 p-0 me-1'> <img src={edit} alt="" onClick={() => editRoute(item)} /></Button>
                                            <Button className='td-btn border-0 p-0'> <img src={Delete} alt="" onClick={() => deleteShowModal(item.bom_name)} /></Button> */}
                                            <Dropdown>
                                                <Dropdown.Toggle variant="none"><span className='rotated-element'>&#8942;</span></Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => duplicateRoute(item)} >
                                                        Create Duplicate
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => editRoute(item)} >
                                                        Edit BOM
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => deleteShowModal(item)}>
                                                        Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr><td colSpan={7} className='text-center'>No Data Available</td></tr>
                            )}
                            </>
                          )}
                        </tbody>
                    </Table>


                </div>
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
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
            <Modal show={showdelete} onHide={handleClosedelete} centered>
                <Modal.Body className='text-center pb-0'>
                    Are you sure you want to delete ?
                </Modal.Body>
                <Modal.Footer className='border-0 justify-content-center'>
                    <div className='mt-3 d-flex justify-content-center'>
                        <Button type="button" className='cancel me-2' onClick={handleClosedelete}>No</Button>
                        <Button type="submit" className='submit submit-min' onClick={deletingBOM}>Yes</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BomList;
