<div>
    <div class="code">
        <h3 class="file_title" class="text-center">{{title}}</h3>
        {{#lines}}

            {{#isAdd}}
                <pre class='green_line_diff'>{{content}}</pre>
            {{/isAdd}}

            {{#isDelete}}
                <pre class='red_line_diff'>{{content}}</pre>
            {{/isDelete}}

            {{#isNone}}
                <pre class='hideOverflow-x'>{{content}}</pre>
            {{/isNone}}

            {{#isEOL}}
                <br />
            {{/isEOL}}

        {{/lines}}
    </div>
    <hr class='bold_trait'/>
</div>