import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';

const Details = () => {
    const {slug} = useParams();
    const [game, setGame] = useState();

    useEffect(() => {

        const apiKey = 'c3c1878e9e94469c9b55e140dccba935';
        const url = `https://api.rawg.io/api/games/${slug}?key=${apiKey}`;
       
        fetch(url)
            .then(response => response.json())
            .then(data => { console.log(data), setGame(data)})
            .catch(() => {alert(`Une erreur est survenue`)})
    }, []);

    return (
        <div>
            {game ? (
                <div>
                    <h1>{game.name}</h1>
                    <br></br>
                    <p>{game.description_raw}</p>
                    <br></br>
                    <img src={game.background_image} alt="" className="w-500 pr-2"/>
                </div>
            ) : (
                <p>Chargement...</p>  // Message de chargement si le jeu n'est pas encore chargé
            )}
        </div>
    );
}

export default Details;