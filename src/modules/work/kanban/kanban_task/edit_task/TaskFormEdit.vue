<template>
    <ejs-dialog
        ref='dialogAssign'
        :allowDragging="true"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible='isModal'
        :showCloseIcon="true"
        width="40%"
        :header='titleModal'
        :isModal='true'
        :close = 'hideDialog'
        >
            <div class="modal-content popup-box">
                <div class="popup-body">
                    <div class="box-form col-lg-12 row">

                        <div class="info-row col-lg-12">
                            <div class="key w120">Công việc gốc:</div>
                            <div class="value">
                                <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                            </div>
                        </div>

                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Mã</div>
                                <div class="k value value-select">
                                    <input type="text"   class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Dự án:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Người giao:</div>
                                <div class="k value value-select">
                                    <input type="text"   class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Người nhận:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Bảng làm việc:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Giai đoạn:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Nhóm công việc:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Loại công việc:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                        </div>
                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Giờ yêu cầu:</div>
                                <div class="k value value-select">
                                    <input type="text"   class="form-control"/>
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Giờ thực hiện:</div>
                                <div class="k value value-select">
                                    <select2  class="select2"   :options="listUsers.map(e=>({id:e.user_id, text:e.full_name}))"></select2>
                                </div>
                            </div>
                        </div>

                        <div class="k info-row col-lg-12">
                            <div class="k item-task-row-6">
                                <div class="k key w120">Ngày bắt đầu:</div>
                                <div class="k value value-select form-datetime ">
                                    <ejs-datepicker class="form-control bg-none bor0 fw6 text-red form-control-datetime"
                                        placeholder="Chọn ngày" :format="'dd/MM/yyyy'"
                                        :enabled="true"
                                        :showClearButton="false" v-model="month_assign"
                                        :allowEdit="false"
                                        @change="onChangeDateAssign($event)"
                                    />
                                </div>
                            </div>
                            <div class="k item-task-row-6">
                                <div class="k key w120">Hạn hoàn thành:</div>
                                <div class="k value value-select form-datetime ">
                                    <ejs-datepicker class="form-control bg-none bor0 fw6 text-red form-control-datetime"
                                        placeholder="Chọn ngày" :format="'dd/MM/yyyy'"
                                        :enabled="true"
                                        :showClearButton="false" v-model="month_assign"
                                        :allowEdit="false"
                                        @change="onChangeDateAssign($event)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Nội dung</div>
                            <div class="value">
                                <textarea type="text"   class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Link Jira</div>
                            <div class="value">
                                <input type="text"   class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Diễn giải:</div>
                            <div class="value">
                                <textarea type="text"   class="form-control"/>
                            </div>
                        </div>

                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">File đính kèm:</div>
                            <div class="border-file-input">
                                <button class="k btn-select-file" @click="onSelectFile()" >Chọn file<i class="fa fa-file-text-o ic-select-file" aria-hidden="true"></i></button>
                                <span class="k name-file-selected">{{ nameFile }}</span>
                                <input id="input-file" type="file" style="display: none;"/>
                                <span class="btn-delete-file"><i class="fa fa-times-circle" aria-hidden="true"></i></span>
                            </div>
                        </div>
                       
                    </div>
                </div>
                <div class="group-buttons bottom button-edit">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-pencil" aria-hidden="true"></i> Cập nhật
                    </button>
                </div>
            </div>
    </ejs-dialog>
</template>
<script>
    export default{
        data(){
            return{
                nameFile:"Chưa có file được chọn",
                fileObject:Object()
            }
        },
        props:{
            titleModal :{
                type:String,
                default:""
            },
            isModal :{
                type:Boolean,
                default:false
            },
            listUsers:{
                type:Array,
                default:[]
            }
        },
        methods:{
            hideDialog(){
                this.$emit('hideDialog');
            },
            onSelectFile(){
                var self = this;
                $('#input-file').click();
                $("#input-file").change(function (event) {
                    self.readFile(event);
                });
            },
            readFile(event){
                var self= this;
                if(event.target.files[0]==null){
                    self.$toast.warning("Please select a image");
                    return;
                }
                else{
                    self.fileObject = event.target.files[0];
                    self.nameFile= event.target.files[0].name;
                    
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        // self.imageAuto = e.target.result;
                        // $(".img-preview").css("background-image", "url(" + e.target.result + ")");
                    };
                    reader.readAsDataURL(event.target.files[0]);
                }
            },
        }
    }
</script>
<style src="./TaskFormEdit.css" scoped></style>