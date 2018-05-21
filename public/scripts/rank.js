$(document).ready(function(){
    var questCount = 0;
    var expertsCount = 0;
    var estimations = []

    $.get('/research-params', function(res){
        res = JSON.parse(res);
        questCount = res.questions.length;
        expertsCount = res.expertsGroup.length;
    }).fail(function(){
        alert('Get request "/question-num" failed');
    });

    $('#submitButton').click(function(event){
        lineWeight = 0;
        // clean highlights
        for(var j = 0; j < questCount; j++){
            $('#est' + (+j+1)).removeClass('incorrect-input');
        }

        var incorrectIndeces = [];
        var incorrect = false;
        for(var j = 0; j < questCount; j++){
            est = (+$('#est'+(+j+1)).text());
            estimations.push(est);
            if((est <= 0 || est > 10) || !(/^\d+$/.test(est))){
                incorrect = true;
                incorrectIndeces.push(j);
            }
        }

        if(incorrect){
            alert('Please, check your marks. It must be whole numbers between 1 ... 10');
            for(var j = 0; j < incorrectIndeces.length; j++){
                $('#est' + (+incorrectIndeces[j]+1)).addClass('incorrect-input');
            }
        }else{ // all is correct => send estimations
            expertName = $('#name').text().replace(/(by )/, '');
            data = {expertName: expertName, estimations: JSON.stringify(estimations)};
            $.post('/rank-est-res', data, function(res){console.log(res)}, 'text')
            window.location.replace('/');
        }
    });
});