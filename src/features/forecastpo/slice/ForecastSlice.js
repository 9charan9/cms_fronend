import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey } from "../../../utils/common";
import { apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
import { act } from "react";
const {
  getbomPriceAPI,
  createForecastPurchaseOrderURL,
  getClientIdForecastPurchaseOrderDetails,
  saveDraftForecastPurchaseOrder,
  forcastPurchaseOrderEditGetAPI,
  getForecastPOGetBomsForClientName,
} = require("../../../utils/constant." +
  (process.env.REACT_APP_ENV || apikey) +
  ".js");

const initialState = {
  data: {},
  isLoading: false,
  hasError: false,
  error: "",
  showToast: false,
  message: "",
  forecastdata: {},
  clientlist: {},
  draftdata: {},
  geteditforecastdata: {},
  bomlistdata: {},
  pricedata: {},
  bom: {},
  addbom: {},
  clientpo: {},
  pogetvendordata: {},
  activeclientpo: {},
  clientposavedata: {},
  clientpodraftdata: {},
  editPoFormdata: {},
  getpoDraftForm: {},
  saveAndUpdate: {},
  servicepartnerDetails: {},
  editSoFormdata: {},
  pigetclientdata: {},
  clientpisavedata: {},
  piEditForm: {},
  editSavePI: {},
  drafteditSavePI:{},
  addcomponentbom: {},
  createinvoiceform: {},
  editinvoiceform: {},
  invoiceget: {},
  searchinvoice: {},
  draftso: {},
  draftinv: {},
  pidraft: {},
  draftcpfo: {},
  drafteditinvoiceform: {},
  clientpoedit:{},
  clientpoget:{},
  updateforecastdata:{},
  updatedraftforecastdata:{}
};
const devEvent = {
  env_type: envtypekey,
};
const token = localData.get("TOKEN");
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

// Helper function for making API calls
const makeApiCall = async (url, request) => {
  try {
    const response = await instance.post(url, request);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Save forecast api
export const addForecast = createAsyncThunk(
  "add/addforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsCreateForcastPurchaseOrder", request);
  }
);

// Client list
export const clientlistSelection = createAsyncThunk(
  "clientnamelist/getclientList",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj,
    };
    return makeApiCall("CmsGetClientIdForcastPurchaseOrderDetails", request);
  }
);
// draft
export const draftForecast = createAsyncThunk(
  "draft/draftforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsSaveDraftForecastPurchaseOrder", request);
  }
);

// get edit
export const geteditForecast = createAsyncThunk(
  "getedit/geteditforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    console.log(request, "requestrequestrequest");
    return makeApiCall("CmsEditGetForecastPurchaseOrder", request);
  }
);

// get bomlist
export const getbomnames = createAsyncThunk(
  "getbom/getebomlist",
  async (requestBody) => {
    const request = {
      ...devEvent,
      client_name: requestBody.client_name,
    };
    // console.log(request,"requestrequestrequest");
    return makeApiCall("cmsForecastPOGetBomsForClientName", request);
  }
);

// get bomprice
export const getbomprice = createAsyncThunk(
  "getbompricedata/getebompricelist",
  async (requestBody) => {
    const request = {
      ...devEvent,
      client_name: requestBody.client_name,
      bom_name: requestBody.bom_name,
    };
    // console.log(request,"requestrequestrequest");
    return makeApiCall("CmsForecastPOGetBomPriceForBomName", request);
  }
);

export const clientforecast = createAsyncThunk(
  "client/clientforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsCreateClientForcastPurchaseOrder", request);
  }
);
// get CmsPurchaseOrderGetVendorDetails
export const poGetVendordetails = createAsyncThunk(
  "povendor/pogetvendor",
  async (requestBody) => {
    const request = {
      ...devEvent,
      vendor_id: requestBody.vendor_id,
    };
    return makeApiCall("CmsPurchaseOrderGetVendorDetails", request);
  }
);
// get CmsActiveClientPurchaseorder
export const getActiveClientPos = createAsyncThunk(
  "activecpos/getactivecpos",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsActiveClientPurchaseorder", request);
  }
);

