<template>
  <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="briefing-summary page-content" style="top: 46px !important; bottom: 46px !important; overflow-x: auto !important;">
      <div class="box-form">
        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key w100 bold">Loại báo cáo</div>
                <div class="value">
                    <select2 
                        v-model='report_type_selected'
                        :options="report_type_list"
                        @select="onReportType"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w160 bold center">Phòng ban báo cáo</div>
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
                <div class="key w50 bold">Dự án</div>
                <div class="value">
                    <select2 
                        v-model='project_selected'
                        :options="project_list.map(e=>({id:e.project_id, text:e.project_name}))"
                         @select="onProjectChange"
                    />
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w70 bold">Tuần</div>
                <div class="value">
                    <select2 
                      v-model='week_selected'
                      :options="weekList"
                      @select="onWeekChange"
                    />
                </div>
            </div>
          </div>
        <div class="col-sm-2 col-12">
          <div class="info-row">
              <div class="key w70 bold">Trạng thái</div>
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
      </div>
      <!-- <div class="box-form" style="position: sticky; top: 0; background: #fff; z-index: 10; padding-bottom: 10px;" > -->
      <div class="box-form" style="overflow: visible !important;">
        <div class="info-row">
          <div class="group-buttons -bottom" style="margin-top: 0px !important;">
            <button  v-if="hasButtonPermission('UpdateBriefing')&&(status_selected==0||status_selected==3||status_selected==10)" class="btn btn-second" style="min-width: 100px;" @click.prevent="UpdateBriefing()">
              <span class="icon one-edit"></span>&nbsp;Điều chỉnh
            </button>
            <button v-if="hasButtonPermission('SubmitBriefing')&&(status_selected==0||status_selected==3||status_selected==10)" @click="onClickSubmitBriefing" class="btn btn-second" style="min-width: 100px;">
              <span class="icon fa fa-paper-plane"></span>&nbsp;Trình LĐ
            </button>
            <button v-if="hasButtonPermission('RatingBriefing')&&(status_selected==1||status_selected==10)" class="btn btn-second" style="min-width: 100px;" @click.prevent="RatingReport">
              <span class="icon fa fa-star"></span>&nbsp;Đánh giá chất lượng
            </button>
            <button v-if="hasButtonPermission('ReturnBriefing')&&(status_selected==1||status_selected==10)" class="btn btn-second" style="min-width: 100px;" @click.prevent="ReturnBriefing">
              <span class="icon fa fa-undo"></span>&nbsp;Trả lại
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-2 col-12">
            <div class="info-row">
                <div class="key bold">Ngày bắt đầu</div>
                <div class="value" style="padding-top: 6px !important;">
                    {{ngay_batdau}}
                </div>
            </div>
          </div>
          <div class="col-sm-3 col-12">
            <div class="info-row">
                <div class="key w200 bold">Ngày kết thúc mong muốn</div>
                <div class="value" style="padding-top: 6px !important;">
                    {{ngay_ketthuc}}
                </div>
            </div>
          </div>
        </div>
      <!-- <div style="max-height: calc(100vh - 200px); overflow-y: auto;"> -->
        <WorkTable ref="workTable" :workData="workData"
          :briefingType="report_type_selected"
          @onClickFeedback="onClickFeedback"
          @onAddUpdateDetail="onAddUpdateDetail"
          @onViewGroupDetail="onViewGroupDetail"
          @onRequestReport="onRequestReport"
          :status_id="status_selected"
        />
      <!-- </div> -->

      </div>
      
      
    </div>
    <!-- Modal -->
    <FeedbackModal ref="feedbackModal"
      :data="dataFeedback"
      :dictionary="briefingDictionary"
      @successFeedbackBriefingSummary="successFeedbackBriefingSummary"
    />
    <ApprovalSubmissionModal ref="approvalSubmissionModal"
      :arrBriefingIds="arrBriefingIds"
      @successApprovalBriefingSummary="successApprovalBriefingSummary"
    />
    <DictionaryWorkModal ref="dictionaryWorkModal"
      :isAdd="isAddBriefingDetail"
      :dictionary="briefingDictionary"
      :data="briefingDetail"
      @successAddUpdateBriefingSummaryDetail="successAddUpdateBriefingSummaryDetail"
    />
    <UpdateBriefingSummaryModal ref="updateBriefingSummaryModal"
      :data="briefingSummarySelected"
      @successUpdateBriefingSummary="successUpdateBriefingSummary"
    />
    <RatingModal ref="ratingModal"
      @onRatingSuccess="onRatingSuccess"
      :arrBriefingIds="arrBriefingIds"
    />
    <ReturnBriefingModal ref="returnBriefingModal"
    :arrBriefingIds="arrBriefingIds"
      @successReturnBriefingSummary="successReturnBriefingSummary"
    />

  </div>
