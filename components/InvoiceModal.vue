<template>
  <div id="Invoice" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" role="dialog"
       style="display: none;" tabindex="-1">
    <div class="modal-dialog" role="document" style="max-width:1200px">
      <div class="modal-content">
        <div class="modal-header no-printme">
          <h5 class="modal-title">Invoice</h5>
          <button aria-label="Close" class="close" data-dismiss="modal" type="button">
            <span aria-hidden="true" @click="closeModal">×</span>
          </button>
        </div>
        <div id="printThis" class="modal-body">
          <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
              <div class="col-lg-12">
                <div class="ibox-content p-xl">
                  <div class="row">
                    <div class="col-sm-10 text-left">
                      <h5>Invoice No: <span class="text-navy">{{ invoiceNo }}</span></h5>
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
                    <div class="col-sm-2 text-right">
                      <img src="@/assests/images/hsenid-logo.png" style="width: 120% !important">
                    </div>
                  </div>
                  <div class="table-responsive m-t">
                    <table class="table invoice-table">
                      <thead>
                      <tr>
                        <th>Item List</th>
                        <th>Total Price</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>
                          <div><strong>Remitted Amount</strong></div>
                        </td>
                        <td>LKR {{ total }}</td>
                      </tr>
                      <tr>
                        <td>
                          <div><strong>Cost of Service and Tax</strong></div>
                        </td>
                        <td>LKR {{ cost }}</td>
                      </tr>
                      <tr>
                        <td><strong>Requested Amount </strong></td>
                        <td>LKR {{ amount }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div><!-- /table-responsive -->
                  <div v-show="true" class="text-right no-printme">
                    <button class="btn btn-primary" target="_blank" style="color:white" @click="onPrint"><i
                        class="fa fa-print"></i>Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer text-center no-printme" style="display: block">
          <span class="no-printme">{{ contact }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InvoiceModal",
  methods: {
    onPrint() {
      let elem = document.getElementById("printThis")

      console.log("elem", elem)
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
    }
    //window.print();
  },

}
</script>
<script setup>
import * as Api from "@/constants/constants";
import {ref} from 'vue';
import {FETCH_INVOICE_DETAILS} from "../constants/constants";
import {onBeforeUnmount} from 'vue';

const axios = useNuxtApp().$axios
const props = defineProps({
  invoice: {
    type: String,
  }
})
let propsGet = JSON.parse(JSON.stringify(props.invoice))
//emit
const emit = defineEmits(["modalClose"])

onMounted(() => {
  fetchInvoiceDetails()
})
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

const fetchInvoiceDetails = () => {
  try {
    const postData = {
      "trn_id": propsGet
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
//emit function
const closeModal = () => {
  emit("modalClose");
}
const mulityLineAddress = (str) => {
  return str
}
</script>

<style scoped>
.btn-custom {
  color: white !important;
}

.modal-footer {
  border-top: none !important;
}
@media screen {
  #printSection {
    display: none;
  }
}
@media print {
  #printSection, #printSection * {
    display: none;
  }
  #printSection {
    position:absolute;
    left:0;
    top:0;
  }
}


/*
  html.with-featherlight > * > :not(.featherlight) {
    display: none !important;
  }

 */


</style>