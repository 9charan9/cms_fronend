
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getClientOrderDetails, selectClientDetails, selectLoadingState, selectGetFinalProduct, getFinalProductsDetails } from '../slice/ClientSlice'
import { tableContent } from '../../../utils/TableContent'
import { getclassificationofPartsQauntityAPI } from '../../inventory/slice/InventorySlice'
import { original } from '@reduxjs/toolkit'
import { useRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import { MdCancel } from 'react-icons/md'
import { Model } from 'ckeditor5/src/engine'






const ClientOrderPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef()
  const [key, setKey] = useState("");
  const [filteredProductKeys, setFilteredProductKeys] = useState([]);
  const [changeStatus, setStatusChange] = useState("")
  const [ShowModel, setShowModel] = useState(false)
  const [StatusAll, setStatusAll] = useState("")
  const [isCheckedbox, setIsCheckedbox] = useState(true);
  const isLoading = useSelector(selectLoadingState)
  const clientDetails = useSelector(selectClientDetails)
  const getClientData = clientDetails?.body

  const { bom_id, po_id } = location.state || {};

  const [selectedProducts, setSelectedProducts] = useState({});
  //console.log(JSON.stringify(selectedProducts, null, 2));
  const [getClientDetails, setGetClientDetails] = useState({});
  // console.log(JSON.stringify(getClientDetails.kits[0], null, 2));

  // console.log(getClientDetails?.kits)
  // const getStateLocation = location.state
  ////console.log(getStateLocation)

  useEffect(() => {
    const request = {
      "env_type": "Development",
      "bom_id": bom_id,
      "po_id": po_id
    }
    dispatch(getClientOrderDetails(request))
    setKey("FinalProductBatch1")
  }, [dispatch])

  useEffect(() => {
    const prevIousActivekey = localStorage.getItem("clientOrderPage") || "Final_product_batch1";
    setKey(prevIousActivekey)
  }, [key])
  useEffect(() => {
    if (clientDetails?.statusCode === 200) {
      setGetClientDetails(getClientData);
      if (typeof clientDetails === "object" && getClientData !== undefined || getClientData !== null)
        setKey(Object.keys(getClientData?.kits)[0] || "")
    }
  }, [getClientData]);
  // console.log(getClientData?.statusCode);

  const [checked, setChecked] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false)

  const filtereData = (kitKey) => {
    //console.log(kitKey)
    return Object.keys(getClientData[kitKey] || {});
  }

  const [selectedItems, setSelectedItems] = useState({});
  //console.log(JSON.stringify(selectedItems, null, 2));
  const [selectAll, setSelectAll] = useState(false)
  ////console.log(selectAll);



  //  const handleAllBox = (e,productData) => {
  //       const isChecked = e.target.checked
  //       //console.log(productData)
  //       const allSelected = Object.keys(getClientDetails?.kits[productData]).every(
  //         (product) => selectedProducts[product]
  //       );

  //       setSelectedProducts((prevSelectedProducts) => {
  //         const newSelectedProducts = { ...prevSelectedProducts };
  //         Object.keys(getClientData?.kits[productData]).forEach((product) => {
  //           if (allSelected) {
  //             delete newSelectedProducts[product];
  //           } else {
  //             newSelectedProducts[product] = getClientData?.kits[productData][product];
  //           }
  //         });
  //         return newSelectedProducts;
  //       });
  //       //console.log(allSelected)

  //       const productKeys = Object.keys(getClientData?.kits[productData] || {})

  //       setSelectAllChecked(prevState => ({
  //         ...prevState,
  //         [productData] : isChecked
  //       }))

  //       const newSelectedItems = productKeys.reduce((acc, key) => {
  //         acc[key] = isChecked;
  //         return acc;
  //       }, {});
  //       setSelectedItems(prevState => ({
  //         ...prevState,
  //         [productData] : newSelectedItems
  //       }))

  //       //console.log(selectedItems)
  //       //console.log(selectAllChecked)

  //       // //console.log(kitKey)
  //       // const ischecked = e.target.checked;
  //       // const updatedChecked = {...checked};
  //       // const updatedSelectAllChecked = {...selectAllChecked};

  //       // if(ischecked){
  //       //   updatedSelectAllChecked[kitKey] = true;
  //       //   const allItems = filtereData(kitKey)
  //       //   .filter((boardKey) => boardKey !== "status")
  //       //   .map((boardKey,index) => ({
  //       //     data : getClientData?.[kitKey][boardKey],
  //       //     originaIndex : index,
  //       //   }));
  //       //   updatedChecked[kitKey] = allItems;
  //       //   //console.log(allItems)
  //       // }
  //       // else {
  //       //   updatedSelectAllChecked[kitKey] = false;
  //       //   updatedChecked[kitKey] = {}
  //       // }
  //       // setChecked(updatedChecked)
  //       // setSelectAllChecked(updatedSelectAllChecked)
  //       // //console.log(checked)
  //       // //console.log(selectAllChecked)

  //     };
