$(document).ready(function(){
    $('#learn').on('click',function(){
        $('html, body').animate({
            scrollTop: $(".section-2").offset().top
         }, 1000);
    })
    $(window).on('scroll',function(){
        var scroll = $(window).scrollTop();
        if(scroll > 500){
            $('.left').removeClass('unvis');
            $('.right').removeClass('unvis');
            $('.left').addClass('anime-left');
            $('.right').addClass('anime-right');
        }
    })
})