# Who Did Git?
Figure out who the made that unknown commit!

## This sucks

![Screenshot of commit with unknown author](public/screenshot.png)

## So, what is this?

A very simple node.js server that uses the GitHub API to get author information about a specific commit.

## Example

```shell
curl "http://whodidgit.herokuapp.com?owner=shakeelmohamed&repo=whodidgit&sha=1bd2afcab1"
```

The above will return something like:

```json
GitHub gave us the following information about the author of that commit:
{
    "name": "unknown",
    "email": "shakeel@laptop.local",
    "date": "2015-02-07T22:10:10Z"
}

59 of 60 requests remaining this hour.
```

I think Shakeel needs a lesson in git...

## How did that happen?

Git will default your email address to be <local_system_user_name>@<system_name>.local

## How can I prevent this from happening?

Run the following commands when you setup git on a new machine:

```shell
git config --global user.name "Your Name"
git config --global user.name "Your@email.com" # Preferably your GitHub email address
```