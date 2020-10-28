const Config = {
    MIN_APPROVAL_NUMBER: 3,
    MERGE_POSSIBLE_COLOR: "#FF0000",
    MERGE_NEED_VOTES: "#FFA500",
    GROUP_NAME: 'agrifarmer'
};

let USED_CONFIG = {};

let MESSAGES = {
    notifications: {
        saved: {title: 'Configuration sauvergardé', message: 'La nouvelle configuration à bien été sauvegardé.'},
        jiraMustConnect: {title: 'Jira', message: 'Vous devez vous connecter avant d\'utiliser cette fonctionnalité.'},
        update: {title: 'Mise à jour', message: 'Vous pouvez mettre a jour Jirlab !'}
    },
    errors: {
        bad_format_mr: 'Attention, le format du titre est incorrect. Voici un exemple : \n feature/ABCD-1234 nom_du_ticket'
    },
    snackbar: {
        dynamicMessage: {
            seeJiraTicket: function(link) {
                return `Vous voulez voir le ticket ? <a href="${link}" style="color:white;">Par ici</a>`
            },
            resolveThread: function(number) {
                return `Il vous reste ${number} thread(s) à résoudre !`
            },
            seeGitlabMergeRequest: function(link) {
                return `Le ticket est peut être en merge request ? <a href="${link}" style="color:white;">Voir ici</a>`
            }
        }
    }
}