import _ from 'lodash'
import { base64, unbase64 } from 'graphql-relay/lib/utils/base64'

function validateLimit(first, last) {
  if (!first && !last) {
    throw new Error('You must provide a `first` or `last` value to properly paginate the connection')
  }

  if (first && last) {
    throw new Error('Passing both `first` and `last` values to paginate the connection is not supported')
  }

  const maxLimit = 30
  const exceedMessage = _.template(`Requesting <%= limit %> records on the connection exceeds the <%= variableName %> limit of ${maxLimit} records`)

  if (first > maxLimit) {
    throw new Error(exceedMessage({
      limit: first,
      variableName: 'first',
    }))
  }

  if (last > maxLimit) {
    throw new Error(exceedMessage({
      limit: last,
      variableName: 'last',
    }))
  }
}

function encodeCursor(value) {
  return base64(`${value}`)
}

function decodeCursor(value) {
  return unbase64(value)
}

export default async function connectionFromMongooseModel(Model, args) {
  const {
    before,
    after,
    first,
    last,
    ...filter
  } = args

  validateLimit(first, last)

  if (before) {
    filter._id = {
      ...filter._id,
      $gt: decodeCursor(before),
    }
  }

  if (after) {
    filter._id = {
      ...filter._id,
      $lt: decodeCursor(after),
    }
  }

  const query = Model.find(filter)

  if (last) {
    const totalNodes = await Model.count(query)
    query.skip(last > totalNodes ? 0 : totalNodes - last)
  }

  if (first) {
    query.limit(first)
  }

  const nodes = await query.sort({ _id: -1 })

  const edges = nodes.map(node => ({
    node,
    cursor: encodeCursor(node._id),
  }))

  const pageInfo = {
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  }

  const startEdge = edges[0]
  const endEdge = edges[edges.length - 1]

  if (startEdge) {
    pageInfo.startCursor = startEdge.cursor

    const prevEdge = await Model.findOne({ _id: { $gt: startEdge.node._id } })
    pageInfo.hasPreviousPage = !!prevEdge
  }

  if (endEdge) {
    pageInfo.endCursor = endEdge.cursor

    const nextEdge = await Model.findOne({ _id: { $lt: endEdge.node._id } })
    pageInfo.hasNextPage = !!nextEdge
  }

  return {
    edges,
    pageInfo,
  }
}
