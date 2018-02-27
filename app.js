var express = require('express');
var parser = require('body-parser');
var port = 2001;

var app = express()

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json())
app.use(express.static("public"));

app.set('view engine', 'pug');

questions = [ 
'Усиление рекламы в СМИ',
'Реклама в радиоэфире',
'Реклама на центральном ТВ',
'Реклама на местном ТВ',
'Рекламный ролик выпускаемой продукции на ведущем телеканале страны в дорогое эфирное время',
'Реклама в Интернете',
'Установка выставочных стендов в главных торговых центрах города на длительный срок',
'Спонсирование значимого общественного мероприятия (КВН, парка детских аттракционов и пр.)'
]

var hardcode_array = [0,0,0,0,1,1,1,  1,0,0,0,1,0.5,0,  1,1,0,0,0.5,0,1,  1,1,1,0.5,1,0.5,0.5,  1,1,1,0.5,0.5,1,1,  0,0,0.5,0,0.5,1,0,  0,0.5,1,0.5,0,0,1,  0,1,0,0.5,0,1,0]
var experts_array = []

function matrix_size_for(array_size){
    return (1 + Math.sqrt(1 + 4*array_size)) / 2;
}

app.get('/', function(req,res){
    res.render('index');
});

app.get('/questions', function(req,res){
    res.render('questions');
});

app.get('/results', function(req,res){
    if(experts_array.length == 0){
        res.render('results', {matrix_size: matrix_size_for(hardcode_array.length)});
    }
    else{
        res.render('results', {matrix_size: matrix_size_for(experts_array.length)})
    }
});

app.get('/array', function(req,res){
    if(experts_array.length == 0){
        data = JSON.stringify({array: hardcode_array, matrix_size: matrix_size_for(hardcode_array.length)})
    }
    else{
        data = JSON.stringify({array: experts_array, matrix_size: matrix_size_for(experts_array.length)})
    }

    res.send(data);
});

app.get('/list_of_questions', function(req,res){
    res.send(JSON.stringify(questions))
});

app.get('/top_questions', function(req,res){
    var N = 0
    var array = []

    if(experts_array.length == 0){
        N = matrix_size_for(hardcode_array.length)
        array = hardcode_array
    }
    else{
        N = matrix_size_for(experts_array.length)
        array = experts_array;
    }

    scores = []
    for(var i = 0, in_arr = 0; i < N; i++){
        line_score = 0
        for(var j = 0; j < N; j++){
            if(j != i){
                line_score += array[in_arr]
                in_arr++
            }
        }
        scores[i] = [i,line_score,questions[i]]
        console.log(scores)
    }

    scores.sort(function(first, second) {
        return second[1] - first[1];
    });

    res.send(scores)
});

app.post('/answers', function(req,res){
    var array = req.body.answers;
    // array = [0,0,0,0,1,1,1,  1,0,0,0,1,0.5,  0,1,1,0,0,  0.5,0,1,1,  1,1,0.5,  1,0.5,  0.5]
    var N = matrix_size_for(array.length * 2)
    for(var i = 0, pd = 0, ps = 0; i < N; i++){ // pd - pointer destination, ps = pointer source
        for(var j = 0; j < i; j++, pd++){
            experts_array[pd] = 1 - (array[i + (N - 2 - j)]); // inverting elements (fill matrxi until diag)
        }
        for(var j = 0; j < N - 1 - i; j++, ps++, pd++){
            console.log(pd)
            experts_array[pd] = array[ps]
        }
        console.log('end' + pd)
    }
    res.send(experts_array);
});

app.listen(port, function(){console.log('server started at port #' + port)})