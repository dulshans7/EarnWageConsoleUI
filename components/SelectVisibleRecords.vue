<template>
  <div class="form-group row">
    <label class="col-md-2 mt-2">Show</label>
    <div class="col-md-4">
      <select class="form-control" v-model="showRecord" @change="onOptionChange">
        <option v-for="option in optionsList" :value="option.text">{{ option.text }}</option>
      </select>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      showRecord: 10,
      optionsList: [
        { id: "10", text: "10" },
        { id: "25", text: "25" },
        { id: "50", text: "50" },
        { id: "100", text: "100" },
      ],
    };
  },
  methods: {
    onOptionChange() {
      this.$emit("update:option", this.showRecord);
    },
  },
};
</script>

<style></style>
