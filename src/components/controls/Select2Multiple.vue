<template>
  <div>
    <select class="form-control"
      :id="id"
      :name="name"
      :disabled="disabled"
      :required="required"
      :multiple="multiple">
    </select>
  </div>
</template>

<script>
import 'select2/dist/js/select2.full';
import 'select2/dist/css/select2.min.css';

export default {
  name: 'Select2Multiple',
  emits: ['update:modelValue', 'select'],
  props: {
    modelValue: { type: [String, Array, Number], default: null },
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    settings: { type: Object, default: () => ({}) },
    multiple: { type: Boolean, default: true } // ✅ thêm prop multiple
  },
  data() {
    return { select2: null };
  },
  watch: {
    options: {
      handler(val) { this.setOption(val); },
      deep: true
    },
    modelValue(val) {
      this.setValue(val);
    }
  },
  methods: {
    setOption(val = []) {
      this.select2.empty();
      this.select2.select2({
        placeholder: this.placeholder,
        multiple: this.multiple, // ✅ thông báo cho select2
        ...this.settings,
        data: val
      });
      this.setValue(this.modelValue);
    },
    setValue(val) {
      if (this.multiple) {
        this.select2.val(Array.isArray(val) ? val : [val]);
      } else {
        this.select2.val(val);
      }
      this.select2.trigger('change.select2');
    }
  },
  mounted() {
    this.select2 = $(this.$el).find('select').select2({
      placeholder: this.placeholder,
      multiple: this.multiple,
      ...this.settings,
      data: this.options
    }).on('change', () => {
      const val = this.multiple ? this.select2.val() || [] : this.select2.val();
      this.$emit('update:modelValue', val);
    });

    this.setValue(this.modelValue);
  },
  beforeUnmount() {
    this.select2.select2('destroy');
  }
};
</script>
