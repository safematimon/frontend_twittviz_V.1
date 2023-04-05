import './styles/App.scss';
import { useRef,useState,useEffect } from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import { Map } from './Map'
import { Home } from './Home'
import { Searchword } from './Searchword'
import MapIcon from './Icon/map-pointer-svgrepo-com.svg';
import WorldIcon from './Icon/global-svgrepo-com.svg';
import Logo from './Icon/icon.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import {  Layout } from 'antd';
import TwitterStream from './TwitterStream';
const { Content, Footer } = Layout;

function App() {
  const inputRef = useRef("")
  const Navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = inputRef.current.value.trim();
    if (searchValue) {
      const searchword = searchValue.replace(/[#]/g, "%23");
      Navigate(
        {
          pathname: 'search',
          search: `?q=${searchword}`
        },
        { state: searchword }
      );
      inputRef.current.value = '';
    }
  };

  return (
    <div className="App">
      <div className='navbar'>
          <img className='logo' src={Logo} alt="Logo" />
        <div className='menu'><Link to='/' className='menu-link'><img className='menu-icon' src={WorldIcon} alt="WorldIcon" />WORLD TREND </Link></div>
        <div className='menu'><Link to='/map' className='menu-link'><img className='menu-icon' src={MapIcon} alt="MapIcon" /> MAP </Link></div>
        <form className='form' onSubmit={handleSearch}>
          <input ref={inputRef} className='textInput' type='text' placeholder='Search'name="value"/>
          <button >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>
        <Layout>
          <Content className='content'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/map' element={<Map />}/>
            <Route path='/search' element={<Searchword />}/>
            <Route path='/stream' element={<TwitterStream />}/>
          </Routes>
          </Content>
        </Layout>
        <Footer className='footer'>TwittViz Web Application Twitter Visualization</Footer>
    </div>
  )
}

export default App; 