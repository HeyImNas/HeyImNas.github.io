# CTF Writeups & Projects Blog

This repository contains my personal blog for CTF writeups, security research, and project documentation. The blog is built using Jekyll and hosted on GitHub Pages.

## Structure

```
.
├── _config.yml              # Jekyll configuration
├── _layouts/               # Layout templates
├── _hackthebox/           # HackTheBox writeups
├── _tryhackme/            # TryHackMe writeups
├── _picoctf/              # PicoCTF writeups
├── assets/                # CSS, images, and other assets
│   └── css/
│       └── style.scss     # Main stylesheet
└── index.html             # Homepage with platform dropdowns
```

## Adding New Writeups

1. Create a new markdown file in the appropriate platform directory (e.g., `_hackthebox/machine-name.md`)
2. Include the following front matter at the top of your markdown file:

```yaml
---
layout: default
title: "Machine Name - Difficulty"
date: YYYY-MM-DD
platform: Platform Name
difficulty: Easy/Medium/Hard
---
```

3. Write your writeup using markdown formatting
4. Wrap the content in a `<div class="markdown-content">` tag for proper styling

## Local Development

1. Install Ruby and Jekyll:
   ```bash
   gem install bundler jekyll
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```

4. Visit `http://localhost:4000` in your browser

## Deployment

The blog is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 