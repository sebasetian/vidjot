if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://sebasetian:ab821111@ds149324.mlab.com:49324/vidjot-prod'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}