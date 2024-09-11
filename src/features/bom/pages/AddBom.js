import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as XLSX from "xlsx";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import InputGroup from "react-bootstrap/InputGroup";
import "../styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import excel from '../../../assets/Images/excel.svg'
import Delete from "../../../assets/Images/Delete.svg";
import { useDispatch, useSelector } from "react-redux";
import dndarw from '../../../assets/Images/download-up-arw.svg'
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  selectSearchCategory,
  getSearchcategory,
  selectSearchcomponentdata,
  getSearchcomponentdata,
  selectLoadingState,
  addBOM,
} from "../slice/BomSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  textToast,
  tableBOM,
  formFieldsVendor,
  tableContent,
} from "../../../utils/TableContent";
import { envtypekey } from "../../../utils/common";

const AddBom = () => {
  let i=1;
  let j= 1;
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermvalue, setSearchTermvalue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  console.log(selectedData);
  const [key, setKey] = useState("Mechanic");
  const [key1, setKey1] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles1, setSelectedFiles1] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [excelData1, setExcelData1] = useState([]);
  const [showexcel, setShowexcel] = useState(false);
  const [showexcel1, setShowexcel1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [celldata, setcellData] = useState([])
  const [isUploadEnabled, setUploadEnabled] = useState(false);
  const [celldata1, setcellData1] = useState([])
  const [isUploadEnabled1, setUploadEnabled1] = useState(false);
  const [qty_per_board, setQty_per_board] = useState("");
  const [show, setShow] = useState(false);
  const [department, setDepartment] = useState('Mcategoryinfo');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSearch = useSelector(selectSearchCategory);
  const getCategory = useSelector(selectSearchcomponentdata);
  const isLoading = useSelector(selectLoadingState);
  const searchContainerRef = useRef(null);
  const [form, setForm] = useState({
    bom_name: "",
    bom_description: "",
  });
  const data = getSearch?.body;
  console.log(getSearch);
  const [fileNames, setFileNames] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(null);
  const [deleteDepartment, setDeleteDepartment] = useState(null);
  const [isExcelUpload, setIsExcelUpload] = useState(false);
  const [isSearchUsed, setIsSearchUsed] = useState(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);

  const clearExcelUpload = () => {
    setIsExcelUpload(false);
  };
  
  const clearSearchResult = () => {
    setIsSearchUsed(false);
  };
  
  const openDeleteModal = (rowIndex, department) => {
    console.log(rowIndex, department);
    setDeleteRowIndex(rowIndex);
    setDeleteDepartment(department);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteRowIndex(null);
    setDeleteDepartment(null);
  };

  const confirmDelete = () => {
    if (deleteRowIndex !== null && deleteDepartment !== null) {
      deleterow(deleteRowIndex, deleteDepartment);
    }
    handleCloseDeleteModal();
  };
  const handleSearchAdd = (searchResult) => {
    // Add the component from search
    setIsSearchUsed(true);
    setIsExcelUpload(false); // Disable Excel upload
    setIsUploadDisabled(true);
  };
  

  const onChange = (e) => {
    const [file] = e.target.files;
    if (!file) {
      return;
    }
    if (isSearchUsed) {
     // toast.error("Upload is disabled because a component was added via search.");
      return;
    }
    if (e.target.files.length > 0) {
      setIsExcelUpload(true);
      setIsSearchUsed(false); // Disable search
    }
  
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
      toast.error("Unsupported file type. Please upload only Excel (.xlsx) or CSV (.csv) files.");
      e.target.value = null;
      return;
    }
  
    setSelectedFiles([...selectedFiles, ...e.target.files]);
    const reader = new FileReader();
  
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
  

      const trimmedData = data.map(row => row.map(cell => typeof cell === "string" ? cell.trim().replace(/\s+/g, ' ') : cell));
       // Identify headers and required column indices
       const headers = trimmedData[0] || [];
       const requiredColumns = {        
         vic_part_number: headers.indexOf('vic_part_number'),
         prdt_name: headers.indexOf('prdt_name'),
         description: headers.indexOf('description'),
         qty_per_board: headers.indexOf('qty_per_board')
       };
 
       let emptyCellDetails = [];
 
       for (let rowIndex = 1; rowIndex < trimmedData.length; rowIndex++) {
         const row = trimmedData[rowIndex];
 
         Object.entries(requiredColumns).forEach(([key, columnIndex]) => {
           if (columnIndex === -1 || !row[columnIndex] || row[columnIndex].trim() === "") {
             emptyCellDetails.push({ row: rowIndex + 1, column: columnIndex + 1, field: key });
           }
         });
       }
 
       // Show error if empty required fields are found
       if (emptyCellDetails.length > 0) {
         console.log(emptyCellDetails, "Empty cells detected");
         setShowModal(true);
         setcellData(emptyCellDetails);
         toast.error("Uploaded file has empty required fields. Please fill in all mandatory fields.");
         return;
       }
  
      if (isMechanicFormat(trimmedData)) {
        setExcelData(trimmedData);
        setUploadEnabled(true);
        setModalIsOpen(false);
        toast.success('File uploaded successfully!');
      } else {
        toast.error("Incorrect CSV format. Please upload the correct CSV file.");
        e.target.value = null;
      }
    };
    reader.readAsBinaryString(file);
  };

