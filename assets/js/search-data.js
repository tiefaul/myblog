// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-career-overview",
          title: "Career Overview",
          description: "Explore my professional journey, including my work experience, educational background, certifications, and more.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-building-an-ai-chatbot-with-django-htmx-and-langflow",
        
          title: "Building an AI Chatbot with Django, HTMX, and Langflow",
        
        description: "Creating an AI Chatbot using Django",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/AI-Chatbot/";
          
        },
      },{id: "post-aws-landing-zone-accelerator",
        
          title: "AWS Landing Zone Accelerator",
        
        description: "Enhancing AWS Control Tower with the AWS Landing Zone Accelerator",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Landing-Zone-Accelerator/";
          
        },
      },{id: "post-automating-azure-web-app-shutdown-when-budget-exceeds-a-threshold",
        
          title: "Automating Azure Web App Shutdown When Budget Exceeds a Threshold",
        
        description: "Connecting Django App to Azure Postgresql Server",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Automating-Shutdown-Webapp/";
          
        },
      },{id: "post-azure-app-service-postgresql",
        
          title: "Azure App Service + PostgreSQL",
        
        description: "Connecting Django App to Azure Postgresql Server",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Azure-App-Service-PostgreSQL/";
          
        },
      },{id: "post-building-and-deploying-a-ci-cd-pipeline-for-my-azure-web-app",
        
          title: "Building and Deploying a CI/CD Pipeline for My Azure Web App",
        
        description: "Creating a Markdown to HTML convertor",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CI-CD-Pipeline/";
          
        },
      },{id: "post-markdown-convertor",
        
          title: "Markdown Convertor",
        
        description: "Creating a Markdown to HTML convertor",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Markdown-Converter/";
          
        },
      },{id: "post-dockerizing-django-application",
        
          title: "Dockerizing Django Application",
        
        description: "Using docker compose to containerize my Django application",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Dockerizing-Django/";
          
        },
      },{id: "post-influxdb-and-grafana",
        
          title: "InfluxDB and Grafana",
        
        description: "Using flux and grafana to monitor my Proxmox server",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Grafana-Dashboard/";
          
        },
      },{id: "post-hosting-my-first-website",
        
          title: "Hosting my first website",
        
        description: "Learning how to set up and host my own website using Jekyll.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Jekyll-Website/";
          
        },
      },{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Information_Technology_Resume.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%74%79%6C%65%72%66%61%75%6C%68%61%62%65%72@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/tyler-faulhaber", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
