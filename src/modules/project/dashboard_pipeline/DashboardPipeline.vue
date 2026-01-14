<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="page-content" style="top: 46px !important; bottom: 40px !important;">
      <!-- <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w80 bold">Trung tâm</div>
              <div class="value">
                <select2 
                  v-model='center_selected'
                  :options="center_list"
                  @select="onCenterChange"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w80 bold">Phòng ban</div>
              <div class="value">
                <select2 
                  v-model='deparment_selected'
                  :options="department_list"
                  @select="onDeparmentChange"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w140 bold">Nhóm sản phẩm</div>
              <div class="value">
                <select2 
                  v-model='group_selected'
                  :options="group_list"
                  @select="onGroupChange"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-2 col-12">
            <div class="info-row">
              <div class="key w140 bold">Vai trò</div>
              <div class="value">
                <select2 
                  v-model='status_selected'
                  :options="status_list"
                  @select="onStatusChange"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
              <div class="key w140 bold">Trạng thái dự án</div>
              <div class="value">
                <select2 
                  v-model='status_selected'
                  :options="status_list"
                  @select="onStatusChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="row">
        <div class="box-form">
          <div class="row">
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w60 bold">Đơn vị</div>
                <div class="value">
                  <select2 
                    v-model='deparment_selected'
                    :options="department_list"
                    @select="onFilterChange"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key w60 bold">Vai trò</div>
                <div class="value">
                  <select2 
                    v-model='role_selected'
                    :options="role_list"
                    @select="onFilterChange"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-4 col-12">
              <div class="info-row">
                <div class="key bold">Trạng thái dự án</div>
                <div class="value">
                  <select2 
                    v-model='project_status_selected'
                    :options="project_status_list"
                    @select="onFilterChange"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Biểu đồ thống kê số lượng dự án tham gia theo từng nhân sự -->
          <div class="mt-3 chart-container">
            <!-- Title cố định -->
            <h6 class="chart-title">{{ projectStaffTitle }}</h6>
            
            <!-- Legend cố định -->
            <div class="chart-legend-container">
              <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
                <div class="legend-color" :style="{backgroundColor: item.color}"></div>
                <span class="legend-text">{{ item.name }}</span>
              </div>
            </div>
            
            <!-- Vùng scroll chỉ chứa biểu đồ (không có legend) -->
            <div class="chart-scroll-wrapper">
              <div id="projectStaffChart" :style="chartContainerStyle"></div>
            </div>
            <div id="yAxisChart" class="yaxis-chart-container"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <!-- Heatmap mức độ thân thiết của khách hàng -->
        <div class="box-form heatmap-dashboard">
          <div class="row">
              <div class="key bold mb-3">Heatmap mức độ thân thiết của khách hàng</div>
          </div>
          <div class="row no-gutters">
            <div 
              class="col-lg-1 col-md-2 col-sm-3 col-4 flex" 
              v-for="item in customerHeatmapData" 
              :key="item.id"
            >
              <div 
                class="whole-cell" 
                :style="{backgroundColor: item.color}"
                @click="onHeatmapCellClick(item, 'customer')"
              >
                <div class="item-name">
                  <span>{{ item.name }}</span>
                </div>
                <div class="item-cnt">
                  <strong>{{ item.count }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="client-detail">
            <div>Cao nhất</div>
            <div v-for="(color, index) in colorChart" :key="index">
              <div :style="{backgroundColor: color}" class="color"></div>
            </div>
            <div>Thấp nhất</div>
          </div>
        </div>
      </div>
      <div class="row">
        <!-- Heatmap theo nhóm SPDV -->
        <div class="box-form heatmap-dashboard">
          <div class="row">
              <div class="key bold mb-3">Heatmap theo nhóm SPDV (Sản phẩm dịch vụ)</div>
          </div>
          <div class="row no-gutters">
            <div 
              class="col-lg-1 col-md-2 col-sm-3 col-4 flex" 
              v-for="item in serviceHeatmapData" 
              :key="item.id"
            >
              <div 
                class="whole-cell" 
                :style="{backgroundColor: item.color}"
                @click="onHeatmapCellClick(item, 'service')"
              >
                <div class="item-name">
                  <span>{{ item.name }}</span>
                </div>
                <div class="item-cnt">
                  <strong>{{ item.count }}</strong>
                </div>
              </div>
            </div>
          </div>
          <div class="client-detail">
            <div>Cao nhất</div>
            <div v-for="(color, index) in colorChart" :key="index">
              <div :style="{backgroundColor: color}" class="color"></div>
            </div>
            <div>Thấp nhất</div>
          </div>
        </div>
      </div>
      <!-- Pie Charts Row -->
      <div class="row">
        <div class="col-md-6 col-12 pl-0">
          <div class="box-form">
            <div class="row">
              <div class="col-md-6">
                <div id="projectValuePieChart" style="height: 400px; width: 100%;"></div>
              </div>
              <div class="col-md-6">
                <div class="statistics-panel">
                    <h6 class="statistics-title">Tổng giá trị</h6>
                    <div class="total-value">{{ formatCurrency(valueStats.total) }}</div>
                    <div class="statistics-list">
                        <div class="stat-item">
                            <span class="stat-label">Dự án đúng tiến độ</span>
                            <span class="stat-value">{{ formatCurrency(valueStats.ongoing) }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Dự án hoàn thành</span>
                            <span class="stat-value">{{ formatCurrency(valueStats.completed) }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Dự án tạm ngưng</span>
                            <span class="stat-value">{{ formatCurrency(valueStats.paused) }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Dự án trễ tiến độ</span>
                            <span class="stat-value">{{ formatCurrency(valueStats.outdated) }}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-12 pr-0">
          <div class="box-form">
            <div class="row">
              <div class="col-md-6">
                <div id="projectProgressPieChart" style="height: 400px; width: 100%;"></div>
              </div>
              <div class="col-md-6">
                <div class="statistics-panel">
                    <h6 class="statistics-title">Tổng số dự án</h6>
                    <div class="total-value">{{ progressStats.total }}</div>
                    <div class="statistics-list">
                        <div class="stat-item">
                            <span class="stat-label">Dự án đúng tiến độ</span>
                            <span class="stat-value">{{ progressStats.ongoing }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Dự án hoàn thành</span>
                            <span class="stat-value">{{ progressStats.completed }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Dự án tạm ngưng</span>
                            <span class="stat-value">{{ progressStats.paused }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Dự án trễ tiến độ</span>
                            <span class="stat-value">{{ progressStats.outdated }}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Biểu đồ dự kiến doanh thu theo năm chưa VAT -->
      <div class="row">
        <div class="box-form">
          <div class="info-row col-2 right">
              <div class="key w60 bold">Năm</div>
              <div class="value">
                  <div class="select-custom">
                  <select v-model="year_selected" @change="handleYearChange"  class="form-control">
                    <option v-for="y in years" :key="y.value" :value="y.value">
                      {{ y.text }}
                    </option>
                  </select>
                  </div>
              </div>
          </div>
          <div id="revenueBarChart" style="height: 500px; width: 100%;"></div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <ejs-dialog
        :allowDragging="true"
        :visible="showProjectListModal"
        :position="{X:'center', Y:'top'}"
        ref="popupProjectList"
        :showCloseIcon="true"
        width="90%"
        :isModal='true'
        target=".main-wrapper"
        :header="modalProjectListTitle"
        @close="onModalClose">
        <div class="modal-content popup-box">
          <div class="popup-body">
            <div class="mb-3" v-if="!isRevenueChartModal">
              <button class="btn btn-second" @click.prevent="editProject()">
                  <span class="icon one-edit"></span>&nbsp;Điều chỉnh
              </button>&nbsp;
              <button class="btn btn-second" @click.prevent="deleteProject()">
                  <span class="icon one-trash"></span>&nbsp;Xóa
              </button>&nbsp;
              <button class="btn btn-second" @click.prevent="viewMembers()">
                  <span class="icon fa fa-users"></span>&nbsp;Thành viên
              </button>&nbsp;
              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="approveProject()">
                <span class="icon fa fa-check"></span>&nbsp;Phê duyệt
              </button>&nbsp;
              <button class="btn btn-second" style="min-width: 100px;" @click.prevent="closeProject()">
                  <span class="icon fa" :class="getIsLocked(row_selected) ? 'fa-unlock' : 'fa-lock'"></span>
                  &nbsp;{{ toggleLockText }}
              </button>&nbsp;
            </div>
                <KDataGrid
                    :columns="modalProjectListColumns"
                    :dataSource="modalProjectListData"
                    :allowPaging="true"
                    :enable-paging-server="false"
                    :showFilter="true"
                    :showSTT="true"
                    @rowSelected="onPopupRowSelected"
                    @rowDoubleClicked="onPopupRowDoubleClicked"
                />
                <!-- Hiển thị tổng doanh thu nếu là modal doanh thu -->
                <div v-if="isRevenueChartModal" class="right">
                  <div class="total-revenue-display">
                    <strong>Tổng cộng: {{ formatCurrency(totalModalRevenue) }} (VNĐ)</strong>
                  </div>
                </div>
          </div>
        </div>
    </ejs-dialog>
    <ProjectModal
      ref="projectModal"
      :isAdd="is_add_new"
      :isViewDetail="is_view_detail"
      :data="row_selected" 
      :canApproveAmount="canUserApproveAmount"
      :projectTypesList="all_project_types"
      :customersList="all_customers"
      :customerTypesList="all_customer_types"
      :vnptUnitsList="all_vnpt_units"
      :promotionUnitsList="all_promotion_units"
      :developmentUnitsList="all_development_units"
      :usersList="all_users"
      :servicesList="all_services"
      @successProject="onActionSuccess"
    />
    <ProjectMembersModal
      ref="membersModal"
      :projectData="row_selected"
      @successMembers="onActionSuccess"
    />
  </div>
</template>
<script>
import moment from 'moment'
import API from './DashboardPipelineAPI'
import ProjectAPI from '../pipeline/ProjectAPI';
import ProjectModal from '../pipeline/popups/ProjectModal.vue';
import ProjectMembersModal from '../pipeline/popups/ProjectMembersModal.vue';
import {
  Chart,
  Legend,
  Category,
  DataLabel,
  Tooltip,
  StackingBarSeries,
  BarSeries,
  PieSeries,
  Zoom,
  ScrollBar,
  AccumulationChart,
  AccumulationLegend,
  AccumulationDataLabel,
  AccumulationTooltip,
} from '@syncfusion/ej2-charts';

export default {
  name: 'DashboardPipeline',
  components: {
      ProjectModal,
      ProjectMembersModal
    },
  data(){
    return {
      header: {
          title: "Dashboard Pipeline",
          list: [
          ],
      },
      deparment_selected:0,
      department_list:[
        {
          id:0,
          text:'Tất cả'
        }
      ],
      role_selected:1,
      role_list: [
        {
          id: 0,
          text: 'Tất cả'
        }
      ],
      project_status_selected: 1,
      project_status_list: [
        { id: 0, text: "Tất cả" },
        { id: 1, text: "Dự án đang hoạt động" },
        { id: 2, text: "\u00A0\u00A0\u00A0Dự án đúng tiến độ" },
        { id: 3, text: "\u00A0\u00A0\u00A0Dự án trễ tiến độ" },
        { id: 4, text: "Dự án không hoạt động" },
        { id: 5, text: "\u00A0\u00A0\u00A0Dự án tạm ngưng" },
        { id: 6, text: "\u00A0\u00A0\u00A0Dự án hoàn thành" },
      ],
      years: this.generateYears(),
      year_selected: 0,

      // Dữ liệu cho biểu đồ thống kê dự án theo nhân sự
      projectStaffTitle: "Biểu đồ thống kê số lượng dự án tham gia theo từng nhân sự",
      projectStaffXAxis: {
        valueType: "Category",
      },
      projectStaffYAxis: {
        labelFormat: '{value}',
      },
      projectStaffMarker: {
          dataLabel: { 
          visible: true,
          position: 'Middle',
          template: '<div>${if(point.y > 0)}<span>${point.y}</span>${/if}</div>'
        }
      },
      projectStaffData: [],
      projectStaffChartKey: 0,
      chartInstance: null,
      showProjectListModal: false,
      modalProjectListData: [],
      modalProjectListTitle: '',
      isRevenueChartModal: false,
      modalProjectListColumns: [
        {
          fieldName: 'projectName',
          headerText: 'Tên dự án',
          width: '250'
        },
        {
          fieldName: 'customerName',
          headerText: 'Khách hàng',
          width: '200'
        },
        {
          fieldName: 'projectType',
          headerText: 'Loại dự án',
          width: '350'
        },
        {
          fieldName: 'value',
          headerText: 'Giá trị chưa VAT (VNĐ)',
          width: '200',
          type: 'number',
          format: {format: 'N0',useGrouping: true,minimumFractionDigits: 0,maximumFractionDigits: 0}
        },
        {
          fieldName: 'productService',
          headerText: 'Sản phẩm dịch vụ',
          width: '180'
        },
        { 
          fieldName: 'signDate', 
          headerText: 'Ngày ký', 
          width: '120', 
          textAlign: 'Center',
          type: 'date',
          format: 'dd/MM/yyyy'
        },
        {
          fieldName: 'statusText',
          headerText: 'Trạng thái',
          width: '150',
          textAlign: 'Center'
        }
      ],
      is_add_new: false,
      is_view_detail: true,
      row_selected: {},
      canUserApproveAmount: false,
      all_project_types: [],
      all_customers: [],
      all_customer_types: [],
      all_vnpt_units: [],
      all_promotion_units: [],
      all_development_units: [],
      all_users: [],
      all_services: [],
      detail_data_sources: [],

      // Mảng màu cho heatmap
      colorChart: ['#0066CC', '#318CE7', '#0FC0FC', '#80DAEB', '#87CEEB'],
      // Dữ liệu cho heatmap khách hàng
      customerHeatmapData: [],
      // Dữ liệu cho heatmap service
      serviceHeatmapData: [],
      
      // Dữ liệu cho pie chart giá trị dự án
      projectValueData: [],
      projectValueChartInstance: null,
      valueStats: {},
      // Dữ liệu cho pie chart tiến độ
      projectProgressData: [],
      projectProgressChartInstance: null,
      progressStats: {},
      
      // Dữ liệu cho bar chart doanh thu theo năm
      allRevenueData: [],
      revenueData: [],
      revenueChartInstance: null,
      
      // Dữ liệu cho legend
      legendItems: [
        { name: 'Đúng tiến độ', color: '#41C2F4' },
        { name: 'Trễ tiến độ', color: '#D3D3D3' },
        { name: 'Hoàn thành', color: '#14AE49' },
        { name: 'Tạm ngưng', color: '#C1D015' }
      ],
    }
  },
  computed:{
    toggleLockText() {
        if (this.getIsLocked(this.row_selected)) {
            return "Mở khóa dự án";
        }
        return "Đóng dự án";
    },
    totalModalRevenue() {
      if (!this.modalProjectListData || this.modalProjectListData.length === 0) {
        return 0;
      }
      return this.modalProjectListData.reduce((sum, item) => {
        return sum + (item.revenueAmount || 0);
      }, 0);
    },
    chartContainerStyle() {
      const dataLength = this.projectStaffData ? this.projectStaffData.length : 0;
      const minHeight = Math.max(dataLength * 60, 500);
      return {
        height: `${minHeight}px`,
        width: '100%'
      };
    },
  },
  methods:{
    // Trick để khởi tạo modal DOM ngay từ đầu
    preInitModal() {
      this.modalProjectListColumns = this.getDefaultModalProjectListColumns();
      this.showProjectListModal = true;
      this.showProjectListModal = false;
    },
    // Helper method để xử lý an toàn thuộc tính is_locked
    getIsLocked(project) {
      if (!project) return false;
      return Boolean(project.is_locked || project.isLocked);
    },
    navigateToProject(projectData) {
      if (projectData && projectData.projectCode) {
        const routeData = this.$router.resolve({
          name: 'projectpipeline',
          query: {
            search: projectData.projectCode
          }
        });
        
        window.open(routeData.href, '_blank');
      } else {
        this.$toast.error('Không tìm thấy mã dự án để thực hiện tìm kiếm.');
      }
    },
    getDefaultModalProjectListColumns() {
      return [
        {
          fieldName: 'projectName',
          headerText: 'Tên dự án',
          width: '250'
        },
        {
          fieldName: 'customerName',
          headerText: 'Khách hàng',
          width: '200'
        },
        {
          fieldName: 'projectType',
          headerText: 'Loại dự án',
          width: '350'
        },
        {
          fieldName: 'value',
          headerText: 'Giá trị chưa VAT (VNĐ)',
          width: '200',
          type: 'number',
          format: {format: 'N0',useGrouping: true,minimumFractionDigits: 0,maximumFractionDigits: 0}
        },
        {
          fieldName: 'productService',
          headerText: 'Sản phẩm dịch vụ',
          width: '180'
        },
        { 
          fieldName: 'signDate', 
          headerText: 'Ngày ký', 
          width: '120', 
          textAlign: 'Center',
          type: 'date',
          format: 'dd/MM/yyyy'
        },
        {
          fieldName: 'statusText',
          headerText: 'Trạng thái',
          width: '150',
          textAlign: 'Center',
          template: '<span class="status-link" data-project-code="${projectCode}" data-project-id="${id}" style="color: ${statusColor};">${statusText}</span>'
        }
      ];
    },

    generateYears() {
      const years = [{ value: 0, text: 'Tất cả' }];
      
      if (this.allRevenueData && this.allRevenueData.length > 0) {
        // Lấy danh sách năm từ dữ liệu backend và sắp xếp
        const uniqueYears = [...new Set(this.allRevenueData.map(item => item.year))].sort();
        uniqueYears.forEach(year => {
          years.push({ value: year, text: year.toString() });
        });
      } else {
        // Nếu chưa có dữ liệu, tạo danh sách mặc định
        const currentYear = new Date().getFullYear();
        const range = 2;
        for (let i = currentYear - range; i <= currentYear + range; i++) {
          years.push({ value: i, text: i.toString() });
        }
      }

      return years;
    },
    handleYearChange(event) {
      this.filterRevenueDataByYear();
    },
    
    filterRevenueDataByYear() {
      if (this.allRevenueData && this.allRevenueData.length > 0) {
        if (this.year_selected === 0) {
          // Hiển thị tất cả các năm
          this.revenueData = this.allRevenueData.map(item => ({
            ...item,
            color: '#41C2F4'
          }));
        } else {
          // Chỉ hiển thị dữ liệu của năm được chọn
          this.revenueData = this.allRevenueData
            .filter(item => item.year === this.year_selected)
            .map(item => ({
              ...item,
              color: '#41C2F4'
            }));
        }
        this.renderRevenueChart();
      }
    },
    
    onDeparmentChange(){
      this.onFilterChange();
    },
    
    async initDuLieu(){
      // Load danh sách vai trò
      let dataRole = await API.GetActiveMemberRoles(this);
      if (dataRole) {
        this.role_list = this.role_list.concat(dataRole);
      }
      
      // Load danh sách đơn vị VNPT từ ProjectAPI
      let vnptUnits = await ProjectAPI.GetActiveVnptUnits(this);
      if (vnptUnits && vnptUnits.length > 0) {
        this.department_list = [
          { id: 0, text: 'Tất cả' },
          ...vnptUnits
        ];
      } else {
        this.department_list = [{ id: 0, text: 'Tất cả' }];
      }
      
      this.loadProjectStaffChartData();
    },
    onFilterChange() {
      this.loadProjectStaffChartData();
    },
    onModalClose() {
      // Khôi phục modalProjectListColumns về trạng thái ban đầu
      this.modalProjectListColumns = this.getDefaultModalProjectListColumns();
      this.showProjectListModal = false;
      this.isRevenueChartModal = false;
    },
    async loadProjectStaffChartData() {
      this.loading(true);
      const data = await API.GetProjectCountByStaff(this, this.deparment_selected, this.role_selected, this.project_status_selected);
      this.loading(false); 
      if (data && data.length > 0) {
          this.projectStaffData = data;
          this.renderChart();
      } else {
          this.projectStaffData = [];
          this.renderChart();
      }
    },
    // Biểu đồ thống kê số lượng dự án tham gia theo từng nhân sự
    renderChart() {
      Chart.Inject(StackingBarSeries, Category, DataLabel, Legend, Tooltip, Zoom, ScrollBar);

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      if (this.yAxisChartInstance) {
        this.yAxisChartInstance.destroy();
      }
      // Tính toán chiều cao dựa trên số lượng dữ liệu
      const dataLength = this.projectStaffData ? this.projectStaffData.length : 0;
      const chartHeight = Math.max(dataLength * 60, 400);

      this.chartInstance = new Chart({
        height: `${chartHeight}px`,
        primaryXAxis: {
          ...this.projectStaffXAxis,
          labelRotation: 0,
          labelIntersectAction: 'None'
        },
        primaryYAxis: {
          majorGridLines: { width: 0 },
          majorTickLines: { width: 0 },
          lineStyle: { width: 0 },
          labelStyle: { color: 'transparent' }
        },
        legendSettings: {
          visible: false
        },
        tooltip: {
          enable: true,
          format: '<b>${point.x}</b><br/>${series.name}: <b>${point.y}</b> dự án',
          shared: false
        },
        series: [
          {
            dataSource: this.projectStaffData,
            type: 'StackingBar',
            xName: 'staffName',
            yName: 'ongoingProjects',
            name: 'Đúng tiến độ',
            marker: this.projectStaffMarker,
            fill: '#41C2F4'
          },
          {
            dataSource: this.projectStaffData,
            type: 'StackingBar',
            xName: 'staffName',
            yName: 'outdatedProjects',
            name: 'Trễ tiến độ',
            marker: this.projectStaffMarker,
            fill: '#D3D3D3'
          },
          {
            dataSource: this.projectStaffData,
            type: 'StackingBar',
            xName: 'staffName',
            yName: 'completedProjects',
            name: 'Hoàn thành',
            marker: this.projectStaffMarker,
            fill: '#14AE49'
          },
          {
            dataSource: this.projectStaffData,
            type: 'StackingBar',
            xName: 'staffName',
            yName: 'pausedProjects',
            name: 'Tạm ngưng',
            marker: this.projectStaffMarker,
            fill: '#C1D015'
          }
        ],
        pointClick: this.onChartClick
      });

      this.chartInstance.appendTo('#projectStaffChart');
      this.yAxisChartInstance = new Chart({
        height: '40px',
        primaryXAxis: {
          majorGridLines: { width: 0 },
          majorTickLines: { width: 0 },
          lineStyle: { width: 0 },
          labelStyle: { color: 'transparent' }
        },
        primaryYAxis: {
          labelFormat: '{value}',
          minimum: this.chartInstance.primaryYAxis.visibleRange.min,
          maximum: this.chartInstance.primaryYAxis.visibleRange.max,
          interval: this.chartInstance.primaryYAxis.visibleRange.interval
        },
        series: [{
          dataSource: [],
          type: 'StackingBar',
        }],
        legendSettings: { visible: false },
        tooltip: { enable: false }
      });
      this.yAxisChartInstance.appendTo('#yAxisChart');
    },
    // Biểu đồ dự kiến doanh thu theo năm chưa VAT (VND)
    renderRevenueChart() {
      Chart.Inject(BarSeries, Category, DataLabel, Legend, Tooltip);

      if (this.revenueChartInstance) {
        this.revenueChartInstance.destroy();
      }

      this.revenueChartInstance = new Chart({
        title: 'Biểu đồ dự kiến doanh thu theo năm chưa VAT (VND)',
        primaryYAxis: {
          labelStyle: {
            color: '#666'
          },
        },
        primaryXAxis: {
          valueType: 'Category',
        },
        tooltip: {
          enable: true,
          shared: false
        },
        axisLabelRender: (args) => {
            if (args.axis.name === 'primaryYAxis') {
                args.text = this.formatCurrency(args.value);
            }
        },
        tooltipRender: (args) => {
            if (args.point && args.point.y) {
                const formattedValue = this.formatCurrency(args.point.y);
                args.text = `<b>${args.point.x}</b><br/>Dự kiến doanh thu: <b>${formattedValue} VNĐ</b>`;
            }
        },
        series: [{
          dataSource: this.revenueData,
          type: 'Bar',
          xName: 'year',
          yName: 'revenue',
          pointColorMapping: 'color',
        }],
        pointClick: this.onRevenueBarClick,
        width: '100%',
        height: '500px'
      });

      this.revenueChartInstance.appendTo('#revenueBarChart');
    },

    async onChartClick(args) {
      if (!args || !args.point || !args.series) return;

      // Xác định trạng thái và user ID
      const staffName = args.point.x;
      const seriesName = args.series.name;

      // Tìm user ID từ dữ liệu đã tải cho biểu đồ
      const staffMember = this.projectStaffData.find(s => s && s.staffName === staffName);
      if (!staffMember) return;

      const statusMap = {
        'Đúng tiến độ': 'ongoing',
        'Trễ tiến độ': 'outdated',
        'Hoàn thành': 'completed',
        'Tạm ngưng': 'paused'
      };
      const statusKey = statusMap[seriesName];
      if (!statusKey) return;

      const projects = await API.GetProjectsByStaffAndStatus(this, staffMember.userId, statusKey, this.role_selected);

      // Hiển thị modal với dữ liệu đã lọc
      this.modalProjectListData = (projects || []).map(p => {
          const statusText = this.getProjectStatusText(p || {});
          return {
              ...p,
              statusText: statusText,
              statusColor: this.getStatusColor(statusText),
              is_locked: this.getIsLocked(p)
          };
      });
      this.modalProjectListTitle = `Danh sách dự án "${seriesName}" của ${staffName}`;
      this.isRevenueChartModal = false;
      if (projects && projects.length > 0) {
          this.row_selected = {
              ...projects[0],
              is_locked: this.getIsLocked(projects[0])
          };
      } else {
          this.row_selected = {};
      }
      this.showProjectListModal = true;
    },
    
    // Load dữ liệu heatmap khách hàng
    async loadCustomerHeatmapData() {
      this.loading(true);
      const data = await API.GetProjectCountByCustomer(this);
      this.loading(false); 
      if (data && data.length > 0) {
          this.customerHeatmapData = data.map(customer => ({
              ...customer,
              color: this.getColorByValue(customer.count)
          }));
      } else {
          this.customerHeatmapData = [];
      }
    },
    // Load dữ liệu heatmap service
    async loadServiceHeatmapData() {
      this.loading(true);
      const data = await API.GetProjectCountByService(this);
      this.loading(false);

      if (data && data.length > 0) {
          this.serviceHeatmapData = data.map(service => ({
              ...service,
              color: this.getColorByValue(service.count)
          }));
      } else {
          this.serviceHeatmapData = [];
      }
    },
    // Lấy màu theo giá trị
    getColorByValue(value) {
      if (value >= 9) return '#0066CC';      // Xanh đậm nhất - cao nhất
      else if (value >= 7) return '#318CE7';  // Xanh trung bình
      else if (value >= 5) return '#0FC0FC';  // Xanh nhạt
      else if (value >= 3) return '#80DAEB';  // Xanh rất nhạt
      else return '#87CEEB';                  // Xanh nhạt nhất - thấp nhất
    },

    // Xử lý click vào ô heatmap
    async onHeatmapCellClick(item, type) {
      let projects = [];
      let title = 'Danh sách dự án';

      if (type === 'customer') {
          projects = await API.GetProjectsByCustomer(this, item.id);
          title = `Danh sách dự án của khách hàng: ${item.name}`;
      } else if (type === 'service') {
          projects = await API.GetProjectsByService(this, item.id);
          title = `Danh sách dự án của SPDV: ${item.name}`;
      }
      this.modalProjectListData = (projects || []).map(p => {
          const statusText = this.getProjectStatusText(p || {});
          return {
              ...p,
              statusText: statusText,
              statusColor: this.getStatusColor(statusText),
              is_locked: this.getIsLocked(p)
          };
      });
      this.modalProjectListTitle = title;
      this.isRevenueChartModal = false;

      if (projects && projects.length > 0) {
          this.row_selected = {
              ...projects[0],
              is_locked: this.getIsLocked(projects[0])
          };
      } else {
          this.row_selected = {};
      }
      this.showProjectListModal = true;
    },
    async loadDetailData() {
      const response = await ProjectAPI.GetProjectDetail(this);

      if (response) {
          this.detail_data_sources = response.projectList || [];
          this.canUserApproveAmount = response.canApprove || false;
      } else {
          this.detail_data_sources = [];
          this.canUserApproveAmount = false;
      }
    },
    checkActionPermission() {
      if (!this.row_selected || !this.row_selected.id) {
        this.$toast.error('Vui lòng chọn một dự án để thực hiện thao tác.');
        return false;
      }
      return true;
    },
    async editProject() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.getIsLocked(this.row_selected)) {
        this.$toast.error('Dự án đang bị đóng, không thể điều chỉnh.');
        return;
      }
      const fullDetail = this.detail_data_sources.find(p => p.id === this.row_selected.id);
      if (fullDetail) {
          this.is_add_new = false;
          this.is_view_detail = false;
          this.row_selected = fullDetail;
          this.$refs.projectModal.showModal();
      } else {
          this.$toast.error("Không tìm thấy dữ liệu chi tiết cho dự án này.");
      }
    },
    onPopupRowDoubleClicked(rowIndex, item) {
      if (this.isRevenueChartModal) {
          return;
      }
      if (item) {
          this.viewDetail(item);
      }
    },
    viewDetail(projectData) {
        if (!projectData || !projectData.id) {
            this.$toast.error('Dữ liệu dự án không hợp lệ.');
            return;
        }
        const fullDetail = this.detail_data_sources.find(p => p && p.id === projectData.id);
        if (fullDetail) {
            this.row_selected = fullDetail;
            this.is_add_new = false;
            this.is_view_detail = true;
            this.$refs.projectModal.showModal();
        } else {
            this.$toast.error("Không tìm thấy dữ liệu chi tiết cho dự án này.");
        }
    },
    viewMembers() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.getIsLocked(this.row_selected)) {
        this.$toast.error('Dự án đang bị đóng, không thể xem thành viên.');
        return;
      }
      this.$refs.membersModal.showModal();
    },
    async approveProject() {
      if (!this.checkActionPermission()){
        return;
      }
      const result = await this.$confirm(`Bạn chắc chắn muốn phê duyệt dự án?`, 'Sau khi phê duyệt, dự án sẽ được bắt đầu thực hiện');
      if (!result) return;
      
      const response = await ProjectAPI.ApproveProject(this, this.row_selected.id);
      if (response && response.success){
        await this.loadDetailData();
        await this.loadProjectStaffChartData();
        await this.loadPieChartData();
        await this.loadServiceHeatmapData();
        await this.loadCustomerHeatmapData();
        this.row_selected = {};
        this.showProjectListModal = false;
      }
    },
    async closeProject() {
      if (!this.checkActionPermission()) {
        return;
      }
      const actionText = this.getIsLocked(this.row_selected) ? "mở khóa" : "đóng";
      const result = await this.$confirm(`Bạn chắc chắn muốn ${actionText} dự án?`, 'Xác nhận');
      if (!result) return;

      const response = await ProjectAPI.ToggleLockProject(this, this.row_selected.id);
      if (response && response.success) {
        const selectedId = this.row_selected.id;
        await this.loadDetailData();
        await this.loadProjectStaffChartData();
        await this.loadPieChartData();
        await this.loadServiceHeatmapData();
        await this.loadCustomerHeatmapData();
        this.row_selected = {};
        this.showProjectListModal = false;
        // Tìm và cập nhật project trong modalProjectListData
        const projectIndex = this.modalProjectListData.findIndex(p => p && p.id === selectedId);
        if (projectIndex !== -1 && this.modalProjectListData[projectIndex]) {
          // Cập nhật trạng thái is_locked ngay lập tức
          const currentProject = this.modalProjectListData[projectIndex];
          const currentIsLocked = this.getIsLocked(currentProject);
          currentProject.is_locked = !currentIsLocked;
          this.row_selected = currentProject;
        } else {
          this.row_selected = {};
        }
      }
    },
    async deleteProject() {
      if (!this.checkActionPermission()){
        return;
      }
      if (this.getIsLocked(this.row_selected)) {
        this.$toast.error('Dự án đang bị đóng, không thể xóa.');
        return;
      }
      const confirmMessage = `Bạn chắc chắn muốn xóa dự án "${this.row_selected.projectName || this.row_selected.projectCode}"?`;
      const result = await this.$confirm(confirmMessage, 'Xác nhận xóa dự án');
      if (!result) return;
      
      const response = await ProjectAPI.DeleteProject(this, this.row_selected.id);
      if (response && response.success) {
        this.$toast.success('Xóa dự án thành công!');
        await this.loadDetailData();
        await this.loadProjectStaffChartData();
        await this.loadPieChartData();
        await this.loadServiceHeatmapData();
        await this.loadCustomerHeatmapData();
        this.row_selected = {};
        this.showProjectListModal = false;
      } else {
        this.$toast.error(response.message);
      }
    },
    async onActionSuccess() {
        await this.loadProjectStaffChartData();
        await this.loadDetailData();
        await this.loadPieChartData();
        await this.loadServiceHeatmapData();
        await this.loadCustomerHeatmapData();
        this.isRevenueChartModal = false;
        this.showProjectListModal = false;
    },

    onPopupRowSelected(args) {
        this.row_selected = args.data;
    },
    
    handleStatusClick(event) {
      // Sử dụng closest() để xử lý event delegation tốt hơn
      const statusLink = event.target.closest('.status-link');
      if (statusLink) {
        // Ngăn event bubbling và default behavior
        event.preventDefault();
        event.stopPropagation();
        
        const projectCode = statusLink.getAttribute('data-project-code');
        const projectId = statusLink.getAttribute('data-project-id');
        
        if (projectCode) {
          this.navigateToProject({ projectCode, id: projectId });
        }
      }
    },
    
    async loadDetailData() {
      const response = await ProjectAPI.GetProjectDetail(this);
      if (response) {
        this.detail_data_sources = response.projectList || [];
        this.canUserApproveAmount = response.canApprove || false;
      } else {
        this.detail_data_sources = [];
        this.canUserApproveAmount = false;
      }
    },
    async loadProjectTypes() {
      this.all_project_types = await ProjectAPI.GetActiveProjectTypes(this) || [];
    },
    async loadCustomers() {
      this.all_customers = await ProjectAPI.GetActiveCustomers(this) || [];
    },
    async loadCustomerTypes() {
      this.all_customer_types = await ProjectAPI.GetActiveCustomerTypes(this) || [];
    },
    async loadVnptUnits() {
      this.all_vnpt_units = await ProjectAPI.GetActiveVnptUnits(this) || [];
    },
    async loadPromotionUnits() {
      this.all_promotion_units = await ProjectAPI.GetActivePromotionUnits(this) || [];
    },
    async loadDevelopmentUnits() {
      this.all_development_units = await ProjectAPI.GetActiveDevelopmentUnits(this) || [];
    },
    async loadUsers() {
      this.all_users = await ProjectAPI.GetActiveUsers(this) || [];
    },
    async loadServices() {
      this.all_services = await ProjectAPI.GetAllServices(this) || [];
    },
    getProjectStatusText(project) {
      if (project.isCompleted) return 'Hoàn thành';
      if (project.isLocked) return 'Tạm ngưng';
      if (project.endDate && moment(project.endDate).isBefore(moment(), 'day')) {
          return 'Trễ tiến độ';
      }
      return 'Đúng tiến độ';
    },
    
    // Lấy màu CSS tương ứng với trạng thái dự án
    getStatusColor(statusText) {
      switch (statusText) {
        case 'Đúng tiến độ':
          return '#41C2F4';
        case 'Trễ tiến độ':
          return '#FF0000';
        case 'Hoàn thành':
          return '#14AE49';
        case 'Tạm ngưng':
          return '#C1D015';
        default:
          return '#41C2F4';
      }
    },
    // Tải dữ liệu cho biểu đồ tròn
    async loadPieChartData() {
        const summaryData = await API.GetProjectStatusSummary(this);
        if (!summaryData) return;

        const { progressSummary, valueSummary } = summaryData;

        // Xử lý dữ liệu cho biểu đồ tiến độ (đếm)
        this.progressStats = {
            ongoing: progressSummary.ongoingCount,
            outdated: progressSummary.outdatedCount,
            completed: progressSummary.completedCount,
            paused: progressSummary.pausedCount,
            total: Object.values(progressSummary).reduce((a, b) => a + b, 0)
        };
        this.projectProgressData = [
            { x: 'Đúng tiến độ', y: this.progressStats.ongoing, text: `${this.progressStats.ongoing}`, fill: '#41C2F4' },
            { x: 'Trễ tiến độ', y: this.progressStats.outdated, text: `${this.progressStats.outdated}`, fill: '#D3D3D3' },
            { x: 'Hoàn thành', y: this.progressStats.completed, text: `${this.progressStats.completed}`, fill: '#14AE49' },
            { x: 'Tạm ngưng', y: this.progressStats.paused, text: `${this.progressStats.paused}`, fill: '#C1D015' }
        ];

        // Xử lý dữ liệu cho biểu đồ giá trị (tính tổng)
        this.valueStats = {
            ongoing: valueSummary.ongoingValue,
            outdated: valueSummary.outdatedValue,
            completed: valueSummary.completedValue,
            paused: valueSummary.pausedValue,
            total: Object.values(valueSummary).reduce((a, b) => a + b, 0)
        };
        this.projectValueData = [
            { x: 'Đúng tiến độ', y: this.valueStats.ongoing, text: this.formatCurrency(this.valueStats.ongoing), fill: '#41C2F4' },
            { x: 'Trễ tiến độ', y: this.valueStats.outdated, text: this.formatCurrency(this.valueStats.outdated), fill: '#D3D3D3' },
            { x: 'Hoàn thành', y: this.valueStats.completed, text: this.formatCurrency(this.valueStats.completed), fill: '#14AE49' },
            { x: 'Tạm ngưng', y: this.valueStats.paused, text: this.formatCurrency(this.valueStats.paused), fill: '#C1D015' }
        ];

        // Vẽ lại cả hai biểu đồ
        this.renderProjectProgressChart();
        this.renderProjectValueChart();
    },
    formatCurrency(amount) {
        if (amount == null) return '0';
        return new Intl.NumberFormat('vi-VN').format(amount);
    },
    // Render pie chart giá trị dự án
    renderProjectValueChart() {
      AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip);

      if (this.projectValueChartInstance) {
        this.projectValueChartInstance.destroy();
      }

      this.projectValueChartInstance = new AccumulationChart({
        title: 'Biểu đồ thống kê giá trị dự án chưa VAT (VNĐ)',
        series: [{
          dataSource: this.projectValueData,
          xName: 'x',
          yName: 'y',
          name: 'Giá trị dự án',
          dataLabel: {
            visible: true,
            name: 'text',
            position: 'Outside'
          },
          radius: '70%',
          pointColorMapping: 'fill'
        }],
        pointClick: (args) => this.onPieChartClick(args, 'value'),
        enableSmartLabels: true,
        legendSettings: {
          visible: true,
          position: 'Bottom'
        },
        tooltip: {
          enable: true,
          format: '<b>${point.x}</b><br>Giá trị: <b>${point.text}</b>'
        }
      });

      this.projectValueChartInstance.appendTo('#projectValuePieChart');
    },
    // Render pie chart tiến độ dự án
    renderProjectProgressChart() {
      AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip);

      if (this.projectProgressChartInstance) {
        this.projectProgressChartInstance.destroy();
      }

      this.projectProgressChartInstance = new AccumulationChart({
        title: 'Biểu đồ thống kê tiến độ hoàn thành dự án',
        series: [{
          dataSource: this.projectProgressData,
          xName: 'x',
          yName: 'y',
          name: 'Tiến độ dự án',
          dataLabel: {
            visible: true,
            name: 'text',
            position: 'Inside'
          },
          radius: '70%',
          pointColorMapping: 'fill'
        }],
        pointClick: (args) => this.onPieChartClick(args, 'progress'),
        enableSmartLabels: true,
        legendSettings: {
          visible: true,
          position: 'Bottom'
        },
        tooltip: {
          enable: true,
          format: '<b>${point.x}</b><br>Số lượng: <b>${point.y} dự án</b>'
        }
      });

      this.projectProgressChartInstance.appendTo('#projectProgressPieChart');
    },
    async onPieChartClick(args, chartType) {
      if (!args || !args.point) return;

      const statusName = args.point.x;

      const statusMap = {
        'Đúng tiến độ': 'ongoing',
        'Trễ tiến độ': 'outdated',
        'Hoàn thành': 'completed',
        'Tạm ngưng': 'paused'
      };
      const statusKey = statusMap[statusName];
      if (!statusKey) return;
      
      const projects = await API.GetProjectsByStatus(this, statusKey);
      this.modalProjectListData = (projects || []).map(p => {
          const statusText = this.getProjectStatusText(p || {});
          return {
              ...p,
              statusText: statusText,
              statusColor: this.getStatusColor(statusText),
              is_locked: this.getIsLocked(p)
          };
      });
      // Xác định pie chart nào được click để hiển thị title tương ứng
      if (chartType === 'value') {
            this.modalProjectListTitle = `Danh sách dự án - Biểu đồ thống kê giá trị dự án chưa VAT (VNĐ)`;
        } else {
            this.modalProjectListTitle = `Danh sách dự án - Biểu đồ thống kê tiến độ hoàn thành dự án`;
        }
      this.isRevenueChartModal = false;

      if (projects && projects.length > 0) {
          this.row_selected = {
              ...projects[0],
              is_locked: this.getIsLocked(projects[0])
          };
      } else {
          this.row_selected = {};
      }
      this.showProjectListModal = true;
    },
    async loadRevenueChartData() {
      this.loading(true);
      const data = await API.GetProjectedRevenueByYear(this);
      this.loading(false);
      this.allRevenueData = data || [];
      
      // Cập nhật danh sách năm dựa trên dữ liệu thực tế
      this.years = this.generateYears();
            const availableYears = this.allRevenueData.map(item => item.year);
      if (this.year_selected !== 0 && !availableYears.includes(this.year_selected)) {
        this.year_selected = 0;
      }
      
      this.filterRevenueDataByYear();
    },
    async onRevenueBarClick(args) {
      if (!args || !args.point) return;

      const year = args.point.x;
      const details = await API.GetRevenueDetailsByYear(this, year);

      this.modalProjectListColumns = [
        {
          fieldName: 'projectName',
          headerText: 'Dự án',
          width: '300'
        },
        {
          fieldName: 'customerName',
          headerText: 'Khách hàng',
          width: '250'
        },
        {
          fieldName: 'revenueYear',
          headerText: 'Năm',
          width: '100',
          textAlign: 'Center'
        },
        {
          fieldName: 'revenueAmount',
          headerText: 'Dự kiến doanh thu chưa VAT (VNĐ)',
          width: '200', 
          textAlign: 'Right',
          type: 'number',
          format: {format: 'N0',useGrouping: true,minimumFractionDigits: 0,maximumFractionDigits: 0}
        }
      ];
      // Gán dữ liệu và hiển thị modal
      this.modalProjectListData = details || [];
      
      // Tính tổng doanh thu
      const totalRevenue = (details || []).reduce((sum, item) => sum + ((item && item.revenueAmount) || 0), 0);          
      this.modalProjectListTitle = `Dự kiến doanh thu theo năm ${year} - Tổng dự kiến doanh thu chưa VAT (VNĐ): ${this.formatCurrency(totalRevenue)}`;
      this.isRevenueChartModal = true;
      this.showProjectListModal = true;
    },
  },
  mounted() {
    this.preInitModal();
    this.handleStatusClick = this.handleStatusClick.bind(this);
    document.addEventListener('click', this.handleStatusClick, true);
    this.loadProjectStaffChartData();
    this.loadCustomerHeatmapData();
    this.loadServiceHeatmapData();
    this.loadPieChartData();
    this.loadRevenueChartData();
    this.loadDetailData();
    this.loadProjectTypes();
    this.loadCustomers();
    this.loadCustomerTypes();
    this.loadVnptUnits();
    this.loadPromotionUnits();
    this.loadDevelopmentUnits();
    this.loadUsers();
    this.loadServices();
    setTimeout(()=>{
      this.initDuLieu()
    }, 200)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleStatusClick, true);
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
    if (this.projectValueChartInstance) {
      this.projectValueChartInstance.destroy();
      this.projectValueChartInstance = null;
    }
    if (this.projectProgressChartInstance) {
      this.projectProgressChartInstance.destroy();
      this.projectProgressChartInstance = null;
    }
  }
}
</script>
<style scoped>
:deep(.e-input-group.e-control-wrapper) {
  border-radius: 4px !important;
  border-color: #E0E0E0 !important;
}

