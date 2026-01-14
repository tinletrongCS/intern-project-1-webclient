<template>
  <div class="box-form">

    <!-- ✅ IMPORT EXCEL -->
    <div class="info-row">
      <div class="key w120">Import Excel</div>
      <div class="value">
        <input type="file"
               ref="fileInput"
               accept=".xlsx,.xls"
               @change="onImportExcel" />
      </div>
    </div>

    <div class="info-row" >
        <div class="value wp100" style="margin-top: 10px !important;text-align: right !important;">
          <button  class="btn btn-second" @click="onSave" style="width: 180px">
              Lưu thông tin
          </button>
        </div>
      </div>


  </div>
</template>

<script>
import * as XLSX from "xlsx";
import API from './API'
export default {
  name:'TestBaseModal',

  props:{
    test:{
      type:String,
      default:'test'
    }
  },

  data(){
    return {
      excelJson: []   // ✅ dữ liệu object sau khi đọc excel
    }
  },

  methods:{
    init(){
      console.log('test prop', this.test)
    },

    // ✅ IMPORT EXCEL → JSON → OBJECT JS
    onImportExcel(e){
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // ✅ Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // ✅ Convert Excel → JSON
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        console.log("✅ Raw Excel JSON:", json);
        

        this.excelJson = json;
        // ✅ Map lại key tiếng Việt → tiếng Anh
        this.excelJson = this.excelJson.map(row => ({
          tax_code: String(row["tax_code"] || "").trim(), // VARCHAR(50)
          user_id: Number(row["user_id"] || 0),               // INT
          customer_name: String(row["customer_name"] || "").trim(), // VARCHAR(255)
        }));

        console.log("✅ Excel JSON:", this.excelJson);

      };

      reader.readAsArrayBuffer(file);
    },

    async onSave(){
      console.log('onSave', this.excelJson)
      let rs=await API.ImportUserTaxCodes(this, {
        p_arr_user_tax_code: JSON.stringify(this.excelJson)
      })
      console.log('onSaveResult', rs)

    }
  }
}
</script>
