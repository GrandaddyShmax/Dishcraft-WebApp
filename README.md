# Dishcraft

A college project in Node JS using Express, MongoDB and API requests to Edamam & OpenAI.<br>
Description: a recipe based social media that displays nutritional value per recipe, with an additional feature of getting a custom recipe from an A.I. assistant.

<table align="center">
  <thead>
    <tr>
      <td colspan="4" align="center">Collaborators</td>
    </tr>
  </thead>
  <tbody>
    <tr align="center">
      <td><a href="https://github.com/GrandaddyShmax ">@GrandaddyShmax </a></td>
      <td><a href="https://github.com/Bjaui">@Bjaui</a></td>
      <td><a href="https://github.com/MichaelVayntrub">@MichaelVayntrub</a></td>
      <td><a href="https://github.com/ElenaChes">@ElenaChes</a></td>
    </tr>
    <tr align="center">
      <td>
        <a href="https://github.com/GrandaddyShmax"><img src="https://github.com/GrandaddyShmax.png?size=115" width=100 /></a>
      </td>
      <td>
        <a href="https://github.com/Bjaui"><img src="https://github.com/Bjaui.png?size=115" width=100 /></a>
      </td>
      <td>
        <a href="https://github.com/MichaelVayntrub"><img src="https://github.com/MichaelVayntrub.png?size=115" width=100 /></a>
      </td>
      <td>
        <a href="https://github.com/ElenaChes"><img src="https://github.com/ElenaChes.png?size=115" width=100 /></a>
      </td>
    </tr>
  </tbody>
</table>

<details>
  <summary><h3>Content</h3></summary>

- [Installation](#installation)
- [Usage](#usage)

</details>
<hr>

# Installation

1. Create a `.env` file and fill it with the following:

```
DB_URL=<MongoDB connection string>

APP_ID=<Edamam app ID>
APP_KEYS=<Edamam app keys>

APP_ID2=<Edamam app 2 ID>
APP_KEYS2=<Edamam app 2 keys>

API_KEY_LOCAL=<OpenAI key for running locally>
```

Optional:

```
OPENAI_API_KEY=<OpenAI key>
```

3. Create the following entry(/ies) in your MongoDB database under `adminList`:

```
email: <email of a user that should get "admin" permissions>
```

4. Create the following entry in your MongoDB database under `aiAccess`:

```
lib: <1 to use accessToken | 2 to use OPENAI_API_KEY | 3 to use API_KEY_LOCAL/apiKeyDeploy>
accessToken: <OpenAI access token (optional)>
disabled: <true to enable A.I. assistant | false to disable>
apiKeyDeploy:<Pawan.Krd key for running remotely>
```

5. Run `npm i`
6. Start `index.js`.

# Usage

1. Register. If your email is in the DB you'll get an admin account automatically, otherwise you'll be a Junior cook.
2. Junior cook users can:

```
- Upload recipes and browse through existing recipes.
- Get a custom recipe from an A.I. assistant.
- Rate and report exising recipes.
- View their own past uploaded recipes.
```

3. Expert cook users can:

```
- Have a custom recipe background color.
- Leave badges on recipes.
- View past A.I. generated recipes.
- Change their username.
- Suggest new ingredients.
- Get access to junior users' features.
```

4. Admin users can:

```
- See users' reports.
- Upgrade or ban users.
- Remove recipes.
- Categorise ingredients.
- Add new ingredient to the database.
- Post on the news page.
- Get access to expert users' features.
```
