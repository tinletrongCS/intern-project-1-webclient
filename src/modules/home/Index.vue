<template>
  <div class="k main-form">
    <div class="k main-form home-main">
        <ul>
            <li class="item1"><div class="bg"></div></li>
            <li class="item2"><div class="bg"></div></li>
            <li class="item3"><div class="bg"></div></li>
            <li class="item4"><div class="bg"></div></li>
            <li class="item5"><div class="bg"></div></li>
        </ul>
    </div>
  </div>
</template>

<script>

import background from '@/assets/img/bg.gray.svg';


export default {
  name: 'Home',
  components: {
  },
  data(){
    return{
      background: background
    } 
  },
  created: async function () {
    
  },
  computed: {
  },
  mounted () {
    
  },
  
  methods: {

  }
}
</script>

<style src="./Home.css" scoped></style>
