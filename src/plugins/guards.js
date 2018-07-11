import middleware from '../helpers/middlewares'

export default ({app, router, Vue}) => {
  Object.keys(middleware.rules).forEach(key => {
    Vue.prototype[`$${key}`] = middleware.rules[key]
  })
}
