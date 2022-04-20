import React from "react";
import { createStore } from "redux";
import uuid from "uuid";

function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    };

    const activeThread = state.threads.find((t) => t.id === action.threadId);
    const newThread = {
      ...activeThread,
      messages: activeThread.messages.concat(newMessage),
    };

    return {
      ...state,
      threads: state.threads.map((t) => {
        if (t.id !== action.threadId) return t;
        return newThread;
      }),
    };
  } else if (action.type === "DELETE_MESSAGE") {
    const activeThread = state.threads.find((t) =>
      t.messages.find((m) => m.id === action.id)
    );
    const newThread = {
      ...activeThread,
      messages: activeThread.messages.filter((m) => m.id !== action.id),
    };
    return {
      ...state,
      threads: state.threads.map((t) => {
        if (t !== activeThread) return t;
        return newThread;
      }),
    };
  } else if (action.type === "OPEN_THREAD") {
    return { ...state, activeThreadId: action.newActiveThreadId };
  } else {
    return state;
  }
}

const initialState = {
  activeThreadId: "1-fc21",
  threads: [
    {
      id: "1-fc21",
      title: "Buzz Aldrin",
      messages: [
        {
          text: "12 minutes to ignition",
          timestamp: Date.now(),
          id: uuid.v4(),
        },
      ],
    },
    {
      id: "2-be94",
      title: "Jónatan Lara",
      messages: [],
    },
  ],
};

const store = createStore(reducer, initialState);

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
