import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import IntPage from "./View/IntPage";
import MainPage from "./View/MainPage";
import NavBar from "./Components/NavBar";
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client'


const client = new ApolloClient({
    uri: 'http://127.0.0.1:51423/graphql',
    cache: new InMemoryCache({
        typePolicies: {
          Query: {
              fields: {
                  koreaTodayData: {
                      merge(existing, incoming) {
                        return { ...existing, ...incoming };
                      }
                  }
              }
          }
        }
      })
  });

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <NavBar />
                <Route exact path="/" component={MainPage} />
                <Route exact path="/world" component={IntPage} />
            </Router>
        </ApolloProvider>
    );
};

export default App;