import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  isNode: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface GeomShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  sides: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let shapes: GeomShape[] = [];
    let mouseX = -9999;
    let mouseY = -9999;

    const PARTICLE_COUNT = 85;
    const NODE_COUNT = 7;
    const CONNECT_DIST = 160;
    const MOUSE_RADIUS = 220;

    /* ─── Initialise ─────────────────────────── */
    const init = () => {
      particles = [];
      ripples = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.2 + 0.4,
          baseOpacity: Math.random() * 0.35 + 0.08,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.012 + 0.004,
          isNode: false,
        });
      }

      for (let i = 0; i < NODE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: Math.random() * 2.5 + 2.5,
          baseOpacity: Math.random() * 0.35 + 0.45,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.018 + 0.008,
          isNode: true,
        });
      }

      // Wireframe floating geometric shapes
      const shapeSides = [3, 4, 6, 3, 5, 4];
      shapes = shapeSides.map((sides) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        sides,
        radius: Math.random() * 40 + 28,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.004,
        opacity: Math.random() * 0.055 + 0.025,
      }));
    };

    /* ─── Draw helpers ───────────────────────── */
    const drawPolygon = (
      shape: GeomShape,
    ) => {
      const { x, y, sides, radius, rotation, opacity } = shape;
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = rotation + (i / sides) * Math.PI * 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // inner ring
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = rotation + Math.PI / sides + (i / sides) * Math.PI * 2;
        const px = x + Math.cos(angle) * (radius * 0.55);
        const py = y + Math.sin(angle) * (radius * 0.55);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.5})`;
      ctx.lineWidth = 0.4;
      ctx.stroke();
    };

    const drawNodeGlow = (p: Particle, op: number) => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
      g.addColorStop(0, `rgba(255,255,255,${op * 0.55})`);
      g.addColorStop(0.35, `rgba(255,255,255,${op * 0.12})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
      ctx.fill();
    };

    /* ─── Spawn ripple from a random node ───────── */
    let nextRipple = 0;
    const maybeSpawnRipple = (t: number) => {
      if (t > nextRipple) {
        const nodes = particles.filter((p) => p.isNode);
        if (nodes.length) {
          const src = nodes[Math.floor(Math.random() * nodes.length)];
          ripples.push({
            x: src.x,
            y: src.y,
            radius: 0,
            maxRadius: 180 + Math.random() * 80,
            opacity: 0.35,
            speed: 1.2 + Math.random() * 0.8,
          });
        }
        nextRipple = t + 2400 + Math.random() * 2800;
      }
    };

    /* ─── Main render loop ────────────────────── */
    let lastT = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      maybeSpawnRipple(t);

      // --- Geometric shapes ---
      for (const s of shapes) {
        s.rotation += s.rotSpeed;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -s.radius) s.x = canvas.width + s.radius;
        if (s.x > canvas.width + s.radius) s.x = -s.radius;
        if (s.y < -s.radius) s.y = canvas.height + s.radius;
        if (s.y > canvas.height + s.radius) s.y = -s.radius;
        drawPolygon(s);
      }

      // --- Connections ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.14;
            const nodeEdge = particles[i].isNode || particles[j].isNode;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${nodeEdge ? alpha * 1.8 : alpha})`;
            ctx.lineWidth = nodeEdge ? 0.7 : 0.35;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // --- Ripples ---
      ripples = ripples.filter((r) => r.opacity > 0.008);
      for (const r of ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${r.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        r.radius += r.speed;
        r.opacity *= 0.97;
      }

      // --- Particles ---
      for (const p of particles) {
        // mouse repulsion
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_RADIUS && md > 0) {
          const force = (1 - md / MOUSE_RADIUS) * 0.045;
          p.vx += (mdx / md) * force;
          p.vy += (mdy / md) * force;
        }

        // damping
        p.vx *= 0.994;
        p.vy *= 0.994;
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -8) p.x = canvas.width + 8;
        if (p.x > canvas.width + 8) p.x = -8;
        if (p.y < -8) p.y = canvas.height + 8;
        if (p.y > canvas.height + 8) p.y = -8;

        // pulse
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.28 + 0.72;
        const op = p.baseOpacity * pulse;

        if (p.isNode) {
          drawNodeGlow(p, op);
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Vignette overlay (darkens edges, focuses center) ---
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const vr = Math.max(cx, cy) * 1.4;
      const vg = ctx.createRadialGradient(cx, cy, vr * 0.4, cx, cy, vr);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.62)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lastT = t;
      raf = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
