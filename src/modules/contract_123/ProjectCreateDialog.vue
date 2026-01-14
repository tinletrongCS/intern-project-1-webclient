<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupAddUpdateProject"
    :showCloseIcon="true"
    width="70%"
    :isModal="true"
    :target="target"
    :header="header"
    id="add-update-project"
    :open="handleShowModal"
  >
    <!-- ===== REQUIRED WRAPPER ===== -->
    <div class="modal-content popup-box">
      <div class="popup-body">

        <!-- ================================================= -->
        <!-- 1. THÔNG TIN CHUNG -->
        <!-- ================================================= -->
        <div class="box-form">
          <div class="section-title">
            <span class="step step-blue">1</span>
            Thông tin Chung
          </div>

          <div class="row">

            <div class="col-md-3 col-12">
              <!-- <div class="info-row">
                <div class="key bold">Mã dự án <span class="req">*</span></div>
                <div class="value">
                  <input class="form-control"
                    :value="form.projectCode"
                    @change="e => form.projectCode = e.target.value"
                    placeholder="Nhập mã dự án" 
                  />
                </div>
              </div> -->
              <div class="info-row error-wrapper" ref="projectCode">
                <div class="key bold">Mã dự án <span class="req">*</span></div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.projectCode"
                    @keyup.enter="onEnterProjectCode"
                    @blur="onEnterProjectCode"
                    @change="e => form.projectCode = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="service">
                <div class="key bold">Dịch vụ <span class="req">*</span></div>
                <div class="value">
                  <select2
                    v-model="form.service"
                    :options="service_list"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Mã giao dịch</div>
                <div class="value">
                  <input class="form-control"
                    :value="form.transactionCode"
                    @change="e => form.transactionCode = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Mã thuê bao</div>
                <div class="value">
                  <input class="form-control"
                    :value="form.subCode"
                    @change="e => form.subCode = e.target.value"/>
                </div>
              </div>
            </div>

          </div>

          <div class="row mt-2">
            
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="requestType">
                <div class="key bold">Kiểu yêu cầu <span class="req">*</span></div>
                <div class="value">
                  <select2
                    v-model="form.requestType"
                    :options="request_list"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ================================================= -->
        <!-- 2. KHÁCH HÀNG & NHÂN VIÊN -->
        <!-- ================================================= -->
        <div class="box-form">
          <div class="section-title">
            <span class="step step-purple">2</span>
            Khách hàng & Nhân viên
          </div>

          <div class="row">

            <div class="col-md-6 col-12">
              <div class="info-row error-wrapper" ref="customerName">
                <div class="key bold">Tên khách hàng <span class="req">*</span></div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.customerName"
                    @change="e => form.customerName = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="taxCode">
                <div class="key bold">Mã số thuế <span class="req">*</span></div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.taxCode"
                    @change="e => form.taxCode = e.target.value"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="address">
                <div class="key bold">Địa chỉ lắp đặt <span class="req">*</span></div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.address"
                    @change="e => form.address = e.target.value"
                  />
                </div>
              </div>
            </div>

          </div>

          <div class="row mt-2">

            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="amCode">
                <div class="key bold">Mã nhân viên AM <span class="req">*</span></div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.amCode"
                    @keyup.enter="onEnterAmCode"
                    @blur="onEnterAmCode"
                    @change="e => form.amCode = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Tên nhân viên</div>
                <div class="value">
                  <input class="form-control" disabled
                   :value="form.staffName"
                    @change="e => form.staffName = e.target.value"/>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- 3. CHI TIẾT HỢP ĐỒNG -->
        <!-- ================================================= -->
        <div class="box-form">
          <div class="section-title">
            <span class="step step-green">3</span>
            Chi tiết Hợp đồng
          </div>

          <div class="row">

            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="contractNo">
                <div class="key bold">Số hợp đồng <span class="req">*</span></div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.contractNo"
                    @change="e => form.contractNo = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-3 col-12">
              <div class="info-row error-wrapper" ref="acceptanceDate">
                <div class="key bold">Ngày nghiệm thu <span class="req">*</span></div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.acceptance"
                    v-model="form.acceptanceDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :strict-mode="true"
                    locale="vi"
                    @change="changeNgayNghiemThu"
                  />
                </div>
              </div>
            </div>

          
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="contractStatus">
                <div class="key bold">Trạng thái HĐ <span class="req">*</span></div>
                <div class="value">
                  <select2
                    v-model="form.contractStatus"
                    :options="status_list"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="salaryPolicy">
                <div class="key bold">Chính sách tính lương <span class="req">*</span></div>
                <div class="value">
                  <select2
                    v-model="form.salaryPolicy"
                    :options="salary_policy_list"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Nhân viên phụ trách</div>
                <div class="value">
                  <select2
                    v-model="form.contractOfficerId"
                    :options="staff_list"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Lãnh đạo TTKDGP</div>
                <div class="value">
                  <select2
                    v-model="form.ttkdgpLeaderId"
                    :options="leader_list"
                  />
                </div>
              </div>
            </div>



          </div>
        </div>

        <!-- ================================================= -->
        <!-- 4. TÀI CHÍNH & ĐỐI TÁC -->
        <!-- ================================================= -->
        <div class="box-form">
          <div class="section-title">
            <span class="step step-orange">4</span>
            Tài chính & Đối tác
          </div>

          <div class="row">
 
             <div class="col-md-6 col-12">
              <div class="info-row">
                <div class="key bold">Tên đối tác</div>
                <div class="value">
                  <input class="form-control"
                     :value="form.partnerName"
                    @change="e => form.partnerName = e.target.value"/>
                </div>
              </div>
            </div>

             <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Doanh thu đối tác (chưa VAT)</div>
                <div class="value">
                  <input class="form-control"
                     v-model="form.partnerRevenue_display"
                     @input="formatMoney('partnerRevenue_display', 'partnerRevenue')"/>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="contractRevenue">
                <div class="key bold">
                  Doanh thu HĐ (chưa VAT) <span class="req">*</span>
                </div>
                <div class="value">
                  <input
                    class="form-control"
                    v-model="form.contractRevenue_display"
                    @input="formatMoney('contractRevenue_display', 'contractRevenue')"
                  />
                </div>
              </div>
            </div>


          </div>

          <div class="row mt-2">

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số hóa đơn</div>
                <div class="value">
                  <input class="form-control"
                     :value="form.invoiceNo"
                    @change="e => form.invoiceNo = e.target.value"/>
                </div>
              </div>
            </div>

            <!-- <div class="col-sm-3 col-12">
              <label>Ngày hóa đơn</label>
              <input type="date" class="form-control" 
              :value="form.invoiceDate"
                @change="e => form.invoiceDate = e.target.value"/>
            </div> -->
            <div class="col-sm-3 col-12">
              <div class="info-row">
                  <div class="key bold">Ngày hóa đơn</div>
                  <div class="value wp100">
                      <div class="input-icon-right">
                          <ejs-datepicker
                              :key="datePickerKey.invoice"
                              v-model="form.invoiceDate"
                              format='dd/MM/yyyy'
                              :showClearButton='true'
                              :allowEdit="false"
                              :strict-mode="true"
                              locale="vi"
                              @change="changeNgayHoaDon"
                              :firstDayOfWeek="1"
                          />
                      </div>
                  </div>
              </div>
            </div>


          </div>
        </div>

        <!-- ================================================= -->
        <!-- 5. THÔNG TIN THANH TOÁN -->
        <!-- ================================================= -->
        <div class="box-form">
          <div class="section-title">
            <span class="step step-cyan">5</span>
            Thông tin Thanh toán
          </div>

          <div class="row">

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số tiền thu (có VAT)</div>
                <div class="value">
                  <input class="form-control"
                     v-model="form.totalAmount_display"
                     @input="formatMoney('totalAmount_display', 'totalAmount')"/>
                </div>
              </div>
            </div>

            <!-- <div class="col-sm-3 col-12">
              <label>Ngày thanh toán</label>
              <input type="date" class="form-control" v-model="form.paymentDate" />
            </div> -->

            <div class="col-sm-3 col-12">
              <div class="info-row">
                  <div class="key bold">Ngày thanh toán</div>
                  <div class="value">
                      <div class="input-icon-right">
                          <ejs-datepicker
                              :key="datePickerKey.payment"
                              v-model="form.paymentDate"
                              format='dd/MM/yyyy'
                              :showClearButton='true'
                              :allowEdit="false"
                              :strict-mode="true"
                              locale="vi"
                              @change="changeNgayThanhToan"
                              :firstDayOfWeek="1"
                          />
                      </div>
                  </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số tiền chuyển khoản</div>
                <div class="value">
                  <input class="form-control"
                    v-model="form.transferAmount_display"
                    @input="formatMoney('transferAmount_display', 'transferAmount')"/>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Mã cập nhật chứng từ</div>
                <div class="value">
                  <input class="form-control"
                    :value="form.voucherCode"
                @change="e => form.voucherCode = e.target.value"/>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ================================================= -->
        <!-- 6. BỔ SUNG -->
        <!-- ================================================= -->
        <div class="box-form">
          <div class="section-title">
            <span class="step step-gray">6</span>
            Bổ sung
          </div>

          <div class="info-row">
            <div class="key bold">Ghi chú</div>
            <div class="value">
              <textarea class="form-control" rows="3"
                :value="form.note"
                      @change="e => form.note = e.target.value"
                ></textarea>
            </div>
          </div>

          <div class="info-row">
            <div class="key w200 bold">Đính kèm file</div>
            <div class="value wp100">

              <!-- Upload mới -->
              <AttachFile
                v-if="!disabledFileAttach"
                ref="attachFile"
                @onSelectFiles="onSelectFiles"
              />

              <!-- Danh sách file -->
              <div
                v-for="(file, i) in all_files"
                :key="file.uid"
                class="file-item"
              >
                <a
                  class="file-link"
                  style="cursor:pointer"
                  @click.prevent="downloadFile(file)"
                >
                  {{ file.file_name }}
                </a>

                <button
                  v-if="!disabledFileAttach"
                  class="btn-delete-file"
                  title="Xóa file"
                  @click="removeFile(file, i)"
                >
                  ✕
                </button>

              </div>

            </div>
          </div>

        </div>

        <!-- FOOTER -->
        <div class="dialog-footer">
          <button class="btn btn-second" @click="hideModal">Hủy bỏ</button>
          <button class="btn btn-primary" @click="onSave">Lưu hợp đồng</button>
        </div>

      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import AttachFile from './AttachFile.vue'
