import router from '@/router'

const excludedRoutes = ['page', 'product', 'login', 'settings']

export const availableRoutes = state => router.options.routes.reduce((cat, {name, path}) => {
  if (excludedRoutes.indexOf(name) === -1 && path !== '*') {
    cat.push({name, path})
  }
  return cat
}, [])

export const bagProducts = state => state.products.all ? state.products.all.reduce((cat, { id, name, picture }) => {
  return state.bag.added.reduce((cats, product) => {
    if (product.id === id) {
      cats.push({
        id,
        name,
        picture,
        bulk: product.bulk,
        bulkQuantity: product.bulkQuantity,
        price: product.price,
        quantity: product.quantity,
        variant: product.variant
      })
    }
    return cats
  }, cat)
}, []) : []

export const currentState = state => state.route.name

export const isAdmin = state => state && state.user.user.token && state.user.user.role === 'admin'
