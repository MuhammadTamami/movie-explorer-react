const KEY = "favorites";

export function getFavorites() {
    try {
        const data = localStorage.getItem(KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        console.error("Invalid favorites data. Resetting...");
        localStorage.removeItem(KEY);
        return [];  
    }
}

export function saveFavorites(favorites) {
    localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function toggleFavorite(show) {
    const favorites = getFavorites();
    const exists = favorites.find((item) => item.id === show.id);

    if(exists) {
        const updated = favorites.filter((item) => item.id !== show.id);
        saveFavorites(updated);
        return false;
    } else {
        const updated = [...favorites, show];
        saveFavorites(updated);
        return true;
    }
}

export function isFavorite(id) {
    const favorites = getFavorites();
    return favorites.some((item) => item.id === id);
}
