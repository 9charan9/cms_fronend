import React, { useState } from 'react';
import { Form, useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import arw from '../../../assets/Images/left-arw.svg';
import OriginalpartnoDetails from './OriginalpartnoDetails';
import PtgnoDetails from './PtgnoDetails';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { AssigntoVendor, GetAllVendors, selectAllVendorsData, selectBomDetails, selectLoadingState } from '../slice/BomSlice';
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Modal from "react-bootstrap/Modal";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Bomprice from './Bomprice';
import { selectAgainstPO, getagainstPO } from "../../clients/slice/ClientSlice"

const BomListDetails = () => {

  const [key, setKey] = useState('OriginalPartNo');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedVendorData, setSelectedVendorData] = useState();
  console.log(selectedVendorData);
  const [department, setDepartment] = useState('Mcategoryinfo');
  // console.log(selectedVendorId);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  const [assignToVendorClicked, setAssignToVendorClicked] = useState(false);
  const [uncheckAllCheckboxes, setUncheckAllCheckboxes] = useState(false);
  const [againstPoValue, setAgainstPoValue] = useState("")
  const againstPOdata = useSelector(selectAgainstPO);
  console.log(againstPoValue, "455555555555")
  const [selectedVendors, setSelectedVendors] = useState([]);
  const AllVendors = useSelector(selectAllVendorsData);
  const vendors = AllVendors.body;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingState);
  const location = useLocation();
  const { bom_name, bom_id, created_date } = location.state;
  const [bomDetailsData, setBomDetailsData] = useState([]);
  const [description, setDescription] = useState('');

  const bomdata = useSelector(selectBomDetails);
  const bomdetailsdata = bomdata?.body?.parts;
  console.log(bomdetailsdata);

  const handleCheckboxChangeCallback = (isChecked) => {
    setIsAnyCheckboxChecked(isChecked);
  };
  const handleBomDetailsData = (data) => {
    setBomDetailsData(data);
    // Do something with the bomdetailsdata in the BomListDetails componen
  };
  const handleDescription = (data) => {
    setDescription(data);
  }
  console.log(bomDetailsData);

  const handleCheckedData = (selectedData, key) => {
    console.log(selectedVendorData);
    setSelectedVendorData(selectedData);
    setDepartment(key);
  }
  const handleClose = () => {
    setShow(false);
    setModalIsOpen(false); // Close the modal when the modal is closed.
  };

  const handleShow = () => {
    setShow(true);
    setModalIsOpen(true); // Open the modal when the modal is shown.
    let request = {
      status: "Active",
      type: "all_vendors",
    }
    dispatch(GetAllVendors(request));
  };
  const handleVendorSelect = (event) => {
    setSelectedVendorId(event.target.value);
  }
  const handleCheckboxSelect = (selectedVendors) => {
    setSelectedVendors(selectedVendors);
  };
  console.log(selectedVendorData);
  const handleAssigntoVendor = async () => {
    if(selectedVendorId !== ""){
    let request = {
      "bom_id": bom_id,
      "vendor_id": selectedVendorId,
      part_information: selectedVendorData,
      department: department === 'Mcategoryinfo' ? "Mechanic" : "Electronic",
    }
    await dispatch(AssigntoVendor(request));
    setAssignToVendorClicked(true);
    handleClose();
    setSelectedVendorId("");
  }
  else{
    toast.warning("Select a Vendor");
  }
  }
  const generatePdf = (tableElement, headers, fileName) => {
    if (!tableElement) return;

    const pdf = new jsPDF('p', 'pt', 'a4');
    const bomId = bom_id;
    const bomName = bom_name;
    const createdDate = created_date;
    const imgWidth = 500;
    const imgHeight = (tableElement.offsetHeight * imgWidth) / tableElement.offsetWidth;

    pdf.setFontSize(12);
    pdf.text(`Bom ID : ${bomId}`, 40, 20);
    pdf.text(`Bom Name : ${bomName}`, 40, 35);
    pdf.text(`Created Date : ${createdDate}`, 40, 50);

    const pastelColors = ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'];
    const data = [];
    const rows = tableElement.querySelectorAll('tbody tr');

    rows.forEach((row, rowIndex) => {
      const rowData = [];
      const cells = row.querySelectorAll('td');

      cells.forEach((cell, columnIndex) => {
        const backgroundColor = pastelColors[(rowIndex + columnIndex) % pastelColors.length];
        rowData.push({ content: cell.textContent, styles: { fillColor: backgroundColor } });
      });

      data.push(rowData);
    });

    pdf.autoTable({
      head: [headers],
      body: data,
      startY: 70,
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headerStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });

    pdf.save(fileName);
  };

  const downloadpdf = () => {
    const tableElement = document.getElementById('tableDataOriginalpartnoDetails');
    const headers = ['Mf part no', 'Part Name', 'Manufacturer', 'Device Category', 'Mounting Type', 'Required Quantity'];
    generatePdf(tableElement, headers, 'BomOriginalpartnodetails.pdf');
  };

  const downloadpdfptg = () => {
    const tableElement = document.getElementById('PtgnoDetails');
    const headers = ['PTG part no', 'Part Name', 'Manufacturer', 'Device Category', 'Mounting Type', 'Required Quantity'];
    generatePdf(tableElement, headers, 'BomdPTGetails.pdf');
  };

  const exportExcel = () => {
    if (department === "Mcategoryinfo") {
      let headers = [
        "ctgr_name,prdt_name,mfr_prt_num,material,module,description,qty_per_board,required_qty,ordered_qty,unit_price,extended_price,gst(optional),tax(optional),tp_gst_addtax,vendor,moq(optional),hsn_code(optional)",
      ];
      downloadFile({
        data: [...headers].join("\n"),
        fileName: "McategoryData.csv",
        fileType: "text/csv",
      });
    }
    else if (department === "Ecategoryinfo") {
      let headers = [
        "mfr_prt_num,part_name,manufacturer,ctgr_name,pcb_foot_print,description,qty_per_board,required_qty,ordered_qty,unit_price,extended_price,gst(optional),tax(optional),tp_gst_addtax,vendor,moq(optional),hsn_code(optional),part_packaging(optional)"
      ];
      downloadFile({
        data: [...headers].join("\n"),
        fileName: "EcategoryData.csv",
        fileType: "text/csv",
      });
    }
  };
  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };


  const handleNaigateBack = () => {
    // setUncheckAllCheckboxes(true);
    navigate(-1);
  }

  const redirectems = () => {
    navigate("/assignbom", {
      state: {
        bomId: bom_id,
        bomName: bom_name
      }
    });
  }

  useEffect(() => {
    const requestBody =
    {
      bom_id: bom_id
    }
    dispatch(getagainstPO(requestBody))
  }, [dispatch, bom_id, selectAgainstPO])

  useEffect(() => {
    if (againstPOdata?.statuscode === 200) {
      setAgainstPoValue(againstPOdata?.body?.po_id);
    }
    else if (againstPOdata?.statuscode === 404) {
      setAgainstPoValue("NO PO for Bom")
    }
  }, [selectAgainstPO, location, dispatch])

  const saveActiveTabToStorage = (activeTab) => {
    localStorage.setItem('bomlistdetailsActivetab', activeTab);
  };

  const getActiveTabFromStorage = () => {
    return localStorage.getItem('bomlistdetailsActivetab');
  };

  useEffect(() => {
    const storedTab = getActiveTabFromStorage();
    setKey(storedTab);
  }, []);

  // Effect to save the active tab whenever it changes
  useEffect(() => {
    saveActiveTabToStorage(key);

    return () => {
      saveActiveTabToStorage('OriginalPartNo'); // Set the default key or any value you prefer
    };
  }, [key]);

  return (
    <>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="grow" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <div className='wrap'>
        <div className='d-flex justify-content-between position-relative d-flex-mobile'>
          <div className='d-flex align-items-center'>
            <h1 className='title-tag mb-0'><img src={arw} alt="" className='me-3' onClick={() => handleNaigateBack()} />{bom_id}</h1>
            <div className='tab-sec'>
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
              >

                <Tab eventKey="OriginalPartNo" title="Original Part No">
                  <div className='bom'>
                    {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">Bom ID : {bom_id}</h5> */}
                    <h5 className='mb-2 mt-3 bomtag text-667 font-500'>Bom Name : {bom_name}</h5>
                    <h5 className='bomtag text-667 font-500'>Created Date : {created_date}</h5>
                  </div>
                  {key === "OriginalPartNo" ? (<OriginalpartnoDetails
                    id="tableDataOriginalpartnoDetails" props={{ bom_name: bom_name, bom_id: bom_id }} onBomDetailsData={handleBomDetailsData} onDescription={handleDescription}></OriginalpartnoDetails>) : (null)}
                </Tab>
                <Tab eventKey="PTGNo" title="PTG No">
                  <div className='bom'>
                    {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">Bom ID : {bom_id}</h5> */}
                    <h5 className='mb-2 mt-3 bomtag text-667 font-500'>Bom Name : {bom_name}</h5>
                    <h5 className='bomtag text-667 font-500'>Created Date : {created_date}</h5>
                  </div>
                  {key === "PTGNo" ? (<PtgnoDetails
                    id="PtgnoDetails" props={{ bom_name: bom_name, bom_id: bom_id }}></PtgnoDetails>) : (null)}
                </Tab>
                <Tab eventKey="Pricebom" title="Price Bom">
                  <div className='bom'>
                    {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">Bom ID : {bom_id}</h5> */}
                    <h5 className='mb-2 mt-3 bomtag text-667 font-500'>Bom Name : {bom_name}</h5>
                    <h5 className='bomtag text-667 font-500'>Created Date : {created_date}</h5>
                  </div>
                  {key === "Pricebom" ? (<Bomprice props={{ bom_id: bom_id }} onCheckboxChange={handleCheckboxChangeCallback} onCheckedData={handleCheckedData} uncheckAllCheckboxes={uncheckAllCheckboxes} description={description} onCheckboxSelect={handleCheckboxSelect} />) : (null)}
                </Tab>
              </Tabs>
            </div>
          </div>

          <div className='mobilemargin-top'>
            {key === "Pricebom" && department !== "Description" ? (
              <>
                <Button className='submit submit-85 me-2 submitmobile' disabled={!isAnyCheckboxChecked} onClick={handleShow}>
                  Assign to Vendor
                </Button>
                <Button className='submit me-2 md-me-2 submitmobile' onClick={exportExcel}>
                  Download CSV format
                </Button>
              </>
            ) : (
              null
            )
            }

            {key === 'OriginalPartNo' || key === 'PTGNo' ? (
              <>
                <Button className='submit submit-85 me-2 submitmobile' onClick={redirectems}>
                  Assign to EMS
                </Button>
                {/* <Button className='submit me-2 md-me-2 submitmobile' onClick={exportExcel}>
                                    Download CSV format
                                </Button> */}
              </>
            ) : (<></>)
              // : (
              //     <Button className='submit me-2 md-me-2 submitmobile' onClick={exportExcel}>
              //         Download CSV format
              //     </Button>
              // )
            }
          </div>

        </div>
      </div>
      <Modal show={modalIsOpen} onHide={handleClose} centered className="upload-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className=" modal-title-tag">
            Choose Vendor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select className='vendor-select' onChange={handleVendorSelect} value={selectedVendorId} required>
            <option value="">Select a Vendor</option>
            {/* {vendors?.map(vendor => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>{vendor.vendor_id}-{vendor.vendor_name}</option>
            ))} */}
            {selectedVendorData && selectedVendorData[0] && (
              <option value={selectedVendorData[0].vendor_id}>
                {selectedVendorData[0].vendor_id}-{selectedVendorData[0].vendor}
              </option>
            )}
          </select>
          <div className='Bttns'>
            <Button
              type="button"
              className="cancel me-2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="button" className="submit" onClick={handleAssigntoVendor}>
              Assign
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer
        limit={1}
        position="top-center"
        autoClose={1000}
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

export default BomListDetails;