<template>
    <ejs-dialog ref='dialogUpdateBoard' :allowDragging="true" :enableResize="false" :position="{ X: 'center', Y: 'center' }"
        :visible="isDialog" :showCloseIcon="true" width="50%" :header='"Cập nhật bảng"' :isModal='true'
        :close="closeDialog">
        <div class="modal-content popup-box body-dialog">
            <div class="k form-dialog">
                <div class="k bd-form-input">
                    <k-input :textInput='"Tên bảng:"' :isImportain="true" @modelData='changeBoardName'
                        :dataInput='localBoard.board_name' />
                </div>
                <div class="k bd-form-input">
                    <k-input :textInput='"TelegramID:"' :isImportain="false" @modelData='changeTelegramId'
                        :dataInput='localBoard.telegram_id' />
                </div>
                <div class="k bd-form-input">
                    <span class="k category-text-detail">Loại bảng:<i class="warning-input">*</i></span>
                    <select2 v-model="localBoard.boardtype_id" class="select2"
                        :options="types.map(e => ({ id: e.boardtype_id, text: e.type_name }))"></select2>
                </div>
                <div class="k bd-form-input" v-if="localBoard.boardtype_id == 1">
                    <span class="k category-text-detail">Dự án:<i class="warning-input">*</i></span>
                    <select2 v-model="localBoard.project_id" class="select2"
                        :options="listProjects.map(e => ({ id: e.project_id, text: e.project_name }))"></select2>
                </div>
                <div class="k bd-form-input">
                    <span class="k category-text-detail">Danh sách thành viên trong bảng<i
                            class="warning-input">*</i></span>
                    <span class="k btn-change" title="Thêm mới thành viên" @click="addMemberToBoard()"><i
                            class="fa fa-plus" aria-hidden="true"></i></span>
                    <div class="k box-form">
                        <KDataGrid ref="gridDs" :columns="colums" :allowFilter="true" :enable-paging-server="false"
                            :dataSource="userListBoards" :allowPaging="true" :commands="commands"
                            :commandColumn="{ headerText: '', cellCssClass: 'css1', show: true, firstColumn: false, width: '130' }"
                            @commandClicked="commandClicked" :showFilter="true" :editSettings="editSettings"
                            :showColumnCheckbox="false" :enabledSelectFirstRow="false" :allowSorting="true"
                            @actionComplete="actionComplete" @onRowSelected="selectMember" @cellSaved="cellSaved" />
                    </div>
                </div>
                <div class="group-buttons -bottom center">
                    <button class="btn btn-outline-secondary button-update-account" @click="updateBoard"
                        style="width: 120px">
                        <i class="fa fa-pencel" aria-hidden="true"></i>Cập nhật
                    </button>
                </div>
            </div>
        </div>
    </ejs-dialog>


</template>
<script>
import { createApp } from "vue";
import BoardApi from '../../BoardApi.js';

