var utils = {};

utils.has = function (obj, props) {
    // If obj is null or undefined, it can't have any properties
    if (!obj || obj && utils.isEmpty(obj)) {
        return false;
    }

    // Assuming props is a string, not a new String(); then just check the value
    if (typeof props === "string") {
        return obj.hasOwnProperty(props);
    }

    var result = true;
    for(var i = 0; props && i < props.length && result; i++) {
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

utils.isEmpty = function(obj) {
    for(var a in obj) {
        if (obj.hasOwnProperty(a)) {
            return false;
        }
    }
    return true;
};

module.exports = utils;