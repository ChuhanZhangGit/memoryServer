
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
/* State records: 
1. array of letters in form of [["A", "hidden"], ["B", "hidden"]]
2. the index of the last click
3. is the two letters have been clicked and are displaying for 1 second.
4. number of total click.
*/
class Memory extends React.Component {
  constructor(props) {
    super(props);
    const slotState = Object.freeze({
      HIDDEN: "hidden",
      REVEALED: "revealed"
    })
    let charArray = "ABCDEFGH".repeat(2).split("");
    charArray = charArray.map(x => [x, "hidden"])
    this.state = {
      slotArray: shuffle(charArray),
      last_clicked_idx: -1,
      is_displaying: 0,
      number_of_click: 0,
    };
  }

  click_hidden(id_num) {
    let displaying = this.state.is_displaying;
    if (displaying === 1) {
      return;
    }
    let temp_slots = this.state.slotArray;
    let last = this.state.last_clicked_idx;
    if (last >= 0) {
      if (temp_slots[last][0] === temp_slots[id_num][0] &&
        last !== id_num) {
        temp_slots[id_num][1] = "revealed";
        temp_slots[last][1] = "revealed";
        last = -1;
      } else {
        temp_slots[id_num][1] = "revealed";
        displaying = 1
        window.setTimeout(() => {
          this.button_time_out(id_num, this.state.last_clicked_idx);
        }, 1000);
      }
    }
    else {
      temp_slots[id_num][1] = "revealed";
      last = id_num;
    }
    let temp_state = _.assign({}, this.state,
      {
        slotArray: temp_slots, last_clicked_idx: last,
        is_displaying: displaying,
        number_of_click: this.state.number_of_click + 1
      });
    this.setState(temp_state);
    // why must use bind to pass "this" to current function.
  }

  button_time_out(id_num, last) {
    let temp_slots = this.state.slotArray;
    temp_slots[id_num][1] = "hidden";
    temp_slots[this.state.last_clicked_idx][1] = "hidden";
    let temp_state = _.assign({}, this.state, {
      slotArray: temp_slots,
      last_clicked_idx: -1,
      is_displaying: 0
    });
    this.setState(temp_state);
  }

  restart(_ev) {
    let temp_slots = this.state.slotArray;
    temp_slots = shuffle(temp_slots.map(element => [element[0], "hidden"]));
    let temp_state = _.assign({}, this.state, {
      slotArray: temp_slots,
      last_clicked_idx: -1,
      is_displaying: 0,
      number_of_click: 0
    });
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
        <div>        {this.click_display()}
        </div>
        <div className="letters">  {table}</div>

        <div>
          <Restart_button root={this} />
        </div>
      </div>);
  }

  click_display() {
    return <p>Number of clicks: {this.state.number_of_click}</p>;
  }

  getButton(id_num) {
    let reveal = <div key={id_num} className="column">
      <button>
        {this.state.slotArray[id_num][0]}
      </button>
    </div>;
    let hidden = <div key={id_num} className="column">
      <button onClick={this.click_hidden.bind(this, id_num)}></button>
    </div>;
    if (this.state.slotArray[id_num][1] === "revealed") {
      return reveal;
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
