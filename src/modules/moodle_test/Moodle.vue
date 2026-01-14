<template>
 <div class="main-wrapper">
    <breadcrumb :header="header" />
    <div class="k main-form">

        <span class="k title-header">SYSTEM</span>
        <div class=" body-form">
            <span class="k row-body">
                Moodle 4.4++(Ubuntu: --v22.04) 
                Link: <a href="https://download.moodle.org/releases/latest/">https://download.moodle.org/releases/latest/</a>
            </span>

            <span class="k row-body">
                Thử nghiệm trên: Vue.js(vue3,vite.js), BE: .Netcore 8.0 (linux)
            </span>

        </div>
        <span class="k title-header">PHẦN I: THỬ NGHIỆM TRÊN API CÓ SẲN(MOODLE)</span>
        <div class=" body-form">
           
            <span class="k row-body">
                API có sẳn, có thể sử dụng.
                Tài liệu: <a href="https://docs.moodle.org/dev/Web_service_API_functions"> https://docs.moodle.org/dev/Web_service_API_functions</a> 
            </span>

            <span class="k row-body">
                Các API sử dụng chính thức đã được tích hợp: <a href="http://10.70.31.58:8082/admin/webservice/documentation.php">http://10.70.31.58:8082/admin/webservice/documentation.php</a> 
            </span>
            <span class="k row-body">
                API lấy chi tiết 1 lớp học: core_course_get_courses <a href="http://10.70.31.58:8082/course/view.php?id=2">Ví dụ</a>
                Kết quả:
                <KDataGrid  :columns ="columslistCore_course_get_courses"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listCore_course_get_courses"
                    :allowPaging="true"
                    :showFilter="true"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                />
            </span>
            <span class="k row-body">
                API lấy chi tiết lession: mod_lesson_get_lesson_access_information <a href="http://10.70.31.58:8082/mod/lesson/view.php?id=4">Ví dụ</a>
                Kết quả:
                <KDataGrid  :columns ="columslmod_lesson_get_lesson_access_information"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "list_Mod_lesson_get_lesson_access_information"
                    :allowPaging="true"
                    :showFilter="true"
                    :showColumnCheckbox="false"
                    :enabledSelectFirstRow="false"
                    :allowSorting="true"
                />
            </span>

        </div>
        <span class="k title-header">PHẦN II: TÍCH HỢP WEBSERVICES(TẠO MỚI)</span>
        <span class="k row-body">
            API lấy danh sách khóa học: getCources <a href="http://10.70.31.58:8082/my/courses.php">Ví dụ</a>
            Kết quả:
            <KDataGrid  :columns ="columslistCourses"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listCourses"
                :allowPaging="true"
                :showFilter="true"
                :showColumnCheckbox="false"
                :enabledSelectFirstRow="false"
                :allowSorting="true"
            />
        </span>
        <span class="k row-body">
            Kiểm tra học viên đã tham gia thi: getUserQuiz
            Kết quả:
            <KDataGrid  :columns ="columslistUserQuizAccept"  :allowFilter="true"  :enable-paging-server="false" :dataSource = "listUserQuizAccept"
                :allowPaging="true"
                :showFilter="true"
                :showColumnCheckbox="false"
                :enabledSelectFirstRow="false"
                :allowSorting="true"
            />
        </span>

        


    </div>
 </div>
</template>

