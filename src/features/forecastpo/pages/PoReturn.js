import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import Upload from "../../../assets/Images/upload.svg";
import arw from "../../../assets/Images/left-arw.svg";
import DatePicker from 'react-datepicker';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

const PoReturn = () => {
    const navigate = useNavigate();
    const [startdocDate, setStartdocDate] = useState(new Date()); 
    const [selectedInwardid, setSelectedInwardid] = useState(null); 
    const [isChecked, setIsChecked] = useState(true);

    return (
        <>
            <div className="wrap">
                <div className="d-flex justify-content-between">
                    <h6 className="title-tag">
                        <img
                            src={arw}
                            alt=""
                            className="me-3"
                            onClick={() => {
                                navigate(-1);
                            }}
                        />
                        <span>Create Return Purchase Order</span>
                    </h6>
                </div>
                <div class="content-sec">
                    <Row>
                <Col xs={12} md={2} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Select PO No</Form.Label>
                                        <Form.Select
                                            name="text"
                                            value=""
                                        >
                                            <option value=""></option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={2} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Select Invoice No</Form.Label>
                                        <Form.Select
                                            name="text"
                                            value=""
                                        >
                                            <option value=""></option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                </Row>
                    <Row>
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Buyer Details <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="buyerDetails"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    style={{ height: "100px" }}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Delivery Location <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="deliveryLocation"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    style={{ height: "100px" }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Supplier Details <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="supplierDetails"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    className="supplierheight"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6} md={6} className="mb-2">
                            <Form.Group>
                                <Form.Label className="mb-0">Place Of Supply <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="supplierLocation"
                                    placeholder=""
                                    // onChange={onUpdateField}
                                    className="supplierheight"
                                />
                            </Form.Group>

                        </Col>
                    </Row>
                    <div className="wrap2">
                        <h5 className="inner-tag my-2">Primary Document Details</h5>
                        <div className="content-sec">
                            <Row>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Document Title <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Document Title"
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Document Date <span className="text-danger">*</span></Form.Label>
                                        {/* <Form.Control
                                                type="date"
                                                name="primaryDocumentDetails.document_date"
                                                placeholder="YYYY-MM-DD"
                                                value={form.primaryDocumentDetails.document_date}
                                                onChange={onUpdateField}
                                            /> */}
                                        <DatePicker className="form-control"
                                            placeholder="YYYY-MM-DD"
                                            selected={startdocDate} onChange={(date) => setStartdocDate(date)}
                                            onFocus={(e) => e.target.readOnly = true}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Status <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            name="text"
                                            value=""
                                        >
                                            <option value="">Select</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0"> Payment Term <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name=""
                                            placeholder=""
                                        // value={form.primaryDocumentDetails.delivery_date}
                                        // onChange={onUpdateField}                                              
                                        />

                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Client Purchase Order No <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="client purchase order"
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Out Pass Upload <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Out pass Upload"
                                            value=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Note <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name=""
                                            placeholder=""
                                        // onChange={onUpdateField}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                        
                        <div className='d-flex justify-content-between align-items-center mb-4 mt-4'> 
                        <h5 className="inner-tag">Adding Products to purchase list</h5>
                        <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                                <div div className="position-relative">
                                    <InputGroup className="mb-0 search-add">
                                        <Form.Control
                                            placeholder="Search add items"
                                            aria-label="search add items"
                                            aria-describedby="basic-addon2"
                                            type="search"
                                            
                                        />
                                        <Button
                                            variant="secondary"
                                            id="button-addon2"
                                            // disabled={!searchTerm.trim() || isAddButtonDisabled}
                                            // onClick={addItem}
                                        >
                                            + Add
                                        </Button>
                                    </InputGroup>
                                </div>
                                </div>
                            </div>
                        <div className="wrap3 forecasttablealign">
                            <div className="table-responsive mt-4">
                                <Table className="bg-header">
                                    <thead>
                                        <tr>
                                            <th>S.no</th>
                                            <th>Manufacturing Part no</th>
                                            <th>Part name</th>
                                            <th>Description</th>
                                            <th>Packaging</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                        </div>
                        <div className="wrap3">
                            <div className="content-sec1">
                                <h6 className="inner-tag my-2">Total Amount</h6>
                                <p>Total(before tax)     :</p>
                                <p>Total Tax(IGST)       :</p>
                                <p>Total(after tax)      :</p>


                                <Col xs={12} md={4} className="mb-2">
                                    <Form.Group>
                                        <Form.Label className="mb-0"></Form.Label>
                                        <Form.Select
                                            name="text"
                                            value=""
                                        >
                                            <option value="">Non Taxable extra charges</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <h6 className="inner-tag my-2">Grand Total   : </h6>
                                <p>Advance to pay   :</p>
                                <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                                    <Button
                                        type="button"
                                        className="cancel me-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="submit">
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PoReturn;
