# GitHub Organization Label Synchronizer
Safely synchronizes issue label configurations across entire GitHub organizations. This is a basic tool that combines two existing libraries [GitHub Label Sync](https://github.com/Financial-Times/github-label-sync) to apply a static label config and [GitHub API](https://github.com/github-tools/github) to dynamically resolve all repositories of an GitHub organization / user.

**ATTENTION! This label sync tool was put together quickly for the single purpose of applying labels dynamically across hundreds of repositories. If you need to access more advanced functionality it is recommended to use [GitHub Label Sync](https://github.com/Financial-Times/github-label-sync) directly.**

## Usage
This package was intended to be pulled as a git repo into Jenkins / Travis and executed directly as a node script with the parameters provided by the job configuration, although this can also be run locally. Currently it is not intended to be used as a node package dependency (this may change).

#### Steps to run.
1. Pull this repo from GitHub `git clone https://github.com/DylanThomson/github-org-label-synchronizer.git`
2. Run `npm install`.
3. Modify `./label-config.js` file with your preferred GitHub labels.
3. Run the main script with required parameters `npm start --token={GitHubAccessToken} --org={OrgName}`.

Executing with just these two parameters will resolve all GitHub repositories within the specified organization and create new labels or update existing ones that match in name (this preserves your current label associations with issues).

#### Parameters
```
--token    GitHub Personal Access Token           example: --token=83287fb2b8ewr4f3g34g355rg4ggq3332

--org      The name GitHub Organization           example: --org=MoogleSoft

--repos    CSV list of repos to apply labels      example: --repos=Veact,Dangular,WipeScript
```
**NOTE: Spaces are not currently handled for the `--repos` option.**

## Label Configuration
Labels are configured using [GitHub Label Sync](https://github.com/Financial-Times/github-label-sync) format and rules for more information on how to configure labels please see that libraries documentation.

To configure a new set of static labels simply modify `./label-config.js` which contains a basic CJS export of JSON.
```
module.exports = [
    {
        "name": "type: bug",   // Name of the label
        "color": "ff5542",     // Hex color of label
        "aliases": [           // Alias labels to replace and diff against
            "bug", 
            "issue"
        ]
    }
];
```
**Be careful! This configuration can end up being applied to ALL your repositories!**

