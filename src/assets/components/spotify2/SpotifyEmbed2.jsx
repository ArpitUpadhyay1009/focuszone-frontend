import "./SpotifyEmbed2.css";

const SpotifyEmbed2 = () => {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <iframe
        src="https://open.spotify.com/embed/playlist/2M2sS2wB173sce3MFbGp4Q?utm_source=generator"
        height="351"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full"
      ></iframe>
    </div>
  );
};
export default SpotifyEmbed2;
