import React, {useState, useCallback} from 'react';
import {FaGithub, FaPlus} from 'react-icons/fa';
import {Container, Form, SubmitButton} from './styles';

import api from '../../services/api';

export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);

    function handleInputChange(event){
        setNewRepo(event.target.value);
    }

    const handleSubmit = useCallback((event) => {
        event.preventDefault();

        async function submit(){
            // console.log(newRepo);
            const response = await api.get(`repos/${newRepo}`);
            // console.log(response.data);
            const data = {
                name: response.data.full_name,
            };

            setRepositorios([...repositorios, data]);
            setNewRepo('');
        }

        submit();
    }, [newRepo, repositorios]);

    return(
        <Container>
            <h1> 
                <FaGithub size={25}/>
                Meus Repositórios
            </h1>

            <Form onSubmit={ handleSubmit }>
                <input type="text" placeholder="Adicionar Repositorios" 
                    value={newRepo} onChange={handleInputChange} />

                <SubmitButton>
                    <FaPlus color="#FFF" size={14}/>
                </SubmitButton>
            </Form>
        </Container>
    );
}