import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function ShowCard({ show }) {

    const { toggleFavorite, isFavorite } = useFavorites();
    const favorite = isFavorite(show.id);

    return (
        <div className="card">

            <div className="card-image">

                <Link to={`/detail/${show.id}`}>

                    {show.image?.medium ? (
                        <img src={show.image.medium} alt={show.name} />
                    ) : (
                        <div className="no-image">No Image</div>
                    )}

                    <div className="card-overlay">

                        <div className="overlay-rating">
                            ⭐ {show.rating?.average ?? "-"}
                        </div>

                        <div className="overlay-info">
                            <h4>{show.name}</h4>
                            <p>{show.genres?.slice(0, 2).join(" • ")}</p>
                            <span className="view-btn">▶ View</span>
                        </div>

                    </div>

                </Link>

            </div>

            <div className="card-body">

                <h3>{show.name}</h3>

                <p>
                    {show.premiered?.slice(0, 4) || "-"} • Rating:{" "}
                    {show.rating?.average ?? "-"}
                </p>

                <button
                    onClick={() => toggleFavorite(show)}
                    className={favorite ? "heart active" : "heart"}
                >
                    {favorite ? "❤️ Favorite" : "🤍 Favorite"}
                </button>

            </div>

        </div>
    );
}