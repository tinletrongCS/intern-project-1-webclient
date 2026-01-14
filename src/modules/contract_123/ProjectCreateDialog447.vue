<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupProjectCreateDialog447"
    :showCloseIcon="true"
    width="80%"
    :isModal="true"
    :target="target"
    :header="header"
    id="add-update-project"
    :open="handleShowModal"
  >
    <!-- ===== REQUIRED WRAPPER ===== -->
    <div class="modal-content popup-box">
      <div class="popup-body">
        <!-- Doanh thu -->
        <!-- ================= DOANH THU ================= -->
        <div class="box-form">
          <div class="section-title red">
            Doanh thu
          </div>

          <!-- ROW 1 -->
          <div class="row">
            <!-- Tên khách hàng -->
            <div class="col-md-6 col-12">
              <div class="info-row error-wrapper" ref="revenue_customerName">
                <div class="key bold">Tên khách hàng</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.revenue.customerName"
                    :disabled="isDisabledForm"
                    @change="e => form.revenue.customerName = e.target.value"
                    placeholder="Nhập tên khách hàng..."
                  />
                </div>
              </div>
            </div>

            <!-- Loại doanh thu -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="revenue_type">
                <div class="key bold">Loại doanh thu</div>
                <div class="value">
                  <select2
                    v-model="form.revenue.revenueType"
                    :options="revenue_type_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>

            <!-- Loại doanh thu khác -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Loại doanh thu khác</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    :value="form.revenue.revenueTypeOther"
                    @change="e => form.revenue.revenueTypeOther = e.target.value"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 2 -->
          <div class="row mt-2">
            <!-- Mã số thuế -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Mã số thuế</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    :value="form.revenue.taxCode"
                    @change="e => form.revenue.taxCode = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Số hợp đồng -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số hợp đồng</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    :value="form.revenue.contractNo"
                    @change="e => form.revenue.contractNo = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày hợp đồng -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="revenue_contractDate">
                <div class="key bold">Ngày hợp đồng</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.contractDate"
                    :value="form.revenue.contractDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    :strict-mode="true"
                    locale="vi"
                    @change="e => onChangeDate('revenue.contractDate', e)"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày BBNT -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="revenue_bbntDate">
                <div class="key bold">Ngày BBNT</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.bbntDate"
                    :value="form.revenue.bbntDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    :strict-mode="true"
                    locale="vi"
                    @change="e => onChangeDate('revenue.bbntDate', e)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 3 -->
          <div class="row mt-2">
            <!-- Ngày KH thanh toán -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="revenue_customerPaymentDate">
                <div class="key bold">Ngày KH thanh toán</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.customerPaymentDate"
                    :value="form.revenue.customerPaymentDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    :strict-mode="true"
                    locale="vi"
                    @change="e => onChangeDate('revenue.customerPaymentDate', e)"
                  />
                </div>
              </div>
            </div>

            <!-- Tên SPDV -->
            <div class="col-md-6 col-12">
              <div class="info-row">
                <div class="key bold">Tên SPDV</div>
                <div class="value">
                  <select2
                    v-model="form.revenue.productId"
                    :options="product_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày hóa đơn -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="revenue_invoiceDate">
                <div class="key bold">Ngày hóa đơn</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.invoiceDate"
                    :value="form.revenue.invoiceDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    :strict-mode="true"
                    locale="vi"
                    @change="e => onChangeDate('revenue.invoiceDate', e)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 4 -->
          <div class="row mt-2">
            <!-- Serial -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Serial</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.revenue.serial"
                    :disabled="isDisabledForm"
                    @change="e => form.revenue.serial = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Số hóa đơn -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số hóa đơn</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.revenue.invoiceNo"
                    :disabled="isDisabledForm"
                    @change="e => form.revenue.invoiceNo = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Tổng tiền -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="totalAmount">
                <div class="key bold">Tổng tiền</div>
                <div class="value">
                  <input
                    class="form-control"
                    v-model="form.revenue.totalAmount_display"
                    :disabled="isDisabledForm"
                    @input="formatMoney(
                      'revenue.totalAmount_display',
                      'revenue.totalAmount'
                    )"
                  />
                </div>
              </div>
            </div>

            <!-- Doanh thu HĐ (chưa VAT) -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="contractRevenue">
                <div class="key bold">
                  Doanh thu HĐ (chưa VAT)
                </div>
                <div class="value">
                  <input
                    class="form-control"
                    v-model="form.revenue.contractRevenue_display"
                    :disabled="isDisabledForm"
                    @input="formatMoney(
                      'revenue.contractRevenue_display',
                      'revenue.contractRevenue'
                    )"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 5 -->
          <div class="row mt-2">
            <!-- VAT -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="vatAmount">
                <div class="key bold">VAT</div>
                <div class="value">
                  <input
                    class="form-control"
                    v-model="form.revenue.vatAmount_display"
                    :disabled="isDisabledForm"
                    @input="formatMoney(
                      'revenue.vatAmount_display',
                      'revenue.vatAmount'
                    )"
                  />
                </div>
              </div>
            </div>

            <!-- Thuế suất -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Thuế suất (%)</div>
                <div class="value">
                  <select2
                    v-model="form.revenue.vatRate"
                    :options="vat_rate_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>

            <!-- Chứng từ thanh toán -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Chứng từ thanh toán</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.revenue.paymentDoc"
                    :disabled="isDisabledForm"
                    @change="e => form.revenue.paymentDoc = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Kỳ dữ liệu (MM/YYYY) -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="revenue_period">
                <div class="key bold">Kỳ dữ liệu</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.period"
                    :value="form.revenue.period"
                    format="MM/yyyy"
                    start="Year"
                    depth="Year"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    locale="vi"
                    @change="e => onChangeDate('revenue.period', e)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 6 -->
          <div class="row mt-2">
            <!-- Nội dung dịch vụ -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Nội dung dịch vụ</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.revenue.serviceContent"
                    :disabled="isDisabledForm"
                    @change="e => form.revenue.serviceContent = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Hệ số dịch vụ -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Hệ số dịch vụ (%)</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.revenue.serviceRate"
                    :disabled="isDisabledForm"
                    @change="e => form.revenue.serviceRate = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Doanh thu tính lương -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="salaryRevenue">
                <div class="key bold">Doanh thu tính lương</div>
                <div class="value">
                  <input
                    class="form-control"
                    v-model="form.revenue.salaryRevenue_display"
                    :disabled="isDisabledForm"
                    @input="formatMoney(
                      'revenue.salaryRevenue_display',
                      'revenue.salaryRevenue'
                    )"
                  />
                </div>
              </div>
            </div>


          </div>
        </div>
        <!-- ================= CHI PHÍ PHẢI TRẢ ĐỐI TÁC BÊN NGOÀI ================= -->
        <div class="box-form">
          <div class="section-title red">
            Chi phí phải trả đối tác bên ngoài
          </div>

          <!-- ROW 1 -->
          <div class="row">
            <!-- Nội dung chi phí -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Nội dung chi phí</div>
                <div class="value">
                  <select2
                    v-model="form.partnerCost.costContent"
                    :options="cost_content_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>

            <!-- Loại chi phí -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Loại chi phí</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.costType"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.costType = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Tên đối tác -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Tên đối tác</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.partnerName"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.partnerName = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Số hợp đồng -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số hợp đồng</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.contractNo"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.contractNo = e.target.value"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 2 -->
          <div class="row mt-2">
            <!-- Ngày hợp đồng -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partner_contractDate">
                <div class="key bold">Ngày hợp đồng</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.partnerContractDate"
                    :value="form.partnerCost.contractDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :strict-mode="true"
                    :enabled="!isDisabledForm"
                    locale="vi"
                    @change="e => onChangeDate('partnerCost.contractDate', e)"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày BBNT -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partner_bbntDate">
                <div class="key bold">Ngày BBNT</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.partnerBbntDate"
                    :value="form.partnerCost.bbntDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :strict-mode="true"
                    :enabled="!isDisabledForm"
                    locale="vi"
                    @change="e => onChangeDate('partnerCost.bbntDate', e)"
                  />
                </div>
              </div>
            </div>

            <!-- Nội dung dịch vụ -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Nội dung dịch vụ</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.serviceContent"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.serviceContent = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày hóa đơn -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partner_invoiceDate">
                <div class="key bold">Ngày hóa đơn</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.partnerInvoiceDate"
                    :value="form.partnerCost.invoiceDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :strict-mode="true"
                    :enabled="!isDisabledForm"
                    locale="vi"
                    @change="e => onChangeDate('partnerCost.invoiceDate', e)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 3 -->
          <div class="row mt-2">
            <!-- Serial -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Serial</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.serial"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.serial = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Số hóa đơn -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số hóa đơn</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.invoiceNo"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.invoiceNo = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Tổng tiền -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partnerTotalAmount">
                <div class="key bold">Tổng tiền</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    v-model="form.partnerCost.totalAmount_display"
                    @input="formatMoney(
                      'partnerCost.totalAmount_display',
                      'partnerCost.totalAmount'
                    )"
                  />
                </div>
              </div>
            </div>

            <!-- Chi phí -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partnerCostAmount">
                <div class="key bold">Chi phí</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    v-model="form.partnerCost.costAmount_display"
                    @input="formatMoney(
                      'partnerCost.costAmount_display',
                      'partnerCost.costAmount'
                    )"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 4 -->
          <div class="row mt-2">
            <!-- VAT -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partnerVatAmount">
                <div class="key bold">VAT</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"                    
                    v-model="form.partnerCost.vatAmount_display"
                    @input="formatMoney(
                      'partnerCost.vatAmount_display',
                      'partnerCost.vatAmount'
                    )"
                  />
                </div>
              </div>

            </div>

            <!-- Thuế suất -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Thuế suất</div>
                <div class="value">
                  <select2
                    v-model="form.partnerCost.vatRate"
                    :options="vat_rate_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày thanh toán cho đối tác -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="partner_paymentDate">
                <div class="key bold">Ngày thanh toán cho đối tác</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.partnerPaymentDate"
                    :value="form.partnerCost.paymentDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    :strict-mode="true"
                    locale="vi"
                    @change="e => onChangeDate('partnerCost.paymentDate', e)"
                  />
                </div>
              </div>
            </div>

            <!-- Chứng từ thanh toán -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Chứng từ thanh toán</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.partnerCost.paymentDoc"
                    :disabled="isDisabledForm"
                    @change="e => form.partnerCost.paymentDoc = e.target.value"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= CHI PHÍ PHẢI TRẢ FACTORY (IT, MEDIA, ...) ================= -->
        <div class="box-form">
          <div class="section-title red">
            Chi phí phải trả Factory (IT, Media, ...)
          </div>

          <!-- ROW 1 -->
          <div class="row">
            <!-- Nội dung chi phí -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Nội dung chi phí</div>
                <div class="value">
                  <select2
                    v-model="form.factoryCost.costContent"
                    :options="cost_content_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>

            <!-- Đơn đặt hàng -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Đơn đặt hàng</div>
                <div class="value">
                  <input
                    class="form-control"
                    :value="form.factoryCost.orderNo"
                    :disabled="isDisabledForm"
                    @change="e => form.factoryCost.orderNo = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày đặt hàng -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="factory_orderDate">
                <div class="key bold">Ngày đặt hàng</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.factoryOrderDate"
                    :value="form.factoryCost.orderDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :strict-mode="true"
                    :enabled="!isDisabledForm"
                    locale="vi"
                    @change="e => onChangeDate('factoryCost.orderDate', e)"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày BBNT -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="factory_bbntDate">
                <div class="key bold">Ngày BBNT</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.factoryBbntDate"
                    :value="form.factoryCost.bbntDate"
                    format="dd/MM/yyyy"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    :strict-mode="true"
                    locale="vi"
                    @change="e => onChangeDate('factoryCost.bbntDate', e)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 2 -->
          <div class="row mt-2">
            <!-- Nội dung dịch vụ -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Nội dung dịch vụ</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    :value="form.factoryCost.serviceContent"
                    @change="e => form.factoryCost.serviceContent = e.target.value"
                  />
                </div>
              </div>
            </div>

            <!-- Ngày hóa đơn -->
            <div class="col-md-3 col-12">
             <div class="info-row error-wrapper" ref="factory_invoiceDate">
              <div class="key bold">Ngày hóa đơn</div>
              <div class="value">
                <ejs-datepicker
                  :key="datePickerKey.factoryInvoiceDate"
                  :value="form.factoryCost.invoiceDate"
                  format="dd/MM/yyyy"
                  :showClearButton="true"
                  :allowEdit="false"
                  :enabled="!isDisabledForm"
                  :strict-mode="true"
                  locale="vi"
                  @change="e => onChangeDate('factoryCost.invoiceDate', e)"
                />
              </div>
            </div>
            </div>
            <!-- Serial -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Serial</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    :value="form.factoryCost.serial"
                    @change="e => form.factoryCost.serial = e.target.value"
                  />
                </div>
              </div>
            </div>
            <!-- Số hóa đơn -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Số hóa đơn</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    :value="form.factoryCost.invoiceNo"
                    @change="e => form.factoryCost.invoiceNo = e.target.value"
                  />
                </div>
              </div>
            </div>

          </div>

          <!-- ROW 3 -->
          <div class="row mt-2">
            <!-- Tổng tiền -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="factoryTotalAmount">
                <div class="key bold">Tổng tiền</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    v-model="form.factoryCost.totalAmount_display"
                    @input="formatMoney(
                      'factoryCost.totalAmount_display',
                      'factoryCost.totalAmount'
                    )"
                  />
                </div>
              </div>
            </div>

            <!-- Chi phí -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="factoryCostAmount">
                <div class="key bold">Chi phí</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    v-model="form.factoryCost.costAmount_display"
                    @input="formatMoney(
                      'factoryCost.costAmount_display',
                      'factoryCost.costAmount'
                    )"
                  />
                </div>
              </div>
            </div>

            <!-- VAT -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="factoryVatAmount">
                <div class="key bold">VAT</div>
                <div class="value">
                  <input
                    class="form-control"
                    :disabled="isDisabledForm"
                    v-model="form.factoryCost.vatAmount_display"
                    @input="formatMoney(
                      'factoryCost.vatAmount_display',
                      'factoryCost.vatAmount'
                    )"
                  />
                </div>
              </div>
            </div>

            <!-- Thuế suất -->
            <div class="col-md-3 col-12">
              <div class="info-row">
                <div class="key bold">Thuế suất</div>
                <div class="value">
                  <select2
                    v-model="form.factoryCost.vatRate"
                    :options="vat_rate_list"
                    :disabled="isDisabledForm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 4 -->
          <div class="row mt-2">
            <!-- Tháng bù trừ công nợ qua B11 -->
            <div class="col-md-3 col-12">
              <div class="info-row error-wrapper" ref="factory_period">
                <div class="key bold">Tháng bù trừ công nợ qua B11</div>
                <div class="value">
                  <ejs-datepicker
                    :key="datePickerKey.factoryPeriod"
                    :value="form.factoryCost.period"
                    format="MM/yyyy"
                    start="Year"
                    depth="Year"
                    :showClearButton="true"
                    :allowEdit="false"
                    :enabled="!isDisabledForm"
                    locale="vi"
                    @change="e => onChangeDate('factoryCost.period', e)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box-form">
          <!-- ROW: Mã dự án + Tên khách hàng -->
          <div class="row mt-2">
            <!-- Mã dự án -->
            <div class="col-md-6 col-12">
              <div class="info-row error-wrapper" ref="projectCode">
                <div class="key bold">Mã dự án</div>
                <div class="value">
                  <input
                    class="form-control"
                    v-model="form.projectCode"
                    disabled
                  />
                </div>
              </div>
            </div>

            <!-- Tên khách hàng (Tìm kiếm) -->
            <div class="col-md-6 col-12">
              <div class="info-row error-wrapper" ref="customerName">
                <div class="key bold">Tên khách hàng (Tìm kiếm)</div>
                <div class="value">
                  <CustomerSelect ref="customerSelect" 
                      v-model="khachhang_selected"
                      :customerName="khachhang_selected.text"
                      @select="onSelectCustomer"
                      :disabled="isDisabledForm"
                      :isSelectAll="false"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box-form">

          <div class="info-row">
            <div class="value wp100">

              <!-- Upload mới -->
              <AttachFile
                v-if="!isDisabledForm && !disabledFileAttach"
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
          <button class="btn btn-danger btn-sm" @click="hideModal"  v-if="!isViewDetail">
            <span class="icon fa fa-close"></span> Hủy bỏ
          </button>
          <!-- <button class="btn btn-primary" @click="onSave"><span class="icon one-save"></span>Lưu hợp đồng</button> -->
          <button @click="onSave" class="btn btn-second" style="width: 180px" v-if="!isViewDetail">
              <span class="icon one-save"></span> Lưu thay đổi
          </button>
        </div>

      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import AttachFile from './AttachFile.vue'
