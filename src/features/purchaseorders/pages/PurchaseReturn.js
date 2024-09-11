import React from "react";
import Table from "react-bootstrap/Table";
import "../styles/PurchaseOrder.css";
import { Button } from "react-bootstrap";
import edit from "../../../assets/Images/edit.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectReturnpurchaseList, fetchReturnpurchaseList, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import { tableContent } from "../../../utils/TableContent";
const PurchaseReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingStatus)
  const returnpurchaseList = useSelector(selectReturnpurchaseList)
  const returnpurchasedata = returnpurchaseList?.body;
  const handleTableRowClick = (e, item) => {
    let path = `/prpodetails`;
    navigate(path, { state: item?.return_id });
  };
  const EditPurchaseReturn = (item) => {
    let path = `/editreturnpo`;
    navigate(path, { state: item?.return_id });
  };
  useEffect(() => {
    dispatch(fetchReturnpurchaseList())
  }, [])
  return (
    <>
      <div className="wrap">
        <div className="table-responsive mt-4">
          <Table className="bg-header">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Return ID</th>
                {/* <th>{tableContent?.vendorId}</th> */}
                <th>{tableContent?.orderDate}</th>
                <th>{tableContent?.returnDate}</th>
                <th>{tableContent?.orderPrice}</th>
                <th>{tableContent?.status}</th>
                <th>{tableContent?.returnValue}</th>
                <th>{tableContent?.more}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center">Loading...</td>
                </tr>
              ) : (
                <>
                  {returnpurchasedata && Array.isArray(returnpurchasedata) && returnpurchasedata?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td onClick={(e) => handleTableRowClick(e, item)}><span className="border-item">{item?.return_id}</span></td>
                      {/* <td>{item?.vendor_id}</td> */}
                      <td>{item?.order_date || "-"}</td>
                      <td>{item?.return_date || "-"}</td>
                      <td> &#8377; {item?.order_price || "-"}</td>
                      <td><Button className={`btn ${index % 2 === 0 ? 'pending-btn' : 'received-btn btn'}`}>{item?.status}</Button></td>
                      <td> &#8377; {item?.return_value || "-"}</td>
                      <td>
                        <Button
                          className="td-btn border-0 p-0 me-2"
                          onClick={(e) => EditPurchaseReturn(item)}
                        >
                          <img src={edit} alt="" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!returnpurchasedata || returnpurchasedata.length === 0) && (
                    <tr>
                      <td colSpan="8" className="text-center">{tableContent?.nodata}</td>
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

export default PurchaseReturn;
