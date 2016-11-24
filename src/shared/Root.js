import React from 'react'
import { Router, browserHistory } from 'react-router'
import { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import getRoutes from 'shared/routes'
import createApolloClient from 'shared/createApolloClient'
import createStore from 'shared/store/createStore'
import { syncHistoryWithStore } from 'react-router-redux'
import config from 'shared/configs'

const client = createApolloClient({
  networkInterface: createNetworkInterface({
    uri: `http://${config.host}:${config.port}/graphql`,
    opts: {
      credentials: 'same-origin',
    },
    transportBatching: true,
  }),
})

const store = createStore(client, history, window.__APOLLO_STATE__)
const history = syncHistoryWithStore(browserHistory, store)
const routes = getRoutes(store)

const Root = () => {
  return (
    <ApolloProvider store={store} client={client}>
      <Router
        history={history}
        routes={routes}
      />
    </ApolloProvider>
  )
}

export default Root
