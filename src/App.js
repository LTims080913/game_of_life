import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import './App.css';
// import gattika from 'src/gattika.mp4'

//STYLING//

const Button = styled.button `
background: #C0A9B0;
border-radius: 3px;
border: 1px solid #7880B5;
color: #7880B5;
margin: 0 1em;
padding: 0.25em 1em;
margin-bottom: 2%;
`



const numRows = 15;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;

}

function App() {

  const [grid, setGrid] = useState(() => {
  return generateEmptyGrid()
  });
  console.log(grid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // simulate
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >=0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors ===3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    })

    setTimeout(runSimulation, 100)
  }, [])

  return (
    <>
    
    <div className="App">
     <h1>Welcome to Gattika</h1>
     <p>Gattika is a simulation of Conway's Game of Life. Begin by placing desired points on the grid or initiating the random button. Once desired formation is in place, press 'Start' to watch the automation ensue!</p>
    <Button className='button' 
    onClick={() => {
      setRunning(!running);
      if (!running) {
        runningRef.current = true;
        runSimulation();
      }
    }}
    >
      {running ? 'stop' : 'start'}
    </Button>
    <Button className='button'
    onClick={() => {
      setGrid(generateEmptyGrid())
    }}
    >
      clear
    </Button>
    <Button className='button'
     onClick={() => {
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => Math.random() > .75 ? 1 : 0));
      }

      setGrid(rows);
    }}
    >
      random
    </Button>
     <div className='grid'
     style={{
        display:'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
        >
          {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
            key={`${i}-${k}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = grid[i][k] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{
              width:20,
              height: 20,
              backgroundColor: grid[i][k] ? '#BCC4DB' : '#7880B5',
              border: 'solid 1px white'
            }}/>
          )))}
       
     </div>
    </div>
    </>
  );
}

export default App;
