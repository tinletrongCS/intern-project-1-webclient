import axios from 'axios';

export class AxiosUploadAdapter {
  constructor(loader, uploadUrl) {
    this.loader = loader;
    this.uploadUrl = uploadUrl;
  }

  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post(this.uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: event => {
            if (event.lengthComputable) {
              this.loader.uploadTotal = event.total;
              this.loader.uploaded = event.loaded;
            }
          }
        })
        .then(response => {
          const urlImages = import.meta.env.VNPT_API+'/work/Upload/ImageView/'+(response.data.url || response.data.default);
          resolve({ default: urlImages });
        })
        .catch(err => reject(err));
      }));
  }

  abort() {}
}

// Plugin gắn vào CKEditor
export function AxiosUploadPlugin(editor, uploadUrl) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new AxiosUploadAdapter(loader, uploadUrl);
  };
}