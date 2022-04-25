import React, { useState } from "react";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import uuid from "uuid";

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

const actionFactory = (type, ...argNames) => {
  return (...argValues) => {
    const result = { type };
    for (let i = 0; i < argNames.length; i++) {
      result[argNames[i]] = argValues[i];
    }
    return result;
  };
};

const openThread = actionFactory("OPEN_THREAD", "newActiveThreadId");
const addMessage = actionFactory("ADD_MESSAGE", "text", "threadId");
const deleteMessage = actionFactory("DELETE_MESSAGE", "id");

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
  render() {
    return (
      <div className="ui segment">
        <ThreadTabs />
        <ThreadDisplay />
      </div>
    );
  }
}

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const mapStateToTabsProps = ({ activeThreadId, threads }) => {
  const tabs = threads.map((t) => ({
    id: t.id,
    title: t.title,
    active: t.id === activeThreadId,
    messageCount: t.messages.length,
  }));

  return { tabs };
};

const mapDispatchToTabsProps = (dispatch) => ({
  tabClickHandler: (id) => dispatch(openThread(id)),
});

const Tabs = ({ tabs, tabClickHandler }) => (
  <div className="ui top attached tabular menu">
    {tabs.map((tab, index) => (
      <div
        key={index}
        className={`item ${tab.active ? "active" : ""}`}
        onClick={() => tabClickHandler(tab.id)}
      >
        {tab.title}
        <div className="ui horizontal label">{tab.messageCount}</div>
      </div>
    ))}
  </div>
);

const ThreadTabs = connect(mapStateToTabsProps, mapDispatchToTabsProps)(Tabs);

const TextFieldInput = ({ onInputHandler, buttonText = "Submit" }) => {
  const [fieldValue, setFieldValue] = useState("");

  return (
    <div className="ui input">
      <input
        onChange={(e) => setFieldValue(e.target.value)}
        value={fieldValue}
        type="text"
      />
      <button
        onClick={() => {
          onInputHandler(fieldValue);
          setFieldValue("");
        }}
        className="ui primary button"
        type="submit"
      >
        {buttonText}
      </button>
    </div>
  );
};

const mapStateToThreadProps = (state) => {
  const { activeThreadId, threads } = state;
  const thread = threads.find((t) => t.id === activeThreadId);
  return {
    thread,
  };
};

const mapDispatchToThreadProps = (dispatch) => {
  return {
    onMessageClickHandler: (id) => {
      dispatch(deleteMessage(id));
    },
    dispatch,
  };
};

const mergeThreadProps = (stateProps, dispatchProps) => {
  return {
    ...stateProps,
    onMessageClickHandler: dispatchProps.onMessageClickHandler,
    newMessageHandler: (text) => {
      dispatchProps.dispatch(addMessage(text, stateProps.thread.id));
    },
  };
};

const Thread = ({ thread, onMessageClickHandler, newMessageHandler }) => {
  return (
    <div className="ui center aligned basic segment">
      <MessageList
        messages={thread.messages}
        onMessageClickHandler={onMessageClickHandler}
      />
      <TextFieldInput
        onInputHandler={newMessageHandler}
        buttonText="Add message"
      />
    </div>
  );
};

const ThreadDisplay = connect(
  mapStateToThreadProps,
  mapDispatchToThreadProps,
  mergeThreadProps
)(Thread);

const MessageList = ({ messages, onMessageClickHandler }) => {
  return (
    <div className="ui comments">
      {messages.map((message) => (
        <div
          className="comment"
          key={message.id}
          onClick={() => onMessageClickHandler(message.id)}
        >
          <div className="text">
            {message.text}
            <span className="metadata">@{message.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WrappedApp;
