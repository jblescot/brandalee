/**
 * Classe des options (ex : Déconnexion..).
 */
class Optionality {
    constructor(navigator) {
        this.navigator = navigator
        this.options = [
            {
                title: 'Mes données personnel',
                id: 'own_data',
                icon: 'ic_personnal_data.svg'
            },
            {
                title: 'Rafraichir',
                id: 'reload',
                icon: 'ic_reload.svg'
            },
            {
                title: 'Se déconnecter',
                id: 'disconnect',
                icon: 'ic_disconnect.svg'
            }
        ]
        if (body.dataset.type && body.dataset.type === 'plugin') {
            this.render()
        }
    }

    render() {
        document.getElementById('container_optionalities').innerHTML =
            Mustache.render('{{#option}}<span class="pointer-event" id="{{id}}" title="{{title}}"><img src="/img/{{icon}}"></span>{{/option}}', { option: this.options})
    }

    configureOptionalities() {
        this.initGetData()
        this.initReload()
        this.initDisconnect()
    }

    initGetData() {
        document.getElementById('own_data').addEventListener('click', () => {
            this.navigator.getFromStore('gitlab', (dataGit) => {
                this.navigator.getFromStore('jira', (dataJira) => {
                    this.navigator.getFromStore('configuration', (dataConfig) => {
                        let identity = {
                            gitlab: dataGit,
                            configuration: dataConfig,
                            jira: dataJira
                        }
                        let doc = URL.createObjectURL( new Blob([JSON.stringify(identity)], {type: 'application/json'}))
                        this.navigator.download(doc)
                    })
                })
            })
        })
    }

    initReload() {
        getFirstChildren(document.getElementById('reload')).setAttribute('id', 'turn')
        document.getElementById('reload').addEventListener('click', (e) => {
            document.getElementById('turn').classList.add('rotate')
            updateGitlabTab()
            updateJiraTab()
            setTimeout(() => {
                document.getElementById('turn').classList.remove('rotate')
            }, 2000)
        })
    }

    initDisconnect() {
        document.getElementById('disconnect').addEventListener('click', () => {
            navigator.store({jira: null})
            navigator.store({gitlab: null})
            gitlab.updateCredential()
            updateGitlabTab();
            updateJiraTab()
        })
    }
}