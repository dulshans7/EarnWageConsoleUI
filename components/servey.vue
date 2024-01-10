<template>
  <div>

  </div>
</template>

<script>
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-vue-ui';

export default {
  name: "servey",
  components: {
    Survey
  },
  data() {
    const survey = new Model(surveyJson);
    survey.addNavigationItem({
      id: "pdf-export",
      title: "Save as PDF",
      action: () => savePdf(survey.data)
    });
    return {
      survey
    }
  }
}
</script>

<style scoped>

</style>