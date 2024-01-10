<template>
  <div id="Pending" aria-hidden="true" aria-labelledby="modelTitleId" class="modal fade" role="dialog" style="display: none;" tabindex="-1">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Reprocess History</h5>
          <button aria-label="Close" class="close" data-dismiss="modal" type="button">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <div class="col-md-12">
              <table class="table table-bordered table-sm">
                <thead>
                <tr>
                  <th>Reprocess Date</th>
                  <th>Reason for Remittance Failure</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>01/05/2023</td>
                  <td>Fund Unavilavility</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" data-dismiss="modal" type="button">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PendingModal"
}
</script>

<style scoped>

</style>