<template>
  <div id="Action" ref="Close" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog" role="document" style="max-width: 700px;">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Approver Feedback and Decision</h5>
          <button aria-label="Close" class="close" data-dismiss="modal" type="button">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row" style="margin-bottom: 5px">
              <label class="col-md-4 ">Select Action</label>
              <div class="col-md-8">
                <select v-model="action" class="form-control" @change="onChangeAction">
                  <option v-for="i in actions" :key="i.id" :value="i.value">{{ i.label }}</option>
                </select>
              </div>
            </div>
            <div class="row" style="margin-bottom: 5px">
              <label class="col-md-4">Attachment Name</label>
              <div class="col-md-8">
                <input v-model="newItem" aria-describedby="helpId" class="form-control input-sm" placeholder="" type="text" @change="onChangeName">
              </div>
            </div>
            <div class="row" style="margin-bottom: 5px">
              <label class="col-md-4 ">Attachment</label>
              <div class="col-md-8">
                <div class="input-group">
                 <input id="fileInput" ref="FileInput" :class="{disableCheck2: fileNameError}" multiple type="file" @change="handleFileChange" style="font:icon;font-size: 14px">
<!--
                  <div class="container">
                    <div class="button-wrap">
                      <label class="button">Upload File</label>
                      <input type="file" ref="FileInput" id="fileInput" multiple @change="handleFileChange" :class="{disableCheck2: fileNameError}">
                    </div>
                  </div>
-->

                </div>
                <p>(max file size:1MB, Only .pdf, .doc, .docx, .xls, .xlsx, .jpeg, .png files are supported)</p>
              </div>
            </div>
            <div class="row m-t-md" style="margin-bottom: 5px">
              <div class="col-md-12">
                <table class="table table-bordered table-sm">
                  <thead>
                  <tr>
                    <th>Attachment Name</th>
                    <th style="width: 2%">Remove</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(p, i) in attachments.items" :key="i">
                    <td>{{ p }}</td>
                    <td style="text-align:center;"><i class="fa fa fa-remove" @click="removeItem(i)"></i></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="row" style="margin-bottom: 5px">
              <label class="col-md-4 ">Comments</label>
              <div class="col-md-8">
                <textarea v-model="comments" class="form-control" rows="3" @change="onCommentsChanged"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div v-if="displaySpinner" style="text-align: center">
          <div id="loading"></div>
        </div>
        <div class="modal-footer">
          <button :class="{ disableBtn: !isSaveble && !isSavebleOnComment }" class="btn btn-primary white-color-text" type="button" @click="onSave">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref} from "vue";
import * as Api from "@/constants/constants";
import {defineEmits} from 'vue'
import {actionError, actionSuccess, AttactmentFailed, inValidDataType, inValidDataSize, AttactmentNameRequired, onCommentRequired, actionSuccessSecUser} from "../Utils/toastUtils";
import {useUserId, useUserLevel} from "../composables/states";
// use axios
const axios = useNuxtApp().$axios
// using props
const props = defineProps({
  total: {
    type: Object,
    required: false
  },
})

const Close = ref(null)
let FileInput = ref(null)
let propsGet = props.total
let uniqueProps = [...new Set(propsGet)]
//emit
const emit = defineEmits(["modalClose", "save"])
//data
const userId = useUserId()
let backdropValue = ref("static")
const userLevel = useUserLevel()
let action = ref("")
let displaySpinner = ref(false)
let newItem = ref("")
let comments = ref("")
let isSaveble = ref(false)
let isSavebleOnComment = ref(false)
let fileInputRef = ref([])
let fileNameError = ref(true)
let fileInputRefArray = ref([])
let testfile = ref("")
let testfiletype = ref("")
let allowTypeTypes = ref(["pdf", "docx", "doc", "xls", "xlsx", "png", "jpg", "jpeg"])
let allowFileSize = ref(1024000)
const actions = ref([
  {id: 1, label: 'Approve', value: 1},
  {id: 2, label: 'Reject', value: -1},
]);
//reactives
let attachments = reactive({
  items: []
})

