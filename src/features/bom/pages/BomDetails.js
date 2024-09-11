import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import BomList from './BomList';
import AssignedList from './AssignedList';
const BomDetails = () => {
    const [key, setKey] = useState('bomlist');
    const navigate = useNavigate();
    localStorage.setItem("bomlistdetailsActivetab", 'OriginalPartNo');
    localStorage.setItem('nestedactiveTab', 'Mcategoryinfo');
    const routeaddbom = ()=>{
     navigate('/addbom')
   //  window.location.reload()
    }
    return (
        <>

            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0 mb-responsive'>Bill of Materials</h1>
                        <div className='tab-sec'>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            
                            >
                                <Tab eventKey="bomlist" title="BOM List">
                                    <BomList></BomList>
                                </Tab>
                                {/* <Tab eventKey="assignedlist" title="Assigned List">
                                    <AssignedList></AssignedList>
                                </Tab> */}
                              
                            </Tabs>

                        </div>


                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <Button variant="outline-dark" className='add_new_category' onClick={routeaddbom}>
                        Add BOM
                    </Button>
                     </div>


                </div>
            </div>


        </>
    );
};

export default BomDetails;