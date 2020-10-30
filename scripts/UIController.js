/**
 * Classe du controller gérant les contrôle de champs et l'affichage des snackbar sur l'UI.
 */
class UIController {

    launchControl() {
        this.controlMergeTitle()
        this.controlApprovalBeforeMerge()
        this.afilWithJiraTicketAndColorDOM()
        this.showSnackBarWhenOnGitlabMergeRequest()
    }

    /**
     * Permet de controller le titre entré d'une merge request afin de prévenir d'un format non standard.
     */
    controlMergeTitle() {
        const inputs = document.getElementsByTagName('input');
        let field_title = null;
        let validate_btn = null;
        for (let i in inputs) {
            let element = inputs[i];
            if (element instanceof HTMLElement) {
                if (element.classList.contains(DomClasses.MERGE_TITLE)) {
                    field_title = element;
                } else if (element.type === 'submit') {
                    validate_btn = element;
                }
            }
        }
        if (field_title && validate_btn) {
            validate_btn.addEventListener('click', function (e) {
                let matches = field_title.value.match(Regexes.MR_TITLE);
                if (!matches) {
                    alert(MESSAGES.errors.bad_format_mr);
                }
            });
        }
    }

    /**
     * Permet le control des approvals pour éviter la possibilité de merge si :
     *  - on a au moins un pouce négatif.
     *  - on a pas assez de pouces positifs.
     */
    controlApprovalBeforeMerge() {
        setTimeout(function () {
            const merge_button = document.getElementsByClassName('accept-merge-request')[0];
            if (merge_button && merge_button instanceof HTMLElement) {
                let approvals = document.getElementsByClassName('award-control-text');
                const pouce_en_l_air = approvals[0];
                if (pouce_en_l_air && pouce_en_l_air instanceof HTMLElement) {
                    let approval_number = parseInt(pouce_en_l_air.textContent.trim());
                    if (approval_number < USED_CONFIG.MIN_APPROVAL_NUMBER) {
                        merge_button.disabled = true
                    }
                }
                const pouce_en_bas = approvals[1];
                if (pouce_en_bas && pouce_en_bas instanceof HTMLElement) {
                    let bad_approval_number = parseInt(pouce_en_bas.textContent.trim());
                    if (bad_approval_number > 0) {
                        merge_button.disabled = true;
                    }
                }
            }
        }, 500)
    }

    /**
     * Permet d'affilé un ticket JIRA avec le nom de la branche (si celle-ci à un format standard) afin de créer un
     * raccourcie dans le DOM.
     * Colorise aussi le titre des MR selon :
     *  - Si celle-ci n'as pas encore été vue.
     *  - Si celle-ci peut être mergé.
     */
    afilWithJiraTicketAndColorDOM() {
        const merge_request_list = document.getElementsByClassName(DomClasses.UL_LIST)[0];
        if (merge_request_list) {
            for (let i in merge_request_list.getElementsByTagName('li')) {
                let element = merge_request_list.getElementsByTagName('li')[i];
                if (element instanceof HTMLElement) {
                    if (element.classList.contains(DomClasses.MERGE_REQUEST)) {
                        let info_container = element.children[1];
                        if (!info_container) return;
                        let main_info = info_container.children[0];
                        if (!main_info) return;
                        let merge_request_title = main_info.children[0];
                        if (!merge_request_title) return;
                        let span = merge_request_title.children[0];
                        if (!span) return;
                        let link = span.children[0];
                        if (!link) return;
                        let found = link.textContent.match(Regexes.MR_TITLE);
                        if (found && found.length > 0) {
                            let str = link.textContent;
                            let matches = str.match(Regexes.TICKET_REF);
                            if (matches && matches[0]) {
                                this.addSeeTicket(element, matches[0]);
                            } else {
                                let first_asape_matches = str.match(Regexes.FIRST_ASAP_FORMAT);
                                if (first_asape_matches && first_asape_matches[0]) {
                                    this.addSeeTicket(element, first_asape_matches[0]);
                                } else {
                                    let second_asape_matches = str.match(Regexes.SECOND_ASAP_FORMAT);
                                    if (second_asape_matches && second_asape_matches[0]) {
                                        this.addSeeTicket(element, second_asape_matches[0]);
                                    }
                                }
                            }
                        }
                        let meta_info = info_container.children[1];
                        let votes = meta_info.children[0];
                        let votes_childrens = votes.children;
                        let is_merge_possible = false;
                        let has_votes = false;
                        for (let a in votes_childrens) {
                            let el = votes_childrens[a];
                            if (el instanceof HTMLElement) {
                                if (el.classList.contains(DomClasses.UP_VOTES)) {
                                    has_votes = true
                                    let approvals_number = parseInt(el.textContent.trim())
                                    is_merge_possible = approvals_number >= USED_CONFIG.MIN_APPROVAL_NUMBER;
                                } else if (el.classList.contains(DomClasses.DOWN_VOTES)) {
                                    has_votes = true;
                                    is_merge_possible = false;
                                }
                            }
                        }
                        if (is_merge_possible) {
                            link.style.color = USED_CONFIG.MERGE_POSSIBLE_COLOR;
                        }
                        if (!has_votes) {
                            link.style.color = USED_CONFIG.MERGE_NEED_VOTES
                        }
                    }
                }
            }
        }
    }

