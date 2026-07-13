/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export const Search = ({ value, onChange, placeholder = "Buscar...", suggestions = [], onVoiceSearch }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) return undefined;
    const timer = setTimeout(() => setIsListening(false), 2500);
    return () => clearTimeout(timer);
  }, [isListening]);

  return (
    <div className="ds-search-wrap">
      <input className="ds-search" value={value} onChange={onChange} placeholder={placeholder} list="riffly-search-suggestions" />
      <datalist id="riffly-search-suggestions">
        {suggestions.map((item) => <option value={item} key={item} />)}
      </datalist>
      {onVoiceSearch ? (
        <button
          type="button"
          className={`ds-search__voice${isListening ? " is-listening" : ""}`}
          onClick={() => {
            setIsListening(true);
            onVoiceSearch();
          }}
        >
          {isListening ? "Ouvindo..." : "Voz"}
        </button>
      ) : null}
    </div>
  );
};
