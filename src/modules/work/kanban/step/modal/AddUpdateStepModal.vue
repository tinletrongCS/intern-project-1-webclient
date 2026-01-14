<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupAddStep"
        :showCloseIcon="true"
        width="40%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal"
        >
            <div class="modal-content popup-box">
                <div class="popup-body">
                    <div class="box-form col-lg-12 row">
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Tên giai đoạn</div>
                            <div class="value">
                                <input type="text" ref="inputGiaiDoan" class="form-control" :value="input_ten_congdoan" @change="e=>input_ten_congdoan=e.target.value"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Vị trí</div>
                            <div class="value">
                                <!-- <input type="number" min="1" 
                                    max="100" ref="inputPosition"
                                    class="form-control"
                                    v-model.number="input_position"
                                    @blur="input_position = Math.min(100, Math.max(1, input_position))"
                                /> -->
                                <div class="select-custom">
                                    <select class="form-control" v-model="position_selected">
                                        <option :value="pos" :key="pos" v-for="pos in list_position">{{ pos }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="group-buttons bottom button-edit">
                    <button type="submit" class="btn btn-primary" @click="clickSave">
                        <i class="one-save" aria-hidden="true"></i> Lưu thông tin
                    </button>
                </div>
            </div>
    </ejs-dialog>
</template>
<script>
import API from '../API'
export default{
    name:'AddUpdateStepModal',
    props:{
        data:{
            type:Object,
            default: () => ({}) 
        },
        boardId:{
            type:Number,
            default:0
        },
        isUpdate:{
            type:Boolean,
            default:false
        },
        positionLast:{
            type:Number,
            default:1
        }
    },
    computed:{
        header(){
            return this.isUpdate?`<span class="icon one-notepad"></span> Chỉnh sửa công đoạn`:`<span class="icon one-notepad"></span> Thêm mới công đoạn`
        }
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            input_ten_congdoan:'',
            input_position:1,
            position_selected:1,
            list_position:[]
        }
    },
    methods:{
        showModal() {
            this.$refs["popupAddStep"].show()
        },
        hideModal() {
            this.$refs["popupAddStep"].hide()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        async initDuLieu(){
            if(this.isUpdate){
                this.list_position=Array.from({ length: this.positionLast - 1 }, (_, i) => i + 1)
                this.input_ten_congdoan=this.data.step_name?this.data.step_name:''
                this.position_selected=this.data.position?this.data.position:this.positionLast
            }else{
                this.list_position=Array.from({ length: this.positionLast }, (_, i) => i + 1)
                this.position_selected=this.positionLast
            }
        },
        clear(){
            this.input_ten_congdoan=''
            this.position_selected=1
            this.list_position=[]
        },
        async clickSave(){
            if(this.input_ten_congdoan.trim()==''){
                this.$toast.error("Tên giai đoạn không được để trống")
                this.$refs.inputGiaiDoan.focus()
                return
            }
            if(!this.isUpdate){
                //Tạo mới giai đoạn
                let dataRequest={
                    board_id:this.boardId,
                    step_id:0,
                    step_name:this.input_ten_congdoan.trim(),
                    position:this.position_selected
                }
                let result=await API.CreateStep(this, dataRequest)
                if(result=='1'){
                    this.$toast.success('Thêm mới giai đoạn thành công!')
                    this.$emit('successAddUpdateStep')
                    this.hideModal()
                }else{
                    this.$toast.error(result)
                }
            }else{
                //Cập nhật giai đoạn
                let dataRequest={
                    board_id:this.boardId,
                    step_id:this.data.step_id,
                    step_name:this.input_ten_congdoan.trim(),
                    position:this.position_selected
                }
                let result=await API.UpdateStep(this, dataRequest)
                if(result=='1'){
                    this.$toast.success('Cập nhật giai đoạn thành công!')
                    this.$emit('successAddUpdateStep')
                    this.hideModal()
                }else{
                    this.$toast.error(result)
                }
            }
        }
    },
}
</script>
<style src="./AddUpdateStepModal.css" scoped></style>