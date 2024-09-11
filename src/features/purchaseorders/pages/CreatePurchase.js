import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import arw from "../../../assets/Images/left-arw.svg";
import attachment from "../../../assets/Images/attachment.svg";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import {
  fetchVendorList,
  getVendorcategoryDetails,
  selectCategory,
  selectedVendor,
  setStatusUpdate,
  getstatusofpo,
  createpo,
  selectLoadingStatus,
  serachComponentinPO,
  selectSearchComponentData,
  addComponentinpo,
  getvednorsbydepartment,
  selectGetVendorsbyDeprt,
  getCreatedEditPo,
  selectEditPoDetails,
  updateCreatedPoDetails,
} from "../slice/PurchaseOrderSlice";
import {
  selectVendorType,
  listSelection,
} from "../../vendors/slice/VendorSlice";
import Toast from "react-bootstrap/Toast";
import { toast } from "react-toastify";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { Spinner } from "react-bootstrap";
import Delete from "../../../assets/Images/Delete.svg";
import { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreatePurchase = () => {
  const [errorInput, setErrorInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermvalue, setSearchTermvalue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const typeSelection = useSelector(selectVendorType);
  const VendorsData = typeSelection?.body;
  console.log(VendorsData);
  const statusUpdate = useSelector(setStatusUpdate);
  const statusFeatures = statusUpdate.body;
  console.log(statusFeatures, "ommmmmmmmmmm");
  const isLoading = useSelector(selectLoadingStatus);
  const state = location.state;
  const component = state?.component;
  const vendor_id = state?.vendorId;
  const order_id = state?.orderNo;
  //console.log(component);
  const singlecomponentData = state?.purchaselist;
  //console.log(singlecomponentData);
  const [showFileTypeError, setShowFileTypeError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedData, setSelectedProducts] = useState([]);
  const [selectedFilesBase64, setSelectedFilesBase64] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [departmenttype, setDepartmentType] = useState();
  const [totalQtyPerBoard, setTotalQtyPerBoard] = useState(0);
  const [totalUnitPrice, setTotalUnitPrice] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const [terms, setTerms] = useState("");
  const [payment, setPayment] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showToast, setShowToast] = useState(true);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(
    "Only PDF files are allowed."
  );
  const searchedData = useSelector(selectSearchComponentData);
  const getVendorsbyDepartment = useSelector(selectGetVendorsbyDeprt);
  const getvendorsdep = getVendorsbyDepartment?.body;
  //console.log(getvendorsdep);
  const getPoDetails = useSelector(selectEditPoDetails);
  const getPurchaseEditDetails = getPoDetails?.body;
  const [selectedStatusop, setSelectedStatusop] = useState(getPurchaseEditDetails?.status);
  //console.log(getPurchaseEditDetails);
  const data = searchedData?.body;
  const searchComponentRef = useRef(null);
  const [calculatedPrices, setCalculatedPrices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [form, setForm] = useState({
    vendor_name: "",
    vendor_id: "",
    status: "",
    ordered_by: "",
    ordered_by_contact: "",
    receiver: "",
    receiver_contact: "",
    billing_address: "",
    shipping_address: "",
    total_qty: "",
    total_price: "",
    payment_terms: "",
    terms_and_conditions: "",
    deo: "",
  });
  //console.log(form, "dsgfkl");
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    const selectedValue = e.target.value;
    console.log(selectedValue);
    const [vendorId, vendorName, vendorType] = selectedValue.split(" , ");
    setForm((prevForm) => ({
      ...prevForm,
      vendor_id: vendorId,
      vendor_name: vendorName,
      [e.target.name]: selectedValue,
    }));
    setDepartmentType(vendorType);
    setSelectedStatus("");
    setTerms("");
    setPayment("");
    if (component === "createpo") {
      setSelectedProducts([]);
    }
  };

  const handleStatusChange = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
    setSelectedStatus(e.target.value);
  };

  const getStatus = () => {
    if (Array.isArray(statusFeatures)) {
      return (
        <>
          <option value="">
            {selectedStatusop}
          </option>
          {statusFeatures.map((value, index) => (
            <option
              value={value}
              key={index}
              selected={value === selectedStatus}
            >
              {value}
            </option>
          ))}
        </>
      );
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

  const removeattachment = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFilesBase64 = selectedFilesBase64.filter(
      (_, i) => i !== index
    );
    const updateFileName = fileNames.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setSelectedFilesBase64(updatedFilesBase64);
    setFileNames(updateFileName);
  };

  const onUpdateField = (e) => {
    const value = e.target.value.trimStart();
    setTerms(value);
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: value,
    }));
  };

  const handleclear = () => {
    if (component === "createpo" || component === "singlecomponent") {
      setSelectedFiles([]);
      setSelectedFilesBase64([]);
      setFileNames([]);
      setTotalQtyPerBoard(0);
      setTotalUnitPrice(0);
      setSelectedOption("");
      setTerms("");
      setSelectedStatus("");
      setPayment("");

      setForm({
        vendor_name: "",
        vendor_id: "",
        // status: "",
        ordered_by: "",
        against_po: "",
        deo: "",
        ordered_by_contact: "",
        receiver: "",
        receiver_contact: "",
        billing_address: "",
        shipping_address: "",
        total_qty: "",
        total_price: "",
        payment_terms: "",
        terms_and_conditions: "",
      });
      if (component === "createpo") {
        setSelectedProducts([]);
      } else if (component === "singlecomponent") {
        setSelectedProducts([]);
        setCalculatedPrices([]);
      }
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const isoDate = date.toISOString().split("T")[0];
      setForm((prevDetails) => ({
        ...prevDetails,
        deo: isoDate,
      }));
    } else {
      setForm((prevDetails) => ({
        ...prevDetails,
        deo: "",
      }));
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const isPdfTooLarge = selectedFiles.some((file, index) => {
      const fileSizeInKB = file.size / 1024;
      return file.type === "application/pdf" && fileSizeInKB > 300;
    });

    if (isPdfTooLarge) {
      toast.error("One or more PDF documents exceed the maximum size of 300 KB.");
      return;
    }
    const documents = fileNames.map((fileName, index) => ({
      doc_name: fileName,
      doc_body: selectedFilesBase64[index],
    }));

    const requestBody = {

      ...form,
      status: selectedStatus || selectedStatusop,
      documents,
      parts: {}, // Change from array to object
    };

    selectedData?.forEach((part, index) => {
      requestBody.parts[`part${index + 1}`] = {
        ...part,
        unit_price: calculatedPrices[index].toString() || 0,
      };
    });

    // Calculate total_qty and total_price
    const totalQtyPerBoard = Object.values(requestBody.parts)
      .reduce((total, part) => total + parseInt(part.qty || 0), 0)
      .toString();
    const totalUnitPrice = Object.values(requestBody.parts)
      .reduce((total, part) => total + (parseFloat(part.price) || 0), 0)
      .toString();

    // Set total_qty as total_qty and total_price as total_price
    requestBody.total_qty = totalQtyPerBoard;
    requestBody.total_price = totalUnitPrice;

    if (selectedData.length === 0) {
      toast.error("Please add parts to the orders");
    } else {
      try {
        // Submit the form with filtered parts
        if (component === "createpo" || component === "singlecomponent") {
          console.log(requestBody,"requestBody ommmmmmm");
          const response = await dispatch(createpo(requestBody));
          handleclear();
                if (component === "createpo") {
                  if (response.payload?.statusCode === 200) {
                    setTimeout(() => {
                      navigate(-1)
                    }, 2000);
                  }
                }
                else{
                  if (response.payload?.statusCode === 200) {
                    setTimeout(() => {
                      let path = `/purchaseorders?tab=createdpos`;
                      navigate(path)
                    }, 2000);
                  }                   
                
                }

        } else {
          console.log(JSON.stringify(requestBody, null, 2));
          dispatch(updateCreatedPoDetails(requestBody));
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };
  // console.log(selectedData);

  // const getStatusOptions = () => {
  //   if (Array.isArray(statusFeatures)) {
  //     return statusFeatures.map((value) => (
  //       <option key={value} value={value}>
  //         {value}
  //       </option>
  //     ));
  //   }
  // };
  const getCategoryOptions = () => {
    if (component !== "singlecomponent") {
      if (Array.isArray(VendorsData)) {
        return VendorsData.map((value) => {
          return (
            <option value={`${value?.vendor_id} , ${value?.vendor_name} , ${value?.vendor_type}`}>
              {value?.vendor_id} - {value?.vendor_name}
            </option>
          );
        });
      }
    } else {
      if (Array.isArray(getvendorsdep)) {
        return getvendorsdep.map((value) => {
          return (
            <option value={`${value?.vendor_id} , ${value?.vendor_name}`}>
              {value?.vendor_id} - {value?.vendor_name}
            </option>
          );
        });
      }
    }
  };
  const handleBackButton = () => {
    handleclear();
    dispatch(getVendorcategoryDetails([]));
    navigate(-1);
    setFilteredData([]);
  };
  const handleSearchComponent = (event) => {
    const searchTerm = event.target.value.trim();
    setSearchTerm(searchTerm);
    setSearchTermvalue(searchTerm);

    if (searchTerm.trim().length < 2) {
      setFilteredData([]);
      return;
    }
    const request = {
      name: searchTerm,
      department: departmenttype
    };
    setFilteredData([]);
    dispatch(serachComponentinPO(request));
  };

  const handleItemClick = (item) => {
    // console.log(item[0][0]);
    setSearchTerm(item[0]?.[0]);
    setSearchTermvalue(item[0]?.[1]);
    setIsAddButtonDisabled(false);
    setFilteredData([]);
  };

  const addItem = async () => {
    setFilteredData([]);
    if (typeof searchTerm === "string" && searchTerm.trim().length === 0) {
      return;
    }

    const request = {
      component_id: searchTerm,
    };
    const newTotalQtyPerBoard = selectedData.reduce(
      (total, product) => total + parseInt(product.qty, 10),
      0
    );
    const newTotalUnitPrice = selectedData.reduce(
      (total, product) => total + parseFloat(product.price),
      0
    );

    // Update state or perform any other necessary actions with the new totals
    setTotalQtyPerBoard(newTotalQtyPerBoard);
    setTotalUnitPrice(newTotalUnitPrice);
    try {
      const response = await dispatch(addComponentinpo(request));
      const newItem = response.payload?.body;
      // console.log(newItem, "newiTEM ")
      if (response.payload?.statusCode!=400) {
        if (!selectedData.some((item) => item.cmpt_id === newItem.cmpt_id)) {
          setSelectedProducts([...selectedData, newItem]);
          setIsAddButtonDisabled(true);
        } else {
          toast.error("Item already added.");
        }
        setSearchTerm("");
        setSearchTermvalue('');
      } else {
        toast.error("Item not found.");
        setSearchTerm("");
        setSearchTermvalue('');
      }
    } catch (error) {
      toast.error("Error adding item.");
      setSearchTerm("");
      setSearchTermvalue('');
    }
  };

  const deleterow = (index) => {
    const updatedSelectedData = [...selectedData];
    updatedSelectedData.splice(index, 1);

    const updatedCalculatedPrices = [...calculatedPrices];
    updatedCalculatedPrices.splice(index, 1);

    // Update state with the modified arrays
    setSelectedProducts(updatedSelectedData);
    setCalculatedPrices(updatedCalculatedPrices);

    const updatedTotalQtyPerBoard = updatedSelectedData.reduce(
      (total, product) => total + parseInt(product.qty),
      0
    );
    const updatedTotalUnitPrice = updatedSelectedData.reduce(
      (total, product) => total + parseFloat(product.price),
      0
    );

    // Update state with the new totals
    setTotalQtyPerBoard(updatedTotalQtyPerBoard);
    setTotalUnitPrice(updatedTotalUnitPrice);
  };
  const handleCloseToast = () => {
    setShowToast(false); // Set it to false to close the toast
  };
  const [errorDisplayed, setErrorDisplayed] = useState(false);

  const handleQtyPerBoardChange = (newValue, rowIndex) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        parseInt(newValue, 10) !== 0 &&
        parseInt(newValue, 10) >= 1)
    ) {
      // Clear the error message if it was previously displayed
      setErrorDisplayed(false);
      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          qty: newValue === "" ? "" : String(newValue, 10),
        };
        const updatedCalculatedPrices = [...calculatedPrices];
        updatedCalculatedPrices[rowIndex] = calculatePricePerPiece(
          newValue,
          updatedSelectedData[rowIndex].price
        );
        setCalculatedPrices(updatedCalculatedPrices);
        const updatedTotalQtyPerBoard = calculatedPrices.reduce(
          (total, price, index) => {
            const qty = parseInt(updatedSelectedData[index]?.qty, 10) || 0;
            return total + qty;
          },
          0
        );
        setTotalQtyPerBoard(updatedTotalQtyPerBoard);
        return updatedSelectedData;
      });
    } else {
      // Display the error message only if it hasn't been displayed already
      if (!errorDisplayed) {
        toast.error("Qty per board must be a non-zero number");
        setErrorDisplayed(true);
      }
    }
  };

  const handlePriceChange = (newValue, rowIndex) => {
    if (
      newValue === "" ||
      (!isNaN(newValue) &&
        parseFloat(newValue, 10) !== 0 &&
        parseFloat(newValue, 10) >= 1)
    ) {
      // Clear the error message if it was previously displayed
      setErrorDisplayed(false);
      setSelectedProducts((prevSelectedData) => {
        const updatedSelectedData = [...prevSelectedData];
        updatedSelectedData[rowIndex] = {
          ...updatedSelectedData[rowIndex],
          price: newValue === "" ? "" : String(newValue, 10),
        };
        const updatedCalculatedPrices = [...calculatedPrices];
        updatedCalculatedPrices[rowIndex] = calculatePricePerPiece(
          updatedSelectedData[rowIndex].qty,
          newValue
        );
        setCalculatedPrices(updatedCalculatedPrices);
        const updatedTotalUnitPrice = calculatedPrices.reduce(
          (total, price, index) => {
            const unitPrice =
              parseFloat(updatedSelectedData[index]?.price) || 0;
            return total + unitPrice;
          },
          0
        );
        setTotalUnitPrice(updatedTotalUnitPrice);
        return updatedSelectedData;
      });
    } else {
      // Display the error message only if it hasn't been displayed already
      if (!errorDisplayed) {
        toast.error("Price must be a non-zero number");
        setErrorDisplayed(true);
      }
    }
  };

  const calculatePricePerPiece = (qtyPerBoard, unitPrice) => {
    const qty = parseInt(qtyPerBoard, 10);
    const price = parseFloat(unitPrice);
    return isNaN(qty) || isNaN(price) || qty === 0
      ? ""
      : (price / qty).toFixed(2);
  };

  const calculateTotals = () => {
    let totalQty = 0;
    let totalPrice = 0;

    selectedData.forEach((product) => {
      totalQty += parseInt(product.qty, 10) || 0;
      totalPrice += parseFloat(product.price) * parseInt(product.qty, 10) || 0;
    });

    setTotalQtyPerBoard(totalQty);
    setTotalUnitPrice(totalPrice.toFixed(2)); // Assuming you want two decimal places
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action of the Enter key
    }
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

          // console.log(filteredCategory, "filtereddddddddddd");
          return filteredCategory.map((item) => [category]);
        }
        return [];
      });

      const flatFilteredData = searchData
        .flat()
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v[0] === value[0]) === index
        );

      setFilteredData(flatFilteredData);
    }
  }, [searchedData]);
  console.log(filteredData)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchComponentRef.current &&
        !searchComponentRef.current.contains(event.target)
      ) {
        setFilteredData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (component === "createpo" || component === "singlecomponent") {
      const request = {
        status: "Create",
      };
      dispatch(getstatusofpo(request));
    } else if (component === "editpo") {
      const request = {
        status: "Edit",
        po_id: order_id,
      };
      dispatch(getstatusofpo(request));
    }
    setFilteredData([]);
    if (component === "singlecomponent") {
      const request = {
        department: singlecomponentData?.department,
      };
      console.log(JSON.stringify(request, null, 2));
      dispatch(getvednorsbydepartment(request));
      setSelectedProducts([
        {
          cmpt_id: singlecomponentData?.cmpt_id,
          ctgr_id: singlecomponentData?.ctgr_id,
          manufacturer: singlecomponentData?.manufacturer,
          ctgr_name: singlecomponentData?.ctgr_name,
          department: singlecomponentData?.department,
          packaging: "-",
          description: singlecomponentData?.description,
          mfr_prt_num: singlecomponentData?.mfr_prt_num,
          prdt_name:
            singlecomponentData?.sub_ctgr || singlecomponentData?.prdt_name,
          qty: "1",
          price: "",
          unit_price: singlecomponentData?.unit_price,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const requestobj = {
      status: "Active",
      type: "all_vendors",
    };
    dispatch(listSelection(requestobj));
    if (component === "editpo") {
      const request = {
        vendor_id: vendor_id,
        order_id: order_id,
      };
      setSelectedFiles([]);
      setFileNames([]);
      dispatch(getCreatedEditPo(request));
    }
  }, [dispatch]);

  useEffect(() => {
    if (selectedData?.length === 0) {
      setTotalQtyPerBoard(0);
      setTotalUnitPrice(0);
    }
  }, [selectedData]);

  useEffect(() => {
    // Calculate totals on initial render
    let totalQty = 0;
    let totalPrice = 0;

    selectedData?.forEach((product) => {
      totalQty += Number(product.qty || 0);
      totalPrice += parseFloat(product.price || 0);
    });

    setTotalQtyPerBoard(totalQty);
    setTotalUnitPrice(totalPrice);
  }, [selectedData]);

  useEffect(() => {
    if (component === "editpo") {
      if (!isLoading) {
        setForm({
          ...form,
          ...getPurchaseEditDetails,
        });
        setSelectedProducts(getPurchaseEditDetails?.parts);
        const documents = getPurchaseEditDetails?.documents || [];
        setFileNames(documents?.map((doc) => doc.doc_name) || []);
        setSelectedFiles(documents?.map((doc) => doc.doc_name) || []);
        setSelectedFilesBase64(documents?.map((doc) => doc.doc_body) || []);
        setSelectedStatusop(getPurchaseEditDetails?.status);
        const updatedPrices = getPurchaseEditDetails?.parts?.map(
          (item) => parseFloat(item.unit_price) || 0
        );
        setCalculatedPrices(updatedPrices);
      }
    }
  }, [getPurchaseEditDetails]);

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
          <h3>
            <img src={arw} alt="" className="me-3" onClick={handleBackButton} />
            {component === "createpo" || component === "singlecomponent"
              ? "Create Purchase Order"
              : "Edit Purchase Order"}
          </h3>
        </div>
        <form onSubmit={onFormSubmit}>
          <div className="content-sec">
            <h4 className="inner-tag">Order Details</h4>
            <Row>
              {component === "createpo" || component === "singlecomponent" ? (
                <Col xs={12} md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Choose Vendor <span className='text-danger' > *</span></Form.Label>
                    <Form.Select
                      name="vendor"
                      value={selectedOption}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Select vendor's</option>
                      {getCategoryOptions()}
                    </Form.Select>
                    {errorInput && (
                      <span style={{ color: "red" }}>{errorInput}</span>
                    )}
                  </Form.Group>
                </Col>
              ) : (
                <Col xs={12} md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vendor Id </Form.Label>
                    <Form.Control
                      name="vendor_id"
                      value={vendor_id}
                      disabled={true}
                    ></Form.Control>
                    {errorInput && (
                      <span style={{ color: "red" }}>{errorInput}</span>
                    )}
                  </Form.Group>
                </Col>
              )}
              {component === "editpo" && statusFeatures && statusFeatures.length > 0 && statusFeatures[0] === "Cancel" ? (
                <Col xs={12} md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      required
                    >
                      <option value="Cancel">Cancel</option>
                    </Form.Select>
                    {errorInput && (
                      <span style={{ color: "red" }}>{errorInput}</span>
                    )}
                  </Form.Group>
                </Col>
              ) : component === "editpo" ? (
                <Col xs={12} md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={selectedStatus || selectedStatusop}
                      onChange={handleStatusChange}
                    >
                      {getStatus()}
                    </Form.Select>
                    {errorInput && (
                      <span style={{ color: "red" }}>{errorInput}</span>
                    )}
                  </Form.Group>
                </Col>
              ) : (
                <Col xs={12} md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status <span className='text-danger' > *</span></Form.Label>
                    <Form.Select
                      name="status"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="PO Generated">PO Generated</option>
                      <option value="PO Issued">PO Issued</option>
                    </Form.Select>
                    {errorInput && (
                      <span style={{ color: "red" }}>{errorInput}</span>
                    )}
                  </Form.Group>
                </Col>
              )}

              {component === "editpo" ? (
                <>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ordered Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="order_id"
                        value={form.order_id}
                        onChange={(e) => onUpdateField(e)}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ordered date</Form.Label>
                      <Form.Control
                        type="text"
                        name="order_date"
                        value={form.order_date}
                        onChange={(e) => onUpdateField(e)}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                </>
              ) : (
                <></>
              )}
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Against PO <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="against_po"
                    value={form.against_po}
                    onChange={(e) => onUpdateField(e)}
                    disabled={
                      component === "createpo" ||
                        component === "singlecomponent"
                        ? false
                        : true
                    }
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Delivery End Date <span className='text-danger' >*</span></Form.Label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    required={true}
                    dateFormat="yyyy-MM-dd"
                    name="deo"
                    value={form.deo}
                    className="form-control"
                    onFocus={(e) => (e.target.readOnly = true)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="inner-tag mt-3">Contact Info</h4>

            <Row>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Ordered By <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="ordered_by"
                    value={form.ordered_by}
                    onChange={(e) => onUpdateField(e)}
                    placeholder=""
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact ( Ordered by ) <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="ordered_by_contact"
                    pattern="[0-9]*"
                    value={form.ordered_by_contact?.replace(/\D/g, "")}
                    onChange={(e) => onUpdateField(e)}
                    minLength={10}
                    maxLength={10}
                    placeholder=""
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="receiver"
                    value={form.receiver}
                    onChange={(e) => onUpdateField(e)}
                    placeholder=""
                    required={true}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact ( Receiver ) <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="receiver_contact"
                    value={form?.receiver_contact?.replace(/\D/g, "")}
                    pattern="[0-9]*"
                    minLength={10}
                    maxLength={10}
                    onChange={(e) => onUpdateField(e)}
                    placeholder=""
                    required={true}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="inner-tag mt-4">Address</h4>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Billing Address <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="billing_address"
                    value={form?.billing_address}
                    onChange={onUpdateField}
                    maxLength={500}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Shipping Address <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shipping_address"
                    value={form?.shipping_address}
                    onChange={onUpdateField}
                    maxLength={500}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="inner-tag mt-4">Other Info</h4>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Terms & Conditions <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="terms_and_conditions"
                    value={form?.terms_and_conditions}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Terms <span className='text-danger' > *</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="payment_terms"
                    value={form?.payment_terms}
                    onChange={onUpdateField}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h3 className="inner-tag mt-4">Documents</h3>
            {showFileTypeError && (
              <Toast show={showToast} onClose={handleCloseToast}>
                <Toast.Header closeButton={false}>
                  <strong className="me-auto" style={{ color: "red" }}>
                    File Type Error
                  </strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
              </Toast>
            )}
            <Row className="main-div-attach">
              <Col xs={12} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Attach Documents</Form.Label>

                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      id="upload"
                      hidden
                      multiple
                      onChange={handlePdfChange}
                    />

                    <label for="upload" className="cfile">
                      <img src={attachment} alt="" />
                    </label>
                  </div>
                </Form.Group>
              </Col>

              {selectedFiles.map((file, index) => (
                <Col xs={12} md={3} key={index}>
                  <Form.Group>
                    <div className="attachment-sec">
                      <span className="attachment-name">
                        {fileNames[index]}
                      </span>
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

              {component !== "singlecomponent" ? (
                <div className="d-flex justify-content-end align-center d-flex-mobile-align">
                  <div className="position-relative">
                    <InputGroup
                      className="mb-0 search-add search-add-align"
                      ref={searchComponentRef}
                    >
                      <Form.Control
                        placeholder="Search components"
                        aria-label="Search components"
                        aria-describedby="basic-addon2"
                        type="search"
                        value={searchTermvalue.trimStart()}
                        onChange={handleSearchComponent}
                        onKeyDown={handleKeyPress}
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
                      {filteredData ? (
                        filteredData?.map((item, index) => (
                          <li key={index} onClick={() => handleItemClick(item)}>
                            {/* {item[0].join(" , ")} */}
                            {/* {item[0]?.[1]} */}
                            {item[0].slice(1).join(" , ")}
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <div>
                              <Spinner
                                animation="border"
                                role="status"
                                variant="dark"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Row>

            {component !== "singlecomponent" ? (
              <div className="table-responsive mt-4">
                <h5 className="inner-tag">Adding products to purchase list</h5>
                <Table className="bg-header">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Manufacturer Part No</th>
                      <th>Part Name</th>
                      <th>Description</th>
                      {/* <th>Packaging</th> */}
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Price per piece</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData?.length > 0 ? (
                      selectedData?.map((product, rowIndex) => (
                        <tr key={product.mfr_prt_num}>
                          <td>{rowIndex + 1}</td>
                          <td>{product?.mfr_prt_num}</td>
                          <td>{product?.prdt_name}</td>
                          <td>{product?.description}</td>
                          {/* <td>
                            {product?.packaging ? product?.packaging : "-"}
                          </td> */}
                          <td>
                            {" "}
                            <input
                              type="text"
                              className="input-50"
                              min={1}
                              value={product.qty}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              onChange={(e) =>
                                handleQtyPerBoardChange(
                                  e.target.value,
                                  rowIndex
                                )
                              }
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-50"
                              min={1}
                              value={product?.price}
                              pattern="^\d+(\.\d+)?$"
                              step="any"
                              onChange={(e) =>
                                handlePriceChange(e.target.value, rowIndex)
                              }
                              required={true}
                            />
                          </td>

                          <td>
                            {calculatedPrices[rowIndex] !== undefined
                              ? calculatedPrices[rowIndex]
                              : "-"}
                          </td>

                          {/* <td
                            onClick={() =>
                              deleterow(rowIndex, product.mfr_prt_num)
                            }
                          >
                            <img src={Delete} />
                          </td> */}
                          <td onClick={() => openDeleteModal(rowIndex, product.department)}>
                            <img src={Delete} alt="Delete Icon" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td colSpan="11" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{totalQtyPerBoard}</td>
                      <td>{totalUnitPrice}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            ) : (
              <div className="table-responsive mt-4">
                <h5 className="inner-tag">Adding products to purchase list</h5>
                <Table className="bg-header">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Manufacturer part No</th>
                      <th>Part Name</th>
                      <th>Description</th>
                      {/* <th>Packaging</th> */}
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Price Per Piece</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedData?.length > 0 ? (
                      selectedData?.map((product, rowIndex) => (
                        <tr key={product.mfr_prt_num}>
                          <td>{rowIndex + 1}</td>
                          <td>{product?.mfr_prt_num}</td>
                          <td>{product?.prdt_name}</td>
                          <td>{product?.description}</td>
                          {/* <td>
                            {product?.packaging ? product?.packaging : "-"}
                          </td> */}
                          <td>
                            {" "}
                            <input
                              type="text"
                              className="input-50"
                              min={1}
                              value={product.qty}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/[^0-9]/g, "")
                                  .toString();
                              }}
                              onChange={(e) =>
                                handleQtyPerBoardChange(
                                  e.target.value,
                                  rowIndex
                                )
                              }
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input-50"
                              min={0}
                              value={product?.price}
                              onChange={(e) =>
                                handlePriceChange(e.target.value, rowIndex)
                              }
                              required={true}
                            />
                          </td>

                          <td>
                            {calculatedPrices[rowIndex] !== undefined
                              ? calculatedPrices[rowIndex]
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td colSpan="11" className="text-center">
                            No Data Available
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{totalQtyPerBoard}</td>
                      <td>{totalUnitPrice}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            )}
          </div>

          <div className="mt-3 d-flex justify-content-end mt-2 pb-3">
            <Button
              type="button"
              className="cancel me-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="submit">
              {component === "createpo" || component === "singlecomponent"
                ? "Create"
                : "Update"}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-backdrop">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}


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
      />
    </>
  );
};

export default CreatePurchase;
