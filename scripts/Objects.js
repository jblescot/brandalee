class ManifestNavigator {
    static getChromeManifest() {
        return chrome.runtime.getManifest();
    }

    static getFirefoxManifest() {
        return browser.runtime.getManifest();
    }
}

class Storage {
    static getChromeStorage() {
        return chrome.storage.local
    }

    static getMozillaStorage() {
        return browser.storage.local
    }
}

class Notification {
    static sendWithChrome(title, message) {
        chrome.notifications.create('Update', {
            iconUrl: "./favicon.ico",
            type: 'basic',
            title: title,
            message: message,
        });
    }

    static sendWithFireFox(title, message) {
        browser.notifications.create('Update', {
            type: "basic",
            iconUrl: './favicon.ico',
            title: tiitle,
            message: message
        })
    }
}

class Navigator {
    getManifest() {
        switch (this.getNavigator()) {
            case 'chome':
                return ManifestNavigator.getChromeManifest();
            case 'firefox':
                return ManifestNavigator.getFirefoxManifest();
        }
    }

    getUrlOf(fileName) {
        switch (this.getNavigator()) {
            case 'chome':
                return chrome.runtime.getURL(fileName)
            case 'firefox':
                return browser.extension.getURL(fileName);
        }
    }

    getStorage() {
        switch (this.getNavigator()) {
            case 'chome':
                return Storage.getChromeStorage()
            case 'firefox':
                return Storage.getMozillaStorage();
        }
    }

    store(object) {
        switch (this.getNavigator()) {
            case 'chome':
                this.getStorage().set(object, function () {
                })
            case 'firefox':
                this.getStorage().set(object)
        }
    }

    getFromStore(name, callback) {
        switch (this.getNavigator()) {
            case 'chome':
                return this.getStorage().get([name], callback)
            case 'firefox':
                return this.getStorage().get(name).then(callback)
        }
    }

    sendNotification(title, message) {
        switch (this.getNavigator()) {
            case 'chome':
                return Notification.sendWithChrome(title, message)
            case 'firefox':
                return Notification.sendWithFireFox(title, message);
        }
    }

    openTab(url) {
        switch (this.getNavigator()) {
            case 'chome':
                return chrome.tabs.create({url: url})
            case 'firefox':
                return browser.tabs.create({url: url})
        }
    }

    getNavigator() {
        if (this.isChrome()) return 'chome';
        if (this.isFirefox()) return 'firefox';
        return null;
    }

    isChrome() {
        return (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) ? true : false;
    }

    isFirefox() {
        return (typeof InstallTrigger !== 'undefined') ? true : false;
    }
}

const navigator = new Navigator();