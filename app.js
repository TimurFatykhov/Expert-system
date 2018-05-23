var express = require('express');
var parser = require('body-parser');
var cookieParser = require('cookie-parser');
var port = 2001;

var app = express()

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json())
app.use(express.static("public"));
app.use(cookieParser());

app.set('view engine', 'pug');

var initWasPerform = false; // инициализация вопроса была проведена

app.get('/', function(req,res){
    if (initWasPerform) 
        res.render('general/main-page', {ableStatus: ''});
    else 
        res.render('general/main-page', {ableStatus: 'disabled'});
});

questions_hardcore = [ 
    // 'Усиление рекламы в СМИ',
    // 'Реклама в радиоэфире',
    // 'Реклама на центральном ТВ',
    // 'Реклама на местном ТВ',
    // 'Рекламный ролик выпускаемой продукции на ведущем телеканале страны в дорогое эфирное время',
    // 'Реклама в Интернете',
    // 'Установка выставочных стендов в главных торговых центрах города на длительный срок',
    // 'Спонсирование значимого общественного мероприятия (КВН, парка детских аттракционов и пр.)'
    ]
// hardcode answers for 1-st lab.
var hardcode_array = [0,0,0,0,1,1,1,  1,0,0,0,1,0.5,0,  1,1,0,0,0.5,0,1,  1,1,1,0.5,1,0.5,0.5,  1,1,1,0.5,0.5,1,1,  0,0,0.5,0,0.5,1,0,  0,0.5,1,0.5,0,0,1,  0,1,0,0.5,0,1,0];
var comparesByExp = [];

// main dictionary with research info
var research = {}
expertsGroup = [{name: 'firstName', weight: '1'}, {name: 'secondName', weight: '2'}, {name: 'thirdName', weight: '3'}];
research.questions = questions_hardcore;
research.questionCount = questions_hardcore.length
research.expertsGroup = expertsGroup;
research.problemName = 'No name'

var researchResults = {}

researchResults.compare = {}
researchResults.weightEst = {}
researchResults.pref = {}
researchResults.rank = {}
researchResults.decCompare = {}

// parameters for initialization page
maxExperts = 4;
maxQuest = 5;
questPlaceholder = 'Add question here';


 // ------------------------------------ FUNCTIONS ------------------------------------

// calculate the size of a squared matrix from a 1-dimension array
function matrixSizeFor(array_size){
    return (1 + Math.sqrt(1 + 4*array_size)) / 2;
}

 // ------------------------------------ MIDDLEWARES ------------------------------------

 app.get('/login/:url', function (req, res, next) {
    var url = req.params.url;
    var expertsNames = []
    var group = research.expertsGroup
    for(var i = 0; i < group.length; i++){
        expertsNames.push(group[i]['name']);
    }
    res.render('2nd-lab/login', {expertsNames: expertsNames, url: '/' + url});
  })

 // ------------------------------------ PAGES ------------------------------------

 // binary compares
app.get('/compares', function(req,res){
    res.render('1st-lab/compares', {jsScriptName: 'scripts/compares.js', cssName: 'css/1st-lab/compares.css',  quest_num: research['questions'].length, quest_list: research['questions']});
});

// decimal compares
app.get('/dec-compares', function(req,res){
    expertName = req.query.name;
    var pollsObj = {expertName: expertName};

    res.cookie('expertName', expertName, { maxAge: 900000, httpOnly: true });   // set a cookie

    res.render('1st-lab/compares', {jsScriptName: 'scripts/dec-compares.js', 
                                    cssName: 'css/4th-lab/dec-compares.css', 
                                    quest_num: research['questions'].length, 
                                    quest_list: research['questions']});
});

app.get('/results', function(req,res){
    if(comparesByExp.length == 0){
        res.render('1st-lab/results', {problem: research.problemName, matrix_size: matrixSizeFor(hardcode_array.length)});
    }
    else{
        res.render('1st-lab/results', {problem: research.problemName, matrix_size: matrixSizeFor(comparesByExp.length)})
    }
});

app.get('/initialization', function(req,res){
    res.render('2nd-lab/initialization', {placeholder: questPlaceholder});
});

app.get('/weighted-estimation', function(req, res){
    expertName = req.query.name;
    res.render('2nd-lab/weighted-estimation', {questions: research['questions'], expertName: expertName})
});

app.get('/preferences', function(req,res){
    expertName = req.query.name;
    res.render('3rd-lab/preferences', {questions: research['questions'], expertName: expertName})
});

app.get('/rank', function(req,res){
    expertName = req.query.name;
    res.render('3rd-lab/rank', {questions: research['questions'], expertName: expertName})
});

// ------------------------------------ RESEARCH INFO ------------------------------------

