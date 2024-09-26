# Caching API in Angular

We have two main objectives :

* Cache HTTP requests to efficiently handle server requests.
* Architecture it in a scalable way to make it more flexible.
This will improve user experience and reduce server load for frequently requested data.

# Interceptor-Based Caching:

Interceptor Functionality: The HTTP interceptor in Angular allows you to intercept all outgoing HTTP requests. By leveraging this, you can inject caching logic that checks for existing cache entries before making a network call. If a cached response is found, it is returned immediately, bypassing the need for an HTTP request.
Flexible and Testable: Interceptor-based caching is highly flexible as it centralizes the caching logic, making it easier to manage and test. Since the caching logic is separated from the core application logic, it can be adjusted or extended without significant refactoring.

[Read more here](https://mohanbyte.medium.com/caching-api-requests-in-angular-better-faster-and-stronger-b3aa7c675be4)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


