<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'top' }"
    :visible="false"
    ref="popupTaskKanban"
    :showCloseIcon="true"
    cssClass="task-kanban-dialog"
    width="70%"
    :isModal="true"
    :target="target"
    :header="computedHeader"
    :open="handleShowModal"
    @close="handleCloseModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          
          <div class="row">
              <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Mã</div>
                      <div style="display: flex !important;align-items: center !important;">
                        <div class="value" style="flex: 1 !important;">
                            <input type="text" disabled :value="input_ma" @change="e=>input_ma=e.target.value" class="form-control">
                        </div>
                        <div class="value w30 custom-value-btn" style="margin-left: 5px !important;">
                            <button class="btn btn-second" @click="copyToClipboard(input_ma)">
                              <span class="-ap icon-documents"></span>
                          </button>
                        </div>
                      </div>

                  </div>
              </div>
              <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Dự án <required-marker v-if="boardType == 1"/></div>
                      <div class="value wp100">
                          <div class="select-custom" ref="ds_duan">
                              <select2 :settings="{ dropdownParent: $refs['ds_duan'] }"
                                  v-model="duan_selected" class="select2"
                                  :disabled="disabled || cloneChildFlg || (boardType == 1 && input_ma.trim() == '')"
                                  :options="ds_duan.map(e=>({id:e.project_id, text:e.project_name}))"
                              >
                              </select2>
                          </div> 
                      </div>
                      
                  </div>
              </div>
          </div>
          <div class="row">

              <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">Người giao</div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_nguoigiao">
                            <select2 :settings="{ dropdownParent: $refs['ds_nguoigiao'] }"
                                v-model="nguoigiao_selected" class="select2"
                                :disabled="true"
                                :options="ds_nguoigiao.map(e=>({id:e.user_id, text:e.full_name}))"
                            >
                            </select2>
                        </div> 
                    </div>
                    
                </div>
              </div>
              <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">Người nhận</div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_nguoinhan">
                            <select2 :settings="{ dropdownParent: $refs['ds_nguoinhan'] }"
                                v-model="nguoinhan_selected" class="select2"
                                
                                @select="changeNguoiNhan"
                                :options="ds_nguoinhan.map(e=>({id:e.user_id, text:e.full_name}))"
                            >
                            </select2>
                        </div> 
                    </div>
                    
                </div>
              </div>

          </div>

          <div class="row">
            <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">Bảng làm việc<required-marker/></div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_board">
                            <select2 :settings="{ dropdownParent: $refs['ds_board'] }"
                                v-model="board_selected" class="select2"
                                :disabled="!cloneChildFlg"
                                :options="ds_board.map(e=>({id:e.board_id, text:e.board_name}))"
                                @select="BoardValueChange"
                            >
                            </select2>
                        </div> 
                    </div>
                    
                </div>
              </div>
              <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">Giai đoạn<required-marker/></div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_giaidoan">
                            <select2 :settings="{ dropdownParent: $refs['ds_giaidoan'] }"
                                v-model="giaidoan_selected" class="select2"
                                :disabled="disabledStep"
                                :options="ds_giaidoan.map(e=>({id:e.step_id, text:e.step_name}))"
                            >
                            </select2>
                        </div> 
                    </div>
                </div>
              </div>
          </div>

          <div class="info-row" v-if="dataParentTask.code.length>0">
            <div class="key w200 bold">Công việc gốc</div>
            <div style="display: flex !important;align-items: center !important;">
              <div class="value" style="flex: 1 !important;">
                  <input type="text" disabled :value="parentTaskInfo" class="form-control">
              </div>
              <div class="value w30" style="margin-left: 5px !important;">
                  <button class="btn btn-second" @click="copyToClipboard(dataParentTask.code)">
                      <span class="-ap icon-documents"></span>
                  </button>
              </div>
            </div>
            
          </div>
          <div class="info-row" v-if="CodesChildTask.length>0">
            <div class="key w200 bold">Công việc con</div>
            <div class="value wp100">
                <div class="tag-input">
                  <a v-for="(code, index) in CodesChildTask" :key="index" @click="onTagCodeClick(code)" style="cursor: pointer;">
                    <span v-if="index<(CodesChildTask.length-1)">{{code}}, </span>
                    <span v-else>{{code}}</span>
                  </a>
                </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w200 bold">Nhân bản công việc<required-marker  v-if="duplicateChildFlg"/></div>
                <div class="value wp100">
                    <ejs-multiselect 
                        id='multiNB'
                        ref="userMultiSelect"
                        :dataSource="memberDuplicates" 
                        placeholder="Chọn" 
                        v-model="memberSelects" 
                        :fields='fields' 
                        :allowFiltering="true" 
                        :maximumDisplayCount="0"
                        @select="onUserSelectChange"
                        :enabled="duplicateChildFlg || (!cloneChildFlg && !updateFlg)"
                        filterType="Contains">
                    </ejs-multiselect>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="info-row">
                  <div class="key w200 bold">Mức độ<required-marker/></div>
                  <div class="value wp100">
                      <div class="select-custom" ref="ds_priority">
                          <select2 :settings="{ dropdownParent: $refs['ds_priority'] }"
                              v-model="priority_selected" class="select2"
                              :disabled="disabled"
                              :options="priority_list"
                          >
                          </select2>
                      </div> 
                  </div>
                  
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">Nhóm công việc<required-marker/></div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_nhomcongviec">
                            <select2 :settings="{ dropdownParent: $refs['ds_nhomcongviec'] }"
                                v-model="nhomcongviec_selected" class="select2"
                                :disabled="disabled"
                                :options="ds_nhomcongviec.map(e=>({id:e.dictionary_group_id, text:e.dictionary_group}))"
                                @select="handleTaskDictionaryGroupChange"
                            >
                            </select2>
                        </div> 
                    </div>
                    
                </div>
              </div>
              <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">Loại công việc<required-marker/></div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_loaicongviec">
                            <select2 :settings="{ dropdownParent: $refs['ds_loaicongviec'] }"
                                v-model="loaicongviec_selected" class="select2"
                                :disabled="disabled"
                                :options="ds_loaicongviec.map(e=>({id:e.dictionary_id, text:e.task_dictionary}))"
                                @select="handleTaskDictionaryChange"
                            >
                            </select2>
                        </div> 
                    </div>
                </div>
              </div>
          </div>

          <div class="row" v-if="codeWorkgroup=='N13'||codeWorkgroup=='N15'||codeWorkgroup=='N17'">
            <div class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">
                      {{labelCustomer}}
                      <required-marker v-if="codeWorkgroup=='N15'||codeWorkgroup=='N17'"/>
                    </div>
                    <div style="display: flex !important;align-items: center !important;">
                      <div class="value" style="flex: 1 !important;">
                          <CustomerSelect ref="customerSelect" 
                            v-model="khachhang_selected"
                            :customerName="customer_name"
                            :disabled="disabled"
                            :isSelectAll="false"/>
                      </div>
                      <div class="value w30 custom-value-btn" style="margin-left: 5px !important;">
                          <button class="btn btn-second" @click="copyToClipboard(khachhang_selected.text)">
                              <span class="-ap icon-documents"></span>
                          </button>
                      </div>
                    </div>
                    
                </div>
              </div>
              <!-- Dùng cho Yêu cầu presale -->
              <!-- Và sau ngày 28/11/2025 mới hiện theo cái mới -->
              <div v-if="codeWorkgroup=='N17'&&!isServiceBefore2811" class="col-sm-6 col-12">
                <div class="row">
                  <div class="col-sm-6 col-12">
                    <div class="info-row">
                        <div class="key w200 bold">Nguồn dữ liệu<required-marker/></div>
                        <div class="value wp100">
                            <div class="select-custom" ref="ds_nguon_dl">
                                <select2 :settings="{ dropdownParent: $refs['ds_nguon_dl'] }"
                                    v-model="nguon_dl_selected" class="select2"
                                    :options="ds_nguon_dl"
                                    :disabled="viewFlg||disabledCloneChildN17"
                                    @select="handleNguonDLChange"
                                >
                                </select2>
                            </div> 
                        </div>
                    </div>
                  </div>
                  <div class="col-sm-6 col-12">
                    <div class="info-row">
                        <div class="key w200 bold">Dịch vụ<required-marker/></div>
                        <div class="value wp100">
                            <div class="select-custom" ref="ds_dichvu_ps">
                                <select2 :settings="{ dropdownParent: $refs['ds_dichvu_ps'] }"
                                    v-model="dichvu_ps_selected" class="select2"
                                    :disabled="viewFlg||disabledCloneChildN17"
                                    @select="handleServicePsChange"
                                    :options="ds_dichvu_ps.map(e=>({id:e.device_profile_id, text:e.device_profile_name}))"
                                >
                                </select2>
                            </div> 
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Còn lại cho Nhóm N13: Hỗ trợ khách hàng, N15: Hóa đơn điện tử -->
              <div v-else class="col-sm-6 col-12">
                <div class="info-row">
                    <div class="key w200 bold">{{labelService}} <required-marker v-if="codeWorkgroup=='N17'"/></div>
                    <div class="value wp100">
                        <div class="select-custom" ref="ds_dichvu">
                            <select2 :settings="{ dropdownParent: $refs['ds_dichvu'] }"
                                v-model="dichvu_selected" class="select2"
                                :disabled="disabled||codeWorkgroup=='N15'"
                                :options="ds_dichvu.map(e=>({id:e.service_id, text:e.service_name}))"
                            >
                            </select2>
                        </div> 
                    </div>
                </div>
              </div>

          </div>

          <div class="row" v-if="codeWorkgroup=='N17'">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w200 bold">Tỷ lệ %<required-marker/></div>
                <div class="value wp100">
                  <input
                    type="number"
                    :value="percent_presale" 
                    @input="onPercentInput"
                    @keydown="onPercentKeydown"
                    :min="0"
                    :max="100"
                    :step="0"
                    :disabled="viewFlg"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key w200 bold">Mã dự án {{labelNguonDl}}<required-marker/></div>
                <div class="value wp100">
                  <input
                    type="text"
                    :value="onebss_code" @change="e=>onebss_code=e.target.value"
                    :disabled="viewFlg||disabledCloneChildN17"
                    class="form-control"
                  />
                </div>
              </div>
              <!-- <div class="row">
                <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Dự án OneBss</div>
                      <div class="value wp100">
                          <div class="select-custom" ref="ds_duan_ps">
                              <select2 :settings="{ dropdownParent: $refs['ds_duan_ps'] }"
                                  v-model="duan_ps_selected" class="select2"
                                  :disabled="viewFlg"
                                  :options="ds_duan_ps.map(e=>({id:e.MA_DUAN, text:e.TEN_DUAN}))"
                                  @select="handleProjectPsChange"
                              >
                              </select2>
                          </div> 
                      </div>
                  </div>
                </div>
                <div class="col-sm-6 col-12">
                  <div class="info-row">
                    <div class="key w200 bold">Mã dự án <required-marker/></div>
                    <div class="value wp100">
                      <input
                        type="text"
                        :value="onebss_code" @change="e=>onebss_code=e.target.value"
                        :disabled="viewFlg||duan_ps_selected!='0'"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div> -->
              
            </div>
          </div>

          <div class="row">
              <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Số giờ yêu cầu<required-marker/></div>
                      <div class="value wp100">
                        <input
                            type="number"
                            :value="input_sogioyc" @change="e=>input_sogioyc=e.target.value"
                            :min="0"
                            :max="100"
                            :step="0.25"
                            :disabled="viewFlg||quota != 0 ||(Number(input_sogioyc)!=0&&quota == Number(input_sogioyc))"
                            class="form-control"
                          />
                      </div>
                  </div>
              </div>
              <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Số giờ thực hiện</div>
                      <div class="value wp100">
                          <input type="text" :value="input_sogiothuchien" @change="e=>input_sogiothuchien=e.target.value" disabled="true" class="form-control">
                      </div>
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Ngày bắt đầu<required-marker/></div>
                      <div class="value wp100">
                          <div class="input-icon-right">
                              <ejs-datepicker
                                  v-model="ngay_batdau"
                                  format='dd/MM/yyyy'
                                  :showClearButton='false'
                                  :allowEdit="true"
                                  :strict-mode="true"
                                  :enabled="!disabled||duplicateChildFlg"
                                  locale="vi"
                                  @change="changeNgayBD"
                                  :firstDayOfWeek="1"
                              />
                          </div>
                      </div>
                  </div>
              </div>
              <div class="col-sm-6 col-12">
                  <div class="info-row">
                      <div class="key w200 bold">Ngày kết thúc<required-marker/></div>
                      <div class="value wp100">
                          <div class="input-icon-right">
                              <ejs-datepicker
                                  v-model="ngay_ketthuc"
                                  format='dd/MM/yyyy'
                                  :showClearButton='false'
                                  locale="vi"
                                  :enabled="!disabled||duplicateChildFlg"
                                  :allowEdit="true"
                                  :strict-mode="true"
                                  @change="changeNgayKT"
                                  :firstDayOfWeek="1"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div class="info-row">
            <div class="key w200 bold">Nội dung<required-marker/></div>
            <div class="value wp100">
                <textarea  ref="inputNoiDung" class='form-control' rows="3" :readonly="disabled&&!duplicateChildFlg" :value="input_noidung" @change="e=>input_noidung=e.target.value"></textarea>
            </div>
          </div>

          <div class="info-row">
              <div class="key w200 bold">Link liên quan</div>
              <div class="value wp100">
                  <input type="text" :readonly="disabled&&!duplicateChildFlg" :value="input_link_lien_quan" @change="e=>input_link_lien_quan=e.target.value" class="form-control">
              </div>
          </div>

          <div class="info-row">
            <div class="key w200 bold">Mô tả giao phẩm công việc<required-marker/></div>
            <div class="value wp100">
                <textarea ref="inputMoTaGP"  :readonly="disabled&&!duplicateChildFlg" class='form-control' rows="4" :value="input_mota" @change="e=>input_mota=e.target.value"></textarea>
            </div>
          </div>

          <div class="info-row">
            <div class="key w200 bold">Đính kèm file</div>
            <div class="value wp100">
                <AttachFile v-if="!disabledFileAttack" ref="attachFile" 
                  @onSelectFiles="onSelectFiles"
                />
                <div
                  v-for="(file, i) in fileAttachments"
                  :key="i"
                  class="file-item"
                >
                  <a @click.prevent="downloadFile(file)"  class="file-link" style="cursor: pointer;">
                    {{ file.file_name }}
                  </a>
                  <button
                    v-if="!disabledFileAttack"
                    class="btn-delete"
                    title="Xóa file"
                    @click="onRemoveFile(file)"
                  >
                    ✕
                  </button>
                </div>
            </div>
          </div>
          <div class="info-row" v-if="!viewFlg">
            <div class="value wp100" style="margin-top: 10px !important;text-align: right !important;">
              <button  class="btn btn-second" @click="onSaveTask" style="width: 180px">
                  Lưu thông tin
              </button>
            </div>
          </div>
          
          <WorkReportPanel ref="workReportPanel"
            v-if="viewFlg && reportFlg"
            :taskId="taskId"
            :boardClosed="boardClosed"
          />

        </div>
      </div>
      <!-- Modal -->
      <RatingTaskModal ref="ratingTaskModal"
          :task="taskItem"
          :boardId="board_selected"
          @onRatingTaskSuccess="onRatingTaskSuccess"
        />
    </div>
  </ejs-dialog>
