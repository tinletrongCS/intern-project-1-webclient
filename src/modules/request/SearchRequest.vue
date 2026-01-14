<template>
  <div class="search-request">
    <div class="row search-box">
      <div class="col-sm-3 col-md-3 col-xl-2 col-12">
        <div class="info-row">
          <div class="key">Tìm kiếm</div>
          <div class="input-row">
            <div class="value">
              <input
                type="text"
                @keyup.enter="onSearch"
                placeholder="Tìm kiếm theo mã, nội dung công việc"
                :value="input_timkiem"
                @change="(e) => (input_timkiem = e.target.value)"
                :disabled="loading"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="col-sm-3 col-md-3 col-xl-2 col-12">
        <div class="info-row">
          <div class="key">Đơn vị yêu cầu</div>
          <div class="input-row">
            <select2
              class="value"
              :options="departments"
              v-model="department_seleted"
            ></select2>
          </div>
        </div>
      </div> -->
      <div class="col-sm-2 col-md-2 col-xl-2 col-12">
        <div class="info-row">
          <div class="key">Từ tháng</div>
          <div class="input-row">
            <ejs-datepicker
              :format="date_format"
              v-model="from_date"
              :start="'Year'"
              :max="to_date"
              :depth="'Year'"
              :inputFormats="['MM/yyyy']"
              placeholder="MM/yyyy"
            ></ejs-datepicker>
          </div>
        </div>
      </div>
      <div class="col-sm-2 col-md-2 col-xl-2 col-12">
        <div class="info-row">
          <div class="key">Đến tháng</div>
          <div class="input-row">
            <ejs-datepicker
              :format="date_format"
              v-model="to_date"
              :start="'Year'"
              :min="from_date"
              :depth="'Year'"
              :inputFormats="['MM/yyyy']"
              placeholder="MM/yyyy"
            ></ejs-datepicker>
          </div>
        </div>
      </div>
      <div class="col-sm-2 col-md-2 col-xl-2 col-12">
        <div class="info-row">
          <div class="key">&nbsp;</div>
          <div class="input-row">
            <button 
              class="btn btn-primary" 
              @click="clickSearch" 
              :disabled="loading"
            >
              <i v-if="loading" class="fa fa-spinner fa-spin"></i>
              <i v-else class="fa fa-search"></i>
              {{ loading ? 'Đang tìm...' : 'Tìm kiếm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "select2";
import "select2/dist/css/select2.css";
export default {
  name: "SearchRequest",
  props: {
    departments: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      input_timkiem: "",
      department_seleted: -1,
      date_format: "MM/yyyy",
      from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    };
  },
  mounted() {
    // console.log("🔄 SearchRequest mounted with departments:", this.departments);
  },
  watch: {
    departments(newVal) {
      this.department_seleted = newVal.length > 0 ? newVal[0].id : null;
    },
  },
  methods: {
    onSearch() {
      if (this.loading) return; // Prevent search if already loading
      
      this.$emit("onClickSearch", {
        query: this.input_timkiem,
        department_id: this.department_seleted,
        from_date: this.from_date,
        to_date: this.to_date,
      });
    },
    clickSearch() {
      this.onSearch();
    },
  },
};
</script>
<style scoped>
.search-request .search-box .info-row {
  display: flex;
  flex-direction: column;
}

.search-request .search-box .info-row .input-row {
  display: flex;
}

.search-request .search-box .info-row .key {
  font-weight: bold;
}

.search-request .search-box .info-row .value:first-child {
  flex: 1;
  padding-left: 0;
}

/* Button styling */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #6c757d !important;
}

/* Input styling */
.form-control:disabled {
  background-color: #f8f9fa;
  opacity: 0.7;
  cursor: not-allowed;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
