<template>
  <ejs-dialog :visible="false" ref="popup" :header="header" showCloseIcon :isModal="true" width="50%" :target="'.main-wrapper'">
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
          <div class="row">
            <div class="col-sm-12 col-12">
              <div class="form-group">
                <label class="form-label bold">Nhân viên điều phối <span class="text-danger">*</span></label>
                <select2 v-model.number="coordination_id" :options="user_list" :disabled="!is_add_new" />
              </div>
            </div>
            <div class="col-sm-12 col-12">
              <div class="form-group">
                <label class="form-label bold">Nhân viên thực hiện <span class="text-danger">*</span></label>
                <select2 v-model.number="assignee_id" :options="user_list" />
              </div>
            </div>
          </div>
          <div class="group-buttons -bottom right mt-5">
            <button @click="onSave" class="btn btn-primary nocorner">
              <span class="icon fa fa-check"></span> Lưu
            </button>
            <button @click="hideModal" class="btn btn-secondary nocorner">
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>
<script>
export default {
    name: "CoordinatorModal",
    props: {
        is_add_new: Boolean,
        user_list: Array
    },
    data() {
        return {
            coordination_id: null,
            assignee_id: null,
            original_data: {}
        }
    },
    computed: {
        header() {
            return this.is_add_new ? 'Thêm mới nhân sự điều phối' : 'Cập nhật nhân sự điều phối';
        }
    },
    methods: {
        showModal(data = {}) {
            this.clear();
            if (!this.is_add_new) {
                this.original_data = { ...data };
                this.coordination_id = data.id.coordination_id;
                this.assignee_id = data.id.assignee_id;
            }
            this.$nextTick(() => {
                if (this.$refs.popup) {
                    this.$refs.popup.show();
                }
            });
        },
        hideModal() { this.$refs.popup.hide(); },
        clear() {
            this.coordination_id = null;
            this.assignee_id = null;
            this.original_data = {};
        },
        onSave() {
            if (!this.coordination_id || !this.assignee_id) {
                this.$toast.error("Vui lòng chọn đầy đủ nhân viên.");
                return;
            }
            const payload = {
                coordination_id: this.coordination_id,
                assignee_id: this.assignee_id
            };
            if (this.is_add_new) {
                this.$emit('add', payload);
            } else {
                const oldPayload = {
                    coordination_id: this.original_data.id.coordination_id,
                    old_assignee_id: this.original_data.id.assignee_id,
                    new_assignee_id: this.assignee_id
                };
                this.$emit('update', oldPayload);
            }
            this.hideModal();
        }
    }
}
</script>