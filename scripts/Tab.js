/**
 * Classe du menu de navigation Tab.
 */
class Tab {

    constructor() {
        this.tabs = [
            {
                name: 'Configuration',
                class: 'tab_configuration',
                isHidden: false,
                isActive: true
            },
            {
                name: 'Gitlab',
                class: 'tab_gitlab',
                isHidden: false,
                isActive: false
            },
            {
                name: 'Jira',
                class: 'tab_jira',
                isHidden: false,
                isActive: false
            },
            {
                name: 'JSE',
                class: 'tab_jse',
                isHidden: true,
                isActive: false
            }
        ]
        this.render()
    }

    render() {
        document.getElementById('navigation_tab').innerHTML =
            Mustache.render(`{{#tab}}<li id="{{class}}"><a class="nav-link {{#isActive}}active{{/isActive}}" style="{{#isHidden}}display: none;{{/isHidden}}">{{name}}</a></li>{{/tab}}`,
                {tab: this.tabs}
            )
    }

    configureTabs() {
        this.initConfiguration()
        this.initGitlab()
        this.initJira()
        this.initJSE()
    }

    initConfiguration() {
        document.getElementById('tab_configuration').addEventListener('click', function (e) {
            e.target.classList.add('active')
            getFirstChildren(document.getElementById('tab_gitlab')).classList.remove('active');
            getFirstChildren(document.getElementById('tab_jira')).classList.remove('active');
            getFirstChildren(document.getElementById('tab_jse')).classList.remove('active');
            hideElement(['container_gitlab', 'container_jira', 'container_jse'])
            showElement('container_configuration')
        })
    }

    initGitlab() {
        document.getElementById('tab_gitlab').addEventListener('click', function (e) {
            e.target.classList.add('active')
            getFirstChildren(document.getElementById('tab_configuration')).classList.remove('active');
            getFirstChildren(document.getElementById('tab_jira')).classList.remove('active');
            getFirstChildren(document.getElementById('tab_jse')).classList.remove('active');
            hideElement(['container_configuration', 'container_jira', 'container_jse'])
            showElement('container_gitlab')
        })
    }

    initJira() {
        document.getElementById('tab_jira').addEventListener('click', function(e) {
            e.target.classList.add('active')
            getFirstChildren(document.getElementById('tab_configuration')).classList.remove('active');
            getFirstChildren(document.getElementById('tab_gitlab')).classList.remove('active');
            getFirstChildren(document.getElementById('tab_jse')).classList.remove('active');
            hideElement(['container_configuration', 'container_gitlab', 'container_jse'])
            showElement('container_jira')
        })
    }

    initJSE() {
        document.getElementById('tab_jse').addEventListener('click', function(e) {
            navigator.getFromStore('jira', (d) => {
                if (d.jira) {
                    e.target.classList.add('active')
                    getFirstChildren(document.getElementById('tab_configuration')).classList.remove('active');
                    getFirstChildren(document.getElementById('tab_gitlab')).classList.remove('active');
                    getFirstChildren(document.getElementById('tab_jira')).classList.remove('active');
                    hideElement(['container_configuration', 'container_gitlab', 'container_jira'])
                    showElement('container_jse')
                } else {
                    navigator.sendNotification(MESSAGES.notifications.jiraMustConnect.title, MESSAGES.notifications.jiraMustConnect.message)
                }
            })
        })
    }
}