import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  opacity: number;
  speed: number;
  phase: number;
}

const DotsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dots: Dot[] = [];
    const DOT_RADIUS = 1.2;
    const SPACING = 36;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      buildDots();
    };

    const buildDots = () => {
      dots.length = 0;
      const cols = Math.ceil(canvas.width / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * SPACING,
            y: r * SPACING,
            opacity: 0,
            speed: 0.003 + Math.random() * 0.004,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    let animId: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      for (const dot of dots) {
        const opacity = 0.08 + 0.12 * Math.sin(t * dot.speed + dot.phase);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default DotsBackground;