const isMechanicFormat = (data) => {
  const expectedMechanicColumns = ["vic_part_number","prdt_name","description","qty_per_board"];
  const headerRow = data[0];

  // Ensure exact matching of headers
  return JSON.stringify(headerRow) === JSON.stringify(expectedMechanicColumns) && data.length > 1;
};

const onChange1 = (e) => {
  const [file] = e.target.files;
  if (!file) {
    return;
  }
  if (isSearchUsed) {
    // toast.error("Upload is disabled because a component was added via search.");
     return;
   }
   if (e.target.files.length > 0) {
     setIsExcelUpload(true);
     setIsSearchUsed(false); // Disable search
   }
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
    toast.error("Unsupported file type. Please upload only Excel (.xlsx) or CSV (.csv) files.");
    e.target.value = null;
    return;
  }

  setSelectedFiles1([...selectedFiles1, ...e.target.files]);

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

    // Check if the file is empty or only contains empty cells
    if (data.length === 0 || data.every(row => row.every(cell => !cell || cell.trim() === ""))) {
      setShowModal1(true);
      toast.error("Uploaded file has empty required fields. Please fill in all mandatory fields.");
      return;
    }

    const trimmedData = data.map(row =>
      row.map(cell => typeof cell === "string" ? cell.trim().replace(/\s+/g, ' ') : cell)
    );

    // Identify headers and required column indices
    const headers = trimmedData[0] || [];
    const requiredColumns = {        
      mfr_prt_num: headers.indexOf('mfr_prt_num'),
      ctgr_name: headers.indexOf('ctgr_name'),
      manufacturer:headers.indexOf('manufacturer'),
      qty_per_board: headers.indexOf('qty_per_board')
    };

    let emptyCellDetails = [];
    for (let rowIndex = 1; rowIndex < trimmedData.length; rowIndex++) {
      const row = trimmedData[rowIndex];
      Object.entries(requiredColumns).forEach(([key, columnIndex]) => {
        if (columnIndex === -1 || !row[columnIndex] || row[columnIndex].trim() === "") {
          emptyCellDetails.push({ row: rowIndex + 1, column: columnIndex + 1, field: key });
        }
      });
    }

    // Show error if empty required fields are found
    if (emptyCellDetails.length > 0) {
      console.log(emptyCellDetails, "Empty cells detected");
      setShowModal1(true);
      setcellData(emptyCellDetails);
      toast.error("Uploaded file has empty required fields. Please fill in all mandatory fields.");
      return;
    }

    // Only check the format after confirming there are no empty cells
    if (isElectronicFormat(trimmedData)) {
      setExcelData1(trimmedData);
      setUploadEnabled1(true);
      setModalIsOpen1(false);
      toast.success('File uploaded successfully!');
    } else {
      toast.error("Incorrect CSV format. Please upload the correct CSV file.");
      e.target.value = null;
    }
  };
  reader.readAsBinaryString(file);
};

