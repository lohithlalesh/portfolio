import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll
} from "framer-motion";
import {
  Browser,
  ChartLineUp,
  Eraser,
  FloppyDisk,
  MagnifyingGlass,
  PaintBrush,
  Palette,
  PenNib,
  ShareNetwork,
  Trash,
  VideoCamera
} from "@phosphor-icons/react";
import {
  AnimatedGroup,
  CMSHoverGallery,
  easeOut,
  InView as Reveal,
  MotionCard,
  MotionDock,
  ScrollProgressBar,
  TagPillStack,
  TextEffect as SplitText
} from "./framer-components.jsx";

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const heroCapabilities = [
  "Content flywheel",
  "Paid media",
  "Landing pages",
  "Automation",
  "AI workflows",
  "Blue ocean angles",
  "Search / AEO",
  "Tracking"
];

const tools = [
  ["Meta", asset("assets/images/tool-meta.svg")],
  ["Google Ads", asset("assets/images/tool-google-ads.svg")],
  ["Mailchimp", asset("assets/images/tool-mailchimp.svg")],
  ["n8n", asset("assets/images/tool-n8n.svg")],
  ["Figma", asset("assets/images/tool-figma.svg")],
  ["Claude Code", asset("assets/images/tool-claude-code.svg")],
  ["Premiere Pro", asset("assets/images/tool-premiere-pro.svg")],
  ["WordPress", asset("assets/images/tool-wordpress.svg")],
  ["Shopify", asset("assets/images/tool-shopify.svg")],
  ["Airtable", asset("assets/images/tool-airtable.svg")],
  ["Webflow", asset("assets/images/tool-webflow.svg")],
  ["Google Search Console", asset("assets/images/tool-search-console.svg")],
  ["Semrush", asset("assets/images/tool-semrush.svg")],
  ["Zapier", asset("assets/images/tool-zapier.svg")],
  ["Notion", asset("assets/images/tool-notion.svg")]
];

const modes = [
  {
    title: "Design + video",
    line: "Make the scroll stop with visuals, edits, thumbnails, reels, and campaign assets.",
    output: "visual engine",
    Icon: Palette,
    AssistIcon: VideoCamera,
    className: "mode-lane-designer",
    tags: "graphic design, video editing, thumbnails, reels"
  },
  {
    title: "Content writer",
    line: "Find the line, angle, proof, and reason people should care.",
    output: "story spine",
    Icon: PenNib,
    className: "mode-lane-writer",
    tags: "hooks, captions, scripts, content systems"
  },
  {
    title: "Social media",
    line: "Build the posting rhythm, creator brief, platform native idea, and community signal.",
    output: "attention loop",
    Icon: ShareNetwork,
    className: "mode-lane-social",
    tags: "content calendar, UGC, community, platform rhythm"
  },
  {
    title: "UI designer",
    line: "Turn attention into a landing page, flow, or interface people can move through.",
    output: "clean path",
    Icon: Browser,
    className: "mode-lane-ui",
    tags: "landing pages, CRO, forms, funnels"
  },
  {
    title: "SEO + AEO",
    line: "Shape content for search, answer engines, snippets, intent, and long-tail discovery.",
    output: "findability",
    Icon: MagnifyingGlass,
    className: "mode-lane-search",
    tags: "SEO, AEO, indexing, answer intent"
  },
  {
    title: "Performance marketer",
    line: "Launch, read the signal, cut waste, and tighten the next version.",
    output: "test loop",
    Icon: ChartLineUp,
    className: "mode-lane-performance",
    tags: "paid media, tracking, analytics, iteration"
  }
];

