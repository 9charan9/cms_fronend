import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getComponentActivityDetails,
  selectActivityDetails,
  selectLoadingState,
} from "../slice/ComponentSlice";
import { Table } from "react-bootstrap";

const ActivityDetails = ({ cmpt_id, handleActivityDetails }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingState);
  const activitydetails = useSelector(selectActivityDetails);
  const ActivityDetails = activitydetails?.body;
  useEffect(() => {
    if (!isLoading) {
      const request = {
        cmpt_id: cmpt_id,
      };
      dispatch(getComponentActivityDetails(request));
    }
  }, []);

  useEffect(() => {
    if(ActivityDetails !== undefined){
      handleActivityDetails(ActivityDetails)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ActivityDetails]);

  return (
    <>
      <div className="table-responsive mt-4">
        <Table className="c-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Description</th>
              {/* <th>Lot no</th> */}
              <th>Lot Id</th>
              <th>Batch no</th>
              <th>Issued to</th>
              <th>Quantity</th>
              <th>Closing Quantity</th>
              <th>PO no</th>
              <th>Invoice no</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(ActivityDetails) && ActivityDetails.length > 0 ? (
              ActivityDetails?.map((item, index) => {
                const str = item?.batchId;
                console.log(str);
                return (
                  <tr key={index}>
                    <td>{item?.date}</td>
                    <td>{item?.action}</td>
                    <td>{item?.description}</td>
                    {/* <td>{item?.lot_no}</td> */}
                    <td>{item?.lot_id}</td>
                    <td>{Array.isArray(item.batchId) ? item.batchId.join(', ') : item.batchId || "-"}</td>
                    <td>{item?.issued_to}</td>
                    <td>{item?.qty}</td>
                    <td>{item?.closing_qty}</td>
                    <td>{Array.isArray(item.po_no) ? item.po_no.join(', ') : item.po_no || item?.po_id || "-"}</td>
                    <td>{Array.isArray(item?.invoice_no) ? item?.invoice_no.join(', ') : item?.invoice_no || "-"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  NO Data
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ActivityDetails;
