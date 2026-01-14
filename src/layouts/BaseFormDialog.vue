<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    ref="dialogBase"
    :isModal="true"
    :width="width"
    :showCloseIcon="true"
    :header="header"
    :visible="false"
    @open="handleOpen"
  >
  <div class="modal-content popup-box">
    <div class="popup-body">
    <!-- Component động -->
    <component
      ref="child"
      v-if="isComponent"
      :is="isComponent"
      v-bind="componentProps"
      @success="handleSuccess"
    />
    </div>
  </div>
  </ejs-dialog>
</template>

<script>
import { markRaw } from 'vue'
import { shallowRef } from 'vue'
export default {
  name: "BaseFormDialog",
  data() {
    return {
      isComponent: shallowRef(null),
      componentProps: {},
      dialogTitle:'',
      animationSettings: { effect: "Zoom" },
      width:'70%'
    };
  },
  computed:{
    header(){
      return `<span class="icon one-notepad"></span> ${this.dialogTitle}`
    }
  },
  methods: {
    async showDialog({ component, header, props = {}, width }) {
      this.dialogTitle = header||''
      this.width= width||'70%'
      try {
        this.isComponent = markRaw(component.default || component)
        this.componentProps = props;
        this.$refs.dialogBase.show()
      } catch (err) {
        console.error("❌ Lỗi load component:", err)
      }
    },
    hideDialog() {
      this.isComponent=shallowRef(null)
      this.$refs.dialogBase.hide()
    },
    handleOpen() {
      setTimeout(()=>{
        this.init()
      },200)
    },
    init(){
      if (this.$refs.child) {
        // Kiểm tra component có method init không trước khi gọi
        if (typeof this.$refs.child.init === 'function') {
          this.$refs.child.init();
        } else {
          console.warn('Component không có method init');
        }
      }
    },
    handleSuccess(payload) {
      this.hideDialog();
    },
  },
};
</script>
