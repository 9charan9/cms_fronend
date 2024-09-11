import React from 'react';
import pdf from '../assets/Images/pdf.svg';
const PdfDownload = ({ pdfUrl }) => {
  const handleDownload = () => {
    // const link = document.createElement('a');
    // link.href = pdfUrl;
    // link.download = 'file.pdf'; // Set the desired file name here
    // link.click();
    window.open(pdfUrl, '_blank');
  };

  return (
    <button onClick={handleDownload} className='pdf-btn'>
      <img src={pdf} alt="" /> Datasheet
    </button>
  );
};

export default PdfDownload;