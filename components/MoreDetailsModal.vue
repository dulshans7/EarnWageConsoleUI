<template>
  <div id="MoreDetails" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" role="dialog"
       style="display: none;" tabindex="-1" data-backdrop="static">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
              <h5 class="modal-title" style="width:50%">Benefit Application Summary</h5>
          <!-- Must add application reference number here not propsget-->
              <h5 class="reference_number" style="margin-left:-5%;margin-top: 3%">Application Reference Number : {{propsRef}}</h5>
            <button aria-label="Close" class="close" data-dismiss="modal" type="button">
              <span aria-hidden="true" @click="closeModal">×</span>
            </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <div class="ibox">
                <div class="ibox-content ibox-heading">
                  <h4><i class="fa fa-user"></i> Supervisor Details </h4>
                  <p class="float-right"><strong>Supervisor Status </strong><small><span class="label label-primary">Approved</span></small>
                  </p>
                  <p><strong>Name : </strong>{{ name }} </p>
                  <p><strong>E mail : </strong>{{ email }}</p>
                  <p><strong>Contact Number: </strong>{{ contact }}</p>
                </div>
                <div class="ibox-content modal_border">
                  <div class="feed-activity-list">
                    <div class="feed-element">
                      <div>
                        <p><strong>Requested Amount: </strong>LKR {{ reqAmount.toFixed(2) }}</p>
                        <p><strong>Requested Date : </strong>{{ reqDate }}</p>
                        <p><strong>Remitting Amount: </strong>LKR {{ remAmount.toFixed(2) }}</p>
                        <p><strong>Payroll Cut off Date: </strong>{{ cutOff }}</p>
                      </div>
                    </div>
                    <div class="feed-element">
                      <div>
                        <h4>Bank Details </h4>
                        <p><strong>Bank: </strong>{{ appBank }}</p>
                        <p><strong>Branch: </strong>{{ appBranch }}</p>
                        <p><strong>Account Number: </strong>{{ account }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer"  v-show="false">
          <button class="btn btn-primary btn-custom" data-dismiss="modal" type="button"
                  @click="closeModal">Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import * as Api from "@/constants/constants";
import {ref} from 'vue';

const axios = useNuxtApp().$axios
const props = defineProps({
  more: {
    type: String,
  },
  application: {
    type: Number,
  },
})
let propsGet = JSON.parse(JSON.stringify(props.more))
let propsRef = JSON.parse(JSON.stringify(props.application))
const emit = defineEmits(["modalClose"])
onMounted(() => {
  fetchMoreDetails()
})

const message = ref("")
//value from parent
const name = ref("")
const empName = ref("")
const email = ref("")
const contact = ref("")
const reqAmount = ref(0)
const reqDate = ref("")
const remAmount = ref(0)
const appBank = ref("")
const appBranch = ref("")
const account = ref("")
const code = ref("")
const cutOff = ref("")
const posts = ref({})

const fetchMoreDetails = () => {
  try {
    const postData = {
      "trn_id": propsGet
    };
    axios.post(Api.FETCH_MORE_DETIALS, postData)
        .then(response => {
          posts.items = response.data;
          name.value = posts.items.sup_name
          cutOff.value = posts.items.payroll_cutoff_date
          empName.value = posts.items.emp_name
          email.value = posts.items.sup_email
          contact.value = posts.items.sup_contact
          reqAmount.value = posts.items.req_amount
          reqDate.value = posts.items.req_date
          remAmount.value = posts.items.remit_amount
          appBank.value = posts.items.app_bank
          appBranch.value = posts.items.app_bnk_brnch
          account.value = posts.items.app_account
          code.value = posts.items.app_stage_bnk_code
        })
  } catch (error) {
    console.log("error", error)
  }
}
const closeModal = () => {
  emit("modalClose");
}

</script>
<style scoped>
.btn-custom {
  color: white !important;
}
.reference_number{
  margin-left: -10%;
}
.modal_border{
  border: none!important;
}
</style>