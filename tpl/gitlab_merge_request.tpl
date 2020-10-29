<div>
    {{#groups}}
    <h3 class="text-center">{{name}}</h3>
    <br/>
    {{#projects}}
    <h4 class="text-center">{{name}}</h4>
    <br/>
    {{#mr}}
    <p class="text-left fs-12"></p>
    <img class="gitlab-avatar" src="{{{mrAuthorAvatar_url}}}" alt="avatar" />
    <span id="th_up_{{mrId}}">{{mrUpvotes}}</span>
    <svg data-iid="{{mrIid}}" data-projectid="{{mrProject_id}}" {{{data_award_id_up_render}}} id="up_{{mrId}}" class="gitlab-svg"
         style="{{fill}}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M4 5L8.586.414a1.414 1.414 0 0 1 2.414 1V5h2.991a2 2 0 0 1 1.928 2.531l-1.248 4.532A4 4 0 0 1 10.814 15H0V5h4zm5-2.172V7h4.991l-1.249 4.531A2 2 0 0 1 10.814 13H5V6.828l4-4zM3 7H2v6h1V7z"></path>
    </svg>
    / <span id="th_down_{{mrId}}">{{mrDownvotes}}</span>
    <svg data-iid="{{mrIid}}" data-projectid="{{mrProject_id}}" {{{data_award_id_down_render}}} id="down_{{mrId}}" class="gitlab-svg"
         style="{{fill_down}}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M4 11H0V1h10.814a4 4 0 0 1 3.857 2.937l1.248 4.532A2 2 0 0 1 13.991 11H11v3.586a1.414 1.414 0 0 1-2.414 1L4 11zm1-1.828l4 4V9h4.991l-1.249-4.531A2 2 0 0 0 10.814 3H5v6.172zM3 3H2v6h1V3z"></path>
    </svg>
    / {{mrUser_notes_count}}
    <svg class="gitlab-svg" viewBox="0 0 16 16" data-iid="{{mrIid}}" data-projectid="{{mrProject_id}}"
         id="comment_{{mrId}}" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M4 10.41l-2.5 1.445A1 1 0 0 1 0 10.99V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8.99a1 1 0 0 1-1.5.865L11.29 14H6a2 2 0 0 1-2-2v-1.59zM4 8.1L2 9.258V2h8v2H6a2 2 0 0 0-2 2v2.1zM6 12h5.825L14 13.257V6H6v6z"></path>
    </svg>
    <svg class="gitlab-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="diff_{{mrId}}"
        data-projectId="{{mrProject_id}}" data-iid="{{mrIid}}" data-projectname="{{projectName}}" data-groupname="{{groupName}}">
        <path fill-rule="evenodd"
              d="M3 1h6.172a2 2 0 0 1 1.284.467l.13.119 2.828 2.828a2 2 0 0 1 .578 1.239l.008.175V14a1 1 0 0 1-.883.993L13 15H3a1 1 0 0 1-.993-.883L2 14V2a1 1 0 0 1 .883-.993L3 1h6.172H3zm6 2H4v10h8V6h-2a1 1 0 0 1-.993-.883L9 5V3zm0 7h1a1 1 0 0 1 .117 1.993L10 12H9a1 1 0 0 1-.117-1.993L9 10zM6.613 5.21l.094.083 2 2a1 1 0 0 1 .083 1.32l-.083.094-2 2a1 1 0 0 1-1.497-1.32l.083-.094L6.586 8 5.293 6.707a1 1 0 0 1 1.32-1.497z"></path>
    </svg>
    {{{mergeBtn}}}
    <span class="fs-14 ml-10">
        <a data-link="{{mrWeb_url}}" id="{{mrId}}" class="gitlab-focusable-link">{{mrTitle}}</a>
    </span>
    {{/mr}}
    <hr/>
    {{/projects}}
    {{/groups}}
</div>