cd src/AzureWebStorageExplorer/ClientApp/
npm update
cd ../../../
rm -rf ./bin/**
dotnet publish --configuration Release ./src/AzureWebStorageExplorer/AzureWebStorageExplorer.csproj -o ./bin
