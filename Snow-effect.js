function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Random horizontal start position
    snowflake.style.left = `${Math.random() * 100}%`;
    
    // Random size between 2-8 pixels
    const size = Math.random() * 6 + 2;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    
    // Random fall duration between 10-20 seconds
    snowflake.style.animationDuration = `${Math.random() * 10 + 10}s`;
    
    document.body.appendChild(snowflake);
    
    // Remove snowflake after animation ends
    setTimeout(() => {
        snowflake.remove();
    }, 20000);
}

// Create snow effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create style for snowflakes
    const style = document.createElement('style');
    style.textContent = `
        .snowflake {
            position: fixed;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.8;
            animation: fall linear infinite;
        }
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    // Start continuous snowfall
    setInterval(createSnowflake, 200);
});
