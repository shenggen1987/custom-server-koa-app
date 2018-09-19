import React from 'react'
import Link from 'next/link'
import { List } from 'antd-mobile'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

const Item = List.Item;
const Brief = Item.Brief;

// export default () => (
//   <ul>
//     <li><Link href='/b' as='/a'><a>a</a></Link></li>
//     <li><Link href='/a' as='/b'><a>b</a></Link></li>
//     <List renderHeader={() => 'Customized Right Side（Empty Content / Text / Image）'} className="my-list">
// 	    <Item>Title</Item>
// 	    <Item arrow="horizontal" onClick={() => {}}>Title</Item>
// 	    <Item extra="extra content" arrow="horizontal" onClick={() => {}}>Title</Item>
// 	    <Item extra="10:30" align="top" thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
// 	      Title <Brief>subtitle</Brief>
// 	    </Item>
// 	</List>
//   </ul>
// )

export default class Page extends React.Component {
  static async getInitialProps() {
    const res = await fetch('https://cnodejs.org/api/v1/topics')
    const json = await res.json()

    return { data: json.data }
  }

  render() {

    return (
      <div>
	    <List renderHeader={() => '一个ssr栗子'}>
	        
	        {this.props.data.map(item=>(
	        	<Item
		          arrow="horizontal"
		          thumb={item.author.avatar_url}
		          multipleLine
		          onClick={() => Router.push({
		          	  pathname: '/a',
					  query: { id: item.id }
					})
		      	  }
		          key={item.id}
		        >
		          {item.title} <Brief>{item.author.loginname}</Brief>
		        </Item>
        	))}
	     </List>
	  </div>
    )
  }
}
