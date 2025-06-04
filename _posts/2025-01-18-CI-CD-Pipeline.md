---
layout: post
title: Building and Deploying a CI/CD Pipeline for My Azure Web App
date: 2025-01-18 22:37:00
description: Creating a Markdown to HTML convertor 
tags: devops yaml automation
categories: github
---

Today, I accomplished a significant milestone. I created a CI/CD pipeline for my Azure Web App. This project taught me a great deal about [GitHub Actions](https://docs.github.com/en/actions), [GitHub Packages](https://docs.github.com/en/packages), and their role in building and deploying containerized applications. Here I'll walk you through the process, share the GitHub workflow I used, and explain some key concepts to provide clarity for those interested in DevOps practices.

For clarity I deployed a web app using Django. Django is a web framework for Python and is something that I have been learning for a few months now. 

## Learning GitHub Actions and GitHub Packages

GitHub Actions is a powerful tool for automating workflows directly in your GitHub repository. It allows you to define custom workflows using *YAML* files that are triggered by specific events, such as code pushes or pull requests. With GitHub Actions, you can automate tasks such as building, testing, and deploying applications.

GitHub Packages, on the other hand, serves as a container registry where you can store and manage Docker container images. By leveraging GitHub Packages in combination with GitHub Actions, you can automate the entire process of building and deploying your containerized applications.

## My GitHub Workflow

To implement my CI/CD pipeline, I created the following GitHub workflow. It builds a Docker container from my project, pushes the image to GitHub Packages, and deploys it to Azure Web App Services. Here is the workflow:

```yaml
# GitHub recommends pinning actions to a commit SHA.
# To get a newer version, you will need to update the SHA.
# You can also reference a tag or branch, but the action may change without warning.

name: Build and deploy container to Azure Web App

env:
  AZURE_WEBAPP_NAME: django-portfolio  # set this to your application's name

on:
  push:
    branches: # Trigger action on a push to the main branch
      - main

permissions:
  contents: 'read'
  packages: 'write'

jobs:
  build: # Create a job called build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx # Name utility
        uses: docker/setup-buildx-action@6524bf65af31da8d45b59e8c27de4bd072b392f5 # Utility for building and pushing multi-platform Docker Images

      - name: Log in to GitHub container registry
        uses: docker/login-action@9780b0c442fbb1117ed29e0efdff1e18412f7567 # Logs into GitHub container registry
        with:
          registry: ghcr.io
          username: github username
          password: github secret for github token

      - name: Lowercase the repo name
        run: echo "REPO=${GITHUB_REPOSITORY,,}" >>${GITHUB_ENV} # Ensure repo name is in lowercase

      - name: Build and push container image to registry
        uses: docker/build-push-action@b32b51a8eda65d6793cd0494a773d4f6bcef32dc # Builds Docker image and pushes to GitHub Packages
        with:
          push: true
          tags: ghcr.io/${{ env.REPO }}:${{ github.sha }} # Tags Docker image as repo-name:repo-hash
          file: ./Dockerfile # Builds container based on the Dockerfile in the root of my repo

  deploy: # Create a job called deploy
    runs-on: ubuntu-latest

    needs: build # Won't build until build job is complete

    steps:
      - name: Lowercase the repo name
        run: echo "REPO=${GITHUB_REPOSITORY,,}" >>${GITHUB_ENV}

      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@2fdd5c3ebb4e540834e86ecc1f6fdcd5539023ee # Deploys the Docker image from GitHub Packages to Azure Web App
        with:
          app-name: azure web app name
          publish-profile: secret for azure publish-profile # Store this in GitHub secrets
          images: 'ghcr.io/repo:reposha'
```

## WorkFlow Rundown

1. Triggers and Permissions:
    - The workflow is triggered on a push to the main branch.
    - Need read access for contents and write access for packages.

2. Build Job:
    - `build` job starts by checking out the repository
    - Sets up Docker Buildx to build and push multi-platform Docker Images.
    - Logs into GitHub container registry (ghcr.io) using a token.
    - The job ensures the repo name is lowercase and builds the Docker Image using `docker/build-push-action.  The image is then pushed to GitHub Packages. 
    
3. Deploy Job:
    - `deploy` job depends on the successful completion of the `build` job.
    - It uses the `azure/webapps-deploy` action to deploy the Docker image from GitHub packages to Azure Web App Services. The `publish profile` is securely stored in GitHub Secrets for authentication.

## Setting up the Workflow

To enable this workflow for my project. I had to create a `.github/workflows` directory in my project's root folder. This is where I stored the YAML file for the workflow. Once committed, GitHub automatically recognized and executed the workflow upon a push to the `main` branch.

## Reflection

This project was an excellent introduction to CI/CD and DevOps practices. I now have a better understanding of:
- Automating builds and deployments with GitHub Actions.
- Managing container images with GitHub Packages.
- Deploying containerized applications to Azure Web App Services.

By building this pipeline, I have not only streamlined my development but also gained valuable hands-on experience with modern DevOps tools and concepts.