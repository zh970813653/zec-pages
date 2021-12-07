// TODO: site logics

$(($) => {
  const $body = $('html, body')

  $('#scroll_top').on('click', () => {
    $body.animate({ scrollTop: 0 }, 600)
    return false
  })
})
const r = new Promise((resolve,reject) => {
  resolve(50)
})
r.then(res=>{
  console.log(res);
})