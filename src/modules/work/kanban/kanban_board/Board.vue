<template>
    <div class="main-wrapper"  >
        <breadcrumb :header="header" />
        <div class="k main-form">
            <div class="k spit-left-form">
                <div class="k title-form">
                    <h4 class="k title">Nhóm bảng</h4>
                    <!-- <div class="form-edit-group">
                        <span class="k btn-change" @click="toggleTabInsertBoad(true)"><i class="fa fa-plus" aria-hidden="true"></i></span>
                        <span class="k btn-change" @click="toggleTabInsertBoad(true)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>
                        <span class="k btn-change" @click="deleteGroupBoard"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div> -->
                </div>
                <div class="k form-table bd-group-board">
                    <!-- <span v-for="type in listTypes" class="k text-name-group-board">Nhóm mặc định</span>
                    <span class="k text-name-group-board">Nhóm board điều hành</span>
                    <span class="k text-name-group-board">Nhóm Eoffice</span> -->
                    <span v-for="(type,index) in listTypes" @click="changeBoardType($event,type.boardtype_id)" :key="type.boardtype_id" :class="index==0 ? 'selet-btn' : ''" class="k text-name-group-board">{{ type.type_name }}</span>
                </div>
            </div>
            <div class="k spit-right-form">
                <div class="k title-form">
                    <h4 class="k title">Danh sách bảng</h4>
                    <div class="form-edit-group">
                        <button v-if="hasButtonPermission('insertBoard')" class="k btn-change bnt btn-primary" @click="toggleTabInsertBoad(true)"><i class="fa fa-plus" aria-hidden="true"></i> Thêm mới</button>
                        <button v-if="hasButtonPermission('updateBoard')" class="k btn-change bnt btn-primary" @click="toggleTabUpdateBoad(true)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Cập nhật</button>
                        <!-- <span class="k btn-change" @click="deleteGroupBoard"><i class="fa fa-trash-o" aria-hidden="true"></i></span> -->
                        <button v-if="hasButtonPermission('deleteBoard')" class="k btn-change bnt btn-primary" @click="deleteBoard"><i class="fa fa-trash-o" aria-hidden="true"></i> Xóa</button>
                    </div>
                </div>
                <div class="k form-table">
                    <KDataGrid  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listBoards"
                        :allowPaging="true"
                        :showFilter="true"
                        :showColumnCheckbox="false"
                        :enabledSelectFirstRow="false"
                        :allowSorting="true"
                        :commands="commands"
                        @onRowSelected="selectBoard"
                        :commandColumn="{headerText: 'Chức năng',cellCssClass: 'css1', show: true, firstColumn:false, width:'130'}"
                    />
                </div>
            </div>
        </div>
        <!-- change group -->
        <dialog-group :boardGroup="groupBoard" :isDialog="isDialogAddGroup"  />
        <!-- change board -->
        <dialog-update-board :isDialog="isDialogUpdateBoard" :userListBoardProps="listUserInBoards" @refeshDataBoard="binddingBoard" :boardSelected="boardSelected" @closeDialogUpdate="closeDialogUpdateBoard" :types="listTypes"/>
        <dialog-add-board :types="listTypes" @closeDialog ="closeDialog" :isDialog ="isDialog"  @refeshDataBoard="binddingBoard"/>
    </div>
