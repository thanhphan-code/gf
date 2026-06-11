import { useState, useEffect, useMemo, useRef } from 'react';

const SPOTIFY_TOKEN = "YOUR_ACCESS_TOKEN";
const PLAYER_NAME = "Memory Wall 🐰";
const HEART_TARGET = 12;

const DIE_WITH_A_SMILE = {
  name: "Die With A Smile",
  artist: "Lady Gaga, Bruno Mars",
  spotifyUri: "spotify:track:2plbrEY59IikOBgBGLjaoe"
};

const captions = [
  "Nụ cười của em là khoảnh khắc anh thích nhất",
  "Một ngày thật mềm",
  "Góc nhỏ có em",
  "Thương ơi là thương",
  "Kỷ niệm bé xíu",
  "Mắt em biết cười",
  "Đi đâu cũng nhớ",
  "Chút nắng của anh",
  "Cất vào tim nha",
  "Dễ thương quá mức",
  "Một lần rung rinh",
  "Mình giữ nhau nhé",
  "Tấm ảnh biết yêu",
  "Bình yên là em",
  "Hôm nay có em",
  "Mơ màng một chút",
  "Tim anh ghim đây",
  "Khoảnh khắc màu hồng",
  "Em là nhà",
  "Yêu em nhiều lắm",
  "Của riêng tụi mình"
];

const memoryQuotes = [
  "Anh thích cách mỗi khoảnh khắc có em đều trở nên dịu dàng hơn. Chỉ cần nhìn lại thôi, tim anh cũng tự nhiên thấy ấm.",
  "Có những tấm ảnh nhìn rất bình thường, nhưng với anh lại là một nơi để quay về mỗi khi nhớ em.",
  "Em xuất hiện trong ký ức của anh như một màu hồng rất nhẹ, không ồn ào nhưng làm mọi thứ đáng yêu hơn.",
  "Mỗi lần mở lại một khoảnh khắc, anh lại thấy mình may mắn vì đã có em trong những ngày này.",
  "Anh không cần kỷ niệm phải thật lớn. Chỉ cần trong đó có em, nó tự nhiên thành điều anh muốn giữ.",
  "Nếu hôm nào em thấy mệt, mong tấm ảnh nhỏ này nhắc em rằng có người thương em rất nhiều.",
  "Có em trong khung hình là đủ để một ngày bình thường trở thành ngày đáng nhớ với anh.",
  "Anh muốn cất những điều bé xíu này thật cẩn thận, vì chúng đều có một phần rất đáng yêu của em.",
  "Em biết không, đôi khi anh chỉ cần nhìn thấy em cười là mọi thứ trong anh dịu lại.",
  "Tấm ảnh này giống một lời nhắc nhỏ: anh vẫn luôn chọn thương em theo cách mềm nhất anh có."
];

const memoryNotes = [
  "Một kỷ niệm nhỏ, một lần tim anh mềm đi.",
  "Ghim lại đây để ngày nào nhớ em cũng có chỗ quay về.",
  "Thỏ đã giữ khoảnh khắc này giúp anh rồi đó.",
  "Nhẹ thôi, nhưng thương thì nhiều lắm.",
  "Một chút em, một chút bình yên.",
  "Cất vào tim, không để lạc mất."
];

