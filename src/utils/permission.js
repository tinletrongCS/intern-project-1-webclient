// src/utils/permission.js

/**
 * Kiểm tra user có quyền truy cập route theo tên route (routeName)
 * @param {string} routeName - Tên route trong router (ví dụ: 'board', 'revenue')
 * @param {Array} menus - Danh sách menu từ API (có thể chứa children)
 * @returns {boolean} true nếu có quyền
 */
export function hasPermission(routeName, menus) {
  if (!menus || menus.length === 0) return false;

  const checkRecursive = (items) => {
    for (const item of items) {
      if (item.link === routeName) return true;
      if (item.children && item.children.length > 0) {
        if (checkRecursive(item.children)) return true;
      }
    }
    return false;
  };

  return checkRecursive(menus);
}
