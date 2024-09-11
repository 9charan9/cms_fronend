import "./App.css";
import "./index.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AddComponent from "./features/component/pages/AddComponent";
import Components from "./features/component/pages/Components";
import Vendors from "./features/coming_soon/Vendors";
import PurchaseOrders from "./features/coming_soon/PurchaseOrders";
import Bom from "./features/coming_soon/Bom";
import Returns from "./features/coming_soon/Returns";
import Settings from "./features/coming_soon/Settings";
import Products from "./features/component/pages/Products";
import EditComponent from "./features/component/pages/EditComponent";
import ProductDetails from "./features/component/pages/ProductDetails";
import BomDetails from "./features/bom/pages/BomDetails";
import AddBom from "./features/bom/pages/AddBom";
import EditBom from "./features/bom/pages/EditBom";
import BomListDetails from "./features/bom/pages/BomListDetails";
import OriginalpartnoDetails from "./features/bom/pages/OriginalpartnoDetails";
import PtgnoDetails from "./features/bom/pages/PtgnoDetails";
import EstimateMaterial from "./features/bom/pages/EstimateMaterial";
import AssignBom from "./features/bom/pages/AssignBom";
import AddCategory from "./features/component/pages/AddCategory";
import Editcategory from "./features/component/pages/Editcategory";
import VendorsList from "./features/vendors/pages/VendorsList";
import CreateVendor from "./features/vendors/pages/CreateVendor";
import VendorsDetails from "./features/vendors/pages/VendorsDetails";
import EditVendor from "./features/vendors/pages/EditVendor";
import PurchaseList from "./features/purchaseorders/pages/PurchaseList";
import PurchaseOrdersDetails from "./features/purchaseorders/pages/PurchaseOrdersDetails";
import PLPODetails from "./features/purchaseorders/pages/PurchaseListPoDetails";
import PRPODetails from "./features/purchaseorders/pages/PurchaseReturnPODetails";
import CPODetails from "./features/purchaseorders/pages/CreatedPODetails";
import EditPurchaseReturn from "./features/purchaseorders/pages/EditPurchaseReturn";
import EditPurchaseOrder from "./features/purchaseorders/pages/EditPurchaseOrders";
import GateEntry from "./features/purchaseorders/pages/GateEntry";
import InwardPurchaseStep2 from "./features/purchaseorders/pages/Qatest";
import InwardPurchaseStep3 from "./features/purchaseorders/pages/InwardPurchase";
import CreatePurchase from "./features/purchaseorders/pages/CreatePurchase";
import ReturnPurchase from "./features/purchaseorders/pages/ReturnPurchase";
import ProductDetailsMech from "./features/component/pages/ProductDetailsMech";
import ElectricComponent from "./features/component/pages/ElectricComponent";
import MechanicComponent from "./features/component/pages/MechanicComponent";
import MechanicEditCategory from "./features/component/pages/MechanicEditCategory";
import MechanicalProducts from "./features/component/pages/MechanicalProducts";
import EditMechanicalComponent from "./features/component/pages/EditMechanicalComponent";
import VendorsPartenerDetails from "./features/vendors/pages/VendorsPartenerDetails";
import CloneBom from "./features/bom/pages/CloneBom";
import ClientList from "./features/clients/pages/ClientList";
import CreateClient from "./features/clients/pages/CreateClient";
import ClientDetails from "./features/clients/pages/ClientDetails";
import GeneratePo from "./features/vendors/pages/GeneratePo";
import Outwardinnerpage from "./features/bom/pages/OutwardInnerpage";
import CategoryInfo from "./features/bom/pages/CategoryInfo"
import SendKit from "./features/bom/pages/SendKit";
import OrdersInnerDetails from "./features/vendors/pages/OrdersInnerDetails";
import PurchaseLiastDetails from "./features/purchaseorders/pages/PurchaseLiastDetails";
import AssigntoClient from "./features/bom/pages/AssigntoClient";
import ProductionLineTab from "./features/vendors/pages/ProductionLineTab";
import SendBoards from "./features/vendors/pages/SendBoards";
import BoardsInfo from "./features/vendors/pages/BoardsInfo";
import BoxBuildingInfo from "./features/bom/pages/BoxBuildingInfo";
import AssignToBoxBuilding from "./features/bom/pages/AssignToBoxBuilding";
import BomBoardsInfo from "./features/bom/pages/BomBoardsInfo";
import Login from "./components/Login";
import { localData } from "./utils/storage";
import VendorBoxBuildingInfo from "./features/vendors/pages/VendorBoxBuildingInfo";
import Inventory from "./features/inventory/pages/Inventory";
import InventoryStock from "./features/inventory/pages/InventoryStock";
import { logout } from "./services/AWSService";
import Uploadpdf from "./features/clients/pages/Uploadpdf";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Upload from "./features/clients/pages/Upload";
import SalespurchaseList from "./features/purchasesales/pages/SalespurchaseList";
import SalespurchaseListDetails from "./features/purchasesales/pages/SalespurchaseListDetails";
import ForecastPo from "./features/forecastpo/pages/ForecastPo";
import QuotationsListDetails from "./features/purchasesales/pages/QuotationsListDetails";
import ApprovalsListDetails from "./features/purchasesales/pages/ApprovalsListDetails";
import ForecastPoDetails from "./features/purchasesales/pages/ForecastPoDetails";
import PoReturn from "./features/forecastpo/pages/PoReturn";
import PoForm from "./features/forecastpo/pages/PoForm";
import ServiceOrder from "./features/forecastpo/pages/ServiceOrder";
import Invoice from "./features/forecastpo/pages/Invoice";
import ProformaInvoice from "./features/forecastpo/pages/ProformaInvoice";
import ClientPo from "./features/forecastpo/pages/ClientPo";
import { useIdleTimer } from "react-idle-timer";
import EditForm from "./features/forecastpo/pages/EditPoForm";
import { PDFViewer } from "@react-pdf/renderer";
import Quixote from "./components/PDF";
import EditProformaInvoice from "./features/forecastpo/pages/EditProformaInvoice";
import EditInvoice from "./features/forecastpo/pages/EditInvoice";
import EditClientPO from "./features/forecastpo/pages/EditClientPo";
import NotFound from "./components/NotFound";
import EditServiceOrder from "./features/forecastpo/pages/editServiceOrder";
import ClientOrderPage from "./features/clients/pages/ClientOrderPage";
import Roles from "./features/settings/pages/Roles";
import Uploadfolder from "./features/clients/pages/Uploadfolder";
import Uploadfun from "./features/clients/pages/Uploadfun";
import InnerdetailsList from "./features/purchasesales/pages/InnerdetailsList";
import GateEnteryInnerDetailsList from "./features/purchasesales/pages/GateEnteryInnerDetailsList";
import EditPermissions from "./features/settings/pages/EditPermissions";



