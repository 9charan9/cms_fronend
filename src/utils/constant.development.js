// //////////////////==============COMPONENT TAB URL'S=============/////////////////////////////////////////
export const addNewPartURL = "https://ruee1p6oqh.execute-api.us-west-1.amazonaws.com/CmsInventoryCreateComponent/";   ///.............
export const generatePTGPartNumberURL = "https://n9pstouzx7.execute-api.us-west-1.amazonaws.com/CmsInventoryGeneratePtgPartNumber/"; //............
export const addCategoriesURL = "https://8ukd1wjlxl.execute-api.us-west-1.amazonaws.com/CmsCategoryAddMetadata/";
export const getCategoriesURL = "https://af29sx3k66.execute-api.us-west-1.amazonaws.com/cmsInventoryGetAllComponentsForCategory"  //............ changed
export const getProductAttributesURL = "https://t1y3lcsx19.execute-api.us-west-1.amazonaws.com/CmsCategoryGetMetadata/";
export const updateCategoryURL = "https://9ot4agiyr8.execute-api.us-west-1.amazonaws.com/CmsCategoryEditMetadata/";
export const updateCategoryImageURL="https://zman2wqvd0.execute-api.us-west-1.amazonaws.com/CmsCategoryReplaceImage/"; // changed
export const deleteCategoryURL="https://cruwc975nh.execute-api.us-west-1.amazonaws.com/cmsCategoryDelete/";   // changed
export const updateComponentDetailsURL = "https://jfxknqqym1.execute-api.us-west-1.amazonaws.com/CmsInventoryEditDetails/";
export const subCategoriesURL = "https://0reubxpjqc.execute-api.us-west-1.amazonaws.com/CmsSubCategoriesGetByCategoryName/";
export const getTop5VendorsDetailsURL = "https://8b40ezn8gh.execute-api.us-west-1.amazonaws.com/cmsVendorGetTopFive/"; // changed
export const deleteProductURL="https://zz0mpy4u8a.execute-api.us-west-1.amazonaws.com/CmsInventoryDeleteComponent/";   ///............ changed
export const getvendorDetailsURL = "https://l4wffga166.execute-api.us-west-1.amazonaws.com/cmsVendorGetByComponentId/";  //............  changed
export const getAllCategoriesByDepartment = "https://xeez7ngoh1.execute-api.us-west-1.amazonaws.com/cmsCategoriesGetAllCategoresByDepartment";
export const checkcmsComponentReplacementPartURL = "https://l1zjp61tsh.execute-api.us-west-1.amazonaws.com/cmsComponentReplacementPart/";
export const getAllCategories = "https://xeez7ngoh1.execute-api.us-west-1.amazonaws.com/cmsCategoriesGetAllCategoresByDepartment";
export const getComponentsActivityDetailsURL = "http://172.11.7.217:8000/ComponentActivityDetails";
// ///////==== below one is duplicate api's=====//////
// export const fetchProductDetailsURL ="https://345qhjbuw8.execute-api.us-west-1.amazonaws.com/CmsInventoryGetAllData/"; // changed 
export const getEditComponentDataURL = "https://345qhjbuw8.execute-api.us-west-1.amazonaws.com/CmsInventoryGetAllData/";
export const componentGlobalSearchURL="https://anwozeavr1.execute-api.us-west-1.amazonaws.com/cmsComponentGlobalSearch/"

