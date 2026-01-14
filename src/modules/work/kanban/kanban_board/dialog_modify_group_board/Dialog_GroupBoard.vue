<template>
    <ejs-dialog
                ref='dialogAddGroupBoard'
                :allowDragging="true"
                :enableResize="false"
                :position="{X:'center', Y:'center'}"
                :visible="isDialog"
                :showCloseIcon="true"
                width="40%"
                :header='"Thêm mới bảng"'
                :isModal='true'>
                <div class="modal-content popup-box body-dialog">
                    <div class="k form-dialog">
                        <div class="k bd-form-input">
                            <k-input :textInput='"Tên nhóm:"' :isImportain="true"  @modelData ='boardGroup.name' :dataInput='boardGroup.name'/>
                        </div>
                        <div class="group-buttons -bottom center">
                            <button class="btn btn-outline-secondary button-update-account" @click="insertAccount"  style="width: 120px">
                            Thêm mới
                            </button>
                        </div>
                    </div>
                </div>
        </ejs-dialog>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        props:{
            boardGroup:{
                type:Object,
                default:{},
                required: true
            },
            isDialog:{
                type:Boolean,
                default:false,
                required: true
            }
        },
    }
</script>
<style src="./Dialog_GroupBoard.css" scoped></style>