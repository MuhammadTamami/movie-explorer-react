// import { useEffect, useState } from "react";
// import { getFavorites } from "../utils/favorites";
import ShowCard from "../components/ShowCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
    // const [favorites, setFavorites] = useState([]);

    const {favorites} = useFavorites();

    // useEffect(() => {
    //     setFavorites(getFavorites());
    // }, []);

    // if (!favorites.length) {
    //     return (
    //         <main className="section">
    //             <h1>Favorites</h1>
    //             <p>No favorites yet.</p>
    //         </main>
    //     );
    // }

    return (
        <main className="section">
            <h1>Favorites</h1>
            <div className="grid">
                {favorites.map((show) => (
                    <ShowCard key={show.id} show={show}></ShowCard>
                ))}
            </div>
        </main>
    )
    // return <main className="section"><h1 className="h1">Favorites</h1></main>
}