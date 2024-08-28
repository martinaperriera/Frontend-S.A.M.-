
document.addEventListener('DOMContentLoaded', function() {
    var accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(function(item) {
        item.querySelector('.accordion-header').addEventListener('click', function() {
            // Chiudi gli altri accordi
            accordionItems.forEach(function(innerItem) {
                if (innerItem !== item) {
                    innerItem.classList.remove('active');
                }
            });

            // Alterna lo stato attivo
            item.classList.toggle('active');
        });
    });
});

