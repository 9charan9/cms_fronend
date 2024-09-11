import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey, apikey } from "../../../utils/common";
import instance from "../../../utils/axios";


const {
  GetVendorDetailsForCreatePOURL,
  GetVendorListURL,
  getStatusURL,
  getCreatedPoDetails,
  // GetStatusURL,
  getCreatedPOListURL,
  updateEditCreatedPODetails,
  getCreatedPOvendorDetails,
  getCreatePODocuments,
  getCreatedPOOrderedCategoryInfo,
  getCreatedPOBankDetails,
  getCreatedPOOtherInfo,
  CreatePOURL,
  inwardqatestURL,
  inwardpurchaseOrdersURL,
  inwardqaTestPostURL,
  inwardPurchasePostURL, getpoInwardAllDetailsForModal, getpoInwardCategoryInfoGetDetails, getPurchaseReturnList, purchaseOrderGateEntryGetDetails,
  purchaseOrderGateEntryCreate,
  geteditpurchasereturnURL,
  serachComponentinpoURL,
  addComponentinpoURL,
  getPurchaseListURL,
  GetVendorslistbydepartment, getPurchaseReturnGetOrderId, getPurchaseReturnGetInwardId, getComponentDetailsInsidePurchaseReturn,savePurchaseReturnCreate,getPurchaseReturnGetInternalDetails,getEditreturnpoDetails,updatecmsPurchaseReturnEdit
} =  require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
  data: {},
  isLoading: false,
  hasError: false,
  error: "",
  showToast: false,
  message: "",
  vendorsdetails: [],
  statusdetails: {},
  createPODetails: {},
  editCreatedPoDetails: {},
  vendorsDetails: {},
  statusDetails: {},
  createPODetailsList: {},
  inwardqatestdetails: {},
  inwardpurchasedetails: {},
  getCreatedpoInnervendorDetails: {},
  createdPOOrderedCategorylist: {},
  createdPODocumentsList: {},
  createdPOBankList: {},
  createdPOOtherInfo: {},
  postinwardqatestBody: {},
  createdPOInwardModalList: {},
  createdPOInwardList: {},
  getPurchaseReturnList: {},
  getEditReturnPurchase: {},
  searchComponentData: {},
  addComponentinCreatePurchase: {},
  vendorslist: {},
  orderIds: {},
  inwardIds: {},
  returnpoComponentData: {},
  returnpoData : {},
  returnpoIdata:{},
  returnpoEditdata:{},
  returnpoeditsavedata:{},
  vendorsactivedata:{},
  partneractivefetchList :{},
  gateEntryIds: {},
  gateEntryDetails: {},

};
const devEvent = {
  "env_type": envtypekey
}
const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};





