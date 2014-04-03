# cgForm - Directives for rendering HTML standard forms and survey forms  from a  Json Schema.

***

[![Build Status](https://travis-ci.org/cghr/cgForm.png?branch=master)](https://travis-ci.org/cghr/cgForm)

## Demo

Coming Soon

## Installation

Download all the dependencies and include it in your project.

```javascript
angular.module('myModule', ['cgForm']);
```

Project files are also available through your favourite package manager:

**Bower**: `bower install cg-form


## Supported browsers

Directives from this repository are automatically tested with the following browsers:

* Chrome (stable and canary channel)

Modern mobile browsers should work without problems.



## Project philosophy



### Customizability



### Take what you need and not more



### Quality and stability


## Support

Project's issue on GitHub should be used discuss bugs and features.


### Development
#### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g grunt-cli karma`
* Install local dev dependencies: `npm install` while current directory is bootstrap repo

#### Build
* Build the whole project: `grunt` - this will run `lint`, `test`, and `concat` targets


Check the Grunt build file for other tasks that are defined for this project.

#### TDD
* Run test: `grunt watch`
 
This will start Karma server and will continuously watch files in the project, executing tests upon every change.


### Release
* Bump up version number in `package.json`
* Commit the version change with the following message: `chore(release): [version number]`
* tag
* push changes and a tag (`git push --tags`)
* switch to the `gh-pages` branch: `git checkout gh-pages`
* copy content of the dist folder to the main folder
* Commit the version change with the following message: `chore(release): [version number]`
* push changes
* switch back to the `main branch` and modify `package.json` to bump up version for the next iteration
* commit (`chore(release): starting [version number]`) and push
* publish Bower

Well done! (If you don't like repeating yourself open a PR with a grunt task taking care of the above!)
