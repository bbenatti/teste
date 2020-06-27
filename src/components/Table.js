import React, { useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal';

const db = {
    set: function(k,o){localStorage.setItem(k, JSON.stringify(o))},
    get: function(k){return JSON.parse(localStorage.getItem(k))},
    del: function(k){localStorage.removeItem(k)}
}

const StyledTableCell = withStyles( theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const StyledTableRow = withStyles( theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow)

function getModalStyle() {
  const top = 50
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles( theme => ({
  table: {
    minWidth: 700,
  },
  paper: {
    position: 'absolute',
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
 	top: '50%',
    left: '50%',
    transform: 'translate(-50%, -$50%)',
}}))


export default function CustomTable(props) {
	const classes = useStyles()
	const [userState,setUser] = useState({})
 	const [openState, setOpen] = useState(false)
 	const [modalStyle] = useState(getModalStyle())

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	var users = props.data.length ? props.data : []
	if(props.isUserInput)
		users = db.get('users') || []
	
	const onClick = (e) => {
		const userId = e.target.getAttribute('data-id')||0
		const user = users.filter(user => user.id == userId )[0]
		setUser(user)
		handleOpen()
	}

	const getUser = () =>{
		if(!userState.hasOwnProperty('nome')&&!userState.hasOwnProperty('name'))
			return (<span></span>)
		if(props.isUserInput){
			return (
				<div>
					<p><b>Nome:</b> {userState.nome + ' ' + useState.sobrenome} </p>
					<p><b>E-mail:</b> {userState.email||''} </p>
					<p><b>Telefone:</b> {userState.telefone||''} </p>
					<p><b>CEP:</b> {userState.cep||''} </p>
					<p><b>Endereço:</b> {userState.endereco1||''} </p>
					<p><b>CPF:</b> {userState.cpf||''} </p>
					<p><b>Data de Nascimento:</b> {(userState.nascimento)||''} </p>
					<p><b>Renda:</b> {userState.renda||''} </p>
				</div>
			)
		}else return(
			<div>
				<p><b>Nome:</b> {userState.name + ' ' + useState.sobrenome} </p>
				<p><b>E-mail:</b> {userState.email||''} </p>
				<p><b>Telefone:</b> {userState.phone||''} </p>
				<p><b>CEP:</b> {userState.address.zipcode||''} </p>
				<p><b>Endereço:</b> {userState.address.street||''} </p>
			</div>)
	}

	const getCells = (isUserInput) => {
		if(!isUserInput){
			return user => {
 				if(!user.name) return
			return (
				<StyledTableRow key={user.name} onClick={onClick} title={ 'Abrir cadastro de ' + user.name }>
				<StyledTableCell component="th" scope="row" data-id={user.id}>
				{user.name}
				</StyledTableCell>
					<StyledTableCell data-id={user.id} align="center">{user.email}</StyledTableCell>
					<StyledTableCell data-id={user.id} align="center">{user.phone}</StyledTableCell>
					<StyledTableCell data-id={user.id} align="center">{user.address.street}</StyledTableCell>
				</StyledTableRow>
		  	)
			}
		}

		return user => {
 				if(!user.nome) return
			return (
			<StyledTableRow key={user.nome} onClick={onClick} title={ 'Abrir cadastro de ' + user.nome }>
				<StyledTableCell component="th" scope="row" data-id={user.id}>
				{user.nome}
				</StyledTableCell>
					<StyledTableCell data-id={user.id} align="center">{user.email}</StyledTableCell>
					<StyledTableCell data-id={user.id} align="center">{user.telefone}</StyledTableCell>
					<StyledTableCell data-id={user.id} align="center">{user.endereco1}</StyledTableCell>
				</StyledTableRow>
			)
		}
	}
	const table = body => (
		<div>
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="customized table">
			  	<TableHead>
					<TableRow>
						<StyledTableCell>Nome</StyledTableCell>
						<StyledTableCell align="center">E-mail</StyledTableCell>
						<StyledTableCell align="center">Telefone</StyledTableCell>
						<StyledTableCell align="center">Endereço</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>{body}</TableBody>
			</Table>
			
		</TableContainer>
		<Modal
	        open={openState}
	        onClose={handleClose}
	        aria-labelledby="simple-modal-title"
	        aria-describedby="simple-modal-description">
    		<div style={modalStyle} className={classes.paper}>
	        {getUser()}
    		</div>
	      </Modal>
		</div>
	)

  	return table(users.map(getCells(props.isUserInput)))
}
