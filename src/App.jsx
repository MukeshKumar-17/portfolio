import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Code, Database, Brain, Server, Smartphone, Globe, ChevronDown, ExternalLink, Menu, X, Sun, Moon } from 'lucide-react';
import { SiLeetcode, SiCodechef } from 'react-icons/si';

import { FaEarlybirds } from "react-icons/fa";
import logo from './assets/logo.png';
import profile from './assets/profile.jpg';
import hoverImage from './assets/hover-image.jpg';
import PixelTransition from './PixelTransition';

// Custom hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.3) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { isVisible, ref };
};

// Custom hook for skills with scroll-controlled animation
const useSkillsAnimation = (totalSkills) => {
    const [visibleCount, setVisibleCount] = useState(0);
    const skillsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Calculate how much of the section is visible
                        const rect = entry.boundingClientRect;
                        const windowHeight = window.innerHeight;
                        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
                        const totalHeight = rect.height;
                        const scrollProgress = Math.max(0, Math.min(1, visibleHeight / totalHeight));

                        // Calculate how many skills should be visible based on scroll progress
                        const newVisibleCount = Math.floor(scrollProgress * totalSkills);
                        setVisibleCount(newVisibleCount);
                    } else {
                        setVisibleCount(0);
                    }
                });
            },
            {
                threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) // 0, 0.05, 0.1, ..., 1.0
            }
        );

        if (skillsRef.current) {
            observer.observe(skillsRef.current);
        }

        return () => observer.disconnect();
    }, [totalSkills]);

    return { visibleCount, skillsRef };
};

// Custom Matrix Rain Effect - Developed by Mukesh Kumar
const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dynamic canvas sizing for responsive design
        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Matrix animation configuration
        const binaryChars = '01';
        const japaneseChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        // Initialize falling drops array
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * canvas.height;
        }

        // Main animation loop
        const animate = () => {
            // Create fading trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Configure text rendering
            ctx.fillStyle = '#ff0000';
            ctx.font = `${fontSize}px JetBrains Mono`;
            ctx.textAlign = 'center';

            // Render falling binary digits
            for (let i = 0; i < drops.length; i++) {
                // 70% chance for binary (0 or 1), 30% chance for Japanese characters
                const char = Math.random() < 0.7
                    ? binaryChars[Math.floor(Math.random() * binaryChars.length)]
                    : japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
                const x = i * fontSize;
                const y = drops[i];

                // Apply red glow effect
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 10;
                ctx.fillText(char, x, y);
                ctx.shadowBlur = 0;

                // Reset drops for continuous animation
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Animate downward movement
                drops[i] += fontSize;
            }
        };

        // Start animation loop
        const interval = setInterval(animate, 30);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

// Skills data - moved outside component to avoid initialization issues
const skills = [
    { name: 'JavaScript', icon: Code },
    { name: 'React', icon: Code },
    { name: 'Node.js', icon: Server },
    { name: 'Python', icon: Code },
    { name: 'Machine Learning', icon: Brain },
    { name: 'MongoDB', icon: Database },
    { name: 'PostgreSQL', icon: Database },
    { name: 'React Native', icon: Smartphone },
    { name: 'Next.js', icon: Globe },
    { name: 'TensorFlow', icon: Brain },
    { name: 'Django', icon: Server },
    { name: 'Express.js', icon: Server }
];

