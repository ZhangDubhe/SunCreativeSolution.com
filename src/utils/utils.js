
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatProject = nodeArr => {
  // h1 h2 分在一个 section 里 - .para-section
  // h2 之后, 下一个图片之前的 p 分在一个 section 里 .images-section
  let newNodeArr = []
  let flag = 0
  let currentHeader = ''
  let currentHeaderNodes = []
  nodeArr.forEach(item => {
    let tagObj = {}
    switch (item.tagName.toLowerCase()) {
      case 'h1':
        tagObj.styleClass = 'para-section'
        tagObj.header = {
          name: item.textContent,
          nodes: [item]
        }
        tagObj.para = []
        currentHeader = item.textContent
        currentHeaderNodes = item
        newNodeArr.push(tagObj)
        flag++
        break
      case 'h2':
        if (flag === 0) {
          tagObj.styleClass = 'para-section'
          tagObj.header = {
            name: item.textContent,
            nodes: item
          }
          tagObj.para = []
          newNodeArr.push(tagObj)
          flag++
        }
        let lastSection = newNodeArr[flag - 1]
        if (lastSection.styleClass === 'para-section' && lastSection.header) {
          if (!lastSection.subheader) {
            newNodeArr[flag - 1].subheader = {
              name: item.textContent,
              nodes: item
            }
          } else {
            tagObj.styleClass = 'para-section'
            tagObj.header = {
              name: currentHeader,
              nodes: currentHeaderNodes
            }
            tagObj.subheader = {
              name: item.textContent,
              nodes: item
            }
            tagObj.para = []
            newNodeArr.push(tagObj)
            flag++
          }
        } else {
          tagObj.styleClass = 'para-section'
          tagObj.header = {
            name: currentHeader,
            nodes: currentHeaderNodes
          }
          tagObj.subheader = {
            name: item.textContent,
            nodes: item
          }
          tagObj.para = []
          newNodeArr.push(tagObj)
          flag++
        }
        break
      default:
        if (item.querySelectorAll('img').length > 0) {
          let lastSection = newNodeArr[flag - 1]
          if (lastSection.styleClass === 'images-section') {
            newNodeArr[flag - 1].images.push(item)
          } else {
            tagObj.styleClass = 'images-section'
            tagObj.images = [item]
            console.log(item)
            newNodeArr.push(tagObj)
            flag++
          }
        } else if (item.textContent && item.textContent.indexOf('!&hr&!') >= 0) {
          newNodeArr.push(tagObj)
          flag++
        } else {
          let lastSection = newNodeArr[flag - 1]
          if (lastSection.styleClass === 'para-section' && item.textContent !== '') {
            newNodeArr[flag - 1].para.push(item)
          }
        }
        break
    }
  })

  // 返回的结果不直接渲染进入 v-html, 而是在 v-for 里根据是图片还是文字进行分别的渲染
  return newNodeArr
}
module.exports = {
  formatNumber: formatNumber,
  formatProject: formatProject,
  getMonthEnArr () {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  formatDateToItem (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    const week = date.getDay()
    const ENMonthArr = this.getMonthEnArr()
    const ENMonth = ENMonthArr[month - 1]
    let weekName = ''
    switch (week) {
      case 0: weekName = '星期日'; break
      case 1: weekName = '星期一'; break
      case 2: weekName = '星期二'; break
      case 3: weekName = '星期三'; break
      case 4: weekName = '星期四'; break
      case 5: weekName = '星期五'; break
      case 6: weekName = '星期六'; break
      default: break
    }
    // console.log('ENMonth', ENMonth)
    return {year, month, day, hour, minute, second, weekName, ENMonth}
  },
  formatDate (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
  }

}
