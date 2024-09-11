import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Spinner } from "react-bootstrap";
import moment from 'moment';
import { addRoles, selectLoadingState, listofRoles, selectListofRoles, assignpermissions } from "../slice/SettingsSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import { textToast } from "../../../utils/TableContent";


const Roles = () => {
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoadingState);
    const [checkedItems, setCheckedItems] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const [roleName, setRolename] = useState("");
    const [roleId, setRoleid] = useState("");
    // const handleClose1 = () => setShow1(false);
    // const handleShow1 = () => setShow1(true);
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    //list of roles
    const rolesData = useSelector(selectListofRoles);
    const listdata = rolesData?.body;
    // console.log(listdata, "ommmmmmmmmmmmmm");
    const [form, setForm] = useState({
        role_name: "",
    });

    const onUpdateField = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trimStart(); // Trim leading spaces    
        setForm({ ...form, [name]: trimmedValue });
    };

    const handleShow1 = (item) => {
        // console.log(item, "ommm");
        setRoleid(item?.all_attributes?.role_id || "");
        setRolename(item?.all_attributes?.role_name || "");
        setShow1(true);
    }

    const handleEdit = (item) => {
        navigate("/editpermissions", {
            state: { roleid: item?.all_attributes?.role_id}
          });
    }
    const handleClose1 = () => {
        // Close your popup logic here
        setShow1(false);
        setCheckedItems({});
    };

    const onSubmitroles = async (e) => {
        e.preventDefault();
        const formData = {
            role_name: form.role_name.trim(),
        };
        const requestBody = {
            ...formData,
        };

        const response = await dispatch(addRoles(requestBody));
        if (response.payload?.statusCode === 200) {
            setIsErrorToastVisible(true);
            dispatch(listofRoles())
            setForm("")
            setShow(false)
        } else if (response.payload?.statusCode === 400) {
            setIsErrorToastVisible(true);
            // console.log("ommmmmmmmmmmmmmmmmmmmmmmmm",response.payload?.body);            
            // toast.error(response.payload?.body); // This should show "Role Name Already Existed"
        } else {
            toast.error("An unexpected error occurred");
        }

    };

    // Permissions
    const handleCheck = (e) => {
        const { id, checked } = e.target;
        setCheckedItems((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const Saveroles = async (e) => {
        e.preventDefault();
        console.log(checkedItems);

        const permissions = [
            "Dashboard", "Inventory", "Components", "Vendors",
            "Clients", "PurchaseOrders", "Bom"
        ];
        // Build screen_permissions object
        const screen_permissions = permissions.reduce((acc, item) => {
            acc[item] = {
                read: checkedItems[`${item}Read`] || false,
                write: checkedItems[`${item}Write`] || false,
                delete: checkedItems[`${item}Delete`] || false,
            };
            return acc;
        }, {});

        // const hasModuleSelected = permissions.some(
        //     (item) => checkedItems[`${item}Read`] || checkedItems[`${item}Write`] || checkedItems[`${item}Delete`]
        // );
        const hasModuleSelected = permissions.some(
            (item) => screen_permissions[item].read || screen_permissions[item].write || screen_permissions[item].delete
        )    
        if (!hasModuleSelected) {
            toast.error("Please select at least one module with a read, write, or delete permission.");
            return;
        }
        // console.log({ screen_permissions });
        const reqobj = {
            "role_id": roleId,
            "role_name": roleName,
            "is_update": false,
            ...screen_permissions
        }
        console.log(reqobj, "ommm");
        const response = await dispatch(assignpermissions(reqobj));
        if (response.payload?.statusCode === 200) {
            setIsErrorToastVisible(true);
            handleClose1();           
        } else if (response.payload?.statusCode === 400) {
            setIsErrorToastVisible(true);
           
        } else {
            toast.error("An unexpected error occurred");
        }
      
    };

    useEffect(() => {
        dispatch(listofRoles())
    }, [dispatch])

    return (
        <>

            <div className='wrap'>
                <div className="d-flex justify-content-between w-100">
                    <h1 className="title-tag">
                        Roles
                    </h1>
                    <div>
                        <Button className='cancel' onClick={handleShow}>Add Role</Button>
                        <Button className='cancel ms-3' onClick={handleShow2}>Add User</Button>
                    </div>
                </div>
                <div className='table-responsive mt-4'>
                    <Table className='b-table'>
                        <thead>
                            <tr>
                                {/* <th>S.No</th> */}
                                <th>Role ID</th>
                                <th>Role Name</th>
                                <th>Created On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(listdata) && listdata?.length > 0 ? (listdata?.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{index + 1}</td>                                                                 */}
                                    <td> {item?.all_attributes?.role_id || "-"} </td>
                                    <td> {item?.all_attributes?.role_name || "-"} </td>
                                    <td>{item?.created_on ? moment(item.created_on).format('DD-MM-YYYY') : "-"}</td>
                                    <td>
                                        <Button className='cancel assign' onClick={() => handleShow1(item)}>Assign</Button>
                                        <Button className='cancel assign ms-1' onClick={() => handleEdit(item)} disabled>Edit</Button>
                                    </td>
                                </tr>
                            ))
                            ) : (
                                <>
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            {textToast?.noData}
                                        </td>
                                    </tr>
                                </>
                            )}

                        </tbody>
                    </Table>
                </div>
            </div>

            {/* //Role */}
            <Modal show={show} onHide={handleClose} centered>
                <form onSubmit={onSubmitroles}>
                    <Modal.Header closeButton className="text-center border-0">
                        <Modal.Title className="text-center w-100"> <h6>Add Role</h6></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="rolename">
                            <Form.Control type="text" placeholder="Role Name" name="role_name" value={form?.role_name}
                                onChange={onUpdateField} required />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button className="btn cancel" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" className="btn submit" disabled={isErrorToastVisible}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>


            {/* Permissions */}
            <Modal show={show1} onHide={handleClose1} centered>
                <Form>
                    <Modal.Header closeButton className="text-center border-0">
                        <Modal.Title className="text-center w-100"> <h6>Assign Permissions</h6></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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

                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button className="btn cancel" onClick={handleClose1}>
                            Close
                        </Button>
                        {/* <Button className="btn submit" onClick={Saveroles} disabled={isErrorToastVisible}>
                            Submit
                        </Button> */}
                           <Button className="btn submit" onClick={Saveroles} disabled>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Uswer */}

            <Modal show={show2} onHide={handleClose2} centered>
                <Form>
                    <Modal.Header closeButton className="text-center border-0">
                        <Modal.Title className="text-center w-100"> <h6>Add User</h6></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control type="text" placeholder="First Name" name="username" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control type="text" placeholder="Last Name" name="username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control type="text" placeholder="Email ID" name="username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Select aria-label="Default select example">
                                <option>Select Roles</option>
                                <option value="1">Admin</option>
                                <option value="2">Super Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Control type="text" placeholder="Phone No" name="username" />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button className="btn cancel" onClick={handleClose2}>
                            Close
                        </Button>
                        <Button className="btn submit" onClick={handleClose2}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

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

export default Roles;
