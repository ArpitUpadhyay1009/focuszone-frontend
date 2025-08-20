import "./SpotifyEmbed2.css";

const SpotifyEmbed2 = () => {
  return (
    <>
      <div className="floating-spotify-widget">
        <iframe
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO1GgBuH?utm_source=generator"
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
