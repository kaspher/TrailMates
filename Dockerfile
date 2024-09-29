FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

WORKDIR /app
COPY backend/TrailMates.Api/TrailMates.Api.csproj backend/TrailMates.Api/
COPY backend/TrailMates.Application/TrailMates.Application.csproj backend/TrailMates.Application/
COPY backend/TrailMates.Domain/TrailMates.Domain.csproj backend/TrailMates.Domain/
COPY backend/TrailMates.Infrastructure/TrailMates.Infrastructure.csproj backend/TrailMates.Infrastructure/

RUN dotnet restore backend/TrailMates.Api/TrailMates.Api.csproj
COPY . .

WORKDIR backend/TrailMates.Api
RUN dotnet build "TrailMates.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish --no-restore -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 8080
EXPOSE 8081
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrailMates.Api.dll"]