app.get('/list-of-questions', function(req,res){
    res.send(JSON.stringify(research['questions']))
});

app.get('/questions-num', function(req, res){
    var N = research['questions'].length;
    N = (N * (N - 1)) / 2;
    res.send(JSON.stringify(N));
});

app.get('/research-params', function(req, res){
    res.send(JSON.stringify(research));
});

// ------------------------------------ BINARY COMPARES ------------------------------------

app.get('/array', function(req,res){
    if(comparesByExp.length == 0){
        data = JSON.stringify({array: hardcode_array, matrix_size: matrixSizeFor(hardcode_array.length)})
    }
    else{
        data = JSON.stringify({array: comparesByExp, matrix_size: matrixSizeFor(comparesByExp.length)})
    }
    res.send(data);
});

// catching results of comparisons
app.post('/bin-comp-res', function(req,res){
    console.log('in /bin-comp-res');
    comparesByExp = [];
    var array = req.body.answers;
    var N = matrixSizeFor(array.length * 2)
    for(var i = 0, pd = 0, ps = 0; i < N; i++){ // pd - pointer destination, ps = pointer source
        for(var j = 0, inv_pointer = i-1; j < i; j++, pd++, inv_pointer += N - 1 - j){
            comparesByExp[pd] = 1 - (array[inv_pointer]); // inverting elements (fill matrxi until diag)
        }
        for(var j = 0; j < N - 1 - i; j++, ps++, pd++){
            comparesByExp[pd] = array[ps]
        }
    }
    res.send(comparesByExp);
});

// top by compare
app.get('/top-questions', function(req,res){
    var N = 0
    var array = []

    if(comparesByExp.length == 0){
        N = matrixSizeFor(hardcode_array.length)
        array = hardcode_array
    }
    else{
        N = matrixSizeFor(comparesByExp.length)
        array = comparesByExp;
    }

    scores = []
    for(var i = 0, ap = 0; i < N; i++){
        line_score = 0
        for(var j = 0; j < N - 1; j++, ap++){
            line_score += array[ap]
        }
        scores[i] = [i,line_score,research['questions'][i]]
    }

    scores.sort(function(first, second) {
        return second[1] - first[1];
    });

    res.send(scores)
});

// ------------------------------------ DECIMAL COMPARES ------------------------------------

// catching results of decimal comparisons
app.post('/dec-comp-res', function(req,res){
    var data = req.body;

    var expertName = req.cookies.expertName;
    var points = data.points;
    var maxPoint = data.maxPoint;

    var normPoints = [];
    var n = research.questionCount;
    console.log('n: ' + n)
    for(var i = 0; i < n; i++){
        normPoints.push(points[i] / (n*(n-1)) )
    }

    researchResults.decCompare[expertName] = normPoints;

    // console.log(`${expertName} : ${points}`);
    console.log(JSON.stringify(researchResults));
    res.send('ok');
});

// top by decimal compare
app.get('/top-dec-comp', function(req,res){
    console.log('in /top-dec-comp');
    var scores = []
    for(var i = 0; i < research.questionCount; i++){
        scores.push([i, 0, research['questions'][i]]);  // <-- number / score / question
    }

    var keys = Object.keys(researchResults.decCompare);

    console.log(keys);
    console.log(researchResults.decCompare[keys[0]]);
    console.log(scores);


    for(i in keys){
        for(var j = 0; j < research.questionCount; j++){
            scores[j][1] = researchResults.decCompare[keys[i]][j]
        }
    }

    scores.sort(function(first, second) {
        return second[1] - first[1];
    });

    res.send(scores)
});


app.get('/init-params', function(req,res){
    res.send(JSON.stringify({maxExperts: maxExperts, maxQuest: maxQuest, placeholder: questPlaceholder}));
});

app.post('/interview-params', function(req,res){
    data = req.body.param
    data = JSON.parse(data)
    expertsGroup = data.expertsGroup
    research.questions = data['questions']
    research.questionCount = data['questions'].length
    research.expertsGroup = expertsGroup;
    research.problemName = data.problem
    res.send('ok')

    var summ = 0;
    for(i in research.expertsGroup){
        research.expertsGroup[i]['rel-weight'] = 0;
        summ += +research.expertsGroup[i]['weight'];
    }

    for(var i = 0; i < research.expertsGroup.length; i ++){
        research.expertsGroup[i]['rel-weight'] = research.expertsGroup[i]['weight'] / summ;
    }

    initWasPerform = true;
    console.log("exp group init: " + JSON.stringify(research.expertsGroup) + "\n\n");
});

