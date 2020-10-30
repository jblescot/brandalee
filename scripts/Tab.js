/**
 * Classe du menu de navigation Tab.
 */
class Tab {

    constructor(navigator) {
        this.navigator = navigator
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
        if (body.dataset.type && body.dataset.type === 'plugin') {
            this.render()
        }
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
        let cmp = document.querySelector('#cmp')
        let picker = new Picker(cmp)
        picker.onChange = function(color) {
            cmp.style.backgroundColor = color.rgbaString;
            cmp.value = color.rgbaString
        }
        picker.setOptions({
            popup: 'right',
            color: cmp.value
        })

        let cmnv = document.querySelector('#cmnv')
        let cmnvPicker = new Picker(cmnv)
        cmnvPicker.onChange = function(color) {
            cmnv.style.backgroundColor = color.rgbaString
            cmnv.value = color.rgbaString
        }
        cmnvPicker.setOptions({
            popup: 'left',
            color: cmnv.value
        })

        this.navigator.getFromStore('notifications', (d) => {
            if (d.notifications) {
                NOTIFICATIONS = d.notifications
            } else {
                this.navigator.store({notifications: {mergePossible: false}})
                NOTIFICATIONS = {mergePossible: false}
            }
            if (NOTIFICATIONS.mergePossible === true) {
                document.getElementById('can_merge_input').click()
                document.getElementById('can_merge_input').setAttribute("activated", "true")
            } else {
                document.getElementById('can_merge_input').setAttribute("activated", "false")
            }
        })

        if (document.getElementById("can_merge_input")) {
            document.getElementById('can_merge_input').addEventListener('change', (e) => {
                let activated = e.target.getAttribute("activated")
                if (activated === "true") {
                    e.target.setAttribute("activated", "false")
                    NOTIFICATIONS.mergePossible = false
                } else if (activated === "false") {
                    e.target.setAttribute("activated", "true")
                    NOTIFICATIONS.mergePossible = true
                }
                navigator.store({notifications: NOTIFICATIONS})
            })
        }
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