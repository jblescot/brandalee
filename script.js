const body = document.body;

const JIRA_URL_BASE = "https://smag-jira.atlassian.net/";
const JIRA_URL = JIRA_URL_BASE + "browse/";
const JIRA_API_URL = JIRA_URL_BASE + "rest/"

let JIRA_TICKET_TEMPLATE = ""
let JIRA_SCRUMB_BOARD_CHOICE_TEMPLATE = ""
let GITLAB_MERGE_REQUEST_TEMPLATE = ""
let JIRA_JSE_TEMPLATE = ""
let GITLAB_DIFF_TEMPLATE = ""

const gitlab = new GitLab(navigator)
const tab = new Tab(navigator)
const optionality = new Optionality(navigator)
const uiController = new UIController()

/**
 * Charge le contenu d'un fichier et appel une callback en passant le textContent en paramètre.
 *
 * @param {String} fileName
 * @param {$Call} callback
 */
function loadFileContent(fileName, callback) {
    let url = navigator.getUrlOf(`tpl/${fileName}`)
    fetch(url).then(res => res.blob()).then(blob => blob.text()).then(text => {
        callback(text)
    })
}

/**
 * Initialise les variables de template.
 */
function initTemplateVars() {
    if (body.dataset.type && body.dataset.type === 'plugin') {
        loadFileContent('jira_ticket.tpl', (text) => {
            JIRA_TICKET_TEMPLATE = text
        })
        loadFileContent('gitlab_merge_request.tpl', (text) => {
            GITLAB_MERGE_REQUEST_TEMPLATE = text
        })
        loadFileContent('gitlab_diff.tpl', (text) => {
            GITLAB_DIFF_TEMPLATE = text
        })
        /*loadFileContent('jira_jse.tpl', (text) => {
            JIRA_JSE_TEMPLATE = text
        })*/
        loadFileContent('scrum_board_choice.tpl', (text) => {
            JIRA_SCRUMB_BOARD_CHOICE_TEMPLATE = text
        })
    }
}

initTemplateVars();

/*********************************** */

const css = '.snackbar-container{transition:all .5s ease;transition-property:top,right,bottom,left,opacity;font-family:Roboto,sans-serif;font-size:14px;min-height:14px;background-color:#070b0e;position:fixed;display:flex;justify-content:space-between;align-items:center;color:#fff;line-height:22px;padding:18px 24px;bottom:-100px;top:-100px;opacity:0;z-index:9999}.snackbar-container .action{background:inherit;display:inline-block;border:none;font-size:inherit;text-transform:uppercase;color:#4caf50;margin:0 0 0 24px;padding:0;min-width:min-content;cursor:pointer}@media (min-width:640px){.snackbar-container{min-width:288px;max-width:568px;display:inline-flex;border-radius:2px;margin:24px}}@media (max-width:640px){.snackbar-container{left:0;right:0;width:100%}}.snackbar-pos.bottom-center{top:auto!important;bottom:0;left:50%;transform:translate(-50%,0)}.snackbar-pos.bottom-left{top:auto!important;bottom:0;left:0}.snackbar-pos.bottom-right{top:auto!important;bottom:0;right:0}.snackbar-pos.top-left{bottom:auto!important;top:0;left:0}.snackbar-pos.top-center{bottom:auto!important;top:0;left:50%;transform:translate(-50%,0)}.snackbar-pos.top-right{bottom:auto!important;top:0;right:0}@media (max-width:640px){.snackbar-pos.bottom-center,.snackbar-pos.top-center{left:0;transform:none}}';

/*********************************** */

const manifest = navigator.getManifest();
const DomClasses = {
    UL_LIST: "content-list mr-list issuable-list",
    UP_VOTES: "issuable-upvotes",
    DOWN_VOTES: "issuable-downvotes",
    MERGE_TITLE: "qa-issuable-form-title",
    MERGE_REQUEST_TITLE: 'qa-title',
    MERGE_REQUEST: "merge-request",
    RESOLVED_THREAD: 'line-resolve-all-container',
    RESOLVED_TEXT: 'line-resolve-text'
};
const Regexes = {
    MR_TITLE: /(.*)\/[a-zA-Z]+-[0-9]+(.*)/,
    TICKET_REF: /[a-zA-Z0-9]+-[0-9]+/,
    FIRST_ASAP_FORMAT: /(.*)\/[a-zA-Z]+_[0-9]+/,
    SECOND_ASAP_FORMAT: /(.*)_[0-9]+\/(.*)\/[a-zA-Z]+-[0-9]+(.*)/,
    TICKET_NUMBER: /[0-9]+/
};
let NOTIFICATIONS = {}

