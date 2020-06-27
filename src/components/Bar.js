import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Group from '@material-ui/icons/Group'

const TITLE = 'Um web app simples usando React.js'
const db = {
    set: function(k,o){localStorage.setItem(k, JSON.stringify(o))},
    get: function(k){return JSON.parse(localStorage.getItem(k))},
    del: function(k){localStorage.removeItem(k)}
}

db.set('form',{})
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
   list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}))

export default (props) => {
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [checked, setCheck] = useState(true)
	
	
	const toggleDrawer = open => event => {
	    if(event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift'))
			return
	    setOpen(open)
	}
	const handleChange = e => {
		setCheck(e.target.checked)
		props.setSource(e.target.checked)
	}
	const page = {
		form: () => props.setPage('form'), 
		list: () => props.setPage('list'), 
	}
	
	const list = () => (
	    <div
	      className='left'
	      role="presentation"
	      onClick={toggleDrawer(false)}
	      onKeyDown={toggleDrawer(false)}>
      		
      		<List className={classes.list}>
        		<ListItem button onClick={page.form} key="Cadastrar">
          			<ListItemIcon><PersonAdd/></ListItemIcon>
                	<ListItemText primary="Cadastrar" />
        		</ListItem>
        		<ListItem button onClick={page.list} key="Clientes">
          			<ListItemIcon><Group /></ListItemIcon>
                	<ListItemText primary="Clientes" />
        		</ListItem>
      		</List>
    	</div>
  	)

  	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton 
					 onClick={toggleDrawer(true)} 
					 edge="start" 
					 className={classes.menuButton} 
					 color="inherit" 
					 aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{ TITLE }
					</Typography>

					  <Switch
				        onChange={handleChange}
				        name="checkedA"
				        checked={checked}
				        title='fetch API / localStorage'
				        inputProps={{ 'aria-label': 'secondary checkbox' }}
				      />
			</Toolbar>
		</AppBar>
			<Drawer anchor='left' open={open} onClose={toggleDrawer(false)}>
				{ list() }
			</Drawer>
		</div>
  	)
}