</template>

<script>
import API from './API'
import moment from 'moment'
import AttachFile from './AttachFile.vue';
import WorkReportPanel from './WorkReportPanel.vue'
import CustomerSelect from '../search/CustomerSelect.vue'
import RatingTaskModal from '../rating/RatingTaskModal.vue'
export default {
  name: "TaskKanbanModal",
  components:{
    AttachFile,
    WorkReportPanel,
    CustomerSelect,
    RatingTaskModal
  },
  props: {
    taskId:{
      type:Number,
      default: 0
    },
    boardId:{
      type:Number,
      default: 0
    },
    stepId:{
      type:Number,
      default: 0
    },
    customerID:{
      type:Number,
      default: 0
    },
    updateFlg:{
      type:Boolean,
      default:true
    },
    viewFlg:{
      type:Boolean,
      default:false
    },
    reportFlg:{
      type:Boolean,
      default:true
    },
    enabled:{
      type:Boolean,
      default:false
    },
    cloneChildFlg:{
      type:Boolean,
      default:false
    },
    duplicateChildFlg:{
      type:Boolean,
      default:false
    },
    boardClosed:{
      type:Boolean,
      default:false
    }

  },
  computed:{
    labelCustomer(){
      return this.codeWorkgroup=='N13'?'Khách hàng cần hỗ trợ':'Khách hàng'
    },
    labelService(){
      return this.codeWorkgroup=='N13'?'Dịch vụ cần hỗ trợ':'Dịch vụ'
    },
    parentTaskInfo(){
      return this.dataParentTask.code.length>0?(this.dataParentTask.code + ' - '+this.dataParentTask.name):''
    },
    memberDuplicates(){
      return this.memberList.filter(x=>x.user_id!=this.nguoinhan_selected)
    },
    computedHeader() {
      var showButton = this.headerReady 
          && this.viewFlg 
          && this.taskItem?.status_id != 3 
          && this.user_id_token == this.nguoigiao_selected;
      return `
        <div class="header-custom" style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <span class="flex items-center gap-2">
            <span class="icon one-notepad"></span> THÔNG TIN CÔNG VIỆC
          </span>

          ${showButton 
            ? `<button id="btn-rating-detail_task" class="btn btn-primary px-2 py-1 text-sm">Đánh giá chất lượng</button>` 
            : '' 
          }
        </div>
      `;
    },
    labelNguonDl(){
      return this.nguon_dl_selected==1?'OneBss':'chương trình 123'
    },
    disabledCloneChildN17(){
      return this.codeWorkgroup=='N17'&&this.cloneChildFlg
    }
  },
  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="icon one-notepad"></span> THÔNG TIN CÔNG VIỆC`,
      input_ma:'',
      ds_duan:[],
      duan_selected:0,
      nguoigiao_selected:null,
      nguoinhan_selected:0,
      ds_nguoinhan:[],
      ds_nguoigiao:[],
      ds_board:[],
      board_selected:null,
      giaidoan_selected:null,
      ds_giaidoan:[],
      memberList:[],
      memberSelects:[],
      fields: {
          value: 'user_id',
          text: 'full_name'
      },
      ds_nhomcongviec:[],
      nhomcongviec_selected:null,
      ds_loaicongviec:[],
      loaicongviec_selected:null,
      input_sogioyc:'',
      input_sogiothuchien:'',
      ngay_batdau:moment(new Date()).format('DD/MM/YYYY'),
      ngay_ketthuc:moment(new Date()).format('DD/MM/YYYY'),
      input_noidung:'',
      input_link_lien_quan:'',
      input_mota:'',

      fileAttachments: [],
      khachhang_selected:{
        id: 0,
        selected:true,
        text:""
      },
      customer_name:'',
      dichvu_selected:0,
      ds_dichvu:[],
      boardType:null,

      taskItem:{},
      disabled:true,
      disabledFileAttack:true,
      boardRootID:null,
      disabledStep:true,
      codeWorkgroup:'',

      onebss_code:'',
      percent_presale:'',

      IsInvoice:false,
      quota:0,
      CodesChildTask:[],
      baseUrl: import.meta.env.VNPT_API,
      hasAssigneeTask:false,
      dataParentTask: {
        code: "",
        name: ""
      },
      isSaveAddNewSuccess:false,
      priority_selected:1,
      priority_list:[
        {
          id:1,
          text:'Bình thường'
        },
        {
          id:2,
          text:'Quan trọng'
        },
        {
          id:3,
          text:'Rất quan trọng'
        },

      ],
      ds_loaicongviec_all:[],
      user_id_token:null,
      headerReady:false,
      ds_nguon_dl:[
        {
          id:1,
          text:'OneBss'
        },
        {
         id:2,
         text:'Chương trình 123'
        }
      ],
      nguon_dl_selected:1,
      ds_dichvu_ps:[],
      dichvu_ps_selected:0,
      service_123:[],
      service_bss:[],
      duan_ps_selected:'0',
      ds_duan_ps:[],

      isServiceBefore2811:false

    }
  },
  methods: {
    showModal() {
      this.$refs["popupTaskKanban"].show();
    },
    hideModal() {
      this.$refs["popupTaskKanban"].hide();
    },
    handleShowModal() {
      this.headerReady=false
      this.clear();
      setTimeout(() => {
        this.initDuLieu();
      }, 200);
    },
    async initDuLieu() {
      // this.customer_name="Chiều lang thang"
      // this.khachhang_selected=2;
      this.disabled = !this.enabled || this.viewFlg || this.duplicateChildFlg;
      //this.disabledFileAttack = this.disabled || this.cloneChildFlg || this.duplicateChildFlg;
      //Mở thêm cho tạo task con đính kèm
      this.disabledFileAttack = this.disabled || this.duplicateChildFlg;
      this.boardRootID = this.boardId;
      this.disabledStep = !this.cloneChildFlg;
      this.board_selected=this.boardId
      this.user_id_token=this.$_root.token.getUserId()
      this.SetDefault()
      // await this.initProject()
      // await this.initBoard()
      // await this.initStep()
      // await this.initUser()
      // await this.initTaskDictionary()
      // await this.initService()
      // Gom hết promise vào 1 mảng
      await Promise.all([
        //this.initProject(),
        this.initProjectService(),
        this.initBoard(),
        this.initStep(),
        this.initUser(),
        this.initTaskDictionary(),
        this.initServicePS()
      ]);

      //init giá trị binding sau load
      this.initValueFirstLoad()

      if(this.taskId!=0&&(this.viewFlg||this.updateFlg||this.cloneChildFlg||this.duplicateChildFlg)){
        this.initTaskInfo()
      }
      if(this.taskId!=0&&this.viewFlg){
        this.$refs.workReportPanel.initDuLieu()
      }

      //Check default ngày bắt đầu vs kết thúc khi tạo mới task
      if(!this.viewFlg&&!this.updateFlg&&!this.cloneChildFlg&&!this.duplicateChildFlg){
        this.ngay_batdau=moment(new Date()).format('DD/MM/YYYY')

        var date = this.addDays(new Date(), 5);
        var day = date.getDay(); // 0: Chủ nhật, 6: Thứ bảy
        if (day === 6) {
          // Nếu là Thứ bảy, cộng thêm 2 ngày
          date = this.addDays(date, 2);
        } else if (day === 0) {
          // Nếu là Chủ nhật, cộng thêm 1 ngày
          date = this.addDays(date, 1);
        }
        this.ngay_ketthuc=moment(date).format('DD/MM/YYYY')

      }

      //Lấy dự án onebss
      this.initProjectOneBss()

    },
    addDays(date, days) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + days);
      return newDate;
    },
    onPercentKeydown(e) {
      // Cho phép phím điều hướng
      const allowedKeys = [
        "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"
      ];

      // Nếu là phím điều hướng → cho qua
      if (allowedKeys.includes(e.key)) return;

      // Nếu không phải số → chặn
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    },

    onPercentInput(e) {
      // Loại bỏ ký tự không phải số
      let val = e.target.value.replace(/\D/g, "");

      // Giới hạn 0–100
      if (val !== "") {
        val = Math.min(100, Math.max(0, Number(val)));
      }

      this.percent_presale = val;
    },
    clear() {
      this.input_ma=''
      this.ds_duan=[]
      this.duan_selected=0
      this.nguoigiao_selected=null
      this.nguoinhan_selected=0
      this.ds_nguoinhan=[]
      this.ds_nguoigiao=[]
      this.ds_board=[]
      this.board_selected=null
      this.giaidoan_selected=null
      this.ds_giaidoan=[]
      this.memberList=[]
      this.memberSelects=[]
      this.ds_nhomcongviec=[]
      this.nhomcongviec_selected=null
      this.ds_loaicongviec=[]
      this.loaicongviec_selected=null
      this.input_sogioyc=''
      this.input_sogiothuchien=''
      this.ngay_batdau=moment(new Date()).format('DD/MM/YYYY')
      this.ngay_ketthuc=moment(new Date()).format('DD/MM/YYYY')
      this.input_noidung=''
      this.input_link_lien_quan=''
      this.input_mota=''

      this.fileAttachments=[]
      this.khachhang_selected={
        id: 0,
        selected:true,
        text:""
      }
      this.customer_name=''
      this.dichvu_selected=0
      this.ds_dichvu=[]
      this.boardType=null

      this.taskItem={}
      this.disabled=true
      this.disabledFileAttack=true
      this.boardRootID=null
      this.disabledStep=true
      this.codeWorkgroup=''

      this.onebss_code=''
      this.percent_presale=''

      this.IsInvoice=false
      this.quota=0
      this.CodesChildTask=[]
      this.hasAssigneeTask=false
      this.dataParentTask={
        code: "",
        name: ""
      }
      this.isSaveAddNewSuccess=false
      this.priority_selected=1
      this.ds_loaicongviec_all=[]

      this.nguon_dl_selected=1
      this.ds_dichvu_ps=[]
      this.dichvu_ps_selected=0
      this.service_123=[]
      this.service_bss=[]
      this.duan_ps_selected='0'
      this.ds_duan_ps=[]

      this.isServiceBefore2811=false
    },
    SetDefault(){

      this.taskItem={
        task_id: 1,
        parent_id: null,
        root_id: null,
        project_id: null,
        type_id: null,
        code: '',
        task_name: '',
        status_id: 0,

        actual_execution_time: null,
        planned_duration_time: null,

        schedule_start: null,
        schedule_end: null,
        actual_start: null,
        actual_end: null,
        close_date: null,
        
        description: '',
        filename: '',
        jiraurl: '',
        step_id: null,
        jobtype_id: null,
        onebss_code:'',
        percent_presale:'',

        task_creator: null,
        assignee_id: null,
        service_id: null,
        customer_id: null,
        running_flag: null
      }

      var user_id=this.$_root.token.getUserId()
      this.nguoigiao_selected=user_id
      this.giaidoan_selected=this.stepId

    },
    initValueFirstLoad(){
      var user_id=this.$_root.token.getUserId()
      this.nguoigiao_selected=user_id
      this.giaidoan_selected=this.stepId
    },
    async initProjectService(){
      let rs=await API.GetServiceProjectAll(this)
      if(rs==null)return
      var rsData=JSON.parse(rs)
      this.ds_duan=rsData.projects
      this.ds_duan.unshift({
        project_id:0,
        project_name:'Chọn'
      })
      this.ds_dichvu=rsData.services
      this.ds_dichvu.unshift({
        service_id:0,
        service_name:'Chọn'
      })
      this.dichvu_selected=0
    },
    async initServicePS(){
      var rs=await API.GetServicePresale(this)
      if(rs==null)return
      //
      var rsData=JSON.parse(rs)
      this.service_123=rsData.service_123
      this.service_bss=rsData.service_bss
      this.dichvu_ps_selected=0
      this.ds_dichvu_ps=[{
        service_id: null,
        service_name: null,
        device_profile_id: 0,
        device_profile_name: "Chọn"
      }]
      if(this.nguon_dl_selected==1){
        this.ds_dichvu_ps=this.ds_dichvu_ps.concat(this.service_bss)
      }else{
        this.ds_dichvu_ps=this.ds_dichvu_ps.concat(this.service_123)
      }

    },
    handleServicePsChange(){
      this.percent_presale=''
      this.onebss_code=''
    },
    async initProject(){
      this.ds_duan=await API.GetAllProject(this)
      this.ds_duan.unshift({
        project_id:0,
        project_name:'Chọn'
      })
      //this.duan_selected=0
    },
    async initProjectOneBss(){
      this.duan_ps_selected='0'
      this.ds_duan_ps=[
        {
          MA_DUAN: "0",
          TEN_DUAN: "Nhập thủ công",
        }
      ]
      // Sau này bổ sung API public thêm vào
      // let data=await API.GetProjectOneBss(this)
      // this.ds_duan_ps=this.ds_duan_ps.concat(data)
    },
    handleProjectPsChange(){
      if(this.duan_ps_selected&&this.duan_ps_selected!='0'){
        this.onebss_code=this.duan_ps_selected
      }
    },
    async initUser(){
      let data=await API.GetUserMemberByBoardId(this, this.board_selected)

      if(data){
        this.ds_nguoigiao=data.slice()
        this.ds_nguoinhan=data.slice()
        this.memberList=data.slice()
      }
      this.ds_nguoinhan.unshift({
        user_id:0,
        full_name:"---------"
      })

    },
    async initBoard(){
      this.ds_board=await API.GetBoardByUser(this)
      if(this.ds_board.length>0){
        const board=this.ds_board.filter(x=>x.board_id==this.board_selected)
        if(board&&board.length>0){
          this.board_selected=board[0].board_id
          this.boardType=board[0].boardtype_id
          if (this.boardType == 1 && (!this.input_ma || this.input_ma.trim() == '')) {
            this.duan_selected = board[0].project_id
          }
        }
      }
    },
    async initStep(){
      this.ds_giaidoan=await API.GetStepByBoardID(this, this.board_selected)
      if(this.ds_giaidoan.length>0){
        this.giaidoan_selected=this.ds_giaidoan[0].step_id
      }
    },
    async initTaskDictionary(){
      let rs=await API.GetTaskDictionary(this)
      if(rs==null)return
      var rsData=JSON.parse(rs)
      this.ds_nhomcongviec=rsData.task_dictionary_groups
      this.ds_loaicongviec_all=rsData.task_dictionary
      if (this.ds_nhomcongviec.length > 0) {
        //Điều chỉnh để default nhóm công việc index mặc định HDDT
        const workGroup = this.ds_nhomcongviec.find(x => x.code == 'N15')
        if (workGroup) {
          this.nhomcongviec_selected = workGroup.dictionary_group_id
          this.codeWorkgroup = workGroup.code;

          this.quota=0
          this.ds_loaicongviec=[]
          
          this.ds_loaicongviec=this.ds_loaicongviec_all.filter(r=>r.dictionary_group_id==this.nhomcongviec_selected)
          if(this.ds_loaicongviec.length>0){
            this.loaicongviec_selected=this.ds_loaicongviec[0].dictionary_id
            this.quota=this.ds_loaicongviec[0].quota??0
            this.input_sogioyc=this.quota?this.quota.toString():''
          }
        } else {
          this.nhomcongviec_selected = this.ds_nhomcongviec[0].dictionary_group_id
          this.codeWorkgroup = this.ds_nhomcongviec[0].code;

          this.quota=0
          this.ds_loaicongviec=[]
          this.ds_loaicongviec=this.ds_loaicongviec_all.filter(r=>r.dictionary_group_id==this.nhomcongviec_selected)
          if(this.ds_loaicongviec.length>0){
            this.loaicongviec_selected=this.ds_loaicongviec[0].dictionary_id
            this.quota=this.ds_loaicongviec[0].quota??0
            this.input_sogioyc=this.quota?this.quota.toString():''
          }
        }
      }

      // this.ds_nhomcongviec=await API.GetAllTaskDictionaryGroups(this)
      // if (this.ds_nhomcongviec.length > 0) {
      //   //Điều chỉnh để default nhóm công việc index mặc định HDDT
      //   const workGroup = this.ds_nhomcongviec.find(x => x.code == 'N15');
      //   if (workGroup) {
      //     this.nhomcongviec_selected = workGroup.dictionary_group_id;
      //     this.codeWorkgroup = workGroup.code;
      //     await this.GetTaskDictionaryByGroupID(workGroup.dictionary_group_id);
      //   } else {
      //     this.nhomcongviec_selected = this.ds_nhomcongviec[0].dictionary_group_id;
      //     this.codeWorkgroup = this.ds_nhomcongviec[0].code;
      //     await this.GetTaskDictionaryByGroupID(this.ds_nhomcongviec[0].dictionary_group_id);
      //   }

      // }
    },
    handleNguonDLChange(){
      this.percent_presale=''
      this.onebss_code=''

      this.dichvu_ps_selected=0
      this.ds_dichvu_ps=[{
        service_id: null,
        service_name: null,
        device_profile_id: 0,
        device_profile_name: "Chọn"
      }]
      if(this.nguon_dl_selected==1){
        this.ds_dichvu_ps=this.ds_dichvu_ps.concat(this.service_bss)
      }else{
        //123 chưa có
        this.ds_dichvu_ps=this.ds_dichvu_ps.concat(this.service_123)
      }
    },
    handleTaskDictionaryGroupChange(){
      this.percent_presale=''
      this.onebss_code=''
      this.loaicongviec_selected=null
      this.ds_loaicongviec=[]
      this.input_sogioyc=""

      this.GetTaskDictionaryByGroupID(this.nhomcongviec_selected)

      const index = this.ds_nhomcongviec.findIndex(x => x.dictionary_group_id == this.nhomcongviec_selected)
      if (index > -1) {
        this.codeWorkgroup = this.ds_nhomcongviec[index].code
      }
      this.IsInvoice = this.codeWorkgroup == 'N15'
      this.dichvu_selected=0
    },
    GetTaskDictionaryByGroupID(group_id){
      this.quota=0
      this.ds_loaicongviec=[]
      this.ds_loaicongviec=this.ds_loaicongviec_all.filter(r=>r.dictionary_group_id==group_id)
      if(this.ds_loaicongviec.length>0){
        this.loaicongviec_selected=this.ds_loaicongviec[0].dictionary_id
        this.quota=this.ds_loaicongviec[0].quota??0
        this.input_sogioyc=this.ds_loaicongviec[0].quota?this.ds_loaicongviec[0].quota.toString():''
      }
      // this.quota=0
      // this.ds_loaicongviec=[]
      // this.ds_loaicongviec=await API.GetTaskDictionaryByGroupId(this, group_id)
      // if(this.ds_loaicongviec.length>0){
      //   this.loaicongviec_selected=this.ds_loaicongviec[0].dictionary_id
      //   await this.GetScheduleH()
      // }
    },
    handleTaskDictionaryChange() {
      this.input_sogioyc='';
      this.quota = 0;
      const index = this.ds_loaicongviec.findIndex(x => x.dictionary_id == this.loaicongviec_selected)
      if (index > -1) {
        this.quota=this.ds_loaicongviec[index].quota??0
        this.input_sogioyc=this.ds_loaicongviec[index].quota?this.ds_loaicongviec[index].quota.toString():''
      }

      //this.GetScheduleH();
    },
    async GetScheduleH(){
      let value=await API.GetTimeTargetByJobtypeID(this, this.nhomcongviec_selected, this.loaicongviec_selected)
      this.quota=value??0
      this.input_sogioyc=value?value.toString():''
    },
    async initService(){
      this.ds_dichvu=await API.GetAllService()
      this.ds_dichvu.unshift({
        service_id:0,
        service_name:'Chọn'
      })
      this.dichvu_selected=0
    },
    async BoardValueChange(){
      this.nguoinhan_selected = 0
      this.giaidoan_selected = null
      await this.initUser()
      await this.initStep()

      this.duan_selected=null
      const board=this.ds_board.filter(x=>x.board_id==this.board_selected)
      if(board&&board.length>0){
        this.boardType=board[0].boardtype_id
        if (this.boardType == 1 && (!this.input_ma || this.input_ma.trim() == '')) {
          this.duan_selected = board[0].project_id
        }
      }
    },
    copyToClipboard(value){
      if (!value || value == '') return;
      var result = value.toString();
      const textarea = document.createElement('textarea');
      textarea.value = result;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$toast.success('Copied!')
    },
    validateTask(){
      if (this.boardType == 1 && !this.duan_selected) {
        this.$toast.error('Bạn chưa chọn dự án')
        return false;
      }

      if (!this.input_mota||this.input_mota.trim()=='') {
        this.$toast.error('Bạn chưa nhập thông tin mô tả giao phẩm công việc')
        this.$refs.inputMoTaGP.focus()
        return false;
      }
      if(!this.input_noidung||this.input_noidung.trim()==''){
        this.$toast.error('Bạn chưa nhập thông tin nội dung công việc')
        this.$refs.inputNoiDung.focus()
        return false
      }
      if(!this.input_sogioyc||this.input_sogioyc.trim()==''||Number(this.input_sogioyc.trim())==0){
        this.$toast.error('Chưa có thông tin số giờ yêu cầu')
        return false
      }
      if(this.ds_loaicongviec.length==0||!this.loaicongviec_selected){
        this.$toast.error('Chưa có thông tin loại công việc')
        return false
      }
      if(!this.giaidoan_selected){
        this.$toast.error('Chưa có thông tin giai đoạn')
        return false
      }

      //Nhóm CSKH
      if (this.codeWorkgroup == 'N13') {
        // if (!this.duan_selected) {
        //   this.$toast.error('Bạn chưa chọn dự án')
        //   return false;
        // }
        // if (!this.khachhang_selected.id) {
        //   this.$toast.error('Bạn chưa chọn khách hàng')
        //   return false;
        // }
        // if (!this.dichvu_selected) {
        //   this.$toast.error('Bạn chưa chọn dịch vụ')
        //   return false;
        // }
      }
      //Nhóm YeuCauPresale
      if (this.codeWorkgroup == 'N17') {
        if (!this.khachhang_selected.id) {
          this.$toast.error('Bạn chưa chọn khách hàng')
          return false;
        }
        if (!this.dichvu_ps_selected) {
          this.$toast.error('Bạn chưa chọn dịch vụ')
          return false;
        }
        if (!this.onebss_code || this.onebss_code.trim()=='') {
          this.$toast.error('Bạn chưa nhập mã dự án OneBSS')
          return false;
        }
        if (this.percent_presale.toString().trim() == '' || Number(this.percent_presale.toString().trim())<0) {
          this.$toast.error('Bạn chưa nhập tỷ lệ %')
          return false;
        }
      }
      //Nhóm HDDT
      if (this.codeWorkgroup == 'N15') {
        if (!this.khachhang_selected.id) {
          this.$toast.error('Bạn chưa chọn khách hàng')
          return false;
        }
      }
      //Check giai 
      return true;
    },
    checkPercentPs(){
      //Handle check cho PS


      return true
    },
    async onSaveTask(){
      if (!this.validateTask()) return
      //Check tỷ lệ Ps
      if(this.codeWorkgroup=='N17'){
        var type_check='add'
        if(this.cloneChildFlg){
          type_check='clone_child'
        }else if(this.duplicateChildFlg){
          type_check='duplicate'
        }else if(!this.updateFlg){
          type_check='add'
        }else{
          type_check='update'
        }
        let service=this.ds_dichvu_ps.find(x=>x.device_profile_id==this.dichvu_ps_selected)
        //Nếu là nhóm Ps check ngưỡng tỷ lệ
        let request={
          task_id:this.taskId,
          service_id:service.service_id,
          device_profile_id:Number(this.dichvu_ps_selected),
          data_source_type:this.nguon_dl_selected,
          assignee_id:Number(this.nguoinhan_selected),
          onebss_code:this.onebss_code?this.onebss_code.trim():null,
          list_duplicate_assignee:JSON.stringify(this.memberSelects),
          type_check:type_check,
          percent_presale:this.percent_presale?Number(this.percent_presale.toString().trim()):0
        }
        var result=await API.CheckPercentPs(this, request)
        if(result!='1'){
          // Nếu có dạng ERROR: ...
          let message = result
          if (result.startsWith("ERROR:")) {
            message = result.replace("ERROR:", "").trim()
            this.$toast.error(message)
            return
          }
          //Thông báo ngưỡng cảnh báo tiếp tự cho thực hiện tiếp
          let confirm = await this.$confirm('Thông báo', `${result}. Bạn có muốn tiếp tục thực hiện?`)
          if(confirm==0) return
        }
      }
      //
      if (this.cloneChildFlg) {
        this.cloneChild();
      } else if (this.duplicateChildFlg) {
        this.duplicateChild();
      } else if (!this.updateFlg) {
        this.addTask();
      } else {
        this.updateTask();
      }
    },
    async addTask(){
      const taskRequest = this.createDataRequest(true)
      let data=await API.AddTask(this, taskRequest)
      if(data=='1'){
          this.$toast.success('Tạo công việc thành công!')
          this.isSaveAddNewSuccess=true
          this.$emit('onSuccessSaveTask')
          this.hideModal()
      }else{
          this.$toast.error(data)
      }
    },
    async updateTask(){
      const taskRequest = this.createDataRequest(false)
      let data=await API.UpdateTask(this, taskRequest)
      if(data=='1'){
          this.$toast.success('Cập nhật công việc thành công!')
          this.$emit('onSuccessSaveTask')
          this.hideModal()
      }else{
          this.$toast.error(data)
      }
    },
    async cloneChild(){
      if(!this.nguoinhan_selected) return;
      //Handle check giới hạn
      let result=await API.IsOverTaskLimit(this, this.nguoinhan_selected)
      if(result!="1"){
        this.$toast.error(result);
        return
      }

      const taskRequest = this.createDataRequest(false)
      let data=await API.CloneChildTask(this, taskRequest)
      if(data=='1'){
          this.$toast.success('Tạo công việc con thành công!')
          this.$emit('onSuccessSaveTask')
          this.hideModal()
      }else{
          this.$toast.error(data)
      }


    },
    async duplicateChild(){
      if(this.memberSelects.length==0){
        this.$toast.error('Vui lòng chọn các nhân sự để nhân bản công việc!')
        return
      }
      const taskRequest = this.createDataRequest(false)
      let data=await API.DuplicateTask(this, taskRequest)
      if(data=='1'){
          this.$toast.success('Nhân bản các công việc thành công!')
          this.$emit('onSuccessSaveTask')
          this.hideModal()
      }else{
          this.$toast.error(data)
      }
    },
    createDataRequest(isAdd){
      return {
        task_id: isAdd?0:this.taskId,
        project_id: this.duan_selected?this.duan_selected:null,
        type_id: 1,//quy ước 1 KB
        code: '',
        task_name: this.input_noidung.trim(),
        status_id: 0,
        planned_duration_time: Number(this.input_sogioyc.trim()),
        actual_execution_time: this.input_sogiothuchien?Number(this.input_sogiothuchien.trim()):null,
        schedule_start: moment(this.ngay_batdau,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
        schedule_end: moment(this.ngay_ketthuc,'DD/MM/YYYY').format('YYYY-MM-DDT00:00:00'),
        description: this.input_mota.trim(),
        jiraurl: this.input_link_lien_quan?this.input_link_lien_quan.trim():'',
        step_id: this.giaidoan_selected,
        jobtype_id: this.loaicongviec_selected,
        task_creator: this.nguoigiao_selected,
        assignee_id: this.nguoinhan_selected,
        service_id: this.codeWorkgroup=='N17'?this.dichvu_ps_selected:this.dichvu_selected,
        customer_id: this.khachhang_selected.id,
        running_flag: null,
        priority:this.priority_selected,
        percent_presale:this.percent_presale?Number(this.percent_presale.toString().trim()):0,
        onebss_code:this.onebss_code,
        list_duplicate_assignee:JSON.stringify(this.memberSelects),
        list_file_attachment:JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id)),
        data_source_type:this.codeWorkgroup=='N17'?this.nguon_dl_selected:null
      }
    },
    async onSelectFiles(files){
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      let result=await API.UploadFileTaskKanban(this, formData, this.taskId)
      if(Array.isArray(result)){
        this.fileAttachments=this.fileAttachments.concat(result)
      }else{
        this.$toast.error(result)
      }

    },
    async initTaskInfo(){
      let result=await API.GetTaskInfo(this, this.taskId, this.board_selected)
      if(!result)return;
      this.taskItem = Object.assign({}, result.task);
      var task=result.task;

      this.isServiceBefore2811=result.isServiceBefore2811?result.isServiceBefore2811:false

      this.ngay_batdau=moment(task.schedule_start).format("DD/MM/YYYY")
      this.ngay_ketthuc=moment(task.schedule_end).format("DD/MM/YYYY")
      
      this.input_ma=task.code?task.code.toString():''
      this.duan_selected=task.project_id?task.project_id:0
      this.giaidoan_selected=task.step_id
      this.nguoigiao_selected=task.task_creator
      this.nguoinhan_selected=task.assignee_id
      if(this.nguoinhan_selected){
        this.hasAssigneeTask = true
      }else{
         this.hasAssigneeTask = false
      }
      this.input_link_lien_quan=task.jiraurl?task.jiraurl.toString():''
      this.input_noidung=task.task_name?task.task_name.toString():''
      this.input_mota=task.description?task.description.toString():''

      this.nhomcongviec_selected=result.dictionary_group_id

      this.GetTaskDictionaryByGroupID(this.nhomcongviec_selected)

      this.loaicongviec_selected=task.jobtype_id
      this.input_sogioyc=task.planned_duration_time?task.planned_duration_time.toString():''
      this.input_sogiothuchien=task.actual_execution_time?task.actual_execution_time.toString():''

      //Gắn Code Workgroup
      const indexCodeWorkgroup = this.ds_nhomcongviec.findIndex(x => x.dictionary_group_id == this.nhomcongviec_selected);
      if (indexCodeWorkgroup > -1) {
        this.codeWorkgroup = this.ds_nhomcongviec[indexCodeWorkgroup].code;
      }
      this.IsInvoice = this.codeWorkgroup == 'N15';

      
      this.priority_selected=task.priority
      //Nhóm PS
      if(this.codeWorkgroup=='N17'){
        if(!this.isServiceBefore2811){
          this.nguon_dl_selected=task.data_source_type
          this.handleNguonDLChange(this.nguon_dl_selected)
          this.dichvu_ps_selected=task.service_id
        }else{
          this.dichvu_selected=task.service_id
        }
      }else{
        this.dichvu_selected=task.service_id
      }
     
      this.percent_presale=task.percent_presale
      this.onebss_code=task.onebss_code

      if (this.cloneChildFlg && !this.IsInvoice) {
        this.input_ma = '';
        var user_id=this.$_root.token.getUserId()
        this.nguoigiao_selected=user_id
      }
      if (this.duplicateChildFlg) {
        var user_id=this.$_root.token.getUserId()
        this.nguoigiao_selected=user_id
      }
      if(task.customer_id&&result.customer){
        this.khachhang_selected.id=result.customer.customer_id
        this.khachhang_selected.text=result.customer.customer_name
        this.customer_name=result.customer.customer_name
      }
      if(result.file_attachments){
        this.fileAttachments=result.file_attachments
      }

      this.CodesChildTask=result.codes_child_task
      if(result.parent_info){
        this.dataParentTask=result.parent_info
      }

      if (this.cloneChildFlg && this.IsInvoice&&this.khachhang_selected.id) {
        this.input_ma=''
        var user_id=this.$_root.token.getUserId()
        this.nguoigiao_selected=user_id

        let rs=await API.GetUserAssignByCustomerId(this, this.khachhang_selected.id)
        if(rs&&rs.user_id){
          //check user có trong board
          const index=this.ds_nguoinhan.findIndex(r=>r.user_id==rs.user_id)
          if(index<0){
            this.$toast.warn(`User ${rs.user_name} được phân cho tập khách hàng chưa có trong board, vui lòng chọn người nhận`)
            this.nguoinhan_selected=0
          }else{
            this.nguoinhan_selected=rs.user_id
          }
        }else{
          this.$toast.error(rs)
          this.nguoinhan_selected=0
        }

      }
      this.headerReady=true

    },
    onRatingTaskSuccess(){
      this.$emit('onSuccessSaveTask')
      this.hideModal()
    },
    onTagCodeClick(code){
      this.$emit('onTagCodeClick', code)
      this.hideModal()
    },
    changeNgayBD(event){
      this.ngay_batdau=moment(event.value).format('DD/MM/YYYY')
    },
    changeNgayKT(event){
      this.ngay_ketthuc=moment(event.value).format('DD/MM/YYYY')
    },
    getUrlDownload(fileAttachment) {
      return `${this.baseUrl}/work/Upload/Download?filePath=${fileAttachment.file_path}`;
    },
    async onRemoveFile(file) {
      let result=await API.DeleteFileAttachment(this, file.file_attachment_id)
      if(result=="1"){
        const index = this.fileAttachments.findIndex(x => x.file_attachment_id == file.file_attachment_id)
        if (index > -1) {
          this.fileAttachments.splice(index, 1)
        }
      }else{
        this.$toast.error(result)
      }
    },
    downloadFile(fileAttachment) {
      this.axios.get(`work/Upload/Download`, {
        params: { filePath: fileAttachment.file_path },
        responseType: 'blob',
      })
      .then((response) => {
        // Tạo URL và trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileAttachment.file_name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download lỗi:", error);
      });
    },
    async changeNguoiNhan(){
      if(!this.nguoinhan_selected) return;
      //Handle check giới hạn
      let result=await API.IsOverTaskLimit(this, this.nguoinhan_selected)
      if(result!="1"){
        this.$toast.error(result)
        this.nguoinhan_selected=0
      }
    },
    async onUserSelectChange(args) {
      const value = args.itemData?.[this.fields.value];
      let result=await API.IsOverTaskLimit(this, value)
      if(result!="1"){
        this.$toast.error(result)
        const index=this.memberSelects.findIndex(x=>x==value)
        if(index>-1){
          this.memberSelects.splice(index, 1)
        }
        // Xóa khỏi UI Syncfusion (bắt buộc)
        this.$refs.userMultiSelect.ej2Instances.removeValue(value);
      }
    },
    //Trường hợp thêm mới attach file không thêm mới check có file request y/c remove files
    async handleCloseModal(){
      var isAdd=!this.updateFlg&&!this.cloneChildFlg&&!this.duplicateChildFlg&&!this.viewFlg
      if(isAdd&&!this.isSaveAddNewSuccess&&this.fileAttachments.length>0){
          let file_attachment_ids=JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
          await API.DeleteFileAttachments(this, file_attachment_ids)
      }
    },
    //Handle reload or exit page remove file server not save
    async handleBeforeUnload(event) {
        if(this.isAdd&&!this.isSaveAddNewSuccess&&this.fileAttachments.length>0){
            let file_attachment_ids=JSON.stringify(this.fileAttachments.map(x=>x.file_attachment_id))
            await API.DeleteFileAttachments(this, file_attachment_ids)
        }
    },
    adjustHeight() {
      document
        .querySelectorAll('.task-kanban-dialog .e-dlg-content')
        .forEach(el => {
          el.style.maxHeight = '85vh'; // hoặc 'none'
        });
    },
    clickRatingTask(){
      this.$refs.ratingTaskModal.showModal()
    }
   
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('resize', this.adjustHeight)

    $(document).on('click', '#btn-rating-detail_task', () => {
      this.clickRatingTask();
    });
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('resize', this.adjustHeight)
  },
};
</script>

<style scoped>
::v-deep(.e-input-group.e-control-wrapper) {
  border-radius: 4px !important;
  border-color: #E0E0E0 !important;
}
.info-row {
  display: block; /* Cho phép key nằm trên */
  margin-bottom: 5px;
}

.info-row .key {
  margin-bottom: 4px;
  font-weight: bold;
}

.info-row .value {
  display: inline-block; /* Giữ input và button nằm ngang */
  vertical-align: top;
  padding-left: 0px !important;
}
 .wp100{
    width: 100%;
}
 .wp20{
    width: 20%;
}
 .wp80{
    width: 80%;
}
 .wp85{
    width: 85%;
}
 .wp90{
    width: 90%;
}
 .wp10{
    width: 10%;
}
 .input-row {
  display: flex;
  gap: 5px;
}

.input-row .value {
  flex: 1; /* chiếm hết phần còn lại */
}
.input-row .w30 {
  flex: 0 0 30px; /* cố định đúng 30px */
}
.tag-input {
  border: 1px solid #E0E0E0;
  padding: 6px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
}

.tag-input a {
  text-decoration: none;
  background-color: white;
  color: #343434;
  padding: 0px 0px;
  border-radius: 3px;
  font-size: 0.9rem;
}

.tag-input a:hover {
  background-color: white;
}

.tag-input input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 5px;
  font-size: 1rem;
  min-width: 100px;
}

.tag-input input::placeholder {
  color: #aaa;
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #ccc;
}

.file-link {
  color: #007bff;
  text-decoration: none;
  flex-grow: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-delete {
  background: none;
  border: none;
  color: red;
  font-size: 14px;
  cursor: pointer;
}
.custom-value-btn{
    min-width: 40px !important;
    display: flex !important;
    justify-content: center !important;
}
:deep(.e-control.e-dialog.task-kanban-dialog.e-popup-open .e-dlg-content) {
  max-height: 85vh !important;
  overflow-y: auto;
}
.task-kanban-dialog :deep(.e-dlg-header) {
  width: 95% !important;
}
/* .task-kanban-dialog :deep(.e-dlg-closeicon-btn) {
  bottom: 0 !important;
} */

</style>