/*********************************** */

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

const btn_validate_config = document.getElementById('validate_config');

if (btn_validate_config) {
    btn_validate_config.addEventListener('click', function () {
        USED_CONFIG.MIN_APPROVAL_NUMBER = parseInt(getValueOfDomId('nb_approval'));
        USED_CONFIG.GROUP_NAME = getValueOfDomId('group_name')
        USED_CONFIG.MERGE_POSSIBLE_COLOR = getValueOfDomId('cmp')
        USED_CONFIG.MERGE_NEED_VOTES = getValueOfDomId('cmnv')
        navigator.store({configuration: USED_CONFIG})
        navigator.sendNotification(MESSAGES.notifications.saved.title, MESSAGES.notifications.saved.message)
    });
}

/**
 * Initialise l'éventuel affichage d'une "snackbar".
 */
function initScripts() {
    setTimeout(function () {
        const el = document.getElementsByClassName(DomClasses.RESOLVED_THREAD)[0];
        if (el) {
            const textEl = document.getElementsByClassName(DomClasses.RESOLVED_TEXT)[0];
            if (textEl) {
                let text = textEl.textContent.trim();
                text = text.replace('unresolved threads', '');
                text = text.replace('unresolved thread', '');
                text = text.trim();
                Snackbar.show({
                    pos: 'top-center',
                    actionText: 'Merci !',
                    text: MESSAGES.snackbar.dynamicMessage.resolveThread(text)
                });
            }
        }
    }, 5000)
}

/**
 * Ajoute le css au DOM pour la snackbar.
 */
function initCss() {
    const cssDOM = document.createElement('style');
    cssDOM.textContent = css
    body.appendChild(cssDOM);
}

loadConfiguration(navigator).then(() => {
    if (document.getElementById('nb_approval'))
        document.getElementById('nb_approval').value = USED_CONFIG.MIN_APPROVAL_NUMBER
    if (document.getElementById('group_name'))
        document.getElementById('group_name').value = USED_CONFIG.GROUP_NAME
    if (document.getElementById('cmp')) {
        document.getElementById('cmp').value = USED_CONFIG.MERGE_POSSIBLE_COLOR
        document.getElementById('cmp').style.backgroundColor = USED_CONFIG.MERGE_POSSIBLE_COLOR
    }
    if (document.getElementById('cmnv')) {
        document.getElementById('cmnv').value = USED_CONFIG.MERGE_NEED_VOTES
        document.getElementById('cmnv').style.backgroundColor = USED_CONFIG.MERGE_NEED_VOTES
    }

    if (body) {
        initCss();
        initScripts();
        uiController.launchControl()
    }

    if (body.dataset.type && body.dataset.type === 'plugin') {
        checkForUpdate();
        initPopUp();
    }

    console.printStart();
    console.printWebSite();
});

/**
 * Applique un filtre de recherche sur les tickets jira.
 *
 * @param {Array} issues
 */
function applyFilterForJSE(issues) {
    let searched_word = getValueOfDomId('field_jse_name').split(' ')
    let issuesFilteredByKey = []
    let issuesFilteredByTitle = []
    let issuedFilteredByDescription = []
    searched_word.forEach(word => {
        issuesFilteredByKey = [...issuesFilteredByKey, ...issues.filter(i => i.key.includes(word))]
        issuesFilteredByTitle = [...issuesFilteredByTitle, ...issues.filter(i => i.fields.summary.includes(word))]
        issuedFilteredByDescription = [...issuedFilteredByDescription, ...issues.filter(i => {
            if (i.fields.description == null) return false
            let regex = new RegExp(`(.*)${word}(.*)`)
            let found = i.fields.description.match(regex)
            return found && found.length > 0;

        })]
    })
    let finalData = new Set([...issuedFilteredByDescription, ...issuesFilteredByKey, ...issuesFilteredByTitle])
    document.getElementById('jse_search_btn').innerHTML = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/></svg>'
    document.getElementById('jse_search_btn').removeAttribute('disabled')
    document.getElementById('jse_container_search').innerHTML = ""
    finalData.forEach(i => {
        document.getElementById('jse_container_search').innerHTML += Mustache.render(JIRA_JSE_TEMPLATE, {
            key: i.key,
            summary: i.fields.summary,
            description: i.fields.description,
            id: i.id
        })
    })
    finalData.forEach(i => {
        document.getElementById(`take_jse_${i.id}`).addEventListener('click', (e) => {
            assignJiraTicket(i.id)
        })
    })
}

