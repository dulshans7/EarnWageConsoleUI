<template>
  <div id="WorkflowHistoryModal" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" data-backdrop="static" role="dialog" style="display: none;" tabindex="-1">
    <div class="modal-dialog modal-lg" role="document" style="width:1300px;max-width: inherit">
      <div v-show="!isVisible" class="modal-content">
        <div class="modal-header"  @click="onClosePopover">
          <h5 class="modal-title">Workflow History</h5>
          <button aria-label="Close" class="close" data-dismiss="modal" type="button">
            <span aria-hidden="true" @click="closeModal">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-9">
            </div>
            <div class="col-md-3">
              <div class="input-group" v-show="false">
                <input class="form-control form-control-sm" type="text">
                <span class="input-group-append"> <button class="btn btn-sm btn-default" type="button"><i
                    class="fa fa-search"></i>
                                        </button>
                </span>
              </div>
            </div>
          </div>
          <div class="form-group row m-t-xs">
            <div class="col-md-12">
              <table class="table table-bordered table-sm">
                <thead>
                <tr>
                  <th>No</th>
                  <th>Stage</th>
                  <th>Officer Assigned for Action</th>
                  <th>Action Taken Date & Time</th>
                  <th>Status</th>
                  <th style="width: 15%">Feedbacks & Comments</th>
                  <th style="width: 2%">Attachments</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(p, i) in historyData.items" :key="i">
                  <td>{{ p.no }}</td>
                  <td>{{ p.stage }}</td>
                  <td>{{ p.approver }}</td>
                  <td :class="{ hide : p.status == 0 }">{{ p.logDate.substring(0, 10) }}</td>
                  <td v-if="p.status == 1"><span class="label label-primary">Approved</span></td>
                  <td v-if="p.status == 0"><span class="label label-warning">Pending</span></td>
                  <td v-if="p.status == -1"><span class="label label-danger">Rejected</span></td>
                  <td :class="{ hide : p.status == 0 }">
                    {{ p.comment }}
                  </td>
                  <td :class="{ hide : p.status == 0 }">
                    <i class="fa fa-paperclip" @click="showPopover(p)"></i>
                    <span class="badge" style="margin-left: 2%">
                    {{ p.attachCount }}
                  </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-show="isPopover && popoverState == 2" class="popover popover-custom">
            <slot><button aria-label="Close" class="close" data-dismiss="modal1" type="button" style="margin-bottom: 5px">
              <span aria-hidden="true" @click="onClosePopover">×</span>
            </button>
              <table class="table table-bordered table-sm">
                <thead>
                <tr>
                  <th>Attachment Name</th>
                  <th>Attachment Type</th>
                  <th>Download</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(p, i) in attachments.items" :key="i">
                  <td>{{ p.name }}</td>
                  <td>{{ p.extension }}</td>
                  <td><i class="fa fa-download" @click="onDownloadClick(p)" style="cursor:pointer"></i></td>
                </tr>
                </tbody>
              </table>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkflowModal",
}
</script>
<script setup>
import * as Api from "@/constants/constants";
import {defineEmits, ref} from 'vue';
import {FETCH_INVOICE_DETAILS, FETCH_WORKFLOW_HISTORY, GET_WF_ATTACHMENT} from "../constants/constants";
import {computed} from "vue";
import Popover from "./Popover";

const axios = useNuxtApp().$axios

const props = defineProps({
  wf: {
    type: Object,
  }
})

let propsGet = props.wf
const emit = defineEmits(["modalClose"])
//data
const posts = ref({})
let isVisible = ref(false)
const image = ref("")
const doc = ref("")
const isPopover = ref(false)
const inside = ref(false)
const popoverState = ref(0)
//reactives
let historyData = reactive({
  items: []
})
let attachments = reactive({
  items: []
})
let allAttachment = reactive({
  items: []
})
let allAttachment2 = reactive({
  items: []
})
//onMount
onMounted(() => {
  fetchWorkFlowAPI()
})
//methods
const showPopover = (p) => {
  isPopover.value = !isPopover.value
  popoverState.value = 2
  fetchAttachmentsAPI(p.wfId)
};
const onClosePopover = () => {
  isPopover.value = false
  popoverState.value = 1
}
const onClosePopoverWhenOpen = () => {
  if(popoverState.value  == 2 && isPopover) {
    console.log("if ",isPopover.value)
  }else {
    popoverState.value = 1
  }
}
const fetchAttachmentsAPI = (id) => {
  try {
    const postData = {
      '"trn_id"': props.wf.trn_id,
      '"wfmain_id"': props.wf.wfmain_id
    };
    axios.post(Api.FETCH_WORKFLOW_HISTORY, postData)
        .then(response => {
          for(let i=0; i< response.data.length; i++) {
            if(response.data[i].wfId == id) {
              attachments.items = response.data[i].attachments
              attachments.items.push(attachments.items)
              attachments.items.pop()
            }
          }
        })
  } catch (error) {
    console.log("error", error)
  }
}
const fetchWorkFlowAPI = () => {
  try {
    const postData = {
      '"trn_id"': props.wf.trn_id,
      '"wfmain_id"': props.wf.wfmain_id
    };
    axios.post(Api.FETCH_WORKFLOW_HISTORY, postData)
        .then(response => {
          historyData.items = response.data;
        })
  } catch (error) {
    console.log("error", error)
  }
}
const onImageClick = (q) => {
  isVisible.value = true
  image.value = q.file
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
const onDownloadClick = (p) => {
  try {
    const postData = {
      '"wf_id"': p.id
    };
    axios.post(Api.GET_WF_ATTACHMENT, postData)
        .then(response => {
          const base64Data = response.data.file;
          const blob = base64ToBlob(base64Data);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `${p.name}.${p.extension}`;
          link.click();
          window.URL.revokeObjectURL(link.href);
          link.remove();
        })
  } catch (error) {
    console.log("error", error)
  }
}
const closeModal = () => {
  emit("modalClose");
}
const onImageModalClose = () => {
  isVisible.value = false
}

</script>

<style scoped>
.white-color-text {
  color: white !important;
}
ul {
  list-style-type: none;
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
  left: 34rem !important;
  top: 3.2rem !important;
}
.hide {
  visibility: hidden;
}
</style>