import API from './API'
import moment from 'moment'
import CustomerSelect from './CustomerSelect.vue'
export default {
  name: 'ProjectCreateDialog447',
  props:{
    isAdd: { type: Boolean, default: true },
    isViewDetail: { type: Boolean, default: false },
    data: { type: Object, default: () => ({}) }
  },
  components: { AttachFile, CustomerSelect },

  data() {
    return {
      target: '.main-wrapper',
      // header: 'Thêm mới thông tin chi tiết dự án',
      animationSettings: { effect: 'Zoom' },
      revenue_type_list: [
        { id: 0, text: 'Chọn loại...' },
        { id: 1, text: 'Sản phẩm phần mềm/Dịch vụ phần mềm' },
        { id: 2, text: 'Bán thiết bị phần cứng' },
        { id: 3, text: 'Cho thuê thiết bị phần cứng' },
        { id: 4, text: 'Kinh doanh thương mại' },
        { id: 5, text: 'Khác' },
      ],
      vat_rate_list: [
        { id: 5, text: '5%' },
        { id: 8, text: '8%' },
        { id: 10, text: '10%' },
        { id: 0, text: 'KCT' }
      ],
      product_list: [
        { id: 0, text: 'Chọn sản phẩm dịch vụ...' }
      ],
      cost_content_list: [
        { id: 0, text: 'Chọn nội dung...' },
      ],
      datePickerKey: {
        contractDate: 0,
        bbntDate: 0,
        customerPaymentDate: 0,
        invoiceDate: 0,
        period: 0,

        partnerContractDate: 0,
        partnerBbntDate: 0,
        partnerInvoiceDate: 0,
        partnerPaymentDate: 0,

        factoryOrderDate: 0,
        factoryBbntDate: 0,
        factoryInvoiceDate: 0,
        factoryPeriod: 0
      },
      form: {
        projectCode: 0,
        customerName: '',
        revenue: {
          customerName: '',
          revenueType: 0,
          revenueTypeOther: '',
          taxCode: '',
          contractNo: '',
          contractDate: null,
          bbntDate: null,
          customerPaymentDate: null,
          productId: 0,
          invoiceDate: null,
          serial: '',
          invoiceNo: '',
          totalAmount: '',
          contractRevenue: '',
          vatAmount: '',
          vatRate: 8,
          paymentDoc: '',
          period: null,
          serviceContent: '',
          serviceRate: '',
          salaryRevenue: '',

          totalAmount_display: '',
          contractRevenue_display: '',
          vatAmount_display: '',
          salaryRevenue_display: ''
        },
        partnerCost: {
          costContent: 0,
          costType: '',
          partnerName: '',
          contractNo: '',
          contractDate: null,
          bbntDate: null,
          serviceContent: '',
          invoiceDate: null,
          serial: '',
          invoiceNo: '',
          totalAmount: '',
          costAmount: '',
          vatAmount: '',
          vatRate: 8,
          paymentDate: null,
          paymentDoc: '',

          totalAmount_display: '',
          costAmount_display: '',
          vatAmount_display: '',
        },
        factoryCost: {
          costContent: 0,
          orderNo: '',
          orderDate: null,
          bbntDate: null,
          serviceContent: '',
          invoiceDate: null,
          serial: '',
          invoiceNo: '',
          totalAmount: '',
          costAmount: '',
          vatAmount: '',
          vatRate: 8,
          period: null,

          totalAmount_display: '',
          costAmount_display: '',
          vatAmount_display: ''
        }
      },

      khachhang_selected:{
        id: 0,
        selected:true,
        text:"Tìm kiếm khách hàng"
      },
      customerSelectKey:0,
      
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
      leader_list: []
    }
  },
  computed: {
    isDisabledForm() {
      return this.isViewDetail === true
    },
    header() {
      if (this.isViewDetail) {
        return 'Xem chi tiết thông tin dự án'
      }

      return this.isAdd
        ? 'Thêm mới thông tin chi tiết dự án'
        : 'Cập nhật thông tin chi tiết dự án'
    }
  },
  methods: {
    showModal() {
      this.$refs.popupProjectCreateDialog447.show()
    },
    hideModal() {
      this.$refs.popupProjectCreateDialog447.hide()
    },
    handleShowModal() {
      this.clear()
      setTimeout(() => {
        this.loadInitData()

        if (!this.isAdd && this.data) {
          this.initData()
        }
      }, 300)
    },
    initData() {
      const d = this.data
      if (!d) return
      this.form.project_123_id = d.project_123_id
      // ================= PROJECT =================
      this.form.projectCode = d.project_123_code || ''

      // ================= DOANH THU =================
      this.form.revenue.customerName = d.customer_name || ''
      this.form.revenue.revenueType = d.revenue_type || 0
      this.form.revenue.taxCode = d.tax_code || ''
      this.form.revenue.contractNo = d.contract_no || ''

      this.form.revenue.contractDate = d.contract_date || null
      this.form.revenue.bbntDate = d.bbnt_date || null
      this.form.revenue.customerPaymentDate = d.customer_payment_date || null

      this.form.revenue.productId = d.product_id || 0
      this.form.revenue.invoiceDate = d.invoice_date || null
      this.form.revenue.serial = d.serial || ''
      this.form.revenue.invoiceNo = d.invoice_no || ''

      this.form.revenue.totalAmount = d.total_amount || null
      this.form.revenue.contractRevenue = d.contract_revenue || null
      this.form.revenue.vatAmount = d.vat_amount || null
      this.form.revenue.vatRate = d.vat_rate ?? 8
      this.form.revenue.paymentDoc = d.payment_doc || ''

      this.form.revenue.period = d.period || null
      this.form.revenue.serviceContent = d.service_content || ''
      this.form.revenue.serviceRate = d.service_rate || null
      this.form.revenue.salaryRevenue = d.salary_revenue || null

      // ===== FORMAT MONEY (REVENUE) =====
      this.form.revenue.totalAmount_display =
        this.form.revenue.totalAmount
          ? Number(this.form.revenue.totalAmount).toLocaleString('vi-VN')
          : ''

      this.form.revenue.contractRevenue_display =
        this.form.revenue.contractRevenue
          ? Number(this.form.revenue.contractRevenue).toLocaleString('vi-VN')
          : ''

      this.form.revenue.vatAmount_display =
        this.form.revenue.vatAmount
          ? Number(this.form.revenue.vatAmount).toLocaleString('vi-VN')
          : ''

      this.form.revenue.salaryRevenue_display =
        this.form.revenue.salaryRevenue
          ? Number(this.form.revenue.salaryRevenue).toLocaleString('vi-VN')
          : ''

      // ================= PARTNER COST =================
      this.form.partnerCost.costType = d.cost_type || ''
      this.form.partnerCost.partnerName = d.partner_name || ''
      this.form.partnerCost.contractNo = d.partner_contract_no || ''

      this.form.partnerCost.contractDate = d.partner_contract_date || null
      this.form.partnerCost.bbntDate = d.partner_bbnt_date || null
      this.form.partnerCost.serviceContent = d.service_content || ''
      this.form.partnerCost.invoiceDate = d.partner_invoice_date || null

      this.form.partnerCost.serial = d.serial || ''
      this.form.partnerCost.invoiceNo = d.invoice_no || ''

      this.form.partnerCost.totalAmount = d.total_amount || null
      this.form.partnerCost.costAmount = d.cost_amount || null
      this.form.partnerCost.vatAmount = d.vat_amount || null
      this.form.partnerCost.vatRate = d.vat_rate ?? 8
      this.form.partnerCost.paymentDate = d.payment_date || null
      this.form.partnerCost.paymentDoc = d.payment_doc || ''

      // ===== FORMAT MONEY (PARTNER) =====
      this.form.partnerCost.totalAmount_display =
        this.form.partnerCost.totalAmount
          ? Number(this.form.partnerCost.totalAmount).toLocaleString('vi-VN')
          : ''

      this.form.partnerCost.costAmount_display =
        this.form.partnerCost.costAmount
          ? Number(this.form.partnerCost.costAmount).toLocaleString('vi-VN')
          : ''

      this.form.partnerCost.vatAmount_display =
        this.form.partnerCost.vatAmount
          ? Number(this.form.partnerCost.vatAmount).toLocaleString('vi-VN')
          : ''

      // ================= FACTORY COST =================
      this.form.factoryCost.orderNo = d.order_no || ''
      this.form.factoryCost.orderDate = d.order_date || null
      this.form.factoryCost.bbntDate = d.factory_bbnt_date || null
      this.form.factoryCost.serviceContent = d.factory_service_content || ''
      this.form.factoryCost.invoiceDate = d.factory_invoice_date || null
      this.form.factoryCost.serial = d.factory_serial || ''
      this.form.factoryCost.invoiceNo = d.factory_invoice_no || ''

      this.form.factoryCost.totalAmount = d.factory_total_amount || null
      this.form.factoryCost.costAmount = d.factory_cost_amount || null
      this.form.factoryCost.vatAmount = d.factory_vat_amount || null
      this.form.factoryCost.period = d.factory_period || null

      // ===== FORMAT MONEY (FACTORY) =====
      this.form.factoryCost.totalAmount_display =
        this.form.factoryCost.totalAmount
          ? Number(this.form.factoryCost.totalAmount).toLocaleString('vi-VN')
          : ''

      this.form.factoryCost.costAmount_display =
        this.form.factoryCost.costAmount
          ? Number(this.form.factoryCost.costAmount).toLocaleString('vi-VN')
          : ''

      this.form.factoryCost.vatAmount_display =
        this.form.factoryCost.vatAmount
          ? Number(this.form.factoryCost.vatAmount).toLocaleString('vi-VN')
          : ''

      // ================= FILE =================
      const files = d.files || []
      this.all_files = files.map(f => ({
        uid: 'db_' + f.file_attachment_id,
        file_attachment_id: f.file_attachment_id,
        file_name: f.file_name,
        file_path: f.file_path,
        is_new: false
      }))

      this.newFiles = []
      this.deletedFileIds = []
      this.disabledFileAttach = false

      // ===== FORCE RE-RENDER DATE PICKER =====
      Object.keys(this.datePickerKey).forEach(k => {
        this.datePickerKey[k]++
      })
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
    async onSelectCustomer(value){

      if (!value || !value.id) return
      const cus = await API.GetCustomerById(this, value.id)
      if (!cus) {
        this.$toast.warning('Không tìm thấy thông tin khách hàng')
        return
      }

      // ===== MAP SANG form.revenue =====
      this.form.revenue.customerName = cus.customer_name || ''
      this.form.revenue.taxCode = cus.taxcode || ''

      this.$toast.success('Đã lấy thông tin khách hàng')
    },
    clear() {
      this.form = {
        revenue: {
          customerName: '',
          revenueType: 0,
          revenueTypeOther: '',
          taxCode: '',
          contractNo: '',
          contractDate: null,
          bbntDate: null,
          customerPaymentDate: null,
          productId: 0,
          invoiceDate: null,
          serial: '',
          invoiceNo: '',
          totalAmount: '',
          contractRevenue: '',
          vatAmount: '',
          vatRate: 8,
          paymentDoc: '',
          period: null,
          serviceContent: '',
          serviceRate: '',
          salaryRevenue: ''
        },
        partnerCost: {
          costContent: 0,
          costType: '',
          partnerName: '',
          contractNo: '',
          contractDate: null,
          bbntDate: null,
          serviceContent: '',
          invoiceDate: null,
          serial: '',
          invoiceNo: '',
          totalAmount: '',
          costAmount: '',
          vatAmount: '',
          vatRate: 8,
          paymentDate: null,
          paymentDoc: ''
        },
        factoryCost: {
          costContent: 0,
          orderNo: '',
          orderDate: null,
          bbntDate: null,
          serviceContent: '',
          invoiceDate: null,
          serial: '',
          invoiceNo: '',
          totalAmount: '',
          costAmount: '',
          vatAmount: '',
          vatRate: 8,
          period: null
        }
        

      }
      this.cost_content_list = []

      this.$nextTick(()=>{
        this.khachhang_selected={
          id: 0,
          selected:true,
          text:"Tìm kiếm khách hàng"
        }
      })
      

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

      Object.keys(this.datePickerKey).forEach(k => {
        this.datePickerKey[k]++
      })
      this.customerSelectKey++
    },
    async loadPartnerCostContent() {
      // reset list
      this.cost_content_list = [
        { id: 0, text: 'Chọn nội dung...' }
      ]

      const data = await API.GetAllCostContent(this)

      if (!Array.isArray(data)) return

      this.cost_content_list.push(
        ...data.map(x => ({
          id: x.cost_content_id,
          text: `${x.cost_code} - ${x.cost_name}`
        }))
      )
    },
    async loadProductServiceCatalog() {
      // reset dropdown
      this.product_list = [
        { id: 0, text: 'Chọn sản phẩm dịch vụ...' }
      ]

      const res = await API.GetProductServiceCatalog(this)
      if (!res) return

      let data = res

      // API trả STRING JSON → parse
      if (typeof res === 'string') {
        try {
          data = JSON.parse(res)
        } catch (e) {
          console.error('Parse ProductServiceCatalog lỗi', e)
          return
        }
      }

      if (!Array.isArray(data)) return

      this.product_list.push(
        ...data.map(x => ({
          id: x.product_service_id,
          text: `${x.product_service_name}`
        }))
      )
    },

    async loadInitData() {
      // var data = await API.GetServiceOneBss(this)
      // if(data){
      //   data=JSON.parse(data)
      //   this.service_list = [
      //   { id: 0, text: 'Chọn' },
      //     ...data.map(x => ({
      //       id: x.device_profile_id,
      //       text: x.device_profile_name
      //     }))
      //   ]
      // }
      await Promise.all([
        // this.loadLeaderTTKDGP(),
        // this.loadStaffByDepartment(1),
        this.loadPartnerCostContent(),
        this.loadProductServiceCatalog()
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
    onChangeDate(fieldPath, event) {
      if (!event || !event.value) {
        this.$set(this.form, fieldPath, null)
        return
      }

      const value = moment(event.value).format(
        fieldPath.includes('period') ? 'MM/YYYY' : 'DD/MM/YYYY'
      )

      // set sâu theo path (revenue.xxx, partnerCost.xxx, factoryCost.xxx)
      const paths = fieldPath.split('.')
      let obj = this.form
      for (let i = 0; i < paths.length - 1; i++) {
        obj = obj[paths[i]]
      }
      obj[paths[paths.length - 1]] = value
    },
    formatMoney(fieldDisplay, fieldValue) {
      const getRef = (path) => {
        const keys = path.split('.')
        let obj = this.form
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]]
        }
        return {
          obj,
          key: keys[keys.length - 1]
        }
      }

      const displayRef = getRef(fieldDisplay)
      const valueRef = getRef(fieldValue)

      let raw = displayRef.obj[displayRef.key]
        ? displayRef.obj[displayRef.key].replace(/\D/g, '')
        : ''

      valueRef.obj[valueRef.key] = raw !== '' ? Number(raw) : null

      displayRef.obj[displayRef.key] =
        raw !== '' ? Number(raw).toLocaleString('vi-VN') : ''
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

    buildFormData(isUpdate = false) {
      const fd = new FormData()

      /* ================= PROJECT ================= */
      if (isUpdate) {
        fd.append('project_123_id', this.form.project_123_id)
      }

      /* ================= REVENUE ================= */
      const r = this.form.revenue

      fd.append('revenue.customer_name', r.customerName || '')
      fd.append('revenue.revenue_type', r.revenueType || 0)
      fd.append('revenue.revenue_type_other', r.revenueTypeOther || '')
      fd.append('revenue.tax_code', r.taxCode || '')
      fd.append('revenue.contract_no', r.contractNo || '')
      fd.append('revenue.serial', r.serial || '')
      fd.append('revenue.invoice_no', r.invoiceNo || '')
      fd.append('revenue.payment_doc', r.paymentDoc || '')
      fd.append('revenue.service_content', r.serviceContent || '')

      fd.append('revenue.product_id', r.productId || 0)
      fd.append('revenue.vat_rate', r.vatRate ?? 8)

      if (r.contractDate) fd.append('revenue.contract_date', r.contractDate)
      if (r.bbntDate) fd.append('revenue.bbnt_date', r.bbntDate)
      if (r.customerPaymentDate)
        fd.append('revenue.customer_payment_date', r.customerPaymentDate)
      if (r.invoiceDate) fd.append('revenue.invoice_date', r.invoiceDate)

      if (r.period) {
        // MM/YYYY → YYYYMM
        const [mm, yyyy] = r.period.split('/')
        fd.append('revenue.period', Number(`${yyyy}${mm}`))
      }

      fd.append('revenue.total_amount', r.totalAmount || 0)
      fd.append('revenue.contract_revenue', r.contractRevenue || 0)
      fd.append('revenue.vat_amount', r.vatAmount || 0)
      fd.append('revenue.salary_revenue', r.salaryRevenue || 0)
      fd.append('revenue.service_rate', r.serviceRate || 0)

      /* ================= PARTNER COST ================= */
      const p = this.form.partnerCost

      if (
        p.partnerName ||
        p.costAmount ||
        p.totalAmount
      ) {
        fd.append('partner_cost.cost_type', p.costType || '')
        fd.append('partner_cost.partner_name', p.partnerName || '')
        fd.append('partner_cost.contract_no', p.contractNo || '')
        fd.append('partner_cost.service_content', p.serviceContent || '')
        fd.append('partner_cost.serial', p.serial || '')
        fd.append('partner_cost.invoice_no', p.invoiceNo || '')
        fd.append('partner_cost.payment_doc', p.paymentDoc || '')

        fd.append('partner_cost.cost_content', p.costContent || 0)
        fd.append('partner_cost.vat_rate', p.vatRate ?? 8)

        if (p.contractDate)
          fd.append('partner_cost.contract_date', p.contractDate)
        if (p.bbntDate)
          fd.append('partner_cost.bbnt_date', p.bbntDate)
        if (p.invoiceDate)
          fd.append('partner_cost.invoice_date', p.invoiceDate)
        if (p.paymentDate)
          fd.append('partner_cost.payment_date', p.paymentDate)

        fd.append('partner_cost.total_amount', p.totalAmount || 0)
        fd.append('partner_cost.cost_amount', p.costAmount || 0)
        fd.append('partner_cost.vat_amount', p.vatAmount || 0)
      }

      /* ================= FACTORY COST ================= */
      const f = this.form.factoryCost

      if (
        f.costAmount ||
        f.totalAmount
      ) {
        fd.append('factory_cost.order_no', f.orderNo || '')
        fd.append('factory_cost.service_content', f.serviceContent || '')
        fd.append('factory_cost.serial', f.serial || '')
        fd.append('factory_cost.invoice_no', f.invoiceNo || '')

        fd.append('factory_cost.cost_content', f.costContent || 0)
        fd.append('factory_cost.vat_rate', f.vatRate ?? 8)

        if (f.orderDate)
          fd.append('factory_cost.order_date', f.orderDate)
        if (f.bbntDate)
          fd.append('factory_cost.bbnt_date', f.bbntDate)
        if (f.invoiceDate)
          fd.append('factory_cost.invoice_date', f.invoiceDate)

        if (f.period) {
          const [mm, yyyy] = f.period.split('/')
          fd.append('factory_cost.period', Number(`${yyyy}${mm}`))
        }

        fd.append('factory_cost.total_amount', f.totalAmount || 0)
        fd.append('factory_cost.cost_amount', f.costAmount || 0)
        fd.append('factory_cost.vat_amount', f.vatAmount || 0)
      }

      /* ================= FILE ================= */
      this.newFiles.forEach(f => {
        fd.append('new_files', f)
      })

      this.deletedFileIds.forEach(id => {
        fd.append('deleted_file_ids', id)
      })

      return fd
    },

    async onSave() {
      if (this.isViewDetail) return
      // if (!this.checkRequired()) return
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
      const formData = this.buildFormData(false)

      const result = await API.CreateProject447(this, formData)

      if (result === '1') {
        this.$toast.success('Thêm mới thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    async updateProject() {
      if (!this.form.project_123_id) {
        this.$toast.error('Không tìm thấy ID dự án')
        return
      }

      const formData = this.buildFormData(true)

      const result = await API.UpdateProject447(this, formData)

      if (result === '1') {
        this.$toast.success('Cập nhật thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    }
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
.section-title.red {
  color: #ef4444;
  border-left: 3px solid #ef4444;
  padding-left: 8px;
}

</style>