/**
 * Permet de s'assigner un ticket jira.
 *
 * @param {string} ticketId
 */
function assignJiraTicket(ticketId) {
    console.log(ticketId)
    navigator.getFromStore('jira', (data) => {
        if (data.jira) {
            // TODO : faire requête
        }
    })
}

/**
 * Initialise la popup.
 */
function initPopUp() {

    tab.configureTabs()
    optionality.configureOptionalities()

    updateGitlabTab();
    updateJiraTab();

    let hasAlreadyDidRequest = false
    let jiraIssues = []
    if (document.getElementsByClassName('field_jse_name'))
        document.getElementById('jse_search_btn').addEventListener('click', function (e) {
            let searched_text = getValueOfDomId('field_jse_name')
            document.getElementById('jse_search_btn').disabled = "disabled"
            document.getElementById('jse_search_btn').innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
            if (!hasAlreadyDidRequest) {
                //hasAlreadyDidRequest = true;
                navigator.getFromStore('jira', (e) => {
                    if (e.jira) {
                        let header = new Headers()
                        header.append('Content-Type', 'application/json')
                        header.append('Authorization', `Basic ${e.jira.user.token}`)
                        fetch(`https://smag-jira.atlassian.net/rest/agile/1.0/board/${e.jira.scrumTeam.id}/backlog?maxResults=200&jql=assignee=null`, {
                            method: 'GET',
                            headers: header
                        }).then(res => {
                            if (res.status === 200) {
                                return res.json()
                            }
                            return null
                        }).then(issues => {
                            jiraIssues = issues.issues
                            applyFilterForJSE(jiraIssues)
                        })
                    }
                })
            } else {
                applyFilterForJSE(jiraIssues)
            }

        })

    document.getElementById('validate_gitlab_token').addEventListener('click', function (e) {
        e.target.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Chargement...'
        gitlab.getPAT()
            .then(res => {
                if (res) {
                    let last_token = res[res.length - 1]
                    gitlab.getUserByTokenId(last_token.user_id)
                        .then(user => {
                            if (user) {
                                gitlab.getGroupsByUser()
                                    .then(groups => {
                                        if (groups) {
                                            user.token = getValueOfDomId('token_gitlab')
                                            user.groups = groups
                                            last_token.user = user
                                            navigator.store({gitlab: last_token})
                                            gitlab.updateCredential()
                                            updateGitlabTab();
                                            e.target.innerHTML = 'Valider'
                                        }
                                    })
                            }
                        })
                } else {
                    e.target.innerHTML = 'Valider'
                }
            })
    })
}

/**
 * Met à jour la tab Jira.
 */
