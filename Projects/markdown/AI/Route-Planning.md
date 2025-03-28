# Route Planning with Search Algorithms

This project implements and compares different search algorithms (BFS, DFS, Greedy Best-First Search, A*) for solving route planning problems. It includes a PyQt6 GUI for visualizing the algorithms and comparing their performance.

## Features

- Implementation of four classic search algorithms:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Greedy Best-First Search
  - A* Search

- Interactive GUI with:
  - Graph creation (random graphs and grid graphs)
  - Algorithm selection and comparison
  - Visualization of search paths
  - Performance metrics comparison

- Analysis of algorithm performance in terms of:
  - Path length (optimality)
  - Number of nodes visited (efficiency)
  - Execution time
  - Memory usage

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/heyimnas/route-planning
   cd route-planning
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

Run the application:
```
python main.py
```

### Graph Creation

1. Select the type of graph (Random or Grid)
2. Configure the graph parameters
3. Click "Generate Graph"
4. Select start and goal nodes

### Running Algorithms

1. Check the algorithms you want to compare
2. Click "Run Selected Algorithms"
3. View the results in the visualization tabs

## Implementation Details

- Search algorithms are implemented in `src/algorithms/search_algorithms.py`
- Graph representation is in `src/utils/graph.py`
- Visualization utilities are in `src/utils/visualizer.py`
- GUI is implemented in `src/gui/main_window.py`

## Requirements

- Python 3.7+
- PyQt6
- Matplotlib
- NetworkX
- NumPy

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
