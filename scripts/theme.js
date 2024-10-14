document.addEventListener('DOMContentLoaded', () => {
    const savedColorMode = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    function applyTheme(mode) { document.documentElement.setAttribute('data-theme', mode); }
    applyTheme(savedColorMode);

    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.id.replace('-theme', '');
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });
    });
});