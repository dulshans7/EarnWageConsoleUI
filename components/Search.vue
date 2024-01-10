<template>
  <div class="input-group">
    <input
        type="text"
        class="form-control form-control-sm"
        v-model="searchText"
        v-on:keyup="onSearchClick"
    />
    <span class="input-group-append">
      <button type="button" class="btn btn-sm btn-default">
        <i class="fa fa-search"></i>
      </button>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
    };
  },
  methods: {
    onSearchClick() {
      this.$emit("update:option", this.searchText);
    },
  },
};
</script>

<style></style>
