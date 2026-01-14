<template>
  <div class="main-wrapper"  >
    <breadcrumb :header="header" />
    <div class="k main-form">
      <div class="k box-form">
        <div class="k box-form">
          <div class="row">
            <div class="col-lg-2 col-12">
              <div class="info-row">
                <div class="key w120">Loại khách hàng</div>
                <div class="value w200">
                  <div class="select-custom">
                    <select2 v-model="group_type_id"  class="select2" :options="listTypes.map(r => ({id: r.group_type_id, text: r.group_type_name}))" @select="changeGroupType"></select2>
                  </div> 
                </div>
              </div>
            </div>
            <div class="col-lg-2 col-12">
              <div class="info-row">
                <div class="key w80">Trạng thái</div>
                <div class="value w200">
                  <div class="select-custom">
                    <select2 v-model="status_id"  class="select2" :options="listStatus" @select="changeCustomerStatus"></select2>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="k box-form">
          <div class="row">
            <div class="form-edit-group">
              <button class="k btn-change  bnt btn-primary" v-if="hasButtonPermission('insertCustomer')" @click="onClickAddNewCustomer(true)"><i class="fa fa-plus" aria-hidden="true"></i> Thêm mới</button>
              <button class="k btn-change  bnt btn-primary" v-if="hasButtonPermission('updateCustomer')"  @click="onClickUpdateCustomer(true)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Cập nhật</button>
              <button class="k btn-change  bnt btn-primary" v-if="hasButtonPermission('editRelationshipCustomer') && (dataSelected != null && dataSelected.group_type_id == 2)"  @click="onClickPersonRelationshipCustomer(true)">
                <i class="fa fa-address-book-o" aria-hidden="true"></i>Quan hệ cá nhân
              </button>
              <button class="k btn-change  bnt btn-primary" v-if="hasButtonPermission('deleteCustomer')" @click="onClickDeleteCustomer"><i class="fa fa-trash-o" aria-hidden="true"></i> Xóa</button>
            </div>
          </div>
        </div>
        <div class="k box-form">
          <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listDataShow"
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
    <!-- change customer -->
    <dialog_person_relationship :types="listTypes" @closeDialogUpdate="closeDialogPersonRelationship" :isDialog="isDialogPersonRelationship" @refeshData="getListCustomer" :dataSelected="dataSelected" />
    <dialog-update-customer :types="listTypes" @closeDialogUpdate="closeDialogUpdate" :isDialog="isDialogUpdateCustomer" @refeshData="getListCustomer" :dataSelected="dataSelected" />
    <dialog-add-customer :types="listTypes" @closeDialog ="closeDialogAddNew" :isDialog ="isDialogAddNewCustomer" @refeshData="getListCustomer" :group_type_id="group_type_id"/>
  </div>
