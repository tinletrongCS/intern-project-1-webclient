<template>
    <ejs-dialog :allowDragging="true" :animationSettings="animationSettings" :enableResize="false"
        :position="{ X: 'center', Y: 'center' }" :visible="false" ref="popupEditInfo" :showCloseIcon="true" width="60%"
        :isModal='true' :target="target" :header="header" :open="handleShowModal" :close="clear">
        <div class="modal-content popup-box">
            <div class="popup-body">
                <div class="box-form">
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label required">Họ và tên</label>
                                <ejs-textbox v-model="full_name" class="form-control" placeholder="Nhập họ và tên">
                                </ejs-textbox>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <ejs-textbox v-model="email" class="form-control" placeholder="Nhập email">
                                </ejs-textbox>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Giới tính</label>
                                <ejs-dropdownlist v-model="gender" :dataSource="genderOptions"
                                    :fields="{ text: 'text', value: 'value' }" class="form-control"
                                    placeholder="Chọn giới tính">
                                </ejs-dropdownlist>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Ngày sinh</label>
                                <ejs-datepicker v-model="birthday" class="form-control" placeholder="Chọn ngày sinh"
                                    :format="'dd/MM/yyyy'">
                                </ejs-datepicker>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Số điện thoại</label>
                                <ejs-textbox v-model="phone" class="form-control" placeholder="Nhập số điện thoại">
                                </ejs-textbox>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Địa chỉ</label>
                                <ejs-textbox v-model="address" class="form-control" placeholder="Nhập địa chỉ">
                                </ejs-textbox>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Tài khoản Telegram</label>
                                <ejs-textbox v-model="telegramAccount" class="form-control"
                                    placeholder="Nhập Account Telegram">
                                </ejs-textbox>
                            </div>
                        </div>
                        <!-- <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Telegram ID</label>
                                <ejs-textbox v-model="telegramChatId" class="form-control"
                                    placeholder="Nhập Telegram Chat ID"
                                    @keypress="e => !/[\d-]/.test(e.key) && e.preventDefault()">
                                </ejs-textbox>
                            </div>
                        </div> -->
                        <div class="col-sm-6 col-12">
                            <div class="form-group">
                                <label class="form-label">Telegram ID</label>

                                <div class="tg-row">
                                <ejs-textbox
                                    v-model="telegramChatId"
                                    class="form-control tg-input"
                                    placeholder="Nhập Telegram Chat ID"
                                    @keypress="e => !/[\d-]/.test(e.key) && e.preventDefault()"
                                ></ejs-textbox>

                                <!-- <button class="btn btn-primary tg-btn" type="button" @click="GetTelegramID">
                                    Lấy ID Telegram
                                </button> -->
                                <button class="btn btn-primary tg-btn" type="button" @click="GetTelegramID" title="Lấy ID Telegram">
                                    <i class="fa fa-search"></i>
                                </button>

                                </div>
                            </div>
                            </div>

                    </div>
                    <!-- Avatar Section -->
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group text-center">
                                <div class="avatar-upload-container">
                                    <label class="form-label">Ảnh đại diện</label>
                                    <div class="avatar-preview">
                                        <img v-if="avatarUrl" :src="avatarUrl" :alt="full_name || 'Avatar'"
                                            class="avatar-image" @error="onImageError">
                                        <div v-else class="avatar-placeholder">
                                            <i class="fa fa-user"></i>
                                        </div>
                                    </div>
                                    <div class="avatar-upload-controls">
                                        <button type="button" class="btn btn-outline-primary btn-sm"
                                            @click="triggerFileUpload">
                                            <i class="fa fa-camera"></i> Thay đổi ảnh
                                        </button>
                                        <input type="file" ref="avatarInput" accept="image/*" @change="onAvatarSelected"
                                            style="display: none;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="group-buttons -bottom right modal-buttons">
                        <button type="button" class="btn btn-secondary" @click="hideModal">
                            <i class="fa fa-times"></i> Hủy
                        </button>
                        <button type="button" class="btn btn-primary" @click="onSave">
                            <i class="fa fa-save"></i> Lưu thay đổi 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </ejs-dialog>
</template>

<script>

