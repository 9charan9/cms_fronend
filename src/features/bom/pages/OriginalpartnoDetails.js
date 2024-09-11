import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getBomDetails, selectBomDetails, selectAllOutwardList, getallOutwardList, selectPriceBomDatabyID } from '../slice/BomSlice';
import { tableBOM, tableContent, textToast } from '../../../utils/TableContent';
import { type } from '@testing-library/user-event/dist/type';


const OriginalpartnoDetails = ({ props, id, onBomDetailsData, onDescription }) => {
    const [key, setKey] = useState('Mcategoryinfo');
    const categoryInfoData = props.bom_name;
    const categoryObjectkeys = props.bom_id;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bomdata = useSelector(selectBomDetails);
    // const bomdetailsdata = bomdata?.body?.parts;
    const outwardData = useSelector(selectAllOutwardList);
    console.log(outwardData, "all outward list data")
    const outwardDataList = outwardData?.body
    const [bomdetailsdata, setBomdetailsdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const XLSX = require('xlsx');
    const estimatematerial = () => {
        navigate('/estimatematerial', { state: { bomdata, dep_type: key } })
    }

    useEffect(() => {
        if (bomdata?.body?.parts) {
            setBomdetailsdata([...bomdata?.body?.parts])
        } else {
            // Handle the case where parts is null or undefined
            setBomdetailsdata([]);
        }
        setIsLoading(false);

    }, [bomdata])

    useEffect(() => {
        // Pass bomdetailsdata to the parent component
        if (bomdetailsdata) {
            onDescription(bomdata?.body?.description);
            onBomDetailsData(bomdetailsdata);
        }
    }, [bomdetailsdata, onBomDetailsData, onDescription]);
    useEffect(() => {
        const request = {
            "bom_name": categoryInfoData,
            "bom_id": categoryObjectkeys,
            "dep_type": key === "Mcategoryinfo" ? "Mechanic" : "Electronic",
        }
        setBomdetailsdata([])
        dispatch(getBomDetails(request));
        setIsLoading(true);
    }, [dispatch, categoryInfoData, categoryObjectkeys, key])

    useEffect(() => {
        const requestBody = {
            "bom_id": categoryObjectkeys
        }
        dispatch(getallOutwardList(requestBody))
    }, [key])
    if (!bomdetailsdata) {
        return null;
    }
    const handleTableRowClick = (outwardId, type) => {
        let path = `/outwardinnerdetails`;
        const outward_id_info = outwardId;
        navigate(path, { state: { outward_id_info: outward_id_info, dep_type: type } });
    };

    const generateExcelData = (item) => {
        console.log(JSON.stringify(item, null, 2))
        if (key === 'Mcategoryinfo') {
            return {
                ctgr_name : item?.ctgr_name,
                Part_Name: item?.part_name,
                vic_part_number: item?.vic_part_number,
                material : item?.material,
                qty_per_board: item?.required_quantity || item?.qty_per_board,
                description : item?.description,
            };
        } else if (key === 'Ecategoryinfo') {
            return {
                device_category: item?.device_category,
                part_name : item?.part_name,
                Manufacturer: item?.manufacturer,
                mfr_part_number: item?.mfr_part_number,
                description: item?.description,
                qty_per_board: item?.qty_per_board || item?.required_quantity,
                foot_print : item?.foot_print,
                hsn_code : item?.hsn_code
            };
        }
    };
    const handleDownloadXL = () => {
        const excelData = bomdetailsdata.map(item => generateExcelData(item));
        downloadXL(excelData, key === 'Mcategoryinfo' ? 'M_Category_Info' : 'E_Category_Info');
    };

    const downloadXL = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data, { raw: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    // const convertToCSV = (data) => {
    //     const header = Object.keys(data[0]).join(',');
    //     const rows = data.map((item) => Object.values(item).join(','));
    //     return `${header}\n${rows.join('\n')}`;
    // };


    return (
        <>
            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative w-100 border-bottom d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <div className='partno-sec'>
                            <div className='tab-sec'>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                >
                                    <Tab eventKey="Mcategoryinfo" title="M - Category Info">
                                        <div className='table-responsive mt-4'>
                                            <Table className='b-table'>
                                                <thead>
                                                    <tr>
                                                        <th>S NO</th>
                                                        <th>{tableBOM.category}</th>
                                                        <th>{tableBOM.partName}</th>
                                                        <th>{tableBOM.mfPrtno}</th>
                                                        <th>{tableBOM.material}</th>
                                                        <th>{tableBOM.qtyPerBoard}</th>
                                                        <th>{tableBOM.description}</th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">Loading...</td>
                                                        </tr>
                                                    ) : (Array.isArray(bomdetailsdata) && bomdetailsdata.length > 0 ? (
                                                        bomdetailsdata.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index+1}</td>
                                                                <td>{item?.ctgr_name}</td>
                                                                <td>{item?.part_name}</td>
                                                                <td>{item?.vic_part_number}</td>
                                                                <td>{item?.material}</td>
                                                                <td>{item?.required_quantity}</td>
                                                                <td>{item?.description}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9" className='text-center'>{textToast.noData}</td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="Ecategoryinfo" title="E - Category Info">
                                        <div className='table-responsive mt-4' id={id}>
                                            <Table className='b-table'>
                                                <thead>
                                                    <tr>
                                                        <th>S.NO</th>
                                                        <th>{tableBOM.deviceCat}</th>
                                                        <th>{tableContent.partName}</th>
                                                        <th>{tableBOM.Mftr}</th>
                                                        <th>{tableBOM.mfPrtno}</th>
                                                        <th>{tableBOM.description}</th>
                                                        <th>{tableBOM.qtyPerBoard}</th>
                                                        <th>{tableBOM.footPrint}</th>
                                                        <th>{tableBOM.HSNCODE}</th>
                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="9" className="text-center">Loading...</td>
                                                        </tr>
                                                    ) : (Array.isArray(bomdetailsdata) && bomdetailsdata.length > 0 ? (
                                                        bomdetailsdata.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index+1}</td>
                                                                <td>{item?.device_category}</td>
                                                                <td>{item?.part_name}</td>
                                                                <td>{item?.manufacturer}</td>
                                                                <td>{item?.mfr_part_number}</td>
                                                                <td>{item?.description}</td>
                                                                <td>{item?.required_quantity}</td>
                                                                <td>{item?.foot_print}</td>
                                                                <td>{item?.hsn_code}</td>
                                                                
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="9" className='text-center'>{textToast.noData}</td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>

                                    <Tab eventKey="Description" title="Description">
                                        <p className='mt-4'>{bomdata?.body?.description}</p>
                                    </Tab>
                                    <Tab eventKey="Outwardinfo" title="Outward Info">
                                        <div className='table-responsive mt-4'>
                                            <Table className='b-table'>
                                                <thead>
                                                    <tr>
                                                        <th>S.NO</th>
                                                        <th>{tableBOM.outwardId}</th>
                                                        <th>Partner ID</th>
                                                        <th>{tableBOM.outwardDate}</th>
                                                        <th>{tableBOM.boardsQty}</th>
                                                        <th>{tableBOM.mtrlpercentage}</th>
                                                        <th>{tableBOM.partnerType}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(outwardDataList) && outwardDataList.length > 0 ? (
                                                        outwardDataList.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index+1}</td>
                                                                <td><a onClick={(e) => handleTableRowClick(item?.outward_id, item?.type)} className="text-black linkformodal">{item?.outward_id}</a></td>
                                                                <td>{item?.partner_id}</td>
                                                                <td>{item?.outward_date}</td>
                                                                <td>{item?.boards_qty}</td>
                                                                <td>{item?.mtrl_prcnt}%</td>
                                                                <td>{item?.type}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" className='text-center'>{textToast.noData}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    <div className='mobilemargin-top'>
                        <Button className="submit mb-1 submit-block"
                            onClick={handleDownloadXL}
                            disabled={bomdetailsdata.length === 0 || key === 'Description' || key === 'Outwardinfo'}>
                            Download Details
                        </Button>
                        &nbsp;
                        <Button
                            className="submit mb-1 submit-block"
                            onClick={estimatematerial}
                            disabled={key === 'Description' || key === 'Outwardinfo'}
                        >
                            {tableBOM.estMaterials}
                        </Button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default OriginalpartnoDetails;