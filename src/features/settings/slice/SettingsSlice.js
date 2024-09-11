import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey } from "../../../utils/common";
import { apikey } from "../../../utils/common";
import instance from "../../../utils/axios";

const initialState = {
    isLoading: false,
    isSelectLoading: false,
    hasError: false,
    error: "",
    addrolesdata:{},
    listrolesdata:{},
    permissiondata:{},
    permissiondatalist:{}
   
}

const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};
const devEvent = {
    "env_type": envtypekey
}

const makeApiCall = async (url, request) => {
    try {
        const response = await instance.post(url, request);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Save Roles
export const addRoles = createAsyncThunk(
    "addrole/addRoledata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('createUserRole', request);
    }
);
// listofRoles
export const listofRoles = createAsyncThunk(
    "listrole/listRoledata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('getUserRoles', request);
    }
);
// assign permissions
export const assignpermissions = createAsyncThunk(
    "rolepermission/rolepermissiondata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('assignPermissionsToRole', request);
    }
);

// list of permissions
export const listassignpermissions = createAsyncThunk(
    "listrolepermission/listrolepermissiondata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('getRolePermissions', request);
    }
);


const SettingsSlice = createSlice({
    name: "Settings",
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(addRoles.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(addRoles.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.statusCode === 200) {
                toast.success(action.payload.body || "Role added successfully");
            } else {
                toast.error(action.payload.body || "Error occurred");
            }
            state.addrolesdata = action.payload;
            state.hasError = false;
        })
        .addCase(addRoles.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            state.error = action.error;
            toast.error(action.payload?.body || "Failed to add role");
        })

        // list of roles
        .addCase(listofRoles.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(listofRoles.fulfilled, (state, action) => {
            state.isLoading = false;           
            state.listrolesdata = action.payload;
            state.hasError = false;
        })
        .addCase(listofRoles.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            state.error = action.error;
           
        })

        // assign permissions
        .addCase(assignpermissions.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(assignpermissions.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.statusCode === 200) {
                toast.success(action.payload.body || "Permissions assigned successfully");
            } else {
                toast.error(action.payload.body || "Error occurred");
            }
            state.permissiondata = action.payload;
            state.hasError = false;
        })
        .addCase(assignpermissions.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            state.error = action.error;
            toast.error(action.payload?.body || "Failed to assigned to Permissions");
        })

        // list of listassignpermissions
        .addCase(listassignpermissions.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        })
        .addCase(listassignpermissions.fulfilled, (state, action) => {
            state.isLoading = false;           
            state.permissiondatalist = action.payload;
            state.hasError = false;
        })
        .addCase(listassignpermissions.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            state.error = action.error;
           
        })
       
    }
});

export const selectLoadingState = state => state.settingsData.isLoading;
export const selectListofRoles = state =>  state.settingsData.listrolesdata;
export const selectListofeditPermissions  = state =>  state.settingsData.permissiondatalist;


export default SettingsSlice.reducer;