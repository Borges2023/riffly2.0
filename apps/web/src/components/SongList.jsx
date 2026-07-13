import React from "react";
import SongItem from "./SongItem";

const SongList = ({ songsArray }) => {
  const [items, setItems] = React.useState(5);

  return (
    <div className="song-list">
      {songsArray
        .filter((currentValue, index) => index < items)
        .map((currentSongObj, index) => (
          <SongItem {...currentSongObj} index={index} key={currentSongObj._id ?? currentSongObj.id ?? index} />
        ))}

      <button
        type="button"
        className="song-list__see-more"
        onClick={() => setItems((current) => current + 5)}
      >
        Ver mais
      </button>
    </div>
  );
};

export default SongList;
