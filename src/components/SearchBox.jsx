import React, { useState, useEffect, useRef } from "react";

const SearchBox = ({ setResults }) => {
  const [inputValue, setInputValue] = useState(""); // State to manage input value
  const inputRef = useRef(null); // Ref for the input element

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "/" && inputRef.current) {
        event.preventDefault(); // Prevent "/" from being typed into the input
        inputRef.current.focus(); // Focus on the input element
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Empty dependency array to run this effect only once

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${inputValue}&pharmacyIds=1,2,3`
      );
      const results = await response.json();

      console.log(results);
      setResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="flex items-center search">
      <form
        className="border rounded-full form border-gray-300 px-4 py-2 mt-8 flex"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef} // Assign the ref to the input element
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your medicine here"
          className="flex-1 px-4 border-none focus:outline-none"
        />
        <button
          type="submit"
          className="py-2 px-4 rounded-full focus:outline-none"
        >
          Search
        </button>
      </form>

      <hr className="w-full mt-11 border-t border-gray-300" />
    </div>
  );
};

export default SearchBox;
