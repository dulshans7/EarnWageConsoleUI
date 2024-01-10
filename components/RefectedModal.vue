<template>
  <div id="Rejected" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" role="dialog" tabindex="-1" data-backdrop="static">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remittance Unsuccessful</h5>
          <button aria-label="Close" class="close" data-dismiss="modal" type="button" :class="{notPointer: displaySpinner}">
            <span aria-hidden="true" @click="closeModal" ref="Close">×</span>
          </button>
        </div>
        <div class="modal-body" v-show="!isPopoverReprocessShow">
          <div class="form-group row">
            <div class="col-md-12">
              <div class="alert alert-danger">
                Reason : <a class="alert-link"> {{ reason }}</a>.
              </div>
            </div>
          </div>
        </div>
        <div class="modal-body" v-show="isPopoverReprocessShow">
          <h4>Are you sure you want to redirect this request for reprocessing ?</h4>
        </div>
        <div class="modal-footer" v-show="isPopoverReprocessShow">
          <button class="btn btn-white popover-button" data-dismiss="modal1" type="button"
                  @click="onSelecting('n')">No
          </button>
          <button class="btn btn-primary" style="color:white" type="button" data-dismiss="modal1" @click="onSelecting('y')">Yes</button>
        </div>
        <div v-if="displaySpinner" style="text-align: center;">
          <div id="loading"></div>
        </div>
        <!--

        <div class="modal-body" v-show="isPopoverReprocessShow">
          <div class="form-group row">
            <h4>Are you sure you want to redirect this request for reprocessing ? </h4>
          </div>
          <div class="form-group row">
            <button class="btn btn-white popover-button" data-dismiss="modal1" type="button" @click="onSelecting('n')" :class="{notPointer: displaySpinner}">No</button>
            <button class="btn btn-primary button_text" type="button" data-dismiss="modal1" @click="onSelecting('y')" :class="{notPointer: displaySpinner}">Yes</button>
            <div v-if="displaySpinner" style="text-align: center;">
              <div id="loading"></div>
            </div>
          </div>
        </div>
        -->
        <div class="modal-footer" v-show="!isPopoverReprocessShow">
          <button class="btn btn-primary" type="button" @click="onClickReprocess"  v-show="propsShow == 1 && userLevel !== 1 " style="color: white;" >Reprocess</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RefectedModal"
}
</script>
<script setup>
import * as Api from "@/constants/constants";
import {ref} from 'vue';
import {onBeforeUnmount} from 'vue';
import {FETCH_REJECTED_REASON, REPROCESS_FAILED_REMIT} from "../constants/constants";
import {useUserId,useUserLevel} from "../composables/states";
import {onReprocessSuccess, onReprocessFailed, onReprocessFailedNetwork} from "../Utils/toastUtils";

const axios = useNuxtApp().$axios
const props = defineProps({
  reject: {
    type: String,
  },
  show: {
    type: Number,
  }
})
let propsGet = JSON.parse(JSON.stringify(props.reject))
let propsShow = JSON.parse(JSON.stringify(props.show))
//emit
const emit = defineEmits(["modalClose"])
const Close = ref(null)
//state
const userId = useUserId()
const userLevel =  useUserLevel()
//data
const posts = ref("")
let isPopoverReprocessShow = ref(false)
let displaySpinner = ref(false)
const reason = ref("")
onMounted(() => {
  fetchRejectedDetails()
})
//methods
const onSelecting = (p) => {
  if (p == "n") {
    isPopoverReprocessShow.value = false
    return
  } else if(p == "y"){
    displaySpinner.value = true
    onReprocess()
  }
}
const fetchRejectedDetails = () => {
  try {
    const postData = {
      "trn_id": propsGet
    };
    axios.post(Api.FETCH_REJECTED_REASON, postData)
        .then(response => {
          posts.items = response.data
          reason.value = posts.items.reason
        })
  } catch (error) {
    console.log("error", error)
  }
}
const onReprocessSelect = (p) => {
  if (p == "n") {
    isPopoverResolvedShow.value = false
    return
  }
  onResolvedApi()
}
const onReprocess = () => {
  try {
    const postData = {
      "trn_id": propsGet,
      "user_id": userId.value
    };
    axios.post(Api.REPROCESS_FAILED_REMIT, postData)
        .then(response => {
          onReprocessSuccess("The requests is reprocessed.")
          displaySpinner.value = false
          Close.value.click();
          closeModal()
        }).catch(error => {
      displaySpinner.value = false
    })
  } catch (error) {
    displaySpinner.value = false
    onReprocessFailedNetwork("This request has not been reprocessed. Please contact the support team for further assistance!")
  }
}
const onClickReprocess  = () => {
  isPopoverReprocessShow.value = true
}
const closeModal = () => {
  emit("modalClose");
}
</script>
<style scoped>

#loading {
  display: inline-block;
  text-align: center;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: darkgreen;
  animation: spin 1s ease-in-out infinite !important;
  -webkit-animation: spin 1s ease-in-out infinite !important;
}
.button_text {
  color: white !important;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
.notPointer{
  pointer-events: none !important;
}
</style>