export const fetchVendorList = createAsyncThunk(
  "getvendorList/getvendorListdetails",
  async () => {
    const request = {
      ...devEvent
    }
    try {
      const response = await instance.post('CmsPurchaseOrderGetVendor', request);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getVendorcategoryDetails = createAsyncThunk(
  "purchase/createPurchaseURL",
  async ({ vendorId, vendorName }) => {
    let request = {
      "vendor_id": vendorId,
      "vendor_name": vendorName,
      ...devEvent
    }
    // console.log(request,"213232")
    try {
      const response = await instance.post(
        'CmsVendorGetDetailsById',
        request
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getstatusofpo = createAsyncThunk(
  "purchasestatus/statusURL",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      console.log(JSON.stringify(request, null, 2));
      const response = await instance.post('CmsPurchaseOrderGetStatus', request);
      console.log("status dataaa", response.data);
      // const response = await axios.get( 
      //   GetStatusURL ,
      //   requestobj
      //   );
      //  console.log(response.data, "status dataaa");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getCreatedEditPo = createAsyncThunk(
  "edit/editpcreatedoDetails",
  async (requestobj) => {
    const requestBody = {
      "vendor_id": requestobj?.vendor_id,
      "order_id": requestobj?.order_id,
      ...devEvent
    }
    try {
      const response = await instance.post('CmsPurchaseOrderEditGet', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)
export const createpo = createAsyncThunk(
  "createpurchase/createURL",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      console.log(JSON.stringify(request, null, 2))
      const response = await instance.post(
        'CmsPurchaseOrderCreate',
        request
      );
      //console.log(response.data, "order no generated");
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
);

export const getCreatedpoList = createAsyncThunk(
  "createdPurchaselist/getcreatedpoList",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      console.log(request)
      const response = await instance.post('cmsPurchaseOrderGetAllData', request);
      console.log(response.data, "PO List");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getpoList = createAsyncThunk(
  "createdPurchaselist/getpoList",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      console.log(request)
      const response = await instance.post('cmsPurchaseOrderGetPurchaseList', request);
      console.log(response.data, "PO List");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const updateCreatedPoDetails = createAsyncThunk(
  "update/updateCreatedPO",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      console.log(JSON.stringify(request, null, 2));
      const response = await instance.post('CmsPurchaseOrderEdit', request);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const getinwardqatest = createAsyncThunk(
  "inward/getinwardQaTest",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      const response = await instance.post('cmsPurchaseOrderQaTestGetDetails', request);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const getinwardpurchaseOrders = createAsyncThunk(
  "inward/getinwardpurchaseorder",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      const response = await instance.post('cmsPurchaseOrdersInwardGetDetailsbyId', request);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const fetchCreatePOInnerVendorDetails = createAsyncThunk(
  "createdpoInnerVendor/getCreatedPOInnerVendorDetails",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "po_id": requestBody
    }
    try {
      const response = await instance.post('cmsPurchaseOrderGetVendorDetailsById', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

//order category info
export const fetchCreatedpoOrderedInfo = createAsyncThunk(
  "createdPOOrderedCategoryInfo/getCreatedPOOrderedCategoryInfo",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "po_id": requestBody
    }
    try {
      const response = await instance.post('cmsPurchaseOrderGetComponentsById', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

//documents
export const fetchCreatedpoDocuments = createAsyncThunk(
  "createdPOdoc/getCreatedPOdocuments",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "po_id": requestBody
    }
    try {
      const response = await instance.post('CmsPurchaseOrderGetDocumentsById', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

//bank
export const fetchCreatedpoBankdetails = createAsyncThunk(
  "createdPObank/getCreatedPObank",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "po_id": requestBody
    }
    try {
      const response = await instance.post('CmsPurchaseOrderGetBankDetails', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

//otherinfo
export const fetchCreatedpoOtherInfo = createAsyncThunk(
  "createdPOOtherInfo/getCreatedPOOtherInfo",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "po_id": requestBody
    }
    try {
      const response = await instance.post('CmsPurchaseOrderGetOtherInfo', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)
//Post QA test
export const postinwardQatest = createAsyncThunk(
  "inwardQatest/postinwardqatest",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      console.log(request);
      const response = await instance.post('cmsPurchaseOrderSaveQATest', request);
      console.log(response.data?.body);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

//Post Inward Purchase
export const postinwardPurchase = createAsyncThunk(
  "inwardPurchaseOrders/postinwardPurchase",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      console.log(request);
      const response = await instance.post('CmsPurchaseOrderSaveInward', request);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

//GateEntry get lambda
export const getPoDetailsGateEntry = createAsyncThunk(
  "purchase/gateEntryPoDetails",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj     
      
    }
    try {
      const response = await instance.post('cmsPurchaseOrderGateEntryGetDetails', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

//GateEntry post lambda
export const createPoDetailsGateEntry = createAsyncThunk(
  "purchase/gateEntrySaveDetails",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj
    }
    try {
      const response = await instance.post('CmsPurchaseOrderGateEntryCreate', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

//getCreatedPOInwardModalList
export const fetchCreatedpoInwardModalList = createAsyncThunk(
  "createdPOOInwardModalList/getCreatedPOInwardModalList",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "inward_id": requestBody?.inward_id,
      "status": requestBody?.status
    }
    try {
      const response = await instance.post('cmsPurchaseOrderInwardGetAllDetailsForModal', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)
//getCreatedPOInwardList
export const fetchCreatedpoInwardList = createAsyncThunk(
  "createdPOOInwardList/getCreatedPOInwardList",
  async (requestBody) => {
    const request = {
      ...devEvent,
      "po_id": requestBody
    }
    try {
      const response = await instance.post('cmsPurchaseOrderInwardCategoryInfoGetDetails', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

//getreturnPurchaseList
export const fetchReturnpurchaseList = createAsyncThunk(
  "returnPurchaseList/getreturnPurchaseList",
  async (requestBody) => {
    const request = {
      ...devEvent,
    }
    try {
      const response = await instance.post('cmsPurchaseOrderGetPurchaseReturnList', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

//edit return purchase
export const getEditReturnPurchaseList = createAsyncThunk(
  "returnPurchase/editreturnPurhase",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      console.log(request);
      const response = await instance.post('cmsPurchaseOrderGetPurchaseReturnDetails', request);
      return response.data;
    }
    catch (error) {
      console.error(error);
    }
  }
)

export const serachComponentinPO = createAsyncThunk(
  "createPurchase/purchaseOrders",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      // console.log(JSON.stringify(request, null, 2))
      const response = await instance.post('CmsInventorySearchSuggestionInPO', request);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const addComponentinpo = createAsyncThunk(
  "createPurchase/addcomponent",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      // console.log(JSON.stringify(request, null, 2))
      const response = await instance.post('CmsInventorySearchComponentInPO', request);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getvednorsbydepartment = createAsyncThunk(
  "createPurchase/getvendorsbydep",
  async (requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      console.log(JSON.stringify(request, null, 2))
      const response = await instance.post('cmsVendorsGetNamesAndIds', request);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);


// optimize code

const makeApiCall = async (url, request) => {
  try {
    const response = await instance.post(url, request);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// getOrderidList list
export const getOrderidList = createAsyncThunk(
  "orderidslist/getOrderids",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    };
    return makeApiCall('cmsPurchaseReturnGetOrderId', request);
  }
);

// getInwardidList list
export const getInwardidList = createAsyncThunk(
  "inwardidslist/getInwardids",
  async (requestobj) => {
    const request = {
      ...devEvent,
      "po_order_id": requestobj?.po_order_id
    };
    return makeApiCall('cmsPurchaseReturnGetInwardId', request);
  }
);

// getreturnpo components list
export const getReturnpoCList = createAsyncThunk(
  "returnpoClist/getreturnpo",
  async (requestobj) => {
    const request = {
      ...devEvent,
      "po_order_id": requestobj?.po_order_id,
      "inwardId": requestobj?.inwardId,
    };
    return makeApiCall('cmsGetComponentDetailsInsidePurchaseReturnModified', request);
  }
);

// saveReturnpo

export const saveReturnpo = createAsyncThunk(
  "returnpo/returnposave",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    };
    return makeApiCall('CmsPurchaseReturnCreateModified', request);
  }
);

// InnerReturnpo
export const InnerReturnpodetails = createAsyncThunk(
  "returnpoinnerdetails/getreturnpoinnerlist",
  async (requestobj) => {
    const request = {
      ...devEvent,
      "return_id": requestobj.return_id
    };
    return makeApiCall('cmsPurchaseReturnGetInternalDetails', request);
  }
);

// Edit rpo list
export const EditReturnpodetails = createAsyncThunk(
  "editreturnpodetails/geteditreturnpolist",
  async (requestobj) => {
    const request = {
      ...devEvent,
      "return_id": requestobj.return_id
    };
    return makeApiCall('cmsPurchaseReturnEditGetDetails', request);
  }
);

// saveReturnpo

export const saveeditReturnpo = createAsyncThunk(
  "returnpoeditsave/returnposaveedit",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    };
    return makeApiCall('cmsPurchaseReturnEdit', request);
  }
);


// fetchingPartnerList 
export const fetchPartnerList = createAsyncThunk(  
  "fetchPartnerList", 
  async(requestobj) => {
    const request = {
      ...devEvent, 
      ...requestobj
    } 
    try {
      const response = await instance.post("CmsGetPartnerNameList",request);
      // console.log(response.data);
      return response.data
    } catch(error) {
      console.error(error)
    }
    
  }

)


export const getcmsGetGateEntryIdForNewPo = createAsyncThunk(  
  "cmsGetGateEntryIdForNewPo", 
  async(requestobj) => {
    const request = {
      ...devEvent, 
      ...requestobj
    } 
    try {
      const response = await instance.post("cmsGetGateEntryIdForNewPo",request);
      return response.data
    } catch(error) {
      console.error(error)
    }    
  }
)


export const getcmsNewPurchaseOrderQaTestGetDetails = createAsyncThunk(  
  "cmsNewPurchaseOrderQaTestGetDetails", 
  async(requestobj) => {
    const request = {
      ...devEvent, 
      ...requestobj
    } 
    try {
      const response = await instance.post("cmsNewPurchaseOrderQaTestGetDetails",request);
      return response.data
    } catch(error) {
      console.error(error)
      toast.error(error?.message)
    }    
  }
)


export const resetNewPurchaseOrderQaTestGetDetails = createAction("po/resetcmsNewPurchaseOrderQaTestGetDetails");


export const saveQATest = createAsyncThunk(  
  "saveQATest", 
  async(requestobj) => {
    const request = {
      ...devEvent, 
      ...requestobj
    } 
    try {
      const response = await instance.post("cmsNewPurchaseOrderSaveQATest",request);
      return response.data
    } catch(error) {
      console.error(error)
    }    
  }
)


const purchaseSlice = createSlice({
  name: "purchaseDetails",
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(resetNewPurchaseOrderQaTestGetDetails, (state) => {
      state.gateEntryDetails = {}
    })
      // fetch vendors list
      .addCase(fetchVendorList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchVendorList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorsactivedata = action.payload;
        state.hasError = false;
      })
      .addCase(fetchVendorList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = false;
      })

      // Get Vendors details
      .addCase(getVendorcategoryDetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getVendorcategoryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorsDetails = action.payload;
        state.hasError = false;
      })
      .addCase(getVendorcategoryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      // Get status of PO URL
      .addCase(getstatusofpo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getstatusofpo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statusDetails = action.payload;
        state.hasError = false;
      })
      .addCase(getstatusofpo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      //  Create PO URL
      .addCase(createpo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createpo.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          toast.success(`${action.payload?.body}`);
        }
        else{
            toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.createPODetails = action.payload;
        state.hasError = false;
      })
      .addCase(createpo.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      // get Purchase Edit Details
      .addCase(getCreatedEditPo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCreatedEditPo.fulfilled, (state, action) => {
        state.editCreatedPoDetails = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getCreatedEditPo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      // Get Created PO List
      .addCase(getCreatedpoList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getCreatedpoList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createPODetailsList = action.payload;
        state.hasError = false;
      })
      .addCase(getCreatedpoList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
     
      // Get Created PO List
      .addCase(getpoList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getpoList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.poList = action.payload;
        state.hasError = false;
      })
      .addCase(getpoList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      // update vendor Details
      .addCase(updateCreatedPoDetails.pending, (state, action) => {
        // toast.loading("please wait, updating details...");
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(updateCreatedPoDetails.fulfilled, (state, action) => {
        toast.dismiss();
        if(action.payload.statusCode === 200){
          toast.success(`${action.payload?.body}`);
        }
        else{
            toast.error(`${action.payload?.body}`);
        }
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(updateCreatedPoDetails.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(getinwardqatest.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getinwardqatest.fulfilled, (state, action) => {
        state.inwardqatestdetails = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getinwardqatest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })


      //  fetchCreatePOInnerVendorDetails
      .addCase(fetchCreatePOInnerVendorDetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatePOInnerVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getCreatedpoInnervendorDetails = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatePOInnerVendorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      // order Info  
      .addCase(fetchCreatedpoOrderedInfo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoOrderedInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdPOOrderedCategorylist = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoOrderedInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(getinwardpurchaseOrders.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getinwardpurchaseOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inwardpurchasedetails = action.payload;
        state.hasError = false;
      })
      .addCase(getinwardpurchaseOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //documents
      .addCase(fetchCreatedpoDocuments.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdPODocumentsList = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //bank
      .addCase(fetchCreatedpoBankdetails.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoBankdetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdPOBankList = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoBankdetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })


      //otherinfo
      .addCase(fetchCreatedpoOtherInfo.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoOtherInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdPOOtherInfo = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoOtherInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(postinwardQatest.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(postinwardQatest.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          toast.success(`${action.payload?.body}`);
      }
      else{
          toast.error(`${action.payload?.body}`);
      }
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(postinwardQatest.rejected, (state, action) => {
        toast.error(`${action.payload?.body}`);
        toast.dismiss();
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(postinwardPurchase.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(postinwardPurchase.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          toast.success(`${action.payload?.body}`);
      }
      else{
          toast.error(`${action.payload?.body}`);
      }
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(postinwardPurchase, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //inward modal
      .addCase(fetchCreatedpoInwardModalList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoInwardModalList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdPOInwardModalList = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoInwardModalList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //inward list
      .addCase(fetchCreatedpoInwardList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoInwardList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdPOInwardList = action.payload;
        state.hasError = false;
      })
      .addCase(fetchCreatedpoInwardList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //return purchase list
      .addCase(fetchReturnpurchaseList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchReturnpurchaseList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getPurchaseReturnList = action.payload;
        state.hasError = false;
      })
      .addCase(fetchReturnpurchaseList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      //getLambdaForGateEntry
      .addCase(getPoDetailsGateEntry.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getPoDetailsGateEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gateEntryPoDetails = action.payload;
        state.hasError = false;
      })
      .addCase(getPoDetailsGateEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      .addCase(createPoDetailsGateEntry.pending, (state, action) => {
        // toast.loading("please wait, updating details...");
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createPoDetailsGateEntry.fulfilled, (state, action) => {
        // toast.dismiss();
        if(action?.payload?.statusCode === 200){
          toast.success(`${action.payload?.body}`);
      }
      else{
          toast.error(`${action.payload?.body}`);
      }
      
        // toast.success(`${action.payload?.body}`);
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(createPoDetailsGateEntry.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(getEditReturnPurchaseList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getEditReturnPurchaseList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getEditReturnPurchase = action.payload;
        state.hasError = false;
      })
      .addCase(getEditReturnPurchaseList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(serachComponentinPO.pending, (state, action) => {
        state.hasError = false;
      })
      .addCase(serachComponentinPO.fulfilled, (state, action) => {
        state.searchComponentData = action.payload;
        state.hasError = false;
      })
      .addCase(serachComponentinPO.rejected, (state, action) => {
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(addComponentinpo.pending, (state, action) => {
        state.hasError = false;
      })
      .addCase(addComponentinpo.fulfilled, (state, action) => {
        state.addComponentinCreatePurchase = action.payload;
        state.hasError = false;
      })
      .addCase(addComponentinpo.rejected, (state, action) => {
        state.error = action.payload;
        state.hasError = true;
      })
      .addCase(getvednorsbydepartment.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getvednorsbydepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorslist = action.payload;
        state.hasError = false;
      })
      .addCase(getvednorsbydepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = true;
      })

      // addcase order ids
      .addCase(getOrderidList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getOrderidList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderIds = action.payload;
        state.hasError = false;
      })
      .addCase(getOrderidList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = false;
      })

      // addcase inward ids
      .addCase(getInwardidList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getInwardidList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inwardIds = action.payload;
        state.hasError = false;
      })
      .addCase(getInwardidList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = false;
      })


      // addcase returnpo list
      .addCase(getReturnpoCList.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getReturnpoCList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.returnpoComponentData = action.payload;
        state.hasError = false;
      })
      .addCase(getReturnpoCList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hasError = false;
      })

       //save return po
       .addCase(saveReturnpo.pending, (state, action) => {
        // toast.loading("Creating, Please Wait....");
        state.isLoading = true;
        state.hasError = false;
    })
    .addCase(saveReturnpo.fulfilled, (state, action) => {
        toast.dismiss();
        if(action.payload.statusCode === 200){
          toast.success(`${action.payload?.body}`);
      }
      else{
          toast.error(`${action.payload?.body}`);
      }
        state.returnpoData = action.payload;
        state.isLoading = false;
        state.hasError = false
    })
    .addCase(saveReturnpo.rejected, (state, action) => {
        toast.dismiss();
        toast.error(`${action.payload?.body}`);
        state.hasError = true;
        state.isLoading = false;
        state.error = action.payload.body
    })

    // addcase returnpo list
    .addCase(InnerReturnpodetails.pending, (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(InnerReturnpodetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.returnpoIdata = action.payload;
      state.hasError = false;
    })
    .addCase(InnerReturnpodetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.hasError = false;
    })

     // addcase edit returnpo list
     .addCase(EditReturnpodetails.pending, (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    })
    .addCase(EditReturnpodetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.returnpoEditdata = action.payload;
      state.hasError = false;
    })
    .addCase(EditReturnpodetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.hasError = false;
    })


     //save return po
     .addCase(saveeditReturnpo.pending, (state, action) => {
      // toast.loading("Creating, Please Wait....");
      state.isLoading = true;
      state.hasError = false;
  })
  .addCase(saveeditReturnpo.fulfilled, (state, action) => {
      toast.dismiss();
      if(action.payload.statusCode === 200){
        toast.success(`${action.payload?.body}`);
    }
    else{
        toast.error(`${action.payload?.body}`);
    }
      state.returnpoeditsavedata = action.payload;
      state.isLoading = false;
      state.hasError = false
  })
  .addCase(saveeditReturnpo.rejected, (state, action) => {
      toast.dismiss();
      toast.error(`${action.payload?.body}`);
      state.hasError = true;
      state.isLoading = false;
      state.error = action.payload.body
  })


  .addCase(fetchPartnerList.pending, (state, action) => {
    state.isLoading = true;
    state.hasError = false;
  })
  .addCase(fetchPartnerList.fulfilled, (state, action) => {
    state.isLoading = false;
    state.partneractivefetchList = action.payload;
    state.hasError = false;
  })
  .addCase(fetchPartnerList.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.hasError = false;
  })
  .addCase(getcmsGetGateEntryIdForNewPo.pending, (state) => {
    state.isLoading = true;
    state.hasError = false;
  })
  .addCase(getcmsGetGateEntryIdForNewPo.fulfilled, (state, action) => {
    state.isLoading = false;
    state.gateEntryIds = action.payload;
    state.hasError = false;
  })
  .addCase(getcmsGetGateEntryIdForNewPo.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.hasError = false;
  })
  .addCase(getcmsNewPurchaseOrderQaTestGetDetails.pending, (state) => {
    state.isLoading = true;
    state.hasError = false;
  })
  .addCase(getcmsNewPurchaseOrderQaTestGetDetails.fulfilled, (state, action) => {
    state.isLoading = false;
    state.gateEntryDetails = action.payload;
    state.hasError = false;
  })
  .addCase(getcmsNewPurchaseOrderQaTestGetDetails.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.hasError = false;
  })
  .addCase(saveQATest.pending, (state) => {
    state.isLoading = true;
    state.hasError = false;
  })
  .addCase(saveQATest.fulfilled, (state, action) => {
    state.isLoading = false;
    if(action?.payload?.statusCode === 200){
      toast.success(`${action?.payload?.body}`);
    }
    else{
      toast.error(`${action?.payload?.body}`);
    }
    state.hasError = false;
  })
  .addCase(saveQATest.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.hasError = false;
  })
  }
});
export const selectCategory = (state) => state.purchaseData.data;
export const selectEditPoDetails = (state) => state.purchaseData.editCreatedPoDetails;
export const selectLoadingStatus = state => state.purchaseData.isLoading;
export const selectedVendor = (state) => state.purchaseData.vendorsDetails;
export const setStatusUpdate = (state) => state.purchaseData.statusDetails;
export const setCreatePO = (state) => state.purchaseData.createPODetails
export const selectcreatedPOList = (state) => state.purchaseData.createPODetailsList;
export const selectPurchaseList = (state) => state.purchaseData.poList;
export const selectInwardQatest = state => state.purchaseData.inwardqatestdetails;
export const selectcreatedPOinnervendorList = (state) => state.purchaseData.getCreatedpoInnervendorDetails;
export const selectcreatedPOCategoryinfoList = (state) => state.purchaseData.createdPOOrderedCategorylist;
export const selectInwardPurchaseOrders = (state) => state.purchaseData.inwardpurchasedetails;
export const selectcreatePODocs = (state) => state.purchaseData.createdPODocumentsList;
export const selectBankDetails = (state) => state.purchaseData.createdPOBankList;
export const selectCreatedPOOtherInfo = (state) => state.purchaseData.createdPOOtherInfo;
export const selectPostInwardDetails = (state) => state.purchaseData.postinwardqatestBody;
export const selectCreatedPOInwardModal = (state) => state.purchaseData.createdPOInwardModalList;
export const selectCreatedPOInwardList = (state) => state.purchaseData.createdPOInwardList;
export const selectReturnpurchaseList = (state) => state.purchaseData.getPurchaseReturnList;
export const setGateEntryGetPoDeatils = (state) => state.purchaseData.gateEntryPoDetails;
export const selectEditReturnPurchaseDetails = (state) => state.purchaseData.getEditReturnPurchase;
export const selectSearchComponentData = (state) => state.purchaseData.searchComponentData;
export const selectAddComponentinCreatePO = (state) => state.purchaseData.addComponentinCreatePurchase;
export const selectGetVendorsbyDeprt = (state) => state.purchaseData.vendorslist;
export const selectGetOrderIds = (state) => state.purchaseData.orderIds;
export const selectGetInwardIds = (state) => state.purchaseData.inwardIds;
export const selectGetreturnpoClist = (state) => state.purchaseData.returnpoComponentData;
export const selectReturnPoInnerList = (state) => state.purchaseData.returnpoIdata;
export const selectEditreturnpoList = (state) => state.purchaseData.returnpoEditdata;
export const selectActivevendorslist = (state)=> state.purchaseData.vendorsactivedata;
export const selectPartnerFetchingList = (state) => state.purchaseData.partneractivefetchList;
export const selectGateEntryIds = (state) => state.purchaseData.gateEntryIds;
export const selectGateEntryDetails = (state) => state.purchaseData.gateEntryDetails;
export default purchaseSlice.reducer;
