var http = require("http");
var connect = require("connect");
var static = require("serve-static");
var url = require("url");
var request = require("request")

var app = connect();

function has(obj, props) {
    var result = true;
    for(var i = 0; i < props.length && result; i++) {
        result = obj.hasOwnProperty(props[i]);
    }
    return result;
}

function makeURL(query) {
    var url = "https://api.github.com/repos/";
    url += query.owner;
    url += "/";
    url += query.repo;
    url += "/commits/";
    url += query.sha;
    return url;
}

var serve = static("public");
app.use("/", serve);
app.use("/", function (req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    // Minimally, need the owner, repo & sha to identify a public commit on GitHub
    // TODO: for private repos, maybe just redirect the user, open an iframe?
    if (has(query, ["owner", "repo", "sha"])) {
        return request({
            url: makeURL(query),
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "who-did-git"
            },
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200 && has(body, ["commit"])) {
                console.log(body);
                res.end("GitHub gave us this information about the author of that commit: \n\n" + JSON.stringify(body.commit.author)); // Print the json response
            }
            else {
                console.log(response.statusCode, body);
            }

        });
    }
    else {
        res.end(JSON.stringify(query));
    }
});



var server = http.createServer(app);
server.listen(5000);
