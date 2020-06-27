import React, { useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

const api = (url, callback) => Promise.all([fetch(url).then(res => res.json()).then(callback)])[0] 
const getURL = cep => 'https://viacep.com.br/ws/'+cep+'/json/'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}))

const db = {
    set: function(k,o){localStorage.setItem(k, JSON.stringify(o))},
    get: function(k){return JSON.parse(localStorage.getItem(k))},
    del: function(k){localStorage.removeItem(k)}
}

db.set('form',{})

function validarCPF(cpf) {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	var rev = 0
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	var add = 0;	
	for (var i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}
export default (props) => {
	const classes = useStyles();

	const [cep,setCEP] = useState('')
	const [endereco,setEndereco] = useState('')
	const [currIdx, setIdx] = useState(0)

	const changeCEP = e => {
		var value = e.target.value
		const digits = value.replace(/\D/g, '')
		var target = e.target
		if(digits.length>5){
			const start = digits.slice(0,5)
			const end = digits.slice(5)
			value = [start,end].join('-')
		}

		if(value.length>9){
			value = value.slice(0,9)
		}

		if(value.length==9){
			api(getURL(digits), res => {
				if(res.erro){
					alert('CEP inválido!')
					value = ''
				}else{
					setEndereco(res.logradouro)
				}
				target.value = value

			})
		}
	}	

	const changePhone = e => {
		const isValid = number => {
			const digits = number.replace(/\D/g, '')
			return digits.length < 11 && number.length < 15 
		}
		var v =  e.target.value
			.replace(/\D/g,"")           
    		.replace(/(\d{2})(\d{8})/g,"($1) $2")
		
		if( v.length == 14 ){
			v = v.replace(/(\d{5})(\d{1,2})/, '$1-$2')

		}else if( v.length == 13 ){
			v = v.replace(/(\d{4})(\d{1,2})/, '$1-$2')
		}
		
		e.target.value = v

		if(!isValid(e.target.value)){
			e.target.value = e.target.value.slice(0,15)
			document.querySelector('#cep').focus()
			if(e.target.value.replace(/\D/g,'').length>11){
				const start = e.target.value.slice(0,-5)
				const end = e.target.value.slice(-5).slice(0,-1)
				e.target.value = [start,end].join('-')
			}
		}
	}

	const changeCPF = e => {
		const cpf  = e.target.value   
			.replace(/\D/g, '')
		    .replace(/(\d{3})(\d)/, '$1.$2') 
		    .replace(/(\d{3})(\d)/, '$1.$2')
		    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
		    .replace(/(-\d{2})\d+?$/, '$1') 

		e.target.value = cpf

		if(cpf.replace(/\D/g,'').length == 11 && !validarCPF(cpf))
			alert('CPF inválido!')

	}

	const changeEmail = e => {
		const value = e.target.value
		const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
	}

	const navigate = (groupFrom,groupTo,idx) => e => {
		const form = db.get('form')
		groupFrom.map(field => { 
			form[field]=document.querySelector('#'+field).value 
			document.querySelector('#'+field).value= ''
		})
		db.set('form',form)
		setIdx(idx)
		setTimeout(()=>{
			groupTo.map(field => {
			 	document.querySelector('#'+field).value = form[field] || ''
			})

			document.querySelector('#'+groupTo[0]).focus()
		})
	}

	const saveData = (group) => e => {
		const form = db.get('form')
		group.map(field => { 
			form[field]=document.querySelector('#'+field).value 
		})
		form['id'] = Math.round(Math.random() / .0001) 
		const users = db.get('users') || []
		users.push(form)
		db.set('users', users)
		alert('Cadastro criado com sucesso!')
		props.setPage('list')
	}

	const changeRenda = e => {
		const unformat = n => parseFloat(n.split('.').join('').replace('R$ ', '').replace(',','.'))
		const format = n => parseFloat(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
		const isCurrency = n => n.split('R$').length > 1
		//todo currency mask
	}

	const group = [
		['nome','sobrenome','email','telefone'],
		['cep','endereco1','endereco2'],
		['nascimento','cpf','renda']
	]

	const getGroup =()=> {
		if(currIdx == 0 ){
			return (<div>
			<TextField
				id="nome"
				label="Nome"
				type="text"
				className="nome"
				autoFocus={true}
				variant='outlined'
			/>
			<TextField
				id="sobrenome"
				label="Sobrenome"
				type="text"
				variant='outlined'
			/>

			<TextField
				id="email"
				label="E-mail"
				type="email"
				onChange={changeEmail}
				variant='outlined'
			/>

			<TextField
				id="telefone"
				label="Telefone"
				type="text"
				onChange={changePhone}
				variant='outlined'
			/>
			<Button 
			 variant="contained" 
			 color="primary" 
			 size="large"  
			 onClick={navigate(group[0],group[1],1)}>
			 	Próximo
			 </Button>
		</div>)}
		else if(currIdx == 1){
			return (<div>	
			<TextField
				id="cep"
				label="CEP"
				type="text"
				onChange={changeCEP}
				variant='outlined'
			/>
			<TextField
				id="endereco1"
				label="Endereço"
				type="text"
				value={endereco}
				InputLabelProps={{
			      shrink: true,
			    }}
				variant='outlined'
			/>

			<TextField
				id="endereco2"
				label="Endereço opcional"
				type="email"
				variant='outlined'
			/>
			<Button 
			 variant="contained" 
			 color="secondary" 
			 size="large" 
			 onClick={navigate(group[1],group[0],0)}>
			 	Voltar
			 </Button>
			<Button 
				variant="contained" 
				color="primary" 
				size="large" 
				onClick={navigate(group[1],group[2],2)}>
					Próximo
			</Button>
		</div>)}
		else if(currIdx==2){
			return (<div>
			<TextField
				id="nascimento"
				label="Data Nascimento"
				type="date"
				InputLabelProps={{
			      shrink: true,
			    }}
				variant='outlined'
			/>
			<TextField
				id="cpf"
				label="CPF"
				type="text"
				onChange={changeCPF}
				InputLabelProps={{
			      shrink: true,
			    }}
				variant='outlined'
			/>

			<TextField
				id="renda"
				label="Renda Mensal"
				type="text"
				onChange={changeRenda}
				variant='outlined'
			/>

			<Button
			 variant="contained" 
			 color="secondary" 
			 size="large"  
			 onClick={navigate(group[2],group[1],1)}>
			 	Voltar
			 </Button>
			<Button 
			 variant="contained" 
			 color="primary" 
			 size="large"  
			 onClick={saveData(group[2])}>
			 	Salvar
			 </Button>
		</div>)}
	}
	return (
		<form className={classes.root} noValidate autoComplete="off">
			<Paper style={{minHeight:200,maxWidth:600,margin: '0 auto'}} elevation={3}>
				{ getGroup() }		
			</Paper>		
		</form>
	)
}