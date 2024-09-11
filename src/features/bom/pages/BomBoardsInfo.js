import React, { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSendboardsdatainbom, selectGetSendboardsinbom, selectLoadingStatus } from "../../vendors/slice/VendorSlice";
import { Spinner } from 'react-bootstrap';
import { formFieldsVendor, sendBoardsText, tableContent, ordersTable } from '../../../utils/TableContent';

const BomBoardsInfo = ({ outward_id, setDisable }) => {
    const [checked, setChecked] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoadingStatus);
    const getData = useSelector(selectGetSendboardsinbom);
    const finalBoarddata = getData?.body;
    const [activeKey, setActiveKey] = useState(null);
    const isError = getData?.statusCode === 404;

    useEffect(() => {
        const request = {
            "outward_id": outward_id,
        };
        dispatch(getSendboardsdatainbom(request));
    }, [dispatch, outward_id]);

    useEffect(() => {
        if (finalBoarddata && finalBoarddata.sorteddata) {
            setDisable(false)
            const firstTabKey = Object.keys(finalBoarddata.sorteddata)[0];
            setActiveKey(firstTabKey);
        }

    }, [finalBoarddata]);
    // Check status and setDisable accordingly
    // useEffect(() => {
    //     if (finalBoarddata && finalBoarddata.sorteddata) {
    //         Object.values(finalBoarddata.sorteddata).forEach((kit) => {
    //             console.log(kit,'kit');
    //             Object.values(kit).forEach((item)=>{
    //                 if (kit.status === "Assigned") {
    //                     setDisable(true);
    //                 }
    //             })
    //         });
    //     }
    // }, [finalBoarddata]);
    // useEffect(() => {
    //     if (finalBoarddata && finalBoarddata.sorteddata) {
    //         let allAssigned = true; // Variable to track if all items are assigned
    //         Object.values(finalBoarddata.sorteddata).forEach((kit) => {
    //             Object.values(kit).forEach((item) => {
    //                 if (item.boardkits_status&&item.boardkits_status !== "Assigned") {
    //                     allAssigned = false;
    //                 }
    //             });
    //         });

    //         if (allAssigned) {
    //             setDisable(true);
    //         } else {
    //             setDisable(false); // Optionally, you might want to reset it if not all are assigned
    //         }
    //     }
    // }, [finalBoarddata]);

    useEffect(() => {
        if (finalBoarddata && finalBoarddata.sorteddata) {
            let anyAssigned = false; // Variable to track if any item is assigned
            Object.values(finalBoarddata.sorteddata).forEach((kit) => {
                Object.values(kit).forEach((item) => {
                    if (item.boardkits_status === "Assigned") {
                        anyAssigned = true;
                    }
                });
            });
    
            if (anyAssigned) {
                setDisable(true);
            } else {
                setDisable(false);
            }
        }
    }, [finalBoarddata]);

    const handleTabSelect = (key) => {
        setActiveKey(key);
        console.log(key);
        setChecked([]);
        setSelectAllChecked(false);
    };
    // Filter out empty rows
    const filteredData = (kitKey) => {
        // console.log(kitKey);
        const kitData = finalBoarddata.sorteddata[kitKey];
        if (!kitData || !Object.keys(kitData).length) return []; // Return empty array if kitData is empty or undefined
        const boardKeys = Object.keys(kitData).filter(key => key !== 'status'); // Exclude 'status' field
        return boardKeys.filter(boardKey => {
            const board = kitData[boardKey];
            return Object.keys(board).every(field => board[field] !== ""); // Check if all fields are non-empty
        });
    };

    // const handleCheckbox = (e, kitKey) => {
    //     const isChecked = e.target.checked;
    //     const updatedChecked = { ...checked };
    //     const updatedSelectAllChecked = { ...selectAllChecked };

    //     if (isChecked) {
    //         updatedSelectAllChecked[kitKey] = true;
    //         const allItems = filteredData(kitKey).map((boardKey) => finalBoarddata.sorteddata[kitKey][boardKey]);
    //         updatedChecked[kitKey] = allItems;
    //     } else {
    //         updatedSelectAllChecked[kitKey] = false;
    //         updatedChecked[kitKey] = [];
    //     }

    //     setChecked(updatedChecked);
    //     setSelectAllChecked(updatedSelectAllChecked);
    // };

    // const handleCheck = (event, item, kitKey) => {
    //     const isChecked = event.target.checked;
    //     const updatedChecked = { ...checked };
    //     const kitChecked = updatedChecked[kitKey] || [];

    //     if (isChecked) {
    //         updatedChecked[kitKey] = [...kitChecked, item];
    //     } else {
    //         updatedChecked[kitKey] = kitChecked.filter((row) => row.pcba_id !== item.pcba_id);
    //     }

    //     setChecked(updatedChecked);
    //     setSelectAllChecked({
    //         ...selectAllChecked,
    //         [kitKey]: updatedChecked[kitKey].length === filteredData(kitKey).length
    //     });
    // };

    const handleCheckbox = (e, kitKey) => {
        const isChecked = e.target.checked;
        const updatedChecked = { ...checked };
        const updatedSelectAllChecked = { ...selectAllChecked };

        if (isChecked) {
            updatedSelectAllChecked[kitKey] = true;
            const allItems = filteredData(kitKey).map((boardKey, index) => ({
                data: finalBoarddata.sorteddata[kitKey][boardKey],
                originalIndex: index
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
            [kitKey]: updatedChecked[kitKey].length === filteredData(kitKey).length
        });
    };
    const handleSubmit = () => {
        console.log("Selected Items by Kit:", checked);


        const transformedData = Object.keys(checked).reduce((acc, kitKey) => {
            if (checked[kitKey].length > 0) {
                acc[kitKey] = checked[kitKey].reduce((kitAcc, item) => {
                    const boardKey = `board${item.originalIndex + 1}`;
                    kitAcc[boardKey] = { ...item.data, checked: true };
                    return kitAcc;
                }, {});
            }
            return acc;
        }, {});
        const sorteddata = { ...transformedData }
        console.log(JSON.stringify({ sorteddata: transformedData }, null, 2));
        const request = {
            "outward_id": outward_id,
            sorteddata
        }
        console.log(request, "ommmmmmmmmmmmmmmm");


    };

    return (
        <>
            <div className="wrap">
                <div className="mt-5 w-100">
                    <div className="w-100">
                        <div className="partno-sec vendorpartno-sec w-100">
                            <h1 className="title-tag mb-4">{sendBoardsText?.bInfo}</h1>

                            <div className="tab-sec-sendkit">
                                {isError ? (
                                    <div className="coming-sec">
                                        <h4 className="mt-5">{tableContent?.nodata}</h4>
                                    </div>
                                ) : finalBoarddata && finalBoarddata.sorteddata ? (
                                    <Tabs activeKey={activeKey} onSelect={handleTabSelect}>
                                        {Object.keys(finalBoarddata.sorteddata).map((kitKey) => (
                                            <Tab key={kitKey} eventKey={kitKey} title={kitKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}>
                                                <div className="table-responsive">
                                                    <Table className="bg-header table-lasttr">
                                                        <thead>
                                                            <tr>
                                                                {/* <th>
                                                                <input
                                                                        type="checkbox"
                                                                        onChange={(e) => handleCheckbox(e, kitKey)}
                                                                        checked={selectAllChecked[kitKey] || false}
                                                                    />
                                                                </th> */}
                                                                <th>{ordersTable?.Sno}</th>
                                                                <th>PCBA ID</th>
                                                                <th>SOM ID/IMEI ID</th>
                                                                <th>E SIM ID</th>
                                                                <th>E SIM No</th>
                                                                <th>ICT</th>
                                                                <th>FCT</th>
                                                                <th>Documents</th>
                                                                <th>Status</th>
                                                                <th>Comments</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredData(kitKey).map((boardKey, index) => (
                                                                <tr key={boardKey}>
                                                                    {/* <td>                                                               
                                                                <input
                                                                            type="checkbox"
                                                                            onChange={(e) => handleCheck(e, finalBoarddata.sorteddata[kitKey][boardKey], kitKey, index)}
                                                                            checked={(checked[kitKey] || []).some(row => row.data.pcba_id === finalBoarddata.sorteddata[kitKey][boardKey].pcba_id)}
                                                                        />
                                                                </td> */}
                                                                    <td>{index + 1}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].pcba_id}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].som_id_imei_id}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].e_sim_id}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].e_sim_no || "-"}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].ict}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].fct}</td>
                                                                    <td><a href={finalBoarddata.sorteddata[kitKey][boardKey]?.document?.doc_url} className="linka">{finalBoarddata.sorteddata[kitKey][boardKey]?.document?.doc_name}</a></td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].board_status}</td>
                                                                    <td>{finalBoarddata.sorteddata[kitKey][boardKey].comment}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                    {/* <button onClick={handleSubmit}>Submit</button> */}


                                                    {/* <button
                className="submit mb-1 submit-block"
                onClick={handleSubmit}
                >
                Assign to BOX Building
              </button> */}

                                                </div>
                                            </Tab>
                                        ))}
                                    </Tabs>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="grow" role="status" variant="light">
                        <span className="visually-hidden">{formFieldsVendor.loader}</span>
                    </Spinner>
                </div>
            )}

        </>
    );
};

export default BomBoardsInfo;
