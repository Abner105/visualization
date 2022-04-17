const themeObj = {
  chalk:{
    backgroundColor:'#222733',
    color:'#fff',
    headBackground:'#161522',
    headBorder:'header_border_dark.png',
    logo:'logo_dark.png',
    qiehuan:'qiehuan_dark.png'
  },
  vintage:{
    backgroundColor:'#fff',
    color:'#000',
    headBackground:'#eee',
    headBorder:'header_border_light.png',
    logo:'logo_light2.png',
    qiehuan:'qiehuan_light.png'
  }
}
export function getThemeCss(theme){
  return themeObj[theme]
}