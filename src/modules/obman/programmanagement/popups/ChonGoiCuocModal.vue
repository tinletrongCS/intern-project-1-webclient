<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupChonGoiCuoc"
        :showCloseIcon="true"
        width="60%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <ActionTop :actions="actions"  @onActionClick="onActionClick"/>
            <div class="popup-body">
                <div class="box-form">
                    <div class="info-row">
                        <div class="value">
                            <ejs-multiselect id='multiselect'
                                :dataSource="ds_goicuoc"
                                placeholder="Vui lòng chọn gói"
                                v-model="goicuoc_selected"
                                :allowFiltering="true"
                                locale='vi-VN'
                                :fields="{text: 'code', value: 'id' }"
                                :showSelectAll="true"
                                filterType='Contains'
                            />
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="value">
                            <span class="bold red">Chú ý</span>
                            <br>
                            <span>Bạn có thể chọn 1 hoặc nhiều gói</span>
                            <br>
                            <span>Sau khi chọn gói nhấn click "Chấp nhận"</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
import ActionTop from '@/components/Controls/ActionTop.vue'
import API from './API'
export default {
    name:'ChonGoiCuocModal',
    components:{
        ActionTop
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad">CHỌN GÓI CƯỚC</span> `,
            actions:[
                {
                    id:'chapnhan',
                    name:'Chấp nhận',
                    active: true,
                    icon_class:'one-save'
                },
                {
                    id:'huybo',
                    name:'Hủy bỏ',
                    active: true,
                    icon_class:'nc-icon-glyph ui-1_circle-remove'
                }
            ],
            ds_goicuoc:[],
            goicuoc_selected:null
        }
    },
    methods:{
        showModal() {
            this.$refs["popupChonGoiCuoc"].show()
        },
        hideModal() {
            this.$refs["popupChonGoiCuoc"].hide()
        },
        onActionClick(action){
            if(action.id=='chapnhan'){
                this.ChapNhan()
            }else if(action.id=='huybo'){
                this.hideModal()
            }
        },
        ChapNhan(){
            //callback value
            if(!this.goicuoc_selected||this.goicuoc_selected.length==0){
                this.$toast.error('Hãy chọn gói cước')
            }
            console.log('goicuoc_selected', this.goicuoc_selected)
            let ds_codes=this.ds_goicuoc.filter(x=>this.goicuoc_selected.findIndex(i=>i==x.id)>-1).map(x=>x.code)
            this.$emit('accept',{
                ids:this.goicuoc_selected,
                codes:ds_codes
            })
            this.hideModal()
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        clear(){
            this.ds_goicuoc=[]
            this.goicuoc_selected=null
        },
        async initDuLieu(){
            this.ds_goicuoc=await this.getAll()
        },
        async getAll(){
            try{
                this.loading(true)
                let response = await API.getAll(this.axios)
                this.loading(false)
                if(response && response.data && response.data.collection) {
                    return response.data.collection
                }else{
                    return []
                }
            }catch(e){
                this.loading(false)
                return []
            }
        },
    }
}
</script>