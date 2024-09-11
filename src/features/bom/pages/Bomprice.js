import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import '../styles/BomDetails.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import Modal from "react-bootstrap/Modal";
import Papa from 'papaparse';
import dndarw from '../../../assets/Images/download-up-arw.svg'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { SaveBomPriceData, getPriceBomDatabyId, selectLoadingState, selectPriceBomDatabyID, selectSavePriceBom } from '../slice/BomSlice';
const Bomprice = ({ props, id, onCheckboxChange, onCheckedData, onCheckboxSelect, uncheckAllCheckboxes, description}) => {
  const dispatch = useDispatch();
  const bomId = props?.bom_id;
  console.log(description);
  const [key, setKey] = useState('Mcategoryinfo');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [mCategoryData, setMCategoryData] = useState([]);
  const [eCategoryData, setECategoryData] = useState([]);
  const [disablePricebom, setDisablePricebom] = useState(false);
  console.log(eCategoryData);
  // const [selectAllMCategory, setSelectAllMCategory] = useState(false);
  // const [selectAllECategory, setSelectAllECategory] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [selectedVendorsMCategory, setSelectedVendorsMCategory] = useState([]);
  const [selectedVendorsECategory, setSelectedVendorsECategory] = useState([]);
  const getPricebomdata = useSelector(selectPriceBomDatabyID);
  const isLoading = useSelector(selectLoadingState);
  const data = getPricebomdata?.body;
  console.log(getPricebomdata);

  const [firstTimeChecked, setFirstTimeChecked] = useState(true);

  const handleClose = () => {
    setShow(false);
    setModalIsOpen(false); // Close the modal when the modal is closed.
  };

  const handleShow = () => {
    setShow(true);
    setModalIsOpen(true); // Open the modal when the modal is shown.
  };

  const handleCheckboxChange = (e, item) => {  
    if (key === 'Mcategoryinfo') {
      if (e.target.checked) {
        let data = mCategoryData?.filter((obj) => obj?.vendor === item?.vendor)?.map((sub) => sub?.mfr_prt_num);
        console.log(data);
        setSelectedVendorsMCategory([...data]);
      }
      else {
        let data = selectedVendorsMCategory?.filter((obj) => obj !== item?.mfr_prt_num)
        console.log(data);
        setSelectedVendorsMCategory([...data])
      }
    }
    else if (key === 'Ecategoryinfo') {
      if (e.target.checked) {
        let data = eCategoryData?.filter((obj) => obj?.vendor === item?.vendor)?.map((sub) => sub?.mfr_prt_num)
        console.log(data);
        setSelectedVendorsECategory([...data]);
      }
      else {
        let data = selectedVendorsECategory?.filter((obj) => obj !== item?.mfr_prt_num);
        setSelectedVendorsECategory([...data]);
      }
    }
    
    // Extract the vendor and vendor_id
    const selectedVendor = {
      vendor: item?.vendor,
      vendor_id: item?.vendor_id,
    };

    // Update the selected vendors based on the key (M or E category)
    if (key === 'Mcategoryinfo') {
      if (e.target.checked) {
        setSelectedVendorsMCategory(prevSelectedVendors => [...prevSelectedVendors, selectedVendor]);
      } else {
        setSelectedVendorsMCategory(prevSelectedVendors =>
          prevSelectedVendors.filter(vendor => vendor.vendor_id !== selectedVendor.vendor_id)
        );
      }
    } else if (key === 'Ecategoryinfo') {
      if (e.target.checked) {
        setSelectedVendorsECategory(prevSelectedVendors => [...prevSelectedVendors, selectedVendor]);
      } else {
        setSelectedVendorsECategory(prevSelectedVendors =>
          prevSelectedVendors.filter(vendor => vendor.vendor_id !== selectedVendor.vendor_id)
        );
      }
    }

    // Call the callback with the selected vendors
    if (key === 'Mcategoryinfo') {
      onCheckboxSelect(selectedVendorsMCategory);
    } else if (key === 'Ecategoryinfo') {
      onCheckboxSelect(selectedVendorsECategory);
    }
    onCheckboxChange(e.target.checked);
    setFirstTimeChecked(false);
  };

  // console.log(selectedVendorsMCategory);

  const hasDifferentVendors = (vendors) => {
    // Check if there are different vendors in the array
    const uniqueVendors = [...new Set(vendors)];
    return uniqueVendors.length > 1;
  };

  const handleFileUpload =  (e) => {
    const file = e.target.files[0];
    if (file) {
        if (key === 'Mcategoryinfo') {
          parseMCategoryCSV(file);
        } else if (key === 'Ecategoryinfo') {
          parseECategoryCSV(file);
        }
        setFileUploaded(true);
      setSelectedVendorsMCategory([]);
      setSelectedVendorsECategory([]);
      // uncheckAllCheckboxes();

      setTimeout(() => {
        setFileUploaded(false);
      }, 500);
    }
    handleClose();
  };
  const parseMCategoryCSV = (csvText) => {
    Papa.parse(csvText, {
      encoding: 'ASCII',
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (validateEmptyCells(result.data)) {
        setMCategoryData(result.data);
        let request;
        request = {
        part_information: result.data,
        bom_id: bomId,
        department: key === 'Mcategoryinfo' ? "Mechanic" : "Electronic"
      };
    dispatch(SaveBomPriceData(request));
        }
        else{
          toast.error('Empty cells found in the CSV.')
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error.message);
      },
    });
  };

  const parseECategoryCSV = (csvText) => {
    Papa.parse(csvText, {
      header: true,
      encoding: "ASCII",
      skipEmptyLines: true,
      complete: (result) => {
        if (validateEmptyCells(result.data)) {
        console.log(result.data, "==================");
        setECategoryData(result.data);
        let request;
      request = {
      part_information: result.data,
      bom_id: bomId,
      department: key === 'Mcategoryinfo' ? "Mechanic" : "Electronic"
    };
    dispatch(SaveBomPriceData(request));
  }
  else{
    toast.error('Empty cells found in the CSV.')
  }
      },
      error: (error) => {
        console.error('CSV parsing error:', error.message);
      },
    });
    
  };

  const validateEmptyCells = (data) => {
    let hasEmptyCells = false;
    data.forEach((row) => {
        Object.values(row).forEach((cell) => {
            if (cell === "" || cell === null || cell === undefined) {
                hasEmptyCells = true;
            }
        });
    });
    return !hasEmptyCells;
};

  let totalUnitPrice = 0;
  let totalExtendedPrice = 0;

  // Loop through the data array and calculate the sums
  if (key === 'Mcategoryinfo') {
    Array.isArray(mCategoryData) && mCategoryData.forEach((item) => {
      totalUnitPrice += parseFloat(item['unit_price']) || 0;
      totalExtendedPrice += parseFloat(item['extended_price']) || 0;
    });
  } else if (key === 'Ecategoryinfo') {
    Array.isArray(eCategoryData) && eCategoryData.forEach((item) => {
      totalUnitPrice += parseFloat(item['unit_price']) || 0;
      totalExtendedPrice += parseFloat(item['extended_price']) || 0;
    });
  }

  const handleTabChange = (tab) => {
    console.log(tab);
      localStorage.setItem('nestedactiveTab', tab);
      setKey(tab);
  }
  

  useEffect(() => {
  const selectedData = key === 'Mcategoryinfo'
    ? Array.isArray(mCategoryData) && mCategoryData?.filter(item => {
        return !item.status && selectedVendorsMCategory.includes(item?.mfr_prt_num);
      })
    : Array.isArray(eCategoryData) && eCategoryData?.filter(item => {
        return !item.status && selectedVendorsECategory.includes(item?.mfr_prt_num);
      });
  console.log(selectedData);
  onCheckedData(selectedData, key);
}, [selectedVendorsECategory, selectedVendorsMCategory, key]);

  


  // useEffect(() => {
  //   if (fileUploaded) {
  //     let request;
  //     request = {
  //       part_information: key === 'Mcategoryinfo' ? mCategoryData : eCategoryData,
  //       bom_id: bomId,
  //       department: key === 'Mcategoryinfo' ? "Mechanic" : "Electronic"
  //     };
  //     dispatch(SaveBomPriceData(request));
  //   }
  // }, [bomId, dispatch, fileUploaded]);


 ////******** Download Price Bom *********////

 const ekeysToDisplay = [
  "sno","mfr_prt_num", "prdt_name", "manufacturer", "ctgr_name",
  "pcb_foot_print", "description", "qty_per_board", "required_qty",
  "ordered_qty", "unit_price", "extended_price", "vendor", 
  "moq", "tax", "hsn_code", "gst", "package"
];