// /////////////////////======================= BOM TAB URLS'S =======================//////////////////////////////////////
export const bomListURL = "https://5k5gu87xec.execute-api.us-west-1.amazonaws.com/CmsBomGetAllData/";
export const updatedBomDetailsURL = "https://81q1vfwjg8.execute-api.us-west-1.amazonaws.com/CmsBomEdit/";
export const searchCategoryURL = "https://ghob1log7g.execute-api.us-west-1.amazonaws.com/CmsInventorySearchSujjestion/";  //...................
export const searchComponentdataURL = "https://ihdimbe1me.execute-api.us-west-1.amazonaws.com/CmsInventorySearchComponent/";   //...................
export const getBomEditDetailsURL = "https://r82l5jpgsg.execute-api.us-west-1.amazonaws.com/CmsBomGetDetailsByName/";  //........
export const addBOMURL = "https://wqoeiy8957.execute-api.us-west-1.amazonaws.com/CmsBomCreate/";    ///...................
export const deleteBOMURL = "https://azb64j8kuk.execute-api.us-west-1.amazonaws.com/CmsBomDelete/";   //..............
export const getCmsBomGetInnerDetailsAPI = "https://m4odchisg7.execute-api.us-west-1.amazonaws.com/CmsBomGetInnerDetailsAPI"; 
export const savepricebomURL = "https://gi7izn7yu1.execute-api.us-west-1.amazonaws.com/cmsBomPriceBom";
export const getAllVendorDataURL = "https://50wxmskd62.execute-api.us-west-1.amazonaws.com/CmsVendorGetAllData/";
export const AssigntoVendorsURL = "https://gjq3d36fkl.execute-api.us-west-1.amazonaws.com/bomAssignToVendorAPI";
export const getPriceBomdatabyidURL = "https://0f0c9dxgbk.execute-api.us-west-1.amazonaws.com/cmsBomGetPriceBomDetailsById";
export const getPatnersListURL= "https://0v4a981cyf.execute-api.us-west-1.amazonaws.com/cmsAssignToEMSGetPartnersIDAPI";
export const saveAssignemsURL = "https://c0pymcb2w2.execute-api.us-west-1.amazonaws.com/cmsAssignToEMSAPI";
export const allOutwardListURL= "https://l3nlibz5y8.execute-api.us-west-1.amazonaws.com/CmsBomGetAllOutwardList";
export const outwardBlnceDetailsURL= "https://1zmhj2bljc.execute-api.us-west-1.amazonaws.com/CmsOutwardGetBalanceComponentDetails";
export const outwardDetailsbyIdURL= "https://58dn35xcwd.execute-api.us-west-1.amazonaws.com/CmsBomGetEmsOutwardDetailsbyId";
export const sendBalanceKitCreate= "https://bzmwjpqn0f.execute-api.us-west-1.amazonaws.com/CmsEmsSendBalanceKitCreate";
export const cmsFinalProductsURL = "https://knq2s0zc97.execute-api.us-west-1.amazonaws.com/cmsFinalProductCreateInPartners/";
export const cmsGetFinalProductsURL = "https://9mc02m024k.execute-api.us-west-1.amazonaws.com/cmsGetFinalProductInPartners/";
export const cmsBomGetClientInfoURL= "https://b5kjryfsv8.execute-api.us-west-1.amazonaws.com/cmsBomGetFinalProductInfo/"
export const cmsCreateClientURL= "https://np96unf2d9.execute-api.us-west-1.amazonaws.com/cmsCreateClientInBom/"
export const cmsGetAgainstPoURL = "https://5axtqelzb0.execute-api.us-west-1.amazonaws.com/cmsGetAgainstPo/";
// ///////////////////========================VENDOR TAB URL'S =======================////////////////////////////////////////////////

export const vendorListApi = "https://50wxmskd62.execute-api.us-west-1.amazonaws.com/CmsVendorGetAllData/";
//below one is duplicate
// export const vendorCategorydetailsApi ="https://1ki8p2m9y7.execute-api.us-west-1.amazonaws.com/CmsVendorGetDetailsByName/"; /// changed
export const createVendorURL="https://nok47crzue.execute-api.us-west-1.amazonaws.com/CmsVendorCreate/";
// export const changeVendorStatusURL="https://guu87d18n0.execute-api.us-west-1.amazonaws.com/CmsVendorUpdateStatus/";
// export const updateVendorRatingURL = "https://zxlv1lxrii.execute-api.us-west-1.amazonaws.com/CmsVendorAddRating/"; changed
export const updateVendorRatingURL = "https://o18blwg70a.execute-api.us-west-1.amazonaws.com/CmsVendorAddRating/";
export const uploadcsvURL = "https://b9fvpcsvbl.execute-api.us-west-1.amazonaws.com/CmsInventoryUploadCsv/";   //..............
export const getEditVendorDetailsURL="https://1ki8p2m9y7.execute-api.us-west-1.amazonaws.com/CmsVendorGetDetailsByName/";  ////..................
export const updateVendorDetailsURL="https://5hac4qcfod.execute-api.us-west-1.amazonaws.com/cmsEditVendorDetails/";  //.................
            //new figma 1.3 //
