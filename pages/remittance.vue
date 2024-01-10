<template>
  <div id="wrapper">
    <div class="row wrapper border-bottom white-bg page-heading header">
      <div class="col-lg-12">
        <h2>Remittance Issues</h2>
      </div>
    </div>
  </div>
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-md-12">
        <div class="ibox">
          <div class="ibox-content">
            <ul class="nav nav-tabs" id="ViewTabs" role="tablist" style="margin-bottom:2%">
              <li class="nav-item" role="presentation">
                <a
                    @click="onClickOne"
                    class="nav-link active"
                    id="remittance-tab"
                    data-toggle="tab"
                    href="#tabRemittanceIssues"
                    role="tab"
                    aria-controls="remittance"
                    aria-selected="true"
                >Remittance Issues</a
                >
              </li>
              <li class="nav-item" role="presentation">
                <a
                    @click="onClickTwo"
                    class="nav-link"
                    id="alert-tab"
                    data-toggle="tab"
                    href="#AlertHistory"
                    role="tab"
                    aria-controls="alert"
                    aria-selected="false"
                >
                  Alert History</a
                >
              </li>
            </ul>
            <div v-if="tab1">
              <div class="form-group row">
                <label class="col-md-2 ">Select Date Period</label>
                <div class="col-md-2">
                  <div class="input-group">
                    <div class="input-group date input-group-sm" data-provide="datepicker">
                      <vue-date-picker v-model="startDate" :format="formatStart" :enableTimePicker="false"
                                       class="my-picker-class" @update:model-value="changeStart"></vue-date-picker>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="input-group ">
                    <div class="input-group date input-group-sm" data-provide="datepicker">
                      <vue-date-picker v-model="endDate" :format="formatEnd" :enableTimePicker="false"
                                       @update:model-value="changeEnd"></vue-date-picker>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-2">Name of the Employer </label>
                <div class="col-md-4">
                  <select v-model="employer" class="form-control custom-dropdown">
                    <option v-for="i in employees.items" :key="i.clientId" :value="i.clientId">{{
                        i.clientName
                      }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-2">Status</label>
                <div class="col-md-4">
                  <select v-model="statusValue" class="form-control" @change="onChangeStatus">
                    <option v-for="i in statusArray" :key="i.id" :value="i.value">{{ i.label }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row m-t-md">
                <label class="col-md-2"></label>
                <div class="col-md-4">
                  <button class="btn btn-sm  btn-primary" type="button" @click="update">Search</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-9">
                  <div v-if="isReprocessAllowed" class="fa-pull-left">
                    <button class="btn btn-sm  btn-primary button-margin" type="button" @click="onReprocess"
                            v-if="false"
                            v-show="canCount > 0">Direct to Reprocess
                    </button>
                    <button class="btn btn-sm  btn-primary button-margin" type="button" @click="onResolved"
                            v-show="canCount > 0">Resolved
                    </button>
                  </div>
                </div>
                <div v-if="true" class="col-md-3">
                  <div class="input-group">
                    <a v-show="true && transactions.items.length > 0" class="btn btn-white btn-bitbucket"
                       @click="downloadAsExcelAPI">
                      <i class="fa-sharp fa-solid fa-file-excel"></i>
                    </a>
                    <a v-show="true && transactions.items.length > 0" class="btn btn-white btn-bitbucket m-r-xs"
                       @click="exportToPdf">
                      <i class="fa-solid fa-file-pdf"></i>
                    </a>
                    <input v-model="search" class="form-control form-control" type="text" @keyup="searching" style="margin-left: -5px">
                    <span class="input-group-append"> <a class="btn btn-white btn-bitbucket m-r-xs" type="button"  @click="searching"><i
                        class="fa fa-search"></i>
                              </a> </span>
                  </div>
                </div>
              </div>
              <!-- Alert -->
              <div v-show="isPopoverResolvedShow">
                <div id="myModal4" aria-modal="true" class="modal inmodal show" role="dialog"
                     style="display: block; padding-right: 17px;" tabindex="-1">
                  <div class="modal-dialog">
                    <div class="modal-content animated fadeIn">
                      <div class="modal-body">
                        <h4>Are you sure this request is resolved?</h4>
                      </div>
                      <div class="modal-footer">
                        <button class="btn btn-white popover-button" data-dismiss="modal" type="button"
                                @click="onSelecting('n')">No
                        </button>
                        <button class="btn btn-primary" type="button" @click="onSelecting('y')">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="isPopoverReprocessShow">
                <div id="myModal4" aria-modal="true" class="modal inmodal show" role="dialog"
                     style="display: block; padding-right: 17px;" tabindex="-1">
                  <div class="modal-dialog">
                    <div class="modal-content animated fadeIn">
                      <div class="modal-body"><h4>Are you sure you want to redirect this request for reprocessing ?</h4>
                      </div>
                      <div class="modal-footer">
                        <button class="btn btn-white popover-button" data-dismiss="modal" type="button"
                                @click="onSelectingResolved('n')">No
                        </button>
                        <button class="btn btn-primary" type="button" @click="onSelectingResolved('y')">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row m-t-sm">
                <div class="col-md-12">
                  <div id="element-to-convert">
                    <table class="table table-bordered table-sm" v-if="nonPDF">
                      <thead>
                      <tr>
                        <th></th>
                        <th>Application Reference Number</th>
                        <th>Employee Name</th>
                        <th>Organization</th>
                        <th>Submitted Date</th>
                        <th>Reason for Remittance Failure</th>
                        <th>More Details</th>
                        <th>Remittance Status</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(p, i) in transactions.items" :key="i">
                        <td><input v-model="p.selected" type="checkbox" v-bind:value="p" @change="onUpdateCheck(p)"
                                   :class="{disableCheck2: !isReprocessAllowed}"></td>
                        <td>{{ p.Reference_Number }}</td>
                        <td>{{ p.Name }}</td>
                        <td>{{ p.Organization }}</td>
                        <td>{{ p.Date }}</td>
                        <td>{{ p.Reason }}</td>
                        <td style="text-align:center;"><a><i class="fa-sharp fa-solid fa-file"
                                                             data-target="#MoreDetails"
                                                             data-toggle="modal" @click="openMoreModalApi(p)"></i></a>
                        </td>
                        <td v-if="p.status === 1" style="text-align:center;"><span
                            class="label label-primary">Resolved</span></td>
                        <td v-if="p.status === 0" style="text-align:center;"><span
                            class="label label-warning">Pending</span></td>
                      </tr>
                      </tbody>
                    </table>
                    <table class="table table-bordered table-sm" v-if="!nonPDF" ref="export_table">
                      <thead>
                      <tr>
                        <th></th>
                        <th>Application Reference Number</th>
                        <th>Employee Name</th>
                        <th>Organization</th>
                        <th>Submitted Date</th>
                        <th>Reason for Remittance Failure</th>
                        <th>Remittance Status</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(p, i) in transactions.items" :key="i">
                        <td></td>
                        <td>{{ p.Reference_Number }}</td>
                        <td>{{ p.Name }}</td>
                        <td>{{ p.Organization }}</td>
                        <td>{{ p.Date }}</td>
                        <td>{{ p.Reason }}</td>
                        <td v-if="p.status === 1"  style="text-align:top;font-size:14px;"><span>Resolved</span></td>
                        <td v-if="p.status === 0" style="text-align:top;font-size:14px;"><span>Pending</span></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
                <!--pagination-->
                <div v-if="true">
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
                              aria-controls="my-table"
                          ></b-pagination>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="tab2" @click="onClickTwo">
              <div class="form-group row">
                <label class="col-md-2 ">Select Date Period</label>
                <div class="col-md-2">
                  <div class="input-group">
                    <div class="input-group date input-group-sm" data-provide="datepicker">
                      <vue-date-picker v-model="startDate2" :format="formatStart2" :enableTimePicker="false"
                                       class="my-picker-class" @update:model-value="changeStart2"></vue-date-picker>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="input-group ">
                    <div class="input-group date input-group-sm" data-provide="datepicker">
                      <vue-date-picker v-model="endDate2" :format="formatEnd2" :enableTimePicker="false"
                                       @update:model-value="changeEnd2"></vue-date-picker>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-2">Name of the Employer </label>
                <div class="col-md-4">
                  <select v-model="employerAlert" class="form-control custom-dropdown">
                    <option v-for="i in employeesAlerts.items" :key="i.clientId" :value="i.clientId">{{
                        i.clientName
                      }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group row m-t-md">
                <label class="col-md-2"></label>
                <div class="col-md-4">
                  <button class="btn btn-sm  btn-primary" type="button" @click="update2">Search</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-9">
                  <div class="fa-pull-left">
                    <button class="btn btn-sm  btn-primary button-margin" type="button" @click="onResend"
                            v-if="actionableTransactions.items.length>0">Resend
                    </button>
                  </div>
                </div>
              </div>
              <div v-show="isPopoverResendShow">
                <div id="myModal4" aria-modal="true" class="modal inmodal show" role="dialog"
                     style="display: block; padding-right: 17px;" tabindex="-1">
                  <div class="modal-dialog">
                    <div class="modal-content animated fadeIn">
                      <div class="modal-body"><h4>Are you sure that you want to resend this alert?</h4>
                      </div>
                      <div class="modal-footer">
                        <button class="btn btn-white popover-button" data-dismiss="modal" type="button"
                                @click="onSelectingResent('n')">No
                        </button>
                        <button class="btn btn-primary" type="button" @click="onSelectingResent('y')">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group row m-t-sm">
                <div class="col-md-12">
                  <table class="table table-bordered table-sm">
                    <thead>
                    <tr>
                      <th></th>
                      <th>Alert Initiation Date</th>
                      <th>Attempts</th>
                      <th>Alert Subject</th>
                      <th>Recipients</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(q, i) in alert.items" :key="i">
                      <td><input v-model="q.selected" type="checkbox" v-bind:value="q" @change="onUpdateCheckAlert(q)"
                      ></td>
                      <td>{{ q.logDate.substring(0, 10) }}</td>
                      <td>{{ q.attempt }}</td>
                      <td>{{ q.alertSubject }}</td>
                      <td>{{ q.receipants }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <MoreDetailsModal v-if="isMoreApi" :application="propsRef" :more="propsMore" @modalClose="modalCloseMore"/>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import html2pdf from "html2pdf.js";

export default {
  name: "remittance",
  components: {
    VueDatePicker,
  },
  data: () => {
    return {
      startDate: '',
      endDate: '',
      isAllChecked: false,
      nonPDF: true,
      empName: "",
    }
  },
  methods: {
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
  }
}
</script>

<script setup>
import {ref, watch} from "vue";
import * as Api from "@/constants/constants";
import {GET_ALERTS, GET_REMITTANCE_ISSUES, RESENDING_ALERTS, SEND_SUPPORT_STATUS} from "../constants/constants";
import {useUserId} from "../composables/states";
import {
  onReprocessSuccess,
  onResolveSuccess,
  onReprocessFailed,
  changeMemberSuccess,
  onResendSuccess,
} from "../Utils/toastUtils";
import xlsx from "xlsx/dist/xlsx.full.min";

const axios = useNuxtApp().$axios
const {$swal} = useNuxtApp()

const userId = useUserId()
let canCount = ref(0)
let canCountAlerts = ref(0)
let isReprocessAllowed = ref(true)
let isPopoverResolvedShow = ref(false)
let isPopoverReprocessShow = ref(false)
let isPopoverResendShow = ref(false)
let isApproved = ref(false)
let startDateReal = ref("")
let endDateReal = ref("")
let startDate = ref("")
let endDate = ref("")
let startDate2 = ref("")
let endDate2 = ref("")
const employer = ref("1")
const employerAlert = ref("0")
const statusValue = ref(0)
let show = ref(false)
let tab1 = ref(true)
let tab2 = ref(false)
let propsMore = ref("")
let propsRef = ref(0)
let alertList = ref([])
let isMoreApi = ref(false)
let testpdfData = {}
let search = ref("")
//pagination
let page = ref(1)
let pageSize = ref(10)
let showAmount = ref(10)
let totalRecord = ref(0)
let pageNo = ref(1)
let totalPagesForPagination = ref(0)
let displayPaginationText = ref('')
let totalPages = ref(0)
const dataForDownload = ref([])
const employers = ref([
  {id: 1, label: 'Approving Levels', value: 'Support Team Member'},
  {id: 2, label: 'Support Team Member', value: 'Support Team Member'},
]);
const statusArray = ref([
  {id: 1, label: "Resolved", value: '1'},
  {id: 2, label: "Pending", value: '0'},
])
let showRecordsArray = ref([
  {id: 1, label: '10', value: 10},
  {id: 2, label: '25', value: 25},
  {id: 3, label: '50', value: 50},
  {id: 4, label: '100', value: 100},
]);
let employees = reactive({
  items: []
})
let employeesAlerts = reactive({
  items: []
})
let transactions = reactive({
  items: []
})
let transactionsForSearching = reactive({
  items: []
})
let transactionsForPagination = reactive({
  items: []
})
let alert = reactive({
  items: []
})
let actionableTransactions = reactive({
  items: []
})
let actionableEmitts = reactive({
  items: []
})

//mounted
onMounted(() => {
  getDefaultDate();
  fetchEmployeesAPI();
  fetchRemittanceIssuesAPI();
  fetchEmployeesAPIForAlert();
  fetchAlertsAPI();
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
    //firstDigit = page.value * showAmount.value - showAmount.value + 1
  }
  displayPaginationText = `${firstDigit} - ${secondDigit}`
  return displayPaginationText;
})
const getDefaultDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let oldMonth = date.getMonth();
  let year = date.getFullYear();
  let oldYear = date.getFullYear();
  if(oldMonth == 0){
    oldMonth = 12
    oldYear = year - 1
  }
  const currentDate = `${year}-${month}-${day}`;
  const oldDate = `${oldYear}-${oldMonth}-${day}`;
  startDate.value = oldDate;
  endDate.value = currentDate;
  startDate2.value = oldDate;
  endDate2.value = currentDate;
}
const formatStart = (startDate) => {
  startDateReal.value = startDate
  const day = startDate.getDate();
  let newDate = 0
  if (day < 9) {
    newDate = `0${day}`
  } else {
    newDate = day
  }
  const month = startDate.getMonth() + 1;
  let newMonth = 0;
  if (month < 9) {
    newMonth = `0${month}`
  } else {
    newMonth = month
  }
  const year = startDate.getFullYear();
  return `${year}-${newMonth}-${newDate}`
}
const formatStart2 = (startDate) => {
  startDateReal.value = startDate
  const day = startDate.getDate();
  let newDate = 0
  if (day < 9) {
    newDate = `0${day}`
  } else {
    newDate = day
  }
  const month = startDate.getMonth() + 1;
  let newMonth = 0;
  if (month < 9) {
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
  if (day < 9) {
    newDate = `0${day}`
  } else {
    newDate = day
  }
  const month = endDate.getMonth() + 1;
  let newMonth = 0;
  if (month < 9) {
    newMonth = `0${month}`
  } else {
    newMonth = month
  }
  const year = endDate.getFullYear();
  return `${year}-${newMonth}-${newDate}`
}
const formatEnd2 = (endDate) => {
  endDateReal.value = endDate
  const day = endDate.getDate();
  let newDate = 0
  if (day < 9) {
    newDate = `0${day}`
  } else {
    newDate = day
  }
  const month = endDate.getMonth() + 1;
  let newMonth = 0;
  if (month < 9) {
    newMonth = `0${month}`
  } else {
    newMonth = month
  }
  const year = endDate.getFullYear();
  return `${year}-${newMonth}-${newDate}`
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
const changeStart2 = () => {
  const start = startDate2.value
  const year = start.getFullYear()
  const month = start.getMonth() + 1
  const date = start.getDate()
  const newStart = `${year}-${month}-${date}`
  startDate2.value = newStart
  endDate2.value = ""
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
const changeEnd2 = () => {
  const end = endDate2.value
  const year = end.getFullYear()
  const month = end.getMonth() + 1
  const date = end.getDate()
  const newEnd = `${year}-${month}-${date}`
  endDate2.value = newEnd

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
const fetchEmployeesAPIForAlert = () => {
  axios.get(Api.FETCH_EMPLOYEES)
      .then(response => {
        employeesAlerts.items = response.data
        employeesAlerts.items.unshift({clientId: "0", clientName: "All"})
      })
      .catch(() => {
        console.log("error");
      });
}
const fetchAlertsAPI = () => {
  const clntId = employerAlert.value
  try {
    const postData = {
      'fromDate': startDate2.value,
      'toDate': endDate2.value,
      'clntId': `${clntId}`,
    };
    axios.post(Api.GET_ALERTS, postData)
        .then(response => {
          alert.items = response.data;
        })
  } catch (error) {
    console.log("error", error)
  }
}
const fetchRemittanceIssuesAPI = () => {
  totalPagesForPagination.value = 0
  try {
    const postData = {
      '"fromDate"': startDate.value,
      '"toDate"': endDate.value,
      '"clntId"': "1",
      '"status"': statusValue.value
    };
    axios.post(Api.GET_REMITTANCE_ISSUES, postData)
        .then(response => {
          transactions.items = response.data;
          transactionsForSearching.items = response.data;
          totalRecord.value = transactions.items.length
          totalPages.value = Math.ceil(totalRecord.value / pageSize.value)

          Object.values(transactions.items).forEach(function (value) {
            let ref_no = {"Reference_Number": value.ref_no}
            let name = {"Name": value.emp_name}
            let organization = {"Organization": value.orgName}
            let reason = {"Reason": value.reason}
            let obj = {"Date": changeDate(value.req_date)}
            let obj2 = {"Remittance_Status": changeStatusOnPrint(value.status)}
            Object.assign(value, ref_no)
            Object.assign(value, name)
            Object.assign(value, organization)
            Object.assign(value, obj)
            Object.assign(value, reason)
            Object.assign(value, obj)
            Object.assign(value, obj2)
          })
          //  items.length
          totalPagesForPagination.value = 2
          dataForDownload.value = transactions.items
          const newArray = transactions.items.map(({
                                                     remitId,
                                                     trnId,
                                                     emp_name,
                                                     req_date,
                                                     orgName,
                                                     changeDate,
                                                     reason,
                                                     status,
                                                     ref_no,
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
  update();
}
const onUpdateCheck = (p) => {
  let remitId = p.remitId;
  if (p["selected"]) {
    canCount.value++
    actionableEmitts.items.push(p.remitId)
  } else {
    canCount.value--
    actionableEmitts.items = actionableEmitts.items.filter((e) => e !== remitId)
  }
}
const onUpdateCheckAlert = (p) => {
  let alertId = p.logId;
  if (p["selected"]) {
    canCountAlerts.value++
    actionableTransactions.items.push({'logId': p.logId})
    const key = 'logId';
    const arrayUniqueByKey = [...new Map(actionableTransactions.items.map(item =>
        [item[key], item])).values()];
    actionableTransactions.items = arrayUniqueByKey
  } else {
    canCountAlerts.value--
    let dedupThings = actionableTransactions.items
    actionableTransactions.items = dedupThings.filter((e) => e.logId != p.logId)
  }
  alertList = actionableTransactions.items
}
const onChangeStatus = () => {
  canCount.value = 0
  if (statusValue.value == 1) {
    isReprocessAllowed.value = false
  } else {
    isReprocessAllowed.value = true
  }
  transactions.items = []
}
const changeStatusOnPrint = (value) => {
  const status = value
  if (status == 0) {
    return "Pending"
  } else if (status == 1) {
    return "Resolved"
  }
}
const searching = () => {
  let filteredUsers = [];
  for (let i= 0; i<transactions.items.length; i++) {
    if (transactions.items[i].Reference_Number.toString().includes(search.value) ) {
      filteredUsers = [...filteredUsers, transactions.items[i]]
    }
  }
  if(filteredUsers.length == 0 || search.value == ""){
    transactions.items =  transactionsForSearching.items
    transactions.items = []
    search.value = ""
    fetchRemittanceIssuesOnChange()
  }else{
    transactions.items = filteredUsers
  }
}
const update = () => {
  page.value = 1
  fetchRemittanceIssuesOnChange()
}
const update2 = () => {
  const clntId = employerAlert.value
  try {
    const postData = {
      'fromDate': startDate2.value,
      'toDate': endDate2.value,
      'clntId': `${clntId}`,
    };
    axios.post(Api.GET_ALERTS, postData)
        .then(response => {
          alert.items = response.data;
        })
  } catch (error) {
    console.log("error", error)
  }
}
const fetchRemittanceIssuesOnChange = () => {
  totalPagesForPagination.value = 0
  const clntId = employer.value
  try {
    const postData = {
      '"fromDate"': startDate.value,
      '"toDate"': endDate.value,
      '"clntId"': `${clntId}`,
      '"status"': parseInt(statusValue.value)
    };
    axios.post(Api.GET_REMITTANCE_ISSUES, postData)
        .then(response => {
          transactions.items = response.data;
          transactionsForSearching.items = response.data;
          totalRecord.value = transactions.items.length
          totalPages.value = Math.ceil(totalRecord.value / pageSize.value)
          if (page.value == 1) {
            transactions.items = transactions.items.slice(page.value - 1, pageSize.value)
          } else {
            transactions.items = transactions.items.slice((page.value - 1) * pageSize.value, pageSize.value * page.value)
          }
          Object.values(transactions.items).forEach(function (value) {
            let ref_no = {"Reference_Number": value.ref_no}
            let name = {"Name": value.emp_name}
            let organization = {"Organization": value.orgName}
            let reason = {"Reason": value.reason}
            let obj = {"Date": changeDate(value.req_date)}
            let obj2 = {"Remittance_Status": changeStatusOnPrint(value.status)}
            Object.assign(value, ref_no)
            Object.assign(value, name)
            Object.assign(value, organization)
            Object.assign(value, obj)
            Object.assign(value, reason)
            Object.assign(value, obj)
            Object.assign(value, obj2)
          })
          totalPagesForPagination.value = 2
          dataForDownload.value = transactions.items
          const newArray = transactions.items.map(({
                                                     remitId,
                                                     trnId,
                                                     emp_name,
                                                     req_date,
                                                     orgName,
                                                     changeDate,
                                                     reason,
                                                     status,
                                                     ref_no,
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
const onClickOne = () => {
  tab1.value = true
  tab2.value = false
}
const onClickTwo = () => {
  tab1.value = false
  tab2.value = true
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
    return "Resolved"
  }
}
const onSelecting = (p) => {
  if (p == "n") {
    isPopoverResolvedShow.value = false
    return
  }
  onResolvedApi()
  isPopoverResolvedShow.value = false
}
const onResolvedApi = () => {
  let payload = {}
  payload.remit_ids = actionableEmitts.items
  payload.user_id = userId.value
  payload.status = 1
  try {
    axios.post(Api.SEND_SUPPORT_STATUS, payload)
        .then(response => {
          fetchRemittanceIssuesOnChange()
          actionableEmitts.items = []
          onResolveSuccess("The record marked as resolved !")
          canCount.value = 0
        //  isReprocessAllowed.value = false
        })
  } catch (error) {
    console.log("error", error)
    actionableEmitts.items = []
    onReprocessFailed("Unexpected error occurred ! Please try again later!")
  }
}
const onReprocess = () => {
  isPopoverReprocessShow.value = true
}
const onResend = () => {
  isPopoverResendShow.value = true
}
const onReprocess2 = () => {
  onReprocessAlert('', `Are you sure you want to redirect this request for reprocessing ?`, 'Yes')
}
const onResolved2 = () => {
  onResolvedAlert('', `Are you sure this request is resolved?`, 'Yes')
}
const onReprocessAlert = (title, text, btnText) => {
  $swal.fire({
    title: `${title}`,
    text: `${text}`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${btnText}`
  }).then((result) => {
    if (result.value) {
      onReprocessApi()
    }
  })
}
const onResolvedAlert = (title, text, btnText) => {
  $swal.fire({
    title: `${title}`,
    text: `${text}`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${btnText}`
  }).then((result) => {
    if (result.value) {
      onResolvedApi()
    }
  })
}
const onResend1 = () => {
  onResendAlert('', `Are you sure that you want to resend this alert?`, 'Yes')
  resendAlert()
}
const resendAlert = () => {
  try {
    var payload = {}
    payload = {
      alertList
    };
    Object.values(payload)
    var stringPayload = Object.values(payload)
    let newStringPayload = ""
    stringPayload = JSON.stringify(stringPayload)
    newStringPayload = stringPayload
    newStringPayload = stringPayload.slice(0, -1)
    newStringPayload = newStringPayload.slice(1)
    axios.post(Api.RESENDING_ALERTS, newStringPayload)
        .then(response => {
          payload = response.data;
          onResendSuccess("Alert sent !")
          fetchAlertsAPI();
        })
  } catch (error) {
    console.log("error", error)
  }
}
const onResendAlert = (title, text, btnText) => {
  $swal.fire({
    title: `${title}`,
    text: `${text}`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${btnText}`
  }).then((result) => {
    if (result.value) {
      //method to resend
      resendAlert()
    }
  })
}
const onReprocessApi = () => {
  let payload = {}
  payload.remit_ids = actionableEmitts.items
  payload.user_id = userId.value
  payload.status = 2
  try {
    axios.post(Api.SEND_SUPPORT_STATUS, payload)
        .then(() => {
          fetchRemittanceIssuesOnChange()
          onReprocessSuccess("The record is directed for reprocessing")
          actionableEmitts.items = []
          // change code to remove diable
          canCount.value = 0
        //  isReprocessAllowed.value = false
        })
  } catch (error) {
    console.log("error", error)
    onReprocessFailed("This request has not been reprocessed. Please contact the support team for further assistance!")
  }
}
const onSelectingResolved = (p) => {
  if (p == "n") {
    isPopoverReprocessShow.value = false
    return
  }
  onReprocessApi()
  isPopoverReprocessShow.value = false
}
const onSelectingResent = (p) => {
  if (p == "n") {
    isPopoverResendShow.value = false
    return
  }
  resendAlert()
  isPopoverResendShow.value = false
}

const onResolved = () => {
  isPopoverResolvedShow.value = true
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
const onChangeAction = () => {
  if (action.value == 1) {
    isApproved.value = true
  } else {
    isApproved.value = false
  }
}
const openMoreModalApi = (p) => {
  propsMore.value = p.trnId
  propsRef.value = p.ref_no
  isMoreApi.value = true
}
const modalCloseMore = () => {
  isMoreApi.value = false
}
//test methods
const showGrid = () => {
  show.value = !show.value
}
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
  fetchRemittanceIssuesOnChange()
}
</script>
<style scoped>
.header {
  width: 110%;
  margin-top: 1%;
}

button {
  color: white !important;
}

.popover {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 500rem !important;
  margin-top: 3rem;
  width: 40rem;
}

.popover-custom {
  left: 30rem !important;
  top: 6rem !important;
}

.popover-button {
  color: gray !important;
}

.warning-label-custom {
  padding: 3px 15px;
}

.disableCheck2 {
  pointer-events: none;
  opacity: 0.2;
}

</style>