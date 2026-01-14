<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupUnit"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal"
        :close="clear">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Tên đơn vị <span class="text-danger">*</span></label>
                                <input type="text" v-model="developmentUnitName" class="form-control" :disabled="isViewDetail" placeholder="Nhập tên đơn vị phát triển...">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 col-12">
                            <div class="form-group">
                                <label class="form-label bold">Ghi chú</label>
                                <textarea v-model="description" class="form-control" :disabled="isViewDetail" rows="4" placeholder="Nhập ghi chú..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="group-buttons -bottom right modal-buttons">
                        <button v-if="!isViewDetail" @click="onSave" class="btn btn-second nocorner btn-save-unit">
                            <span class="icon one-save"></span> Lưu thay đổi
                        </button>
                         <button @click="hideModal" class="btn btn-primary nocorner">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import API from './DevelopmentUnitAPI.js'

export default {
    name:'DevelopmentUnitModal',
    props:{
      isAdd:{
        type:Boolean,
        default:false
      },
      isViewDetail:{
        type:Boolean,
        default:true
      },
      data:{
        type:Object,
        default: () => ({})
      }
    },
    computed:{
      header(){
        if(this.isAdd){
          return `<span class="icon one-notepad"></span> Tạo mới đơn vị phát triển`
        }else if(!this.isAdd&&!this.isViewDetail){
          return `<span class="icon one-notepad"></span> Điều chỉnh đơn vị phát triển`
        }else{
          return `<span class="icon one-notepad"></span> Chi tiết đơn vị phát triển`
        }
      }
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },

            // Dữ liệu form đơn vị phát triển
            developmentUnitName: '',
            description: ''
        }
    },
    methods:{
        // Hiển thị/ẩn loading spinner toàn cục
        loading(show) {
            this.$root.showLoading(show)
        },
        
        // Hiển thị modal đơn vị phát triển
        showModal() {
            this.$refs["popupUnit"].show()
        },
        
        // Ẩn modal đơn vị phát triển
        hideModal() {
            this.$refs["popupUnit"].hide()
        },
        
        // Xử lý khi modal được mở
        handleShowModal(){
            this.clear();
            if(!this.isAdd){
                this.loadData();
            }
        },
        
        // Xóa tất cả dữ liệu form và reset về trạng thái ban đầu
        clear(){
            this.developmentUnitName = ''
            this.description = ''
        },
        
        // Load dữ liệu đơn vị phát triển vào form khi chỉnh sửa
        loadData(){
            if(this.data){
                this.developmentUnitName = this.data.developmentUnitName || ''
                this.description = this.data.description || ''
            }
        },

        async onSave(){
            // Validation
            if (!this.developmentUnitName.trim()) {
                this.$toast.error('Vui lòng nhập tên đơn vị phát triển');
                return;
            }
            const payload = {
                development_unit_id: this.isAdd ? 0 : this.data.developmentUnitId,
                development_unit_name: this.developmentUnitName.trim(),
                description: this.description.trim() || null
            };
            let response;
            if (this.isAdd) {
                response = await API.AddDevelopmentUnit(this, payload);
            } else {
                response = await API.UpdateDevelopmentUnit(this, payload);
            }

            if (response && response.success) {
                this.$emit('successUnit');
                this.hideModal();
            }
        }
    }
}
</script>