// console.log(StatusAll)
  const handleRadio = (e) => {
    setStatusAll(e.target.value)
    if (e.target.value === "Received" || e.target.value === "Product Rejected") {
      setShowModel(true)
    }
    else {
      setShowModel(false)
    }

  }

  const handleClose = () => setShowModel(false)

  const handleTabChange = (tab) => {
    localStorage.setItem("clientOrderPage", tab);
    setKey(tab)
  }

  // console.log(checked)
  const handleCheckBox = (e, item, kitKey, productKey) => {
    const isChecked = e.target.checked;
    const updatedChecked = { ...checked };

    if (!updatedChecked[kitKey]) {
      updatedChecked[kitKey] = {}
    }
    if (isChecked) {
      setIsCheckedbox(!isChecked);
      updatedChecked[kitKey][productKey] = { ...item }
    }
    else {
      setIsCheckedbox(true);
      delete updatedChecked[kitKey][productKey];

      if (Object.keys(updatedChecked[kitKey])?.length === 0) {
        delete updatedChecked[kitKey];
      }
    }
    setChecked(updatedChecked)
    setSelectAllChecked(prevState => ({
      ...prevState,
      [kitKey]: Object.keys(updatedChecked[kitKey] || {}).length === filtereData(kitKey).length
    }));
  }

  const handleSelectAll = (e, kitKey, productKeys) => {
    const isChecked = e.target.checked;
    const updatedChecked = { ...checked };
    if (isChecked) {
      updatedChecked[kitKey] = {};
      productKeys.forEach(productKey => {
        const item = getClientDetails?.kits[kitKey][productKey];
        if (!item?.status_checked) {
          updatedChecked[kitKey][productKey] = { ...item };
        }
      });
    } else {
      delete updatedChecked[kitKey];
    }

    setChecked(updatedChecked);
    setSelectAllChecked(prevState => ({
      ...prevState,
      [kitKey]: isChecked
    }));
  };
  //console.log(JSON.stringify(checked, null, 2));

