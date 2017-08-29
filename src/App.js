import React, {Component} from 'react';
import {Layer, Rect, Stage, Group, Circle} from 'react-konva';
import './App.css';

/**
 * Represents a single cell of the tic-tac-toe game. Is either X, O or blank.
 * Handles clicks only when appropriate and passes them up the tree.
 */
class Cell extends Component {

    /**
     * Make a new cell, giving it location and game state information plus an event handler.
     * @param props should contain x, y, contents, paused, gameOver, and onPlayerClick elements
     */
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Private method, called when the human player clicks on a cell while the game is expecting user input.
     */
    handleClick() {
        this.props.onPlayerClick(this.props.x, this.props.y);
    }

    /**
     * Conditional rendering, depending on contents and game state.
     * May return almost nothing if the user is not expected to input right now.
     * @returns {XML} commands to draw an X or an O or possibly a blank space
     */
    render() {
        if (this.props.contents === "x") {
            return (
                <Group>
                    <Rect
                        x={this.props.x * 200 + 26}
                        y={this.props.y * 200 + 35}
                        width={15}
                        height={200}
                        fill="#000"
                        rotation={-45}
                    />
                    <Rect
                        x={this.props.x * 200 + 170}
                        y={this.props.y * 200 + 25}
                        width={15}
                        height={200}
                        fill="#000"
                        rotation={45}
                    />
                </Group>
            );
        } else if (this.props.contents === "o") {
            return (
                <Group>
                    <Circle
                        x={this.props.x * 200 + 100}
                        y={this.props.y * 200 + 100}
                        radius={80}
                        stroke="#000"
                        strokeWidth={15}
                    />
                </Group>
            );
        } else if (!this.props.paused && !this.props.gameOver) {
            //we only want to accept input if the game is ready for it
            return (
                <Group>
                    <Rect
                        x={this.props.x * 200}
                        y={this.props.y * 200}
                        width={200}
                        height={200}
                        onClick={this.handleClick}
                    />
                </Group>
            );
        } else {
            //TODO: figure out if returning null is better
            return <Group/>;
        }
    }
}

/**
 * A vertical grid line that spans the whole board.
 */
class VerticalLine extends Component {
    render() {
        return (
            <Rect
                x={this.props.index * 200 - 5}
                y={0}
                width={10}
                height={600}
                fill="#000"
            />
        );
    }
}

/**
 * A horizontal grid line that spans the whole board.
 */
class HorizontalLine extends Component {
    render() {
        return (
            <Rect
                x={0}
                y={this.props.index * 200 - 5}
                width={600}
                height={10}
                fill="#000"
            />
        );
    }
}

