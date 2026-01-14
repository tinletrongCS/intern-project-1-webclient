<template>
  <input
    type="text"
    class="form-control"
    :value="formattedRevenue"
    @input="onInput"
    @keypress="onlyNumberKey"
    @change="onChangeInputRevenue"
    :disabled="disabled"
  />
</template>

<script>
export default {
  name: "CurrencyInput",
  props: {
    data: { type: Object, required: true },
    parent: { type: Object, required: true }
  },
  computed: {
    disabled() {
      return this.parent.isViewDetail;
    },
    formattedRevenue() {
      if (this.data.revenue === null || this.data.revenue === undefined) return "";
      return this.data.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  },
  methods: {
    onInput(event) {
      const rawValue = event.target.value.replace(/\./g, "");
      this.data.revenue = Number(rawValue);
      event.target.value = this.formattedRevenue;

      this.$nextTick(() => {
        const el = event.target;
        el.selectionStart = el.selectionEnd = el.value.length;
      });
    },
    onChangeInputRevenue(e) {
      this.parent.onChangeInputRevenue(this.data, e.target.value);
    },
    onlyNumberKey(event) {
      const charCode = event.which || event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    }
  }
};
</script>

<style scoped>
.form-control {
  width: 100%;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
