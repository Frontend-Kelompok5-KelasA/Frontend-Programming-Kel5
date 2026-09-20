$(document).ready(function() {
    let txtHeader = $('.text-header'); 
    
    txtHeader.delay(500).animate({
        opacity: 1,
        width: '100%'
    }, 1000);
});

$(document).ready(function() {
    let tanya = $('.question');
    let jawab = $('.answer');

    jawab.hide();
    tanya.css('cursor', 'pointer');

    tanya.click(function() {
        $(this).next('.answer').slideToggle(300);
    });
});