---
layout: post
title: InfluxDB and Grafana
date: 2024-09-15 16:23:00
description: Using flux and grafana to monitor my Proxmox server
tags: database flux grafana influxdb walkthrough
categories: monitoring
---

In managing a homelab, keeping a eye on my server's performance is crucial for maintaining stability and optimizing resource usage. As I expanded my Proxmox environment, I wanted a better way to monitor the health of my server in real-time. The provided monitoring for my server given by proxmox itself was very limited and felt lacking. However, it was a nice feature given that the purpose of Proxmox as a whole isn't just for monitoring. After researching various options, I decided to set up a monitoring solution using **InfluxDB** and **Grafana**. 
InfluxDB is a high performance time-series database, perfect for storing metrics, while Grafana provides rich, customizable visualizations.

In this post, I will discuss with you how I integrated these tools to monitor my Proxmox server. From setting up InfluxDB to visualizing metrics in Grafana.

---

# Creating the docker compose

After reading various documents, reddit post, videos, etc. I came to a conclusion that I would create docker containers for both Grafana and InfluxDB. Given that both have verified publishers for their containers on [Docker Hub](https://hub.docker.com/) I felt comfortable moving forward with my decision. 

Step 1:<br/>
Create a directory to store the compose file.<br/>
```bash
mkdir monitoring # use sudo if not already root
```
Use the `ls` command to verify the directory was made.

Step 2:<br/>
Create the compose file.
```bash
touch compose.yaml
```

Step 3:<br/>
Use your favorite editor to edit the compose file. You can use the same yaml format as I did for this:
```yaml
services:
  grafana:
    image: grafana/grafana
    container_name: grafana
    restart: always
    ports:
      - 3089:3089
    networks:
      - monitoring_network # mount network
    volumes:
      - ./conf:/usr/share/grafana/conf # mount server "conf" file to the container "conf" file, whatever changes are made to the server "conf" file are changed on the container "conf" file when restarted
      - grafana-volume:/var/lib/grafana # mount Grafana-volume

  influxdb:
    image: influxdb
    container_name: influxdb
    restart: always
    ports:
      - 8086:8086
      - 8089:8089/udp
    networks:
      - monitoring_network # mount network
    volumes:
      - influxdb-volume:/var/lib/influxdb # mount influxdb-volume

networks:
  monitoring_network:
    external: true # Use this when the network is already created

volumes:
  grafana-volume:
    external: true # Use this when the network is already created
  influxdb-volume:
    external: true
```
> Please note that the `./conf` volume on the Grafana service was necessary for me because I needed to change the default port of 3000 to 3089 inside the `default.ini` file of the container. So if you do not need to change the port, use the recommended port option of 3000 for the Grafana service and remove the `./conf` volume.

---

# Create your volume and network

In our compose file we set the network and volumes to `external: true` meaning we have to create these resources ourselves or else the compose file will error out because it cannot find the volume or network.

Run these commands to create our volumes and network:

```bash
docker volume create grafana-volume
```
```bash
docker volume create influxdb-volume
```
```bash 
docker network create monitoring_network
```

You can use ```docker volume ls``` and ```docker network ls``` to list out your current networks/volumes you have on your environment.

---

# Testing your creations!

Navigate to your containers. `<serverip:8086>` for InfluxDB and `<serverip:3000>` for Grafana. Unless you changed your ports like I did, then you should be good to go. I added all my services to my **Homepage** dashboard for easier navigation between all my services. I will make a post going over what Homepage is in a later post, but for now if you are interested, here is a GitHub link to [HomePage](https://github.com/gethomepage/homepage). Once inside your containers. Make sure you create a account in InfluxDB and the default username and password for Grafana is admin:admin. Once you are in your instances I highly recommend watching Christian Lempa's video [My new Proxmox Monitoring Tools: InfluxDB2 + Grafana](https://www.youtube.com/watch?v=f2eyVfCTLi0&t=403s) on what to do next. He goes over what I went through and MORE!

---

# What should I do now?

Just like you I was confused on how everything worked and what to do next. When watching Christian Lempa's video, I imported the [Proxmox Cluster [Flux]](https://grafana.com/grafana/dashboards/15356-proxmox-cluster-flux/) dashboard from the [Grafana website](https://grafana.com/), but I felt as if I wasn't learning anything from doing that, even though the dashboard is great and amazing and provides me with everything I want from a monitoring standpoint. My next objective in this learning journey is to create my own dashboard, learn a little bit of flux, and see how everything pans out. 