function App() {
  const token = localData.get("TOKEN");
  const [loggedOut, setLoggedOut] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
      localStorage.getItem('loggedIn') === 'true'
  );

  useEffect(() => {
      const handleStorageChange = () => {
          setLoggedIn(localStorage.getItem('loggedIn') === 'true');
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };
  }, []);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      toast.success("You're Online");
      setIsOnline(true) 
    };
    const handleOffline = async () => {
      await toast.error(" Please check your internet connection");
      setIsOnline(false);
    }
  
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    console.log("Check Network Connection ======> ", isOnline);

  
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };

  }, [isOnline]);
  
  if (!isOnline) {
    return <div className="p-5" style={{backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
    <center>
      <h2 style={{color: '#ff0000', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'}}>
        You are offline. Please check your internet connection.
      </h2>
    </center>
  </div>
  }

  const handleLogout = () => {
      setLoggedOut(true);
      localStorage.clear();
      return <Login />;
  };

  if (!token || loggedOut) {
      return <Login />;
  }

  if (!loggedOut && !token) {
      return <Login />
  }  
  return (
    <> 
      <div className="app">
         <div className="sidebar">
         <Sidebar />
         <Header></Header>
       </div>
        <div className="content">
          <Routes>
            <Route path="*" element={<NotFound />}></Route>
            <Route exact path="/" element={<Inventory/>}></Route> 
            <Route exact path="/inventorystock" element={<InventoryStock/>}></Route> 
            <Route exact path="/addcomponent" element={<AddComponent />}></Route>
            <Route exact path="/components" element={<Components />}></Route>
            <Route exact path="/electricalcompo" element={<ElectricComponent />}></Route>
            <Route exact path="/mechcompo" element={<MechanicComponent />}></Route>
            <Route exact path="/bom" element={<Bom />}></Route>
            <Route exact path="/returns" element={<Returns />}></Route>
            <Route exact path="/settings" element={<Settings />}></Route>
            <Route exact path="/products" element={<Products />}></Route>
            <Route exact path="/editcomponent" element={<EditComponent />}></Route>
            <Route exact path="/editMechanicComponent" element={<EditMechanicalComponent />}></Route>
            <Route exact path="/productdetails" element={<ProductDetails />}></Route>
            <Route exact path="/productdetailsmech" element={<ProductDetailsMech />}></Route>
            <Route exact path="/bomdetails" element={<BomDetails />}></Route>
            <Route exact path="/addbom" element={<AddBom />}></Route>
            <Route exact path="/cloneBom" element={<CloneBom />}></Route>
            <Route exact path="/editbom" element={<EditBom />}></Route>
            <Route exact path="/outwardinnerdetails" element={<Outwardinnerpage />}></Route>
            <Route exact path="/categoryinfo" element={<CategoryInfo />}></Route>
            <Route exact path="/boxBuildingInfo" element={<BoxBuildingInfo />}></Route>
            <Route exact path="/boxBuildingInfo" element={<VendorBoxBuildingInfo />}></Route>
            <Route exact path="/assignBoxBuilding" element={<AssignToBoxBuilding />}></Route>
            <Route exact path="/sendkit" element={<SendKit />}></Route>
            <Route exact path="/assigntoclient" element={<AssigntoClient/>}></Route>
            <Route exact path="/bomlistdetails" element={<BomListDetails />}></Route>
            <Route exact path="/partnodetails"  element={<OriginalpartnoDetails />}></Route>
            <Route exact path="/ptgnodetails"   element={<PtgnoDetails />}></Route>
            <Route exact path="/estimatematerial" element={<EstimateMaterial />}></Route>
            <Route exact path="/assignbom" element={<AssignBom />}></Route>
            <Route exact path="/addcategory" element={<AddCategory />}></Route>
            <Route exact path="/editcategory" element={<Editcategory />}></Route>
            <Route exact path="/mechanicEditCategory" element={<MechanicEditCategory />}></Route>
            <Route exact path="/vendorslist" element={<VendorsList />}></Route>
            <Route exact path="/createvendor" element={<CreateVendor />}></Route>
            <Route exact path="/vendorsdetails" element={<VendorsDetails />}></Route>
            <Route exact path='/editvendor' element={<EditVendor/>}></Route>
            <Route exact path="/purchaseorders" element={<PurchaseOrdersDetails />}></Route>
            <Route exact path="/purchaselist" element={<PurchaseList />}></Route>
            <Route exact path="/prpodetails" element={<PRPODetails />}></Route>
            <Route exact path="/cpodetails" element={<CPODetails />}></Route>
            <Route exact path="/poListDetails" element={<PurchaseLiastDetails/>}></Route>
            <Route exact path="/editpr" element={<EditPurchaseReturn />}></Route>
            <Route exact path="/editpo" element={<EditPurchaseOrder />}></Route>
            <Route exact path="/createpo" element={<CreatePurchase />}></Route>            
            <Route exact path="/gateEntry" element={<GateEntry />}></Route>
            <Route exact path="/inwardpurchase2"  element={<InwardPurchaseStep2 />}></Route>
            <Route exact path="/inwardpurchase3" element={<InwardPurchaseStep3 />}></Route>
            <Route exact path="/mechanicalproducts" element={<MechanicalProducts/>}></Route>
            <Route exact path="/vendorpartnersdetails" element={<VendorsPartenerDetails/>} ></Route>
            <Route exact path="/clients" element={<ClientList/>}></Route>
            <Route path="/createclient" element={<CreateClient isEdit={false} />} />
            <Route path="/editclient" element={<CreateClient isEdit={true} />} />
            <Route exact path="/clientdetails" element={<ClientDetails/>}></Route>
            <Route exact path="/generatepo" element={<GeneratePo/>}></Route>
            <Route exact path="/ordersinnerDetails" element={<OrdersInnerDetails />}></Route>
            <Route exact path="/returnpo" element={<ReturnPurchase isEdit={false}/>}></Route>
            <Route exact path="/editreturnpo" element={<ReturnPurchase isEdit={true}/>}></Route>
            <Route exact path="/productionline" element={<ProductionLineTab />}></Route>  
            <Route exact path="/sendboards" element={<SendBoards/>}></Route>
            <Route exact path="/boardsinfo" element={<BoardsInfo/>}></Route>
            <Route exact path="/bomboardsinfo" element={<BomBoardsInfo/>}></Route>
            <Route exact path='/uploadpdf' element={<Uploadpdf/>}></Route>
            <Route exact path='/upload' element={<Upload/>}></Route>
            <Route exact path='/salespurchase' element={<SalespurchaseList/>}></Route>
            <Route exact path='/salespurchaselistdetails' element={<SalespurchaseListDetails/>}></Route>            
            <Route exact path='/forecastpo' element={<ForecastPo isEdit={false} />}></Route>
            <Route exact path='/editforecastpo' element={<ForecastPo isEdit={true} />}></Route>
            <Route exact path='/quotationslistdetails' element={<QuotationsListDetails/>}></Route>
            <Route exact path='/approvalslistdetails' element={<ApprovalsListDetails/>}></Route>
            <Route exact path='/forecastpoDetails' element={<ForecastPoDetails/>}></Route>
            <Route exact path='/poreturn' element={<PoReturn/>}></Route>
            <Route exact path='/poform' element={<PoForm/>}></Route>
            <Route exact path='/serviceorder' element={<ServiceOrder/>}></Route>
            <Route exact path='/invoice' element={<Invoice/>}></Route>
            <Route exact path='/proformainvoice' element={<ProformaInvoice/>}></Route>
            <Route exact path='/clientpo' element={<ClientPo/>}></Route>
            <Route exact path="/editPoForm" element = {<EditForm/>}></Route>
            <Route exact path='/editproformainvoice' element={<EditProformaInvoice/>}></Route>
            <Route exact path='/editinvoice' element={<EditInvoice/>}></Route>
            <Route exact path='/editclientpo' element={<EditClientPO/>}></Route>
            <Route exact path ="/EditServiceOrder" element = {<EditServiceOrder/>}></Route>
            <Route exact path="/clientOrderPage" element={<ClientOrderPage/>}></Route>
            <Route exact path="/roles" element={<Roles/>}></Route>
            <Route exact path="/uploadfolder" element={<Uploadfolder/>}></Route>
            <Route exact path="/uploadfun" element={<Uploadfun/>}></Route>
            <Route exact path='/innerdetailslist' element={<InnerdetailsList/>}></Route>
            <Route exact path="/innerDetailsListGateEntery" element = {<GateEnteryInnerDetailsList/>}></Route>
            <Route exact path="/editpermissions" element = {<EditPermissions/>}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
