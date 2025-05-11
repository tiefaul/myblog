---
layout: post
title: AWS Landing Zone Accelerator
date: 2025-05-11 17:20:00
description: Enhancing AWS Control Tower with the AWS Landing Zone Accelerator
tags: lza code-piplines control-tower
categories: aws
---
Managing multiple AWS accounts efficiently and securely can be complex. While AWS Control Tower provides a strong foundation with guardrails and automated account setup, it has some limitations when it comes to customization and scaling across enterprise environments. 

To address this, I used AWS Landing Zone Accelerator (LZA), an open-source solution that builds on Control Tower to provide a more customizable and automated landing zone deployment. This post covers how I set it up, integrated CloudFormation and CodePipeline, and the benefits it brought to my AWS environment.

---

## Why I chose the AWS LZA?

The LZA brings several enhancements to AWS Control Tower:
- Customizable account structure via templates.
- Automated deployment using CI/CD (CodePipeline).
- Integration with AWS Security services, IAM, and compliance frameworks.
- Centralized configuration as code.

This tool was perfect for extending Control Tower to fit my environment's security, scalability, and automation needs.

---

## Getting Started: Initial Setup

Here is how I bootstrapped the deployment:

- Visit the [LZA Implementation Guide](https://docs.aws.amazon.com/solutions/latest/landing-zone-accelerator-on-aws/prerequisites.html)
- Go over all the prerequisites.
- Launch the stack on Step 1.
- Input all of your parameters (recommend to use S3 to store your configuration files as CodeCommit has ended its lifecycle).
- Navigate to the AWS CodePipeline console.
- Insure AWSAccelerator-Installer pipeline is either `In Progress` or `Complete`.
- When the installer is complete, the AWSAccelerator-Pipeline is created and should be `In Progress`.

> Note: This pipleine takes approximately 45 minutes to complete. 

---

## Update the config files

Once the pipelines are complete, you are ready to configure.
- Navigate to your S3 bucket named aws-accelerator-config-ACCOUNT_ID-REGION.
- Download the object `zipped/aws-accelerator-config.zip` and extract the contents to view your LZA on AWS config files.
- Each config file is named based on its purpose in the LZA. Sample configs can be found on the offical [AWS GitHub repository](https://github.com/awslabs/landing-zone-accelerator-on-aws/tree/main/reference/sample-configurations/lza-sample-config).
- When finished editing. Compress the files into a new Zip and upload them back into the same S3 object path.
- Go to hte CodePipeline console.
- Select `AWSAccelerator-Pipeline`, then `Release Change`.

This initiates a new pipeline instantiation and deploys the configuration changes to your environment.

---

## Recap

Main takeaways I want you to get from this is that CloudFormation (AWS Terraform) sets up:
- S3 buckets (for config/code storage)
- CodePipelines and CodeBuild stages
- IAM roles for deployment execution
- And More

Using LZA, I was able to:
- Scale Control Tower deployment
- Enforce consistent governance
- Automate changes through CI/CD pipelines