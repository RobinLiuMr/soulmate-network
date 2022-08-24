import { useState, useEffect } from "react";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // get recent users
    useEffect(() => {
        fetch("/api/users/recent?limit=3")
            .then((response) => response.json())
            .then((data) => {
                setRecentUsers(data);
            });
    }, []);

    // search term
    useEffect(() => {
        if (searchTerm.length < 2) {
            return;
        }
        fetch(`/api/users/search?q=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            });
    }, [searchTerm]);

    function onSearch(event) {
        setSearchTerm(event.target.value);
    }

    return (
        <section className="find_people">
            <h2>Find People</h2>
            <section className="recent_users">
                <h3>Who is new?</h3>
                <ul>
                    {recentUsers.map((user) => {
                        return (
                            <li key={user.id}>
                                <a href={"/users/" + user.id}>
                                    <img src={user.profile_picture_url}></img>
                                    {user.first_name} {user.last_name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <section className="search_results">
                <h3>Looking for someone in particular?</h3>
                <p>
                    <input
                        onChange={onSearch}
                        defaultValue={searchTerm}
                        placeholder="Search for users"
                    ></input>
                </p>
                <ul>
                    {searchResults.map((user) => (
                        <li key={user.id}>
                            <img src={user.profile_picture_url}></img>
                            {user.first_name} {user.last_name}
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
