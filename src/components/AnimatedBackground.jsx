import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let animationId;

    function resize() {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }

    resize();
    window.addEventListener("resize", resize);

  const circles = Array.from({ length: 8 }).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: 30 + Math.random() * 50,
  vx: (Math.random() - 0.5) * 1.2, // speed increased
  vy: (Math.random() - 0.5) * 1.2  // speed increased
}));


    function animate() {
      ctx.clearRect(0, 0, width, height);

      circles.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;

        if (c.x > width) c.x = 0;
        if (c.x < 0) c.x = width;
        if (c.y > height) c.y = 0;
        if (c.y < 0) c.y = height;

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.15)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0"
    />
  );
}
