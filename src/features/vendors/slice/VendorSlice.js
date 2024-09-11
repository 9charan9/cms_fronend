import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";
import { localData } from "../../../utils/storage";
import { envtypekey, apikey } from "../../../utils/common";
import instance from "../../../utils/axios";

const {
    vendorListApi, vendorCreationURL,
    changeVendorStatusURL, getEditVendorDetailsURL, updateVendorDetailsURL,
    updateVendorRatingURL, getStatusURL, CreatePOURL, getPartnersOrderslistURL, getCategoryInfoDataURL, cmsFinalProductsURL, cmsGetFinalProductsURL,partnerSendBoardsApi,partnerGetSendBoardsApi,boxBuildingInfoGetAPI,getVendorApiURL,getVendorInnerURL,
}  =  require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    data: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',
    addVendorData: {},
    rating: {},
    vendorStatus: {},
    editvendordata: {},
    typeofvendor: {},
    orderslistdata: {},
    categoryinfolist: {},
    sendBoardsData : {},
    finalProducts: {},
    getProducts: {},
    getSendBoardsdata : {},
    boxBuildingData : {},
    vendorOrderData : {},
    vendorOrderIdData : {},
    vendorOrderInnerData : {},
    partnerAvailableStock : {},
    partnersBoardKits: {},
    partnersdocs : {},
    partnerStock:{},
    getpartnersdocs : {},
    sendBoardsdatainbom:{},
    getFinalBoards: {},
    finalBoardsDocuments: {},
    saveFilter: {},
    reUpload:{},
    bulkuploaddata:{},
    bulkfinaluploaddata:{},
    finaldoc:{},
}

const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

const devEvent = {
    "env_type": envtypekey
}

