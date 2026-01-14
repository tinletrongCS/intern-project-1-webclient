<template>
    <div class="main-wrapper">
        <breadcrumb :header="header" />
        <div class="k per-main-form">
            
            <div class="k boder-title-per">
                <span class="k title">Nhóm quyền:</span>
                <select class="k select-group" v-on:change="onChange()" v-model=group_id>
                    <option v-for="(gr,index) in listGroup" :key="index" v-bind:value="gr.group_id">{{ gr.group_name }}</option>
                </select>
                <span  @click="onpenModalInsert()">
                    <i class="fa fa-plus-square-o btn-icon" aria-hidden="true"></i>
                </span>
                <span v-on:click="onpenModalUpdate()" title="Edit store">
                <i class="fa fa-pencil-square-o btn-icon"></i>
                </span>
                <span v-on:click ="deleteGroup()"><i class="fa fa-trash-o btn-icon" aria-hidden="true"></i></span> 
            </div>
            <TableData :colums="colums" :listDataIn="listUserInGroup" :listDataNotIn ="listUserNotInGroup" @addToGroup ='addUserToGroup' 
                @removeInGroup="removeUserToGroup" :titleIn = titleUserIn :titleNotIn = titleUserNotIn />
            <TableData  :colums="colums2" :listDataIn ="listPermissionNotInGroup" :listDataNotIn ="listPermissionInGroup" @addToGroup ='removePermissionInGroup' 
                @removeInGroup="addPermissionToGroup" :titleIn = titlePermissionIn :titleNotIn = titlePermissionNotIn />
        </div>
        <!-- -------------------------------- create group roles ----------------------------------->
        <ejs-dialog
                ref='modalInsertGr'
                :allowDragging="true"
                :enableResize="false"
                :position="{X:'center', Y:'center'}"
                :visible="false"
                :showCloseIcon="true"
                width="60%"
                :header='"Tạo mới nhóm phân quyền"'
                :isModal='true'>
                <div class="modal-content popup-box">
                    <div class="popup-body">
                        <div class="k dl-sm-it">
                            <span class="k t dl-name-fml">Group Name:</span>
                            <input class="k dl-input-fml" v-model="groupInsert.group_name" type="text"/>
                        </div>
                        <div class="k dl-sm-it">
                            <span class="k t dl-name-fml" >Note:</span>
                            <textarea class="k dl-input-fml" v-model="groupInsert.note"  type="text"/>
                        </div>
                    </div>
                    <div class="group-buttons -bottom center">
                        <button
                            class="btn btn-outline-secondary"
                            @click="insertGroup" 
                            style="width: 120px"
                        >
                        Thêm mới
                        </button>
                    </div>
                </div>
        </ejs-dialog>
        <!-- -------------------------------- create group roles ----------------------------------->
        <ejs-dialog
                ref='modalUpdateGr'
                :allowDragging="true"
                :enableResize="false"
                :position="{X:'center', Y:'center'}"
                :visible="false"
                :showCloseIcon="true"
                width="60%"
                :header='"Tạo mới nhóm phân quyền"'
                :isModal='true'>
                <div class="modal-content popup-box">
                    <div class="popup-body">
                        <div class="k dl-sm-it">
                            <span class="k t dl-name-fml">Group Name:</span>
                            <input class="k dl-input-fml" v-model="groupUpdate.group_name" type="text"/>
                        </div>
                        <div class="k dl-sm-it">
                            <span class="k t dl-name-fml" >Note:</span>
                            <textarea class="k dl-input-fml" v-model="groupUpdate.note"  type="text"/>
                        </div>
                    </div>
                    <div class="group-buttons -bottom center">
                        <button
                            class="btn btn-outline-secondary"
                            @click="updateGroup" 
                            style="width: 120px"
                        >
                        Cập nhật
                        </button>
                    </div>
                </div>
        </ejs-dialog>

    </div>