/* Heatmap styles */
.heatmap-dashboard .page-name {
  margin-bottom: 15px;
  padding-left: 15px;
  margin-top: 15px;
  font-weight: 600;
  font-size: 16px;
}

.heatmap-dashboard .whole-cell {
  padding: 12px;
  width: 100%;
  aspect-ratio: 1 / 1 !important;
  border-style: solid;
  border-color: #fff;
  border-width: 0 1px 1px 0;
  text-align: center;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.heatmap-dashboard .whole-cell:hover {
  transform: scale(1.05);
  z-index: 10;
}

.heatmap-dashboard .item-name {
  display: block;
  max-height: 75px;
  text-align: center;
  color: black !important;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 11px;
  line-height: 1.2;
}

.heatmap-dashboard .item-cnt {
  position: absolute;
  bottom: 4px;
  right: 8px;
  min-width: 30px;
  color: black !important;
  background-color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.heatmap-dashboard .flex {
  display: flex;
}

.heatmap-dashboard .color {
  height: 20px;
  width: 40px;
  margin: 8px;
  border: 1px solid #ddd;
}

.heatmap-dashboard .client-detail {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}

.heatmap-dashboard .no-gutters {
  padding-left: 15px !important;
  padding-right: 15px !important;
}

/* Statistics Panel Styles */
.statistics-panel {
  padding: 20px 15px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.statistics-title {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.total-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  border-right: 4px solid #007bff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.statistics-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .statistics-panel {
    height: auto;
    margin-top: 20px;
  }
  
  .total-value {
    font-size: 20px;
  }
  
  .stat-item {
    padding: 8px 10px;
  }
  
  .stat-label, .stat-value {
    font-size: 12px;
  }
}

/* Total Revenue Display Styles */
.total-revenue-display {
  background-color: #f8f9fa;
  padding: 15px 20px;
  font-size: 16px;
  color: #2c3e50;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.332);
}

.total-revenue-display strong {
  color: #007bff;
  font-size: 18px;
}

/* Chart container styles */
.chart-container {
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
}

.chart-title {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  font-family: Roboto;
  color: #333;
  padding-bottom: 10px;
}

/* Legend styles */
.chart-legend-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-text {
  font-size: 13px;
  color: #666;
}

/* Chart scroll wrapper styles */
.chart-scroll-wrapper {
  position: relative;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.yaxis-chart-container {
  position: absolute;
  bottom: 0;
  height: 40px;
  background-color: #fff;
  z-index: 20;
  overflow: hidden;
  left: 150px;
  width: calc(100% - 145px);
}
/* Custom scrollbar styling */
.chart-scroll-wrapper::-webkit-scrollbar {
  width: 8px;
}

.chart-scroll-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.chart-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.chart-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Đảm bảo biểu đồ có đủ không gian */
:deep(#projectStaffChart) {
  padding: 10px;
}
/* Smooth scrolling */
.chart-scroll-wrapper {
  scroll-behavior: smooth;
}
/* Status link styles */
:deep(.e-grid .e-rowcell):nth-child(9) {
  cursor: pointer !important;
  transition: color 0.2s ease;
  font-weight: 1000;
}
:deep(.e-grid .e-rowcell):nth-child(9):hover {
  text-decoration: underline;
}
</style>