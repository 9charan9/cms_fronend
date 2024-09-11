import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import arw from "../../../assets/Images/left-arw.svg";
import InputGroup from "react-bootstrap/InputGroup";
import attahment from "../../../assets/Images/attachment.svg";
import "../../bom/styles/BomDetails.css";
import Table from "react-bootstrap/Table";
import Delete from "../../../assets/Images/Delete.svg";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
    getSearchcategory, selectSearchCategory, selectSearchcomponentdata,
    getSearchcomponentdata, selectAddClientDetails, addClient, selectLoadingState, selectGetClientInnerdata, getClinetInnerdata, updateClient, selectUpdateClient
} from "../slice/ClientSlice";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { tableContent, buttonTexts, clientForm } from "../../../utils/TableContent";


const CreateClient = ({ isEdit }) => {

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [dataeditor, setDataeditor] = useState("");
    const [dataeditorterms, setDataeditorterms] = useState("");

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermvalue, setSearchTermvalue] = useState("");


    const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedData, setSelectedProducts] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()


    const clientIdata = useSelector(selectGetClientInnerdata);
    const clientDtetails = clientIdata?.body;
    console.log(clientDtetails, "clientIdata");

    const getSearch = useSelector(selectSearchCategory);
    const getCategory = useSelector(selectSearchcomponentdata);
    console.log(getCategory, "1125456457454")
    const isLoading = useSelector(selectLoadingState);
    const searchContainerRef = useRef(null);
    const [form, setForm] = useState({
        client_id: "",
        client_name: "",
        client_location: "",
        email: "",
        contact_number: "",
        terms_and_conditions:"",
        payment_terms:""

    });
    const data = getSearch?.body;
    const removeattachment = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedFilesBase64 = selectedFilesBase64.filter((_, i) => i !== index);
        const updatedFileNames = fileNames.filter((_, i) => i !== index);
        // Update the state with the updated arrays
        setSelectedFiles(updatedFiles);
        setSelectedFilesBase64(updatedFilesBase64);
        setFileNames(updatedFileNames);
        const inputElement = document.querySelector('input[type="file"][name="upload"]');
        if (inputElement) {
          inputElement.value = '';
        }
    };

    const handlePdfChange = (e) => {
        const newFiles = [...selectedFiles];
        const newFileNames = [...fileNames];
        const newFilesBase64 = [...selectedFilesBase64];
        let hasNonPdfFile = false;
        let hasDuplicateFile = false;

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            if (file.type === "application/pdf") {
                if (newFileNames.includes(file.name)) {
                    hasDuplicateFile = true;
                    break;
                } else {
                    newFileNames.push(file.name);
                    newFiles.push(file);
                    const reader = new FileReader();
                    reader.onload = (fileOutput) => {
                        const encodedFile = fileOutput.target.result.split(",")[1];
                        newFilesBase64.push(encodedFile);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                hasNonPdfFile = true;
            }
        }

        if (hasNonPdfFile) {
            toast.error("Only PDF files are allowed.");
        }

        if (hasDuplicateFile) {
            toast.warning("Duplicate files are not allowed.");
        }

        // Clear the input value to trigger change event on re-upload of the same file
        if (!hasDuplicateFile) {
            e.target.value = "";
        }

        setSelectedFiles(newFiles);
        setFileNames(newFileNames);
        setSelectedFilesBase64(newFilesBase64);
    };
    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            const searchData = data.map((category) => {
                if (Array.isArray(category) && category.length > 0) {
                    const filteredCategory = category.filter(
                        (item) =>
                            typeof item === "string" &&
                            item.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    console.log(data, "dataaaaaa");

                    console.log(filteredCategory, "filtereddddddddddd");
                    return filteredCategory.map((item) => [category]);
                }
                return [];
            });
            console.log(searchData, "searchData");

            const flatFilteredData = searchData
                .flat()
                .filter(
                    (value, index, self) =>
                        self.findIndex((v) => v[0] === value[0]) === index
                );

            setFilteredData(flatFilteredData);
        }
    }, [getSearch]);

    const handleItemClick = (item) => {
        console.log(item[0][1], "--------------------");
        setSearchTerm(item[0]?.[0]);
        setSearchTermvalue(item[0]?.[1]);
        setIsAddButtonDisabled(false);
        setFilteredData([]);
    };
    const deleterow = (index, department) => {
        const updatedSelectedData = [...selectedData];
        const filteredData = updatedSelectedData.filter((product, i) => i !== index || product.department !== department);
        setSelectedProducts(filteredData);
        // console.log(updatedSelectedData, "checkingggggg")
    };
    const addItem = async () => {
        setFilteredData([]);
        if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
            return;
        }
        const request = {
            bom_name: searchTerm,
        };
        try {
            const response = await dispatch(getSearchcomponentdata(request));
            if (response.payload?.statusCode === 200) {
                const newItem = response.payload?.body[0];
                console.log(newItem, "newiTEM ")
                if (newItem) {
                    // console.log(selectedData, "selectedddd dataaaaaa")
                    // console.log(newItem.bom_id, " new cmptd ID")
                    if (!selectedData || selectedData.length === 0) {
                        setSelectedProducts([newItem]); // Initialize selectedData if it's empty or undefined
                        // console.log(selectedData, "selectedddd dataaaaaa")
                        // console.log(newItem.bom_id, " new cmptd ID")
                    } else if (!selectedData.some((item) => item.bom_id === newItem.bom_id)) {
                        setSelectedProducts([...selectedData, newItem]); // Update selectedData
                        // console.log(selectedData, "selectedddd dataaaaaa")
                        // console.log(newItem.bom_id, " new cmptd ID")
                        setIsAddButtonDisabled(true);

                    } else {
                        toast.error('Item already added.');

                    }
                    setSearchTerm('');
                    setSearchTermvalue('');
                }
            } else {
                toast.error("Already Bom ID exists for other client");
                setSearchTerm("");
                setSearchTermvalue('');
            }
        } catch (error) {
            toast.error("Error adding item.");
            setSearchTerm("");
            setSearchTermvalue('');
        }
    };

    const onUpdateField = (e) => {
        // const nextFormState = {
        //     ...form,
        //     [e.target.name]: e.target.value,
        // };
        const { name, value } = e.target;
        const trimmedValue = value.trimStart();  // Trim leading spaces

        const nextFormState = {
            ...form,
            [name]: trimmedValue,
        };
        setForm(nextFormState);
    };
    const handleClearForm = () => {
        setForm({
            bom_name: "",
            bom_description: "",
        });
        setSearchTerm("")
    }


    const onSubmitBom = async (e) => {
        e.preventDefault();

        // Check if any PDF document is larger than 500 KB
        const isPdfTooLarge = selectedFiles.some((file, index) => {
            const fileSizeInKB = file.size / 1024;
            return file.type === "application/pdf" && fileSizeInKB > 300;
        });

        if (isPdfTooLarge) {
            toast.error("One or more PDF documents exceed the maximum size of 300 KB.");
            return;
        }

        const documents = fileNames.map((fileName, index) => ({
            document_name: fileName,
            content: selectedFilesBase64[index],
        }));
        const boms = selectedData.map((item) => ({
            bom_id: item.bom_id,
            moq: item.moq,
            lead_time: item.lead_time,
            warranty: item.warranty,
            price: item.price,
            gst: item.gst
        }));
        // Combine the array of documents with other form data and selectedData
        const requestBody = {
            ...form,
            // terms_and_conditions: dataeditorterms,
            // payment_terms: dataeditor,
            documents,
            boms,
            // ...buildObject(selectedData, "part"),
        };

        // console.log(requestBody,"requesttttttttt")
        //const response = await dispatch(addClient(requestBody));

        if (isEdit) {
            // Replace 'updateClient' with the actual action for updating a client
            // Handle the response as needed updateClient
            console.log("Form Data:", requestBody);
            const response = await dispatch(updateClient(requestBody));
            if (response.payload?.statusCode === 200) {
                setIsErrorToastVisible(true);
                handleClearForm();
                setSelectedProducts([]);
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }



        } else {
            console.log(requestBody, "ommm");
            const response = await dispatch(addClient(requestBody));
            if (response.payload?.statusCode === 200) {
                setIsErrorToastVisible(true);
                handleClearForm();
                setSelectedProducts([]);
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            }
            // Handle the response as needed
        }




    };

    const onUpdateFieldCategory = (e, rowIndex, fieldName) => {
        // console.log('Updating field:', fieldName, 'at index:', rowIndex);
        const { value } = e.target;
        // if (fieldName === 'moq' && parseInt(value) < 0) {
        //     // You can show an error message, toast, or handle it in any other way
        //     toast.error("Moq cannot be a negative value.");
        //     return; // Prevent further processing for negative values
        // }

        if (fieldName === 'gst' && parseInt(value) > 22) {
            // You can show an error message, toast, or handle it in any other way
            toast.error("GST cannot be more than 22.");
            return; // Prevent further processing for values more than 22
        }
        setSelectedProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            updatedProducts[rowIndex] = {
                ...updatedProducts[rowIndex],
                [fieldName]: value
            };
            return updatedProducts;
        });
    };




    const handleSearch2 = (event) => {
        const searchTerm = event.target.value.trim();
        setSearchTerm(searchTerm);
        setSearchTermvalue(searchTerm)

        if (searchTerm.trim().length < 2) {
            setFilteredData([]);
            return;
        }
        const request = {
            bom_search: searchTerm,

        };
        setFilteredData([]);
        dispatch(getSearchcategory(request))

    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                // setSearchTerm("");
                setFilteredData([]); // Close the search list when a click occurs outside
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedProducts([]);
        setFilteredData([]);
    }, []);


    useEffect(() => {
        if (isEdit) {
            const client_id = location.state;
            const requestobj = {
                client_id: client_id
            };

            dispatch(getClinetInnerdata(requestobj)).then((response) => {
                if (response.payload?.statusCode === 200) {
                    // Update the form state with the fetched client details
                    const clientDetails = response.payload?.body;
                    setForm({
                        client_id: clientDetails.client_id || "",
                        client_name: clientDetails.client_name || "",
                        client_location: clientDetails.client_location || "",
                        email: clientDetails.email || "",
                        contact_number: clientDetails.contact_number || "",
                        terms_and_conditions: clientDetails.terms_and_conditions || "",
                        payment_terms: clientDetails.payment_terms || "",
                        // Add other form fields as needed
                    });
                    // setDataeditor(clientDetails.payment_terms);
                    // setDataeditorterms(clientDetails.terms_and_conditions);
                    // Update 'documents' state variables
                    const documents = clientDetails.documents || [];
                    console.log(documents.map(doc => doc.document_name) || [], "documents documents");
                    setFileNames(documents.map(doc => doc.document_name) || []);
                    setSelectedFiles(documents.map(doc => doc.document_name) || []);
                    setSelectedFilesBase64(documents.map(doc => doc.content) || []);

                    // Update 'boms' state variable
                    const boms = clientDetails.boms || {};
                    const bomArray = Object.values(boms).map(bom => ({
                        bom_id: bom.bom_id || "",
                        bom_name: bom.bom_name || "",
                        total_categories: bom.total_categories || "",
                        total_components: bom.total_components || "",
                        moq: bom.moq || "",
                        lead_time: bom.lead_time || "",
                        warranty: bom.warranty || "",
                        price: bom.price || "",
                        gst: bom.gst || ""
                    }));
                    setSelectedProducts(bomArray);
                }
            });
        }
    }, [isEdit]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRowIndex, setDeleteRowIndex] = useState(null);
    const [deleteDepartment, setDeleteDepartment] = useState(null);

    const openDeleteModal = (rowIndex, department) => {
        setDeleteRowIndex(rowIndex);
        setDeleteDepartment(department);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteRowIndex(null);
        setDeleteDepartment(null);
    };

    const confirmDelete = () => {
        // Perform the delete action
        if (deleteRowIndex !== null && deleteDepartment !== null) {
            deleterow(deleteRowIndex, deleteDepartment);
        }
        handleCloseDeleteModal();
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
                        {isEdit ? 'Edit Client' : 'Create Client'}
                    </h3>
                </div>
                <form onSubmit={onSubmitBom}>
                    <div className="content-sec">
                        <h5 className="inner-tag">{clientForm?.cInfo}</h5>
                        <Row>

                            <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{clientForm?.cName} <span className="red-asterisk">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="client_name"
                                        value={form.client_name}
                                        onChange={onUpdateField}
                                        required={true}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{clientForm?.cLocation}<span className="red-asterisk">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="client_location"
                                        value={form.client_location}
                                        onChange={onUpdateField}
                                        required={true}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{tableContent?.email} <span className="red-asterisk">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="email"                                        
                                        value={form.email}
                                        onChange={onUpdateField}
                                        required={true}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{clientForm?.cCno} <span className="red-asterisk">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="contact_number"
                                        pattern="[0-9]*[\s\-()/]*" 
                                        // minLength={10}
                                        // maxLength={10}
                                        value={form.contact_number}
                                        onChange={onUpdateField}
                                        required={true}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <h5 className="inner-tag my-3">{clientForm?.otherInfo}</h5>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{clientForm?.termsText}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="terms_and_conditions"
                                        value={form.terms_and_conditions}
                                        onChange={onUpdateField}
                                        required={true}
                                        maxLength={500}
                                    /> 
                                     {/* <TermsEditor
                                        name="terms_and_conditions"
                                        onChange={(data) => {
                                            setDataeditorterms(data);
                                        }}
                                        value={dataeditorterms}
                                        editorLoaded={editorLoaded}
                                    /> */}
                                     {/* {JSON.stringify(dataeditorterms)} */}
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>{clientForm?.paymentText}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="payment_terms"
                                        value={form.payment_terms}
                                        onChange={onUpdateField}
                                        required={true}
                                        maxLength={500}
                                    /> 
                                    {/* <TermsEditor
                                        name="payment_terms"
                                        onChange={(data) => {
                                            setDataeditor(data);
                                        }}
                                        value={dataeditor}
                                        editorLoaded={editorLoaded}
                                    /> */}

                                    {/* {JSON.stringify(dataeditor)} */}
                                </Form.Group>
                            </Col>
                        </Row>



                        <h5 className="inner-tag my-3">{clientForm?.rDocuments}</h5>
                        <Row>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{clientForm?.aDocuments}</Form.Label>
                                    <div>
                                        <input
                                            type="file"
                                            id="upload"
                                            name="upload"
                                            hidden
                                            multiple
                                            onChange={handlePdfChange}
                                            accept=".pdf"
                                        />
                                        <label for="upload" className="cfile">
                                            <img src={attahment} alt="" />
                                        </label>
                                    </div>
                                </Form.Group>
                            </Col>

                            {selectedFiles.map((file, index) => (
                                <Col xs={12} md={3} key={index}>
                                    <Form.Group className="mb-1">
                                        <Form.Label>&nbsp;</Form.Label>
                                        <div className="attachment-sec">
                                            <span className="attachment-name">{fileNames[index]}</span>
                                            <span
                                                className="attachment-icon"
                                                onClick={() => removeattachment(index)}
                                            >
                                                x
                                            </span>
                                        </div>
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>


                        <div>
                            <div className="d-flex justify-content-end align-center mt-4 d-flex-mobile-align">
                                <div className="position-relative" ref={searchContainerRef}>
                                    <InputGroup className="mb-0 search-add">
                                        <Form.Control
                                            placeholder="Search add BOM's"
                                            aria-label="earch add BOM's"
                                            aria-describedby="basic-addon2"
                                            type="search"
                                            value={searchTermvalue.trimStart()}
                                            onChange={handleSearch2}
                                        />
                                        <Button
                                            variant="secondary"
                                            id="button-addon2"
                                            disabled={!searchTerm.trim() || isAddButtonDisabled}
                                            onClick={addItem}
                                        >
                                            + Add
                                        </Button>
                                    </InputGroup>
                                    <ul className="position-absolute searchul" hidden={searchTermvalue.trim().length==0?true:false}>
                                        {filteredData &&
                                            filteredData?.map((item, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    {/* {item[0]?.[1]} */}
                                                    {item[0].slice(1).join(" , ")}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>


                            <div className="table-responsive mt-4">
                                <Table className="b-table">
                                    <thead>
                                        <tr>
                                            {/* <th>{tableContent?.bomId}</th> */}
                                            <th>{tableContent?.bomName}</th>
                                            <th>{tableContent?.categories}</th>
                                            <th>{tableContent?.components}</th>
                                            <th>{tableContent?.moq}</th>
                                            <th>{tableContent?.leadTime}</th>
                                            <th>{tableContent?.warranty}</th>
                                            <th>Unit Price</th>
                                            <th>{tableContent?.GST}</th>
                                            <th>{tableContent?.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedData.length > 0 ? (
                                            selectedData.map((product, rowIndex) => (
                                                <tr key={product.bom_id}>
                                                    {/* <td>{product?.bom_id}</td> */}
                                                    <td>{product?.bom_name}</td>
                                                    <td>{product?.total_categories}</td>
                                                    <td>{product?.total_components}</td>
                                                    {/* <td><input type="text" className='input-50' pattern="[0-9]*" min={0} value={product[`moq`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `moq`)} onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
                                                    }} required={true} /></td>
                                                    <td><input type="text" className='input-50' value={product[`lead_time`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `lead_time`)} onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
                                                    }} required={true} /></td>
                                                    <td><input type="text" className='input-50' value={product[`warranty`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `warranty`)}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numeric characters and dots
                                                            e.target.value = e.target.value.replace(/(\.\d*)\./g, '$1'); // Remove consecutive dots after a decimal point
                                                        }}
                                                        pattern="\d+(\.\d{1,2})?"
                                                        required={true} /></td>
                                                    <td><input type="text" className='input-50' value={product[`price`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `price`)}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numeric characters and dots
                                                            e.target.value = e.target.value.replace(/(\.\d*)\./g, '$1'); // Remove consecutive dots after a decimal point
                                                        }}
                                                        pattern="\d+(\.\d{1,2})?"
                                                        required={true} /></td>
                                                    <td><input type="text" className='input-50' value={product[`gst`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `gst`)} onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
                                                    }} required={true} /></td> */}
                                                    <td><input type="text" className='input-50' value={product[`moq`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `moq`)} required={true} /></td>
    <td><input type="text" className='input-50' value={product[`lead_time`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `lead_time`)} required={true} /></td>
    <td><input type="text" className='input-50' value={product[`warranty`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `warranty`)} required={true} /></td>
    <td><input type="text" className='input-50' value={product[`price`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `price`)}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numeric characters and dots
                                                            e.target.value = e.target.value.replace(/(\.\d*)\./g, '$1'); // Remove consecutive dots after a decimal point
                                                        }}
                                                        pattern="\d+(\.\d{1,2})?"
                                                        required={true} /></td>
    <td><input type="text" className='input-50' value={product[`gst`] || ''} onChange={e => onUpdateFieldCategory(e, rowIndex, `gst`)} required={true} /></td>
                                                    <td onClick={() => openDeleteModal(rowIndex, product.department)}>
                                                        <img src={Delete} alt="Delete Icon" />
                                                    </td>
                                                </tr>
                                            ))) : (
                                            <>
                                                <tr>
                                                    <td colSpan="10" className="text-center">{tableContent?.nodata}</td>
                                                </tr>

                                            </>
                                        )
                                        }

                                    </tbody>
                                </Table>
                            </div>


                        </div>

                    </div>

                    <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={() => {
                                navigate(-1);
                            }}
                            disabled={isErrorToastVisible}
                        >
                            {buttonTexts?.cancel}
                        </Button>

                        {isEdit ? <> <Button type="submit" className="submit">
                            {buttonTexts?.update}
                        </Button></> : <> <Button type="submit" className="submit">
                            {buttonTexts?.create}
                        </Button></>}
                    </div>
                </form>
            </div>
            {isLoading && (
                <div className="spinner-backdrop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden">{clientForm?.loaderText}</span>
                    </Spinner>
                </div>
            )}

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

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Body>
                    Are you sure you want to delete the selected item?
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                    <div className="mt-3 d-flex justify-content-center">
                        <Button
                            type="button"
                            className="cancel me-2"
                            onClick={handleCloseDeleteModal} >
                            No
                        </Button>
                        <Button type="submit" className="submit" onClick={confirmDelete}>
                            Yes
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateClient;
