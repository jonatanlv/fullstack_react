import React, { PropTypes } from "react";

const CREDITCARD = "Creditcard";
const BTC = "Bitcoin";

const Choice = ({ active, onClick, label }) => {
  const cssClasses = ["choice"];

  if (active) {
    cssClasses.push("active");
  }

  return (
    <div className={cssClasses.join(" ")} onClick={onClick}>
      {label}
    </div>
  );
};

class Switch extends React.Component {
  state = {
    payMethod: BTC,
  };

  select = (newMethod) => {
    return (evt) => this.setState({ payMethod: newMethod });
  };

  /* 
  renderChoice = (choice) => {
    const cssClasses = ["choice"];

    if (this.state.payMethod === choice) {
      cssClasses.push("active");
    }

    return (
      <div className={cssClasses.join(" ")} onClick={this.select(choice)}>
        {choice}
      </div>
    );
  }; */

  render() {
    return (
      <div className="switch">
        <Choice
          onClick={this.select(CREDITCARD)}
          active={this.state.payMethod === CREDITCARD}
          label="Pay with creditcard"
        />
        <Choice
          onClick={this.select(BTC)}
          active={this.state.payMethod === BTC}
          label="Pay with bitcoin"
        />
        Pay with {this.state.payMethod}
      </div>
    );
  }
}

export default Switch;
