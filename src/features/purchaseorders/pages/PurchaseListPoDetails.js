import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import view from "../../../assets/Images/view.svg";
import download from "../../../assets/Images/download.svg";
import pdf from "../../../assets/Images/pdf.svg";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import "../styles/PurchaseOrder.css";
import { Modal } from "react-bootstrap";
import cancel from "../../../assets/Images/cancel.svg";

const PurchaseListPODetails = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("CategoryInfo");
  const [showdelete, setShowdelete] = useState(false);

  const deleteShowModal = (e) => {
    setShowdelete(true);
  };

  const handleClosedelete = async () => {
    setShowdelete(false);
  };
  const OpenInwardPurchase = () => {
    navigate("/inwardstepper");
  };
  return (
    <>
      <div className="wrap">
        <h1 className="title-tag">Purchase orders</h1>
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <img
                src={arw}
                alt=""
                className="me-3"
                onClick={() => navigate(-1)}
              />
              OPTG 1
            </h1>
            <div className="ms-3"></div>
          </div>
          <div className="mobilemargin-top">
            <Button className="submit me-2 md-me-2 submitmobile">
              Download as pdf
            </Button>
            {/* <Button
              className="btn-outline-dark submit-85 submit-block"
              onClick={OpenInwardPurchase}
            >
              Inward Purchase
            </Button> */}
          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">Vendor ID : </h5>
            <h5 className="mb-2 bomtag text-667 font-500">Vendor Name : </h5>
            <h5 className="bomtag text-667 font-500">Contact : </h5>
          </Col>

          <Col xs={12} md={4}>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">Location : </h5>
            <h5 className="mb-2 bomtag text-667 font-500">Email : </h5>
            <h5 className="bomtag text-667 font-500">Order Date : </h5>
          </Col>
        </Row>
        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center">
            <div className="partno-sec">
              <div className="tab-sec">
                <Tabs
                  className="tabs-header"
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  <Tab eventKey="CategoryInfo" title="Ordered Category Info">
                    <div className="table-responsive mt-4 ms-4" id="tableData">
                      <Table className="bg-header">
                        <thead>
                          <tr>
                            <th>S. No</th>
                            <th>Part No</th>
                            <th>Part Name</th>
                            <th>Manufacturer</th>
                            <th>Description</th>
                            <th>Packaging</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Price per piece</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td> 1</td>
                            <td>MF12203ZH1</td>
                            <td>C1</td>
                            <td>Hirose</td>
                            <td>Resistor 03 OHM</td>
                            <td>Reels</td>
                            <td>1200</td>
                            <td>Rs.13000</td>
                            <td>Rs.10.83</td>
                          </tr>

                          <tr>
                            <td> 2</td>
                            <td>MF12214ZH1</td>
                            <td>R1</td>
                            <td>TDK</td>
                            <td>Resistor 14 OHM</td>
                            <td>Sachet</td>
                            <td>1500</td>
                            <td>Rs.8,000</td>
                            <td>Rs.53.33</td>
                          </tr>

                          <tr>
                            <td> 3</td>
                            <td>MF16103ZLK</td>
                            <td>B1</td>
                            <td>TDK</td>
                            <td>Battery</td>
                            <td>Cardboard</td>
                            <td>14</td>
                            <td>Rs.11,200</td>
                            <td>Rs.800.00</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="border-top">
                            <td> Total</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>2714</td>
                            <td>Rs.32,200</td>
                            <td>-</td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="inwardcategoryinfo"
                    title="Inward Category info"
                  >
                    <div className="table-responsive" id="tableData">
                      <Table className="bg-header">
                        <thead>
                          <tr>
                            <th>Inward ID</th>
                            <th>No. of Parts</th>
                            <th>Date</th>
                            <th>Invoice</th>
                            <th>QA Document</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <a
                                onClick={(e) => deleteShowModal(e)}
                                className="text-black linkformodal"
                              >
                                OPTG1-IN1
                              </a>
                            </td>
                            <td>2</td>
                            <td>12 May 2023</td>
                            <td>OPTG-Invoice1</td>
                            <td>QA Document 1</td>
                            <td>Loreal Ipsum..</td>
                          </tr>

                          <tr>
                            <td>
                              <a
                                onClick={(e) => deleteShowModal(e)}
                                className="text-black linkformodal"
                              >
                                OPTG1-IN1
                              </a>
                            </td>
                            <td>3</td>
                            <td>16 May 2023</td>
                            <td>OPTG-Invoice2</td>
                            <td>QA Document 2</td>
                            <td>Loreal Ipsum..</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Tab>

                  <Tab eventKey="bankdetails" title="Bank Details">
                    <Row className="mt-4 ms-4">
                      <Col xs={12} md={4}>
                        <p className="mb-2">Bank Name : </p>
                        <p>IFSC Code : </p>
                      </Col>

                      <Col xs={12} md={4}>
                        <p className="mb-2">Account Number : </p>
                        <p>GST Number : </p>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab eventKey="otherinfo" title="Other Info">
                    <div className="ms-4">
                      <p className="mt-4 mb-2">Terms & Conditions</p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                      <p className="mt-4 mb-2">Payment Terms</p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </div>
                  </Tab>

                  <Tab eventKey="documents" title="Documents">
                    <Row>
                      <p className="ms-4 ">Conversation Documents</p>
                      <Col xs={12} md={2} className="ms-4 display-flex">
                        <text className="documentsheader">
                          Document 1 12/May/2023
                        </text>
                        <div className="doc-card position-relative">
                          <div className="pdfdwn">
                            <img src={pdf} alt="" />
                          </div>
                          <div className="doc-sec position-absolute">
                            <div className="d-flex justify-content-between">
                              <Button className="view">
                                <img src={download} alt="" />
                              </Button>
                              <Button className="view">
                                <img src={view} alt="" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={2} className="ms-4 display-flex">
                        <text className="documentsheader">
                          Document2 12/May/2023
                        </text>
                        <div className="doc-card position-relative">
                          <div className="pdfdwn">
                            <img src={pdf} alt="" />
                          </div>
                          <div className="doc-sec position-absolute">
                            <div className="d-flex justify-content-between">
                              <Button className="view">
                                <img src={download} alt="" />
                              </Button>
                              <Button className="view">
                                <img src={view} alt="" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showdelete} onHide={handleClosedelete} centered>
        <Modal.Header className="text-center pb-0">
          <h3>Inward ID - OPTG1 -IN1</h3>
          <img
            src={cancel}
            onClick={handleClosedelete}
            className="linkformodal"
          ></img>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col xs={12} md={4}>
              <h5 className="mb-2 mt-3 bomtag text-667 font-500">
                Sender Name :
              </h5>
              <h5 className="mb-2 bomtag text-667 font-500">
                Sender Contact :{" "}
              </h5>
              <h5 className="bomtag text-667 font-500">Invoice : </h5>
            </Col>

            <Col xs={12} md={4}>
              <h5 className="mb-2 mt-3 bomtag text-667 font-500">Photo :</h5>
              <h5 className="mb-2 bomtag text-667 font-500">
                Gate Entry Date :
              </h5>
              <h5 className="bomtag text-667 font-500">QA Date : </h5>
            </Col>
            <Col xs={12} md={4}>
              <h5 className="mb-2 bomtag text-667 font-500">QA Document : </h5>
              <h5 className="bomtag text-667 font-500">Inward Date :</h5>
            </Col>
          </Row>
          <Table className="bg-header">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Part No</th>
                <th>Part Name</th>
                <th>Manufacturer</th>
                <th>Description</th>
                <th>Packaging</th>
                <th>Quantity</th>
                <th>Inventory position</th>
                <th>Batch No</th>
              </tr>
            </thead>
            <tbody className="border-top">
              <tr>
                <td> 1</td>
                <td>MF12203ZH1</td>
                <td>C1</td>
                <td>Hirose</td>
                <td>Resistor 03 OHM</td>
                <td>Reels</td>
                <td>1000</td>
                <td>Rack 14</td>
                <td>BTC001</td>
              </tr>

              <tr>
                <td> 2</td>
                <td>MF12214ZH1</td>
                <td>R1</td>
                <td>TDK</td>
                <td>Resistor 14 OHM</td>
                <td>Sachet</td>
                <td>1000</td>
                <td>Rack 16</td>
                <td>BTC002</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-top">
                <td>Total</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>2000</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tfoot>
          </Table>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center"></Modal.Footer>
      </Modal>
    </>
  );
};

export default PurchaseListPODetails;
