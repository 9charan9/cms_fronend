import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import arw from "../../../assets/Images/left-arw.svg";
import { Row, Table } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { selectLoadingState, selectListofeditPermissions, listassignpermissions } from "../slice/SettingsSlice";
const EditPermissions = () => {
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
    const isLoading = useSelector(selectLoadingState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const { roleid } = location.state || {};
    console.log(roleid, "roleid");
    const roleseditData = useSelector(selectListofeditPermissions);
    const listeditdata = roleseditData?.body;
    console.log(listeditdata, "ommm");
    const [checkedItems, setCheckedItems] = useState({});
    const [form, setForm] = useState({
        role_name: "",
        role_id: "",
    });

    useEffect(() => {
        const req = {
            role_id: roleid
        }
        dispatch(listassignpermissions(req))
    }, [roleid])

    useEffect(() => {
        if (listeditdata !== undefined) {
            setForm({
                role_id: listeditdata?.role_id,
                role_name: listeditdata?.role_name,
            });
        }
    }, [listeditdata]);

    const updateInputFields = (e) => {
        const { value } = e.target;
        const nextFormState = {
            ...form,
            [e.target.name]: value.trimStart(),
        };
        setForm(nextFormState);
    };

     // Permissions
     const handleCheck = (e) => {
        const { id, checked } = e.target;
        setCheckedItems((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    return (
        <>
            <div className="wrap">
                <div className="d-flex justify-content-between">
                    <h3 className="title-tag">
                        <img
                            src={arw}
                            alt=""
                            className="me-3"
                            onClick={() => {
                                navigate(-1);
                            }}
                        />
                        Edit Permissions
                    </h3>
                </div>
                <div className="content-sec">
                    <form onSubmit={handleSubmit}>

                        <Row>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Role ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="role_id"
                                        value={form.role_id}
                                        onChange={updateInputFields}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Role Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="role_name"
                                        value={form.role_name.trimStart()}
                                        onChange={updateInputFields}
                                        disabled

                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {["Dashboard", "Inventory", "Components", "Vendors", "Clients", "PurchaseOrders", "Bom"].map((item, index) => (
                            <div className="d-flex w-100 justify-content-between mb-3" key={index}>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        id={item}
                                        label={item}
                                        onChange={handleCheck}
                                    />
                                </div>
                                <div className="d-flex">
                                    <Form.Check
                                        type="checkbox"
                                        id={`${item}Read`}
                                        label="Read"
                                        onChange={handleCheck}
                                        disabled={!checkedItems[item]}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={`${item}Write`}
                                        label="Write"
                                        className="mx-3"
                                        onChange={handleCheck}
                                        disabled={!checkedItems[item]}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id={`${item}Delete`}
                                        label="Delete"
                                        onChange={handleCheck}
                                        disabled={!checkedItems[item]}
                                    />
                                </div>
                            </div>
                        ))}


                        <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                            <Button
                                type="button"
                                className="cancel me-2"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                CANCEL
                            </Button>
                            <Button type="submit" className="submit">
                                UPDATE
                            </Button>
                        </div>

                    </form>
                </div>


            </div>


            <ToastContainer
                limit={1}
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ minWidth: "100px" }}
                transition={Zoom}
                onClose={() => setIsErrorToastVisible(false)}
            />
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

        </>
    );
};

export default EditPermissions;