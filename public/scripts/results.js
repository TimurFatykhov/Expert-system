
$(document).ready(function()
{
    var matrix_size = 0;

    $.ajax(
        {
            type: 'GET',
            url: '/array',
            success: function(res) 
            {
                res = JSON.parse(res);
                if(res.length == 0){
                    alert('Nobody answered by compare method!')
                    return
                }
                array = res['array']
                matrix_size = res['matrix_size'];
                array_size = matrix_size**2
                if (array_size <= 0)
                {
                    // alert("Array is empty :(");
                }
                else
                {
                    for(var i = 0, j = 0; i < array_size; i++){
                        if(i % matrix_size == Math.floor(i / matrix_size)){
                            $('#cell'+(+i+1)).html(' ');
                        }
                        else{
                            $('#cell'+(+i+1)).html(array[j]);
                            j++;
                        }
                    }
                }
            },
            error: function(err)
            {
                alert("Get error");
            }
        });

        $.ajax(
            {
                type: 'GET',
                url: '/top-questions',
                success: function(res) 
                {
                    scores = res;
                    if(scores.length == 0){
                        alert('Nobody answered by compare method!')
                        return
                    }
                    question_count = scores.length
                    if (question_count <= 0)
                    {
                        // alert("Array is empty :(");
                    }
                    else
                    {
                        var tag = 'comp' // define the table with results
                        for(var i = 0; i < question_count; i++){
                            $('#q_num_'+tag+(+i+1)).html('Z'+(+scores[i][0]+1));
                            $('#quest_'+tag+(+i+1)).html(scores[i][2]);
                        }
                    }
                },
                error: function(err)
                {
                    alert("Get comp error");
                }
            });



        $.ajax(
            {
                type: 'GET',
                url: '/top-w-est-questions',
                success: function(res) 
                {
                    scores = res.scores;
                    without = res.withoutExperts;
                    question_count = scores.length
                    if (question_count <= 0)
                    {
                        // console.log("GET_/top-w-est-questions -> Array is empty :(");
                    }
                    else
                    {
                        var tag = 'w-est' // define the table with results
                        for(var i = 0; i < question_count; i++){
                            $('#q_num_'+tag+(+i+1)).html('Z'+(+scores[i][0]+1));
                            $('#quest_'+tag+(+i+1)).html(scores[i][2]);
                        }
                    }
                    if(without.length > 0){
                        alert(JSON.stringify(without) + " didn't answer by weighted estimation method");
                    }
                },
                error: function(err)
                {
                    alert("Get w-est error");
                }
            });

        $.ajax(
            {
                type: 'GET',
                url: '/top-pref-est-questions',
                success: function(res) 
                {
                    scores = res.scores;
                    without = res.withoutExperts;
                    question_count = scores.length
                    if (question_count <= 0)
                    {
                        // alert("Array is empty :(");
                    }
                    else
                    {
                        var tag = 'pref-est' // define the table with results
                        for(var i = 0; i < question_count; i++){
                            $('#q_num_'+tag+(+i+1)).html('Z'+(+scores[i][0]+1));
                            $('#quest_'+tag+(+i+1)).html(scores[i][2]);
                        }
                    }
                    if(without.length > 0){
                        alert(JSON.stringify(without) + " didn't answer by preferences method");
                    }
                },
                error: function(err)
                {
                    alert("Get pref-res error");
                }
            });

        $.ajax(
            {
                type: 'GET',
                url: '/top-rank-est-questions',
                success: function(res) 
                {
                    scores = res.scores;
                    without = res.withoutExperts;
                    question_count = scores.length;
                    if (question_count <= 0)
                    {
                        // alert("Array is empty :(");
                    }
                    else
                    {
                        var tag = 'rank-est' // define the table with results
                        for(var i = 0; i < question_count; i++){
                            $('#q_num_'+tag+(+i+1)).html('Z'+(+scores[i][0]+1));
                            $('#quest_'+tag+(+i+1)).html(scores[i][2]);
                        }
                    }
                    if(without.length > 0){
                        alert(JSON.stringify(without) + " didn't answer by rank estimation method");
                    }
                },
                error: function(err)
                {
                    alert("Get rank-res error");
                }
            });

    $.ajax(
        {
            type: 'GET',
            url: '/top-dec-comp',
            success: function(res) 
            {
                scores = res.scores;
                without = res.withoutExperts;
                question_count = scores.length
                console.log('scores/res: ' + JSON.stringify(scores));
                if (question_count <= 0)
                {
                    // alert("GET_/top-dec-comp -> Array is empty :(");
                }
                else
                {
                    var tag = 'dec-comp-est' // define the table with results
                    for(var i = 0; i < question_count; i++){
                        $('#q_num_'+tag+(+i+1)).html('Z'+(+scores[i][0]+1));
                        $('#quest_'+tag+(+i+1)).html(scores[i][2]);
                    }
                }
                if(without.length > 0){
                    alert(JSON.stringify(without) + " didn't answer by decimal compares method");
                }
            },
            error: function(err)
            {
                alert("Get dec-comp-res error");
            }
        });
});