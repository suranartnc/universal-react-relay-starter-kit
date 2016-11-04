import React, { PropTypes } from 'react'

import PostList from 'shared/components/Post/PostList/PostList'

function Homepage({ posts, addPost }) {
  return (
    <div>
      <PostList posts={posts} />
    </div>
  )
}

Homepage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
}

export default Homepage
