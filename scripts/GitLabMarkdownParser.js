class GitLabMarkdownParser {
    static parse(content, lang, fileName) {
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
        content += "\n ```"

        return this.toCode(content, fileName)
    }

    static toCode(content, fileName) {
        let diffs = content.split('```\n')
        let output = ""
        diffs.forEach(diff => {
            diff.split('\n').forEach(line => {
                let startR = /```[a-zA-Z]+/, endR = /```/

                if (line.match(startR)) {
                    output += "<div class='code'>"
                    output += `<h3 class="file_title" class="text-center">${fileName}</h3>`
                } else if (line.match(endR)) {
                    output += "</div>"
                    output += "<hr class='bold_trait'/>"
                } else {
                    line = line.trim()
                    if (line.startsWith('+')) {
                        output += "<pre class='green_line_diff'>" + line + "</pre>"
                    } else if (line.startsWith('-')) {
                        output += "<pre class='red_line_diff'>" + line + "</pre>"
                    } else if (line.trim() === "") {
                        output += "<br>"
                    } else {
                        output += "<pre class='hideOverflow-x'>" + line + "</pre>"
                    }
                }
            })
        })
        return output
    }
}