<div>
    {{#groups}}
    <h3 class="text-center">{{name}}</h3>
    <br/>
    {{#projects}}
    <h4 class="text-center">{{name}}</h4>
    <br/>
    {{#mr}}
    <p class="text-left" style="font-size: 12px;"></p>
    <img style="width: 25px; height: 25px; margin-right: 10px;"
         src="{{{mrAuthorAvatar_url}}}">
    <span id="th_up_{{mrId}}">{{mrUpvotes}}</span>
    <svg data-iid="{{mrIid}}" data-projectid="{{mrProject_id}}" {{{data_award_id_up_render}}} id="up_{{mrId}}"
         style="width:15px; height: 15px;{{fill}}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M4 5L8.586.414a1.414 1.414 0 0 1 2.414 1V5h2.991a2 2 0 0 1 1.928 2.531l-1.248 4.532A4 4 0 0 1 10.814 15H0V5h4zm5-2.172V7h4.991l-1.249 4.531A2 2 0 0 1 10.814 13H5V6.828l4-4zM3 7H2v6h1V7z"></path>
    </svg>
    / <span id="th_down_{{mrId}}">{{mrDownvotes}}</span>
    <svg data-iid="{{mrIid}}" data-projectid="{{mrProject_id}}" {{{data_award_id_down_render}}} id="down_{{mrId}}"
         style="width:15px; height: 15px;{{fill_down}}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M4 11H0V1h10.814a4 4 0 0 1 3.857 2.937l1.248 4.532A2 2 0 0 1 13.991 11H11v3.586a1.414 1.414 0 0 1-2.414 1L4 11zm1-1.828l4 4V9h4.991l-1.249-4.531A2 2 0 0 0 10.814 3H5v6.172zM3 3H2v6h1V3z"></path>
    </svg>
    / {{mrUser_notes_count}}
    <svg style="width:15px; height: 15px;" viewBox="0 0 16 16" data-iid="{{mrIid}}" data-projectid="{{mrProject_id}}"
         id="comment_{{mrId}}" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M4 10.41l-2.5 1.445A1 1 0 0 1 0 10.99V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8.99a1 1 0 0 1-1.5.865L11.29 14H6a2 2 0 0 1-2-2v-1.59zM4 8.1L2 9.258V2h8v2H6a2 2 0 0 0-2 2v2.1zM6 12h5.825L14 13.257V6H6v6z"></path>
    </svg>
    {{{mergeBtn}}}
    <span style="font-size: 14px; margin-left: 10px;">
                    <a data-link="{{mrWeb_url}}" id="{{mrId}}"
                       style="color:black; cursor: grab;">{{mrTitle}}</a>
                </span>
    {{/mr}}
    <hr/>
    {{/projects}}
    {{/groups}}
</div>