// console.log(StatusAll)
  const handleStatusChange = async (e, productData, productKeys) => {
    //console.log(StatusAll)
    const { value } = e.target
    setStatusChange(value);
    //console.log(changeStatus)
    //  let updatedChecked = {...checked};
    if (selectAll !== "") {
      await updateStatus(checked, value);
      // console.log(checked)
      let mergedData = await mergeData({ ...getClientDetails?.kits }, checked);
      //console.log(JSON.stringify(mergedData, null, 2))
      setGetClientDetails(prevState => ({
        ...prevState,
        kits: mergedData
      })); 

      let reqObj = {
        status: StatusAll,
        kits: checked
      };

      // console.log(reqObj)
      dispatch(getFinalProductsDetails(reqObj)).then((res) => {
        if (res.payload.statusCode === 200) {
          const request = {

            "env_type": "Development",
            "bom_id": bom_id,
            "po_id": po_id
          }
          dispatch(getClientOrderDetails(request))
          setChecked({});
          setShowModel(false)
        }
        else {
          return;
        }
      })
    }
  }

  const updateStatus = (obj, newStatus) => {
    //console.log(obj)
    //console.log(newStatus)
    for (const batch in obj) {
      for (const product in obj[batch]) {
        obj[batch][product].status = newStatus;
      }
    }

    return obj;
  }

  const mergeData = (oldData, newData) => {
    const mergedData = JSON.parse(JSON.stringify(oldData));
    for (const batch in newData) {
      // console.log(batch)
      if (!mergedData[batch]) {
        mergedData[batch] = {};
      }
      for (const product in newData[batch]) {
        mergedData[batch][product] = { ...mergedData[batch][product], ...newData[batch][product] };
      }
    }
    return mergedData;
  };


  const renderTabContent = (productData) => {
    const productKeys = Object.keys(getClientDetails?.kits[productData] || {})
    // console.log(productKeys)
    const filteredProductKeys = productKeys.filter(key => key !== "status");

    if (filteredProductKeys.length === 0) {
      return <p> No data available</p>
    }

    return (
      <>

        <Modal show={ShowModel} centered className="sm-modal">
          <div className="text-center py-3">

            <h6 className='mb-3'>Are you sure you want to change status? </h6>

            <Button className='btn cancel me-2' onClick={handleClose}>NO</Button>
            <Button className='submit submit-min' onClick={handleStatusChange}>Yes</Button>
          </div>

        </Modal>

        <div className='table-responsive' style={{ textAlign: 'right' }}>
          <div>
            <input type='radio' name='status' id='recived' value="Received" style={{ marginRight: '5px' }} disabled={isCheckedbox} onChange={handleRadio} />
            <label htmlFor='recived'>Received</label>
            <input type='radio' name='status' id='reject' value="Product Rejected" style={{ marginRight: '5px', marginLeft: "5px" }} disabled={isCheckedbox} onChange={handleRadio} />
            <label htmlFor='reject' >Reject</label>
          </div>
          {/* <div >
          <select onChange={(e) => handleStatusChange(e)} className='form-select w-auto mb-3'>
            <option value="">Select</option>
            <option value="Received" >Received</option>
            <option value="ProductRejected">Rejected</option>
          </select>
        </div> */}

          <Table className='bg-header'>
            <thead>
              <tr >
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e, productData, filteredProductKeys)}
                    checked={selectAllChecked[productData] || false}
                  />
                </th>

                <th> S.No </th>
                <th> PRODUCT ID </th>
                <th> PCBA ID</th>
                <th> ALS ID </th>
                <th> DISPLAY NUMBER </th>
                <th> SOMID & IMEI 1,2 ID </th>
                <th> E-SIM NO </th>
                <th> E-SIM ID </th>
                <th>  DATE OF EMS </th>
                <th>   ICT </th>
                <th>  FCT </th>
                <th>  EOL  </th>
                <th>  DATE OF EOL </th>
                <th> EOL DOCUMENT  </th>
                <th>  STATUS </th>
              </tr>
            </thead>
            <tbody>
              {filteredProductKeys.length !== 0 ? filteredProductKeys?.map((productKey, index) => {
                const item = getClientDetails?.kits[productData][productKey];
                // console.log(item)
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type='checkbox'
                        onChange={(e) => handleCheckBox(e, item, productData, productKey)}
                        checked={item?.status_checked || checked[productData]?.[productKey] ? true : false}
                        disabled={item?.status_checked}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{item["product_id"]}</td>
                    <td>{item["pcba_id"]}</td>
                    <td>{item["als_id"]}</td>
                    <td>{item["display_number"]}</td>
                    <td>{item["som_id_imei_id"]}</td>
                    <td>{item["e_sim_no"]}</td>
                    <td>{item["e_sim_id"]}</td>
                    <td>{item["date_of_ems"]}</td>
                    <td>{item["ict"]}</td>
                    <td>{item["fct"]}</td>
                    <td>{item["eol"]}</td>
                    <td>{item["date_of_eol"]}</td>
                    <td><a href={item?.eol_document?.doc_url} className='linka'>{item["eol_document"]["doc_name"]}</a></td>
                    <td>{item["status"]}</td>
                  </tr>

                );
              }) : (
                <tr>
                  <td>NO Data</td>
                </tr>
              )}
            </tbody>

          </Table>
        </div>
      </>
    )

  }


  return (
    <>
      <div className="wrap">
        <div className="d-flex justify-content-between position-relative d-flex-mobile">
          <div className="d-flex align-items-center">
            <h1 className="title-tag mb-0">
              <FaArrowLeft className="me-3 fs-4" onClick={() => navigate(-1)} /> <span className="fs-3">CLIENT - A</span>

              {/* <img
                      
                        // src={arw}
                        alt=""
                        className="me-3"
                        // onClick={() => navigate(-1)}
                      /> */}
              {/* {VendorcatDetailsdata?.vendor_name} */}
            </h1>
            {/* <div className="ms-3">
                      <VendorRating
                        rating={VendorcatDetailsdata?.vendor_rating}
                        vendorId={VendorcatDetailsdata?.vendor_id}
                        vendorName={VendorcatDetailsdata?.vendor_name}
                      />
                  </div> */}
          </div>
          <div className="mobilemargin-top">
            {/* <Button
                  className="submit me-2 md-me-2 submitmobile"
                  // onClick={routeGeneratepo}
                  // disabled={!isAnyCheckboxSelected || isPOGenerated || generatePOButtonDisabled}
                >
                   Download Details
                </Button> */}
            {/* <Button
                  className="submit me-2 md-me-2 submitmobile"
                  // onClick={downloadpdf}
                >
                 Edit
                </Button> */}

          </div>
        </div>

        <Row>
          <Col xs={12} md={4}>
            {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Vendor ID : {VendorcatDetailsdata?.vendor_id}
            </h5> */}
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Client ID : {getClientDetails?.client_id}
            </h5>
            <h5 className="bomtag mb-2 text-667 font-500">
              Client Name : {getClientDetails?.client_name}
            </h5>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Reciver Name :  {getClientDetails?.receiver_name}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500 ">
              Reciver Contact: {getClientDetails?.receiver_contact}
            </h5>
            {/* <h5 className="bomtag mb-2 text-667 font-500">
              Client Contact : 20097642123
            </h5> */}

            {/* <h5 className="bomtag text-667 font-500">
              Address : {VendorcatDetailsdata?.address1},{VendorcatDetailsdata?.address2}, {VendorcatDetailsdata?.landmark}, {VendorcatDetailsdata?.pin_code},
              {VendorcatDetailsdata?.city_name},{VendorcatDetailsdata?.state},{VendorcatDetailsdata?.country}
            </h5> */}
            {/* <h5 className="bomtag text-667 font-500">
              Address : {
                [
                  // VendorcatDetailsdata?.address1,
                  // VendorcatDetailsdata?.address2,
                  // VendorcatDetailsdata?.landmark,
                  // VendorcatDetailsdata?.pin_code,
                  // VendorcatDetailsdata?.city_name,
                  // VendorcatDetailsdata?.state,
                  // VendorcatDetailsdata?.country
                ]
                  // .filter(value => value !== undefined && value !== '' && value !== 'NA' && value !== 'na' && value !=='-' && value !=='Nill' && value !=='nill' && value !=='NILL')
                  // .join(', ')
              }
            </h5> */}
          </Col>

          <Col xs={12} md={4}>
            {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">
                Reciver Name :  {getClientDetails?.receiver_name}
                </h5>
                <h5 className="mb-2 bomtag text-667 font-500 ">
                 Reciver Contact: {getClientDetails?.receiver_contact}
                </h5> */}
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              Sender Name : {getClientDetails?.sender_name}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500 ">
              Sender Contact: {getClientDetails?.contact_details}
            </h5>
            <h5 className="mb-2 mt-3 bomtag text-667 font-500">
              QUANTITY :  {getClientDetails?.quantity}
            </h5>
            {/* <h5 className="mb-2 bomtag text-667 font-500 ">
                 PDF OF PO :  0123456789
                </h5> */}
            {/* <h5 className="mb-2 bomtag text-667 font-500">
                  State : {VendorcatDetailsdata?.state}
                </h5> */}
            {/* <h5 className="mb-2 bomtag text-667 font-500"> Location : </h5> */}
          </Col>

          <Col xs={12} md={4} className='mt-3'>
            {/* <h5 className="mb-2 mt-3 bomtag text-667 font-500">
                QUANTITY :  {getClientDetails?.quantity}
                </h5> */}
            <h5 className="mb-2 bomtag text-667 font-500 ">
              SHIPPING ADDRESS :  {getClientDetails?.ship_to}
            </h5>
            <h5 className="mb-2 bomtag text-667 font-500 ">
              DeliveryEndDate :  {getClientDetails?.delivery_end_date}
            </h5>
            {/* <h5 className="mb-2 bomtag text-667 font-500">
                  State : {VendorcatDetailsdata?.state}
                </h5> */}
            {/* <h5 className="mb-2 bomtag text-667 font-500"> Location : </h5> */}
          </Col>
        </Row>

        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center">
            <div className="partno-sec vendorpartno-sec">
              <div className="tab-sec">
                <Tabs
                  id='controlled-tab-example'
                  activeKey={key}
                  onSelect={handleTabChange}
                >
                  {typeof getClientDetails?.kits === "object" ? (
                    Object.keys(getClientDetails?.kits)?.map((productData, index) => (

                      <Tab
                        eventKey={productData}
                        title={productData.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/ /g, '-')}
                      >
                        {renderTabContent(productData)}
                      </Tab>

                    ))
                  ) : (
                    <>
                    </>
                  )}
                </Tabs>

              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default ClientOrderPage


