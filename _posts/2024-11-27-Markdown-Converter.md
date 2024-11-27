---
layout: post
title: Markdown Convertor
date: 2024-11-27 15:02:00
description: Creating a Markdown to HTML convertor 
tags: django markdown automation
categories: python
---

## Automating Markdown To HTML Using Python-Markdown

As someone who enjoys simplifying workflows, I recently automated a process for one of my Django projects to convert Markdown files into HTML. This is small but effective script saves time and ensures consistency when dealing with Markdown-based content. In this post, I will walk you through the steps from setting up the environment to running the script.

---

### Why automate Markdown Conversion?

Markdown is a lightweight markup language that is easy to write and widely used for documentation, blogs, and other text-based content. However, in web projects like Django, this content often needs to be converted into HTML for rendering in a browser. Automating this conversion eliminates repetitive tasks and ensures a smooth workflow.

---

### Getting Started: Setting up the Environment

Before writing the script. I set up my project environment using ```pipenv```. This tool is excellent for managing Python dependencies and keeping environments clean.

1. Start the virtual Environment:

    Run the following command to enter the virtual environment:
```bash
pipenv shell
```
2. Install the required library:

    Install the ```markdown``` library, which provides the functionality to convert Markdown to HTML:
```bash
pipenv install markdown
```
This automatically updates the ```Pipfile.lock``` to include the library, ensuring dependencies are tracked

---

### The Automation Script

Here is the Python script I created to perform the conversion:

```python
import markdown

# Using open() to read the Markdown file
with open('example.md', 'r') as f:
    markdown_content = f.read()

# Convert the Markdown content to HTML and store in a variable
html_content = markdown.markdown(markdown_content)

# Write the HTML to the desired file path
with open('path/to/store/mdfile/example.html', 'w') as f:
    f.write(html_content)
```

#### How it Works:

1. Read the Markdown File:

    The ```open()``` function reads the ```example.md``` file and stores its content in ```markdown_content```.

2. Convert Markdown to HTML:

    Using the ```markdown.markdown()``` function, the Markdown content is converted into an HTML string.

3. Write the HTML to a File:

    The script writes the resulting HTML into a file at the specified path ```(path/to/store/mdfile/example.html)```.

This process is straightforward, yet it can be a game-changer in projects that involve dynamic content updates or static page generation.

---

### Executing and Results

Running the script is a simple as executing:

```bash
python script_name.py # if using windows

or

python3 script_name.py # if using linux
```

Once the script runs, the converted HTML file is created in the directory path in the specified directory. You can open it in a browser to verify the results.