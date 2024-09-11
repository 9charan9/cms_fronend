import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { localData } from "../../../utils/storage";
import { envtypekey } from "../../../utils/common";
import { apikey } from "../../../utils/common";
import instance from "../../../utils/axios";
const { getClientBomSearchSuggestion, addClientSearchAddBom, addClientURL, getClientList, getClientInnerList, updateClientURL,clientUploadURL,cmsGetAgainstPoURL } = require("../../../utils/constant." + (process.env.REACT_APP_ENV || apikey) + ".js");

const initialState = {
    data: {},
    isLoading: false,
    hasError: false,
    error: "",
    showToast: false,
    message: '',
    addbomdata: {},
    clientdata: {},
    clientlist: {},
    clentinnerdat:{},
    clientupdatedata:{},
    clientexceldata:{},
    getClientDetails : {},
    getProducts : {}

}
const devEvent = {
    "env_type": envtypekey
}
const token=localData.get("TOKEN");
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

// Helper function for making API calls
//   const response = await instance.post('cmsCategoriesGetAllCategoresByDepartment', request, config);
const makeApiCall = async (url, request) => {
    try {
        const response = await instance.post(url, request);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Search filter
export const getSearchcategory = createAsyncThunk(
    "clientDetails/searchBom",
    async (requestBody) => {
        const request = {
            "bom_search": requestBody.bom_search,
            ...devEvent
        };
        return makeApiCall('client_bom_search_suggestion', request);
    }
);

// Add bom to table
export const getSearchcomponentdata = createAsyncThunk(
    "clientDetailsbomadd/searchBomadd",
    async (requestBody) => {
        const request = {
            "bom_name": requestBody.bom_name,
            ...devEvent
        };
        return makeApiCall('client_search_add_bom', request);
    }
);

// Save client
export const addClient = createAsyncThunk(
    "add/addClientdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('create_client', request);
    }
);

// Update client
export const updateClient = createAsyncThunk(
    "edit/editClientdata",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('edit_client', request);
    }
);

// Client list
export const listSelection = createAsyncThunk(
    "clientlist/getList",
    async (requestobj) => {
        const request = {
            ...devEvent,
            ...requestobj
        };
        return makeApiCall('client_get_all_data', request);
    }
);

// client Inner details

export const getClinetInnerdata = createAsyncThunk(
    "clientInnerdata/getClinetInnerdata",
    async (requestBody) => {
        const request = {
            "client_id": requestBody.client_id,
            ...devEvent
        };
        return makeApiCall('client_get_inner_details_by_id', request);
    }
);


export const SaveclientexcelData = createAsyncThunk(
    "clientexcel/saveclientexcel",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }
        try{
            console.log(JSON.stringify(request, null, 2));
            const response = await instance.post('client_upload_po', request);
            console.log(response.data);
            return response.data;
        }
        catch(error){
            console.error(error);
        }
    }
)


// Against PO
export const getagainstPO = createAsyncThunk(
    "add/againstPO",
    async (requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall('cmsGetAgainstPo', request);
    }
);

// get client orderDetails
export const  getClientOrderDetails = createAsyncThunk(
    "get/clientSetails",
    async(requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        };
        return makeApiCall("cmsGetClientAssignPoDetails",request)
    }
)

//sending selectedItems 
export const getFinalProductsDetails = createAsyncThunk(
    "getFinalProduct/client",
    async(requestBody) => {
        const request = {
            ...devEvent,
            ...requestBody
        }

        try {
            const response = await instance.post("cmsStatusClientAssignPoDetails",request);
            return response.data
        }
        catch (error) {
            console.error(error)
        }
    }
)

//search filter
// export const getSearchcategory = createAsyncThunk(
//     "clientDetails/searchBom",
//     async (requestBody) => {
//         const request = {
//             "bom_search": requestBody.bom_search,
//             ...devEvent
//         }
//         try {
//             const response = await axios.post(getClientBomSearchSuggestion, request);
//             return response.data;
//         }
//         catch (error) {
//             console.error(error);
//         }
//     }
// )

