<template>
  <div class="work-table-container">
    <table class="work-table">
      <thead>
        <tr>
          <th rowspan="2" class="col-index">
            <!-- Check all -->
            <input 
                type="checkbox" 
                style="transform: scale(1.4);" 
                class="check" 
                v-model="allChecked"
                @change="onCheckAll"
              />
          </th>
          <th rowspan="2" class="col-title">Nội dung công việc</th>
          <!-- <th rowspan="2" class="col-deliver">Giao phẩm công việc</th> -->
          <!-- <th colspan="4" class="col-responsible">Phụ trách</th> -->
          <th colspan="1" class="col-responsible">Phụ trách</th>
          <th v-if="status_id==10" rowspan="2" class="col-action">Trạng thái</th>
        </tr>
        <tr>
          <!-- <th class="tiny">R</th> -->
          <th class="tiny">A</th>
          <!-- <th class="tiny">C</th>
          <th class="tiny">I</th> -->

          
        </tr>
      </thead>

      <tbody >
         <!-- Không có dữ liệu -->
        <template v-if="workData.length == 0">
          <tr>
            <td colspan="13" class="no-data">
              Không có dữ liệu hiển thị
            </td>
          </tr>
        </template>
        <template v-else v-for="(group, gIndex) in workData" :key="gIndex">
          <!-- Nhóm chính -->
          <tr class="group">
            <td class="group-index" rowspan="2">{{ group.index }}</td>
            <td class="group-title">
              <div class="flex-between">
                <strong>{{ getBriefingTitle(group) }} {{ getCharRating(group.rating) }}</strong>
                <i v-if="group.enabled_btn_bell" class="fa fa-bell notify-icon"
                  :class="{ disabled: group.is_requested }"
                  title="Yêu cầu báo cáo"
                  @click="onRequestReport(group)"
                ></i>
              </div>
            </td>
            <!-- <td></td> -->
            <!-- <td class="center">{{ group.user_r }}</td> -->
            <td class="center">{{ group.user_a }}</td>
            <!-- <td class="center">{{ group.user_c }}</td>
            <td class="center">{{ group.user_i }}</td> -->

            <td
              v-if="status_id==10"
              class="center"
              style="vertical-align: middle;"
              :rowspan="briefingType == 1 ? group.details.length + 3 : group.details.length+2"
            >
              <span
                :class="[
                  'status-text',
                  group.status_id === 0 ? 'blue' :
                  group.status_id === 1 ? 'green' :
                  group.status_id === 2 ? 'yellow' :
                  group.status_id === 3 ? 'red' : ''
                ]"
              >
                {{ group.status_name }}
              </span>
            </td>
          </tr>

          <tr class="group">
            <!-- <td class="group-index">{{ group.index }}</td> -->
            <td class="group-title">
              <div class="group-comment">
                <span class="label">
                  {{ group.is_comment ? 'Nội dung trả lại báo cáo:' : '\u00A0' }}
                </span>
                <div class="multi-line" style="padding-left: 0px !important;" v-html="group.is_comment ? formatHtml(group.comment) : ''"></div>
              </div>
            </td>
            <!-- <td></td> -->
            <!-- <td class="center"></td> -->
            <td class="center"></td>
            <!-- <td class="center"></td>
            <td class="center"></td> -->
          </tr>

          

          <template v-for="(row, tIndex) in group.details" :key="`${gIndex}-${tIndex}`">
            <tr>
              <!-- Cột chỉ số và checkbox (gộp dòng) -->
              <td
                v-if="tIndex == 0"
                class="index-cell"
                :rowspan="briefingType == 1 ? group.details.length + 1 : group.details.length"
              >
                <div class="index-wrap">
                  <!-- <div class="item-index">{{ tIndex + 1 }}</div> -->
                  <input type="checkbox" v-model="group.checked" style="transform: scale(1.4);" class="check" @change="onChecked(group, $event)"/>
                </div>
              </td>

              <!-- Nội dung công việc -->
              <td>
                <span
                  class="dot"
                  :class="{
                    green: row.dictionary_code === 'PLAN',
                    blue: row.dictionary_code === 'DONE',
                    red: row.dictionary_code === 'ISSUE'
                  }"
                ></span>
                <strong>{{ row.dictionary_name }}:</strong>
                  <i
                    v-if="row.enable_btn"
                    :class="row.is_add ? 'fa fa-plus' : 'fa fa-edit'"
                    class="icon-btn"
                    @click="onAddUpdateDetail(group, row)"
                  ></i>

                  <i
                    v-if="row.enable_btn_comment"
                    class="fa fa-comments icon-btn"
                    title="Góp ý"
                    @click="onClickFeedback(group, row)"
                  ></i>
                <div
                  class="multi-line"
                  v-html="formatHtml(row.task_description)"
                ></div>
                <div class="row-comment" v-if="hasContent(row.comment)">
                  <span class="label">Nội dung góp ý: </span>
                  <div class="multi-line" v-html="formatHtml(row.comment)"></div>
                </div>
              </td>

              <!-- Giao phẩm -->
              <!-- <td>
                <div
                  class="multi-line"
                  v-html="formatHtml(row.deliverables)"
                ></div>
              </td> -->

              <!-- RACI -->
              <!-- <td class="center">{{ row.user_r }}</td> -->
              <td class="center">{{ row.user_a }}</td>
              <!-- <td class="center">{{ row.user_c }}</td>
              <td class="center">{{ row.user_i }}</td> -->
            </tr>
          </template>
          <!-- ✅ Thêm dòng “Thông tin chi tiết dự án phòng” -->
          <tr v-if="briefingType==1">
            <td>
              <a 
                href="#" 
                class="detail-link-header"
                @click.prevent="onViewGroupDetail(group)"
              >
              <!-- <i class="fa fa-chevron-right"></i> -->
                Xem dự án của phòng
                <span class="arrow">&raquo;&raquo;</span>
              </a>
            </td>
            <td></td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "WorkTable",
  props: {
    workData: { type: Array, required: true },
    briefingType:{
      type: [Number, String],
      default:1
    },
    status_id:{
      type: [Number, String],
      default:10
    }
  },
  data() {
    return {
      
    };
  },
  computed:{
    allChecked: {
      get() {
        return this.workData.length > 0 && this.workData.every(g => g.checked);
      },
      set(value) {
        this.workData.forEach(g => {
          g.checked = value;
        });
      }
    }
  },
  methods: {
    onClickFeedback(group, row){
      var value=Object.assign({}, row)
      value.briefing_summary_id=group.briefing_summary_id
      value.unit_name=group.unit_name
      value.project_name=group.project_name
      value.briefing_type=group.briefing_type
      this.$emit('onClickFeedback',value)
    },
    onAddUpdateDetail(group, row){
      var value=Object.assign({}, row)
      value.briefing_summary_id=group.briefing_summary_id
      this.$emit('onAddUpdateDetail',value)
    },
    onCheckAll() {
      // Check/uncheck tất cả group
      this.workData.forEach(group => {
        group.checked = this.allChecked;
      });
    },
    onChecked(group, event) {
      group.checked = event.target.checked;
    },
    getDataChecked() {
      return this.workData.filter(g => g.checked);
    },
    onViewGroupDetail(group){
      this.$emit('onViewGroupDetail', group)
    },
    formatHtml(html) {
      if (!html) return '';
      html = html.replace(
        /<oembed url="https:\/\/www\.youtube\.com\/watch\?v=([^"&]+)[^"]*"><\/oembed>/g,
        '<iframe src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'
      );
      return html;
    },
    getBriefingTitle(group) {
      if (!group) return ""
      if (group.briefing_type === 1) {
        return `Báo cáo chung phòng: ${group.unit_name}`
      }
      return group.project_name
    },
    getCharRating(rating) {
      const index = rating > 0 ? rating - 1 : -1;
      if (index < 0) return "";
      const ratingChar = [
        "⭐️",
        "⭐️⭐️",
        "⭐️⭐️⭐️",
        "⭐️⭐️⭐️⭐️"
      ];
      return ratingChar[index];
    },
    onRequestReport(group) {
      if (group.is_requested) return
      //Gửi yêu cầu báo cáo tới phòng liên quan
      this.$emit('onRequestReport', group)
    },
    hasContent(html) {
      if (!html) return false;

      // 1️⃣ Xóa thẻ HTML
      let text = html.replace(/<[^>]*>/g, '');

      // 2️⃣ Xóa entity &nbsp; và ký tự khoảng trắng
      text = text.replace(/&nbsp;/gi, '').trim();

      // 3️⃣ Nếu vẫn còn ký tự => có nội dung thật
      return text !== '';
    },
  },
  watch: {
    workData: {
      handler() {
        
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.work-table-container {
  /* overflow-x: auto; /* cuộn ngang khi tràn */
  overflow-x: hidden;
  background: #fff;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Cố định bố cục bảng */
.work-table {
  /* width: max-content; */
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  table-layout: fixed; /* quan trọng để cố định cột */
}

/* Cột có độ rộng cụ thể */
.col-index { 
  width: 50px !important; 
}
.col-title { 
  /* width: 480px;  */
  width: 100%;
}/* Nội dung công việc */

.col-responsible .tiny,
.col-responsible,
.col-action {
  width: 160px !important;
  text-align: center;
  vertical-align: middle;
}

/* Nếu muốn cứng hơn, bạn có thể đặt trực tiếp từng class */
.work-table th.tiny,
.work-table td.center { 
  text-align: center;
  width: 80px;
}
.work-table th.col-deliver,
.work-table th.col-title{
  text-align: left;
  vertical-align: middle;
}
.work-table th.col-action{
  text-align: center;
  vertical-align: middle;
}
.work-table th.col-index{
  text-align: center;
  vertical-align: middle;
}


/* Giới hạn các cột text dài để không nở bảng */
.work-table th, td {
  border: 1px solid #e0e6ea;
  padding: 6px 8px;
  vertical-align: top;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

thead th {
  background: #f6f8fa;
  font-weight: 600;
  text-align: center;
}

.group {
  background: #eef7fb;
  font-weight: 600;
}

.group-index {
  text-align: center;
  font-weight: 700;
  vertical-align: middle;
}

.group-title {
  font-weight: 600;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-btn {
  color: #2b7bbf;
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;  /* 🔹 tăng kích thước icon */
  vertical-align: middle;
  transition: color 0.2s, transform 0.1s;
}

.icon-btn:hover {
  color: #0056b3;
  transform: scale(1.1); /* 🔹 hiệu ứng nhỏ khi hover */
}

.index-cell {
  text-align: center;
  vertical-align: middle;
}

.index-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: #000000;
}
.dot.green { background: #28a745; }
.dot.blue { background: #007bff; }
.dot.red { background: #dc3545; }

.center {
  text-align: center;
}

.group-comment {
  font-size: 13px;
  margin-top: 3px;
}

.group-comment .label {
  font-weight: 600;
  color: #d93025;
}
.group-comment .html-content{
  padding-left: 0px;
}
.multi-line{
  padding-left: 12px;
}

.no-data {
  text-align: center;
  font-style: italic;
  color: #999;
  padding: 12px;
  background-color: #fafafa;
}
.detail-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}
.detail-btn:hover {
  background: #0056b3;
}

.notify-icon {
  color: #f59e0b; /* màu vàng cam cảnh báo */
  font-size: 18px;
  cursor: pointer;
  margin-left: 8px;
  transition: transform 0.2s, color 0.2s;
}

.notify-icon:hover {
  color: #d97706;
  transform: scale(1.15);
}
.notify-icon.disabled {
  color: #9ca3af; /* xám nhạt */
  cursor: not-allowed;
  opacity: 0.6;
  transform: none; /* bỏ hiệu ứng hover */
}
.row-comment {
  background: #f9fafb;
  border-left: 3px solid #007bff;
  margin-top: 4px;
  padding: 4px 8px;
  font-size: 13px;
  color: #333;
}

.row-comment .label {
  color: #d93025;
  font-weight: 600;
}

.row-comment .html-content {
  padding-left: 8px;
}

.status-text {
  font-weight: bold;
  font-size: 13px;
}

.status-text.blue {
  color: #007bff; /* Xanh dương */
}

.status-text.green {
  color: #28a745; /* Xanh lá */
}

.status-text.yellow {
  color: #fbbf24; /* Vàng */
}

.status-text.red {
  color: #dc3545; /* Đỏ */
}
.detail-link-header {
  display: inline-flex;          /* dùng flex để căn giữa */
  align-items: center;           /* căn giữa theo chiều dọc */
  gap: 6px;                      /* khoảng cách giữa icon và chữ */
  font-size: 16px;            /* to hơn bình thường một chút */
  font-weight: 600;
  color: #007bff;
  text-decoration: none;
  transition: all 0.2s ease;
}

.detail-link-header:hover {
  color: #0056b3;
}

.detail-link-header .arrow {
  font-size: 22px;               /* to hơn chữ */
  font-weight: bold;
  line-height: 1;
  display: inline-block;
  transform: translateY(-1px);   /* tinh chỉnh để cân đẹp */
  transition: transform 0.2s ease;
}

.detail-link-header:hover .arrow {
  transform: translate(3px, -1px); /* di chuyển nhẹ khi hover */
}
</style>
