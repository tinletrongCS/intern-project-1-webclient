<template>
  <ejs-dialog
    :allowDragging="true"
    :animationSettings="animationSettings"
    :enableResize="false"
    :position="{ X: 'center', Y: 'center' }"
    :visible="false"
    ref="popupRating"
    :showCloseIcon="true"
    width="50%"
    :isModal="true"
    :target="target"
    :header="header"
    :open="handleShowModal"
  >
    <div class="modal-content popup-box">
      <div class="popup-body">
        <div class="box-form">
            <div class="stars">
                <span
                v-for="n in 4"
                :key="n"
                class="star"
                :class="getStarClass(n)"
                @click="selectRating(n)"
                @mouseover="hoverRating = n"
                @mouseleave="hoverRating = null"
                >
                    ★
                </span>
            </div>
            
            <div class="guide">
                <strong>Hướng dẫn đánh giá</strong>
                <ul>
                    <li><strong>Mức 1:</strong> Không đạt mức kỳ vọng/yêu cầu</li>
                    <li><strong>Mức 2:</strong> Đạt mức kỳ vọng/yêu cầu nhưng phát sinh lãng phí rework</li>
                    <li><strong>Mức 3:</strong> Đạt mức kỳ vọng/yêu cầu, không lãng phí rework</li>
                    <li><strong>Mức 4:</strong> Đạt vượt mức kỳ vọng/yêu cầu</li>
                </ul>
            </div>

          <div class="group-buttons -bottom right" style="margin-top: 37px; margin-bottom: 10px;">
            <button @click="onClickRating"  class="btn btn-second nocorner" style="width: 180px">
               Kết thúc công việc
            </button>
          </div>
        </div>
      </div>
    </div>
  </ejs-dialog>
</template>

<script>
import API from './API'
export default {
  name: "RatingModal",
  props: {
    arrBriefingIds:{
      type: Array,
      default: () => [],
      validator: (val) => val.every(x => Number.isInteger(x))
    }
  },
  data() {
    return {
      target: ".main-wrapper",
      animationSettings: { effect: "Zoom" },
      header: `<span class="icon one-notepad"></span> ĐÁNH GIÁ CHẤT LƯỢNG BÁO CÁO`,
      rating: 0,
      hoverRating: null
    };
  },
  methods: {
    showModal() {
        this.$refs["popupRating"].show();
    },
    hideModal() {
      this.$refs["popupRating"].hide();
    },
    handleShowModal() {
      this.clear();
      setTimeout(() => {
        this.initDuLieu();
      }, 200);
    },
    async initDuLieu() {

    },
    clear() {
      this.rating = 0;
      this.hoverRating = null;
    },
    selectRating(value) {
      this.rating = value;
    },
    getStarClass(index) {
        const value = this.hoverRating || this.rating;
        if (value === 0) return 'unselected';
        let color = '';
        if (value === 1) color = 'red';
        else if (value === 2) color = 'yellow';
        else color = 'green';
        return index <= value ? `filled ${color}` : `unselected`;
    },
    async onClickRating(){
      if(!this.rating||this.rating==0){
          this.$msgBox.warn("Thông báo", "Hãy chọn đánh giá báo cáo trước khi kết thúc!")
          return
      }
      let dataRequest={
          arrIds:JSON.stringify(this.arrBriefingIds),
          rating:this.rating
      }
      let data=await API.RatingBriefingSummary(this, dataRequest)
      if(data=='1'){
          this.$emit("onRatingSuccess")
          this.hideModal()
      }else{
          this.$toast.error(data)
      }
    }
  },
};
</script>

<style scoped>
.rating-form {
  font-family: Arial, sans-serif;
  max-width: 600px;
}

.stars {
  font-size: 32px;
  margin-bottom: 10px;
  text-align: center;
}

.star {
  cursor: pointer;
  margin-right: 4px;
}

/* FILL styles */
.filled.red {
  color: #f03c56;
}

.filled.yellow {
  color: #ffc058;
}

.filled.green {
  color: #7ed321;
}

/* Unselected */
.unselected {
  color: lightgray;
  -webkit-text-stroke-width: 1.5px;
  -webkit-text-stroke-color: gray;
}

.selected-text {
  margin-bottom: 10px;
  font-weight: bold;
}

.guide {
  margin-top: 20px;
}

.guide ul {
  padding-left: 1em;
}
</style>
