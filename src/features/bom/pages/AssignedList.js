import React from 'react';
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import edit from '../../../assets/Images/edit.svg';
import Delete from '../../../assets/Images/Delete.svg';
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
const AssignedList = () => {

    return (
        <>

            <div className='wrap'>
                <div className='table-responsive mt-4'>
                    <Table className='b-table'>
                        <thead>
                            <tr>
                                <th>Bom Name</th>
                                <th>Assign ID</th>
                                <th>Assign Name</th>
                                <th>Assign Date</th>
                                <th>Quantity</th>                              
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                          
                            <tr>
                                <td>Test</td>
                                <td>BOM2</td>
                                <td>1AB789</td>                              
                                <td>18/05/2023</td>
                                <td>2000.00</td>
                                <td>
                                <Button className='td-btn border-0 p-0 me-1'> <img src={edit} alt="" /></Button>
                                <Button  className='td-btn border-0 p-0'> <img src={Delete} alt="" /></Button> 
                                </td>                             
                            </tr>
                            <tr>
                                <td>Test</td>
                                <td>BOM2</td>
                                <td>1AB789</td>                                
                                <td>18/05/2023</td>
                                <td>2000.00</td>
                                <td>
                                <Button className='td-btn border-0 p-0 me-1'> <img src={edit} alt="" /></Button>
                                <Button  className='td-btn border-0 p-0'> <img src={Delete} alt="" /></Button>
                                </td>                             
                            </tr>
                       
                        </tbody>
                    </Table>
                </div>
            </div>

        </>
    );
};

export default AssignedList;
