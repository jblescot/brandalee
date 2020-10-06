/**
 * Retourne le premier enfant d'un élément.
 *
 * @param {HTMLElement} el
 */
function getFirstChildren(el) {
    return el.children[0];
}

/**
 * Retourne le dernier enfant de l'élément.
 *
 * @param {HTMLElement} el
 */
function getLastChildren(el) {
    return el.children[el.children.length - 1];
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
        .then(res => {
            if (res.status === 200) return res.json()
            if (res.status === 204) return true
            return null
        })
}

/**
 * Affiche un élément du DOM.
 *
 * @param {string|Array} param Id de(s) l'élément(s);
 */
function displayElement(param) {
    if (param instanceof Array) {
        param.forEach(p => {
            document.getElementById(p).style.display = 'block';
        })
    } else {
        document.getElementById(param).style.display = 'block';
    }
}

/**
 * Masque un élément du DOM.
 *
 * @param {string|Array} param Id de(s) l'élément(s);
 */
function dontDisplayElement(param) {
    if (param instanceof Array) {
        param.forEach(p => {
            document.getElementById(p).style.display = 'none';
        })
    } else {
        document.getElementById(param).style.display = 'none';
    }
}

/**
 * Retourne les paramètres présent dans l'URL.
 */
function getUrlParams() {
    const currentUrl = window.location.href;
    let params = {};
    let parser = document.createElement('a');
    parser.href = currentUrl;
    let query = parser.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
}