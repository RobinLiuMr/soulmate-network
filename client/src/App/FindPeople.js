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
        <section className="find_people flex justify-around">
            <section className="recent_users">
                <h3 className="text-lg text-teal-600">Who is new?</h3>
                <ul className="mt-4 flex flex-col gap-4">
                    {recentUsers.map((user) => {
                        return (
                            <li key={user.id}>
                                <a href={"/users/" + user.id}>
                                    <img
                                        src={
                                            user.profile_picture_url ||
                                            "https://via.placeholder.com/264x280.jpg?text=avatar"
                                        }
                                    ></img>
                                    <p className="text-center">
                                        {user.first_name} {user.last_name}
                                    </p>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <section className="search_results">
                <h3 className="text-lg text-teal-600">
                    Looking for someone in particular?
                </h3>
                <p>
                    <input
                        className="mt-4 w-full border-2 border-gray-500"
                        onChange={onSearch}
                        defaultValue={searchTerm}
                        placeholder="Input name"
                    ></input>
                </p>
                <ul className="mt-4 flex flex-col gap-4">
                    {searchResults.map((user) => (
                        <li key={user.id}>
                            <a href={"/users/" + user.id}>
                                <img
                                    src={
                                        user.profile_picture_url ||
                                        "https://via.placeholder.com/264x280.jpg?text=avatar"
                                    }
                                ></img>
                                <p className="text-center">
                                    {user.first_name} {user.last_name}
                                </p>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
