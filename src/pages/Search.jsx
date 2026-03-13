import { useState, useEffect } from "react"
import { searchShows } from "../api/tvmaze"
import ShowCard from "../components/ShowCard"
import { useSearchParams } from "react-router-dom";

export default function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") || ""
    const [shows, setShows] = useState([]);

    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query])

    useEffect(() => {
        async function fetchData() {
            if (!debouncedQuery) {
                setShows([])
                return;
            }
            const data = await searchShows(debouncedQuery)

            console.log("API RESULTS: ", data)
            const results = data.map(item => item.show)
            setShows(results)
        }

        fetchData();
    }, [debouncedQuery]);

    return (
        <main className="section">

            <h1 className="search-title">
                Results for "<span>{query}</span>"
            </h1>

            <p className="search-count">
                {shows.length} shows found
            </p>

            <div className="grid">
                {shows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                ))}
            </div>
        </main>
    )
}