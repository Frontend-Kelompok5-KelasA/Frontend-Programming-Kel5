// animasi header
$(document).ready(function() {
    let txtHeader = $('.text-header'); 
    
    txtHeader.delay(500).animate({
        opacity: 1,
        width: '100%'
    }, 1000);

    let question = $('.question');
    let answer = $('.answer');

    // Faq toggle
    answer.hide();
    question.css('cursor', 'pointer');

    question.click(function() {
        $(this).next('.answer').slideToggle(300);
    });

    let section = $('section:not(#home)');
    section.css('opacity', 0);

    // animasi fadeTo untuk setiap section
    $(window).scroll(function() {
        let position = $(window).scrollTop();
        let screenHeight = $(window).height();

        section.each(function() {
            let currentSection = $(this);
            let topSection = currentSection.offset().top;
            let bottomSection = topSection + currentSection.outerHeight();

            if (position + screenHeight > topSection + 150 && position < bottomSection - 150) {
                if (currentSection.css('opacity') == 0) {
                    currentSection.fadeTo(400, 1);
                }
            } else {
                if (currentSection.css('opacity') == 1) {
                    currentSection.stop(true, true).fadeTo(400, 0);    
                }
            }
        });
    });

    $(window).trigger('scroll');
});