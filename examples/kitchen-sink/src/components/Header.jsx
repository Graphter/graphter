import React, {useState} from 'react';
import s from './Header.pcss';
import logo from '../assets/logo.svg';
import search from '../assets/search.svg';
import searchExit from '../assets/search-exit.svg';
import cs from 'classnames';

export default function Header({ }) {
  const [ searchOpen, setSearchOpen ] = useState(false);
  return (
    <header className={cs(s.header, { [s.expanded]: searchOpen })}>
      <div className={s.headerContent}>
        <div className={s.logo}>
          <h1 className={s.text}><img src={logo} alt='Graphter' /><span className={s.logoText}> graphter</span></h1>
        </div>

        <div className={s.searchInputContainer}>
          <input
            type='text'
            placeholder='search everything'
            className={s.searchInput}
            onFocus={() => {
              setSearchOpen(true);
              document.body.style.overflow = "hidden";
            }}/>
          <button type='submit' className={s.searchButton}><img src={search} alt='search' /></button>
        </div>

        {searchOpen && <button
          className={s.searchExit}
          onClick={() => {
            setSearchOpen(false);
            document.body.style.overflow = "initial";
          }}><img src={searchExit} alt='exit search' /></button>}


      </div>
      <div className={s.searchResults}>
        <ul>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
          <li>hi</li>
        </ul>
      </div>

    </header>
  );
}