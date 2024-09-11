import React from "react";
import Table from "react-bootstrap/Table";
import "../styles/PurchaseOrder.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { tableContent } from "../../../utils/TableContent";
import { getpoList, selectPurchaseList, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';


const PurchaseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const poListData = useSelector(selectPurchaseList);
  const getPoListTableData = poListData?.body;
  console.log("sravanthiiii", getPoListTableData)
  const isLoading = useSelector(selectLoadingStatus)
  
  const handleTableRowClick = (e,item) => {
    let path = `/poListDetails`;
    navigate(path, { state: item?.Order_no });
    console.log("order....", item?.Order_no)
  };

  useEffect(() => {
    dispatch(getpoList())
  }, [])

  return (
    <>
      <div className="wrap">
        <div className="table-responsive mt-4">
          <Table className="bg-header">
            <thead>
              <tr>
                <th>S.No</th>
                <th>{tableContent?.orderNo}</th>
                {/* <th>{tableContent?.vendorId}</th> */}
                <th className="th-align">{tableContent?.vendorName}</th>
                <th>{tableContent?.vendorContact}</th>
                <th>{tableContent?.orderDate}</th>
                <th>{tableContent?.orderPrice}</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                           <tr>
                             <td colSpan="6" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
              {getPoListTableData &&
                getPoListTableData.map((item, index) => (
                  <tr key={index} >
                    <td>{index + 1}</td>
                  <td onClick={(e) => handleTableRowClick(e, item)}><span className="border-item">{item?.Order_no}</span></td>
                    {/* <td>{item.Order_no}</td> */}
                    {/* <td>{item.Vendor_ID}</td> */}
                    <td>{item.vendor_name}</td>
                    <td>{item.Vendor_Contact}</td>
                    <td>{item.Order_Date}</td>
                    <td>{item.Order_Price}</td>
                  </tr>
                ))}

{(!getPoListTableData || getPoListTableData.length === 0) && (
                <tr>
                  <td colSpan="7" className="text-center">{tableContent?.nodata}</td>
                </tr>
              )}
               </>
                          )}
            </tbody>
          </Table>
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

export default PurchaseList;
