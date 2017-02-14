$(document).ready(function() {

    $(window).scroll(function() {
        var top = $(this).scrollTop();
        console.log(top);
        if (top > 100) {
            $('header').addClass('newhead');
        } else {
            $('header').removeClass('newhead');
        }

    })





    /*  $('.mobile').click(function() {
          if ($('header ul').is(":hidden")) {
              $('header ul').slideToggle('fast');
          } else $('header ul').slideUp();
      }); */


    /*      $('.text a').hover(function() {
              $('.text h2').animate({
                  background - color: "#FF8C00"
              }, 'slow');

          }, function() {
              $('.text h2').animate({
                  color: "white"
              }, 'slow');
          }); */





});