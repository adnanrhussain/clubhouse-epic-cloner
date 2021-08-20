# Clubhouse Epic Cloner

This is a light-weight nodejs tool that clones all the stores from an epic to another.

## Getting Started

### Step 1 - Clone the repo and install the dependencies
To clone the repo (more [info](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository))
`git clone https://github.com/adnanrhussain/clubhouse-epic-cloner.git`

Install the dependencies
```
cd clubhouse-epic-cloner
cd clubhouse-lib
npm install
npm run build
cd ..
npm install
```

### Step 2 - Create the `config.yml`
Create a new `config.yml` with the following structure
```
token: <CLUBHOUSE_API_TOKEN>
source_epic_template_id: <SOURCE_EPIC_ID>
target_epic_template_id: <TARGET_EPIC_ID>
```

#### Get the Clubhouse API Token
The Clubhouse API uses token-based authentication, you will need one to use this library. To generate an API token, go to https://app.clubhouse.io/settings/account/api-tokens. Don't forget to save this token somewhere safe and private since Clubhouse won't show you the token again.

#### Get the Epic IDs
There are a couple of different ways to get the Epic ID
1. From the URL - Navigate to the Epic page. You will find the Epic ID after the `epic` slug (eg: `https://app.clubhouse.io/<APP_NAME>/epic/<EPIC_ID>/`)
2. From the info section - Navigate to the Epic page. On the top-right section of the page, you will find the info related to the Epic, with the Epic ID right on the top

### Step 3 - Run the tool
Just run `./index.mjs` on the terminal


## Wait! Why is the clubhouse-lib part of the codebase?
The library contains updates which are not yet part of source [clubhouse-lib](https://github.com/useshortcut/clubhouse-lib) repo. Once the open pull-requests (eg: [PR#110](https://github.com/useshortcut/clubhouse-lib/pull/110) are merged, this will be removed and the library will point back to the official dist
