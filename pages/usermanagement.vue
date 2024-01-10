<template>
  <div id="wrapper">
    <div class="row wrapper border-bottom white-bg page-heading header">
      <div class="col-lg-12">
        <h2>User Management</h2>
      </div>
    </div>
  </div>
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
      <div class="col-md-12">
        <div class="ibox">
          <div class="ibox-content">
            <div class="form-group row">
              <label class="col-md-2">Select User Account </label>
              <div class="col-md-4">
                <select v-model="userAccount" class="form-control" @change="onUserAccountChange">
                  <option v-for="user in users" :key="user.id" :value="user.id">{{ user.value }}</option>
                </select>
              </div>
            </div>
            <div class="form-group row" v-if="!isSupported">
              <label class="col-md-2">Number of Approval levels</label>
              <div class="col-md-1">
                <input v-model="levels" class="form-control" type="number" @change="onLevelChange" disabled>
              </div>
            </div>
            <div class="form-group row" v-if="isSupported">
              <label class="col-md-2">Number of members</label>
              <div class="col-md-1">
                <input v-model="levelsSupport" class="form-control" type="number" @change="onLevelSupportChange"
                       disabled>
              </div>
            </div>
            <div class="form-group row m-t-md" v-if="false">
              <label class="col-md-2"></label>
              <div class="col-md-4">
                <button class="btn btn-sm  btn-primary" type="button">Search</button>
              </div>
            </div>
            <div v-show="!isSupported" class="form-group row m-t-sm">
              <div class="col-md-10">
                <h4>Assign Approval Levels</h4>
              </div>
              <div class="col-md-2">
                <div class="input-group">
                  <input v-model="search" class="form-control form-control" type="text" @keyup="searching">
                  <span class="input-group-append"> <a class="btn btn-white btn-bitbucket m-r-xs" type="button"
                                                       @click="searching"><i class="fa fa-search"></i>
                  </a></span>
                </div>
              </div>
              <div class="col-md-12">
                <table class="table table-bordered table-sm">
                  <thead>
                  <tr>
                    <th>User Level</th>
                    <th>User Selection</th>
                    <th style="width: 5%">Change Approver</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(p, i) in rowsApprove" :key="i">
                    <td> Level {{ i + 1 }}</td>
                    <td>
                      <input
                          id="searchInput1"
                          type="text"
                          v-model="p.emp"
                          @input="searchUserApprove(p, i)"
                      />
                      <select id="selectCountry1">
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                          {{ country.name }}
                        </option>
                      </select></td>
                    <td>
                      <button class="btn btn-xs btn-primary btn-custom" type="button" @click="onClickChangeApprover(i)">
                        Change Approver
                      </button>
                    </td>
                  </tr>
                  <tr v-for="(p, i) in rowsApprove" :key="i">
                    <td> Level {{ i + 2 }}</td>
                    <td>
                      <input
                          id="searchInput2"
                          type="text"
                          v-model="p.emp"
                          @input="searchUserApprove(p, i)"
                      />
                      <select id="selectCountry2">
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                          {{ country.name }}
                        </option>
                      </select></td>
                    <td>
                      <button class="btn btn-xs btn-primary btn-custom" type="button" @click="onClickChangeApprover(i)">
                        Change Approver
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="false">
                  <b-pagination
                      v-model="page"
                      :total-rows="10"
                      :per-page="2"
                      @page-click="handlePageChange"
                  ></b-pagination>
                </div>
              </div>
            </div>
            <div v-show="isSupported" class="form-group row m-t-sm">
              <div class="col-md-10">
                <h4>Assign Support Team Members</h4>
              </div>
              <div class="col-md-2">
                <div class="input-group">
                  <input v-model="search" class="form-control form-control" type="text" @keyup="searching">
                  <span class="input-group-append"> <a class="btn btn-white btn-bitbucket m-r-xs" type="button"
                                                       @click="searching"><i class="fa fa-search"></i>
                  </a></span>
                </div>
              </div>
              <div class="col-md-12">
                <table class="table table-bordered table-sm">
                  <thead>
                  <tr>
                    <th>User</th>
                    <th>User Selection</th>
                    <th style="width: 5%">Change Member</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(p, i) in rowsSupport" :key="i">
                    <td>User {{ i + 1 }}</td>
                    <td>
                      <input
                          id="searchInput3"
                          type="text"
                          v-model="p.emp"
                          @input="searchUser(p, i)"
                      />
                      <select id="selectCountry3">
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                          {{ country.name }}
                        </option>
                      </select></td>
                    <td>
                      <button class="btn btn-xs btn-primary btn-custom" type="button" @click="onClickChangeMember">
                        Change Member
                      </button>
                    </td>
                  </tr>
                  <tr v-for="(p, i) in rowsSupport" :key="i">
                    <td>User {{ i + 2 }}</td>
                    <td>
                      <input
                          id="searchInput4"
                          type="text"
                          v-model="p.emp"
                          @input="searchUser(p, i)"
                      />
                      <select id="selectCountry4">
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                          {{ country.name }}
                        </option>
                      </select></td>
                    <td>
                      <button class="btn btn-xs btn-primary btn-custom" type="button" @click="onClickChangeMember">
                        Change Member
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="false">
                  <b-pagination
                      v-model="pageSupport"
                      :total-rows="10"
                      :per-page="2"
                      @page-click="handlePageChangeSupport"
                  ></b-pagination>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-12">
                <div class="fa-pull-right">
                  <button class="btn btn-sm  btn-primary btn-custom" style="margin-right: 1rem" type="button"
                          @click="onSave">Save
                  </button>
                  <button class="btn btn-sm  btn-primary btn-custom" type="button">Cancel</button>
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
</script>
<script setup>
import {ref, watch} from 'vue';
import * as Api from "@/constants/constants";
import {
  approvalSuccess,
  onSavingApprovalLevel,
  onSavingSupportLevel,
  onChangeApprover,
  onChangeMember
} from "../Utils/toastUtils";


