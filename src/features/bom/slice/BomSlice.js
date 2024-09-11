import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";
import { localData } from "../../../utils/storage"; 
import { envtypekey,apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
const { bomListURL, getBomEditDetailsURL, searchCategoryURL, searchComponentdataURL, addBOMURL, deleteBOMURL, updatedBomDetailsURL, savepricebomURL, getCmsBomGetInnerDetailsAPI, getAllVendorDataURL, AssigntoVendorsURL, getPriceBomdatabyid, getPriceBomdatabyidURL, getPatnersListURL, saveAssignemsURL,allOutwardListURL,outwardBlnceDetailsURL,outwardDetailsbyIdURL,
  sendBalanceKitCreate, 
  assignToBoxBuildingAPI,cmsBomGetClientInfoURL, assignToBoxBuildingSaveAPI, assignToBoxBuildingKitApi, boxBuildingInfoGetAPI,cmsCreateClientURL, assignBoxBuildingsave2Api} =  require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    data: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',
    bomEditData: {},
    updatedBom: {},
    addbom: {},
    editedbomdata:{},
    savepricebom: {},
    allvendorsdata: {},
    assignvendor: {},
    getPricebomdata: {},
    partnerList: {},
    saveassigntoems: {},
    assignKitData : {},
    uploadDoc :{},
    clientAgainstPo: {},
    getchalanadocs:{},
    bobstatus:{}
}
const devEvent = {
    "env_type": envtypekey
}

const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};


