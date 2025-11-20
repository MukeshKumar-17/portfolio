import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import './PillNav.css';

const PillNav = ({
    logo,
    logoAlt = "Logo",
    items = [],
    onItemClick,
    activeHref,
    baseColor = "rgba(255, 255, 255, 0.1)",
    pillColor = "#ef4444",
    pillTextColor = "#ffffff",
    hoveredPillTextColor = "#ffffff",
    rightElement
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef(null);

    // Handle item click
    const handleItemClick = (e, href) => {
        e.preventDefault();
        if (onItemClick) {
            onItemClick(href.replace('#', ''));
        }
        setIsMobileMenuOpen(false);
    };

    // GSAP Animations for pills
    useEffect(() => {
        const navItems = document.querySelectorAll('.pill-nav-item');

        navItems.forEach(item => {
            const pill = item.querySelector('.pill-nav-pill');

            const handleMouseEnter = () => {
                if (!item.classList.contains('active')) {
                    gsap.to(pill, {
                        scale: 1,
                        duration: 0.3,
                        ease: "back.out(1.7)"
                    });
                }
            };

            const handleMouseLeave = () => {
                if (!item.classList.contains('active')) {
                    gsap.to(pill, {
                        scale: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            };

            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                item.removeEventListener('mouseenter', handleMouseEnter);
                item.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, [items]);

    // Handle active state animation
    useEffect(() => {
        const navItems = document.querySelectorAll('.pill-nav-item');
        navItems.forEach(item => {
            const pill = item.querySelector('.pill-nav-pill');
            const href = item.getAttribute('href');

            if (href === activeHref) {
                item.classList.add('active');
                gsap.to(pill, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                item.style.color = pillTextColor;
            } else {
                item.classList.remove('active');
                gsap.to(pill, {
                    scale: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                item.style.color = ''; // Reset to default
            }
        });
    }, [activeHref, pillTextColor]);


    return (
        <div className="pill-nav-container">
            <nav className="pill-nav" style={{ backgroundColor: baseColor, borderColor: baseColor }}>
                {/* Logo */}
                {logo && (
                    <img
                        src={logo}
                        alt={logoAlt}
                        className="pill-nav-logo"
                        onClick={(e) => handleItemClick(e, '#home')}
                    />
                )}

                {/* Desktop Items */}
                <div className="pill-nav-items">
                    {items.map((item, index) => (
                        <a
                            key={index}
                            href={`#${item.toLowerCase()}`}
                            className="pill-nav-item"
                            onClick={(e) => handleItemClick(e, `#${item.toLowerCase()}`)}
                            style={{ color: activeHref === `#${item.toLowerCase()}` ? pillTextColor : 'inherit' }}
                        >
                            <span
                                className="pill-nav-pill"
                                style={{ backgroundColor: pillColor }}
                            ></span>
                            <span className="relative z-10">{item}</span>
                        </a>
                    ))}

                    {/* Right Element (Theme Toggle, Contact Button) */}
                    {rightElement && (
                        <div className="ml-4 flex items-center gap-4">
                            {rightElement}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-dropdown">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                className="mobile-menu-item"
                                onClick={(e) => handleItemClick(e, `#${item.toLowerCase()}`)}
                            >
                                {item}
                            </button>
                        ))}
                        {rightElement && (
                            <div className="p-4 flex flex-col gap-4 border-t border-white/10 mt-2">
                                {rightElement}
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
};

export default PillNav;
