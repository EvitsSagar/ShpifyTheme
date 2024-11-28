import Alpine from 'alpinejs'
 
window.Alpine = Alpine
 
Alpine.start()


document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("page-loader");

    loader.classList.remove("hidden");

    window.onload = function () {
        loader.classList.add("hidden");
    };
});
