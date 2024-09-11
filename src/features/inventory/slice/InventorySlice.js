import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { localData } from "../../../utils/storage";
import { envtypekey, apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
const { getAllBomIdsinInventoryURL, getEstimateBomListURL, getPartsQuantityDataURL, getcmsInventoryClassificationPartsCountURL, getsubcategoryListURL, getstockInventoryURL, getStockDataURL } =  require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    isLoading: false,
    isSelectLoading: false,
    hasError: false,
    error: "",
    bomlist: {},
    estimatebomlist: {},
    subcategories: {},
    partsqty: {},
    stockData: {},
    stockResponse: {},
}

const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};
const devEvent = {
    "env_type": envtypekey
}

export const getAllBomIdsAPI = createAsyncThunk("Inventory/getallBomId's", 
async () => {
    try {   
        const response = await instance.post('cmsInventoryGetAllBomid', devEvent);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
)

export const getEstimateBomListAPI = createAsyncThunk("Inventory/Estimatebomlistdata", 
async (requestBody) => {
    const request = {
        ...devEvent,
        ...requestBody
    }
    try {
        // console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('cmsInventoryGetInnerBom', request);
            // console.log(response?.data);
            return response.data;
    }
    catch(error){
        console.error(error);
    }
}
)

export const getsubcategoryListAPI = createAsyncThunk("Inventory/classification_of_parts_search", 
async () => {
    try {
            const response = await instance.post('cmsClassificationPartsSearchSuggestion', devEvent);
            console.log(response?.data);
            return response.data;
    }
    catch(error){
        console.error(error);
    }
}
)


export const getStockDataAPI = createAsyncThunk("Inventory/getstockData", 
async (requestBody) => {
    const request = {
        ...requestBody,
        ...devEvent
    }
    try {
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('cmsGetInventoryStockDetailsModified', request);
            console.log(response?.data);
            return response.data;
    }
    catch(error){
        console.error(error);
    }
}
)

export const getclassificationofPartsQauntityAPI = createAsyncThunk("Inventory/classificationofPartsQauntity", 
async (requestBody) => {
    const request = {
        ...devEvent,
        ...requestBody
    }
    try {
        console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('cmsInventoryClassificationPartsCount', request);
            console.log(response?.data);
            return response.data;
    }
    catch(error){
        console.error(error);
    }
}
);


export const getStockInventory = createAsyncThunk("Inventory/get_stock_inventory", 
async (requestBody) => {
    const request = {
        ...devEvent,
        // "department": "Electronic"
        ...requestBody
    }
    try {
            const response = await instance.post('cmsGetInventoryStockDetails',  request);
            console.log(response?.data);
            return response.data;
    }
    catch(error){
        console.error(error);
    }
}
)

const InventorySlice = createSlice({
    name: "Inventory",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllBomIdsAPI.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(getAllBomIdsAPI.fulfilled, (state, action) => {
            state.isLoading = false;
            state.bomlist = action.payload;
            state.hasError = false;
        })
        .addCase(getAllBomIdsAPI.rejected, (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        })
        .addCase(getEstimateBomListAPI.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(getEstimateBomListAPI.fulfilled, (state, action) => {
            state.isLoading = false;
            state.estimatebomlist = action.payload;
            state.hasError = false;
        })
        .addCase(getEstimateBomListAPI.rejected, (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        })
        .addCase(getsubcategoryListAPI.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(getsubcategoryListAPI.fulfilled, (state, action) => {
            state.isLoading = false;
            state.subcategories = action.payload;
            state.hasError = false;
        })
        .addCase(getsubcategoryListAPI.rejected, (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        })
        .addCase(getclassificationofPartsQauntityAPI.pending, (state, action) => {
            state.isSelectLoading = true;
            state.hasError = false;
        })
        .addCase(getclassificationofPartsQauntityAPI.fulfilled, (state, action) => {
            state.isSelectLoading = false;
            state.partsqty = action.payload;
            state.hasError = false;
        })
        .addCase(getclassificationofPartsQauntityAPI.rejected, (state, action) => {
            state.hasError = true;
            state.isSelectLoading = false;
        })

        .addCase(getStockInventory.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(getStockInventory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.stockData = action.payload;
            state.hasError = false;
        })
        .addCase(getStockInventory.rejected, (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        })
        .addCase(getStockDataAPI.pending, (state, action) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(getStockDataAPI.fulfilled, (state, action) => {
            state.isLoading = false;
            state.stockResponse = action.payload;
            state.hasError = false;
        })
        .addCase(getStockDataAPI.rejected, (state, action) => {
            state.hasError = true;
            state.isLoading = false;
        })
    }
})


export const selectIsLoadingInventory = state => state.InventoryData.isLoading; 
export const selectAllBomIdsList = state => state.InventoryData.bomlist;
export const selectEstimateBomListData = state => state.InventoryData.estimatebomlist;
export const selectsubcategoriesListData= state => state.InventoryData.subcategories;
export const selectPartsQuantity = state => state.InventoryData.partsqty;
export const selectStockData= state => state.InventoryData.stockData;
export const selectStockResponse = state => state.InventoryData.stockResponse;
export const selectIsSelectLoading = state => state.InventoryData.isSelectLoading;
export default InventorySlice.reducer;