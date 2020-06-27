import React, { useState } from 'react'
import Container from '@material-ui/core/Container'

import Bar from './Bar'
import Table from './Table'
import Form from './Form'

const URL = 'https://jsonplaceholder.typicode.com/users'
const defaultPage = 'list'
const db = {
    set: function(k,o){localStorage.setItem(k, JSON.stringify(o))},
    get: function(k){return JSON.parse(localStorage.getItem(k))},
    del: function(k){localStorage.removeItem(k)}
}

export default (props) => {
	// returns array of objects to callback
	// could've error handling and proper module if needed 
	const api = (url, callback) => Promise.all([fetch(url).then(res => res.json()).then(callback)])[0] 
	db.set('fromMock', true)
	
	// hooks
	const [data,setDataState] = useState([])
	const [page,setPageState] = useState(defaultPage)
	const [source,setSourceState] = useState(true)
	api(URL, dataArray => {
		if(!data.length) // stops re-render loop
			setDataState(dataArray)
	})

	const getPage = page =>{
		if(page == 'list')
			return <Table isUserInput={source} data={data} />
		
		if(page == 'form') 
			return <Form setPage={ setPage } />
	}

	const setPage = page => {
		db.set('form',{})
		setPageState(page)
	}

	const setSource = source => {
		console.log(source)
		setSourceState(source)
	}
	return (
		<div>
			<Bar setSource={ setSource } setPage={ setPage } />
			<Container>
			{ getPage(page) }
			</Container>
		</div>
	)
}