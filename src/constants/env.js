const { REACT_APP_DISCORD_LINK, REACT_APP_REPO_LINK } = process.env;
const DiscordLink =
  REACT_APP_DISCORD_LINK &&
  REACT_APP_DISCORD_LINK.length > 0 &&
  REACT_APP_DISCORD_LINK;
const RepoLink =
  REACT_APP_REPO_LINK && REACT_APP_REPO_LINK.length > 0 && REACT_APP_REPO_LINK;

export { DiscordLink, RepoLink };
