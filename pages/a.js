import React from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'


export default class Preact extends React.Component {
  static async getInitialProps (context) {
    // eslint-disable-next-line no-undef
    const { id } = context.query
    const res = await fetch('https://cnodejs.org/api/v1/topic/'+ id)
    const json = await res.json()
    return { data: json.data }
  }

  render () {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.data.content}}></div>
    )
  }
}
