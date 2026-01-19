// import Vue from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
// layouts
import BlankLayout from "@/layouts/BlankLayout";
import MainLayout from "@/layouts/MainLayout";
import Login from "@/modules/auth/login";
import token from "@/plugins/token";

import Main from "@/modules/home/Index";
import ManageMenu from "@/modules/system/menu/Menu";
import { hasPermission } from "@/utils/permission";
// Vue.use(Router)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "",
      name: "Main",
      meta: {
        title: "Trang chủ",
        requiresAuth: false,
      },
      component: MainLayout,
      children: [
        {
          path: "",
          name: "Home",
          component: Main,
          meta: {
            title: "Trang chủ",
          },
        },
      ],
    },
    //auth
    {
      path: "/auth",
      name: "auth",
      component: BlankLayout,
      meta: {
        requiresAuth: false,
        title: "Phân quyền",
      },
      children: [
        {
          path: "login",
          name: "Login",
          component: Login,
          meta: {
            requiresAuth: false,
            title: "Đăng nhập",
          },
        },
      ],
    },
    // system
    {
      path: "/system",
      name: "system",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Test demo thi cử",
      },
      children: [
        {
          path: "coordinator",
          name: "coordinator",
          component: () =>
            import("@/modules/system/work_coordinator/WorkCoordinator.vue"),
          meta: {
            requiresAuth: true,
            title: "Cấu hình nhân sự điều phối",
          },
        },
        {
          path: "managemenu",
          name: "managemenu",
          component: ManageMenu,
          meta: {
            requiresAuth: true,
            title: "Quản lý menu",
          },
        },
        {
          path: "permission",
          name: "permission",
          component: () => import("@/modules/system/permission/Permission.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý menu",
          },
        },

        {
          path: "user",
          name: "user",
          component: () => import("@/modules/system/user/User.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý người dùng",
          },
        },
        {
          path: "user-ttkdgp",
          name: "user-ttkdgp",
          component: () => import("@/modules/system/user_ttkdgp/UserTTKDGP.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý người dùng TTKDGP",
          },
        },
        {
          path: "department",
          name: "department",
          component: () => import("@/modules/system/department/Department.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý danh mục phòng ban",
          },
        },

        {
          path: "user-task-limit",
          name: "user-task-limit",
          component: () =>
            import("@/modules/system/user_task_limit/UserTaskLimit.vue"),
          meta: {
            requiresAuth: true,
            title: "Cấu hình giới hạn công việc giao tại thời điểm",
          },
        },
        {
          path: "project_department_briefing",
          name: "project_department_briefing",
          component: () =>
            import(
              "@/modules/system/project_department_briefing/ProjectDepartmentBriefing.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Gán dự án cho phòng ban trong báo cáo giao ban",
          },
        },
        {
          path: "department_user_briefing",
          name: "department_user_briefing",
          component: () =>
            import(
              "@/modules/system/department_user_briefing/DepartmentUserBriefing.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Gán người dùng phòng ban trong báo cáo giao ban",
          },
        },
        {
          path: "department_briefing",
          name: "department_briefing",
          component: () =>
            import(
              "@/modules/system/department_briefing/DepartmentBriefing.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Khai báo phòng ban báo cáo giao ban",
          },
        },

        {
          path: "service-catalog",
          name: "service-catalog",
          component: () =>
            import("@/modules/system/service/ServiceCatalog.vue"),
          meta: {
            requiresAuth: true,
            title: "Danh mục dịch vụ",
          },
        },
        {
          path: "dictionary-group",
          name: "dictionary-group",
          component: () =>
            import("@/modules/system/dictionary_group/DictionaryGroup.vue"),
          meta: {
            requiresAuth: true,
            title: "Danh mục nhóm công việc",
          },
        },
        {
          path: "task-dictionary",
          name: "task-dictionary",
          component: () =>
            import("@/modules/system/task_dictionary/TaskDictionary.vue"),
          meta: {
            requiresAuth: true,
            title: "Danh mục loại công việc",
          },
        },

        {
          path: "sync-device-profile-bss",
          name: "sync-device-profile-bss",
          component: () =>
            import("@/modules/system/sync_device_profile_bss/SyncDeviceProfileBss.vue"),
          meta: {
            requiresAuth: true,
            title: "Đồng bộ loại hình thuê bao từ OneBss",
          },
        },

        {
          path: "department_user_group",
          name: "department_user_group",
          component: () =>
            import("@/modules/system/department_user_group/DepartmentUserGroup.vue"),
          meta: {
            requiresAuth: true,
            title: "Gán người dùng phòng ban vào nhóm",
          },
        },

        {
          path: "job_work_position_user",
          name: "job_work_position_user",
          component: () =>
            import("@/modules/system/job_work_position_user/JobWorkPositionUser.vue"),
          meta: {
            requiresAuth: true,
            title: "Gán vị trí công việc cho nhân sự",
          },
        },

        {
          path: "system-document",
          name: "system-document",
          component: () =>
            import("@/modules/system/document/SystemDocument.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý tài liệu hệ thống",
          },
        },


      ],
    },
    //work
    {
      path: "/work",
      name: "work",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Test demo thi cử",
      },
      children: [
        {
          path: "schedulemanagement",
          name: "schedulemanagement",
          component: () =>
            import("@/modules/work/schedule_management/ScheduleManagement.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý đặt lịch hẹn",
          },
        },
        {
          path: "servicedeclare",
          name: "servicedeclare",
          component: () =>
            import("@/modules/work/service_declare/ServiceDeclare.vue"),
          meta: {
            requiresAuth: true,
            title: "Khai báo dịch vụ",
          },
        },
        {
          path: "1_2_starreport",
          name: "1_2_starreport",
          component: () =>
            import(
              "@/modules/work/report/individual_work_report/1_2_Star_individual_task_report/1_2_Star_Report.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Báo cáo các task 1-2 sao của cá nhân",
          },
        },
        {
          path: "send_mail_am",
          name: "send_mail_am",
          component: () =>
            import(
              "@/modules/work/report/send_mail_am/SendMailAm.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Gửi thông báo nhắc nhở AM",
          },
        },
        {
          path: "individualwork",
          name: "individualwork",
          component: () =>
            import(
              "@/modules/work/report/individual_work_report/IndividualWorkReport.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Thống kê lượng công việc cá nhân",
          },
        },
        {
          path: "personal_bsc_scores",
          name: "personal_bsc_scores",
          component: () =>
            import(
              "@/modules/work/report/personal_bsc_scores/PersonalBSCScores.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Thống kê BSC cá nhân",
          },
        },
        {
          path: "workplan",
          name: "workplan",
          component: () => import("@/modules/work/work_plan/WorkPlan.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý công việc",
          },
        },
        {
          path: "project",
          name: "project",
          component: () =>
            import("@/modules/work/project/pipeline/Project.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý dự án",
          },
        },
        {
          path: "task_detail/:id",
          name: "task_detail",
          component: () => import("@/modules/work/work_detail/TaskDetail.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý dự án",
          },
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/modules/work/dashboard/Dashboard.vue"),
          meta: {
            requiresAuth: true,
            title: "Dashboard",
          },
        },
        {
          path: "kanban",
          name: "kanban",
          component: () => import("@/modules/work/kanban/Work_Kanban.vue"),
          meta: {
            requiresAuth: true,
            title: "Kanban",
          },
        },
        {
          path: "board",
          name: "board",
          component: () =>
            import("@/modules/work/kanban/kanban_board/Board.vue"),
          meta: {
            requiresAuth: true,
            title: "board",
          },
        },
        {
          path: "dashboard_person",
          name: "dashboard_person",
          component: () =>
            import("@/modules/work/dashboard_person/DashboardPerson.vue"),
          meta: {
            requiresAuth: true,
            title: "Dashboard quản lý công việc",
          },
        },
        {
          path: "weekly_personal_task",
          name: "weekly_personal_task",
          component: () =>
            import(
              "@/modules/work/report/weekly_personal_task/WeeklyPersonalTask.vue"
            ),
          meta: {
            requiresAuth: true,
            title:
              "Dashboard thống kê công việc trong ngày/tuần theo thời gian mỗi ngày",
          },
        },
        {
          path: "current_work_dashboard",
          name: "current_work_dashboard",
          component: () =>
            import(
              "@/modules/work/report/current_work_dashboard/CurrentWorkDashboard.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Báo cáo công việc cá nhân tại thời điểm hiện tại",
          },
        },
        {
          path: "effective_resource_management",
          name: "effective_resource_management",
          component: () =>
            import(
              "@/modules/work/effective_resource_management/EffectiveResourceManagement.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Quản lý hiệu quả nguồn lực",
          },
        },
        {
          path: "dashboard_effective_resource_management",
          name: "dashboard_effective_resource_management",
          component: () =>
            import(
              "@/modules/work/dashboard_effective_resource_management/DashboardEffectiveResourceManagement.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Dashboard Quản lý hiệu quả nguồn lực",
          },
        },
        {
          path: "briefing_summary",
          name: "briefing_summary",
          component: () =>
            import("@/modules/work/briefing_summary/BriefingSummary.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý báo cáo giao ban công việc",
          },
        },
        {
          path: "i12_evaluation_dashboard",
          name: "i12_evaluation_dashboard",
          component: () =>
            import(
              "@/modules/work/i12_evaluation_dashboard/i12_evaluation_dashboard.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Bảng đánh giá I12",
          },
        },
        {
          path: "user_day_off",
          name: "user_day_off",
          component: () => import("@/modules/work/user_day_off/UserDayOff.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý ngày công chuẩn",
          },
        },
        {
          path: "personal_bsc_scores",
          name: "personal_bsc_scores",
          component: () =>
            import(
              "@/modules/work/report/personal_bsc_scores/PersonalBSCScores.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Thống kê BSC cá nhân",
          },
        },

        {
          path: "presale_book_monthly_report",
          name: "presale_book_monthly_report",
          component: () =>
            import(
              "@/modules/work/report/presale_book_monthly_report/PresaleBookMonthlyReport.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Báo cáo tổng hợp dữ liệu BookPS theo tháng",
          },
        },
        {
          path: "presale_book_weekly_report",
          name: "presale_book_weekly_report",
          component: () =>
            import(
              "@/modules/work/report/presale_book_weekly_report/PresaleBookWeeklyReport.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Báo cáo tổng hợp dữ liệu BookPS theo tuần",
          },
        },

        {
          path: "violationreport",
          name: "violationreport",
          component: () =>
            import(
              "@/modules/work/report/violation_report/ViolationReport.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Thống kê vi phạm theo tháng",
          },
        },

        // hỗ trợ khách hàng
        {
          path: "request_management",
          name: "request_management",
          component: () =>
            import(
              "@/modules/work/request_management/RequestManagement.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Quản lý yêu cầu",
          },
        },

        // thống kêhỗ trợ khách hàng
        {
          path: "request_management_statistical",
          name: "request_management_statistical",
          component: () =>
            import(
              "@/modules/work/request_management_statistical/RequestManagementStatistical.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Thống kê hỗ trợ khách hàng",
          },
        },

      ],
    },
    //test
    {
      path: "/test",
      name: "test",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Test moodle",
      },
      children: [
        // {
        //   path: 'moodle',
        //   name: 'moodle',
        //   component: () => import('@/modules/moodle_test/Moodle.vue'),
        //   meta: {
        //     requiresAuth: true,
        //     title: 'Quản lý công việc',
        //   },
        // },
        {
          path: "test-modal-base",
          name: "test-modal-base",
          component: () => import("@/modules/test/TestBaseModal.vue"),
          meta: {
            requiresAuth: true,
            title: "Test modal base",
          },
        },
      ],
    },
    // bsc
    {
      path: "/bsc",
      name: "bsc",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "BSC",
      },
      children: [
        //Thư viện BSC giao cho nlđ
        {
          path: "library-bsc",
          name: "library-bsc",
          component: () => import("@/modules/bsc/library_bsc/LibraryBSC.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý thư viện BSC",
          },
        },
        {
          path: "management_bsc",
          name: "management_bsc",
          component: () =>
            import("@/modules/bsc/management_bsc/ManagementBSC.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý chỉ số BSC cá nhân/Phòng ban",
          },
        },

        {
          path: 'bsc_assign_user',
          name: 'bsc_assign_user',
          component: () => import('@/modules/bsc/bsc_assign_user/BSCAssignUser.vue'),
          meta: {
            requiresAuth: true,
            title: 'Giao chỉ số BSC cá nhân',
          },
        },

        {
          path: 'config_formula_bsc',
          name: 'config_formula_bsc',
          component: () => import('@/modules/bsc/config_formula_bsc/ConfigFormulaBSC.vue'),
          meta: {
            requiresAuth: true,
            title: 'Cấu hình công thức chỉ số BSC',
          },
        },
        {
          path: 'update_result_bsc',
          name: 'update_result_bsc',
          component: () => import('@/modules/bsc/update_result_bsc/UpdateResultBSC.vue'),
          meta: {
            requiresAuth: true,
            title: 'Cập nhật kết quả chỉ số BSC',
          },
        },
        {
          path: 'dashboard_bsc_user',
          name: 'dashboard_bsc_user',
          component: () => import('@/modules/bsc/dashboard_bsc_user/DashboardBscUser.vue'),
          meta: {
            requiresAuth: true,
            title: 'Dashboard BSC cá nhân',
          },
        },

        {
          path: 'bsc_individual_summary',
          name: 'bsc_individual_summary',
          component: () => import('@/modules/bsc/bsc_individual_summary/BscIndividualSummary.vue'),
          meta: {
            requiresAuth: true,
            title: 'Báo cáo tổng hợp kết quả BSC từng cá nhân',
          },
        },
      ],
    },
    {
      path: "/kpi",
      name: "kpi",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "KPI",
      },
      children: [
        {
          path: "library-kpi",
          name: "library-kpi",
          component: () => import("@/modules/kpi/library_kpi/LibraryKPI.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý thư viện KPI",
          },
        },
        {
          path: "management_kpi",
          name: "management_kpi",
          component: () =>
            import("@/modules/kpi/management_kpi/ManagementKPI.vue"),
          meta: {
            requiresAuth: true,
            title: "Quản lý chỉ số KPI cá nhân/Phòng ban",
          },
        },
        {
          path: 'assignment_kpi',
          name: 'assignment_kpi',
          component: () => import('@/modules/kpi/assignment_kpi/AssignmentKPI.vue'),
          meta: {
            requiresAuth: true,
            title: 'Giao chỉ số KPI Phòng ban/Cá nhân',
          },
        },
        {
          path: 'formula_config_kpi',
          name: 'formula_config_kpi',
          component: () => import('@/modules/kpi/formula_config_kpi/FormulaConfigKpi.vue'),
          meta: {
            requiresAuth: true,
            title: 'Cấu hình công thức tính chỉ số KPI',
          }
        },
        {
          path: 'assignment_kpi_result',
          name: 'assignment_kpi_result',
          component: () => import('@/modules/kpi/assignment_kpi_result/AssignmentKPIResult.vue'),
          meta: {
            requiresAuth: true,
            title: 'Cập nhật kết quả chỉ số KPI phòng ban/Cá nhân',
          }
        },
        {
          path: 'dashboard_personal_kpi',
          name: 'dashboard_personal_kpi',
          component: () => import('@/modules/kpi/dashboard_personal_kpi/DashboardPersonalKpi.vue'),
          meta: {
            requiresAuth: true,
            title: 'Dashboard KPI cá nhân',
          }
        },
        {
          path: 'personal_overview_kpi',
          name: 'personal_overview_kpi',
          component: () => import('@/modules/kpi/personal_overview_kpi/PersonalOverviewKpi.vue'),
          meta: {
            requiresAuth: true,
            title: 'KPI cá nhân',
          }
        },
        {
          path: 'department_overview_kpi',
          name: 'department_overview_kpi',
          component: () => import('@/modules/kpi/department_overview_kpi/DepartmentOverviewKpi.vue'),
          meta: {
            requiresAuth: true,
            title: 'KPI phòng ban',
          }
        },

      ]
    },
    {
      path: "/competency",
      name: "competency",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Theo dõi năng lực",
      },
      children: [
        {
          path: "indicator-config",
          name: "indicator-config",
          component: () => import("@/modules/competency_management/indicator_config/IndicatorConfig.vue"),
          meta: {
            requiresAuth: true,
            title: "Cấu hình chỉ số năng lực",
          },
        },
        {
          path: "am-capability-tracking",
          name: "am-capability-tracking",
          component: () => import("@/modules/competency_management/am_capability_tracking/AmCapabilityTracking.vue"),
          meta: {
            requiresAuth: true,
            title: "Theo dõi năng lực AM",
          },
        },

        {
          path: "am_capability_report",
          name: "am_capability_report",
          component: () => import("@/modules/competency_management/am_capability_report/AmCapabilityReport.vue"),
          meta: {
            requiresAuth: true,
            title: "Báo cáo năng lực AM",
          },
        },
        //
        {
          path: "am_capability_dashboard",
          name: "am_capability_dashboard",
          component: () => import("@/modules/competency_management/am_capability_dashboard/AmCapabilityDashboard.vue"),
          meta: {
            requiresAuth: true,
            title: "Dashboard năng lực AM",
          },
        },
        //
        // Giao diện thẩm định năng lực AM 
        {
          path: "am_capability_appraisal",
          name: "am_capability_appraisal",
          component: () => import("@/modules/competency_management/am_capability_appraisal/AmCapabilityAppraisal.vue"),
          meta: {
            requiresAuth: true,
            title: "Thẩm định năng lực AM",
          }
        }
      ]
    },
    //Project
    {
      path: "/project",
      name: "project",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Dự án",
      },
      children: [
        {
          path: "developmentunit",
          name: "developmentunit",
          component: () =>
            import("@/modules/project/development_unit/DevelopmentUnit.vue"),
          meta: {
            title: "Đơn vị phát triển dự án",
          },
        },
        {
          path: "projectpipeline",
          name: "projectpipeline",
          component: () => import("@/modules/project/pipeline/Project.vue"),
          meta: {
            title: "Dự án theo Pipeline",
          },
        },
        {
          path: "dashboard_pipeline",
          name: "dashboard_pipeline",
          component: () =>
            import(
              "@/modules/project/dashboard_pipeline/DashboardPipeline.vue"
            ),
          meta: {
            requiresAuth: true,
            title: "Dashboard Pipeline",
          },
        },
        {
          path: "ProjectCost",
          name: "ProjectCost",
          component: () =>
            import("@/modules/project/project_cost/ProjectCost.vue"),
          meta: {
            title: "Quản lý chi phí dự án",
          },
        },
      ],
    },
    //Khách hàng
    //Project
    {
      path: "/customer",
      name: "customer",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Khách hàng",
      },
      children: [
        {
          path: "customermanagement",
          name: "customermanagement",
          component: () => import("@/modules/customer//Customer.vue"),
          meta: {
            title: "Quản lý khách hàng",
          },
        },
      ],
    },
    //Đơn đặt hàng
    {
      path: "/order",
      name: "order",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Đơn đặt hàng",
      },
      children: [
        {
          path: "ordermanagement",
          name: "ordermanagement",
          component: () =>
            import("@/modules/order/manage/Order_Management.vue"),
          meta: {
            title: "Quản lý đơn đặt hàng",
          },
        },
        {
          path: "financial",
          name: "financial",
          component: () =>
            import("@/modules/order/financial/Revenue_Reconciliation.vue"),
          meta: {
            title: "Quản lý đơn đặt hàng",
          },
        },
        {
          path: "orderreport",
          name: "orderreport",
          component: () => import("@/modules/order/report/OrderReport.vue"),
          meta: {
            title: "Báo cáo thống kê",
          },
        },
      ],
    },
    // doanh thu và chi phí
    {
      path: "/finance",
      name: "finance",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Doanh thu & Chi phí",
      },
      children: [
        {
          path: "plannedrevenue",
          name: "plannedrevenue",
          component: () =>
            import("@/modules/finance/planned_revenue/PlannedRevenue.vue"),
          meta: {
            title: "Doanh thu theo kế hoạch",
          },
        },
        {
          path: "financedashboard",
          name: "financedashboard",
          component: () =>
            import("@/modules/finance/dashboard/FinanceDashboard.vue"),
          meta: {
            title: "Dashboard doanh thu",
          },
        },
        {
          path: "revenue",
          name: "revenue",
          component: () => import("@/modules/finance/revenue/Revenue.vue"),
          meta: {
            title: "Doanh thu",
          },
        },
        {
          path: "reportrevenue",
          name: "reportrevenue",
          component: () =>
            import(
              "@/modules/finance/revenue_statistics_report/ReportRevenue.vue"
            ),
          meta: {
            title: "Báo cáo thống kê doanh thu",
          },
        },
        {
          path: "governmentcontract",
          name: "governmentcontract",
          component: () => import("@/modules/finance/contract/Contract.vue"),
          meta: {
            title: "Hợp đồng chính quyền số",
          },
        },
        {
          path: "contractmanagement",
          name: "contractmanagement",
          component: () => import("@/modules/finance/contract_management/ContractManagement.vue"),
          meta: {
            title: "Quản lý hợp đồng",
          },
        },
        {
          path: "medicalcontract",
          name: "medicalcontract",
          component: () => import("@/modules/finance/contract/Contract.vue"),
          meta: {
            title: "Hợp đồng y tế số",
          },
        },
        {
          path: "plannedrevenueregion",
          name: "plannedrevenueregion",
          component: () =>
            import(
              "@/modules/finance/planned_revenue_region/PlannedRevenueRegion.vue"
            ),
          meta: {
            title: "Doanh thu theo kế hoạch địa bàn",
          },
        },
        {
          path: "actualrevenueregion",
          name: "actualrevenueregion",
          component: () =>
            import(
              "@/modules/finance/actual_revenue_region/ActualRevenueRegion.vue"
            ),
          meta: {
            title: "Doanh thu theo thực tế địa bàn",
          },
        },
        {
          path: "financedashboardregion",
          name: "financedashboardregion",
          component: () =>
            import(
              "@/modules/finance/dashboard_region/FinanceDashboardRegion.vue"
            ),
          meta: {
            title: "Dashboard doanh thu địa bàn",
          },
        },

        {
          path: "projectedrevenueregion",
          name: "projectedrevenueregion",
          component: () =>
            import(
              "@/modules/finance/projected_revenue_region/ProjectedRevenueRegion.vue"
            ),
          meta: {
            title: "Doanh thu dự kiến địa bàn",
          },
        },

        {
          path: "reportrevenueregion",
          name: "reportrevenueregion",
          component: () =>
            import(
              "@/modules/finance/region_revenue_report/RegionRevenueReport.vue"
            ),
          meta: {
            title: "Báo cáo thống kê doanh thu địa bàn",
          },
        },

      ],
    },
    {
      path: "/contract",
      name: "contract",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Yêu cầu",
      },
      children: [
        {
          path: "contract_123",
          name: "contract_123",
          component: () =>
            import(
              "@/modules/contract_123/Contract123.vue"
            ),
          meta: {
            title: "Hợp đồng 123",
          },
        },
        {
          path: "contract123_coefficient_approval",
          name: "contract123_coefficient_approval",
          component: () =>
            import(
              "@/modules/contract_123/contract123_coefficient_approval/Contract123CoefficientApproval.vue"
            ),
          meta: {
            title: "P.ĐHKD Xác nhận hệ số",
          },
        },
        {
          path: "contract123_data_approval",
          name: "contract123_data_approval",
          component: () =>
            import(
              "@/modules/contract_123/contract123_data_approval/Contract123DataApproval.vue"
            ),
          meta: {
            title: "P.KTĐH Kiểm tra và xác nhận dữ liệu",
          },
        },

      ]
    },
    {
      path: "/request",
      name: "request",
      component: MainLayout,
      meta: {
        requiresAuth: true,
        title: "Yêu cầu",
      },
      children: [
        {
          path: "list_request",
          name: "list_request",
          component: () => import("@/modules/request/ListRequest.vue"),
          meta: {
            requiresAuth: true,
            title: "Danh sách yêu cầu",
          },
        },
        {
          path: "config_user_domain",
          name: "config_user_domain",
          component: () =>
            import("@/modules/request/config_user_domain/ConfigUserDomain.vue"),
          meta: {
            requiresAuth: true,
            title: "Cấu hình người dùng - dịch vụ",
          },
        },
        {
          path: "create_request",
          name: "create_request",
          component: () =>
            import("@/modules/request/AddUpdateRequestModalBase.vue"),
          meta: {
            requiresAuth: true,
            title: "Tạo yêu cầu",
          },
        },
      ],
    },
    //error
    {
      path: "/",
      name: "error",
      component: BlankLayout,
      meta: {
        requiresAuth: false,
        title: "Error",
      },
      children: [
        {
          path: "403",
          name: "Forbidden",
          component: () => import("@/modules/error/Forbidden.vue"),
          meta: { title: "403 - Không có quyền truy cập" },
        },
        {
          path: ":pathMatch(.*)*",
          name: "NotFound",
          component: () => import("@/modules/error/NotFound.vue"),
          meta: { title: "404 - Không tìm thấy trang" },
        },
      ],
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (
//     to.meta.requiresAuth == undefined ||
//     to.meta.requiresAuth == null ||
//     to.meta.requiresAuth == true
//   ) {
//     if (token.isAuthenticated()) next();
//     else next({ name: 'Login' });
//   } else {
//     next();
//   }
// });
router.beforeEach((to, from, next) => {
  // 1️ Kiểm tra route có tồn tại không
  const matchedRoute = router.getRoutes().find((r) => r.name === to.name);
  if (!matchedRoute) {
    console.warn("Route không tồn tại:", to.fullPath);
    next({ name: "NotFound" });
    return;
  }

  // 2️ Kiểm tra yêu cầu đăng nhập
  const requiresAuth =
    to.meta.requiresAuth === undefined ||
    to.meta.requiresAuth === null ||
    to.meta.requiresAuth === true;

  if (requiresAuth) {
    if (!token.isAuthenticated()) {
      next({ name: "Login" });
      return;
    }

    // 3️ Kiểm tra quyền truy cập
    const menus = JSON.parse(localStorage.getItem("userMenus") || "[]");
    const routeName = to.name;
    const allowed = hasPermission(routeName, menus);

    if (allowed) {
      next();
    } else {
      console.warn("Không có quyền truy cập route:", routeName);
      next({ name: "Forbidden" }); // 🔥 chuyển qua trang 403 Forbidden
    }
  } else {
    next();
  }
});
export default router;
