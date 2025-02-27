---
layout: post
title: Automating Azure Web App Shutdown When Budget Exceeds a Threshold
date: 2025-01-26 16:23:00
description: Connecting Django App to Azure Postgresql Server
tags: action-groups runbooks automation
categories: azure
---
Managing cloud costs is crucial, and Azure provides tools to automate actions when your budget reaches a predefined threshold. In this guide, I'll walk through how I automated the shutdown of my Azure web app when my budget hit a certain limit.

## Step 1: Create an Automation Runbook
Azure Automation Runbooks allow us to execute scripts automatically. We will create a Runbook that stops the web app.
1. Click the menu (☰) in the Azure Portal.
2. Select **Create a Resource**.
3. Search for **Automation Accounts** and create one.
4. Navigate to the newly created **Automation Account**.
5. On the left panel, select **Process Automation > Runbooks**.
6. Click **Create a Runbook**.
7. Choose **Powershell** as the runtime version and click create.
8. Add the following script to the Runbook.

```powershell
param (
    [string]$ResourceGroupName = "ResourceGroupName",
    [string]$WebAppName = "WebAppName"
)

Connect-AzAccount -Identity
Stop-AzWebApp -ResourceGroupName $ResourceGroupName -Name $WebAppName
```

9. Replace the $ResourceGroupName and WebAppName values with your actual resource details.
10. Click **Publish** to finalize the Runbook.

## Step 2: Create an Action Group
An Action Group defines what happens when an alert is triggered.
1. Click the menu (☰) and go to Monitor.
2 Navigate to Alerts.
3. Select **Create Action Group**.
4. Fill in the required information.
5. In the Actions tab:
    - Set **Action Type** to **Automation Runbook**.
    - **Runbook** = Enabled
    - **Runbook Source** = User
    - Choose your **subscription**, **Automation account**, and **Runbook**.
6. Click **OK**, then **Create**.

## Step 3: Set Up a Budget
Now, lets create a budget and configure it to trigger our **Action Group*.
1. Click the menu (☰) and navigate to **Cost Management + Billing**.
2. Click on **Cost Management > Budgets**.
3. Important: Change the scope to your **Subscription**.
4. Click **Add** and configure the budget according to your needs.
5. In the **Set Alerts** tab, ensure you select your **Action Group**.

## Step 4: Grant Permissions to the Automation Account
For the **Runbook** to execute properly, it needs permission to manage resources
1. Go to either your Web App or **Resource Group**.
2. Click **IAM** (Identity and Access Management).
3. Select **Add Role Assignment**.
4. Choose the **Contributor** role.
5. Set Assign Access To as Managed Identity.
6. Select your **Automation Account**.
7. Click **Review and Assign**.

## Summary
With this setup:
1. The budget alert triggers the **Action Group**.
2. The **Action Group** runs the **Automation Runbook**.
3. The **Runbook** executes a script that stops the web app when the budget threshold is met.

This automation ensures your Azure costs stay under control without manual intervention. Hope this guide helps you implement a similar solution!