</template>
<script>
import API from './API'
import moment from 'moment'
import WorkTable from './WorkTable.vue'
import FeedbackModal from './FeedbackModal.vue'
import ApprovalSubmissionModal from './ApprovalSubmissionModal.vue'
import DictionaryWorkModal from './DictionaryWorkModal.vue'
import UpdateBriefingSummaryModal from './UpdateBriefingSummaryModal.vue'
import RatingModal from './RatingModal.vue'
import ReturnBriefingModal from './ReturnBriefingModal.vue'
export default {
  name:'BriefingSummary',
  components:{
    WorkTable,
    FeedbackModal,
    ApprovalSubmissionModal,
    DictionaryWorkModal,
    UpdateBriefingSummaryModal,
    RatingModal,
    ReturnBriefingModal
  },
  data(){
    return {
      header: {
          title: "Quản lý báo cáo tuần",
          list: [
          ],
      },
      deparment_selected:0,
      department_list:[],
      project_selected:0,
      project_list:[],
      ngay_batdau:'',
      ngay_ketthuc:'',
      status_selected:10,
      status_list:[
        {
          id:10,
          text:'Tất cả'
        },
        {
          id:0,
          text:'Tạo mới'
        },
        {
          id:1,
          text:'Đã trình LĐ'
        },
        {
          id:2,
          text:'Đã đánh giá'
        },
        {
          id:3,
          text:'Đã trả lại'
        }
      ],
      workData: [],
      briefingSummarySelected:{},
      arrBriefingIds:[],
      dataFeedback:{},
      isAddBriefingDetail:true,
      briefingDictionary:{
        id:1,
        code:'PLAN',
        name:'Kế hoạch công việc'
      },
      briefingDetail:{},
      weekList:[],
      week_selected:null,
      report_type_selected:1,
      report_type_list:[
        {
          id:1,
          text:'BC phòng'
        },
        {
          id:2,
          text:'BC theo dự án'
        },
      ],
    }
  },
  methods:{
    onWeekChange(){
      const selected = this.weekList.find(w => w.id == this.week_selected);
      if (selected) {
        this.ngay_batdau = selected.start;
        this.ngay_ketthuc = selected.end;
      }
      this.initDataGrid()
    },
    onReportType(){
      this.initDataGrid()
    },
    getWeeksForSelect2(year) {
      const weeks = [];
      
      // Ngày đầu năm
      let date = new Date(year, 0, 1);

      // Đưa về thứ Hai của tuần đầu tiên
      while (date.getDay() !== 1) {
        date.setDate(date.getDate() - 1);
      }

      let week = 1;
      while (date.getFullYear() <= year || (date.getFullYear() === year + 1 && week <= 53)) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 6);

        // Format dd/MM/yyyy
        const fmt = d => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

        weeks.push({
          id: week,
          text: `Tuần ${week} (${fmt(start)} - ${fmt(end)})`,
          start: fmt(start),
          end: fmt(end)
        });

        // Sang tuần kế tiếp
        date.setDate(date.getDate() + 7);
        week++;
        if (date.getFullYear() > year + 1) break;
      }

      return weeks;
    },
    async onDeparmentChange(){
      var arrIds=[]
      if(this.deparment_selected==0){
        arrIds=this.department_list.filter(r=>r.id!=0).map(x=>x.id)
      }else{
        arrIds=[this.deparment_selected]
      }
      this.project_list=[
        {
          project_id: 0,
          project_name: "Tất cả"
        }
      ]
      var prList=await API.GetProjectByDepartmentBriefing(this, JSON.stringify(arrIds))
      this.project_list=this.project_list.concat(prList)
      this.project_selected=0

      this.initDataGrid()
    },
    onProjectChange(){
      this.initDataGrid()
    },
    onStatusChange(){
      this.initDataGrid()
    },
    onClickSubmitBriefing(){
      let dataChecks=this.$refs.workTable.getDataChecked()
      if(dataChecks.length==0){
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng báo cáo để thực hiện!')
        return
      }
      //
      this.arrBriefingIds=dataChecks.map(x=>x.briefing_summary_id)
      this.$refs.approvalSubmissionModal.showModal()
    },
    UpdateBriefing(){
      //
      let dataChecks=this.$refs.workTable.getDataChecked()
      if(dataChecks.length>1||dataChecks.length==0){
        this.$toast.error('Vui lòng chọn 1 dòng báo cáo để thực hiện!')
        return
      }
      this.briefingSummarySelected=dataChecks[0]
      this.$refs.updateBriefingSummaryModal.showModal()
    },
    onViewGroupDetail(group){
      //Nhấn chi tiết báo cáo phòng trỏ về báo cáo dự án
      this.report_type_selected=2
      this.deparment_selected=group.unit_id
      this.project_selected=0
      this.status_selected=10
      this.initDataGrid()
    },
    async deleteBriefingSummary(){
      let dsSlected=this.$refs.workTable.getDataChecked();
      if(dsSlected.length==0){
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng báo cáo để thực hiện!')
        return
      }
      let dsId=dsSlected.map(x=>x.briefing_summary_id)

      let result = await this.$confirm('Thông báo', `Bạn chắc chắn muốn xóa dữ liệu báo cáo đang chọn?`)
      if(result==0) return
      
      let data=await API.DeleteBriefingSummary(this, JSON.stringify(dsId))
      if(data=='1'){
          this.$toast.success('Xóa thành công!')
          this.initDataGrid()
      }else{
          this.$toast.error(data)
      }
    },
    onClickFeedback(value){
      this.briefingDictionary={
        id:value.dictionary_id,
        code:value.dictionary_code,
        name:value.dictionary_name
      }
      this.dataFeedback=Object.assign({},value)
      this.$refs.feedbackModal.showModal()
    },
    RatingReport(){
      let dataChecks=this.$refs.workTable.getDataChecked()
      if(dataChecks.length==0){
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng báo cáo để thực hiện!')
        return
      }
      //
      this.arrBriefingIds=dataChecks.map(x=>x.briefing_summary_id)
      this.$refs.ratingModal.showModal()
    },
    ReturnBriefing(){
      let dataChecks=this.$refs.workTable.getDataChecked()
      if(dataChecks.length==0){
        this.$toast.error('Vui lòng chọn ít nhất 1 dòng báo cáo để thực hiện!')
        return
      }
      //
      this.arrBriefingIds=dataChecks.map(x=>x.briefing_summary_id)
      this.$refs.returnBriefingModal.showModal()
    },
    onAddUpdateDetail(value){
      this.isAddBriefingDetail=value.is_add
      this.briefingDictionary={
        id:value.dictionary_id,
        code:value.dictionary_code,
        name:value.dictionary_name
      }
      this.briefingDetail=Object.assign({},value)

      this.$refs.dictionaryWorkModal.showModal()
    },
    successUpdateBriefingSummary(){
      //this.status_selected=0
      this.initDataGrid()
    },
    successApprovalBriefingSummary(){
      this.initDataGrid()
    },
    successFeedbackBriefingSummary(){
      this.initDataGrid()
    },
    onRatingSuccess(){
      this.initDataGrid()
    },
    successAddUpdateBriefingSummaryDetail(){
      this.initDataGrid()
    },
    successReturnBriefingSummary(){
      this.initDataGrid()
    },
    async onRequestReport(value){
      let result = await this.$confirm('Thông báo', `Hành động này sẽ gửi thông báo yêu cầu trình báo cáo đến từng cá nhân trong đơn vị. Thao tác không thể hoàn tác. Bạn có chắc muốn tiếp tục?`)
      if(result==0) return
      
      let dataRequest={
          briefing_summary_id:value.briefing_summary_id,
      }
      let data=await API.RequestNotificationBriefingSummary(this, dataRequest)
      if(data=='1'){
        this.$toast.success('Gửi thông báo thành công!')
        this.initDataGrid()
      }else{
        this.$toast.error(data)
      }
    },
    async initDataGrid(){
        var start_date=moment(this.ngay_batdau, 'DD/MM/YYYY').format('YYYYMMDD')
        var end_date=moment(this.ngay_ketthuc, 'DD/MM/YYYY').format('YYYYMMDD')

        var arrDepIds=[]
        if(this.deparment_selected==0){
          arrDepIds=this.department_list.filter(r=>r.id!=0).map(x=>x.id)
        }else{
          arrDepIds=[this.deparment_selected]
        }
        var arrProjectIds=[]
        if(this.project_selected==0){
          arrProjectIds=this.project_list.filter(r=>r.project_id!=0).map(x=>x.project_id)
        }else{
          arrProjectIds=[this.project_selected]
        }

        let dataRequest = {
          arrDepartmentIds: JSON.stringify(arrDepIds),
          arrProjectIds: JSON.stringify(arrProjectIds),
          status_id: this.status_selected,
          briefing_type:this.report_type_selected,
          start_date: start_date,
          end_date: end_date
        };

        var strData = await API.GetBriefingSummaryWithEF(this, dataRequest);
        var list = JSON.parse(strData);
        this.workData=list.concat([])
    },
    async loadDataPage(){
      var unitStr=await API.GetDepartmentBriefing(this)
      if(unitStr){
        this.department_list=JSON.parse(unitStr).map(x=>{
            return {
              id:x.department_id,
              text:x.department_name
            }
          }
        )
      }
      this.department_list.unshift({
        id:0,
        text:'Tất cả'
      })

      const currentYear = new Date().getFullYear();
      this.weekList = this.getWeeksForSelect2(currentYear);

      // 🔹 Xác định tuần hiện tại
      const today = new Date();
      today.setHours(0, 0, 0, 0); // bỏ giờ phút giây để so đúng ngày

      const currentWeek = this.weekList.find(week => {
        const [sd, sm, sy] = week.start.split('/').map(Number);
        const [ed, em, ey] = week.end.split('/').map(Number);
        const startDate = new Date(sy, sm - 1, sd);
        const endDate = new Date(ey, em - 1, ed);
        endDate.setHours(23, 59, 59, 999);
        return today >= startDate && today <= endDate;
      });

      console.log('currentWeek', currentWeek);

      if (currentWeek) {
        this.week_selected = currentWeek.id;
        this.ngay_batdau = currentWeek.start;
        this.ngay_ketthuc = currentWeek.end;
      }
      var arrIds=[]
      if(this.deparment_selected==0){
        arrIds=this.department_list.filter(r=>r.id!=0).map(x=>x.id)
        console.log('arrIds',arrIds)
      }else{
        arrIds=[this.deparment_selected]
      }
      this.project_list=[
        {
          project_id: 0,
          project_name: "Tất cả"
        }
      ]
      var prList=await API.GetProjectByDepartmentBriefing(this, JSON.stringify(arrIds))
      this.project_list=this.project_list.concat(prList)
      this.project_selected=0
      //Load nếu có query param default các giá trị theo param
      this.applyQueryParams()
      
      this.initDataGrid()
    },
    setCurrentWeek() {
      const today = new Date();
      const currentWeek = this.weekList.find(week => {
        // Chuyển 'dd/MM/yyyy' sang 'yyyy-MM-dd'
        const parseVNDate = str => {
          const [d, m, y] = str.split('/');
          return new Date(`${y}-${m}-${d}`);
        };

        const startDate = parseVNDate(week.start);
        const endDate = parseVNDate(week.end);

        return today >= startDate && today <= endDate;
      });

      console.log('currentWeek', currentWeek);
      if (currentWeek) {
        this.week_selected = currentWeek.id;
        this.ngay_batdau = currentWeek.start;
        this.ngay_ketthuc = currentWeek.end;
      }
    },
    applyQueryParams() {
      const query = this.$route.query;

      // 🔹 Loại báo cáo: 1 = theo phòng, khác 1 = theo dự án
      this.report_type_selected = Number(query.briefing_type || 1);

      // 🔹 Đơn vị (phòng)
      this.deparment_selected = Number(query.unit_id || 0);

      // 🔹 Gán trạng thái
      this.status_selected = Number(query.status_id || 10);

      // 🔹 Parse ngày từ query (định dạng YYYYMMDD)
      const parseQueryDate = (dateStr, fallbackMoment) => {
        if (!dateStr) return fallbackMoment.format("DD/MM/YYYY");
        return moment(dateStr, "YYYYMMDD").format("DD/MM/YYYY");
      };
      this.ngay_batdau = parseQueryDate(
        query.plan_start_day,
        moment().startOf("isoWeek")
      );
      this.ngay_ketthuc = parseQueryDate(
        query.plan_end_day,
        moment().endOf("isoWeek")
      );

      // 🔹 Nếu là loại báo cáo phòng ban
      if (this.report_type_selected == 1) {
        this.project_selected = 0;
      } 
      // 🔹 Nếu là loại báo cáo dự án
      else {
        this.deparment_selected=0
        this.project_selected = Number(query.project_id || 0);
      }

      // 🔹 Tự động chọn tuần tương ứng nếu trùng ngày
      if (this.weekList?.length) {
        const currentWeek = this.weekList.find(
          w => w.start == this.ngay_batdau && w.end == this.ngay_ketthuc
        )
        if (currentWeek) this.week_selected = currentWeek.id;
      }
    },

  },
  mounted(){
    setTimeout(()=>{
      this.loadDataPage()
      this.GetPermissionButtons()

      // 🔹 Auto close Select2 khi cuộn trong container .briefing-summary
      const closeAllSelect2 = () => {
        // Chỉ chọn các container Select2 đang mở bên trong .briefing-summary
        $('.briefing-summary .select2-container--open').each(function() {
          // Lấy select gốc trước container
          const $select = $(this).prev('select');
          if ($select.length && $select.data('select2')) {
            $select.select2('close'); // chỉ gọi trên instance thật sự
          }
        });
      };

      // Gắn listener scroll trên .briefing-summary
      $('.briefing-summary').on('scroll.select2close', closeAllSelect2);
    }, 200)
  }
}
</script>