export const vendorCreationURL= "https://nok47crzue.execute-api.us-west-1.amazonaws.com/CmsVendorCreate/"
//below one is duplicate
// export const listTypeSelectionURL= "https://50wxmskd62.execute-api.us-west-1.amazonaws.com/CmsVendorGetAllData/"
export const changeVendorStatusURL="https://guu87d18n0.execute-api.us-west-1.amazonaws.com/CmsVendorUpdateStatus/";
export const getPartnersOrderslistURL = "https://w9zlr9k52i.execute-api.us-west-1.amazonaws.com/cmsPartnersGetOutwardListAPI";
export const getCategoryInfoDataURL = "https://58dn35xcwd.execute-api.us-west-1.amazonaws.com/CmsBomGetEmsOutwardDetailsbyId";
///---------------------    PO URLS -----------------------------------------------------------------------------------

export const GetVendorDetailsForCreatePOURL =  "https://mi557obuj3.execute-api.us-west-1.amazonaws.com/CmsVendorGetDetailsById/";
export const GetVendorListURL =  "https://rnv3gfe9m6.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetVendor/";
export const getStatusURL = "https://ft5vjf63ic.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetStatus/";
export const getCreatedPoDetails = "https://ulzlfj7noi.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGetDetailsForEditPO";
// export const GetStatusURL="https://nspu9pve26.execute-api.us-west-1.amazonaws.com/testCmsGetStatusForCreatePOAPI";
export const CreatePOURL = "https://vtu4s2zpr4.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderCreate/";
export const getCreatedPOListURL = "https://zkx1iitiv5.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGetAllData/";
export const updateEditCreatedPODetails = "https://ru5mj8wc9l.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderEdit/";
export const getCreatedPOvendorDetails = "https://p10jg443dg.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetVendorDetailsById/";
export const getCreatedPOOrderedCategoryInfo  = "https://hyb383mp8g.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetComponentsById/";
export const getCreatePODocuments = "https://9p0u8yvrdg.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetDocumentsById/";
export const getCreatedPOOtherInfo = "https://andug2p9kg.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetOtherInfo/";
export const getCreatedPOBankDetails = "https://bgrdecztp1.execute-api.us-west-1.amazonaws.com/CmsPurchaseOrderGetBankDetails/";
export const getpoInwardAllDetailsForModal = "https://e97tnaidwd.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderInwardGetAllDetailsForModal";
export const getpoInwardCategoryInfoGetDetails = "https://94fx1683s6.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderInwardCategoryInfoGetDetails";
export const getPurchaseReturnList = "https://8bl7cteisj.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGetPurchaseReturnList";
export const inwardqatestURL = "https://1cja0ser35.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderQaTestGetDetails";
export const inwardpurchaseOrdersURL = "https://g1c4rfzmt4.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrdersInwardGetDetailsbyId";
export const inwardqaTestPostURL = "https://89jfyy2cmb.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderSaveQATestAPI";
export const inwardPurchasePostURL = "https://txmtiyaof9.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderSaveInwardAPI/";
export const purchaseOrderGateEntryGetDetails="https://0c0o0qplz2.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGateEntryGetDetails"
export const purchaseOrderGateEntryCreate="https://08kn4bbsb3.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGateEntryCreate"
export const geteditpurchasereturnURL= "https://fdxlh9p8qb.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGetPurchaseReturnDetails";
export const serachComponentinpoURL = "https://3t9waqtaw7.execute-api.us-west-1.amazonaws.com/CmsInventorySearchSuggestionInPOAPI/";
export const addComponentinpoURL = "https://rebt1wgmhh.execute-api.us-west-1.amazonaws.com/CmsInventorySearchComponentInPOAPI/";
export const GetVendorslistbydepartment = "https://xzsyaz2rzf.execute-api.us-west-1.amazonaws.com/cmsVendorsGetNamesAndIds";


