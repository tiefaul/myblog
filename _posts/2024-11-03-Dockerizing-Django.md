---
layout: post
title: Dockerizing Django Application
date: 2024-11-03 15:38:00
description: Using docker compose to containerize my Django application
tags: docker-compose django python nginx
categories: docker 
---

Starting a new project is always exciting, especially when it brings together technologies like Django and Docker. For this project, I decided to build a to-do application using Django as the web framework. To simplify development and ensure consistency across environments, I set up a Docker container and a Docker Compose file. This setup allows for seamless deployment, making it as simple as running a single command to launch the app.

In this blog, I’ll guide you through creating the Dockerfile and using Docker Compose to automate container setup, along with a special Nginx configuration to enhance the deployment. As someone aspiring to enter DevOps, I believe it's crucial to understand the fundamentals of web frameworks. Exploring concepts like virtual environments, pipfiles, piplocks, environment variables, and configuring web servers like Nginx has been both educational and a lot of fun.

If you’re new to Django, I highly recommend following a tutorial on building a web app with it. This not only broadens your Python skills but also introduces you to HTML, CSS, and other tools that can make an application visually engaging.

---

## Create a Django Application
As I mentioned earlier, diving into Django is a great way to get comfortable with its functionality and structure. To start, I worked through the official Django documentation’s [polling application tutorial](https://docs.djangoproject.com/en/5.1/), which helped me understand the basics. From there, I chose to build a simple application of my own —to-do list app— as a foundation to practice and experiment with new features.

After some research, I decided to follow the [Real Python tutorial on creating a Django to-do list](https://realpython.com/django-todo-lists/). If you’re interested in learning alongside me, I encourage you to try building this application first. Then, come back here to see how we can containerize it with Docker and deploy it locally on your home network.

(work in progress, please come back later)