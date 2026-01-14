<template>
    <div class="membergroup">
        <div class="avatar-group">
            <div v-for="img in displayedMembers" :key="img.UserId" class="avatar">
                <span class="avatar-name">{{img.Name}}</span>
                <img 
                    v-if="!img.loadError&&img.AvatarUrl&&img.AvatarUrl!=''" 
                    :src="urlAvatarView(img)" 
                    :title="img.Name"
                    class="avatar-image"
                    @error="img.loadError = true"
                />
                <!-- <img v-if="img.AvatarUrl" :src="img.AvatarUrl" alt="Image">
                <div v-if="!img.AvatarUrl" class="step-task-account-name">{{img.PrefixName}}</div> -->
                <!-- Để tạm -->
                <div v-else class="step-task-account-name">{{img.PrefixName}}</div>
            </div>
            <div v-if="boardMembers.length > 10" class="avatar">
                <span class="step-task-account-more">{{boardMembers.length - 10}}+</span>
            </div>
            <div class="avatar" style="cursor: pointer;" v-if="(ownerBoardFlg ||subOwnerBoardFlg|| allowAddBoardFlg)&&!boardClosed" @click="onClickShowPopupMember">
                <img src="../../../../assets/img/plus.png" alt="Image">
            </div>
        </div>
        <!-- Modal -->
        <AddMemberBoardModal ref="addMemberBoard" :boardId="boardId" @addMemberSuccess="addMemberSuccess"/>
        
    </div>
</template>
<script>
import API from './API'
import AddMemberBoardModal from './AddMemberBoardModal.vue'
export default {
    name:'MemberGroup',
    props:{
        boardId:{
            type:Number,
            default:0
        },
        allowAddBoardFlg:{
            type:Boolean,
            default:false
        },
        boardClosed:{
            type:Boolean,
            default:false
        }
    },
    components:{
        AddMemberBoardModal
    },
    computed:{
        displayedMembers() {
            return this.boardMembers.length <= 10
            ? this.boardMembers
            : this.boardMembers.slice(0, 10);
        }
    },
    data(){
        return {
            boardMembers:[],
            baseURL:import.meta.env.VNPT_PATH_BASE_FILE,
            ownerBoardFlg:false,
            subOwnerBoardFlg:false
        }
    },
    methods:{
        onClickShowPopupMember(){
            this.$refs.addMemberBoard.showModal()
        },
        async initDuLieu(){
            this.ownerBoardFlg=false
            if(this.boardId==0){
                this.boardMembers=[]
                this.$emit('onLoadMembers', { boardMembers:this.boardMembers })
                return
            }
            var listMembers=await API.getMembersByBoard(this, this.boardId)
            this.boardMembers=listMembers
            let data=await API.CheckSubOwnerOrOwner(this, this.boardId)
            this.ownerBoardFlg=data.isOwner
            this.subOwnerBoardFlg=data.isSubOwner
            this.$emit('onLoadMembers', {boardMembers:this.boardMembers,ownerBoardFlg:this.ownerBoardFlg, subOwnerBoardFlg:this.subOwnerBoardFlg})
        },
        addMemberSuccess(){
            this.initDuLieu()
        },
        urlAvatarView(img){
            return `${import.meta.env.VNPT_API}/user/Account/ImageView/${img.AvatarUrl}`
        }
    }
}
</script>
<style>
.membergroup .step-task-account-name {
    background-color: #81bc06;
    text-align: center;
    font-weight: bold;
    color: white;
    padding-top: 9px;
    width: 3rem;
    height: 3rem;
    display: block;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .1);
}

.membergroup .step-task-account-more {
    /* border-radius: 50%; */
    background-color: gray;
    /* width: 40px;
    height: 40px; */
    /* width: 3rem;
    height: 3rem; */
    /* margin-right: 5px; */
    /* float: right; */
    text-align: center;
    font-weight: bold;
    /* border: 1px solid gray; */
    color: white;
    padding-top: 9px;

    width: 3rem;
    height: 3rem;
    display: block;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .1);
}
   .membergroup .avatar-image {
      width: 3rem;
    height: 3rem;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .membergroup .avatar-image:hover {
      border-color: rgba(255, 255, 255, 0.6);
      transform: scale(1.05);
    }
.membergroup .user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}


.membergroup .avatar-group {
    display: flex;
    align-items: center;
    justify-content: right;
}
.membergroup .avatar {
    position: relative;
    transition: .2s;
}
.membergroup .avatar:not(:first-child) {
    margin-left: 0.6rem;
}
.membergroup .avatar:hover {
    z-index: 1;
    transform: translateY(-.5rem);
}
.membergroup .avatar-name {
    position: absolute;
    top: calc(100% + 2rem);
    left: 50%;
    transform: translateX(-50%);
    padding: .5rem .75rem;
    border-radius: .25rem;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    font-size: .875rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: .2s;
}
.membergroup .avatar-name::before {
    content: '';
    position: absolute;
    top: -14px;
    right: 18%;
    transform: translateX(-50%);
    border: .5rem solid;
    border-color:transparent transparent  rgba(0,0, 0, .7) transparent;
}
.membergroup .avatar:hover .avatar-name {
    opacity: 1;
    visibility: visible;
}
.membergroup .avatar img {
    width: 3rem;
    height: 3rem;
    display: block;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .1);
}
</style>