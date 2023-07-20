{% if total_actors > 1 %} 
  {{ actors[0].name }}, {{ actors[1].name }}, and {{ total_actors | minus: 2 }} others commented on your page.
{% elsif  total_activities > 1 %}
  **{{ actor.name}}** left {{ total_activities }} comments on {{ comment.page_name }}
  
{% else %}
  **{{ actor.name}}** left a comment on **{{ comment.page_name }}**.  
  > {{ comment.body }}
{% endif %}