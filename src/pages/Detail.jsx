import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShow } from "../api/tvmaze";
import { useFavorites } from "../context/FavoritesContext";
// import useLocalStorage from "../hooks/useLocalStorage";

function renderStars(rating) {
    const stars = Math.round(rating / 2)
    return "⭐".repeat(stars)
}

export default function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const [favorites, setFavorites] = useLocalStorage("favorites", []);

    const { toggleFavorite, isFavorite } = useFavorites();

    const [cast, setCast] = useState([])

    useEffect(() => {
        async function fetchDetail() {
            try {
                setLoading(true);
                setError(null);

                const showData = await getShow(id);
                setShow(showData);

                const res = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
                const castData = await res.json();
                setCast(castData);

            } catch (err) {
                setError("Failed to load show");
            } finally {
                setLoading(false);
            }
        }

        fetchDetail();
    }, [id]);

    if (loading)
        return <main className="section">
            <p>Loading...</p>
        </main>

    if (error)
        return <main className="section">
            <p>{error}</p>
        </main>

    if (!show)
        return <main className="section">
            <p>Not Found...</p>
        </main>

    // const isFav = favorites.some((item) => item.id === show.id);
    const fav = isFavorite(show.id);

    // const handleToggle = () => {
    //     if (isFav) {
    //         setFavorites(favorites.filter((item) => item.id !== show.id))
    //     } else {
    //         setFavorites([...favorites, show]);
    //     }
    // }

    return (
        <main className="section">

            <button className="back-btn" onClick={() => navigate(-1)}>
                🔙 Back
            </button>

            <div className="detail-container">

                <div className="detail-poster">
                    <img
                        src={show.image?.original || show.image?.medium}
                        alt={show.name}
                    />
                </div>

                <div className="detail-content">

                    <h1>{show.name}</h1>

                    <button
                        className="favorite-btn"
                        onClick={() => toggleFavorite(show)}
                    >
                        {fav ? "❤️ Remove from favorites" : "🤍 Add to favorites"}
                    </button>

                    <div className="detail-meta">
                        <p><strong>Premiered:</strong> {show.premiered || "-"}</p>
                        <p>
                            <strong>Rating:</strong>
                            {show.rating?.average ?? "-"}
                            {show.rating?.average && ` (${renderStars(show.rating.average)})`}
                        </p>
                        <p><strong>Genres:</strong></p>
                        <div className="detail-genres">
                            {show.genres?.map((g) => (
                                <span key={g} className="genre-badge">{g}</span>
                            ))}
                        </div>
                        <p><strong>Status:</strong> {show.status}</p>
                        <p><strong>Network:</strong> {show.network?.name || "-"}</p>
                        <p><strong>Language:</strong> {show.language}</p>
                        <p><strong>Runtime:</strong> {show.runtime ? `${show.runtime} min` : "-"}</p>
                        {show.officialSite && (
                            <a
                                href={show.officialSite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="official-btn"
                            >
                                🌐 Official Website
                            </a>
                        )}
                    </div>

                    <div
                        className="detail-summary"
                        dangerouslySetInnerHTML={{
                            __html: show.summary || "No summary available"
                        }}
                    />

                    <div className="detail-trailer">

                        <h2>Trailer</h2>

                        <a
                            className="trailer-btn"
                            href={`https://www.youtube.com/results?search_query=${show.name}+trailer`}
                            target="_blank"
                        >
                            ▶ Watch Trailer on YouTube
                        </a>

                    </div>

                    <h2>Cast</h2>

                    <div className="cast-grid">
                        {cast.slice(0, 10).map((c) => (
                            <div key={c.person.id} className="cast-card">
                                <img
                                    src={c.person.image?.medium || "https://via.placeholder.com/150"}
                                    alt={c.person.name}
                                />
                                <p className="actor-name">{c.person.name}</p>
                                <p className="character-name">as {c.character.name}</p>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </main>
    )
    // return <main className="section"><h1 className="h1">Detail : {id}</h1></main>
}