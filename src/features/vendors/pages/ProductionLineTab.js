import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dndarw from '../../../assets/Images/download-up-arw.svg';
import Papa from 'papaparse';
import {
  getFinalProducts,
  selectGetFinalProducts,
  selectCategoryInfoData,
  sendFinalProducts,finalProductFilterSave,selectSaveFinalFilter,selectReuploadbb,finalProductReupload,bulkfinalBoardsupload,challandocs,selectFinaldoc
} from "../slice/VendorSlice";
import "../styles/Vendors.css";
import pdf from "../../../assets/Images/pdf.svg";
import view from "../../../assets/Images/view.svg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { sendBoardsText } from '../../../utils/TableContent';
import { toast } from "react-toastify";
const ProductionLineTab = ({ outward_id }) => {
  const dispatch = useDispatch();
  const [reset, setReset] = useState(0);
  const [show, setShow] = useState(false);
  const [key1, setKey1] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('');
  const getData = useSelector(selectGetFinalProducts);
  const finalBoarddata = getData?.body || {};
  // console.log(finalBoarddata);
  // Final Info States 
  const [changeStatus, setStatusChange] = useState("All")
  const [selectedFiles, setSelectedFiles] = useState(null);
  //gopi
  const [checked, setChecked] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const[comment,setComment] = useState({})
  const [productInfo, setproductInfo] = useState({});
  const [base64String, setBase64String] = useState(''); // bulkupload
  const [uploadedFileName, setUploadedFileName] = useState(''); // bulkupload
  const [show1, setShow1] = useState(false);// bulkupload
  const getchallandocs = useSelector(selectFinaldoc);
  const docs = getchallandocs?.body
  console.log(docs,"ommm");
  const data = useSelector(selectCategoryInfoData);
    const categoryinfoData = data?.body;
    console.log(categoryinfoData);
   // console.log(activeKey);
  const filter = useSelector(selectSaveFinalFilter);
  console.log(filter);
  const handleClose = () => {
    setShow(false);
    setSelectedFiles(null);    
  }
  const filteredData = (kitKey) => {
    return Object.keys(finalBoarddata[kitKey] || {});
  };

  const handleCheckbox = (e, kitKey) => {
    const isChecked = e.target.checked;
    const updatedChecked = { ...checked };
    const updatedSelectAllChecked = { ...selectAllChecked };

    if (isChecked) {
      updatedSelectAllChecked[kitKey] = true;
      const allItems = filteredData(kitKey)
        .filter((boardKey) => boardKey !== 'status')
        .map((boardKey, index) => ({
          data: finalBoarddata[kitKey][boardKey],
          originalIndex: index,
        }));
      updatedChecked[kitKey] = allItems;
    } else {
      updatedSelectAllChecked[kitKey] = false;
      updatedChecked[kitKey] = [];
    }

    setChecked(updatedChecked);
    setSelectAllChecked(updatedSelectAllChecked);
  };

  const handleCheck = (event, item, kitKey, index) => {
    const isChecked = event.target.checked;
    const updatedChecked = { ...checked };
    const kitChecked = updatedChecked[kitKey] || [];

    if (isChecked) {
      updatedChecked[kitKey] = [...kitChecked, { data: item, originalIndex: index }];
    } else {
      updatedChecked[kitKey] = kitChecked.filter((row) => row.data.pcba_id !== item.pcba_id);
    }

    setChecked(updatedChecked);
    setSelectAllChecked({
      ...selectAllChecked,
      [kitKey]: updatedChecked[kitKey].length === filteredData(kitKey).filter(boardKey => boardKey !== 'status').length
    });
  };
  const handleCommentChange = (e, item) => {
    const { name, value } = e.target;
    setComment({
      ...comment,
      [item.product_id]: value
    });
  }

  //comment column set
  useEffect(() => {
    if (finalBoarddata) {
      const initialComments = {};
      Object.keys(finalBoarddata).forEach(kitKey => {
        const productKeys = Object.keys(finalBoarddata[kitKey]).filter(key => key !== "status");
        productKeys.forEach(productKey => {
          const item = finalBoarddata[kitKey][productKey];
          if (item.comment) {
            initialComments[item.product_id] = item.comment;
          }
        });
      });
      setComment(initialComments);
    }
  }, [finalBoarddata]);
  const renderTabContent = (productdata) => {
    const productKeys = Object.keys(finalBoarddata[productdata]);
    // console.log(productKeys, "nnnnnnnnnnnnnnnnnnn")
    // Filtering out the "status" key
    const filteredProductKeys = productKeys.filter(key => key !== "status");
    const allDisabled = filteredProductKeys.every(key => finalBoarddata[productdata][key].filter_save_status === true);
    // console.log(filteredProductKeys, "bbbbbbbbbbbbbbbb")
    // console.log(filteredProductKeys.length, "vvvvvvvvvvvvvvvvvv")
    if (filteredProductKeys.length === 0) {
      return <p>No data available for {productdata}</p>
    }

    return (
      <div className="table-responsive mt-4">
        <Table className="bg-header">
          <thead>
            <tr>
            <th> 
            <input
                  type="checkbox"
                  onChange={(e) => handleCheckbox(e, productdata)}
                  checked={selectAllChecked[productdata] || false} disabled={allDisabled}
                />                                              
              </th>
              <th>S.No</th>
              <th>Product ID</th>
              <th>PCBA ID</th>
              <th>ALS ID</th>
              <th>Display Number</th>
              <th>SOM ID/ IMEI ID</th>
              <th>E-SIM NO</th>
              <th>E-SIM ID</th>
              <th>Date of EMS</th>
              <th>ICT</th>
              <th>FCT</th>
              <th>EOL</th>
              <th>Date of EOL</th>
              <th>EOL Document</th>
              <th>Status</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductKeys.length !== 0 ? filteredProductKeys.map((productKey, index) => {
              console.log(filteredProductKeys, "============")
              const item = finalBoarddata[productdata][productKey];
               console.log(item, "aaaaaaaaaaaaaaaaaaaaa")
              return (
                <tr key={index}>
                   <td>
                  <input
                      type="checkbox"
                      onChange={(e) => handleCheck(e, item, productdata, index)}
                      checked={(checked[productdata] || []).some(row => row.data.pcba_id === item.pcba_id)}
                      disabled={item.filter_save_status === true}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{item["product_id"]}</td>
                  <td>{item["pcba_id"]}</td>
                  <td>{item["als_id"]}</td>
                  <td>{item["display_number"]}</td>
                  <td>{item["som_id_imei_id"]}</td>
                  <td>{item["e_sim_no"]}</td>
                  <td>{item["e_sim_id"]}</td>
                  <td>{item["date_of_ems"]}</td>
                  <td>{item["ict"]}</td>
                  <td>{item["fct"]}</td>
                  <td>{item["eol"]}</td>
                  <td>{item["date_of_eol"]}</td>
                  <td><a href={item?.eol_document?.doc_url} target="_blank" className="linka">{item?.eol_document?.doc_name || "-"}</a></td>
                  <td>{item["product_status"]}</td>
                  <td><input type="text"
                    value={comment[item.product_id] || ''} 
                    name="comment"
                    onChange={(e) => handleCommentChange(e, item)}
                  /></td>

                </tr>
              );
            }) : 
             (
              <tr>
                <td>No Data Found</td>
              </tr>
            )
            }

            
          </tbody>
        </Table>
      </div>
    );
  };

  // Final Info Status Change 
  const handleStatusChange = (e) => {
    const {value} = e.target;
    console.log(value);
    setStatusChange(value)
    let requestObj = {
      "outward_id": outward_id,
      "product_status" : value
    }
    dispatch(getFinalProducts(requestObj))

  }
  // console.log(changeStatus, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

  useEffect(() => {
    const request = {
      "outward_id": outward_id,
      "product_status" : changeStatus
    };
    dispatch(getFinalProducts(request));
  }, [dispatch, outward_id]);

  useEffect(() => {
    const request = {
      "outward_id": outward_id     
    }
    dispatch(challandocs(request))
  
  }, [outward_id])

  const handleTabChange = (selectedKey) => {
    console.log('Current active tab key:', selectedKey);
    console.log('Tab changed to:', selectedKey);
    setKey1(selectedKey);
    setChecked([]);
    setSelectAllChecked(false);
   
};
useEffect(() => {
  if (finalBoarddata) {
    const initialTabKey = Object.keys(finalBoarddata).find(kitKey => kitKey.startsWith('Final_product_batch')) || Object.keys(finalBoarddata)[0];
    setKey1(initialTabKey);
    console.log(initialTabKey,"ommmmmmmmmmmmmmmmmmmmmmmmmm");
  }
}, [finalBoarddata]);

