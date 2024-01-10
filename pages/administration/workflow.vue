<template>
  <div id="wrapper">
      <div class="row wrapper border-bottom white-bg page-heading header">
        <div class="col-lg-9">
          <h2>Workflow History</h2>
        </div>
      </div>
  </div>
      <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
          <div class="col-md-12">
            <div class="ibox">
              <div class="ibox-content">
                <form>
                  <div class="row">
                    <div class="col-md-9">
                    </div>
                    <div class="col-md-3">
                      <div class="input-group">
                        <input type="text" class="form-control form-control-sm" v-model="search">
                        <span class="input-group-append"><button @click="searching" type="button" class="btn btn-sm btn-default"><i
                            class="fa fa-search"></i>
                          </button></span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row m-t-md">
                    <div class="col-md-12">
                      <table class="table table-bordered table-sm">
                        <thead>
                        <tr>
                          <th>No</th>
                          <th>Stage </th>
                          <th>Officer Assigned for Action</th>
                          <th >Action Taken Date & Time</th>
                          <th >Status </th>
                          <th style="width: 15%">Feedbacks & Comments </th>
                          <th style="width: 2%">Attachments </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(p, i) in gridData" :key="i">
                          <td>{{ p.id }}</td>
                          <td>{{ p.stage }}</td>
                          <td>{{ p.name }}</td>
                          <td>{{ p.date }}</td>
                          <td><span class="label label-primary">Approved</span></td>
                          <td>
                            View
                          </td>
                          <td>
                           View
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-5">
                      <ShowRecordCount :visibleRecords="
                                      parseInt(paginationVal.selectedRowCount)
                                    "
                                       :recordCount="paginationVal.totalRecords"
                                       :searchvalue="paginationVal.searchValue"
                                       :pageNumber="paginationVal.pageNumber" />
                    </div>

                    <div class="col-md-2">
                      <SelectVisibleRecords  @update:option="optionUpdate"/>
                    </div>
                    <div class="col-md-5">
                      <div class="pull-right">

                        <nav aria-label="Page navigation example">
                          <ul class="pagination">
                            <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                            <li class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">Next</a></li>
                          </ul>
                        </nav>


                      </div>
                    </div>
                  </div>




                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
</template>

<script>
export default {
  name: "workflow",
  data: () => {
    return {
      paginationVal: {
        selectedRowCount: 10,
        totalRecords: 1,
        searchValue: "",
        pageNumber: 1,
        pageNumberReset: 1,
      },
    }
  },
  methods: {
    optionUpdate(value) {
      this.paginationVal.selectedRowCount = value;
    },
  }
}
</script>

<script setup>
import {ref} from "vue";

const search = ref("")
const gridData = ref([
  {
    id: 1,
    stage: '1st level',
    name: 'Simon Yard',
    date: '2023-10-20',
    status:1,
  },
  {
    id: 2,
    stage: '1st level',
    name: 'Simon Yard',
    date: '2023-10-20',
    status:2,
  }
  ,{
    id: 3,
    stage: '1st level',
    name: 'Simon Yard',
    date: '2023-10-20',
    status:3,
  }
  ,{
    id: 4,
    stage: '1st level',
    name: 'Simon Yard',
    date: '2023-10-20',
    status:2,
  }
])
//methods
const searching = () => {
  console.log("searching", search.value)
}
</script>
<style scoped>
.header {
  width: 110%;
  margin-top: 1%;
}
</style>