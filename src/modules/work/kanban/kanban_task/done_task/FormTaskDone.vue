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
                            <div class="key w120">Trạng thái:</div>
                            <div class="value">
                                <select2  class="select2"   :options="listTypeOfTask.map(e=>({id:e.id, text:e.text}))"></select2>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Giải trình</div>
                            <div class="value">
                                <textarea  class="form-control"/>
                            </div>
                        </div>
                        <div class="info-row col-lg-12">
                            <div class="key w120 name-field">Đính kèm file</div>
                            <div class="value">
                                <div  class="k form-control form-select-file">
                                    <input type="file" id="input-file" />
                                    <span class="k name-file-selected">{{ fileName }}
                                        <span class="btn-delete-file" @click="deleteFile"><i class="fa fa-times-circle" aria-hidden="true"></i></span>
                                    </span>
                                    <span class="btn-select-file" @click="onChangeSelectFile">brower</span>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
                
                <div class="group-buttons bottom button-edit">
                    <button type="submit" class="btn btn-primary" @click="doneTask">
                        <i class="fa fa-pencil" aria-hidden="true"></i> Hoàn thành
                    </button>
                </div>
            </div>
    </ejs-dialog>
</template>
<script>
    export default{
        props:{
            titleModal :{
                type:String,
                default:""
            },
            isModal :{
                type:Boolean,
                default:false
            },
        },
        data(){
            return{
                fileName:"Không có file được chọn",
                fileObject:Object(),
                listTypeOfTask:[
                    {
                        id: 0,
                        text:"Done"
                    },
                    {
                        id: 1,
                        text:"Cancel"
                    },
                    {
                        id: 2,
                        text:"Give back"
                    }
                ]
            }
        },
        methods:{
            hideDialog(){
                this.$emit('hideDialog');
            },
            //Click button => call click input tag
            onChangeSelectFile(){
                var self = this;
                $('#input-file').click();
                $("#input-file").change(function (event) {
                    self.readFile(event);
                });
            },
            //read
            readFile(event){
                var self= this;
                if(event.target.files[0]==null){
                    self.$toast.warning("Please select a image");
                    return;
                }
                else{
                    self.fileObject = event.target.files[0];
                    self.fileName= event.target.files[0].name;
                    
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        self.imageAuto = e.target.result;
                        // $(".img-preview").css("background-image", "url(" + e.target.result + ")");
                    };
                    reader.readAsDataURL(event.target.files[0]);
                }
            },
            //Delete file selected
            deleteFile(){
                $('#input-file').val();
                this.fileObject = {};
                this.fileName = "Không có file được chọn";
            },
            //Done task
            doneTask(){

            }
        }
    }
</script>

<style src="./FormTaskDone.css" scoped></style>