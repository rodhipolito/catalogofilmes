import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import './App.css';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

const App = () => {

    const [movieList, setMovieList] = useState([]);
    const [FeaturedData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(true);

    // Funções para os botões assistir e minha lista
    const handleWatchButtonClick = () => {
        // Lógica para o botão assistir
        window.location.reload();
    };

    const handleMyListButtonClick = () => {
        // Lógica para o botão minha lista
        window.location.reload();
    };

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista Total 
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            // Pegando o featured
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        };

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        };

    }, []);

    // Desativando os warnings para as funções não utilizadas
    // eslint-disable-next-line no-unused-vars
    const unusedWatchButtonWarning = handleWatchButtonClick;
    // eslint-disable-next-line no-unused-vars
    const unusedMyListButtonWarning = handleMyListButtonClick;

    return (
        <div className="page">
            <Header black={blackHeader} />

            {FeaturedMovie &&
                <FeaturedMovie item={FeaturedData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>
            <footer>
                Feito com <span role="img" aria-label="coração">dedicação</span> por Rodrigo Silva<br />
                Direitos de imagem para Netflix<br />
                Dados pegos do site Themoviedb.org
           </footer>

            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif" alt="Carregando" />
                </div>
            }
        </div>
    );
}

export default App;
