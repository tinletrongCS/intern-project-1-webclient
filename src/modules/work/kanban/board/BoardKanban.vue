<template>
  <div class="boardkanban">
    <div class="dropdown-wrapper" ref="dropdownRef">
      <div class="board-selector" @click="toggleDropdown">
        <!-- click vào tên để mở dropdown chọn bảng -->
        <span class="board-name" :title="selectedBoard.Name">
          {{ selectedBoard.Name }}
        </span>

        <!-- nút more menu -->
        <button class="board-icon-btn" ref="moreBtn" @click.stop="toggleMoreMenu" aria-haspopup="true"
          :aria-expanded="moreMenuOpen ? 'true' : 'false'" title="Tùy chọn">⋮</button>

        <!-- more dropdown -->
        <div v-if="moreMenuOpen" class="more-menu" ref="moreMenu">
          <ul>
            <li @click="viewBoardDetail"><span class="-ap icon-eye icon-custom"></span>Xem chi tiết</li>
            <!-- có thể thêm các mục khác ở đây -->
            <!-- Nếu bảng đang mở => cho phép Đóng bảng -->
            <li v-if="!selectedBoard.Closed && ownerBoardFlg" @click="closedBoard">
              <span class="-ap icon-close icon-custom"></span>
              Đóng bảng
            </li>

            <!-- Nếu bảng đang đóng => cho phép Mở lại -->
            <li v-if="selectedBoard.Closed && ownerBoardFlg" @click="openBoard">
              <span class="-ap icon-undo icon-custom"></span>
              Mở lại bảng
            </li>
          </ul>
        </div>
      </div>

      <!-- <div class="create-board-inline" @click="createBoard">+ Tạo mới bảng</div> -->
      <button v-if="hasButtonPermission('insertBoard')" class="btn btn-second create-board-inline"
        @click="createBoard"><span class="-ap icon-plus"></span>Tạo mới bảng</button>
      <div v-if="dropdownOpen" class="dropdown-panel">
        <!-- Tìm kiếm -->
        <div class="search-box">
          <input type="text" v-model="searchText" placeholder="Tìm theo tên bảng..." @keyup.enter="searchBoards"
            class="form-control" />
          <button @click="searchBoards">🔍</button>
        </div>
        <!-- <div class="create-board" @click="createBoard">+ Tạo mới bảng</div> -->
        <ul class="board-list">
          <div v-for="(group, groupIndex) in filteredBoardGroups" :key="`group-${groupIndex}`" class="board-group">
            <div class="group-title" @click="toggleGroup(groupIndex)">
              <i class="fa fa-chevron-right arrow" :class="{ rotated: !collapsedStates[groupIndex].isCollapsed }"></i>
              <span class="title-text">{{ group.title }}</span>
            </div>

            <template v-if="!collapsedStates[groupIndex].isCollapsed">
              <div v-for="(cat, catIndex) in group.categories" :key="`cat-${groupIndex}-${catIndex}`"
                class="board-category">
                <div v-if="cat.category" :class="{ 'category-title': true, selected: cat.selected }">
                  {{ cat.category }}
                </div>
                <ul>
                  <li v-for="(board, bIndex) in cat.boards" :key="`board-${groupIndex}-${catIndex}-${bIndex}`"
                    @click="clickSelectBoard(board)" :class="{ selected: board.board_id == selectedBoard.Id }">
                    <!-- Tên board luôn bên trái -->
                    <span class="board-title">{{ board.board_name }}</span>
                    <!-- Nhóm icon bên phải -->
                    <div class="board-actions">
                      <!-- bookmark -->
                      <span v-if="board.BookMarkFlg" @click.stop="clickBookMark(board)" class="icon"
                        style="font-size: 28px; color:#facc15">&#9733;</span>
                      <span v-else @click.stop="clickBookMark(board)" class="icon"
                        style="font-size: 28px; color:gray">&#9734;</span>

                      <!-- eye icon -->
                      <span v-if="!board.HiddenBoardFlg" @click.stop="clickHiddenBoard(board)" class="icon custom-icon">
                        <i class="fa fa-eye"></i>
                      </span>
                      <span v-else class="icon custom-icon" @click.stop="clickHiddenBoard(board)">
                        <i class="fa fa-eye-slash"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </template>

          </div>
        </ul>
      </div>
    </div>
    <!-- Modal -->
    <AddBoardModal ref="addBoardModal" @insertBoardSuccess="insertBoardSuccess" :viewFlg="viewDetailFlag"
      :data="boardSelected" @successToggleChanged="successToggleChanged"
      @successToggleRestrictViewTaskDetailChanged="successToggleRestrictViewTaskDetailChanged" />
  </div>
