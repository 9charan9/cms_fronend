import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ActiveVendors from './ActiveVendors';
import InactiveVendors from './InactiveVendors';
import { ToastContainer, Zoom } from 'react-toastify';
import queryString from "query-string";
import Form from "react-bootstrap/Form";
import { vendorListTable, formFieldsVendor } from '../../../utils/TableContent';

const VendorsList = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const [key, setKey] = useState(queryParams.tab || 'Active');
    const [selectedOption, setSelectedOption] = useState("all_vendors");
    const [form, setForm] = useState({
        type: "all_vendors",
    })


    useEffect(() => {
        navigate(`?tab=${key}`);
    }, [key, navigate]);
    const routeaddvendor = () => {
        navigate('/createvendor')
    }
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
        const selectedValue = e.target.value;
        const type = selectedValue;
        setForm((prevForm) => ({
            ...prevForm,
            type: type,
            [e.target.name]: selectedValue,
        }));
        console.log(type, "typeeeeeeeeeeeeeeeee")
    };
    return (
        <>
            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0 mb-responsive'>{vendorListTable.listofVendors}</h1>
                        <div className='tab-sec'>
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                            >
                                <Tab eventKey="Active" title={selectedOption !== "Partners" ? "Active Vendors" : "Active Partners"}>
                                    {key == "Active" ? (<ActiveVendors type={form.type} />) : (null)}
                                </Tab>
                                <Tab eventKey="InActive" title={selectedOption !== "Partners" ? "Inactive Vendors" : "Inactive Partners"}>
                                    {key == "InActive" ? (<InactiveVendors type={form.type} />) : (null)}
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
<div className='d-flex'>
                <Form.Group className="mb-4 me-2">
                  <Form.Select
                    type="text"
                    placeholder=""
                    name="type"
                    value={form.type}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="all_vendors">{vendorListTable.allVendors}</option>
                    <option value="Mechanic">{vendorListTable.mcatVendors}</option>
                    <option value="Electronic">{vendorListTable.ecatVendors}</option>
                    {/* <option value="Mec&Ele">{vendorListTable.meCatVendors}</option> */}
                    <option value="Partners">{formFieldsVendor.partnersCat}</option>
                  </Form.Select>
                </Form.Group>
                    <Button variant="outline-dark" className='add_new_category' onClick={routeaddvendor}>
                        {formFieldsVendor.createFormHeaderV} / Partner
                    </Button>
                    </div>
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
        </>
    );
};

export default VendorsList;