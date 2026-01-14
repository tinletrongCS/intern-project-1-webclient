<template>
  <select ref="select" :disabled="disabled" style="width: 100%"></select>
</template>

<script>
import 'select2'
import 'select2/dist/css/select2.css'
import axios from "axios"
export default {
  name: 'CustomerSelect',
  props:{
    isSelectAll:{
      type:Boolean,
      default: true
    },
    //Mục đích khi đầu hiển thị tên khách hàng lần đầu khi chưa seach
    customerName:{
      type:String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'select'],
  mounted() {
    const $select = $(this.$refs.select);
    $select.prop('disabled', this.disabled);
    const vm = this;
    $select.select2({
      placeholder: this.isSelectAll?'Tất cả':(this.customerName&&this.customerName!='')?this.customerName:'Chọn khách hàng...',
      language: {
        inputTooShort: function (args) {
          return 'Vui lòng nhập ít nhất ' + args.minimum + ' ký tự';
        },
        searching: function () {
          return 'Đang tìm kiếm...';
        }
      },
      minimumInputLength: 0,
      ajax: {
        delay: 1000,
        transport: (params, success, failure) => {
          const searchTerm = params.data.term?.trim()??''
          if(searchTerm==''){
            success({success:true,data:[]})
            return
          }
          this.dataSelect=[]
          axios.get(`Customer/GetSearchCustomer?searchText=`+searchTerm)
          .then((response) => {
            success(response.data)
          })
          .catch(failure)
        },
        processResults: (data) => {
         let results = [];

          if (data.success) {
            results = data.data.map(x => ({
              id: x.ID,
              text: x.Name
            }));

            // 👇 Nếu có isSelectAll, thêm "Tất cả" vào đầu
            if (vm.isSelectAll) {
              results.unshift({
                id: -1,
                text: 'Tất cả'
              });
            }
          } else {
            if (vm.isSelectAll) {
              results = [{
                id: -1,
                text: 'Tất cả'
              }];
            }
          }

          return { results };
        }
      }
    }).on('select2:select', (e) => {
      this.$emit('update:modelValue', e.params.data)
      this.$emit('select', e.params.data)
    })
  },
  unmounted() {
    $(this.$refs.select).select2('destroy')
  },
  watch: {
    customerName(newVal) {
      const $select = $(this.$refs.select);
      const newPlaceholder = this.isSelectAll ? 'Tất cả' : (newVal && newVal.trim() !== '') ? newVal : 'Chọn khách hàng...';
      // 👇 Cập nhật lại placeholder cho Select2
      $select.data('select2').$container.find('.select2-selection__placeholder').text(newPlaceholder);
      $select.data('select2').$container.find('.select2-selection__rendered').text((newVal && newVal.trim() !== '') ? newVal : newPlaceholder);
    },
    disabled(newVal) {
      const $select = $(this.$refs.select);
      $select.prop('disabled', newVal); // cập nhật thuộc tính HTML
      $select.trigger('change.select2'); // cập nhật lại giao diện select2
    }
  }
}
</script>
