import "./SpotifyEmbed3.css";

const SpotifyEmbed3 = () => {
  return (
    <>
      <div className="floating-spotify-widget">
        <iframe
          src="https://open.spotify.com/embed/playlist/0oPyDVNdgcPFAWmOYSK7O1?utm_source=generator"
          height="351"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="floating-spotify-iframe"
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed3;
