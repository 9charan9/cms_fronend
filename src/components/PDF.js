/* eslint-disable no-mixed-operators */
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const Quixote = ({data, type}) => {
  console.log(type)
  console.log(JSON.stringify(data, null, 2));
  const pdfdata = {
    items: [
      {
        itemNo: '01270000',
        description: 'VIC HSN / SAC : 90292090',
        deliveryDate: '08-05-2023',
        qty: 10,
        unit: 'Nos',
        rate: 49275.00,
        discount: 0.00,
        gst: 88695.00,
        basicAmount: 492750.00
      },
      // Add more items as needed
    ],
    totalBasic: 492750.00,
    totalGst: 88695.00,
    grandTotal: 581445.00,
  };

  const containerStyle =
    (type === "CFPO" || type === "FCPO")
      ? [styles.PO_container, styles.spaceAround]
      : styles.PO_container;
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.container}>
          <View style={styles.logobox}>
            <Image
              src="https://media.licdn.com/dms/image/D4D0BAQHY6ci8XI9yOw/company-logo_200_200/0/1714974012992/people_tech_group_inc_logo?e=1726099200&v=beta&t=Efe1itLAh6olCldLZr6Z4IMZbZu_zcCGVw5EejAkG6w"
              style={styles.logo}
            />
            <Text style={styles.logoText}>PTG</Text>
          </View>
          <View style={styles.textBox}>
            <Text style={styles.texboxtext1}>People Tech Group .Inc</Text>
            <Text style={styles.texboxtext2}>
              Phase 2, HITEC City, Hyderabad,{"\n"}
              Telangana - 500081{"\n"}
              Website : https://www.peopletech.com/{"\n"}
              Email : hr.communique@peopletech.com
            </Text>
          </View>
        </View>
        <View style={styles.po_container}>
          <Text style={styles.po_text}>
            {type === "PO" ? "Purchase Order" : null}
            {type === "SO" ? "Service Order" : null}
            {type === "CFPO" ? "Client Purchase Order" : null}
            {type === "FCPO" ? "Forecast Purchase Order" : null}
            {type === "PI" ? "Proforma Invoice" : null}
            {type === "INV" ? "Invoice" : null}
          </Text>
        </View>

        <View style={containerStyle}>
          {(type !== "CFPO" && type !== "FCPO") ? (
            <View style={styles.kindAttn}>
              <Text style={styles.kindAttnText}>Kind Attn:</Text>
              <Text>{data?.kind_attn?.company_name}</Text>
              <Text></Text>
              <Text>{data?.kind_attn?.address}</Text>
              <Text>Contact No: {data?.kind_attn?.contact_details}</Text>
              <Text>GST No: {data?.kind_attn?.gst_no || data?.kind_attn?.gst_number}</Text>
              <Text>PAN No: {data?.kind_attn?.pan_no || data?.kind_attn?.pan_number}</Text>
            </View>
          ) : (
            <View style={styles.kindAttn}>
              <Text style={styles.kindAttnText}>Buyer Details:</Text>
              <Text>Buyer details: {data?.buyer_details}</Text>
              <Text>Delivery Location: {data?.delivery_location}</Text>
              {type === "FCPO" && <Text>Delivery Date: {data?.delivery_date}</Text>}
              <Text>Supplier Details: {data?.supplier_details}</Text>
              {type === "FCPO" && <Text>Payment Status: {data?.payment_status}</Text>}
            </View>
          )}

          
          {(type !== "CFPO" && type !== "FCPO") &&
          <View style={styles.shipTo}>
          <Text style={styles.shipToText}>Ship To:</Text>
          <Text>{data?.ship_to?.company_name}</Text>
          <Text>{data?.ship_to?.address}</Text>

          <Text>GST No: {data?.ship_to?.gst_number || data?.ship_to?.gst_no}</Text>
          <Text>PAN No: {data?.ship_to?.pan_number || data?.ship_to?.pan_no}</Text>
        </View>
          }

            {(type === "CFPO" || type === "FCPO") && (
              <View style={styles.shipTo}>
                <Text style={styles.poText}>
                {type === "FCPO" && "FCPO. No"}{type === "CFPO" && "CFPO. No"}: {data?.fc_po_ids || data?.Client_Purchaseorder_num}
                </Text>
                <Text>
                  Client: {data?.primary_document_details?.client_name}
                </Text>
                <Text>
                  Document Title: {data?.primary_document_details?.document_title}
                </Text>
                <Text>
                 Document Date: {data?.primary_document_details?.document_date}
                </Text>
                <Text>
                  Delivery Date: {data?.primary_document_details?.delivery_date}
                </Text> 
                <Text>
                  Bom Name: {data?.primary_document_details?.bom_name}
                </Text>
                {type === "CFPO" && 
                <Text>
                  Status: {data?.primary_document_details?.status}
                </Text>
                }
              </View>
            )}
          
          <View style={styles.poContainer}>
            {type === "SO" && (
              <>
                <Text style={styles.poText}>S.O. No: {data?.so_id}</Text>
                <Text>
                  S.O. Date: {data?.primary_document_details?.so_date}
                </Text>
                <Text>
                  Reference Client Po No:{" "}
                  {data?.primary_document_details?.reference_client_po_no}
                </Text>
                <Text>
                  Transaction Name:
                  {data?.primary_document_details?.transaction_name}
                </Text>
                <Text>
                  Currency: {data?.primary_document_details?.currency}
                </Text>
              </>
            )}

            {/* {----------Perfoma Invoice and Purchase Order--------------} */}

            {(type === "PO" || type === "PI" || type === "INV") && (
                <>
                  <Text style={styles.poText}>
                    {type === "PI" && `P.I No: ${data?.pi_id}`}
                    {type === "PO" && `P.O. No: ${data?.po_id !== "" ? data?.po_id : ""}`}
                    {type === "INV" && `Inovice No: ${data?.inv_id}`}
                  </Text>
                  <Text>
                    {type === "PO" &&
                      `P.O. Date: ${data?.primary_document_details?.po_date}`}
                    {type === "PI" &&
                      `P.I Date: ${data?.primary_document_details?.Pi_date || ""}`}
                    {type === "INV" && `Transaction Name: ${data?.primary_document_details?.transaction_name}`}
                  </Text>
                  <Text>
                    Amendment No: {data?.primary_document_details?.amendment_no}
                  </Text>
                  <Text>
                    Amendment Date:
                    {data?.primary_document_details?.amendment_date}
                  </Text>
                  <Text>
                    Quote Reference:
                    {data?.primary_document_details?.quote_reference}
                  </Text>
                  <Text>
                    Quote Date:{data?.primary_document_details?.quote_date}
                  </Text>
                  <Text>
                    Buyer Code: {data?.primary_document_details?.buyer_code}
                  </Text>
                  <Text>
                    Currency: {data?.primary_document_details?.currency}
                  </Text>
                </>
              )}


              {/* {----------------CFPO && FCPO-----------------} */}
              
              

          </View>
        </View>
        <View style={styles.po_section}>
          <Text>
            Dear Sir/Ma'am,{"\n"}
            Please Supply the Items mentioned in Order subject to delivery, mode
            and other terms and conditions below and overleaf.{"\n"}
            Please confirm the acceptance of this order. If you expect any delay
            in supply, communicate the same immediately on receipt of this
            purchase order
          </Text>
        </View>
        {/* ------------------Invoice Table Data -------------------- */}
        <View style={styles.table}>
          {(type === "PO" || type === "PI" || type === "INV") ? (
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Sr No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Item No</Text>
              </View>
              {(type === "PO" || type === "INV") && 
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Rev</Text>
              </View>
              }
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>
                  Description (HSN/SAC)
                </Text>
              </View>
              {(type === "PO" || type === "INV") &&
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Delivery Date</Text>
              </View>
              }
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Qty</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Unit</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Rate</Text>
              </View>
              <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>GST%</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>GST</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Basic Amount</Text>
              </View>
            </View>
          ) : null}

          {type === "SO" ? (
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Sr No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Scope of Job Work</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Qty</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Rate</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Delivery Date</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>GST%</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>GST</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Basic Amount</Text>
              </View>
            </View>
          ) : null}

          {(type === "SO" && Array.isArray(data?.job_work_table)) &&
            data?.job_work_table?.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>
                    {item?.scope_of_job_work}
                  </Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{item?.qty}</Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{item?.rate}</Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{item?.delivery_date}</Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{item["gst%"]}%</Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{item?.gst}</Text>
                </View>
                <View style={styles.tableSOCol}>
                  <Text style={styles.tableCell}>{item?.basic_amount}</Text>
                </View>
              </View>
            ))}

          {((type === "PO" || type === "INV") && Array.isArray(data?.purchase_list)) &&
            data?.purchase_list?.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.item_no}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.rev}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.description}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.delivery_date}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.qty}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.unit}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.rate}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.gst}%</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.gst_amount}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item?.basic_amount}</Text>
                </View>
              </View>
            ))}

            {(type === "PI" && Array.isArray(data?.products_list)) && 
              data?.products_list?.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.item_no}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.description}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.qty}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.unit}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.rate}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.gst}%</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.gst_amount}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.basic_amount}</Text>
                  </View>
                </View>
            ))}

            {type === "CFPO" && (
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Sr No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Item No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>HSN/SAC Code</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Qty</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Unit</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Price</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>GST</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Total price</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Total GST</Text>
              </View>
            </View>
            )}

            {(type === "CFPO" && Array.isArray(data?.forecast_details || data?.productlistDetails)) && 
              (data?.forecast_details || data?.productlistDetails)?.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.item_no}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.hsn_sac_code}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.qty}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.unit}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.price}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.gst}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.total_price}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.total_GST}</Text>
                  </View>
                </View>
            ))}


          {type === "FCPO" && (
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Sr No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Po Name</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Month</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Due Date</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Description</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Quantity</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Unit Price</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Order Value</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Payment Status</Text>
              </View>
            </View>
            )}

            {(type === "FCPO" && Array.isArray(data?.forecast_details))&& 
              data?.forecast_details?.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.po_name}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.month}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.due_date}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.description}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.quantity}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.unit_price}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item.order_value}</Text>
                  </View>
                  <View style={styles.tablePICol}>
                    <Text style={styles.tableCell}>{item?.payment_status}</Text>
                  </View>
                </View>
            ))}

          <View style={styles.tableRow}>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCell}>Total (Basic)</Text>
            </View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCellRight}>
                {data?.total_amount?.total_basic_amount || data?.total_amount?.total_before_tax || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCell}>Total GST</Text>
            </View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCellRight}>
                {data?.total_amount?.total_basic_amount_gst || data?.total_amount?.total_tax_gst || data?.total_amount?.GST || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCell}>Shipping Charges</Text>
            </View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCellRight}>
                {data?.total_amount?.shipping_charges || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}></View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCell}>Grand Total (Incl. Taxes)</Text>
            </View>
            <View style={styles.customtableCol}>
              <Text style={styles.tableCellRight}>
                {data?.total_amount?.grand_total || data?.total_amount?.total_after_tax || "-"}
              </Text>
            </View>
          </View>
        </View>
        {/* ------------------------------------------ */}
        {(type !== "CFPO" && type !== "FCPO") && 
            <View style={styles.row_columns}>
             <Text style={styles.qwedcf_text}>
               Amount in Words :{" "}
               {data?.total_amount?.amount_in_words !== undefined
                 ? data?.total_amount?.amount_in_words?.toUpperCase()
                : null}
             </Text>
           </View>
        }
       
        <View style={styles.row_columns}>
          {type === "PO" && <Text style={styles.qwedcf_text}>PO Terms & Conditions :</Text>}
          {type === "SO" && <Text style={styles.qwedcf_text}>SO Terms & Conditions :</Text>}
          {type === "PI" && <Text style={styles.qwedcf_text}>PI Terms & Conditions :</Text>}
        </View>
        {type === "PO" && (
          <View style={styles.row_columns}>
            <Text style={styles.terms_conditions}>{data?.po_terms_conditions}</Text>
          </View>
        )}
         {type === "SO" && (
          <View style={styles.row_columns}>
            <Text style={styles.terms_conditions}>{data?.so_terms_conditions}</Text>
          </View>
        )}
        {type === "PI" && (
          <View style={styles.row_columns}>
            <Text style={styles.terms_conditions}>{data?.pi_terms_conditions}</Text>
          </View>
        )}
        {(type !== "CFPO" && type !== "FCPO") && (
          <View>
          <View style={styles.row_columns}>
             <Text style={styles.qwedcf_text}>Note :</Text>
           </View>
        
       
        <View style={styles.row_columns}>
          <Text style={styles.terms_conditions}>
            {data?.secondary_doc_details?.note}
          </Text>
        </View>

        <View style={styles.row_columns}>
          <Text style={styles.qwedcf_text}>TERMS & CONDITIONS :</Text>
        </View>
        <View style={styles.row_columns}>
          <Text style={styles.terms_conditions}>
            {data?.secondary_doc_details?.terms_conditions}
          </Text>
        </View>
        </View>
        )}

        {type === "FCPO" && (
          <View>
          <View style={styles.row_columns}>
          <Text style={styles.qwedcf_text}>Note :</Text>
        </View>
     
    
     <View style={styles.row_columns}>
       <Text style={styles.terms_conditions}>
         {data?.primary_document_details?.note}
       </Text>
     </View>

     <View style={styles.row_columns}>
          <Text style={styles.qwedcf_text}>PAYMENT TERMS :</Text>
        </View>
        <View style={styles.row_columns}>
          <Text style={styles.terms_conditions}>
            {data?.primary_document_details?.payment_terms}
          </Text>
        </View>
     </View>
        )}
        {type === "CFPO" && (
          <View>
          <View style={styles.row_columns}>
          <Text style={styles.qwedcf_text}>PAYMENT TERMS :</Text>
        </View>
        <View style={styles.row_columns}>
          <Text style={styles.terms_conditions}>
            {data?.primary_document_details?.payment_terms}
          </Text>
        </View>
        </View>

        
        )}

        {/* ---------------Footer & Signature Content------------ */}
        <View style={styles.footerContainer}>
          <View style={styles.section}>
            <Text style={styles.text}>Prepared By</Text>
            <Text style={styles.text}>
              {data?.secondary_doc_details?.prepared_by}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.text}>Checked By</Text>
            <Text style={styles.text}>
              {data?.secondary_doc_details?.checked_by}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={[styles.text]}>
              For, People Tech Group PRIVATE LIMITED
            </Text>
            <Text style={styles.text}>
              {data?.secondary_doc_details?.authorized_signatory}
            </Text>
            <Text style={styles.text}>Authorized Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
  
  

  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  });
  
  const styles = StyleSheet.create({
    page: {
      padding: 35,
    },
    container: {
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
    },
    po_container: {
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
    },
    po_text: {
       width: "100%",
       border: '1px solid black',
       textAlign: "center",
       fontSize: 12,
    },
    textBox: {
      width: 500,
      border: '1px solid black',
      borderBottom: "none",
      padding: 10,
      paddingTop: 0,
      textAlign: "center",
    },
    texboxtext1: {
      fontSize: 16,
      fontWeight: "demibold",
    },
    texboxtext2: {
      fontSize: 10,
      fontWeight: "light",
    },
    logobox: {
      border: '1px solid black',
      borderRight: 'none',
      padding: 10,
      marginRight: -1,
      width: 100,
      height: 73.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 70,
      height: 70
    },
    logoText: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    PO_container: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginBottom: 20,
        border: "1px solid black",
        marginBottom: -1,
        borderTop: "none",
        
      },
      spaceAround: {
        justifyContent: 'space-between', // Apply this style if type is "CFPO"
      },
      kindAttn: {
        width: '33%',
        fontSize: 10,
        paddingLeft: 5,
        borderRight: "1px solid black",
      },
      kindAttnText: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      shipTo: {
        width: '33%',
        fontSize: 10,
        paddingRight: 5,
        marginLeft: 0,
        borderRight: "1px solid black",
      },
      buyer_details: {
        fontSize: 10,
        marginRight: 5,
      },
      shipToText: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      poContainer: {
        width: '33%',
        fontSize: 10,
      },
      poText: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      po_section: {
        width: "100%",
        flexDirection: 'row',
        fontSize: 8,
        border: "1px solid black",
        paddingTop: 5,
        paddingBottom: 5
      },
      row_columns: {
        width: "100%",
        flexDirection: 'row',
      },
      qwedcf_text: {
        width: "100%",
       border: '1px solid black',
       borderTop: 'none',
       fontWeight: "extrabold",
       fontSize: 10,
       padding: 3
      },
      terms_conditions: {
        width: "100%",
       border: '1px solid black',
       borderTop: 'none',
       fontWeight: "light",
       fontSize: 8,
       padding: 2,
      },
      footerContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      section: {
        textAlign: 'center',
      },
      text: {
        fontSize: 8,
      },
      signatureGap: {
        marginBottom: 30,
      },
      table: {
        display: "table",
        width: "auto",
        height: "auto",
        border: "1px solid black",
        borderWidth: 1,
        marginBottom: 0,
      },
      tableRow: {
        flexDirection: "row"
      },
      tableColHeader: {
        width: "14.28%",
        borderStyle: "1px solid black",
        borderWidth: 1,
        padding: 5,
      },
      tableCol: {
        width: "10.5%",
        borderStyle: "1px solid black",
        borderWidth: 1,
        padding: 5,
      },
      tableSOCol: {
        width: "14.28%",
        borderStyle: "1px solid black",
        borderWidth: 1,
        padding: 5,
      },
      tablePICol: {
        width: "14.28%",
        borderStyle: "1px solid black",
        borderWidth: 1,
        padding: 5,
      },
      tableCellHeader: {
        fontSize: 8,
        fontWeight: 'bold',
      },
      tableCell: {
        fontSize: 7,
      },
      customtableCol: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        justifyContent: "center",
        alignItems: "center",
      },
      customtableCell: {
        margin: 'auto',
        marginTop: 5,
        fontSize: 12,
      },
      tableCellRight: {
        margin: 5,
        fontSize: 9,
        textAlign: 'right'
      }
  });
  
  export default Quixote;