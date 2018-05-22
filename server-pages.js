exports.setApp = function(app){

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
};