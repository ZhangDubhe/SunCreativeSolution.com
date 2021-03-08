export const ArticleState = {
  BOARD: 3, // "展示板"

  CRAFT: 1, // "草稿夹"
  TRASH: 2, // "回收站"
  BLACK: 4 // "黑历史"
}
export const StateIcon = {
  CRAFT: 1, // "草稿夹"
  TRASH: 2, // "回收站"
  BOARD: 3, // "展示板"
  BLACK: 4 // "黑历史"
}

export const ArticleStateDesc = {
  1: '草稿夹',
  2: '回收站',
  3: '展示板',
  4: '黑历史'
}

export const ArticleStateList = Object.keys(ArticleState).map((k) => ({
  key: k,
  value: ArticleState[k],
  label: ArticleStateDesc[ArticleState[k]]
}))
