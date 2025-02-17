import React, { Component } from "react";
import Node from "./node/Node";
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra'
import './PathFinding.css'

export default class PathFinding extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            nodesInShortestPathOrder: [],
            mouseIsPressed: false,
            isSetStartNode: false,
            isSetEndNode: false,
            startNodeRow: 10,
            startNodeCol: 15,
            endNodeRow: 10,
            endNodeCol: 35
        };
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }
    resetGrid(){
        for (let i = 0; i < this.state.nodesInShortestPathOrder.length; i++) {
            const node = this.state.nodesInShortestPathOrder[i]
            if (node.row === this.state.startNodeRow && node.col === this.state.startNodeCol) 
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start'
            else if (node.row === this.state.endNodeRow && node.col === this.state.endNodeCol) 
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-end'
            else 
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node'
        }
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }
    setStartNode() {
        this.setState({ isSetStartNode: !this.state.isSetStartNode })
    }

    setEndNode() {
        this.setState({ isSetEndNode: !this.state.isSetEndNode })
    }

    updateStartEndNode = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        // Ugly code Ik xD
        if (this.state.isSetStartNode) {
            newGrid[this.state.startNodeRow][this.state.startNodeCol].isStart = !newGrid[this.state.startNodeRow][this.state.startNodeCol].isStart
            const newNode = {
                ...node,
                isStart: !node.isStart,
            };
            newGrid[row][col] = newNode;
        } else if (this.state.isSetEndNode) {
            newGrid[this.state.endNodeRow][this.state.endNodeCol].isEnd = !newGrid[this.state.endNodeRow][this.state.endNodeCol].isEnd
            const newNode = {
                ...node,
                isEnd: !node.isEnd,
            };
            newGrid[row][col] = newNode;
        }

        return newGrid;
    }

    handleMouseDown(row, col) {
        if (this.state.isSetStartNode) {
            this.setState({ startNodeRow: row, startNodeCol: col })
            this.updateStartEndNode(this.state.grid, row, col)
            this.setStartNode()
            return;
        } else if (this.state.isSetEndNode) {
            this.setState({ endNodeRow: row, endNodeCol: col })
            this.updateStartEndNode(this.state.grid, row, col)
            this.setEndNode()
            return;
        }
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col)
        this.setState({ grid: newGrid, mouseIsPressed: true })
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col)
        this.setState({ grid: newGrid })
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    getInitialGrid = () => {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(this.createNode(col, row));
            }
            grid.push(currentRow);
        }
        return grid;
    }

    createNode = (col, row) => {
        return {
            col,
            row,
            isStart: row === this.state.startNodeRow && col === this.state.startNodeCol,
            isEnd: row === this.state.endNodeRow && col === this.state.endNodeCol,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    }

    getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }

    applyDijkstra() {
        const { grid } = this.state;
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol]
        const endNode = grid[this.state.endNodeRow][this.state.endNodeCol]
        dijkstra(grid, startNode, endNode)
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode)
        this.setState({nodesInShortestPathOrder: nodesInShortestPathOrder})
        this.animateShortestPath(nodesInShortestPathOrder)
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i]
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path'
            }, 50 * i)
        }
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        //console.log(this.state);
        return (
            <>
                <button onClick={() => this.applyDijkstra()}>
                    Dijkstra's Algorithm
                </button>
                <button onClick={() => this.setStartNode()}>
                    Set Start Point
                </button>
                <button onClick={() => this.setEndNode()}>
                    Set End Point
                </button>
                <button onClick={() => this.resetGrid()}>
                    Reset Grid
                </button>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div className="squares-row" key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isEnd, isStart, isWall } = node;
                                    //console.log(node);
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isEnd={isEnd}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}
