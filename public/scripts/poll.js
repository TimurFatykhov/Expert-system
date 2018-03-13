$(document).ready(function(){
    var params
    var quest_top = {};
    var relative_competence = [0];
    $.ajax(
    {
        type: 'GET',
        url: '/poll_params',
        success: function(res) {
            params = JSON.parse(res);
            for(var i = 1; i < params['quest_count'] + 1; i++){
                quest_top[i] = 0;
            }

        },
        error: function(err){
            alert("Get 'poll_params' error");
        }
    });


    var experts_count = 1;
    $('#addExpertButton').click(function(event){
        if (experts_count < params['max_experts']){
            experts_count += 1;
            $('.experts_table').append('<tr>' + 
                                            '<td>' + experts_count + ')' + '</td>' +
                                            '<td>' + 'Exp_' + experts_count + '</td>' +
                                            '<td contenteditable="true" id="quality' + experts_count + '">' + 1 + '</td>'+
                                        '</tr>')

            $('.estimation_table').append('<tr id="row' + (+experts_count) + '">' + 
                                                '<td>' + 'Exp_' + experts_count + '</td>')

            for(var i = 0; i < params['quest_count']; i++){
                $('#row'+(+experts_count)).append('<td contenteditable="true">' + (1/params['quest_count']) + '</td>')
            }
            $('.estimation_table').append('</tr>')

            relative_competence[experts_count - 1] = 0;
        }
        if (experts_count == params['max_experts'])
            $('#addExpertButton').addClass('disabled_button')
    });

    $('#submitButton').click(function(event){
        $('.result_block').append('<h1>Result</h1>')

        var summ_qual = 0
        for(var i = 0; i < experts_count; i++){
            summ_qual += (+$('#quality'+(+i+1)).text());
        }
        
        for(var i = 0; i < experts_count; i++){
            relative_competence[i] += (+$('#quality'+(+i+1)).text()) / summ_qual;
        }

        for(var i = 0; i < experts_count; i++){
            for( var j = 0; j < params['quest_count']; j++){
                quest_top[+j+1] += (+$('#row'+ (+i+1) + ' :nth-child(' + (+j+2) + ')').text()) * relative_competence[i];
            }

        }
        
        // сортировка топа
        scores = []
        for(var i = 0; i < params['quest_count']; i++){
            scores[i] = [quest_top[+i+1],params['questions'][i]]
        }
        scores.sort(function(first, second) {
            return second[0] - first[0];
        });

        // вывод топа 
        for(var i = 0; i < params['quest_count']; i++){
            $('.result_block').append('<p1>' +'#' + (+i+1)  + ') ' + scores[i][1] + '</p1>' + '<br>')
        }
        scrollBy(0,300);
    });
  });
  