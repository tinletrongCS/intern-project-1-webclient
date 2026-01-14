/**
 * Cấu hình các cột chi tiết cho báo cáo I10
 * Được sử dụng bởi DetailModal và Export Excel
 */
export const DETAIL_COLUMNS = [
  {
    key: "ma_task",
    label: "Mã công việc",
    apiField: "code",
    fallbacks: ["ma_task", "task_id"],
    width: 150,
  },
  {
    key: "noi_dung_task",
    label: "Nội dung công việc",
    apiField: "description",
    fallbacks: ["noi_dung_task", "noi_dung", "content"],
    width: 100,
  },
  {
    key: "ngay_bd_kh",
    label: "Ngày bắt đầu kế hoạch",
    apiField: "schedule_start",
    fallbacks: ["ngay_bd_kh", "start_date_plan"],
    width: 170,
    type: "date",
  },
  {
    key: "ngay_kt_kh",
    label: "Ngày kết thúc kế hoạch",
    apiField: "schedule_end",
    fallbacks: ["ngay_kt_kh", "end_date_plan"],
    width: 170,
    type: "date",
  },
  {
    key: "ngay_bd_tt",
    label: "Ngày bắt đầu thực tế",
    apiField: "actual_start",
    fallbacks: ["ngay_bd_tt", "start_date_actual"],
    width: 170,
    type: "date",
  },
  {
    key: "ngay_kt_tt",
    label: "Ngày kết thúc thực tế",
    apiField: "actual_end",
    fallbacks: ["ngay_kt_tt", "end_date_actual"],
    width: 170,
    type: "date",
  },
  {
    key: "muc_do",
    label: "Mức độ",
    apiField: "priority",
    fallbacks: ["muc_do"],
    width: 150,
    type: "string",
  },
  {
    key: "gio_giao",
    label: "Giờ giao",
    apiField: "planned_duration_time",
    fallbacks: ["gio_giao"],
    width: 150,
    type: "number",
  },
  {
    key: "gio_thuc_hien",
    label: "Giờ thực hiện",
    apiField: "actual_execution_time",
    fallbacks: ["gio_thuc_hien"],
    width: 150,
    type: "number",
  },
  {
    key: "nguoi_giao",
    label: "Người giao",
    apiField: "u_ins_name",
    fallbacks: ["nguoi_giao", "user_ins"],
    width: 150,
  },
  {
    key: "nguoi_nhan",
    label: "Người nhận",
    apiField: "assignee_name",
    fallbacks: ["nguoi_nhan", "assignee_id"],
    width: 150,
  },
  {
    key: "la_ldvttp_giao",
    label: "Có phải do lãnh đạo VTTP giao?",
    apiField: "la_ldvttp_giao",
    fallbacks: ["la_ldvttp_giao"],
    width: 250,
    type: "boolean",
  },
  {
    key: "tinh_trang",
    label: "Tình trạng",
    apiField: "status_name",
    fallbacks: ["tinh_trang", "status_id", "status"],
    width: 250,
    type: "status",
  },
  {
    key: "danh_gia_chat_luong",
    label: "Đánh giá chất lượng",
    apiField: "rating",
    fallbacks: ["danh_gia_chat_luong", "quality_rating"],
    type: "number",
    width: 150,
  },
  {
    key: "nhom_cv",
    label: "Nhóm công việc",
    apiField: "task_group",
    fallbacks: ["nhom_cv", "group_id"],
    width: 250,
    type: "text",
  },
  {
    key: "loai_cv",
    label: "Loại công việc",
    apiField: "task_type",
    fallbacks: ["loai_cv", "type_id"],
    width: 250,
    type: "text",
  },
  {
    key: "board_name",
    label: "Bảng công việc",
    apiField: "board_name",
    fallbacks: ["board_name"],
    width: 250,
    type: "text",
  },
  {
    key: "step_name",
    label: "Giai đoạn",
    apiField: "step_name",
    fallbacks: ["step_name"],
    width: 150,
    type: "text",
  },
];

/**
 * Format ánh xạ cho status
 */
export const STATUS_MAP = {
  0: "Chưa Hoàn thành Trễ hạn",
  1: "Hoàn thành Đúng Hạn",
  2: "Hoàn thành Trễ hạn",
  "chua-hoan-thanh": "Chưa Hoàn thành Trễ hạn",
  "hoan-thanh-dung-han": "Hoàn thành Đúng Hạn",
  "hoan-thanh-tre-han": "Hoàn thành Trễ hạn",
};

/**
 * Hàm để ánh xạ dữ liệu API sang format hiển thị
 */
export function mapTaskData(apiTask) {
  const mapped = {};

  DETAIL_COLUMNS.forEach((col) => {
    let value = apiTask[col.apiField];

    // Nếu không tìm thấy, thử fallbacks
    if (value === undefined || value === null) {
      for (const fallback of col.fallbacks) {
        if (apiTask[fallback] !== undefined && apiTask[fallback] !== null) {
          value = apiTask[fallback];
          break;
        }
      }
    }

    // Format giá trị theo loại
    if (col.type === "date") {
      mapped[col.key] = formatDate(value);
    } else if (col.type === "status") {
      // Nếu value là text (status_name), dùng trực tiếp; nếu là number (status_id), dùng map
      if (typeof value === "string") {
        mapped[col.key] = value || "-";
      } else {
        mapped[col.key] = STATUS_MAP[value] || value || "-";
      }
    } else if (col.type === "boolean") {
      mapped[col.key] = value ? "Có" : "Không";
    } else {
      mapped[col.key] = value || "-";
    }
  });

  return mapped;
}

/**
 * Hàm để format ngày tháng
 */
export function formatDate(dateString) {
  if (!dateString || dateString === "-") return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Hàm để tạo header cho Excel/Table
 */
export function getColumnHeaders() {
  return DETAIL_COLUMNS.map((col) => col.label);
}

/**
 * Hàm để lấy độ rộng cột cho Excel
 */
export function getColumnWidths() {
  return DETAIL_COLUMNS.map((col) => ({ wch: col.width }));
}

/**
 * Hàm để tạo data row cho Excel/Table
 */
export function mapTaskToRowData(apiTask) {
  const mapped = mapTaskData(apiTask);
  return DETAIL_COLUMNS.map((col) => mapped[col.key] || "-");
}