function updateJiraTab() {
    navigator.getFromStore('jira', function (data) {
        if (data.jira && data.jira.user && data.jira.scrumTeam) {
            hideElement(['jira_not_connected_scrum_board_choices', 'jira_not_connected']);
            showElement('jira_loading');
            let selectedScrumTeam = data.jira.scrumTeam
            let user = data.jira.user
            let headers = new Headers()
            headers.append('Authorization', `Basic ${user.token}`)
            fetch(JIRA_API_URL + `/agile/1.0/board/${selectedScrumTeam.id}/sprint?state=active`, {
                method: 'GET',
                headers: headers
            })
                .then(res => {
                    if (res.status !== 200) {
                        return null
                    }
                    return res.json()
                })
                .then(sprints => {
                    if (sprints != null) {
                        let currentSprint = sprints.values[0]
                        if (currentSprint) {
                            fetch(JIRA_API_URL + `agile/1.0/board/${selectedScrumTeam.id}/sprint/${currentSprint.id}/issue`, {
                                method: 'GET',
                                headers: headers
                            })
                                .then(res => {
                                    if (res.status !== 200) {
                                        return null;
                                    }
                                    return res.json()
                                })
                                .then(sprintData => {
                                    if (sprintData != null) {
                                        hideElement('jira_loading')
                                        let issues = sprintData.issues
                                        let ownTicket = issues.filter(i => i.fields?.assignee?.accountId === user.accountId)
                                        document.getElementById('jira_connected').innerHTML = ""
                                        if (ownTicket.length === 0) {
                                            document.getElementById('jira_connected').innerHTML += "Vous n'avez pas de ticket assigné."
                                        }
                                        let selector_ids = []
                                        document.getElementById('jira_connected').innerHTML += "<h3 class='text-center'>Mes ticket(s) du sprint actuel</h3>"
                                        ownTicket.forEach(i => {
                                            selector_ids.push(`jira_selector_issue_status_${i.key}`)
                                            document.getElementById('jira_connected').innerHTML += Mustache.render(JIRA_TICKET_TEMPLATE, {
                                                key: i.key,
                                                summary: i.fields.summary,
                                                description: i.fields.description
                                            })
                                        })
                                        selector_ids.forEach(element => {
                                            let key = element.replace('jira_selector_issue_status_', '')
                                            fetch(JIRA_API_URL + `api/2/issue/${key}/transitions?sortByOpsBarAndStatus=true`, {
                                                headers: headers,
                                                method: 'GET'
                                            }).then(res => {
                                                if (res.status === 200) {
                                                    return res.json()
                                                }
                                                return null
                                            })
                                                .then(status => {
                                                    if (status) {
                                                        let real_status = status.transitions.filter(i => i.isAvailable === true)
                                                        real_status.forEach(s => {
                                                            document.getElementById(element).innerHTML += `<option value="${s.id}">${s.name}</option>`
                                                        })
                                                        document.getElementById(element).addEventListener('change', (e) => {
                                                            let content = {
                                                                transition: {
                                                                    id: `${e.target.value}`
                                                                }
                                                            }
                                                            let newHeaders = headers
                                                            newHeaders.append('Content-Type', 'application/json')
                                                            fetch(JIRA_API_URL + `api/2/issue/${key}/transitions`, {
                                                                headers: newHeaders,
                                                                method: 'POST',
                                                                body: JSON.stringify(content)
                                                            }).then(res => {
                                                                return res.status === 200 || res.status === 204;
                                                            })
                                                                .then(status => {
                                                                    if (status === true) {
                                                                        updateJiraStatusIssue(element, headers)
                                                                    }
                                                                })
                                                        })
                                                    }
                                                })
                                        });
                                    }
                                })
                        }
                    }
                })
        } else {
            hideElement(['jira_loading', 'jira_not_connected_scrum_board_choices', 'jira_connected']);
            showElement('jira_not_connected');
        }
    })
    document.getElementById('jira_create_token').addEventListener('click', function () {
        navigator.openTab('https://id.atlassian.com/manage-profile/security/api-tokens');
    })
    document.getElementById('jira_connexion').addEventListener('click', function (e) {
        e.target.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Chargement...'
        let token = getValueOfDomId('jira_token_auth')
        let email = getValueOfDomId('jira_email_auth')
        let encodedCredentials = btoa(`${email}:${token}`)
        let headers = new Headers()
        headers.append('Authorization', `Basic ${encodedCredentials}`)

        fetch(JIRA_API_URL + '/api/3/user/search?query=' + email, {
            method: 'GET',
            headers: headers
        })
            .then(res => {
                if (res.status !== 200) {
                    return null;
                }
                return res.json()
            })
            .then(userData => {
                if (userData != null && userData[0]) {
                    fetch(JIRA_API_URL + "agile/1.0/board?maxResults=200", {
                        method: 'GET',
                        headers: headers
                    })
                        .then(res => {
                            e.target.innerHTML = "Connexion"
                            if (res.status !== 200) {
                                return null
                            }
                            return res.json()
                        })
                        .then(board => {
                            if (board != null) {
                                document.getElementById('jira_not_connected_scrum_board_choices').innerHTML = ""
                                let boards = board.values.filter(b => b.type === "scrum")
                                showElement('jira_not_connected_scrum_board_choices')
                                hideElement('jira_not_connected')
                                document.getElementById('jira_not_connected_scrum_board_choices').innerHTML += `<h3 class="text-center"> Sélectionnez votre équipe </h3> <br/>`

                                boards.forEach(b => {
                                    document.getElementById('jira_not_connected_scrum_board_choices').innerHTML += Mustache.render(JIRA_SCRUMB_BOARD_CHOICE_TEMPLATE, {
                                        id: b.id,
                                        name: b.name
                                    })
                                })
                                boards.forEach(b => {
                                    if (document.getElementById('choice_' + b.id)) {
                                        document.getElementById('choice_' + b.id).addEventListener('click', function (e) {
                                            document.getElementById('jira_not_connected_scrum_board_choices').innerHTML = ""
                                            hideElement('jira_not_connected_scrum_board_choices');
                                            showElement('jira_loading');
                                            let selectedScrumTeam = boards.find(i => i.id === parseInt(e.target.id.replace('choice_', '')))
                                            let identity = {
                                                user: userData[0],
                                                scrumTeam: selectedScrumTeam
                                            }
                                            identity.user.token = encodedCredentials
                                            navigator.store({jira: identity})
                                            updateJiraTab()
                                            showElement('jira_connected')
                                        })
                                    }
                                })
                            }
                        })
                }
            })
    })
}

