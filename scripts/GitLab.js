/**
 * Classe de la logique GitLab.
 */
class GitLab {

    /**
     * Constructeur.
     *
     * @param navigator
     */
    constructor(navigator) {
        this.navigator = navigator
        this.updateCredential()
    }

    /**
     * Met à jour les données de compte gitlab.
     */
    updateCredential() {
        let self = this
        this.navigator.getFromStore('gitlab', (data) => {
            self.data = data.gitlab
        })
    }

    /**
     * Vérifie si le private token fonctionne et retourne les informations.
     *
     * @returns {Promise<Response>}
     */
    getPAT() {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', getValueOfDomId('token_gitlab'))
        headers.append('Access-Control-Allow-Origin', '*')
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest("https://gitlab.com/api/v4/personal_access_tokens", getOptions)
    }

    /**
     * Retourne les informations utilisateurs.
     *
     * @param tokenId
     *
     * @returns {Promise<Response>}
     */
    getUserByTokenId(tokenId) {
        return executeRequest('https://gitlab.com/api/v4/users/' + tokenId)
    }

    /**
     * Retourne les groupes lié à l'utilisateur.
     *
     * @returns {Promise<Response>}
     */
    getGroupsByUser() {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', getValueOfDomId('token_gitlab'))
        headers.append('Access-Control-Allow-Origin', '*')
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest('https://gitlab.com/api/v4/groups/', getOptions)
    }

    /**
     * Permet de savoir si un utilisateur est connecté.
     *
     * @returns {boolean}
     */
    isConnected() {
        return !!this.data?.user
    }

    /**
     * Retourne les projets lié à un groupe.
     *
     * @param groupId
     *
     * @returns {Promise<Response>}
     */
    getProjectsByGroup(groupId) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest('https://gitlab.com/api/v4/groups/' + groupId + '/projects', getOptions)
    }

    /**
     * Retourne le merge request ouverte d'un groupe.
     *
     * @param groupId
     *
     * @returns {Promise<Response>}
     */
    getOpenMrByGroup(groupId) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest('https://gitlab.com/api/v4/groups/' + groupId + '/merge_requests?state=opened', getOptions)
    }

    /**
     * Retourne les approvals sur une merge request.
     *
     * @param projectId
     * @param mrIid
     *
     * @returns {Promise<Response>}
     */
    getAwardByMergeRequest(projectId, mrIid) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest('https://gitlab.com/api/v4/projects/' + projectId + '/merge_requests/' + mrIid + '/award_emoji', getOptions)
    }

    /**
     * Ajoute un pouce en l'air / en bas sur une merge request.
     *
     * @param {string} projectId
     * @param {string} iid_merge
     * @param {string} emoji_name
     * @param {Headers} headers
     */
    addAwardEmoji(projectId, iid_merge, emoji_name) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let postOptions = {method: 'POST', headers: headers}
        return fetch(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${iid_merge}/award_emoji?name=${emoji_name}`, postOptions)
            .then(res => res.json())
    }

    /**
     * Supprimer un pouce en l'air / en bas sur une merge request.
     *
     * @param {string} projectId
     * @param {string} iid_merge
     * @param {string} awardId
     */
    deleteAwardEmoji(projectId, iid_merge, awardId) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let deleteOptions = {method: 'DELETE', headers: headers}
        return fetch(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${iid_merge}/award_emoji/${awardId}`, deleteOptions)
    }

    /**
     * Retourne les commentaires associés à une merge request.
     *
     * @param projectId
     * @param iid
     * @returns {Promise<Response>}
     */
    getCommentByMergeRequest(projectId, iid) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${iid}/discussions`, getOptions)
    }

    /**
     * Résolution d'un tread dans une merge request.
     *
     * @param projectId
     * @param Iid
     * @param id
     *
     * @returns {Promise<Response>}
     */
    resolveThread(projectId, Iid, id) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let putOptions = {method: 'PUT', headers: headers}
        return executeRequest(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${Iid}/discussions/${id}?resolved=true`, putOptions)
    }

    /**
     * Retoune tous les changement dans une merge request.
     *
     * @param projectId
     * @param Iid
     *
     * @returns {Promise<Response>}
     */
    getChangesByMergeRequest(projectId, Iid) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let getOptions = {method: 'GET', headers: headers}
        return executeRequest(`https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${Iid}/changes`, getOptions)
    }

    /**
     * Merge une Request.
     *
     * @param id
     * @param iid
     *
     * @returns {Promise<Response>}
     */
    mergeARequest(id, iid) {
        let headers = new Headers()
        headers.append('PRIVATE-TOKEN', this.data.user.token)
        let putOptions = {method: 'PUT', headers: headers}
        return executeRequest(`https://gitlab.com/api/v4/projects/${id}/merge_requests/${iid}/merge`, putOptions)
    }
}