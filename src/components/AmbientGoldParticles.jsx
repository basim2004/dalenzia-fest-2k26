import React, { useRef, useEffect } from 'react';

/**
 * Isolated Error Boundary to protect against any 3D/Canvas runtime crashes
 */
export class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('DALENZIA 3D Canvas handled gracefully with 2D fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <AmbientGoldParticles />;
    }
    return this.props.children;
  }
}

/**
 * AmbientGoldParticles
 * Ultra-smooth, rock-solid, 60fps golden particle atmosphere.
 * Eliminates WebGL context crashes, React 19 R3F hook mismatches, and works on all devices.
 */
export default function AmbientGoldParticles({ count = 60, className = 'absolute inset-0 pointer-events-none z-0' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 400;
    };

    window.addEventListener('resize', handleResize);

    // Color palette matching DALENZIA FEST 2K26 brand
    const colors = [
      'rgba(230, 169, 22, ',  // Golden Yellow
      'rgba(212, 175, 55, ',  // Metallic Gold
      'rgba(243, 229, 171, ', // Champagne / Warm Cream
      'rgba(169, 31, 53, '    // Deep Crimson Accent
    ];

    // Initialize particles
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 2.2,
      baseSpeedY: 0.2 + Math.random() * 0.6,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.2 + Math.random() * 0.6,
      opacitySpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      angleSpeed: 0.01 + Math.random() * 0.02
    }));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Floating movement with gentle sinusoidal horizontal wave
        p.y += p.baseSpeedY;
        p.angle += p.angleSpeed;
        p.x += p.speedX + Math.sin(p.angle) * 0.3;

        // Twinkle opacity
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.85) {
          p.opacity = 0.85;
          p.opacitySpeed = -Math.abs(p.opacitySpeed);
        } else if (p.opacity < 0.15) {
          p.opacity = 0.15;
          p.opacitySpeed = Math.abs(p.opacitySpeed);
        }

        // Screen wrap
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = p.size > 1.8 ? 6 : 0;
        ctx.shadowColor = '#E6A916';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