const notes = [
  {
    tag: "paid media",
    title: "The programmatic ads hack: real power, real fraud, real hoax",
    text: "What is real, what is waste, and why cheap impressions are usually the wrong prize.",
    meta: "26 Jun 2026 / 8 min",
    href: asset("blog/programmatic-ads-hack-or-hoax.html")
  },
  {
    tag: "ai stack",
    title: "Claude Skills, ranked: GitHub repos a marketer should steal",
    text: "The useful skills for docs, decks, reports, and brand workflows.",
    meta: "12 Jun 2026 / 9 min",
    href: asset("blog/claude-skills-from-github.html")
  },
  {
    tag: "learning curve",
    title: "AI fluency is the new baseline for marketers",
    text: "A practical free path to fluency without pretending tools are strategy.",
    meta: "09 Jun 2026 / 8 min",
    href: asset("blog/ai-fluency-for-marketers.html")
  },
  {
    tag: "growth",
    title: "I lost 40 kg. It rebuilt my career more than any course.",
    text: "The boring reps that changed the body first and the work ethic next.",
    meta: "02 Jun 2026 / 8 min",
    href: asset("blog/losing-40kg-career-lessons.html")
  },
  {
    tag: "seo",
    title: "What my first blog taught me about Google indexing",
    text: "A tiny coin-flip post, one weirdly specific title, and a real SEO lesson.",
    meta: "28 May 2026 / 7 min",
    href: asset("blog/how-i-learned-google-indexing.html")
  },
  {
    tag: "paid media",
    title: "Why paid media starts long before Ads Manager",
    text: "The audience, hook, offer, and landing path work that happens before budget.",
    meta: "20 May 2026 / 6 min",
    href: asset("blog/paid-media-before-ads-manager.html")
  },
  {
    tag: "social content",
    title: "A content calendar is not a schedule. It is a delivery system.",
    text: "Inputs, states, owners, and a definition of done that actually ships.",
    meta: "12 May 2026 / 6 min",
    href: asset("blog/content-calendar-delivery-system.html")
  }
];

const visitorWallKey = "lohith-visitor-wall-v1";
const wallColors = ["#ff5238", "#7f99ff", "#47d7c4", "#ffcf5a", "#ff6cba", "#fff3e3", "#101216"];
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

const createId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `mark-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const clampText = (value, fallback, limit = 90) => {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return (text || fallback).slice(0, limit);
};

const normalizeMark = (mark) => ({
  id: mark.id,
  author: mark.author || "visitor",
  message: mark.message || "left a mark",
  imageData: mark.imageData || mark.image_data,
  createdAt: mark.createdAt || mark.created_at || new Date().toISOString()
});

const mergeMarks = (...groups) => {
  const seen = new Set();
  return groups
    .flat()
    .filter(Boolean)
    .map(normalizeMark)
    .filter((mark) => {
      if (!mark.id || !mark.imageData || seen.has(mark.id)) return false;
      seen.add(mark.id);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 9);
};

const loadLocalMarks = () => {
  try {
    return JSON.parse(localStorage.getItem(visitorWallKey) || "[]").map(normalizeMark);
  } catch {
    return [];
  }
};

const saveLocalMarks = (marks) => {
  localStorage.setItem(visitorWallKey, JSON.stringify(marks.slice(0, 12)));
};

async function fetchSharedMarks() {
  if (!hasSupabase) return [];

  const response = await fetch(
    `${supabaseUrl}/rest/v1/visitor_marks?select=id,author,message,image_data,created_at&approved=eq.true&order=created_at.desc&limit=9`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    }
  );

  if (!response.ok) throw new Error("Could not load shared marks");
  return (await response.json()).map(normalizeMark);
}

async function saveSharedMark(mark) {
  if (!hasSupabase) return null;

  const response = await fetch(`${supabaseUrl}/rest/v1/visitor_marks`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      id: mark.id,
      author: mark.author,
      message: mark.message,
      image_data: mark.imageData
    })
  });

  if (!response.ok) throw new Error("Could not save shared mark");
  return response.json();
}

function usePointerLayer(dotRef, ringRef) {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || !dotRef.current || !ringRef.current) return undefined;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let ringX = cursorX;
    let ringY = cursorY;
    let frame = 0;

    const drawCursor = () => {
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(drawCursor);
    };

    const move = (event) => {
      document.body.classList.add("cursor-ready");
      cursorX = event.clientX;
      cursorY = event.clientY;
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    const targets = [
      ...document.querySelectorAll("a, button, .magnetic, .note-card, .mode-lane, .tool-dock img")
    ];
    const enter = () => ring.classList.add("is-hovering");
    const leave = () => ring.classList.remove("is-hovering");

    window.addEventListener("pointermove", move);
    targets.forEach((target) => {
      target.addEventListener("pointerenter", enter);
      target.addEventListener("pointerleave", leave);
    });
    frame = window.requestAnimationFrame(drawCursor);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      targets.forEach((target) => {
        target.removeEventListener("pointerenter", enter);
        target.removeEventListener("pointerleave", leave);
      });
      document.body.classList.remove("cursor-ready");
    };
  }, [dotRef, ringRef]);
}

function useSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return undefined;

    const cards = [
      ...document.querySelectorAll(".cert-card, .note-card, .mode-lane, .mentor-quote, .contact-pill")
    ];
    const handlers = new Map();

    cards.forEach((card) => {
      const handler = (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      };
      handlers.set(card, handler);
      card.addEventListener("pointermove", handler);
    });

    return () => {
      handlers.forEach((handler, card) => card.removeEventListener("pointermove", handler));
    };
  }, []);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="site-header"
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.72, ease: easeOut }}
    >
      <a className="brand magnetic" href="#home" aria-label="Lohith Lalesh home">
        <span className="brand-mark" aria-hidden="true">
          <img src={asset("favicon.svg")} alt="" />
        </span>
        <span className="brand-copy">Lohith Lalesh</span>
      </a>
      <a className="center-mark magnetic" href="#home" aria-label="Back to top">campaign / portfolio</a>
      <nav className={`nav-links${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
        {["about", "modes", "work", "notes", "contact"].map((item) => (
          <a href={`#${item}`} onClick={() => setMenuOpen(false)} key={item}>{item}</a>
        ))}
      </nav>
      <button
        className="menu-toggle magnetic"
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        menu
      </button>
    </motion.header>
  );
}

