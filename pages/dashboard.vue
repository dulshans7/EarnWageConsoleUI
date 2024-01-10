<template>
  <div id="wrapper">
    <div class="row wrapper border-bottom white-bg page-heading header no-printme">
      <div class="col-lg-12">
        <h2>Admin Dashboard</h2>
      </div>
    </div>
  </div>
  <div class="wrapper wrapper-content animated fadeInRight">
    <dashboardSummary :attended="attendedRequest" :completed="completedRequest" :pending="pendingRequest"
                      :total="totalRequest" class="no-printme"/>
    <div class="row">
      <div class="col-md-12">
        <div class="ibox" style="padding: 0 1%">
          <div class="ibox-title no-printme">
            <h5>Filter records by date range</h5>
            <div class="ibox-tools">
              <a v-show="false" class="collapse-link">
                <i class="fa fa-chevron-up"></i>
              </a>
            </div>
          </div>
          <div class="ibox-content">
            <div class="form-group row no-printme" @click="clickOutSideAction">
              <label class="col-md-2 ">Select Date Period </label>
              <div class="col-md-2">
                <div class="input-group ">
                  <div class="input-group date input-group-sm" data-provide="datepicker">
                    <vue-date-picker v-model="startDate" :format="formatStart" class="my-picker-class"
                                     month-name-format="long" @update:model-value="changeStart"
                                     :enableTimePicker="false"></vue-date-picker>
                  </div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="input-group">
                  <div class="input-group date input-group-sm" data-provide="datepicker">
                    <vue-date-picker v-model="endDate" :format="formatEnd" class="my-picker-class"
                                     month-name-format="long" @update:model-value="changeEnd"
                                     :enableTimePicker="false"></vue-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row no-printme" @click="clickOutSideAction">
              <label class="col-md-2">Name of the Employer </label>
              <div class="col-md-4">
                <select v-model="employer" class="form-control custom-dropdown" @change="onChangeEmployer">
                  <option v-for="i in employees.items" :key="i.clientId" :value="i.clientId">{{ i.clientName }}</option>
                </select>
              </div>
              <div v-show="false">
                <input type="text" :value="employer" id="e">
              </div>
            </div>
            <div class="form-group row no-printme" @click="clickOutSideAction">
              <label class="col-md-2 no-printme">Action Status</label>
              <div class="col-md-4 no-printme">
                <select v-model="action" class="form-control custom-dropdown" @change="onChangeAction">
                  <option v-for="i in actions" :key="i.id" :value="i.value">{{ i.label }}</option>
                </select>
              </div>
            </div>
            <div class="form-group row m-t-md no-printme" @click="clickOutSideAction">
              <label class="col-md-2"></label>
              <div class="col-md-4">
                <button class="btn btn-sm  btn-primary white-color-text mr-4" type="button" @click="update">Search
                </button>
                <button class="btn btn-sm  btn-success white-color-text" type="button" v-show="showRetrive"
                        @click="onClickRetrieve">Retrieve
                </button>
              </div>
            </div>
            <div class="row no-printme">
              <div class="col-md-9">
                <div class="fa-pull-left">
                </div>
              </div>
              <div class="col-md-3">
                <div class="input-group">
                  <a v-show="true && transactions.items.length > 0" class="btn btn-white btn-bitbucket custom_icon"
                     @click="downloadAsExcelAPI">
                    <i class="fa-solid fa-file-excel m-r-xs"></i>
                  </a>
                  <a v-show="true && transactions.items.length > 0" class="btn btn-white btn-bitbucket"
                     @click="exportToPdf">
                    <i class="fa-solid fa-file-pdf m-r-xs"></i>
                  </a>
                  <input v-model="search" class="form-control form-control" type="text" @keyup="searching">
                  <span class="input-group-append"> <a class="btn btn-white btn-bitbucket m-r-xs" type="button"
                                                       @click="searching"><i class="fa fa-search"></i>
                  </a></span>
                </div>
              </div>
              <div v-if="show">
                <DxDataGrid
                    :data-source="transactions.items"
                    key-expr="trn_id">
                  >
                  <DxExport
                      :enabled="true"
                      :formats="['pdf']"
                      :allow-export-selected-data="true"
                  />
                </DxDataGrid>
              </div>
            </div>
            <div class="row no-printme">
              <div class="col-md-9">
                <div class="fa-pull-left">
                  <a v-show="canCount > 0" class="btn btn-sm  btn-primary white-color-text" data-target="#Action"
                     data-toggle="modal" type="button" @click="openActionModalApi" @mousedown="openActionModalapi">Action</a>
                </div>
              </div>
            </div>
            <div class="form-group row m-t-md" @click="clickOutSideAction">
              <div class="col-md-12" ref="document">
                <div id="element-to-convert">
                  <table class="table table-bordered table-sm" v-if="nonPDF">
                    <thead>
                    <tr>
                      <th></th>
                      <th class="title" style="width:19%">Application Reference Number
                        <a
                        ><i
                            v-if="asc"
                            class="fa fa-sort-alpha-asc"
                            @click="onSort('ref_no', 'desc')"
                        ></i
                        ></a>
                        <a
                        ><i
                            v-if="!asc"
                            class="fa fa-sort-alpha-desc"
                            @click="onSort('ref_no', 'asc')"
                        ></i
                        ></a></th>
                      <th class="title">Employee Name
                        <a
                        ><i
                            v-if="asc"
                            class="fa fa-sort-alpha-asc"
                            @click="onSort('emp_name', 'desc')"
                        ></i
                        ></a>
                        <a
                        ><i
                            v-if="!asc"
                            class="fa fa-sort-alpha-desc"
                            @click="onSort('emp_name', 'asc')"
                        ></i
                        ></a>
                      </th>
                      <th class="title">Organization
                      </th>
                      <th class="title">Requested Amount
                        <a
                        ><i
                            v-if="asc"
                            class="fa fa-sort-alpha-asc"
                            @click="onSort('req_amount', 'desc')"
                        ></i
                        ></a>
                        <a
                        ><i
                            v-if="!asc"
                            class="fa fa-sort-alpha-desc"
                            @click="onSort('req_amount', 'asc')"
                        ></i
                        ></a></th>
                      <th class="title">Submitted Date
                        <a
                        ><i
                            v-if="asc"
                            class="fa fa-sort-alpha-asc"
                            @click="onSort('apply_date', 'desc')"
                        ></i
                        ></a>
                        <a
                        ><i
                            v-if="!asc"
                            class="fa fa-sort-alpha-desc"
                            @click="onSort('apply_date', 'asc')"
                        ></i
                        ></a></th>
                      <th v-if="!isRejectSelected" class="title">Remittance Status</th>
                      <th style="width: 2%" class="title">Workflow History</th>
                      <th style="width: 2%" class="title">Invoice</th>
                      <th style="width: 2%" class="title">More Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(p, i) in transactions.items" :key="i">
                      <td class="title"><input v-model="p.selected"
                                               :class="{disableCheck2: p.wf_level !== userLevel || isApproved}"
                                               type="checkbox" v-bind:value="p" @change="onUpdateCheck(p)"></td>
                      <td>{{ p.Reference_Number }}</td>
                      <td>{{ p.Name }}</td>
                      <td>{{ p.Organization }}</td>
                      <td class="right">{{ p.Amount }}</td>
                      <td>{{
                          p.Date
                        }}
                      </td>
                      <td v-if="p.remit_status === 1 && !isRejectSelected" style="text-align:center;"><span
                          class="label label-primary">Completed</span></td>
                      <td v-if="p.remit_status === -1  && !isRejectSelected" style="text-align:center;"><a
                          style="pointer-events: none"><span :class="{customUnderline: p.show_remits == 1}"
                                                             class="label label-danger warning-label-custom"
                                                             data-target="#Rejected" data-toggle="modal"
                                                             @click="openRefectedModalApi(p)">Rejected</span></a></td>
                      <td v-if="p.remit_status === 0  && !isRejectSelected" style="text-align:center;"><a
                          style="pointer-events: none"><span :class="{customUnderline: p.show_reprocess == 1 }"
                                                             class="label label-warning warning-label-custom"
                                                             data-target="#Reprocess" data-toggle="modal"
                                                             @click="openReprocessModalApi(p)">Pending</span></a>
                      </td>
                      <td :class="{ hide: p.wfmainId === '0' }" style="text-align:center;">
                        <a><i class="fa fa-file-text" data-target="#WorkflowHistoryModal" data-toggle="modal"
                              @click="openWorkFlowModalApi(p)"></i></a>
                      </td>
                      <td :class="{ hide : p.remit_status === -1 || p.remit_status === 0 }" style="text-align:center;">
                        <a><i class="fa-regular fa-newspaper" data-target="#Invoice" data-toggle="modal"
                              @click="openInvoiceModalApi(p)"></i></a></td>
                      <td style="text-align:center;"><a><i class="fa-sharp fa-solid fa-file" data-target="#MoreDetails"
                                                           data-toggle="modal" @click="openMoreModalApi(p)"></i></a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <table class="table table-bordered table-sm" v-if="!nonPDF" ref="export_table">
                    <thead>
                    <tr>
                      <th></th>
                      <th class="title">Application Reference Number</th>
                      <th class="title">Employee Name</th>
                      <th class="title">Organization</th>
                      <th class="title">Requested Amount</th>
                      <th class="title">Submitted Date</th>
                      <th class="title">Remittance Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(p, i) in transactions.items" :key="i">
                      <td></td>
                      <td>{{ p.Reference_Number }}</td>
                      <td>{{ p.Name }}</td>
                      <td>{{ p.Organization }}</td>
                      <td class="right">{{ p.Amount }}</td>
                      <td>{{
                          p.Date
                        }}
                      </td>
                      <td v-if="p.remit_status === 1" style="text-align:top;font-size:14px;"><span>Completed</span>
                      </td>
                      <td v-if="p.remit_status === -1" style="text-align:top;font-size:14px;"><a
                          style="pointer-events: none"><span
                          :class="{customUnderline: p.show_remits == 1}"
                          data-target="#Rejected" data-toggle="modal"
                          @click="openRefectedModalApi(p)">Rejected</span></a></td>
                      <td v-if="p.remit_status === 0" style="text-align:top;font-size:14px;"><a
                          style="pointer-events: none"><span
                          :class="{customUnderline: p.show_reprocess == 1 }"
                          data-target="#Reprocess" data-toggle="modal"
                          @click="openReprocessModalApi(p)">Pending</span></a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <!--pagination-->
                <div>
                  <div class="form-group row">
                    <div class="col-md-5" v-if="parseInt(totalRecord) > 0"> {{ displayPaginationText }} of
                      {{ parseInt(totalRecord) }}
                    </div>
                    <div class="col-md-5" v-else> No Data to Display</div>
                    <div class="col-md-2">Show
                      <select style="width: 35%;display: inline-block;" class="form-control form-control-sm"
                              v-model="showAmount" @change="onChangeShowDropdown">
                        <option v-for="i in showRecordsArray" :key="i.id" :value="i.value">
                          {{ i.label }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-5">
                      <div class="float-right">
                        <div v-if="true">
                          <b-pagination
                              v-model="page"
                              :total-rows="parseInt(totalRecord)"
                              :per-page="pageSize"
                              @page-click="handlePageChange"
                              first-text="<<"
                              prev-text="<"
                              next-text=">"
                              last-text=">>"
                          ></b-pagination>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="text-align: center" class="no-printme">
              <div id="loading"></div>
            </div>
            <ShowReprocess v-if="isProcessApi" :reprocess="propsReprocess" @modalClose="modalCloseReprocess"/>
            <!-- Modal Reject-->
            <RefectedModal v-if="isRejectedApi" :reject="propsRefect" :show="propsShow" @modalClose="modalCloseReject"/>
            <!-- Modal Pending -->
            <PendingModal v-if="isPending"/>
            <!-- Modal Action -->
            <ActionModal v-if="isActionApi" :total="actionableTransactions.items" :wf="actionableWF.items"
                         @modalClose="modalCloseAction" @save="refreshTransactions"/>
            <!-- Modal More Details -->
            <MoreDetailsModal v-if="isMoreApi" :application="propsRef" :more="propsMore" @modalClose="modalCloseMore"/>
            <!-- Workflow History -->
            <WorkflowModal v-if="isWorkApi" :wf="propsWF" @modalClose="modalWFClose"/>
            <!-- Modal Invoice Details -->
            <!--     <InvoiceModal v-if="isInvoiceApi" :invoice="propsInvoice" @modalClose="modalClose"/> -->
            <!-- Action Modal in Parent -->

            <div id="Invoice" v-if="isInvoiceApi" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade"
                 role="dialog"
                 style="display: none;" tabindex="-1">
              <div class="modal-dialog" role="document" style="max-width:1000px">
                <div id="printThis" class="modal-content printme">
                  <div class="modal-header" id="printTitle">
                    <h5 class="modal-title">Invoice</h5>
                    <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                      <span aria-hidden="true" @click="closeModal">×</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="wrapper wrapper-content animated fadeInRight">
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="ibox-content p-xl">
                            <div id="testgridcon" class="row">
                              <div class="col-sm-10 text-left">
                                <h5>Invoice No: <span class="text-navy" id="spanPrint">{{ invoiceNo }}</span></h5>
                                <address>
                                  <strong>{{ hsenidName }}</strong>
                                  <br>
                                  {{ substrings[0] }}
                                  <br>
                                  {{ substrings[1] }}
                                  <br>
                                  {{ substrings[2] }}
                                  <br>
                                  {{ substrings[3] }}
                                </address>
                              </div>
                              <div class="col-sm-2 text-right" id="printImage">
                                <img src="@/assests/images/hsenid-logo.png" style="width: 120% !important">
                              </div>
                            </div>
                            <div class="table-responsive m-t" id="tablePrint">
                              <div class="rowprint">
                                <div class="cellprint"><b>Item List</b></div>
                                <div class="cellprint"><b>Total Price</b></div>
                              </div>
                              <div class="rowprint">
                                <div class="cellprint">
                                  <b>Remitted Amount</b>
                                </div>
                                <div class="cellprint">LKR {{ total }}</div>
                              </div>
                              <div class="rowprint">
                                <div class="cellprint">
                                  <b>Cost of Service and Tax</b>
                                </div>
                                <div class="cellprint">LKR {{ cost }}</div>
                              </div>
                              <div class="rowprint">
                                <div class="cellprint"><b>Requested Amount </b></div>
                                <div class="cellprint">LKR {{ amount }}</div>
                              </div>
                            </div><!-- /table-responsive -->
                            <div v-show="true" class="text-right no-printme" id="noPrintMe">
                              <button class="btn btn-primary" target="_blank" style="color:white" @click="onPrint"><i
                                  class="fa fa-print"></i>Print Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer text-center no-printme" style="display: block">
                  <span class="printme">{{ contact }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import 'devextreme/dist/css/dx.light.css';
import JsonCSV from 'vue-json-csv'
import JsonExcel from "vue-json-excel3";
import {DxDataGrid, DxExport} from 'devextreme-vue/data-grid';
import {jsPDF} from 'jspdf';
import {exportDataGrid} from 'devextreme/pdf_exporter';
import {ref} from "vue";
import html2pdf from "html2pdf.js";
import axios from "axios";
//import xlsx from "xlsx/dist/xlsx.full.min";
import {FETCH_EMPLOYEES} from "../constants/constants";

const runtimeConfig = useRuntimeConfig();
export default {
  name: "dashboard",
  components: {
    VueDatePicker,
    JsonCSV,
    JsonExcel
  },
  data: () => {
    return {
      emps: [],
      employerName: "",
      //modal booleans
      isAction: false,
      isRejected: false,
      isPending: false,
      isMore: false,
      isWork: false,
      employer: "",
      //grid
      canCount: 0,
      canArray: [],
      multiple: false,
      canView: false,
      isAllChecked: false,
      postsCount: 0,
      pdfOptions: {
        margin: 15,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {scale: 3},
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "p",
        },
      },
      exportFilename: "my-custom-file.pdf",
      nonPDF: true,
      posts: [],
      empName: "",
    }
  },
  methods: {
    onPrint() {
      let elem = document.getElementById("printThis")
      var domClone = elem.cloneNode(true);
      var printSection = document.getElementById("printSection");
      if (!printSection) {
        var printSection = document.createElement("div");
        printSection.id = "printSection";
        document.body.appendChild(printSection);
      }
      printSection.innerHTML = "";
      printSection.appendChild(domClone);
      window.print();
      printSection.innerHTML = "";
    },
    onChangeDowndownOld() {
      this.employerName = document.getElementById("e").value;
      const filteredHttp = `${FETCH_EMPLOYEES}`
      axios.get(filteredHttp, {headers: {Authorization: runtimeConfig.public.apiKey}})
          .then(response => this.posts = response.data)
          .then(() => {
            this.empName = this.posts[this.employerName - 1]['clientName']
          })
          .catch(error => {
            console.log(error)
          })
    },
    optionUpdateAction() {
      this.isAction = false
    },
    uploadFile() {
      const attachment = this.$refs.attachment;
      const file = attachment.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
            .then(response => {
              // Handle success response
            })
            .catch(error => {
              // Handle error
            });
      }
    },
    openActionModal(p) {
      this.isAction = true;
    },
    openMoreModal(p) {
      this.isMore = true;
    },
    openRefectedModal() {
      this.isRejected = true;
    },
    openPendingModal() {
      this.isPending = true;
    },
    openWorkFlowModal() {
      this.isWork = true;
    },
    onSearch(value) {
      this.paginationVal.searchValue = value;
      this.paginationVal.pageNumber = 1;
    },
    download() {
      this.$refs.vue3SimpleHtml2pdf.download();
    },
    exportToPdf() {
      this.nonPDF = false
      html2pdf(document.getElementById('element-to-convert'),
          {
            margin: 1,
            filename: `Earn Wage Records.pdf`
          });
      setTimeout(() => {
        this.nonPDF = true
      }, 2000)
    },
    exportToExcel1(dl) {
      this.nonPDF = false
      const XLSX = xlsx;
      // const workbook = XLSX.utils.book_new();
      var elt = this.$refs.export_table;
      var wb = XLSX.utils.table_to_book(elt, {sheet: "Sheet JS"});
      return dl ?
          XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'base64'}) :
          XLSX.writeFile(wb, 'SheetJS.xlsx');
    },
  }
}
</script>
<script setup>
import {ref, watch} from 'vue';
import * as Api from "@/constants/constants";
import {FETCH_EMPLOYEES, FETCH_MORE_DETIALS, FETCH_TRANSACTIONS, GET_USER} from "../constants/constants";
import InvoiceModal from "../components/InvoiceModal";
import ShowReprocess from "../components/ShowReprocess";
import {useLogged, useUserId, useUserLevel, useUserType} from "../composables/states";
import {exportToPDF} from '#imports'
import {SurveyPDF} from "survey-pdf";
import xlsx from "xlsx/dist/xlsx.full.min";
import FileSaver from "file-saver/dist/FileSaver.min.js";

