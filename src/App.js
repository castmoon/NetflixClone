import React, { useState, useEffect } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import "./App.css"
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

function App() {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() =>{
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeatureData(chosenInfo);
    }
    loadAll();
  }, []);

  useEffect(() => {
    const ScrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      }
      else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', ScrollListener);

    return () => {
      window.removeEventListeener('scroll', ScrollListener);
    }
  }, []);

  return(
      <div className="page">
        <Header black ={blackHeader}/>
        {featureData &&
          <FeaturedMovie item={featureData}/>
        }     
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key ={key} title ={item.title} items={item.items}/>
        ))}
      </section>
      <footer>
        Feito com <span role="img" arial-label="coração">💓</span> por Guilherme Martins<br/>
        Direitos de imagem para Netflix <br/>
        Dados fornecidos pelo site Themoviedb.org
      </footer>
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="carregando"/>
      </div>
      }
    </div>
  );
}

export default App;