export const fetchVendorList = createAsyncThunk(
    "vendorList/vendorListdetails",
    async (status) => {
        const request = {
            "status": status,
            ...devEvent
        }
        try {
            const response = await instance.post('CmsVendorGetAllData', request);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const createVendor = createAsyncThunk(
    "vendor/createVendor",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            console.log(request, "request of createvendor")
            const response = await instance.post('cms_vendor_create', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const getVendorcategoryDetails = createAsyncThunk(
    "vendor/getVendorcategoryDetails",
    async (requestBody) => {
        const request = {
            "vendor_name": requestBody.vendor_name,
            "vendor_id": requestBody.vendor_id,
            "type": requestBody.type,
            ...devEvent
        }
        try {
            const response = await instance.post('Cms_vendor_get_detailsByName', request);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const changeVendorStatus = createAsyncThunk(
    "status/chaangeStatus",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            const response = await instance.post('CmsVendorUpdateStatus', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const getVendorEditDetails = createAsyncThunk(
    "edit/editDetails",
    async (requestobj) => {
        let requestBody = {
            ...requestobj,
            ...devEvent
        }
        try {
            console.log(JSON.stringify(requestBody, null, 2));
            const response = await instance.post('Cms_vendor_get_detailsByName', requestBody);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const updateVendorDetails = createAsyncThunk(
    "update/updateVendor",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            const response = await instance.post('cms_edit_vendor_details', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const updateVendorRating = createAsyncThunk(
    "update/vendorRating",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post('CmsVendorAddRating', request);
            // console.log(response, "Rating");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const listSelection = createAsyncThunk(
    "vendor/selectionType",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            const response = await instance.post('CmsVendorGetAllDataDetails', request);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const getstatusofpo = createAsyncThunk(
    "purchasestatus/statusURL",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        }
        try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('CmsVendorUpdateStatus', request);
            console.log("status dataaa", response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
);
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
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getOrdersList = createAsyncThunk(
    "getorderslist/outwardslist",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsPartnersGetOutwardList',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getBomList = createAsyncThunk(
    "getBomList/updatestock",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post(
                'cmsPartnerUpdateStockBOMList',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getBomListFetch = createAsyncThunk(
    "getBomListFetch/updatestockData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post(
                'cmsPartnerEMSUpdateStockFetch',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getBomListBBFetch = createAsyncThunk(
    "getBbBomListFetch/updatestockDataBB",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post(
                'cmsPartnerBBUpdateStockFetch',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getUpdateStockDetails = createAsyncThunk(
    "getupdateStock/orderTab",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsPartnerEMSUpdateStockGetComponents',
                request
            );
            console.log(response.data);
            return response.data;   
        }
        catch (error) {
            console.error(error);
        }
    }
);


export const saveUpdateStockDetails = createAsyncThunk(
    "saveUpdateStock/oartnerOrderTab",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post(
                'cmsPartnerEMSUpdateStockSaveComponents',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const saveBbUpdateStockDetails = createAsyncThunk(
    "saveBBUpdateStock/oartnerOrderTabBB",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post(
                'cmsPartnerBBUpdateStockSaveComponents',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getVendorOrder = createAsyncThunk(
    "VendorOrder/VendorOrderData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'Cms_vendor_get_detailsByName',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);


export const getVendorOrderInner = createAsyncThunk(
    "VendorOrder/VendorInnerOrderData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "po_id":requestBody.po_id
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
             'cmsVendorGetInnerOrderDetails',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getVendorApi = createAsyncThunk(
    "VendorOrder/VendorOrderIdData",
    async (requestBody) => {
        const request = {
            ...devEvent,
            "vendor_id" :requestBody.vendor_id
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsVendorGetOrderDetails',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getCategoryInfoDetails = createAsyncThunk(
    "getCategoryinfo/outwardslist",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2))
            const response = await instance.post(
                'CmsBomGetEmsOutwardDetailsbyId',
                request
            );
            // console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const sendFinalProducts = createAsyncThunk(
    "sendfinalproducts/partners",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        console.log(JSON.stringify(request, null, 2));
        try {
            
            const response = await instance.post(
                'cmsFinalProductCreateInPartners',
                request
            );
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

export const getFinalProducts = createAsyncThunk(
    "getfinalproductsinfo/partners",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post(
                'cmsGetFinalProductInPartners',
                request
            );
            // console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
);

// function for making API calls
const makeApiCall = async (url, request) => {
    try {
        const response = await instance.post(url, request);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Save sendboards
export const sendBoards = createAsyncThunk(
    "sendbordsinfo/sendBordsdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('partner_send_boards', request);
    }
);

// get SendBoard details

export const getSendboarddata = createAsyncThunk(
    "getBoardsdata/getSendBoarddata",
    async (requestBody) => {
        const request = {
           ...requestBody,           
            ...devEvent
        };
        return makeApiCall('partner_get_send_boards', request);
    }
);

export const SendPartnerSendBoards = createAsyncThunk("getSendBoards/getPartner_SendBoards_Filte_Get",
    async (requestBody) => {
        const request = {
           ...requestBody,           
            ...devEvent
        };
        return makeApiCall('cmsPartner_Save_Boards_Filter_Save', request);
    }
)

// export const getBoxBuildingInfoDetails = createAsyncThunk(
//     "boxBuilding/getBoxBuildingInfoDetails",
// async (requestBody) => {
//   return makeApiCall(boxBuildingInfoGetAPI, requestBody);
// }
// );

export const getBoxBuildingInfoDetails = createAsyncThunk(
    "getBoxBuildingData/getBoxBuildingInfoDetails",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('partner_send_box_building', request);
    }
);

export const partnerAvailableStock = createAsyncThunk(
    "partnerAvailableData/partnerAvailableStock",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('cmsPartnerGetStock', request);
    }
);

export const UpdatePartnersDoc = createAsyncThunk(
    "PartnersDoc/UpdatePartnersdocs",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('cmsUpdateSaveEMSDoc', request);
    }
);


export const getPartnersDoc = createAsyncThunk(
    "getPartnersDocs/getUpdatePartnersdocs",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('cmsGetEmsUploadDocs', request);
    }
);
//get sendboards kits
export const getSendboardsdatainbom = createAsyncThunk(
    "getBoardsdatainbom/getSendBoarddatainbom",
    async (requestBody) => {
        const request = {
           ...requestBody,           
            ...devEvent
        };
        return makeApiCall('cmsBomGetSendBoards', request);
    }
);

export const getFinalProductsData = createAsyncThunk(
    "getProductInfo/getfinalproducts",
    async (request) => {
        const requestBody = {
            ...devEvent,
            ...request
        }

        return makeApiCall('cmsBomFinalProductFilter', requestBody);
    }
)

export const getFinalBoardsDocuments = createAsyncThunk(
    "getFinalBoardsdata/getSendFinalBoarddata",
    async (requestBody) => {
        const request = {
           ...requestBody,           
            ...devEvent
        };
        return makeApiCall('cmsClientAssignDoc', request);
    }
);

export const finalProductFilterSave = createAsyncThunk(
    "FilterSave/SaveFinalProduct",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('FinalProductInternalFilterSave', request);
    }
);

export const finalProductReupload = createAsyncThunk(
    "Reupload/reuploadFinalProduct",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('FinalProductReuploadOfProducts', request);
    }
);

//bulkboardsupload
export const bulkBoardsupload = createAsyncThunk(
    "bulkUpload/bulkBoards",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('cmsBoardBulkUpload', request);
    }
);


//bulkFinalboardsupload
export const bulkfinalBoardsupload = createAsyncThunk(
    "bulkfinalUpload/bulkfinalBoards",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('cmsFinalProductBulkUpload', request);
    }
);

export const challandocs = createAsyncThunk(
    "finalUpload/challandoc",
    async (requestBody) => {
        const request = {
          ...requestBody,
            ...devEvent
        };
        return makeApiCall('cmsGetFinalProductDoc', request);
    }
);

const vendorSlice = createSlice({
    name: "vendorDetails",
    initialState,
    extraReducers: (builder) => {
        builder
            // Active vendors
            .addCase(fetchVendorList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(fetchVendorList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(fetchVendorList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            // create vendors
            .addCase(createVendor.pending, (state, action) => {
                // toast.loading("please wait, loading...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(createVendor.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.addVendorData = action.payload;
                state.hasError = false;
            })
            .addCase(createVendor.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            // Get Vendorscategorydetails
            .addCase(getVendorcategoryDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorcategoryDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorcategoryDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            // change vendor status
            .addCase(changeVendorStatus.pending, (state, action) => {
                // toast.loading("please wait, updating...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(changeVendorStatus.fulfilled, (state, action) => {
                toast.dismiss();
                // , {
                //     onClose: () => window.location.reload()
                // }
                toast.success(`${action.payload?.body}`);
                state.vendorStatus = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(changeVendorStatus.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })
            // get Vendor Edit Details
            .addCase(getVendorEditDetails.pending, (state, action) => {
                // toast.loading("please wait, fetching details...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorEditDetails.fulfilled, (state, action) => {
                toast.dismiss();
                state.editvendordata = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(getVendorEditDetails.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            // update vendor Details
            .addCase(updateVendorDetails.pending, (state, action) => {
                // toast.loading("please wait, updating details...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateVendorDetails.fulfilled, (state, action) => {
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
            .addCase(updateVendorDetails.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(updateVendorRating.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateVendorRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rating = action.payload;
                state.hasError = false;
            })
            .addCase(updateVendorRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(listSelection.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(listSelection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.typeofvendor = action.payload;
                state.hasError = false;
            })
            .addCase(listSelection.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
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
                toast.dismiss();
                // if(action.payload.statusCode === 200){
                //     toast.success(`${action.payload?.body}`);
                // }
                // else{
                //     toast.error(`${action.payload?.body}`);
                // }
                // toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.createPODetails = action.payload;
                state.hasError = false;
            })
            .addCase(createpo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getOrdersList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getOrdersList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderslistdata = action.payload;
                state.hasError = false;
            })
            .addCase(getOrdersList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getUpdateStockDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getUpdateStockDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.updateStockDetails = action.payload;
                state.hasError = false;
            })
            .addCase(getUpdateStockDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getCategoryInfoDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getCategoryInfoDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categoryinfolist = action.payload;
                state.hasError = false;
            })
            .addCase(getCategoryInfoDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


            //save send boards
            .addCase(sendBoards.pending, (state, action) => {
                // toast.loading("Creating, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(sendBoards.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.sendBoardsData = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(sendBoards.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })


            .addCase(sendFinalProducts.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(sendFinalProducts.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.finalProducts = action.payload;
                state.hasError = false;
            })
            .addCase(sendFinalProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getFinalProducts.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getFinalProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getProducts = action.payload;
                state.hasError = false;
            })
            .addCase(getFinalProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


            .addCase(getSendboarddata.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getSendboarddata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getSendBoardsdata = action.payload;
                state.hasError = false;
            })
            .addCase(getSendboarddata.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getBoxBuildingInfoDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBoxBuildingInfoDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.boxBuildingData = action.payload;
                state.hasError = false;
            })
            .addCase(getBoxBuildingInfoDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = false;
            })

            .addCase(getVendorOrder.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorOrderData = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getVendorApi.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorApi.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorOrderIdData = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorApi.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

            .addCase(getVendorOrderInner.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getVendorOrderInner.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorOrderInnerData = action.payload;
                state.hasError = false;
            })
            .addCase(getVendorOrderInner.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(partnerAvailableStock.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(partnerAvailableStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.partnerStock = action.payload;
                state.hasError = false;
            })
            .addCase(partnerAvailableStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })            
            .addCase(saveUpdateStockDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(saveUpdateStockDetails.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.ordersUpdateStock = action.payload;
                state.hasError = false;
            })
            .addCase(saveUpdateStockDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(saveBbUpdateStockDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(saveBbUpdateStockDetails.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.orderBBupdateStock = action.payload;
                state.hasError = false;
            })
            .addCase(saveBbUpdateStockDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getBomList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBomList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bomList = action.payload;
                state.hasError = false;
            })
            .addCase(getBomList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getBomListFetch.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBomListFetch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bomListData = action.payload;
                state.hasError = false;
            })
            .addCase(getBomListFetch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

            .addCase(getBomListBBFetch.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getBomListBBFetch.fulfilled, (state, action) => {
            //     toast.dismiss();
            //     if(action.payload.statusCode === 200){
            //       toast.success(`${action.payload?.body}`);
            //   }
            //   else{
            //       toast.error(`${action.payload?.body}`);
            //   }
                state.isLoading = false;
                state.bbBomListData = action.payload;
                state.hasError = false;
            })
            .addCase(getBomListBBFetch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(SendPartnerSendBoards.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(SendPartnerSendBoards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.partnersBoardKits = action.payload;
                state.hasError = false;
            })
            .addCase(SendPartnerSendBoards.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
            })

            //update partner docs
            .addCase(UpdatePartnersDoc.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(UpdatePartnersDoc.fulfilled, (state, action) => {
                toast.dismiss();               
                if(action.payload.statusCode === 200){
                          toast.success(`${action.payload?.body}`);
                      }
                      else{
                          toast.error(`${action.payload?.body}`);
                      }              
                state.isLoading = false;
                state.partnersdocs = action.payload;
                state.hasError = false;
            })
            .addCase(UpdatePartnersDoc.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            //get partners doc

            .addCase(getPartnersDoc.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getPartnersDoc.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getpartnersdocs = action.payload;
                state.hasError = false;
            })
            .addCase(getPartnersDoc.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

            //getSendboarddata in bom

            .addCase(getSendboardsdatainbom.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getSendboardsdatainbom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sendBoardsdatainbom = action.payload;
                state.hasError = false;
            })
            .addCase(getSendboardsdatainbom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getFinalProductsData.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getFinalProductsData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getFinalBoards = action.payload;
                state.hasError = false;
            })
            .addCase(getFinalProductsData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(finalProductFilterSave.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(finalProductFilterSave.fulfilled, (state, action) => {
                state.isLoading = false;
                state.saveFilter = action.payload;
                state.hasError = false;
            })
            .addCase(finalProductFilterSave.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(finalProductReupload.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(finalProductReupload.fulfilled, (state, action) => {
                toast.dismiss();               
                if(action.payload.statusCode === 200){
                          toast.success(`${action.payload?.body}`);
                      }
                      else{
                          toast.error(`${action.payload?.body}`);
                      }     
                state.isLoading = false;
                state.reUpload = action.payload;
                state.hasError = false;
            })
            .addCase(finalProductReupload.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            //bulkboards upload

            .addCase(bulkBoardsupload.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(bulkBoardsupload.fulfilled, (state, action) => {
                toast.dismiss();               
                if(action.payload.statusCode === 200){
                          toast.success(`${action.payload?.body}`);
                      }
                      else{
                          toast.error(`${action.payload?.body}`);
                      }              
                state.isLoading = false;
                state.bulkuploaddata = action.payload;
                state.hasError = false;
            })
            .addCase(bulkBoardsupload.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


            //bulk final boards upload

            .addCase(bulkfinalBoardsupload.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(bulkfinalBoardsupload.fulfilled, (state, action) => {
                toast.dismiss();               
                if(action.payload.statusCode === 200){
                          toast.success(`${action.payload?.body}`);
                      }
                      else{
                          toast.error(`${action.payload?.body}`);
                      }              
                state.isLoading = false;
                state.bulkfinaluploaddata = action.payload;
                state.hasError = false;
            })
            .addCase(bulkfinalBoardsupload.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getFinalBoardsDocuments.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getFinalBoardsDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.finalBoardsDocuments = action.payload;
                state.hasError = false;
            })
            .addCase(getFinalBoardsDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(challandocs.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(challandocs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.finaldoc = action.payload;
                state.hasError = false;
            })
            .addCase(challandocs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

    }

})

export const selectVendorData = state => state.vendorData.editvendordata;
export const selectLoadingStatus = state => state.vendorData.isLoading;
export const selectVendorsCategoryDetails = state => state.vendorData.data;
export const selectVendorRating = state => state.vendorData.rating;
export const selectVendorStatus = state => state.vendorData.vendorStatus;
export const selectVendorType = state => state.vendorData.typeofvendor;
export const setStatusUpdate = (state) => state.purchaseData.statusDetails;
export const setCreatePO = (state) => state.purchaseData.createPODetails
export const selectOrdersList = (state) => state.vendorData.orderslistdata;
export const selectCategoryInfoData = (state) => state.vendorData.categoryinfolist;
export const selectGetFinalProducts = (state) => state.vendorData.getProducts;
export const selectGetSendboards = (state) => state.vendorData.getSendBoardsdata;
export const selectGetBoxBuildingData = (state) => state.vendorData.boxBuildingData;
export const selectVendorOrderData = (state) => state.vendorData.vendorOrderData;
export const selectVendorApiData = (state) => state.vendorData.vendorOrderIdData;
export const selectVendorOrderInnerData = (state) => state.vendorData.vendorOrderInnerData;
export const selectpartnerAvailableStock = (state) => state.vendorData.partnerStock;
// export const selectVendorBoxBuildingInfo = (state) => state.vendorData.
export const selectUpdateStockDetailsData = (state) => state.vendorData.updateStockDetails;
export const selectSaveUpdateStock = (state) => state.vendorData.ordersUpdateStock;
export const selectBomList = (state) => state.vendorData.bomList;
export const selectBomListData = (state) => state.vendorData.bomListData;
export const selectBbBomListData = (state) => state.vendorData.bbBomListData;
export const selectBBSaveListData = (state) =>  state.vendorData.orderBBupdateStock;
export const selectPartnersdoc = (state) =>  state.vendorData.partnersdocs;
export const selectGetpartnersdoc = (state) =>  state.vendorData.getpartnersdocs;
export const selectGetPartnerBoardKits = (state) =>state.vendorData.partnersBoardKits;
export const selectGetSendboardsinbom = (state) => state.vendorData.sendBoardsdatainbom;
export const selectGetFinalBoards = (state) => state.vendorData.getFinalBoards;
export const selectSaveFinalFilter = (state) => state.vendorData.saveFilter;
export const selectReuploadbb = (state) => state.vendorData.reUpload;
export const selectGetFinalDocuments = (state) => state.vendorData.finalBoardsDocuments;
export const selectFinaldoc = (state) => state.vendorData.finaldoc;
export default vendorSlice.reducer;