import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const PARTICLE_COUNT = 80;
const LINK_DISTANCE = 130;
const CURSOR_RADIUS = 100;
const GRID_SIZE = 80;
const OFFSCREEN = -9999;

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    let frameId = null;
    let width = 0;
    let height = 0;
    const mouse = { x: OFFSCREEN, y: OFFSCREEN };
    const particles = [];

    const resize = () => {
      // Size the backing store to the device pixel ratio. Without this the
      // 0.5px grid lines and sub-pixel dots are visibly blurry on retina
      // displays. Capped at 2x so a 3x phone does not pay for 9x the pixels.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
        baseOpacity: Math.random() * 0.25 + 0.05,
      });
    }

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.025)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const paint = (advance) => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        if (advance) {
          p.x += p.vx;
          p.y += p.vy;

          // Clamp as well as reflect. Flipping the sign on its own leaves a
          // particle that is already outside the viewport - after the window
          // is made smaller, say - flipping every frame and jittering against
          // the edge instead of travelling back inward.
          if (p.x < 0) {
            p.x = 0;
            p.vx = Math.abs(p.vx);
          } else if (p.x > width) {
            p.x = width;
            p.vx = -Math.abs(p.vx);
          }
          if (p.y < 0) {
            p.y = 0;
            p.vy = Math.abs(p.vy);
          } else if (p.y > height) {
            p.y = height;
            p.vy = -Math.abs(p.vy);
          }
        }

        const cursorDistance = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const glowing = cursorDistance < CURSOR_RADIUS;

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowing ? p.r * 2 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = glowing
          ? 'rgba(0, 240, 255, 0.7)'
          : `rgba(0, 240, 255, ${p.baseOpacity})`;
        ctx.fill();

        if (glowing) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - cursorDistance / CURSOR_RADIUS)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Indexed rather than particles.slice(i + 1).forEach(...), which
        // allocated a throwaway array per particle per frame.
        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const distance = Math.hypot(p.x - other.x, p.y - other.y);
          if (distance >= LINK_DISTANCE) continue;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.07 * (1 - distance / LINK_DISTANCE)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    };

    // Reduce-motion visitors get the grid and dots as a still image: the
    // texture survives, the drifting does not.
    if (prefersReducedMotion) {
      paint(false);
      const onResizeStill = () => {
        resize();
        paint(false);
      };
      window.addEventListener('resize', onResizeStill);
      return () => window.removeEventListener('resize', onResizeStill);
    }

    const loop = () => {
      paint(true);
      frameId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (frameId === null) loop();
    };
    const stop = () => {
      if (frameId === null) return;
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    const onMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = OFFSCREEN;
      mouse.y = OFFSCREEN;
    };
    // Browsers throttle rAF in background tabs but do not stop it. Suspending
    // explicitly keeps a backgrounded tab from burning battery.
    const onVisibilityChange = () => (document.hidden ? stop() : start());

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none z-0" />;
}
