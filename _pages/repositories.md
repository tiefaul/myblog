---
layout: page
permalink: /repositories/
title: Repositories
description: Welcome to the Repositories section of my website! Here, you'll find links to my public GitHub repositories, showcasing the projects I've created and the code I've developed, primarily in Python. As a beginner in coding, I'm excited to share my journey from novice to expert. I hope you enjoy following along as I learn, grow, and improve my skills in the world of programming.
nav: true
nav_order: 4
---

## My GitHub Stats

<br/>

{% if site.data.repositories.github_users %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}
</div>

<br/>

{% if site.repo_trophies.enabled %}
{% for user in site.data.repositories.github_users %}
{% if site.data.repositories.github_users.size > 1 %}

  <h4>{{ user }}</h4>
  {% endif %}
  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% include repository/repo_trophies.liquid username=user %}
  </div>

<br/>

---

{% endfor %}
{% endif %}
{% endif %}

<br/>

## Public GitHub Repositories

<br/>

{% if site.data.repositories.github_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