/**
 * Met à jour les status sélectionnable d'un ticket.
 *
 * @param {string} relatedDOMElement
 * @param {Headers} headers
 */
function updateJiraStatusIssue(relatedDOMElement, headers) {
    let key = relatedDOMElement.replace('jira_selector_issue_status_', '')
    document.getElementById(relatedDOMElement).innerHTML = `<option selected value="null">Déplacer vers</option>`
    fetch(JIRA_API_URL + `api/2/issue/${key}/transitions?sortByOpsBarAndStatus=true`, {
        headers: headers,
        method: 'GET'
    }).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        return null
    })
        .then(status => {
            if (status) {
                let real_status = status.transitions.filter(i => i.isAvailable === true)
                real_status.forEach(s => {
                    document.getElementById(relatedDOMElement).innerHTML += `<option value="${s.id}">${s.name}</option>`
                })
            }
        })
}

/**
 * Met à jour la tab gitlab.
 */
function updateGitlabTab() {
    if (!gitlab.isConnected()) {
        showElement('not_connected');
        hideElement(['loading', 'connected']);
        return
    }
    showElement(['gitlab_loading', 'connected']);
    hideElement(['not_connected', 'loading'])

    let elementsToDisplay = [];
    gitlab.getUser().groups.forEach(group => {
        elementsToDisplay.push({
            id: group.id,
            name: group.name,
            projects: []
        })
        gitlab.getProjectsByGroup(group.id)
            .then(res => {
                if (res) {
                    let projects = [];
                    res.forEach((project) => {
                        projects.push({
                            id: project.id,
                            name: project.name,
                            mr: []
                        })
                    })
                    gitlab.getOpenMrByGroup(group.id)
                        .then(mrs => {
                            mrs.forEach((mr) => {
                                if (mr.merged_by == null) {
                                    projects.find(i => i.id === mr.project_id).mr.push(mr)
                                }
                            })
                            let ids = [];
                            let bannedIds = [];
                            (new Promise(resolve => {
                                let state_count = 0;
                                let max_state_count = 0;
                                projects.forEach((project) => {
                                    max_state_count += project.mr.length
                                })
                                projects.forEach((project) => {
                                    if (project.mr.length > 0) {
                                        elementsToDisplay.find(e => e.id === group.id)
                                            .projects
                                            .push({
                                                id: project.id,
                                                name: project.name,
                                                mr: []
                                            })
                                        project.mr.forEach((mr) => {
                                            gitlab.getAwardByMergeRequest(mr.project_id, mr.iid)
                                                .then(awards => {
                                                    let fill = 'fill: black;'
                                                    let fill_down = 'fill: black;'
                                                    let data_award_id_up = null
                                                    let data_award_id_down = null
                                                    let th = awards.find(i => i.user.id === gitlab.getUser().id && i.name === "thumbsup");
                                                    if (th != null) {
                                                        fill = 'fill: gold;';
                                                        data_award_id_up += th.id
                                                    }
                                                    let down_th = awards.find(i => i.user.id === gitlab.getUser().id && i.name === "thumbsdown")
                                                    if (down_th) {
                                                        data_award_id_down += down_th.id
                                                        fill_down = 'fill: gold;'
                                                    }
                                                    elementsToDisplay.find(g => g.id === group.id)
                                                        .projects.find(p => p.id === project.id)
                                                        .mr.push({
                                                        mrUpvotes: mr.upvotes,
                                                        mrDownvotes: mr.downvotes,
                                                        data_award_id_up: data_award_id_up,
                                                        data_award_id_up_render: function () {
                                                            if (this.data_award_id_up !== null) {
                                                                return `data-awardid="${this.data_award_id_up}"`
                                                            }
                                                            return "data-awardid"
                                                        },
                                                        data_award_id_down: data_award_id_down,
                                                        data_award_id_down_render: function () {
                                                            if (this.data_award_id_down !== null) {
                                                                return `data-awardid="${this.data_award_id_down}"`
                                                            }
                                                            return "data-awardid"
                                                        },
                                                        mrIid: mr.iid,
                                                        mrAuthorAvatar_url: mr.author.avatar_url,
                                                        mrProject_id: mr.project_id,
                                                        fill: fill,
                                                        fill_down: fill_down,
                                                        mrWeb_url: mr.web_url,
                                                        mrTitle: mr.title,
                                                        mrId: mr.id,
                                                        mrUser_notes_count: mr.user_notes_count,
                                                        mergeBtn: function () {
                                                            if (this.canMerge) {
                                                                return `<button data-id="${this.mrProject_id}" data-mriid="${this.mrIid}" id="accept_mr_${this.mrId}" class="btn btn-success">Merge</button>`
                                                            }
                                                            return ""
                                                        },
                                                        projectName: project.name,
                                                        groupName: USED_CONFIG.GROUP_NAME,
                                                        canMerge: mr.author.id === gitlab.getUser().id && mr.downvotes === 0 && mr.upvotes >= USED_CONFIG.MIN_APPROVAL_NUMBER
                                                    })
                                                    ids.push(`${mr.id}`);
                                                    state_count++;
                                                    if (mr.author.id === gitlab.getUser().id) {
                                                        bannedIds.push(`${mr.id}`)
                                                    }
                                                    if (state_count === max_state_count) {
                                                        document.getElementById('connected').innerHTML = Mustache.render(GITLAB_MERGE_REQUEST_TEMPLATE, {groups: elementsToDisplay})
                                                        resolve(true)
                                                    }
                                                });
                                        });
                                    }
                                });
                            })).then(resolve => {
                                hideElement('gitlab_loading')
                                ids.forEach((id) => {
                                    if (document.getElementById(id))
                                        document.getElementById(id).addEventListener('click', function (e) {
                                            navigator.openTab(e.target.dataset.link)
                                        })
                                    if (document.getElementById('accept_mr_' + id)) {
                                        document.getElementById('accept_mr_' + id).addEventListener('click', (e) => {
                                            let iid = e.target.dataset.mriid
                                            let id = e.target.dataset.id
                                            e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
                                            gitlab.mergeARequest(id, iid)
                                                .then(res => {
                                                    updateGitlabTab()
                                                })
                                        })
                                    }
                                    if (document.getElementById(`diff_${id}`)) {
                                        document.getElementById(`diff_${id}`).addEventListener('click', function (e) {
                                            let element = e.target
                                            if (element.tagName === "PATH" || e.target.tagName === "path")
                                                element = e.target.parentElement

                                            document.getElementById('showDiffContainer').innerHTML = ""
                                            hideElement("connected")
                                            showElement(["showDiff", "showDiffLoading"])
                                            gitlab.getChangesByMergeRequest(element.dataset.projectid, element.dataset.iid)
                                                .then(res => {
                                                    if (res) {
                                                        let final_string_changes = ""
                                                        res.changes.forEach((change) => {
                                                            let extensionFile = change.new_path.split('.').pop()
                                                            let fileName = change.new_path.split('/').pop()
                                                            final_string_changes += GitLabMarkdownParser.parse(change.diff, extensionFile, fileName, GITLAB_DIFF_TEMPLATE)
                                                        })
                                                        hideElement("showDiffLoading")
                                                        showElement("showDiffContainer")
                                                        document.getElementById('showDiffContainer').innerHTML = final_string_changes
                                                    }
                                                })
                                        });
                                    }
                                    if (document.getElementById(`up_${id}`)) {
                                        if (!bannedIds.includes(id)) {
                                            document.getElementById(`up_${id}`).addEventListener('click', function (e) {
                                                let element = e.target
                                                if (element.tagName === "PATH" || e.target.tagName === "path")
                                                    element = e.target.parentElement
                                                if (element.dataset.awardid === '') {
                                                    gitlab.addAwardEmoji(
                                                        element.dataset.projectid,
                                                        element.dataset.iid,
                                                        'thumbsup'
                                                    ).then(res => {
                                                        if (res) {
                                                            element.style.fill = "gold"
                                                            element.dataset.awardid = res.id
                                                            let value = parseInt(document.getElementById('th_up_' + element.id.replace('up_', '')).textContent)
                                                            value++;
                                                            document.getElementById('th_up_' + element.id.replace('up_', '')).textContent = value
                                                        }
                                                    })
                                                } else {
                                                    gitlab.deleteAwardEmoji(
                                                        element.dataset.projectid,
                                                        element.dataset.iid,
                                                        element.dataset.awardid
                                                    ).then(res => {
                                                        element.style.fill = "black"
                                                        element.dataset.awardid = ""
                                                        let value = parseInt(document.getElementById('th_up_' + element.id.replace('up_', '')).textContent)
                                                        value--;
                                                        document.getElementById('th_up_' + element.id.replace('up_', '')).textContent = value
                                                    })
                                                }
                                            })
                                        }
                                    }
                                    if (document.getElementById(`down_${id}`)) {
                                        if (!bannedIds.includes(id)) {
                                            document.getElementById(`down_${id}`).addEventListener('click', function (e) {
                                                let element = e.target
                                                if (element.tagName === "PATH" || element.tagName === "path")
                                                    element = e.target.parentElement
                                                if (element.dataset.awardid === "") {
                                                    gitlab.addAwardEmoji(
                                                        element.dataset.projectid,
                                                        element.dataset.iid,
                                                        'thumbsdown'
                                                    ).then(res => {
                                                        if (res) {
                                                            element.style.fill = "gold"
                                                            element.dataset.awardid = res.id
                                                            let value = parseInt(document.getElementById('th_down_' + element.id.replace('down_', '')).textContent)
                                                            value++;
                                                            document.getElementById('th_down_' + element.id.replace('down_', '')).textContent = value
                                                        }
                                                    })
                                                } else {
                                                    gitlab.deleteAwardEmoji(
                                                        element.dataset.projectid,
                                                        element.dataset.iid,
                                                        element.dataset.awardid
                                                    ).then(res => {
                                                        element.dataset.awardid = ""
                                                        element.style.fill = "black"
                                                        let value = parseInt(document.getElementById('th_down_' + element.id.replace('down_', '')).textContent)
                                                        value--;
                                                        document.getElementById('th_down_' + element.id.replace('down_', '')).textContent = value
                                                    })
                                                }
                                            })
                                        }
                                    }
                                    if (document.getElementById(`comment_${id}`)) {
                                        document.getElementById(`comment_${id}`).addEventListener('click', function (e) {
                                            let element = e.target
                                            if (element.tagName === "PATH" || element.tagName === "path")
                                                element = e.target.parentElement

                                            document.getElementById('showCommentsContainer').innerHTML = ""
                                            showElement(['showComments', 'showCommentsLoading']);
                                            hideElement('connected');

                                            gitlab.getCommentByMergeRequest(element.dataset.projectid, element.dataset.iid)
                                                .then(comments => {
                                                    if (comments.length === 0) {
                                                        document.getElementById('showCommentsContainer').innerHTML = "Pas de commentaires sur la merge request."
                                                    }
                                                    hideElement('showCommentsLoading')
                                                    let ids_resolve = []
                                                    let reader = new commonmark.Parser();
                                                    let writer = new commonmark.HtmlRenderer();
                                                    comments.filter(i => i.individual_note === false).forEach(comment => {
                                                        let isFirstNote = true
                                                        comment.notes.filter(a => a.system === false).forEach(note => {
                                                            if (isFirstNote) {
                                                                isFirstNote = false
                                                                document.getElementById('showCommentsContainer').innerHTML += '<p class="text-left" style="font-size: 12px;">';
                                                            } else {
                                                                document.getElementById('showCommentsContainer').innerHTML += '<p class="text-left" style="font-size: 12px; margin-left:20px;">';
                                                            }
                                                            let parsed = reader.parse(note.body)
                                                            document.getElementById('showCommentsContainer').innerHTML += '<img style="width: 25px; height: 25px; margin-right: 10px;" src="' + note.author.avatar_url + '" />';
                                                            document.getElementById('showCommentsContainer').innerHTML += '<span style="font-size: 14px; margin-left: 10px;"> ' + writer.render(parsed);
                                                            document.getElementById('showCommentsContainer').innerHTML += '</p>';
                                                            if (note.resolvable && !note.resolved) {
                                                                document.getElementById('showCommentsContainer').innerHTML += '<button id="resolve_' + comment.id + '" class="btn btn-success form-control" style="width: 200px; opacity: 0.6;">Résoudre le thread</button>'
                                                                ids_resolve.push('resolve_' + comment.id)
                                                            } else if (note.resolvable && note.resolved) {
                                                                document.getElementById('showCommentsContainer').innerHTML += '<button class="btn btn-success form-control" disabled style="width: 200px; opacity: 0.6;">Thread résolu</button>'
                                                            }
                                                            document.getElementById('showCommentsContainer').innerHTML += '<hr/>'
                                                        })
                                                    })
                                                    ids_resolve.forEach(id => {
                                                        if (document.getElementById(id)) {
                                                            document.getElementById(id).addEventListener('click', function (e) {
                                                                if (e.target.disabled || e.target.disabled === "disabled") return;
                                                                let id = e.target.id.replace('resolve_', '')
                                                                gitlab.resolveThread(element.dataset.projectid, element.dataset.iid, id)
                                                                    .then(res => {
                                                                        e.target.textContent = "Thread résolu"
                                                                        e.target.disabled = "disabled"
                                                                    })
                                                            })
                                                        }
                                                    })
                                                })
                                        });
                                    }
                                })
                            })
                        })
                }
            })
        if (document.getElementById('showCommentsCross')) {
            document.getElementById('showCommentsCross').addEventListener('click', function () {
                hideElement('showComments')
                showElement('connected')
            })
        }
        if (document.getElementById('showDiffCross')) {
            document.getElementById('showDiffCross').addEventListener('click', function () {
                hideElement('showDiff')
                showElement('connected')
            })
        }
    })
}

/**
 * Effectue une recherche de nouvelle version du plugin et envois une notification quand c'est le cas.
 */
function checkForUpdate() {
    executeRequest("https://brodaleegitlabplugin.herokuapp.com/?version=last")
        .then(res => {
            if (res.last_version) {
                if (manifest.version < res.last_version) {
                    navigator.getFromStore('lastupdatedate', function (res) {
                        if (!res.lastupdatedate) {
                            navigator.sendNotification(MESSAGES.notifications.update.title, MESSAGES.notifications.update.message)
                            navigator.store({lastupdatedate: Date.now()})
                        } else {
                            let date = new Date(res.lastupdatedate)
                            let now = new Date(Date.now())
                            if ((now.getHours() - date.getHours()) > 1) {
                                navigator.sendNotification(MESSAGES.notifications.update.title, MESSAGES.notifications.update.message)
                                navigator.store({lastupdatedate: Date.now()})
                            }
                        }
                    })
                }
            }
        })
}