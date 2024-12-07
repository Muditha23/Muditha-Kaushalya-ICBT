document.addEventListener('keydown', function(e) {
            // Disable Ctrl + U (View Page Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
            }
            // Disable Ctrl + Shift + I (Open Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
            }
            // Disable F12 (Open Developer Tools)
            if (e.key === 'F12') {
                e.preventDefault();
            }
            // Disable Ctrl + Shift + C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
            }
            // Disable Ctrl + Shift + J (Open Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
            }
            // Disable Ctrl + S (Save Page)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
            }
            // Disable Ctrl + P (Print Page)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
            }
            // Disable Ctrl + A (Select All)
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
            }
            // Disable right-click context menu
            if (e.button === 2) {
                e.preventDefault();
            }
        });