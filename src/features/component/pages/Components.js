import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import "../styles/Components.css";
import "react-toastify/ReactToastify.min.css";
import { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import ElectricComponent from "./ElectricComponent";
import MechanicComponent from "./MechanicComponent";
import { selectedGlobalSearch, globalSearch } from "../slice/ComponentSlice";
import { useDispatch, useSelector } from "react-redux";
import InputGroup from "react-bootstrap/InputGroup";
import crossimg from "../../../assets/Images/crossimg.png"
import { envtypekey } from "../../../utils/common";

const Components = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchTermvalue, setSearchTermvalue] = useState("");
  // const [filteredData, setFilteredData] = useState([]);
  const queryParams = queryString.parse(location.search);
  const [key, setKey] = useState(queryParams.tab || "electricComponent");
  useEffect(() => {
    navigate(`?tab=${key}`);
  }, [key, navigate]);
  const searchContainerRef = useRef(null);
  const globalsearchdata = useSelector(selectedGlobalSearch);
  console.log(globalsearchdata, "global dataaaa");
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    if (globalsearchdata?.statusCode === 200) {
      setData(globalsearchdata?.body);
    } else {
      setData([]);
    }
  }, [globalsearchdata]);

  const handleSearch2 = (event) => {
    const searchTerm = event.target.value.trim();
    // setSearchTerm(searchTerm);
    setSearchTermvalue(searchTerm);

    if (searchTerm.trim().length < 2) {
      setData([]);
      return;
    }
    const request = {
      search_query: searchTerm,
      env_type: envtypekey,
    };
    dispatch(globalSearch(request));
    event.target.blur();
  };
  // useEffect(()=>{
  //   setSearchTerm("");
  //   setSearchTermvalue("");
  //   setFilteredData([]);
  //   setData([])
  // }, [navigate])

  const handleclick = (item) => {
    const cmpt_id = item.component_id;
    const department = item.department;
    const ctgr_name = item.ctgr_name;
    console.log(department, "47575757");
    if (department === "Electronic") {
      let path = `/productdetails`;
      navigate(path, {
        state: { details: item, componentName: ctgr_name, cmpt_id: cmpt_id },
      });
    } else if (department === "Mechanic") {
      let path = `/productdetailsmech`;
      navigate(path, {
        state: { details: item, componentName: ctgr_name, cmpt_id: cmpt_id },
      });
    } else {
      const vendor_id = item.vendor_id
      const vendor_name = item.vendor_name
      console.log(vendor_id, vendor_name)
      let path = `/vendorsdetails`;
      navigate(path, {
        state: {
          details: item,
          type: "Vendor",
          vendor_id:vendor_id,
          vendor_name :vendor_name
        },
      });
    }
    setData([]);
  };

  const handleClear=(e) =>{
    setSearchTermvalue("")
    setData([]);
    e.target.blur();
  }

  useEffect(() => {
    setData([]);
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setData([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };

}, []);

  return (
    <div className="wrap">
      <div className=" search-bar ">
        <div className="position-relative" ref={searchContainerRef}>
          <InputGroup className="mb-0 search-add">
            
            <Form.Control
              placeholder="Search with Component Name and Vendor Name"
              aria-label="earch add BOM's"
              aria-describedby="basic-addon2"
              // type="search"              
              value={searchTermvalue.trimStart()}
              onChange={handleSearch2}              
            />
            {data.length > 0 && ( 
              <img
                src={crossimg}
                className="search_crossimg"
                onClick={(e) => handleClear(e)}
              ></img>
            )}
          </InputGroup>
          <ul className="position-absolute searchul">
            {data &&
              data.length > 0 &&
              data.map((item, index) =>
                item.department === "Electronic" ||
                item.department === "Mechanic" ? (
                  <li key={index} onClick={() => handleclick(item)}>
                  {item.sub_categories} {item.prdt_name}, {item.mfr_prt_num}, {item.manufacturer}
                  </li>
                ) : (
                  <li key={index} onClick={() => handleclick(item)}>
                    {item.vendor_name}, {item.vendor_type}
                  </li>
                )
              )}
          </ul>
        </div>
      </div>
      <div className="mt-5 components">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="electricComponent" title="Electrical Components">
            {key == "electricComponent" ? <ElectricComponent /> : null}
          </Tab>
          <Tab eventKey="mechanicComponent" title="Mechanical Components">
            {key == "mechanicComponent" ? <MechanicComponent /> : null}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Components;
