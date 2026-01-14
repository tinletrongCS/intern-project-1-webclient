<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupMembers"
        :showCloseIcon="true"
        width="50%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal"
        :close="clear">
        <div class="modal-content popup-box" style="border:unset">
            <div class="popup-body" style="padding:0">
                <div class="box-form"  style="padding:0">                    
                    <div class="k" style="width:100%">
                        <div class="bd-form-button left">
                            <button class="btn btn-second" @click="addMember" style="min-width: 100px;">
                                <span class="icon fa fa-plus"></span>&nbsp;Thêm mới
                            </button>&nbsp;
                            <button class="btn btn-second" @click="editMember" style="min-width: 100px;">
                                <span class="icon fa fa-edit"></span>&nbsp;Điều chỉnh
                            </button>&nbsp;
                            <button class="btn btn-second" @click="deleteMember" style="min-width: 100px;">
                                <span class="icon fa fa-trash"></span>&nbsp;Xóa
                            </button>
                        </div>
                    </div>

                        <div class="k" style="width:100%">
                            <div class="border rounded bg-white">
                                <KDataGrid
                                    ref="membersGrid"
                                    :columns="memberColumns"
                                    :dataSource="members"
                                    :enable-paging-server="false"
                                    :allowPaging="true"
                                    :showFilter="false"
                                    :showColumnCheckbox="false"
                                    :showSTT="true"
                                    :enabledSelectFirstRow="false"
                                    :selectionSettings="{ checkboxMode: 'ResetOnRowClick' }"
                                    @rowSelected="onMemberRowSelected"
                                    @recordDoubleClick="onMemberRecordDoubleClick"
                                />
                            </div>
                        </div>

                </div>
            </div>
        </div>
    </ejs-dialog>

    <!-- Member Detail Modal -->
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupMemberDetail"
        :showCloseIcon="true"
        width="30%"
        :isModal='true'
        :target="target"
        :header="memberModalHeader"
        :open="handleShowMemberModal"
        :close="clearMemberModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="form-label bold">Họ tên <required-marker/></label>
                                <select2 
                                    v-model="memberForm.userId" 
                                    :options="availableUsers"
                                    placeholder="Chọn thành viên..."
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="form-label bold">Vai trò <required-marker/></label>
                                <select2 
                                    v-model="memberForm.typeId" 
                                    :options="memberRoles"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="group-buttons text-right mb-3 mr-3">
                <button class="btn btn-second nocorner" @click="saveMember">
                    <span class="icon one-save"></span>&nbsp;Lưu
                </button>
                <button class="btn btn-primary nocorner" @click="closeMemberModal">
                    Hủy
                </button>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>
import API from '../ProjectAPI';

export default {
    name: "ProjectMembersModal",
    props: {
        projectData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            showValidation: false,
            isAddMember: false,
            selectedMember: null,
            members: [],
            availableUsers: [],
            memberRoles: [],
            
            memberForm: {
                userId: null,
                typeId: null,
            },
            
            memberColumns: [
                { fieldName: 'fullName', headerText: 'Họ tên', width: '300' },
                { fieldName: 'roleName', headerText: 'Vai trò', width: '200' }
            ]
        };
    },
    computed: {
        header() {
            return `Quản lý thành viên - ${this.projectData.projectName || 'N/A'}`;
        },
        memberModalHeader() {
            return this.isAddMember ? 'Thêm thành viên' : 'Chỉnh sửa thành viên';
        }
    },
    methods: {
        showModal() { this.$refs.popupMembers.show(); },
        close() { this.$refs.popupMembers.hide(); },
        
        async handleShowModal() {
            this.selectedMember = null;
            await this.loadInitialData();
        },
        async loadInitialData() {
            this.loading(true);
            try {
                const [membersData, usersData, rolesData] = await Promise.all([
                    API.GetProjectMembers(this, this.projectData.id),
                    API.GetActiveUsers(this),
                    API.GetActiveMemberRoles(this)
                ]);
                this.members = membersData;
                this.availableUsers = usersData;
                this.memberRoles = rolesData;
            } catch (error) {
                this.$toast.error("Lỗi khi tải dữ liệu cho modal thành viên.");
            } finally {
                this.loading(false);
            }
        },

        loading(show) { this.$root.showLoading(show); },
        
        addMember() {
            this.isAddMember = true;
            this.clearMemberForm();
            this.$refs.popupMemberDetail.show();
        },
        
        editMember() {
            if (!this.selectedMember) {
                this.$toast.error('Vui lòng chọn một thành viên để điều chỉnh.');
                return;
            }
            this.isAddMember = false;
            this.memberForm = {
                userId: this.selectedMember.userId,
                typeId: this.selectedMember.roleId
            };
            this.$refs.popupMemberDetail.show();
        },

        onMemberRowSelected(args) {
            this.selectedMember = args.data;
        },
        
        onMemberRecordDoubleClick(args) {
            if (args.rowData) {
                this.selectedMember = args.rowData;
                this.editMember();
            }
        },

        async deleteMember() {
            if (!this.selectedMember) {
                this.$toast.error('Vui lòng chọn một thành viên để xóa.');
                return;
            }
            
            const result = await this.$confirm(`Bạn chắc chắn muốn xóa thành viên '${this.selectedMember.fullName}'?`, 'Xác nhận');
            if (!result) return;
            const params = {
                projectId: this.selectedMember.projectId,
                userId: this.selectedMember.userId,
                typeId: this.selectedMember.roleId
            };

            const response = await API.DeleteProjectMember(this, params);
            if (response && response.success) {
                this.$toast.success('Xóa thành viên thành công!');
                this.$emit('successMembers');
                this.selectedMember = null;
                await this.loadInitialData();
            }
        },

        // --- Member Detail Modal Methods ---
        handleShowMemberModal() { this.showValidation = false; },
        closeMemberModal() { this.$refs.popupMemberDetail.hide(); },
        clearMemberForm() {
            this.memberForm = { userId: null, typeId: null };
            this.showValidation = false;
        },
        async saveMember() {
            this.showValidation = true;
            if (this.memberForm.userId == null || this.memberForm.typeId == null) {
                this.$toast.error('Vui lòng chọn đầy đủ thông tin');
                return;
            }
            
            let response;
            if (this.isAddMember) {
                const payload = { 
                    project_id: this.projectData.id,
                    user_id: this.memberForm.userId,
                    type_id: this.memberForm.typeId 
                };
                response = await API.AddProjectMember(this, payload);
            } else {
                const payload = {
                    project_id: this.projectData.id,
                    original_user_id: this.selectedMember.userId,
                    original_type_id: this.selectedMember.roleId,
                    user_id: this.memberForm.userId,
                    type_id: this.memberForm.typeId 
                };
                response = await API.UpdateProjectMember(this, payload);
            }
            
            if (response && response.success) {
                this.$emit('successMembers');
                this.closeMemberModal();
                this.selectedMember = null;
                await this.loadInitialData();
            }
        }
    }
}
</script>

<style src="../Project.css" scoped></style>
