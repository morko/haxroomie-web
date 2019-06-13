# Haxroomie web

Web client for haxroomie to run haxball rooms without desktop environment and control it with through a website.

# Installation

To install the project for your server you will need [Node.js 10.15.1](https://nodejs.org/en/) (or newer) and [Git](https://git-scm.com/) installed.

First download the project using [Git](https://git-scm.com/).
```
git clone https://www.github.com/morko/haxroomie-web
```
This will create a haxroomie-web directory in your current folder.

Then install the project dependencies using node package manager that gets installed with [Node.js](https://nodejs.org/en/).
```
cd haxroomie-web
npm install
```

Edit the configuration file `config.js` in the project root directory. The file contains explanations for the settings.

After you are happy with the configuration you can create users for the application using the `user.js` script. Every user gets one room to control which is running in the headless browsers tab.

```
node user.js add [name] [password]
```

Haxroomie web is a Node.js express application. You can either just change the port to 80 or setup a reverse proxy with some web server like nginx or Apache to the local port where haxroomie is running.

## Example reverse proxy configuration for nginx

This is an example of a reverse proxy configuration for nginx. Change server_name to your domain name (or ip) and path to where you want the application to be accessed from. The port part (after colon) must match what you have setup the server port to be in `config.js`. The file should go under the `sites-available` directory under the nginx configuration directory (usually `/etc/nginx/sites-available`) and enabled by linking the file to the sites-enabled directory.

```
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

Example:

```
server {
    server_name salamini.tk/haxroomie;
    listen 80;
    server_tokens off;

    location / {
        proxy_pass http://localhost:3055;
    }
}
```

## Troubleshooting

If the application does not lauch at first you are probably missing some dependencies for the chrome haxroomie runs in the background. Common dependencies are listed in [haxroomie readme](https://github.com/morko/haxroomie#troubleshooting). If you run into more problems, check out [[puppeteer troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md). They have information about running the headless chrome in different service providers.

# Usage

Once you have your config done you can navigate to your hosts URL and start opening rooms remotely. Every user gets a new tab in the headless browser that haxroomie is running in the background. This means there is one controllable room per account. Users can connect with the same account on multiple different machines/browsers.

## Account creation/removal/updating

Accounts can be added, removed and updated with the `user.js` script located in the project root folder. Run it with
```
node user.js --help
```
to see available commands.