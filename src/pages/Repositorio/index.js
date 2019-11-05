import React, {useState, useEffect} from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './styles';
import api from '../../services/api';

// {decodeURIComponent(match.params.repositorio)}
export default function Repositorio({match}){

    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false},
    ]);
    const [filterIndex, setFilterIndex] = useState(0);

    useEffect(() => {

        async function load(){
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        // state: 'open',
                        state: filters.find( filter => filter.active ).state,
                        per_page: 5
                    }
                })
            ]);

            // console.log(repositorioData.data);
            // console.log(issuesData.data);
            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();
    }, []);

    function handlePage(action){
        setPage(action === 'back' ? (page - 1) : (page + 1));
    }

    useEffect(()=> {

        async function loadIssue(){
            const nomeRepo = decodeURIComponent(match.params.repositorio);
            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    // state: 'open',
                    state: filters[filterIndex].state,
                    per_page: 5,
                    page: page,
                }
            });

            setIssues(response.data);
        }

        loadIssue();
    }, [filterIndex, page]);

    function handleFilter(index){
        setFilterIndex(index);
    }

    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        );
    }

    return(
        <div>
            <Container>
                <BackButton to="/">
                    <FaArrowLeft color="#000" size={35}/>
                </BackButton>
                <Owner>
                    <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login} />
                    <h1>{repositorio.name}</h1>
                    <p>{repositorio.description}</p>
                </Owner>

                <FilterList active={filterIndex}>
                    {filters.map((filter, index) => {
                        return(
                            <button type="button" key={filter.label} onClick={() => handleFilter(index) }>
                                {filter.label}
                            </button>
                        );
                    })

                    }
                </FilterList>

                <IssuesList>
                    {issues.map(issue => {
                        return(
                            <li key={String(issue.id)}>
                                <img src={issue.user.avatar_url} alt={issue.user.login} />

                                <div>
                                    <strong>
                                        <a href={issue.html_url}>{issue.title}</a><br/>

                                        {issue.labels.map(label => {
                                            return(
                                                <span key={String(label.id)}>
                                                    {label.name}
                                                </span>
                                            );
                                        })}
                                    </strong>
                                    <p>{issue.user.login}</p>
                                </div>
                            </li>
                        );
                    })}
                </IssuesList>

                <PageActions>
                    <button type="button" onClick={()=> handlePage('back') } disabled={page < 2}>
                        Voltar
                    </button>
                    <button type="button" onClick={()=> handlePage('next') }>
                        Proxima
                    </button>
                </PageActions>
            </Container>
        </div>
    );
}