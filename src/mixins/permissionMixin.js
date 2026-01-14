import API from "./API";
export default {
  data() {
    return {
      listPermissionButtons: []
    };
  },
  methods: {
    async GetPermissionButtons() {
      this.listPermissionButtons=await API.GetPermissionButtons(this,this.$route.name)
    },
    hasButtonPermission(permission) {
      return this.listPermissionButtons.some(p => p.policy === permission);
    }
  }
};