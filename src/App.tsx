import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import favicon from "/favicon.ico";

import heroEye from "@/assets/hero-eye.png";

import WelcomeScreen from "@/components/WelcomeScreen";
import FrontendDeveloperSection from "@/components/FrontendDeveloperSection";
import Showcase from "./components/Showcase";
import ContactSection from "@/components/ContactSection";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";


const logos = ["RAGURAMAN", "CYBERSECURITY", "PYTHON", "DEVELOPER", "AI-ASSISTED"];

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [time, setTime] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const text = "RAGURAMAN";
  const [displayed, setDisplayed] = useState("");
  const [colorMode, setColorMode] = useState(0);

  const roles = [
    "Cyber Security Enthusiast",
    "Python Programmer",
    "AI-Assisted Web Developer"
  ];
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const colors = [
    "bg-gradient-to-b from-white via-gray-200 via-gray-500 to-black text-transparent bg-clip-text",
    "text-white",
    "bg-gradient-to-b from-black via-gray-500 via-gray-200 to-white text-transparent bg-clip-text",
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWelcome || mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showWelcome, mobileMenu]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    function type() {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i < text.length) setTimeout(type, 200);
    }
    type();
  }, []);

  useEffect(() => {
    let timer: any;
    const currentFull = roles[roleIdx];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setRoleText((prev) => prev.slice(0, -1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setRoleText((prev) => currentFull.slice(0, prev.length + 1));
      }, 100);
    }

    if (!isDeleting && roleText === currentFull) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIdx((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIdx]);

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
          <AnimatePresence>{showWelcome && <WelcomeScreen />}</AnimatePresence>

          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-xl bg-black/20 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={favicon}
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover"
              />

              <span className="text-[10px] md:text-xs tracking-[0.3em] text-white/70 uppercase font-medium">
                RAGURAMAN
              </span>
            </div>
            <ul className="hidden md:flex items-center gap-10 text-xs tracking-widest text-white/70 uppercase">
              <li
                onClick={() =>
                  document.getElementById("Home")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="relative hover:text-white transition-colors cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </li>

              <li
                onClick={() =>
                  document.getElementById("about")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="relative hover:text-white transition-colors cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                About
              </li>

              <li
                onClick={() =>
                  document.getElementById("showcase")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="relative hover:text-white transition-colors cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Showcase
              </li>

              <li
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="relative hover:text-white transition-colors cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Contact
              </li>
            </ul>

            <div className="hidden md:block text-[10px] tracking-[0.3em] text-white/70 uppercase">
              {time}
            </div>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden text-white z-50"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>


          {mobileMenu && (
            <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-10 text-white uppercase tracking-[0.3em] text-sm md:hidden">

              <div className="absolute top-30 text-center">
                <p className="text-[10px] text-white/40 tracking-[0.3em] mb-2">
                  TIME
                </p>

                <h2 className="text-2xl tracking-widest font-semibold">
                  {time}
                </h2>
              </div>

              <button
                onClick={() => {
                  document.getElementById("Home")?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setMobileMenu(false);
                }}
                className="relative after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Home
              </button>

              <button
                onClick={() => {
                  document.getElementById("about")?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setMobileMenu(false);
                }}
                className="relative after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                About
              </button>

              <button
                onClick={() => {
                  document.getElementById("showcase")?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setMobileMenu(false);
                }}
                className="relative after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Showcase
              </button>

              <button
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setMobileMenu(false);
                }}
                className="relative after:absolute after:left-0 after:-bottom-2 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Contact
              </button>
            </div>
          )}

          <section
            id="Home"
            className="relative w-full h-screen min-h-[640px] overflow-hidden bg-black"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={heroEye}
                alt="Hero"
                className="h-[90%] w-[90%] object-contain object-center"
              />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 md:px-12 pt-24 pb-10">
              <div>
                <span className="text-[10px] md:text-xs tracking-[0.45em] text-white/50 uppercase font-mono mb-4 block">
                  Hello, I'm
                </span>
                <h1
                  onClick={() => setColorMode((prev) => (prev + 1) % colors.length)}
                  className={`font-display uppercase leading-[0.85] tracking-[-0.03em] text-[22vw] md:text-[14vw] lg:text-[13rem] cursor-pointer transition-all duration-300 ${colors[colorMode]}`}
                >
                  {displayed || "\u00A0"}
                </h1>
                <div className="mt-4">
                  <p className="text-sm md:text-base text-white/70 font-semibold tracking-wider font-[Poppins] uppercase">
                    Computer Science Engineering Student
                  </p>
                  <div className="h-6 mt-2 flex items-center gap-2 text-accent font-mono text-xs md:text-sm uppercase tracking-widest">
                    <span>✦</span>
                    <span className="typing-text">{roleText}</span>
                    <span className="animate-pulse w-1.5 h-4 bg-accent inline-block"></span>
                  </div>
                </div>
              </div>

              <p className="md:absolute md:top-28 md:right-12
mt-4 md:mt-0
text-right
text-3xl md:text-4xl lg:text-5xl
leading-[1.05]
max-w-md
font-[Poppins] font-bold
tracking-wide
text-transparent bg-clip-text
bg-[length:200%_auto]
bg-gradient-to-r
from-white via-white/60 to-white
animate-[shine_4s_linear_infinite]">
                Creating
                <br />
                Websites
                <br />
                That Feel
                <br />
                Alive.
              </p>

              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-auto">
                <p className="relative text-sm sm:text-base lg:text-lg
    leading-relaxed max-w-md
    font-[Poppins] font-medium
    tracking-wide
    text-transparent bg-clip-text
    bg-[length:200%_auto]
    bg-gradient-to-r
    from-white via-white/60 to-white
    animate-[shine_4s_linear_infinite]">
                  Building secure, efficient, and user-friendly applications{" "} <br />
                  <em className="not-italic text-white">
                    with modern cybersecurity standards.
                  </em>
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() =>
                      document.getElementById("showcase")?.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                    className="inline-flex items-center gap-2 border border-accent bg-accent text-black px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-transparent hover:text-white transition-all duration-300 rounded-full cursor-pointer"
                  >
                    View Projects
                    <ArrowUpRight size={12} />
                  </button>
                  <a
                    href="/assets/resume/RAGURAMAN_Resume.pdf"
                    download="RAGURAMAN_Resume.pdf"
                    className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-black transition-all duration-300 rounded-full cursor-pointer"
                  >
                    Download Resume
                    <ArrowUpRight size={12} />
                  </a>
                  <button
                    onClick={() =>
                      document.getElementById("contact")?.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                    className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-black transition-all duration-300 rounded-full cursor-pointer"
                  >
                    Contact Me
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-black border-t border-white/10 py-5 overflow-hidden">
            <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
              {[...logos, ...logos, ...logos].map((logo, i) => (
                <span
                  key={i}
                  className="text-white/40 text-xs tracking-[0.3em] uppercase font-medium"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>


          <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>

          <section id="about">
            <FrontendDeveloperSection />
          </section>
          <section id="showcase">
            <Showcase />
          </section>
          <section id="contact">
            <ContactSection />
          </section>
        </div>
      } 
    />

      <Route path="/about" element={<About />} />
    </Routes>

  );
}