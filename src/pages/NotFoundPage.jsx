import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiHome } from "react-icons/hi";
import './NotFoundPage.css';

// Combined component for 404 page
export default function NotFoundPage() {
    return (
        <div className="not-found-page">
            <MessageDisplay />
            <CharactersAnimation />
            <CircleAnimation />
        </div>
    );
}

// 1. Message Display Component
function MessageDisplay() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="not-found-msg__container">
            <div
                className={`not-found-msg__content ${isVisible ? 'visible' : ''}`}
            >
                <div className="not-found-msg__title">
                    Page Not Found
                </div>
                <div className="not-found-msg__code">
                    404
                </div>
                <div className="not-found-msg__desc">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </div>
                <div className="not-found-msg__actions">
                    <button
                        onClick={() => window.history.back()}
                        className="not-found-btn not-found-btn--outline"
                    >
                        <HiArrowLeft size={20} />
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="not-found-btn not-found-btn--filled"
                    >
                        <HiHome size={20} />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

// 2. Characters Animation Component
function CharactersAnimation() {
    const charactersRef = useRef(null);

    useEffect(() => {
        // Define stick figures with their properties
        const stickFigures = [
            {
                top: '0%',
                src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg',
                transform: 'rotateZ(-90deg)',
                speedX: 1500,
            },
            {
                top: '10%',
                src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick1.svg',
                speedX: 3000,
                speedRotation: 2000,
            },
            {
                top: '20%',
                src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick2.svg',
                speedX: 5000,
                speedRotation: 1000,
            },
            {
                top: '25%',
                src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg',
                speedX: 2500,
                speedRotation: 1500,
            },
            {
                top: '35%',
                src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg',
                speedX: 2000,
                speedRotation: 300,
            },
            {
                bottom: '5%',
                src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick3.svg',
                speedX: 0, // No horizontal movement
            },
        ];

        // Clear existing content
        if (charactersRef.current) {
            charactersRef.current.innerHTML = '';
        }

        // Create and animate each stick figure
        stickFigures.forEach((figure, index) => {
            const stick = document.createElement('img');
            stick.classList.add('characters');
            stick.style.position = 'absolute';
            stick.style.width = '12%'; // Adjusted size for better fit
            stick.style.height = '12%';

            // Set position
            if (figure.top) stick.style.top = figure.top;
            if (figure.bottom) stick.style.bottom = figure.bottom;

            // Set image source
            stick.src = figure.src;

            // Set initial transform if specified
            if (figure.transform) stick.style.transform = figure.transform;

            // Append to the container
            charactersRef.current?.appendChild(stick);

            // Skip animation for the last figure (index 5)
            if (index === 5) return;

            // Horizontal movement animation
            stick.animate(
                [{ left: '100%' }, { left: '-20%' }],
                { duration: figure.speedX, easing: 'linear', fill: 'forwards' }
            );

            // Skip rotation for the first figure (index 0)
            if (index === 0) return;

            // Rotation animation
            if (figure.speedRotation) {
                stick.animate(
                    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }],
                    { duration: figure.speedRotation, iterations: Infinity, easing: 'linear' }
                );
            }
        });

        // Cleanup function
        return () => {
            if (charactersRef.current) {
                charactersRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div
            ref={charactersRef}
            className="not-found-chars"
        />
    );
}

// 3. Circle Animation Component
function CircleAnimation() {
    const canvasRef = useRef(null);
    const requestIdRef = useRef();
    const timerRef = useRef(0);
    const circulosRef = useRef([]);

    // Initialize circles array
    const initArr = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        circulosRef.current = [];

        for (let index = 0; index < 300; index++) {
            const randomX = Math.floor(
                Math.random() * ((canvas.width * 3) - (canvas.width * 1.2) + 1)
            ) + (canvas.width * 1.2);

            const randomY = Math.floor(
                Math.random() * ((canvas.height) - (canvas.height * (-0.2) + 1))
            ) + (canvas.height * (-0.2));

            const size = Math.max(2, canvas.width / 1000); // Ensure minimum visible size

            circulosRef.current.push({ x: randomX, y: randomY, size });
        }
    };

    // Drawing function
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        timerRef.current++;
        context.setTransform(1, 0, 0, 1, 0, 0);

        const distanceX = canvas.width / 80;
        const growthRate = canvas.width / 1000;

        context.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white
        context.clearRect(0, 0, canvas.width, canvas.height);

        circulosRef.current.forEach((circulo) => {
            context.beginPath();

            if (timerRef.current < 65) {
                circulo.x = circulo.x - distanceX;
                circulo.size = circulo.size + growthRate;
            }

            if (timerRef.current > 65 && timerRef.current < 500) {
                circulo.x = circulo.x - (distanceX * 0.02);
                circulo.size = circulo.size + (growthRate * 0.2);
            }

            context.arc(circulo.x, circulo.y, circulo.size, 0, 360);
            context.fill();
        });

        if (timerRef.current > 500) {
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
            return;
        }

        requestIdRef.current = requestAnimationFrame(draw);
    };

    // Initialize canvas and start animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Initialize and start animation
        timerRef.current = 0;
        initArr();
        draw();

        // Handle window resize
        const handleResize = () => {
            if (!canvas) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            timerRef.current = 0;
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }

            const context = canvas.getContext('2d');
            if (context) {
                context.reset();
            }

            initArr();
            draw();
        };

        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="not-found-canvas" />;
}
