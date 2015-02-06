var package = require("./package.json");
var utils = require("./utils");
var http = require("http");
var connect = require("connect");
var static = require("serve-static");
var url = require("url");
var GitHubAPI = require("github");

var USERAGENT = "who-did-git/" + package.version;
var GitHub = new GitHubAPI({
        version: "3.0.0",
        headers: {
            "user-agent": USERAGENT
        }
    }
);

var app = connect();

app.use("/", function (req, res, next) {
    var url_parts = url.parse(req.url, true);
    var queryArgs = url_parts.query;

    // Check query string for a GitHub token
    if (utils.has(queryArgs, "token")) {
        GitHub.authenticate({
            type: "oauth",
            token: token
        });
    }
    
    try {
        // Validate params first
        var GitHubParams = utils.makeParams(queryArgs);
        return GitHub.repos.getCommit(GitHubParams, function(err, response) {
            if (err) {
                next(new Error(err));
            }
            else if (utils.has(response, "message")) {
                // Assume there's an error
                next(new Error(response.message));
            }
            else {
                res.end(
                    "GitHub gave us the following information about the author of that commit: \n" +
                    JSON.stringify(response.commit.author, undefined, 4) + "\n\n" +
                    response.meta["x-ratelimit-remaining"] + " of " +
                        response.meta["x-ratelimit-limit"] + " requests remaining this hour.\n"
                );
            }
        });
    }
    catch (e) {
        if (e && utils.has(e, "message") && !utils.isEmpty(queryArgs)) {
            next(e.message);
        }
        else {
            next();
        }
    }
});

// Serve the static home page
var serve = static("public", {default: "index.html"});
app.use(serve);

// Catch all unhandled requests, send them to the home page
app.use(function(req, res) {
    res.writeHead(301, {
      "Location": "/"
    });
    res.end();
});

http.createServer(app).listen(process.env.PORT || 5000);
