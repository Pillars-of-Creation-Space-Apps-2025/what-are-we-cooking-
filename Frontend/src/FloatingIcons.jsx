import React, { useState, useEffect, useRef } from 'react';

const FloatingIcon = ({ icon: Icon, index, total }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 200;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const startX = centerX + Math.cos(angle) * radius;
    const startY = centerY + Math.sin(angle) * radius;
    
    positionRef.current = { x: startX, y: startY };
    setPosition({ x: startX, y: startY });
    
    velocityRef.current = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
  }, [index, total]);

  useEffect(() => {
    let animationId;
    
    const animate = () => {
      const padding = 80;
      const maxX = window.innerWidth - padding;
      const maxY = window.innerHeight - padding;
      
      let { x, y } = positionRef.current;
      let { x: vx, y: vy } = velocityRef.current;
      
      x += vx;
      y += vy;
      
      if (x <= padding || x >= maxX) {
        vx *= -1;
        x = x <= padding ? padding : maxX;
      }
      if (y <= padding || y >= maxY) {
        vy *= -1;
        y = y <= padding ? padding : maxY;
      }
      
      positionRef.current = { x, y };
      velocityRef.current = { x: vx, y: vy };
      setPosition({ x, y });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className="fixed w-12 h-12 md:w-16 md:h-16 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center border border-indigo-400/30 transition-transform duration-200 hover:scale-110 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 1
      }}
    >
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-indigo-300" />
    </div>
  );
};

export default FloatingIcon;



