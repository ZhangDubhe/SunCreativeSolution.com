import { ArticleStateList } from '@/config/article'
const ArticleNavs = ArticleStateList.map((c) => {
  const { label: name, key } = c
  let _key = key.toLowerCase()
  return {
    name,
    url: `/admin/${_key}`,
    icon: 'icon-magic-wand'
  }
})
export default {
  items: [
    {
      name: 'Welcome, Sun',
      url: 'dashboard',
      icon: 'icon-layers'
    },
    ...ArticleNavs,
    {
      divider: true
    },
    {
      name: '媒体库',
      url: '/admin/medias',
      icon: 'icon-folder'
    }
    // {
    //   name: 'Dashboard',
    //   url: 'dashboard',
    //   icon: 'icon-layers'
    // }, {
    //   name: 'Periodic',
    //   url: 'periodic',
    //   icon: 'icon-magic-wand'
    // }
  ]
}
// https://coreui.io/v1/demo/AngularJS_Demo/#!/icons/simple-line-icons
