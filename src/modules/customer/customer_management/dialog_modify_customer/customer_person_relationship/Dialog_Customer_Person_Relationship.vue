<template>
    <ejs-dialog
        ref='dialogPersonRelationship'
        :allowDragging="true"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="isDialog"
        :showCloseIcon="true"
        width="60%"
        :header='"Mối quan hệ khách hàng cá nhân"'
        :isModal='true'
        :open="handleShowModal"
        :close="closeDialog"
        >
        <div class="modal-content popup-box body-dialog">
            <div class="k form-dialog row">
                <div class="col-lg-5 col-12">
                    <div class="k bd-form-input">
                        <k-input :textInput='"Tên khách hàng:"' :disabled="true" :isImportain="false" :dataInput ='dataSelected.customer_name'/>
                    </div>
                    <div class="k bd-form-input">
                        <span class="k category-text-detail">Khách hàng liên quan:<i class="warning-input">*</i></span>
                        <select2 v-model="person_relationship.personal_profile"  class="select2" :options="listCustomerCN.map(e=>({id:e.customer_id, text:`${e.customer_name} (${e.code})`}))"></select2>
                    </div>
                    <div class="k bd-form-input">
                        <span class="k category-text-detail">Mối quan hệ:<i class="warning-input">*</i></span>
                        <select2 v-model="person_relationship.person_relationships"  class="select2" :options="listPersonRelationship"></select2>
                    </div>
                    <div class="k bd-form-input">
                        <span class="k category-text-detail">Ghi chú quan hệ:</span>
                        <textarea class='form-control text-relationship' rows="4" :value="person_relationship.notes" @change="e=>person_relationship.notes=e.target.value"/>
                    </div>

                    <div class="group-buttons -bottom center">
                        <button class="btn btn-outline-secondary button-update-account" @click="clearData"  style="width: 120px">
                            <i class="fa fa-refresh" aria-hidden="true"></i> Làm mới
                        </button>
                        <button class="btn btn-outline-secondary button-update-account" @click="insertPersonRelationship"  style="width: 120px" v-if="!person_relationship.person_id">
                            <i class="fa fa-save" aria-hidden="true"></i> Ghi lại
                        </button>
                        <button class="btn btn-outline-secondary button-update-account" @click="updatePersonRelationship"  style="width: 120px" v-if="person_relationship.person_id">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Cập nhật
                        </button>
                        <button class="btn btn-outline-secondary button-update-account" @click="deletePersonRelationship"  style="width: 120px" v-if="person_relationship.person_id">
                            <i class="fa fa-trash-o" aria-hidden="true"></i> Xoá
                        </button>
                    </div>
                </div>
                <div class="col-lg-7 col-12">                    
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" 
                        :dataSource = "listCustomerPersonRelationship"
                        :allowPaging="true"
                        :showFilter="true"
                        :showColumnCheckbox="false"
                        :enabledSelectFirstRow="false"
                        :allowSorting="true"
                        :commands="commands"
                        @onRowSelected="selectRow"
                        :commandColumn="{headerText: 'Chức năng',cellCssClass: 'css1', show: true, firstColumn:false, width:'130'}"
                    />
                </div>
            </div>
        </div>
    </ejs-dialog>
    
    
</template>
<script>
import { createApp } from "vue";
import CustomerPersonRelationshipApi from '../../../CusomterApi.js';
import moment from "moment";

