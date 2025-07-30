import "./SpotifyEmbed.css";

const SpotifyEmbed2 = () => {
  return (
    <>
      <div className="floating-spotify-widget">
        <iframe
          src="https://open.spotify.com/embed/playlist/2M2sS2wB173sce3MFbGp4Q?utm_source=generator"
          height="220"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="floating-spotify-iframe"
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed2;