import API from './API'
import moment from 'moment'
export default {
  name: 'AddUpdateProjectDialog',
  props:{
    isAdd: { type: Boolean, default: true },
    data: { type: Object, default: () => ({}) }
  },
  components: { AttachFile },

  data() {
    return {
      target: '.main-wrapper',
      header: 'Thêm mới thông tin dự án',
      animationSettings: { effect: 'Zoom' },
      form: {
        projectCode: '',
        service: 0,
        transactionCode: '',
        subCode: '',
        requestType: 0,

        customerName: '',
        taxCode: '',
        address: '',
        amCode: '',
        staffName: '',

        contractNo: '',
        acceptanceDate: null,
        contractStatus: 0,
        salaryPolicy: 0,

        partnerName: '',
        partnerRevenue: 0,
        contractRevenue: 0,
        invoiceNo: '',
        invoiceDate: null,

        totalAmount: 0,
        paymentDate: null,
        transferAmount: 0,
        voucherCode: '',

        note: '',

        partnerRevenue_display: '',
        contractRevenue_display: '',
        totalAmount_display: '',
        transferAmount_display: '',

        contractOfficerId: 0, // NV phụ trách hợp đồng
        ttkdgpLeaderId: 0     // Lãnh đạo TTKDGP
      },
      service_list: [],
      request_list: [
        {
          id:0,
          text:'Chọn'
        },
        {
          id:1,
          text:'Lắp mới'
        },
        {
          id:2,
          text:'Gia hạn'
        },
        {
          id:3,
          text:'Mua thêm'
        },
         {
          id:4,
          text:'Nâng cấp'
        }
      ],
      status_list:[
        {
          id:0,
          text:'Chọn'
        },
        {
          id:1,
          text:'Chưa hoàn tất'
        },
        {
          id:2,
          text:'Đã hoàn tất'
        }
      ],
      salary_policy_list:[
        {
          id:0,
          text:'Chọn'
        },
        {
          id:1,
          text:'Ngoài cơ chế'
        },
        {
          id:2,
          text:'Ngoài chương trình'
        }
      ],
      all_files: [],        // toàn bộ file (cũ + mới)
      newFiles: [],         // file mới
      deletedFileIds: [],   // id file cũ bị xoá

      disabledFileAttach: false,
      staff_list: [],
      leader_list: [],
      datePickerKey: {
        acceptance: 0,
        invoice: 0,
        payment: 0
      }
    }
  },

  methods: {
    showModal() {
      this.$refs.popupAddUpdateProject.show()
    },
    hideModal() {
      this.$refs.popupAddUpdateProject.hide()
    },
    handleShowModal() {
      this.$nextTick(() => {
        if (this.isAdd) {
          this.$refs.projectCode?.querySelector('input')?.focus()
        } else {
          document.activeElement?.blur()
        }
      })
      this.clear()
      setTimeout(() => {
        this.loadInitData()

        if (!this.isAdd && this.data) {
          this.initData()
        }
      }, 300)
    },
    initData(){
      const d = this.data
      if (!d) return

      // ===== MAP FORM =====
      this.form = {
        ...this.form,

        contract_project_123_id: d.id,

        projectCode: d.project_code || '',
        service: d.service_id || 0, // ⚠️ nếu table trả text thì cần map lại ID
        transactionCode: d.transaction_code || '',
        subCode: d.sub_code || '',
        requestType: d.request_type || 0,

        customerName: d.customer_name || '',
        taxCode: d.tax_code || '',
        address: d.address || '',
        amCode: d.am_code || '',
        staffName: d.staff_name || '',

        contractNo: d.contract_no || '',
        acceptanceDate: d.acceptance_date || null,
        contractStatus: d.status || 0,
        salaryPolicy: d.salary_policy || 0,

        partnerName: d.partner_name || '',
        partnerRevenue: d.partner_revenue || 0,
        contractRevenue: d.revenue || 0,

        invoiceNo: d.invoice_code || '',
        invoiceDate: d.invoice_date || null,

        totalAmount: d.total_amount || 0,
        paymentDate: d.payment_date || null,
        transferAmount: d.transfer_amount || 0,
        voucherCode: d.voucher_code || '',

        contractOfficerId: d.contract_officer_id || 0,
        ttkdgpLeaderId: d.ttkdgp_leader_id || 0,

        note: d.note || ''
      }

      // ===== FORMAT MONEY DISPLAY =====
      this.form.partnerRevenue_display =
        this.form.partnerRevenue
          ? Number(this.form.partnerRevenue).toLocaleString('vi-VN')
          : ''

      this.form.contractRevenue_display =
        this.form.contractRevenue
          ? Number(this.form.contractRevenue).toLocaleString('vi-VN')
          : ''

      this.form.totalAmount_display =
        this.form.totalAmount
          ? Number(this.form.totalAmount).toLocaleString('vi-VN')
          : ''

      this.form.transferAmount_display =
        this.form.transferAmount
          ? Number(this.form.transferAmount).toLocaleString('vi-VN')
          : ''

      // ===== FILE CŨ (DB) =====
      const oldFiles = d.files || []

      this.all_files = oldFiles.map(f => ({
        uid: 'db_' + f.file_attachment_id,
        file_attachment_id: f.file_attachment_id,
        file_name: f.file_name,
        file_path: f.file_path,
        is_new: false
      }))

      // ===== RESET FILE STATE =====
      this.newFiles = []
      this.deletedFileIds = []

      // ===== QUYỀN FILE (NẾU CẦN) =====
      this.disabledFileAttach = false
    },
    removeFile(file, index) {
      if (file.is_new) {
        // file mới → bỏ khỏi newFiles
        this.newFiles = this.newFiles.filter(f => f !== file.file_obj)
      } else {
        // file DB → đánh dấu xoá
        this.deletedFileIds.push(file.file_attachment_id)
      }

      this.all_files.splice(index, 1)
    },
    downloadFile(file) {
      if (!file.file_path) return

      this.axios.get(`revenue/Upload/Download`, {
          params: { filePath: file.file_path },
          responseType: 'blob',
      })
      .then((response) => {
          // Tạo URL và trigger download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.file_name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
      })
      .catch((error) => {
          console.error("Download lỗi:", error);
      });
    },
    async onEnterProjectCode(){
      const code = this.form.projectCode?.trim()
      if (!code) return

      const res = await API.GetCustomerByCode(this, code)
      if (!res || !Array.isArray(res) || res.length === 0) {
        this.$toast.warning('Không tìm thấy khách hàng theo mã')
        return
      }

      // ⚠️ lấy khách hàng đầu tiên
      const cus = res[0]

      // ===== MAP SANG FORM =====
      this.form.customerName = cus.customer_name || ''
      this.form.taxCode = cus.taxcode || ''
      this.form.address = cus.address || ''

      // nếu có phone / email thì fill thêm
      if (cus.phone_number) {
        this.form.phoneNumber = cus.phone_number
      }

      this.$toast.success('Đã lấy thông tin khách hàng')
    },
    async onEnterAmCode() {
      const code = this.form.amCode?.trim()
      if (!code) return

      const res = await API.GetAccountByCode(this, code)

      if (!res || !Array.isArray(res) || res.length === 0) {
        this.$toast.warning('Không tìm thấy nhân viên theo mã AM')
        this.form.staffName = ''
        return
      }

      // ⚠️ lấy bản ghi đầu tiên
      const acc = res[0]

      // ===== MAP DATA =====
      this.form.staffName = acc.full_name || ''

      this.$toast.success('Đã lấy thông tin nhân viên')
    },
    clear() {
      this.form = {
        projectCode: '',
        service: 0,
        transactionCode: '',
        subCode: '',
        requestType: 0,

        customerName: '',
        taxCode: '',
        address: '',
        amCode: '',
        staffName: '',

        contractNo: '',
        acceptanceDate: null,
        contractStatus: 0,
        salaryPolicy: 0,

        partnerName: '',
        partnerRevenue: 0,
        contractRevenue: 0,
        invoiceNo: '',
        invoiceDate: null,

        totalAmount: 0,
        paymentDate: null,
        transferAmount: 0,
        voucherCode: '',

        note: '',

        partnerRevenue_display: '',
        contractRevenue_display: '',
        totalAmount_display: '',
        transferAmount_display: '',

        contractOfficerId: 0, // NV phụ trách hợp đồng
        ttkdgpLeaderId: 0     // Lãnh đạo TTKDGP

      }
      this.service_list=[]
      this.all_files = []
      this.newFiles = []
      this.deletedFileIds = []
      this.disabledFileAttach=false

      this.staff_list = [
        {
          id:0,
          text:'Chọn'
        }
      ]
      this.leader_list = [
        {
          id:0,
          text:'Chọn'
        }
      ]
      this.form.acceptanceDate = null
      this.form.invoiceDate = null
      this.form.paymentDate = null

      // force re-render DatePicker
      this.datePickerKey.acceptance++
      this.datePickerKey.invoice++
      this.datePickerKey.payment++
    },

    async loadInitData() {
      var data = await API.GetServiceOneBss(this)
      if(data){
        data=JSON.parse(data)
        this.service_list = [
        { id: 0, text: 'Chọn' },
          ...data.map(x => ({
            id: x.device_profile_id,
            text: x.device_profile_name
          }))
        ]
      }
      await Promise.all([
        this.loadLeaderTTKDGP(),
        this.loadStaffByDepartment(1)
      ])
    },

    async loadStaffByDepartment(departmentId) {
      const res = await API.GetUserByDepartmentId(this, departmentId)

      this.staff_list = [
        { id: 0, text: 'Chọn' }
      ]

      if (!res) return

      let data = res
      if (typeof res === 'string') {
        try {
          data = JSON.parse(res)
        } catch (e) {
          console.error('Parse GetUserByDepartmentId lỗi', e)
          return
        }
      }

      if (Array.isArray(data)) {
        this.staff_list.push(
          ...data.map(x => ({
            id: x.user_id,
            text: x.display_name
          }))
        )
      }
    },
    async loadLeaderTTKDGP() {
      const res = await API.GetLeaderTTKDGP(this)

      this.leader_list = [
        { id: 0, text: 'Chọn' }
      ]

      if (!res) return

      let data = res
      if (typeof res === 'string') {
        try {
          data = JSON.parse(res)
        } catch (e) {
          console.error('Parse GetLeaderTTKDGP lỗi', e)
          return
        }
      }

      if (Array.isArray(data)) {
        this.leader_list.push(
          ...data.map(x => ({
            id: x.user_id,
            text: x.display_name
          }))
        )
      }
    },


    onSelectFiles(files) {
      files.forEach(file => {
        // lưu file mới để submit API
        this.newFiles.push(file)

        // đưa vào danh sách hiển thị
        this.all_files.push({
          uid: 'new_' + Date.now() + '_' + file.name,
          file_name: file.name,
          file_obj: file,
          is_new: true
        })
      })
    },
    changeNgayNghiemThu(event){
      this.form.acceptanceDate=moment(event.value).format('DD/MM/YYYY')
    },
    changeNgayThanhToan(event){
      this.form.paymentDate=moment(event.value).format('DD/MM/YYYY') 
    },
    changeNgayHoaDon(event){
      this.form.invoiceDate=moment(event.value).format('DD/MM/YYYY') 
    },
    formatMoney(fieldDisplay, fieldValue) {
      console.log('formatMoney', fieldDisplay)
      // lấy số người dùng nhập
      let raw = this.form[fieldDisplay]
        ? this.form[fieldDisplay].replace(/\D/g, '')
        : ''

      // gán số thật (submit API)
      this.form[fieldValue] = raw !== ''
        ? Number(raw)
        : null

      // format lại để hiển thị
      this.form[fieldDisplay] = raw !== ''
        ? Number(raw).toLocaleString('vi-VN')
        : ''
    },
    buildFormData() {
      const fd = new FormData()

      fd.append('project_code', this.form.projectCode)
      fd.append('service_id', this.form.service)
      fd.append('transaction_code', this.form.transactionCode || '')
      fd.append('sub_code', this.form.subCode || '')
      fd.append('request_type', this.form.requestType)

      fd.append('customer_name', this.form.customerName)
      fd.append('tax_code', this.form.taxCode)
      fd.append('address', this.form.address)
      fd.append('am_code', this.form.amCode)

      fd.append('contract_no', this.form.contractNo)
      fd.append('contract_status', this.form.contractStatus)
      fd.append('salary_policy', this.form.salaryPolicy)

      if (this.form.acceptanceDate)
        fd.append('acceptance_date', this.form.acceptanceDate)

      fd.append('partner_name', this.form.partnerName || '')
      fd.append('partner_revenue', this.form.partnerRevenue || 0)
      fd.append('contract_revenue', this.form.contractRevenue)

      fd.append('invoice_no', this.form.invoiceNo || '')
      if (this.form.invoiceDate)
        fd.append('invoice_date', this.form.invoiceDate)

      fd.append('total_amount', this.form.totalAmount || 0)
      if (this.form.paymentDate)
        fd.append('payment_date', this.form.paymentDate)

      fd.append('transfer_amount', this.form.transferAmount || 0)
      fd.append('voucher_code', this.form.voucherCode || '')
      fd.append('note', this.form.note || '')

      fd.append('contract_officer_id', this.form.contractOfficerId)
      fd.append('ttkdgp_leader_id', this.form.ttkdgpLeaderId)

      // ===== FILE =====
      this.newFiles.forEach(f => {
        fd.append('new_files', f)
      })

      this.deletedFileIds.forEach(id => {
        fd.append('deleted_file_ids', id)
      })

      return fd
    },
    checkRequired() {
      // ===== (1) Thông tin chung =====
      if (!this.form.projectCode) {
        this.$toast.error('Vui lòng nhập Mã dự án')
        this.focusError('projectCode')
        return false
      }

      if (!this.form.service || this.form.service === 0) {
        this.$toast.error('Vui lòng chọn Dịch vụ')
        this.focusError('service')
        return false
      }

      if (!this.form.requestType || this.form.requestType === 0) {
        this.$toast.error('Vui lòng chọn Kiểu yêu cầu')
        this.focusError('requestType')
        return false
      }

      // ===== (2) Khách hàng & Nhân viên =====
      if (!this.form.customerName) {
        this.$toast.error('Vui lòng nhập Tên khách hàng')
        this.focusError('customerName')
        return false
      }

      if (!this.form.taxCode) {
        this.$toast.error('Vui lòng nhập Mã số thuế')
        this.focusError('taxCode')
        return false
      }

      if (!this.form.address) {
        this.$toast.error('Vui lòng nhập Địa chỉ lắp đặt')
        this.focusError('address')
        return false
      }

      if (!this.form.amCode) {
        this.$toast.error('Vui lòng nhập Mã nhân viên AM')
        this.focusError('amCode')
        return false
      }

      // ===== (3) Chi tiết hợp đồng =====
      if (!this.form.contractNo) {
        this.$toast.error('Vui lòng nhập Số hợp đồng')
        this.focusError('contractNo')
        return false
      }

      if (!this.form.contractStatus || this.form.contractStatus === 0) {
        this.$toast.error('Vui lòng chọn Trạng thái hợp đồng')
        this.focusError('contractStatus')
        return false
      }

      if (!this.form.salaryPolicy || this.form.salaryPolicy === 0) {
        this.$toast.error('Vui lòng chọn Chính sách tính lương')
        this.focusError('salaryPolicy')
        return false
      }

      if (!this.form.acceptanceDate) {
        this.$toast.error('Vui lòng nhập Ngày nghiệm thu')
        this.focusError('acceptanceDate')
        return false
      }

      // ===== (4) Tài chính =====
      if (!this.form.contractRevenue || this.form.contractRevenue <= 0) {
        this.$toast.error('Doanh thu hợp đồng phải lớn hơn 0')
        this.focusError('contractRevenue')
        return false
      }

      return true
    },

    async onSave() {
      if (!this.checkRequired()) return
      let confirm = await this.$confirm(
        'Thông báo',
        this.isAdd ? 'Bạn chắc chắn muốn thêm mới?' : 'Bạn chắc chắn muốn cập nhật?'
      )
      if (confirm === 0) return

      if (this.isAdd) {
        await this.addProject()
      } else {
        await this.updateProject()
      }
    },
    focusError(refName) {
      this.$nextTick(() => {
        const el = this.$refs[refName]
        if (!el) return

        // scroll tới vị trí field
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })

        // tô đỏ wrapper
        el.classList.add('error-focus')

        // focus input / select / datepicker bên trong
        const input =
          el.querySelector('input') ||
          el.querySelector('select') ||
          el.querySelector('.e-input')

        if (input) input.focus()

        // tự bỏ đỏ sau 3s
        setTimeout(() => {
          el.classList.remove('error-focus')
        }, 3000)
      })
    },
    async addProject() {
      const formData = this.buildFormData()

      const result = await API.CreateContractProject123(this, formData)

      if (result == '1') {
        this.$toast.success('Thêm mới thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async updateProject() {
      if (!this.form.contract_project_123_id) {
        this.$toast.error('Không tìm thấy ID để cập nhật')
        return
      }

      const formData = this.buildFormData()
      formData.append(
        'contract_project_123_id',
        this.form.contract_project_123_id
      )

      const result = await API.UpdateContractProject123(this, formData)

      if (result == '1') {
        this.$toast.success('Cập nhật thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
  }
}
</script>

<style scoped>
:deep(#add-update-project .e-dlg-content) {
  max-height: 85vh;
  overflow-y: auto;
}

#add-update-project .info-row {
  display: table;
  width: 100%;
  table-layout: fixed;
}

#add-update-project .info-row .key {
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  display: table-caption;
  padding-left: 6px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.step {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.step-blue { background: #3b82f6 }
.step-purple { background: #8b5cf6 }
.step-green { background: #10b981 }
.step-orange { background: #f59e0b }
.step-cyan { background: #06b6d4 }
.step-gray { background: #9ca3af }
.req { color: red }
.input-money { position: relative }
.unit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #6b7280;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}
.file-item {
  display: flex;
  align-items: center;      /* căn giữa theo chiều dọc */
  gap: 8px;                 /* khoảng cách giữa text và nút X */
  margin-top: 6px;          /* giãn các dòng file */
}

.file-link {
  cursor: pointer;
  color: #2563eb;
  /* text-decoration: underline; */
  line-height: 1.4;
}

.btn-delete-file {
  border: none;
  background: transparent;
  color: #ef4444;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  padding: 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;      /* căn X đúng giữa */
}

.btn-delete-file:hover {
  color: #dc2626;
}

.btn-delete-file:focus {
  outline: none;
  box-shadow: none;
}
/* .error-focus {
  border: 1px solid #ef4444 !important;
  border-radius: 4px;
}

.error-focus input,
.error-focus select {
  border-color: #ef4444 !important;
}

.error-focus .e-input,
.error-focus .e-control {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.4);
} */
 .error-focus input:focus,
.error-focus select:focus,
.error-focus textarea:focus,
.error-focus .e-input:focus,
.error-focus .e-control:focus {
  outline: none !important;
  box-shadow: none !important;
  background-color: #fff !important;
  border-color: #ef4444 !important;
}

/* Syncfusion DatePicker / Select */
.error-focus .e-input,
.error-focus .e-control {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.45) !important;
  background-color: #fff !important;
}

</style>
