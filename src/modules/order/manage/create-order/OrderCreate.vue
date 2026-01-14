<template>
      <ejs-dialog
          ref='dialogOrderCreate'
          :allowDragging="true"
          :enableResize="false"
          :position="{X:'center', Y:'center'}"
          :visible="isDialog"
          :showCloseIcon="true"
          width="50%"
          :header='"Thêm mới đơn đặt hàng"'
          :isModal='true'
          :close="closeDialog"
          >
            <div class="modal-content popup-box body-dialog">

              <div class="k top-form">
                <div class="title-top">
                  Thông tin chung
                </div>
                <div class="k border-row-item">
                    <!-- <k-input :textInput='"Tên bảng:"' :isImportain="true"  @modelData ='order.service_id' :dataInput ='order.service_id'/> -->
                    <span class="k category-text-detail">Dịch vụ:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k title-file-import"> File đính kèm:</span>
                    <div class="k form-input-file-attach">abc.xml
                      <span class="browse-file">browse</span>
                    </div>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Đơn vị đặt hàng:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Đại diện đơn vị đặt hàng:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Địa chỉ:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">SĐT:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Đơn vị thực hiện:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Đại diện vị thực hiện:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Ngày yêu cầu:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Nôi dung:<i class="warning-input">*</i></span>
                    <textarea class="k form-content"/>
                </div>
              </div>
              <div class="k top-form">
                <div class="title-top">Thông tin chi phí</div>
              
                <button type="Submit" class="k btn btn-primary" @click="insertOrder()"  style="float: right;"> 
                  <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
                </button>
                <div class="k bd-form-finance">
                  <div class="k card">
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listDatas"
                        :allowPaging="true"
                        :showFilter="true"
                        :showColumnCheckbox="false"
                        :enabledSelectFirstRow="false"
                        :allowSorting="true"
                        @onRowSelected="selectUser"
                        :commands="commands" 
                        :commandColumn="{headerText: '',cellCssClass: 'css1', show: true, firstColumn:false, width:'130'}"
                        @commandClicked="commandClicked"
                    />
                  </div>
                </div>
              </div>

              <div class="k top-form">
                <div class="title-top">Tổng chi phí</div>
                <div class="k col-lg-4">
                  <input class="k ic-checkbox" type="checkbox">
                  <span class="k text-name-checkbox">Theo manday</span>
                </div> 
                <div class="k col-lg-4">
                  <input class="k ic-checkbox" type="checkbox">
                  <span class="k text-name-checkbox">Trọn gói</span>
                </div> 
                <div class="k col-lg-4">
                  <input class="k ic-checkbox" type="checkbox">
                  <span class="k text-name-checkbox">Doanh thu phân chia</span>
                </div> 
                <div class="k border-row-item">
                    <k-input :textInput='"Sản lượng:"' :isImportain="true"  @modelData ='order.service_id' :dataInput ='order.service_id'/>
                </div>
                <div class="k border-row-item">
                    <k-input :textInput='"Thành tiền:"' :isImportain="true"  @modelData ='order.service_id' :dataInput ='order.service_id'/>
                </div>
                <div class="k border-row-item">
                    <k-input :textInput='"VAT:"' :isImportain="true"  @modelData ='order.service_id' :dataInput ='order.service_id'/>
                </div>
                <div class="k border-row-item">
                    <k-input :textInput='"Tổng tiền:"' :isImportain="true"  @modelData ='order.service_id' :dataInput ='order.service_id'/>
                </div>
                <div class="k border-row-item">
                    <k-input :textInput='"Tỷ lệ % được nhận:"' :isImportain="true"  @modelData ='order.service_id' :dataInput ='order.service_id'/>
                </div>
                <div class="k border-row-item">
                    <span class="k category-text-detail">Trạng thái đơn:<i class="warning-input">*</i></span>
                    <select2 v-model="order.service_id"  class="select2" :options="listOrders.map(e=>({id:e.id, text:e.name}))"></select2>
                </div>

              </div>


            </div>
        </ejs-dialog>
</template>
<script>
  export default{
    data(){
      return{
        order:{},
        listOrders:[],
        colums:[
          {
              fieldName: "code",
              headerText: "STT",
              width:'100'
          },
          {
              fieldName: "code",
              headerText: "Mã yêu cầu",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Tên KH",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Nội dung yêu cầu",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Đơn vị yêu cầu",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Người yêu cầu",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Manday",
              width:'100'
          },
          {
              fieldName: "code",
              headerText: "Thành tiên",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Giảm giá",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Vat",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Tổng tiền",
              width:'150'
          },
        ],
        listDatas:[{},{}]
      }
    }
  }

</script>
<style src="./OrderCreate.css" scoped></style>