const makeApiRequest = async (url, data) => {
    const request = {
      ...devEvent,
      ...data,
    };
  
    try {
      const response = await instance.post(url, request);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
export const getBomList = createAsyncThunk(
    "bomDetails/listingthebomdetails",
    async () => {
        try {
            const response = await instance.post('CmsBomGetAllData', devEvent);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const getSearchcategory = createAsyncThunk(
        "bomDetails/searchCategory",
        async (requestBody) => {
          return makeApiRequest('CmsInventorySearchSujjestion', requestBody);
        }
      );
export const  getSearchcomponentdata = createAsyncThunk(
        "bomDetails/searchComponentdata",
    async (requestBody) => {
      return makeApiRequest('CmsInventorySearchComponent', requestBody);
    }
  );
export const addBOM = createAsyncThunk(
       "add/addBOM",
    async (requestBody) => {
      return makeApiRequest('CmsBomCreate', requestBody);
    }
  );
  export const getBomEdit = createAsyncThunk(
    'editBom/getBomEditDetails',
    async (requestEvent) => {
      return makeApiRequest('CmsBomGetDetailsByName', requestEvent);
    }
  );
  
  export const deleteBOM = createAsyncThunk(
    'delete/deleteBOM',
    async (requestBody) => {
      return makeApiRequest('cmsDeleteBom', requestBody);
    }
  );
  
  export const updatedBom = createAsyncThunk(
    'editBom/updateBomDetails',
    async (request) => {
      return makeApiRequest('CmsBomEdit', request);
    }
  );
export const getBomDetails = createAsyncThunk(
         "bom/getBomDetails",
    async (requestBody) => {
      return makeApiRequest('CmsBomGetInnerDetails', requestBody);
    }
  );

export const SaveBomPriceData = createAsyncThunk(
        "bom/savebompricedata",
    async (requestBody) => {
      return makeApiRequest('cmsBomPriceBom', requestBody);
    }
  );

export const getAssignBoxBuildingDetails = createAsyncThunk(
       "bom/getBoxBuildingDetails",
    async (requestBody) => {
      return makeApiRequest('assign_to_boxbuilding', requestBody);
        // const request = {
        //     "outward_id": requestBody.outward_id,
        //     "bom_id": requestBody.bom_id,
        //     "boards_id" : requestBody.boards_id,
        //     ...devEvent
        // }
        // try {
        //     const response = await axios.post(assignToBoxBuildingAPI, request);
        //     return response.data;
        // }
        // catch (error) {
        //     console.error(error);
        // }
    }
  );

export const getBoxBuildingInfoDetails = createAsyncThunk(
        "bom/getBoxBuildingInfoDetails",
    async (requestBody) => {
      return makeApiRequest('partner_send_box_building', requestBody);
    }
  );

export const getAssignBoxBuildingKitDetails = createAsyncThunk(
         "bom/getBoxBuildingKitDetails",
    async (requestBody) => {
      return makeApiRequest('assign_to_boxbuilding2', requestBody);
        // const request = {
        //     "outward_id": requestBody.outward_id,
        //     "bom_id": requestBody.bom_id,
        //     ...devEvent
        // }
        // try {
        //     const response = await axios.post(assignToBoxBuildingKitApi, request);
        //     return response.data;
        // }
        // catch (error) {
        //     console.error(error);
        // }
    }
  );

export const updateBoxBuildingData = createAsyncThunk(
        "editBom/updateBoxBuilding",
    async (request) => {
      return makeApiRequest('save_assign_to_boxbuilding', request);
    }
  );

export const updateBoxBuildingData2Api = createAsyncThunk(
    "editBom/updateBoxBuildingTwoApi",
    async (request) => {
      return makeApiRequest('save_assign_to_boxbuilding2', request);
    }
  );

export const  GetAllVendors = createAsyncThunk(
        "bom/getAllVendorsData",
    async (requestBody) => {
      return makeApiRequest('CmsVendorGetAllData', requestBody);
    }
  );

export const AssigntoVendor = createAsyncThunk(
        "bom/assigntovendor",
    async (requestBody) => {
      return makeApiRequest('bomAssignToVendor', requestBody);
    }
  );

export const getPriceBomDatabyId = createAsyncThunk(
         "bom/getPriceBomDatabyId",
    async (requestBody) => {
      return makeApiRequest('cmsBomGetPriceBomDetailsById', requestBody);
    }
  );

export const getPatnersList = createAsyncThunk(
      "assignbom/getpartners",
    async (requestBody) => {
      return makeApiRequest('cmsAssignToEMSGetPartnersID', requestBody);
    }
  );

export const saveAssigntoEmsAPI = createAsyncThunk(
        "assigntobom/assigntoems",
    async (requestBody) => {
      return makeApiRequest('cmsAssignToEMS', requestBody);
    }
  );

export const getallOutwardList = createAsyncThunk(
         "bom/getallOutwardList",
    async (requestBody) => {
      return makeApiRequest('CmsBomGetAllOutwardList', requestBody);
    }
  );

export const outwardBlncDetails = createAsyncThunk(
         "bom/outwardBlncDetails",
    async (requestBody) => {
      return makeApiRequest('CmsOutwardGetBalanceComponentDetails', requestBody);
    }
  );
export const outwardTopDetails = createAsyncThunk(
        "bom/outwardTopDetails",
    async (requestBody) => {
      return makeApiRequest('CmsBomGetEmsOutwardDetailsbyId', requestBody);
    }
  );

export const sendKitSave = createAsyncThunk(
      "bom/sendKitSave",
    async (requestBody) => {
      return makeApiRequest('CmsEmsSendBalanceKitCreate', requestBody);
    }
  );

export const getClientinfo = createAsyncThunk(
    "bom/clientinfo",
        async (requestBody) => {
          return makeApiRequest('cmsBomGetFinalProductInfo', requestBody);
        }
      );

export const saveClientData = createAsyncThunk(
       "bom/saveClientData",
    async (requestBody) => {
      return makeApiRequest('cmsAssignClientInBom', requestBody);
    }
  );

  export const uploadDocEms = createAsyncThunk(
    "bom/uploadDocEms",
 async (requestBody) => {
   return makeApiRequest('cmsGetAssignToEMSDocuments', requestBody);
 }
);


export const getcmsClientAgainstPO = createAsyncThunk(
  "assigntoClient/Client", 
  async (requestBody) => {
    return makeApiRequest('cmsClientAgainstPO', requestBody);
  }
)

//chalana docs
export const getBobchalanasDoc = createAsyncThunk(
  "getChalanasDocs/getbobchalanadocs",
  async (requestBody) => {
      const request = {
        ...requestBody,
          ...devEvent
      };
      return makeApiRequest('cmsBoxbuildingDocGet', request);
  }
);

//boxbuilding status change
export const boxBuildingstatusUpdate = createAsyncThunk(
  "boxBuildingstatus/boxBuildingstatuschanged",
  async (requestBody) => {
      const request = {
        ...requestBody,
          ...devEvent
      };
      return makeApiRequest('cmsBoardsBoxBuildingStatusUpdate', request);
  }
);




const bomSlice = createSlice({

    name: "bomDetails",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getSearchcomponentdata.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getSearchcomponentdata.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getSearchcomponentdata.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(getBomList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBomList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(getBomList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            .addCase(getAssignBoxBuildingDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getAssignBoxBuildingDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(getAssignBoxBuildingDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })

            .addCase(getBoxBuildingInfoDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBoxBuildingInfoDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.boxBuilding = action.payload;
                state.hasError = false;
            })
            .addCase(getBoxBuildingInfoDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            
            .addCase(getAssignBoxBuildingKitDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getAssignBoxBuildingKitDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignKitData = action.payload;
                state.hasError = false;
            })
            .addCase(getAssignBoxBuildingKitDetails.rejected, (state, action) => {
                state.isLoading = false ;
                state.hasError = true
                state.error = action.payload.body
            })

            .addCase(addBOM.pending, (state, action) => {
                // toast.loading("Creating, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addBOM.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                  toast.success(`${action.payload?.body}`);
              }
              else{
                  toast.error(`${action.payload?.body}`);
              }
                state.addbom = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(addBOM.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(getBomEdit.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBomEdit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bomEditData = action.payload;
                state.hasError = false;
            })
            .addCase(getBomEdit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(updatedBom.pending, (state, action) => {
                // toast.loading("Updating changes");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updatedBom.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                  toast.success(`${action.payload?.body}`);
              }
              else{
                  toast.error(`${action.payload?.body}`);
              }
                state.isLoading = false;
                state.editedbomdata = action.payload;
                state.hasError = false;
            })
            .addCase(updatedBom.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(updateBoxBuildingData.pending, (state, action) => {
                // toast.loading("Updating changes");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateBoxBuildingData.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                  toast.success(`${action.payload?.body}`);
              }
              else{
                  toast.error(`${action.payload?.body}`);
              }
                state.isLoading = false;
                state.editedbomdata = action.payload;
                state.hasError = false;
            })
            .addCase(updateBoxBuildingData.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(updateBoxBuildingData2Api.pending, (state, action) => {
                // toast.loading("Updating changes");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateBoxBuildingData2Api.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                  toast.success(`${action.payload?.body}`);
              }
              else{
                  toast.error(`${action.payload?.body}`);
              }
                state.isLoading = false;
                state.editedbomdata = action.payload;
                state.hasError = false;
            })
            .addCase(updateBoxBuildingData2Api.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(deleteBOM.pending, (state, action) => {
                // toast.loading("Deleting, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(deleteBOM.fulfilled, (state, action) => {
                // toast.dismiss();
                // toast.success(`${action.payload?.body}`);
                if(action.payload.statusCode === 200){
                  toast.success(`${action.payload?.body}`);
              }
              else{
                  toast.error(`${action.payload?.body}`);
              }
                state.updatedBom = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(deleteBOM.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(getBomDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBomDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(getBomDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getSearchcategory.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getSearchcategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(getSearchcategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(SaveBomPriceData.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(SaveBomPriceData.fulfilled, (state, action) => {
                state.isLoading = false;
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`, {
                  onClose: () => window.location.reload()
                });
              }
              else{
                toast.error(`${action.payload?.body}`, {
                  onClose: () => window.location.reload()
                });
              }
                state.savepricebom = action.payload;
                state.hasError = false;
            })
            .addCase(SaveBomPriceData.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(GetAllVendors.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(GetAllVendors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allvendorsdata = action.payload;
                state.hasError = false;
            })
            .addCase(GetAllVendors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(AssigntoVendor.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(AssigntoVendor.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`, {
                    onClose : () => window.location.reload()
                });
              }
              else{
                toast.error(`${action.payload?.body}`);
              }
                state.isLoading = false;
                state.assignvendor = action.payload;
                state.hasError = false;
            })
            .addCase(AssigntoVendor.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getPriceBomDatabyId.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getPriceBomDatabyId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getPricebomdata = action.payload;
                state.hasError = false;
            })
            .addCase(getPriceBomDatabyId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getPatnersList.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getPatnersList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.partnerList = action.payload;
                state.hasError = false;
            })
            .addCase(getPatnersList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(saveAssigntoEmsAPI.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(saveAssigntoEmsAPI.fulfilled, (state, action) => {
              if(action.payload?.statusCode === 200){
                toast.success(`${action.payload?.body}`);
            }
            else{
                toast.error(`${action.payload?.body}`);
            }
                state.isLoading = false;
                state.saveassigntoems = action.payload;
                state.hasError = false;
            })
            .addCase(saveAssigntoEmsAPI.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`)
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getallOutwardList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getallOutwardList.fulfilled, (state, action) => {
                state.alloutwards = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getallOutwardList.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(outwardBlncDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(outwardBlncDetails.fulfilled, (state, action) => {
                state.outwardblncinfo = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(outwardBlncDetails.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(outwardTopDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(outwardTopDetails.fulfilled, (state, action) => {
                state.outwardtopinfo = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(outwardTopDetails.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(sendKitSave.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(sendKitSave.fulfilled, (state, action) => {
                state.savesendkit = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(sendKitSave.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(getClientinfo.pending, (state, action)=>{
                state.isLoading = true;
                state.hasError = false
            })
            .addCase(getClientinfo.fulfilled, (state, action)=>{
                state.clientinfo = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getClientinfo.rejected, (state, action)=>{
                state.isLoading = false ;
                state.hasError = true
                state.error = action.payload.body
            })
            .addCase(saveClientData.pending, (state, action)=>{
                state.isLoading = true;
                state.hasError = false
            })
            .addCase(saveClientData.fulfilled, (state, action)=>{
                // toast.success(`${action.payload?.body}`);
                if(action.payload.statusCode === 200){
                  toast.success(`${action.payload?.body}`);
              }
              else{
                  toast.error(`${action.payload?.body}`);
              }
                state.saveclientinfo = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(saveClientData.rejected, (state, action)=>{
              toast.error(`${action.payload?.body}`);
                state.isLoading = false ;
                state.hasError = true
                state.error = action.payload.body
            })
            .addCase(uploadDocEms.pending, (state, action)=>{
              state.isLoading = true;
              state.hasError = false
          })
          .addCase(uploadDocEms.fulfilled, (state, action)=>{
              state.uploadDoc = action.payload;
              state.isLoading = false;
              state.hasError = false
          })
          .addCase(uploadDocEms.rejected, (state, action)=>{
              state.isLoading = false ;
              state.hasError = true
              state.error = action.payload.body
          })
          .addCase(getcmsClientAgainstPO.pending, (state, action)=>{
            state.isLoading = true;
            state.hasError = false
        })
        .addCase(getcmsClientAgainstPO.fulfilled, (state, action)=>{
            state.clientAgainstPo = action.payload;
            state.isLoading = false;
            state.hasError = false
        })
        .addCase(getcmsClientAgainstPO.rejected, (state, action)=>{
            state.isLoading = false ;
            state.hasError = true
            state.error = action.payload.body
        })
        //chalana docs
        .addCase(getBobchalanasDoc.pending, (state, action) => {
          state.isLoading = true;
          state.hasError = false;
      })
      .addCase(getBobchalanasDoc.fulfilled, (state, action) => {
          state.isLoading = false;
          state.getchalanadocs = action.payload;
          state.hasError = false;
      })
      .addCase(getBobchalanasDoc.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          state.hasError = true;
      })

         //bob status
      .addCase(boxBuildingstatusUpdate.pending, (state, action) => {
          state.isLoading = true;
          state.hasError = false;
      })
      .addCase(boxBuildingstatusUpdate.fulfilled, (state, action) => {
          state.isLoading = false;
          state.bobstatus = action.payload;
          state.hasError = false;
      })
      .addCase(boxBuildingstatusUpdate.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
          state.hasError = true;
      })
               
    }

})
export const selectSearchCategory = state => state.bomData.data;
export const selectSearchcomponentdata = state => state.bomData.data;
export const getbomlistingdetails = state => state.bomData.data;
export const selectBomEditDetails = state => state.bomData.bomEditData;
export const selectLoadingState = state => state.bomData.isLoading;
export const selectBomDetails = state => state.bomData.data;
export const selectBomDeleted = state => state.bomData.updatedBom;
export const selectAddBomDetails = state => state.bomData.addbom;
export const selectAssigntoVendors = state => state.bomData.assignvendor;
export const selectAllVendorsData = state => state.bomData.allvendorsdata;
export const selectPriceBomDatabyID = state => state.bomData.getPricebomdata; 
export const selectPartnerList = state => state.bomData.partnerList;
export const selectAllOutwardList= state => state.bomData.alloutwards;
export const selectOutwardTopInfo= state => state.bomData.outwardtopinfo;
export const selectOutwardBlncInfo= state => state.bomData.outwardblncinfo;
export const selectSaveSendKit= state => state.bomData.savesendkit;
export const selectAssignBoxBuildingData = state => state.bomData.data;
export const selectAssignBoxBuildingKitData = state => state.bomData.assignKitData;
export const selectBoxBuildingInfoData = state => state.bomData.boxBuilding;
export const selectClientGetInfo= state => state.bomData.clientinfo;
export const selectClientSaveInfo= state => state.bomData.saveclientinfo;
export const selectUploadDoc = state => state.bomData.uploadDoc;
export const selectClientAgainPo = state => state.bomData.clientAgainstPo;                                                         
export const selectBobchalanadocs = state => state.bomData.getchalanadocs;
export const selectBobstatusupdate = state => state.bomData.bobstatus;
export default bomSlice.reducer;