const app = createApp();
export default {
    data() {
        return {
            editSettings: {
                allowEditing: true,
                mode: 'Normal'
            },
            listPermissionBoard: [],
            listTypeBoard: [],
            typeSelected: 1,
            types: [],
            listProjects: [],
            listUserToAddToBoard: [],
            listRoleOfMembers: [],
            commands: [
                {
                    name: 'deleteMember',
                    cssClass: 'btn btn-main -ap one-trash',
                    width: 40,
                    text: '',
                    title: 'Xóa thành viên trong board',
                },
            ],
            userListBoards: [...this.userListBoardProps],
            isCheckDeleteMember: true,
            memberSelected: {},
            localBoard: {}  // Shallow copy
        }
    },
    props: {
        boardSelected: {
            type: Object,
            default: {},
            required: true
        },
        isDialog: {
            type: Boolean,
            default: false,
            required: true
        },
        types: {
            type: Array,
            default: () => [],
            required: true
        },
        userListBoardProps: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    computed: {
        colums() {
            return [
                {
                    fieldName: "user_id",
                    headerText: "ID-người dùng",
                    allowFilter: true,
                    allowEditing: true,
                    width: '150'
                },
                {
                    fieldName: "username",
                    headerText: "Tài khoản người dùng",
                    allowFilter: true,
                    allowEditing: true,
                    width: '250',
                    editType: "dropdownedit",
                    editTemplate: this.columnTemplateSelect2(this, 'username')
                },
                {
                    fieldName: "board_role_name",
                    headerText: "Quyền trong board",
                    allowFilter: true,
                    allowEditing: true,
                    editType: "dropdownedit",
                    editTemplate: this.columnTemplateSelect2(this, 'board_role_name')
                }
            ]
        }
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialogUpdate');
            this.isCheckDeleteMember = true;
        },
        //thêm mới thành viên trong board(add tạm chưa lưu)
        addMemberToBoard() {
            this.userListBoards.unshift({
                board_id: this.boardSelected.board_id,
                user_id: 0,
                username: "",
                member_role_id: 3,
                board_role_name: "Member"
            });
        },
        // lấy danh sách người dùng để add vào board
        async getUserToAddToBoard() {
            try {
                this.listUserToAddToBoard = [];
                let response = await BoardApi.getUserToAddToBoard(this.axios)
                if (response.data.success) {
                    this.listUserToAddToBoard = response.data.data;
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
        //Lấy danh sách quyền trong board
        async getRoleOfMemberBoard() {
            try {
                this.listRoleOfMembers = [];
                let response = await BoardApi.getRoleOfMemberBoard(this.axios)
                if (response.data.success) {
                    this.listRoleOfMembers = response.data.data;
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
        // Cập nhật động 
        columnTemplateSelect2(parent, type) {
            return function () {
                return {
                    template: app.component("columnTemplateSelect2", {
                        template: ` <select2 :z-index="2000" class="select2" @select="onChangeSelect2Value" v-model="cp_value" :options="cp_items"></select2>`,
                        data() {
                            return {
                                parent: parent,
                                data: {},
                                list: [],
                                cp_value_backup: null,
                            }
                        },
                        computed: {
                            cp_value() {
                                if (type === 'board_role_name') {
                                    return this.data['member_role_id'];
                                }
                                else if (type === 'username') {
                                    return this.data['user_id'];
                                }
                                return this.data[type];
                            },
                            cp_items() {
                                var items = [];
                                if (type == 'board_role_name') {
                                    items = this.parent.listRoleOfMembers && this.parent.listRoleOfMembers.length > 0 ? this.parent.listRoleOfMembers.map(e => ({ id: e.member_role_id, text: e.board_role_name })) : []
                                }
                                else if (type == 'username') {
                                    items =
                                        this.parent.listUserToAddToBoard && this.parent.listUserToAddToBoard.length > 0
                                            ? this.parent.listUserToAddToBoard.map(e => ({
                                                id: e.user_id,
                                                text: `${e.full_name} (${e.username})`
                                            }))
                                            : [];
                                }

                                return items
                            },
                        },
                        methods: {
                            onChangeSelect2Value(e) {
                                this.parent.changeSelect2Value(this.data, type, {
                                    id: e.id,
                                    text: e.text
                                })
                            },
                        },
                        mounted() {
                            // this.cp_value_backup ={ ...this.cp_value } ;
                        },
                        watch: {
                            cp_value: {
                                immediate: true,
                                handler(newVal) {
                                    if (newVal) {
                                        this.cp_value_backup = newVal;
                                    }
                                }
                            }
                        }
                    })
                }
            }
        },
        // Thay đổi select change trên table
        changeSelect2Value(item, type, value) {
            if (type == 'username') {
                // kiểm tra user đã đc thêm hay chưa
                var temUser = this.userListBoards.findIndex(x => x.user_id === parseInt(value.id) && x.board_id == item.board_id);
                if (temUser > -1) {
                    this.$toast.error("Người dùng đã có trong board");
                    return;
                }
                if (item.index == 0) {// thêm mới 
                    this.userListBoards[0].user_id = parseInt(value.id);
                    this.userListBoards[0].username = value.text;
                }
                else {//edit các ô cũ
                    const index = this.userListBoards.findIndex(x => x.user_id == item.user_id && x.board_id == item.board_id);
                    if (index > -1) {
                        // this.$toast.error("Bạn chỉ được cập nhật quyền, không được phép thay đổi người dùng khác(bạn có thể xóa đi để thêm mới)");
                        this.userListBoards[index].user_id = value.id;
                        this.userListBoards[index].username = value.text;
                    }
                }
            }
            else if (type == 'board_role_name') {
                if (item.index == 0) {
                    this.userListBoards[0].member_role_id = parseInt(value.id);
                    this.userListBoards[0].board_role_name = value.text;
                }
                else {
                    const index = this.userListBoards.findIndex(x => x.user_id == item.user_id && x.board_id == item.board_id);
                    if (index > -1) {
                        this.userListBoards[index].member_role_id = parseInt(value.id);
                        this.userListBoards[index].board_role_name = value.text;
                    }
                }
            }
        },
        // nhấn vào các button trên row người dùng trong board
        async commandClicked(cmdName, rowData) {
            if (cmdName == 'deleteMember') {
                if (this.isCheckDeleteMember) {
                    let result = await this.$confirm('Thông báo', "Xác nhận xóa thành viên, nếu muốn khôi phục lại vui lòng tắt form và mở lại?");
                    if (result == 0) return;
                }
                this.isCheckDeleteMember = false;
                this.userListBoards = this.userListBoards.filter(user => user.user_id !== rowData.user_id);
            }
        },
        disableEnterKey(event) {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        },
        //chọn member
        selectMember(data) {
            this.memberSelected = data;
        },
        actionComplete(args) {
            if (args.requestType == "save") {
                this.userListBoards = this.userListBoards.concat([]);
            }
        },
        //Kiểm tra đã có chủ board chưa
        isCheckOwner(listUs) {
            var total = 0;
            listUs.forEach(element => {
                if (element.member_role_id == 1) {
                    total = total + 1;
                }
            });
            if (total >= 1) {
                return true;
            }
            else {
                return false;
            }
        },
        //cập nhật lại board
        async updateBoard() {
            if (!this.isCheckOwner(this.userListBoards)) {
                this.$toast.error("Chưa có chủ bảng, phải lựa chọn ít nhất 1 owner");
                return;
            }
            var rq = {
                board_name: this.localBoard.board_name,
                telegram_id: this.localBoard.telegram_id,
                boardtype_id: parseInt(this.localBoard.boardtype_id),
                project_id: this.localBoard.project_id,
                members: this.userListBoards,
                board_id: this.localBoard.board_id
            };
            // console.log('test',rq);
            if (!rq.board_name || rq.board_name.trim().length < 1) {
                this.$toast.error("Tên bảng không được để trống");
                return;
            }
            if (rq.members.length < 1) {
                this.$toast.error("Không được để trống thành viên trong bảng");
                return;
            }
            try {
                let response = await BoardApi.updateBoard(this.axios, rq);
                if (response.data.success) {
                    this.$toast.success("Cập nhật thành công");
                    this.$refs.dialogUpdateBoard.hide();
                    this.refeshDataBoard(response.data.data);
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

        // gọi component board để load lại data
        refeshDataBoard(data) {
            this.$emit('refeshDataBoard', data);
        },
        // thay đổi input
        changeTelegramId(data) {
            this.localBoard.telegram_id = data;
        },
        changeBoardName(data) {
            this.localBoard.board_name = data;
        },
    },
    created() {
        this.getUserToAddToBoard();
        this.getProjectToCreateBoard();
        this.getRoleOfMemberBoard();
        // this.userListBoards = [...this.userListBoardProps];
    },
    watch: {
        userListBoardProps: {
            immediate: true,
            handler(newVal) {
                this.userListBoards = [...newVal];
                // this.listUserToAddToBoard = this.listUserToAddToBoard.filter(user =>
                //     ![...newVal].some(existing => existing.user_id === user.user_id)
                // );
            }
        },
        boardSelected: {
            handler(newVal) {
                this.localBoard = JSON.parse(JSON.stringify(newVal)); // hoặc dùng lodash cloneDeep
            },
            immediate: true,
            deep: true // nếu cần theo dõi object lồng nhau
        }
    }
}
</script>
<style src="./Dialog_Update_Board.css" scoped></style>