//bulk upload
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size exceeds 20MB.');
            event.target.value = null; // Clear the file input
            setBase64String(""); // Reset base64 string state
            setUploadedFileName(""); // Reset uploaded file name state
            return;
        }

        try {
            const base64 = await convertToBase64(file);
            setBase64String(base64);
            setUploadedFileName(file.name);
            toast.success('Folder uploaded successfully.');
        } catch (error) {
            console.error('Error uploading folder:', error);
            toast.error('An error occurred while uploading the folder.');
        }
    } else {
        toast.error('Please select a folder.');
    }
};

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const handleCancelzipfPreview = () => {
    setBase64String("");
    setUploadedFileName("");
    const inputElement = document.querySelector('input[type="file"][name="zipfolder"]');
    if (inputElement) {
        inputElement.value = '';
    }
};

const handlebulkSubmit = async (e) => {
    e.preventDefault();
    if (!base64String) {
        toast.error('Please upload a zip folder.');
        return; // Prevent further processing
    }
    const base64Content = base64String.split(',')[1];
    const request = {
        outward_id: outward_id,
        kit: key1,
        zip_data: base64Content
    }
    console.log('omm:', request);
    const response = await dispatch(bulkfinalBoardsupload(request));
    setShow1(false);
    const requestget = {
      "outward_id": outward_id,
      "product_status" : changeStatus
    };
    dispatch(getFinalProducts(requestget));
    if (response.payload?.statusCode === 200) {
        setBase64String("");
        setUploadedFileName("");
        const inputElement = document.querySelector('input[type="file"][name="zipfolder"]');
        if (inputElement) {
            inputElement.value = '';
        }
    }
    

};