const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export default function MemoryWall() {
  const [heartCount, setHeartCount] = useState(() => {
    return Number(localStorage.getItem("thaoHeartTotal") || 0);
  });
  const [openedPhotos, setOpenedPhotos] = useState(() => {
    return new Set(JSON.parse(localStorage.getItem("thaoOpenedPhotos") || "[]"));
  });
  const [activeModal, setActiveModal] = useState(null); // 'letter' | 'voucher' | null
  const [activePhoto, setActivePhoto] = useState(null); // { src, caption } | null
  const [activeQuote, setActiveQuote] = useState("");
  const [activeNote, setActiveNote] = useState("");
  
  const [bunnyNoteText, setBunnyNoteText] = useState("Thỏ đang canh tường ảnh cho em. Bấm các nút phía trên để chơi với thỏ nha.");
  const [isBunnyDancing, setIsBunnyDancing] = useState(false);
  const [floatingGifts, setFloatingGifts] = useState([]);
  
  // Spotify Integration States
  const [spotifyDeviceId, setSpotifyDeviceId] = useState("");
  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState(false);
  const [dockStatusText, setDockStatusText] = useState(DIE_WITH_A_SMILE.artist);
  const [showDockHint, setShowDockHint] = useState(false);
  const [dockHintText, setDockHintText] = useState("");
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false);

  const lastQuoteIndexRef = useRef(-1);
  const quotePickRef = useRef(0);
  const giftIdRef = useRef(0);
  const dockHintTimerRef = useRef(null);
  const playerRef = useRef(null);

  // Setup sparkles background variables once
  const sparkles = useMemo(() => {
    const colors = ["#ffd6e8", "#fff3b8", "#ffffff", "#ff9ec5"];
    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      x: `${seededRandom(i + 1) * 100}%`,
      s: `${seededRandom(i + 11) * 9 + 6}px`,
      d: `${seededRandom(i + 21) * 7 + 7}s`,
      delay: `${seededRandom(i + 31) * -12}s`,
      r: `${seededRandom(i + 41) * 180}deg`,
      c: colors[Math.floor(seededRandom(i + 51) * colors.length)]
    }));
  }, []);

  // Compute fixed layout rotation/delay for the 21 photo cards
  const polaroids = useMemo(() => {
    return Array.from({ length: 21 }, (_, index) => ({
      index,
      src: `${import.meta.env.BASE_URL}img/${index + 1}.jpg`,
      caption: captions[index],
      rot: `${(seededRandom(index + 101) * 24 - 12).toFixed(2)}deg`,
      delay: `${index * 170 + 900}ms`
    }));
  }, []);

  // Sync state changes to local storage
  useEffect(() => {
    localStorage.setItem("thaoHeartTotal", heartCount);
  }, [heartCount]);

  useEffect(() => {
    localStorage.setItem("thaoOpenedPhotos", JSON.stringify([...openedPhotos]));
  }, [openedPhotos]);

  // Load Spotify Player Web SDK dynamically
  useEffect(() => {
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (!SPOTIFY_TOKEN || SPOTIFY_TOKEN === "YOUR_ACCESS_TOKEN") return;

      const spPlayer = new window.Spotify.Player({
        name: PLAYER_NAME,
        getOAuthToken: cb => cb(SPOTIFY_TOKEN),
        volume: 0.6
      });

      spPlayer.addListener("ready", ({ device_id }) => {
        setSpotifyDeviceId(device_id);
      });

      spPlayer.addListener("player_state_changed", state => {
        if (!state) return;
        setIsSpotifyPlaying(!state.paused);
      });

      spPlayer.connect();
      playerRef.current = spPlayer;
    };

    // Close modal on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePhoto(null);
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(dockHintTimerRef.current);
    };
  }, []);

  // Hide the initial intro overlay after loading
  useEffect(() => {
    const introEl = document.getElementById("intro");
    const timer = setTimeout(() => {
      if (introEl) {
        introEl.classList.add("done");
      }
    }, 3100);
    return () => clearTimeout(timer);
  }, []);

  const spawnFloatingGift = (symbol, clientX, clientY) => {
    const gift = {
      id: giftIdRef.current++,
      symbol,
      left: clientX,
      top: clientY
    };
    setFloatingGifts((prev) => [...prev, gift]);
    setTimeout(() => {
      setFloatingGifts((prev) => prev.filter((g) => g.id !== gift.id));
    }, 1700);
  };

  const bunnyReact = (message, shouldDance = true) => {
    setBunnyNoteText(message);
    if (shouldDance) {
      setIsBunnyDancing(true);
      setTimeout(() => setIsBunnyDancing(false), 1800);
    }
  };

  const addBonusHeart = (amount = 1) => {
    setHeartCount((prev) => prev + amount);
  };

  const showDockHintMessage = (message) => {
    setDockHintText(message);
    setShowDockHint(true);
    clearTimeout(dockHintTimerRef.current);
    dockHintTimerRef.current = setTimeout(() => {
      setShowDockHint(false);
    }, 3600);
  };

  // Spotify Control Handlers
  const playSpotify = async () => {
    const uri = DIE_WITH_A_SMILE.spotifyUri;
    if (!SPOTIFY_TOKEN || SPOTIFY_TOKEN === "YOUR_ACCESS_TOKEN" || !spotifyDeviceId) {
      // Show embedded iframe if WebSDK credentials are not configured
      setShowSpotifyEmbed(true);
      setIsSpotifyPlaying(true);
      setDockStatusText("Player Spotify đã mở");
      showDockHintMessage("Player đã mở trên web. Nếu chưa nghe tiếng, bấm nút play trong khung Spotify nhỏ nha.");
      return;
    }

    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SPOTIFY_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uris: [uri] })
      });
      if (res.ok) {
        setIsSpotifyPlaying(true);
        setDockStatusText("Đang phát cho em nghe");
      } else {
        throw new Error();
      }
    } catch {
      setIsSpotifyPlaying(false);
      setDockStatusText(DIE_WITH_A_SMILE.artist);
      showDockHintMessage("Spotify chưa cho phát trực tiếp. Hãy đăng nhập Spotify rồi bấm lại nút nhạc nền.");
    }
  };

  const pauseSpotify = async () => {
    if (!SPOTIFY_TOKEN || SPOTIFY_TOKEN === "YOUR_ACCESS_TOKEN") {
      setShowSpotifyEmbed(false);
      setIsSpotifyPlaying(false);
      setDockStatusText(DIE_WITH_A_SMILE.artist);
      return;
    }

    try {
      await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
      });
      setShowSpotifyEmbed(false);
      setIsSpotifyPlaying(false);
      setDockStatusText(DIE_WITH_A_SMILE.artist);
    } catch {
      setShowSpotifyEmbed(false);
      setIsSpotifyPlaying(false);
      setDockStatusText(DIE_WITH_A_SMILE.artist);
    }
  };

  const handleMusicBtnClick = () => {
    if (isSpotifyPlaying) {
      pauseSpotify();
    } else {
      playSpotify();
    }
  };

  const handleSendHeartBtn = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        spawnFloatingGift("💕", x + seededRandom(i + heartCount + 201) * 80 - 40, y + seededRandom(i + heartCount + 301) * 26);
      }, i * 45);
    }
    addBonusHeart(1);
    bunnyReact("Em vừa nhận một trái tim mới. Thỏ đang vui lắm!", true);
  };

  const handleLoveLetterBtn = () => {
    setActiveModal("letter");
    bunnyReact("Thỏ mở thư giúp anh rồi. Đọc chậm thôi nha.", true);
  };

  const handleVoucherBtn = () => {
    setActiveModal("voucher");
    bunnyReact("Voucher yêu thương đã sẵn sàng. Em chọn cái nào anh cũng chịu.", true);
  };

  const handleBunnyDanceBtn = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    for (let i = 0; i < 9; i++) {
      setTimeout(() => {
        spawnFloatingGift(i % 2 ? "🥕" : "✨", x + seededRandom(i + heartCount + 401) * 100 - 50, y + 20);
      }, i * 70);
    }
    bunnyReact("Thỏ đang nhảy vì hôm nay có em ở đây.", true);
  };

  const openMemory = (index) => {
    const p = polaroids[index];
    
    // Add heart if not opened yet
    if (!openedPhotos.has(index)) {
      setOpenedPhotos((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
      setHeartCount((prev) => prev + 1);
      bunnyReact("Thỏ vừa nhặt thêm một trái tim cho em rồi đó.", true);
    }

    // Select random quote
    quotePickRef.current += 1;
    let nextQuoteIndex = Math.floor(seededRandom(quotePickRef.current * 17 + index + 501) * memoryQuotes.length);
    while (nextQuoteIndex === lastQuoteIndexRef.current) {
      nextQuoteIndex = (nextQuoteIndex + 1) % memoryQuotes.length;
    }
    lastQuoteIndexRef.current = nextQuoteIndex;
    
    setActivePhoto(p);
    setActiveQuote(memoryQuotes[nextQuoteIndex]);
    setActiveNote(memoryNotes[Math.floor(seededRandom(quotePickRef.current * 23 + index + 601) * memoryNotes.length)]);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Sparkles */}
      <div className="sparkles" aria-hidden="true">
        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="sparkle"
            style={{
              '--x': sp.x,
              '--s': sp.s,
              '--d': sp.d,
              '--delay': sp.delay,
              '--r': sp.r,
              '--c': sp.c,
            }}
          />
        ))}
      </div>

      {/* Floating Action elements */}
      {floatingGifts.map((g) => (
        <span
          key={g.id}
          className={g.symbol === "🥕" ? "floating-carrot" : "floating-heart"}
          style={{ left: g.left, top: g.top }}
        >
          {g.symbol}
        </span>
      ))}

      {/* Top Bar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-bunny">🐰</div>
          <span>Memory Wall của em</span>
        </div>
        <div className="heart-counter" aria-live="polite">
          <span className="heart">♥</span>
          <span>{heartCount}</span>
          <span>/ {HEART_TARGET}</span>
        </div>
      </header>

      {/* Intro Modal Letter */}
      <section className="intro" id="intro" aria-label="Lời mở đầu">
        <div className="letter">
          <div>
            <h1>Những khoảnh khắc của chúng mình</h1>
            <p>Gửi em, từng tấm ảnh là một chút thương được ghim lại.</p>
          </div>
        </div>
      </section>

      {/* Main Grid & Bunny Actions */}
      <main className="wall">
        <section className="wall-title">
          <h2>Bé iu, xem nè</h2>
          <p>Mỗi lần thỏ chạy qua là một kỷ niệm mới được ghim lên tường. Bấm vào ảnh để mở khoảnh khắc và gom tim nha.</p>
          
          <div className="soundtrack-badge">Die With A Smile</div>
          
          <div className="love-actions" aria-label="Những nút dễ thương">
            <button className="love-action" onClick={handleSendHeartBtn} type="button">
              <span>♡</span>Gửi tim
            </button>
            <button className="love-action" onClick={handleLoveLetterBtn} type="button">
              <span>✉</span>Thư nhỏ
            </button>
            <button className="love-action" onClick={handleVoucherBtn} type="button">
              <span>✦</span>Voucher
            </button>
            <button className="love-action" onClick={handleBunnyDanceBtn} type="button">
              <span>♪</span>Gọi thỏ
            </button>
          </div>

          <div className={`bunny-stage ${isBunnyDancing ? 'dance' : ''}`} id="bunnyStage">
            <p className="bunny-note">{bunnyNoteText}</p>
            <div className="stage-bunny" aria-hidden="true">
              <span className="stage-ear left"></span>
              <span className="stage-ear right"></span>
              <span className="stage-eye"></span>
              <span className="stage-tail"></span>
            </div>
          </div>
        </section>

        {/* Polaroid Photos Grid */}
        <section className="polaroid-grid" aria-label="Tường ảnh Polaroid">
          {polaroids.map((p) => (
            <button
              key={p.index}
              className="polaroid"
              type="button"
              onClick={() => openMemory(p.index)}
              style={{
                '--rot': p.rot,
                '--delay': p.delay,
              }}
            >
              <img src={p.src} alt={p.caption} loading="lazy" />
              <span className="caption">{p.caption}</span>
            </button>
          ))}
        </section>
      </main>

      {/* Running Bunny Overlay */}
      <div className="runner" aria-hidden="true">
        <div className="runner-photo"><span></span></div>
        <div className="bunny">
          <div className="ear ear-left"></div>
          <div className="ear ear-right"></div>
          <div className="bunny-head"></div>
          <div className="bunny-eye"></div>
          <div className="bunny-cheek"></div>
          <div className="bunny-body"></div>
          <div className="bunny-tail"></div>
          <div className="paw paw-front"></div>
          <div className="paw paw-back"></div>
        </div>
      </div>

      {/* Milestone Surprise message */}
      <aside className={`surprise ${heartCount >= HEART_TARGET ? 'show' : ''}`}>
        Mở khóa rồi: Em là điều dễ thương nhất trong ngày của anh 💕
      </aside>

      {/* Spotify Music Dock */}
      <section className={`music-dock ${isSpotifyPlaying ? 'playing' : ''}`} id="backgroundMusicDock" aria-label="Nhạc nền Die With A Smile">
        <div className="dock-disc" aria-hidden="true"></div>
        <div className="dock-copy">
          <div className="dock-label">Nhạc nền</div>
          <div className="dock-title">Die With A Smile</div>
          <div className="dock-artist">{dockStatusText}</div>
        </div>
        <button className="dock-btn" onClick={handleMusicBtnClick} type="button" aria-label="Bật nhạc nền">
          {isSpotifyPlaying ? "⏸" : "▶"}
        </button>
      </section>

      {/* Spotify Embed Player */}
      <div className={`dock-embed-panel ${showSpotifyEmbed ? 'show' : ''}`} aria-hidden={!showSpotifyEmbed}>
        {showSpotifyEmbed && (
          <iframe
            src={`https://open.spotify.com/embed/track/2plbrEY59IikOBgBGLjaoe?utm_source=generator&theme=0&autoplay=1`}
            title="Die With A Smile Spotify player"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        )}
      </div>

      {/* Music Hint Overlay */}
      <div className={`dock-hint ${showDockHint ? 'show' : ''}`}>
        {dockHintText}
      </div>

      {/* Modals Popup (Letter & Voucher) */}
      <section 
        className={`love-modal ${activeModal ? 'open' : ''}`} 
        aria-hidden={!activeModal}
        onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
      >
        {activeModal && (
          <div className="love-modal-card" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setActiveModal(null)} type="button" aria-label="Đóng">×</button>
            
            {activeModal === 'voucher' ? (
              <>
                <h3 className="modal-title">Voucher yêu thương</h3>
                <div className="modal-body">
                  <div className="voucher-intro">
                    <p><strong>Luật chơi rất đơn giản:</strong> Em chọn một voucher, chụp màn hình gửi anh, còn phần thực hiện cứ để anh lo.</p>
                    <p>Mỗi voucher chỉ có một điều kiện duy nhất: em phải nhận nó với tâm trạng thật vui.</p>
                  </div>
                  <div className="voucher-grid">
                    <div className="voucher"><em>Ăn ngon</em>Một buổi đi ăn món em thèm<small>Em chọn quán, anh chọn cách làm em cười.</small></div>
                    <div className="voucher"><em>Ôm lâu</em>Một cái ôm sạc pin 100%<small>Dành cho ngày mệt, ngày nhớ, hoặc chẳng cần lý do.</small></div>
                    <div className="voucher"><em>Lắng nghe</em>Một buổi nghe em kể hết mọi chuyện<small>Anh chỉ nghe, nhớ, thương, và không ngắt lời.</small></div>
                    <div className="voucher"><em>Bất ngờ</em>Một món quà nhỏ không báo trước<small>Không cần đắt, chỉ cần đúng kiểu em thích.</small></div>
                    <div className="voucher"><em>Nuông chiều</em>Một ngày em được quyết định tất cả<small>Ăn gì, đi đâu, làm gì, anh đều theo phe em.</small></div>
                    <div className="voucher"><em>Dỗ dành</em>Một lần được anh dỗ tới khi hết buồn<small>Có thể kèm trà sữa, đồ ăn, hoặc một cái nắm tay.</small></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="modal-title">Thư nhỏ gửi em</h3>
                <div className="modal-body">
                  <p>Em à, anh làm góc nhỏ này không phải để nó thật hoàn hảo, mà để mỗi lần em mở ra đều thấy mình được thương một cách rất rõ ràng.</p>
                  <div className="letter-stack">
                    <div className="letter-card"><strong>Điều anh thích ở em</strong>Em có một kiểu dễ thương rất riêng, đôi khi chỉ là một ánh mắt hay một câu nói nhỏ cũng đủ làm anh nhớ cả ngày.</div>
                    <div className="letter-card"><strong>Điều anh muốn giữ</strong>Những khoảnh khắc bình thường có em trong đó. Vì với anh, bình thường mà có em thì tự nhiên thành đáng nhớ.</div>
                    <div className="letter-card"><strong>Điều anh hứa</strong>Anh sẽ cố thương em bằng những việc nhỏ nhưng đều đặn: lắng nghe hơn, dịu dàng hơn, và ở cạnh em tử tế hơn.</div>
                  </div>
                  <div className="love-list">
                    <span><span>♡</span> Nhớ em nhiều hơn anh nói</span>
                    <span><span>♡</span> Muốn thấy em cười nhiều hơn</span>
                    <span><span>♡</span> Thương cả lúc em vui lẫn lúc em mệt</span>
                    <span><span>♡</span> Luôn dành cho em một chỗ mềm trong tim</span>
                  </div>
                  <p className="mt-4">Mong trang này giống một chiếc hộp nhỏ. Khi nào em cần một chút dịu dàng, em mở ra, và thấy anh vẫn ở đây.</p>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Polaroid Image Lightbox */}
      <section 
        className={`lightbox ${activePhoto ? 'open' : ''}`} 
        aria-hidden={!activePhoto}
        onClick={(e) => { if (e.target === e.currentTarget) setActivePhoto(null); }}
      >
        {activePhoto && (
          <div className="lightbox-card" role="dialog" aria-modal="true">
            <button className="close-btn" onClick={() => setActivePhoto(null)} type="button" aria-label="Đóng">×</button>
            <img className="lightbox-photo" src={activePhoto.src} alt={activePhoto.caption} />
            <div className="lightbox-side">
              <h3 className="lightbox-caption">{activePhoto.caption}</h3>
              <p className="lightbox-text">{activeQuote}</p>
              <span className="music-note">{activeNote}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
