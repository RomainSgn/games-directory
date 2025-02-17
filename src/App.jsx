import React, { useEffect, useState, useRef } from 'react'
import './App.css'
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorMessage from './pages/ErrorMessage';
import Details from './pages/Details';
import BookmarksContext from './BookmarksContext';
import Bookmarks from './pages/Bookmarks';
import Myshop from './pages/MyShop';

function App() {

  // Etat pour générer l'affichage du bouton d'installation
  const [canInstall, setCanInstall] = useState(false);
  // Référence pour stocker l'événement d'installation
  const deferredPrompt = useRef(null);

  useEffect(() => {
    // Fonction appelée quand l'application peut être installée 
    const handleBeforeInstallPrompt = (e) => {
      // Empêche l'affichage automatique du prompt
      e.preventDefault();
      // Stocke l'évenement pour une utilisation ultérieure
      deferredPrompt.current = e;
      // Affiche notre bouton d'installation
      setCanInstall(true);
    };

    // Ecoute l'évenement d'installation
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Fonction appelée quand l'utilisateur clique sur le bouton d'installation
  const handleInstallClick = async () => {
    if (!deferredPrompt.current) {
      return;
    }

    // Affiche le prompt d'installation natif
    const result = await deferredPrompt.current.prompt();
    console.log(`Installation ${result.outcome}`);
    // Réinstalle l'état
    deferredPrompt.current = null;
    setCanInstall(false);
  };

  // A chaque fois qu'une donnée à un impact sur une interface graphique, il faut utiliser "useState()"
  const [bookmarks, setBookmarks] = useState([]);

  // Création du routeur
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      errorElement: <ErrorMessage/>,
    },
    {
      path: "/details/:slug",
      element: <Details/>,
    },
    {
      path: "/bookmarks",
      element: <Bookmarks />,
    },
    {
      path: "/myShop",
      element: <Myshop />,
    },
  ], {basename: "/games-directory"}) // Même valeur que dans vite.config.js

  const toggleBookmark = (game) => {
    if (bookmarks.some(bookmarks => bookmarks.name === game.name)){
      deleteBookmarks(game); // Supprime le jeu
    } else {
      addBookmarks(game); // Ajoute le jeu
    }
  };

  const addBookmarks = (game) => {
    const tmpBookmarks = [...bookmarks]; // On crée une copie de bookmarks
    tmpBookmarks.push(game); // On ajoute 1 entrée dans le tableau
    setBookmarks(tmpBookmarks); // On met à jour le state avec le nouveau tableau
  };

  const deleteBookmarks = (index) => {
    const tmpBookmarks = [...bookmarks]; // On crée une copie de bookmarks
    tmpBookmarks.splice(index,1); // On supprime 1 entrée à partir de l'index
    setBookmarks(tmpBookmarks); // On met à jour le state avec le nouveau tableau
  };

  const [dataLoaded, setDataLoaded] = useState(false);
  // Permet de stocker les données dans le navigateur
  // Ici, `useEffect` est utilisé pour sauvegarder les données de `bookmarks` dans le stockage local du navigateur chaque fois que `bookmarks` change. Le tableau de dépendances `[bookmarks]` indique à React que l'effet doit s'exécuter chaque fois que la valeur de `bookmarks` est modifiée.
  useEffect(() => {
    if(dataLoaded) {
      console.log("Sauvegarde: ", bookmarks)
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  // Utiliser useEffect avec un tableau vide en second argument permet d'exécuter le code une seule fois au démarrage du composant. Cela est utile pour les opérations d'initialisation qui ne doivent se produire qu'une seule fois, comme la récupération de données ou la configuration initiale.
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(savedBookmarks);
    console.log("Chargement: ", savedBookmarks);
    setDataLoaded(true);
  }, []);

  return (
    <BookmarksContext.Provider value={{bookmarks, setBookmarks, toggleBookmark, addBookmarks, deleteBookmarks}}>
      {/* Affiche le bouton d'installation si disponible */}
      {canInstall && (
        <div className='bg-gray-300 shadow-gray-700 p-4 flex items-center'>
          <div className='flex-grow text-center'>
            Voulez-vous intaller l'application sur votre appareil ? 
          </div>
          <button className='px-4 py-2 rounded text-white bg-teal-600' onClick={handleInstallClick}>Installer</button>
        </div>
      )}
      <RouterProvider router={router}></RouterProvider>
    </BookmarksContext.Provider>
  );
}

export default App
