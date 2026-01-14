<template>
    <ejs-dialog ref='dialogInsertBoard' :allowDragging="true" :enableResize="false"
        :position="{ X: 'center', Y: 'center' }" :visible="isDialog" :showCloseIcon="true" width="40%"
        :header='"Thêm mới bảng"' :isModal='true' :close="closeDialog">
        <div class="modal-content popup-box body-dialog">
            <div class="k form-dialog">
                <div class="k bd-form-input">
                    <k-input :textInput='"Tên bảng:"' :isImportain="true" @modelData='changeBoardName'
                        :dataInput='board.board_name' />
                </div>
                <div class="k bd-form-input">
                    <span class="k category-text-detail">Loại bảng:<i class="warning-input">*</i></span>
                    <select2 :key="`type-${select2Key}`" v-model="typeSelected" class="select2" :settings="select2Settings"
                        :options="types.map(e => ({ id: e.boardtype_id, text: e.type_name }))"></select2>
                </div>
                <div class="k bd-form-input" v-if="typeSelected == 1">
                    <span class="k category-text-detail">Dự án:<i class="warning-input">*</i></span>
                    <select2 :key="`project-${select2Key}`" v-model="projectSelected" class="select2" :settings="select2Settings"
                        :options="listProjects.map(e => ({ id: e.project_id, text: e.project_name }))"></select2>
                </div>
                <div class="k bd-form-input">
                    <k-input :textInput='"Telegram ID:"' :isImportain="false" @modelData='changeTelegramId'
                        :dataInput='board.telegram_id' />
                </div>
                <div class="k bd-form-input">
                    <span class="k category-text-detail">Thành viên<i class="warning-input">*</i></span>
                    <ejs-multiselect id="user-select" :dataSource="listUsers" v-model="listUserSelected"
                        placeholder="Chọn thành viên" :fields="{ value: 'value', text: 'text' }" :allowFiltering="true">
                        <template #itemTemplate="{ data }">
                            <div class="user-option">{{ data.full_name }} ({{ data.username }})</div>
                        </template>
                    </ejs-multiselect>


                </div>
                <div class="group-buttons -bottom center">
                    <button class="btn btn-outline-secondary button-update-account" @click="insertBoard"
                        style="width: 120px">
                        <i class="fa fa-plus" aria-hidden="true"></i>Thêm mới
                    </button>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import BoardApi from '../../BoardApi.js';
export default {
    data() {
        return {
            editSettings: {
                allowEditing: true,
                mode: 'Normal'
            },
            listUsers: [],
            listUserInBoard: [{ value: 1, text: "abc" }, { value: 2, text: "abc12312" }, { value: 3, text: "test" }],
            listPermissionBoard: [],
            listTypeBoard: [],
            listUserSelected: [],
            typeSelected: null,
            select2Key: 0,
            select2Parent: null,
            board: {
                board_name: "",
                boardtype_id: 1,
                telegram_id: ""
            },
            listProjects: [],
            projectSelected: null
        }
    },
    props: {
        isDialog: {
            type: Boolean,
            default: false,
            required: true
        },
        types: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    computed: {
        select2Settings() {
            const parent =
                this.select2Parent ||
                this.$refs.dialogInsertBoard?.ej2Instances?.element ||
                this.$refs.dialogInsertBoard?.$el ||
                document.body;
            return {
                dropdownParent: parent,
                width: '100%'
            };
        }
    },
    methods: {
        ensureSelect2Parent() {
            if (!this.select2Parent) {
                this.select2Parent =
                    this.$refs.dialogInsertBoard?.ej2Instances?.element ||
                    this.$refs.dialogInsertBoard?.$el ||
                    document.body;
            }
        },
        //đóng dialog insert
        closeDialog() {
            this.$emit('closeDialog')
        },
        openDialog() {
            this.ensureSelect2Parent();
            this.$refs.dialogInsertBoard.show();
        },
        // lấy danh sách người dùng để add vào board
        async getUserToAddToBoard() {
            try {
                this.listUsers = [];
                let response = await BoardApi.getUserToAddToBoard(this.axios)
                if (response.data.success) {
                    this.listUsers = response.data.data.map(e => ({
                        value: e.user_id,
                        full_name: e.full_name,
                        text: `${e.full_name} (${e.username})`,
                        username: e.username
                    }));
                    this.loading(false);
                }
                else {
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
            } catch (e) {
                this.$toast.error(e.message);
                this.loading(false);
            }
        },
        //Lấy danh sách dự án nhóm A,b,C
        async getProjectToCreateBoard() {
            try {
                this.listProjects = [];
                let response = await BoardApi.getProjectToCreateBoard(this.axios)
                if (response.data.success) {
                    this.listProjects = response.data.data;
                    if (response.data.data && response.data.data.length > 0) {
                        this.projectSelected = response.data.data[0].project_id;
                    }
                    this.loading(false);
                }
                else {
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
            } catch (e) {
                this.$toast.error(e.message);
                this.loading(false);
            }
        },
        // insert board
        async insertBoard() {
            var rq = {
                board_name: this.board.board_name,
                telegram_id: this.board.telegram_id,
                listUsers: this.listUserSelected,
                boardtype_id: this.typeSelected,
                project_id: this.projectSelected
            };
            if (!rq.board_name || rq.board_name.trim().length < 1) {
                this.$toast.error("Tên bảng không được để trống");
                return;
            }
            if (!rq.listUsers || rq.listUsers.length < 1) {
                this.$toast.error("Bạn chưa chọn thành viên trong bảng");
                return;
            }
            try {
                let response = await BoardApi.insertBoard(this.axios, rq);
                if (response.data.success) {
                    this.$toast.success("Thêm mới thành công");
                    this.$refs.dialogInsertBoard.hide();
                    this.loading(false);
                }
                else {
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
            } catch (e) {
                this.$toast.error(e.message);
                this.loading(false);
            }
        },
        // thay đổi input
        changeTelegramId(data) {
            this.board.telegram_id = data;
        },
        changeBoardName(data) {
            this.board.board_name = data;
        },
        // gọi component board để load lại data
        refeshDataBoard(data) {
            this.$emit('refeshDataBoard', data);
        }
    },
    created() {
        this.getUserToAddToBoard();
        this.getProjectToCreateBoard();
    },
    mounted() {
        this.ensureSelect2Parent();
    },
    watch: {
        types(newVal) {
            if (newVal && newVal.length > 0) {
                this.typeSelected = newVal[0].boardtype_id;

            }
        }
    }
}
</script>
<style src="./Dialog_Add_Board.css" scoped></style>
