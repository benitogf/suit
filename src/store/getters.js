import router from '@/router'

export const bagProducts = state => {
  return state.bag.added.map(({ id, variant, bulk, price, quantity }) => {
    const product = state.products.all.find(p => p.id === id)
    return {
      id: product.id,
      title: product.title,
      variant,
      bulk,
      price,
      quantity
    }
  })
}

export const currentState = state => {
  return state.route.name
}

export const availableRoutes = state => {
  const staticRoutes = ['tag', 'product', 'logout']
  return router.options.routes.reduce((cat, {name, path}) => {
    if (!cat) {
      cat = [{name, path}]
    } else {
      if (staticRoutes.indexOf(name) === -1 && path !== '*' &&
        (name !== 'login' || state.user.user === null) &&
        (name !== 'admin' || state.user.user !== null)) {
        cat.push({name, path})
      }
    }
    return cat
  }, [])
}
