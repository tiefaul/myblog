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

## Creating a Dockerfile
A Dockerfile is a script containing a series of instructions that tells Docker how to build a custom container image. You specify things like the base image (e.g., Python or Ubuntu), the application code, required libraries, and any setup commands needed to get your app up and running. When you build this file, Docker uses these instructions to create a container image that you can deploy consistently across different environments.

### The DockerFile
Here’s a basic Dockerfile for a Django application:
```yaml
# First we import the python image from DockerHub (https://hub.docker.com/_/python)

FROM python:3.12

# Standard environment variables when creating a python based dockerfile
# First env tells python not to write .pyc files. These files are unnecessary for a container.
# Second env tells python to output directly into the console without buffering

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

# Make a directory called app to store your django project, update any packages, and update pip

RUN mkdir /app && \ 
    apt update && \
    pip install --upgrade pip

# Set the new directory as the working directory    

WORKDIR /app

# Copy all the files in your current directory on your host to the current directory of the container

COPY . .

# Run commands to install the requirements from your requirements.txt

RUN pip install -r requirements.txt

# Expose port 8000

EXPOSE 8000

# Commands to run when container is finished. Seperate each string with a comma.

CMD ["gunicorn", "-b", "0.0.0.0:8000", "todo_website.wsgi:application"]
```
### Why we use Gunicorn
By default Django's development server, ```python manage.py runserver```, is intended for development and is not optimized for handling multiple requests at scale or ensuring stability needed in production.

Gunicorn is bridge between Django and the web, efficiently handling multiple incoming requests by spawning multiple worker processes that manage these requests concurrently. This makes the app more responsive and capable of handling higher traffic volumes. 

In a typical setup, Gunicorn is often used together with a web server like Nginx. Nginx handles static file serving, load balancing, and reverse proxying to Gunicorn, Which then processes the actual application requests. This combination helps ensure performance, stability, and security for Django applications in production environments

Here is an example of a Nginx config for Gunicorn:
```yaml
# nginx.conf

server {
    listen 80;

    # Replace this with your domain or IP
    server_name example.domain.com;

    # Serve static files
    location /static/ { # This block tells nginx to handle requests that start with /static/
        alias /app/static/; # This sets /app/static/ as the directory where nginx should look for the files requested under /static/
    }

    # Proxy requests to Gunicorn
    location / {
        proxy_pass http://web:8000; # web is based on the service name in the docker compose file
        proxy_set_header Host $host; 
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
## Creating the Docker Compose
Docker Compose is a tool that simplifies the process of managing multi-container Docker applications. With Docker Compose, you can define all the services, networks, and volumes your app needs in a single ```docker-compose.yaml``` file. This will specify how each container should be configured, such as which Docker image to use, any environment variables, and how containers should interact.

Here is an example of my ```docker-compose.yaml``` file:
```yaml
name: todoapp

services:
  web: # service name
    build: # This tells Docker to generate the image directly from the project's Dockerfile instead of using a pre-built one like we did for nginx.
      context: . # Defines a path to a directory that contains a Dockerfile, or a URL to a git repo.
      dockerfile: Dockerfile # Can set an alternate Dockerfile. So this file could be called "app.Dockerfile".
    volumes:
      - static_volume:/app/static/ # Stores our static files
      - ./db.sqlite3:/app/db.sqlite3 # Mount the SQLite database file if you want to persist it.
    expose: # Expose is only used to connect to other services in the Dockerfile
      - "8000"
    env_file:
      - path: ./.env
    
  nginx:
    image: nginx:latest
    ports: # Ports is used if you want clients/services outside of the Dockerfile to connect.
      - "80:80"
    volumes:
      - static_volume:/app/static # Link the same static files directory
      - ./nginx.conf:/etc/nginx/conf.d/default.conf # Replace the contents of nginx.conf into the default.conf of nginx.
    depends_on:
      - web # Nginx should depend on the web service, it gets built after the web service.

volumes:
  static_volume: # Create the static_volume
```
Here you can see I have two services. The first service image is the DockerFile I created in my apps root directory. The second service is a Nginx image pulled from DockerHub. With this setup, when I run ```docker compose up```, Docker will build both these containers and set up how they should connect to each other. This makes it much easier to deploy and manage complex applications.