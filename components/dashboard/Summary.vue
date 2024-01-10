<template>
  <div class="row summary" style="margin-left: 0; margin-right: 0;">
    <div class="col-lg-3">
      <div class="ibox ">
        <div class="ibox-title">
          <div class="ibox-tools">
            <span class="label label-success float-right">Upto Today</span>
          </div>
          <h5>Total Requests</h5>
        </div>
        <div class="ibox-content">
          <h1 class="no-margins">{{ total }}</h1>
        </div>
      </div>
    </div>
    <div class="col-lg-3">
      <div class="ibox ">
        <div class="ibox-title">
          <div class="ibox-tools">
            <span class="label label-success float-right">Upto Today</span>
          </div>
          <h5>Attended Requests</h5>
        </div>
        <div class="ibox-content">
          <h1 class="no-margins">{{ attended }}</h1>
        </div>
      </div>
    </div>
    <div class="col-lg-3">
      <div class="ibox ">
        <div class="ibox-title">
          <div class="ibox-tools">
            <span class="label label-success float-right">Upto Today</span>
          </div>
          <h5>Pending Requests</h5>
        </div>
        <div class="ibox-content">
          <h1 class="no-margins">{{ pending }}</h1>
        </div>
      </div>
    </div>
    <div class="col-lg-3">
      <div class="ibox ">
        <div class="ibox-title">
          <div class="ibox-tools">
            <span class="label label-success float-right">Upto Today</span>
          </div>
          <h5>Completed Requests</h5>
        </div>
        <div class="ibox-content">
          <h1 class="no-margins">{{ completed }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Summary"
}
</script>
<script setup>
const props = defineProps({
  total: {
    type: Number
  },
  attended: {
    type: Number
  },
  pending: {
    type: Number
  },
  completed: {
    type: Number
  }
})
</script>
<style scoped>
</style>