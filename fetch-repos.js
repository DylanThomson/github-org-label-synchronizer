const GitHubApi = require('github-api');

module.exports = (accessToken, orgName) => {
    return new Promise((resolve, reject) => {
        if(!accessToken || typeof accessToken !== "string") {
            reject("Invalid GitHub access token specified");
        }
        if(!orgName || typeof orgName !== "string") {
            reject("Invalid GitHub organization name specified");
        }
        let gitHubApi = new GitHubApi({token:accessToken});
        gitHubApi.getUser().getProfile()
        .then((res) => {
            /**
             * Check the current rate limit
             */
            gitHubApi.getRateLimit().getRateLimit()
            .then((resp) => {
                console.log('Limit remaining: ' + resp.data.rate.remaining);
                // Convert epoch milliseconds to epoch seconds
                console.log('Reset date: ' + new Date(resp.data.rate.reset * 1000));
            })
            .catch((e) => {       
                reject(e);
            });
            /**
             * Fetch the org and all its repos.
             */
            gitHubApi.getOrganization(orgName).getRepos()
            .then((gitHubOrgRepos) => {                  
                resolve(gitHubOrgRepos.data);
            }).catch((e) => {
                console.error("Error fetching organization name: ", orgName);
                reject(e);
            });
        })
        .catch((e) => {
            console.error("Error authenticating with access token: ", accessToken);         
            reject(e);
        });
    });
}