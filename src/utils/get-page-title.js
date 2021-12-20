import defaultSettings from '@/settings'

const title = defaultSettings.title || '图书馆采购系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