import EditInfoAPI from './editInfoAPI.js';
import * as signalR from "@microsoft/signalr";
import { startNotificationHub, stopNotificationHub } from "../../../plugins/signalrGetIdTelegram.js";
export default {
    name: 'EditInfo',
    data() {
        return {
            target: '.main-wrapper',
            animationSettings: { effect: 'Zoom' },
            header: `<span class="icon fa fa-user"></span> Chỉnh sửa thông tin cá nhân`,

            email: '',
            gender: '',
            birthday: null,
            address: '',
            phone: '',
            full_name: '',
            avatarUrl: '',
            avatarFile: null,
            telegramAccount: '',
            genderOptions: [
                { text: 'Chọn giới tính', value: '' },
                { text: 'Nam', value: 'male' },
                { text: 'Nữ', value: 'female' },
                { text: 'Khác', value: 'other' }
            ],
            telegramChatId: '',
            connection: null,
            telegram_chat_id: null,
            telegram_username: null,
        }
    },
    methods: {
        GetTelegramID() {
            const bot = "RequestGP2_bot";   // KHÔNG có @
            const userId = this.$_root.token.getUserId();
            const token = String(userId);   // user_id dạng int -> string

            const url = `https://t.me/${bot}?start=${encodeURIComponent(token)}`;
            window.open(url, "_blank");

        },

        loading(show) {
            this.$root.showLoading(show);
        },

        showModal() {
            this.$refs["popupEditInfo"].show();
        },

        hideModal() {
            this.$refs["popupEditInfo"].hide();
        },

        async handleShowModal() {
            this.loadUserData();
        },

        clear() {
            this.email = '';
            this.gender = '';
            this.birthday = null;
            this.address = '';
            this.phone = '';
            this.full_name = '';
            this.avatarUrl = '';
            this.avatarFile = null;
            this.telegramAccount = '';
            this.telegramChatId = ''
        },
        async loadUserData() {
            this.loading(true);
            try {
                const userId = this.$_root.token.getUserId();
                if (!userId) {
                    this.$toast.error('Không tìm thấy thông tin user');
                    return;
                }

                const response = await EditInfoAPI.getAccountByUser(this, userId);
                if (response.success && response.data) {
                    const userData = response.data;
                    this.full_name = userData.full_name || '';
                    this.email = userData.email || '';
                    this.phone = userData.phone || '';
                    this.address = userData.address || '';
                    this.telegramAccount = userData.telegram_id || '';
                    this.gender = userData.gender === 0 ? 'male' : (userData.gender === 1 ? 'female' : 'other');
                    this.birthday = userData.birthday ? new Date(userData.birthday) : null;
                    this.avatarUrl = userData.avatar
                        ? EditInfoAPI.getAvatarUrl(userId)
                        : '';
                    this.telegramChatId = userData.telegram_chat_id || ''
                }
            } catch (error) {
                this.$toast.error('Lỗi tải thông tin người dùng');
            } finally {
                this.loading(false);
            }
        },

        validateForm() {
            if (!this.full_name.trim()) {
                this.$toast.error('Vui lòng nhập họ và tên');
                return false;
            }

            if (this.email && !this.isValidEmail(this.email)) {
                this.$toast.error('Email không hợp lệ');
                return false;
            }

            if (this.phone && !this.isValidPhone(this.phone)) {
                this.$toast.error('Số điện thoại không hợp lệ');
                return false;
            }
            return true;
        },

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        isValidPhone(phone) {
            return /^[0-9]{10,11}$/.test(phone);
        },

        onImageError() {
            this.avatarUrl = '';
        },

        triggerFileUpload() {
            this.$refs.avatarInput.click();
        },

        onAvatarSelected(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                this.$toast.error('Vui lòng chọn file hình ảnh');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                this.$toast.error('Kích thước file không được vượt quá 5MB');
                return;
            }

            this.avatarFile = file;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarUrl = e.target.result;
                this.$nextTick(() => this.$forceUpdate());
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        },

        async onSave() {
            if (!this.validateForm()) return;
            this.loading(true);
            try {
                const userId = this.$_root.token.getUserId();

                const nameParts = this.full_name.trim().split(' ');
                const firstName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
                const lastName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : this.full_name.trim();

                const payload = {
                    user_id: userId,
                    full_name: this.full_name,
                    first_name: firstName,
                    last_name: lastName,
                    email: this.email,
                    phone: this.phone,
                    address: this.address,
                    gender: this.gender === 'male' ? 0 : (this.gender === 'female' ? 1 : 2),
                    birthday: this.birthday ? new Date(this.birthday).toLocaleDateString('en-GB') : null,
                    telegram_id: this.telegramAccount,
                    telegram_chat_id: this.telegramChatId ? Number(this.telegramChatId) : null
                };

                const infoResponse = await EditInfoAPI.updateAccountInfo(this, payload);
                if (!infoResponse?.success) {
                    this.$toast.error(infoResponse?.message || 'Lỗi cập nhật thông tin.');
                    return;
                }

                if (this.avatarFile) {
                    const formData = new FormData();
                    formData.append('AvatarFile', this.avatarFile);
                    await EditInfoAPI.updateAvatar(this, formData);
                    this.avatarFile = null;
                }

                this.$toast.success('Cập nhật thông tin thành công!');

                if (this.$parent.$parent.$refs?.header?.refreshUserAvatar) {
                    this.$parent.$parent.$refs.header.refreshUserAvatar();
                }

                this.hideModal();
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
                this.$toast.error('Lỗi khi cập nhật thông tin');
            } finally {
                this.loading(false);
            }
        }
    },
    mounted() {
        const userId = this.$_root.token.getUserId();
        startNotificationHub({
            hubUrl: `${import.meta.env.VNPT_API}/notifyHub`,
            userId,
            onTelegramLinked: (payload) => {
                this.telegram_chat_id = payload.telegram_chat_id;
                this.telegram_username = payload.telegram_username;
                this.loadUserData();
                // this.$toast.success("Lấy mã telegram thành công");
            }
        });
    }
    ,
    async beforeUnmount() {
        await stopNotificationHub();
    },
}
</script>

<style scoped>
.modal-buttons {
    margin-top: 30px;
    text-align: right;
}

.form-label.required::after {
    content: " *";
    color: red;
}

.popup-box {
    padding: 20px;
}

.popup-body {
    max-height: 70vh;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #495057;
}


.avatar-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border: 2px dashed #e9ecef;
    border-radius: 8px;
    background-color: #f8f9fa;
}

.avatar-preview {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #dee2e6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

}

.avatar-image:hover {
    transform: scale(1.05);
}

.avatar-upload-controls {
    text-align: center;
}

.avatar-upload-controls .btn {
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.3s ease;
}

.avatar-upload-controls .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6c757d;
    color: #ffffff;
    font-size: 48px;
}

.avatar-placeholder i {
    opacity: 0.8;
}

.tg-row{
  display:flex;
  gap:8px;              
  align-items:stretch;
}
.tg-input{
  flex:1;              
  min-width:0;          
}
.tg-btn{
  white-space:nowrap; 
}

</style>
