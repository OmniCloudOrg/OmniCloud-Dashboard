"use client";

import React, { useState, useEffect, useRef } from 'react';

const OmniCloudSignIn = () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // State for transitions
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'reset'
  const [transitionClass, setTransitionClass] = useState('');

  // Refs
  const canvasRef = useRef(null);

  // Animation effect to fade in the form when component mounts
  useEffect(() => {
    setIsVisible(true);
    initCanvas();
  }, []);

  // Canvas animation for constellation-like network
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Colors based on the specified scheme
    const bgColor = '#020617';
    const particleColor = '#132045';
    const highlightColor = '#1e3a8a';

    // Particles for constellation effect
    const particles = [];
    const particleCount = 100;
    const connectionDistance = 120; // Maximum distance for connecting particles

    // Mouse interaction
    let mouse = {
      x: null,
      y: null,
      radius: 100
    };

    canvas.addEventListener('mousemove', function (event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseout', function () {
      mouse.x = null;
      mouse.y = null;
    });

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.5;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const directionX = (Math.random() * 0.4) - 0.2;
      const directionY = (Math.random() * 0.4) - 0.2;
      const isHighlight = Math.random() > 0.85; // Some particles are highlights

      particles.push({
        x: x,
        y: y,
        size: size,
        speedX: directionX,
        speedY: directionY,
        isHighlight: isHighlight,
        baseColor: isHighlight ? highlightColor : particleColor,
        alpha: isHighlight ? 0.8 : 0.5
      });
    }

    // Draw function
    function draw() {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Move particles
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw connections between particles
      ctx.lineWidth = 0.2;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Calculate opacity based on distance (closer = more opaque)
            const opacity = 1 - (distance / connectionDistance);

            // Use highlight color if either particle is highlighted
            const isHighlightConnection = particles[a].isHighlight || particles[b].isHighlight;

            ctx.beginPath();
            ctx.strokeStyle = isHighlightConnection
              ? `rgba(40, 68, 148, ${opacity * 8})` // Highlight color with opacity
              : `rgba(29, 42, 79, ${opacity * 4})`; // Normal color with opacity
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      // Mouse interaction - connect to nearby particles
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const opacity = 1 - (distance / mouse.radius);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.5})`; // Blue highlight for mouse interaction
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    draw();

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Handle screen transitions
  const changeScreen = (screen) => {
    setTransitionClass('fade-out');

    setTimeout(() => {
      setCurrentScreen(screen);
      setTransitionClass('fade-in');
    }, 300);
  };

  // Animation classes
  const formAnimation = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-20';

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#020617' }}>
      {/* Full-screen background canvas */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-90" style={{ background: 'linear-gradient(to bottom right, #020617, #050d24)' }}></div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* Left side - branding and features */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <div className="flex flex-col items-center lg:items-start">
            {/* Logo */}
            <div className="inline-flex items-center mb-8">
              <div className="p-4 rounded-full shadow-lg border border-opacity-20 mr-4" 
                  style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
                <svg className="w-10 h-10 text-blue-100 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-blue-50">OmniCloud</h1>
            </div>

            {/* Tagline */}
            <p className="text-blue-200 text-xl mb-12 opacity-70 max-w-md">
              Secure Self-Hosted Platform for Enterprise Data Management
            </p>

            {/* Key features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-2xl mx-auto lg:mx-0 mb-12">
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md border border-opacity-20"
                  style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
                  <svg className="w-7 h-7 text-blue-100 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-blue-100 text-lg font-medium mb-2">Enterprise Security</h3>
                <p className="text-blue-200 text-sm opacity-70 text-center lg:text-left">End-to-end encryption and compliance-ready controls</p>
              </div>
              
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md border border-opacity-20"
                  style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
                  <svg className="w-7 h-7 text-blue-100 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                  </svg>
                </div>
                <h3 className="text-blue-100 text-lg font-medium mb-2">Data Control</h3>
                <p className="text-blue-200 text-sm opacity-70 text-center lg:text-left">Maintain complete ownership of your information</p>
              </div>
              
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md border border-opacity-20"
                  style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
                  <svg className="w-7 h-7 text-blue-100 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-blue-100 text-lg font-medium mb-2">Advanced Analytics</h3>
                <p className="text-blue-200 text-sm opacity-70 text-center lg:text-left">Real-time insights and customizable dashboards</p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="text-blue-200 text-sm space-y-3 w-full max-w-lg mx-auto lg:mx-0 hidden lg:block">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
                <span className="opacity-70">Secure connection to your OmniCloud instance</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
                <span className="opacity-70">Your data never leaves your infrastructure</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
                <span className="opacity-70">SOC 2, HIPAA, and GDPR compliant by design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - login card */}
        <div className={`w-full lg:w-5/12 transition-all duration-1000 ease-out ${formAnimation}`}>
          <div className="bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-opacity-20 overflow-hidden"
            style={{ backgroundColor: '#0a1225', borderColor: '#132045' }}>
            
            {/* Login Form */}
            {currentScreen === 'login' && (
              <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
                <div className="mb-8">
                  <h2 className="text-2xl font-medium text-blue-50 mb-2">Sign In</h2>
                  <p className="text-blue-200 text-md opacity-70">Access your cloud platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-blue-100 text-sm block">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="text-blue-100 text-sm block">Password</label>
                      <button
                        type="button"
                        className="text-sm text-blue-300 hover:text-blue-200 opacity-80 hover:opacity-100 transition-all"
                        onClick={() => changeScreen('reset')}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-opacity-30"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-blue-100">
                      Remember this device
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-lg font-medium text-blue-50 transition-all duration-300 relative overflow-hidden shadow-md border border-opacity-30 ${isLoading
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:bg-blue-900 hover:bg-opacity-50'
                        }`}
                      style={{ backgroundColor: '#1e3a8a', borderColor: '#3b82f6' }}
                      disabled={isLoading}
                      onClick={() => window.location.replace("http://mercury:3000/dash")}
                    >
                      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                        <svg className="animate-spin h-5 w-5 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                        Sign In
                      </span>
                    </button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-blue-200 opacity-70">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => changeScreen('register')}
                        className="text-blue-100 hover:text-blue-50 font-medium transition-colors"
                      >
                        Create account
                      </button>
                    </p>
                  </div>
                </form>

                <div className="mt-8 pt-4 border-t border-opacity-20 flex justify-between items-center" style={{ borderColor: '#132045' }}>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Privacy</a>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Documentation</a>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Support</a>
                </div>
              </div>
            )}

            {/* Register Form */}
            {currentScreen === 'register' && (
              <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
                <div className="mb-8">
                  <h2 className="text-2xl font-medium text-blue-50 mb-2">Create Account</h2>
                  <p className="text-blue-200 text-md opacity-70">Set up your OmniCloud platform</p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-blue-100 text-sm block">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="regemail" className="text-blue-100 text-sm block">Email</label>
                    <input
                      type="email"
                      id="regemail"
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="regpassword" className="text-blue-100 text-sm block">Password</label>
                    <input
                      type="password"
                      id="regpassword"
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm" className="text-blue-100 text-sm block">Confirm Password</label>
                    <input
                      type="password"
                      id="confirm"
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg font-medium text-blue-50 transition-all duration-300 shadow-md border border-opacity-30 hover:bg-blue-900 hover:bg-opacity-50"
                      style={{ backgroundColor: '#1e3a8a', borderColor: '#3b82f6' }}
                    >
                      Create Account
                    </button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-blue-200 opacity-70">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => changeScreen('login')}
                        className="text-blue-100 hover:text-blue-50 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>

                <div className="mt-8 pt-4 border-t border-opacity-20 flex justify-between items-center" style={{ borderColor: '#132045' }}>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Privacy</a>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Documentation</a>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Support</a>
                </div>
              </div>
            )}

            {/* Password Reset Form */}
            {currentScreen === 'reset' && (
              <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
                <div className="mb-8">
                  <h2 className="text-2xl font-medium text-blue-50 mb-2">Reset Password</h2>
                  <p className="text-blue-200 text-md opacity-70">We'll send you instructions via email</p>
                </div>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="resetemail" className="text-blue-100 text-sm block">Email</label>
                    <input
                      type="email"
                      id="resetemail"
                      className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg font-medium text-blue-50 transition-all duration-300 shadow-md border border-opacity-30 hover:bg-blue-900 hover:bg-opacity-50"
                      style={{ backgroundColor: '#1e3a8a', borderColor: '#3b82f6' }}
                    >
                      Send Reset Link
                    </button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-blue-200 opacity-70">
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => changeScreen('login')}
                        className="text-blue-100 hover:text-blue-50 font-medium transition-colors"
                      >
                        Back to login
                      </button>
                    </p>
                  </div>
                </form>

                <div className="mt-8 pt-4 border-t border-opacity-20 flex justify-between items-center" style={{ borderColor: '#132045' }}>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Privacy</a>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Documentation</a>
                  <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Support</a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile trust indicators */}
          <div className="lg:hidden text-blue-200 text-xs space-y-2 mt-6 mb-4 opacity-70 max-w-md mx-auto">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
              <span>Secure connection to your OmniCloud instance</span>
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
              <span>Your data never leaves your infrastructure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with version */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-blue-200 text-sm opacity-60">
          OmniCloud Enterprise Edition • v4.2.1
        </p>
      </div>
    </div>
  );
};

// Add the keyframe animations for transitions
const globalStyles = `
  .fade-in {
    animation: fadeIn 0.3s ease-in-out forwards;
  }
  
  .fade-out {
    animation: fadeOut 0.3s ease-in-out forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
`;

const OmniCloudSignInWithStyles = () => (
  <>
    <style>{globalStyles}</style>
    <OmniCloudSignIn />
  </>
);

export default OmniCloudSignInWithStyles;