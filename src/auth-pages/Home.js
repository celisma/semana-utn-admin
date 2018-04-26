import React, { Component } from 'react';
import '../App.css';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

import NewtalkForm from '../components/NewtalkForm';
import TalksTable from '../components/TalksTable';
import UpdatetalkForm from '../components/UpdatetalkForm';

import withAuthorization from '../withAuthorization';
import { db } from '../firebase';
import { firebaseApp } from '../firebase/firebase';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NewtalkFormVisible: false,
      UpdatetalkFormVisible: false,
      talksVisible: true,
      talkToUpdate: '',

      users: null,
    };
    let handleToUpdate = this.handleToUpdate.bind(this);
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState(() => ({ users: snapshot.val() }))
    );
  }

  hideOrShowNewtalkForm() {
    this.setState({NewtalkFormVisible: !this.state.NewtalkFormVisible});
  }

  hideOrShowUpdatetalkForm() {
    this.setState({UpdatetalkFormVisible: !this.state.UpdatetalkFormVisible});
  }

  handleToUpdate(talk) {
    this.hideOrShowUpdatetalkForm();
    this.setState({
      talkToUpdate: talk,
    });
  }

  deleteTalks() {
    firebaseApp.database().ref('talks').set(null);
  }

  setTalks() {
    const data = require('../firebase/datos.json')
    firebaseApp.database().ref().child('talks').set(data.talks)
  }

  hideOrShowTalks() {
    this.setState({talksVisible: !this.state.talksVisible});
  }

  render() {
    const { users } = this.state;

    let handleToUpdate = this.handleToUpdate;
    let hideOrShowUpdatetalkForm = this.hideOrShowUpdatetalkForm;
    return(
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>


        <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title"> Semana de la UTN - Admin </h1>
            </header>

            <div className="panel">
              <a onClick={() => this.deleteTalks()}
                 style={{cursor: 'pointer', color: 'blue', marginLeft: 40}}>
                 Borrar charlas
              </a>
              <a onClick={() => this.setTalks()}
                 style={{cursor: 'pointer', color: 'blue', marginLeft: 40}}>
                 Reestablecer charlas
              </a>
              <a onClick={() => this.hideOrShowTalks()}
                 style={{cursor: 'pointer', color: 'blue', marginLeft: 40}}>
                 { this.state.talksVisible ? 'Ocultar charlas' : 'Mostrar charlas' }
              </a>
              <a onClick={() => {}}
                 style={{cursor: 'pointer', color: 'blue', marginLeft: 40}}>
                 Crear Aula
              </a>
              <a onClick={this.hideOrShowNewtalkForm.bind(this)}
                 style={{cursor: 'pointer', color: 'blue', marginLeft: 40}}>
                { this.state.NewtalkFormVisible ? 'Ocultar Formulario' : 'Nueva charla' }
              </a>
            </div>

            { this.state.NewtalkFormVisible ? <NewtalkForm/> : <div /> }

            { this.state.UpdatetalkFormVisible ?
              <UpdatetalkForm talk={this.state.talkToUpdate}
                              hideOrShowUpdatetalkForm={this.hideOrShowUpdatetalkForm.bind(this)} /> :
              <div /> }

            { (this.state.talksVisible) ?
                <TalksTable {...this.props} handleToUpdate={this.handleToUpdate.bind(this)} /> :
                <div /> }

          </div>


        { !!users && <UserList users={users} /> }
      </div>
    );
  }
}

const UserList = ({ users }) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>

    {Object.keys(users).map(key =>
      <div key={key}>{users[key].username}</div>
    )}
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);
