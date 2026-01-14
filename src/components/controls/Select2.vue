<template>
  <div>
    <select class="form-control" :id="id" :name="name" :disabled="disabled" :required="required"></select>
  </div>
</template>

<script>
import 'select2/dist/js/select2.full';
import 'select2/dist/css/select2.min.css';
export default {
  name: 'Select2',
  data() {
    return {
      select2: null
    };
  },
  emits: ['update:modelValue', 'select'],
  props: {
    modelValue: [String, Array, Number], // previously was `value: String`
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => {}
    },
  },
  watch: {
    options: {
      handler(val) {
        this.setOption(val);
      },
      deep: true
    },
    modelValue: {
      handler(val) {
        this.setValue(val);
      },
      deep: true
    },
  },
  methods: {
    setOption(val = []) {
      this.select2.empty();
      this.select2.select2({
        placeholder: this.placeholder,
        ...this.settings,
        data: val,
        templateSelection: function(option) {
          if (!option.id) return option.text; // placeholder
          const span = document.createElement('span');
          span.textContent = option.text;
          span.title = option.text; // tooltip native
          return span;
        }
      });
      this.setValue(this.modelValue);
    },
    setValue(val) {
      if (val instanceof Array) {
        this.select2.val([...val]);
      } else {
        this.select2.val([val]);
      }
      this.select2.trigger('change');
    }
  },
  mounted() {
    this.select2 = $(this.$el)
      .find('select')
      .select2({
        placeholder: this.placeholder,
        ...this.settings,
        data: this.options,
        width: '100%',
        templateSelection: function(option) {
          if (!option.id) return option.text; // placeholder
          const span = document.createElement('span');
          span.textContent = option.text;
          span.title = option.text; // tooltip native
          return span;
        }
      })
      .on('select2:select select2:unselect', ev => {
        this.$emit('update:modelValue', this.select2.val());
        this.$emit('select', ev['params']['data']);
      });
      this.setValue(this.modelValue);
  },
  beforeUnmount() {
    this.select2.select2('destroy');
  }
};
</script>
