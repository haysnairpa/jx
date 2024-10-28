import PriorityQueue from 'js-priority-queue';

export function aStar(graph, start, goal, heuristic) {
  const openSet = [start];
  const closedSet = [];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  gScore[start] = 0;
  fScore[start] = heuristic(start, goal);

  while (openSet.length > 0) {
    let current = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      if (fScore[openSet[i]] < fScore[current]) {
        current = openSet[i];
      }
    }

    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);

    if (!graph[current] || !graph[current].edges) {
      console.error(`Node tidak valid atau tidak memiliki edges: ${current}`);
      continue;
    }

    for (let neighbor in graph[current].edges) {
      if (closedSet.includes(neighbor)) continue;

      const tentativeGScore = gScore[current] + graph[current].edges[neighbor].distance;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[neighbor]) {
        continue;
      }

      cameFrom[neighbor] = current;
      gScore[neighbor] = tentativeGScore;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
    }
  }

  return null; // Tidak ada jalur yang ditemukan
}

function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
}