const transitions = {
    //second moves:
    "x,o,_,_,_,_,_,_,_": "x,o,_,_,_,_,x,_,_",
    "x,_,o,_,_,_,_,_,_": "x,_,o,_,_,_,x,_,_",
    "x,_,_,o,_,_,_,_,_": "x,_,x,o,_,_,_,_,_",
    "x,_,_,_,o,_,_,_,_": "x,_,_,_,o,_,_,_,x",
    "x,_,_,_,_,o,_,_,_": "x,_,x,_,_,o,_,_,_",
    "x,_,_,_,_,_,o,_,_": "x,_,x,_,_,_,o,_,_",
    "x,_,_,_,_,_,_,o,_": "x,_,x,_,_,_,_,o,_",
    "x,_,_,_,_,_,_,_,o": "x,_,x,_,_,_,_,_,o",

    //third moves:
    "x,o,o,_,_,_,x,_,_": "x,o,o,x,_,_,x,_,_", //win
    "x,o,_,o,_,_,x,_,_": "x,o,_,o,_,_,x,_,x",
    "x,o,_,_,o,_,x,_,_": "x,o,_,x,o,_,x,_,_", //win
    "x,o,_,_,_,o,x,_,_": "x,o,_,x,_,o,x,_,_", //win
    "x,o,_,_,_,_,x,o,_": "x,o,_,x,_,_,x,o,_", //win
    "x,o,_,_,_,_,x,_,o": "x,o,_,x,_,_,x,_,o", //win

    "x,_,o,o,_,_,x,_,_": "x,_,o,o,_,_,x,_,x",
    "x,_,o,_,o,_,x,_,_": "x,_,o,x,o,_,x,_,_", //win
    "x,_,o,_,_,o,x,_,_": "x,_,o,x,_,o,x,_,_", //win
    "x,_,o,_,_,_,x,o,_": "x,_,o,x,_,_,x,o,_", //win
    "x,_,o,_,_,_,x,_,o": "x,_,o,x,_,_,x,_,o", //win

    "x,o,x,o,_,_,_,_,_": "x,o,x,o,x,_,_,_,_",
    "x,_,x,o,o,_,_,_,_": "x,x,x,o,o,_,_,_,_", //win
    "x,_,x,o,_,o,_,_,_": "x,x,x,o,_,o,_,_,_", //win
    "x,_,x,o,_,_,o,_,_": "x,x,x,o,_,_,o,_,_", //win
    "x,_,x,o,_,_,_,o,_": "x,x,x,o,_,_,_,o,_", //win
    "x,_,x,o,_,_,_,_,_": "x,x,x,o,_,_,_,_,_", //win

    "x,o,_,_,o,_,_,_,x": "x,o,_,_,o,_,_,x,x",
    "x,_,o,_,o,_,_,_,x": "x,_,o,_,o,_,x,_,x",
    "x,_,_,o,o,_,_,_,x": "x,_,_,o,o,x,_,_,x",
    "x,_,_,_,o,o,_,_,x": "x,_,_,x,o,o,_,_,x",
    "x,_,_,_,o,_,o,_,x": "x,_,x,_,o,_,o,_,x",
    "x,_,_,_,o,_,_,o,x": "x,x,_,_,o,_,_,o,x",

    "x,o,x,_,_,o,_,_,_": "x,o,x,_,x,o,_,_,_",
    "x,_,x,_,o,o,_,_,_": "x,x,x,_,o,o,_,_,_", //win
    "x,_,x,_,_,o,o,_,_": "x,x,x,_,_,o,o,_,_", //win
    "x,_,x,_,_,o,_,o,_": "x,x,x,_,_,o,_,o,_", //win
    "x,_,x,_,_,o,_,_,o": "x,x,x,_,_,o,_,_,o", //win

    "x,o,x,_,_,_,o,_,_": "x,o,x,_,_,_,o,_,x",
    "x,_,x,_,o,_,o,_,_": "x,x,x,_,o,_,o,_,_", //win
    "x,_,x,_,_,_,o,o,_": "x,x,x,_,_,_,o,o,_", //win
    "x,_,x,_,_,_,o,_,o": "x,x,x,_,_,_,o,_,o", //win

    "x,o,x,_,_,_,_,o,_": "x,o,x,_,x,_,_,o,_",
    "x,_,x,_,o,_,_,o,_": "x,x,x,_,o,_,_,o,_", //win
    "x,_,x,_,_,_,_,o,o": "x,x,x,_,_,_,_,o,o", //win

    "x,o,x,_,_,_,_,_,o": "x,o,x,_,_,_,x,_,o",
    "x,_,x,o,_,_,_,_,o": "x,x,x,o,_,_,_,_,o", //win
    "x,_,x,_,o,_,_,_,o": "x,x,x,_,o,_,_,_,o", //win

    //fourth moves
    "x,o,o,o,_,_,x,_,x": "x,o,o,o,_,_,x,x,x", //win
    "x,o,_,o,o,_,x,_,x": "x,o,_,o,o,_,x,x,x", //win
    "x,o,_,o,_,o,x,_,x": "x,o,_,o,_,o,x,x,x", //win
    "x,o,_,o,_,_,x,o,x": "x,o,_,o,x,_,x,o,x", //win

    "x,_,o,o,o,_,x,_,x": "x,_,o,o,o,_,x,x,x", //win
    "x,_,o,o,_,o,x,_,x": "x,_,o,o,_,o,x,x,x", //win
    "x,_,o,o,_,_,x,o,x": "x,_,o,o,x,_,x,o,x", //win

    "x,o,o,_,o,_,_,x,x": "x,o,o,_,o,_,x,x,x", //win
    "x,o,_,o,o,_,_,x,x": "x,o,_,o,o,_,x,x,x", //win
    "x,o,_,_,o,o,_,x,x": "x,o,_,_,o,o,x,x,x", //win
    "x,o,_,_,o,_,o,x,x": "x,o,x,_,o,_,o,x,x", //win

    "x,o,o,_,o,_,x,_,x": "x,o,o,_,o,_,x,x,x", //win
    "x,_,o,_,o,o,x,_,x": "x,_,o,_,o,o,x,x,x", //win
    "x,_,o,_,o,_,x,o,x": "x,_,o,x,o,_,x,o,x", //win

    "x,o,_,o,o,x,_,_,x": "x,o,x,o,o,x,_,_,x", //win
    "x,_,o,o,o,x,_,_,x": "x,_,o,o,o,x,x,_,x",
    "x,_,_,o,o,x,o,_,x": "x,_,x,o,o,x,o,_,x", //win
    "x,_,_,o,o,x,_,o,x": "x,_,x,o,o,x,_,o,x", //win

    "x,o,_,x,o,o,_,_,x": "x,o,_,x,o,o,x,_,x", //win
    "x,_,o,x,o,o,_,_,x": "x,_,o,x,o,o,x,_,x", //win
    "x,_,_,x,o,o,o,_,x": "x,_,x,x,o,o,o,_,x",
    "x,_,_,x,o,o,_,o,x": "x,_,_,x,o,o,x,o,x", //win

    "x,o,x,_,o,_,o,_,x": "x,o,x,_,o,x,o,_,x", //win
    "x,_,x,o,o,_,o,_,x": "x,_,x,o,o,x,o,_,x", //win
    "x,_,x,_,o,o,o,_,x": "x,x,x,_,o,o,o,_,x", //win
    "x,_,x,_,o,_,o,o,x": "x,_,x,_,o,x,o,o,x", //win

    "x,x,o,_,o,_,_,o,x": "x,x,o,_,o,_,x,o,x",
    "x,x,_,o,o,_,_,o,x": "x,x,x,o,o,_,_,o,x", //win
    "x,x,_,_,o,o,_,o,x": "x,x,x,_,o,o,_,o,x", //win
    "x,x,_,_,o,_,o,o,x": "x,x,x,_,o,_,o,o,x", //win

    "x,o,x,o,x,o,_,_,_": "x,o,x,o,x,o,_,_,x", //win
    "x,o,x,_,x,o,o,_,_": "x,o,x,_,x,o,o,_,x", //win
    "x,o,x,_,x,o,_,o,_": "x,o,x,_,x,o,_,o,x", //win
    "x,o,x,_,x,o,_,_,o": "x,o,x,_,x,o,x,_,o", //win

    "x,o,x,o,_,_,o,_,x": "x,o,x,o,_,x,o,_,x", //win
    "x,o,x,_,_,o,o,_,x": "x,o,x,_,x,o,o,_,x", //win
    "x,o,x,_,_,_,o,o,x": "x,o,x,_,x,_,o,o,x", //win

    "x,o,x,o,x,_,_,o,_": "x,o,x,o,x,_,x,o,_", //win
    "x,o,x,_,x,_,o,o,_": "x,o,x,_,x,_,o,o,x", //win
    "x,o,x,_,x,_,_,o,o": "x,o,x,_,x,_,x,o,o", //win

    "x,o,x,o,_,_,x,_,o": "x,o,x,o,x,_,x,_,o", //win
    "x,o,x,_,o,_,x,_,o": "x,o,x,x,o,_,x,_,o", //win
    "x,o,x,_,_,o,x,_,o": "x,o,x,_,x,o,x,_,o", //win
    "x,o,x,_,_,_,x,o,o": "x,o,x,_,x,_,x,o,o", //win

    //fifth moves
    "x,o,o,o,o,x,x,_,x": "x,o,o,o,o,x,x,x,x", //win
    "x,_,o,o,o,x,x,o,x": "x,x,o,o,o,x,x,o,x", //#draw

    "x,o,x,x,o,o,o,_,x": "x,o,x,x,o,o,o,x,x", //#draw
    "x,_,x,x,o,o,o,o,x": "x,x,x,x,o,o,o,o,x", //win

    "x,x,o,o,o,_,x,o,x": "x,x,o,o,o,x,x,o,x", //#draw
    "x,x,o,_,o,o,x,o,x": "x,x,o,x,o,o,x,o,x", //win
};

