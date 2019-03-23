import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { fetchListingAction, SUCCESS, FAILED, IN_PROGRESS, createReducer } from "redux-blackbox";
import {connect, Provider} from "react-redux";

// setup reducer
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import ReduxThunk from "redux-thunk";

const rootReducer = {
  users: createReducer("users"),
}

const store = createStore(combineReducers(rootReducer), compose(applyMiddleware(ReduxThunk)));


// setup action and service
const fetchUsers = () =>{
  return axios.get("https://jsonplaceholder.typicode.com/users")
}

export const fetchUsersAction = () => {
  return async (dispatch) =>{
    return await fetchListingAction("users", dispatch, fetchUsers);
  }
}

// setup component

class ListUsers extends React.Component {
  componentDidMount() {
    this.props.fetchUsersAction();
  }
  render() {
    const {users} = this.props;
    if (users.uiState === IN_PROGRESS) {
      return <div>Loading...</div>
    }
    if (users.uiState === FAILED) {
      return <div className="notification is-danger">{users.error.message}</div>
    }
    if (users.uiState === SUCCESS) {
      if (users.listing.length) {
        return (
          <div>
            <ul>
              { users.listing.map(user =>{
                  return <li>{user.name}</li>
                }) 
              }
            </ul>
          </div>
        )
      } else {
        return <div>Users list is empty</div>
      }
    }
    return null;
  }
}


const mapStateToProps = (state) =>{
  return {
    users: state.users
  }
}

const mapDispatchToProps = {
  fetchUsersAction
}

const ListUsersApp = connect(mapStateToProps, mapDispatchToProps)(ListUsers);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <ListUsersApp />
        </header>
      </div>
      </Provider>
    );
  }
}

export default App;
