<template>
<div class="k common-main-form">
    <span class="k common-title-text">
        {{textInput}}
        <i v-show="isImportain" class="warning-input">*</i>
    </span>
    <input class="k common-input" :type="typeInput" :disabled="disabled" :maxlength ="maxLength"  :value="dataInput"  v-on:change='onChangeInput($event)'/>
</div>
</template>
<script>
import { max } from 'lodash';

    export default {
        name :"k-input",
        data(){
            return{
                
            }
        },
        methods:{
            onChangeInput(event){
                this.$emit('modelData', event.target.value)
            },
        },
        props:{
            disabled:{
                type:Boolean,
                default:false,
                required: false
            },
            textInput:{
                type:String,
                default:"",
                required: true
            },
            typeInput:{
                type:[String, Number,Date],
                default:"text",
                required: false
            },
            dataInput:{
                type:[String, Number,Date],
                default:"",
                required: false
            },
            isImportain:{
                type:Boolean,
                default:false,
                required: false
            },
            maxLength:{
                type:[ Number],
                default:1000,
                required: false
            }
        },

    }
</script>
<style>
    .common-main-form{
        width: 100%;
        margin-top: 5px;
    }
    .common-title-text{
        width: 100%;
        font-size: var(--font-detail);
        color: var(--color-main);
        font-weight: 300;
    }
    .common-input{
        width: 100%;
        padding: 5px;
        /* border: 1px solid rgba(28, 117, 188 , 0.5); */
        border: 1px solid #E0E0E0;
        border-radius: 4px;
        height: 32px;
    }
    input:focus
    {
        border: 1px solid rgba(28, 117, 188 , 0.5) ;
    }
    .warning-input{
        color: red;
    }

</style>