const axios = useNuxtApp().$axios

let tdLevelWord = "Level"


//data
//pagination
let page = ref(1)
let pageSupport = ref(1)


const userAccount = ref("")
let levels = ref(2)
let levelsSupport = ref(2)
let isSupported = ref(false)
let rowCountApi = ref(0)
let rows = ref([])

let search = ref("")
const searchQuery = ref({});
const rowsSupport = ref({value: []})
const rowsApprove = ref({value: []})
const saveEmailId = ref('')
const saveLevel = ref('')

const users = ref([
  {id: 1, label: 'Approving Levels', value: 'Approving Levels'},
  {id: 2, label: 'Support Team Member', value: 'Support Team Member'},
]);
//watch
watch(levels, (newValue, oldValue) => {
  levelChanged()
  addRowsApi()
})
watch(levelsSupport, (newValue, oldValue) => {
  levelChanged()
  addRowsApiSupport()
})
watch(searchQuery, () => {
  searchUser();
});
//reactives

//methods
const levelChanged = () => {
  if (userAccount.value == 1) {
    isSupported.value = false
  } else {
    isSupported.value = true
  }
}
const onUserAccountChange = () => {
  levelChanged()
}
const addRowsApi = () => {
  if (levels.value >= 0) {
    rowsApprove.value = []
    for (let i = 0; i < levels.value; i++) {
      rowsApprove.value.push({id: i, emp: ''})
    }
  }
}
const addRowsApiSupport = () => {
  if (levelsSupport.value >= 0) {
    rowsSupport.value = []
    for (let i = 0; i < levelsSupport.value; i++) {
      rowsSupport.value.push({id: i, emp: ''})
    }
  }
}
//sprint 2 methods
const onLevelChange = () => {
  const regEx = new RegExp("^[1-5]\\d*$");
  if (!regEx.test(levels.value)) {
    if (levels.value < 1) {
      levels.value = 1
    } else {
      levels.value = 5
    }
  }
}
const onLevelSupportChange = () => {
  const regEx = new RegExp("^[1-5]\\d*$");
  if (!regEx.test(levelsSupport.value)) {
    if (levelsSupport.value < 1) {
      levelsSupport.value = 1
    } else {
      levelsSupport.value = 5
    }
  }
}
const handlePageChange = (value) => {
  page.value = value
}
const handlePageChangeSupport = (value) => {
  pageSupport.value = value
}
const searchUserApprove = async (p, i) => {
  // Fetch data from an API using Axios based on the search query
  saveLevel.value = i + 1
  saveEmailId.value = "dulshans@hsenidbiz.com"
  try {
    const response = await axios.get(
        `https://api.example.com/countries?search=${p.emp}`
    );
    countries.value = response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};
const searchUser = async (p, i) => {
  // Fetch data from an API using Axios based on the search query
  saveLevel.value = i
  saveEmailId.value = "dulshans@hsenidbiz.com"

  try {
    const response = await axios.get(
        `https://api.example.com/countries?search=${p.emp}`
    );
    countries.value = response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};
const onSave = () => {
  if (!isSupported.value) {
    onSavingApprovalLevel('', `Are you sure that you want to make ${saveEmailId.value} as Approval Level ${saveLevel.value}`, 'OK')
  } else {
    onSavingSupportLevel('', `Are you sure that you want to make ${saveEmailId.value} as support team member?`, 'OK')
  }
}

const onClickChangeApprover = (i) => {
  const level = i + 1
  onChangeApprover('', `Are you sure that you want to make ${saveEmailId.value} as Approval level ${level}?`, 'OK', level)
}

const onClickChangeMember = () => {
  onChangeMember('', `Are you sure that you want to make ${saveEmailId.value} as support team member?`, 'OK')
}

</script>
<style scoped>
.header {
  width: 110%;
  margin-top: 1%;
}

.btn-custom {
  color: white !important;
}
</style>