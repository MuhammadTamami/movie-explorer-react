import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const FavoritesContext = createContext();

export function FavoritesProvider ({ children }) {

    const [favorites, setFavorites] = useLocalStorage("favorites", []);

    const toggleFavorite = (show) => {
        const exists = favorites.some((item) => item.id === show.id);

        if(exists) {
            setFavorites(favorites.filter((item) => item.id !== show.id));
        } else {
            setFavorites([...favorites, show]);
        }
    };

    const isFavorite = (id) => {
        return favorites.some((item) => item.id === id);
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}