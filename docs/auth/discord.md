# Discord

## Requirements

- Discord account

## Steps

- go to [discord.com/developers/applications](https://discord.com/developers/applications) and create a new application
- after choosing a name, copy `CLIENT ID` and `CLIENT SECRET` fields over to the `.env` file
- go to the `OAuth2` tab on the left
- enter `http://localhost:3000/api/v1/auth/callback/discord` as well as any staging/production URLs you might need

## PSA

If you need more profile access than just the basics, read up on how to receive access for those [here](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes).
