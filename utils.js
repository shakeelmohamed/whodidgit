var utils = {};

utils.has = function (obj, props) {
    // Assuming props is a string, not a new String(); then just check the value
    if (typeof props === "string") {
        return obj.hasOwnProperty(props);
    }

    var result = true;
    for(var i = 0; i < props.length && result; i++) {
        result = obj.hasOwnProperty(props[i]);
    }
    return result;
};

utils.makeParams = function (query) {
    if (query && utils.has(query, ["owner", "repo", "sha"])) {
        return {
            sha: query.sha,
            user: query.owner,
            repo: query.repo,
            per_page: 100
        };
    }
    else {
        throw new Error("Missing required parameters, found: \n" + JSON.stringify(query, undefined, 4));
    }
};

module.exports = utils;