</template>
<script>
import Dialog_GroupBoard from './dialog_modify_group_board/Dialog_GroupBoard.vue';
import Dialog_Add_Board from './dialog_modify_board/board_add_new/Dialog_Add_Board.vue';
import Dialog_Update_Board from './dialog_modify_board/board_update/Dialog_Update_Board.vue';
import BoardApi from './BoardApi';
import moment from 'moment';
export default{
    data(){
        return {
            header: {
                title: "Quản lý bảng(Board)",
                list: [
                ],
            },
            listBoards:[{id:1,'text':'Board này'}],
            colums:
            [
                {
                    fieldName: "board_id",
                    headerText: "ID",
                    width:'100'
                    
                },
                {
                    fieldName: "board_name",
                    headerText: "Tên board",
                },
                {
                    fieldName: "active",
                    headerText: "Trạng thái",
                },
                {
                    fieldName: "user_ins",
                    headerText: "Chủ sở hữu",
                },
                {
                    fieldName: "create_day",
                    headerText: "Ngày tạo",
                },
                {
                    fieldName: "telegram_id",
                    headerText: "Telegram_Id",
                }
            ],
            board:{},
            groupBoard:{},
            commands:[
                // {
                //     name: 'updateBoard',
                //     cssClass: 'btn btn-main -ap one-file-detail',
                //     width: 40,
                //     text: '',
                //     title: 'Cập nhật 1',
                // },
            ],
            isDialog:false,
            isDialogAddGroup:false,
            isDialogUpdateBoard:false,
            listTypes:[],
            boardSelected:{}
        }
    },
    components:{
        'dialog-group': Dialog_GroupBoard,
        'dialog-add-board':Dialog_Add_Board,
        'dialog-update-board':Dialog_Update_Board
    },
    methods:{
        // cập nhật nhóm board- khanhnv- 01/12/2024
        openTabInsertGroupBoad(){
            this.isDialogAddGroup = true;
        },
        //đóng dialog
        closeDialog(){
            this.isDialog = false;
        },
        //Đóng form update board
        closeDialogUpdateBoard(){
            this.isDialogUpdateBoard = false;
        },
        //xóa nhóm board - khanhnv- 01/12/2024
        async deleteGroupBoard(){
            let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`)
            if(result==0) {
                this.loading(false);
                return;
            }
            else{

            }
        },
        // Chọn btn cập nhật trên từng row - khanhnv- 01/12/2024
        async commandClicked(cmdName, rowData){
          if(cmdName=='updateBoard'){
             this.isDialogUpdateBoard = true;
          }
        },
        // Xóa board - khanhnv- 01/12/2024
        async deleteBoard(){
            if(!this.boardSelected.board_id || this.boardSelected.board_id ==0){
                this.$toast.warning("Vui lòng nhấn chọn một bảng");
                return;
            }
            let result = await this.$confirm('Thông báo', `Bạn có muốn xóa các lựa chọn này không?`)
            if(result==0) {
                this.loading(false);
                return;
            }
            else{
                try{ 
                    this.listBoards = [];
                    let response = await BoardApi.deleteBoard(this.axios,this.boardSelected.board_id)
                    if(response.data.success){
                        this.listBoards=response.data.data;
                        this.loading(false);
                    }
                    else{
                        this.$toast.error(response.data.message);
                        this.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            }
        },
        // Mở dialog tạo mới board - khanhnv- 01/12/2024
        toggleTabInsertBoad(type){
            this.isDialog = type;
        },
        //mở dialog cap nhap board
        async toggleTabUpdateBoad(type){
            if( Object.keys(this.boardSelected).length === 0 && this.boardSelected.constructor === Object){
                this.$toast.warning("Vui lòng chọn ít nhất một bảng");
                return;
            }
            await this.getMemberInBoard(this.boardSelected.board_id);
            this.isDialogUpdateBoard = type;
        },
        // get boards
        async getBoards(boardtype_id){
            try{
                this.listBoards = [];
				let response = await BoardApi.getBoardsForManagement(this.axios,boardtype_id)
				if(response.data.success){
					this.binddingBoard(response.data.data);
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        //đổ data board ra giao diện
        binddingBoard(data){
            this.listBoards = data.map(x=>{
                x.create_day= this.formatDate(x.create_day);
                return x;
            });
        },
        // lấy danh sách nhóm boards
        async getBoardType(){
            try{
                this.listTypes = [];
				let response = await BoardApi.getTypes(this.axios)
				if(response.data.success){
					this.listTypes=response.data.data;
                    if(this.listTypes.length>0){
                        this.getBoards(this.listTypes[0].boardtype_id);
                    }
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
        //chuyển nhóm board
        changeBoardType(event,boardtype_id){
            $('.text-name-group-board').removeClass('selet-btn');
            $(event.target).addClass('selet-btn');
            this.getBoards(boardtype_id);
        },
        //format date
        formatDate(date) {
            return date ? moment(date).format('DD/MM/YYYY') : '';
        },
        //Lấy danh sách người dùng trong board
        //chọn board
        selectBoard(data){
            this.boardSelected = data;
        },
        // lấy danh sách nhân sự trong boards
        async getMemberInBoard(board_id){
            try{
                this.listUserInBoards = [];
				let response = await BoardApi.getMemberInBoard(this.axios,board_id)
				if(response.data.success){
					this.listUserInBoards=response.data.data;
                    this.loading(false);
				}
				else{
					this.$toast.error(response.data.message);
                    this.loading(false);
				}
			}catch(e){
				this.$toast.error(e.message);
                this.loading(false);
			}
        },
    },
    created(){
        this.getBoardType();
        this.GetPermissionButtons()
    }
}
</script>
<style src="./Board.css" scoped></style>