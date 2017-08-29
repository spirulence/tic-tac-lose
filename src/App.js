import React, {Component} from 'react';
import {Layer, Rect, Stage, Group, Circle} from 'react-konva';
import './App.css';

class Cell extends Component {

    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.onPlayerClick(this.props.x, this.props.y);
    }

    render() {
        if(this.props.contents === "x") {
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
        }else if(this.props.contents === "o") {
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
        }else if(!this.props.paused && !this.props.gameOver){
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
            return <Group/>;
        }
    }
}

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

class Grid extends Component {

    constructor(props){
        super(props);

        this.state = {
            gameOver: false,
            paused: false,
            cells: ["x","","","","","","","",""],
            aiMoves: [0],
            playerMoves: []
        };

        this.onPlayerClick = this.handlePlayerClick.bind(this);
    }



    handlePlayerClick(x, y){
        let cells = this.state.cells.slice();
        let index = y * 3 + x;
        cells[index] = "o";

        this.setState({cells: cells, paused: true});

        this.recordPlayerMove(index);
    }

    recordPlayerMove(index) {
        let playerMoves = this.state.playerMoves.slice();
        playerMoves.push(index);

        this.setState({playerMoves: playerMoves});
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if(this.state.paused){
            this.aiMove();
        }
    }



    aiMove() {
        let totalMoves = this.state.playerMoves.length + this.state.aiMoves.length;
        if(totalMoves === 2) {
            this.aiSecondMove();
        }else if(totalMoves === 4){
            this.aiThirdMove();
        }else if(totalMoves === 6){
            this.aiFourthMove();
        }
    }

    isCenter(index){
        return index === 4;
    }

    isEdge(index){
        return [1, 3, 5, 7].indexOf(index) !== -1;
    }

    isCorner(index){
        return [0, 2, 6, 8].indexOf(index) !== -1;
    }

    aiSecondMove(){
        let lastPlayerMove = this.state.playerMoves[0];
        if(this.isCenter(lastPlayerMove)){
            //player has placed first O in middle
            //we place our second X in opposite corner to first
            this.aiClick(8);
        }else if(lastPlayerMove === 2 || lastPlayerMove === 1){
            //we want to place our second X with an empty space between it and first X
            //only option here is 6
            this.aiClick(6);
        }else{
            //we could theoretically place it at 6 still, but this is simpler
            this.aiClick(2);
        }
    }

    aiThirdMove(){
        let lastPlayerMove = this.state.playerMoves[1];
        let lastAIMove = this.state.aiMoves[1];
        if(lastAIMove === 8){
            if(lastPlayerMove === 3 || lastPlayerMove === 6 || lastPlayerMove === 7){
                //player placed on left side of diagonal from 0 to 8
                //we place on right side corner to set up two winning moves
                this.aiClick(2);
            }else{
                //player placed on right side of diagonal
                //we place on left side corner
                this.aiClick(6);
            }
        }else if(lastAIMove === 6){
            if(lastPlayerMove !== 3){
                //we can win by finishing off a row of three
                this.aiClick(3);
            }else{
                this.aiClick(8);
            }
        }else if(lastAIMove === 2){
            if(lastPlayerMove !== 1){
                //we can win by finishing off a row of three
                this.aiClick(1);
            }else if(lastPlayerMove === 1){
                this.aiClick(4);
            }else{
                this.aiClick(8);
            }
        }
    }

    aiFourthMove(){
        let lastPlayerMove = this.state.playerMoves[2];
        let lastAIMove = this.state.aiMoves[2];
        let secondAIMove = this.state.aiMoves[1];

        if(lastAIMove === 8){
            if(lastPlayerMove === 7 || lastPlayerMove === 5){
                this.aiClick(4);
            }else if(lastPlayerMove === 4){
                if(secondAIMove === 6){
                    this.aiClick(7);
                }else if(secondAIMove === 2){
                    this.aiClick(5);
                }
            }
        }else if(lastAIMove === 6) {
            if (lastPlayerMove === 3) {
                this.aiClick(7);
            } else {
                this.aiClick(3);
            }
        }else if(lastAIMove === 4){
            if(lastPlayerMove === 6){
                this.aiClick(8);
            }else{
                this.aiClick(6);
            }
        }else if(lastAIMove === 2){
            if(lastPlayerMove === 1){
                this.aiClick(5);
            }else{
                this.aiClick(1);
            }
        }
    }

    aiClick(index) {
        let cells = this.state.cells.slice();
        cells[index] = "x";

        this.setState({cells: cells, paused: false});

        this.recordAIMove(index);

        if(this.hasAIWon()){
            this.setState({gameOver: true});
        }
    }

    recordAIMove(index) {
        let aiMoves = this.state.aiMoves.slice();
        aiMoves.push(index);
        this.setState({aiMoves: aiMoves});
    }

    render() {
        return (
            <Group>
                <VerticalLine index={1}/>
                <VerticalLine index={2}/>
                <HorizontalLine index={1}/>
                <HorizontalLine index={2}/>
                <Cell x={0} y={0} contents={this.state.cells[0]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={1} y={0} contents={this.state.cells[1]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={2} y={0} contents={this.state.cells[2]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={0} y={1} contents={this.state.cells[3]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={1} y={1} contents={this.state.cells[4]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={2} y={1} contents={this.state.cells[5]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={0} y={2} contents={this.state.cells[6]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={1} y={2} contents={this.state.cells[7]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
                <Cell x={2} y={2} contents={this.state.cells[8]} paused={this.state.paused} gameOver={this.state.gameOver} onPlayerClick={this.onPlayerClick}/>
            </Group>
        );
    }

    hasAIWon() {
        let c = this.state.cells;
        if ([c[0], c[1], c[2]].join("") === "xxx") {
            return true;
        } else if ([c[3], c[4], c[5]].join("") === "xxx") {
            return true;
        } else if ([c[6], c[7], c[8]].join("") === "xxx") {
            return true;
        } else if ([c[0], c[3], c[6]].join("") === "xxx"){
            return true;
        } else if ([c[1], c[4], c[7]].join("") === "xxx"){
            return true;
        } else if ([c[2], c[5], c[8]].join("") === "xxx"){
            return true;
        } else if ([c[0], c[3], c[6]].join("") === "xxx"){
            return true;
        } else if ([c[0], c[4], c[8]].join("") === "xxx"){
            return true;
        } else {
            return false;
        }
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Tic-Tac-Lose</h2>
                </div>
                <Stage width={600} height={600} className="App-canvas">
                    <Layer>
                        <Grid/>
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default App;
