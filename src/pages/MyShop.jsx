import React, { useState, useEffect } from "react";
import haversine from "../../geoLoc/haversine";

const Myshop = () => {
    
    const [distanceMagasin, setDistanceMagasin] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const myLat = position.coords.latitude;
                const myLong = position.coords.longitude;
                const myCoord = { latitude: myLat, longitude: myLong };

                fetch("https://formacitron.github.io/shopslist/shops.json")
                    .then((response) => {
                        if (!response.ok) {
                            console.error("Erreur de la requête:", response);
                            return false;
                        }
                        return response.json();
                    })
                    .then((data) => {
                        let magasinProche = { 
                            distance: Infinity, 
                            magasin: "",
                        };

                        for (const magasin of data) {
                            let coords = { 
                                latitude: magasin.gps_lat,
                                longitude: magasin.gps_lng
                            };
                            
                            let distance = haversine(myCoord, coords);

                            if (distance < magasinProche.distance) {
                                magasinProche = {
                                    distance: distance,
                                    magasin: magasin.name,
                                };
                            }
                        }
                        magasinProche.distance = magasinProche.distance/1000; // Convertir en Km

                        setDistanceMagasin(magasinProche);
                    })
            },
            (error) => {
                console.error("Erreur de géolocalisation:", error.message)
            }
        );
    }, []);

    return (
        <>
        <div>
            <h1>Magasin le plus proche</h1>
            {distanceMagasin ? (
                <p>
                    {distanceMagasin.magasin} à {distanceMagasin.distance.toFixed(2)} Km
                </p>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
        </>
    );
};

export default Myshop;