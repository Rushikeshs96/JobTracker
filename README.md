# JobTracker

//migration 
 ```
dotnet ef migrations add InitialCreate --project JobTracker.Infrastructure --startup-project JobTracker.Api
 ```
//database update

```
dotnet ef database update --project JobTracker.Infrastructure --startup-project JobTracker.Api

```