import { useEffect, useRef, useState } from "react";
import ShowCard from "../components/ShowCard";
import SkeletonCard from "../components/SkeletonCard";
import { getShow } from "../api/tvmaze";

export default function Discover() {

    const [page, setPage] = useState(() => Math.floor(Math.random() * 20));
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [genreFilter, setGenreFilter] = useState("all")
    const [ratingFilter, setRatingFilter] = useState("all")
    const [filteredShows, setFilteredShows] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);
    const heroShows = shows.slice(0, 5);
    const heroShow = heroShows[heroIndex];

    const [sortBy, setSortBy] = useState("relevance");

    const [fade, setFade] = useState(false);

    const loaderRef = useRef(null);

    useEffect(() => {
        if (heroShows.length === 0) return;

        const interval = setInterval(() => {

            setFade(true);
            setTimeout(() => {
                setHeroIndex((prev) => (prev + 1) % heroShows.length);
                setFade(false);
            }, 400);
        }, 5000);

        return () => clearInterval(interval);
    }, [heroShows]);


    useEffect(() => {

        setLoading(true);

        fetch(`https://api.tvmaze.com/shows?page=${page}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)

                setShows(prev => {
                    // const prevShows = Array.isArray(prev) ? prev : [];
                    // const newShows = Array.isArray(data) ? data : [];

                    const merged = [...prev, ...data];

                    const unique = merged.filter(
                        (show, index, self) =>
                            index === self.findIndex((s) => s.id === show.id)
                    );

                    return unique;
                });
            })
            .finally(() => setLoading(false));

    }, [page]);

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            if (entries[0].isIntersecting && !loading) {
                setPage(prev => prev + 1);
            }
        },
            { threshold: 1 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [loading]);

    useEffect(() => {

        let result = [...shows];

        if (ratingFilter !== "all") {
            result = result.filter((show) => (show.rating?.average ?? 0) >= Number(ratingFilter))
        }

        if (genreFilter !== "all") {
            result = result.filter((show) => show.genres?.includes(genreFilter))
        }

        if (sortBy === "relevance") {
            result.sort((a, b) => {

                const scoreA =
                    (a.rating?.average ?? 0) * 3 +
                    (genreFilter !== "all" && a.genres.includes(genreFilter) ? 5 : 0) +
                    (a.weight ?? 0) +
                    (a.premiered ? new Date(a.premiered).getFullYear() / 500 : 0);

                const scoreB =
                    (b.rating?.average ?? 0) * 3 +
                    (genreFilter !== "all" && b.genres.includes(genreFilter) ? 5 : 0) +
                    (b.weight ?? 0) +
                    (b.premiered ? new Date(b.premiered).getFullYear() / 500 : 0);

                return scoreB - scoreA;
            });
        }

        if (sortBy === "rating") {
            result.sort(
                (a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0)
            );
        }

        if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredShows(result);
    }, [ratingFilter, genreFilter, shows, sortBy])

    useEffect(() => {

        // Mengambil data genre
        const allGenres = [...new Set(shows.flatMap((show) => show.genres || [])
        )
        ];

        setGenres(allGenres)
    }, [shows]);
    // useEffect(() => {

    //     const handleScroll = () => {

    //         if (
    //             window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading
    //         ) {
    //             setPage(prev => prev + 1);
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    return (
        <main className="section">

            {heroShow && (
                <section className={`hero ${fade ? "fade-out" : "fade-in"}`}>
                    <img
                        src={heroShow.image?.original || heroShow.image?.medium}
                        alt={heroShow.name}
                        className="hero-bg"
                    />

                    <div className="hero-overlay">
                        <div className="hero-content">
                            <h2>{heroShow.name}</h2>

                            <p
                                dangerouslySetInnerHTML={{
                                    __html: heroShow.summary?.slice(0, 200) + "..."
                                }}
                            />

                            <div className="hero-meta">
                                ⭐ {heroShow.rating?.average ?? "-"}
                                {" • "}
                                {heroShow.genres?.join(", ")}
                            </div>
                            <div className="hero-dots">
                                {heroShows.map((_, i) => (
                                    <span
                                        key={i}
                                        className={i === heroIndex ? "dot active" : "dot"}
                                        onClick={() => setHeroIndex(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}


            <h1>Discover</h1>
            <div className="filters">

                <select value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}>
                    <option value="all">All Rating</option>
                    <option value="5">5+</option>
                    <option value="6">6+</option>
                    <option value="7">7+</option>
                    <option value="8">8+</option>
                </select>

                <select value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}>

                    <option value="all">All Genres</option>

                    {genres.map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rating</option>
                    <option value="name">A-Z</option>
                </select>
            </div>

            <div className="grid">
                {filteredShows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                ))}

                {loading && Array(8).fill().map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            <div ref={loaderRef} style={{ height: "50px" }}>
                {loading && <p>Loading...</p>}
            </div>

        </main>
    );
    // return <main className="section"><h1 className="h1">Discover</h1></main>
}