const isElectronicFormat = (data) => {
  const expectedElectronicColumns = ["mfr_prt_num","manufacturer","ctgr_name", "qty_per_board"];
  const headerRow = data[0];

  // Ensure exact matching of headers
  return JSON.stringify(headerRow) === JSON.stringify(expectedElectronicColumns) && data.length > 1;
};


  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const searchData = data.map((category) => {
        if (Array.isArray(category) && category.length > 0) {
          const filteredCategory = category.filter(
            (item) =>
              typeof item === "string" &&
              item.toLowerCase().includes(searchTerm.toLowerCase())
          );
          console.log(data, "dataaaaaa");

          console.log(filteredCategory, "filtereddddddddddd");
          return filteredCategory.map((item) => [category]);
        }
        return [];
      });
      console.log(searchData, "searchData");

      const flatFilteredData = searchData
        .flat()
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v[0] === value[0]) === index
        );

      setFilteredData(flatFilteredData);
    }
  }, [getSearch]);

  const handleItemClick = (item) => {
    console.log(item[0][0]);
    setSearchTerm(item[0]?.[0]);
    setSearchTermvalue(item[0]?.[1]);
    setIsAddButtonDisabled(false);
    setFilteredData([]);
  };
  const deleterow = (index, department) => {
    const updatedSelectedData = [...selectedData];
    const productToDelete = updatedSelectedData.find(
      (product, i) => i === index && product.department === department
    );
  
    // Disable delete action if the component was uploaded via Excel
    if (productToDelete && productToDelete.isExcelUpload) {
      // Optionally show a toast here, or simply return to disable deletion
      return;
    }
  
    const filteredData = updatedSelectedData.filter(
      (product, i) => i !== index || product.department !== department
    );
    setSelectedProducts(filteredData);
  };
  
  const addItem = async () => {
    setFilteredData([]);
    if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
      return;
    }
    const department = key === "Mechanic" ? "Mechanic" : "Electronic";

    const request = {
      category_type: key,
      component_id: searchTerm,
      department: department,
    };

    try {
      const response = await dispatch(getSearchcomponentdata(request));
      const newItem = response.payload?.body;
      if (newItem) {
        console.log(selectedData, "selectedddd dataaaaaa");
        console.log(newItem.cmpt_id, " new cmptd ID");
        if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
          setSelectedProducts([...selectedData, newItem]);
          setIsAddButtonDisabled(true);
          setIsUploadDisabled(true);
        } else {
          toast.error("Item already added.");
        }
        setSearchTerm("");
        setSearchTermvalue("");
      } else {
        toast.error("Item not found.");
        setSearchTerm("");
        setSearchTermvalue("");
      }
    } catch (error) {
      toast.error("Error adding item.");
      setSearchTerm("");
      setSearchTermvalue("");
    }
  };

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    };
    setForm(nextFormState);
  };
  const handleClearForm = () => {
    setForm({
      bom_name: "",
      bom_description: "",
    });
    setSearchTerm("");
    setIsExcelUpload(false); 
    setIsSearchUsed(false); 
  };

