class GitLabMarkdownParser {
    static parse(content, lang, fileName, template) {
        let regex = /@@(.*)@@/g, result, index = 0
        result = content.matchAll(regex)
        for (const m of result) {
            index++
            if (index % 2 === 0) {
                content = content.replace(m[0], '')
            } else {
                content = content.replace(m[0], '')
            }
        }
        return this.toCode(content, fileName, template)
    }

    static toCode(content, fileName, template) {
        let diffs = content.split('```\n')
        let codes = {title: fileName, lines: []}
        diffs.forEach(diff => {
            diff.split('\n').forEach(line => {
                line = line.trim()
                if (line.startsWith('+')) {
                    codes.lines.push({
                        isAdd: true,
                        isDelete: null,
                        isNone: null,
                        content: line
                    })
                } else if (line.startsWith('-')) {
                    codes.lines.push({
                        isAdd: null,
                        isDelete: true,
                        isNone: null,
                        content: line
                    })
                } else if (line.trim() === "") {
                    codes.lines.push({
                        isAdd: null,
                        isDelete: null,
                        isNone: null,
                        isEOL: true,
                        content: line
                    })
                } else {
                    codes.lines.push({
                        isAdd: null,
                        isDelete: null,
                        isNone: true,
                        content: line
                    })
                }
            })
        })

        return Mustache.render(template, {
            title: codes.title,
            lines: codes.lines
        })
    }
}