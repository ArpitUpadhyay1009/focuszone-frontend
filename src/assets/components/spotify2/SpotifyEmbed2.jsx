import "./SpotifyEmbed2.css";
import React from "react";

const SpotifyEmbed2 = () => {
  return (
    <>
      <div>
        <iframe
          src="https://open.spotify.com/embed/playlist/6zCID88oNjNv9zx6puDHKj?utm_source=generator"
          width="300" // Adjusted width for smaller screens
          height="100"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="frame ml-[13%] mr-[17%] mb-[10%] md:ml-[22%]" // Adjusted margin for tablet screens
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed2;
