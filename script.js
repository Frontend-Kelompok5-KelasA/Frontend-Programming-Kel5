document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('#masuk');

    button.addEventListener('click', function() {
        window.location.href = 'home.html';
        console.log('Button clicked!');
    });
 
});