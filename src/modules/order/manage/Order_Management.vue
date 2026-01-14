<template>
   <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k main-form">
          <div class="k form-filter">
            <span class="k txt-note">Trạng thái:</span>
            <div class="k form-select-order">
              <select2 v-model="status"  class="select2" :options="listTypes"></select2>
            </div>
            <span class="k txt-note">Từ ngày:</span>
            <div class="k form-select-order">
              <ejs-datetimepicker v-model="from_day" :value="from_day"  @change="onChangeFromDay($event)" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
            </div>
            <span class="k txt-note">Tới ngày:</span>
            <div class="k form-select-order">
              <ejs-datetimepicker v-model="to_day" :value="from_day"  @change="onChangeFromDay($event)" :format='"dd/MM/yyyy"'></ejs-datetimepicker>
            </div>
            <span class="k txt-note">Đơn vị:</span>
            <div class="k form-select-order">
              <select2 v-model="status"  class="select2" :options="listTypes"></select2>
            </div>
            <span class="k txt-note">Nhân sự:</span>
            <div class="k form-select-order">
              <select2 v-model="status"  class="select2" :options="listTypes"></select2>
            </div>

          </div>

          <div class="k tab-button">
            <button type="Submit" class="k btn btn-primary" @click="insertOrder()" > 
                <i class="fa fa-plus" aria-hidden="true"></i> Thêm mới
            </button>
            <button type="Submit" class="k btn btn-primary" @click="updateOrder()">
                <i class="fa fa-pencil" aria-hidden="true"></i> Điều chỉnh
            </button>
            <button type="Submit" class="k btn btn-primary" @click="deleteOrder()">
                <i class="fa fa-trash" aria-hidden="true"></i> Xóa
            </button>
            <button type="Submit" class="k btn btn-primary" @click="handleOrder()">
                <i class="fa fa-check" aria-hidden="true"></i> Xử lý
            </button>
              <button type="Submit" class="k btn btn-primary" @click="revenueFinacial()">
                <i class="fa fa-money" aria-hidden="true"></i> Đối soát
            </button>
          </div>
          <div class="card">
            <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listOrders"
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
          <dialog-order-create/>
        </div>
   </div>
</template>
<script>
  // import Order_ManagementApi from './Order_ManagementApi.js';
  import DialogOrderCreate from './create-order/OrderCreate.vue';
  export default {
    data() {
      return{
        header: {
          title: "Quản lý đơn đặt hàng",
          list: [],
        },
        status:1,
        listTypes:[{id:1,text:'Tạo mới'},{id:2,text:'Đơn vị đặt hàng xác nhận'},{id:3,text:'Đơn vị thực hiện xác nhận'},{id:4,text:'Đã kí'}],
        from_day: new Date(),
        to_day: new Date(),
        colums:[
          {
              fieldName: "code",
              headerText: "Mã yêu cầu",
              width:'100'
          },
          {
              fieldName: "code",
              headerText: "Dịch vụ",
          },
          {
              fieldName: "code",
              headerText: "Tên khách hàng",
          },
          {
              fieldName: "code",
              headerText: "Nội dung yêu cầu",
          },
          {
              fieldName: "code",
              headerText: "Đơn vị yêu cầu",
          },
          {
              fieldName: "code",
              headerText: "Người yêu cầu",
          },
          {
              fieldName: "code",
              headerText: "Tình trạng",
              width:'120'
          },
          {
              fieldName: "code",
              headerText: "Ngày kí đơn",
          },
          {
              fieldName: "code",
              headerText: "Manday",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Thành tiền",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Giảm giá",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "VAT",
              width:'150'
          },
          {
              fieldName: "code",
              headerText: "Tổng tiền",
          },
        ],
        listOrders:[{},{}],
         commands:[
            {
                name: 'viewOrder',
                cssClass: 'btn btn-main -ap one-eye',
                width: 40,
                text: '',
                title: 'Xem thông tin đơn hàng',
            },
            {
                name: 'downloaOrder',
                cssClass: 'btn btn-main -ap one-download',
                width: 40,
                text: '',
                title: 'Tải đơn hàng',
            },
        ],
      }
    },
    methods:{
      //Thêm mới
      async insertOrder(){

      },
      //Cập nhật đơn hàng
      async updateOrder(){

      },
      // Change from day
      onChangeFromDay(){

      }
    },
    components:{
      'dialog-order-create':DialogOrderCreate
    }
  }
</script>

<style src="./Order_Management.css" scoped></style>