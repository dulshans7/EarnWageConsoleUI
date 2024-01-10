<template>
  <div id="Reprocess" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" role="dialog" style="display: none;" tabindex="-1">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Reprocess History</h5>
          <button aria-label="Close" class="close" data-dismiss="modal" type="button">
            <span aria-hidden="true" @click="closeModal">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered table-sm">
                <thead>
                <tr>
                  <th>Reprocess Date</th>
                  <th>Reson for Remittance Failure</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(p, i) in historyData.items" :key="i">
                  <td>{{ p.remitDate.substring(0,10) }}</td>
                  <td>{{ p.reason }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary white-color-text" data-dismiss="modal" type="button" @click="closeModal" style="color: white;">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowReprocess"
}
</script>
<script setup>
import * as Api from "@/constants/constants";
import {ref} from 'vue';
import {onBeforeUnmount} from 'vue';
import {GET_REMIT_HISTORY} from "../constants/constants";



const axios = useNuxtApp().$axios
const props = defineProps({
  reprocess: {
    type: String,
  }
})
let propsGet = JSON.parse(JSON.stringify(props.reprocess))
//emit
const emit = defineEmits(["modalClose"])
//data
const posts = ref("")

let historyData = reactive({
  items: []
})
onMounted(() => {
  fetchRemitHistory()
})
//methods
const fetchRemitHistory = () => {
  try {
    const postData = {
      "trn_id": propsGet
    };
    axios.post(Api.GET_REMIT_HISTORY, postData)
        .then(response => {
          historyData.items = response.data;
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

</style>