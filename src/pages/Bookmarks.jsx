import React, { useContext } from "react";
import BookmarksContext from "../BookmarksContext";

const Bookmarks = () => {

    const {bookmarks, deleteBookmarks} = useContext(BookmarksContext);

    return (
        <>
            <ul className="sm:w-full md:w-2/3 mx-auto px-2 text-2xl">
                {bookmarks.map((bookmark, index) => (
                    <li className="py-2 px-4 border-b border-gray-500" key={index}>
                        <img src={bookmark.background_image} alt='' className="w-250 pr-2"></img>
                        <p>{bookmark.name} <button onClick={() => {deleteBookmarks(index)}}>🗑</button></p> 
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Bookmarks;
