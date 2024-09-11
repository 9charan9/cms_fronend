import React, { useEffect, useState } from "react";
import "../styles/AddComponent.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from 'react-redux';
import { getProductAttributes, selectEditComponent, selectLoadingState, selectProductAttributes } from "../slice/ComponentSlice";
import { toast } from "react-toastify";

const AddAttribute = (props) => {
  console.log(props.routingComponent);
  const dispatch = useDispatch();
  const [attributeFields, setAttributeFields] = useState([]);
  console.log(attributeFields);
  const [newattributeField, setnewAttributeField] = useState("");
  const [attributeFieldError, setAttributeFieldError] = useState("");
  const [updatedObjectinPA, setUpdatedObjectinPA] = useState();
  const productAttributes = useSelector(selectProductAttributes);
  const [showatt, setShowatt] = useState(false);
  const handleCloseatt = () => setShowatt(false);
  const handleShowatt = () => setShowatt(true);
  const isLoading = useSelector(selectLoadingState);
  const editComponents = useSelector(selectEditComponent);
  const products = productAttributes?.body?.product_attributes;
  const editedproductAttributes = editComponents?.body?.product_attributes;
  const [productattributes, setProductAttributes] = useState({});
  console.log(editedproductAttributes);
  const handleAttributeChange = (e) => {
    const { value } = e.target;
    const santiziedValue = value.replace(/[^\w\s]/gi, '');
    setnewAttributeField(santiziedValue);
    setAttributeFieldError("");
  };

  const handleAttributeInputChange = (e, attributeName) => {
    const { value } = e.target;
    setProductAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attributeName]: value,
    }));


    // Notify the parent component of the change
    if (props.onProductAttributesChange) {
      props.onProductAttributesChange({ ...productattributes, ...updatedObjectinPA, [attributeName]: value });
    }
  };

  const handleAttributeValueChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...attributeFields];
    console.log(updatedFields);
    updatedFields[index].value = value;
    setAttributeFields(updatedFields);
    console.log(updatedFields);
    const updatedObject = updatedFields.reduce((obj, field) => {
      obj[field.name] = field.value;
      return obj;
    }, {});
    // Send updated object to parent component
    props.onAttributeFieldsChange(updatedObject);
  };

  const handlePAttributeValueChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...attributeFields];
    console.log(updatedFields);
    updatedFields[index].value = value;
    setAttributeFields(updatedFields);
    console.log(updatedFields);
    const updatedObject = updatedFields.reduce((obj, field) => {
      obj[field.name] = field.value;
      return obj;
    }, {});

    setUpdatedObjectinPA({...updatedObject});

    // Send updated object to parent component
    props.onAttributeFieldsChange({...productattributes, ...updatedObject});
  };

  
  const handleDeleteAttr = (index) => {
    const deletedAttribute = attributeFields[index];
    props.onDeleteAttribute(deletedAttribute);
    const newAttr = [...attributeFields];
    newAttr.splice(index, 1);
    setAttributeFields(newAttr);
  };
  
  
  const handleAddAttribute = () => {
    if (newattributeField.trim() !== "") {
      // Check if the new attribute already exists in the list
      
        if (props.routingComponent !== "edit" && products && newattributeField && attributeFields) {
          if (!Object.values(products).includes(newattributeField) && !attributeFields.some(field => field.name === newattributeField)) {
          setAttributeFields([...attributeFields, {name: newattributeField, value: ""}]);
          setnewAttributeField("");
          handleCloseatt();
          }
         else {
          toast.warning("Attribute Name already exists");
        }
      }
         else {
          if (!Object.keys(productattributes).includes(newattributeField.replace(/ /g, '_').toLowerCase()) && !attributeFields.some(field => field.name === newattributeField)) {
          setAttributeFields([...attributeFields, {name: newattributeField, value: ""}]);
          setnewAttributeField("");
          handleCloseatt();
          }
          else {
            toast.warning("Attribute Name already exists");
          }
    }
   }
    else {
      setAttributeFieldError("Attribute Name Cannot be Empty");
    }
  };

  const renderProductAttributes = () => {
    if (!isLoading) {
      if (props.routingComponent !== "edit") {
        return (
          <>
            {typeof products === "object" ? Object.values(products)?.map((attribute, index) => (
              <Col xs={12} md={4}>
                <Form.Group className="mb-4" key={index}>
                  <Form.Label>{attribute}</Form.Label>
                  <Form.Control type="text" placeholder="" name={attribute} onChange={props.parentCallBack} />
                </Form.Group>
              </Col>
            )) : null}
          </>
        )
      } else {
      const excludedKeys = ["fail_qty", "rcd_qty", "out_going_qty", "rtn_qty"];
        return (
          <>
            {Object.keys(productattributes).map((attributeName, index) => (
              !excludedKeys.includes(attributeName) && (
              <Col xs={12} md={4}>
              <Form.Group className="mb-4" key={index}>
                  <Form.Label htmlFor={attributeName}>{(attributeName).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Form.Label>
                  <div style={{display: "flex"}}>
                  <Form.Control type="text" placeholder="" name={attributeName} value={productattributes[attributeName].trimStart()} onChange={(e) => handleAttributeInputChange(e, attributeName)} />   
                  </div>
                </Form.Group>
              </Col>
            )))}
          </>
        )
      }
    }
  }

  useEffect(() => {
    setAttributeFields([]);
  }, [props.department]);

  useEffect(() => {
    if (editedproductAttributes) {
      setProductAttributes(editedproductAttributes);
    }
  }, [editedproductAttributes]);
  

  useEffect(() => {
    dispatch(getProductAttributes());
  }, [])

  return (
    <>
      <div className="mt-3 d-flex justify-content-between mb-3">
        <h3 className="inner-tag">Product attributes</h3>
        <a className="addtag" onClick={handleShowatt}>
          + Add Attribute
        </a>
      </div>
      <Row>
        {renderProductAttributes()}
        {props.routingComponent !== "edit" ? (
          attributeFields.map((attribute, index) => (
            <Col xs={12} md={4}>
              <Form.Group className="mb-4" key={index}>
                <Form.Label>{attribute.name}</Form.Label>
                <div style={{display: "flex"}}>
                <Form.Control type="text" placeholder="" value={attribute.value} onChange={(e) => handleAttributeValueChange(e, index)} />
                <span className='delete_attribute' onClick={() => handleDeleteAttr(index)}>&#10005;</span>
                </div>
              </Form.Group>
            </Col>
          ))
        ) : (
          attributeFields.map((attribute, index) => (
            <Col xs={12} md={4}>
              <Form.Group className="mb-4" key={index}>
                <Form.Label>{attribute.name}</Form.Label>
                <div style={{display: "flex"}}>
                <Form.Control type="text" placeholder="" value={attribute.value} onChange={(e) => handlePAttributeValueChange(e, index)} />
                <span className='delete_attribute' onClick={() => handleDeleteAttr(index)}>&#10005;</span>
                </div>
              </Form.Group>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showatt} onHide={handleCloseatt} centered>
        <Modal.Header className="border-0">
          <Modal.Title>Product Attribute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Attribute Name"
            className="mb-5"
            autoFocus={true}
            onChange={handleAttributeChange}
          />
          {attributeFieldError && <p style={{ color: "red" }}>{attributeFieldError}</p>}
          <div className="d-flex w-100 justify-content-end">
            <Button
              variant="secondary"
              onClick={handleCloseatt}
              className="me-3 cancel"
            >
              Close
            </Button>
            <Button variant="primary" className="submit" onClick={handleAddAttribute}>
              Create
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddAttribute;
