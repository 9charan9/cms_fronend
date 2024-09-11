import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/Images/logo.svg";
import "./Sidebar.css";
import Logout from "../assets/Images/logout.svg";
import { useEffect, useState } from "react";
import { logout } from "../services/AWSService";
import { useMsal } from "@azure/msal-react";
const Sidebar = () => {
  const location = useLocation();
  const {instance} = useMsal()
  const [activeMenuItem, setActiveMenuItem] = useState("");

  const getActiveMenuItemFromPathname = (pathname) => {
    if (pathname === "/") {
      return "/inventory";
    }else if (pathname === "/components") {
      return "components";
    }else if (pathname === "/editMechanicComponent") {
      return "components";
    } else if (pathname === "/addcategory") {
      return "components";
    }else if (pathname === "/mechanicalproducts") {
      return "components";
    }else if (pathname === "/productdetailsmech") {
      return "components";
    } else if (pathname === "/editcategory") {
      return "components";
    } else if (pathname === "/addcomponent") {
      return "components";
    } else if (pathname === "/products") {
      return "components";
    } else if (pathname === "/productdetails") {
      return "components";
    } else if (pathname === "/editcomponent") {
      return "components";
    } else if (pathname === "/vendorslist") {
      return "vendors";
    } else if (pathname === "/createvendor") {
      return "vendors";
    } else if (pathname === "/editvendor") {
      return "vendors";
    } else if (pathname === "/vendorsdetails") {
      return "vendors";
    }else if (pathname === "/vendorpartnersdetails") {
      return "vendors";
    }else if (pathname === "/generatepo") {
      return "vendors";
    }else if (pathname === "/ordersinnerDetails") {
      return "vendors";
    }else if (pathname === "/sendboards") {
      return "vendors";
    }
     else if (pathname === "/purchaseorders") {
      return "purchaseorders";
    } else if (pathname === "/plpodetails") {
      return "purchaseorders";
    } else if (pathname === "/poListDetails") {
      return "purchaseorders";
    } else if (pathname === "/editpo") {
      return "purchaseorders";
    } else if (pathname === "/createpo") {
      return "purchaseorders";
    }else if (pathname === "/returnpo") {
      return "purchaseorders";
    }else if (pathname === "/editreturnpo") {
      return "purchaseorders";
    } 
    else if (pathname === "/editpr") {
      return "purchaseorders";
    } else if (pathname === "/prpodetails") {
      return "purchaseorders";
    } else if (pathname === "/cpodetails") {
      return "purchaseorders";
    } else if (pathname === "/inwardpurchase2") {
      return "purchaseorders";
    }else if (pathname === "/inwardpurchase3") {
      return "purchaseorders";
    }else if (pathname === "/gateEntry") {
      return "purchaseorders";
    } else if (pathname === "/inwardstepper") {
      return "purchaseorders";
    } else if (pathname === "/bomdetails") {
      return "bomdetails";
    } else if (pathname === "/addbom") {
      return "bomdetails";
    } else if (pathname === "/sendkit") {
      return "bomdetails";
    } else if (pathname === "/assigntoclient") {
      return "bomdetails";
    }else if (pathname === "/editbom") {
      return "bomdetails";
    }else if (pathname === "/cloneBom") {
      return "bomdetails";
    } else if (pathname === "/bomlistdetails") {
      return "bomdetails";
    } else if (pathname === "/estimatematerial") {
      return "bomdetails";
    } else if (pathname === "/assignbom") {
      return "bomdetails";
     } else if (pathname === "/outwardinnerdetails") {
        return "bomdetails";   
     }else if (pathname === "/assignBoxBuilding") {
      return "bomdetails";
     }     
     else if (pathname === "/outwardinnerdetails") {
        return "bomdetails";        
    } else if (pathname === "/clients") {
      return "clients";
    }else if (pathname === "/createclient") {
      return "clients";
    }else if (pathname === "/editclient") {
      return "clients";
    }else if (pathname === "/clientdetails") {
      return "clients";
    } 
    else if (pathname === "/clientOrderPage") {
      return "clients";
    }
    else if (pathname === "/roles") {
      return "settings";
    }else if (pathname === "/salespurchase") {
      return "purchasesales";
    }else if (pathname === "/forecastpoDetails") {
      return "purchasesales";
    }else if (pathname === "/forecastpo") {
      return "purchasesales";
    }else if (pathname === "/EditServiceOrder") {
      return "purchasesales";
    }else if (pathname === "/PoForm") {
      return "purchasesales";
    }else if (pathname === "/Invoice") {
      return "purchasesales";
    }else if (pathname === "/EditInvoice") {
      return "purchasesales";
    }else if (pathname === "/editPoForm") {
      return "purchasesales";
    }else if (pathname === "/serviceorder") {
      return "purchasesales";
    }else if (pathname === "/editforecastpo") {
      return "purchasesales";
    } else if (pathname === "/innerdetailslist") {
      return "purchasesales";
    }else if (pathname === "/ProformaInvoice") {
      return "purchasesales";
    }else if (pathname === "/editproformainvoice") {
      return "purchasesales";
    }else if (pathname === "/clientpo") {
      return "purchasesales";
    }else if (pathname === "/innerdetailslist"){
      return "purchasesales"
    }else if (pathname === "/editpermissions"){
      return "settings"
    }
    else if (pathname === "/innerDetailsListGateEntery"){
      return "purchasesales"
    }
    else {
      return "";
    }
  };

  useEffect(() => {
    const storedActiveMenuItem = localStorage.getItem("activeMenuItem");
    if (storedActiveMenuItem) {
      setActiveMenuItem(storedActiveMenuItem);
    } else {
      // Set the active menu item based on the current URL path
      const { pathname } = location;
      setActiveMenuItem(getActiveMenuItemFromPathname(pathname));
    }

    const handlePopstate = () => {
      const { pathname } = window.location;
      setActiveMenuItem(getActiveMenuItemFromPathname(pathname));
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [location]);

  const handleMenuItemClick = (event, path) => {
    // Check if Ctrl or any other modifier key is pressed
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return; // Do nothing if a modifier key is pressed
    }

    setActiveMenuItem(path);
  };

  const logout=()=>{
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
  });
  localStorage.clear()
  }

  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader
          prefix={<i className="fa fa-bars fa-large text-dark"></i>}
        >
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            <img src={Logo} alt="Logo" />
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink
              exact
              to="/"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"/inventory")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "/inventory"}>
                Inventory
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/components"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"components")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "components"}>
                Components
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink
              exact
              to="/vendorslist"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"vendors")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "vendors"}>
                Vendors / Partners
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/clients"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"clients")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "clients"}>
                OEM / Clients
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/purchaseorders"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"purchaseorders")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "purchaseorders"}>
                Purchase orders
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/salespurchase"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"purchasesales")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "purchasesales"}>
                Purchase / Sales
              </CDBSidebarMenuItem>
            </NavLink> 

            <NavLink
              exact
              to="/bomdetails"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"bomdetails")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "bomdetails"}>
                BOMs
              </CDBSidebarMenuItem>
            </NavLink>         

            <NavLink
              exact
              to="/roles"
              activeClassName="activeClicked"
              onClick={(e) => handleMenuItemClick(e,"settings")}
            >
              <CDBSidebarMenuItem active={activeMenuItem === "settings"}>
                Account Settings
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter className="text-start">
          <div className="sidebar-btn-wrapper">
            <CDBSidebarMenu>
              <NavLink
               exact
               to="/"
               activeClassName="activeClicked"
               onClick={logout}
              >
                <CDBSidebarMenuItem>
                  <img src={Logout} alt="" className="me-2"/>
                  Logout
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink>
                {" "}
                <CDBSidebarMenuItem>
                  All Rights Reserved @ PTG
                </CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