const mkeysToDisplay = [
  "sno","ctgr_name", "prdt_name", "mfr_prt_num", "material", "module", "description", "qty_per_board", 
  "required_qty", "ordered_qty", "unit_price", "extended_price", "vendor", 
  "moq", "tax", "hsn_code", "gst"
];
const filteredData = (key === "Mcategoryinfo" ? mCategoryData || [] : eCategoryData || []).map((item, index) =>
  (key === "Mcategoryinfo" ? mkeysToDisplay : ekeysToDisplay).reduce((obj, key) => {

   if (key === "sno") {
        obj[key] = index + 1;
    } 
    else if (item[key] !== undefined) {
        obj[key] = item[key];
    }
    return obj;

  }, {})
);

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "pricebomData.xlsx");
};

//  const handleDownloadXL = () => {
//   const excelData = bomdetailsdata.map(item => generateExcelData(item));
//   downloadXL(excelData, key === 'Mcategoryinfo' ? 'M_Category_Info' : 'E_Category_Info');
// };

// const downloadXL = (data, fileName) => {
//   const worksheet = XLSX.utils.json_to_sheet(data, { raw: true });
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//   XLSX.writeFile(workbook, `${fileName}.xlsx`);
// };



  const uncheckAll = () => {
    setSelectedVendorsMCategory([]);
    setSelectedVendorsECategory([]);
  };
  useEffect(() => {
    if (uncheckAllCheckboxes) {
      uncheckAll();
    }
  }, [uncheckAllCheckboxes]);
  useEffect(() => {
    let requestBody;
    requestBody = {
      bom_id: bomId,
      department: key === 'Mcategoryinfo' ? "Mechanic" : "Electronic"
    };
    dispatch(getPriceBomDatabyId(requestBody));
    const getActiveTab = localStorage.getItem("nestedactiveTab");
    setKey(getActiveTab);
  }, [bomId, key])

  useEffect(() => {
    if (key === 'Mcategoryinfo') {
      if (selectedVendorsMCategory.length > 0) {
        onCheckboxChange(true); // At least one vendor is selected
      } else {
        onCheckboxChange(false); // No vendors are selected
      }
    } else if (key === 'Ecategoryinfo') {
      if (selectedVendorsECategory.length > 0) {
        onCheckboxChange(true); // At least one vendor is selected
      } else {
        onCheckboxChange(false); // No vendors are selected
      }
    }
  }, [handleCheckboxChange]);

  useEffect(() => {
    if (!isLoading) {
      if (key === "Mcategoryinfo") {
        setMCategoryData(data);
      }
      else if (key === "Ecategoryinfo") {
        setECategoryData(data);
      }
    }
  }, [data]);

  useEffect(() => {
    if(key === "Mcategoryinfo"){
      const hasTrueStatus = Array.isArray(mCategoryData) && mCategoryData?.some(item => item?.status === true);
       setDisablePricebom(hasTrueStatus); 
      }
    else if(key === "Ecategoryinfo"){
      const hasTrueStatus = Array.isArray(eCategoryData) && eCategoryData?.some(item => item?.status === true);
      setDisablePricebom(hasTrueStatus);
    }
  }, [mCategoryData, eCategoryData]);

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
                  onSelect={handleTabChange}
                >
                  <Tab eventKey="Mcategoryinfo" title="M - Category Info">
                    <div className='table-responsive mt-4' id={id}>
                      <Table className='b-table'>
                        <thead>
                          <tr>
                            <th></th>
                            <th>S.NO</th>
                            <th>Category</th>
                            <th>Part Name</th>
                            <th>Part Number</th>
                            <th>material</th>
                            <th>module</th>
                            <th>Description</th>
                            <th>Quantity per Board</th>
                            <th>Required Quantity</th>
                            <th>Ordered Quantity</th>
                            <th>Unit Price</th>
                            <th>Extended Price</th>
                            <th>Vendor</th>
                            <th>MOQ(optional)</th>
                            <th>Tax(optional)</th>
                            <th>HSN Code(optional)</th>
                            <th>GST(optional)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(mCategoryData) && mCategoryData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedVendorsMCategory.includes(item?.mfr_prt_num) || item?.status}
                                  onChange={(e) => handleCheckboxChange(e, item, index)}
                                  disabled={item?.status}
                                />{" "}
                              </td>
                              <td>{index+1}</td>
                              <td>{item["ctgr_name"]}</td>
                              <td>{item["prdt_name"]}</td>
                              <td>{item["mfr_prt_num"]}</td>
                              <td>{item["material"]}</td>
                              <td>{item["module"]}</td>
                              <td>{item["description"]}</td>
                              <td>{item["qty_per_board"]}</td>
                              <td>{item["required_qty"]}</td>
                              <td>{item["ordered_qty"]}</td>
                              <td>{item["unit_price"]}</td>
                              <td>{item["extended_price"]}</td>
                              <td>{item["vendor"]}</td>
                              <td>{item["moq(optional)"] || item["moq"]}</td>
                              <td>{item["tax(optional)"] || item["tax"]}</td>
                              <td>{item["hsn_code(optional)"] || item["hsn_code"]}</td>
                              <td>{item["gst(optional)"] || item["gst"]}</td>
                            </tr>
                          ))}
                          <tr>

                            <td></td>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalUnitPrice || '-'}</td>
                            <td>{totalExtendedPrice || '-'}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Tab>
                  <Tab eventKey="Ecategoryinfo" title="E - Category Info">
                    <div className='table-responsive mt-4' id={id}>
                      <Table className='b-table'>
                        <thead>
                          <tr>
                            <th></th>
                            <th>S.NO</th>
                            <th>Manufacturer Part No</th>
                            <th>Part Name</th>
                            <th>Manufacturer</th>
                            <th>Category</th>
                            <th>PCB Foot Print</th>
                            <th>Description</th>
                            <th>Quantity per Board</th>
                            <th>Required Quantity</th>
                            <th>Ordered Quantity</th>
                            <th>Unit Price</th>
                            <th>Extended Price</th>
                            <th>Vendor</th>
                            <th>MOQ(optional)</th>
                            <th>Tax(optional)</th>
                            <th>HSN Code(optional)</th>
                            <th>GST(optional)</th>
                            <th>Part Packaging(optional)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {console.log(eCategoryData, 'eCategoryData')} */}
                          {Array.isArray(eCategoryData) && eCategoryData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedVendorsECategory.includes(item?.mfr_prt_num) || item?.status}
                                  defaultChecked={item?.status}
                                  onChange={(e) => handleCheckboxChange(e, item, index)}
                                  disabled={item?.status}
                                />{" "}
                              </td>
                              <td>{index+1}</td>
                              <td>{item["mfr_prt_num"]}</td>
                              <td>{item["part_name"]}</td>
                              <td>{item["manufacturer"]}</td>
                              <td>{item["ctgr_name"]}</td>
                              <td>{item["pcb_foot_print"]}</td>
                              <td>{item["description"]}</td>
                              <td>{item["qty_per_board"]}</td>
                              <td>{item["required_qty"]}</td>
                              <td>{item["ordered_qty"]}</td>
                              <td>{item["unit_price"]}</td>
                              <td>{item["extended_price"]}</td>
                              <td>{item["vendor"]}</td>
                              <td>{item["moq(optional)"] || item["moq"]}</td>
                              <td>{item["tax(optional)"] || item["tax"]}</td>
                              <td>{item["hsn_code(optional)"] || item["hsn_code"]}</td>
                              <td>{item["gst(optional)"] || item["gst"]}</td>
                              <td>{item["part_packaging(optional)"] || item["package"]}</td>
                            </tr>
                          ))}
                          <tr>

                            <td></td>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalUnitPrice || '-'}</td>
                            <td>{totalExtendedPrice || '-'}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="Description" title="Description">
                    <p className='mt-4'>{description}</p>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>

          <div className='mobilemargin-top'>
            {key !== "Description" ? 
            <>
             <Button className='submit mb-1' style={{marginRight: "10px"}} onClick={exportToExcel}>
             Download Price Bom
           </Button>
            <Button className='submit mb-1 submit-block' onClick={handleShow} disabled={disablePricebom}>
              Upload Price Bom
            </Button>
            </>
            : null
            }
          </div>


        </div>
      </div>
      <Modal show={modalIsOpen} onHide={handleClose} centered className="upload-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center modal-title-tag w-100" >
            Upload CSV File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="upload-btn-wrapper position-relative">
            <button className="btn">
              <img src={dndarw} alt="" className="dounload-img mb-2" />
              <span className='uploadtext'>Drag and drop to upload your CSV File</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                id="fileInput"
              />
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Bomprice;