
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}

// Fisher–Yates shuffle algorithm
function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    let rand = Math.floor(Math.random() * i);
    let temp = array[rand];
    array[rand] = array[i];
    array[i] = temp;
  }
  return array;
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    const slotState = Object.freeze({
      HIDDEN: "hidden",
      CLICKED: "clicked",
      REVEALED: "revealed"
    })
    let charArray = "ABCDEFGH".repeat(2).split("");
    charArray = charArray.map(x => [x, "hidden"])
    this.state = {
      slotArray: shuffle(charArray),
      left: false,
    };
  }

  click_hidden(id_num) {
    let temp_slots = this.state.slotArray;
    var other_idx;
    var other_state;
    for (let i = 0; i < 16; i++) {
      if (i != id_num && temp_slots[i][0] === temp_slots[id_num][0]) {
        other_idx = i;
        other_state = temp_slots[i][1];
      }
    }
    if (other_state === "clicked") {
      temp_slots[id_num][1] = "revealed";
      temp_slots[other_idx][1] = "revealed";
    }
    else if (other_state === "hidden") {
      for (let i = 0; i < temp_slots.length; i++) {
        if (temp_slots[i][1] === "clicked") {
          temp_slots[i][1] = "hidden";
        }
      }
      temp_slots[id_num][1] = "revealed";
      window.setTimeout(() => {
        this.button_time_out(id_num);
      }, 1000);
    }
    let temp_state = _.assign({}, this.state, { slotArray: temp_slots });
    this.setState(temp_state);
    // why must use bind to pass "this" to current function.
  }

  click_clicked(id_num) {
    let temp_slots = this.state.slotArray;
    temp_slots[id_num][1] = "revealed";
    window.setTimeout(() => {
      this.button_time_out(id_num);
    }, 1000);
    let temp_state = _.assign({}, this.state, { slotArray: temp_slots });
    this.setState(temp_state);
  }

  button_time_out(id_num) {
    let temp_slots = this.state.slotArray;
    temp_slots[id_num][1] = "clicked";
    let temp_state = _.assign({}, this.state, { slotArray: temp_slots });
    this.setState(temp_state);
  }

  restart(_ev) {
    let temp_slots = this.state.slotArray;
    temp_slots = shuffle(temp_slots.map(element => [element[0], "hidden"]));
    let temp_state = _.assign({}, this.state, { slotArray: temp_slots });
    this.setState(temp_state);
  }


  render() {
    let table = [];
    for (let i = 0; i < 4; i++) {
      let row = []
      for (let j = 0; j < 4; j++) {
        let id_num = i * 4 + j;
        let id_str = id_num.toString();
        row.push(this.getButton(id_num));
      }
      table.push(<div key={"row" + i} className="row">{row}</div>);
    }
    return (
      <div>
        {table}
        <div>
          <Restart_button root={this} />
        </div>
      </div>);
  }

  getButton(id_num) {
    let reveal = <div key={id_num} className="column">
      <button>
        {this.state.slotArray[id_num][0]}
      </button>
    </div>;
    let clicked = <div key={id_num} className="column">
      <button onClick={this.click_clicked.bind(this, id_num)}>
      </button>
    </div>;
    let hidden = <div key={id_num} className="column">
      <button onClick={this.click_hidden.bind(this, id_num)}></button>
    </div>;
    if (this.state.slotArray[id_num][1] === "revealed") {
      return reveal;
    }
    else if (this.state.slotArray[id_num][1] === "clicked") {
      return clicked;
    }
    else {
      return hidden;
    }
  }
}

function Restart_button(param) {
  let root = param.root;
  return (
    <div>
      <button onClick={root.restart.bind(root)}>
        Restart
        </button>
    </div>
  );
}