const onSubmitBom = async (e) => {
  e.preventDefault();

  const requestBody = {
    env_type: envtypekey,
    bom_name: form.bom_name,
    bom_description: form.bom_description,
    tab_key: key,
    "M-Category_info": [],
    "E-Category_info": [],
  };

  selectedData.forEach((product) => {
    if (product.department === "Mechanic") {
      requestBody["M-Category_info"].push({
        // s_no: product.s_no,
        vic_part_number: product.vic_part_number,
        prdt_name: product.prdt_name,
        description: product.description,
        qty_per_board: product.qty_per_board,
      });
    } else if (product.department === "Electronic") {
      requestBody["E-Category_info"].push({
        // s_no: product.s_no,
        mfr_prt_num: product.mfr_prt_num,
        manufacturer:product.manufacturer,
        ctgr_name: product.ctgr_name,
        qty_per_board: product.qty_per_board,
      });
    }
  });

  try {
    await dispatch(addBOM(requestBody));
    handleClearForm();
     setExcelData([]);
      setExcelData1([]);
      // Clear selectedData
      setSelectedProducts([]);
  } catch (error) {
    toast.error("Failed to submit BOM.");
  }
};
  useEffect(() => {
    setSelectedProducts([]);
  }, []);

  const [errorDisplayed, setErrorDisplayed] = useState(false);

  // const handleQtyPerBoardChange = (newValue, rowIndex) => {
  //   if (
  //     newValue === "" ||
  //     (!isNaN(newValue) &&
  //       parseInt(newValue, 10) !== 0 &&
  //       parseInt(newValue, 10) >= 1)
  //   ) {
  //     setErrorDisplayed(false);

  //     setSelectedProducts((prevSelectedData) => {
  //       const updatedSelectedData = [...prevSelectedData];
  //       updatedSelectedData[rowIndex] = {
  //         ...updatedSelectedData[rowIndex],
  //         qty_per_board: newValue === "" ? "" : String(newValue, 10),
  //       };
  //       return updatedSelectedData;
  //     });
  //   } else {
  //     if (!errorDisplayed) {
  //       toast.error("Qty per board must be a non-zero number");
  //       setErrorDisplayed(true);
  //     }
  //   }
  //   console.log(newValue, "quantityyyyyy");
  // };

  const handleQtyPerBoardChange = (newValue, rowIndex) => {
    setSelectedProducts((prevSelectedData) => {
      const updatedSelectedData = [...prevSelectedData];
  
      // Check if the row was uploaded via Excel
      if (updatedSelectedData[rowIndex].isExcelUpload) {
        // Do not allow editing if the row is from an Excel upload
        return updatedSelectedData;
      }
  
      // Proceed with updating the qty_per_board if the input is valid
      if (newValue === "" || (!isNaN(newValue) && parseInt(newValue, 10) !== 0 && parseInt(newValue, 10) >= 1)) {
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          qty_per_board: newValue === "" ? "" : String(newValue, 10),
        };
      }
  
      return updatedSelectedData;
    });
  };
  

  const handleSearch2 = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    setSearchTermvalue(searchTerm);

    if (searchTerm.trim().length < 2) {
      setFilteredData([]);
      return;
    }
    const request = {
      category_name: searchTerm,
      component_type: key,
    };
    setFilteredData([]);
    dispatch(getSearchcategory(request));
  };

  const handleTabChange = (selectedKey) => {
    setKey1(selectedKey);
    setKey(selectedKey);
    setSearchTerm("");
    setFilteredData([]);
    setSearchTermvalue("");
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setFilteredData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  
  const handleClose = () => {
    setShow(false);
    setShowModal(false);
    setSelectedFiles([]); 
    setIsUploadDisabled(false); 
    setModalIsOpen(false); // Close the modal when the modal is closed.
  };

  const handleShow = () => {
    setShow(true);
    setModalIsOpen(true); // Open the modal when the modal is shown.
  };


  const handleClose1 = () => {
    setShow(false);
    setSelectedFiles1([]); 
    setModalIsOpen1(false); // Close the modal when the modal is closed.
  };

  const handleShow1 = () => {
    setShow(true);
    setModalIsOpen1(true); // Open the modal when the modal is shown.
  };
  
  const exportExcel = () => {
    let headers = [
       "mfr_prt_num,manufacturer,ctgr_name,qty_per_board",
    ];

    headers = headers.map(header => '"' + header.split(",").join('","') + '"');

    downloadFile({
      data: headers.join("\n"),
      fileName: "ECategory.csv",
      fileType: "text/csv",
    });
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


//download csv mechanic
const exportExcel1 = () => {
  let headers = [
    "vic_part_number,prdt_name,description,qty_per_board",
  ];

  downloadFile1({
    data: [...headers].join("\n"),
    fileName: "MCategory.csv",
    fileType: "text/csv",
  });
};
const downloadFile1 = ({ data, fileName, fileType }) => {
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

const removeattachment = () => {
  // const updatedFiles = selectedFiles.filter((_, i) => i !== index);
  setSelectedFiles([]);
  setExcelData([]);
  setUploadEnabled(false);
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
      fileInput.value = null;
  }
}

const removeattachment1 = () => {
  // const updatedFiles = selectedFiles.filter((_, i) => i !== index);
  setSelectedFiles1([]);
  setExcelData1([]);
  setUploadEnabled1(false);
  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
      fileInput.value = null;
  }
}
  // Effect to handle excelData changes
  useEffect(() => {
    if (excelData.length > 1) {
      const formattedData = formatMechanicData(excelData.slice(1));
      mergeData(formattedData);
    }
  }, [excelData]);

  // Effect to handle excelData1 changes
  useEffect(() => {
    if (excelData1.length > 1) {
      const formattedData = formatElectronicData(excelData1.slice(1));
      mergeData(formattedData);
    }
  }, [excelData1]);

const formatMechanicData = (data) => {
  return data.map((row, index) => ({
    id: `Mechanic-${index}`,
    // s_no: row[0]
    vic_part_number: row[0],
    prdt_name: row[1],
    description: row[2],
    qty_per_board: row[3],
    department: "Mechanic",
    isExcelUpload: true,
  }));
};

// Function to format Electronic data
const formatElectronicData = (data) => {
  return data.map((row, index) => ({
    id: `Electronic-${index}`,
    // s_no: row[0],
    mfr_prt_num: row[0],
    manufacturer: row[1],
    ctgr_name: row[2],
    qty_per_board: row[3],
    department: "Electronic",
    isExcelUpload: true,
  }));
};

// Function to merge formatted data with selectedData
const mergeData = (newData) => {
  setSelectedProducts((prevSelectedData) => {
    // Combine previous data with new data without filtering duplicates
    const combinedData = [...prevSelectedData, ...newData];

    // Simply return the combined data without any filtering
    return combinedData;
  });
};

useEffect(() => {
  if (!modalIsOpen) {
    setSelectedFiles([]); 
    setExcelData([]); 
    setcellData([]);
  }
}, [modalIsOpen]);

useEffect(() => {
  if (!modalIsOpen1) {
    setSelectedFiles1([]); 
    setExcelData1([]); 
    setcellData1([]);
  }
}, [modalIsOpen1]);

  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h3>
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => {
                navigate(-1);
              }}
            />
            {tableBOM.addBomTitle}
          </h3>
          <div className='mobilemargin-top'>
          {key === 'Mechanic' && (
    <>
          <Button className='submit me-2 md-me-2 submitmobile' onClick={exportExcel1}>
           Download Mechanic CSV format
             </Button>
            <Button
              className="submit mb-1 submit-block me-2"
              onClick={handleShow}
              disabled={isUploadDisabled}
              
      >
               M-Components Upload
            </Button>
    </>
  )}
           {key === 'Electronic' && (
    <>
              <Button className='submit me-2 md-me-2 submitmobile' onClick={exportExcel}>
             Download Electronic CSV format
           </Button>
            <Button
             className="submit mb-1 submit-block me-2"
              onClick={handleShow1}
              disabled={isUploadDisabled}
          
      >
              E-Components Upload
           </Button>
    </>
  )}
     </div>
          </div>
        <form onSubmit={onSubmitBom}>
          <div className="content-sec">
            <h5> {tableBOM.bomInfo}</h5>
            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-4">
                  <Form.Label> {tableBOM.bomName}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    name="bom_name"
                    value={form.bom_name.trimStart()}
                    onChange={onUpdateField}
                    required={true}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={12}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    {" "}
                    {tableBOM.description}
                    {textToast.maxlength}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bom_description"
                    value={form.bom_description}
                    onChange={onUpdateField}
                    required={true}
                    maxLength={500}
                  />
                </Form.Group>
              </Col>
            </Row>
            <>
              <div>
                <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                  <div className="position-relative" ref={searchContainerRef}>
                    <InputGroup className="mb-0 search-add search-add-align">
                      <Form.Control
                        placeholder="Search components"
                        aria-label="Search components"
                        aria-describedby="basic-addon2"
                        type="search"
                        value={searchTermvalue.trimStart()}
                        onChange={handleSearch2}
                        disabled={isExcelUpload} 
                      />
                      <Button
                        variant="secondary"
                        id="button-addon2"
                        disabled={!searchTerm.trim() || isAddButtonDisabled}
                        onClick={addItem}
                      >
                        + Add
                      </Button>
                    </InputGroup>
                    <ul className="position-absolute searchul" hidden={searchTermvalue.trim().length==0?true:false}>
                      {filteredData &&
                        filteredData?.map((item, index) => (
                          <li key={index} onClick={() => handleItemClick(item)}>
                            {/* {item[0].join(" , ")} */}
                            {/* {item[0]?.[1]} */}
                            {item[0].slice(1).join(" , ")}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={handleTabChange}
                >
                  <Tab eventKey="Mechanic" title="M-Category Info">
                    {key === "Mechanic" ? (
                      <>
                        <div className="table-responsive mt-4">
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th>S.NO</th>
                                <th> Manufacturer Part No</th>
                                <th> {tableBOM.prodName}</th>
                                {/* <th> {tableBOM.category}</th>
                                <th> {tableBOM.technicalDetails}</th> */}
                                <th> {tableBOM.description}</th>
                                <th> {tableBOM.qtyPerBoard}</th>
                                <th> {tableContent.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                            {selectedData.length > 0 ? (
                                selectedData.map((product, rowIndex) => (

                                  <tr key={product.mfr_prt_num}>
                                    {product.department === "Mechanic" && (
                                      <>
                                        <td>{i++}</td>
                                        <td>{product?.vic_part_number }</td>
                                        <td>{product?.prdt_name}</td>
                                        {/* <td>{product?.ctgr_name}</td>  */}
                                        {/* <td>{product?.technical_details}</td> */} 
                                        <td>{product?.description}</td>
                                        <td>
                                        <input
                                         type="text"
                                         className="input-50"
                                         value={product.qty_per_board}
                                         onInput={(e) => {
                                       e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                      }}
                                          onChange={(e) =>
                                   handleQtyPerBoardChange(e.target.value, rowIndex)
                                         }
                                           required
                                     disabled={product.isExcelUpload} // Disable input if uploaded via Excel
                                      />
                                        </td>

                                        {/* <td
                                          onClick={() =>
                                            deleterow(
                                              rowIndex,
                                              product.department
                                            )
                                          }
                                        >
                                          <img src={Delete} />
                                        </td> */}
                                           <td
                                     onClick={() => {
                                   if (!product.isExcelUpload) {
                                    openDeleteModal(rowIndex, product.department);
                                     }
                                     }}
                                   >
                               {product.isExcelUpload ? (
                             <img src={Delete} alt="Delete" style={{ opacity: 0.5 }} />
                                ) : (
                              <img src={Delete} alt="Delete" />
                                   )}
                                    </td>
                                    </>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      {textToast.noData}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                  <Tab eventKey="Electronic" title="E- Category Info">
                    {key == "Electronic" ? (
                      <>
                        <div className="table-responsive mt-4">
                          <Table className="b-table">
                            <thead>
                              <tr>
                                <th>S.NO</th>
                                <th> {tableBOM.mfrPartNo}</th>
                                <th>Manufacturer</th>
                                {/* <th> {tableBOM.subCategory}</th> */}
                                <th> {tableBOM.deviceCat}</th> 
                                <th> {tableBOM.qtyPerBoard}</th>
                                {/* <th> {tableBOM.mountingType}</th> */}
                                <th> {tableContent.actions}</th>
                              </tr>
                            </thead>
                            <tbody>
                            {selectedData.length > 0 ? (
                                selectedData.map((product, rowIndex) => (
                                  <tr key={product.mfr_prt_num}>
                                    {product.department === "Electronic" && (
                                      <>
                                        <td>{j++}</td>
                                        <td>{product?.mfr_prt_num}</td>
                                        <td>{product?.manufacturer}</td>
                                        {/* <td>{product?.sub_category}</td> */}
                                        <td>{product?.ctgr_name}</td>
                                        <td>
                                            <input
                                            type="text"
                                          className="input-50"
                                          value={product.qty_per_board}
                                         onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                      }}
                                   onChange={(e) =>
                                handleQtyPerBoardChange(e.target.value, rowIndex)
                                     }
                                    required
                            disabled={product.isExcelUpload} // Disable input if uploaded via Excel
                             />
                             </td>

                                        {/* <td>{product?.mounting_type}</td> */}
                                        {/* <td
                                          onClick={() =>
                                            deleterow(
                                              rowIndex,
                                              product.department
                                            )
                                          }
                                        >
                                          <img src={Delete} />
                                        </td> */}
                                        <td
                                           onClick={() => {
                                     if (!product.isExcelUpload) {
                                 openDeleteModal(rowIndex, product.department);
                                  }
                                  }}
                                   >
                               {product.isExcelUpload ? (
                           <img src={Delete} alt="Delete" style={{ opacity: 0.5 }} />
                              ) : (
                        <img src={Delete} alt="Delete" />
                                     )}
                                    </td>

                                      </>
                                    )}
                                  </tr>
                                ))
                              ) : (
                                <>
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      {textToast.noData}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    ) : null}
                  </Tab>
                </Tabs>
              </div>
            </>
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              {formFieldsVendor.btnCancel}
            </Button>
            <Button type="submit" className="submit">
              {formFieldsVendor.btnCreate}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden"> {formFieldsVendor.loader}</span>
          </Spinner>
        </div>
      )}

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
        transition={Zoom}
      />

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Body>
          Are you sure you want to delete the selected item?
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <div className="mt-3 d-flex justify-content-center">
            <Button
              type="button"
              className="cancel me-2"
              onClick={handleCloseDeleteModal} >
              No
            </Button>
            <Button type="submit" className="submit" onClick={confirmDelete}>
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
     
      <Modal show={modalIsOpen} onHide={handleClose} centered className="upload-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center modal-title-tag w-100" >
           M-Components Upload 
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
                onChange={onChange}
                id="fileInput"
              />
            </button>
            {selectedFiles.map((file, index) => (
                    <div key={index} className="excel-uploadsec">
                        <div className='attachment-sec w-100'>
                            <span className="attachment-name"><img src={excel} alt="" className="dounload-img" /> {file.name}</span>
                            <span className="attachment-icon" onClick={removeattachment}> x </span>
                        </div>
                    </div>
                ))}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={modalIsOpen1} onHide={handleClose1} centered className="upload-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center modal-title-tag w-100" >
           E-Components Upload 
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
                onChange={onChange1}
                id="fileInput"
              />
            </button>
            {selectedFiles1.map((file, index) => (
                    <div key={index} className="excel-uploadsec">
                        <div className='attachment-sec w-100'>
                            <span className="attachment-name"><img src={excel} alt="" className="dounload-img" /> {file.name}</span>
                            <span className="attachment-icon" onClick={removeattachment1}> x </span>
                        </div>
                    </div>
                ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBom;
