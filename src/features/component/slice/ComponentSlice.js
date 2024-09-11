import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";
import {localData} from "../../../utils/storage";
import { envtypekey, apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
import { getComponentsActivityDetailsURL } from "../../../utils/constant.development";
const { addNewPartURL, generatePTGPartNumberURL, addCategoriesURL, getCategoriesURL, getProductAttributesURL, updateCategoryURL, deleteProductURL, updateCategoryImageURL, deleteCategoryURL, updateComponentDetailsURL, getEditComponentDataURL, subCategoriesURL,uploadcsvURL, getvendorDetailsURL, getTop5VendorsDetailsURL, getAllCategoriesByDepartment, getAllCategories, checkcmsComponentReplacementPartURL,componentGlobalSearchURL,getRackDetailsURL } = require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    data: {},
    addnewPart: {},
    partNoData: {},
    category: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',
    productAttributes: [],
    subCategories: [],
    deleteCategory: {},
    editProductAttributes:{},
    vendorDetails: {},
    top5VendorsDetails: {},
    categories: {},
    rpl_prt_number: {},
    rackData: {},
    activity_details: {},
    damaged_qty: {}
}
// console.log(initialState.editProductAttributes.body);
const devEvent = {
    "env_type": envtypekey
}

const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

function createAsyncThunkHelper(name, url) {
    return createAsyncThunk(name, async (requestObj) => {
      const request = { ...devEvent, ...requestObj };
      try {
        // console.log(JSON.stringify(request, null, 2));
        const response = await instance.post(url, request);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    });
  }
// export const addNewPart = createAsyncThunkHelper("part/addNewPart", addNewPartURL)
export const addNewPart = createAsyncThunk(
    "part/addNewPart",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            ...requestBody
        }
        try {
            const response = await instance.post('CmsInventoryCreateComponent', request);
            console.log(response?.data);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
);

export const generatePTGPartNumber = createAsyncThunkHelper("partNumber/generatePartNumber", 'CmsInventoryGeneratePtgPartNumber');

export const getCategoryinAddComponent = createAsyncThunk(
    "addComponent/components",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            "ct_type": requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('cmsCategoriesGetAllCategoresByDepartment', request);
            console.log(response?.data);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
);
// export const generatePTGPartNumber = createAsyncThunk(
//     "partNumber/generatePartNumber",
//     async (requestBody) => {
//         try {
//             let request = {
//                 "categoryName": requestBody.category_name,
//                 "mfrPartNumber": requestBody.mfr_part_number,
//                 "sub_category": requestBody.sub_category,
//                 ...devEvent
//             }
//             // console.log(JSON.stringify(request, null, 2));
//             const response = await axios.post(generatePTGPartNumberURL, request);
//             return response.data;

//         } catch (err) {
//             console.error(err);
//         }
//     }
// );

export const addCategories = createAsyncThunk(
    "categories/addCategories",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            ...requestBody
        }
        
        try {
            // console.log(JSON.stringify(requestBody, null, 2));
            const response = await instance.post('CmsCategoryAddMetadata', request);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)
// export const getCategories = createAsyncThunk(
//     "categories/getCategories",
//     async () => {
//         try {
//             const response = await axios.post(getCategoriesURL, {
//                 "type": "categories",
//                 ...devEvent
//             });
//             return response.data;
//         } catch (err) {
//             console.error(err);
//         }
//     }
// )

export const getCategories = createAsyncThunk(
    "categories/getCategories",
    async (requestBody) => {
        const request = {
            "ct_type": requestBody?.ct_type,
            ...devEvent
        }
        try {
            const response = await instance.post('cmsCategoriesGetAllCategoresByDepartment',request);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)

export const getProductAttributes = createAsyncThunk(
    "productAttributes/getAttributes",
    async (requestBody) => {
        const request = {
            ctgr_name: requestBody.ctgr_name,
            ctgr_id: requestBody.ctgr_id,
            ...devEvent
        }
        try {
            // console.log(JSON.stringify(request, null, 2))
            const response = await instance.post('CmsCategoryGetMetadata', request);
            console.log(JSON.stringify(response, null, 2))
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const getProductList = createAsyncThunk(
    "productList/getProductList",
    async (requestBody) => {
    
        try {
            const response = await instance.post('cmsInventoryGetAllComponentsForCategory',
                {
                    "category_name": requestBody.category_name,  
                    "category_id":requestBody.category_id,
                    "department"    :requestBody.department,              
                    ...devEvent
                });
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            ...requestBody
        }
        try {
            const response = await instance.post('CmsInventoryDeleteComponent', request);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)

export const rackDetails = createAsyncThunk(
    "componentrack/rackDetailslist",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            "department": requestBody.department,
            "cmpt_id" : requestBody.cmpt_id
        }
        try {
            const response = await instance.post('cmsComponentGetRackDetails', request);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)


export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (requestBody) => {
        const request ={
            ...devEvent, 
            ...requestBody
        }
        try {
            // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('CmsCategoryEditMetadata', request);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const replaceCategoryImage = createAsyncThunk(
    "categoryImage/updateCategoryImage",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            ...requestBody
        }
        try {
            const response = await instance.post('CmsCategoryReplaceImage', request);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (requestBody) => {
        const request ={
            ...devEvent , 
             ...requestBody
        }
        try {
            const response = await instance.post('cmsCategoryDelete', request);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)

export const getEditComponentData = createAsyncThunk(
    "editData/getEditComponentData",
    async (request) => {
     
        const editCategoryevent = {
            "cmpt_id": request.cmpt_id,
            "ctgr_name": request.ctgr_name,
            "department":request.department,
            ...devEvent,
        }
        try {
            const response = await instance.post('CmsInventoryGetAllData', editCategoryevent);
            console.log(response.data, "=========");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const updateComponentDetails = createAsyncThunk(
    "update/EditComponent",
    async (requestBody) => {
        const request ={
            ...devEvent , 
            ...requestBody
        }
        try {
            const response = await instance.post('CmsInventoryEditDetails', request);
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const fetchProductDetails = createAsyncThunk(
    "productDetails/fetchProduct",
    async (requestBody) => {
        const request = {
            "cmpt_id": requestBody.cmpt_id,
            "ctgr_name": requestBody.ctgr_name,
            "department": requestBody.department,
            ...devEvent
        }
        try {
            const response = await instance.post('CmsInventoryGetAllData', request);
            // console.log(response.data, "fetchProductDetails");
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const getsubCategories = createAsyncThunk(
    "categories/subCategories",
    async (request) => {
        const requestBody = {
            "ctgr_id": request,
            ...devEvent
        }
        try {
            const response = await instance.post('CmsSubCategoriesGetByCategoryName', requestBody);
            console.log(response.data, "Response");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const uploadCsv = createAsyncThunk(
    "csvUpload/csvUploaddetails",
    async (requestEvent) => {
        const request = {
             ...requestEvent,
            ...devEvent
        }
        try {
            const response = await instance.post('CmsInventoryUploadCsv', request);
            return response.data;
        }
        catch (error) {
            console.error(error);
        }
    }
)

export const getvendorDetails = createAsyncThunk(
    "vendor/vendorDetails",
    async (requestEvent) => {
        const request = {
            "cmpt_id":requestEvent.cmpt_id,           
            ...devEvent
        }
        try {
            const response = await instance.post('cmsVendorGetByComponentId', request);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const checkReplacementprtnumAPI = createAsyncThunk(
    "component/checkrplprtnum",
    async (requestEvent) => {
        const request = {
            rpl_prt_num: requestEvent,
            ...devEvent
        }
        try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('cmsComponentReplacementPart', request);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const getTop5Vendors = createAsyncThunk(
    "top5vendors/vendorDetails",
    async (requestBody) =>{
        const event = {            
            "cmpt_id":requestBody.cmpt_id,            
            ...devEvent
        }
        try {
            const response = await instance.post('cmsVendorGetTopFive', event);
            // console.log(response.data, "Top 5555");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)

export const globalSearch = createAsyncThunk(
    "search/globalSearch",
    async (requestBody) => {
        const request = {
            // "ct_type": requestBody?.ct_type,
            // "search_query": "cha",
            ...devEvent,
            ...requestBody
        }
        try {
            const response = await instance.post('cmsComponentGlobalSearch',request);
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }
)

export const getComponentActivityDetails = createAsyncThunk(
    "getActivityDetails",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try{
            const Response = await instance.post("ComponentActivityDetails", request);
            return Response.data;
        } 
        catch(err){
            console.log(err);
        }
    }
)

export const InventoryUpdateStockDetails = createAsyncThunk(
    "InventoryUpdateStockDetails",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try{
            const Response = await instance.post("CmsInventoryUpdateStock", request);
            console.log(Response?.data);
            return Response.data;
        } 
        catch(err){
            console.log(err);
        }
    }
)
export const DamagedQtyAPI = createAsyncThunk(
    "GetInwardIdsForDamaged",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try{
            const Response = await instance.post("CmsInventoryGetInwardIdsForDamaged", request);
            console.log(Response?.data);
            return Response.data;
        } 
        catch(err){
            console.log(err);
        }

    }
)

export const resetEditProductAttributes = createAction("component/resetproductAttributesState");

const componentSlice = createSlice({
    name: "addComponent",
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(resetEditProductAttributes, (state, action) => {
            state.editProductAttributes = {}
        })
            .addCase(addNewPart.pending, (state, action) => {
                //toast.loading("Loading, Please wait...")
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addNewPart.fulfilled, (state, action) => {
                toast.dismiss();
                // toast.success(`${action.payload?.body}`);
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.addnewPart = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(addNewPart.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(getCategoryinAddComponent.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getCategoryinAddComponent.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(getCategoryinAddComponent.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(generatePTGPartNumber.pending, (state, action) => {
                
                state.hasError = false;
            })
            .addCase(generatePTGPartNumber.fulfilled, (state, action) => {
                state.partNoData = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(generatePTGPartNumber.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })
            .addCase(addCategories.pending, (state, action) => {
                toast.loading("Loading, Please Wait...");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addCategories.fulfilled, (state, action) => {
                toast.dismiss();
                // toast.success(`${action.payload?.body}`);
                if(action.payload?.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false;
                state.showToast = true;
                state.message = action.payload?.body;
            })
            .addCase(addCategories.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body;
                state.showToast = false;
                state.message = action.error?.message;
            })
            .addCase(getCategories.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.category = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(getProductAttributes.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getProductAttributes.fulfilled, (state, action) => {
                state.productAttributes = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getProductAttributes.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(updateCategory.pending, (state, action) => {
                // toast.loading("Updating the Changes");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(updateCategory.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(getProductList.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getProductList.fulfilled, (state, action) => {
                state.category = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getProductList.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(deleteProduct.pending, (state, action) => {
                // toast.loading("deletion in progress..");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                  }
                  else{
                      toast.error(`${action.payload?.body}`);
                  }
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(replaceCategoryImage.pending, (state, action) => {
               // toast.loading("updation in progress..");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(replaceCategoryImage.fulfilled, (state, action) => {
                toast.dismiss();
                // toast.success(`${action.payload?.body}`);
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(replaceCategoryImage.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(deleteCategory.pending, (state, action) => {
                // toast.loading("deletion in progress..");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                toast.dismiss();
                // toast.success(`${action.payload?.body}`);
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.deleteCategory = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(getEditComponentData.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getEditComponentData.fulfilled, (state, action) => {
                state.editProductAttributes = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(getEditComponentData.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
                state.hasError = true;
            })
            .addCase(updateComponentDetails.pending, (state, action) => {
                // toast.loading("Updating , Please wait..");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateComponentDetails.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                toast.success(`${action.payload?.body}`, {
                    // onClose: () => window.location.reload()
                });
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(updateComponentDetails.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.hasError = true;
                state.error = action.error;
            })
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })
            .addCase(getsubCategories.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getsubCategories.fulfilled, (state, action) => {
                state.subCategories = action.payload?.body;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getsubCategories.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload?.body
            })

            .addCase(uploadCsv.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(uploadCsv.fulfilled, (state, action) => {
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.isLoading = false;
                state.data = action.payload;
                state.hasError = false;
            })
            .addCase(uploadCsv.rejected, (state, action) => {
                toast.error(`${action.payload?.body}`)
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getvendorDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getvendorDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendorDetails = action.payload;
                state.hasError = false;
            })
            .addCase(getvendorDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getTop5Vendors.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getTop5Vendors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.top5VendorsDetails = action.payload;
                state.hasError = false;
            })
            .addCase(getTop5Vendors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(checkReplacementprtnumAPI.pending, (state) => {
                state.hasError = false;
            })
            .addCase(checkReplacementprtnumAPI.fulfilled, (state, action) => {
                state.rpl_prt_number = action.payload;
                state.hasError = false;
            })
            .addCase(checkReplacementprtnumAPI.rejected, (state, action) => {
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(globalSearch.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(globalSearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.globalSearchdata = action.payload;
                state.hasError = false;
            })
            .addCase(globalSearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

            .addCase(rackDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(rackDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rackData = action.payload;
                state.hasError = false;
            })
            .addCase(rackDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })
            .addCase(getComponentActivityDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getComponentActivityDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activity_details = action?.payload;
                state.hasError = false;
            })
            .addCase(getComponentActivityDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action?.payload;
                state.hasError = true;
            })
            .addCase(InventoryUpdateStockDetails.pending, (state) => {
                state.hasError = false;
            })
            .addCase(InventoryUpdateStockDetails.fulfilled, (state, action) => {
                if(action.payload?.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.hasError = false;
            })
            .addCase(InventoryUpdateStockDetails.rejected, (state, action) => {
                state.error = action?.payload;
                state.hasError = true;
            })
            .addCase(DamagedQtyAPI.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(DamagedQtyAPI.fulfilled, (state, action) => {
                state.isLoading = false;
                state.damaged_qty = action?.payload;
                state.hasError = true;
            })
            .addCase(DamagedQtyAPI.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = action?.error;
            })
            
    }
});

export const selectComponents = state => state.componentData.data;
export const selectAddNewPart = state => state.componentData.addnewPart;
export const selectLoadingState = state => state.componentData.isLoading;
export const selectErrorState = state => state.componentData.hasError;
export const selectErrorMessage = state => state.componentData.error;
export const selectPTGPartNumber = state => state.componentData.partNoData;
export const selectCategory = state => state.componentData.category;
export const selectToast = state => state.componentData.showToast;
export const toastMessage = state => state.componentData.message;
export const selectProductAttributes = state => state.componentData.productAttributes;
export const selectEditComponent = state => state.componentData.editProductAttributes;
export const selectProductDetails= state => state.componentData.data;
export const selectSubCategories = state => state.componentData.subCategories;
export const selectVendorDetails = state => state.componentData.vendorDetails;
export const selectTop5vendorDetails = state => state.componentData.top5VendorsDetails;
export const selectDeleteCategory = state => state.componentData.deleteCategory;
export const selectCategories = state => state.componentData.categories;
export const selectListDelete = state => state.componentData.data;
export const selectReplacementprtnum = state => state.componentData.rpl_prt_number;
export const selectedGlobalSearch = state => state.componentData.globalSearchdata;
export const selectRackDetails = state => state.componentData.rackData;
export const selectActivityDetails = state => state.componentData.activity_details;
export const selectDamagedData = state => state.componentData.damaged_qty;
export default componentSlice.reducer;