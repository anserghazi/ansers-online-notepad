import React from 'react';
import axios from 'axios';

import './App.css';

import { FaTrash } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';


class App extends React.Component {


  state = {
    title: '',
    body: '',
    posts: []
  };

  componentDidMount = () => {
    this.getBlogPost();
  }

  getBlogPost = () => {
    axios.get('/api')
      .then((response) => {
        const data = response.data;
        this.setState({ posts: data });
        console.log('Data has been recieved.');
      })
      .catch(() => {
        alert('Error retrieving data.');
      });
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value});
  };


  submit = (event) => {

    var y = document.getElementById("bodyInput").value;

    if (y === "") {
      alert("Fill the body before submitting your post.");
      return false;
    } 

    event.preventDefault();

    const payload = {
      title: this.state.title,
      body: this.state.body,
      date: Date(Date.now()).substring(4,21)
    };

    

    axios({
      url: '/api/save',
      method: 'POST',
      data: payload
    })
      .then(() => {
        console.log('Data has been sent to the server');
        this.resetUserInput();
        this.getBlogPost();
      })
      .catch(() => {
        console.log('Internal server error');
      });
  };

  resetUserInput = () => {
    this.setState({
      title: '',
      body: ''
    });
  };

  displayBlogPost = (posts) => {
    if (!posts.length) {
      return null;
    };

    var reverse = posts.reverse();

    return reverse.map((post) => {
      return <div className="blogPost">
              <div key={post._id}>
                <h2 className="postTitle">{post.title}</h2>
                <p className="date">{post.date}</p>
                <p>{post.body}</p>
                <a className="trashIcon" href="/#" onClick={() => this.delete(post._id)}>
                  <FaTrash size={28} />
                </a>
                <a className="copyIcon" href="/#" onClick={this.copy}>
                  <FaCopy size={28} />
                </a>
                <a className="editIcon" href="/#" onClick={() => this.update(post._id)}>
                  <FaEdit size={28} />
                </a>
              </div>
            </div>
    });
  };

  copy = (event) => {
    event.preventDefault();
    event.persist();
    var noteContent = event.currentTarget.parentNode.children[0].textContent + "\n" + event.currentTarget.parentNode.children[2].textContent + "\n" + event.currentTarget.parentNode.children[1].textContent;
    var hiddenText = document.createElement("textarea");
    document.body.appendChild(hiddenText);
    hiddenText.value = noteContent;
    hiddenText.select();
    document.execCommand("copy");
    window.alert("Text copied to clipboard!\n\n" + hiddenText.value);
    document.body.removeChild(hiddenText);
  }

  delete(id) {
    var confirmed = window.confirm("Are you sure you want to delete this post?")

    if (confirmed === true) {
      axios.delete('/api/' + id)
      this.getBlogPost();
    }
  }

  update(id) {
    var prompt = window.prompt("Please update the note body.");

    if (prompt != null) {

      var currentDate = Date(Date.now()).substring(4,21);

      const payload = {
        body: prompt,
        date: "(Edited)  " + currentDate 
      };


      axios({
        url: '/api/update/' + id,
        method: 'PUT',
        data: payload
      })
        .then(() => {
          console.log('Data has been sent to the server');
          this.resetUserInput();
          this.getBlogPost();
        })
        .catch(() => {
          console.log('Internal server error');
        });
    }
  }

   
  render () {
    

    console.log('State: ', this.state);

    // JSX 

    return(
      <div className="app">
        <div className="sidebar">
          <a href="_blank" className="titleRefresh" style={{ textDecoration: 'none' }}>
            <h1>Anser's Online Notepad</h1>
          </a>
          <form onSubmit={this.submit}>
            <div>
              <input 
                id="titleInput"
                className="titleInput"
                autoComplete="off"
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleChange}
                placeholder="Title (optional)"
              />
            </div>
            <div>
              <textarea
                id="bodyInput"
                className="bodyInput"
                name="body"
                cols="30"
                rows="10"
                value={this.state.body}
                onChange={this.handleChange}
                placeholder="Body"
              >
              </textarea>
            </div>
            <button className="submit">Submit</button>
          </form>
        </div>
        <div className="postArea">
          {this.displayBlogPost(this.state.posts)}
        </div>  
      </div>
    );
  }
}

export default App;