const handleClose1 = () => {
    setShow1(false);
    setBase64String("");
    setUploadedFileName("");
    const inputElement = document.querySelector('input[type="file"][name="zipfolder"]');
    if (inputElement) {
        inputElement.value = '';
    }
}

const handleSubmit = async () => {
  console.log("Selected Items by Kit:", checked);
  if (Object.keys(checked).length === 0 || Object.values(checked).every(arr => arr.length === 0)) {
    toast.error("Please select at least one item to send.");
    return;
  }
  
  const finalBoards = Object.keys(checked).reduce((acc, kitKey) => {
    checked[kitKey].forEach(item => {
      acc.push({
        ...item.data,
        comment: comment[item.data.product_id] || ''
      });
    });
    return acc;
  }, []);

  // const result = Object.values(productInfo).map(item => {
  //   return {
  //     kit_id:item.kit_id,
  //     als_id:item.als_id,
  //     pcba_id:item.pcba_id,
  //     product_id:item.product_id,
  //     som_id_imei_id: item.som_id_imei_id,
  //     e_sim_no: item.e_sim_no,
  //     e_sim_id: item.e_sim_id,
  //     ict: item.ict,
  //     fct: item.fct,
  //     eol:item.eol,
  //     date_of_ems:item.date_of_ems,
  //     date_of_eol:item.date_of_eol,
  //     product_status: item.product_status,
  //     display_number:item.display_number,
  //     comment: item?.comment,

  //   };
  // });
let request =  {
  outward_id: outward_id,
  tab_key: key1,
  product_information: finalBoards,
 
};
// console.log(request,"ommmmmmmmmmmmmmmm");

// console.log(JSON.stringify(request, null, 2))
await dispatch(finalProductFilterSave(request)).then((res) => {
    if(res.payload?.statusCode === 200){
        toast.success(res?.payload?.body);
    }
});

  const req = {
    "outward_id": outward_id,
    "product_status" : changeStatus
 };
  dispatch(getFinalProducts(req));
  // console.log(req,"sucess");
};


