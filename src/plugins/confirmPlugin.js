
import {DialogUtility } from "@syncfusion/ej2-vue-popups"
// Use this as a plugin to register instance and injected toasts
export default function provideAppConfirm(app, options) {
    app.config.globalProperties.$confirm=(title, content)=>{
        return new Promise((resolve, _) => {
            let dialogObj=DialogUtility.confirm({
                title: title,
                content: `<div style="padding: 20px !important; font-size: 14px !important">${content}</div>`,
                position: { X: "center", Y: "center" },
                okButton: { text:'Đồng ý', click:()=>{
                    dialogObj.hide()
                    resolve(1)
                }},
                cancelButton: { text: 'Hủy', click:()=>{
                    dialogObj.hide()
                    resolve(0)
                }},
            })
        })
    }
    app.config.globalProperties.msgBoxConfirm = (title, content, okButton, cancelButton) => {
        return new Promise((resolve, _) => {
            let dialogObj = DialogUtility.confirm({
                title: title,
                content: `<div style="padding: 20px !important; font-size: 14px !important">${content}</div>`,
                position: { X: "center", Y: "center" },
                showCloseIcon: true,
                closeOnEscape: true,
                okButton: {
                    icon: 'e-icons e-check',
                    text: okButton ? okButton : 'Đồng ý', click: () => {
                        dialogObj.hide()
                        resolve(1)
                    }
                },
                cancelButton: {
                    icon: 'e-icons e-close',
                    text: cancelButton ? cancelButton : 'Hủy', click: () => {
                        dialogObj.hide()
                        resolve(0)
                    }
                },
            })
        })
    }
    app.config.globalProperties.$msgBox = {
        show(type, title, content, okButton) {
            const iconMap = {
                warn: '\u26A0\uFE0F',    // ⚠️
                error: '\u274C',         // ❌
                info: '\u2139\uFE0F',    // ℹ️
                success: '\u2705'        // ✅
            };

            const icon = iconMap[type] || '';

            const formattedTitle = icon
                ? `<span style="display: inline-flex; align-items: center; font-size: 20px; margin-right: 8px;">
                        ${icon}
                </span> ${title}`
                : title;

            DialogUtility.alert({
                title: formattedTitle,
                position: { X: "center", Y: "center" },
                content: `<div style="padding: 20px !important; font-size: 14px !important">${content}</div>`,
                okButton: {
                    text: okButton || 'Đồng ý'
                },
                showCloseIcon: true,
                closeOnEscape: true
            });
        },

        warn(title, content, okButton) {
            this.show('warn', title, content, okButton);
        },

        error(title, content, okButton) {
            this.show('error', title, content, okButton);
        },

        info(title, content, okButton) {
            this.show('info', title, content, okButton);
        },

        success(title, content, okButton) {
            this.show('success', title, content, okButton);
        }
    }
  }