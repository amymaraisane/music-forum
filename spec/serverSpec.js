var request = require('request');
var base_url = "http://localhost:3000/" || "https://vast-sierra-13998.herokuapp.com/"


describe('Express App server', function(){
    describe('GET /', function(){
        it('returns status code 200', function(){
            request.get(base_url, function(error, response, body){
                expect(response.statusCode).toBe(200);
                //done is only available in jasmine-node, 
                //synchronizes it with expect
                //if done is not called, test will fail    
                done();
            });
        });
    });
    
});