export const getPurchaseListURL = "https://ehe7e56vxg.execute-api.us-west-1.amazonaws.com/cmsPurchaseOrderGetPurchaseList/";

export const getPurchaseReturnGetOrderId   = "https://22q7bq2kpe.execute-api.us-west-1.amazonaws.com/cmsPurchaseReturnGetOrderId/";
export const getPurchaseReturnGetInwardId = "https://56bt9g61zl.execute-api.us-west-1.amazonaws.com/cmsPurchaseReturnGetInwardId/";
export const getComponentDetailsInsidePurchaseReturn  = "https://f2iwshfag2.execute-api.us-west-1.amazonaws.com/cmsGetComponentDetailsInsidePurchaseReturnModified/";
export const savePurchaseReturnCreate = "https://ucx4anpb0j.execute-api.us-west-1.amazonaws.com/CmsPurchaseReturnCreateModified/";
export const getPurchaseReturnGetInternalDetails = "https://j0wl2or968.execute-api.us-west-1.amazonaws.com/cmsPurchaseReturnGetInternalDetails/";
export const getEditreturnpoDetails = "https://q4t5qe90q9.execute-api.us-west-1.amazonaws.com/cmsPurchaseReturnEditGetDetails/";
export const updatecmsPurchaseReturnEdit = "https://5cji93g0q7.execute-api.us-west-1.amazonaws.com/cmsPurchaseReturnEdit/";
//                                   client URLS                                                /////////////////////////
export const getClientBomSearchSuggestion = "https://pmkijeuul4.execute-api.us-west-1.amazonaws.com/CmsClientBomSearchSuggestion";
export const addClientSearchAddBom = "https://wxrb0pvsth.execute-api.us-west-1.amazonaws.com/CmsClientSearchAddBom";
export const addClientURL = "https://yb8qqukkol.execute-api.us-west-1.amazonaws.com/CmsClientCreate";
export const getClientList = "https://owew6ebtkf.execute-api.us-west-1.amazonaws.com/cmsClientsGetAll";
export const getClientInnerList = "https://umcle35kzd.execute-api.us-west-1.amazonaws.com/cmsClientGetInnerDetailsById";
export const updateClientURL = "https://0xf5d6dg3b.execute-api.us-west-1.amazonaws.com/cmsClientEditDetails";
export const clientUploadURL = "https://t7hcpzp9m3.execute-api.us-west-1.amazonaws.com/CmsClientsUploadPo";

export const assignToBoxBuildingAPI = "https://uxv8372v93.execute-api.us-west-1.amazonaws.com/cmsBomOutwardInfoGetAssignToBoxBuildingAPI";
export const assignToBoxBuildingKitApi = "https://ocqym1wp8g.execute-api.us-west-1.amazonaws.com/cmsBomOutwardInfoGetAssignToBoxBuilding2API"
export const assignToBoxBuildingSaveAPI = "https://rt8vuencf9.execute-api.us-west-1.amazonaws.com/cmsBomOutwardInfoSaveAssignToBoxBuildingAPI/"
export const boxBuildingInfoGetAPI = "https://phuhasljsa.execute-api.us-west-1.amazonaws.com/cmsPartnerSendBoxBuildingInfo/"
export const assignBoxBuildingsave2Api = "https://xrewdatlv9.execute-api.us-west-1.amazonaws.com/cmsBomOutwardInfoSaveAssignToBoxBuilding2/"


// ///////////////////////////////////////////////////////Send Bords ///////////////////////////////////////////////

export const partnerSendBoardsApi = "https://0xyou3lbx5.execute-api.us-west-1.amazonaws.com/cmsPartnerSendBoards";
export const partnerGetSendBoardsApi = "https://6q39fjaafc.execute-api.us-west-1.amazonaws.com/cmsPartnerGetSendBoards/";

