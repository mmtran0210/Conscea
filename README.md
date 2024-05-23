# Introduction 
URL of the project can be found at - https://yellow-dune-03857d40f.5.azurestaticapps.net/

# Getting Started
In order to build the project you first have to install
- ASP.NET Core 8.0
- npm

Running Web API
Config settings are loaded from the environment variables. To automatically load the environment variable from a file, create a .env file in the ConsceaAPI parent folder.

Connect to Azure SQL Db
Set the CONNECTION_STRING environment variable.

CONNECTION_STRING="..."

Set the AVATAR_CONTAINER_NAME environment variable.

AVATAR_CONTAINER_NAME="avatars"

Set the STORAGE_CONNECTION_STRING

STORAGE_CONNECTION_STRING="..."

Set the Service SERVICE_BUS_CONNECTION_STRING

SERVICE_BUS_CONNECTION_STRING="..."

cd ConsceaAPI/ConsceaAPI

dotnet run

Running SPA

Also create a .env file in the ConsceaSPA folder

Set the API base url by adding the following (change the port accordingly)

VITE_API_URL=https://localhost:7171/api

cd ConsceaSPA

npm install

npm run dev

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)