</template>
<script>
import API from './API'
import AddBoardModal from './AddBoardModal.vue'
export default {
  name: 'BoardKanban',
  components: {
    AddBoardModal
  },
  computed: {
    filteredBoardGroups() {
      if (!this.searchText.trim()) return this.boardGroups;

      const normalize = str => str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();

      const search = normalize(this.searchText);

      // Khi có text search => mở hết collapsedStates
      // this.collapsedStates = this.collapsedStates.map(cs => ({
      //   ...cs,
      //   isCollapsed: false
      // }));

      return this.boardGroups
        .map(group => {
          const filteredCategories = group.categories
            .map(cat => {
              const filteredBoards = cat.boards.filter(board => {
                const name = normalize(board.board_name);
                return name.includes(search);
              });
              return filteredBoards.length > 0
                ? { ...cat, boards: filteredBoards }
                : null;
            })
            .filter(Boolean);

          return filteredCategories.length > 0
            ? { ...group, categories: filteredCategories }
            : null;
        })
        .filter(Boolean);
    }
  },
  data() {
    return {
      boards: [],
      tab: 'active',
      dropdownOpen: false,
      selectedBoard: {
        Id: 0,
        Name: 'Vui lòng chọn'
      },
      searchText: '',

      boardGroups: [],
      moreMenuOpen: false,
      viewDetailFlag: false,
      boardSelected: null,
      collapsedStates: [],
      ownerBoardFlg: false,
      listPermissionButtons: [],
      _searchTimer: null

    }
  },
  methods: {
    toggleGroup(groupIndex) {
      this.collapsedStates[groupIndex].isCollapsed =
        !this.collapsedStates[groupIndex].isCollapsed;
    },
    createBoard() {
      this.dropdownOpen = false
      this.viewDetailFlag = false
      this.$refs.addBoardModal.showModal()
    },
    toggleDropdown() {
      this.moreMenuOpen = false
      this.dropdownOpen = !this.dropdownOpen
      if (!this.dropdownOpen) {
        this.searchText = ''
      }
    },
    toggleMoreMenu() {
      this.dropdownOpen = false
      this.moreMenuOpen = !this.moreMenuOpen
    },
    viewBoardDetail() {
      this.moreMenuOpen = false
      if (this.boardSelected) {
        this.viewDetailFlag = true
        this.$refs.addBoardModal.showModal()
      } else {
        this.$toast.error("Vui lòng chọn board!")
      }
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.dropdownRef
      const moreMenuEl = this.$refs.moreMenu
      const moreBtn = this.$refs.moreBtn

      // click ngoài toàn bộ wrapper -> đóng cả 2
      if (dropdown && !dropdown.contains(event.target)) {
        this.dropdownOpen = false
        this.moreMenuOpen = false
        this.searchText = ''
        return
      }

      // nếu click không nằm trong more menu & không phải nút, thì đóng more menu
      if (this.moreMenuOpen) {
        const clickOutsideMore =
          (!moreMenuEl || !moreMenuEl.contains(event.target)) &&
          (!moreBtn || !moreBtn.contains(event.target))
        if (clickOutsideMore) {
          this.moreMenuOpen = false
        }
      }
    },
    async clickSelectBoard(board) {
      this.boardSelected = Object.assign({}, board)
      this.dropdownOpen = false
      this.searchText = ''
      this.selectedBoard.Id = board.board_id
      this.selectedBoard.Name = board.board_name
      this.selectedBoard.CanAddMember = board.can_add_member
      this.selectedBoard.Closed = board.is_closed
      this.selectedBoard.isTaskDetailRestricted = board.is_task_detail_restricted
      //save board selected cache
      this.$_root.board.setBoardIdSelected(board.board_id)
      //

      // Kiểm tra quyền owner
      let rs = await API.CheckSubOwnerOrOwner(this, board.board_id);
      this.ownerBoardFlg = rs.isOwner;
      // end

      this.$emit('clickSelectBoard', this.selectedBoard)
    },
    async insertBoardSuccess(value) {
      var listBoard = await API.getBoards();
      if (listBoard.length == 0) {
        this.boardGroups = [];
        this.selectedBoard.Id = 0
        this.selectedBoard.Name = 'Vui lòng chọn'
        return
      }
      this.boardGroups = listBoard;
      //index board
      var board = this.getBoardById(value)
      if (!board) {
        board = this.filteredBoardGroups[0]?.categories?.[0]?.boards?.[0];
      }
      if (board) {
        this.boardSelected = Object.assign({}, board)
        this.selectedBoard.Id = board.board_id
        this.selectedBoard.Name = board.board_name
        this.selectedBoard.CanAddMember = board.can_add_member
        this.selectedBoard.Closed = board.is_closed
        this.selectedBoard.isTaskDetailRestricted = board.is_task_detail_restricted
        this.$_root.board.setBoardIdSelected(value)
        this.$emit('clickSelectBoard', this.selectedBoard)
      }
    },
    async successToggleChanged() {
      var listBoard = await API.getBoards();
      if (listBoard.length == 0) {
        this.boardGroups = [];
        this.selectedBoard.Id = 0
        this.selectedBoard.Name = 'Vui lòng chọn'
        return
      }
      this.boardGroups = listBoard;
      //Update data board selected
      var board = this.getBoardById(this.selectedBoard.Id)
      if (!board) {
        board = this.filteredBoardGroups[0]?.categories?.[0]?.boards?.[0];
      }
      if (board) {
        this.boardSelected = Object.assign({}, board)
        this.selectedBoard.Id = board.board_id
        this.selectedBoard.Name = board.board_name
        this.selectedBoard.CanAddMember = board.can_add_member
        this.selectedBoard.Closed = board.is_closed
        this.selectedBoard.isTaskDetailRestricted = board.is_task_detail_restricted
      }
    },
    async successToggleRestrictViewTaskDetailChanged() {
      var listBoard = await API.getBoards();
      if (listBoard.length == 0) {
        this.boardGroups = [];
        this.selectedBoard.Id = 0
        this.selectedBoard.Name = 'Vui lòng chọn'
        return
      }
      this.boardGroups = listBoard;
      //Update data board selected
      var board = this.getBoardById(this.selectedBoard.Id)
      if (!board) {
        board = this.filteredBoardGroups[0]?.categories?.[0]?.boards?.[0];
      }
      if (board) {
        this.boardSelected = Object.assign({}, board)
        this.selectedBoard.Id = board.board_id
        this.selectedBoard.Name = board.board_name
        this.selectedBoard.CanAddMember = board.can_add_member
        this.selectedBoard.Closed = board.is_closed
        this.selectedBoard.isTaskDetailRestricted = board.is_task_detail_restricted
      }
    },
    async clickHiddenBoard(board) {
      var hidden_flg = !board.HiddenBoardFlg
      let request = {
        board_id: board.board_id,
        hidden_flg: hidden_flg ? 1 : 0
      }
      let result = await API.AddUpdateHiddenBoard(this, request)
      if (result == '1') {
        var listBoard = await API.getBoards();
        if (listBoard.length == 0) {
          this.boardGroups = [];
          this.selectedBoard.Id = 0
          this.selectedBoard.Name = 'Vui lòng chọn'
          return
        }
        this.boardGroups = listBoard;
      }
    },
    async clickBookMark(board) {
      var bookMarkFlg = !board.BookMarkFlg
      let request = {
        board_id: board.board_id,
        bookmark_flag: bookMarkFlg ? 1 : 0
      }
      let result = await API.AddBookMarkBoard(this, request)
      if (result == '1') {
        var listBoard = await API.getBoards();
        if (listBoard.length == 0) {
          this.boardGroups = [];
          this.selectedBoard.Id = 0
          this.selectedBoard.Name = 'Vui lòng chọn'
          return
        }
        this.boardGroups = listBoard;
      }
    },
    getBoardById(boardId) {
      return this.filteredBoardGroups
        .flatMap(g => g.categories || [])
        .flatMap(c => c.boards || [])
        .find(b => b.board_id == boardId) || null
    }, 
    async selectBoardById(id) {
      const board = this.getBoardById(id)
      if (!board) return false
      await this.clickSelectBoard(board)
      return true
    }, 
    async initDuLieu() {
      var listBoard = await API.getBoards();
      if (listBoard.length == 0) {
        this.boardGroups = [];
        this.selectedBoard.Id = 0
        this.selectedBoard.Name = 'Vui lòng chọn'
        return
      }
      this.boardGroups = listBoard;
      // this.collapsedStates = this.boardGroups.map(({ title, isCollapsed }) => ({ title, isCollapsed }));
      this.collapsedStates = this.boardGroups.map(g => ({
        isCollapsed: g.isCollapsed ?? false
      }))
      var board;
      //load index board được lưu cache
      let boardId = this.$_root.board.getBoardIdSelected()
      if (boardId != null) {
        board = this.getBoardById(boardId)
        if (!board) {
          board = this.filteredBoardGroups[0]?.categories?.[0]?.boards?.[0];
        }
      } else {
        board = this.filteredBoardGroups[0]?.categories?.[0]?.boards?.[0];
      }
      //
      if (board) {
        this.boardSelected = Object.assign({}, board)
        this.selectedBoard.Id = board.board_id
        this.selectedBoard.Name = board.board_name
        this.selectedBoard.CanAddMember = board.can_add_member
        this.selectedBoard.Closed = board.is_closed
        this.selectedBoard.isTaskDetailRestricted = board.is_task_detail_restricted

        // Kiểm tra quyền owner
        let rs = await API.CheckSubOwnerOrOwner(this, board.board_id);
        this.ownerBoardFlg = rs.isOwner;
        // end

        this.$emit('clickSelectBoard', this.selectedBoard)
      }
    },
    // Xác nhận đóng bảng
    async closedBoard() {
      this.moreMenuOpen = false
      if (this.boardSelected) {
        let request = {
          board_id: this.selectedBoard.Id,
          is_closed: 1 //1-Đóng, 0 Mở
        }
        let result = await API.ClosedBoard(this, request)
        if (result == '1') {
          this.initDuLieu()
        } else {
          this.$toast.error(result)
        }
      } else {
        this.$toast.error("Vui lòng chọn board!")
      }
    },
    async openBoard() {
      this.moreMenuOpen = false
      if (this.boardSelected) {
        let request = {
          board_id: this.selectedBoard.Id,
          is_closed: 0 //1-Đóng, 0 Mở
        }
        let result = await API.OpenedBoard(this, request)
        if (result == '1') {
          this.initDuLieu()
        } else {
          this.$toast.error(result)
        }
      } else {
        this.$toast.error("Vui lòng chọn board!")
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    //Sài chung gọi trong Mixin
    this.GetPermissionButtons();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    clearTimeout(this._searchTimer);
  },
  watch: {
    searchText: {
      handler(val) {
        clearTimeout(this._searchTimer);
        this._searchTimer = setTimeout(() => {
          if (val && val.trim()) {
            this.collapsedStates = this.collapsedStates.map(cs => ({
              ...cs,
              isCollapsed: false
            }));
          }
        }, 200);
      }
    }
  }

}
</script>
<style>
.boardkanban {
  margin-top: 1em;
  margin-left: 1em;
}

.boardkanban .dropdown-wrapper {
  /* position: relative;
  width: max-content; */

  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
}

.boardkanban .create-board-inline {
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 10px;
  white-space: nowrap;
}

.boardkanban .board-selector {
  position: relative;
  /* để more-menu bám theo */
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 0px 10px;
  border-radius: 4px;
  border: 1px solid #1c75bc59;
  min-width: 280px;
  justify-content: space-between;
  cursor: pointer;
}

.boardkanban .board-icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 5px 12px;
  color: #666;
}

.boardkanban .board-icon-btn:hover {
  background: #eaeaea;
  border-radius: 4px;
}

.boardkanban .more-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  z-index: 30;
  overflow: hidden;
}


