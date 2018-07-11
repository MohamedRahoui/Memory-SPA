import store from '../store'

let validateToken = (token) => {
  return typeof token === 'string' && token.length === 60
}

const rules = {
  isAuth () {
    return validateToken(store.getters.getToken) && !store.getters.getMe.is_staff
  },
  isGuest () {
    return !validateToken(store.getters.getToken)
  },
  isStaff () {
    return validateToken(store.getters.getToken) && store.getters.getMe.is_staff
  }
}
const sync = (go) => {
  if (!store.getters.getMe.id && store.getters.getToken !== 'NONE') {
    store.watch(
      (state) => state.auth.token,
      (value) => {
        if (value === 'NONE') {
          go()
        }
      }
    )
    store.watch(
      (state) => state.auth.me,
      (value) => {
        if (value.id) {
          go()
        }
      }
    )
  } else {
    go()
  }
}
export default {
  Staff (to, redirect, next) {
    let goStaff = () => {
      if (validateToken(store.getters.getToken) && store.getters.getMe.is_staff) {
        next()
      } else {
        next({name: 'home'})
      }
    }
    sync(goStaff)
  },
  Auth (to, redirect, next) {
    let goAuth = () => {
      if (validateToken(store.getters.getToken) && !store.getters.getMe.is_staff) {
        next()
      } else if (store.getters.getMe.is_staff) {
        next({name: 'staff-index'})
      } else {
        next({name: 'home'})
      }
    }
    sync(goAuth)
  },
  Guest (to, redirect, next) {
    let goGuest = () => {
      if (!validateToken(store.getters.getToken)) {
        next()
      } else {
        next({name: 'app'})
      }
    }
    sync(goGuest)
  },
  rules
}
