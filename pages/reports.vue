<template>
  <div id="wrapper">
    <div class="row wrapper border-bottom white-bg page-heading header no-printme">
      <div class="col-lg-12">
        <h2>Reports</h2>
      </div>
    </div>
  </div>
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-md-12">
        <div class="ibox" style="padding: 0 1%">

          <div class="ibox-content">
            <div class="form-group row no-printme">
              <label class="col-md-2">Select the Report</label>
              <div class="col-md-4">
                <select v-model="report" class="form-control custom-dropdown" @change="onChangeReport">
                  <option v-for="i in reports" :key="i.id" :value="i.value">{{ i.label }}</option>
                </select>
              </div>
            </div>
            <div class="form-group row no-printme">
              <label class="col-md-2">Select the Organization</label>
              <div class="col-md-4" v-if="!fund">
                <select v-model="employerReport" class="form-control custom-dropdown" @change="onChangeEmployer">
                  <option v-for="i in employees.items" :key="i.clientId" :value="i.clientId">{{ i.clientName }}</option>
                </select>
              </div>
              <div class="col-md-4" v-if="fund">
                <select v-model="employerFund" class="form-control custom-dropdown" @change="onChangeEmployer">
                  <option v-for="i in employeesFund.items" :key="i.clientId" :value="i.clientId">{{
                      i.clientName
                    }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group row no-printme">
              <label class="col-md-2 ">Date Period </label>
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

            <div class="form-group row m-t-md no-printme">
              <div class="col-md-2"></div>
              <div class="col-md-4">
                <button class="btn btn-sm  btn-primary white-color-text mr-4" type="button" style="color:white"
                        @click="onViewReportRec" v-if="!fund">Download
                  Report
                </button>
                <button class="btn btn-sm  btn-primary white-color-text mr-4" type="button" style="color:white"
                        @click="onViewReportFund" v-if="fund">Download
                  Report
                </button>
              </div>
            </div>
            <div class="row no-printme">
              <div class="col-md-9">
                <div class="fa-pull-left">
                </div>
              </div>
            </div>

            <div style="text-align: center" class="no-printme">
              <div id="loading"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "reports"
}
</script>
<script setup>
import {ref} from "vue";
import * as Api from "@/constants/constants";
import VueMultiselect from 'vue-multiselect'
import {GET_REPORT_DETAILS} from "../constants/constants";

