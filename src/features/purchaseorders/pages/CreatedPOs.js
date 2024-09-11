import React from "react";
import Table from "react-bootstrap/Table";
import "../styles/PurchaseOrder.css";
import { Button } from "react-bootstrap";
import edit from "../../../assets/Images/edit.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectcreatedPOList, getCreatedpoList, selectLoadingStatus } from "../slice/PurchaseOrderSlice";
import { tableContent } from "../../../utils/TableContent";

const CreatedPOs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingStatus)
  const createdpoListData = useSelector(selectcreatedPOList)
  const createdpoListDetails = createdpoListData?.body;
  console.log(createdpoListDetails, "createdpoListData")
  const handleTableRowClick = (e,item) => {
    let path = `/cpodetails`;
    navigate(path, { state: item?.OrderNo });
  };
  const EditPurchaseReturn = (e, item) => {
    navigate(`/createpo`, {
      state: {
        vendorId: item?.VendorId,
        orderNo: item?.OrderNo,
        component: "editpo"
      },
    });
  };


  useEffect(() => {
    dispatch(getCreatedpoList())
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
                {/* <th>Bom ID</th> */}
                <th>Bom Name</th> 
                <th className="th-align">{tableContent?.vendorName}</th>
                <th>{tableContent?.orderDate}</th>
                <th>{tableContent?.orderPrice}</th>
                <th>{tableContent?.status}</th>
                <th>{tableContent?.more}</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                           <tr>
                             <td colSpan="7" className="text-center">Loading...</td>
                            </tr>
                          ) : (
                          <>
              {createdpoListDetails && Array.isArray(createdpoListDetails) && createdpoListDetails?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td onClick={(e) => handleTableRowClick(e, item)}><span className="border-item">{item?.OrderNo}</span></td>
                  {/* <td>{item?.bom_id || "-"}</td>  */}
                  <td>{item?.bom_name || "-"}</td>
                  <td>{item?.VendorName}</td>
                  <td>{item?.Orderdate}</td> 
                  <td>{item?.OrderPrice}</td>
                  <td><Button className="pending-btn btn" disabled={item?.Status === 'Cancel'}>
                  {item?.Status === 'Cancel' ? 'Cancelled' : item?.Status}
                </Button></td>
                  <td>
                  <Button className='td-btn border-0 p-0 me-2' onClick={(e) => EditPurchaseReturn(e, item)} disabled={item?.Status === 'Cancel'}>
                                            <img src={edit} alt="" />
                                        </Button>
                  {/* <Button className='td-btn border-0 p-0 me-2' onClick={(e) => EditPurchaseReturn(e, item)} >
                                            <img src={edit} alt="" />
                                        </Button> */}
                    {/* <Button className="td-btn border-0 p-0 me-2">
                      <img src={edit} alt="" onClick={EditPurchaseReturn} />
                    </Button> */}
                  </td>
                </tr>
              ))}
              {(!createdpoListDetails || createdpoListDetails.length === 0) && (
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

export default CreatedPOs;
