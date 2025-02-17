import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import BookmarksContext from "../BookmarksContext";

const Home = () => {

    const {bookmarks, toggleBookmark} = useContext(BookmarksContext);

    const [searchText, setSearchText] = useState('');

    // On utilise un state pour garder nos données
    const [games, setGames] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();

        const apiKey = 'c3c1878e9e94469c9b55e140dccba935';
        const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURI(searchText)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {setGames(data.results)})
            .catch(() => {alert('Une erreur est survenue')})
    }

    return (
        <>{/*Un fragment doit être ajouté pour ne retourner qu'un seul composant*/}
        <form className="my-2 sm:w-full md:w:2/3 mx-auto fle px-2 text-2xl" onSubmit={handleSearch}>
            <input type="text" className="form-control" autoFocus={true} onInput={e => {setSearchText(e.target.value)}} value={searchText} placeholder="Rechercher" />
            <button type="submit" className="bg-blue-700 rouded-r text-white px-4 py-2">Rechercher</button>
        </form>
        {/*Ajoutons notre liste*/}
        <button><Link to={'/bookmarks'}>Mes Favoris</Link></button>
        <br></br>
        <button><Link to={'/myShop'}>My Shop</Link></button>
        <ul className="sm:w-full md:w-2/3 mx-auto px-2 text-2xl">
            {games.map(game => (
                <li className="py-2 px-4 border-b border-gray-500 flex" key={game.id}>
                    <Link to={`/details/${game.slug}`} className='flex'>
                        <img src={game.background_image} alt="" className="w-50 pr-2" />
                        <div className="text-2xl font-bold flex-grow">{game.name}</div>
                        <div>{game.rating}</div>
                    </Link>
                    <button onClick={() => {toggleBookmark(game)}}>{bookmarks.some(bookmarks => bookmarks.name === game.name) ? '★' : '☆'}</button>
                </li>
            ))}
        </ul>
        </>
    );
}

export default Home;