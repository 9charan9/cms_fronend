import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer, Zoom } from "react-toastify";
import PurchaseList from "./PurchaseList";
import PurchaseReturn from "./PurchaseReturn";
import CreatedPOs from "./CreatedPOs";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const PurchaseOrdersDetails = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [key, setKey] = useState(queryParams.tab || "purchaselist");
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`?tab=${key}`);
  }, [key, navigate]);

  return (
    <>
      <div className="wrap">
        <h1 className="title-tag mb-4 mb-responsive"> Purchase Orders</h1>
        <div className="d-flex justify-content-between position-relative w-100 border-bottom align-items-end d-flex-mobile mt-5">
          <div className="d-flex align-items-center">
            <div className="partno-sec ">
              <div className="tab-sec ms-0 ps-0">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  <Tab eventKey="purchaselist" title="Purchase List">
                    {key == "purchaselist" ? <PurchaseList /> : null}
                 
                  </Tab>
                  <Tab eventKey="purchasereturn" title="Purchase Return">
                    {key == "purchasereturn" ? <PurchaseReturn /> : null}
                  </Tab>
                  <Tab eventKey="createdpos" title="Created PO's">
                    {key == "createdpos" ? <CreatedPOs /> : null}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
          {key == "purchaselist" || key == "createdpos" ? (
            <Button
              variant="outline-dark"
              className="add_new_category mb-2"
              onClick={() => {
                navigate("/createpo", {
                  state: {
                    vendorId: "",
                    orderNo: "",
                    component: "createpo"
                  },
                });
              }}
            >
              Create Purchase
            </Button>
          ) : (
            <Button
              variant="outline-dark"
              className="add_new_category mb-2"
              onClick={() => {
                navigate("/returnpo");
              }}
            >
              Return Purchase
            </Button>
          )}
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
      />
    </>
  );
};

export default PurchaseOrdersDetails;