const parseCSV = (csvText) => {
  Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
          const parsedData = result.data;
          await setproductInfo(parsedData);
          // Check for empty columns or cells
          const emptyCells = [];
          parsedData.forEach((row, rowIndex) => {
              Object.entries(row).forEach(([key, value]) => {
                  if (value === undefined || value === '') {
                      emptyCells.push({
                          row: rowIndex + 1, // Adding 1 to make it 1-based index
                          column: key,
                      });
                  }
              });
          });
  
          if (emptyCells.length > 0) {
              console.error('CSV contains empty cells:', emptyCells);
              toast.warning(`CSV contains empty cells: ${emptyCells[0].column}`);
              return;
          }
      },
      error: (error) => {
          console.error('CSV parsing error:', error.message);
      },
  });
  };

const handleReuploadfinalBoards = (e) => {
  const file = e.target.files[0];
    setSelectedFiles(file);
    if (!file) {
    return;
}
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        parseCSV(text);
    };
    reader.readAsText(file);
}
}


const handleRemoveFile = () => {
setSelectedFiles(null);
setReset(reset + 1);
};
const handleSubmitreupload = async (e) => {
  e.preventDefault();
  if (!selectedFiles) {
    toast.error("Please select a CSV file to upload.");
    return;
  }
  console.log("ommmmmmmmm",productInfo);
  const convertItem = (item) => ({
    Sno: item.Sno,
    pcba_id: item.PCBA_ID,
    product_id: item.Product_ID,
    als_id: item.ALS_ID,
    display_number: item.Display_Number,
    som_id_imei_id: item.SOM_ID_IMEI_ID,
    e_sim_id: item['E-SIM_ID'],
    e_sim_no: item['E-SIM_NO'],
    date_of_ems: item.Date_Of_EMS,
    ict: item.ICT,
    fct: item.FCT,
    eol: item.EOL,
    date_of_eol: item.Date_Of_EOL,
   
   
  });
  
  // Convert productInfo to the desired format
  const convertedProductInfo = productInfo.map(convertItem);
  const request = {
      "bom_id": categoryinfoData?.bom_id,
      "outward_id": categoryinfoData?.outward_id,
      "quantity": categoryinfoData?.qty,
      "against_po": categoryinfoData?.against_po,
      "partner_id": categoryinfoData?.partner_id,
      "kit_id": key1,
      "product_information": convertedProductInfo
  }
  console.log(convertedProductInfo,"0mmmmmmmmmmmoooooom");
  await dispatch(finalProductReupload(request)).then((res) => {
      if(res?.payload?.statusCode === 200){
        const request = {
          "outward_id": outward_id,
          "product_status" : changeStatus
        };
        dispatch(getFinalProducts(request));
          handleRemoveFile();
          handleClose();
      }
  });
}
  // Check if there is an error response
  if (getData?.statusCode === 404) {
    return (
      <div className='coming-sec'>
        <h4 className='mt-5'>No Data Available</h4>
      </div>
    );
  }
  
 
  return (
    <>
      <div className="wrap">
        <div className="mt-5 w-100">
          <div className="w-100">
            <div className="partno-sec vendorpartno-sec w-100">
            {docs && Array.isArray(docs) && docs.length > 0 ? (
  <Row className="mb-3 mt-2 partners-docs">
    {docs.map((document, index) => (
      <Col xs={12} md={2} key={index}>
        <p className="pdf-tag">{document.name}</p>
        <div className="doc-card position-relative">
          <div className="pdfdwn">
            <img src={pdf} alt="" />
          </div>
          <div className="doc-sec position-absolute">
            <div className="d-flex justify-content-between">
              <Button className="view" style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={view} alt="" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Col>
    ))}
  </Row>
) : (
  <p>No Documents Available</p>
)}
              <h1 className="title-tag mb-4">{sendBoardsText?.finalInfo}</h1>
              <div className="d-flex justify-content-end mb-3">
                <select value={changeStatus} onChange={handleStatusChange} className="form-select w-auto me-2">
                  <option value="All">All</option>
                  <option value="EOL">EOL</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Product Ready">Product Ready</option>
                </select>
                <Button className='submit me-2' onClick={() => setShow(true)}>Re Upload</Button>
                <Button className='submit ' onClick={() => setShow1(true)}>Bulk Upload </Button>
              </div>

              <div className="tab-sec-sendkit">
                {Object.keys(finalBoarddata)?.length === 0 ? (
                  <div>
                    <h2 className="d-flex justify-content-center">No Data Found</h2>
                    </div>
                ) : null}
                <Tabs id="controlled-tab-example scrollable-tabs" onSelect={handleTabChange}>
                  {typeof finalBoarddata === "object" && Object.keys(finalBoarddata).length !== 0 ? (
                    Object.keys(finalBoarddata)?.map((productdata, index) => {                    
                      return (
                        <Tab
                          eventKey={productdata}
                          title={productdata.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}
                          key={index}
                        >
                          {renderTabContent(productdata)}
                          <div className="d-flex justify-content-end  mb-2 mt-2">
                          <Button
                        className="submit"
                        onClick={handleSubmit}
                        >
                      Send
                      </Button>
                          </div>
                        </Tab>
                      )
                    })
                  ) : (
                      <></>
                  )}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={show}
        onHide={handleClose}
        centered className="upload-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center modal-title-tag w-100">
            Upload CSV File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
          <div className="upload-btn-wrapper position-relative">
            <button className="btn">
              <img src={dndarw} alt="" className="dounload-img mb-2" />
              <span className='uploadtext'>Drag and drop to upload your CSV File</span>
              <input
                key={reset}
                type="file"
                id="fileInput"
                onChange={handleReuploadfinalBoards}
              />
            </button>

             {selectedFiles !== null && ( 
            <div className="excel-uploadsec">
              <div className='attachment-sec w-100'>
                <span className="attachment-name"><img src="" alt="" className="dounload-img" />
                   {selectedFiles?.name} 
                </span>
                <span className="attachment-icon"
                  onClick={handleRemoveFile}
                > x </span>
              </div>
            </div>
             )} 
          </div>
          <div className='mt-3 d-flex justify-content-end'>
            <Button type="button" className='submit submit-min'
            onClick={handleSubmitreupload}
            >Upload</Button>
          </div>
          </form>
        </Modal.Body>
      </Modal>


        {/* //bulk upload modal */}

        <Modal show={show1} onHide={handleClose1} centered className="upload-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    &nbsp;
                </Modal.Header>
                <Modal.Body>
                    <div class="upload-btn-wrap w-100">
                        <button class="btn mb-2 w-100">Upload Zip Folder</button>
                        <input type="file" accept=".zip" name="zipfolder" onChange={handleFileChange} />
                    </div>

                        {uploadedFileName && <p className="m-0 attachment-sec1">
                            {uploadedFileName}
                            <span
                                role="button" tabindex="0" className="py-1 px-2"
                                onClick={handleCancelzipfPreview}
                            >
                                &times;
                            </span></p>}
                    <div className='mt-3 d-flex justify-content-end'>
                        <Button type="button" className='cancel me-2' onClick={handleClose1}>Cancel</Button>
                        <Button type="button" className='submit submit-min' onClick={handlebulkSubmit}>Submit</Button>
                    </div>
                </Modal.Body>
            </Modal>
    </>
  );
};

export default ProductionLineTab;
