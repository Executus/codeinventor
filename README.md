# Code Inventor

This is a Computer Science Masters thesis by Ashley Muller from the University of New England. 

## Thesis title: 
Transitioning from Visual to Textual Programming in a Game Building Framework

## Abstract:
With the rise of blocks-based programming languages, a lot of research has been focused on the benefits they provide to children in teaching Computer Science concepts. As these languages and tools make their way into school curriculums, researchers have found that many students struggle with the unstructured environment of textual languages after being accustomed to blocks-based languages. This thesis contributes to the research area of transitioning from visual to textual languages by introducing Code Inventor, a game building framework designed to help secondary school students make this transition. Within the context of addressing semantic learning issues, Code Inventor teaches Object-Oriented Programming concepts through its UI design and the architecture of the games that are created. The thesis analyses a usability test which was conducted with secondary school students and presents interviews that were conducted with secondary school teachers.

## Prerequisites
* Node.js 10.11.0
* Angular 7.1.1
* PostgreSQL 10

## Build Instructions
* Build the database
  * Run sql/create_tables.sql
  * Run sql/insert_data.sql
  * Run sql/create_functions.sql
* Configure environment variables as per api/config.js file
  * PGHOST - database host name
  * PGPORT - database port
  * PGUSER - database user name
  * PGPASSWORD - database password
  * PGDATABASE - database name
  * BASE_FILE_DIR - directory for temporary files to be created. These files are served to the client so web server changes might be needed. Should be under api folder. 
* Run the Node.js API
  * cd api
  * npm install
  * node app.js
* Build the Angular app
  * npm install
  * ng build --prod
