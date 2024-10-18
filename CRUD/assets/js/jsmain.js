'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')    
}

const getLocalStorage = () => JSON.parse (localStorage.getItem('dbColaborador')) ?? []  //Usa o que tem no Banco de Dados, transforma em objeto(JSON) e armazena na variavél "db_colaborador"
const setLocalStorage = (dbColaborador) => localStorage.setItem("dbColaborador", JSON.stringify (dbColaborador)) //Acrescenta ao banco de dados, transformando o objeto em valor string
//Crud
//1-Create
const createColaborador = (colaborador) => {
    const dbColaborador = getLocalStorage()
    dbColaborador.push(colaborador) //acrescenta +1 colaborador através do paramêtro "colaborador"
    setLocalStorage(dbColaborador)
}
//Read
const readColaborador = () => getLocalStorage()
//Update
const updateColaborador = (index, colaborador) => {
    const dbColaborador = readColaborador()
    dbColaborador[index] = colaborador
    setLocalStorage(dbColaborador)
}
//Delete
const deleteColaborador = (index) => {
    const dbColaborador = readColaborador()
    dbColaborador.splice(index,1)
    setLocalStorage(dbColaborador)
}
//Validação
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field') //Traz todos os seletores que tem a classe "modal-fields"
    fields.forEach(field => field.value = "")  //Limpa todos os campos
}

const salveColaborador = () => {
    if (isValidFields()) {        //Verificação de Campos
        const colaborador = {     //Insere novo Colaborador
            nomecompleto: document.getElementById('nome').value,
            celular: document.getElementById('celular').value,
            matricula: document.getElementById('matricula').value,
            funcao: document.getElementById('funcao').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new'){
            createColaborador(colaborador) //Cria novo Colaborador
            updateTable()
            closeModal()
        } else {
            updateColaborador(index, colaborador)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (colaborador, index) => {  //cria cada linha da tabela
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${colaborador.nomecompleto}</td>
        <td>${colaborador.celular}</td>
        <td>${colaborador.matricula}</td>
        <td>${colaborador.funcao}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableColaborador>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableColaborador>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbColaborador = readColaborador()
    clearTable()  //ler o que está no banco de dados(local storage)
    dbColaborador.forEach(createRow)
}

const fillFields = (colaborador) => {
    document.getElementById('nome').value = colaborador.nomecompleto
    document.getElementById('celular').value = colaborador.celular
    document.getElementById('matricula').value = colaborador.matricula
    document.getElementById('funcao').value = colaborador.funcao
    document.getElementById('nome').dataset.index = colaborador.index
}

const editColaborador = (index) => {
    const colaborador =readColaborador()[index]
    colaborador.index = index
    fillFields(colaborador)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button'){

        const [action, index] = event.target.id.split('-')

        if (action == 'edit'){
            editColaborador(index)
        } else{
            const colaborador = readColaborador()[index]
            const response = confirm(`Deseja Realmente Excluir o Colaborador ${colaborador.nomecompleto} ?`)
            if (response){
            deleteColaborador(index)
            updateTable()
            }

        }
    }
}

updateTable()

//Eventos
document.getElementById('cadastrarColaborador')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', salveColaborador)
    
document.querySelector('#tableColaborador>tbody')
    .addEventListener('click', editDelete)
    
document.getElementById('cancelar')
    .addEventListener('click', closeModal)    