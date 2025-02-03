import "./SpotifyEmbed.css";
import React from "react";

const SpotifyEmbed = () => {
  return (
    <>
      <div>
        <iframe
          src="https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp"
          width="500"
          height="200"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          title="Spotify Player"
          className="frame"
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed;
