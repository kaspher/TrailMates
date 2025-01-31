FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Development
WORKDIR /src
COPY ["TrailMates.Api/TrailMates.Api.csproj", "TrailMates.Api/"]
COPY ["TrailMates.Application/TrailMates.Application.csproj", "TrailMates.Application/"]
COPY ["TrailMates.Domain/TrailMates.Domain.csproj", "TrailMates.Domain/"]
COPY ["TrailMates.Infrastructure/TrailMates.Infrastructure.csproj", "TrailMates.Infrastructure/"]

RUN dotnet restore "TrailMates.Api/TrailMates.Api.csproj"
COPY . .

WORKDIR "/src/TrailMates.Api"
RUN dotnet build "TrailMates.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Development
RUN dotnet publish "TrailMates.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrailMates.Api.dll"]
