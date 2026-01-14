import axios from "axios";

const DocumentApi = {
  // Public: everyone can fetch and download
  getDocuments: async () => {
    const response = await axios.get("/work/Document/GetDocuments");
    if (response.status !== 200) {
      throw new Error("Failed to fetch documents");
    }
    return response.data;
  },

  downloadDocumentZip: async (documentId) => {
    const response = await axios.get("/work/Document/DownloadZip", {
      params: { documentId },
      responseType: "blob",
    });
    return response;
  },

  downloadFile: async (filePath) => {
    return axios.get("/work/Upload/Download", {
      params: { filePath },
      responseType: "blob",
    });
  },

  downloadDocument: async (filePath) => {
    const response = await axios.get("/work/Upload/Download", {
      params: { filePath },
      responseType: "blob",
    });
    if (response.status !== 200) {
      throw new Error("Failed to download file");
    }
    return response;
  },

  // Restricted: guard in UI by permission (systemDocumentPolicy)
  getPermissions: async () => {
    const response = await axios.get(
      "permission/getPermissionButtons?name=systemDocumentPolicy"
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch document permissions");
    }
    return response.data;
  },

  createDocument: async ({ document_name, document_files = [], document_file }) => {
    const formData = new FormData();
    formData.append("document_name", document_name ?? "");
    const files = document_files?.length
      ? document_files
      : document_file
      ? [document_file]
      : [];
    files.forEach((file) => formData.append("document_file", file));

    const response = await axios.post(
      "/work/Document/InsertDocument",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create document");
    }
    return response.data;
  },

  updateDocument: async ({
    document_id,
    document_name,
    document_files = [],
    document_file,
    keepFilePaths,
    keepFileIds,
  }) => {
    const formData = new FormData();
    formData.append("document_id", document_id);
    if (document_name !== undefined) {
      formData.append("document_name", document_name);
    }
    const files = document_files?.length
      ? document_files
      : document_file
      ? [document_file]
      : [];
    files.forEach((file) => formData.append("document_file", file));

    if (keepFilePaths !== undefined) {
      const keepList = Array.isArray(keepFilePaths)
        ? keepFilePaths.filter(Boolean)
        : [keepFilePaths].filter(Boolean);
      formData.append("keep_file_paths", JSON.stringify(keepList));
    }

    if (keepFileIds !== undefined) {
      const keepIds = Array.isArray(keepFileIds)
        ? keepFileIds.filter((v) => v !== undefined && v !== null)
        : [keepFileIds];
      formData.append("keep_file_ids", JSON.stringify(keepIds));
    }

    const response = await axios.put(
      "/work/Document/UpdateDocument",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to update document");
    }
    return response.data;
  },

  deleteDocuments: async (documentIds = []) => {
    const response = await axios.delete("/work/Document/DeleteDocument", {
      params: { document_ids: JSON.stringify(documentIds) },
    });
    if (response.status !== 200) {
      throw new Error("Failed to delete documents");
    }
    return response.data;
  },
};

export default DocumentApi;
