import React, { Component } from "react";

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((l) => l());
  };

  const subscribe = (listener) => listeners.push(listener);

  return {
    getState,
    dispatch,
    subscribe,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { messages: state.messages.concat(action.message) };
    case "DELETE_MESSAGE":
      const { messages } = state;
      return {
        messages: [
          ...messages.slice(0, action.index),
          ...messages.slice(action.index + 1, messages.length),
        ],
      };
    default:
      return state;
  }
}

const initialState = { messages: [] };
const store = createStore(reducer, initialState);

/*store.subscribe(() => {
  console.log("Current state: ", store.getState());
});*/

const addMessageAction1 = {
  type: "ADD_MESSAGE",
  message: "How does it look, Neil?",
};

store.dispatch(addMessageAction1);
store.dispatch(addMessageAction1);
store.dispatch(addMessageAction1);
store.dispatch(addMessageAction1);

const addMessageAction2 = {
  type: "ADD_MESSAGE",
  message: "Looking good",
};

store.dispatch(addMessageAction2);

class MessageView extends Component {
  handleClick = (index) => {
    return () =>
      store.dispatch({
        type: "DELETE_MESSAGE",
        index,
      });
  };

  render() {
    return (
      <div className="ui comments">
        {this.props.messages.map((msg, idx) => (
          <div className="comment" key={idx} onClick={this.handleClick(idx)}>
            {msg}
          </div>
        ))}
      </div>
    );
  }
}

class MessageCounter extends Component {
  render() {
    const count = store.getState().messages.length;
    return <div>Messages: {count}</div>;
  }
}

class MessageInput extends Component {
  state = {
    input: "",
  };

  inputHandler = (e) => {
    this.setState({ input: e.target.value });
  };

  submitHandler = (e) => {
    store.dispatch({
      type: "ADD_MESSAGE",
      message: this.state.input,
    });
    this.setState({ input: "" });
  };

  render() {
    return (
      <div className="ui input">
        <input value={this.state.input} onChange={this.inputHandler}></input>
        <button
          className="ui primary button"
          type="button"
          onClick={this.submitHandler}
        >
          Submit
        </button>
      </div>
    );
  }
}

class App extends Component {
  componentDidMount() {
    store.subscribe(() => {
      this.forceUpdate();
    });
  }
  render() {
    const { messages } = store.getState();
    return (
      <div className="ui segment">
        <MessageView messages={messages} />
        <MessageCounter />
        <MessageInput />
      </div>
    );
  }
}

export default App;
