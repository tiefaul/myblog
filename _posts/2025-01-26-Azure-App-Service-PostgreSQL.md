---
layout: post
title: Azure App Service + PostgreSQL
date: 2025-01-26 16:23:00
description: Connecting Django App to Azure Postgresql Server
tags: database django postgresql
categories: azure
---
I’m excited to share that I successfully connected my Azure Web App to an Azure Database for PostgreSQL - Flexible Server! This milestone marks a significant step in my development journey, and I want to walk you through the process to help anyone else attempting a similar setup.  

### Step 1: Create the Resources  

To get started, I created a Django web application and an Azure Database for PostgreSQL - Flexible Server. During the setup, there are a few key options you need to configure:  

1. **Add Current Client IP Address**: Ensure this option is selected to include your current IP in the PostgreSQL server's firewall rules.  
2. **Allow Public Access**: Enable the option to allow public access to the server using a public IP address.  
3. **Allow Access from Azure Services**: Select the option to allow public access from any Azure Service within Azure to this server.  

Once the PostgreSQL server was created, I navigated to:  
**Settings > Service Connector**, and clicked `+Create`.  

### Service Connector Configuration  

- **Service Type**: DB for PostgreSQL Flexible Server  
- **Connection Name**: Choose any descriptive name for your connection.  
- **Subscription**: Select your Azure subscription.  

After creating the Service Connector, I viewed the **Sample Code** tab, which redirected me to the Microsoft Learn documentation. The documentation provides detailed instructions on how to use a connection string to connect your application to the database.  

> **Pro Tip**: Always follow security best practices by storing sensitive information, such as database credentials, in environment variables instead of hardcoding them into your application.  

## Step 2: Configure Django  

Following the Django setup steps in the documentation, I updated my `settings.py` file to include the appropriate environment variables for the database connection. Additionally, I installed the required PostgreSQL driver by running:  

```bash
pip install psycopg2
```

To Test the connection, I pushed all my Django models to the datatbase by running
```python
python manage.py makemigrations
python manage.py migrate
```
And just like that... BAM! Pages loaded perfectly, and I was able to perform POST and GET requests without issues.

### Step 3: Serve Static Files
One challenge I encountered was that Gunicorn does not serve static files. For less demanding websites (such as my development environment), I learned that the **WhiteNoise** middleware can be used to serve static files efficiently.

To implement WhiteNoise, I ran:
```python
pip install whitenoise
```
Next, I updated my `setting.py` file to add `whitenoise.middleware.WhiteNoiseMiddleware` to the middleware list. It is important to place this middleware **Immediately after** `django.middleware.security.securityMiddleware` to ensure it functions correctly.

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # Other middleware...
]
```
With this setup, I was able to serve static files successfully

### Conclusion
After testing and configuring everything, My development environment was finally in a stable and functional state. This project was a fantastic learning experience, and I am excited to explore more advanced deployments in the future. 

If you are working on something similar, I hope this guide helps you along the way.