import React, { useState } from 'react';
import './Header.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Profile from '../assets/Images/profile.svg';
import Bell from '../assets/Images/bell.svg';
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const routeaddcomponent = () => {
    let path = `/addcomponent`;
    navigate(path);
  }

  //Rendering the Add New Category button conditionally
  const renderButton = location.pathname === "/components";
  const renderSearch = location.pathname === "/bomdetails";
  const renderButton1 = location.pathname === "/addcomponent";
  const routeaddcategory = () => {
    let path = `/addcategory`;
    navigate(path);
  }
  const handleCloseModal = () => {
    setShow(false);
  }

  return (
    <>
      <header className="header">
        <div className="header-title">
        {renderSearch && (
      <Form.Group className="mb-0">
        <Form.Control type="search" placeholder="Search" />
      </Form.Group>
        )}
      </div>
        <nav className="header-nav right-h-nav">
          {renderButton && (
            <Button variant="outline-dark" onClick={routeaddcategory} className='me-3'>
              Add New Category
            </Button>
          )}

       {!renderButton1 && (<Button variant="outline-dark" onClick={routeaddcomponent}>Add Component</Button>
       )}   


          <a><img src={Bell} alt="notification" /></a>
          <a><img src={Profile} alt="profile" /></a>
        </nav>
      </header>
      {/* <Modal show={show} fullscreen={true} onHide={() => setShow(false)} dialogClassName="custom-modal">
        <Modal.Body>
          <AddCategory hide={handleCloseModal} />
        </Modal.Body>
      </Modal> */}
    </>
  );
};

export default Header;
