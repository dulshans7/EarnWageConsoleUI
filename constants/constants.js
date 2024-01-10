// apis
// Dashboard
const runtimeConfig = useRuntimeConfig();

export const FETCH_EMPLOYEES = `${runtimeConfig.public.API_BASE_URL}/api/GetAllEmployers`
export const FETCH_TRANSACTIONS = `${runtimeConfig.public.API_BASE_URL}/api/GetTransactions`
export const UPLOAD_ACTIONS = `${runtimeConfig.public.API_BASE_URL}/api/ApproveRejectTransactions`
export const FETCH_MORE_DETIALS = `${runtimeConfig.public.API_BASE_URL}/api/GetTrnMoreDetails`
export const FETCH_INVOICE_DETAILS = `${runtimeConfig.public.API_BASE_URL}/api/GetInvoiceDetails`
export const FETCH_WORKFLOW_HISTORY = `${runtimeConfig.public.API_BASE_URL}/api/LoadWFHistory`
export const FETCH_REJECTED_REASON = `${runtimeConfig.public.API_BASE_URL}/api/GetRemitRejectReason`
export const GET_WF_ATTACHMENT = `${runtimeConfig.public.API_BASE_URL}/api/GetWFAttachment`
export const GET_LOGIN_DETAILS = `${runtimeConfig.public.API_BASE_URL}/api/GetLoginDetails`
export const GET_REMIT_HISTORY = `${runtimeConfig.public.API_BASE_URL}/api/GetRemitHistory`
export const REPROCESS_FAILED_REMIT = `${runtimeConfig.public.API_BASE_URL}/api/ReprocessFailedRemit`
export const ENCRYPT_DATA = `${runtimeConfig.public.API_BASE_URL}/api/EncryptData`
export const NEW_RECORD = `${runtimeConfig.public.API_BASE_URL}/api/RetrieveNewRecords`
export const IS_RETRIEVE_RECORD = `${runtimeConfig.public.API_BASE_URL}/api/IsRetrieveRecFromAPI`
//Remit page
export const GET_REMITTANCE_ISSUES = `${runtimeConfig.public.API_BASE_URL}/api/GetRemittanceIssues`
export const SEND_SUPPORT_STATUS = `${runtimeConfig.public.API_BASE_URL}/api/SendSupportStatus`
//ad urls
export const GET_USER = `/api/auth/session?`

//sprint 2
export const GET_LOGIN_DETAILSAD = `${runtimeConfig.public.API_BASE_URL}/api/GetLoginDetailsAD`
export const GET_REPORT_DETAILS = `${runtimeConfig.public.API_BASE_URL}/api/GetReportDetails`
export const GET_ALERTS = `${runtimeConfig.public.API_BASE_URL}/api/GetUnsuccessAlerts`
export const RESENDING_ALERTS = `${runtimeConfig.public.API_BASE_URL}/api/ResendEmail`