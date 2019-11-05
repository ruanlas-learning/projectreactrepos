import React, {useState, useCallback, useEffect} from 'react';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import {Container, Form, SubmitButton, List, DeleteButton} from './styles';

import api from '../../services/api';

export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    function handleInputChange(event){
        setNewRepo(event.target.value);
        setAlert(null);
    }

    //Buscar (ComponentDidMount)
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');
        
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
    }, []);

    //salvar alterações (ComponentDidUpdate)
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        // console.log(newRepo);
        async function submit(){
            setLoading(true);
            setAlert(null);
            try{

                if(newRepo === ''){
                    throw new Error('Você precisa indicar um repositório!');
                }

                const response = await api.get(`repos/${newRepo}`);
                // console.log(response.data);
                const hasRepo = repositorios.find( repo => repo.name === newRepo );

                if(hasRepo){
                    throw new Error('Repositorio Duplicado');
                }

                const data = {
                    name: response.data.full_name,
                };
    
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            }catch(error){
                setAlert(true);
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

        submit();
    }, [newRepo, repositorios]);

    const handleDelete = useCallback((repositorio) => {
        const find = repositorios.filter( (rep) => rep.name !== repositorio );
        setRepositorios(find);
    }, [repositorios]);

    return(
        <Container>
            <h1> 
                <FaGithub size={25}/>
                Meus Repositórios
            </h1>

            <Form onSubmit={ handleSubmit } error={alert}>
                <input type="text" placeholder="Adicionar Repositorios" 
                    value={newRepo} onChange={handleInputChange} />

                <SubmitButton loading={ loading ? 1 : 0 }>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14}/>
                    ) : (
                        <FaPlus color="#FFF" size={14}/>
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repositorio => {
                    return(
                        <li key={repositorio.name}>
                            <span>
                                <DeleteButton onClick={ () => handleDelete(repositorio.name) }>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repositorio.name}
                            </span>
                            <a href="">
                                <FaBars size={20}/>
                            </a>
                        </li>
                    );
                })}
            </List>
        </Container>
    );
}