// Save createpo api
export const saveCreatePo = createAsyncThunk(
  "save/saveCreatePoData",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsNewPurchaseOrderCreate", request);
  }
);

// Draft createpo api
export const draftCreatePo = createAsyncThunk(
  "draft/draftCreatePoData",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsNewCreatePurchaseOrderSaveDraft", request);
  }
);

//editPo Details
export const editPoForm = createAsyncThunk(
  "edit/editPoFormforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsGetEditDraft", request);
  }
);

//getDraftPo List
export const poDraftForm = createAsyncThunk("draft/poList", async () => {
  const request = {
    ...devEvent,
  };
  return makeApiCall("cmsGetDraftList", request);
});

//updateandsend the editdraftPo
export const updateAndSend = createAsyncThunk(
  "update&send",
  async (requestBody) => {
    const request = {
      ...devEvent,
      update: requestBody,
    };
    return makeApiCall("cmsEditPODraft", request);
  }
);

//get service partner details
export const getServicePartnerDetails = createAsyncThunk(
  "getserviceorderPartnerDetails",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsPurchaseOrderGetPartnersDetails", request);
  }
);

//saveServiceOrder
export const saveServiceOrder = createAsyncThunk(
  "saveServiceOrder",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsNewServiceOrderCreate", request);
  }
);

//getEditServiceOrder
export const getEditServiceOrderDetails = createAsyncThunk(
  "getEditServiceOrder",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsServiceOrderGet", request);
  }
);
export const resetServiceOrderDetails = createAction("serviceOrder/ResetDeatils");

//update in Edit & Save in Service order
export const updateEditSoData = createAsyncThunk(
  "updateEditServiceOrder",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsUpdateServiceOrder", request);
  }
)

//update editServiceOrder in draft
export const updateDraftServiceOrder = createAsyncThunk(
  "updateDraftServiceOrder",
  async(requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    }
    return makeApiCall("cmsServiceUpdateDraft",request)
  }
)


// PROFORMA INVOICE get CmsProformaInvoiceGetClientDetails
export const piGetClientdetails = createAsyncThunk(
  "piclient/pigetclient",
  async (requestBody) => {
    const request = {
      ...devEvent,
      client_id: requestBody.client_id,
    };
    return makeApiCall("cmsproformaInvoicegetClientDetails", request);
  }
);

// PROFORMA INVOICE Save create PI api
export const saveCreatePi = createAsyncThunk(
  "save/saveCreatePiData",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsproformaInvoiceCreate", request);
  }
);

// PROFORMA INVOICE Edit create PI api
export const editCreatePi = createAsyncThunk(
  "save/editCreatePiData",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("proformaInvoiceEditGet", request);
  }
);

export const resetEditGetPI = createAction("forcast/resetDetails");


export const componentBomSearch = createAsyncThunk(
  "createinvoice/addcomponentbom",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      console.log(JSON.stringify(request, null, 2))
      const response = await instance.post('cmsInvoiceSearch', request);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const invoiceSearchAdd = createAsyncThunk(
  "createPurchase/addcomponent",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      console.log(JSON.stringify(request, null, 2))
      const response = await instance.post('cmsInvoiceSearchAdd', request);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);
export const invoiceCreate = createAsyncThunk(
  "save/createinvoice",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    };
    return makeApiCall('cmsInvoiceCreate', request);
  }
);

export const invoiceedit = createAsyncThunk(
  "save/editinvoice",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsInvoiceEdit", request);
  }
);

export const invoiceeditget = createAsyncThunk(
  "save/editinvoiceget",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsGetEditInvoice", request);
  }
);

// PROFORMA INVOICE Edit Save create PI api
export const editsaveCreatePi = createAsyncThunk(
  "save/editsaveCreatePiData",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsEditProformaInvoice", request);
  }
);

// PROFORMA INVOICE Edit Save create PI api
export const drafteditsaveCreatePi = createAsyncThunk(
  "save/drafteditsaveCreatePiData",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsDraftEditProformaInvoice", request);
  }
);

