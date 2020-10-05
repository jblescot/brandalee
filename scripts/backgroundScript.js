
/**
 * Charge la configuration.
 */
function loadConfiguration(navigator) {
    return new Promise(resolve => {
        navigator.getFromStore('configuration', function (res) {
            if (!res.configuration) {
                navigator.store({configuration: Config})
                USED_CONFIG = Config;
            } else {
                USED_CONFIG = res.configuration;
            }
            resolve(true)
        })
    })
}

/**
 * Execute une requête HTTP.
 *
 * @param url
 * @param options
 * @returns {Promise<Response>}
 */
function executeRequest(url, options = {}) {
    return fetch(url, options)
}

/**
 * Check si l'on peut merger une branche sur gitlab. Si oui, une notification est envoyé.
 */
function checkIfCanMergeBranchFromGitlab() {
    navigator.getFromStore('notifications', (d) => {
        if (d.notifications && d.notifications.mergePossible === true) {
            navigator.getFromStore("gitlab", (data) => {
                if (data.gitlab) {
                    let headers = new Headers()
                    headers.append('PRIVATE-TOKEN', data.gitlab.user.token)
                    let mr_to_merge = [];
                    (new Promise(resolve => {
                        data.gitlab.user.groups.forEach( group => {
                            executeRequest('https://gitlab.com/api/v4/groups/' + group.id + '/projects', {method: 'GET', headers: headers})
                                .then(res => res.json())
                                .then(res => {
                                    if (res) {
                                        let projects = []
                                        res.forEach((project) => {
                                            projects.push({
                                                id: project.id,
                                                name: project.name,
                                                mr: []
                                            })
                                        })
                                        executeRequest('https://gitlab.com/api/v4/groups/' + group.id + '/merge_requests?state=opened', {method: 'GET', headers: headers})
                                            .then(mr => mr.json())
                                            .then(mrs => {
                                                if (mrs) {
                                                    mrs.forEach( mr => {
                                                        if (mr.merged_by == null) {
                                                            projects.find(i => i.id === mr.project_id).mr.push(mr)
                                                        }
                                                    })
                                                    let state_count = 0;
                                                    let max_state_count = 0;
                                                    projects.forEach((project) => {
                                                        max_state_count += project.mr.length
                                                    })
                                                    projects.forEach( project => {
                                                        if (project.mr.length > 0) {
                                                            project.mr.forEach( mr => {
                                                                executeRequest('https://gitlab.com/api/v4/projects/' + mr.project_id + '/merge_requests/' + mr.iid + '/award_emoji', {method: 'GET', headers: headers})
                                                                    .then(awards => awards.json())
                                                                    .then(awards => {
                                                                        if (mr.author.id === data.gitlab.user.id && mr.downvotes === 0 && mr.upvotes >= USED_CONFIG.MIN_APPROVAL_NUMBER) {
                                                                            mr_to_merge.push(mr)
                                                                        }
                                                                        state_count++;
                                                                        if (state_count === max_state_count) {
                                                                            resolve(true)
                                                                        }
                                                                    })
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                    }
                                })
                        })
                    })).then(resolve => {
                        if (resolve) {
                            let msg = "Vous pouvez merger "
                            if (mr_to_merge.length > 0) {
                                if (mr_to_merge.length > 1) {
                                    msg += "les branches : \n"
                                    mr_to_merge.forEach(mr => {
                                        msg += mr.title + "\n"
                                    })
                                } else {
                                    msg += "la branche " + mr_to_merge[0].title
                                }
                                navigator.sendNotification("Merge possible", msg)
                            }
                        }
                    })
                }
            })
        }
    })
}

loadConfiguration(navigator).then(() => {
    setInterval(checkIfCanMergeBranchFromGitlab, 1000*60*10)
})