<template>
  <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
    :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupCheckImportIndicatorUserScore"
    :showCloseIcon="true" width="80%" :isModal="true" :target="target" :header="header" :open="handleShowModal">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <KDataGrid ref="gridCheckImport" :columns="columns" :dataSource="dataSources" :enable-paging-server="false"
          :allowPaging="true" :showFilter="false" :showColumnCheckbox="false" :enabledSelectFirstRow="false"
          :showSTT="true" @queryCellInfo="queryCellInfo" />

        <div class="group-buttons -bottom right" style="margin-top: 5px !important;">
          <button @click="onSave" class="btn btn-second nocorner" style="width: 180px">
            <span class="icon one-save"></span> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import API from "../API.js";

export default {
  name: "ImportContractExcelModal",
  props: {
    dataCheckImports: { type: Object, default: () => ({ total: 0, valid: 0, invalid: 0, is_valid: true, rows: [] }) },
    importItems: { type: Array, default: () => [] },
    headerDepth: { type: Number, default: 1 },
  },

  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="icon one-notepad"></span> Kiểm tra dữ liệu import hợp đồng`,
      columns: [
        // ✅ Thêm 2 cột này để nhìn rõ lỗi theo dòng (khuyên nên có)
        { fieldName: "row_number", headerText: "Dòng", textAlign: "center", width: 80 },
        { fieldName: "error_message", headerText: "Lỗi", textAlign: "left", width: 380 },

        // ===== các cột bạn đang có (giữ nguyên) =====
        {
          fieldName: "contract_no",
          headerText: "Số hợp đồng",
          allowFiltering: true,
          textAlign: "left",
          width: "150",
        },
        {
          fieldName: "contract_name",
          headerText: "Tên hợp đồng",
          allowFiltering: true,
          width: "250",
        },
        {
          fieldName: "customer_name",
          headerText: "Khách hàng",
          allowFiltering: true,
          extAlign: "center",
          width: "180",
        },
        // {
        //   headerText: "MỐC THỜI GIAN HỢP ĐỒNG",
        //   columns: [
        //     {
        //       // field: "contract_sign_date", 
        //       fieldName: "contract_sign_date",
        //       headerText: "Ngày ký HĐ",
        //       textAlign: "center",
        //       width: 130,
        //       valueAccessor: this.formatDate,
        //     },
        //     {
        //       fieldName: "contract_execution_time",
        //       headerText: "Thời gian thực hiện",
        //       textAlign: "left",
        //       width: 170,
        //     },
        //     {
        //       fieldName: "contract_expiration_date",
        //       headerText: "Ngày hết hạn",
        //       textAlign: "center",
        //       width: 130,
        //       // valueAccessor: this.formatDate,
        //     },
        //     {
        //       fieldName: "test_payment_date",
        //       headerText: "Đợt NT/TT",
        //       textAlign: "left",
        //       width: 150,
        //     },
        //   ],
        // },
        {
          // field: "contract_sign_date", 
          fieldName: "contract_sign_date",
          headerText: "Ngày ký HĐ",
          textAlign: "center",
          width: 130,
          type: "date",
          format: "dd/MM/yyyy"
          // valueAccessor: this.formatDate,
        },
        {
          fieldName: "contract_execution_time",
          headerText: "Thời gian thực hiện",
          textAlign: "left",
          width: 170,
        },
        {
          fieldName: "contract_expiration_date",
          headerText: "Ngày hết hạn",
          textAlign: "center",
          width: 130,
          type: "date",
          format: "dd/MM/yyyy"
          // valueAccessor: this.formatDate,
        },
        {
          fieldName: "test_payment_date",
          headerText: "Đợt NT/TT",
          textAlign: "left",
          width: 150,
        },
        {
          fieldName: "contract_value",
          headerText: "Giá trị hợp đồng",
          allowFiltering: true,
          textAlign: "right",
          width: "200",
        },
        {
          fieldName: "arr_serviceids",
          headerText: "Sản phẩm dịch vụ",
          allowFiltering: true,
          textAlign: "left",
          width: "200",
          // valueAccessor: (value, row) => this.serviceNamesAccessor(value, row),
        },
        {
          fieldName: "revenue_value",
          headerText: "Giá trị doanh thu",
          allowFiltering: true,
          textAlign: "right",
          width: "250",
        },
        {
          fieldName: "contract_type",
          headerText: "Loại hợp đồng",
          allowFiltering: true,
          width: "200",
          // valueAccessor: (value, row) =>
          //   this.transferDataDropdown(this.type_contract_list, "contract_type")(value, row),
          textAlign: "left",
        },
        {
          fieldName: "form_payment_selected",
          headerText: "Hình thức thanh toán",
          allowFiltering: true,
          width: "200",
          // valueAccessor: (value, row) =>
          //   this.transferDataDropdown(this.form_payment_list, "form_payment_selected")(value, row),
          textAlign: "left",
        },
        {
          fieldName: "form_contract_execution",
          headerText: "Hình thức thực hiện",
          allowFiltering: true,
          textAlign: "center",
          width: "250",
          // valueAccessor: (value, row) =>
          //   this.transferDataDropdown(this.form_contract_execution_list, "form_contract_execution")(value, row),
          textAlign: "left",
        },
        // {
        //   headerText: "NGHIỆM THU & THANH TOÁN",
        //   columns: [
        //     {
        //       fieldName: "acceptance_sign_date",
        //       headerText: "Ngày ký NT",
        //       textAlign: "center",
        //       width: 130,
        //       // valueAccessor: this.formatDate,
        //     },
        //     {
        //       fieldName: "acceptance_value",
        //       headerText: "Giá trị NT",
        //       textAlign: "right",
        //       width: 110,
        //     },
        //     {
        //       fieldName: "invoice_value",
        //       headerText: "Giá trị hoá đơn",
        //       textAlign: "right",
        //       width: 150,
        //     },
        //     {
        //       fieldName: "invoice_date",
        //       headerText: "Ngày xuất hoá đơn",
        //       textAlign: "center",
        //       width: 170,
        //       // valueAccessor: this.formatDate,
        //     },
        //     {
        //       fieldName: "contract_payment_status",
        //       headerText: "Tình trạng thanh toán",
        //       // valueAccessor: (value, row) =>
        //       //   this.transferDataDropdown(this.status_payment_contract_list, "contract_payment_status")(value, row),
        //       textAlign: "left",
        //     },
        //   ],
        // },
        {
          fieldName: "acceptance_sign_date",
          headerText: "Ngày ký NT",
          textAlign: "center",
          width: 130,
          type: "date",
          format: "dd/MM/yyyy"
          // valueAccessor: this.formatDate,
        },
        {
          fieldName: "acceptance_value",
          headerText: "Giá trị NT",
          textAlign: "right",
          width: 110,
        },
        {
          fieldName: "invoice_value",
          headerText: "Giá trị hoá đơn",
          textAlign: "right",
          width: 150,
        },
        {
          fieldName: "invoice_date",
          headerText: "Ngày xuất hoá đơn",
          textAlign: "center",
          width: 170,
          type: "date",
          format: "dd/MM/yyyy"
          // valueAccessor: this.formatDate,
        },
        {
          fieldName: "contract_payment_status",
          headerText: "Tình trạng thanh toán",
          // valueAccessor: (value, row) =>
          //   this.transferDataDropdown(this.status_payment_contract_list, "contract_payment_status")(value, row),
          textAlign: "left",
        },
        {
          fieldName: "full_name",
          headerText: "Nhân sự hợp đồng",
          allowFiltering: true,
          textAlign: "left",
          width: "170",
        },
        {
          fieldName: "revenue_type",
          headerText: "Loại doanh thu",
          allowFiltering: true,
          // valueAccessor: (value, row) => this.transferDataDropdown(this.type_revenue, "revenue_type")(value, row),
          textAlign: "left",
          width: "150",
        },
      ],
      dataSources: [],
    };
  },
  computed: {
    // normalizedColumns() {
    //   const normalize = (col) => {
    //     // Nếu là group column
    //     if (Array.isArray(col.columns) && col.columns.length > 0) {
    //       return {
    //         ...col,
    //         columns: col.columns.map(normalize)
    //       };
    //     }

    //     return {
    //       ...col,
    //       field: col.fieldName
    //     };
    //   };
    //   return (this.columns || []).map(normalize);
    // }
  },
  methods: {
    // ===== PUBLIC METHODS =====
    showModal() {
      this.$refs.popupCheckImportIndicatorUserScore.show();
    },
    hideModal() {
      this.$refs.popupCheckImportIndicatorUserScore.hide();
    },

    handleShowModal() {
      this.clear();
      setTimeout(() => {
        this.initDataPopup();
      }, 200);
    },

    clear() {
      this.dataSources = [];
    },

    // ✅ Core: map rows -> dataSources
    // initDataPopup() {
    //   const rows = Array.isArray(this.dataCheckImports?.rows) ? this.dataCheckImports.rows : [];

    //   const startRow = (this.headerDepth || 1) + 1; // excel row where data begins (1-index)
    //   const items = Array.isArray(this.importItems) ? this.importItems : [];

    //   this.dataSources = rows.map((r) => {
    //     // mapped từ backend (nếu có)
    //     const mappedFromApi = r.mapped && typeof r.mapped === "object" ? r.mapped : null;

    //     // fallback: lấy từ danh sách import ban đầu theo row_number
    //     const idx = Number(r.row_number) - startRow; // row_number=3, headerDepth=2 => startRow=3 => idx=0
    //     const mappedFromFile = idx >= 0 && idx < items.length ? items[idx] : {};

    //     const mapped = mappedFromApi || mappedFromFile || {};

    //     const errors = Array.isArray(r.errors) ? r.errors : [];
    //     const error_message = errors.map((e) => `${e.column || e.field}: ${e.message}`).join("; ");

    //     return {
    //       row_number: r.row_number,
    //       is_error: !r.is_valid,
    //       is_valid: !!r.is_valid,
    //       errors,
    //       error_message,
    //       ...mapped,
    //     };
    //   });

    //   // this.dataSources = this.dataSources[0]?.errors
    // },
    initDataPopup() {
      const apiRows = Array.isArray(this.dataCheckImports?.rows) ? this.dataCheckImports.rows : [];
      const items = Array.isArray(this.importItems) ? this.importItems : [];

      // excel row where data begins (1-index), VD: headerDepth=2 => startRow=3
      const startRow = (this.headerDepth || 1) + 1;

      // Tạo map: row_number -> errors (API chỉ trả dòng sai)
      const errorMap = new Map();
      apiRows.forEach((r) => {
        const rn = Number(r?.row_number);
        errorMap.set(rn, Array.isArray(r?.errors) ? r.errors : []);
      });

      // Nếu ở cha bạn đã delete field gốc và chỉ còn *_import
      // thì map ngược để HIỂN THỊ lên grid.
      const importTextFields = [
        "contract_type",
        "form_payment_selected",
        "form_contract_execution",
        "contract_payment_status",
        "revenue_type",
        "arr_serviceids",
      ];

      this.dataSources = items.map((item, idx) => {
        // Ưu tiên RowNumber đã set từ cha; fallback theo index
        const row_number = Number(item?.RowNumber ?? item?.row_number ?? (startRow + idx));

        const errors = errorMap.get(row_number) || [];
        const error_message = errors
          .map((e) => `${e.column || e.field}: ${e.message}`)
          .join("; ");

        // Clone để tránh mutate trực tiếp prop
        const mapped = { ...(item || {}) };

        // Map ngược *_import -> field gốc để hiển thị nếu field gốc bị delete ở component cha
        importTextFields.forEach((f) => {
          const k = `${f}_import`;
          if ((mapped[f] === null || mapped[f] === undefined || mapped[f] === "") && mapped[k] != null) {
            mapped[f] = String(mapped[k]).trim();
          }
        });

        return {
          row_number,
          is_error: errors.length > 0,
          is_valid: errors.length === 0,
          errors,
          error_message,
          ...mapped,
        };
      });
      // this.normalizedColumns
      this.$refs.gridCheckImport.refresh();
    }

    ,

    // async onSave() {
    //   const rowErrors = this.dataSources.filter((x) => x.is_error);
    //   if (rowErrors.length > 0) {
    //     this.$msgBox.error("Thông báo", "Danh sách dữ liệu vẫn tồn tại lỗi, vui lòng kiểm tra lại!");
    //     return;
    //   }

    //   const confirm = await this.$confirm("Thông báo", "Bạn có chắc chắn muốn import danh sách này không?");
    //   if (confirm == 0) return;

    //   const rs = await API.ImportIndicatorUserScore(this, this.dataSources);
    //   if (rs == "1") {
    //     this.$msgBox.success("Thông báo", "Import thành công!");
    //     this.$emit("successImportData");
    //     this.hideModal();
    //   } else {
    //     this.$msgBox.error("Thông báo", rs);
    //   }
    // },
    async onSave() {
      // 1) Chặn nếu còn lỗi
      const rowErrors = (this.dataSources || []).filter((x) => x?.is_error);
      if (rowErrors.length > 0) {
        this.$msgBox.error("Thông báo", "Danh sách dữ liệu vẫn tồn tại lỗi, vui lòng kiểm tra lại!");
        return;
      }

      // 2) Confirm
      const confirm = await this.$confirm("Thông báo", "Bạn có chắc chắn muốn import danh sách này không?");
      if (confirm == 0) return;

      // 3) Build payload sạch (bỏ field phục vụ UI)
      const payload = (this.dataSources || []).map((row) => {
        const r = { ...(row || {}) };

        // bỏ các field UI / grid
        delete r.errors;
        delete r.error_message;
        delete r.is_error;
        delete r.is_valid;
        delete r.row_number;   // nếu BE không cần row_number kiểu snake_case
        delete r.row_stt;      // nếu có
        // (tuỳ bạn) nếu không muốn gửi cả contract_type dạng hiển thị:
        // delete r.contract_type; ...

        // đảm bảo RowNumber tồn tại (BE hay dùng)
        // ưu tiên RowNumber nếu có, fallback row_number
        if (r.RowNumber == null) {
          // nếu row_number bị delete ở trên thì lấy từ row trước khi delete
          // => làm an toàn: set RowNumber từ row.row_number
          r.RowNumber = row?.RowNumber ?? row?.row_number ?? null;
        }

        return r;
      });

      // 4) Call API import
      // ⚠️ Đổi đúng tên hàm import của Contract nếu cần (ImportIndicatorUserScore có vẻ không đúng module Contract)
      const rs = await API.ImportContractManagementFromExcel(this, payload);

      if (!rs) {
        this.$msgBox.error("Thông báo", "Import thất bại hoặc không nhận được phản hồi từ server.");
        return;
      }

      const inserted = Number(rs.inserted || 0);
      const total = Number(rs.total || payload.length || 0);
      const skipped = Number(rs.skipped || 0);
      const errors = Array.isArray(rs.errors) ? rs.errors : [];

      if (errors.length > 0) {
        // Nếu BE trả lỗi theo dòng
        const first = errors[0];
        this.$msgBox.error(
          "Thông báo",
          `Import có lỗi (${errors.length} dòng). Ví dụ: Dòng ${first.RowNumber || first.rowNumber || "?"}: ${first.message || ""}`
        );
        return;
      }

      // Thành công
      this.$toast.success(`Import thành công ${inserted}/${total} dòng${skipped ? ` (bỏ qua ${skipped})` : ""}!`);
      this.$emit("successImportData");
      this.hideModal();

    }
    ,

    queryCellInfo(args) {
      try {
        const data = args?.data;
        if (!data) return;

        // Có lúc Syncfusion gọi queryCellInfo cho header/empty row => args.row/cell có thể undefined
        if (data?.is_error && args?.row?.style) {
          args.row.style.backgroundColor = "#fff0f0";
        }

        const field = args?.column?.field || args?.column?.fieldName;
        if (field === "error_message" && data?.is_error && args?.cell?.style) {
          args.cell.style.color = "#842029";
          args.cell.style.fontWeight = "600";
        }
      } catch (e) {
        console.error("queryCellInfo crashed:", e, args);
      }
    }
    ,

    // ===== placeholder helpers (nếu bạn đã có ở chỗ khác thì giữ nguyên) =====
    formatDate(field, data, column) {
      const dateString = data[field];
      if (!dateString) return '';
      return moment(dateString).format('DD/MM/YYYY');
    },

    // Nếu bạn có các list/dropdown + service accessor ở component gốc thì OK,
    // nếu chưa có ở đây thì cần inject/props hoặc import.
    serviceNamesAccessor(value, row) {
      const ids = this.normalizeIds(row?.arr_serviceids ?? value);
      if (ids.length === 0) return '';

      const nameMap = this.buildServiceNameMap();
      const names = ids
        .map(id => nameMap.get(id))
        .filter(Boolean);

      return names.join(', ');
    },
    transferDataDropdown(list, field) {
      return (value) => value;
    },
    normalizeIds(val) {
      if (val == null) return [];

      // đã là array
      if (Array.isArray(val)) {
        return val.map(x => Number(x)).filter(n => Number.isFinite(n));
      }

      // là string JSON: "[120,117]" hoặc "["120","117"]"
      if (typeof val === 'string') {
        const s = val.trim();
        if (!s) return [];

        try {
          const arr = JSON.parse(s);
          if (Array.isArray(arr)) {
            return arr.map(x => Number(x)).filter(n => Number.isFinite(n));
          }
        } catch (_) {
          // fallback: "120,117"
          return s.split(',').map(x => Number(x.trim())).filter(n => Number.isFinite(n));
        }
      }

      return [];
    },
    buildServiceNameMap() {
      const map = new Map();

      (this.all_services || []).forEach(s => {
        const id = Number(s.id ?? s.service_id ?? s.serviceId);
        const name = s.text ?? s.service_name ?? s.serviceName ?? s.name;
        if (Number.isFinite(id) && name) map.set(id, String(name));
      });

      return map;
    },
  }

};
</script>
