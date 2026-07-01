(function () {
    function expand() {
        document.querySelectorAll('details').forEach(d => {
            d.open = true;
        });
    }

    setInterval(expand, 1000);
})();