</template>
<script>
import Dialog_Add_Customer from './customer_management/dialog_modify_customer/customer_add_new/Dialog_Add_Customer.vue';
import Dialog_Update_Customer from './customer_management/dialog_modify_customer/customer_update/Dialog_Update_Customer.vue';
import Dialog_Person_Relationship_Customer from './customer_management/dialog_modify_customer/customer_person_relationship/Dialog_Customer_Person_Relationship.vue';
import CustomerApi from './CusomterApi.js';
import moment from 'moment';
export default{
  data(){
    return {
      header: {
        title: "Quản lý khách hàng",
        list: [
        ],
      },
      listDataShow: [],
      listData:[],
      colums:
      [
        {
          fieldName: "customer_id",
          headerText: "ID",
          width:'100'
            
        },
        {
          fieldName: "customer_name",
          headerText: "Tên khách hàng",
        },
        {
          fieldName: "code",
          headerText: "Mã nhận diện",
        },
        {
          fieldName: "status",
          headerText: "Trạng thái",
        },
        {
          fieldName: "phone_number",
          headerText: "SĐT liên hệ",
        },
        {
          fieldName: "taxcode",
          headerText: "Mã số thuế",
        },
        {
          fieldName: "email",
          headerText: "Email",
        },
        {
          fieldName: "address",
          headerText: "Địa chỉ",
        }
      ],
      commands:[],
      isDialogAddNewCustomer:false,
      isDialogUpdateCustomer:false,
      isDialogPersonRelationship:false,
      group_type_id:1,
      status_id: 1,
      listStatus:[{id: 1, text: 'Đang hoạt động'}, {id: 0, text:'Dừng hoạt động'}],
      listTypes:[],
      dataSelected:{}
    }
  },
  components:{
    'dialog-add-customer': Dialog_Add_Customer,
    'dialog-update-customer': Dialog_Update_Customer,
    'dialog_person_relationship': Dialog_Person_Relationship_Customer
  },
  methods:{
    //đóng dialog add new
    closeDialogAddNew(){
      this.getListCustomer(this.group_type_id);
      this.isDialogAddNewCustomer = false;
    },
    //Đóng form update
    closeDialogUpdate(){
      this.getListCustomer(this.dataSelected.group_type_id);
      this.isDialogUpdateCustomer = false;
    },
    //đóng dialog Person Relationship
    closeDialogPersonRelationship(){
      this.isDialogPersonRelationship = false;
    },
    // Xóa KH - minhtri.hcm - 13/08/2025
    async onClickDeleteCustomer(){
        if(!this.dataSelected.customer_id || this.dataSelected.customer_id ==0){
          this.$toast.warning("Vui lòng nhấn chọn một khách hàng");
          return;
        }
        let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`)
        if(result==0) {
          this.loading(false);
          return;
        }
        else{
          try{
            let response = await CustomerApi.deleteCustomer(this.axios,this.dataSelected.customer_id)
            if(response.data.success){
              this.getListCustomer(this.dataSelected.group_type_id);
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
        }
    },
    // Mở dialog tạo mới - minhtri.hcm - 13/08/2025
    onClickAddNewCustomer(type){
      this.isDialogAddNewCustomer = type;
    },
    //mở dialog cap nhap Customer
    async onClickUpdateCustomer(type){
      if( Object.keys(this.dataSelected).length === 0 && this.dataSelected.constructor === Object){
        this.$toast.warning("Vui lòng chọn ít nhất một khách hàng");
        return;
      }
      this.isDialogUpdateCustomer = type;
    },
    //mở dialog moi quan he ca nhan Customer
    async onClickPersonRelationshipCustomer(type){
      if( Object.keys(this.dataSelected).length === 0 && this.dataSelected.constructor === Object){
        this.$toast.warning("Vui lòng chọn ít nhất một khách hàng");
        return;
      }
      this.isDialogPersonRelationship = type;
    },
    // get List Customer
    async getListCustomer(grouptype_id){
      try{
        this.listData = [];
        this.listDataShow = [];
        var input = {
          grouptype_id: grouptype_id,
          customer_id: 0
        }
        let response = await CustomerApi.getListCustomerForManagement(this.axios,input)
        if(response.data.success){
          if (response.data.data.length > 0) {
            var data = JSON.parse(response.data.data);
            this.binddingData(data);
            this.changeCustomerStatus();
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
    //đổ data ra giao diện
    binddingData(data){
      this.listData = data.map(x=>{
        if (x) {
          // x.create_day= this.formatDate(x.create_day);
          return x;
        } else return null;        
      });
    },
    // lấy danh sách nhóm KH
    async getCustomerGroupType(){
      try{
        this.listTypes = [];
        let response = await CustomerApi.getTypes(this.axios)
        if(response.data.success){
          this.listTypes=response.data.data;
          if(this.listTypes.length>0){
            this.getListCustomer(this.listTypes[0].group_type_id);
          }
          this.loading(false);
        }
        else{
          this.$toast.error(response.data.message);
          this.loading(false);
        }
      } catch(e){
        this.$toast.error(e.message);
        this.loading(false);
      }
    },
    //chuyển nhóm
    changeGroupType(event){
      this.dataSelected = {};
      this.getListCustomer(this.group_type_id);
    },
    changeCustomerStatus() {
      this.listDataShow = this.listData.filter(r => r.status_id == this.status_id);
    },
    //format date
    formatDate(date) {
      return date ? moment(date).format('DD/MM/YYYY') : '';
    },
    //Lấy danh sách khách hàng trong nhóm
    //chọn khách hàng
    selectRow(data){
      this.dataSelected = data;
    }
  },
  created(){
    this.getCustomerGroupType();
    this.GetPermissionButtons();
  }
}
</script>
<style src="./Customer.css" scoped></style>