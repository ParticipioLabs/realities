# Realities Front-end

The Realities front-end is a single-page React app. It fetches data from the back-end via a GraphQL API. 

## How to contribute

Before your first commit, please take some time to read up on the conventions and structure of the front-end code. It's important that we work hard to maintain consistency in the codebase so that it stays manageable as it grows.

### Bootstrapped with "Create React App"

The front-end was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). We have ejected from Create React App and started making changes, so not everything you read about Create React App with necessarily apply. However, we've left the auto-generated documentation for Create React App at the bottom of this README so that you can use it for inspiration. Do so with caution, since the information may be out of date for our project. 

### Code structure

The structure of the frontend code is inspired by an [article written by Alexis Mangin](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1). It'll allow us to keep the project organized as the codebase grows. 

The `ui/src` directory is organized into several sub-directories that contain specific things:

- `App`: This is the root component for the UI. It contains nested components that wrap every view. This includes the global ApolloProvider from react-apollo, routing for views related to Authentication, routing to different scenes (more on those below), the top navigation bar, etc.
- `components`: React components that are shared and re-used in several places throughout the code. (If a component is only used in one place, it should instead be placed in its parent component's local `components` directory).
- `scenes`: Scenes can be thought of as 'pages' or 'views' in the app. This directory contains root components for various scenes, with nested components that build up that respective scene. 
- `services`: Code modules that are used in the app, but cannot or should not be expressed as React components. 
- `styles`: This directory was mainly created to house the root .scss file for our Bootstrap styles. It also contains a module that exports color strings that we re-use throughout the app. Since we mainly do styling with [Styled Components](https://www.styled-components.com/) (more on that futher down), this directory should probably not be touched very often.

Each component has its own directory. The directory has at least one .js file with the same name as the directory (this file exports the component itself), and one index.js file that simply imports and re-exports the component. This allows us to import the component in other files without having to repeat the component name (`import ExampleComponent from './components/ExampleComponent/ExampleComponent'`) while still making it easy to search by filename in your text editor or IDE. (Note: If someone knows how to configure Webpack to automatically import a file with the same name as its directory the same way it would an index.js file, please do that!) The component directory can have a `components` directory inside it to house directories for child components. 

Take the component `ExampleComponent`: 

- The directory `ExampleComponent` has the following contents: 
  - `ExampleComponent.js` – houses the component code and exports the component.
  - `index.js` – imports and re-exports `ExampleComponent.js`.
  - `components` directory - houses component directories for components that are direct children of `ExampleComponent`.
  - `ExampleComponent.test.js` - Jest tests for the component (we don't have many of these right now, but we probably should).

### Importing with `@/`

In order to make it easier to import shared components, services, etc. throughout the code, we have defined a custom alias in Webpack that works as a shorthand for the frontend's `src` directory. You can import a shared component by doing `import ExampleComponent from '@/components/ExampleComponent'` or a shared service using `import exampleService from '@/services/exampleService'`. Anything in `src` can be imported this way. 

### Presentational vs container components

[Presentational vs container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) is a pattern that helps keep React code understandable and manageable. In a nutshell, it states that a component should either be concerned with 'how something works' or 'how something looks', but never both.

A presentational component includes html, layout and styles (in our case via [Styled Components](https://www.styled-components.com/)). It's dumb. It takes props and uses them in JSX, but it doesn't transform or do anything else fancy with those props.

A container component includes logic. It takes props and transforms them. Maybe it fetches data from an API, or uses a service or library to do fancy stuff. It doesn't include layout or styles. 

A very common pattern is to wrap a presentational component with a container component. If you find yourself writing a component that includes both presentation and logic, you should probably split it into a parent container component that transforms props, and a child presentational component that takes the transformed props and displays them to the user. [Read more...](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

### Flux (data only flows down)

[Flux](https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture) is another pattern that helps keep React apps sane when you need to manage state across many components. Simply put, it states that data only ever flows down (from parent containers to child containers). It never flows up (from children to parents). If you have child components that need to inform parent components of some sort of change, it should dispatch a mutation to a central state store (in our case that's [Apollo Client's](https://www.apollographql.com/docs/react/) cache). The parent container can then subscribe to changes to the specific part of the overall state that concerns it, and update when needed.

We manage all this with Apollo Client and [React Router](https://reacttraining.com/react-router/web/guides/quick-start). Some of the app's state is held in the database itself, such as Need and Responsibility properties (changes to that state is made through Apollo Mutations). Some state is only held in the front-end, such as whether the 'new need' form is visible or hidden (we use [Apollo's local state](https://www.apollographql.com/docs/react/essentials/local-state.html)). Finally, some state is held in the URL, such as which Need or Responsibility is currently selected (we use React Router for that).

[Read more about Flux...](https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture)

### PropTypes

Make sure each component has each of its props defined using [PropTypes](https://github.com/facebook/prop-types). If a prop is an object with specific properties, specify its shape with `PropTypes.shape({...})`. If a prop is a collection, specify it with `PropTypes.arrayOf(PropTypes.shape({...}))`.

### React Router

We use [React Router](https://reacttraining.com/react-router/web/guides/quick-start) to manage navigation and routing based on URL. 

### Apollo Client

We use [Apollo Client](https://www.apollographql.com/docs/react/) to help us fetch and mutate data via our GraphQL API. We also use it to store and mutate state that is completely held in the front-end via [local state management](https://www.apollographql.com/docs/react/essentials/local-state.html). 

Our Apollo Client is set up in a service found under `/ui/src/services/apolloClient/`. `apolloClient.js` sets up the client and `localState.js` houses our local state. 

In `apolloClient.js` we do a couple of notable things; (1) we add a logged in user's JWT as an authentication header to every request to the backend if it exists, and (2) we make sure that Apollo uses the property `nodeId` to identify objects fetched from the backend. By default, Apollo uses `id` or `_id` to normalize data in its cache, but our objects have the id property `nodeId` instead, so we use that. 

When fetching data from the back-end via Apollo, use the [Query](https://www.apollographql.com/docs/react/essentials/queries.html) component. 

When mutating data in the backend via Apollo, use the [Mutation](https://www.apollographql.com/docs/react/essentials/mutations.html) component.

Sometimes, you'll have to manually update the Apollo cache after a mutation. Apollo will try to update the cache automatically if it has all the information it needs. For example, if you send a mutation that updates the title of a need, and the mutation returns that need with both its `nodeId` and new `title` in the response, Apollo will automatically update all instances of that need in the cache with the new title. However if you create a new need, Apollo might not automatically understand that it needs to add that need to various lists in the cache. That's when you need to manually update the cache. Read more about that in the Apollo docs, or look at the `CreateNeed` component for an example. 

When manually updating the cache, you sometimes need to import the GraphQL query that was used to fetch the part of the cache you want to change. In those cases we define the query in a shared file rather than the component itself. These shared queries are found in the `queries` service. 

### Authentication with Auth0

We use [Auth0](https://auth0.com/) for authentication. When a user logs in or signs up, they are taken through a flow where Auth0 generates a [JWT](https://jwt.io/) and redirects to http://realities.theborder.and.se/auth-callback, where we get the JWT and store it in localStorage. The `AuthRoutesContainer` component handles routing for the /auth-callback route and renders the `AuthCallback` component, which in turn uses the `auth` service (under `/ui/src/services/`) to get and store the JWT.

We have a [Higher Order Component (HOC)](https://reactjs.org/docs/higher-order-components.html) named `withAuth` that can be used to provide components with props related to authentication. It provides a `login` and `logout` function, an `isLoggedIn` flag and the user's `email`. 

### CSS and Styling

Styles in Realities can come from two places. First of all, we import [Bootstrap v4's](https://getbootstrap.com/docs/4.1/getting-started/introduction/) stylesheets, which are applied globally. We use Bootstrap components via [reactstrap](http://reactstrap.github.io/). For custom styles we use [styled-components](https://www.styled-components.com/). Styled components are allowed to be defined in the file for the component in which they will be used, but can also be defined as their own shared component under `/ui/src/components/` if they will be used in several places in the app. 

These are the only two ways we apply styles in the app. We don't write our own globally applied stylesheets and we keep customizing Bootstrap's global styles to a bare minimum (if at all).

### Forms with Formik

We use [Formik](https://jaredpalmer.com/formik) to handle form state. Search the code for Formik to see examples of how Formik can be used in conjunction with Apollo mutations. 

### Downshift

We use [Downshift](https://github.com/paypal/downshift) to handle typeahead inputs. There's a shared component named TypeaheadInput you can re-use and possibly extend if you need a typeahead input that fetches suggestions from the backend. 

### Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Most of its functionality is now taken care of by `react-scripts`.

You can find some useful documentation on it [here](https://github.com/facebook/create-react-app/blob/master/packages/cra-template/template/README.md).
