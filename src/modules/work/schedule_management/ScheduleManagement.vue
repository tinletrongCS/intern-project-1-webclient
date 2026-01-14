<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w80 bold">Khách hàng</div>
              <div class="value">
                <select2 v-model="customer_selected" :options="customer_list" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w50 bold">Dịch vụ</div>
              <div class="value">
                <select2 v-model="service_selected" :options="service_list" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w50 bold">Presale</div>
              <div class="value">
                <select2 v-model="presale_selected" :options="presale_list" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w70 bold">Trạng thái</div>
              <div class="value">
                <select2 v-model="status_selected" :options="status_list" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-form">
        <div class="info-row">
          <div class="group-buttons -bottom">
            <button class="btn btn-success" style="min-width: 100px;" @click.prevent="confirmSchedule">
              <span class="icon fa fa-check"></span>&nbsp;Xác nhận
            </button>&nbsp;
            <button class="btn btn-info" style="min-width: 100px;" @click.prevent="approveSchedule">
              <span class="icon fa fa-thumbs-up"></span>&nbsp;Phê duyệt
            </button>&nbsp;
            <button class="btn btn-danger" style="min-width: 100px;" @click.prevent="rejectSchedule">
              <span class="icon fa fa-times"></span>&nbsp;Từ chối
            </button>
          </div>
        </div>
        <KDataGrid
          ref="scheduleGrid"
          :columns="columns"
          :dataSource="dataSource"
          :enable-paging-server="false"
          :allowPaging="true"
          :showFilter="false"
          :showColumnCheckbox="true"
          :enabledSelectFirstRow="false"
          :showSTT="true"
          :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleManagement",
  data() {
    return {
      header: {
        title: "Quản lý đặt lịch hẹn",
        list: []
      },
      customer_selected: 0,
      service_selected: 0,
      presale_selected: 0,
      status_selected: 0,
      customer_list: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'Công ty TNHH DKSH Việt Nam' },
        { id: 2, text: 'Công ty ABC' }
      ],
      service_list: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'VNPT Invoice' },
        { id: 2, text: 'VNPT Pay' }
      ],
      presale_list: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'Nguyễn Văn A' },
        { id: 2, text: 'Trần Thị B' }
      ],
      status_list: [
        { id: 0, text: 'Tất cả' },
        { id: 1, text: 'Chờ phê duyệt' },
        { id: 2, text: 'Đã xác nhận' },
        { id: 3, text: 'Đã phê duyệt' },
        { id: 4, text: 'Từ chối' }
      ],
      columns: [
        { fieldName: 'customer', headerText: 'Khách hàng', width: 180 },
        { fieldName: 'service', headerText: 'Dịch vụ', width: 120 },
        { fieldName: 'presale', headerText: 'Presale', width: 120 },
        { fieldName: 'room', headerText: 'Phòng', width: 120 },
        { fieldName: 'expectedRevenue', headerText: 'Doanh thu dự kiến', width: 140 },
        { fieldName: 'actualRevenue', headerText: 'Doanh thu thực hiện', width: 140 },
        { fieldName: 'conversionRate', headerText: 'Hệ quy đổi', width: 100 },
        { fieldName: 'convertedRevenue', headerText: 'Doanh thu quy đổi', width: 140 },
        { fieldName: 'costPercent', headerText: '% chi phí', width: 80 },
        { fieldName: 'totalCost', headerText: 'Chi phí tổng', width: 120 },
        { fieldName: 'scheduleDate', headerText: 'Ngày hẹn', width: 120 },
        { fieldName: 'projectRate', headerText: 'Tỷ lệ dự án', width: 100 },
        { fieldName: 'project', headerText: 'Dự án', width: 140 },
        { fieldName: 'status', headerText: 'Trạng thái', width: 120 }
      ],
      dataSource: [
        {
          customer: 'Công ty TNHH DKSH Việt Nam',
          service: 'VNPT Invoice',
          presale: 'Nguyễn Văn A',
          room: 'P.KHDN 1',
          expectedRevenue: '568.700.000',
          actualRevenue: '568.700.000',
          conversionRate: 40,
          convertedRevenue: '227.480.000',
          costPercent: 7,
          totalCost: '15.924.600',
          scheduleDate: '15/09/2025',
          projectRate: 20,
          project: 'Dự án giáo dục số',
          status: 'Chờ phê duyệt'
        }
      ]
    }
  },
  methods: {
    confirmSchedule() {
      this.$toast.success('Chức năng Xác nhận!');
    },
    approveSchedule() {
      this.$toast.success('Chức năng Phê duyệt!');
    },
    rejectSchedule() {
      this.$toast.success('Chức năng Từ chối!');
    }
  }
}
</script>