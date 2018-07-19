const githubLabelSync = require('github-label-sync');
const labelConfig = require('./label-config');
const fetchRepos = require('./fetch-repos');
const argv = require('yargs').argv

/**
 * This value changes the rate in which each repo is updated after the last
 * it is used to avoid GitHub abuse detection mechanism.
 */
const updateRate = argv.rate || 200;
/**
 * This value is used for progressively delaying repo label updates
 * starting from 0 with {updateRate} added to the delay for each repo in list.
 */
let currentUpdateDelay = 0;
/**
 * GitHub Personal Access Token
 */
const accessToken = argv.token;
/**
 * GitHub Org Name Param
 */
const orgName = argv.org;
/**
 * List of GitHub repos to update
 */
let reposParam = argv.repos ? argv.repos.split(',') : null;
/**
 * Loop over all configured repos and try to sync labels from label config
 */
const updateReposList = (reposList) => {
    for(var i = 0; i < reposList.length; i++) {
        if(reposList[i] && typeof reposList[i] === "string") {
            syncLabels(reposList[i]);
        }
    }    
}

/**
 * Syncs label config on GitHub using repo name
 * @param {string} repoName 
 */
const syncLabels = (repoName) => {
    currentUpdateDelay += updateRate;
    setTimeout(() => {
        githubLabelSync({
            accessToken: accessToken,
            repo: repoName,
            labels: labelConfig
        })
        .then((diff) => {
            console.log("### UPDATED: ", repoName);
            console.log(diff);
        })
        .catch((e) => {
            console.log("### ERROR UPDATING REPO: ", repoName);            
            console.error(e);
        });
    }, currentUpdateDelay);
}

/**
 * Begin update from repos param or by fetching repos list of org name.
 */
if(reposParam) {
    console.log(reposParam);
    updateReposList(reposParam);
} else {
    let fetchedList = [];
    fetchRepos(accessToken, orgName)
    .then((reposData) => {
        for(var key in reposData) {
          fetchedList.push(reposData[key].full_name);
        }
        updateReposList(fetchedList);
    })
    .catch((e) => {
        console.error(e);
    });
}
