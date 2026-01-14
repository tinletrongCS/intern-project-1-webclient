<template>
    <ejs-dialog
        :allowDragging="true"
        :animationSettings="animationSettings"
        :enableResize="false"
        :position="{X:'center', Y:'center'}"
        :visible="false"
        ref="popupQuanLyKhaoSat"
        :showCloseIcon="true"
        width="80%"
        :isModal='true'
        :target="target"
        :header="header"
        :open="handleShowModal">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div style="width: 100%;height: 600px;">
                    <iframe v-if="showIframe" :src="urlCT"
                        style="width: 100%;height: 600px;"
                        @load="siteLoaded"
                    ></iframe>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>
<script>
export default {
    name:'QuanLyKhaoSatModal',
    props:{
        CtId:{
            type:String,
            default:'4718'
        },
        SurveyId:{
            type:String,
            default:'0'
        }
    },
    data(){
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header:`<span class="icon one-notepad">QUẢN LÝ KỊCH BẢN</span> `,
            showIframe:false,
            urlCT:''

        }
    },
    methods:{
         showModal() {
            this.$refs["popupQuanLyKhaoSat"].show()
        },
        hideModal() {
            this.$refs["popupQuanLyKhaoSat"].hide()
        },
        onActionClick(action){
            
        },
        handleShowModal(){
            this.clear()
            setTimeout(()=>{
                this.initDuLieu()
            },200)
        },
        clear(){
            this.showIframe=false
        },
        siteLoaded(event){
            this.loading(false)
            console.log('test siteLoaded', event)
        },
        async initDuLieu(){
            
            this.loading(true)
            //this.urlCT='https://tinhte.vn/'
            this.urlCT=`http://test.outboundccos.vnpt.vn/Views/Outbound/Popup/SurveysEX.aspx?CtId=${this.CtId}&SurveyId=${this.SurveyId}&&embed=true`
            this.showIframe=true
            // window.parent.postMessage({
            //         'key': 'mana',
            //         'data': 'Message text from iframe.'
            //     }, "*");
        },
        receiveMessage (event) {
           // console.log("receiveMessage kaka", event.data)
        }
    },
    mounted () {
        window.addEventListener('message', this.receiveMessage)
    },
    beforeDestroy () {
        window.removeEventListener('message', this.receiveMessage)
    }
}
</script>