</template>
<script>
import TableData from '../../../components/controls/tab/TableData.vue';
import GroupApi from './GroupApi';
import PermissionApi from './PermissionApi';
export default {
    data() {
        return{
            listGroup:[],
            group_id:0,
            listPermissionInGroup:[],
            listPermissionNotInGroup:[],
            listUserInGroup:[],
            listUserNotInGroup:[],
            listUserInGroupFilter:[],
            listUserNotInGroupFilter:[],
            groupInsert:{
                "group_id":0,
                "note":"",
                "active":true,
                "group_name":""
            },
            groupUpdate:Object(),
            isInsertGroup:true,
            isUpdateGroup:true,
            searchQuery:'',
            searchQueryUserNotInGroup:'',
            titleUserIn:'Danh sách người dùng',
            titleUserNotIn:'Người dùng trong nhóm',
            titlePermissionIn:'Quyền trong nhóm',
            titlePermissionNotIn:'Danh sách quyền',
            optionsNumberRowPerPage:15,
            page :0,
            pagerData:[],
            colums:[
                {
                    fieldName: "user_id",
                    headerText: "Id",
                    allowFilter: true,
                    width:60
                },
                {
                    fieldName: "username",
                    headerText: "Tên đăng nhập",
                    allowFilter: true
                }
            ],
            colums2:[
                {
                    fieldName: "per_id",
                    headerText: "Id quyền",
                    allowFilter: true,
                    width:50
                },
                {
                    fieldName: "per_name",
                    headerText: "Quyền",
                    allowFilter: true,
                    width:170
                },
                {
                    fieldName: "permission_type",
                    headerText: "Phân loại",
                    allowFilter: true,
                    width:100
                }
            ],
            header: {
                title: "Phân quyền người dùng",
                list: [
                ],
            },
        }
    },
    methods:{
        onChange(){
            this.getUsersInGroup();
            this.getUsersNotInGroup();
            this.getPermissonsInGroup();
            this.getPermissonsNotInGroup();
        },
        onpenModalInsert(){
            this.$refs.modalInsertGr.show();
        },
        onpenModalUpdate(){
            this.$refs.modalUpdateGr.show();
            this.groupUpdate = this.listGroup.find(m=>m.group_id == this.group_id);
        },
        async getGroups(){
            try{
                let response = await GroupApi.getGroups(this.axios);
                if(response.data.success){
                    if(response.data.data){
                        this.listGroup = response.data.data;
                        if(response.data.data.length>0){
                            this.bindingGroups(response.data.data);
                            this.loading(false);
                        }
                        else{
                            this.loading(false);
                        }
                        this.loading(false);
                    }
                }
                else{
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
            }
            catch(e){
            }
        },
        /*
        * Insert the group
        * create by khanh 20/08/2022
            */
        async insertGroup(){
            try{
                this.loading(false);
                if(this.groupInsert.group_name.trim().length== 0){
                    this.$toast.warning("Tên nhóm quyền không được để trống");
                    return;
                }
                let response = await GroupApi.insertGroup(this.axios,this.groupInsert);
                if(response.data.success){
                    if(response.data.data){
                        this.listGroup = response.data.data;
                        this.groupInsert = {
                                        "group_id":0,
                                        "note":"",
                                        "active":1,
                                        "group_name":""
                                    };
                        this.$refs.modalInsertGr.hide();
                        this.$toast.success(response.data.message);
                        this.loading(false);
                    }
                }
                else{
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
            }
            catch(e){
                this.loading(false);
            }
        },
        /*
        * update the group
        * create by khanh 20/08/2022
            */
        async  updateGroup(){
            try{
                this.loading(false);
                if(this.groupUpdate.group_name.trim().length== 0){
                    this.$toast.warning("Tên nhóm quyền không được để trống");
                    return;
                }
                let response = await GroupApi.updateGroup(this.axios,this.groupUpdate);
                if(response.data.success){
                    if(response.data.data){
                        this.listGroup = response.data.data;
                        this.$refs.modalUpdateGr.hide();
                        this.$toast.success(response.data.message);
                        this.loading(false);
                    }
                }
                else{
                    this.$toast.error(response.data.message);
                    this.loading(false);
                }
            }
            catch(e){
                this.loading(false);
            }
        },
        /*
        * Delte the group
        * create by khanh 22/08/2022
            */
        async deleteGroup(){
            var self = this;
            this.loading(false);

            let result = await this.$confirm('Thông báo', "Bạn có muốn xóa cách giảm này không?");
            if (result==0) return;
            else{
                try{
                    let response = await GroupApi.deleteGroup(self.axios,self.group_id);
                    if(response.data.success){
                        if(response.data.data){
                            self.bindingGroups(response.data.data);
                            self.$toast.success(response.data.message);
                        }
                    }
                    else{
                        self.$toast.error(response.data.message);
                        self.loading(false);
                    }
                }catch(e){
                    this.$toast.error(e.message);
                    this.loading(false);
                }
            }
        },
        /**
         * bindding groups to view
         */
        bindingGroups(groups){
            this.listGroup = groups;
            if(groups.length>0){
                this.group_id = groups[0].group_id;
                this.groupUpdate = groups[0];
                this.loading(false);
                this.getUsersInGroup();
                this.getUsersNotInGroup();
                this.getPermissonsInGroup();
                this.getPermissonsNotInGroup();
            }
        },
        /*******************************************************************************************************
         * get users in the group
         *  create by khanh 21/08/2022
         ********************************************************************************************************/
        async getUsersInGroup(){
            try{
                let response = await PermissionApi.getUsersInGroup(this.axios,this.group_id);
                if(response.data.success){
                    this.listUserInGroup = response.data.data;
                    // console.log('user  in ',this.listUserInGroup)
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
        /**
         * get users not in group 
         *  create by khanh 21/08/2022
         ***/
        async getUsersNotInGroup(){
            try{
                let response = await PermissionApi.getUsersNotInGroup(this.axios,this.group_id);
                if(response.data.success){
                    this.listUserNotInGroup = response.data.data;
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
        /**
         * get permission in group 
         * create by khanh 21/08/2022
         ***/
        async getPermissonsInGroup(){
            try{
                let response = await PermissionApi.getPermissonsInGroup(this.axios,this.group_id);
                if(response.data.success){
                    this.listPermissionInGroup = response.data.data;
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
        /**
         * get permission not in group 
         * create by khanh 21/08/2022
         ***/
        async getPermissonsNotInGroup(){
            try{
                let response = await PermissionApi.getPermissonsNotInGroup(this.axios,this.group_id);
                if(response.data.success){
                    this.listPermissionNotInGroup = response.data.data;
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
        /**
         * add the user to the group permission, add one or more user
         *  create by khanh 21/08/2022
         ***/
        async addUserToGroup(data){
            if(data.length==0){
                this.$toast.warning("Vui lòng lựa chọn ít nhật 1 row");
                return;
            }
            try{
                var rq = {
                    listUsers :data,
                    group_id:this.group_id
                };
                let response = await PermissionApi.addUserToGroup(this.axios,rq);
                if(response.data.success){
                    this.listUserInGroup = this.listUserInGroup.concat(data);
                    this.listUserNotInGroup = this.listUserNotInGroup.filter( ( el ) => !data.includes( el ) );
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
        /**
         * remove the user to the group permission, remove one or more user
         *  create by khanh 21/08/2022
         */
        async removeUserToGroup(data){
            // data.forEach(element => {
            //     delete element.checked;
            // });
            if(data.length==0){
                this.$toast.warning("Vui lòng lựa chọn ít nhật 1 row");
                return;
            }
            try{
                var rq = {
                    listUsers :data,
                    group_id:this.group_id
                };
                let response = await PermissionApi.removeUserToGroup(this.axios,rq);
                if(response.data.success){
                    this.listUserNotInGroup = this.listUserNotInGroup.concat(data);
                    this.listUserInGroup = this.listUserInGroup.filter( ( el ) => !data.includes( el ) );
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
        /**
         * add the permission (menu) to the group permission, add one or more permission
         *  create by khanh 21/08/2022
         */
        async addPermissionToGroup(data){
            // data.forEach(element => {
            //     delete element.checked;
            // });
            if(data.length==0){
                this.$toast.warning("Vui lòng lựa chọn ít nhật 1 row");
                return;
            }
            try{
                var rq = {
                    listPers :data,
                    group_id:this.group_id
                };
                let response = await PermissionApi.addPermissionToGroup(this.axios,rq);
                if(response.data.success){
                    this.listPermissionInGroup = this.listPermissionInGroup.concat(data);
                    // console.log(this.listPermissionInGroup);
                    this.listPermissionNotInGroup = this.listPermissionNotInGroup.filter( ( el ) => !data.includes( el ) );
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        },
            /**
         * remove the permission (menu) to the group permission, remove one or more permission
         *  create by khanh 21/08/2022
         */
        async removePermissionInGroup(data){
            // data.forEach(element => {
            //     delete element.checked;
            // });
            if(data.length==0){
                this.$toast.warning("Vui lòng lựa chọn ít nhật 1 row");
                return;
            }
            try{
                var rq = {
                    listPers :data,
                    group_id:this.group_id
                };
                let response = await PermissionApi.removePermissionToGroup(this.axios,rq);
                if(response.data.success){
                    this.listPermissionNotInGroup = this.listPermissionNotInGroup.concat(data);
                    this.listPermissionInGroup = this.listPermissionInGroup.filter( ( el ) => !data.includes( el ) );
                }
                else{
                    this.$toast.error(response.data.message);
                }
            }
            catch(e){
            }
        }
    },
    components:
    {
        TableData,
    },
    mounted()
    {
        this.getGroups();
    },
}
</script>
<style src="./Permission.css" scoped></style>