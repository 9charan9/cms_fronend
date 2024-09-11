import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import view from "../../../assets/Images/view.svg";
import download from "../../../assets/Images/download.svg";
import pdf from "../../../assets/Images/pdf.svg";
import Table from "react-bootstrap/Table";
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import { Document, Page, pdfjs } from "react-pdf";
import "jspdf-autotable";
import {
  selectVendorsCategoryDetails,
  getVendorcategoryDetails,
  selectLoadingStatus,
  getOrdersList, selectVendorOrderData,
  selectVendorApiData,
  getVendorApi, getVendorInnerURL, selectVendorOrderInnerData, getVendorOrderInner
} from "../slice/VendorSlice";
import VendorRating from "./VendorRating";

const VendorsDetails = () => {
  const [key, setKey] = useState("");
  const [titleChanged, setTitle] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [totalSelectedComponents, setTotalSelectedComponents] = useState(0);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
  const [selectedPartsArray, setSelectedPartsArray] = useState([]);
  const [isPOGenerated, setIsPOGenerated] = useState(false);


  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  let totalQty1 = 0;
  let totalPrice1 = 0;

  let totalQuantity = 0;
  let totalPrice = 0;

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { vendor_id, vendor_name } = location.state;
  //console.log(vendor_id)
  const VendorcatDetails = useSelector(selectVendorsCategoryDetails);
  // const vendorOrderData = useSelector(selectVendorsCategoryDetails);
  // console.log(vendorOrderData, "lathaaaaaa");
  const isLoading = useSelector(selectLoadingStatus);
  const VendorcatDetailsdata = VendorcatDetails?.body || "";
  const InnerDetails = VendorcatDetailsdata?.parts || "";
  console.log(InnerDetails, "onlyy parts dataaaa");
  // Initialize variables to store cmpt_id and ctgr_id
  const vendorApiData = useSelector(selectVendorApiData);
  const vendorOrderIdData = vendorApiData?.body || "";
  // const vendorData = vendorOrderIdData?.;
  // console.log(vendorOrderIdData, "lllllllllllllllllll");

  const vendorOrderInnerData = useSelector(selectVendorOrderInnerData);
  const VendorOrderData = vendorOrderInnerData?.body?.[0];
  console.log(vendorOrderInnerData, "97854798547ommmmmmm8457895789");

  const [generatePOButtonDisabled, setGeneratePOButtonDisabled] = useState(false);


  const cmptIdArray = [];
  const ctgrIdArray = [];
  const departArray = [];
  const subCtgrArray = [];
  const documentUrls =
    (VendorcatDetailsdata?.documents || [])?.map(
      (document) => document?.content
    ) || [];

  const documentUrlsorder =
    (VendorOrderData?.documents || [])?.map(
      (document) => document?.content
    ) || [];


  const handleShowOrderModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderModal(true);
    const request = {
      "po_id": orderId
    }
    console.log(request, "requessssss");
    dispatch(getVendorOrderInner(request));

  };

   useEffect(() => {
    const selectedCount = Object.values(selectedRows).filter(Boolean).length;
    setTotalSelectedComponents(selectedCount);
  }, [selectedRows]);

 

  useEffect(() => {
    const request = {
      "vendor_id": vendor_id
    }
    dispatch(getVendorApi(request));
  }, [])

  useEffect(() => {
    // Reset checkbox states
    setSelectAll(false);
    setIsAnyCheckboxSelected(false);
    setSelectedRows({});
    setSelectedPartsArray([]);
  }, [key]);


  useEffect(() => {
    const request = {
      vendor_id: vendor_id,
      vendor_name: vendor_name,
      type: "Vendor",
    };
    dispatch(getVendorcategoryDetails(request));
  }, []);
  useEffect(() => {
    if (VendorcatDetailsdata?.vendor_type === "Mec&Ele") {
      setKey("M-Category Info");
      setTitle("E-Category Info");
    } else {
      setKey("CategoryInfo");
      setTitle("Category Info");
    }
  }, [VendorcatDetailsdata]);

  if (!VendorcatDetailsdata) {
    return null;
  }

  // const downloadDocument = (documentUrl, documentName) => {
  //   fetch(documentUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = documentName;
  //       link.click();
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading PDF:", error);
  //     });
  // };
  // const downloadDocument1 = (documentUrl, documentName) => {
  //   fetch(documentUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = documentName;
  //       link.click();
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading PDF:", error);
  //     });
  // };


  const downloadpdf = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    const vendorId = VendorcatDetailsdata?.vendor_id;
    const vendorName = VendorcatDetailsdata?.vendor_name;
    const createdDate = VendorcatDetailsdata?.vendor_date;
    const contactNo = VendorcatDetailsdata?.contact_number;
    const Email = VendorcatDetailsdata?.email;
    const Location = VendorcatDetailsdata?.city_name;

    const input = document.getElementById("tableData");
    if (!input) return;
    const tableElement = input.querySelector("table");
    if (!tableElement) return;
    const imgWidth = 500;
    const imgHeight =
      (tableElement.offsetHeight * imgWidth) / tableElement.offsetWidth;

    pdf.setFontSize(12);
    const addTextWithLineBreak = (text, x, y, maxWidth) => {
      const textLines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(textLines, x, y);
  };

  // Adding text with automatic line break
  addTextWithLineBreak(`Vendor Name : ${vendorName}`, 40, 35, 500);
  addTextWithLineBreak(`Vendor Date : ${createdDate}`, 40, 60, 500);
  addTextWithLineBreak(`Contact No : ${contactNo}`, 40, 85, 500);
  addTextWithLineBreak(`Email : ${Email}`, 40, 120, 500);
  // addTextWithLineBreak(`Location : ${Location}`, 40, 140, 500);
    
    // pdf.text(`Vendor Name : ${vendorName}`, 40, 35);
    // pdf.text(`Vendor Date : ${createdDate}`, 40, 50);
    // pdf.text(`Contact No : ${contactNo}`, 40, 65);
    // pdf.text(`Email : ${Email}`, 40, 80);
    // pdf.text(`Location : ${Location}`, 40, 95);

    // Define an array of light pastel colors
    const pastelColors = ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff"];

    const headers = [
      // "",
      "Part No",
      "BOM Name",
      "Part Name",
      "Module",
      "Part Description",
      "Material",
      "Quantity",
      "Price",
      "GST %",
    ];
    const data = [];
    const rows = tableElement.querySelectorAll("tbody tr");
    rows.forEach((row, rowIndex) => {
      const rowData = [];
      const cells = row.querySelectorAll("td");

      cells.forEach((cell, columnIndex) => {
        const backgroundColor =
          pastelColors[(rowIndex + columnIndex) % pastelColors.length];
          const content = cell.textContent.trim(); // Trim to remove extra spaces

          // Check if content is empty or not
          if (content !== "") {
            rowData.push({
              content: content,
              styles: { fillColor: backgroundColor },
            });
          }
        });
    
        // Only add row if it has non-empty cells
        if (rowData.length > 0) {
          data.push(rowData);
        }
      });
    
        pdf.autoTable({
      head: [headers],
      body: data,
      startY: 155,
      styles: {
        cellPadding: 5,
        fontSize: 10,
        textColor: [0, 0, 0], // Table text color
        lineColor: [0, 0, 0], // Table border color
        lineWidth: 0.1, // Table border line width
      },
      headerStyles: {
        fillColor: false, // Disable header background color
        textColor: [0, 0, 0], // Table header text color
        fontStyle: "bold",
      },
    });

    pdf.save("Vendordetails.pdf");
  };

  console.log(InnerDetails, "inner details dataaaaa");

  // const handleSelectAll = () => {
  //   const updatedSelectedRows = { ...selectedRows };
  //   const updatedSelectedPartsArray = [];

  //   for (const partKey in InnerDetails) {
  //     updatedSelectedRows[partKey] = !selectAll;

  //     if (!selectAll) {
  //       // If "Select All" is checked, add all parts to the array
  //       updatedSelectedPartsArray.push(InnerDetails[partKey]);
  //     }
  //   }

  //   const allSelected = Object.keys(InnerDetails).every((key) => updatedSelectedRows[key]);
  //   setSelectAll(allSelected);

  //   const anyCheckboxSelected = Object.values(updatedSelectedRows).some((value) => value);
  //   setIsAnyCheckboxSelected(anyCheckboxSelected);
  //   setSelectedRows(updatedSelectedRows);
  //   setSelectedPartsArray(updatedSelectedPartsArray);
  // };

  // const handleSelectAll = () => {
  //   const updatedSelectedRows = { ...selectedRows };
  //   const updatedSelectedPartsArray = [];

  //   for (const partKey in InnerDetails) {
  //     if (InnerDetails[partKey]?.status === true) {
  //       continue;
  //     }
  //     updatedSelectedRows[partKey] = !selectAll;
  //     if (!selectAll) {
  //       updatedSelectedPartsArray.push(InnerDetails[partKey]);
  //     }
  //   }
  //   const allSelected = Object.keys(InnerDetails)
  //     .filter((key) => !InnerDetails[key]?.status) // Exclude disabled checkboxes
  //     .every((key) => updatedSelectedRows[key]);

  //     setSelectAll(allSelected);
  //   const anyCheckboxSelected = Object.values(updatedSelectedRows).some((value) => value);
  //   setIsAnyCheckboxSelected(anyCheckboxSelected);
  //   setSelectedRows(updatedSelectedRows);
  //   setSelectedPartsArray(updatedSelectedPartsArray);
  // };
  const openPDFInNewTab = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };
  const openPDFInNewTabnew = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };
  const handleRowSelect = (rowKey) => {
    const updatedSelectedRows = { ...selectedRows };
    const updatedSelectedPartsArray = [...selectedPartsArray];

    updatedSelectedRows[rowKey] = !updatedSelectedRows[rowKey];
    setSelectedRows(updatedSelectedRows);

    if (updatedSelectedRows[rowKey]) {
      // Add the selected part to the array
      updatedSelectedPartsArray.push(InnerDetails[rowKey]);
    } else {
      // Remove the unselected part from the array
      const index = updatedSelectedPartsArray.findIndex((part) => part === InnerDetails[rowKey]);
      if (index !== -1) {
        updatedSelectedPartsArray.splice(index, 1);
      }
    }

    const partStatus = InnerDetails[rowKey]?.status;
    if (partStatus) {
      setGeneratePOButtonDisabled(true); // Disable the button if part status is true
    } else {
      setGeneratePOButtonDisabled(false); // Enable the button if part status is false
    }

    const allSelected = Object.keys(InnerDetails).every((key) => updatedSelectedRows[key]);
    setSelectAll(allSelected);
    const anyCheckboxSelected = Object.values(updatedSelectedRows).some((value) => value);
    setIsAnyCheckboxSelected(anyCheckboxSelected);
    setSelectedPartsArray(updatedSelectedPartsArray);
  };


  const routeGeneratepo = () => {
    const selectedMechanicData = Object.keys(InnerDetails)
      .filter(partKey => selectedRows[partKey] && InnerDetails[partKey]?.department === "Mechanic")
      .map((partKey, index) => {
        const part = InnerDetails[partKey];
        // const gstOptionalValue = part["gst(optional)"];
        return {
          index: `part${index + 1}`,
          mfr_prt_num: part?.mfr_prt_num || "-",
          bom_id: part?.bom_id || "-",
          prdt_name: part?.prdt_name || "-",
          module: part?.module || "-",
          description: part?.description || "-",
          material: part?.material || "-",
          qty: part?.ordered_qty || "-",
          price: parseInt(part?.unit_price * part?.ordered_qty).toString() || 0,
          unit_price: part?.unit_price || "-",
          gst: part?.gst || "-",
          cmpt_id: part?.cmpt_id || "-",
          ctgr_id: part?.ctgr_id || "-",
          department: part?.department || "-",
        };
      }, {});

    const selectedElectronicData = Object.keys(InnerDetails)
      .filter(partKey => selectedRows[partKey] && InnerDetails[partKey]?.department === "Electronic")
      .map((partKey, index) => {
        const part = InnerDetails[partKey];
        return {
          index: `part${index + 1}`,
          mfr_prt_num: part?.mfr_prt_num || "-",
          bom_id: part?.bom_id || "-",
          prdt_name: part?.part_name || "-",
          manufacturer: part?.manufacturer || "-",
          packaging: part?.packege || "-",
          description: part?.description || "-",
          ctgr_name: part?.ctgr_name || "-",
          qty: part?.ordered_qty || "-",
          price: parseInt(part?.unit_price * part?.ordered_qty).toString() || 0,
          unit_price: part?.unit_price || "-",
          gst: part?.gst || "-",
          cmpt_id: part?.cmpt_id || "-",
          ctgr_id: part?.ctgr_id || "-",
          department: part?.department || "-",

        };
      }, {});
    // console.log(selectedElectronicData, "selectedddd data of electroniccccc")

    const selectedData =
      key === "M-Category Info"
        ? selectedMechanicData
        : key === "E-categoryInfo"
          ? selectedElectronicData
          : [];


    navigate('/generatepo', {
      state: {
        VendorcatDetailsdata: VendorcatDetailsdata,
        selectedPartsArray: selectedMechanicData,
        selectedElectronicPartData: selectedElectronicData,
        selectMandEdata: selectedData,
        selectedTab: key,
        cmptIdArray: cmptIdArray,
        ctgrIdArray: ctgrIdArray,
        department: departArray,
        subCtgrArray: subCtgrArray,
      },
    })
    console.log(cmptIdArray)
    setIsPOGenerated(true);
  }

  // const extractTextFromHtml = (html) => {
  //   const div = document.createElement("div");
  //   div.innerHTML = html;
  //   const textContent = [];
  //   const elements = div.childNodes;

  //   elements.forEach((element) => {
  //     if (element.nodeType === Node.ELEMENT_NODE) {
  //       const tagName = element.tagName.toLowerCase();
  //       if (tagName === "h1" || tagName === "h2" || tagName === "h3" || tagName === "h4" || tagName === "h5" || tagName === "h6" || tagName === "p") {
  //         textContent.push(element.textContent);
  //       }
  //     }
  //   });

  //   return textContent.join("\n");
  // };

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              {VendorcatDetailsdata?.vendor_name}
            </h1>
            <div className="ms-3">
              <VendorRating
                rating={VendorcatDetailsdata?.vendor_rating}
                vendorId={VendorcatDetailsdata?.vendor_id}
                vendorName={VendorcatDetailsdata?.vendor_name}
              />
            </div>
          </div>
          <div className="mobilemargin-top">
            <Button
              className="submit me-2 md-me-2 submitmobile"
              onClick={routeGeneratepo}
              disabled={!isAnyCheckboxSelected || isPOGenerated || generatePOButtonDisabled}
            >
              Generate PO
            </Button>
            <Button
              className="submit me-2 md-me-2 submitmobile"
              onClick={downloadpdf}
            >
              Download vendor details
            </Button>

          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>
            {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Vendor ID : {VendorcatDetailsdata?.vendor_id}
            </h5> */}
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Vendor Type : {VendorcatDetailsdata?.vendor_type}
            </h5>
            <h5 className="bomtag mb-2 text-667 font-500">
              Vendor Date : {VendorcatDetailsdata?.vendor_date}
            </h5>
            {/* <h5 className="bomtag text-667 font-500">
              Address : {VendorcatDetailsdata?.address1},{VendorcatDetailsdata?.address2}, {VendorcatDetailsdata?.landmark}, {VendorcatDetailsdata?.pin_code},
              {VendorcatDetailsdata?.city_name},{VendorcatDetailsdata?.state},{VendorcatDetailsdata?.country}
            </h5> */}
            <h5 className="bomtag text-667 font-500">
              Address : {
                [
                  VendorcatDetailsdata?.address1,
                  VendorcatDetailsdata?.address2,
                  VendorcatDetailsdata?.landmark,
                  VendorcatDetailsdata?.pin_code,
                  VendorcatDetailsdata?.city_name,
                  VendorcatDetailsdata?.state,
                  VendorcatDetailsdata?.country
                ]
                  .filter(value => value !== undefined && value !== '' && value !== 'NA' && value !== 'na' && value !=='-' && value !=='Nill' && value !=='nill' && value !=='NILL')
                  .join(', ')
              }
            </h5>
          </Col>

          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Contact : {VendorcatDetailsdata?.contact_number}{" "}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              Email : {VendorcatDetailsdata?.email}
            </h5>
            {/* <h5 className="mb-2 bomtag text-667 font-500">
              State : {VendorcatDetailsdata?.state}
            </h5> */}
          </Col>

          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              GST Number : {VendorcatDetailsdata?.gst_number}{" "}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500">
              PAN Number : {VendorcatDetailsdata?.pan_number}
            </h5>
          </Col>
        </Row>
            <p>  Total components selected: {totalSelectedComponents}</p>
        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center">
            <div className="partno-sec vendorpartno-sec">
              <div className="tab-sec">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  {VendorcatDetailsdata?.vendor_type === "Mec&Ele" && (
                    <Tab eventKey="M-Category Info" title="M-Category Info">
                      <div className="table-responsive mt-4" id="tableData">

                        <Table className="b-table">
                          <thead>
                            <tr>
                              <th>
                                {/* <input
                                  type="checkbox"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                  disabled={partsStatus === true}
                                /> */}
                              </th>
                              <th>Part No</th>
                              {/* <th>BOM ID</th> */}
                              <th>Bom Name</th>
                              <th>Part Name</th>
                              <th>Module</th>
                              <th>Part Description</th>
                              <th>Material</th>
                              <th>Qty Per Board</th>
                              <th>Price per Piece (Rs/-)</th>
                              <th>GST (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(InnerDetails).map((partKey, index) => {
                              const part = InnerDetails[partKey];
                              const cmptId = part?.cmpt_id;
                              const ctgrId = part?.ctgr_id;
                              const Department = part?.department;

                              // Push them into respective arrays
                              cmptIdArray.push(cmptId);
                              ctgrIdArray.push(ctgrId);
                              departArray.push(Department);
                              if (part?.department === "Mechanic") {
                                const gstOptionalValue = part["gst(optional)"];
                                return (
                                  <tr key={index}>
                                    <td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedRows[partKey]}
                                          onChange={() => handleRowSelect(partKey)}
                                          disabled={part?.status === true}
                                        />
                                      </td>
                                    </td>
                                    <td>{part?.mfr_prt_num || "-"}</td>
                                    {/* <td>{part?.bom_id || "-"}</td> */}
                                    <td>{part?.bom_name}</td>
                                    <td>{part?.prdt_name || "-"}</td>
                                    <td>{part?.module || "-"}</td>
                                    <td>{part?.description || "-"}</td>
                                    <td>{part?.material || "-"}</td>
                                    <td>{part?.qty_per_board || "-"}</td>
                                    <td>
                                      {part?.unit_price ? part.unit_price : "-"}
                                    </td>
                                    {/* <td>{gstOptionalValue ? gstOptionalValue : "-"}</td> */}
                                    <td>{part?.gst ? part.gst : "-"}</td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </Tab>
                  )}
                  <Tab eventKey={VendorcatDetailsdata?.vendor_type === "Mec&Ele" ? "E-categoryInfo" : "CategoryInfo"} title={titleChanged}>
                    <div className="table-responsive mt-4" id="tableData">

                      {key === "E-categoryInfo" || VendorcatDetailsdata?.vendor_type === "Electronic" ? (

                        <>
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th>
                                  {/* <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    disabled={partsStatus === true}
                                  /> */}
                                </th>
                                <th>S.No</th>
                                <th>Manufacturer Part No</th>
                                <th>BOM Name</th>
                                <th>Part Name</th>
                                <th>Manufacturer</th>
                                {/* <th>Packaging</th> */}
                                <th>Description</th>
                                <th>Device Category</th>
                                <th>Quantity</th>
                                <th>Price per Piece (Rs/-)</th>
                                <th>GST (%)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(InnerDetails).map((partKey, index) => {
                                const part = InnerDetails[partKey];
                                const cmptId = part?.cmpt_id;
                                const ctgrId = part?.ctgr_id;
                                const Department = part?.department;
                                const subCtgr = part?.sub_ctgr;

                                // Push them into respective arrays
                                cmptIdArray.push(cmptId);
                                ctgrIdArray.push(ctgrId);
                                departArray.push(Department);
                                subCtgrArray.push(subCtgr);
                                if (part?.department === "Electronic") {
                                  const gstOptionalValue = part["gst(optional)"];
                                  const packagingOptionalValue = part["part_packaging(optional)"];
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedRows[partKey]}
                                          onChange={() => handleRowSelect(partKey)}
                                          disabled={part?.status === true}
                                        />
                                      </td>
                                      <td>{index + 1}</td>
                                      <td>{part?.mfr_prt_num || "-"}</td>
                                      <td>{part?.bom_name || "-"}</td>
                                      <td>{part?.part_name || "-"}</td>
                                      <td>{part?.manufacturer || "-"}</td>
                                      {/* <td>{packagingOptionalValue || "-"}</td> */}
                                      {/* <td>{part?.package || "-"}</td> */}
                                      <td>{part?.description || "-"}</td>
                                      <td>{part?.ctgr_name || "-"}</td>
                                      <td>{part?.ordered_qty || "-"}</td>
                                      <td>
                                        {part?.unit_price ? part.unit_price : "-"}
                                      </td>
                                      <td>{part?.gst ? part.gst : "-"}</td>
                                    </tr>
                                  )
                                }
                                return null
                              })}
                            </tbody>
                          </Table>
                        </>
                      ) : (
                        <>
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th>
                                  {/* <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    disabled={partsStatus === true}
                                  /> */}
                                </th>
                                <th>Part No</th>
                                <th>BOM Name</th>
                                <th>Part Name</th>
                                <th>Module</th>
                                <th>Part Description</th>
                                <th>Material</th>
                                <th>Quantity</th>
                                <th>Price per Piece (Rs /-)</th>
                                <th>GST (%)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.keys(InnerDetails).map((partKey, index) => {
                                const part = InnerDetails[partKey];
                                const cmptId = part?.cmpt_id;
                                const ctgrId = part?.ctgr_id;
                                const Department = part?.department;

                                // Push them into respective arrays
                                cmptIdArray.push(cmptId);
                                ctgrIdArray.push(ctgrId);
                                departArray.push(Department);
                                if (part?.department === "Mechanic") {
                                  const gstOptionalValue = part["gst(optional)"];
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedRows[partKey]}
                                          onChange={() => handleRowSelect(partKey)}
                                          disabled={part?.status === true}
                                        />
                                      </td>
                                      <td>{part?.mfr_prt_num || "-"}</td>
                                      <td>{part?.bom_name || "-"}</td>
                                      <td>{part?.prdt_name || "-"}</td>
                                      <td>{part?.module || "-"}</td>
                                      <td>{part?.description || "-"}</td>
                                      <td>{part?.material || "-"}</td>
                                      <td>{part?.ordered_qty || "-"}</td>
                                      <td>
                                        {part?.unit_price ? part.unit_price : "-"}
                                      </td>
                                      <td>{part?.gst ? part.gst : "-"}</td>
                                    </tr>
                                  )
                                }
                              })}
                            </tbody>
                          </Table>
                        </>
                      )}
                    </div>
                  </Tab>

                  <Tab eventKey="bankdetails" title="Bank Details">
                    <Row className="mt-4">
                      <Col xs={12} md={4}>
                        <p className="mb-2">
                          Name : {VendorcatDetailsdata?.holder_name}
                        </p>                       
                      </Col>
                      <Col xs={12} md={4}>
                        <p className="mb-2">
                          Bank Name : {VendorcatDetailsdata?.bank_name}
                        </p>                       
                      </Col>
                      <Col xs={12} md={4}>
                        <p className="mb-2 d-flex" style={{"white-space":"nowrap"}} title={VendorcatDetailsdata?.account_number}>
                         Account Number : <span className="accnotag ps-1">{VendorcatDetailsdata?.account_number}</span>
                        </p>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col xs={12} md={4}>                        
                        <p>Branch Name : {VendorcatDetailsdata?.branch_name}</p>
                      </Col>
                      <Col xs={12} md={4}>                        
                        <p>IFSC Code : {VendorcatDetailsdata?.ifsc_code}</p>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="otherinfo" title="Other Info">
                    <p className="mt-4 mb-2 font-bold">Contact Info</p>

                    <div>Vendor POC Name : {VendorcatDetailsdata?.vendor_poc_name}</div>
                    <div>Vendor POC Number : {VendorcatDetailsdata?.vendor_poc_contact_num}</div>
                    <div>PTG POC Name : {VendorcatDetailsdata?.ptg_poc_name}</div>
                    <div>PTG POC Number : {VendorcatDetailsdata?.ptg_poc_contact_num}</div>


                    <p className="mt-4 mb-2 font-bold">Terms & Conditions</p>
                    {/* <div className="pterms">
                    {extractTextFromHtml(VendorcatDetailsdata?.terms_and_conditions).split('\n').map((item, index) => (
                        <p key={index}>{item.trim()}</p>
                      ))}
                      </div> */}
                    <div className="pterms" dangerouslySetInnerHTML={{ __html: VendorcatDetailsdata?.terms_and_conditions }} />
                    {/* <p>{VendorcatDetailsdata?.terms_and_conditions}</p> */}
                  </Tab>
                  <Tab eventKey="documents" title="Documents">
                    {VendorcatDetailsdata?.documents &&
                      VendorcatDetailsdata.documents.length > 0 ? (
                      <Row className="mt-4">
                        {VendorcatDetailsdata.documents.map(
                          (document, index) => (
                            <Col xs={12} md={2} key={index}>
                              <p className="pdf-tag">{document.document_name}</p>
                              <div className="doc-card position-relative">
                                <div className="pdfdwn">
                                  <img src={pdf} alt="" />
                                </div>
                                <div className="doc-sec position-absolute">
                                  <div className="d-flex justify-content-between">
                                    {/* <Button
                                      className="view"
                                      onClick={() =>
                                        downloadDocument(
                                          document.document,
                                          document.name
                                        )
                                      }
                                    >
                                      <img src={download} alt="" />
                                    </Button> */}
                                   <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                      <a
                                        href={documentUrls[index]}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img src={view} alt="" />
                                      </a>{" "}
                                    </Button> 
                                     {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTab(`data:application/pdf;base64,${documentUrls[index]}`)}>                                  
                                        <img src={view} alt="" />                                    
                                    </Button> */}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          )
                        )}
                      </Row>
                    ) : (
                      <p>No documents available.</p>
                    )}
                  </Tab>
                  <Tab eventKey="orders" title="Orders">
                    <div className="table-responsive mt-4 ms-4" id="tableData">
                      <Table className="bg-header">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Status</th>
                            <th>Deliver Date</th>
                            <th>Document Count</th>
                            <th>Part Count</th>
                            <th>Total Price </th>
                          </tr>
                        </thead>
                        <tbody>

                          {vendorOrderIdData && Array.isArray(vendorOrderIdData) && vendorOrderIdData.length > 0 ? (
                            vendorOrderIdData.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <Button variant="link" className="textdark p-0" onClick={() => handleShowOrderModal(data.order_id)}>
                                    {data.order_id || "-"}
                                  </Button>
                                </td>
                                <td>{data.order_date || "-"}</td>
                                <td>{data.status || "-"}</td>
                                <td>{data.deliver_date || "-"}</td>
                                <td>{data.document_count || "-"}</td>
                                <td>{data.part_count || "-"}</td>
                                <td>{data.total_price || "-"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="text-center">
                                No Data Available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                </Tabs>
                <Modal show={showOrderModal} onHide={handleCloseOrderModal} centered className="cmodal">
                  <Modal.Header closeButton className="border-0 mb-3 p-0">Order ID : {selectedOrderId}</Modal.Header>
                  <h6>  Category Info  </h6>

                  <div className="table-responsive mt-4" id="tableData">
                    <Table className="bg-header">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Manufacturer Part No</th>
                          <th>Part Name</th>
                          <th>Description</th>
                          {/* <th>Packaging</th> */}
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Price Per Piece</th>
                        </tr>
                      </thead>
                      <tbody>
                      {isLoading ? (
                           <tr>
                             <td colSpan="8" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
                        {VendorOrderData?.part && Object.keys(VendorOrderData.part).length > 0 ? (
                          Object.keys(VendorOrderData.part).map((partKey, index) => {
                            const part = VendorOrderData.part[partKey];

                            totalQty1 += +part?.qty || 0;
                            totalPrice1 += +part?.price || 0;
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{part.mfr_prt_num || "-"}</td>
                                <td>{part.prdt_name || "-"}</td>
                                <td className="desctd">{part.description || "-"}</td>
                                {/* <td>{part.packaging || "-"}</td> */}
                                <td>{part.qty || "-"}</td>
                                <td className="pricetd">{part.price || "-"}</td>
                                <td>{part.unit_price || "-"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">No Data Available</td>
                          </tr>
                        )}
                      </>
                          )}
                      </tbody>
                      <tfoot>
                        <tr className="border-top">
                          <td>Total</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td><span title={totalQty1}>{totalQty1}</span></td>
                          <td  title={totalPrice1}>&#8377; {totalPrice1}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                  <Row className="mt-4 p-0">
                    <div className="col-md-6">
                      <p class="mb-2 font-bold">Terms & Conditions</p>
                      {/* <p className="textfont">{VendorOrderData?.terms_and_conditions}</p> */}
                      <div className="pterms" dangerouslySetInnerHTML={{ __html: VendorOrderData?.terms_and_conditions }} />
                    </div>
                    <div className="col-md-6">
                      <p class="mb-2 font-bold">Payment Terms</p>
                      {/* <p className="textfont">{VendorOrderData?.payment_terms}</p> */}
                      <div className="pterms" dangerouslySetInnerHTML={{ __html: VendorOrderData?.payment_terms }} />
                    </div>
                  </Row>

                  <div className="w-100">
                    <p class="mb-2 mt-3 font-bold">Documents</p>
                    {VendorOrderData?.documents &&
                      VendorOrderData.documents.length > 0 ? (
                      <Row className="w-100">
                        {VendorOrderData.documents.map(
                          (document, index) => (
                            <Col xs={12} md={3} key={index} className="mb-3">
                              <p className="pdf-tagg">{document?.document_name}</p>
                              <div className="doc-card position-relative">
                                <div className="pdfdwn">
                                  <img src={pdf} alt="" />
                                </div>
                                <div className="doc-sec position-absolute">
                                  <div className="d-flex justify-content-between">
                                    {/* <Button
                                      className="view"
                                      onClick={() =>
                                        downloadDocument1(
                                          document.url,
                                          document.name
                                        )
                                      }
                                    >
                                      <img src={download} alt="" />
                                    </Button> */}
                                    <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                                      <a
                                        href={documentUrlsorder[index]}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img src={view} alt="" />
                                      </a>{" "}
                                    </Button> 
                                     {/* <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }} onClick={() => openPDFInNewTabnew(`data:application/pdf;base64,${documentUrlsorder[index]}`)}>                                  
                                        <img src={view} alt="" />                                    
                                    </Button> */}
                                  </div>
                                </div>
                              </div>
                            </Col>
                          )
                        )}
                      </Row>
                    ) : (
                      <p>No Documents Available.</p>
                    )}</div>

                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="grow" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </>
  );
};

export default VendorsDetails;




