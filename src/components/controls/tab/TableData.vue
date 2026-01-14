<template>
        <div class="box-col">
            <div class="form-control form-data-control h-auto">
                <div class="legend-title">{{titleIn}}</div>
                <!-- <k-table :columns = "colums" :dataSources ="listDataNotIn" @dataCheckeds="selectDataCheckedNotIn"
                         @onRowCheckChange = "selectItemNotIn" :allowCheckBox ="true" :allowFilter ="true">
                 </k-table> -->
                <KDataGrid  ref="groupDataIn" :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource ="listDataNotIn"
                    :allowPaging="true" :showFilter="true" :showColumnCheckbox="true"
                    :enabledSelectFirstRow="false" :allowSorting="true" @onRowSelected="selectDataCheckedNotIn"
                />
            </div>
            <div class="form-action">
                <button class="btn-main" @click="addToGroup()">
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </button>
                <button class=" btn-main1" @click="removeInGroup()">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                </button>
            </div>
            <div class="form-control h-auto form-data-control">
                <div class="legend-title">{{titleNotIn}}</div>
                <!-- <k-table  :columns = "colums" :dataSources ="listDataIn" @onRowCheckChange = "selectItemIn" 
                        @dataCheckeds="selectDataCheckedIn" :allowCheckBox ="true" :allowFilter ="true">
                </k-table> -->
                <KDataGrid ref="groupDataNotIn"  :columns ="colums"  :allowFilter="true"  :enable-paging-server="false" :dataSource ="listDataIn"
                    :allowPaging="true" :showFilter="true" :showColumnCheckbox="true"
                    :enabledSelectFirstRow="false" :allowSorting="true" @onRowSelected="selectDataCheckedIn"
                />
            </div>
        </div>
</template>
<script >
export default {
    props:{
        listDataIn:{
            type:Array,
            default:()=>[]
        },
        listDataNotIn:{
            type:Array,
            default:()=>[]
        },
        titleIn:{
            type:String,
            default:""
        },
        titleNotIn:{
            type:String,
            default:""
        },
        colums:
        {
            type:Array,
            default:()=>[]
        },
        
    },
    data(){
        return{
            itemSelected:[],
            itemRemove:[],
            colums2:
            {
                type:Array,
                default:()=>[]
            }
        }
    },
    methods:{
        addToGroup(){
            this.itemSelected = this.$refs.groupDataIn.getSelectedRecords()
            this.$emit('addToGroup', this.itemSelected);
            this.itemSelected =[];
        },
        removeInGroup(){
            this.itemRemove = this.$refs.groupDataNotIn.getSelectedRecords()
            this.$emit('removeInGroup', this.itemRemove);
            this.itemRemove = [];
        },
        selectItemNotIn(data){
            // this.itemSelected = data;
        },
        selectItemIn(data){
            // this.itemRemove=data;
        },
        selectDataCheckedNotIn(data){
             this.itemSelected = data;
        },
        selectDataCheckedIn(data){
             this.itemRemove = data;
        }
    },
    components:{
    }
}
</script>
<style scoped>
    .box-col{
        width: 50% !important;
        position: relative;
        float: left;
    }
    .form-data-control{
        width: 45% !important;
        position: relative;
        float: left;
        min-height: 80vh;
        padding: 0;
    }
    .form-action{
        width: 10% !important;
        position: relative !important;
        float: left !important;
        min-height: 80vh;
    }
    .btn-main{
        background-color: white !important;
        color: #007bff !important;
        font-weight: 600;
        border:1px solid rgba(0,123,255,0.5) !important;
        position: absolute;
        bottom: 55%;
        height: 40px;
        left: 0;
        right: 0;
        width: 40px;
        margin: auto;
        border-radius: 4px !important;
    }
    .btn-main1{
        background-color: white;
        color: rgb(0, 123, 255) !important;
        font-weight: 600;
        border:1px solid rgba(0,123,255,0.5) !important;
        position: absolute;
        bottom: 45%;
        height: 40px;
        left: 0;
        right: 0;
        width: 40px;
        margin: auto;
        border-radius: 4px !important;
    }
    .legend-title{
        background-color: var(--color-main);
        color: white;
        text-align: center;
        padding: 5px;
    }
</style>