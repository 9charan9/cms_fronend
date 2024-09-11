import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import arw from '../../../assets/Images/left-arw.svg';
import Table from 'react-bootstrap/Table';
import edit from '../../../assets/Images/edit.svg';
import Delete from '../../../assets/Images/Delete.svg';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import {saveAs}  from 'file-saver';
import * as XLSX from "xlsx";
const EstimateMaterial = () => {
    const [selectedData, setSelectedProducts] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [key, setKey] = useState('CategoryInfo');
    const navigate = useNavigate();
    const location = useLocation();
    const bomdata = location.state?.bomdata;
    console.log(bomdata , "555555");
    const dep_type = location?.state?.dep_type;
    console.log(dep_type,"345")
    const bomdetailsdata = bomdata?.body?.parts;
    const [multiplier, setMultiplier] = useState(1); // Initialize with 1 or any other default value
    const onChangeqty = (val) => {
        // Update the state for the multiplier
        setMultiplier(val);

    };



    // const downloadpdf = () => {
    //     const pdf = new jsPDF('p', 'pt', 'a4');

    //     const bomId = bomdata?.body?.bom_id;
    //     const bomName = bomdata?.body?.bom_name;
    //     const createdDate = bomdata?.body?.created_date;

    //     const input = document.getElementById('tableData');
    //     if (!input) return;  
    //     const tableElement = input.querySelector('table');
    //     if (!tableElement) return;  
    //     const imgWidth = 500;
    //     const imgHeight = (tableElement.offsetHeight * imgWidth) / tableElement.offsetWidth;

    //     pdf.setFontSize(12);
    //     pdf.text(`Bom ID : ${bomId}`, 40, 20);
    //     pdf.text(`Bom Name : ${bomName}`, 40, 35);
    //     pdf.text(`Created Date : ${createdDate}`, 40, 50);

    //     // Define an array of light pastel colors
    //     const pastelColors = ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'];

    //     const headers = ['Mf Part No', 'Part Name', 'Manufacturer',  'Device Category', 'Mounting Type', 'Required Quantity', 'Quantity in Stock', 'Procure'];
    //     const data = [];
    //     const rows = tableElement.querySelectorAll('tbody tr');  
    //     rows.forEach((row, rowIndex) => {
    //       const rowData = [];
    //       const cells = row.querySelectorAll('td');

    //       cells.forEach((cell, columnIndex) => {       
    //         const backgroundColor = pastelColors[(rowIndex + columnIndex) % pastelColors.length];
    //         rowData.push({ content: cell.textContent, styles: { fillColor: backgroundColor } });
    //       });

    //       data.push(rowData);
    //     });

    //     pdf.autoTable({
    //       head: [headers],
    //       body: data,
    //       startY: 70,
    //       styles: {
    //         cellPadding: 5,
    //         fontSize: 10,
    //         textColor: [0, 0, 0], // Table text color
    //         lineColor: [0, 0, 0], // Table border color
    //         lineWidth: 0.1, // Table border line width
    //       },
    //       headerStyles: {
    //         fillColor: false, // Disable header background color
    //         textColor: [0, 0, 0], // Table header text color
    //         fontStyle: 'bold',
    //       },
    //     });

    //     pdf.save('MaterialProcure.pdf');
    //   };


      const downloadData = () => {
        const bomId = bomdata?.body?.bom_id;
        const bomName = bomdata?.body?.bom_name;
        const createdDate = bomdata?.body?.created_date;
      
        const detailsRow = ['Bom ID:', bomId, 'Bom Name:', bomName, 'Created Date:', createdDate];

        const data = [];
         let headers;

         if (dep_type === "Mcategoryinfo") {
            headers = ['VIC Part No', 'Part Name', 'Material', 'Technical Details', 'Description', 'Required Quantity', 'Quantity in Stock', 'Procure'];
          } else if (dep_type === "Ecategoryinfo") {
            headers = ["M.part no", "Part Name", "Manufacturer", "Device Category", "Mounting Type",  "Required Quantity", "Quantity in Stock", "Procure"];
          }

        const rows = document.querySelectorAll('#tableData table tbody tr');
        rows.forEach(row => {
          const rowData = [];
          const cells = row.querySelectorAll('td');
          cells.forEach(cell => {
            rowData.push(cell.textContent);
          });
          data.push(rowData);
        });
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, 'MaterialProcure.xlsx');
      };       

    return (
        <>

            <div className='wrap'>
                <div className='d-flex justify-content-between position-relative d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <h1 className='title-tag mb-0'><img src={arw} alt="" className='me-3' onClick={() => navigate(-1)} /> {bomdata?.body?.bom_name}</h1>
                    </div>
                    <div>
                        <Button className='submit me-2' onClick={downloadData}>
                            Download the procure quantity
                        </Button>
                    </div>
                </div>

                <div className='bom bomalign'>
                    {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">Bom ID : {bomdata?.body?.bom_id}</h5> */}
                    <h5 className='mb-2 mt-3 bomtag text-667 font-500'>Bom Name : {bomdata?.body?.bom_name}</h5>
                    <h5 className='bomtag text-667 font-500'>Created Date : {bomdata?.body?.created_date}</h5>
                </div>


                <div className='d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile'>
                    <div className='d-flex align-items-center'>
                        <div className='partno-sec'>
                            <div className='tab-sec'>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                >
                                    <Tab eventKey="CategoryInfo" title={"Category Info"}>
                                        <div className='table-responsive mt-4' id="tableData">
                                            <Table className='b-table'>

                                                <thead>
                                                { dep_type === "Mcategoryinfo" ?(
                                                    <tr>
                                                        <th>VIC Part No</th>
                                                        <th>Part Name</th>
                                                        <th>Material</th>
                                                        <th>Technical Details</th>
                                                        <th>Description </th>
                                                        <th>Required Quantity </th>
                                                        <th>Quantity in Stock</th>
                                                        <th>Procure</th>
                                                    </tr>
                                                ):(
                                                
                                                <tr>
                                                        <th>Manufacturer Part No</th>
                                                        <th>Part Name</th>
                                                        <th>Manufacturer</th>
                                                        <th>Device Category</th>
                                                        <th>Mounting Type</th>
                                                        <th>Required Quantity</th>
                                                        <th>Quantity in Stock</th>
                                                        <th>Procure</th>
                                                    </tr>
                                                
                                            )}
                                                </thead>
                                                <tbody>

                                                    {bomdetailsdata && bomdetailsdata.length > 0 ? (
                                                        bomdetailsdata.map((item, index) => {
                                                            const updatedQtyPerBoard = item.required_quantity * multiplier;
                                                            const procure = updatedQtyPerBoard > item.qty ? updatedQtyPerBoard - item.qty : "-";
                                                            
                                                                return (
                                                              
                                                                <tr key={index}>
                                                                    { dep_type === "Mcategoryinfo" ?( 
                                                                        <>
                                                                    <td>{item?.vic_part_number}</td>
                                                                    <td>{item?.part_name}</td>
                                                                    <td>{item?.material}</td>
                                                                    <td>{item?.technical_details}</td>
                                                                    <td>{item?.description}</td>
                                                                    <td>{updatedQtyPerBoard}</td>
                                                                    <td>{item?.qty}</td>
                                                                    <td>{procure}</td>
                                                                    </>
                                                                    ):(<>
                                                                    <td>{item?.mfr_part_number}</td>
                                                                    <td>{item?.part_name}</td>
                                                                    <td>{item?.manufacturer}</td>
                                                                    <td>{item?.device_category}</td>
                                                                    <td>{item?.mounting_type}</td>
                                                                    <td>{updatedQtyPerBoard}</td>
                                                                    <td>{item?.qty}</td>
                                                                    <td>{procure}</td>
                                                                    </>)}
                                                                </tr>
                                                          
                                                            );
                                                             
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className='text-center'>No Data Available</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>

                                    </Tab>
                                    <Tab eventKey="Description" title="Description">
                                        <p className='mt-4'>{bomdata?.body?.description}</p>
                                    </Tab>

                                </Tabs>
                            </div>
                        </div>
                    </div>

                    <div className='mobilemargin-top'>
                        <Row>
                            <Col xs={12} md={12}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Required Quantity</Form.Label>
                                    <Form.Control type="text" placeholder="" name="" onChange={(e) => onChangeqty(parseInt(e.target.value) || 1)} />
                                </Form.Group>
                            </Col>
                        </Row>

                    </div>
                </div>

            </div>

        </>
    );
};

export default EstimateMaterial;