/////////////////////////////////////////////--Inventory Data --////////////////////////////////////////////
export const getAllBomIdsinInventoryURL = "https://ymi222udc4.execute-api.us-west-1.amazonaws.com/cmsInventoryGetAllBomid";
export const getEstimateBomListURL = "https://b90jueh84h.execute-api.us-west-1.amazonaws.com/cmsInventoryGetInnerBom/";
export const getPartsQuantityDataURL = "https://aqr4seafcj.execute-api.us-west-1.amazonaws.com/cmsInventoryGetPartsCount";
export const getsubcategoryListURL = "https://a33vpk5cgi.execute-api.us-west-1.amazonaws.com/cmsClassificationPartsSearchSuggestion";
export const getcmsInventoryClassificationPartsCountURL = "https://5x5e5g22c6.execute-api.us-west-1.amazonaws.com/cmsInventoryClassificationPartsCount";
export const getstockInventoryURL = "https://0ln39wmc1i.execute-api.us-west-1.amazonaws.com/cmsGetInventoryStockDetails/";
export const getStockDataURL = "https://z0u3f76sp8.execute-api.us-west-1.amazonaws.com/cmsGetInventoryStockDetailsModified/";

//below one is duplicate
// export const getVendorOrderURL = "https://1ki8p2m9y7.exechttpsute-api.us-west-1.amazonaws.com/CmsVendorGetDetailsByName/";
export const getVendorApiURL = "https://cryn49doqh.execute-api.us-west-1.amazonaws.com/cmsVendorGetOrderDetails/";
export const getVendorInnerURL = "https://ugrhvbq8jd.execute-api.us-west-1.amazonaws.com/cmsVendorGetInnerOrderDetails/";
export const getRackDetailsURL = "https://ajq65zgcfj.execute-api.us-west-1.amazonaws.com/cmsComponentGetRackDetails/";


/////////////////////////////////////////--Forecast------///////////////////////////////////////////////////////////////////////
export const createForecastPurchaseOrderURL = "https://ralwenvou9.execute-api.us-west-1.amazonaws.com/CmsCreateForcastPurchaseOrder/";
export const getClientIdForecastPurchaseOrderDetails = "https://z9u0sqq1p4.execute-api.us-west-1.amazonaws.com/CmsGetClientIdForcastPurchaseOrderDetails/";
export const saveDraftForecastPurchaseOrder = "https://52r3wsov50.execute-api.us-west-1.amazonaws.com/CmsSaveDraftForecastPurchaseOrder/";
export const forcastPurchaseOrderEditGetAPI = "https://x6wqbedk14.execute-api.us-west-1.amazonaws.com/CmsForcastPurchaseOrderEditGetAPI/";
export const getForecastPOGetBomsForClientName = "https://aji4i24819.execute-api.us-west-1.amazonaws.com/cmsForecastPOGetBomsForClientName";
export const getbomPriceAPI = "https://ltxskp2or9.execute-api.us-west-1.amazonaws.com/cmsForecastPOGetBomPriceForBomName/";

/////////////////////////////////////////--Purchase / sales ------///////////////////////////////////////////////////////////////////////
export const getCmsGetInnerForcastPurchaseOrderDetailsURL ="https://3wwgi5epzd.execute-api.us-west-1.amazonaws.com/CmsGetForcastPurchaseOrderDetailsList/";
export const CmsForcastPurchaseOrderUploadPOURL = "https://5x3iiio3g0.execute-api.us-west-1.amazonaws.com/CmsForcastPurchaseOrderUploadPO/"

export const forecastInnerDetails = "https://prddx2waz1.execute-api.us-west-1.amazonaws.com/CmsGetInnerForcastPurchaseOrderDetailsAPI/"
export const forecatPostCommentApi = "https://142wjc5n1i.execute-api.us-west-1.amazonaws.com/CmsForcastPurchaseOrderPostCommentAPI/"