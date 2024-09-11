import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey } from "../../../utils/common";
import { apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
import { forecastCardDetails, forecatPostCommentApi } from "../../../utils/constant.development";

const { CmsForcastPurchaseOrderUploadPOURL, getCmsGetInnerForcastPurchaseOrderDetailsURL, forecastInnerDetails } = require("../../../utils/constant." + (apikey) + ".js");


const initialState = {
    data: {},
    purchaseListdata: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',  
    salesdata: {},
    psApprovalsData : {},
    psStatusChange: {},   
    clientsactivedata:{},
    popdfdetails: {},
    clientkindattn:{},
    cancelledOrderList: {},
    pdfDataforAll: {},
    deleteDraftslist:{},
    poGateEnteryDetails : {},
    savePoGateEnteryDetails : {},
    gateentrypopup:{},
    qatestpopup:{},
    inwardmodel:{},
    multipleCardComentsDetails : {},
    
}
const devEvent = {
    "env_type": envtypekey
}
const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
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

export const CmsGetInnerForcastPurchaseOrderDetails = createAsyncThunk(
    "Purchasesales/fetchinglistDetails",
    async () => {
        try {
            const response = await instance.post('CmsGetForcastPurchaseOrderDetailsList', devEvent);
            // console.log(response?.data);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
);

export const CmsForcastPurchaseOrderUploadPO = createAsyncThunk(
    "Purchasesales/forecastPOuploadpo",
    async (request) => {
        const requestBody = {
            ...devEvent,
            ...request
        }
        try {
            const response = await instance.post('CmsForcastPurchaseOrderUploadPO', requestBody);
            console.log(response?.data);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
);


// export const cmsGetForcastInnerDetails = createAsyncThunk(
//     "Purchasesales/forecatdetials",
//     async () => {
//         try {
//             const response = await axios.post(forecastInnerDetails, devEvent , config);
//             console.log(response?.data);
//             return response.data;
//         } catch (err) {
//             console.error(err);
//         }
//     }
// );

export const cmsGetForcastInnerDetails = createAsyncThunk(
    "Purchasesales/forecatdetials",
    async (requestobj) => {
      const requestBody = {
        ...devEvent,
        ...requestobj     
        
      }
      try {
        const response = await instance.post('CmsGetInnerForcastPurchaseOrderDetails', requestBody);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  )

  export const cmsUpdateForcastPostComments = createAsyncThunk(
    "Purchasesales/forecatpostComments",
    async (requestobj) => {
      const requestBody = {
        ...devEvent,
        ...requestobj             
      }
      try {
        const response = await instance.post('CmsForcastPurchaseOrderPostComment', requestBody);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  )
  
// to get data  in approval pending tab 
  export const cmsPsApprovalsTab = createAsyncThunk(
    "Purchasesales/psapprovalstab",
    async (requestobj) => {
      const requestBody = {
        ...devEvent,
        ...requestobj             
      }
      try {
        const response = await instance.post('cmsGetPurchaseOrderApprovalsDetails', requestBody);
        // console.log(response.data)
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  )
// to change the status pending to approval 
  export const cmsChnageStatusPendiing = createAsyncThunk(
    "Purchasesales/psstatuschnage",
    async(requestobj) => {
      const requestBody = {
      ...devEvent,
      ...requestobj
      }
      try {
        console.log(requestBody);
        const response = await instance.post('cmsGetPurchaseOrderApprovals',requestBody);
        return response.data;
      }catch(error){
        console.log(error);
      }
    }
  )

  // fetch client get lambda 
export const fetchClientList = createAsyncThunk(
  "getclientList/getclientListdetails",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {
      const response = await instance.post('cmsPOClientList', request);
      // const response = await instance.post('cmsGetClientDetails', request); 
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);


export const getPDFPOData = createAsyncThunk(
  "getPDFpodata",
  async (request) => {
    const requestBody = {
      ...devEvent,
      ...request
    }
    try {
      const response = await instance.post('CmsGetForcastPurchaseOrderDetailsList1', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

 // fetch invoice ship details get lambda 
 export const fetchClientkindattnList = createAsyncThunk(
  "getkindattnclientList/getkindattnclientListdetails",
  async (requestobj) => {
    const request = {
      ...devEvent,
      ...requestobj
    }
    try {      
      const response = await instance.post('cmsGetClientDetails', request); 
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);


export const savepurchaseOrderCancel = createAsyncThunk(
  "purchaseOrderCancel/purchaseOrder",
  async (request) => {
    const requestBody = {
      ...devEvent,
      ...request
    }
    try {
      const response = await instance.post('purchaseOrderCancel', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const getPurchaseOrderCancelledListDetials = createAsyncThunk(
  "purchaseOrderCancelled/purchaseOrder",
  async (request) => {
    const requestBody = {
      ...devEvent,
      ...request
    }
    try {
      const response = await instance.post('getAllCancelledOrders', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const getPDFDocumentDeatilsForAll = createAsyncThunk(
  "documentDetails/documentData",
  async (request) => {
    const requestBody = {
      ...devEvent,
      ...request
    }
    try {
      const response = await instance.post('cmsGetAlldetailsForDocumentNumber', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)
// delete draft List

export const deleteDraftListDetials = createAsyncThunk(
  "DrafrtDetelete/DrafrtDeteleteList",
  async (request) => {
    const requestBody = {
      ...devEvent,
      ...request
    }
    try {
      const response = await instance.post('deleteDraft', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)



export const getcmsPOCardDetails = createAsyncThunk(
  "cmsPOCardDetails",
  async (request) => {
    const requestBody = {
      ...devEvent,
      ...request
    }
    try {
      const response = await instance.post('cmsPOCardDetails', requestBody);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const poAddingComments = createAsyncThunk(
  "Purchasesales/popostComments",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj             
    }
    try {
      const response = await instance.post('cmsAddCommentsAndAttachmentsForPurchaseOrder', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const pogetcomments = createAsyncThunk(
  "Purchasesales/poComments",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj             
    }
    try {
      const response = await instance.post('cmsGetCommentsAndAttachmentsForPurchaseOrder', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

//getPoGateEnteryCard details
export const poGateEnteryCardDetails = createAsyncThunk(
  "gateEnteryCardDetails/PoInnerCard",
  async(requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    return makeApiCall("cmsGetPOGateEntry",request)
  }
)

//SavePoGateEntery Details
export const SavePoGateEntery = createAsyncThunk(
  "Save/GateEntery",
  async(requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    };
    return makeApiCall("cmsCreatePOGateEntry",request)
  }
)
export const popupgate = createAsyncThunk(
  "Purchasesales/popupgateentry",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj             
    }
    try {
      const response = await instance.post('getGateEntryPopUp', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const qamodel = createAsyncThunk(
  "Purchasesales/popupqatest",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj             
    }
    try {
      const response = await instance.post('getIQCPopUp', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)
export const inwardpopup = createAsyncThunk(
  "Purchasesales/popupinward",
  async (requestobj) => {
    const requestBody = {
      ...devEvent,
      ...requestobj             
    }
    try {
      const response = await instance.post('getInwardPopUp', requestBody);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

//multipleCadCommentDetails gateEantery iqc inw
export const cmsMultipleCardComments = createAsyncThunk(
  "saveComment/multileCard",
  async(requestBody) => {
    const request = {
      ...devEvent,
      ...requestBody
    }
    try {
      const response = await instance.post("saveCommentsForPurchaseOrder",request)
      return response.data
    }
    catch(error){

    }
  }
)

//getCommentData MultipleCards

// export const getMultipleCommentData = createAsyncThunk(
//   "getCommentData/MultipleCard",
//   async(requestBody) => {
//     const reqest = {
//       ...devEvent,
//       ...requestBody
//     }
//     return makeApiCall("")
//   }

// )


const SalesSlice = createSlice({

    name: "salesDetails",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(CmsGetInnerForcastPurchaseOrderDetails.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(CmsGetInnerForcastPurchaseOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.purchaseListdata = action.payload;
            state.hasError = false;
        })           
        .addCase(CmsGetInnerForcastPurchaseOrderDetails.rejected, (state, action) => {
            state.hasError = true;
            state.error = action.error;
            state.isLoading = false;
        })
        .addCase(CmsForcastPurchaseOrderUploadPO.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(CmsForcastPurchaseOrderUploadPO.fulfilled, (state, action) => {
            if(action.payload?.statusCode === 200){
                toast.success(`${action.payload?.body}`);
            }
            else{
                toast.error(`${action.payload?.body}`);
            }
            state.isLoading = false;
            state.uploadpoinps = action.payload;
            state.hasError = false;
        })           
        .addCase(CmsForcastPurchaseOrderUploadPO.rejected, (state, action) => {
            toast.dismiss();
            toast.error(`${action.payload?.body}`);
            state.hasError = true;
            state.error = action.error;
            state.isLoading = false;
        })
        
        .addCase(cmsGetForcastInnerDetails.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(cmsGetForcastInnerDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.forecastDetails = action.payload;
            state.hasError = false;
          })
          .addCase(cmsGetForcastInnerDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          .addCase(cmsUpdateForcastPostComments.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(cmsUpdateForcastPostComments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.forecastUpdateComments = action.payload;
            state.hasError = false;
          })
          .addCase(cmsUpdateForcastPostComments.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          // to get data  in approval pending tab 
          .addCase(cmsPsApprovalsTab.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(cmsPsApprovalsTab.fulfilled, (state, action) => {
            state.isLoading = false;
            state.psApprovalsData = action.payload;
            state.hasError = false;
          })
          .addCase(cmsPsApprovalsTab.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          // to change the status pending to approval
          .addCase(cmsChnageStatusPendiing.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(cmsChnageStatusPendiing.fulfilled, (state, action) => {
            toast.dismiss()
            toast.success(`${action.payload?.body}`)
            state.isLoading = false;
            state.psStatusChange = action.payload;
            state.hasError = false;
          })
          .addCase(cmsChnageStatusPendiing.rejected, (state, action) => {
            toast.dismiss()
            toast.error(`${action.payload?.body}`)
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })

          // fetch client details
          .addCase(fetchClientList.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(fetchClientList.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clientsactivedata = action.payload;
            state.hasError = false;
          })
          .addCase(fetchClientList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
          .addCase(getPDFPOData.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(getPDFPOData.fulfilled, (state, action) => {
            state.isLoading = false;
            if(action?.payload?.statusCode === 200){
            state.getPDFPOData = action.payload;
            }
            else{
              toast.error(`${action?.payload?.body}`);
            }
            state.hasError = false;
          })
          .addCase(getPDFPOData.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
                    //poGetGateEnteryDetails
                    .addCase(poGateEnteryCardDetails.pending,(state,action) => {
                      state.isLoading = true;
                      state.hasError = false;
                  })
                  .addCase(poGateEnteryCardDetails.fulfilled,(state,action) => {
                    state.isLoading = false;
                    state.poGateEnteryDetails = action.payload;
                    state.hasError = false;
                  })
                  .addCase(poGateEnteryCardDetails.rejected,(state,action) => {
                    state.isLoading = false
                    state.error = action.payload
                    state.hasError = true
                  })
        
                  //savePoGateEntery
                  .addCase(SavePoGateEntery.pending,(state,action)=>{
                    state.isLoading = true;
                    state.hasError = false;
                  })
                  .addCase(SavePoGateEntery.fulfilled , (state,action) => {
                    toast.dismiss();
                    if (action.payload.statusCode === 200) {
                      toast.success(`${action.payload?.body}`);
                    } else {
                      toast.error(`${action.payload?.body}`);
                    }
                    state.isLoading = false;
                    state.savePoGateEnteryDetails = action.payload;
                    state.hasError = false 
                  })
                  .addCase(SavePoGateEntery.rejected , (state,action) => {
                    toast.dismiss()
                    toast.error(`${action.payload?.body}`);
                    state.hasError = true;
                    state.isLoading = false;
                    state.error = action.payload.body
                  })
        
                  

           // fetch client details
           .addCase(fetchClientkindattnList.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(fetchClientkindattnList.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clientkindattn = action.payload;
            state.hasError = false;
          })
          .addCase(fetchClientkindattnList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
          .addCase(savepurchaseOrderCancel.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(savepurchaseOrderCancel.fulfilled, (state, action) => {
            state.isLoading = false;
            if(action?.payload?.statusCode === 200){
              toast.success(`${action?.payload?.body}`);
            }
            else{
              toast.error(`${action?.payload?.body}`);
            }
            state.hasError = false;
          })
          .addCase(savepurchaseOrderCancel.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
          .addCase(getPurchaseOrderCancelledListDetials.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(getPurchaseOrderCancelledListDetials.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cancelledOrderList = action.payload;
            state.hasError = false;
          })
          .addCase(getPurchaseOrderCancelledListDetials.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
          .addCase(getPDFDocumentDeatilsForAll.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(getPDFDocumentDeatilsForAll.fulfilled, (state, action) => {
            state.isLoading = false;
            if(action?.payload?.statusCode === 200){
            state.pdfDataforAll = action.payload;
            }
            else{
              toast.error(`${action?.payload?.body}`);
            }
            state.hasError = false;
          })
          .addCase(getPDFDocumentDeatilsForAll.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })


          // delete draft List      
          .addCase(deleteDraftListDetials.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(deleteDraftListDetials.fulfilled, (state, action) => {
            if(action.payload?.statusCode === 200){
              toast.success(`${action.payload?.body}`);
          }
          else{
              toast.error(`${action.payload?.body}`);
          }
            state.isLoading = false;
            state.deleteDraftslist = action.payload;
            state.hasError = false;
          })
          .addCase(deleteDraftListDetials.rejected, (state, action) => {
            toast.error(`${action.payload?.body}`);
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
          .addCase(poAddingComments.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(poAddingComments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pocomments = action.payload;
            state.hasError = false;
          })
          .addCase(poAddingComments.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          .addCase(pogetcomments.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(pogetcomments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.getpocomments = action.payload;
            state.hasError = false;
          })
          .addCase(pogetcomments.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })


          .addCase(getcmsPOCardDetails.pending, (state) => {
            // state.isLoading = true;
            state.hasError = false;
          })
          .addCase(getcmsPOCardDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cardsData = action.payload;
            state.hasError = false;
          })
          .addCase(getcmsPOCardDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = false;
          })
          .addCase(popupgate.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(popupgate.fulfilled, (state, action) => {
            state.isLoading = false;
            state.gateentrypopup = action.payload;
            state.hasError = false;
          })
          .addCase(popupgate.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          .addCase(qamodel.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(qamodel.fulfilled, (state, action) => {
            state.isLoading = false;
            state.qatestpopup = action.payload;
            state.hasError = false;
          })
          .addCase(qamodel.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })
          .addCase(inwardpopup.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
          })
          .addCase(inwardpopup.fulfilled, (state, action) => {
            state.isLoading = false;
            state.inwardmodel = action.payload;
            state.hasError = false;
          })
          .addCase(inwardpopup.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.hasError = true;
          })

        
        .addCase(cmsMultipleCardComments.pending, (action,state)=>{
          // state.isLoading = true;
          state.hasError = false;
        })
        .addCase(cmsMultipleCardComments.fulfilled,(action,state) => {
          state.isLoading = false;
          state.hasError = false;
          state.multipleCardComentsDetails = action.payload
        })
        .addCase(cmsMultipleCardComments.rejected,(action,state) =>{
          state.isLoading = false;
          state.hasError = true;
        })



    }

})
export const selectLoadingState = state => state.salesData.isLoading;
export const selectPurchaseList = state => state.salesData.purchaseListdata;
export const selectUploadPOinPurchase = state => state.salesData.uploadpoinps;
export const selectForecastData = state => state.salesData.forecastDetails;
export const selectForecastUpdateComments = state => state.salesData.forecastUpdateComments;
export const selectPsApprovalsData = state => state.salesData.psApprovalsData;
export const selectPsStatusChangeData = state => state.psStatusChange
export const selectPDFPODetails = state => state.salesData.getPDFPOData;
export const selectActiclientslist = (state)=> state.salesData.clientsactivedata;
export const selectclientskindattnlist = (state)=> state.salesData.clientkindattn;
export const selectPurchaseOrderCancelledList = (state) => state.salesData?.cancelledOrderList;
export const selectGetAllPDFData = (state) => state.salesData?.pdfDataforAll; 
export const selectdraftDelete = (state) => state.salesData.deleteDraftslist;
export const selectCardsData = (state) => state.salesData.cardsData;
export const selectaddingCommentsPo =(state) => state.salesData.pocomments;
export const selectpurchaseordercomments =(state) => state.salesData.getpocomments;
export const selectGetPoCardInnerDetails = (state) => state.salesData?.poGateEnteryDetails;
export const selectgateentrymodel =(state)=> state.salesData.gateentrypopup;
export const selectqamodelpopup =(state)=> state.salesData.qatestpopup;
export const selectinwardmodelpopup =(state)=> state.salesData.inwardmodel;
export const selectMultipleCardDetails = (state) =>state.salesData.multipleCardComentsDetails;
export default SalesSlice.reducer;