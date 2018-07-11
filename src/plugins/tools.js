// import something here

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$get = (p, o) => {
    return p.split('.').reduce((xs, x) =>
      (xs && xs[x]) ? xs[x] : '', o)
  }
  Vue.prototype.$bool = statement => {
    return Boolean(statement)
  }
}
