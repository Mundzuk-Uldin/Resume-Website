import React, { useState, useEffect, useRef } from 'react';

const ResumeWebsite = () => {
  // Add CSS to prevent overflow issues
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.style.overflowX = '';
    };
  }, []);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBinaryRain, setShowBinaryRain] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [typedText, setTypedText] = useState('');

  // References for animated sections
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const binaryRainCanvasRef = useRef(null);
  
  const fullText = "Computer Science Student & Developer";
  const typingSpeed = 80;
  const [visibleSections, setVisibleSections] = useState({});

  // Binary Rain Animation
  useEffect(() => {
    if (!showBinaryRain) return;

    const canvas = binaryRainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Character set for the rain
    const chars = '01';
    
    // Column setup
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Drops array - one per column
    // Each value represents the y position of the drop
    const drops = [];
    for (let i = 0; i < columns; i++) {
      // Start drops at random positions for a more natural look
      drops[i] = Math.random() * -canvas.height;
    }
    
    // Colors
    const greenColors = [
      '#36FF5A', // Bright green
      '#00CC66', // Medium green
      '#50C878', // Paris green
      '#5AECC0', // Teal
      '#77DD77', // Light green
      '#50BFE6'  // Teal blue
    ];
    
    // Drawing function
    const draw = () => {
      // Semi transparent to create trail effect
      ctx.fillStyle = 'rgba(0, 5, 24, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Random green color
        const colorIndex = Math.floor(Math.random() * greenColors.length);
        ctx.fillStyle = drops[i] > canvas.height * 0.36 ? greenColors[colorIndex] : '#FFF';
        
        // Random opacity for some characters
        ctx.globalAlpha = Math.random() * 0.4 + 0.6;
        
        // Random font size variation
        const size = fontSize + (Math.random() * 6 - 3);
        ctx.font = `${size}px monospace`;
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i]);
        
        // Move the drop down
        drops[i] += Math.random() * 6 + 3;
        
        // If the drop reaches the bottom, reset it to the top
        if (drops[i] > canvas.height) {
          drops[i] = Math.random() * -100;
        }
      }
      
      // Reset alpha
      ctx.globalAlpha = 1;
    };
    
    const rainInterval = setInterval(draw, 60);
    
    // End animation after 4 seconds
    const endAnimation = setTimeout(() => {
      clearInterval(rainInterval);
      setShowBinaryRain(false);
      setIntroComplete(true);
    }, 4000);
    
    return () => {
      clearInterval(rainInterval);
      clearTimeout(endAnimation);
    };
  }, [showBinaryRain]);

  // Typing effect for hero section
  useEffect(() => {
    if (!introComplete) return;
    
    if (typedText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeoutId);
    }
  }, [typedText, introComplete]);

  // Intersection observer for animations
  useEffect(() => {
    if (!introComplete) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = [aboutRef, experienceRef, projectsRef, skillsRef, contactRef];
    sections.forEach(sectionRef => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    });

    return () => {
      sections.forEach(sectionRef => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      });
    };
  }, [introComplete]);

  // Active section tracking for navigation
  useEffect(() => {
    if (!introComplete) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = document.querySelectorAll('section');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.id;
        }
      });
      
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set the active section
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, introComplete]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  // Animation class helpers
  const getFadeInClass = (sectionId) => {
    return visibleSections[sectionId] 
      ? 'opacity-100 translate-y-0 transition-all duration-1000 ease-out' 
      : 'opacity-0 translate-y-10 transition-all duration-1000 ease-out';
  };

  if (showBinaryRain) {
    return (
      <div className="fixed inset-0 bg-[#000518] flex items-center justify-center z-50 w-full overflow-hidden">
        <canvas 
          ref={binaryRainCanvasRef} 
          className="absolute inset-0 w-full h-full"
        ></canvas>
        <div className="relative z-10 text-center text-white">
          <div className="mb-4">
            <h1 className="text-4xl font-extrabold animate-pulse">Miguel Pineda</h1>
            <p className="text-xl mt-2 animate-fadeIn">Portfolio Loading</p>
          </div>
          <div className="w-40 h-1 bg-teal-500 mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-white animate-loadingBar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased bg-[#060818] text-gray-100 selection:bg-teal-400 selection:text-gray-900 w-full overflow-x-hidden">
      {/* Particle background */}
      <div className="fixed inset-0 z-0 w-full">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] bg-[20px_20px]"></div>
      </div>

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md bg-[#060818]/70 border-b border-teal-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a 
            href="#home" 
            className="text-xl font-bold text-teal-400 transition-all duration-300 transform hover:scale-105 hover:text-white flex items-center"
          >
            <span className="text-2xl mr-2">{"{ "}</span>
            <span>Miguel Pineda</span>
            <span className="text-2xl ml-2">{" }"}</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map(item => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    className={`text-sm font-medium transition-all duration-300 relative group
                      ${activeSection === item.id ? 'text-teal-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    {item.label}
                    <span 
                      className={`absolute -bottom-1 left-0 h-[2px] bg-teal-400 transition-all duration-300 
                      ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    ></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-400 hover:text-teal-400 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          className={`md:hidden bg-[#0c0e22] border-t border-teal-500/20 transition-all duration-500 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col space-y-1 px-4 pt-2">
            {navItems.map(item => (
              <li key={item.id} className="transform transition-transform duration-300 hover:translate-x-2">
                <a 
                  href={`#${item.id}`} 
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500 pl-4' 
                      : 'text-gray-400 hover:bg-teal-500/5 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="relative min-h-screen flex items-center pt-16 overflow-hidden w-full"
      >
        {/* Hero Background Elements */}
        <div className="absolute inset-0 z-0 w-full">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1025] via-[#121638] to-[#0a0e2a] opacity-100"></div>
          
          {/* Gradient orbs/blobs */}
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-purple-600/20 filter blur-[80px] animate-float opacity-70"></div>
          <div className="absolute -bottom-20 left-0 w-80 h-80 rounded-full bg-teal-600/20 filter blur-[60px] animate-float-delay opacity-70"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDc5LCAyMDksIDE5NywgMC4xKSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] bg-[60px_60px] opacity-30"></div>
          
          {/* Cyberpunk-style decorations */}
          <div className="absolute top-1/3 left-10 w-40 border-t border-teal-500/30"></div>
          <div className="absolute top-1/3 left-10 w-5 h-5 border-2 border-teal-500/30 rotate-45 translate-y-[-50%]"></div>
          <div className="absolute bottom-1/4 right-10 w-40 border-b border-purple-500/30"></div>
          <div className="absolute bottom-1/4 right-10 w-5 h-5 border-2 border-purple-500/30 rotate-45 translate-y-[50%]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block relative mb-4">
                <span className="text-teal-400 text-sm font-mono relative left-0 top-0">&lt;h1&gt;</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-400 to-teal-200 py-2 leading-tight">
                  Miguel Angel<br/>Pineda Espinoza
                </h1>
                <span className="text-teal-400 text-sm font-mono relative left-0 bottom-0">&lt;/h1&gt;</span>
              </div>
              
              <div className="relative mb-8 pl-4 border-l-2 border-teal-500">
                <p className="text-2xl text-gray-300 h-8">
                  {typedText}
                  <span className="inline-block w-2 h-6 ml-1 bg-teal-400 animate-blink"></span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#contact" 
                  className="group relative px-6 py-3 font-medium text-white transition-all duration-500 ease-in-out bg-gradient-to-br from-teal-600 to-teal-400 rounded-md overflow-hidden shadow-md hover:shadow-xl"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out transform"></span>
                  <span className="relative z-10 flex items-center">
                    Contact Me
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </a>
                <a 
                  href="#projects" 
                  className="group relative px-6 py-3 font-medium text-white transition-all duration-500 ease-in-out bg-transparent border border-teal-500/50 rounded-md overflow-hidden shadow-md hover:shadow-xl"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out transform"></span>
                  <span className="relative z-10 flex items-center">
                    View Projects
                  </span>
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                {/* Animated hexagonal frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 md:w-80 md:h-80 animate-spin-slow">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="50,3 95,25 95,75 50,97 5,75 5,25" fill="none" stroke="rgba(79, 209, 197, 0.2)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                
                {/* Animated glowing orb */}
                <div className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-tr from-teal-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center text-white text-6xl font-bold animate-pulse-slow">
                  <span className="animate-float z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">MAP</span>
                </div>
                
                {/* Light flare effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="absolute top-0 left-1/4 w-2 h-2 bg-teal-400 rounded-full animate-flare opacity-80"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-flare-delay opacity-80"></div>
                </div>
                
                {/* Glow reflection */}
                <div className="absolute -bottom-4 w-full h-20 bg-gradient-to-t from-teal-500/20 to-transparent opacity-30 filter blur-xl rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-gray-400 text-sm mb-2 animate-pulse">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-teal-500/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-teal-400 rounded-full animate-scrollDown"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        ref={aboutRef}
        className="relative py-24"
      >
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060818] via-[#0a0e20] to-[#060818] z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <div className="absolute right-0 top-1/3 w-32 h-32 bg-purple-600/10 filter blur-3xl rounded-full"></div>
        <div className="absolute left-0 bottom-1/3 w-24 h-24 bg-teal-600/10 filter blur-2xl rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-16 relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">About Me</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400/0 via-teal-400 to-teal-400/0"></span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-400 rotate-45"></span>
            </h2>
            <div className={`max-w-3xl mx-auto w-full ${getFadeInClass('about')}`}>
              <div className="relative bg-[#0c0e22] rounded-lg p-6 mb-8 overflow-hidden shadow-lg border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                {/* Decorative corner accent */}
                <div className="absolute -top-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-teal-500/20 rounded-br-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-teal-500/20 rounded-tl-xl"></div>
                
                <h3 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Education
                </h3>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 relative z-10">
                  <div>
                    <h4 className="text-lg font-medium text-white">Bachelor of Science in Computer Science</h4>
                    <p className="text-gray-400">Florida International University</p>
                  </div>
                  <div className="mt-2 md:mt-0 flex flex-col items-end">
                    <span className="bg-teal-400/10 text-teal-400 text-xs font-medium px-2.5 py-0.5 rounded-md border border-teal-400/20">GPA 3.98</span>
                    <p className="text-gray-400 text-sm mt-1">Expected graduation: Spring 2027</p>
                  </div>
                </div>
              </div>
              <div className="text-gray-400 leading-relaxed px-4 py-6 rounded-lg relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 via-purple-500 to-teal-500 opacity-70 rounded-full"></div>
                <p className="ml-6 transform transition-all duration-500 hover:translate-x-1">
                  I am a Computer Science student at Florida International University with experience in front-end development,
                  data analysis, and application development. I am passionate about creating innovative solutions and have
                  worked with various technologies including JavaScript, Python, Java, and React.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        id="experience" 
        ref={experienceRef}
        className="relative py-24"
      >
        {/* Section background with subtle pattern */}
        <div className="absolute inset-0 bg-[#070a1c] z-0 opacity-80"></div>
        
        {/* Diagonal divider */}
        <div className="absolute top-0 left-0 w-full h-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-[#060818] transform -skew-y-2"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-20 bg-[#060818] transform skew-y-2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-16 relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">Work Experience</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400/0 via-purple-400 to-teal-400/0"></span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rotate-45"></span>
            </h2>
            <div className={`max-w-3xl mx-auto ${getFadeInClass('experience')}`}>
              <div className="relative bg-[#0c0e22] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(45,212,191,0.1)] group">
                {/* Hexagonal pattern background */}
                <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDg0IDQ4Ij48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDBoMTJ2NmgtNnYxOGg2djZIMHYtNmg2Vi0xMkgwek04NCAxOHYxMmgtNlYxOGgtNnYtNmgxMnY2em0tNDggMTJINDh2LTZoLTZ2LTZoNnYtNmgtNnYtNmgxMnYzMGgtNnYtNnptLTI0IDBIMjR2LTZoLTZ2LTZoNnYtNmgtNnYtNmgxMnYzMGgtNnYtNnptMzAgMGg2di02aC02djZoLTZ2LTZoLTZ2LTZoMTJ2MThIOTZoLTZWMTJ6TTc4IDZoNnY2aC02eiIvPjwvc3ZnPg==')] group-hover:opacity-10 transition-opacity duration-500"></div>
                
                {/* Glowing border on hover */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-teal-500 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-teal-500 to-transparent"></div>
                </div>
                
                <div className="p-6 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-teal-400 transition-colors duration-300">Front-end Development Internship</h3>
                      <p className="text-gray-400">Elicrom Ltd.</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="text-gray-400 text-sm px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50 group-hover:border-teal-500/30 transition-colors duration-300">May 2024 - Aug 2024</span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-6 relative z-10">
                    <li className="transform transition-all duration-500 hover:translate-x-2 pl-8 relative">
                      <div className="absolute left-0 top-0 w-5 h-5 rounded-md bg-teal-400/10 border border-teal-400/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                      </div>
                      <p className="text-gray-300">
                        Processed and refined large datasets for financing analysis using 
                        <span className="font-medium text-teal-400"> Pandas</span>, 
                        improving data accuracy and retrieval efficiency for the software ELISA.
                      </p>
                    </li>
                    <li className="transform transition-all duration-500 hover:translate-x-2 pl-8 relative">
                      <div className="absolute left-0 top-0 w-5 h-5 rounded-md bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      </div>
                      <p className="text-gray-300">
                        Designed and implemented interactive data visualizations for shipping and processing costs using 
                        <span className="font-medium text-purple-400"> Matplotlib</span>, 
                        enabling better cost analysis.
                      </p>
                    </li>
                    <li className="transform transition-all duration-500 hover:translate-x-2 pl-8 relative">
                      <div className="absolute left-0 top-0 w-5 h-5 rounded-md bg-pink-400/10 border border-pink-400/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                      </div>
                      <p className="text-gray-300">
                        Modernized the Elicrom.com website by revamping the UI/UX with 
                        <span className="font-medium text-pink-400"> JavaScript, HTML, and CSS</span>, 
                        resulting in improved responsiveness and faster load times.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        ref={projectsRef}
        className="relative py-24"
      >
        {/* Section background */}
        <div className="absolute inset-0 bg-[#060818] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-16 relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-teal-400">Projects</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-400/0 via-teal-400 to-pink-400/0"></span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-400 rotate-45"></span>
            </h2>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${getFadeInClass('projects')}`}>
              {/* Project 1 - Cassandra */}
              <div className="group relative rounded-lg overflow-hidden hover:z-10">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg animate-gradient p-0.5">
                  <div className="absolute inset-0 bg-[#0c0e22] rounded-lg"></div>
                </div>
                
                <div className="relative p-6 bg-[#0c0e22] rounded-lg h-full flex flex-col transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_5px_15px_rgba(45,212,191,0.15)]">
                  {/* Project icon */}
                  <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-500 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-teal-400 transition-colors duration-300">Spring Boot Cassandra Project</h3>
                  
                  <div className="text-gray-400 mb-4 flex-grow space-y-3">
                    <p className="group-hover:translate-x-1 transition-transform duration-300">Improved product inventory management by developing a RESTful microservice using Spring Boot and Apache Cassandra, ensuring high availability and scalability.</p>
                    <p className="group-hover:translate-x-1 transition-transform duration-300 delay-75">Enhanced deployment efficiency by containerizing the application with Docker and optimizing database queries, leading to faster data retrieval.</p>
                    <p className="group-hover:translate-x-1 transition-transform duration-300 delay-150">Increased API reliability by implementing comprehensive error handling and thorough documentation, aligning with industry best practices.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['Spring Boot', 'Cassandra', 'Docker', 'RESTful API'].map((tech, i) => (
                      <span 
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20 transition-all duration-300 hover:bg-teal-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project 2 - Fluentify */}
              <div className="group relative rounded-lg overflow-hidden hover:z-10">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-gradient-alt p-0.5">
                  <div className="absolute inset-0 bg-[#0c0e22] rounded-lg"></div>
                </div>
                
                <div className="relative p-6 bg-[#0c0e22] rounded-lg h-full flex flex-col transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_5px_15px_rgba(168,85,247,0.15)]">
                  {/* Project icon */}
                  <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">Fluentify - Language Learning Application</h3>
                  
                  <div className="text-gray-400 mb-4 flex-grow space-y-3">
                    <p className="group-hover:translate-x-1 transition-transform duration-300">Enhanced multilingual learning by building a language learning application supporting 10 languages with Python, Flask, and the OpenAI API, improving accessibility for global users.</p>
                    <p className="group-hover:translate-x-1 transition-transform duration-300 delay-75">Improved user engagement by implementing a real-time pronunciation feedback system and AI-powered grammar correction, leading to more effective language acquisition.</p>
                    <p className="group-hover:translate-x-1 transition-transform duration-300 delay-150">Increased usability across devices by designing a responsive frontend with JavaScript and Bootstrap, ensuring seamless cross-platform compatibility.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['Python', 'Flask', 'OpenAI API', 'Bootstrap'].map((tech, i) => (
                      <span 
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 transition-all duration-300 hover:bg-purple-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project 3 - Financial Simulator */}
              <div className="group relative rounded-lg overflow-hidden hover:z-10">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg animate-gradient p-0.5">
                  <div className="absolute inset-0 bg-[#0c0e22] rounded-lg"></div>
                </div>
                
                <div className="relative p-6 bg-[#0c0e22] rounded-lg h-full flex flex-col transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_5px_15px_rgba(244,114,182,0.15)]">
                  {/* Project icon */}
                  <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors duration-300">AI-Powered Financial Simulator</h3>
                  
                  <div className="text-gray-400 mb-4 flex-grow space-y-3">
                    <p className="group-hover:translate-x-1 transition-transform duration-300">Assisted users in making financial decisions by developing an AI-powered financial tool with Python and Streamlit, detecting issues like debt-to-income ratios and giving recommendations.</p>
                    <p className="group-hover:translate-x-1 transition-transform duration-300 delay-75">Enabled future financial planning by designing a simulation engine that projects outcomes based on current habits and compares them with an optimized financial strategy.</p>
                    <p className="group-hover:translate-x-1 transition-transform duration-300 delay-150">Improved financial analysis by creating an interactive web interface with Plotly visualizations, allowing users to track progress, adjust key variables, and explore real-time financial trends.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['Python', 'Streamlit', 'Plotly', 'AI'].map((tech, i) => (
                      <span 
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 transition-all duration-300 hover:bg-pink-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a href="#" className="mt-4 text-pink-400 text-xs font-medium flex items-center transition-all duration-300 transform hover:translate-x-1 group w-fit">
                    Live Demo 
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section 
        id="skills" 
        ref={skillsRef}
        className="relative py-24"
      >
        {/* Section background with diagonal stripes */}
        <div className="absolute inset-0 bg-[#070920] z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIuMzQzIDYwTDYwIDIuMzQzVjYwSDIuMzQzek0wIDU3LjY1N0w1Ny42NTcgMEgwdjU3LjY1N3oiIGZpbGw9InJnYmEoNzksIDIwOSwgMTk3LCAwLjA1KSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+')] opacity-60"></div>
        
        {/* Diagonal divider */}
        <div className="absolute top-0 left-0 w-full h-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-[#060818] transform -skew-y-2"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-10 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-20 bg-[#060818] transform skew-y-2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-16 relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">Skills</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400/0 via-blue-400 to-teal-400/0"></span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rotate-45"></span>
            </h2>
            <div className={`max-w-4xl mx-auto w-full ${getFadeInClass('skills')}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Programming Languages */}
                <div className="bg-[#0c0e22] rounded-lg p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_25px_rgba(45,212,191,0.1)] border border-blue-500/10 hover:border-blue-500/30">
                  {/* Decorative circuit pattern */}
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10,30 L30,30 L30,10" fill="none" stroke="#4FD1C5" strokeWidth="1" />
                      <path d="M10,70 L30,70 L30,90" fill="none" stroke="#4FD1C5" strokeWidth="1" />
                      <path d="M90,30 L70,30 L70,10" fill="none" stroke="#4FD1C5" strokeWidth="1" />
                      <path d="M90,70 L70,70 L70,90" fill="none" stroke="#4FD1C5" strokeWidth="1" />
                      <path d="M30,30 L70,70" fill="none" stroke="#4FD1C5" strokeWidth="1" strokeDasharray="5,5" />
                      <path d="M70,30 L30,70" fill="none" stroke="#4FD1C5" strokeWidth="1" strokeDasharray="5,5" />
                      <circle cx="30" cy="30" r="3" fill="#4FD1C5" />
                      <circle cx="70" cy="30" r="3" fill="#4FD1C5" />
                      <circle cx="30" cy="70" r="3" fill="#4FD1C5" />
                      <circle cx="70" cy="70" r="3" fill="#4FD1C5" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-teal-400 mb-6 flex items-center relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Programming Languages
                  </h3>
                  <div className="space-y-5 relative z-10">
                    {/* JavaScript skill */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium flex items-center">
                          <span className="w-2 h-2 bg-yellow-400 mr-2 rounded-full"></span>
                          JavaScript
                        </span>
                        <span className="text-gray-400 text-sm">90%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 animate-progressJavaScript"></div>
                      </div>
                    </div>
                    
                    {/* Python skill */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium flex items-center">
                          <span className="w-2 h-2 bg-blue-400 mr-2 rounded-full"></span>
                          Python
                        </span>
                        <span className="text-gray-400 text-sm">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-300 animate-progressPython"></div>
                      </div>
                    </div>
                    
                    {/* Java skill */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium flex items-center">
                          <span className="w-2 h-2 bg-orange-400 mr-2 rounded-full"></span>
                          Java
                        </span>
                        <span className="text-gray-400 text-sm">80%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-300 animate-progressJava"></div>
                      </div>
                    </div>
                    
                    {/* C# skill */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium flex items-center">
                          <span className="w-2 h-2 bg-purple-400 mr-2 rounded-full"></span>
                          C# (Unity)
                        </span>
                        <span className="text-gray-400 text-sm">75%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-300 animate-progressCSharp"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="bg-[#0c0e22] rounded-lg p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_25px_rgba(79,209,197,0.1)] border border-teal-500/10 hover:border-teal-500/30">
                  {/* Decorative technology grid */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="50" cy="20" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="80" cy="20" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="20" cy="50" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="80" cy="50" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="20" cy="80" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="50" cy="80" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <circle cx="80" cy="80" r="8" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="20" y1="28" x2="20" y2="42" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="50" y1="28" x2="50" y2="42" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="80" y1="28" x2="80" y2="42" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="20" y1="58" x2="20" y2="72" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="50" y1="58" x2="50" y2="72" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="80" y1="58" x2="80" y2="72" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="28" y1="20" x2="42" y2="20" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="58" y1="20" x2="72" y2="20" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="28" y1="50" x2="42" y2="50" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="58" y1="50" x2="72" y2="50" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="28" y1="80" x2="42" y2="80" stroke="#4FD1C5" strokeWidth="0.5" />
                      <line x1="58" y1="80" x2="72" y2="80" stroke="#4FD1C5" strokeWidth="0.5" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-teal-400 mb-6 flex items-center relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Technologies
                  </h3>
                  <div className="relative z-10">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: 'Matplotlib', color: 'from-blue-400 to-blue-600', animDelay: 0 },
                        { name: 'NLTK', color: 'from-green-400 to-green-600', animDelay: 100 },
                        { name: 'pandas', color: 'from-purple-400 to-purple-600', animDelay: 200 },
                        { name: 'Git', color: 'from-orange-400 to-orange-600', animDelay: 300 },
                        { name: 'Argparse', color: 'from-yellow-400 to-yellow-600', animDelay: 400 },
                        { name: 'PIL', color: 'from-pink-400 to-pink-600', animDelay: 500 },
                        { name: 'numPy', color: 'from-blue-400 to-blue-600', animDelay: 600 },
                        { name: 'React', color: 'from-teal-400 to-teal-600', animDelay: 700 },
                        { name: 'SpringBoot', color: 'from-green-400 to-green-600', animDelay: 800 },
                        { name: 'Flask', color: 'from-gray-400 to-gray-600', animDelay: 900 },
                        { name: 'Docker', color: 'from-blue-400 to-blue-600', animDelay: 1000 },
                        { name: 'HTML/CSS', color: 'from-orange-400 to-orange-600', animDelay: 1100 },
                        { name: 'Bootstrap', color: 'from-purple-400 to-purple-600', animDelay: 1200 },
                        { name: 'REST APIs', color: 'from-green-400 to-green-600', animDelay: 1300 },
                        { name: 'Plotly', color: 'from-blue-400 to-blue-600', animDelay: 1400 },
                        { name: 'Streamlit', color: 'from-pink-400 to-pink-600', animDelay: 1500 }
                      ].map((skill, index) => (
                        <div 
                          key={index}
                          className="group relative p-3 rounded-md bg-[#0c0e22] border border-gray-800 hover:border-teal-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-skillFadeIn"
                          style={{ animationDelay: `${skill.animDelay}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-md"></div>
                          <span className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors duration-300">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={contactRef}
        className="relative py-24"
      >
        {/* Section background */}
        <div className="absolute inset-0 bg-[#060818] z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 right-10 w-40 h-40 bg-teal-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-purple-500/5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-16 relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Contact Me</span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400/0 via-purple-400 to-blue-400/0"></span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rotate-45"></span>
            </h2>
            <div className={`max-w-3xl mx-auto w-full ${getFadeInClass('contact')}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Email card */}
                <a 
                  href="mailto:mpine095@fiu.edu" 
                  className="group relative flex items-center p-6 rounded-lg bg-[#0c0e22] border border-gray-800 hover:border-blue-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)]"
                >
                  {/* Animated highlight effect */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  </div>
                  
                  <div className="relative z-10 flex items-center w-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mr-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300">Email</h3>
                      <p className="text-gray-400 group-hover:text-blue-300 transition-all duration-300">mpine095@fiu.edu</p>
                    </div>
                  </div>
                </a>
                
                {/* Phone card */}
                <a 
                  href="tel:+17866302350" 
                  className="group relative flex items-center p-6 rounded-lg bg-[#0c0e22] border border-gray-800 hover:border-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)]"
                >
                  {/* Animated highlight effect */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  </div>
                  
                  <div className="relative z-10 flex items-center w-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mr-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">Phone</h3>
                      <p className="text-gray-400 group-hover:text-purple-300 transition-all duration-300">(786) 630-2350</p>
                    </div>
                  </div>
                </a>
              </div>
              
              {/* Social links */}
              <div className="flex justify-center space-x-6">
                <a 
                  href="https://github.com/Mundzuk-Uldin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative w-14 h-14 rounded-full bg-[#0c0e22] border border-gray-800 flex items-center justify-center transition-all duration-500 transform hover:scale-110 hover:rotate-6 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:border-teal-500/50"
                  aria-label="GitHub"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-teal-400 transition-colors duration-300">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative w-14 h-14 rounded-full bg-[#0c0e22] border border-gray-800 flex items-center justify-center transition-all duration-500 transform hover:scale-110 hover:rotate-6 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:border-blue-600/50"
                  aria-label="LinkedIn"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 bg-[#050715] border-t border-gray-800/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Miguel Angel Pineda Espinoza. All rights reserved.</p>
        </div>
      </footer>

      {/* Add global styles for animations */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }
        
        body {
          max-width: 100vw;
        }
        
        #root {
          width: 100%;
          overflow-x: hidden;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delay {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes scrollDown {
          0% { transform: translateY(0); opacity: 1; }
          75% { transform: translateY(5px); opacity: 0; }
          80% { transform: translateY(-5px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes progressJavaScript {
          0% { width: 0%; }
          100% { width: 90%; }
        }
        
        @keyframes progressPython {
          0% { width: 0%; }
          100% { width: 85%; }
        }
        
        @keyframes progressJava {
          0% { width: 0%; }
          100% { width: 80%; }
        }
        
        @keyframes progressCSharp {
          0% { width: 0%; }
          100% { width: 75%; }
        }
        
        @keyframes flare {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.3; }
        }
        
        @keyframes flare-delay {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.3; }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradient-alt {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes skillFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 6s ease-in-out 1s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .animate-scrollDown {
          animation: scrollDown 2s infinite;
        }
        
        .animate-progressJavaScript {
          animation: progressJavaScript 1.5s ease-out forwards;
        }
        
        .animate-progressPython {
          animation: progressPython 1.5s 0.3s ease-out forwards;
          width: 0%;
        }
        
        .animate-progressJava {
          animation: progressJava 1.5s 0.6s ease-out forwards;
          width: 0%;
        }
        
        .animate-progressCSharp {
          animation: progressCSharp 1.5s 0.9s ease-out forwards;
          width: 0%;
        }
        
        .animate-flare {
          animation: flare 4s ease-in-out infinite;
        }
        
        .animate-flare-delay {
          animation: flare-delay 4s 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animate-gradient-alt {
          background-size: 200% 200%;
          animation: gradient-alt 15s ease infinite;
        }
        
        .animate-loadingBar {
          animation: loadingBar 4s ease-in-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-skillFadeIn {
          opacity: 0;
          animation: skillFadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ResumeWebsite;