.boardkanban .more-menu .icon-custom {
  font-size: 16px;
  margin-right: 8px;
}

.boardkanban .more-menu ul {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.boardkanban .more-menu li {
  padding: 5px 6px;
  cursor: pointer;
  font-size: 14px;
}

.boardkanban .more-menu li:hover {
  background: #f5f5f5;
}


.boardkanban .board-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 6px 0px;
}

.boardkanban .board-icon {
  font-size: 16px;
  color: #666;
  padding-left: 8px;
}

.boardkanban .dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 400px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 20;
  padding: 10px;
  border-radius: 4px;

  max-height: 400px;
  /* Chiều cao tổng thể dropdown */
}

.boardkanban .board-tabs {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 10px;
}

.boardkanban .board-tabs span {
  cursor: pointer;
  padding: 4px 8px;
  font-weight: 500;
}

.boardkanban .board-tabs .active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
}

.boardkanban .close-btn {
  font-weight: bold;
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
}

.boardkanban .create-board {
  background: #f5f5f5;
  border-radius: 2px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  padding-left: 21px;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-right: 6px;
  border: 1px solid #474747;
}

.boardkanban .board-list {
  overflow-y: auto;
  flex: 1;
  max-height: 300px;
  /* scroll riêng phần danh sách */
  padding-left: unset !important;
}

