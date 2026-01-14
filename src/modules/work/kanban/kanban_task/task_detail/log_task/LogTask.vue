<template>
    <div class="k row-report" v-for="(log,index) in logs" :key='index'>
        <div class="k avt-report"></div>
        <div class="k form-detail-report" >
            <div class="k form-title-body-report">
                <span class="k user-log">khanhnv.hcm</span> <span class="k content-log"> đã thay đổi hạn hoàn thành của công việc này từ 09/08/2024 thành 10/09/2024</span> 
            </div>
            <div class="k form-time-body-report">
                <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
                12/12/2022 8:45
            </div>
        </div>
    </div>
        
</template>
<script>
export default {
    data() {
        return{

        }
    },
    props:{
        logs:{
            type:Array,
            default:[{},{}]
        }
    },
}
</script>
<style src="./LogTask.css" scoped></style>