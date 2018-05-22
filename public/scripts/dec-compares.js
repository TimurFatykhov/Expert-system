$(document).ready(function(){
    var answers = [];
    var ans_count = 0;

    var maxPoint = prompt('Enter the scale (maximal estimation)', '100');
    while(!Number.isInteger(+maxPoint)){
      alert('Please, enter integer number')
      maxPoint = prompt('Enter the scale (integer only)', '100');
    }
    var firstPoints = [];
    var secondPoints = [];

    $('.mid').text(`${Math.floor(maxPoint/2)}/${maxPoint} : ${Math.ceil(maxPoint/2)}/${maxPoint}`);
    $('.wish').text('Click on alternatives to increase its points');

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

              for(var i = 0; i < ans_count; i++){
                firstPoints.push(Math.floor(maxPoint/2));
                secondPoints.push(Math.ceil(maxPoint/2));
              }
          },
          error: function(err){
              alert("Get error");
          }
      });
  
    $('.mid').click(function(event){
      // show form with estimations

    });
  
    $('.q').click(function(event){
      var id = event.target.id
      var num = id.replace(/\D/g, "");
      var side = id.replace(/q_\d+_/g, "");

      if (side=='left' & (firstPoints[num-1] < 0 | firstPoints[num-1] > +maxPoint - 1) ) return
      if (side=='right' & (secondPoints[num-1] < 0 | secondPoints[num-1] > +maxPoint - 1) ) return

      if (side == 'left'){
        firstPoints[num-1] += 1;
        secondPoints[num-1] -= 1;
      }
      else{
        secondPoints[num-1] += 1;
        firstPoints[num-1] -= 1;
      }
  
      if (firstPoints[num-1] == maxPoint){
        ($('#mid_'+num).text(`1 : 0`));
        return;
      }
      if (secondPoints[num-1] == maxPoint){
        ($('#mid_'+num).text(`0 : 1`));
        return;
      }
      
      ($('#mid_'+num).text(`${firstPoints[num-1]}/${maxPoint} : ${secondPoints[num-1] }/${maxPoint}`));


        // $('#'+'q_'+ num + '_left').toggleClass('clicked')
        // ($('#mid_'+num).toggleClass('clicked'))
    });

    $("#submit").click(function()
    {
      ans_count;
      var points = [];
      for(var i = 0; i < ans_count; i++){
        points.push(0);
      }
      
      for(var num = 1, chSize = ans_count - 1, glP = 0; num < ans_count; num++, chSize--){
        for(var withinChunk = 0; withinChunk < chSize; glP++, withinChunk++){
          points[num-1] += firstPoints[glP];
          points[num + withinChunk] += secondPoints[glP];
        }
      }

      for(var i = 0; i < ans_count; i++){
        points[i] /= maxPoint;
      }

      $.ajax(
        {
            type: 'POST',
            url: '/dec-comp-res',
            data: JSON.stringify({'points': points, 'maxPoint': maxPoint}),
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
  