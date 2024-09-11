import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Document, Page } from 'react-pdf'; // You might need a library to render PDFs like 'react-pdf'
import Button from "react-bootstrap/Button";
const PdfModal = ({ show, handleClose, pdfUrl }) => {
  function isImage(url) {
    return url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null;
  }
    console.log('PDF URL:', pdfUrl);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>PDF Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {/* <iframe srcDoc={`<html><head><style>body, img { max-width: 100%; max-height: 100%; }</style></head><body><img src="${pdfUrl}" alt="PDF Preview"></body></html>`} id="pdf-iframe" title="PDF Preview" width="100%" height="500px"></iframe> */}
      <iframe
  srcDoc={`<html><head><style>html,body { margin: 0;height:100%;display:flex;align-items:center;width:100%;justify-content:center }</style></head><body>${isImage(pdfUrl) ? `<img src="${pdfUrl}" style="max-width: 100%; max-height: 100%;" alt="PDF Preview">` : `<object data="${pdfUrl}" type="application/pdf" width="100%" height="500px">PDF Preview</object>`}</body></html>`}
  id="pdf-iframe"
  title="PDF Preview"
  width="100%"
  height="500px"
></iframe>


       
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PdfModal;
