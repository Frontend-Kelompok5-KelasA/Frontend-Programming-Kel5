$(document).ready(function() {
    let tanya = $('.question');
    let jawab = $('.answer');

    jawab.hide();
    tanya.css('cursor', 'pointer');

    tanya.click(function() {
        $(this).next('.answer').slideToggle(300);
    });
});