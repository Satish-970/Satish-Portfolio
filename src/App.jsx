import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Banner from './components/Banner';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';
import 'lenis/dist/lenis.css';

const Home = ({ loading, setLoading, triggerLoading }) => {
  const [tourStatus, setTourStatus] = useState('idle'); // idle, starting, scrolling, stopping, finishing
  const [preloaderText, setPreloaderText] = useState(null);
  const scrollRef = useRef(null);

  // Stop tour helper
  const stopTour = (isManual = false) => {
    if (isManual) {
      setTourStatus('stopping');
      setPreloaderText(["Auto scrolling is stopping...", "Returning to manual control"]);
      setLoading(true);
      // After a brief pause to show the message, reset to idle
      setTimeout(() => {
        setTourStatus('idle');
        setLoading(false);
        setPreloaderText(null);
      }, 2000); // Show "stopping" message for 2s
    } else {
      setTourStatus('idle');
      setPreloaderText(null);
    }

    // Cancel any pending scroll timeouts
    if (scrollRef.current) clearInterval(scrollRef.current);
  };

  const handleLogoClick = () => {
    if (tourStatus === 'idle') {
      // Start Tour
      setTourStatus('starting');
      setPreloaderText(["Initializing Auto Scroll...", "Click logo again to stop"]);
      setLoading(true);
      window.scrollTo(0, 0);
    } else if (tourStatus === 'scrolling' || tourStatus === 'starting') {
      // Stop Tour
      stopTour(true);
    }
  };

  // Handle tour state transitions after loading finishes
  useEffect(() => {
    if (!loading) {
      if (tourStatus === 'starting') {
        setTourStatus('scrolling');
      } else if (tourStatus === 'finishing') {
        // When finished naturally, just reset
        stopTour(false);
        window.scrollTo(0, 0);
      }
    }
  }, [loading, tourStatus]);

  // Handle the continuous scrolling logic
  useEffect(() => {
    if (tourStatus === 'scrolling') {
      const scrollStep = () => {
        // Check if we reached the bottom
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
          setTourStatus('finishing');
          setPreloaderText(["Tour Complete", "Returning to top..."]);
          setLoading(true);
          if (scrollRef.current) clearInterval(scrollRef.current);
          return;
        }

        // Scroll 3px roughly every 20ms -> ~150px/sec 
        // "7 lines per sec" -> ~140px / 1s.
        window.scrollBy(0, 3);
      };

      // Use setInterval for linear constant speed which is often smoother for slow scrolls than RAF
      // RAF attempts 60fps which means 0.2px per frame for this speed, which can be jittery due to pixel snapping.
      // 1px steps at lower frequency is often perceived as "smoother" for reading pace.
      scrollRef.current = setInterval(scrollStep, 20);
    }

    return () => {
      if (scrollRef.current) clearInterval(scrollRef.current);
    };
  }, [tourStatus, setLoading]);

  // Strict Hash Validation
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // List of valid section IDs (must match id="..." in components)
    const validHashes = ['', '#', '#home', '#about', '#resume', '#project', '#service', '#blog', '#contact'];

    if (location.hash && !validHashes.includes(location.hash)) {
      // If hash is present but NOT valid, redirect to 404
      navigate('/404');
    }
  }, [location, navigate]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onLoaded={() => setLoading(false)} customText={preloaderText} />}
      </AnimatePresence>

      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        <CustomCursor />
        <ScrollToTop onRefresh={triggerLoading} />
        <Navbar
          onRefresh={triggerLoading}
          onLogoClick={handleLogoClick}
          isTourActive={tourStatus === 'scrolling' || tourStatus === 'starting'}
        />
        <Hero />
        <About />
        <Banner />
        <Resume />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Jotform Script
    const script = document.createElement('script');
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js";
    script.async = true;
    script.onload = () => {
      // Small delay to ensure script loaded fully
      setTimeout(() => {
        if (window.AgentInitializer) {
          window.AgentInitializer.init({
            agentRenderURL: "https://agent.jotform.com/0196780295ee7122bd0ba94b69563ee95eb1",
            rootId: "JotformAgent-0196780295ee7122bd0ba94b69563ee95eb1",
            formID: "https://form.jotform.com/251165265378058",
            queryParams: ["skipWelcome=1", "maximizable=1"],
            domain: "https://www.jotform.com",
            isDraggable: false,
            background: "linear-gradient(180deg, #8a660e 0%, #0E408A 100%)",
            buttonBackgroundColor: "#051258",
            buttonIconColor: "#FFFFFF",
            variant: false,
            customizations: {
              "greeting": "Yes",
              "greetingMessage": "Hi! I am Satish's Assistant, How can I assist you?",
              "openByDefault": "No",
              "pulse": "Yes",
              "position": "right",
              "autoOpenChatIn": "0"
            },
            isVoice: false,
          });
        }
      }, 100);
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // ignore if already removed
      }
    };
  }, []);

  useEffect(() => {
    // Header padding adjustment
    const adjustHeaderPadding = () => {
      const navbar = document.querySelector('nav');
      const headerContainer = document.querySelector('.header__container');
      if (navbar && headerContainer) {
        const navbarHeight = navbar.offsetHeight;
        // Increased padding to ensure no overlap and added extra spacing
        headerContainer.style.paddingTop = `${navbarHeight + 40}px`;
      }
    };

    // Run initially and on resize
    adjustHeaderPadding();
    window.addEventListener('resize', adjustHeaderPadding);

    // Also run when loading finishes to ensure layout is correct
    if (!loading) {
      // Multiple checks to ensure layout settles
      setTimeout(adjustHeaderPadding, 100);
      setTimeout(adjustHeaderPadding, 500);
    }

    return () => window.removeEventListener('resize', adjustHeaderPadding);
  }, [loading]);

  const triggerLoading = () => {
    setLoading(true);
    // Smooth scroll to top when refreshing
    window.scrollTo(0, 0);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home loading={loading} setLoading={setLoading} triggerLoading={triggerLoading} />} />
        <Route path="*" element={<> <CustomCursor /> <NotFound /> </>} />
      </Routes>
    </Router>
  );
}

export default App;