// result of weighted estimation
app.post('/weight-est-res', function(req, res){
    data = req.body;
    for(i in research.expertsGroup){
        if(research.expertsGroup[i]['name'] == data.expertName){
            research.expertsGroup[i]['res-of-w-est'] = JSON.parse(data.estimations);
        }
    }
    console.log("exp group after res: " + JSON.stringify(research.expertsGroup) + "\n\n");
    res.send('ok');
});

// result of preferences estimation
app.post('/preferences-est-res', function(req, res){
    data = req.body;
    console.log(data);
    for(expert in research.expertsGroup){
        if(research.expertsGroup[expert]['name'] == data.expertName){
            research.expertsGroup[expert]['preferences-est'] = JSON.parse(data.estimations);
        }
    }
    
    research['maxPref'] = data.maxPref;
    console.log(research.expertsGroup);
    res.send('ok');
});

// result of rank estimation
app.post('/rank-est-res', function(req, res){
    data = req.body;
    console.log(data);
    for(expert in research.expertsGroup){
        if(research.expertsGroup[expert]['name'] == data.expertName){
            research.expertsGroup[expert]['rank-est'] = JSON.parse(data.estimations);
        }
    }
    
    console.log("after catching rank res: " + JSON.stringify(research.expertsGroup));
    res.send('ok');
});

app.get('/top-w-est-questions', function(req,res){
    console.log('in /top-w-est-questions');
    var N = 0
    var array = []

    if(research.expertsGroup[i]['res-of-w-est'] == undefined) res.send([]);

    var scores = []
    for(var i = 0; i < research.questions.length; i++){
        scores.push([i, 0, research['questions'][i]]);  // <-- number / score / question
    }

    answeredExperts = [];
    for(var i = 0; i < research.expertsGroup.length; i++){
        if(research.expertsGroup[i]['res-of-w-est']){ // if answered
            answeredExperts.push([research.expertsGroup[i]['res-of-w-est'], research.expertsGroup[i]['rel-weight']]);
        }
    }

    console.log(JSON.stringify(answeredExperts));
    for(var i = 0; i < answeredExperts.length; i++){
        for(var j = 0; j < research.questions.length; j++){
            scores[j][1] += (+answeredExperts[i][0][j]) * (+answeredExperts[i][1]);    // relative weight
        }
    }

    scores.sort(function(first, second) {
        return second[1] - first[1];
    });

    res.send(scores)
});

app.get('/top-pref-est-questions', function(req,res){
    console.log('in /top-pref-est-questions');
    var N = 0;
    var array = [];

    var questScores = [];
    for(var j = 0; j < research.questions.length; j++){
        questScores.push(0)
    }

    for(i in research.expertsGroup){
        for(var j = 0; j < research.questions.length; j++){
            questScores[j] += +research['maxPref'] - research['expertsGroup'][i]['preferences-est'][j];
        }
    }

    console.log('quest scores: ' + JSON.stringify(questScores) + "\n");
    console.log('max pref: ' + JSON.stringify(research['maxPref']) + "\n");

    var summ = 0;
    for(var i in questScores){
        summ += +questScores[i];
    }
    for(var i in questScores){
        questScores[i] = +questScores[i]/summ;
    }

    console.log('quest scores: ' + JSON.stringify(questScores) + "\n");

    scores = []
    for(var i = 0; i < research.questions.length; i++){
        scores.push([i, questScores[i], research['questions'][i]]);  // <-- number / score / question
    }

    scores.sort(function(first, second) {
        return second[1] - first[1];
    });

    console.log("pref scores: " + JSON.stringify(scores) + "\n\n")
    res.send(scores)
});

app.get('/top-rank-est-questions', function(req,res){
    console.log('in /top-rank-est-questions');
    var N = 0;
    var array = [];

    var summEstByExperts = [];
    var questScores = [];
    for(var j = 0; j < research.questions.length; j++){
        summEstByExperts.push(0);
        questScores.push(0);
    }
    for(i in research.expertsGroup){
        for(var j = 0; j < research.questions.length; j++){
            summEstByExperts[i] += +research['expertsGroup'][i]['rank-est'][j]
        }
    }
    for(i in research.expertsGroup){
        for(var j = 0; j < research.questions.length; j++){
            questScores[j] += research['expertsGroup'][i]['rank-est'][j] / summEstByExperts[i];
        }
    }

    console.log('quest scores: ' + JSON.stringify(questScores) + "\n");

    scores = []
    for(var i = 0; i < research.questions.length; i++){
        scores.push([i, questScores[i], research['questions'][i]]);  // <-- number / score / question
    }

    scores.sort(function(first, second) {
        return second[1] - first[1];
    });

    console.log("rank scores: " + JSON.stringify(scores) + "\n\n")
    res.send(scores)
});

app.listen(port, function(){console.log('server started at port #' + port)})