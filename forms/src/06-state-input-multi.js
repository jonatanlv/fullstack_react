import React from "react";

const content = document.createElement("div");
document.body.appendChild(content);

class Field extends React.Component {
  handleChange = (evt) => {
    const value = evt.target.value;
    let errors;
    if (this.props.validate) {
      errors = this.props.validate(value);
    }
    this.props.onChangeHandler({ name: this.props.name, value, errors });
  };

  render() {
    return (
      <input
        placeholder={this.props.placeholder}
        name={this.props.name}
        value={this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}

module.exports = class extends React.Component {
  static displayName = "06-state-input-multi";

  state = {
    fields: {
      name: {
        default: "",
        value: "",
        placeholder: "Name",
      },
      email: {
        default: "",
        value: "",
        placeholder: "EMail",
        validate: (mail) => {
          if (mail.contains("@")) {
            return null;
          } else {
            return "EMail no válido";
          }
        },
      },
    },
    errors: {},
    people: [],
  };

  onFormSubmit = (evt) => {
    const fs = Object.assign({}, this.state.fields);

    let person = {};
    for (let p in fs) {
      if (fs.hasOwnProperty(p)) {
        person[p] = fs[p].value;
        fs[p].value = fs[p].default;
      }
    }

    const people = [...this.state.people, person];
    this.setState({
      people,
      fields: fs,
      errors: {},
    });
    evt.preventDefault();
  };

  onInputChange = (update) => {
    const name = update.name;

    const fieldInfo = Object.assign({}, this.state.fields[name]);
    fieldInfo.value = update.value;

    const updateField = {};
    updateField[name] = fieldInfo;

    const fields = Object.assign({}, this.state.fields, updateField);

    const errors = Object.assign({}, this.state.errors);
    if (update.errors) {
      errors[name] = update.errors;
    } else {
      delete errors[name];
    }
    this.setState({ errors, fields });
  };

  render() {
    const inputs = [];
    for (let p in this.state.fields) {
      if (this.state.fields.hasOwnProperty(p)) {
        console.log(p);
        const { placeholder, value } = this.state.fields[p];
        console.log(value);
        inputs.push(
          <Field
            placeholder={placeholder}
            key={p}
            name={p}
            value={value}
            onChangeHandler={this.onInputChange}
          />
        );
      }
    }
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          {inputs}

          <input type="submit" />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {this.state.people.map(({ name, email }, i) => (
              <li key={i}>
                {name} ({email})
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
};
