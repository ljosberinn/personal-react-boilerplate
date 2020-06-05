# Facebook

## Requirements

- Facebook account

## Steps

- go to [developers.facebook.com/apps](https://developers.facebook.com/apps/) and add a new app
- after choosing a name, add `Facebook Login` from the list of products
- choose `Web`
- enter your site url (you can change this later too)
- ignore steps about the `JS Facebook SDK`
- in the left navigation, go to `Settings > Basic`
- copy `App ID` and `App Secret` fields over to the `.env` file
- in the left navigation, go to `Facebook Login > Settings`
- add any staging/production URLs to the field `Valid OAuth Redirect URIs`
