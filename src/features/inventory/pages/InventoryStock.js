import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import { getStockDataAPI, selectIsLoadingInventory, selectStockResponse } from '../slice/InventorySlice';
import { useSelector, useDispatch } from "react-redux";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaSort } from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import * as XLSX from 'xlsx';

const InventoryStock = () => {
    const [key, setKey] = useState('Electronic');
    const [stockOption, setStockOption] = useState('All');
    const [form, setForm] = useState({
        type: "All", 
    })

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQueries, setSearchQueries] = useState({
        Electronic: '',
        Mechanic: '',
    });

    const isLoading = useSelector(selectIsLoadingInventory);
    const stockResponse = useSelector(selectStockResponse);
    const stockResponseData = stockResponse?.body
    const dispatch = useDispatch()

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleOptionChange = (e) => {
        setStockOption(e.target.value);
        const selectedValue = e.target.value;
        const type = selectedValue;
        setForm((prevForm) => ({
            ...prevForm,
            type: type,
            [e.target.name]: selectedValue,
        }));
    }


    // Use an empty array if stockBodyData is undefined or not an array
    const sortedData = Array.isArray(stockResponseData)
        ? [...stockResponseData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        })
        : [];

    const searchtable = (e) => {
        setSearchQueries({
            ...searchQueries,
            [key]: e.target.value,
        });
    };

    const filteredData = sortedData.filter((item) => {
        const lowerCaseQuery = searchQueries[key].toLowerCase();
        const nameIndex = (item.sub_ctgr || item.part_name || '').toLowerCase().indexOf(lowerCaseQuery);
        return (
            (nameIndex !== -1 && (item.sub_ctgr || item.part_name || '').toLowerCase().startsWith(lowerCaseQuery)) ||
            (item.ctgr_name || '').toLowerCase().includes(lowerCaseQuery) ||
            (item.quantity || '').toString().includes(lowerCaseQuery) ||
            (item.mfr_prt_num || '').toLowerCase().includes(lowerCaseQuery) ||
            (item.ptg_prt_num || '').toLowerCase().includes(lowerCaseQuery) ||
            (item.status || '').toLowerCase().includes(lowerCaseQuery)
        );
    });
    useEffect(() => {
        const requestBody = {
            "department": key,
            "stock_status": stockOption
        }
        dispatch(getStockDataAPI(requestBody))
    }, [key, stockOption, dispatch])

    const pdfdownload = () => {
        const headers = [['Part Name', 'Category', 'Quantity','Manufacturer', 'M.Part Number', 'PTG Part Number', 'Status']];
        const data = filteredData.map((product) => [
            product?.sub_ctgr || product?.part_name,
            product?.ctgr_name,
            product?.quantity,
            product?.manufacturer,
            product?.mfr_prt_num,            
            product?.ptg_prt_num,
            statusMapping[product?.status] || product?.status,
        ]);
        
        const worksheet = XLSX.utils.aoa_to_sheet(headers.concat(data));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Stock Details");

        XLSX.writeFile(workbook, 'inventory_stock_details.xlsx');
    };

    const statusMapping = {
        "Running_out_of_stock": "Running Out Of Stock",
        "In_stock" : "In Stock",
        "Out_of_Stock" : "Out Of Stock"   
      };

   return (
        <>
            <div className='inventory'>
                <h6>Stock</h6>

                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="Electronic" title="Electronic">
                        <div className='d-flex justify-content-end'>
                            <input type="search" onChange={(e) => searchtable(e)}
                                value={searchQueries.Electronic}
                                placeholder='Search for the Part/Component'
                                style={{ marginRight: '8px', fontSize: '10px',minWidth:'170px' }} />
                           
                                <Button
                                    className='submit me-2 md-me-2 submitmobile'
                                    onClick={pdfdownload}
                                    disabled={!filteredData.some(product => product?.sub_ctgr)}
                                >
                                    Download Electronic Stock Details
                                </Button>                           

                            <Form.Group >
                                <Form.Select aria-label="Default select example" style={{ maxWidth: '150px', textAlign: 'center' }}
                                    type="text"
                                    placeholder=""
                                    name="type"
                                    value={form.type}
                                    onChange={handleOptionChange}
                                    required
                                >
                                    <option value="All">All</option>
                                    <option value="In_stock">In Stock</option>
                                    <option value="Out_of_Stock">Out Of Stock</option>
                                    <option value="Running_out_of_stock">Running Out Of Stock</option>
                                </Form.Select>
                            </Form.Group>
                        </div>

                        <div className="table-responsive mt-4">
                            <Table className="b-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th onClick={() => handleSort('sub_ctgr')}>Part Name <FaSort /></th>
                                        <th onClick={() => handleSort('ctgr_name')}>Category <FaSort /></th>
                                        <th onClick={() => handleSort('quantity')}>Quantity <FaSort /></th>
                                        <th onClick={() => handleSort('manufacturer')}>Manufacturer <FaSort /></th>
                                        <th onClick={() => handleSort('mfr_prt_num')}>Manufacturer Part No<FaSort /></th>
                                        <th onClick={() => handleSort('ptg_prt_num')}>PTG Part Number <FaSort /></th>
                                        {/* <th>Supplier</th> */}
                                        <th onClick={() => handleSort('status')}>Status <FaSort /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData && Array.isArray(filteredData) && filteredData.length > 0 ? (
                                        filteredData.map((product, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                <td>{product?.sub_ctgr}</td>
                                                <td>{product?.ctgr_name}</td>
                                                <td>{product?.quantity}</td>
                                                <td>{product?.manufacturer}</td>
                                                <td>{product?.mfr_prt_num}</td>
                                                <td>{product?.ptg_prt_num}</td>
                                                {/* <td>{product?.status}</td> */}
                                                <td>{statusMapping[product?.status] || product?.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey="Mechanic" title="Mechanic">
                        <div className='d-flex justify-content-end'>
                            <input type="search" onChange={(e) => searchtable(e)}
                                value={searchQueries.Mechanic}
                                placeholder='Search for the Part/Component'
                                style={{ marginRight: '8px', fontSize: '10px',minWidth:'170px' }} />                            
                                <Button
                                    className='submit me-2 md-me-2 submitmobile'
                                    onClick={pdfdownload}
                                    disabled={!filteredData.some(product => product?.part_name)}
                                >
                                    Download Mechanic Stock Details
                                </Button>                           
                            <Form.Group >
                                <Form.Select aria-label="Default select example" style={{ maxWidth: '150px', textAlign: 'center' }}
                                    type="text"
                                    placeholder=""
                                    name="type"
                                    value={form.type}
                                    onChange={handleOptionChange}
                                    required
                                >
                                    <option value="All">All</option>
                                    <option value="In_stock">In Stock</option>
                                    <option value="Out_of_Stock">Out Of Stock</option>
                                    <option value="Running_out_of_stock">Running Out Of Stock</option>
                                </Form.Select>
                            </Form.Group>

                        </div>

                        <div className="table-responsive mt-4">
                            <Table className="b-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th onClick={() => handleSort('part_name')}>Part Name <FaSort /></th>
                                        <th onClick={() => handleSort('ctgr_name')}>Category <FaSort /></th>
                                        <th onClick={() => handleSort('quantity')}>Quantity <FaSort /></th>
                                        <th onClick={() => handleSort('manufacturer')}>Manufacturer <FaSort /></th>
                                        <th onClick={() => handleSort('mfr_prt_num')}>Manufacturer Part No<FaSort /></th>
                                        <th onClick={() => handleSort('ptg_prt_num')}>PTG Part Number <FaSort /></th>
                                        <th onClick={() => handleSort('status')}>Status <FaSort /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredData) && filteredData.length > 0 ? (
                                        filteredData.map((product, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                <td>{product?.part_name}</td>
                                                <td>{product?.ctgr_name}</td>
                                                <td>{product?.quantity}</td>
                                                <td>{product?.manufacturer}</td>
                                                <td>{product?.mfr_prt_num}</td>
                                                <td>{product?.ptg_prt_num}</td>
                                                {/* <td>{product?.status}</td> */}
                                                <td>{statusMapping[product?.status] || product?.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center">
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                </Tabs>
            </div>
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
        </>

    )
}
export default InventoryStock;