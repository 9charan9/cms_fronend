import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
///take below
import Card from 'react-bootstrap/Card';
import pdficon from "../../../assets/Images/pdficon.svg";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Uploadpdf = () => {
  const [numPages, setNumPages] = useState(null);
  const [invoiceData, setInvoiceData] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: '',
    orderNumber: '',
    invoiceDate: '',
  });

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = reader.result;
      const pdfData = new Uint8Array(buffer);
      const loadingTask = pdfjs.getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      let extractedInvoiceDetails = {
        invoiceNumber: '',
        orderNumber: '',
        invoiceDate: '',
        totalDue: '',
      };
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join('\n');
        console.log(text, "om text");
        // Implement your logic to extract invoice details from the text
        // Here is just a placeholder
        const invoiceNumberMatch = text.match(/Invoice Number\s+([\w-]+)/);
        console.log(invoiceNumberMatch, "invoiceNumberMatch");
        const orderNumberMatch = text.match(/Order Number\s+([\w-]+)/);
        const invoiceDateMatch = text.match(/Invoice Date\s+([a-zA-Z]+\s+\d{1,2},\s+\d{4})/);
        const totalDueMatch = text.match(/Total Due\s+([$€£¥]\d+(?:\.\d{2})?)/);
        if (invoiceNumberMatch) {
          extractedInvoiceDetails.invoiceNumber = invoiceNumberMatch[1];
        }
        if (orderNumberMatch) {
          extractedInvoiceDetails.orderNumber = orderNumberMatch[1];
        }
        if (invoiceDateMatch) {
          extractedInvoiceDetails.invoiceDate = invoiceDateMatch[1];
        }
        if (totalDueMatch) {
          extractedInvoiceDetails.totalDue = totalDueMatch[1];
        }
      }
      setInvoiceDetails(extractedInvoiceDetails);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div>
        <input type="file" accept=".pdf" onChange={onFileChange} />
        {numPages && (
          <div>
            <h2>Invoice Details:</h2>
            <p>Invoice Number: {invoiceDetails.invoiceNumber}</p>
            <p>Order Number: {invoiceDetails.orderNumber}</p>
            <p>Invoice Date: {invoiceDetails.invoiceDate}</p>
            <p>Total Due: {invoiceDetails.totalDue}</p>
          </div>
        )}
      </div>
      {/* ///take below */}
      <div className='mt-4'>
        <Row>
          <Col xs={12} md={8}>
            <Card className='customcard'>
              <Card.Body>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                 <h3 className='card-title mb-0 d-flex justify-content-between align-items-center'> <span className='card-circle me-2'></span> ABCDE<span className='card-smalltag'>(People Tech Group)</span></h3>
                 <h3 className='card-title'>27/11/2023, 10:53 am</h3>
                </div>
                <div className='d-flex align-items-center'>
                  <div className='pdficonsec me-4'><img src={pdficon} alt="" /></div>
                  <div className='w-100'>
                    <h3 className='card-title'>Purchase Order: PO0001</h3>
                    <div className='d-flex justify-content-between mt-3'>
                    <h3 className='card-title'>Number of Items: 4</h3>
                    <h3 className='card-title'>Amount: Rs 20,000</h3>
                    <h3 className='card-title'>Due Date: 07/12/2023</h3>
                    </div>
                  </div>

                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>



    </>
  );
};

export default Uploadpdf;
