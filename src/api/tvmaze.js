export async function searchShows(query) {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await res.json();
    return data;
}

export async function getShow(id) {
    const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
    if (!res.ok) throw new Error("Failed to fetch show")
    return await res.json();
}

