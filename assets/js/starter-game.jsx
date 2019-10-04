
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

/*
Design choice: button display timeout is implemented in React. The remote signal local to enter timeout. The signal of timeout completion is then sended back to server.
*/

export default function game_init(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
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

    this.channel = props.channel;
    this.state = {
      slotArray: Array(16).fill(""),
      number_of_click: 0,
      is_displaying: 0,
    };

    this.channel
      .join()
      .receive("ok", this.got_view.bind(this))
      .receive("error", resp => { console.log("Unable to join", resp); });
  }

  got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
    if (view.game.is_displaying === 1) {
      window.setTimeout(() => {
        this.run_timeout();
      }, 1000);
    }
  }

  run_timeout() {
    this.channel.push("timeout", { timeout: "ok" })
      .receive("ok", this.got_view.bind(this));
  }

  on_click(id_num) {
    this.channel.push("click", { id: id_num })
      .receive("ok", this.got_view.bind(this));
  }

  restart(_ev) {
    this.channel.push("restart", { restart: "ok" })
      .receive("ok", this.got_view.bind(this));
  }

  render() {
    let table = [];
    for (let i = 0; i < 4; i++) {
      let row = []
      for (let j = 0; j < 4; j++) {
        let id_num = i * 4 + j;
        row.push(this.getButton(id_num));
      }
      table.push(<div key={"row" + i} className="row">{row}</div>);
    }
    return (
      <div>
        <div>
          <Click_display num_click={this.state.number_of_click} />
        </div>
        <div className="letters">{table}</div>

        <div>
          <Restart_button root={this} />
        </div>
      </div>);
  }

  getButton(id_num) {
    return <div key={id_num} className="column">
      <button onClick={this.on_click.bind(this, id_num)}>
        {this.state.slotArray[id_num]}
      </button>
    </div>;
  }
}

function Click_display(param) {
  return <p>Number of clicks: {param.num_click}</p>;
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
