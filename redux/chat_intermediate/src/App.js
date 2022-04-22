import React from "react";
import { createStore, combineReducers } from "redux";
import uuid from "uuid";

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

function activeThreadIdReducer(state = "1-fc21", action) {
  if (action.type === "OPEN_THREAD") {
    return action.newActiveThreadId;
  } else {
    return state;
  }
}

function messagesReducer(state = [], action) {
  if (action.type === "ADD_MESSAGE") {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    };
    return state.concat(newMessage);
  } else if (action.type === "DELETE_MESSAGE") {
    return state.filter((m) => m.id !== action.id);
  } else {
    return state;
  }
}

function findActiveThread(state, action) {
  switch (action.type) {
    case "ADD_MESSAGE":
      return state.find((t) => t.id === action.threadId);
    case "DELETE_MESSAGE":
      return state.find((t) => t.messages.find((m) => m.id === action.id));
    default:
      return null;
  }
}

function threadsReducer(
  state = [
    {
      id: "1-fc21",
      title: "Buzz Aldrin",
      messages: messagesReducer(undefined, {}),
    },
    {
      id: "2-be94",
      title: "Jónatan Lara",
      messages: messagesReducer(undefined, {}),
    },
  ],
  action
) {
  switch (action.type) {
    case "ADD_MESSAGE":
    case "DELETE_MESSAGE":
      const activeThread = findActiveThread(state, action);
      const newThread = {
        ...activeThread,
        messages: messagesReducer(activeThread.messages, action),
      };

      return state.map((t) => {
        if (t !== activeThread) return t;
        return newThread;
      });
    default:
      return state;
  }
}

const store = createStore(reducer);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const { activeThreadId, threads } = store.getState();
    const activeThread = threads.find((t) => t.id === activeThreadId);

    const tabs = threads.map((t) => ({
      id: t.id,
      title: t.title,
      active: t.id === activeThreadId,
    }));

    return (
      <div className="ui segment">
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class ThreadTabs extends React.Component {
  handleTabClick = (id) => {
    store.dispatch({
      type: "OPEN_THREAD",
      newActiveThreadId: id,
    });
  };

  render() {
    const tabs = this.props.tabs.map((tab, index) => (
      <div
        key={index}
        className={`item ${tab.active ? "active" : ""}`}
        onClick={() => this.handleTabClick(tab.id)}
      >
        {tab.title}
      </div>
    ));
    return <div className="ui top attached tabular menu">{tabs}</div>;
  }
}

class MessageInput extends React.Component {
  state = {
    value: "",
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = () => {
    store.dispatch({
      type: "ADD_MESSAGE",
      text: this.state.value,
      threadId: this.props.threadId,
    });
    this.setState({
      value: "",
    });
  };

  render() {
    return (
      <div className="ui input">
        <input onChange={this.onChange} value={this.state.value} type="text" />
        <button
          onClick={this.handleSubmit}
          className="ui primary button"
          type="submit"
        >
          Submit
        </button>
      </div>
    );
  }
}

class Thread extends React.Component {
  handleClick = (id, threadId) => {
    store.dispatch({
      type: "DELETE_MESSAGE",
      id,
    });
  };

  render() {
    const messages = this.props.thread.messages.map((message) => (
      <div
        className="comment"
        key={message.id}
        onClick={() => this.handleClick(message.id, this.props.thread.id)}
      >
        <div className="text">
          {message.text}
          <span className="metadata">@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className="ui center aligned basic segment">
        <div className="ui comments">{messages}</div>
        <MessageInput threadId={this.props.thread.id} />
      </div>
    );
  }
}

export default App;