const runtimeConfig = useRuntimeConfig();
// or require

const pdfSection = ref("")
// use axios
const axios = useNuxtApp().$axios
import {useRouter} from 'vue-router'
import {savePdf, testpdfex} from "../Utils/nodeserver";
//pagination
let page = ref(1)
//data
const router = useRouter()
const userId = useUserId()
const userLevel = useUserLevel()
const userLogged = useLogged()
const userType = useUserType()
const date = ref(new Date());
let startDate = ref("")
let endDate = ref("")
let startDateReal = ref("")
let endDateReal = ref("")
let employer = ref("1")
let action = ref("0")
let search = ref("")
let searchValue = ref("")
let oldsearchValue = ref("")
let isAllCheck = ref(false)
let canCount = ref("0")
let isActionApi = ref(false)
let isMoreApi = ref(false)
let isInvoiceApi = ref(false)
let isWorkApi = ref(false)
let isRejectedApi = ref(false)
let isProcessApi = ref(false)
let propsMore = ref("")
let propsRef = ref(0)
let propsInvoice = ref("")
let propsWF = ref({})
let propsWFId = ref("")
let propsRefect = ref("")
let propsReprocess = ref("")
//top props
let totalRequest = ref(0)
let attendedRequest = ref(0)
let pendingRequest = ref(0)
let completedRequest = ref(0)
let propsShow = ref(0)
let isApproved = ref(false)
let wfmainId = ref("")
let isRejectSelected = ref(false)
let show = ref(false)
let testpdfData = {}
let showRetrive = ref(false)
//for pagination
let pageSize = ref(10)
let pageNo = ref(1)
let sortBy = ref('')
let orderBy = ref('')
let totalPagesForPagination = ref(0)
let totalPages = ref(0)
let totalRecordsNew = ref(0)
let totalRecord = ref(0)
let totalRecordsNewForPagination = ref(0)
let showAmount = ref(10)
let displayPaginationText = ref('')
//invoice variables
const posts = ref({})
//data in invoice
const cost = ref(0)
const total = ref(0)
const image = ref("")
const invoiceNo = ref("")
const amount = ref(0)
const hsenidName = ref("")
const hsenidAddress = ref("")
const contact = ref("")
const substrings = ref("")
//sort
let asc = ref(true)
let ascORdsc = ref('asc')
let sortfield = ref('apply_date')
let showRecordsArray = ref([
  {id: 1, label: '10', value: 10},
  {id: 2, label: '25', value: 25},
  {id: 3, label: '50', value: 50},
  {id: 4, label: '100', value: 100},
]);
const employers = ref([
  {id: 1, label: 'Approving Levels', value: 'Support Team Member'},
  {id: 2, label: 'Support Team Member', value: 'Support Team Member'},
]);
const actions = ref([
  {id: 1, label: 'Approve', value: '1'},
  {id: 2, label: 'Reject', value: '-1'},
  {id: 3, label: 'Pending', value: '0'},
  {id: 4, label: 'Remittance Unsuccessful', value: '-2'},
]);
const dataForDownload = ref([])
//reactives
let gridDataNew = ref([])
let employees = reactive({
  items: []
})
let transactions = reactive({
  items: []
})
let actionableTransactions = reactive({
  items: []
})
let actionableWF = reactive({
  items: []
})
onMounted(() => {
  getDefaultDate();
  fetchEmployeesAPI();
  isRetrieve();
})
watch(totalPagesForPagination, (newText, oldText) => {
  let visibleRecords = 0
  let firstDigit = 1
  let secondDigit = 9
  if (totalRecord.value < showAmount.value) {
    firstDigit = 1
    secondDigit = totalRecord.value
  } else {
    if (page.value == 1) {
      firstDigit = 1
      secondDigit = showAmount.value
    } else {
      firstDigit = (pageNo.value * showAmount.value) - (showAmount.value - 1)
      secondDigit = pageNo.value * showAmount.value
      if (totalRecord.value >= secondDigit) {
        secondDigit = pageNo.value * showAmount.value
      } else {
        secondDigit = totalRecord.value
      }
    }
  }
  displayPaginationText = `${firstDigit} - ${secondDigit}`
  return displayPaginationText;
})
//methods in composition api
const clickOutSideAction = () => {
  if (isActionApi.value == true) {
    isActionApi.value = false
  }
}
const fetchEmployeesAPI = () => {
  axios.get(Api.FETCH_EMPLOYEES)
      .then(response => {
        employees.items = response.data
      })
      .catch(() => {
        console.log("error");
      });
}
const fetchTransactionAPI = () => {
  totalPagesForPagination.value = 0
  try {
    const postData = {
      '"page_size"': 10,
      '"page_no"': 1,
      '"sort_column"': sortfield.value,
      '"order"': "desc",
      '"srch_text"': "_XXX_",
      '"fromDate"': startDate.value,
      '"toDate"': endDate.value,
      '"clntId"': "1",
      '"status"': 0
    };
    axios.post(Api.FETCH_TRANSACTIONS, postData)
        .then(response => {
          totalPages.value = response.data.total_pages
          transactions.items = response.data.transactions;
          Object.values(transactions.items).forEach(function (value) {
            let refId = {"Reference_Number": value.ref_no}
            let name = {"Name": value.emp_name}
            let amount = {"Amount": changeAmount(value.req_amount)}
            let organization = {"Organization": value.org_name}
            let obj = {"Date": changeDate(value.apply_date)}
            let obj2 = {"Status": changeStatus(value.remit_status)}
            Object.assign(value, refId)
            Object.assign(value, name)
            Object.assign(value, organization)
            Object.assign(value, amount)
            Object.assign(value, obj)
            Object.assign(value, obj2)
          })
          totalPagesForPagination.value = 2
          totalRecord.value = response.data.total_recodCount
          totalRequest.value = response.data.total_requests;
          attendedRequest.value = response.data.attended_requests;
          pendingRequest.value = response.data.pending_requests;
          completedRequest.value = response.data.completed_requests;
          dataForDownload.value = transactions.items
          // must get appilaction refence number when api is ready and give trn_id to this map
          const newArray = transactions.items.map(({
                                                     wfmainId,
                                                     show_remits,
                                                     show_rep_btn,
                                                     show_reprocess,
                                                     wf_level,
                                                     wf_status,
                                                     changeDate,
                                                     remit_status,
                                                     emp_name,
                                                     req_amount,
                                                     apply_date,
                                                     org_name,
                                                     trn_id,
                                                     ref_no,
                                                     bet_app_id,
                                                     total_recodCount,
                                                     total_pages,
                                                     ...rest
                                                   }) => {
            return rest
          })
          dataForDownload.value = newArray
        })
  } catch (error) {
    console.log("error", error)
  }
}
const fetchTransactionAPIonSeaching = () => {
  totalPagesForPagination.value = 0
  const clntId = employer.value
  canCount.value = 0
  if (search.value == '') {
    searchValue.value = '_XXX_'
  } else {
    searchValue.value = search.value
  }
  try {
    if (searchValue.value !== oldsearchValue.value || searchValue.value == '_XXX_') {
      const postData = {
        '"page_size"': showAmount.value,
        '"page_no"': page.value,
        '"sort_column"': sortfield.value,
        '"order"': ascORdsc.value,
        '"srch_text"': searchValue.value,
        '"fromDate"': startDate.value,
        '"toDate"': endDate.value,
        '"clntId"': `${clntId}`,
        '"status"': parseInt(action.value),
      };
      axios.post(Api.FETCH_TRANSACTIONS, postData)
          .then(response => {
            totalPages.value = response.data.total_pages
            transactions.items = response.data.transactions;
            Object.values(transactions.items).forEach(function (value) {
              let refId = {"Reference_Number": value.ref_no}
              let name = {"Name": value.emp_name}
              let amount = {"Amount": changeAmount(value.req_amount)}
              let organization = {"Organization": value.org_name}
              let obj = {"Date": changeDate(value.apply_date)}
              let obj2 = {"Status": changeStatus(value.remit_status)}

              Object.assign(value, refId)
              Object.assign(value, name)
              Object.assign(value, organization)
              Object.assign(value, amount)
              Object.assign(value, obj)
              Object.assign(value, obj2)
            })
            totalPagesForPagination.value = 2
            totalRequest.value = response.data.total_requests;
            attendedRequest.value = response.data.attended_requests;
            pendingRequest.value = response.data.pending_requests;
            completedRequest.value = response.data.completed_requests;
            totalRecord.value = response.data.total_recodCount
            if (action.value == -1) {
              isRejectSelected.value = true
            } else {
              isRejectSelected.value = false
            }
            dataForDownload.value = transactions.items
            // must get appilaction refence number when api is ready and give trn_id to this map
            const newArray = transactions.items.map(({
                                                       wfmainId,
                                                       show_remits,
                                                       show_rep_btn,
                                                       show_reprocess,
                                                       wf_level,
                                                       wf_status,
                                                       changeDate,
                                                       remit_status,
                                                       emp_name,
                                                       req_amount,
                                                       apply_date,
                                                       org_name,
                                                       trn_id,
                                                       ref_no,
                                                       bet_app_id,
                                                       total_recodCount,
                                                       total_pages,
                                                       ...rest
                                                     }) => {
              return rest
            })
            dataForDownload.value = newArray
            testpdfData = newArray
          })
    }
  } catch (error) {
    console.log("error", error)
  }
}
const fetchTransactionAPIonChange = () => {
  totalPagesForPagination.value = 0
  const clntId = employer.value
  canCount.value = 0
  if (search.value == '') {
    searchValue.value = '_XXX_'
  } else {
    searchValue.value = search.value
  }
  try {
      const postData = {
        '"page_size"': showAmount.value,
        '"page_no"': page.value,
        '"sort_column"': sortfield.value,
        '"order"': ascORdsc.value,
        '"srch_text"': searchValue.value,
        '"fromDate"': startDate.value,
        '"toDate"': endDate.value,
        '"clntId"': `${clntId}`,
        '"status"': parseInt(action.value),
      };
      axios.post(Api.FETCH_TRANSACTIONS, postData)
          .then(response => {
            totalPages.value = response.data.total_pages
            transactions.items = response.data.transactions;
            Object.values(transactions.items).forEach(function (value) {
              let refId = {"Reference_Number": value.ref_no}
              let name = {"Name": value.emp_name}
              let amount = {"Amount": changeAmount(value.req_amount)}
              let organization = {"Organization": value.org_name}
              let obj = {"Date": changeDate(value.apply_date)}
              let obj2 = {"Status": changeStatus(value.remit_status)}

              Object.assign(value, refId)
              Object.assign(value, name)
              Object.assign(value, organization)
              Object.assign(value, amount)
              Object.assign(value, obj)
              Object.assign(value, obj2)
            })
            totalPagesForPagination.value = 2
            totalRequest.value = response.data.total_requests;
            attendedRequest.value = response.data.attended_requests;
            pendingRequest.value = response.data.pending_requests;
            completedRequest.value = response.data.completed_requests;
            totalRecord.value = response.data.total_recodCount
            if (action.value == -1) {
              isRejectSelected.value = true
            } else {
              isRejectSelected.value = false
            }
            dataForDownload.value = transactions.items
            // must get appilaction refence number when api is ready and give trn_id to this map
            const newArray = transactions.items.map(({
                                                       wfmainId,
                                                       show_remits,
                                                       show_rep_btn,
                                                       show_reprocess,
                                                       wf_level,
                                                       wf_status,
                                                       changeDate,
                                                       remit_status,
                                                       emp_name,
                                                       req_amount,
                                                       apply_date,
                                                       org_name,
                                                       trn_id,
                                                       ref_no,
                                                       bet_app_id,
                                                       total_recodCount,
                                                       total_pages,
                                                       ...rest
                                                     }) => {
              return rest
            })
            dataForDownload.value = newArray
            testpdfData = newArray
          })
  } catch (error) {
    console.log("error", error)
  }
}
const changeDate = (value) => {
  const date = new Date(value);
  let dateChanged;
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let oldMonth = date.getMonth();
  let year = date.getFullYear();
  if (month < 10) {
    dateChanged = `${year}-0${month}-${day}`;
  } else {
    dateChanged = `${year}-${month}-${day}`;
  }
  return dateChanged
}
const changeStatus = (value) => {
  const status = value
  if (status == 0) {
    return "Pending"
  } else if (status == 1) {
    return "Completed"
  } else if (status == -1) {
    return "Rejected"
  }
}
const changeAmount = (value) => {
  return value.toFixed(2)
}
const isLevelCheck = (p) => {
  if (userLevel.value == p.wf_level) {
    return false
  } else {
    return true
  }
}
const onSort = (para, order) => {
  asc.value = !asc.value
  sortfield.value = para;
  ascORdsc.value = order
  fetchTransactionAPIonChange()
}
const getDefaultDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let oldMonth = date.getMonth();
  let year = date.getFullYear();
  let oldYear = date.getFullYear();
  if (oldMonth == 0) {
    oldMonth = 12
    oldYear = year - 1
  }
  const currentDate = `${year}-${month}-${day}`;
  const oldDate = `${oldYear}-${oldMonth}-${day}`;
  startDate.value = oldDate;
  endDate.value = currentDate;
}

