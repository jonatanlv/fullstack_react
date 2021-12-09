class TimersDashboard extends React.Component {
  state = {
    timers: [],
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateTimer(attrs);
  };

  handleDeleteTimer = (id) => {
    this.deleteTimer(id);
  };

  updateTimer = (attrs) => {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project,
          });
        }
        return timer;
      }),
    });

    client.updateTimer(attrs);
  };

  createTimer = (timer) => {
    const t = helpers.newTimer(timer);

    this.setState({
      timers: this.state.timers.concat([t]),
    });

    client.createTimer(t);
  };

  deleteTimer = (id) => {
    this.setState({
      timers: this.state.timers.filter((timer) => timer.id !== id),
    });

    client.deleteTimer({ id });
  };

  handleStopTimer = (id) => {
    console.log("Stopping " + id);
    this.stopTimer(id);
  };

  stopTimer = (id) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id !== id) return timer;
        const newElapsed = timer.elapsed + (now - timer.runningSince);
        return Object.assign({}, timer, {
          runningSince: null,
          elapsed: newElapsed,
        });
      }),
    });

    client.stopTimer({ id: id, stop: now });
  };

  handleStartTimer = (id) => {
    console.log("Starting " + id);
    this.startTimer(id);
  };

  startTimer = (id) => {
    const now = Date.now();
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id !== id) return timer;
        return Object.assign({}, timer, {
          runningSince: now,
        });
      }),
    });

    client.startTimer({ id: id, start: now });
  };

  componentDidMount() {
    this.loadTimersFromServer();
    setInterval(this.loadTimersFromServer, 5000);
  }

  loadTimersFromServer = () => {
    client.getTimers((serverTimers) => this.setState({ timers: serverTimers }));
  };

  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTimerDelete={this.handleDeleteTimer}
            onStartTimer={this.handleStartTimer}
            onStopTimer={this.handleStopTimer}
          />
          <ToggleableTimerForm
            isOpen={true}
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTimerDelete={this.props.onTimerDelete}
        onStartTimer={this.props.onStartTimer}
        onStopTimer={this.props.onStopTimer}
      />
    ));

    return <div id="timers">{timers}</div>;
  }
}

class EditableTimer extends React.Component {
  state = {
    editFormOpen: false,
  };

  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.closeForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleEditClick = () => {
    this.openForm();
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  render() {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Timer
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
          onEditClick={this.handleEditClick}
          onTimerDelete={this.props.onTimerDelete}
          onStartTimer={this.props.onStartTimer}
          onStopTimer={this.props.onStopTimer}
        />
      );
    }
  }
}

class TimerForm extends React.Component {
  state = {
    title: this.props.title || "",
    project: this.props.project || "",
  };

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };
  handleProjectChange = (e) => {
    this.setState({ project: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project,
    });
  };

  render() {
    const submitText = this.props.id ? "Update" : "Create";
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                value={this.state.title}
                onChange={this.handleTitleChange}
              />
            </div>
            <div className="field">
              <label>Project</label>
              <input
                type="text"
                value={this.state.project}
                onChange={this.handleProjectChange}
              />
            </div>
            <div className="ui two bottom attached buttons">
              <button
                className="ui basic blue button"
                onClick={this.handleSubmit}
              >
                {submitText}
              </button>
              <button
                className="ui basic red button"
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {
  state = {
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <TimerForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    }
    return (
      <div className="ui basic content center aligned segment">
        <button className="ui basic button icon" onClick={this.handleFormOpen}>
          <i className="plus icon" />
        </button>
      </div>
    );
  }
}

class Timer extends React.Component {
  handleTrashClick = () => {
    this.props.onTimerDelete(this.props.id);
  };

  componentDidMount() {
    this.forceUpdateInterval = setInterval(this.forceUpdate.bind(this), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleStopTimer = () => {
    this.props.onStopTimer(this.props.id);
  };

  handleStartTimer = () => {
    this.props.onStartTimer(this.props.id);
  };

  render() {
    const elapsedString = helpers.renderElapsedString(
      this.props.elapsed,
      this.props.runningSince
    );
    return (
      <div className="ui centered card">
        <div className="content">
          <div className="header">{this.props.title}</div>
          <div className="meta">{this.props.project}</div>
          <div className="center aligned description">
            <h2>{elapsedString}</h2>
          </div>
          <div className="extra content">
            <span
              className="right floated edit icon"
              onClick={this.props.onEditClick}
            >
              <i className="edit icon" />
            </span>
            <span
              className="right floated trash icon"
              onClick={this.handleTrashClick}
            >
              <i className="trash icon" />
            </span>
          </div>
        </div>
        <TimerActionButton
          running={!!this.props.runningSince}
          onStartClick={this.handleStartTimer}
          onStopClick={this.handleStopTimer}
        />
      </div>
    );
  }
}

class TimerActionButton extends React.Component {
  render() {
    if (this.props.running) {
      return (
        <div
          className="ui bottom attached red button"
          onClick={this.props.onStopClick}
        >
          Stop
        </div>
      );
    } else {
      return (
        <div
          className="ui bottom attached blue basic button"
          onClick={this.props.onStartClick}
        >
          Start
        </div>
      );
    }
  }
}

ReactDOM.render(<TimersDashboard />, document.getElementById("content"));