const axios = useNuxtApp().$axios
let report = ref("1")
let fund = ref(true)
let employer = ref("1")
let employerReport = ref("1")
let columns = ref(null)
const employerFund = ref("0")
let startDate = ref("")
let endDate = ref("")
let startDateReal = ref("")
let endDateReal = ref("")
const reports = ref([
  {id: 1, label: 'Fund Utilization Report', value: '1'},
  {id: 2, label: 'Reconciliation Report', value: '2'},
]);
const options = ref([
  {id: 0, name: 'All', value: '0'},
  {id: 1, name: 'Invoice Number', value: '1'},
  {id: 2, name: 'Employee Name', value: '2'},
  {id: 3, name: 'Remitted Date', value: '3'},
  {id: 4, name: 'Remitted Amount', value: '4'},
  {id: 5, name: 'Requested Amount', value: '5'},
  {id: 6, name: 'Total Payable', value: '6'},
]);
const optionsWithoutAll = ref([
  {id: 1, name: 'Invoice Number', value: '1'},
  {id: 2, name: 'Employee Name', value: '2'},
  {id: 3, name: 'Remitted Date', value: '3'},
  {id: 4, name: 'Remitted Amount', value: '4'},
  {id: 5, name: 'Requested Amount', value: '5'},
  {id: 6, name: 'Total Payable', value: '6'},
]);
const typesArray = ref([])
let employees = reactive({
  items: []
})
let employeesFund = reactive({
  items: []
})
onMounted(() => {
  getDefaultDate();
  fetchEmployeesAPI();
  fetchEmployeesAPIForFund();
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
const fetchEmployeesAPI = () => {
  axios.get(Api.FETCH_EMPLOYEES)
      .then(response => {
        employees.items = response.data
      })
      .catch(() => {
        console.log("error");
      });
}
const fetchEmployeesAPIForFund = () => {
  axios.get(Api.FETCH_EMPLOYEES)
      .then(response => {
        employeesFund.items = response.data
        employeesFund.items.unshift({clientId: "0", clientName: "All"})
      })
      .catch(() => {
        console.log("error");
      });
}
const onChangeReport = () => {
  if (report.value === "2") {
    fund.value = false
  } else {
    fund.value = true
  }
  getDefaultDate()
  employerReport.value = "1"
  employerFund.value = "0"
}

const base64ToBlob = (data) => {
  const parts = data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, {type: contentType});
}
const onViewReport1 = () => {
  try {
    const postData = {
      '"wf_id"': '536f4286-e951-41a9-8bd9-94ede7b5e9b'
    };
    axios.post(Api.GET_WF_ATTACHMENT, postData)
        .then(response => {
          const base64Data = 'data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDI1OT4+CnN0cmVhbQowLjU3IHcKMCBHCkJUCi9GMSAxNiBUZgoxOC40IFRMCjAgZwoxNDEuNzMgODEzLjU0IFRkCihGaXJzdCBOYW1lOiB1dHNhdkxhc3QgTmFtZTogTWFuaXlhcikgVGoKRVQKQlQKL0YxIDE2IFRmCjE4LjQgVEwKMCBnCjE0MS43MyA3ODUuMjAgVGQKKEZpcnN0IE5hbWU6IGhldGFMYXN0IE5hbWU6IHlhZGF2KSBUagpFVApCVAovRjEgMTYgVGYKMTguNCBUTAowIGcKMTQxLjczIDc1Ni44NSBUZAooRmlyc3QgTmFtZTogcnVuTGFzdCBOYW1lOiBydW4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKNSAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKNiAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EtQm9sZC9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iago3IDAgb2JqCjw8L0Jhc2VGb250L0hlbHZldGljYS1PYmxpcXVlL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjggMCBvYmoKPDwvQmFzZUZvbnQvSGVsdmV0aWNhLUJvbGRPYmxpcXVlL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjkgMCBvYmoKPDwvQmFzZUZvbnQvQ291cmllci9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMCAwIG9iago8PC9CYXNlRm9udC9Db3VyaWVyLUJvbGQvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTEgMCBvYmoKPDwvQmFzZUZvbnQvQ291cmllci1PYmxpcXVlL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjEyIDAgb2JqCjw8L0Jhc2VGb250L0NvdXJpZXItQm9sZE9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTMgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtUm9tYW4vVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTQgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtQm9sZC9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNSAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1JdGFsaWMvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTYgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtQm9sZEl0YWxpYy9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNyAwIG9iago8PC9CYXNlRm9udC9aYXBmRGluZ2JhdHMvVHlwZS9Gb250Ci9FbmNvZGluZy9TdGFuZGFyZEVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgovRjIgNiAwIFIKL0YzIDcgMCBSCi9GNCA4IDAgUgovRjUgOSAwIFIKL0Y2IDEwIDAgUgovRjcgMTEgMCBSCi9GOCAxMiAwIFIKL0Y5IDEzIDAgUgovRjEwIDE0IDAgUgovRjExIDE1IDAgUgovRjEyIDE2IDAgUgovRjEzIDE3IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKMTggMCBvYmoKPDwKL1Byb2R1Y2VyIChqc1BERiAxLngtbWFzdGVyKQovQ3JlYXRpb25EYXRlIChEOjIwMjMxMDE2MDkwNTMxKzA1JzMwJykKPj4KZW5kb2JqCjE5IDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovT3BlbkFjdGlvbiBbMyAwIFIgL0ZpdEggbnVsbF0KL1BhZ2VMYXlvdXQgL09uZUNvbHVtbgo+PgplbmRvYmoKeHJlZgowIDIwCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDQyNiAwMDAwMCBuIAowMDAwMDAxNzIwIDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDExOCAwMDAwMCBuIAowMDAwMDAwNDgzIDAwMDAwIG4gCjAwMDAwMDA1NzMgMDAwMDAgbiAKMDAwMDAwMDY2OCAwMDAwMCBuIAowMDAwMDAwNzY2IDAwMDAwIG4gCjAwMDAwMDA4NjggMDAwMDAgbiAKMDAwMDAwMDk1NiAwMDAwMCBuIAowMDAwMDAxMDUwIDAwMDAwIG4gCjAwMDAwMDExNDcgMDAwMDAgbiAKMDAwMDAwMTI0OCAwMDAwMCBuIAowMDAwMDAxMzQxIDAwMDAwIG4gCjAwMDAwMDE0MzMgMDAwMDAgbiAKMDAwMDAwMTUyNyAwMDAwMCBuIAowMDAwMDAxNjI1IDAwMDAwIG4gCjAwMDAwMDE5NTYgMDAwMDAgbiAKMDAwMDAwMjA0NyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDIwCi9Sb290IDE5IDAgUgovSW5mbyAxOCAwIFIKPj4Kc3RhcnR4cmVmCjIxNTEKJSVFT0Y='
          const blob = base64ToBlob(base64Data);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'report.pdf';
          link.click();
          window.URL.revokeObjectURL(link.href);
          link.remove();
        })
  } catch (error) {
    console.log("error", error)
  }
}
const onViewReportRec = () => {
  const report1 = parseInt(report.value)
  const clntId = employerReport.value
  try {
    const postData = {
      'report_type': report1,
      'clntId': `${clntId}`,
      'fromDate': startDate.value,
      'toDate': endDate.value,
    };

    axios.post(Api.GET_REPORT_DETAILS, postData)
        .then(response => {
          const base64Data = `data:application/pdf;base64,${response.data.result}`;
          const blob = base64ToBlob(base64Data);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Reconciliation Report.pdf';
          link.click();
          window.URL.revokeObjectURL(link.href);
          link.remove();


        })
  } catch (error) {
    console.log("error", error)
  }
}
const onViewReportFund = () => {
  const report1 = parseInt(report.value)
  const clntId = employerFund.value
  try {
    const postData = {
      'report_type': report1,
      'clntId': `${clntId}`,
      'fromDate': startDate.value,
      'toDate': endDate.value,
    };
    axios.post(Api.GET_REPORT_DETAILS, postData)
        .then(response => {
          const base64Data = `data:application/pdf;base64,${response.data.result}`;
          const blob = base64ToBlob(base64Data);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Fund Utilization Report.pdf';
          link.click();
          window.URL.revokeObjectURL(link.href);
          link.remove();
        })
  } catch (error) {
    console.log("error", error)
  }
}
</script>

<style scoped>
.header {
  width: 110%;
}

.multiselect {
  font-size: 12px !important;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>