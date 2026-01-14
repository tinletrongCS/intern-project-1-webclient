<template>
    <div>
      <select class="custom-select" ref="select" :value="value" @change="onChange" :multiple="multiple" style="width: 100%">
        <option v-for="item in options" :key="item.value" :value="item.value">
          {{ item.text }}
        </option>
      </select>
    </div>
</template>
  
  <script>
  import $ from 'jquery';
  import 'select2';
  export default {
    name: 'Select2',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      options: {
        type: Array,
        required: true,
      },
      placeholder: {
        type: String,
        default: 'Select options',
      },
      multiple: {
        type: Boolean,
        default: true, // Enable multiple select by default
      },
      selectClass: {
        type: String,
        default: '', // Add custom classes to the <select> element
      },
      // dropdownClass: {
      //   type: String,
      //   default: '', // Add custom classes to the dropdown
      // },
      // selectionClass: {
      //   type: String,
      //   default: '', // Add custom classes to the selection area
      // },
    },
    mounted() {
      $(this.$refs.select)
        .select2({
          placeholder: this.placeholder,
          allowClear: true,
          // dropdownCssClass: this.dropdownClass, // Custom class for dropdown
          // selectionCssClass: this.selectionClass, // Custom class for selection
        })
        .on('select2:select select2:unselect', () => {
          this.$emit('input', $(this.$refs.select).val());
        });
    },
    watch: {
      value(newValue) {
        $(this.$refs.select).val(newValue).trigger('change');
      },
      options: {
        handler() {
          this.refreshOptions();
        },
        deep: true,
      },
    },
    methods: {
      onChange(event) {
        const selected = Array.from(event.target.options)
          .filter(option => option.selected)
          .map(option => option.value);
        this.$emit('input', selected);
      },
      refreshOptions() {
        $(this.$refs.select).empty(); // Clear options
        this.$nextTick(() => {
          $(this.$refs.select).select2({
            placeholder: this.placeholder,
            allowClear: true,
            // dropdownCssClass: this.dropdownClass,
            // selectionCssClass: this.selectionClass,
          });
        });
      },
    },
    beforeDestroy() {
      // Destroy Select2 instance to avoid memory leaks
      $(this.$refs.select).select2('destroy');
    },
  };
  </script>
<style>
  .select2-container--default .select2-selection--multiple{
    border: 1px solid rgba(28, 117, 188, 0.5) !important;
    
  }
</style>
