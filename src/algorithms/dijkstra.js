export function dijkstra(grid, startNode, endNode) {
    startNode.distance = 0
    const unvisitedNodes = getAllNodes(grid)
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift()
        console.log(closestNode)
        if (closestNode.isWall) continue
        if (closestNode.distance === Infinity) return
        closestNode.isVisited = true
        if (closestNode === endNode) return 
        updateUnvisitedNeighbors(closestNode, grid)
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid)
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1
        neighbor.previousNode = node
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = []
    const { col, row } = node
    if (row > 0) neighbors.push(grid[row - 1][col]) // NORTH
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]) // SOUTH
    if (col > 0) neighbors.push(grid[row][col - 1]) // WEST
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]) // EAST
    return neighbors.filter(neighbor => !neighbor.isVisited)
}

function getAllNodes(grid) {
    const nodes = []
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node)
        }
    }
    return nodes;
}

// Backtracks from the endNode to find the shortest path.
export function getNodesInShortestPathOrder(endNode) {
    const nodesInShortestPathOrder = []
    let currentNode = endNode
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode
    }
    return nodesInShortestPathOrder
}
