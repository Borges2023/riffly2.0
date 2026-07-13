import { useState } from "react";
import Main from "../components/Main";
import { Search } from "../design-system/index.js";
import { getArtists, getSongs } from "../../../../database/apiFallback.js";
import { buildSearchSuggestions } from "../utils/searchCatalog.js";

const Songs = () => {
  const [query, setQuery] = useState("");
  const suggestions = buildSearchSuggestions(getSongs(), getArtists());

  return (
    <>
      <Search
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Busque por artista, album, musica, genero, playlist ou usuario..."
        suggestions={suggestions}
        onVoiceSearch={() => setQuery("Henrique Juliano")}
      />
      <Main type="songs" searchQuery={query} />
    </>
  );
};

export default Songs;