.boardkanban .board-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  cursor: pointer;
}

.boardkanban .board-list li:hover {
  background: #f9f9f9;
}

.boardkanban .board-list .board-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  /* khoảng cách giữa icon */
}

.boardkanban .board-list .board-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boardkanban .icon {
  margin-left: 6px;
  margin-right: 6px;
}

.boardkanban .search-box {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  /* border: 1px solid #1c75bc59; */
}

.boardkanban .search-box input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.boardkanban .search-box button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  background: #f2f2f2;
  border-radius: 4px;
  cursor: pointer;
}

.boardkanban .category-title {
  margin: 6px 0;
  font-weight: bold;
}

.boardkanban .category-title.selected {
  background-color: #007bff;
  color: white;
  padding: 4px 6px;
  border-radius: 4px;
}

.boardkanban .board-group {
  margin-bottom: 10px;
}

.boardkanban .group-title {
  font-weight: bold;
  margin: 6px 0;
  font-size: 1.1rem;
  cursor: pointer;
}

.boardkanban .board-group ul {
  padding-left: unset;
  margin: 0;
}

.boardkanban .board-group li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
}

.boardkanban .board-group li.selected {
  background-color: #e8e8e8;
  color: #111827;
  border-radius: 4px;
}

.boardkanban .custom-icon {
  cursor: pointer;
  font-size: 18px;
  color: gray;
  margin-top: 2px;
}

.boardkanban .group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 15px;
  padding: 6px 8px;
  border-radius: 6px;
  color: #1f2937;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.boardkanban .group-title:hover {
  background-color: #f3f4f6;
  color: #0d6efd;
}

.boardkanban .group-title .arrow {
  font-size: 13px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.boardkanban .group-title .arrow.rotated {
  transform: rotate(90deg);
  /* mở nhóm thì xoay sang phải → xuống */
  color: #0d6efd;
}

.boardkanban .group-title .title-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
