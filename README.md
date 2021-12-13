# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

## Install the Following Packages by Using `npm` Before Running Locally or Deploying
Install these packages using the console:

`npm i react-whirligig` - The Whirligig component is a horizontally oriented container of Slides. 
Link: https://www.npmjs.com/package/react-whirligig

`npm i axios` - Make XMLHttpRequests from the browser
              Make http requests from node.js
              Supports the Promise API
              Intercept request and response
              Transform request and response data
              Cancel requests
              Automatic transforms for JSON data
              Client side support for protecting against XSRF
              Link: https://www.npmjs.com/package/axios

`npm i canvasjs` - CanvasJS is an easy to use JavaScript & HTML5 Charts library built on Canvas element. This allows you to create rich dashboards that work on all the devices without compromising on maintainability or functionality of your web application. CanvasJS comes with beautiful themes and is over 10x faster than conventional Flash and SVG Charts – resulting in lightweight, beautiful and responsive dashboards. 
Link: https://www.npmjs.com/package/canvasjs

`npm i canvasjs-react-charts`
Link: https://www.npmjs.com/package/canvasjs-react-charts

`npm i moment-business-days` - This is a Moment.js plugin that allows you to work with only business days (Monday to Friday). You can customize the working week, and also set custom dates for holidays to exclude them from being counted as business days, for example national holidays. 
Link: https://www.npmjs.com/package/moment-business-days

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### How to Deploy to Github Pages

Step 1: Add homepage to package.json
Open your package.json and add a homepage field for your project:
    "homepage": "https://myusername.github.io/my-app",
    
Step 2: Install gh-pages and add deploy to scripts in package.json
To publish your deployment in your repository, run the following command in your console:
  `npm install --save gh-pages`
 
Add these following scripts under "scripts" to your pacakage.json:
    "scripts": {
    
+   "predeploy": "npm run build", <- Add this
  
+   "deploy": "gh-pages -b master -d build", <- Add this

    "start": "react-scripts start", <- This should already be there
    
    "build": "react-scripts build", <- This should already be there
    
Step 3: Deploy the site by running npm run deploy
Run the following command in your console
  `npm run deploy`
  
Step 4: Ensure your project’s settings use gh-pages
Finally, make sure GitHub Pages option in your GitHub project settings is set to use the gh-pages branch:
![image](https://user-images.githubusercontent.com/48028938/143660936-23e780a2-abc5-4d2b-a9e6-0b837ea6ce9c.png)


Link to the full documentation: https://create-react-app.dev/docs/deployment/#github-pages
