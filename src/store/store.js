import { configureStore } from "@reduxjs/toolkit";
import componentReducer from "../features/component/slice/ComponentSlice";
import bomReducer from "../features/bom/slice/BomSlice";
import vendorReducer from "../features/vendors/slice/VendorSlice";
import purchasereducer from "../features/purchaseorders/slice/PurchaseOrderSlice";
import clientReducer from "../features/clients/slice/ClientSlice";
import inventoryReducer from "../features/inventory/slice/InventorySlice";
import forecastReducer from "../features/forecastpo/slice/ForecastSlice";
import salesreducer from "../features/purchasesales/slice/SalesSlice";
import settingsReducer from "../features/settings/slice/SettingsSlice";
export const store = configureStore({
  reducer: {
    componentData: componentReducer,
    bomData: bomReducer,
    vendorData: vendorReducer,
    purchaseData: purchasereducer,
    clientData: clientReducer,
    InventoryData: inventoryReducer,
    forecastData : forecastReducer,
    salesData  : salesreducer,
    settingsData : settingsReducer
  },
});
