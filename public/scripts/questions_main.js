// $(document).ready(function(){
//     $("./").click(function(){
//         $("#q_num3").css('background-color', 'blue');;
//     });
// });
// var index = 1
// $(document).ready(function(){
//   for (var i = 0; i < 28; i++) {
//     $("#mid_num" + index).click(function(){
//         $("#mid_num" + index).css('background-color', 'blue');;
//         index = index + 1;
//
//     });
//   };
// });

var answers =[2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2,
              2,2,2,2,2,2,2,2];

$(document).ready(function(){
    var index = 1;
    var divs = "#q_num";
    // $("div").click(function(){
    //     $("div").find( "#q_num" ).css('background-color', 'blue');
    //     answers[3] = 1;
    //     $("#q_num4").css('background-color', 'blue');
    //     $("#q_num5").css('background-color', 'blue');
    //
    //   });
    $('.mid.with_border').click(function(){
      $(this).css('background-color', 'blue');
   });
   $('.q.with_border').click(function(){
     $(this).css('background-color', 'blue');
  });
    $("#test").click(function(){
         $.post('/answers', {'answers': answers});
       });


});
