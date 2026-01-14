<template>
    <div class="searchformkanban">
        <div class="row search-box">
            <div class="col-sm-3 col-12">
                <div class="info-row">
                    <div class="key w120">Tìm kiếm</div>
                    <div class="input-row">
                        <div class="value">
                            <input type="text" @keyup.enter="onSearch" placeholder="Tìm kiếm theo mã, nội dung công việc" :value="input_timkiem" @change="e=>input_timkiem=e.target.value" class="form-control">
                        </div>
                        <div class="value w30">
                            <button class="btn btn-second" @click="clickSearch"><span class="-ap icon-search"></span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="key w120">Khách hàng</div>
                    <div class="value wp100">
                        <CustomerSelect ref="customerSelect" 
                            v-model="customer_selected"
                            @select="onSearch"/>
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="key w120">Người giao</div>
                    <div class="value wp100">
                        <select2 
                            v-model='reporter_selected'
                            :options="ds_members"
                            @select="onSearch"
                        />
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12">
                <div class="info-row">
                    <div class="key w120">Người nhận</div>
                    <div class="value wp100">
                        <select2 
                            v-model='assign_selected'
                            :options="ds_members"
                            @select="onSearch"
                        />
                    </div>
                </div>
            </div>
            <div class="col-sm-1 col-12">
                <div class="info-row">
                    <div class="key w100">Trạng thái</div>
                    <div class="value wp100">
                        <select2 
                            v-model='status_selected'
                            :options="ds_status"
                            @select="onSearch"
                        />
                    </div>
                </div>
            </div>
            <div class="col-sm-2 col-12" style="padding-right: 26px !important;">
                <div class="info-row">
                    <div class="key w160">Đánh giá chất lượng</div>
                    <div class="value wp100">
                        <select2 
                            v-model='rating_selected'
                            :options="ds_rating"
                            @select="onSearch"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CustomerSelect from './CustomerSelect.vue'
export default {
    name:'SearchFormKanban',
    components:{
        CustomerSelect
    },
    data(){
        return {
            input_timkiem:'',
            customer_selected:{
                id:-1,
                text:'Tất cả'
            },
            reporter_selected:-1,
            ds_members:[],
            assign_selected:-1,
            status_selected:-1,
            ds_status:[
                {id: -1, text: 'Tất cả'},
                {id: 0, text: 'Tạo mới'},
                {id: 2, text: 'Đang thực hiện'},
                {id: 10, text: 'Đã thực hiện'},
                {id: 3, text: 'Hoàn thành'}
            ],
            rating_selected:-1,
            ds_rating:[
                {id: -1, text: 'Tất cả'},
                {id: 1, text: 'Không đạt mức kỳ vọng/yêu cầu'},
                {id: 2, text: 'Đạt mức kỳ vọng/yêu cầu nhưng phát sinh lãng phí rework'},
                {id: 3, text: 'Đạt mức kỳ vọng/yêu cầu, không lãng phí rework'},
                {id: 4, text: 'Đạt vượt mức kỳ vọng/yêu cầu'}
            ]
        }
    },
    methods:{
        clickSearch(){
            this.onSearch()
        },
        onSearch(){
            this.$emit('onClickSearch',{
                searchText:this.input_timkiem.trim(),
                customerId:this.customer_selected.id,
                assignId:this.assign_selected,
                reporterId:this.reporter_selected,
                status:this.status_selected,
                rating:this.rating_selected
            })
        },
        setMembers(list){
            this.ds_members=[]
            this.ds_members.push({
                id:-1,
                text:'Tất cả'
            })
            this.ds_members=this.ds_members.concat(list.map(x=>{
                return {
                    id:x.UserId,
                    text:x.Name
                }
            }))
            this.reporter_selected=-1
            this.assign_selected=-1
        }
    }
}
</script>
<style scoped>
.searchformkanban{
    margin-top: 1em !important;
    margin-left: 1em!important;
    margin-bottom: 0.7em;
}
.searchformkanban .info-row {
  display: block; /* Cho phép key nằm trên */
  margin-bottom: 5px;
}

.searchformkanban .info-row .key {
  margin-bottom: 4px;
  font-weight: bold;
}
.value >input{
    border: 1px solid #1c75bc59;
}
.searchformkanban .info-row .value {
  display: inline-block; /* Giữ input và button nằm ngang */
  vertical-align: top;
  padding-left: 0px !important;
}
.searchformkanban .wp100{
    width: 100%;
}
.searchformkanban .wp20{
    width: 20%;
}
.searchformkanban .wp80{
    width: 80%;
}
.searchformkanban .input-row {
  display: flex;
  gap: 5px;
}

.searchformkanban .input-row .value {
  flex: 1; /* chiếm hết phần còn lại */
}
.searchformkanban .input-row .w30 {
  flex: 0 0 30px; /* cố định đúng 30px */
}
</style>