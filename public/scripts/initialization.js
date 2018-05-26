$(document).ready(function(){
    var params
    var quest_top = {};
    var relative_competence = [0];
    $.ajax(
    {
        type: 'GET',
        url: '/init-params',
        success: function(res) {
            params = JSON.parse(res);
            for(var i = 1; i < params['quest-count'] + 1; i++){
                quest_top[i] = 0;
            }

        },
        error: function(err){
            alert("Get 'poll-params' error");
        }
    });

    var expertsCount = 1;
    $('#add-expert-button').click(function(event){
        if (expertsCount < params['maxExperts']){
            expertsCount += 1;
            $('.experts-table').append('<tr>' + 
                                            '<td>' + expertsCount + ')' + '</td>' +
                                            '<td contenteditable="true" id="name' + expertsCount + '">' + 'Exp_' + expertsCount + '</td>' +
                                            '<td contenteditable="true" id="quality' + expertsCount + '">' + 1 + '</td>'+
                                        '</tr>')
        }

        if (expertsCount == params['maxExperts']){
            $('#add-expert-button').addClass('disabled')
        }else{
            $('#add-expert-button').removeClass('disabled')
        }


        $('#rem-expert-button').removeClass('disabled')
    });

    $('#rem-expert-button').click(function(event){
        if (expertsCount == 1)
            return
        $('.experts-table tr:last').remove();

        if (expertsCount == 2){
            $('#rem-expert-button').addClass('disabled')
        }

        expertsCount -= 1;

        $('#add-expert-button').removeClass('disabled')
    });

    questCount = 2;
    $('#add-quest-button').click(function(event){
        if (questCount < params['maxQuest']){
            questCount += 1;
            $('.quest-table').append('<tr>' + 
                                            '<td style="vertical-align: top;">' + questCount + ')' + '</td>' +
                                            '<td>' +
                                                '<textarea cols="1" rows="2" id="quest' + questCount + '">' + params['placeholder'] + '</textarea>'+
                                            '</td>'+
                                        '</tr>')
        }
        if (questCount == params['maxQuest'])
            $('#add-quest-button').addClass('disabled')


        if (questCount == params['maxQuest']){
            $('#add-quest-button').addClass('disabled')
        }else{
            $('#add-quest-button').removeClass('disabled')
        }

        $('#rem-quest-button').removeClass('disabled')
    });

    $('#rem-quest-button').click(function(event){
        if (questCount == 2)
            return
        $('.quest-table tr:last').remove();

        if (questCount == 3){
            $('#rem-quest-button').addClass('disabled')
        }

        questCount -= 1;

        $('#add-quest-button').removeClass('disabled')
    });


    $('#submit').click(function(event){
        incorrect = false
        for (var i = 1; i < questCount+1; i++){
            if ($('#quest'+i).val().localeCompare(params['placeholder']) == 0){
                $('#quest'+i).parent().parent().removeClass('correct-input')
                $('#quest'+i).parent().parent().addClass('incorrect-input')
                incorrect = true;
            }else{
                $('#quest'+i).parent().parent().removeClass('incorrect-input')
                $('#quest'+i).parent().parent().addClass('correct-input')
            }
        }
        if(incorrect){
            alert('Fill questions')
        }
        else{ // all questions are correct
            expertsGroup = []
            expertList = [];
            questions = []
            for(var i = 0; i < expertsCount; i++){
                expertsGroup.push( {name: $('#name' + (+i+1)).text(), weight: $('#quality' + (+i+1)).text() })
                expertList.push($('#name' + (+i+1)).text());
            }
            for(var i = 0; i < questCount; i++){
                questions.push ( $('#quest' + (+i+1)).val() )
            }
            problem = $('#problem').text()
            data = {'problem': problem, 'expertsGroup': expertsGroup, 'questions': questions, 'expertList': expertList}
            data = {param: JSON.stringify(data)}
            
            console.log(data)
            // send data
            $.post('/interview-params', data, function(res){if (res == 'ok') window.location.replace('/')}, 'text')
        }
    });
  });
  