function App() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { visibleCount, skillsRef } = useSkillsAnimation(skills.length);
    const aboutAnimation = useScrollAnimation(0.3);
    const projectsAnimation = useScrollAnimation(0.2);
    const contactAnimation = useScrollAnimation(0.3);



    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const projects = [
        {
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.',
            tech: ['React', 'Node.js', 'MongoDB', 'Express'],
            github: '#',
            demo: '#'
        },
        {
            title: 'ML Price Predictor',
            description: 'Machine learning model to predict stock prices using historical data. Built with Python, TensorFlow, and deployed with Flask.',
            tech: ['Python', 'TensorFlow', 'Flask', 'Pandas'],
            github: '#',
            demo: '#'
        },
        {
            title: 'Task Management App',
            description: 'Collaborative task management application with real-time updates, built using React and Firebase.',
            tech: ['React', 'Firebase', 'Tailwind CSS'],
            github: '#',
            demo: '#'
        },
        {
            title: 'Sentiment Analysis Tool',
            description: 'NLP-based sentiment analysis tool for social media posts using Python and scikit-learn.',
            tech: ['Python', 'scikit-learn', 'NLTK', 'FastAPI'],
            github: '#',
            demo: '#'
        }
    ];

    return (
        <div className={`min-h-screen font-mono overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Matrix Rain Background - Moved to Hero Section */}

            {/* Navigation */}
            {/* Navigation */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
                <div className={`${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/70 border-black/10'} backdrop-blur-md border rounded-full px-6 py-3 flex items-center justify-between shadow-lg transition-colors duration-300`}>

                    {/* Left Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Home', 'About', 'Skills', 'Projects'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300 font-medium text-sm tracking-wide`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Center Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src={logo}
                            alt="MUK-ACE"
                            className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
                            onClick={() => scrollToSection('home')}
                        />
                    </div>

                    {/* Right Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className={`${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105`}
                        >
                            Get in touch
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        <img
                            src={logo}
                            alt="MUK-ACE"
                            className="h-10 w-auto object-contain"
                        />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-300 transition-colors p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden glow-border">
                        <div className="px-4 py-4 space-y-2">
                            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
                <MatrixRain />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Left Column - Image */}
                    <div className="relative order-2 lg:order-1 group flex justify-center">
                        <div className="relative z-10 rounded-[2rem] overflow-hidden border-2 border-white/10 glow-card max-w-md mx-auto lg:mx-0 w-full">
                            <PixelTransition
                                firstContent={
                                    <img
                                        src={profile}
                                        alt="Mukesh Kumar"
                                        className="w-full h-full object-cover"
                                    />
                                }
                                secondContent={
                                    <img
                                        src={hoverImage}
                                        alt="Mukesh Kumar Hover"
                                        className="w-full h-full object-cover"
                                    />
                                }
                                gridSize={12}
                                pixelColor="#ffffff"
                                animationStepDuration={0.4}
                                className="w-full h-full"
                                style={{ width: '100%', height: '100%', borderRadius: '2rem', border: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className={`text-left order-1 lg:order-2 ${isDarkMode ? 'bg-black/60 border-red-500' : 'bg-white/60 border-red-500'} backdrop-blur-sm p-8 border-2 glow-card rounded-2xl transition-colors duration-300`}>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border mb-8`}>
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Open to Work</span>
                        </div>

                        <h1 className="font-thin mb-4 tracking-tight font-['Origamet_Hamida']">
                            <span className="block text-white mb-2 text-5xl lg:text-6xl">MUKESH KUMAR</span>
                            <span className="block text-red-500 text-3xl lg:text-4xl">AI & ML Enthusiast</span>
                            <span className="block text-red-500 mt-2 text-3xl lg:text-4xl">Full Stack Developer</span>
                        </h1>

                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg mb-8 max-w-xl leading-relaxed`}>
                            Building intelligent, scalable, and modern digital solutions. I specialize in full-stack web development, AI integrations, and machine learning–driven applications that help businesses innovate, automate, and grow in the digital era.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <button
                                onClick={() => scrollToSection('projects')}
                                className="px-8 py-4 bg-[#ffddbf] text-black font-bold rounded-full hover:bg-white transition-colors duration-300 flex items-center gap-2"
                            >
                                MY SERVICES
                                <ExternalLink size={18} />
                            </button>
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                className={`px-8 py-4 ${isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-black/5 text-black border-black/10 hover:bg-black/10'} font-bold rounded-full border transition-colors duration-300 flex items-center gap-2`}
                            >
                                <span className="mr-2">📄</span>
                                Download Resume
                            </a>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold tracking-widest uppercase">
                            <MapPin size={16} className="text-red-500" />
                            Coimbatore, India
                        </div>
                    </div>
                </div>

                {/* Scroll Down Arrow */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <button
                        onClick={() => scrollToSection('about')}
                        className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'} transition-colors duration-300`}
                    >
                        <ChevronDown size={32} />
                    </button>
                </div>
            </section>

            {/* About Me Heading */}
            <section className="relative z-10 py-12 overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-thin text-center text-red-500 font-['Origamet_Hamida'] tracking-wide">
                    ✦ABOUT ME✦
                </h2>
            </section>

            {/* About Section */}
            <section id="about" className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        ref={aboutAnimation.ref}
                        className={`transition-all duration-1000 ${aboutAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                    >
                        <h2 className={`text-4xl md:text-6xl font-thin mb-12 leading-tight font-['Origamet_Hamida'] ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            Passion For Building Intelligent, Scalable, And High-Performance Applications.
                        </h2>

                        <p className={`text-xl md:text-2xl leading-relaxed mb-20 max-w-4xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            I'm an AI & ML enthusiast and full stack developer. My journey in tech is driven by a deep curiosity to understand how systems work and a passion for creating smart solutions that solve real-world problems.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                            <div>
                                <p className={`text-lg font-bold tracking-wide uppercase leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                    WITH EXPERIENCE IN FRONTEND, BACKEND, AND MACHINE LEARNING, I ENJOY BUILDING END-TO-END APPLICATIONS THAT ARE FAST, RELIABLE, AND USER-FOCUSED.
                                </p>
                            </div>

                            <div>
                                <div className="mb-6">
                                    <span className="text-2xl md:text-3xl text-red-500 font-['Origamet_Hamida'] tracking-wide">Continuous Learning</span>
                                </div>
                                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    I'm constantly exploring new technologies, experimenting with AI models, and staying up-to-date with the latest trends in development. When I'm not coding, you'll find me learning something new, reading about AI breakthroughs, or building side projects that push my creativity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Skills Section */}
            <section id="skills" className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center cyberhype-heading tracking-wider">
                        SKILLS
                    </h2>
                    <div ref={skillsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className={`skill-item bg-black/60 backdrop-blur-sm border-2 border-red-500 p-6 hover:border-red-400 transition-all duration-700 group glow-card hover:glow-border transform hover:scale-105 rounded-2xl ${index < visibleCount
                                    ? 'translate-x-0 opacity-100'
                                    : index % 2 === 0
                                        ? '-translate-x-full opacity-0'
                                        : 'translate-x-full opacity-0'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <skill.icon
                                        size={32}
                                        className="text-red-500 mb-3 group-hover:glow-icon transition-all duration-300"
                                    />
                                    <span className="text-white font-bold tracking-wide">{skill.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="relative z-10 py-20 px-4">
                <div ref={projectsAnimation.ref} className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center cyberhype-heading tracking-wider">
                        PROJECTS
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className={`group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-2xl overflow-hidden border hover:border-red-500/50 transition-all duration-300 ${projectsAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`${isDarkMode ? 'bg-red-500/20' : 'bg-red-500/10'} p-3 rounded-xl`}>
                                            <Code className="w-8 h-8 text-red-500" />
                                        </div>
                                        <div className="flex gap-4">
                                            <a href={project.github} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                                                <Github size={20} />
                                            </a>
                                            <a href={project.demo} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                                                <ExternalLink size={20} />
                                            </a>
                                        </div>
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-3 group-hover:text-red-500 transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>{project.title}</h3>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 line-clamp-3`}>{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((t) => (
                                            <span key={t} className={`text-xs font-medium px-3 py-1 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-black/10 text-gray-700'}`}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="relative z-10 py-20 px-4">
                <div ref={contactAnimation.ref} className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center cyberhype-heading tracking-wider">
                        CONTACT
                    </h2>
                    <div className={`${isDarkMode ? 'bg-black/60 border-red-500' : 'bg-white/60 border-red-500'} backdrop-blur-sm p-8 border-2 glow-card rounded-2xl transition-all duration-1000 ${contactAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-8 text-center`}>
                            Let's collaborate on exciting projects or discuss opportunities in Full Stack Development and Machine Learning.
                        </p>
                        <div className="space-y-6 max-w-md mx-auto">
                            <div className={`flex items-center gap-4 p-4 border border-red-500/50 hover:border-red-500 transition-all duration-1000 glow-input rounded-xl ${contactAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                                <Mail className="text-red-500 glow-icon" size={24} />
                                <div>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-bold`}>EMAIL</p>
                                    <a
                                        href="mailto:mukeshkumark1755@gmail.com"
                                        className={`${isDarkMode ? 'text-white' : 'text-black'} font-bold hover:text-red-500 transition-colors duration-300 cursor-pointer`}
                                    >
                                        mukeshkumark1755@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className={`flex items-center gap-4 p-4 border border-red-500/50 hover:border-red-500 transition-all duration-1000 glow-input rounded-xl ${contactAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                                <Phone className="text-red-500 glow-icon" size={24} />
                                <div>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-bold`}>PHONE</p>
                                    <p className={`${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>+918608622547</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-4 p-4 border border-red-500/50 hover:border-red-500 transition-all duration-1000 glow-input rounded-xl ${contactAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                                <MapPin className="text-red-500 glow-icon" size={24} />
                                <div>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-bold`}>LOCATION</p>
                                    <p className={`${isDarkMode ? 'text-white' : 'text-black'} font-bold`}>INDIA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`relative z-10 py-8 px-4 border-t-2 border-red-500 glow-border ${isDarkMode ? 'bg-black' : 'bg-gray-100'}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center gap-4 mb-6">
                        {[
                            { href: "https://leetcode.com/u/MUKESH_KUMAR_K/", icon: SiLeetcode },
                            { href: "https://www.codechef.com/users/kit23bam032", icon: SiCodechef },
                            { href: "https://codolio.com/profile/Mukesh_Kumar", icon: FaEarlybirds },
                            { href: "https://github.com/MukeshKumar-17", icon: Github },
                            { href: "https://www.linkedin.com/in/mukesh-kumar-15317029b/", icon: Linkedin }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-white/40'} border-2 border-red-500 hover:border-red-400 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-300 glow-button transform hover:scale-110 rounded-lg`}
                            >
                                <social.icon size={24} className="glow-icon" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
