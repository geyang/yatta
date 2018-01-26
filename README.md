# yatta 

yatta is a cli tool that manages your paper PDFs. It is `npm` for papers.     [:rocket::beer:Share Me on HackerNews!:fire::star:](https://news.ycombinator.com/submitlink?u=https://github.com/episodeyang/yatta&t=Yatta%20|%20NPM-for-science-papers)
- **Have you ever wanted to save paper PDFs in your work folder?**
- **Have you ever had duplicates of the same PDF in different project folders?**
- **Have you ever wanted to share a list of readings with someone, except that your own PDFs all have personal notes and highlights?**

`yatta` is the tool that solves all of these problems for you. It is a package manager for links and papers. It saves a index of bibliography data in a `yatta.yml` file in your work folder, so that if you want to share those papers, you can just send someone the index, and have them do `yatta download`. 

We solve some of the annoying problems, so that you don't have to. Plus `yatta` is open source, so you can help shape the direction it goes!

[![yatta-demo.v0.11.2](./figures/demo.v0.11.2.png)](https://asciinema.org/a/158365)

## Usage

First run `npm install -g yatta`. If you don't have node on your computer, first install it from [here](https://nodejs.org/en/download/). Alternatively you can use `brew install node` on a mac.
Then, go to a folder where you want to save your readings:
```bash
mkdir my_awesome_deep_learning_project
cd my_awesome_deep_learning_project
yatta init
```
Now yatta should create a `yatta.yml` file for you. This is going to be the index file for `yatta`.

To search and download papers, do
```bash
yatta search --source arxiv "Generative Adversarial Imitation Learning"
```
and it gives the following result:
[placeholder image]

### We support the FULL arxiv search query syntax!

for example for the following query, you get:
```bash
yatta search au:bellemare ti:compress and controll
```

## Settings

you can run
```bash
yatta set dir <name of your target dir>  # this sets where you are going to save the pdf files.
yatta set search.source <google-scholar or arxiv>  # this sets the search engine to unse
yatta set search.limit <an integer>  # this sets the number of return entries to show. Pagination support will come later.
yatta set search.open <true or false>  # this sets the behavior after download: open the pdf up or not?
```

## How to find help:

There are two ways to get help: 
1. take a look at the help page of the command. You can do this by putting in:

    ```bash
    yatta --help
    # or
    yatta <command> --help
    ```
    ![./figures/help.png](./figures/help.png)
    
2. Alternatively, a quick look at the source would also be helpful: [./src/yatta.js](./src/yatta.js).

## TODOs and Plans

1. [ ] save a copy of PDF and `yatta.yml` index under your home directory `~/.yatta`.
2. [ ] sym-link or hard-link files from `~/.yatta/papers/` to your current directory.
3. [ ] Add search from `~/.yatta/yatta.ml` to the results of `yatta search`.
4. [ ] list `pdfs` in local directory
5. [ ] list `pdfs` in current index
6. [ ] add support for multiple options in current folder: 
    - download appropriate bib info for local file (arxiv id; pdf title; )
    - save linked yatta bib in global bib
    - open (from index, from local)
    - edit bib
    - edit filename
    - delete bib

