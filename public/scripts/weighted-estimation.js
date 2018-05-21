$(document).ready(function(){
    var questCount = 0;
    var expertsCount = 0;
    var estimations = [];

    $.get('/research-params', function(res){
        res = JSON.parse(res);
        questCount = res.questions.length;
        expertsCount = res.expertsGroup.length;
    }).fail(function(){
        alert('Get request "/question-num" failed');
    });

    $('#submitButton').click(function(event){
        estimations = [];
        lineWeight = 0;
        // clean highlights
        $('#row').removeClass('incorrect-input');

        for(var j = 0; j < questCount; j++){
            est = (+$('#est'+(+j+1)).text());
            estimations.push(est);
            lineWeight += (+est);
        }
        if(Math.abs(lineWeight - 100) > 0.001){
            alert('Sum of weights in line must be equal to 100%');
        }else{ // all is correct => send estimations
            expertName = $('#name').text().replace(/(by )/, '');
            data = {expertName: expertName, estimations: JSON.stringify(estimations)};
            $.post('/weight-est-res', data, function(res){console.log(res)}, 'text')
            window.location.replace('/');
        }
    });
});