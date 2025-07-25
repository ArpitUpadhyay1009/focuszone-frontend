import "./SpotifyEmbed.css";
import React from "react";

const SpotifyEmbed2 = () => {
  return (
    <>
      <div>
        <iframe
          src="https://open.spotify.com/embed/playlist/2M2sS2wB173sce3MFbGp4Q?utm_source=generator"
          height="220"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="frame ml-[-10%]  mb-[10%] md:ml-[-20%] lg:ml-[4%] spotify-iframe-responsive"
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed2;
