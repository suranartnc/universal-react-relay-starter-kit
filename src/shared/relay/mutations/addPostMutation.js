import Relay from 'react-relay'

class AddPostMutation extends Relay.Mutation {

  // which mutation to use ?
  getMutation() {
    return Relay.QL`
      mutation { addPost }
    `
  }

  // prepare variables used as input to the mutation
  getVariables() {
    return {
      title: this.props.title,
      body: this.props.body,
      // userId: this.props.viewerId,
      userId: "5805c26198f0370001ac64a3", // use mock userId first
    }
  }

  // define payload - every fields in your data model that could change as a result of the mutation
  getFatQuery() {
    return Relay.QL`
      fragment on AddPostPayload {
        postEdge,
        viewer {
          posts
        }
      }
    `
  }

  // how the payload interact with relay store ?
  /*
     Mutator configuration
     - FIELDS_CHANGE
     - NODE_DELETE
     - RANGE_ADD
     - RANGE_DELETE
     - REQUIRED_CHILDREN
  */
  getConfigs() {
    console.log('viewerId', this.props.viewerId)
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewerId,
      connectionName: 'posts',
      edgeName: 'postEdge',
      rangeBehaviors: {
        '': 'append',
        // 'orderby(newest)': 'prepend',
      },
    }]
  }

  getOptimisticResponse() {
    return {
      postEdge: {
        node: {
          title: this.props.title,
          body: this.props.body,
        },
      },
      viewer: {
        id: this.props.viewerId,
      },
    }
  }
}

export default AddPostMutation
