<template>
  <div>
    {{ recordCount == 0 ? "No records to show" : displayNumbers() }}
    <!-- {{ displayNumbers() }} -->
  </div>
</template>

<script>
export default {
  props: {
    recordCount: {
      type: Number,
    },
    visibleRecords: {
      type: Number,
    },
    pageNumber: {
      type: Number,
    },
    searchvalue: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      startNumber: "",
      endNumber: "",
      wholePages: 0,
      totalPages: 0,
      remainingRecords: 0,
    };
  },
  mounted() {
    setTimeout(() => {
      this.displayNumbers();
    }, 3000);
  },
  methods: {
    displayNumbers() {
      (this.wholePages = parseInt(this.recordCount / this.visibleRecords)),
        (this.remainingRecords = parseInt(
          this.recordCount % this.visibleRecords
        ));

      if (this.remainingRecords > 0) {
        this.totalPages = this.wholePages + 1;
      } else if (this.remainingRecords == 0) {
        this.totalPages = this.wholePages;
      }

      // console.log("To", this.totalPages);
      // console.log("Too", this.pageNumber);
      // console.log("Too1", this.remainingRecords);

      if (this.pageNumber == this.totalPages) {
        this.pageNumber == 1
          ? (this.startNumber = 1)
          : (this.startNumber =
              (this.pageNumber - 1) * this.visibleRecords + 1);
        this.pageNumber == 1
          ? this.remainingRecords == 0
            ? (this.endNumber = this.pageNumber * this.visibleRecords)
            : (this.endNumber = this.remainingRecords)
          : this.remainingRecords == 0
          ? (this.endNumber = this.pageNumber * this.visibleRecords)
          : (this.endNumber =
              (this.pageNumber - 1) * this.visibleRecords +
              this.remainingRecords);
        // console.log("end", this.endNumber);
      } else if (this.pageNumber == 1) {
        // console.log("rc1", Number.isInteger(this.searchvalue));
        // const sState = Number.isInteger(this.searchvalue);
        this.startNumber = 1;
        this.endNumber = this.pageNumber * this.visibleRecords;
      } else {
        this.startNumber = (this.pageNumber - 1) * this.visibleRecords + 1;
        this.endNumber = this.pageNumber * this.visibleRecords;
      }
      //  console.log("rc1", Number.isInteger(this.searchvalue));
      //  const sState = Number.isInteger(this.searchvalue);
      //   sState == false
      //       ? this.endNumber == this.pageNumber * this.visibleRecords
      //       : this.endNumber == this.remainingRecords;
      if (this.recordCount == 1) {
        this.startNumber = 0;
        this.endNumber = this.visibleRecords;
        return (
          this.startNumber + " - " + this.endNumber + " of " + this.recordCount
        );
      } else {
        return (
          this.startNumber + " - " + this.endNumber + " of " + this.recordCount
        );
      }
    },
  },
};
</script>

<style></style>