const app = createApp();
    export default{
        data(){
            return{
                editSettings: {
                    allowEditing: true,
                    mode:'Normal'
                },
                listCustomerCN: [],
                listPersonRelationship: [{id: 1, text: 'Cha'}, {id: 2, text: 'Mẹ'}, {id: 3, text: 'Con'}, 
                    {id: 4, text: 'Anh'}, {id: 5, text: 'Chị'}, {id: 6, text: 'Họ hàng'}, 
                    {id: 7, text: 'Bạn học'}, {id: 8, text: 'Bạn xã hội'}, {id: 9, text: 'Khác - xem ghi chú'}],
                person_relationship: {
                    person_id: null,
                    cus_detail_id: null,
                    person_relationships: null,
                    personal_profile: null,
                    notes: ''
                },  // Shallow copy
                listCustomerPersonRelationship: [],
                commands:[],
                colums:
                [
                    {
                        fieldName: "display_name",
                        headerText: "Khách hàng liên quan",
                    },
                    {
                        fieldName: "type_name",
                        headerText: "Mối quan hệ",
                    },
                    {
                        fieldName: "notes",
                        headerText: "Ghi chú",
                    }
                ],
            }
        },
        props:{
            dataSelected:{
                type:Object,
                default: () => {},
                required: true
            },
            isDialog:{
                type:Boolean,
                default:false,
                required: true
            },
            types:{
                type:Array,
                default:() => [],
                required: true
            },
        },
        computed:{},
        methods:{
            clearData() {
                this.person_relationship = {}
                this.getCustomerPersonRelationship(this.dataSelected.person_detail.cus_detail_id);
            },
            handleShowModal(){
                this.getListCustomer(2);
                this.clearData();
            },
            closeDialog(){
                this.$emit('closeDialogUpdate');
            },
            
            disableEnterKey(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            },
            // get List Customer KHCN
            async getListCustomer(grouptype_id){
                try{
                    this.listCustomerCN = [];
                    var input = {
                        grouptype_id: grouptype_id,
                        customer_id: 0
                    }
                    let response = await CustomerPersonRelationshipApi.getListCustomerForManagement(this.axios,input)
                    if(response.data.success){
                        if (response.data.data.length > 0) {
                            console.log(JSON.parse(response.data.data));
                            this.listCustomerCN = JSON.parse(response.data.data).filter(x => x.customer_id != this.dataSelected.customer_id);
                        }
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
            // get List Customer Person Relationship
            async getCustomerPersonRelationship(cus_detail_id){
                try{
                    this.listCustomerPersonRelationship = [];
                    let response = await CustomerPersonRelationshipApi.getCustomerPersonRelationship(this.axios,cus_detail_id)
                    if(response.data.success){
                        if (response.data.data.length > 0) {
                            this.listCustomerPersonRelationship = response.data.data;
                        }
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
            validate(input) {

                if (!input.person_relationships) {
                    this.$toast.error("Mối quan hệ cá nhân không được để trống");
                    return false;
                }

                if (!input.personal_profile) {
                    this.$toast.error("Profile cá nhân không được để trống");
                    return false;
                }

                return true;
            },
            //cập nhật lại KH
            async insertPersonRelationship(){
                if (!this.validate(this.person_relationship)) return;
                
                var rq = {
                    person_id: 0,
                    cus_detail_id: this.dataSelected.person_detail.cus_detail_id,
                    personal_profile: this.person_relationship.personal_profile,
                    person_relationships: this.person_relationship.person_relationships,
                    notes: this.person_relationship.notes
                };
                try{
                    let response = await CustomerPersonRelationshipApi.insertCustomerPersonRelationship(this.axios,rq);
                    if(response.data.success){
                        this.$toast.success("Thêm mới thành công");
                        this.clearData();
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
            //cập nhật lại KH
            async updatePersonRelationship(){
                if( Object.keys(this.person_relationship).length === 0 && this.person_relationship.constructor === Object){
                    this.$toast.warning("Vui lòng chọn ít nhất một dòng thông tin");
                    return;
                }
                if (!this.validate(this.person_relationship)) return;
                
                var rq = {
                    person_id: this.person_relationship.person_id,
                    cus_detail_id: this.person_relationship.cus_detail_id,
                    personal_profile: this.person_relationship.personal_profile,
                    person_relationships: this.person_relationship.person_relationships,
                    notes: this.person_relationship.notes
                };
                try{
                    let response = await CustomerPersonRelationshipApi.updateCustomerPersonRelationship(this.axios,rq);
                    if(response.data.success){
                        this.$toast.success("Cập nhật thành công");
                        this.clearData();
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
            // Xoa
            async deletePersonRelationship(){
                if( Object.keys(this.person_relationship).length === 0 && this.person_relationship.constructor === Object){
                    this.$toast.warning("Vui lòng chọn ít nhất một dòng thông tin");
                    return;
                }
                try{
                    let response = await CustomerPersonRelationshipApi.deleteCustomerPersonRelationship(this.axios,this.person_relationship.person_id);
                    if(response.data.success){
                        this.$toast.success("Cập nhật thành công");
                        this.clearData();
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            },
          
            // thay đổi input
            //chọn một dòng
            selectRow(data){
                this.person_relationship = data;
            },
            // gọi component để load lại data
            refeshData(data){
                this.$emit('refeshData', data);
            },
        },
        created(){
        },
        mounted() {},
        watch: {}
    }
</script>
<style src="./Dialog_Customer_Person_Relationship.css" scoped></style>