// //add bom to table
// export const getSearchcomponentdata = createAsyncThunk(
//     "clientDetailsbomadd/searchBomadd",
//     async (requestBody) => {
//         const request = {
//             "bom_name": requestBody.bom_name,
//             ...devEvent
//         }
//         try {
//             const response = await axios.post(addClientSearchAddBom, request);
//             return response.data;
//         }
//         catch (error) {
//             console.error(error);
//         }
//     }
// )
// //save client
// export const addClient = createAsyncThunk(
//     "add/addClientdata",
//     async (requestBody) => {
//         const request = {
//             ...devEvent,
//             ...requestBody
//         }
//         try {
//             const response = await axios.post(addClientURL, request);
//             return response.data;
//         }
//         catch (error) {
//             console.error(error);
//         }
//     }
// )

// // client list 
// export const listSelection = createAsyncThunk(
//     "clientlist/getList",
//     async (requestobj) => {
//         const request = {
//             ...devEvent,
//             ...requestobj
//         }
//         try {
//             const response = await axios.post(getClientList, request);
//             // console.log(response.data)
//             return response.data;
//         } catch (error) {
//             console.error(error);
//         }
//     }
// )

const clientSlice = createSlice({

    name: "clientDetails",
    initialState,
    extraReducers: (builder) => {
        builder

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
            //search add bom details
            .addCase(getSearchcomponentdata.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getSearchcomponentdata.fulfilled, (state, action) => {
                state.addbomdata = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getSearchcomponentdata.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })

            //save client
            .addCase(addClient.pending, (state, action) => {
                // toast.loading("Creating, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.clientdata = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(addClient.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })

            //get list

            .addCase(listSelection.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(listSelection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientlist = action.payload;
                state.hasError = false;
            })
            .addCase(listSelection.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

              //get inner list

              .addCase(getClinetInnerdata.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getClinetInnerdata.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clentinnerdat = action.payload;
                state.hasError = false;
            })
            .addCase(getClinetInnerdata.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

              //update client
              .addCase(updateClient.pending, (state, action) => {
                // toast.loading("Creating, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                toast.dismiss();
                if(action.payload.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                state.clientupdatedata = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(updateClient.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })


            //excel upload
            .addCase(SaveclientexcelData.pending, (state, action) => {
                state.hasError = false;
            })
            .addCase(SaveclientexcelData.fulfilled, (state, action) => {
                if(action.payload?.statusCode === 200){
                    toast.success(`${action.payload?.body}`);
                }
                else{
                    toast.error(`${action.payload?.body}`);
                }
                
                state.clientexceldata = action.payload;
                state.hasError = false;
                state.isLoading = false;
            })
            .addCase(SaveclientexcelData.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })

            // Against po
            .addCase(getagainstPO.pending, (state, action) => {
                // toast.loading("Creating, Please Wait....");
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getagainstPO.fulfilled, (state, action) => {
                // toast.dismiss();
                // toast.success(`${action.payload?.body}`);
                state.againstPo = action.payload;
                state.isLoading = false;
                state.hasError = false
            })
            .addCase(getagainstPO.rejected, (state, action) => {
                toast.dismiss();
                toast.error(`${action.payload?.body}`);
                state.hasError = true;
                state.isLoading = false;
                state.error = action.payload.body
            })

            //getClientOredrDetails 
            .addCase(getClientOrderDetails.pending,(state,action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getClientOrderDetails.fulfilled,(state,action) => {
                state.isLoading= false;
                state.hasError = false;
                state.getClientDetails = action.payload
            })
            .addCase(getClientOrderDetails.rejected, (state,action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


            .addCase(getFinalProductsDetails.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(getFinalProductsDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.getProducts = action.payload;
                state.hasError = false;
            })
            .addCase(getFinalProductsDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hasError = true;
            })


    }

})
export const selectLoadingState = state => state.clientData.isLoading;
export const selectSearchCategory = state => state.clientData.data;
export const selectSearchcomponentdata = state => state.clientData.addbomdata;
export const selectAddClientDetails = state => state.clientData.clientdata;
export const selectGetClientList = state => state.clientData.clientlist;
export const selectGetClientInnerdata = state => state.clientData.clentinnerdat;
export const selectUpdateClient = state => state.clientData.clientupdatedata;
export const selectAgainstPO = state =>state.clientData.againstPo;
export const selectClientDetails = state => state.clientData.getClientDetails;
export const selectGetFinalProduct = state => state.clientData.getProducts

export default clientSlice.reducer;