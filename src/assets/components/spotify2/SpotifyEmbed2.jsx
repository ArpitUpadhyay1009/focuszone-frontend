import "./SpotifyEmbed2.css";
import React from "react";

const SpotifyEmbed2 = () => {
  return (
    <>
      <div>
        <iframe
          src="https://open.spotify.com/embed/playlist/0oPyDVNdgcPFAWmOYSK7O1?utm_source=generator"
          width="310" // Adjusted width for smaller screens
          height="100"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="frame ml-[10%]  mb-[10%] md:ml-[-20%] lg:ml-[17%]" // Adjusted margin for tablet screens
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed2;