function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <motion.button
        className={`music-toggle magnetic${playing ? " is-playing" : ""}`}
        type="button"
        aria-label="Play or pause music"
        aria-pressed={playing}
        onClick={toggleMusic}
        whileTap={{ scale: 0.92 }}
      >
        <span className="record" aria-hidden="true"></span>
        <motion.span
          className="needle"
          aria-hidden="true"
          animate={{ rotate: playing ? -28 : 0, x: playing ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
        ></motion.span>
      </motion.button>
      <audio
        className="music-audio"
        preload="metadata"
        src={asset("assets/audio/gta-iii-theme.mp3")}
        ref={audioRef}
        onEnded={() => setPlaying(false)}
      ></audio>
    </>
  );
}

function Hero() {
  const [realPhoto, setRealPhoto] = useState(false);
  const marqueeItems = [...heroCapabilities, ...heroCapabilities];

  return (
    <section className="hero panel-dark" aria-labelledby="hero-title">
      <div className="section-shell hero-shell">
        <div className="hero-content">
          <motion.p
            className="kicker"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, ease: easeOut, delay: 0.08 }}
          >
            Dubai / Marketing Operator / Technical Builder
          </motion.p>
          <h1 className="hero-title" id="hero-title" aria-label="Lohith Lalesh marketing portfolio">
            <motion.span
              className="hero-name-line reveal is-visible"
              initial={{ clipPath: "inset(0 0 100% 0)", y: 64 }}
              animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
            >
              LOHITH
            </motion.span>
            <motion.span
              className="hero-name-line hero-name-offset reveal is-visible"
              initial={{ clipPath: "inset(100% 0 0 0)", y: -64 }}
              animate={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
            >
              L<span className="accent-letter">A</span>LESH
            </motion.span>
          </h1>
          <motion.p
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, ease: easeOut, delay: 0.34 }}
          >
            I move between market, page, automation, content, media, AI workflows, and the channels other people miss.
          </motion.p>
          <motion.p
            className="hero-human-note"
            initial={{ opacity: 0, y: 18, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.62, ease: easeOut, delay: 0.46 }}
          >
            <span>machine-perfect</span> human-shaped momentum.
          </motion.p>
        </div>
        <button
          className={`portrait-card${realPhoto ? " is-real" : ""}`}
          type="button"
          aria-label="Toggle between AI portrait and real photo"
          onClick={() => setRealPhoto((value) => !value)}
          onPointerEnter={() => document.body.classList.add("is-portrait-hover")}
          onPointerLeave={() => document.body.classList.remove("is-portrait-hover")}
        >
          <img className="portrait-ai" src={asset("assets/images/lohith-lalesh-cutout.png")} width="707" height="907" alt="AI-styled cutout portrait of Lohith Lalesh" />
          <img className="portrait-real" src={asset("assets/images/lohith-lalesh-real-cutout.png")} width="646" height="911" alt="Real cutout photo of Lohith Lalesh" />
          <span className="portrait-frame"></span>
          <AnimatePresence mode="wait">
            <motion.span
              className="portrait-caption"
              key={realPhoto ? "real" : "ai"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: easeOut }}
            >
              <strong>{realPhoto ? "That's the real me" : "A Cool Photo of Mine (AI)"}</strong>
              {!realPhoto && <small>click to see non AI pic</small>}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <motion.div
        className="hero-marquee"
        aria-label="Marketing disciplines"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.68, delay: 0.5, ease: easeOut }}
      >
        <div className="hero-marquee-track" aria-hidden="true">
          {marqueeItems.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function OperatingMessage() {
  return (
    <section className="manifesto panel-cream" id="about" aria-label="Operating message">
      <div className="section-shell operating-board">
        <Reveal as="figure" className="mentor-quote">
          <blockquote>
            “Give this guy a rough idea and a brief. He’ll come back with two or three built versions, the campaign plan, and the technical pieces already thought through.”
          </blockquote>
          <figcaption>Something a boss and mentor said about how I work.</figcaption>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section className="quote-section panel-dark" aria-labelledby="quote-title">
      <div className="section-shell quote-grid">
        <div className="quote-copy">
          <Reveal as="p" className="section-label">north star</Reveal>
          <Reveal as="h2" className="section-title quote-title" id="quote-title">
            “The most personal is the most creative.”
          </Reveal>
          <Reveal as="p" className="quote-body">
            I keep this Scorsese line close because the work gets better when it carries the brief and a little bit of the person building it.
          </Reveal>
        </div>
        <motion.figure
          className="polaroid"
          aria-label="Martin Scorsese inspiration"
          initial={{ opacity: 0, rotate: 10, y: 50 }}
          whileInView={{ opacity: 1, rotate: -4, y: 0 }}
          viewport={{ once: true, amount: 0.38 }}
          transition={{ duration: 0.75, ease: easeOut }}
          whileHover={{ rotate: 1.5, y: -8 }}
        >
          <span className="tape tape-one"></span>
          <span className="tape tape-two"></span>
          <img src={asset("assets/images/martin-scorsese-polaroid.jpg")} width="999" height="1400" alt="Martin Scorsese portrait" />
          <figcaption>Martin Scorsese</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function ModesSection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveIndex(Math.min(modes.length - 1, Math.max(0, Math.floor(latest * modes.length + 0.001))));
  });

  const activeMode = modes[activeIndex];
  const ActiveIcon = activeMode.Icon;
  const ActiveAssistIcon = activeMode.AssistIcon;

  return (
    <section className="modes-section panel-dark" id="modes" aria-labelledby="modes-title" ref={sectionRef} data-mode={activeIndex + 1}>
      <div className="modes-sticky">
        <div className="section-shell mode-system">
          <div className="modes-copy">
            <Reveal as="p" className="section-label">many modes</Reveal>
            <Reveal as="h2" className="section-title" id="modes-title">Modes I switch between.</Reveal>
            <Reveal as="p" className="mode-intro">Scroll lights up the role I use next: make it visible, make it clear, get it found, and test what worked.</Reveal>
          </div>
          <motion.div
            className="mode-console"
            data-role-wire
            aria-label="Connected modes in Lohith's marketing workflow"
          >
            <div className="mode-stage-wrap">
              <AnimatePresence mode="wait">
                <motion.article
                  className={`mode-stage ${activeMode.className}`}
                  key={activeMode.title}
                  initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -22, scale: 0.97, filter: "blur(10px)" }}
                  transition={{ duration: 0.42, ease: easeOut }}
                >
                  <span className="mode-stage-index">{String(activeIndex + 1).padStart(2, "0")}</span>
                  <span className="mode-stage-output">{activeMode.output}</span>
                  <motion.span
                    className="mode-stage-icon"
                    aria-hidden="true"
                    initial={{ rotate: -8, scale: 0.86 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <ActiveIcon weight="bold" aria-hidden="true" />
                    {ActiveAssistIcon && <ActiveAssistIcon className="mode-icon-assist" weight="bold" aria-hidden="true" />}
                  </motion.span>
                  <h3>{activeMode.title}</h3>
                  <p>{activeMode.line}</p>
                  <TagPillStack tags={activeMode.tags} />
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="mode-rail" aria-label="All marketing modes">
              {modes.map((mode, index) => {
                const isActive = index <= activeIndex;
                const isCurrent = index === activeIndex;
                const Icon = mode.Icon;

                return (
                  <motion.button
                    type="button"
                    className={`mode-lane ${mode.className}${isActive ? " active" : ""}${isCurrent ? " current" : ""}`}
                    data-mode-card
                    key={mode.title}
                    initial={{ opacity: 0, x: 42 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: index * 0.08, ease: easeOut }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="mode-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mode-icon" aria-hidden="true">
                      <Icon weight="bold" aria-hidden="true" />
                    </span>
                    <div className="mode-copy">
                      <h3>{mode.title}</h3>
                    </div>
                    <span className="mode-output">{mode.output}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="tools panel-cream" id="tools" aria-labelledby="tools-title">
      <div className="section-shell">
        <div className="section-heading">
          <Reveal as="p" className="section-label">marketing toolkit</Reveal>
          <Reveal as="h2" className="section-title" id="tools-title">Tools I work with</Reveal>
          <SplitText className="section-intro">The stack changes. The habit is the same: build fast, keep proof visible, and clean up the loop.</SplitText>
        </div>
        <MotionDock className="tool-dock" items={tools} />
      </div>
    </section>
  );
}

function Certifications() {
  const certs = [
    {
      name: "Anthropic certification",
      href: "https://verify.skilljar.com/c/3ijn9pvhki9r",
      image: asset("assets/images/cert-anthropic.svg"),
      className: "cert-card-anthropic"
    },
    {
      name: "HubSpot Marketing Hub Software certification",
      href: "https://app-eu1.hubspot.com/academy/achievements/qds82rz3/en/1/lohith-lalesh/hubspot-marketing-hub-software",
      image: asset("assets/images/cert-hubspot.svg"),
      className: "cert-card-hubspot"
    },
    {
      name: "Meta certification",
      href: "https://www.facebookblueprint.com/student/award/YrUV5FjmMrDFQHb9hH5iHouE",
      image: asset("assets/images/cert-meta.svg"),
      className: "cert-card-meta"
    }
  ];

  return (
    <section className="certifications panel-dark" id="work" aria-labelledby="work-title">
      <div className="section-shell">
        <div className="section-heading work-heading cert-heading centered">
          <Reveal as="h2" className="section-title" id="work-title">Certification Board.</Reveal>
        </div>
        <AnimatedGroup className="cert-board" aria-label="Certification board" stagger={0.08} amount={0.2}>
          {certs.map((cert, index) => (
            <MotionCard
              className={`cert-card ${cert.className} reveal is-visible`}
              href={cert.href}
              target="_blank"
              rel="noopener"
              aria-label={`Open ${cert.name}`}
              key={cert.name}
              hover={{ y: -8, scale: 1.035 }}
              custom={index}
            >
              <img src={cert.image} alt="" aria-hidden="true" />
            </MotionCard>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}

function NotesSection() {
  return (
    <section className="notes panel-cream" id="notes" aria-labelledby="notes-title">
      <div className="section-shell">
        <div className="section-heading centered">
          <Reveal as="p" className="section-label">notes</Reveal>
          <Reveal as="h2" className="section-title" id="notes-title">Field Notes.</Reveal>
        </div>
        <CMSHoverGallery
          className="note-grid"
          items={notes}
          renderItem={(note) => (
            <>
              <span>{note.tag}</span>
              <strong>{note.title}</strong>
              <p>{note.text}</p>
              <small>{note.meta}</small>
            </>
          )}
        />
      </div>
    </section>
  );
}

function ContactSection() {
  const links = [
    ["lohithlalesh@gmail.com", "mailto:lohithlalesh@gmail.com"],
    ["LinkedIn", "https://www.linkedin.com/in/lohith-lalesh/"],
    ["Behance", "https://www.behance.net/gallery/241374557/Full-Digital-Marketing-Portfolio"],
    ["Anthropic certificate", "https://verify.skilljar.com/c/3ijn9pvhki9r"],
    ["HubSpot certificate", "https://app-eu1.hubspot.com/academy/achievements/qds82rz3/en/1/lohith-lalesh/hubspot-marketing-hub-software"],
    ["Meta certificate", "https://www.facebookblueprint.com/student/award/YrUV5FjmMrDFQHb9hH5iHouE"]
  ];

  return (
    <section className="contact panel-dark" id="contact" aria-labelledby="contact-title">
      <div className="section-shell contact-grid">
        <div>
          <Reveal as="p" className="contact-kicker">available for sharp, messy, useful work</Reveal>
          <Reveal as="h2" className="section-title" id="contact-title">Bring me in before the work becomes a handoff problem.</Reveal>
        </div>
        <AnimatedGroup className="contact-actions" stagger={0.045}>
          {links.map(([label, href]) => (
            <MotionCard
              className="contact-pill"
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener" : undefined}
              key={href}
              hover={{ x: 8 }}
            >
              {label}
            </MotionCard>
          ))}
        </AnimatedGroup>
      </div>
      <VisitorWall />
    </section>
  );
}

function VisitorWall() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState(wallColors[0]);
  const [size, setSize] = useState(8);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [marks, setMarks] = useState([]);
  const [status, setStatus] = useState(hasSupabase ? "Shared wall ready." : "Local memory active.");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const localMarks = loadLocalMarks();
    setMarks(localMarks);

    let cancelled = false;
    if (!hasSupabase) return undefined;

    fetchSharedMarks()
      .then((sharedMarks) => {
        if (cancelled) return;
        setMarks((current) => mergeMarks(sharedMarks, current, localMarks));
        setStatus("Shared wall connected.");
      })
      .catch(() => {
        if (!cancelled) setStatus("Shared wall unavailable. Local memory still works.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const snapshot = canvas.width && canvas.height ? canvas.toDataURL("image/png") : "";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.lineCap = "round";
      context.lineJoin = "round";
      contextRef.current = context;

      if (snapshot) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, rect.width, rect.height);
        image.src = snapshot;
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    window.addEventListener("orientationchange", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, []);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const drawTo = (point) => {
    const context = contextRef.current;
    const lastPoint = lastPointRef.current || point;
    if (!context) return;

    context.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.lineWidth = tool === "erase" ? size * 2.2 : size;
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  };

  const startDrawing = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    const point = getPoint(event);
    lastPointRef.current = point;
    drawTo(point);
  };

  const moveDrawing = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    drawTo(getPoint(event));
  };

  const stopDrawing = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    setStatus("Canvas cleared.");
  };

  const isCanvasBlank = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return true;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] > 0) return false;
    }
    return true;
  };

  const saveMark = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isCanvasBlank()) {
      setStatus("Draw something first.");
      return;
    }

    const mark = {
      id: createId(),
      author: clampText(author, "visitor", 34),
      message: clampText(message, "left a mark", 90),
      imageData: canvas.toDataURL("image/png"),
      createdAt: new Date().toISOString()
    };

    setSaving(true);
    const localMarks = mergeMarks(mark, loadLocalMarks());
    saveLocalMarks(localMarks);
    setMarks((current) => mergeMarks(mark, current));

    try {
      if (hasSupabase) {
        await saveSharedMark(mark);
        const sharedMarks = await fetchSharedMarks();
        setMarks((current) => mergeMarks(sharedMarks, current, localMarks));
        setStatus("Saved to the shared wall.");
      } else {
        setStatus("Saved in this browser. Add Supabase env vars for a public wall.");
      }
    } catch {
      setStatus("Saved locally. Shared wall needs Supabase setup.");
    } finally {
      setSaving(false);
      setMessage("");
    }
  };

  return (
    <div className="visitor-wall" id="visitor-wall" aria-labelledby="visitor-wall-title">
      <div className="section-shell visitor-wall-grid">
        <div className="visitor-wall-copy">
          <Reveal as="p" className="section-label">visitor wall</Reveal>
          <Reveal as="h2" className="section-title" id="visitor-wall-title">Leave a mark.</Reveal>
          <p>
            Scribble a thought, sign the floor, or leave a tiny mess. This wall remembers locally and can sync publicly through Supabase.
          </p>
          <span className={`wall-memory-pill${hasSupabase ? " is-live" : ""}`}>
            {hasSupabase ? "shared memory" : "local memory"}
          </span>
        </div>

        <div className="canvas-board">
          <div className="canvas-toolbar" aria-label="Drawing tools">
            <button
              className={tool === "draw" ? "active" : ""}
              type="button"
              aria-label="Draw"
              title="Draw"
              onClick={() => setTool("draw")}
            >
              <PaintBrush weight="bold" />
            </button>
            <button
              className={tool === "erase" ? "active" : ""}
              type="button"
              aria-label="Erase"
              title="Erase"
              onClick={() => setTool("erase")}
            >
              <Eraser weight="bold" />
            </button>
            <div className="wall-colors" aria-label="Ink color">
              {wallColors.map((ink) => (
                <button
                  className={color === ink ? "active" : ""}
                  type="button"
                  aria-label={`Use ${ink} ink`}
                  title={ink}
                  style={{ "--ink": ink }}
                  onClick={() => {
                    setColor(ink);
                    setTool("draw");
                  }}
                  key={ink}
                ></button>
              ))}
            </div>
            <label className="brush-size">
              <span>size</span>
              <input
                type="range"
                min="3"
                max="22"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
              />
            </label>
            <button type="button" aria-label="Clear canvas" title="Clear" onClick={clearCanvas}>
              <Trash weight="bold" />
            </button>
          </div>

          <canvas
            className={`visitor-canvas is-${tool}`}
            ref={canvasRef}
            aria-label="Drawing canvas for visitor messages"
            onPointerDown={startDrawing}
            onPointerMove={moveDrawing}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          ></canvas>

          <div className="wall-form">
            <input
              type="text"
              value={author}
              maxLength="34"
              placeholder="name / alias"
              aria-label="Name or alias"
              onChange={(event) => setAuthor(event.target.value)}
            />
            <input
              type="text"
              value={message}
              maxLength="90"
              placeholder="short note"
              aria-label="Short note"
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="button" onClick={saveMark} disabled={saving}>
              <FloppyDisk weight="bold" />
              <span>{saving ? "saving" : "save mark"}</span>
            </button>
          </div>
          <p className="wall-status" role="status">{status}</p>
        </div>
      </div>

      {marks.length > 0 && (
        <div className="section-shell wall-gallery" aria-label="Saved visitor marks">
          {marks.map((mark) => (
            <figure className="wall-mark" key={mark.id}>
              <img src={mark.imageData} alt={`Visitor scribble by ${mark.author}`} />
              <figcaption>
                <strong>{mark.message}</strong>
                <span>{mark.author}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  usePointerLayer(dotRef, ringRef);
  useSpotlight();

  useEffect(() => {
    return () => document.body.classList.remove("is-portrait-hover", "cursor-ready");
  }, []);

  return (
    <>
      <div className="noise" aria-hidden="true"></div>
      <div className="cursor-dot" aria-hidden="true" ref={dotRef}></div>
      <div className="cursor-ring" aria-hidden="true" ref={ringRef}></div>
      <ScrollProgressBar />
      <MusicToggle />
      <Header />
      <main id="home">
        <Hero />
        <OperatingMessage />
        <QuoteSection />
        <ModesSection />
        <ToolsSection />
        <Certifications />
        <NotesSection />
        <ContactSection />
      </main>
    </>
  );
}
