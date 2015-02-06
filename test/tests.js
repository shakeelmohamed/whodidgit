var assert = require("assert");
var http = require("http");
var request = require("request");

var utils = require("../utils");
var server = require("../index");

var port = process.env.PORT || 5000;
var scheme = "http";
var domain = "localhost";
var url = scheme + "://" + domain + ":" + port;

var testUser = "shakeelmohamed";
var testRepo = "whodidgit";
var testCommit = ""; // FIXME: fill me in

describe("Home page", function() {
    describe("HTTP GET - no args", function() {
        it("Should be running", function() {
            assert.ok(server);
        });
        it("Should display static index.html", function(done) {
            http.get(url, function (res) {
                assert.equal(200, res.statusCode);
                res.on("data", function(chunk) {
                    var str = chunk.toString("utf8");
                    assert.ok(str);
                    assert.ok(str.length > 0);
                    assert.ok(str.indexOf("<title>Who Did Git?</title>") > 0);
                    done();
                });
            });
        });
    });
    describe("HTTP POST - no args", function() {
        it("Should display an error message", function(done) {
            var options = {
                url: url,
                method: "POST"
            };

            request(options, function (error, res, body) {
                assert.ok(!error);
                assert.equal(500, res.statusCode);
                assert.equal("Invalid parameters.\n", body);
                done();
            });
        });
    });
});

// All args as get/post

// 1 of each arg as get/post

// Form submission

// Hardcoded commit get/post

// Utils tests
describe("Utils", function() {
    describe(".has", function() {
        it("Should handle invalid and empty objects", function() {
            assert.ok(!utils.has(null));
            assert.ok(!utils.has(undefined));
            assert.ok(!utils.has({}));
            assert.ok(!utils.has([]));
        });
        it("Should handle invalid and empty objects w/ property string", function() {
            assert.ok(!utils.has(null, "fail"));
            assert.ok(!utils.has(undefined, "fail"));
            assert.ok(!utils.has({}, "fail"));
            assert.ok(!utils.has([], "fail"));
        });
        it("Should handle objects with 1 property", function() {
            var obj1 = {hello: "world"};
            assert.ok(!utils.has(obj1, "planet"));
            assert.ok(!utils.has(obj1, ["planet"]));
            assert.ok(utils.has(obj1, "hello"));
            assert.ok(utils.has(obj1, ["hello"]));
        });
        it("Should handle objects with 2 properties", function() {
            var obj2 = {hello: "world", goodbye: "space"};
            assert.ok(!utils.has(obj2, "planet"));            
            assert.ok(!utils.has(obj2, ["planet"]));            
            assert.ok(utils.has(obj2, "hello"));
            assert.ok(utils.has(obj2, ["hello"]));
            assert.ok(utils.has(obj2, "goodbye"));
            assert.ok(utils.has(obj2, ["goodbye"]));
            assert.ok(utils.has(obj2, ["hello", "goodbye"]));
            assert.ok(!utils.has(obj2, ["hello", "planet"]));
            assert.ok(!utils.has(obj2, ["goodbye", "planet"]));
            assert.ok(!utils.has(obj2, ["planet", "planet"]));
            assert.ok(!utils.has(obj2, ["planet", "hello"]));
            assert.ok(!utils.has(obj2, ["planet", "goodbye"]));
        });
        it("Should handle objects with 1 property multiple times", function() {
            var obj1 = {hello: "world"};
            assert.ok(!utils.has(obj1, "planet"));
            assert.ok(!utils.has(obj1, ["planet", "planet", "planet", "planet", "planet"]));
            assert.ok(utils.has(obj1, "hello"));
            assert.ok(utils.has(obj1, ["hello", "hello", "hello", "hello", "hello"]));
        });
    });
    describe(".makeParams", function() {
        it("Should fail invalid and empty objects", function() {
            assert.throws(function() {
                    utils.makeParams(null);
                },
                "Error: Missing required parameters, found:\nnull"
            );
            assert.throws(function() {
                    utils.makeParams(undefined);
                },
                "Error: Missing required parameters, found:\nundefined"
            );
            assert.throws(function() {
                    utils.makeParams({});
                },
                "Error: Missing required parameters, found:\n{}"
            );
            assert.throws(function() {
                    utils.makeParams([]);
                },
                "Error: Missing required parameters, found:\n[]"
            );
        });
    });
    describe(".isEmpty", function() {
        it("Should handle invalid and empty objects", function() {
            assert.ok(utils.isEmpty(null));
            assert.ok(utils.isEmpty(undefined));
            assert.ok(utils.isEmpty({}));
            assert.ok(utils.isEmpty([]));
            assert.ok(utils.isEmpty(""));
        });
        it("Should fail for valid and non-empty objects", function() {
            assert.ok(!utils.isEmpty({"something": "here"}));
            assert.ok(!utils.isEmpty({value: true}));
            assert.ok(!utils.isEmpty([0]));
            assert.ok(!utils.isEmpty("null"));
        });
    });
});