const formatStart = (startDate) => {
  startDateReal.value = startDate
  const day = startDate.getDate();
  let newDate = 0
  if (day < 10) {
    newDate = `0${day}`
  } else {
    newDate = day
  }
  let month = startDate.getMonth() + 1;
  let newMonth = 0;
  if (month < 10) {
    newMonth = `0${month}`
  } else {
    newMonth = month
  }
  const year = startDate.getFullYear();
  return `${year}-${newMonth}-${newDate}`
}
const formatEnd = (endDate) => {
  endDateReal.value = endDate
  const day = endDate.getDate();
  let newDate = 0
  if (day < 10) {
    newDate = `0${day}`
  } else {
    newDate = day
  }
  const month = endDate.getMonth() + 1;
  let newMonth = 0;
  if (month < 10) {
    newMonth = `0${month}`
  } else {
    newMonth = month
  }
  const year = endDate.getFullYear();
  return `${year}-${newMonth}-${newDate}`
}
const searching = () => {
  //new code here
  /*
  let typingTimer;
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
        fetchTransactionAPIonSeaching()
        oldsearchValue.value = search.value
      }
      , 1000)
*/
  //old code here
   fetchTransactionAPIonChange()
}
const update = () => {
  fetchTransactionAPIonChange()
}
const changeStart = () => {
  const start = startDate.value
  const year = start.getFullYear()
  const month = start.getMonth() + 1
  const date = start.getDate()
  const newStart = `${year}-${month}-${date}`
  startDate.value = newStart
  endDate.value = ""
}
const changeEnd = () => {
  const end = endDate.value
  const year = end.getFullYear()
  const month = end.getMonth() + 1
  const date = end.getDate()
  const newEnd = `${year}-${month}-${date}`
  endDate.value = newEnd
  if (startDateReal.value > endDateReal.value) {
    startDate.value = ""
  }
}
const checkAll = () => {
  isAllCheck.value = !(isAllCheck.value)
  if (isAllCheck.value == false) {
    for (const key in transactions.items) {
      transactions.items[key].selected = true;
      canCount.value = transactions.items.length
    }
  } else {
    for (const key in transactions.items) {
      transactions.items[key].selected = false;
      canCount.value = 0
    }
  }
}
const onUpdateCheck = (p) => {
  if (p["selected"]) {
    canCount.value++
    actionableTransactions.items.push({"trn_id": p.trn_id, "wfmain_id": p.wfmainId})
    const key = 'trn_id';
    const arrayUniqueByKey = [...new Map(actionableTransactions.items.map(item =>
        [item[key], item])).values()];
    actionableTransactions.items = arrayUniqueByKey
  } else {
    canCount.value--
    let dedupThings = actionableTransactions.items
    actionableTransactions.items = dedupThings.filter((e) => e.trn_id != p.trn_id)
  }
}
const fetchInvoiceDetails = (p) => {
  try {
    const postData = {
      "trn_id": p
    };
    axios.post(Api.FETCH_INVOICE_DETAILS, postData)
        .then(response => {
          posts.items = response.data
          cost.value = posts.items.total_ded
          total.value = posts.items.total_bank
          image.value = posts.items.hsenid_image
          invoiceNo.value = posts.items.invoice_no
          amount.value = posts.items.req_amount
          hsenidAddress.value = posts.items.hsenid_address
          hsenidName.value = posts.items.hsenid_name
          contact.value = posts.items.hsenid_contact
          const delimiter = '#';
          substrings.value = hsenidAddress.value.split(delimiter);
        })
  } catch (error) {
    console.log("error", error)
  }
}
const openActionModalapi = () => {
  isActionApi.value = true
}
const optionUpdateActionApi = () => {
  isActionApi.value = false
}
const openMoreModalApi = (p) => {
  propsMore.value = p.trn_id
  propsRef.value = p.Reference_Number
  isMoreApi.value = true
}
const openInvoiceModalApi = (p) => {
  fetchInvoiceDetails(p.trn_id)
  propsInvoice.value = p.trn_id
  isInvoiceApi.value = true
}
const openWorkFlowModalApi = (p) => {
  propsWFId.value = p.wfmainId
  propsWF.value = {trn_id: p.trn_id, wfmain_id: propsWFId.value}
  isWorkApi.value = true
}
const openReprocessModalApi = (p) => {
  if (p.show_reprocess != 1)
    return
  propsReprocess.value = p.trn_id
  isProcessApi.value = true
}
const modalCloseReprocess = (p) => {
  isProcessApi.value = false
}
const openRefectedModalApi = (p) => {
  propsRefect.value = p.trn_id
  propsShow.value = p.show_rep_btn
  if (p.show_remits != 1)
    return
  isRejectedApi.value = true
}
const modalCloseReject = () => {
  isRejectedApi.value = false
  fetchTransactionAPIonChange()
}
const modalClose = () => {
  isInvoiceApi.value = false
}
const modalCloseMore = () => {
  isMoreApi.value = false
}
const modalCloseAction = () => {
  isActionApi.value = false
  actionableTransactions.items = []
  fetchTransactionAPIonChange()
}
const refreshTransactions = () => {
  fetchTransactionAPIonChange()
}
const modalWFClose = () => {
  isWorkApi.value = false
}
const onChangeAction = () => {
  canCount.value = 0
  if (action.value == 1) {
    isApproved.value = true
  } else {
    isApproved.value = false
  }
}
//pagination methods
const handlePageChange = (value) => {
  if (value.target.textContent == '>') {
    pageNo.value++
    page.value++
  } else if (value.target.textContent == '<') {
    pageNo.value--
    page.value--
  } else if (value.target.textContent == '>>') {
    pageNo.value = totalPages.value
    page.value = parseInt(totalPages.value)
  } else if (value.target.textContent == '<<') {
    pageNo.value = 1
    page.value = 1
  } else {
    pageNo.value = value.target.ariaLabel.replace(/\D/g, "")
    page.value = parseInt(pageNo.value)
  }
  fetchTransactionAPIonChange()
}
const showGrid = () => {
  show.value = !show.value
}
const testexcel = (data) => {
  const url = URL.createObjectURL(new Blob([data], {
    type: 'application/vnd.ms-excel'
  }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'data s')
  document.body.appendChild(link)
  link.click()
}
const exportToExcel = () => {
  const XLSX = xlsx;
  const workbook = XLSX.utils.book_new();
  var arr = [];
  for (var i = 0; i < testpdfData.length; i++) {
    arr.push(testpdfData[i]);
  }
  const worksheet = XLSX.utils.json_to_sheet(arr);
  XLSX.utils.book_append_sheet(workbook, worksheet, "framework");
  XLSX.writeFile(workbook, "framework.xlsx");
}
const downloadAsExcelAPI = () => {
  const ws = xlsx.utils.json_to_sheet(testpdfData)
  const wb = {
    Sheets: {
      'data': ws
    },
    SheetNames: ['data']
  };
  const excelBuffer = xlsx.write(wb, {bookType: 'xlsx', type: 'array'});
  saveAsExcelAPI(excelBuffer)
}
const saveAsExcelAPI = (buffer) => {
  const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';
  const EXCEL_EXTENSION = '.xlsx';
  const data = new Blob([buffer], {
    type: EXCEL_TYPE
  });
  let fileURL = URL.createObjectURL(data);
  let fileLink = document.createElement('a');
  fileLink.href = fileURL;
  fileLink.download = 'Earn Wage Records.xlsx'

// triggers the click event
  fileLink.click();
}
const onChangeShowDropdown = () => {
  pageSize.value = showAmount.value
  fetchTransactionAPIonChange()
}
const fetchNewRecords = () => {
  try {
    const postData = {
      "clntId": employer.value,
    };
    axios.post(Api.NEW_RECORD, postData)
        .then(response => {
          fetchTransactionAPIonChange();
        })
  } catch (error) {
    console.log("error", error)
  }
}
const isRetrieve = () => {
  try {
    const postData = {
      "clntId": employer.value,
    };
    axios.post(Api.IS_RETRIEVE_RECORD, postData)
        .then(response => {
          if (response.data.result == '1') {
            showRetrive.value = true
            fetchNewRecords();
          } else {
            showRetrive.value = false
            fetchTransactionAPIonChange()
          }
        })
  } catch (error) {
    console.log("error", error)
  }
}
const onClickRetrieve = () => {
  fetchNewRecords();
}
const onChangeEmployer = () => {
  isRetrieve();

}
</script>

<style>
.header {
  width: 110%;
  margin-top: 1%;
}

.white-color-text {
  color: white !important;
}

.disable {
  pointer-events: none;
}

.hide {
  visibility: hidden;
}

.custom-dropdown {
  height: 2.05rem !important;
}

.disableCheck2 {
  pointer-events: none;
  opacity: 0.3;
}

.customUnderline {
  text-decoration: underline;
  pointer-events: auto;
}

.warning-label-custom {
  padding: 3px 15px;
}

.dp__action_button dp__action_select {
  background-color: red !important;
}

.dp-custom-input {
  box-shadow: 0 0 6px #1976d2;
  color: lightseagreen;
}

.title {
  text-align: center;
}

.right {
  text-align: right;
}

.diableColumn {
  opacity: 1;
  pointer-event: none
}

.custom_icon {
  border: 1px solid #e7eaec;
  height: 2.4rem;
}

thead {
  border-style: hidden;
}

.rowprint {
  display: table-row !important;
}

.cellprint {
  display: table-cell !important;
  padding: 16px;
}

#tablePrint {
  display: table;
  width: 1200px;
  border-collapse: collapse;
  margin-left: -1.5%;
}

.checkbox1 {
  background-color: white;
}

.checkbox1 .overlay {
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #e7eaec;
}

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  opacity: 0.1;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px black solid;
}

@media print {
  body * {
    display: none;
  }

  #printSection, #printSection * {
    display: block;
  }

  #printSection {
    position: absolute;
    left: 0;
    top: 0;
    width: 1200px;
  }

  #noPrintMe {
    display: none;
  }

  #spanPrint {
    display: inline !important;
  }

  #tablePrint {
    display: table;
    width: 800px;
    border-collapse: collapse;
    margin-left: -1.5%;
  }

  .cell {
    display: table-cell !important;
    padding: 16px;
  }

  #headerPrint {
    width: 800px !important;
  }

  #testgridcon {
    width: 800px !important;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #printImage {
    width: 50% !important;
    margin-left: 3%;
  }

  #printTitle {
    display: none;
  }
}

</style>