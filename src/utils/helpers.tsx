import { NumberFormat, toLocaleString } from '@formatjs/intl-numberformat'
NumberFormat.__addLocaleData(
  require('@formatjs/intl-numberformat/dist/locale-data/en.json') // locale-data for en
)

export const compactNumbers = (num) => {
  if (num >= 1e3)
    return toLocaleString(num, 'en', {
      notation: 'compact',
      compactDisplay: 'short'
    })
  return num
}

export const doiFromUrl = (doiUrl: string) => {
  return doiUrl ? doiUrl.substring(15) : null
}

export const orcidFromUrl = (orcidUrl: string) => {
  return orcidUrl ? orcidUrl.substring(17) : null
}

export const rorFromUrl = (rorUrl: string) => {
  return rorUrl ? rorUrl.substring(15) : null
}

export const gridFromUrl = (gridUrl: string) => {
  return gridUrl ? gridUrl.substring(15) : null
}
