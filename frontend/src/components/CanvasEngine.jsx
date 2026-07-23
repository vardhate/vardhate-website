import React, { useRef, useEffect } from 'react';

const CanvasEngine = ({ stage }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const mouse = { x: null, y: null, radius: 180 };
    let t = 0;
    let warpT = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      particles = [];
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
      
      let N = 110;
      if (isMobile) N = 35;
      else if (isTablet) N = 50;

      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 * 6;
        const baseRadius = 50 + (i / N) * (Math.max(canvas.width, canvas.height) * 0.5);
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseAngle: angle,
          angleOffset: 0,
          baseRadius: baseRadius,
          targetRadius: 60 + (i / N) * (Math.max(canvas.width, canvas.height) * 0.45),
          size: Math.random() * 1.6 + 0.3,
          alpha: Math.random() * 0.6 + 0.2,
          density: Math.random() * 25 + 1,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
          dx: Math.random() * canvas.width,
          dy: Math.random() * canvas.height
        });
      }
    };

    resize();
    init();

    const handleResize = () => {
      resize();
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hasHover) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.45;

      if (stage === 'boot' || stage === 'warp') {
        let progress = 0;
        let ease = 0;
        const isWarp = (stage === 'warp');
        
        if (isWarp) {
          warpT += 0.018;
          progress = Math.min(1, warpT);
          ease = progress;
        } else {
          t += 0.008;
          progress = Math.min(1, t);
          ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
          warpT = 0;
        }
        
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.4);
        let glowAlpha = isWarp ? 0.08 * (1 - ease) : 0.08 * progress;
        grad.addColorStop(0, `rgba(37, 99, 235, ${glowAlpha})`);
        grad.addColorStop(0.5, `rgba(90, 94, 105, ${glowAlpha * 0.38})`);
        grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p) => {
          let currentAngle, currentRad, alpha;
          if (isWarp) {
            currentAngle = p.baseAngle + p.angleOffset + ease * Math.PI * 4.5;
            const warpEase = Math.pow(ease, 2.5);
            currentRad = p.targetRadius + (p.baseRadius * 4.5 - p.targetRadius) * warpEase;
            alpha = p.alpha * (1 - ease);
          } else {
            p.angleOffset += 0.015 * (1 - ease) + 0.005 * ease;
            currentAngle = p.baseAngle + p.angleOffset;
            currentRad = p.baseRadius * (1 - ease) + p.targetRadius * ease;
            alpha = p.alpha * (0.3 + 0.7 * ease);
          }
          
          const x = cx + Math.cos(currentAngle) * currentRad;
          const y = cy + Math.sin(currentAngle) * currentRad * 0.72;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        
      } else {
        particles.forEach(p => {
          p.dx += p.speedX;
          p.dy += p.speedY;
          
          if (p.dx < 0) p.dx = canvas.width;
          if (p.dx > canvas.width) p.dx = 0;
          if (p.dy < 0) p.dy = canvas.height;
          if (p.dy > canvas.height) p.dy = 0;
          
          if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - p.dx;
            let dy = mouse.y - p.dy;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
              let forceDirX = dx / dist;
              let forceDirY = dy / dist;
              let maxForce = (mouse.radius - dist) / mouse.radius;
              let force = maxForce * p.density * 0.08;
              
              p.dx -= forceDirX * force;
              p.dy -= forceDirY * force;
            }
          }
          
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.dx, p.dy, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        const maxLineDist = window.innerWidth < 768 ? 65 : 95;
        const maxLineDistSq = maxLineDist * maxLineDist;
        
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].dx - particles[j].dx;
            let dy = particles[i].dy - particles[j].dy;
            let distSq = dx * dx + dy * dy;
            
            if (distSq < maxLineDistSq) {
              let dist = Math.sqrt(distSq);
              let alpha = (maxLineDist - dist) / maxLineDist * 0.08;
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].dx, particles[i].dy);
              ctx.lineTo(particles[j].dx, particles[j].dy);
              ctx.stroke();
            }
          }

          if (mouse.x !== null && mouse.y !== null) {
            let dx = particles[i].dx - mouse.x;
            let dy = particles[i].dy - mouse.y;
            let distSq = dx * dx + dy * dy;
            let mouseRadiusSq = mouse.radius * mouse.radius;
            
            if (distSq < mouseRadiusSq) {
              let dist = Math.sqrt(distSq);
              let alpha = (mouse.radius - dist) / mouse.radius * 0.12;
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(particles[i].dx, particles[i].dy);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (hasHover) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [stage]);

  return (
    <canvas 
      ref={canvasRef} 
      id="experience-canvas" 
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default CanvasEngine;
