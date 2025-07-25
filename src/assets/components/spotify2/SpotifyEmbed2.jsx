import "./SpotifyEmbed2.css";

const SpotifyEmbed2 = () => {
  return (
    <>
      <div className="w-full flex justify-center px-4">
        <iframe
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO1GgBuH?utm_source=generator"
          height="351"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="frame w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mb-[10%]"
        ></iframe>
      </div>
    </>
  );
};
export default SpotifyEmbed2;
