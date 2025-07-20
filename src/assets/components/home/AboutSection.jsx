
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="w-full py-12 md:py-16 relative about-section">
      <div className="container mx-auto px-4">
        <div className="mx-auto" style={{ width: '60vw' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center section-heading about-section-text">
            About Focuszone.io
          </h2>
          
          <div className="space-y-6">
            <div className="content-card">
             <div> <h3 className="text-xl font-semibold mb-4 about-section-text">What is Focuszone.io?<br></br></h3></div>
              <br></br>
              <p className="about-section-text">  
                <a href="http://focuszone.io/" className="text-blue-600 dark:text-blue-300 hover:underline">Focuszone.io</a> is a gamified Pomodoro timer designed to supercharge your productivity. 
                Combining the proven <strong className="text-inherit">Pomodoro Technique</strong> with a built-in <strong className="text-inherit">Focus Music Box</strong>, 
                it helps you stay concentrated during deep work, study, or creative tasks.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="content-card">
                <h3 className="text-xl font-semibold mb-4 about-section-text">How It Works</h3>
                <ul className="space-y-3">
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Work in focused 25-minute sessions (Pomodoros)</span>
                  </li>
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Take short 5-minute breaks between sessions</span>
                  </li>
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">After 4 Pomodoros, take a longer 15-30 minute break</span>
                  </li>
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Earn coins for completed Pomodoros to unlock rewards</span>
                  </li>
                </ul>
              </div>

              <div className="content-card">
                <h3 className="text-xl font-semibold mb-4 about-section-text">Why Choose Focuszone.io?</h3>
                <ul className="space-y-3">
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Built-in Focus Music Box with customizable sounds</span>
                  </li>
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Gamification with coins and rewards</span>
                  </li>
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Track your productivity with detailed statistics</span>
                  </li>
                  <li className="list-item">
                    <span className="bullet-point about-section-text">•</span>
                    <span className="about-section-text">Clean, intuitive interface with dark/light mode support</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="coin-distribution">
              <h3 className="text-xl font-semibold mb-4 about-section-text">💰 Coin Distribution System</h3>
              <div className="coin-grid">
                {[
                  { level: 'Level 2', coins: '1 coin' },
                  { level: 'Level 3-5', coins: '2 coins' },
                  { level: 'Level 6-10', coins: '5 coins' },
                  { level: 'Level 11-15', coins: '10 coins' },
                  { level: 'Level 16-20', coins: '20 coins' },
                  { level: 'Level 21-30', coins: '50 coins' },
                  { level: 'Level 31-35', coins: '100 coins' },
                  { level: 'Level 36-40', coins: '150 coins' },
                  { level: 'Level 41-45', coins: '200 coins' },
                  { level: 'Level 46-50', coins: '300 coins' }
                ].map((item, index) => (
                  <div key={index} className="coin-item">
                    <h4 className="text-sm mb-1 about-section-text">{item.level}</h4>
                    <p className="text-lg font-bold text-yellow-500">{item.coins}</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default AboutSection;
