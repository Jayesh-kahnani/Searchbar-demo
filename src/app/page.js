// src/app/page.js
"use client"
import React, { useState } from "react";
import SearchBox from "@/components/SearchBox";
import SearchResults from "@/components/SearchResults";

const Page = () => {
  const [results, setResults] = useState("")

  return (
    <div className="flex flex-col mt-10 h-fit self-center items-center justify-center">
      <h1 className="text-2xl">Capsule Web Dev Test</h1>
      <SearchBox setResults={setResults} />
      <SearchResults results={results } />
    </div>
  );
};

export default Page;
