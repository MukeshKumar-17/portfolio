import React, { useRef, useMemo, useEffect } from 'react';
import { gsap } from 'gsap';
import './FlowingSkills.css';

const FlowingSkills = ({ categories = [], isDarkMode = true }) => {
    return (
        <div className="skills-menu-wrap">
            <div className="skills-menu">
                {categories.map((category, idx) => (
                    <SkillCategory key={idx} category={category} isDarkMode={isDarkMode} />
                ))}
            </div>
        </div>
    );
};

const SkillCategory = ({ category, isDarkMode }) => {
    const itemRef = useRef(null);
    const marqueeRef = useRef(null);
    const marqueeInnerRef = useRef(null);
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);

    const animationDefaults = { duration: 0.6, ease: 'expo' };

    const distMetric = (x, y, x2, y2) => {
        const xDiff = x - x2;
        const yDiff = y - y2;
        return xDiff * xDiff + yDiff * yDiff;
    };

    const findClosestEdge = (mouseX, mouseY, width, height) => {
        const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
        const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
        return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
    };

    const handleMouseEnter = (ev) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);

        const tl = gsap.timeline({ defaults: animationDefaults });

        tl.set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
            .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    };

    const handleMouseLeave = (ev) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        if (isDraggingRef.current) return; // Don't hide if dragging

        const rect = itemRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);

        const tl = gsap.timeline({ defaults: animationDefaults });

        tl.to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0).to(
            marqueeInnerRef.current,
            { y: edge === 'top' ? '101%' : '-101%' },
            0
        );
    };

    const handleMouseDown = (e) => {
        if (!marqueeInnerRef.current) return;
        const marqueeInner = marqueeInnerRef.current.querySelector('.skills-marquee__inner');
        if (!marqueeInner) return;

        isDraggingRef.current = true;
        dragStartXRef.current = e.pageX;

        // Pause the CSS animation
        marqueeInner.style.animationPlayState = 'paused';
        marqueeInner.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current || !marqueeInnerRef.current) return;
        const marqueeInner = marqueeInnerRef.current.querySelector('.skills-marquee__inner');
        if (!marqueeInner) return;

        e.preventDefault();

        const x = e.pageX;
        const walk = (dragStartXRef.current - x) * 2; // Multiply for faster scroll

        // Get current transform
        const style = window.getComputedStyle(marqueeInner);
        const matrix = new DOMMatrix(style.transform);
        const currentX = matrix.m41;

        // Update transform
        marqueeInner.style.transform = `translateX(${currentX - walk}px)`;
        dragStartXRef.current = x;
    };

    const handleMouseUp = () => {
        if (!marqueeInnerRef.current) return;
        const marqueeInner = marqueeInnerRef.current.querySelector('.skills-marquee__inner');
        if (!marqueeInner) return;

        isDraggingRef.current = false;

        // Resume the CSS animation
        marqueeInner.style.animationPlayState = 'running';
        marqueeInner.style.cursor = 'grab';
    };

    useEffect(() => {
        // Add event listeners for drag
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const repeatedMarqueeContent = useMemo(() => {
        // Repeat enough times to ensure continuous scroll
        return Array.from({ length: 10 }).map((_, idx) => (
            <React.Fragment key={idx}>
                {category.items.map((skill, skillIdx) => (
                    <div key={`${idx}-${skillIdx}`} className="marquee__skill-item">
                        <skill.icon className="marquee__skill-icon" />
                        <span className="marquee__skill-name">{skill.name}</span>
                    </div>
                ))}
                <span className="marquee__separator">•</span>
            </React.Fragment>
        ));
    }, [category.items]);

    return (
        <div className="skills-menu__item" ref={itemRef}>
            <div
                className={`skills-menu__item-link ${isDarkMode ? 'dark' : 'light'}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {category.category}
            </div>
            <div className="skills-marquee" ref={marqueeRef}>
                <div className="skills-marquee__inner-wrap" ref={marqueeInnerRef}>
                    <div
                        className="skills-marquee__inner"
                        aria-hidden="true"
                        onMouseDown={handleMouseDown}
                        style={{ cursor: 'grab', userSelect: 'none' }}
                    >
                        {repeatedMarqueeContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowingSkills;
