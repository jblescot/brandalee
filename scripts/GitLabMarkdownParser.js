class GitLabMarkdownParser {
    static parse(content, lang) {
        let regex = /@@(.*)@@/g, result, index = 0
        result = content.matchAll(regex)
        for (const m of result) {
            index++
            if (index % 2 === 0) {
                content = content.replace(m[0], '````' + '\n\n'+'```' + lang + '\n\n')
            } else {
                content = content.replace(m[0], '```' + lang + '\n\n')
            }
        }
        /*while ( result && result[0] ) {
            index++
            if (index % 2 === 0) {
                content.replace(result[0], '````' + '\n'+'```' + lang + '\n')
            } else {
                content.replace(result[0], '```' + lang + '\n')
            }
            result = content.match(regex)
        }*/
        return content
    }
}