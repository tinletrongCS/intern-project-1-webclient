<template>
  <div class="main-wrapper" style="overflow-x: hidden;">
    <!-- <breadcrumb :header="header" /> -->
    <div class="breadcrumb-wrapper">
      <breadcrumb :header="header" />

      <div class="marquee">
        <span><i class="fa fa-bell-o"></i> Kính gửi Anh/Chị Người lao động! Đề nghị Anh/Chị thực hiện kiểm tra và phản
          hồi dữ liệu BSC của tháng trước ngày 03 hằng tháng. Sau ngày 03, hệ thống sẽ chốt số liệu BSC. Sau khi chốt,
          không thể điều chỉnh hoặc cập nhật lại kết quả. Kính mong Anh/Chị phối hợp thực hiện đúng thời hạn để đảm bảo
          tính chính xác của dữ liệu đánh giá. Trân trọng!</span>
      </div>
    </div>
    <div class="page-content" style="top: 35px !important;bottom: 45px;">
      <div class="box-form form-border-item">
        <div class="row">
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w100">Phòng ban</div>
              <div class="value">
                <select2 v-model='deparment_selected' :options="department_list" @select="loadUsersByDepartment"
                  :disabled="isStaff" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key bold w100">Nhân sự</div>
              <div class="value">
                <select2 v-model='user_selected' :options="userList" @select="onSearch" :disabled="isStaff" />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div style="margin-bottom: 5px !important;">
              <button @click="onSearch" class="btn btn-second">
                <span class="-ap icon-search"></span> Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="box-form form-border-item">
        <div class="row">
          <div class="col-md-3 col-12" style="margin: auto 0;">
            <div class="info-row">
              <div class="key bold w100">BSC Tháng</div>
              <div class="value">
                <ejs-datepicker v-model="month" format='MM/yyyy' :showClearButton='false' :allowEdit="false" locale="vi"
                  start="Year" depth="Year" @change="changeMonth" :firstDayOfWeek="1" />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12 kpi-list"></div>
          <div class="col-md-3 col-12">
            <div class="info-row">
              <div class="key bold" style="font-size: 27px !important; text-align: right;" @click="viewDetailBSC">Kết
                quả BSC: <span class="total-bsc">{{ totalBSC }}</span>
              </div>
            </div>
          </div>

          <div class="col-md-12 col-12">
            <KDataGrid ref="gridDsManagementBSC" :columns="columns" :dataSource="data_detail"
              :enable-paging-server="false" :allowPaging="false" :showFilter="false" :allowSorting="false"
              :showColumnCheckbox="false" :enabledSelectFirstRow="false" :selectionSettings="{ checkboxOnly: false }"
              @queryCellInfo="onQueryCellInfo" />
          </div>
        </div>
      </div>

      <div class="box-content" v-if="!!dataSource && !!dataSourceProject
        && Object.keys(dataSource).length
        && Object.keys(dataSourceProject).length">
        <!-- chỉ số cá nhân  -->
        <div class="row" style="margin: 0px !important;">
          <div class="col-md-12 col-12 kpi-list title-group" @click="toggleUser" :class="{ open: showUser }">
            <span>Chỉ số cá nhân</span>
            <i class="fa fa-chevron-right arrow-icon"></i>
            <!-- <span v-if="showUser">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.5 5l6.5 6 6.5-6H1.5z" />
              </svg>
            </span>

            <span v-else>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5 1.5l6 6-6 6V1.5z" />
              </svg>
            </span> -->
          </div>

          <div class="row user-container" v-show="showUser">

            <!-- 1 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc được giao</div>
                <div class="value detail" @click="ViewTaskDetail('tong_duoc_giao')">
                  {{ dataSource.tong_cong_viec || 0 }}
                </div>
              </div>
            </div>

            <!-- 2 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng số sao công việc mức độ quan trọng</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_sao_muc_do_quan_trong')">
                  {{ dataSource.tong_sao_muc_do_quan_trong || 0 }}
                </div>
              </div>
            </div>

            <!-- 3 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc quan trọng hoàn thành sớm hạn</div>
                <div class="value detail" @click="ViewTaskDetail('quan_trong_hoan_thanh_som_han')">
                  {{ dataSource.tong_cong_viec_quan_trong_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 4 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng lượt book PS</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_luot_book_ps')">
                  {{ dataSource.tong_luot_book_ps || 0 }}
                </div>
              </div>
            </div>

            <!-- 5 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng số sao công việc mức độ rất quan trọng</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_sao_muc_do_rat_quan_trong')">
                  {{ dataSource.tong_sao_muc_do_rat_quan_trong || 0 }}
                </div>
              </div>
            </div>

            <!-- 6 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc quan trọng hoàn thành trễ hạn</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('quan_trong_hoan_thanh_tre_han')">
                  {{ dataSource.tong_cong_viec_quan_trong_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 7 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc hoàn thành</div>
                <div class="value detail" @click="ViewTaskDetail('tong_hoan_thanh')">
                  {{ dataSource.cong_viec_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 8 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc hoàn thành đúng hạn</div>
                <div class="value detail" @click="ViewTaskDetail('hoan_thanh_dung_han')">
                  {{ dataSource.cong_viec_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 9 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc rất quan trọng hoàn thành</div>
                <div class="value detail" @click="ViewTaskDetail('rat_quan_trong')">
                  {{ dataSource.tong_cong_viec_rat_quan_trong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 10 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc chưa hoàn thành</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_cv_chua_hoan_thanh')">
                  {{ dataSource.cong_viec_chua_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 11 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc hoàn thành sớm hạn</div>
                <div class="value detail" @click="ViewTaskDetail('hoan_thanh_som_han')">
                  {{ dataSource.cong_viec_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 12 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc rất quan trọng hoàn thành đúng hạn</div>
                <div class="value detail" @click="ViewTaskDetail('rat_quan_trong_dung_han')">
                  {{ dataSource.tong_cong_viec_rat_quan_trong_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 13 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc chưa hoàn thành trễ hạn</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_cv_chua_hoan_thanh_tre_han')">
                  {{ dataSource.cong_viec_chua_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 14 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc hoàn thành trễ hạn</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('hoan_thanh_tre_han')">
                  {{ dataSource.cong_viec_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 15 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc rất quan trọng hoàn thành sớm hạn</div>
                <div class="value detail" @click="ViewTaskDetail('rat_quan_trong_hoan_thanh_som_han')">
                  {{ dataSource.tong_cong_viec_rat_quan_trong_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 16 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Quỹ thời gian tiêu chuẩn</div>
                <div class="kpi-value">
                  {{ dataSource.quy_thoi_gian_tieu_chuan || 0 }}
                </div>
              </div>
            </div>

            <!-- 17 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc bình thường hoàn thành</div>
                <div class="value detail" @click="ViewTaskDetail('binh_thuong_hoan_thanh')">
                  {{ dataSource.tong_cong_viec_binh_thuong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 18 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc rất quan trọng hoàn thành trễ hạn</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('rat_quan_trong_hoan_thanh_tre_han')">
                  {{ dataSource.tong_cong_viec_rat_quan_trong_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 19 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng thời gian giao</div>
                <div class="kpi-value">
                  {{ dataSource.tong_thoi_gian_giao || 0 }}
                </div>
              </div>
            </div>

            <!-- 20 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc bình thường hoàn thành đúng hạn</div>
                <div class="value detail" @click="ViewTaskDetail('binh_thuong_hoan_thanh_dung_han')">
                  {{ dataSource.tong_cong_viec_binh_thuong_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 21 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng số vi phạm</div>
                <div class="kpi-value">
                  {{ dataSource.tong_vi_pham || 0 }}
                </div>
              </div>
            </div>

            <!-- 22 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng thời gian thực hiện</div>
                <div class="kpi-value">
                  {{ dataSource.tong_thoi_gian_thuc_hien || 0 }}
                </div>
              </div>
            </div>

            <!-- 23 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc bình thường hoàn thành sớm hạn</div>
                <div class="value detail" @click="ViewTaskDetail('binh_thuong_hoan_thanh_som_han')">
                  {{ dataSource.tong_cong_viec_binh_thuong_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 24 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng số dự án tăng trưởng</div>
                <div class="kpi-value">
                  {{ dataSourceProject?.tong_du_an_tang_truong || 0 }}
                </div>
              </div>
            </div>

            <!-- 25 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng số sao định mức</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_diem_dinh_muc')">
                  {{ dataSource.tong_diem_dinh_muc || 0 }}
                </div>
              </div>
            </div>

            <!-- 26 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc bình thường hoàn thành trễ hạn</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('binh_thuong_hoan_thanh_tre_han')">
                  {{ dataSource.tong_cong_viec_binh_thuong_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 27 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng số dự án tham gia</div>
                <div class="kpi-value">
                  {{ dataSourceProject?.tong_du_an_tham_gia || 0 }}
                </div>
              </div>
            </div>

            <!-- 28 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng điểm chất lượng công việc hoàn thành</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_diem_chat_luong_cong_viec_hoan_thanh')">
                  {{ dataSource.tong_diem_chat_luong_cong_viec_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 29 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc quan trọng hoàn thành</div>
                <div class="value detail" @click="ViewTaskDetail('quan_trong_hoan_thanh')">
                  {{ dataSource.tong_cong_viec_quan_trong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 30 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng số lượng mốc thời gian dự án trễ hạn</div>
                <div class="kpi-value detail" @click="ViewPeriodProjectDetail('so_moc_tre_han')">
                  {{ dataSourceProject?.so_moc_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 31 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng công việc hoàn thành đánh giá chất lượng 1 sao</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_sao_thuc_hien_khong_hoan_thanh')">
                  {{ dataSource.tong_sao_thuc_hien_khong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 32 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng công việc quan trọng hoàn thành đúng hạn</div>
                <div class="value detail" @click="ViewTaskDetail('quan_trong_hoan_thanh_dung_han')">
                  {{ dataSource.tong_cong_viec_quan_trong_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 33 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70">+ Tổng số lượt khách hàng không hài lòng</div>
                <div class="kpi-value">
                  {{ dataSource.tong_khong_hai_long || 0 }}
                </div>
              </div>
            </div>

            <!-- 34 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70">+ Tổng số sao công việc mức độ bình thường</div>
                <div class="kpi-value detail" @click="ViewTaskDetail('tong_sao_muc_do_binh_thuong')">
                  {{ dataSource.tong_sao_muc_do_binh_thuong || 0 }}
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- chỉ số nhóm -->
        <div class="row group-section">
          <div class="col-md-12 col-12 kpi-list d-flex align-items-center title-group" @click="toggleGroup"
            :class="{ open: showGroup }">
            <span>Chỉ số nhóm</span>
            <i class="fa fa-chevron-right arrow-icon"></i>
            <!-- Icon -->
            <!-- <span v-if="showGroup">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.5 5l6.5 6 6.5-6H1.5z" />
              </svg>
            </span>

            <span v-else>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5 1.5l6 6-6 6V1.5z" />
              </svg>
            </span> -->
          </div>


          <div v-show="showGroup" class="row user-container">

            <!-- 1 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc được giao</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('tong_duoc_giao')">
                  {{ dataSourceGroup.tong_cong_viec_duoc_giao || 0 }}
                </div>
              </div>
            </div>

            <!-- 2 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng điểm chất lượng công việc hoàn thành</div>
                <div class="value kpi-value">
                  {{ dataSourceGroup.tong_diem_chat_luong_cong_viec_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 3 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc quan trọng hoàn thành</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('quan_trong_hoan_thanh')">
                  {{ dataSourceGroup.tong_cong_viec_quan_trong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 4 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc hoàn thành</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('tong_hoan_thanh')">
                  {{ dataSourceGroup.tong_cong_viec_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 5 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc hoàn thành đúng hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('hoan_thanh_dung_han')">
                  {{ dataSourceGroup.cong_viec_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 6 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc quan trọng hoàn thành đúng hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('quan_trong_hoan_thanh_dung_han')">
                  {{ dataSourceGroup.tong_cong_viec_quan_trong_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 7 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70 kpi-label">+ Tổng công việc chưa hoàn thành</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('tong_cv_chua_hoan_thanh')">
                  {{ dataSourceGroup.cong_viec_chua_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 8 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc hoàn thành sớm hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('hoan_thanh_som_han')">
                  {{ dataSourceGroup.cong_viec_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 9 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc quan trọng hoàn thành sớm hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('quan_trong_hoan_thanh_som_han')">
                  {{ dataSourceGroup.tong_cong_viec_quan_trong_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 10 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70 kpi-label">+ Tổng công việc chưa hoàn thành trễ hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('tong_cv_chua_hoan_thanh_tre_han')">
                  {{ dataSourceGroup.cong_viec_chua_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 11 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70 kpi-label">+ Tổng công việc hoàn thành trễ hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('hoan_thanh_tre_han')">
                  {{ dataSourceGroup.cong_viec_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 12 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70 kpi-label">+ Tổng công việc quan trọng hoàn thành trễ hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('quan_trong_hoan_thanh_tre_han')">
                  {{ dataSourceGroup.tong_cong_viec_quan_trong_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 13 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Quỹ thời gian tiêu chuẩn</div>
                <div class="kpi-value">
                  {{ dataSourceGroup.quy_thoi_gian_tieu_chuan || 0 }}
                </div>
              </div>
            </div>

            <!-- 14 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc bình thường hoàn thành</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('binh_thuong_hoan_thanh')">
                  {{ dataSourceGroup.tong_cong_viec_binh_thuong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 15 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc rất quan trọng hoàn thành</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('rat_quan_trong')">
                  {{ dataSourceGroup.tong_cong_viec_rat_quan_trong_hoan_thanh || 0 }}
                </div>
              </div>
            </div>

            <!-- 16 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng thời gian giao</div>
                <div class="kpi-value">
                  {{ dataSourceGroup.tong_thoi_gian_giao || 0 }}
                </div>
              </div>
            </div>

            <!-- 17 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc bình thường hoàn thành đúng hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('binh_thuong_hoan_thanh_dung_han')">
                  {{ dataSourceGroup.tong_cong_viec_binh_thuong_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 18 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc rất quan trọng hoàn thành đúng hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('rat_quan_trong_dung_han')">
                  {{ dataSourceGroup.tong_cong_viec_rat_quan_trong_hoan_thanh_dung_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 19 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng thời gian thực hiện</div>
                <div class="kpi-value">
                  {{ dataSourceGroup.tong_thoi_gian_thuc_hien || 0 }}
                </div>
              </div>
            </div>

            <!-- 20 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc bình thường hoàn thành sớm hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('binh_thuong_hoan_thanh_som_han')">
                  {{ dataSourceGroup.tong_cong_viec_binh_thuong_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 21 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng công việc rất quan trọng hoàn thành sớm hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('rat_quan_trong_hoan_thanh_som_han')">
                  {{ dataSourceGroup.tong_cong_viec_rat_quan_trong_hoan_thanh_som_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 22 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card">
                <div class="key bold w_70 kpi-label">+ Tổng điểm định mức</div>
                <div class="kpi-value">
                  {{ dataSourceGroup.tong_diem_dinh_muc || 0 }}
                </div>
              </div>
            </div>

            <!-- 23 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70 kpi-label">+ Tổng công việc bình thường hoàn thành trễ hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('binh_thuong_hoan_thanh_tre_han')">
                  {{ dataSourceGroup.tong_cong_viec_binh_thuong_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

            <!-- 24 -->
            <div class="col-md-4 col-12 kpi-list">
              <div class="info-row kpi-card overdue">
                <div class="key bold w_70 kpi-label">+ Tổng công việc rất quan trọng hoàn thành trễ hạn</div>
                <div class="value detail kpi-value" @click="ViewTaskGroupDetail('rat_quan_trong_hoan_thanh_tre_han')">
                  {{ dataSourceGroup.tong_cong_viec_rat_quan_trong_hoan_thanh_tre_han || 0 }}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
    <ViewTaskDetailModal ref="viewTaskDetailModal" :month_request="monthSelect" :user_id_request="user_selected"
      :type_request="typeSelect" />
    <ViewPeriodProjectDetailModal ref="viewPeriodProjectDetailModal" :month_request="monthSelect" :user_id_request="user_selected"
      :type_request="typeSelect" />
    <ViewTaskGroupDetailModal ref="viewTaskGroupDetailModal" :month_request="monthSelect"
      :user_id_request="user_selected" :type_request="typeSelect" />
  </div>
</template>

<script>
import moment from 'moment'
import ReportAPI from './API.js'
import ViewTaskDetailModal from './ViewTaskDetailModal.vue'
import ViewPeriodProjectDetailModal from './ViewPeriodProjectDetailModal.vue'
import ViewBscDetailModal from './ViewBscDetailModal.vue'
import ViewTaskGroupDetailModal from './ViewTaskGroupDetailModal.vue'
export default {
  name: 'PersonalBSCScores',
  components: {
    ViewTaskDetailModal,
    ViewBscDetailModal,
    ViewTaskGroupDetailModal,
    ViewPeriodProjectDetailModal
  },
  data() {
    return {
      header: {
        title: "BSC cá nhân",
        list: []
      },
      // Filter variables
      departmentId: 0,
      user_selected: 0,
      month: moment().startOf('month').format('MM/YYYY'),
      // Options lists
      unit_list: [
        { id: 0, text: 'Tất cả' }
      ],
      person_list: [
        { id: 0, text: 'Tất cả' }
      ],

      dataSource: {},
      dataSourceGroup: {},
      monthSelect: '',
      typeSelect: '',
      dataBSC: [],
      data_detail: [],
      totalBSC: 0,
      department_list: [],
      infoAccountLogin: null,
      columns: [
        {
          fieldName: 'stt',
          headerText: 'STT',
          allowFiltering: true,
          width: '30',
          textAlign: 'center'
        },
        {
          fieldName: 'field_name',
          headerText: 'Chỉ số',
          allowFiltering: true,
          width: '70'
        },
        {
          fieldName: 'tlht',
          headerText: 'TLHT (%)',
          allowFiltering: true,
          width: '30'
        },
        {
          fieldName: 'result',
          headerText: 'Kết quả',
          allowFiltering: true,
          width: '30'
        },
        {
          fieldName: 'calculation_formula',
          headerText: 'Công thức/ Cách đo lường',
          allowFiltering: true,
          // width: '120'
        }
      ],
      dataSourceProject: {},
      showGroup: false,
      showUser: true
    }
  },

  computed: {

  },

  watch: {

  },

  async mounted() {
    await this.loadAccountInfo();
    // if(this.infoAccountLogin?.department_id){
    //   await getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
    // }
    await this.loadDepartments();
    // this.isStaff = this.infoAccountLogin?.jobposition_id == this.NhanVienJobPositionId
    await this.CheckManagerAdmin()

    // 🔥 1. lấy userId từ query
    const queryUserId = Number(this.$route.query.userId || 0);
    const queryMonth = this.$route.query.month || null

    const loginDeptId = this.infoAccountLogin?.department_id;
    const loginUserId = this.infoAccountLogin?.user_id;

    // 🔥 2. ưu tiên userId từ query
    const targetUserId = queryUserId || loginUserId;

    // 🔥 nếu có month → gán
    if (queryMonth) {
      this.month = queryMonth   // format MM/YYYY
    }

    if (loginDeptId) {
      this.deparment_selected = loginDeptId;

      // load user theo phòng ban
      await this.loadUsersByDepartment();

      // 🔥 3. nếu userId tồn tại trong list → gán
      if (targetUserId && this.userList.some(u => u.id === targetUserId)) {
        this.user_selected = targetUserId;
      }

      // 🔥 4. load toàn bộ dữ liệu BSC
      await this.onSearch();
    }
  },

  methods: {
    async loadUsersByDepartment() {
      const deptId = this.deparment_selected;
      if (!deptId) return;

      const data = await this.handleApiCall(
        () => ReportAPI.getUsersByDepartment(this.axios, deptId),
        'Không có dữ liệu nhân sự',
        'Lỗi khi lấy danh sách nhân sự'
      );
      if (Array.isArray(data)) {
        this.userList = data;
        this.user_selected = this.userList.length > 0 ? this.userList[0].id : 0;
      }
      this.bscList = []
    },
    async loadDepartments() {
      try {
        const res = await ReportAPI.GetMyDepartmentTree(this);

        const data =
          res?.data?.data ||
          res?.data ||
          (Array.isArray(res) ? res : []);

        if (Array.isArray(data) && data.length > 0) {
          this.department_list = data.map(d => ({
            id: d.department_id ?? d.id,
            text: d.name ?? d.text ?? '---',
          }));

          // this.departments.unshift({ id: -1, text: 'Tất cả' });
        } else {
          this.departments = [];
          this.$toast?.warning?.('Không có dữ liệu phòng ban.');
        }
      } catch (error) {
        console.error('Không thể tải danh sách phòng ban:', error);
        this.$toast?.error?.('Lỗi khi tải danh sách phòng ban.');
      }
    },
    loading(show) {
      this.$root.showLoading(show)
    },
    async onSearch() {
      await Promise.all([
        this.loadData(),
        this.loadDataGroup(),
        this.GetProjectUserOfOneMonth(),
        this.GetBscUserOfOneMonth()
      ])
    },
    async loadInitialData() {
      this.loading(true);
      try {
        // const unitsResult = await ReportAPI.GetMyDepartmentTree(this);
        // this.unit_list = [{ id: 0, text: 'Tất cả' }, ...unitsResult];
        await this.loadUsersForSelectedUnit(0);
        await this.loadData();
        await this.loadDataGroup();
      } catch (error) {
        this.$toast.error('Lỗi khi tải dữ liệu khởi tạo.');
      } finally {
        this.loading(false);
      }
    },
    changeMonth(event) {
      const newStart = moment(event.value);

      // Gán lại ngày bắt đầu
      this.month = newStart.format("MM/YYYY");
      this.onSearch()
    },
    async loadUsersForSelectedUnit(departmentId) {
      this.loading(true);
      this.user_selected = 0;
      try {
        const usersResult = await ReportAPI.GetUsersByDepartment(this, departmentId);
        this.person_list = [{ id: 0, text: 'Tất cả' }, ...usersResult];
      } catch (error) {
        this.$toast.error('Lỗi khi tải danh sách người nhận.');
      } finally {
        this.loading(false);
      }
    },
    async loadData() {
      this.loading(true);
      this.dataSource = {};
      try {
        // const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
        const params = {
          user_selected: this.user_selected,
          from_month: moment(this.month, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY'),
          to_month: moment(this.month, 'MM/YYYY').add(1, 'month').startOf('month').format('YYYY-MM-DD')
        };

        const result = await ReportAPI.GetPersonalBSCScores(this, params);
        if (result && result.success) {
          this.dataSource = result.data && result.data != "[]" ? JSON.parse(result.data) : {};
        } else {
          this.$toast.error(result.message || 'Không tải được dữ liệu báo cáo.');
        }
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi tải dữ liệu báo cáo.');
        this.dataSource = {};
      } finally {
        this.loading(false);
      }
    },
    async loadDataGroup() {
      this.loading(true);
      this.dataSourceGroup = {};
      try {
        // const month = moment(this.tu_thang, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY');
        const params = {
          user_selected: this.user_selected,
          from_month: moment(this.month, ['MM/YYYY', 'YYYY-MM-DD']).format('MM/YYYY'),
          to_month: moment(this.month, 'MM/YYYY').add(1, 'month').startOf('month').format('YYYY-MM-DD')
        };

        const result = await ReportAPI.GetGroupBSCScores(this, params);
        if (result && result.success) {
          this.dataSourceGroup = result.data && result.data != "[]" ? JSON.parse(result.data) : {};
        } else {
          this.$toast.error(result.message || 'Không tải được dữ liệu báo cáo.');
        }
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi tải dữ liệu báo cáo.');
        this.dataSourceGroup = {};
      } finally {
        this.loading(false);
      }
    },
    ViewTaskDetail(typeRequest) {
      this.typeSelect = typeRequest
      this.monthSelect = this.month
      this.$refs.viewTaskDetailModal.showModal()
    },
    ViewPeriodProjectDetail(typeRequest) {
      this.typeSelect = typeRequest
      this.monthSelect = this.month
      this.$refs.viewPeriodProjectDetailModal.showModal()
    },
    ViewTaskGroupDetail(typeRequest) {
      this.typeSelect = typeRequest
      this.monthSelect = this.month
      this.$refs.viewTaskGroupDetailModal.showModal()
    },
    async GetBscUserOfOneMonth() {
      try {
        if (this.user_id_request == 0) return this.$toast.error('Vui lòng chọn Nhân sự!');
        let response = await ReportAPI.GetBscUserOfOneMonth(this.axios, {
          month: this.month,
          assignee_id: this.user_selected
        })
        if (response.data.success) {
          if (response.data.data) {
            var data = JSON.parse(response.data.data);
            // this.dataBSC = data?.details.concat([])
            this.dataBSC = data[0]?.details ?? [];
            this.data_detail = this.dataBSC
            this.totalBSC = data[0]?.bsc ?? 0;
          }
          else {
            this.dataBSC = []
            this.data_detail = []
            this.totalBSC = 0;
          }
        } else {
          this.$toast.error(response.data.message);
        }
      } catch (e) {
        this.$toast.error(e.message);
      }
    },
    viewDetailBSC() {
      this.monthSelect = this.month
      this.$refs.viewBscDetailModal.showModal()
    },
    async loadAccountInfo() {
      const user_selected = this.$_root.token.getUserId();
      const data = await this.handleApiCall(
        () => ReportAPI.getAccountByUser(this.axios, user_selected),
        'Không có dữ liệu tài khoản',
        'Không thể tải thông tin tài khoản'
      );
      if (data) {
        this.infoAccountLogin = data;
        // if (this.infoAccountLogin?.department_id) {
        //   await this.getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
        // }
      }
    },
    async handleApiCall(apiFunc, successMsg, errorMsg) {
      try {
        const res = await apiFunc();
        if (res?.data?.success) return res.data.data;
        this.$toast?.warning?.(res?.data?.message || successMsg || 'Không có dữ liệu');
      } catch (err) {
        console.error(errorMsg, err);
        this.$toast?.error?.(errorMsg || 'Lỗi kết nối máy chủ');
      }
      return null;
    },
    async GetProjectUserOfOneMonth() {
      this.dataSourceProject = {}
      try {
        if (this.user_id_request == 0) return this.$toast.error('Vui lòng chọn Nhân sự!');
        let result = await ReportAPI.GetProjectUserOfOneMonth(this.axios, {
          month: this.month,
          assignee_id: this.user_selected
        })
        // if (response.data.success) {
        //   if (response.data.data) {
        //     this.dataSourceProject = result.data && result.data != "[]" ? JSON.parse(result.data)[0] : {};
        //   }
        //   else {
        //     // this.dataBSC = []
        //   }
        // } else {
        //   this.$toast.error(response.data.message);
        // }
        if (result && result.data.success) {
          this.dataSourceProject = result.data.data && result.data.data != "[]" ? JSON.parse(result.data.data)[0] : {};
        } else {
          this.$toast.error(result.message || 'Không tải được dữ liệu dự án.');
        }
      } catch (e) {
        this.dataSourceProject = {}
        this.$toast.error(e.message);
      }
    },
    onQueryCellInfo(args) {
      if (args.column.field === 'result') {
        const val = Number(args.data.result);
        if (!isNaN(val) && val < 0) {
          args.cell.style.color = 'red';
          args.cell.style.fontWeight = '600';
        }
      }
    },
    async CheckManagerAdmin() {
      const userId = this.$_root.token.getUserId();
      const data = await this.handleApiCall(
        () => ReportAPI.CheckManagerAdmin(this.axios, userId),
        'Không có dữ liệu tài khoản',
        'Không thể tải thông tin tài khoản'
      );
      this.isStaff = data == 'True' ? false : true
      // if (data) {
      //   // this.infoAccountLogin = data;
      //   // if (this.infoAccountLogin?.department_id) {
      //   //   await this.getDepartmentByDepartmentIdLogin(this.infoAccountLogin?.department_id)
      //   // }
      // }
    },
    toggleGroup() {
      this.showGroup = !this.showGroup;
    },
    toggleUser() {
      this.showUser = !this.showUser;
    }
  }
}
</script>
<!-- <style src="./PersonalBSCScores.css" scoped></style> -->

<style scoped>
.box-content {
  font-size: 18px;
}

.box-content .value {
  padding-top: 6px;
  font-weight: 600;
}

.detail {
  color: #0d6efd;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 700 !important;
  font-size: 16px;
}

.w_70 {
  width: 70% !important;
}

.kpi-list .kpi-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
  font-size: 16px;
  flex: 1;
}

.kpi-list {
  display: flex;
}

.kpi-card .kpi-label {
  font-weight: 600;
  color: #333;
}

.kpi-card .kpi-value {
  font-weight: 700;
  font-size: 16px;
  color: #0d6efd;
}

/* Màu đỏ cho KPI trễ hạn */
.kpi-card.overdue {
  border-left-color: #dc3545;
}

.kpi-card.overdue .kpi-value {
  color: #dc3545;
}

.breadcrumb-wrapper {
  position: relative;
}

.marquee {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 300px;
  white-space: nowrap;
  overflow: hidden;
  /* max-width: 400px; */
}

.marquee span {
  display: inline-block;
  animation: marquee 45s linear infinite;
  color: #dc3545;
  font-size: 16px;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.total-bsc {
  color: red !important;
}

.kpi-card.overdue {
  border-left-color: #dc3545;
}

.kpi-card.overdue .kpi-value {
  color: #dc3545;
}

/* .title-group {
  color: #333;
  font-weight: 700;
  cursor: pointer;
  font-size: 25px;
} */
.title-group {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  padding: 10px 12px;
  font-size: 17px;
  border-bottom: 1px solid #e5e5e5;
  user-select: none;
}

.title-group:hover {
  background-color: #f7f7f7;
}

.title-group svg {
  width: 16px;
  height: 16px;
  transition: transform 0.25s ease;
}

/* Khi mở -> quay icon xuống */
/* .title-group.open svg {
  transform: rotate(180deg);
} */

.arrow-icon {
  font-size: 17px;
  transition: transform 0.25s ease;
  margin-left: 10px;
}

/* Khi mở -> xoay xuống */
.title-group.open .arrow-icon {
  transform: rotate(90deg);
}

.user-container {
  padding: 10px;
  border-radius: 10px;
  border: 2px solid rgb(186, 231, 255);
  margin: 0px !important;
  margin-top: 5px !important;
}

.group-section {
  margin: 0px !important;
  margin-top: 15px !important;
}
</style>