import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Table, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GetPartnerSendBoards, SendPartnerSendBoards, getSendboarddata, selectCategoryInfoData, selectGetSendboards, selectLoadingStatus, sendBoards, bulkBoardsupload } from "../slice/VendorSlice";
import { Spinner } from 'react-bootstrap';
import { formFieldsVendor, sendBoardsText, tableContent, ordersTable } from '../../../utils/TableContent';
import dndarw from '../../../assets/Images/download-up-arw.svg';
import Papa from 'papaparse';
import { toast } from "react-toastify";

const BoardsInfo = ({ outward_id,dep_type }) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoadingStatus);
    const getData = useSelector(selectGetSendboards);
    const finalBoarddata = getData?.body;
    const [activeKey, setActiveKey] = useState(null);
    const isError = getData?.statusCode === 404;
    const data = useSelector(selectCategoryInfoData);
    const categoryinfoData = data?.body;
    console.log(dep_type);
    console.log(activeKey);
    //----------------------//
    const [base64String, setBase64String] = useState(''); // bulkupload
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [reset, setReset] = useState(0);
    const [boardInfo, setBoardInfo] = useState({});
    console.log(JSON.stringify(boardInfo, null, 2));
    const [boardsData, setBoardsData] = useState();
    const [selectedParts, setSelectedParts] = useState({});
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState(''); // bulkupload


    // const handleTabSelect = async (key) => {
    //     setActiveKey(key);
    //     const kitData = finalBoarddata?.sorteddata[key];
    //     const filteredKitData = Object.keys(kitData).reduce((acc, key) => {
    //         if (key !== "status") {
    //             acc[key] = kitData[key];
    //         }
    //         return acc;
    //     }, {});
     
    //     setBoardInfo(filteredKitData);
    // };     

    const handleTabSelect = async (key) => {
        setActiveKey(key);    
        // Safely access the kit data with optional chaining and provide a default empty object
        const kitData = finalBoarddata?.sorteddata[key] || {};    
        // Check if kitData is an object and has keys
        if (Object.keys(kitData).length === 0) {
            // Handle the empty object case, e.g., set board info to an empty object or show a message
            setBoardInfo({});
            return; // Exit the function early since there's nothing to process
        }    
        // Filter out 'status' key from kitData
        const filteredKitData = Object.keys(kitData).reduce((acc, currentKey) => {
            if (currentKey !== "status") {
                acc[currentKey] = kitData[currentKey];
            }
            return acc;
        }, {});
            // Set the filtered data to state
        setBoardInfo(filteredKitData);
    };

    const handleCommentChange = (e, partKey) => {
        const { name, value } = e.target;
        setBoardInfo(prevKitData => ({
            ...prevKitData,
            [partKey]: {
                ...prevKitData[partKey],
                [name]: value
            }
        }));
    };
    console.log(JSON.stringify(boardInfo, null, 2));
    const renderTabContent = (kitKey) => {
        // console.log(kitKey);
        if (!boardsData?.sorteddata) {
            return <p>No content available for this kit</p>;
        }
        const kitData = boardsData?.sorteddata[kitKey] || [];
        // console.log(kitData);
        if (Array.isArray(kitData) && kitData.length === 0) {
            return <p>No data available for {kitKey}</p>;
        }
        const filteredKitData = Object.keys(kitData).reduce((acc, key) => {
            if (key !== "status") {
                acc[key] = kitData[key];
            }
            return acc;
        }, {});
        console.log(filteredKitData);
        if (Object.keys(filteredKitData).length === 0) {
            return <p>No data available for {kitKey}</p>;
        }

        const headers = ["S.No", "PCBA ID", "SOM ID/IMEI ID", "E SIM ID", "E SIM NO", "ICT", "FCT", "Status","Document", "Comment"];
        return (
            <div className="table-responsive mt-4" id="tableData">
                <Table className="bg-header table-lasttr">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(filteredKitData).sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                            .map((partKey, index) => {
                                const part = filteredKitData[partKey];
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{part?.pcba_id}</td>
                                        <td>{part?.som_id_imei_id}</td>
                                        <td>{part?.e_sim_id}</td>
                                        <td>{part?.e_sim_no}</td>
                                        <td>{part?.ict}</td>
                                        <td>{part?.fct}</td>
                                        <td>{part?.board_status}</td>
                                        <td><a href={part?.document?.doc_url} target="_blank" className="linka">{part?.document?.doc_name || "-"}</a></td>
                                        <td><input type="textarea" value={part?.comment} name="comment"  onChange={(e) => handleCommentChange(e, partKey)} /></td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div>
        );
    };

    const convertToCamelCase = (str) => {
        let camelCaseStr = str.replace(/[_\s]([a-z])/ig, (match, group) => group.toUpperCase());
        camelCaseStr = camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
        return camelCaseStr;
    }

    const parseCSV = (csvText) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                const parsedData = result.data;
                await setBoardInfo(parsedData);
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

    const handleReuploadsendBoards = (e) => {
        const file = e.target.files[0];
        setSelectedFiles(file);
        if (!file) {
            return;
        }

         // Check if the file is empty
    if (file.size === 0) {
        toast.warning("The uploaded file is empty.");
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

    const handleSubmitreupload = async () => {
        const request = {
            "bom_id": categoryinfoData?.bom_id,
            "outward_id": categoryinfoData?.outward_id,
            "partner_id": categoryinfoData?.partner_id,
            "quantity": categoryinfoData?.qty,
            "delivery_end_date": categoryinfoData?.order_date,
            "against_po": categoryinfoData?.against_po,
            "kit_id": activeKey,
            "board_information": boardInfo
        }

        if(selectedFiles !== null){

        await dispatch(sendBoards(request)).then((res) => {
            if (res?.payload?.statusCode === 200) {
                handleRemoveFile();
                handleClose();
                window.location.reload();
            }
            else {
                toast.error(res?.payload?.body);
            }
        });
    }
    else{
        toast.error("Kindly Upload the File");
        return;
    }
    }
    const handleSubmit = async () => {
        const result = Object.values(boardInfo).map(item => {
            return {
                kit_id: item.kit_id,
                pcba_id: item.pcba_id,
                som_id_imei_id: item.som_id_imei_id,
                e_sim_no: item.e_sim_no,
                e_sim_id: item.e_sim_id,
                status: item.status,
                ict: item.ict,
                fct: item.fct,
                board_status: item.board_status,
                comment: item?.comment,
                kits_send:"true"

            };
        });
        console.log(JSON.stringify(result, null, 2))
        const checkComment = result.some((item) => !item.comment || item.comment.trim() === "");
        if(!checkComment){
            console.log("kjh========================")
        let request = {
            "bom_id": categoryinfoData?.bom_id,
            "outward_id": categoryinfoData?.outward_id,
            "partner_id": categoryinfoData?.partner_id,
            "quantity": categoryinfoData?.qty,
            "delivery_end_date": categoryinfoData?.order_date,
            "against_po": categoryinfoData?.against_po,
            "board_information": result
        }

        // console.log(JSON.stringify(request, null, 2))
        await dispatch(SendPartnerSendBoards(request)).then((res) => {
            if (res.payload?.statusCode === 200) {
                toast.success(res?.payload?.body);
            }
        });
        const req = {
            "outward_id": outward_id,
            "type":dep_type,
            "board_status": selectedStatus || "All"
        };
        dispatch(getSendboarddata(req));
    }
    else{
        toast.error("Fill Every Comment and Submit Or Else Don't");
    }
    }

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
            kit: activeKey,
            zip_data: base64Content
        }
        console.log('omm:', request);
        const response = await dispatch(bulkBoardsupload(request));
        setShow1(false);
        if (response.payload?.statusCode === 200) {
            setBase64String("");
            setUploadedFileName("");
            const inputElement = document.querySelector('input[type="file"][name="zipfolder"]');
            if (inputElement) {
                inputElement.value = '';
            }
            const req = {
                "outward_id": outward_id,
                "type":dep_type,
                "board_status": selectedStatus || "All"
            };
            dispatch(getSendboarddata(req));
        }

    };
    const handleClose = () => {
        setShow(false);
        setSelectedFiles(null);
    }
    const handleClose1 = () => {
        setShow1(false);
        setBase64String("");
        setUploadedFileName("");
        const inputElement = document.querySelector('input[type="file"][name="zipfolder"]');
        if (inputElement) {
            inputElement.value = '';
        }
    }
    const handleSelectStatusChange = (e) => {
        const { value } = e.target;
        setSelectedStatus(value);
        const requestobj = {
            "outward_id": outward_id,
            "board_status": value,
            "type":dep_type,
        }
        dispatch(getSendboarddata(requestobj)).then((req) => {
            if (req.payload.statusCode === 200) {
                console.log(req.payload.body);
                setBoardsData(req.payload.body);
            }
        });
    }



    useEffect(() => {
        const request = {
            "outward_id": outward_id,
            "board_status": "All",
            "type":dep_type,
        };
        dispatch(getSendboarddata(request));
    }, []);

    useEffect(() => {
        if (finalBoarddata && finalBoarddata.sorteddata) {
            const firstTabKey = Object.keys(finalBoarddata.sorteddata)[0];
            handleTabSelect(firstTabKey);
            setActiveKey(firstTabKey);
            setBoardsData(finalBoarddata);
        }
    }, [finalBoarddata]);

    useEffect(() => {
        if (categoryinfoData && categoryinfoData.sorteddata) {
            const firstTabKey = Object.keys(categoryinfoData.sorteddata)[0];
            setActiveKey(firstTabKey);
        }
    }, [categoryinfoData]);
    return (
        <>
            <div className="wrap">
                <div className="mt-5 w-100">
                    <div className="w-100">
                        <div className="partno-sec vendorpartno-sec w-100">
                            <h1 className="title-tag mb-4">{sendBoardsText?.bInfo}</h1>
                            {dep_type === "EMS" && dep_type !== undefined ? (<div className="d-flex justify-content-end">
                                <select value={selectedStatus} onChange={handleSelectStatusChange} className="form-select w-auto me-2">
                                    <option value="All">All</option>
                                    <option value="EMS_Done">EMS Done</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                {!isError ? <Button className='submit me-2 submitmobile' onClick={() => setShow(true)}>Update Kit</Button> : null}

                                <Button className='submit ' onClick={() => setShow1(true)}>Bulk Upload </Button>
                            </div>) : null}
                            <div className="tab-sec-sendkit">
                                {isError ? (
                                    <div className="coming-sec">
                                        <h4 className="mt-5">{tableContent?.nodata}</h4>
                                    </div>
                                ) : (
                                    <>
                                        {"BOXBUILDING" && typeof finalBoarddata === "object" && finalBoarddata?.sorteddata ? (
                                            <Tabs activeKey={activeKey} onSelect={handleTabSelect}>
                                                {Object.keys(finalBoarddata.sorteddata)
                                                    .sort((a, b) => parseInt(a.replace('kit', ''), 10) - parseInt(b.replace('kit', ''), 10))
                                                    .map((kitKey, index) => (
                                                        <Tab eventKey={kitKey} title={convertToCamelCase(kitKey)} key={index}>
                                                            {renderTabContent(kitKey)}
                                                        </Tab>
                                                    ))}
                                            </Tabs>
                                        ) : "EMS" && finalBoarddata && finalBoarddata.sorteddata ? (
                                            <Tabs activeKey={activeKey} onSelect={handleTabSelect}>
                                                {Object.keys(finalBoarddata.sorteddata).map((kitKey) => (
                                                    <Tab key={kitKey} eventKey={kitKey} title={kitKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}>
                                                        <div className="table-responsive">
                                                            <Table className="bg-header">
                                                                <thead>
                                                                    <tr>
                                                                        <th>{ordersTable?.Sno}</th>
                                                                        <th>{sendBoardsText?.svicPcba}</th>
                                                                        <th>{sendBoardsText?.somID}</th>
                                                                        <th>{sendBoardsText?.eSimID}</th>
                                                                        <th>{sendBoardsText?.alsPcba}</th>
                                                                        <th>{sendBoardsText?.displayNo}</th>
                                                                        <th>{sendBoardsText?.eSimNo}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {Object.keys(finalBoarddata.sorteddata[kitKey] || {}).map((boardKey, index) => (
                                                                        <tr key={boardKey}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{finalBoarddata.sorteddata[kitKey][boardKey].svic_pcba}</td>
                                                                            <td>{finalBoarddata.sorteddata[kitKey][boardKey].som_id_imei_id}</td>
                                                                            <td>{finalBoarddata.sorteddata[kitKey][boardKey].e_sim_id}</td>
                                                                            <td>{finalBoarddata.sorteddata[kitKey][boardKey].als_pcba}</td>
                                                                            <td>{finalBoarddata.sorteddata[kitKey][boardKey].display_number}</td>
                                                                            <td>{finalBoarddata.sorteddata[kitKey][boardKey].e_sim_no}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Tab>
                                                ))}
                                            </Tabs>
                                        ) : null}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                    {dep_type === "EMS" && dep_type !== undefined ? (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button className='submit submit-min' onClick={handleSubmit}>Submit</Button>
                    </div>
                    ) : null}
                    
                </div>
            </div>

        
        </>
    );
};

export default BoardsInfo;
