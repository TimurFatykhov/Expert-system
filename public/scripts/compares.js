$(document).ready(function(){
  var answers = []
  var ans_count = 0

  $.ajax(
    {
        type: 'GET',
        url: '/questions-num',
        success: function(res) {
            ans_count = JSON.parse(res);
            if (ans_count <= 0){
                alert("Count <= 0");
            }
            else{
                for(var i = 0; i < ans_count; i++){
                  answers[i] = 0;
                }
            }
        },
        error: function(err){
            alert("Get error");
        }
    });

  $('.mid').click(function(event){
    var id = event.target.id;
    var num = id.replace(/\D/g, "");

    if( $('#'+id).hasClass('clicked') ){
      $('#'+id).removeClass('clicked');
      $('#'+'q_'+num+'_left').removeClass('clicked');
      $('#'+'q_'+num+'_right').removeClass('clicked');
      answers[num-1] = 0;
    }
    else{
      $('#'+id).addClass('clicked');
      $('#'+'q_'+num+'_left').addClass('clicked');
      $('#'+'q_'+num+'_right').addClass('clicked');
      answers[num-1] = 0.5;
    }
  });

  $('.q').click(function(event){
    var id = event.target.id
    var num = id.replace(/\D/g, "");
    var side = id.replace(/q_\d+_/g, "");

    if( $('#mid_'+num).hasClass('clicked') ){
      if (('q_'+ num + '_left') == id){
        $('#'+'q_'+ num + '_right').toggleClass('clicked') // remove
      }
      else{
        $('#'+'q_'+ num + '_left').toggleClass('clicked')
        answers[num - 1] = 0;
      }
      ($('#mid_'+num).toggleClass('clicked'))
      return
    }

    if (side == 'left'){
      if ($('#'+'q_'+ num + '_right').hasClass('clicked')){
        $('#'+'q_'+ num + '_right').toggleClass('clicked')
      }
      $('#'+'q_'+ num + '_left').toggleClass('clicked')
      answers[num - 1] = 1 - answers[num - 1];
    }
    else{ // for right
      if ($('#'+'q_'+ num + '_left').hasClass('clicked')){
        $('#'+'q_'+ num + '_left').toggleClass('clicked')
      }
      $('#'+'q_'+ num + '_right').toggleClass('clicked')
      answers[num - 1] = 0;
    }
    
  });

  $("#submit").click(function()
  {
    $.ajax(
      {
          type: 'POST',
          url: '/bin-comp-res',
          data: JSON.stringify({'answers': answers}),
          contentType: "application/json",
          success: function(res) 
          {
            window.location.replace("http://localhost:2001/");
          },
          error: function(err)
          {
              alert("Get error");
          }
      });
  });

});
