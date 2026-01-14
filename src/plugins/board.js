var BoardPlugin = {
  data: {
    BOARD_SELECTED: "BOARD_SELECTED"
  },
  setBoardIdSelected:function(boardId){
    localStorage.setItem(this.data.BOARD_SELECTED, boardId);
  },
  getBoardIdSelected:function(){
    if (localStorage.hasOwnProperty(this.data.BOARD_SELECTED))
      return localStorage.getItem(this.data.BOARD_SELECTED);
    else return null;
  }
};

export default BoardPlugin
