import React from 'react';
import { Table } from 'react-bootstrap';
import { Tabs, Tab, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const QuotationsListDetails = () => {
    

    return (
        <>
         <div className="d-flex justify-content-end align-center mt-0 d-flex-mobile-align">
        <Form.Group className="mb-0">
        <Form.Control type="search" 
        placeholder="Search " />
      </Form.Group>
      </div>
        <div className='salestablealign'>
            <div className='table-responsive mt-2'>
                <Table className='salestable'>
                    <thead>
                        <tr>
                            <th>Quotation No</th>
                            <th>Company</th>
                            <th>Enquiry Number</th>
                            <th>Total Amount</th>
                            <th>Deal Status</th>
                            <th>Next Action Date</th>
                            </tr>
                    </thead>
                    <tbody>
                       <tr>
                            <td>SQ000</td>
                            <td>Excel Electronics</td>
                            <td>ENQ-459A</td>
                            <td>RS.20000</td>
                            <td>Waiting</td>
                            <td>27/11/2024</td>

                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
      </>
    );
};

export default QuotationsListDetails;