<script>
import MoodleAPI from './MoodleAPI.js'
export default {
   data(){
        return {
            header: {
                title: "THỬ NGHIỆM TÍCH HỢP ELEARNING(TESTING)",
                list: [
                ],
            },
            listCore_course_get_courses:[],
            columslistCore_course_get_courses:[],
            list_Mod_lesson_get_lesson_access_information:[],
            columslmod_lesson_get_lesson_access_information:[],
            //new 
            listCourses:[],
            columslistCourses:[
                {
                    fieldName: 'course_id',
                    headerText: 'Id khóa học',
                },
                {
                    fieldName: 'category_id',
                    headerText: 'Id Category',
                },
                {
                    fieldName: 'name',
                    headerText: 'Tên Category',
                },
                {
                    fieldName: 'fullname',
                    headerText: 'Tên khóa học đầy đủ',
                },
                {
                    fieldName: 'shortname',
                    headerText: 'Tên tắt khóa học ',
                },
                {
                    fieldName: 'visible',
                    headerText: 'Trạng thái hoạt động',
                },
                {
                    fieldName: 'fullname',
                    headerText: 'Tên khóa học đầy đủ',
                },
            ],
            listUserQuizAccept:[],
            columslistUserQuizAccept:[
                {
                    fieldName: 'id',
                    headerText: 'Id',
                },
                {
                    fieldName: 'coursename',
                    headerText: 'Khóa học',
                },
                {
                    fieldName: 'name',
                    headerText: 'Tên bài kiểm tra',
                },
                {
                    fieldName: 'fullname',
                    headerText: 'Người thực hiện',
                },
                {
                    fieldName: 'timestart',
                    headerText: 'Thời gian làm bài',
                },
                {
                    fieldName: 'timefinish',
                    headerText: 'Thời gian kết thúc',
                },
            ]
        }
   },
   methods:{
    // Thử nghiệm api có sẳn
    //core_course_get_courses
    core_course_get_courses(){
        var self = this;
        $.ajax({
            url: "http://10.70.31.58:8082/webservice/rest/server.php?wstoken=8d835c8acbf19fb14576d662b89b9221&wsfunction=core_course_get_courses&moodlewsrestformat=json&options[ids][0]=2",
            type: 'GET',
            success: function(res) {
                self.listCore_course_get_courses = res;
                self.columslistCore_course_get_courses = self.addKeyColumn(res[0]);
            }
        });
    },
    mod_lesson_get_lesson_access_information(){
        var self = this;
        $.ajax({
            url: "http://10.70.31.58:8082/webservice/rest/server.php?wstoken=8d835c8acbf19fb14576d662b89b9221&wsfunction=mod_lesson_get_lesson_access_information&moodlewsrestformat=json&lessonid=1",
            type: 'GET',
            success: function(res) {
                
                self.list_Mod_lesson_get_lesson_access_information.push(res);
                self.columslmod_lesson_get_lesson_access_information = self.addKeyColumn(res);
            }
        });
    },

    // lấy columns
    addKeyColumn(data){
        var listEx = [];
        if(data){
            var keyNames = Object.keys(data);
            keyNames.forEach(element => {
                listEx.push({
                    fieldName: element,
                    headerText: element,
                });
            });
        }
        return listEx;
    },
    // Viết webservices

    // lấy danh sách khóa học
    getCources(){
        var self = this;
        $.ajax({
            url: "http://10.70.31.58:8082/webservice/rest/server.php?wstoken=42032e621526b78ffc8b1d3e3583430e&wsfunction=getcourses&moodlewsrestformat=json",
            type: 'GET',
            success: function(res) {
                self.listCourses = res;
                // self.columslistCourses = self.addKeyColumn(res[0]);
            }
        });
    },
    // Lấy danh sách học viên làm bài thi
     getUserQuiz(){
        var self = this;
        $.ajax({
            url: "http://10.70.31.58:8082/webservice/rest/server.php?wstoken=42032e621526b78ffc8b1d3e3583430e&wsfunction=getUserQuiz&moodlewsrestformat=json",
            type: 'GET',
            success: function(res) {
                self.listUserQuizAccept = res;
                // self.columslistCourses = self.addKeyColumn(res[0]);
            }
        });
    }
   },
   created(){
    this.core_course_get_courses();
    this.mod_lesson_get_lesson_access_information();
    this.getCources();
    this.getUserQuiz();
   }
}
</script>

<style src="./Moodle.css" scoped></style>