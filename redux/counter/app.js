function reducer(state, action) {
  if (action.type === "INCREMENT") {
    return state + action.amount;
  } else if (action.type === "DECREMENT") {
    return state - action.amount;
  } else {
    return state;
  }
}

let incrementAction = { type: "INCREMENT", amount: 5 };
console.log(reducer(0, incrementAction));
console.log(reducer(1, incrementAction));
console.log(reducer(5, incrementAction));

let unknownAction = { type: "UNKNOWN" };
console.log(reducer(5, unknownAction));
console.log(reducer(8, unknownAction));

let decrementAction = { type: "DECREMENT", amount: 3 };
console.log(reducer(0, decrementAction));
console.log(reducer(1, decrementAction));
console.log(reducer(5, decrementAction));

function createStore(reducer) {
  let state = 0;
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
  };

  return { getState, dispatch };
}

console.clear();
const store = createStore(reducer);

incrementAction = { type: "INCREMENT", amount: 3 };
decrementAction = { type: "DECREMENT", amount: 3 };

console.log(store.getState());
store.dispatch(incrementAction);
console.log(store.getState());
store.dispatch(incrementAction);
console.log(store.getState());
store.dispatch(incrementAction);
console.log(store.getState());
store.dispatch(decrementAction);
console.log(store.getState());
store.dispatch(decrementAction);
console.log(store.getState());
store.dispatch(decrementAction);
console.log(store.getState());