export const draftServiceorder = createAsyncThunk(
  "draft/draftServiceorder",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsDraftServiceOrderCreate", request);
  }
);

export const draftInvoice = createAsyncThunk(
  "draft/draftInvoicesave",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsInvoiceSaveDraft", request);
  }
);

export const proformaInvoiceDraft = createAsyncThunk(
  "draft/draftproformaInvoicesave",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsproformaInvoiceSaveDraft", request);
  }
);

export const clientdraft = createAsyncThunk(
  "draft/draftclient",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsDraftCreateClientForcastPurchaseOrder", request);
  }
);

// draft invoiceupdate

export const draftinvoiceedit = createAsyncThunk(
  "draftinvoicesave/drafteditinvoice",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("cmsInvoiceUpdateDraft", request);
  }
);

export const editclient = createAsyncThunk(
  "edit/editclient",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsDraftClientForcastPurchaseOrderEdit", request);
  }
);

export const clientpoeditget = createAsyncThunk(
  "edit/editclientget",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsClientForcastPurchaseOrderEditGet", request);
  }
);


// Save update forecast api
export const updateForecast = createAsyncThunk(
  "update/updateforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsEditUpdateForcastPurchaseOrder", request);
  }
);

// Draft update forecast api
export const updatedraftForecast = createAsyncThunk(
  "updatedraft/saveupdatedraftforecastdata",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody,
    };
    return makeApiCall("CmsDraftUpdateEditForecastPurchaseOrder", request);
  }
);

