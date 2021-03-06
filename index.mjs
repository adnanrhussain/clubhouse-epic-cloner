#!/usr/bin/env node

// import yargs from "yargs";
// import { hideBin } from "yargs/helpers";
import yaml from "js-yaml";
import fs from "fs";
import Clubhouse from "clubhouse-lib";

// let options;
let config;
let client;
let currentUser;
let clonedStories = {};

// const getOptions = () => {
//   options = yargs(hideBin(process.argv)).option("n", {
//     alias: "name",
//     describe: "Your name",
//     type: "string",
//     demandOption: true,
//   }).argv;
//   console.log(`Options : ${JSON.stringify(options)}`);
// };

const getConfig = () => {
  const configFile = "./config.yml";
  config = yaml.load(fs.readFileSync(configFile, "utf8"));
  console.log(`Config read from "${configFile}" : ${JSON.stringify(config)}`);
};

const initializeClient = async () => {
  client = Clubhouse.create(config.token);
  await getCurrentMember();
};

const getCurrentMember = async () => {
  currentUser = await client.getCurrentMember();
  return currentUser;
};

const getEpicStories = async (epicId) => {
  return await client.listEpicStories(epicId, { includes_description: true });
};

const cloneStory = async (story) => {
  if (story.archived) {
    return;
  }

  let clonedStory = {
    description: story.description,
    epic_id: config.target_epic_template_id,
    labels: story.labels,
    name: story.name,
    project_id: story.project_id,
    requested_by_id: currentUser.id,
    story_type: story.story_type,
  };
  clonedStory = await client.createStory(clonedStory);
  clonedStories[story.id] = clonedStory.id;
  if (story.task_ids && story.task_ids.length) {
    await cloneStoryTasks(story, clonedStory);
  }
  return clonedStory;
};

const cloneStoryTasks = async (story, clonedStory) => {
  for (const task_id of story.task_ids) {
    const task = await client.getTask(story.id, task_id);
    const clonedTask = {
      description: task.description,
    };
    await client.createTask(clonedStory.id, clonedTask);
  }
};

const cloneStoryLinks = async (story) => {
  if (story.archived) {
    return false;
  }

  for (const storyLink of story.story_links) {
    if (storyLink.object_id !== story.id) {
      continue;
    }

    const cloned_story_id = clonedStories[storyLink.object_id];
    const cloned_subject_story_id = clonedStories[storyLink.subject_id];

    if (!cloned_story_id || !cloned_subject_story_id) {
      continue;
    }

    const clonedStoryLink = {
      object_id: cloned_story_id,
      verb: storyLink.verb,
      subject_id: cloned_subject_story_id,
    };
    await client.createStoryLink(clonedStoryLink);
  }
};

const cloneEpicStories = async () => {
  const stories = await getEpicStories(config.source_epic_template_id);
  for (const story of stories) {
    await cloneStory(story);
  }
  for (const story of stories) {
    await cloneStoryLinks(story);
  }
};

const main = async () => {
  // getOptions();
  getConfig();
  await initializeClient();
  await cloneEpicStories();
};

await main();
