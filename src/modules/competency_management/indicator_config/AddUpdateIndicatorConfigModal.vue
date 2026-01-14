<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupAddUpdateIndicator"
    :showCloseIcon="true"
    width="70%"
    :isModal="true"
    :target="target"
    :header="header"
    id="add-update-indicator-config"
    :open="handleShowModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">

          <!-- Nhóm dịch vụ / Loại dịch vụ -->
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key bold">Nhóm dịch vụ<required-marker/></div>
                <div class="value">
                  <select2
                    v-model="service_group_id"
                    :options="service_group_list"
                    @select="changeGroupService"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key bold">Loại dịch vụ<required-marker/></div>
                <div class="value">
                  <select2
                    v-model="service_type_id"
                    :options="service_type_list"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Dịch vụ -->
          <div class="info-row">
            <div class="key bold">Dịch vụ<required-marker/></div>
            <div class="value">
              <select2
                v-model="service_id"
                :options="service_list"
              />
              
            </div>
          </div>

          <!-- Đối tượng -->
          <div class="info-row">
            <div class="key bold">Đối tượng<required-marker/></div>
            <div class="value">
              <!-- <select2
                v-model="target_id"
                :options="target_list"
              /> -->
              <Select2Multiple
                  v-model="targetIds"
                  :options="target_list"
                  :placeholder="'Chọn'"
                  multiple
                />
            </div>
          </div>

          <!-- Bắt buộc -->
          <div class="info-row">
            <div class="value">
              <label class="checkbox-inline">
                <input type="checkbox" class="check" v-model="is_required" />
                Bắt buộc
              </label>
            </div>
          </div>

          <!-- Khởi đầu -->
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key">Điều kiện khởi đầu</div>
                <div class="value">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập thông tin điều kiện"
                    :value="start_condition"
                    @input="onInputDecimal($event, 'start_condition')"
                    @change="e => start_condition = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key">Điểm tích lũy khởi đầu</div>
                <div class="value">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Điểm tích lũy"
                    :value="start_point"
                    @input="onInputDecimal($event, 'start_point')"
                    @change="e => start_point = e.target.value"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Chuyên nghiệp -->
          <div class="row">
            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key">Điều kiện chuyên nghiệp</div>
                <div class="value">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập thông tin điều kiện"
                    :value="pro_condition"
                    @input="onInputDecimal($event, 'pro_condition')"
                    @change="e => pro_condition = e.target.value"
                  />
                </div>
              </div>
            </div>

            <div class="col-sm-6 col-12">
              <div class="info-row">
                <div class="key">Điểm tích lũy chuyên nghiệp</div>
                <div class="value">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Điểm tích lũy"
                    :value="pro_point"
                    @input="onInputDecimal($event, 'pro_point')"
                    @change="e => pro_point = e.target.value"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Hợp đồng nghiệm thu -->
          <div class="row">
            <div class="col-sm-6 col-12">

              <div class="info-row">
                <div class="key bold">Có hay không hợp đồng nghiệm thu</div>
                <div class="value">
                  <label class="checkbox-inline">
                      <input
                        type="checkbox"
                        class="check"
                        v-model="has_acceptance"
                      />
                      Hợp đồng đã nghiệm thu
                    </label>
                </div>
              </div>

            </div>
            <div class="col-sm-6 col-12">

              <div class="info-row">
                <div class="key"></div>
                <div class="value">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Điểm tích lũy"
                    :disabled="!has_acceptance"
                    :value="acceptance_point"
                    @input="onInputDecimal($event, 'acceptance_point')"
                    @change="e => acceptance_point = e.target.value"
                  />
                </div>
              </div>

            </div>
          </div>
          
          <!-- Buttons -->
          <div class="group-buttons -bottom right" style="margin-top: 24px;">
            <button class="btn btn-second nocorner" style="min-width: 160px;" @click="onSave">
              <span class="icon one-save"></span> Lưu
            </button>
          </div>

        </div>
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import API from './API'
import Select2Multiple from '@/components/controls/Select2Multiple.vue'
export default {
  name: 'AddUpdateIndicatorConfigModal',
  components:{
    Select2Multiple
  },
  props: {
    isAdd: { type: Boolean, default: true },
    data: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      target: '.main-wrapper',
      animationSettings: { effect: 'Zoom' },
      header: 'Cấu hình chỉ số năng lực',

      service_group_id: 0,
      service_type_id: 0,
      service_id: 0,
      targetIds: [],
      is_required: false,

      start_condition: '',
      start_point: '',
      pro_condition: '',
      pro_point: '',

      has_acceptance: false,

      service_group_list: [{ id: 0, text: 'Chọn' }],
      service_type_list: [{ id: 0, text: 'Chọn' }],
      service_list: [{ id: 0, text: 'Chọn' }],
      target_list: [],

      acceptance_point:'',

      dataObject:{}
    }
  },
  computed: {

  },
  methods: {
    showModal() {
      this.$refs.popupAddUpdateIndicator.show()
    },
    hideModal() {
      this.$refs.popupAddUpdateIndicator.hide()
    },
    handleShowModal() {
      this.clear()
      setTimeout(()=>{
        this.loadInitData()
      }, 500)
      //if (!this.isAdd) this.initData()
    },
    async loadInitData() {
      this.loading(true)
      await Promise.all([
        this.loadServiceGroup(),
        this.loadServiceType(),
        this.loadService(),
        this.loadIndicatorObject()

      ])
      this.loading(false)

      if(!this.isAdd){
        Object.assign(this.dataObject, this.data)

        // ===== SELECT =====
        this.service_group_id = Number(this.dataObject.service_group_id) || 0
        this.service_type_id  = Number(this.dataObject.service_type_id) || 0
        this.service_id       = Number(this.dataObject.service_id) || 0

        this.targetIds        = Number(this.dataObject.object_ids) || 0

        // ===== CHECKBOX =====
        this.is_required    = !!this.dataObject.is_required
        this.has_acceptance = !!this.dataObject.has_acceptance

        // ===== TEXT =====
        this.start_condition = this.dataObject.start_condition || ''
        this.pro_condition   = this.dataObject.pro_condition || ''

        // ===== NUMBER (đổi sang string để input hiển thị đúng) =====
        this.start_point =
          this.dataObject.start_point !== null && this.dataObject.start_point !== undefined
            ? String(this.dataObject.start_point)
            : ''

        this.pro_point =
          this.dataObject.pro_point !== null && this.dataObject.pro_point !== undefined
            ? String(this.dataObject.pro_point)
            : ''

        this.acceptance_point =
          this.dataObject.has_acceptance &&
          this.dataObject.acceptance_point !== null &&
          this.dataObject.acceptance_point !== undefined
            ? String(this.dataObject.acceptance_point)
            : ''
      }
    },
    changeGroupService(){
      this.service_type_id=0
    },

    async loadServiceGroup() {
      const data = await API.GetAllServiceGroup(this)
      this.service_group_list = [
        { id: 0, text: 'Chọn' },
        ...data.map(x => ({
          id: x.service_group_id,
          text: x.service_group_name
        }))
      ]
    },

    async loadServiceType() {
      const data = await API.GetAllServiceType(this)
      this.service_type_list = [
        { id: 0, text: 'Chọn' },
        ...data.map(x => ({
          id: x.service_type_id,
          text: x.service_type_name
        }))
      ]
      
    },
    async loadService(){
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
      
    },
    async loadIndicatorObject() {
      const data = await API.GetAllIndicatorObject(this)
      this.target_list = [
          ...data.map(x => ({
            id: x.indicator_object_id,
            text: x.indicator_object_name
          }))
        ]
    },

    clear() {
      this.service_group_id = 0
      this.service_type_id = 0
      this.service_id = 0
      this.targetIds = []
      this.is_required = false
      this.start_condition = ''
      this.start_point = ''
      this.pro_condition = ''
      this.pro_point = ''
      this.has_acceptance = false
      this.acceptance_point=''

      this.service_group_list=[{ id: 0, text: 'Chọn' }]
      this.service_type_list= [{ id: 0, text: 'Chọn' }]
      this.service_list=[{ id: 0, text: 'Chọn' }]
      this.target_list=[{ id: 0, text: 'Chọn' }]

    },
    async onSave() {
      if (!this.service_id || this.targetIds.length == 0 || !this.service_group_id || !this.service_type_id) {
        this.$toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
        return
      }

      let confirm = await this.$confirm(
        'Thông báo',
        this.isAdd ? 'Bạn chắc chắn muốn thêm mới?' : 'Bạn chắc chắn muốn cập nhật?'
      )
      if (confirm === 0) return

      if(this.isAdd){
        this.addIndicator()
      }else{
        this.updateIndicator()
      }
    },
    async addIndicator(){
      var dataRequest = {
        service_group_id: Number(this.service_group_id) || 0,
        service_type_id: Number(this.service_type_id) || 0,
        service_id: Number(this.service_id) || 0,

        objectIds:JSON.stringify(this.targetIds.map(x=>Number(x))),

        is_required: !!this.is_required,

        start_condition: this.start_condition!=''&& this.start_condition != null?Number(this.start_condition):null,
        start_point: this.start_point != '' && this.start_point != null
          ? Number(this.start_point)
          : null,

        pro_condition: this.pro_condition!=''&& this.pro_condition != null?Number(this.pro_condition):null,
        pro_point: this.pro_point !== '' && this.pro_point != null
          ? Number(this.pro_point)
          : null,

        has_acceptance: !!this.has_acceptance,
        acceptance_point: this.has_acceptance &&
          this.acceptance_point !== '' &&
          this.acceptance_point != null
            ? Number(this.acceptance_point)
            : null
      }
      let result=await API.AddIndicatorConfig(this, dataRequest)
      if(result=='1'){
          this.$toast.success('Thêm mới thành công!')
          this.$emit('successAddUpdate')
          this.hideModal()
      }else{
          this.$toast.error(result)
      }
      

    },
    async updateIndicator(){
      if (!this.dataObject.indicator_config_id) {
        this.$toast.error('Không tìm thấy ID cấu hình để cập nhật')
        return
      }

      const dataRequest = {
        indicator_config_id: Number(this.dataObject.indicator_config_id),

        service_group_id: Number(this.service_group_id) || 0,
        service_type_id: Number(this.service_type_id) || 0,
        service_id: Number(this.service_id) || 0,

        objectIds:JSON.stringify(this.targetIds.map(x=>Number(x))),

        is_required: !!this.is_required,

         start_condition: this.start_condition!=''&& this.start_condition != null?Number(this.start_condition):null,
        start_point: this.start_point != '' && this.start_point != null
          ? Number(this.start_point)
          : null,

        pro_condition: this.pro_condition!=''&& this.pro_condition != null?Number(this.pro_condition):null,
        pro_point:
          this.pro_point !== '' && this.pro_point != null
            ? Number(this.pro_point)
            : null,

        has_acceptance: !!this.has_acceptance,
        acceptance_point:
          this.has_acceptance &&
          this.acceptance_point !== '' &&
          this.acceptance_point != null
            ? Number(this.acceptance_point)
            : null
      }

      const result = await API.UpdateIndicatorConfig(this, dataRequest)

      if (result == '1') {
        this.$toast.success('Cập nhật thành công!')
        this.$emit('successAddUpdate')
        this.hideModal()
      } else {
        this.$toast.error(result)
      }
    },
    onInputDecimal(event, field) {
      let value = event.target.value

      // Chỉ cho số và dấu .
      value = value.replace(/[^0-9.]/g, '')

      // Chỉ cho 1 dấu .
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      event.target.value = value
      this[field] = value
    }
  }
}
</script>

<style>
:deep(#add-update-indicator-config .e-dlg-content) {
  max-height: 85vh;
  overflow-y: auto;
}

#add-update-indicator-config .info-row {
  display: table;
  width: 100%;
  table-layout: fixed;
}

#add-update-indicator-config .info-row .key {
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  display: table-caption;
  padding-left: 6px;
}
#add-update-indicator-config .acceptance-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

#add-update-indicator-config .acceptance-point {
  width: 160px;
}
</style>
