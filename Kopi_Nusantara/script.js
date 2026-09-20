const textHeader = document.getElementsByClassName('text-header')[0];

setTimeout(() => {
    let current = 0;
    const textTask = setInterval(() => {
        current += 0.01;

        textHeader.style.opacity = current;
        textHeader.style.width = current * 100 + '%';

        if(current >= 1){
            clearInterval(textTask);
        }
    }, 10);
}, 500);

$(document).ready(function() {
    let tanya = $('.question');
    let jawab = $('.answer');

    jawab.hide();
    tanya.css('cursor', 'pointer');

    tanya.click(function() {
        $(this).next('.answer').slideToggle(300);
    });
});