const draws = ["x,x,o,o,o,x,x,o,x", "x,o,x,x,o,o,o,x,x", "x,x,o,o,o,x,x,o,x"];

/**
 * Contains all the cells for a tic-tac-toe game, plus the AI that plays against a player.
 *
 * TODO: separate AI into separate class
 */
class Grid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            gameOver: false,
            paused: false,
            //chose to represent the cells as a 1d array to simplify immutability
            cells: ["x", "_", "_", "_", "_", "_", "_", "_", "_"],
        };

        this.onPlayerClick = this.handlePlayerClick.bind(this);
    }

    /**
     * A player has clicked on a cell. Pauses the game to wait for AI action.
     *
     * TODO: find better separation of pausing function with clicking function
     * @param x the x location of the clicked cell
     * @param y the y location of the clicked cell
     */
    handlePlayerClick(x, y) {
        let cells = this.state.cells.slice();
        let index = y * 3 + x;
        cells[index] = "o";

        this.setState({cells: cells, paused: true});
    }

    /**
     * Setup a timer so that AI moves are not super-instantaneous.
     */
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    /**
     * Cleanup the timer when we're done.
     */
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    /**
     * If the game is waiting for an AI move, make the AI move.
     */
    tick() {
        if (this.state.paused) {
            this.aiMove();
            this.setState({paused: false});
            if (this.hasAIWon()) {
                this.setState({gameOver: true});
                this.props.onGameStatusChange("lose");
            }else if(draws.indexOf(this.state.cells.join(",")) !== -1) {
                this.setState({gameOver: true});
                this.props.onGameStatusChange("draw");
            }
        }
    }

    /**
     * Make the AI take a move, based on what move of the game it is.
     */
    aiMove() {
        let currentString = this.state.cells.join(",");
        let nextString = transitions[currentString];
        let nextCells = nextString.split(",");
        this.setState({cells: nextCells});
    }

    /**
     * The whole grid, with lines and cells.
     * @returns {XML}
     */
    render() {
        return (
            <Group>
                <VerticalLine index={1}/>
                <VerticalLine index={2}/>
                <HorizontalLine index={1}/>
                <HorizontalLine index={2}/>
                <Cell x={0} y={0} contents={this.state.cells[0]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={1} y={0} contents={this.state.cells[1]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={2} y={0} contents={this.state.cells[2]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={0} y={1} contents={this.state.cells[3]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={1} y={1} contents={this.state.cells[4]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={2} y={1} contents={this.state.cells[5]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={0} y={2} contents={this.state.cells[6]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={1} y={2} contents={this.state.cells[7]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={2} y={2} contents={this.state.cells[8]} paused={this.state.paused}
                      gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
            </Group>
        );
    }

    /**
     * Has the AI won yet?
     * @returns {boolean} true if the AI has won, false otherwise
     */
    hasAIWon() {
        let c = this.state.cells;
        if ([c[0], c[1], c[2]].join("") === "xxx") {
            return true;
        } else if ([c[3], c[4], c[5]].join("") === "xxx") {
            return true;
        } else if ([c[6], c[7], c[8]].join("") === "xxx") {
            return true;
        } else if ([c[0], c[3], c[6]].join("") === "xxx") {
            return true;
        } else if ([c[1], c[4], c[7]].join("") === "xxx") {
            return true;
        } else if ([c[2], c[5], c[8]].join("") === "xxx") {
            return true;
        } else if ([c[0], c[3], c[6]].join("") === "xxx") {
            return true;
        } else return [c[0], c[4], c[8]].join("") === "xxx";
    }
}

/**
 * Toplevel component for the tic-tac-toe app.
 */
class App extends Component {

    constructor(props){
        super(props);

        this.state = {gameStatus: "running"};

        this.onStatusChange = this.onGameStatusChange.bind(this);
    }

    onGameStatusChange(newStatus){
        this.setState({gameStatus: newStatus});
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Tic-Tac-Lose</h2>
                </div>
                <Stage width={600} height={600} className="App-canvas">
                    <Layer>
                        <Grid onGameStatusChange={this.onStatusChange}/>
                    </Layer>
                </Stage>
                <GameStatus status={this.state.gameStatus} />
            </div>
        );
    }
}

/**
 * Simple status heading so that player gets some feedback on lose or draw.
 */
class GameStatus extends Component {

    render(){
        if(this.props.status === "lose"){
            return (
                <h1>You Lose!</h1>
            );
        }else if(this.props.status === "draw"){
            return (
                <h1>Draw!</h1>
            );
        }else{
            return null;
        }
    }
}

export default App;
