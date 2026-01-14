import axios from "axios"
export default {
  async getDs(parent, path, defaultValue, isLoading = false) {
    try {
      if (isLoading) parent.loading(true)
      let response = await axios.get(path)
      if (isLoading) parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        return defaultValue
      }
    } catch (e) {
      if (isLoading) parent.loading(false)
      return defaultValue
    }
  },
  async postDs(parent, path, data, defaultValue, isLoading = false) {
    try {
      if (isLoading) parent.loading(true)
      let response = await axios.post(path, data)
      if (isLoading) parent.loading(false)
      if (response && response.data && response.data.success) {
        return response.data.data
      } else {
        return defaultValue
      }
    } catch (e) {
      if (isLoading) parent.loading(false)
      return defaultValue
    }
  },
  async GetAllUnit(parent) {
    return await this.getDs(parent, 'revenue/PlannedRevenueRegion/GetUnitAll', null)
  },
  async GetUnitByParentId(parent, arrParentId, level) {
    return await this.getDs(parent, `revenue/PlannedRevenueRegion/GetUnitByParentId?arrParentId=${arrParentId}&&level=${level}`, [])
  },

  async GetReportRevenueRegionTotalDetailWithField(parent, regionId, year) {
    return await this.getDs(parent, `revenue/Report/GetReportRevenueRegionTotalDetailWithField?regionId=${regionId}&&year=${year}`, null, true)
  },
  async GetReportRevenueRegionFieldDetailWithUnit(parent, regionId, year) {
    return await this.getDs(parent, `revenue/Report/GetReportRevenueRegionFieldDetailWithUnit?regionId=${regionId}&&year=${year}`, null, true)
  },
  async GetReportRevenueRegionPeriodDetailWithUnit(parent, regionId, year) {
    return await this.getDs(parent, `revenue/Report/GetReportRevenueRegionPeriodDetailWithUnit?regionId=${regionId}&&year=${year}`, null, true)
  },
  // Mock function - thay thế bằng API call thực tế
  async GetRegionList(context) {
    // Trả về danh sách địa bàn
    return [
      { id: 1, name: 'Địa bàn 1' },
      { id: 2, name: 'Địa bàn 2' },
      { id: 3, name: 'Địa bàn 3' }
    ];
  },

  // Mock function - thay thế bằng API call thực tế
  async GetCentersByRegion(context, regionId) {
    // Trả về danh sách trung tâm theo địa bàn
    const mockData = {
      1: [ // Địa bàn 1
        { id: 1, name: 'Trung tâm A' },
        { id: 2, name: 'Trung tâm B' },
        { id: 3, name: 'Trung tâm C' }
      ],
      2: [ // Địa bàn 2
        { id: 4, name: 'Trung tâm D' },
        { id: 5, name: 'Trung tâm E' },
        { id: 6, name: 'Trung tâm F' }
      ],
      3: [ // Địa bàn 3
        { id: 7, name: 'Trung tâm G' },
        { id: 8, name: 'Trung tâm H' },
        { id: 9, name: 'Trung tâm I' }
      ]
    };
    return mockData[regionId] || [];
  },

  // Mock function - thay thế bằng API call thực tế
  async GetDepartmentsByCenter(context, centerId) {
    // Trả về danh sách phòng ban theo trung tâm
    const mockData = {
      1: [ // Trung tâm A
        { id: 1, name: 'Phòng ban 1' },
        { id: 2, name: 'Phòng ban 2' },
        { id: 3, name: 'Phòng ban 3' }
      ],
      7: [ // Trung tâm G
        { id: 4, name: 'Phòng ban 4' },
        { id: 5, name: 'Phòng ban 5' },
        { id: 6, name: 'Phòng ban 6' }
      ]
    };
    return mockData[centerId] || [];
  },

  // Mock function - thay thế bằng API call thực tế
  async GetRegionRevenueReport(context, regionId, centerId, departmentId, fromDate, toDate) {
    // Trả về dữ liệu báo cáo doanh thu theo địa bàn
    // Tham số:
    // - regionId: ID địa bàn
    // - centerId: ID trung tâm  
    // - departmentId: ID phòng ban
    // - fromDate: Ngày bắt đầu (format: MM/YYYY)
    // - toDate: Ngày kết thúc (format: MM/YYYY)

    // Mock data - thay thế bằng API call thực tế
    const mockResponse = [
      {
        id: 1,
        stt: 1,
        ten_chi_tieu: "SPDV Số doanh nghiệp HCM-VTU-BDG",
        ma_dich_vu: "DN",
        dia_ban: this.getSelectedDiaBanName(regionId, centerId, departmentId),
        ke_hoach_vnpt_ttp: 950000000,
        ke_hoach_ttkd_vinaphone: 750000000,
        thuc_hien_6t_vnpt_ttp: 580000000,
        thuc_hien_6t_ttkd_vinaphone: 450000000,
        ty_le_6t_percent: "60.6%",
        du_kien_9t_vnpt_ttp: 720000000,
        du_kien_9t_ttkd_vinaphone: 580000000,
        ty_le_9t_percent: "76.5%",
        du_kien_nam_vnpt_ttp: 920000000,
        du_kien_nam_ttkd_vinaphone: 740000000,
        ty_le_nam_percent: "97.6%",
        children: [
          {
            id: 11,
            stt: "-",
            ten_chi_tieu: "Phần mềm / Dịch vụ phần mềm",
            ma_dich_vu: "SW",
            dia_ban: this.getSelectedDiaBanName(regionId, centerId, departmentId),
            ke_hoach_vnpt_ttp: 570000000,
            ke_hoach_ttkd_vinaphone: 450000000,
            thuc_hien_6t_vnpt_ttp: 348000000,
            thuc_hien_6t_ttkd_vinaphone: 270000000,
            ty_le_6t_percent: "60.6%",
            du_kien_9t_vnpt_ttp: 432000000,
            du_kien_9t_ttkd_vinaphone: 348000000,
            ty_le_9t_percent: "76.5%",
            du_kien_nam_vnpt_ttp: 552000000,
            du_kien_nam_ttkd_vinaphone: 444000000,
            ty_le_nam_percent: "97.6%"
          },
          {
            id: 12,
            stt: "-",
            ten_chi_tieu: "Bản thiết bị phần cứng",
            ma_dich_vu: "HW",
            dia_ban: this.getSelectedDiaBanName(regionId, centerId, departmentId),
            ke_hoach_vnpt_ttp: 380000000,
            ke_hoach_ttkd_vinaphone: 300000000,
            thuc_hien_6t_vnpt_ttp: 232000000,
            thuc_hien_6t_ttkd_vinaphone: 180000000,
            ty_le_6t_percent: "60.6%",
            du_kien_9t_vnpt_ttp: 288000000,
            du_kien_9t_ttkd_vinaphone: 232000000,
            ty_le_9t_percent: "76.5%",
            du_kien_nam_vnpt_ttp: 368000000,
            du_kien_nam_ttkd_vinaphone: 296000000,
            ty_le_nam_percent: "97.6%"
          }
        ]
      },
      {
        id: 2,
        stt: 2,
        ten_chi_tieu: "Chính quyền số HCM-VTU-BDG",
        ma_dich_vu: "GOV",
        dia_ban: this.getSelectedDiaBanName(regionId, centerId, departmentId),
        ke_hoach_vnpt_ttp: 850000000,
        ke_hoach_ttkd_vinaphone: 650000000,
        thuc_hien_6t_vnpt_ttp: 520000000,
        thuc_hien_6t_ttkd_vinaphone: 400000000,
        ty_le_6t_percent: "61.3%",
        du_kien_9t_vnpt_ttp: 650000000,
        du_kien_9t_ttkd_vinaphone: 520000000,
        ty_le_9t_percent: "78.0%",
        du_kien_nam_vnpt_ttp: 830000000,
        du_kien_nam_ttkd_vinaphone: 640000000,
        ty_le_nam_percent: "98.0%",
        children: [
          {
            id: 21,
            stt: "-",
            ten_chi_tieu: "Phần mềm / Dịch vụ phần mềm",
            ma_dich_vu: "SW",
            dia_ban: this.getSelectedDiaBanName(regionId, centerId, departmentId),
            ke_hoach_vnpt_ttp: 510000000,
            ke_hoach_ttkd_vinaphone: 390000000,
            thuc_hien_6t_vnpt_ttp: 312000000,
            thuc_hien_6t_ttkd_vinaphone: 240000000,
            ty_le_6t_percent: "61.3%",
            du_kien_9t_vnpt_ttp: 390000000,
            du_kien_9t_ttkd_vinaphone: 312000000,
            ty_le_9t_percent: "78.0%",
            du_kien_nam_vnpt_ttp: 498000000,
            du_kien_nam_ttkd_vinaphone: 384000000,
            ty_le_nam_percent: "98.0%"
          },
          {
            id: 22,
            stt: "-",
            ten_chi_tieu: "Bản thiết bị phần cứng",
            ma_dich_vu: "HW",
            dia_ban: this.getSelectedDiaBanName(regionId, centerId, departmentId),
            ke_hoach_vnpt_ttp: 340000000,
            ke_hoach_ttkd_vinaphone: 260000000,
            thuc_hien_6t_vnpt_ttp: 208000000,
            thuc_hien_6t_ttkd_vinaphone: 160000000,
            ty_le_6t_percent: "61.3%",
            du_kien_9t_vnpt_ttp: 260000000,
            du_kien_9t_ttkd_vinaphone: 208000000,
            ty_le_9t_percent: "78.0%",
            du_kien_nam_vnpt_ttp: 332000000,
            du_kien_nam_ttkd_vinaphone: 256000000,
            ty_le_nam_percent: "98.0%"
          }
        ]
      }
    ];

    return mockResponse;
  },

  // Helper function để lấy tên địa bàn được chọn
  getSelectedDiaBanName(regionId, centerId, departmentId) {
    if (departmentId > 0) {
      const departments = {
        1: 'Phòng ban 1',
        2: 'Phòng ban 2',
        3: 'Phòng ban 3',
        4: 'Phòng ban 4',
        5: 'Phòng ban 5',
        6: 'Phòng ban 6'
      };
      return departments[departmentId] || 'Phòng ban';
    } else if (centerId > 0) {
      const centers = {
        1: 'Trung tâm A',
        2: 'Trung tâm B',
        3: 'Trung tâm C',
        4: 'Trung tâm D',
        5: 'Trung tâm E',
        6: 'Trung tâm F',
        7: 'Trung tâm G',
        8: 'Trung tâm H',
        9: 'Trung tâm I'
      };
      return centers[centerId] || 'Trung tâm';
    } else if (regionId > 0) {
      const regions = {
        1: 'Địa bàn 1',
        2: 'Địa bàn 2',
        3: 'Địa bàn 3'
      };
      return regions[regionId] || 'Địa bàn';
    }
    return 'Tất cả';
  }
};