//methods
const addItem = () => {
  if (newItem.value) {
    attachments.items.push();
    newItem.value = '';
  }
}
const removeItem = (i) => {
  attachments.items.splice(i, 1);
}
const onChangeAction = () => {
  action.value == 1 ? isSaveble.value = true : isSaveble.value = false
}
const onCommentsChanged = () => {
  comments.value.length > 0 ? isSavebleOnComment.value = true : isSavebleOnComment.value = false
}
const onChangeName = () => {
  if (newItem.value.length > 0) {
    fileNameError.value = false
  } else {
    fileNameError.value = true
  }
}
const handleFileChange = (e) => {
  if (newItem.value.length > 1) {
    fileInputRef = event.target.files[0];
    testfiletype.value = fileInputRef.name
    const myArray = fileInputRef.name.split(".").pop();
    if (allowTypeTypes.value.includes(myArray) && fileInputRef.size < allowFileSize.value) {
      attachments.items.push(newItem.value)
      newItem.value = ""
      getBase64(fileInputRef)
   //   FileInput.value.value = ''
      isSaveble.value = true
      fileNameError.value = true
    } else if (!allowTypeTypes.value.includes(myArray)) {
      FileInput.value.value = ''
      inValidDataType("Invalid file format. Please choose a supported file type")
      newItem.value = ''
      fileNameError.value = true
    } else if (fileInputRef.size > allowFileSize.value) {
      inValidDataSize("File size exceeds limit. Please reduce and retry.")
      FileInput.value.value = ''
      newItem.value = ''
      fileNameError.value = true
    }
  } else {
    FileInput.value.value = ''
    AttactmentNameRequired("Attachment Name Required")
    newItem.value = ''
  }
}

// now need to get the path
//not use
const fileToBase64 = (name, path) => {
  return new Promise(resolve => {
    let file = new File([name], path)
    let reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result)
    };
    reader.readAsDataURL(file)
  });
};
//
const getBase64 = (file) => {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    testfile.value = reader.result
    const myArray = file.name.split(".");
    fileInputRef.extension = myArray[1]
    fileInputRef.content = testfile.value
    fileInputRefArray.value.push(fileInputRef);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

const onSave = async (e) => {
  if (action.value == "") {
    return
  }
  if (comments.value.length < 1 && action.value == -1) {
    onCommentRequired("Comment is Required");
  } else {
    displaySpinner.value = true
    e.preventDefault()
    let propsGet = JSON.parse(JSON.stringify(props.total))
    let uniqueProps = [...new Set(propsGet)]
    let payload = {}
    payload.transactions = propsGet
    payload.action_id = action.value
    payload.comment = comments.value
    payload.user_id = userId.value
    payload.attach_list = []
    fileInputRefArray.value.forEach((file, i) => {
      let ref = {}
      ref.name = attachments.items[i]
      ref.content = file.content
      ref.extension = file.extension
      payload.attach_list.push(ref)
    })
    try {
      const response = await axios.post(Api.UPLOAD_ACTIONS, payload);
      if (action.value == 1) {
        if (userLevel.value == 2) {
          displaySpinner.value = false
          actionSuccessSecUser("Record Approved Successfully. Remittance Processing Initiated!")
          payload = {}
        } else {
          displaySpinner.value = false
          actionSuccess("Record Approved successfully")
          payload = {}
        }
        Close.value.click();
        closeModal()
        saveEmit()
      } else if (action.value == -1) {
        actionError("Record Rejected successfully")
        displaySpinner.value = false
        payload = {}
        Close.value.click();
        closeModal()
        saveEmit()
      }
    } catch (error) {
      AttactmentFailed("Upload Failed! The attachment could not be uploaded successfully.Please retry")
      displaySpinner.value = false
      payload = {}
      saveEmit()
    } finally {
      comments.value = ""
      attachments.items = []
      action.value = ""
      newItem.value = ""
      testfiletype.value = ""
      fileInputRef = ([])
      payload = {}
      propsGet = []
    }
  }
}
const saveEmit = () => {
  emit("save")
}
const closeModal = () => {
  emit("modalClose");
}
const onAttachmentClick = () => {
  if (newItem.value.length < 1) {
    AttactmentNameRequired("Attachment Name Required ")
  }
}

</script>

<style scoped>
.white-color-text {
  color: white !important;
}

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

.disableBtn {
  pointer-events: none;
  opacity: .5;
}


/*
input[type="file"] {
  position: absolute;
  top: 10px;
  left: 1px;
  font-size: 14px;
  color: #1ab394;;
}
*/
.button-wrap {
  position: relative;
  margin-left:-2.2rem;
}

.button {
  display: inline-block;
  padding: 6px 15px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #1AB394;
  font-size: 14px;
  color: #fff;
}
</style>