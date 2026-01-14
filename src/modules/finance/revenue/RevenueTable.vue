<template>
  <table class="revenue-table">
    <thead>
      <tr>
        <th>Tháng</th>
        <th>Loại</th>
        <th>Doanh thu</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(month, index) in revenueData" :key="index">
        <tr>
          <td :rowspan="month.details.length">{{ month.period_display }}</td>
          <td>{{ month.details[0].revenue_detail_type_name }}</td>
          <td>
             <CurrencyInput :data="month.details[0]" :parent="self" />
          </td>
        </tr>
        <tr v-for="(item, i) in month.details.slice(1)" :key="i">
          <td>{{ item.revenue_detail_type_name }}</td>
          <td>
            <CurrencyInput :data="item" :parent="self" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import CurrencyInput from '../planned_revenue_region/CurrencyInput.vue';
export default {
  name: "RevenueTable",
  components:{
    CurrencyInput 
  },
  data() {
    return {
      self: this,
      revenueData: [],
    };
  },
  methods: {
    loadData(data){
      this.revenueData=data
    },
    onChangeInputRevenue(data, rawValue) {
      const index = this.revenueData.findIndex(x=>x.period==data.period)
      if(index>-1){
        const indexType=this.revenueData[index].details.findIndex(x=>x.revenue_detail_type==data.revenue_detail_type)
        if(indexType>-1){
          this.revenueData[index].details[indexType].revenue=Number(rawValue.replace(/[.,]/g, ''))
        }
      }
      console.log('revenueData', this.revenueData)
    },
    flattenRevenueData() {
      const flat = [];

      this.revenueData.forEach(group => {
        group.details.forEach(detail => {
          flat.push({
            actual_revenue_detail_id: detail.actual_revenue_detail_id,
            period: group.period,
            period_display: group.period_display,
            revenue: detail.revenue,
            revenue_detail_type: detail.revenue_detail_type,
            revenue_detail_type_name: detail.revenue_detail_type_name
          });
        });
      });

      return flat;
    }
  },
};
</script>

<style scoped>
.revenue-table {
  border-collapse: collapse;
  width: 100%;
  border: 0px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background-color: #fff;
}

.revenue-table thead {
  background-color: #e0f3ff; /* Xanh nhạt */
}

.revenue-table th {
  font-weight: bold;
  color: #0a3f66;
  text-align: center;
  padding: 10px;
  border: 1px solid #b5d8f2;
  border-bottom: 2px solid #82cfff;
}

.revenue-table td {
  padding: 8px;
  border: 1px solid #ccc;
  vertical-align: middle;
}

input[type="text"] {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
</style>