    /**
     * Affiche une snackbar pour avoir un éventuel accès indirect vers unn ticket jira.
     */
    showSnackBarWhenOnGitlabMergeRequest() {
        const regex = `https:\/\/gitlab\.com\/${USED_CONFIG.GROUP_NAME}\/[a-zA-Z-.\-]+\/\-\/merge_requests\/[0-9]+`
        let match = window.location.href.match(regex)
        if (match) {
            let titleElement = document.getElementsByClassName(DomClasses.MERGE_REQUEST_TITLE)[0]
            if (titleElement instanceof HTMLElement) {
                let found = titleElement.textContent.match(Regexes.MR_TITLE)
                if (found) {
                    let matches = titleElement.textContent.match(Regexes.TICKET_REF);
                    if (matches && matches[0]) {
                        setTimeout(function () {
                            const link = JIRA_URL + `${matches[0]}`
                            Snackbar.show({
                                pos: 'top-center',
                                actionText: 'Merci !',
                                text: MESSAGES.snackbar.dynamicMessage.seeJiraTicket(link)
                            });
                        }, 1000)
                    }
                }
            }
        }
    }

    /**
     * Affiche une snackbar pour avoir un éventuel accès indirect vers la merge request.
     */
    showSnackBarWhenOnJiraTicket() {
        let header_menu = document.getElementById('jira-issue-header');
        if (header_menu) {
            let last_menu = getFirstChildren(header_menu);
            for (let i = 0; i < 7; i++) {
                last_menu = getFirstChildren(last_menu);
            }
            last_menu = getLastChildren(last_menu);
            if (last_menu && last_menu.dataset.testId === 'issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container') {
                last_menu = last_menu
                    .children[1]
                    .children[0]
                    .children[0]
                    .children[0];
                const content = last_menu.textContent;
                const foundMatch = content.match(Regexes.TICKET_NUMBER);
                if (foundMatch && foundMatch[0]) {
                    const link = `https://gitlab.com/groups/${USED_CONFIG.GROUP_NAME}/-/merge_requests?scope=all&utf8=%E2%9C%93&state=opened&search=${foundMatch[0]}`;
                    Snackbar.show({
                        pos: 'top-center',
                        actionText: 'Merci !',
                        text: MESSAGES.snackbar.dynamicMessage.seeGitlabMergeRequest(link)
                    });
                }
            }
        }
        const params = getUrlParams();
        if (params.selectedIssue) {
            let content = params.selectedIssue;
            const foundMatch = content.match(Regexes.TICKET_NUMBER);
            if (foundMatch && foundMatch[0]) {
                const link = `https://gitlab.com/groups/${USED_CONFIG.GROUP_NAME}/-/merge_requests?scope=all&utf8=%E2%9C%93&state=opened&search=${foundMatch[0]}`;
                Snackbar.show({
                    pos: 'top-center',
                    actionText: 'Merci !',
                    text: MESSAGES.snackbar.dynamicMessage.seeGitlabMergeRequest(link)
                });
            }
        }
        const url = window.location.href
        const splittedUrl = url.split('/')
        let lastRouteUrl = splittedUrl[splittedUrl.length - 1]
        const regex = `${JIRA_URL}${lastRouteUrl}`
        const matches = url.match(regex)
        if (matches) {
            let ticketRefMatch = url.match(Regexes.TICKET_REF)
            if (ticketRefMatch && ticketRefMatch[0]) {
                const link = `https://gitlab.com/groups/${USED_CONFIG.GROUP_NAME}/-/merge_requests?scope=all&utf8=%E2%9C%93&state=opened&search=${ticketRefMatch[0]}`;
                Snackbar.show({
                    pos: 'top-center',
                    actionText: 'Merci !',
                    text: MESSAGES.snackbar.dynamicMessage.seeGitlabMergeRequest(link)
                });
            }
        }
    }

    /**
     * Ajoute un lien sur gitlab entre la référence de la branche, et un ticket jira.
     *
     * @param {HTMLElement} element
     * @param {String} ticket
     */
    addSeeTicket(element, ticket) {
        element.setAttribute('title', `${JIRA_URL}${ticket}`);
        const toolTipText = document.createElement('span');
        toolTipText.classList.add('tooltiptext');
        toolTipText.style.marginLeft = "1%";
        toolTipText.innerHTML = `<a href="${JIRA_URL}${ticket}">${ticket}</a>`;
        element.appendChild(toolTipText);
    }
}