"use client";

import { useRef, useEffect } from 'react';

const Background = () => {
  const canvasRef = useRef(null);

  // Canvas animation for constellation-like network
  useEffect(() => {
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
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 opacity-90" style={{ background: 'linear-gradient(to bottom right, #020617, #050d24)' }}></div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default Background;