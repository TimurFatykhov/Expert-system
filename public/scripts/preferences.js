$(document).ready(function(){
    var questCount = 0;
    var expertsCount = 0;
    var estimations = [];
    var maxPref = 0;

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

        estimations = []
        var incorrectIndeces = [];
        var incorrect = false;
        for(var j = 0; j < questCount; j++){
            est = (+$('#est'+(+j+1)).text());
            estimations.push(est);
            if (est > maxPref){
                maxPref = est;
            }
            if(!/^\d+$/.test(est)){
                incorrect = true;
                incorrectIndeces.push(j);
            }
        }

        sortedEstimations = estimations;
        sortedEstimations.sort();
        alert(sortedEstimations);
        for (i in sortedEstimations){
            if ((+i + 1) !== sortedEstimations[i]){
                incorrect = true;
            }
        }

        if(incorrect){
            alert('Please, check your marks. It must be integers. And numbers from 1 to number of questions');
            for(var j = 0; j < incorrectIndeces.length; j++){
                $('#est' + (+incorrectIndeces[j]+1)).addClass('incorrect-input');
            }
        }else{ // all is correct => send estimations
            expertName = $('#name').text().replace(/(by )/, '');
            data = {expertName: expertName, estimations: JSON.stringify(estimations), maxPref: maxPref};
            $.post('/preferences-est-res', data, function(res){console.log(res)}, 'text')
            maxPref = 0;
            window.location.replace('/');
        }
    });
});