const ForecastSlice = createSlice({
  name: "forecastDetails",
  initialState,
  extraReducers: (builder) => {
    builder

      .addCase(resetEditGetPI, (state) => {
        state.piEditForm = {}
      })

      .addCase(resetServiceOrderDetails, (state) => {
        state.editSoFormdata = {}
      })
      //save forecast
      .addCase(addForecast.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(addForecast.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.forecastdata = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(addForecast.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //get client list
      .addCase(clientlistSelection.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(clientlistSelection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientlist = action.payload;
        state.hasError = false;
      })
      .addCase(clientlistSelection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //draft
      .addCase(draftForecast.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(draftForecast.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.draftdata = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(draftForecast.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //get forecast
      .addCase(geteditForecast.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(geteditForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.geteditforecastdata = action.payload;
        state.hasError = false;
      })
      .addCase(geteditForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //get bomnames
      .addCase(getbomnames.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getbomnames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bomlistdata = action.payload;
        state.hasError = false;
      })
      .addCase(getbomnames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //get bomprice
      .addCase(getbomprice.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getbomprice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pricedata = action.payload;
        state.hasError = false;
      })
      .addCase(getbomprice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(clientforecast.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(clientforecast.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.forecastdata = action.payload;
        state.clientdata = false;
        state.hasError = false;
      })
      .addCase(clientforecast.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //get povendor details
      .addCase(poGetVendordetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(poGetVendordetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pogetvendordata = action.payload;
        state.hasError = false;
      })
      .addCase(poGetVendordetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      // get CmsActiveClientPurchaseorder
      .addCase(getActiveClientPos.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getActiveClientPos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeclientpo = action.payload;
        state.hasError = false;
      })
      .addCase(getActiveClientPos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //save createpo
      .addCase(saveCreatePo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(saveCreatePo.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.clientposavedata = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(saveCreatePo.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //draft createpo
      .addCase(draftCreatePo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(draftCreatePo.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.clientpodraftdata = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(draftCreatePo.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //editPoformDetails
      .addCase(editPoForm.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(editPoForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editPoFormdata = action.payload;
        state.hasError = false;
      })
      .addCase(editPoForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //getpoDraftlist

      .addCase(poDraftForm.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(poDraftForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getpoDraftForm = action.payload;
        state.hasError = false;
      })
      .addCase(poDraftForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //updateAndSave
      .addCase(updateAndSend.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(updateAndSend.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.save = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getServicePartnerDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      .addCase(getServicePartnerDetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getServicePartnerDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servicepartnerDetails = action.payload;
        state.hasError = false;
      })

      //saveing the inputs fo serives order
      .addCase(saveServiceOrder.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })

      .addCase(saveServiceOrder.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
      })

      .addCase(saveServiceOrder.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //save and update in edit service order
      .addCase(updateEditSoData.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })

      .addCase(updateEditSoData.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
      })

      .addCase(updateEditSoData.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //updateDraft ServiceOrder
      .addCase(updateDraftServiceOrder.pending , (state,action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(updateDraftServiceOrder.fulfilled , (state,action) => {
        state.isLoading = false;
        toast.dismiss()
        if(action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`)
        }
        else {
          toast.error(`${action.payload?.body}`);
        }
      })

      .addCase(updateDraftServiceOrder.rejected , (state,action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      //editSoformDetails
      .addCase(getEditServiceOrderDetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getEditServiceOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editSoFormdata = action.payload;
        state.hasError = false;
      })
      .addCase(getEditServiceOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      // PROFORMA INVOICE get piclient details
      .addCase(piGetClientdetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(piGetClientdetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pigetclientdata = action.payload;
        state.hasError = false;
      })
      .addCase(piGetClientdetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      // PROFORMA INVOICE save pi

      .addCase(saveCreatePi.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })

      .addCase(saveCreatePi.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.clientpisavedata = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(saveCreatePi.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      // EDIT PROFORMA INVOICE get piclient details
      .addCase(editCreatePi.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(editCreatePi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.piEditForm = action.payload;
        state.hasError = false;
      })
      .addCase(editCreatePi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      .addCase(componentBomSearch.pending, (state, action) => {
        state.hasError = false;
      })
      .addCase(componentBomSearch.fulfilled, (state, action) => {
        state.searchinvoice = action.payload;
        state.hasError = false;
      })
      .addCase(componentBomSearch.rejected, (state, action) => {
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(invoiceSearchAdd.pending, (state, action) => {
        state.hasError = false;
      })
      .addCase(invoiceSearchAdd.fulfilled, (state, action) => {
        state.addcomponentbom = action.payload;
        state.hasError = false;
      })
      .addCase(invoiceSearchAdd.rejected, (state, action) => {
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(invoiceCreate.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(invoiceCreate.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.createinvoiceform = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(invoiceCreate.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })
      .addCase(invoiceedit.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(invoiceedit.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.editinvoiceform = action.payload;
        state.hasError = false;
      })
      .addCase(invoiceedit.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(invoiceeditget.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(invoiceeditget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceget = action.payload;
        state.hasError = false;
      })
      .addCase(invoiceeditget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      // PROFORMA INVOICE SAVE EDIT PI

      .addCase(editsaveCreatePi.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })

      .addCase(editsaveCreatePi.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.editSavePI = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(editsaveCreatePi.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      // PROFORMA INVOICE SAVE EDIT DRAFT PI

      .addCase(drafteditsaveCreatePi.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })

      .addCase(drafteditsaveCreatePi.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.drafteditSavePI = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(drafteditsaveCreatePi.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body;
      })

      .addCase(draftServiceorder.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(draftServiceorder.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.draftso = action.payload;
        state.hasError = false;
      })
      .addCase(draftServiceorder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      .addCase(draftInvoice.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(draftInvoice.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.draftinv = action.payload;
        state.hasError = false;
      })
      .addCase(draftInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(proformaInvoiceDraft.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(proformaInvoiceDraft.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.pidraft = action.payload;
        state.hasError = false;
      })
      .addCase(proformaInvoiceDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(clientdraft.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(clientdraft.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.draftcpfo = action.payload;
        state.hasError = false;
      })
      .addCase(clientdraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //draft invoice update
      .addCase(draftinvoiceedit.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(draftinvoiceedit.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.drafteditinvoiceform = action.payload;
        state.hasError = false;
      })
      .addCase(draftinvoiceedit.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(editclient.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(editclient.fulfilled, (state, action) => {
        toast.dismiss();
        if (action.payload.statusCode === 200) {
          toast.success(`${action.payload?.body}`);
        } else {
          toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.clientpoedit = action.payload;
        state.hasError = false;
      })
      .addCase(editclient.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      .addCase(clientpoeditget.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(clientpoeditget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientpoget = action.payload;
        state.hasError = false;
      })
      .addCase(clientpoeditget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
       

         //save update forecast
         .addCase(updateForecast.pending, (state, action) => {
          state.isLoading = true;
          state.hasError = false;
        })
        .addCase(updateForecast.fulfilled, (state, action) => {
          toast.dismiss();
          if (action.payload.statusCode === 200) {
            toast.success(`${action.payload?.body}`);
          } else {
            toast.error(`${action.payload?.body}`);
          }
          state.updateforecastdata = action.payload;
          state.isLoading = false;
          state.hasError = false;
        })
        .addCase(updateForecast.rejected, (state, action) => {
          toast.dismiss();
          toast.error(`${action.payload?.body}`);
          state.hasError = true;
          state.isLoading = false;
          state.error = action.payload.body;
        })


         //draft update forecast
         .addCase(updatedraftForecast.pending, (state, action) => {
          state.isLoading = true;
          state.hasError = false;
        })
        .addCase(updatedraftForecast.fulfilled, (state, action) => {
          toast.dismiss();
          if (action.payload.statusCode === 200) {
            toast.success(`${action.payload?.body}`);
          } else {
            toast.error(`${action.payload?.body}`);
          }
          state.updatedraftforecastdata = action.payload;
          state.isLoading = false;
          state.hasError = false;
        })
        .addCase(updatedraftForecast.rejected, (state, action) => {
          toast.dismiss();
          toast.error(`${action.payload?.body}`);
          state.hasError = true;
          state.isLoading = false;
          state.error = action.payload.body;
        })

  },
});
export const selectLoadingState = (state) => state.forecastData.isLoading;
export const selectAddforecastDetails = (state) => state.forecastData.forecastdata;
export const selectForecastClientList = (state) => state.forecastData.clientlist;
export const selecteditForecastList = (state) => state.forecastData.geteditforecastdata;
export const selectbomList = (state) => state.forecastData.bomlistdata;
export const selectbomPrice = (state) => state.forecastData.pricedata;
export const selectclientforecast = (state) => state.forecastData.clientdata;
export const selectPogetVendordetails = (state) => state.forecastData.pogetvendordata;
export const selectActiveclientpos = (state) => state.forecastData.activeclientpo;
export const selectEditPoform = (state) => state.forecastData.editPoFormdata;
export const selectgetDraftpoList = (state) => state.forecastData.getpoDraftForm;
export const SelectUpDateAndSend = (state) => state.forecastData.saveAndUpdate;
export const SelectservicepartnerDetails = (state) => state.forecastData.servicepartnerDetails;
export const SelectEditSoFormDetails = (state) => state.forecastData.editSoFormdata;
export const selectPigetClientdetails = (state) => state.forecastData.pigetclientdata;
export const selectInvoicebomsearch = (state) => state.forecastData.searchinvoice;
export const selectInvoiceSearchadd = (state) => state.forecastData.addcomponentbom;
export const selectInvoiceCreate = (state) => state.forecastData.createinvoiceform;
export const selectEditPiForm = (state) => state.forecastData.piEditForm;
export const selectEditInvoiceform = (state) => state.forecastData.editinvoiceform;
export const selectInvoiceGet = (state) => state.forecastData.invoiceget;
export const selectDraftServiceorder = (state) => state.forecastData.draftso;
export const selectDraftInvoicesave = (state) => state.forecastData.draftinv;
export const selectDraftPi = (state) => state.forecastData.pidraft;
export const selectDraftClient = (state) => state.forecastData.draftcpfo;
export const selectEditclient = (state) => state.forecastData.clientpoedit;
export const selectEditclientget = (state) => state.forecastData.clientpoget;

export default ForecastSlice.reducer;
