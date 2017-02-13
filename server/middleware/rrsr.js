import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {RouterContext, match} from 'react-router'
import {Provider} from 'react-redux'
import configureStore from '../../src/store/configureStore'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import createRoutes from '../../src/routes'
import Helmet from 'react-helmet'
import _debug from 'debug'

const debug = _debug('app:server:middleware:rsr')

// get component fetchData promise
const _getFetchDataPromise = (renderProps, store) => {
  const {query, params} = renderProps
  let component = renderProps.components[renderProps.components.length - 1]

  if (component.WrappedComponent) {
    component = component.WrappedComponent
  }

  debug('match component:', component)

  return component.fetchData ? component.fetchData({query, params, store, location}) : Promise.resolve()
}

// subscribe Url
const _subscribeUrl = (history, location) => {
  let currentUrl = `${location.pathname}${location.search}`
  const unsubscribe = history.listen(newLoc => {
    if (newLoc.action === 'PUSH' || newLoc.action === 'REPLACE') {
      currentUrl = `${newLoc.pathname}${newLoc.search}`
    }
  })
  return [() => currentUrl, unsubscribe]
}

// match react routes
const matchRoutes = ({routes, location}) => new Promise((resolve, reject) => {
  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (error) {
      reject(error)
      return
    }
    resolve({redirectLocation, renderProps})
  })
})

const _renderComponents = (renderProps, store) => {
  return ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <RouterContext {...renderProps}/>
    </Provider>
  )
}

export default () => {
  return async (req, res, next) => {
    try {
      const history = createMemoryHistory()
      const routes = createRoutes(history)
      const location = history.createLocation(req.url)
      const route = await matchRoutes({routes, location})

      const {redirectLocation, renderProps} = route
      if (redirectLocation) {
        debug('301 redirect', `${redirectLocation.pathname}${redirectLocation.search}`)
        res.redirect(301, `${redirectLocation.pathname}${redirectLocation.search}`)
        return
      }
      if (renderProps) {
        const [getCurrentUrl, unsubscribe] = _subscribeUrl(history, location)
        const reqUrl = `${location.pathname}${location.search}`

        const store = configureStore({}, history)
        debug('inital store', store)

        const fetchData = _getFetchDataPromise(renderProps, store)
        debug('get fetchData:', fetchData)
        if (!fetchData) {
          debug('fetchData return is promise?')
          this.throw(500, 'please check your static function "fetchData" return is a promise?')
        }
        await fetchData

        if (getCurrentUrl() === reqUrl) {
          const reduxState = JSON.stringify(store.getState())
          debug('reduxState:', reduxState)
          const html = _renderComponents(renderProps, store)
          const head = Helmet.rewind()
          res.render('app', {html, reduxState, head})
        } else {
          debug('302 redirect', getCurrentUrl())
          res.redirect(302, getCurrentUrl())
        }
        unsubscribe()
      }
    } catch (error) {
      debug('error:', error)
      this.throw(500, error)
    }
  }
}
