to build project there is two methods.

to host site and view application instantly: 
1) visit: https://carer-51f94.firebaseapp.com
2) or take /dist folder and host using any hosting platform such as firebase, github pages, godaddy, etc.

to view localhost of site and source code
1) download Angular CLI such as visual studio code
2) download node JS
3) download npm package manager

step 1) install all of above
step 2) navigate through node js/angular command line to top level directory "carer" where this README is located
step 3) run command "ng s"
step 4) if any dependencies i.e. node modules are missing on local machine... run npm install NAMEOFMISSINGMODULE i.e. "npm install chart.js"

format of files 

/src: contains all code for application that is custom
/src/app: contains all components and shared information
/src/app/components: contains all components i.e. journal page including sub level components in each sub folder
/src/app/components/"component": contains all source code for a particular component of the app.
/src/app/shared/services: contains all services
/src/app/shared/guards: contains application guards
/src/app/shared/classes: contains all shared classes.

/src/enviroments: contains environment.ts file with firebase intialisation

further information:

if a new firebase back-end is needed
simply create a project in firebase console and replace environments.ts file with new information. app is self-creating so should function on a new database.