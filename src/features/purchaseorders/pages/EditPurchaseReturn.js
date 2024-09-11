import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import Table from "react-bootstrap/Table";
import "react-toastify/ReactToastify.min.css";
import { useNavigate } from "react-router-dom";
import Upload from "../../../assets/Images/upload.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEditReturnPurchaseList, selectEditReturnPurchaseDetails, selectLoadingStatus } from "../slice/PurchaseOrderSlice";

const EditPurchaseReturn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoadingStatus);
  const editreturnPurchaseData = useSelector(selectEditReturnPurchaseDetails);
  const editreturnPurhase = editreturnPurchaseData?.body;
  console.log(editreturnPurchaseData?.body);
  useEffect(() => {
  
        const event = {
          return_id: "OPTG1-R1"
        }
        dispatch(getEditReturnPurchaseList(event));
      
  }, [])
  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between">
          <h1 className="title-tag">
            <img
              src={arw}
              alt=""
              className="me-3"
              onClick={() => navigate(-1)}
            />
            Edit Purchase Return
          </h1>
        </div>

        <div className="content-sec">
          <h3 className="inner-tag">Order Details </h3>
          <Row>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Order Number</Form.Label>
                <Form.Control
                  type="text"
                  name="order-num"
                  // value={editreturnPurhase?.}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>QA Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="12 May 2023"
                  name="qa-date"
                  value={editreturnPurhase?.qa_date}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Sender Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Peopletech"
                  name="vendor_name"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Sender Contact Number</Form.Label>
                <Form.Control
                  // type="number"
                  placeholder="99098 876789"
                  name="contact_number"
                  maxLength={10}
                  value={editreturnPurhase?.contact}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="Status"
                  className="d-flex justify-content-center"
                >
                  <option value="">Ordered</option>
                  <option value="TH">Email Confirmation</option>
                  <option value="Others">Vendor Acknowledged</option>
                  <option value="Others">Partially Received</option>
                  <option value="Others">Completely Received</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Upload Invoice</Form.Label>
                <div class="upload-btn-wrapper">
                  <img src={Upload} alt="" />
                  <input
                    type="file"
                    name="data_sheet"
                    accept="application/pdf"
                    required={true}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>QA Test Document</Form.Label>
                <div class="upload-btn-wrapper">
                  <img src={Upload} alt="" />

                  <input
                    type="file"
                    name="data_sheet"
                    accept="application/pdf"
                    required={true}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Upload Photo</Form.Label>
                <div class="upload-btn-wrapper">
                  <img src={Upload} alt="" />
                  <input
                    type="file"
                    name="data_sheet"
                    accept="application/pdf"
                    required={true}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="status"
                  placeholder="Lorem ipsum dolor sit amet sed"
                  name="status"
                  className="upload-btn-wrapper"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="table-responsive mt-4">
            <Table className="bg-header">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Part No</th>
                  <th>Part Name</th>
                  <th>Description</th>
                  <th>Packaging</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> 1</td>
                  <td>MF12203ZH1</td>
                  <td>C1</td>
                  <td>Resistor 03 OHM</td>
                  <td>Reels</td>
                  <td>
                    <Button variant="outline-dark">1200</Button>
                  </td>
                  <td>
                    <Button className="pending-btn btn ps-4 pe-4">Fail</Button>
                  </td>
                </tr>

                <tr>
                  <td> 2</td>
                  <td>MF12214ZH1</td>
                  <td>R1</td>
                  <td>Resistor 14 OHM</td>
                  <td>Sachet</td>
                  <td>
                    <Button variant="outline-dark">1500</Button>
                  </td>
                  <td>
                    <Button className="pending-btn btn ps-4 pe-4">Fail</Button>
                  </td>
                </tr>

                <tr>
                  <td> 3</td>
                  <td>MF16103ZLK</td>
                  <td>B1</td>
                  <td>Battery</td>
                  <td>Cardboard</td>
                  <td>
                    <Button variant="outline-dark">14 </Button>
                  </td>
                  <td>
                    <Button className="pending-btn btn ps-4 pe-4">Fail</Button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-top">
                  <td> Total</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>2714</td>
                  <td>-</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
          <Button
            type="button"
            className="cancel me-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" className="submit" onClick={() => navigate(-1)}>
            Mark as Return
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseReturn;
