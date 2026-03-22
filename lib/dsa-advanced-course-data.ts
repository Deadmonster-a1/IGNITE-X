import {
    Lightbulb, Coffee, ArrowRightLeft, Ruler, ListChecks, FileText,
    GitBranch, Trophy, CheckCircle, GraduationCap, TerminalSquare,
    Calculator, Thermometer, Box, Database, Clock, LayoutList, Type,
    Search, ArrowUpDown, RefreshCcw, Lock, Code2, Cpu, Hash, Target,
    Network, Layers, GitMerge, SortAsc, Zap, Braces, Minimize2, Settings, ShieldAlert, Key
} from "lucide-react"

export const courseInfo = {
    title: "DSA Advanced: Algorithmic Paradigms",
    subtitle: "Conquer Dynamic Programming, Trees, Graphs, and master Technical Interviews.",
    totalLessons: 47,
    estimatedTime: "30+ hours",
    difficulty: "Advanced",
    totalXP: 50000,
}

export type LessonType = 'concept' | 'mission' | 'practice';
export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'master';

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface Lesson {
    id: string;
    title: string;
    icon: any;
    color: string;
    description: string;
    code: string;
    tldr: string;
    type: LessonType;
    difficulty?: Difficulty;
    xpReward?: number;
    isLocked?: boolean;
    quiz?: QuizQuestion[];
}

export interface Chapter {
    id: string;
    title: string;
    difficulty?: Difficulty;
    concepts: Lesson[];
    missions?: Lesson[];
    problems?: Lesson[]; // Keep for backward compatibility during migration
}

export interface Part {
    id: string;
    title: string;
    chapters: Chapter[];
    unlockLevel?: number;
}

import { BookOpen } from "lucide-react";

export const courseCurriculum: Part[] = [
    {
        id: "part-3",
        title: "PART III — Advanced Algorithms (Interview Level)",
        chapters: [
            {
                id: "chap-18",
                title: "Chapter 18 — Divide and Conquer",
                concepts: [
                    {
                        id: "divide_conquer",
                        title: "Divide and Conquer Strategy",
                        icon: GitBranch,
                        color: "#ef4444",
                        description: "Divide and Conquer is an algorithmic paradigm that breaks a problem into smaller subproblems, solves the subproblems recursively, and then combines their solutions to form the overall answer.\n\nThree phases:\n1. **Divide**: Break the array or data structure in half.\n2. **Conquer**: Recursively solve the halves.\n3. **Combine**: Merge the answers back together.",
                        code: `function solve(problem) {\n  if (problem is small enough) return solveDirectly(problem)\n  \n  parts = divide(problem)\n  sol1 = solve(parts[0])\n  sol2 = solve(parts[1])\n  \n  return combine(sol1, sol2)\n}`,
                        tldr: "Split the problem, solve the small pieces, merge the results.",
                        type: 'concept',
                    },
                    {
                        id: "merge_sort",
                        title: "Merge Sort",
                        icon: GitMerge,
                        color: "#3b82f6",
                        description: "**Merge Sort** guarantees an O(n log n) time complexity.\n\nIt continuously halves the array until every piece has length 1 (a single element is obviously sorted).\nThen, it repeatedly \"merges\" these small sorted arrays back together. When merging two sorted arrays, you can use two pointers to stitch them together perfectly in O(n) time.",
                        code: `// The combining step:\nfunction merge(a, b) {\n  let res = [];\n  while(a.length && b.length)\n    if (a[0] < b[0]) res.push(a.shift());\n    else res.push(b.shift());\n  return [...res, ...a, ...b];\n}`,
                        tldr: "Chop the array down to 1 element pieces, then logically stitch pairs back together in order.",
                        type: 'concept',
                    },
                    {
                        id: "quick_sort",
                        title: "Quick Sort",
                        icon: Zap,
                        color: "#f59e0b",
                        description: "**Quick Sort** is often faster in reality than Merge Sort, but mathematically risks an O(n²) worst case.\n\nInstead of dividing down the middle, Quick Sort picks a \"Pivot\" element. It throws all smaller items to the Left of the pivot, and all larger items to the Right. Now the pivot is exactly in its final sorted position! Then it recursively sorts the left and right halves.",
                        code: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  let pivot = arr[arr.length - 1];\n  let left = [], right = [];\n  // push to left/right arrays...\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`,
                        tldr: "Pick a pivot. Small stuff goes left, big stuff goes right. Recurse.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "merge_sorted_arrays",
                        title: "Merge sorted arrays",
                        icon: LayoutList,
                        color: "#10b981",
                        description: "Problem: Given two sorted arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.\n\n**Algorithm**: Iterate backwards! Since nums1 has empty space at its tail, compare the largest elements of both arrays and place the absolute largest at the very end of nums1. This prevents overwriting the data you still need.",
                        code: `let p1 = m - 1, p2 = n - 1, p = m + n - 1;\nwhile (p2 >= 0) {\n  if (p1 >= 0 && nums1[p1] > nums2[p2]) {\n    nums1[p--] = nums1[p1--];\n  } else {\n    nums1[p--] = nums2[p2--];\n  }\n}`,
                        tldr: "Start filling the array from the back to the front.",
                        type: 'practice',
                    },
                    {
                        id: "count_inversions",
                        title: "Count inversions",
                        icon: RefreshCcw,
                        color: "#ec4899",
                        description: "Problem: How far (or close) is an array from being sorted? If `i < j` but `arr[i] > arr[j]`, it's an inversion.\n\n**Algorithm**: Modify Merge Sort. When merging two halves, if you take an element from the Right array while the Left array still has elements, ALL remaining elements in the Left array form an inversion with the current Right element!",
                        code: `// Inside the merge function:\nif (right[j] < left[i]) {\n  inversions += (left.length - i);\n  res.push(right[j++]);\n}`,
                        tldr: "Piggyback counting onto Merge Sort to achieve O(n log n).",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-19",
                title: "Chapter 19 — Dynamic Programming",
                concepts: [
                    {
                        id: "overlapping_subproblems",
                        title: "Overlapping Subproblems",
                        icon: Layers,
                        color: "#8b5cf6",
                        description: "Dynamic Programming (DP) is simply an optimization over plain Recursion.\n\nMany recursive functions (like Fibonacci) do the exact same work over and over again. `Fib(5)` calls `Fib(4)` and `Fib(3)`. But `Fib(4)` ALSO calls `Fib(3)`. You end up calculating `Fib(3)` multiple times! This is an **Overlapping Subproblem**.",
                        code: `Fib(5)\n├── Fib(4)\n│   ├── Fib(3) <-- CACHE IT!\n│   └── Fib(2)\n└── Fib(3) <-- ALREADY KNOW IT!`,
                        tldr: "Don't compute the same exact input twice.",
                        type: 'concept',
                    },
                    {
                        id: "memoization",
                        title: "Memoization (Top-Down)",
                        icon: Database,
                        color: "#10b981",
                        description: "**Memoization** is fixing recursion by giving it a memory cache (like a Hash Map or Array).\n\nBefore launching a recursive call, check the cache. If you've solved it before, instantly return the answer. If not, run the massive calculation, but SAVE the answer to the cache right before returning it.",
                        code: `let memo = {};\nfunction fib(n) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  return memo[n] = fib(n-1) + fib(n-2);\n}`,
                        tldr: "Recursion + a Notebook (Hash Map). Solve it once, remember it forever.",
                        type: 'concept',
                    },
                    {
                        id: "tabulation",
                        title: "Tabulation (Bottom-Up)",
                        icon: LayoutList,
                        color: "#3b82f6",
                        description: "**Tabulation** throws away Recursion entirely.\n\nInstead of starting at n=100 and working down, you start at n=0 and work UP using a clean straight For-Loop. You build a \"table\" (array) of answers from the ground up until you reach your goal.\n\nTabulation is usually slightly faster because there's no Call Stack overhead.",
                        code: `function fib(n) {\n  let dp = [0, 1];\n  for(let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}`,
                        tldr: "For-loops + an Array. Build the answers sequentially from 0 up to N.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "knapsack_problem",
                        title: "0/1 Knapsack",
                        icon: Box,
                        color: "#ef4444",
                        description: "Problem: Given a backpack with capacity W, and items with weights and values, maximize the total value without exceeding W.\n\n**Algorithm**: State Transition.\nAt every item, you have a choice: Take it (if it fits), or Leave it.\n`dp[item][weight] = Max( LeaveIt, TakeIt + dp[item-1][weight - itemWeight] )`",
                        code: `for (let w = weight[i]; w <= W; w++) {\n  dp[w] = Math.max(dp[w], value[i] + dp[w - weight[i]]);\n}`,
                        tldr: "To Take or to Leave? Keep whichever branch yields max profit.",
                        type: 'practice',
                    },
                    {
                        id: "coin_change",
                        title: "Coin change",
                        icon: Calculator,
                        color: "#f59e0b",
                        description: "Problem: Fewest number of coins required to make up amount X.\n\n**Algorithm**: Create a DP array where `dp[i]` is the minimum coins needed to make amount `i`. Initialize with Infinity. For every coin denomination C, `dp[i] = Math.min( dp[i], dp[i - C] + 1 )`.",
                        code: `dp.fill(Infinity); dp[0] = 0;\nfor (let i = 1; i <= amount; i++) {\n  for (let c of coins) {\n    if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n  }\n}`,
                        tldr: "Look back by the value of the coin. Add 1 coin to that previous best answer.",
                        type: 'practice',
                    },
                    {
                        id: "longest_common_subsequence",
                        title: "Longest common subsequence",
                        icon: Search,
                        color: "#3b82f6",
                        description: "Problem: Find the length of the longest sub-sequence bridging two strings.\n\n**Algorithm**: A 2D DP grid! Comparing string A against string B.\nIf the characters match, `dp[i][j] = 1 + dg[i-1][j-1]` (Diagonal).\nIf they DON'T match, carry over the best of either skipping from A or skipping from B: `Math.max( dp[i-1][j], dp[i][j-1] )`",
                        code: `if (text1[i] === text2[j])\n  dp[i][j] = 1 + dp[i-1][j-1];\nelse\n  dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);`,
                        tldr: "2D Grid. Matches move diagonally, mismatches pull the best neighbor.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-20",
                title: "Chapter 20 — Backtracking",
                concepts: [
                    {
                        id: "backtracking_concept",
                        title: "Backtracking Concept",
                        icon: RefreshCcw,
                        color: "#ec4899",
                        description: "Backtracking is brute-force with intelligence.\n\nIt systematically searches for a solution (like escaping a maze) by building a path step by step. If it realizes the current path is completely doomed, it \"backtracks\" (undoes the last step) and tries a different branch, saving massive amounts of time compared to blind brute force.",
                        code: `function solve(path) {\n  if (isSuccess(path)) return true;\n  \n  for (let choice of choices) {\n    if (isValid(choice)) {\n      path.push(choice); // DO\n      if (solve(path)) return true;\n      path.pop(); // UNDO (Backspace!)\n    }\n  }\n  return false;\n}`,
                        tldr: "Do. Recurse. Undo. If you hit a dead end, aggressively back out.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "n_queens",
                        title: "N Queens",
                        icon: Target,
                        color: "#8b5cf6",
                        description: "Problem: Place N queens on an N×N chessboard such that no two queens attack each other.\n\n**Algorithm**: Place queens row by row. For a row, try placing a queen in every column. If it is safe (no queens sharing the column or diagonals), place it, and recurse to the next row. If the recursion fails later on, backtrack: remove the queen and try the next column.",
                        code: `function place(row) {\n  if (row === N) foundSolution();\n  for (let col=0; col<N; col++) {\n    if (isSafe(row, col)) {\n       board[row][col] = 'Q';\n       place(row + 1);\n       board[row][col] = '.'; // Backtrack\n    }\n  }\n}`,
                        tldr: "Place, test, and erase the queen until all N rows are filled cleanly.",
                        type: 'practice',
                    },
                    {
                        id: "sudoku_solver",
                        title: "Sudoku solver",
                        icon: LayoutList,
                        color: "#3b82f6",
                        description: "Problem: Write a program to solve a Sudoku puzzle.\n\n**Algorithm**: Find the first empty cell. Try numbers 1 through 9. If a number is valid (doesn't violate row, col, or 3x3 box), place it and recursively call solve() again. If solve() eventually returns false, wipe the cell back to empty ('.') and try the next number.",
                        code: `if (isValid(board, row, col, stringNum)) {\n  board[row][col] = stringNum;\n  if (solve(board)) return true;\n  board[row][col] = '.'; // Backtrack\n}`,
                        tldr: "Trial and error on steroids. Un-write numbers if they cause a block later.",
                        type: 'practice',
                    },
                    {
                        id: "permutations",
                        title: "Permutations",
                        icon: Layers,
                        color: "#10b981",
                        description: "Problem: Given an array [1,2,3], return ALL possible permutations (arrangements).\n\n**Algorithm**: Loop through the choices. If a number is already in your `current_path`, skip it. Otherwise, add it, recurse deeper, and immediately pop it back off so the loop can try picking a different number.",
                        code: `if (path.length === nums.length) res.push([...path]);\nfor (let i = 0; i < nums.length; i++) {\n  if (path.includes(nums[i])) continue;\n  path.push(nums[i]);\n  backtrack(path);\n  path.pop();\n}`,
                        tldr: "Do, Recurse, Undo loop generates all ordering possibilities.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-21",
                title: "Chapter 21 — Advanced Graph Algorithms",
                concepts: [
                    {
                        id: "dijkstra",
                        title: "Dijkstra's Algorithm",
                        icon: Network,
                        color: "#ef4444",
                        description: "**Dijkstra's Algorithm** finds the absolute shortest path from a start node to everything else in a WEIGHTED graph.\n\nIt uses a **Min-Priority Queue**. It constantly asks: \"What is the cheapest node I haven't securely locked in yet?\" It processes that node, updates the price to its neighbors, and repeats.",
                        code: `pq.push([0, startNode])\nwhile (pq is not empty): \n  [cost, node] = pq.pop_smallest()\n  if (cost > distances[node]) continue;\n  for neighbor of node:\n     if new_cost < distances[neighbor]:\n         distances[neighbor] = new_cost\n         pq.push([new_cost, neighbor])`,
                        tldr: "Use a Min-Heap to relentlessly pursue the cheapest unvisited path.",
                        type: 'concept',
                    },
                    {
                        id: "bellman_ford",
                        title: "Bellman-Ford",
                        icon: ArrowUpDown,
                        color: "#f59e0b",
                        description: "**Bellman-Ford** does the same thing as Dijkstra, but it can handle **Negative Weights** (where Dijkstra violently crashes).\n\nIt simply relaxes ALL edges V-1 times. It's slower (O(V * E)), but extremely robust. If you run it a V-th time and a path gets cheaper, you've detected a \"Negative Wage Cycle\" (infinite free money loop)!",
                        code: `for (i = 0 to V-1) {\n  for (u, v, weight of allEdges) {\n    if (dist[u] + weight < dist[v]) {\n       dist[v] = dist[u] + weight;\n    }\n  }\n}`,
                        tldr: "Brute-forces the shortest path by relaxing every single edge V-1 times.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "network_delay_time",
                        title: "Network delay time",
                        icon: Clock,
                        color: "#3b82f6",
                        description: "Problem: Given a network of nodes, how long does it take for a signal sent from node K to reach all other nodes?\n\n**Algorithm**: This is pure Dijkstra! Run Dijkstra starting from node K. Keep track of the maximum distance recorded. If any node is still locked at Infinity at the end, the network is disjoint—return -1. Otherwise, the max distance is your answer.",
                        code: `// Run Dijkstra, then:\nlet maxTime = Math.max(...distArray);\nreturn maxTime === Infinity ? -1 : maxTime;`,
                        tldr: "The time required is the longest of all the shortest paths.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-22",
                title: "Chapter 22 — Trie Data Structure",
                concepts: [
                    {
                        id: "trie_structure",
                        title: "Trie (Prefix Tree) Structure",
                        icon: GitBranch,
                        color: "#8b5cf6",
                        description: "A **Trie** (pronounced 'Try') is a tree specifically built for incredibly fast String/Prefix searching.\n\nEvery node represents a single letter. To spell \"cat\", you traverse Root -> 'c' -> 'a' -> 't'. A boolean flag `isEndOfWord` tells you if the path you traversed is a legitimate dictionary word, or just the prefix of a longer word.",
                        code: `class TrieNode {\n  constructor() {\n    this.children = {}; // keys: 'a' to 'z'\n    this.isEndOfWord = false;\n  }\n}`,
                        tldr: "A tree where edges are letters, used to aggressively search prefixes.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "implement_trie",
                        title: "Implement Trie",
                        icon: Type,
                        color: "#10b981",
                        description: "Problem: Implement `insert`, `search`, and `startsWith` methods.\n\n**Algorithm**: For `insert`, iterate the letters. If child node doesn't exist, create it. At the end of the loop, mark `isEndOfWord=true`.\nFor `search/startsWith`, iterate the letters down the tree. If you ever hit null, return false! If `search` reaches the end, return `isEndOfWord`. If `startsWith` reaches the end, randomly return true.",
                        code: `insert(word) {\n  let curr = this.root;\n  for (let char of word) {\n    if (!curr.children[char]) curr.children[char] = new Node();\n    curr = curr.children[char];\n  }\n  curr.isEndOfWord = true;\n}`,
                        tldr: "Crawl down the tree letter by letter to verify existence.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-23",
                title: "Chapter 23 — Bit Manipulation",
                concepts: [
                    {
                        id: "bitwise_operators",
                        title: "Bitwise Operators",
                        icon: Cpu,
                        color: "#ec4899",
                        description: "Working directly with Binary 1s and 0s using CPU electrical logic!\n\n• `&` AND: 1 if both are 1.\n• `|` OR: 1 if either is 1.\n• `^` XOR: 1 if they are DIFFERENT. (Extremely useful).\n• `<<` LEFT SHIFT: Multiplies by 2.\n• `>>` RIGHT SHIFT: Divides by 2.",
                        code: `  1010  (10)\n& 1100  (12)\n  ---- \n  1000  (8) `,
                        tldr: "Lightning-fast mathematical logic performed at the microchip level.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "single_number",
                        title: "Single number",
                        icon: Zap,
                        color: "#ef4444",
                        description: "Problem: Every element in an array appears twice except for one. Find it without using extra memory.\n\n**Algorithm**: XOR (`^`). XORing a number with itself cancels out to 0. `5 ^ 5 = 0`. `A ^ B ^ A = B`. If you XOR the entire array together, all duplicates will instantly annihilate each other, leaving only the single number behind!",
                        code: `let res = 0;\nfor (let num of nums) res ^= num;\nreturn res;`,
                        tldr: "XOR collapses duplicates into zero.",
                        type: 'practice',
                    },
                    {
                        id: "power_of_two",
                        title: "Power of Two",
                        icon: Calculator,
                        color: "#3b82f6",
                        description: "Problem: Check if a number is a perfect power of two.\n\n**Algorithm**: Powers of two (2, 4, 8, 16) in binary ALWAYS display as a single '1' followed by '0's (e.g. 16 is `10000`). If you subtract 1 from it, it flips (15 is `01111`). If you AND them together (`10000 & 01111`), you always get exactly 0!",
                        code: `return n > 0 && (n & (n - 1)) === 0;`,
                        tldr: "n & (n-1) destroys the lowest set '1' bit.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-24",
                title: "Chapter 24 — Algorithm Patterns",
                concepts: [
                    {
                        id: "two_pointers_sliding_window",
                        title: "Two Pointers & Sliding Window",
                        icon: ArrowRightLeft,
                        color: "#f59e0b",
                        description: "**Two Pointers**: Used on sorted arrays. Put one at the start, one at the end. Step them inward conditionally to hit O(n) instead of O(n²).\n\n**Sliding Window**: A subset of Two Pointers to track subarrays. Expand the 'Right' pointer to swallow data. If the window breaks a rule, shrink the 'Left' pointer until it's valid again. Perfect for \"Longest Substring X\" problems.",
                        code: `// Sliding Window Template\nfor (let right = 0; right < arr.length; right++) {\n  window.add(arr[right]);\n  while (!isValid(window)) {\n    window.remove(arr[left]);\n    left++;\n  }\n  maxOutput = Math.max(maxOutput, right - left + 1);\n}`,
                        tldr: "Worming through an array with a Left and Right index.",
                        type: 'concept',
                    },
                    {
                        id: "prefix_sums",
                        title: "Prefix Sums",
                        icon: Layers,
                        color: "#10b981",
                        description: "Used to instantly answer \"What is the sum of items between index A and index B?\"\n\nInstead of looping A->B every query, loop over the array exactly ONCE, building an ongoing running total array. \nThen: `Sum(A, B) = Prefix[B] - Prefix[A - 1]` in O(1) time!",
                        code: `Arr:    [ 1,  2,  3,  4]\nPrefix: [ 1,  3,  6, 10]\n\nSum of index 1 to 3 -> (10 - 1) = 9!`,
                        tldr: "Pre-calculate a running total to do instant range lookups.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "longest_substring",
                        title: "Longest Substring Without Repeats",
                        icon: Search,
                        color: "#8b5cf6",
                        description: "Problem: Find the length of the longest substring without repeating characters.\n\n**Algorithm**: Sliding Window + Set. Expand Right index, add char to Set. If char is already in Set, you broke the rule! Shrink the Left index (removing chars from Set) until the duplicate is wiped out. Track the max window size.",
                        code: `while (right < s.length) {\n  while (set.has(s[right])) {\n    set.delete(s[left]);\n    left++;\n  }\n  set.add(s[right]);\n  max = Math.max(max, right - left + 1);\n  right++;\n}`,
                        tldr: "Slide window right, shrink left if duplicate detected.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-25",
                title: "Appendices",
                concepts: [
                    {
                        id: "big_o_cheat_sheet",
                        title: "Big O Complexity Cheat Sheet",
                        icon: TerminalSquare,
                        color: "#06b6d4",
                        description: "The ultimate reference guide for Technical Interviews.\n\n**Data Structures**\n• Array/String access: O(1)\n• Array search: O(n)\n• Stack/Queue push/pop: O(1)\n• Hash Map set/get: O(1)\n• Binary Search Tree insert/search: O(log n)\n\n**Sorting**\n• Quick/Merge Sort: O(n log n)\n• Bubble/Selection/Insertion: O(n²)\n\n**Graph Algorithms**\n• BFS/DFS: O(V + E)\n• Dijkstra: O(E log V)",
                        code: `Constant: O(1)\nLogarithmic: O(log n)\nLinear: O(n)\nLinearithmic: O(n log n)\nQuadratic: O(n^2)\nExponential: O(2^n)\nFactorial: O(n!)`,
                        tldr: "Memorize the core Time and Space Complexities.",
                        type: 'concept',
                    },
                ],
                problems: []
            }
        ]
    }
]

// Flat array wrapper with computed numbers so previous components don't break
export type FlatLesson = Lesson & { number: number; chapterTitle: string; sectionTitle: string };

export const lessons: FlatLesson[] = [];
let idx = 1;
courseCurriculum.forEach(part => {
    part.chapters.forEach(chapter => {
        chapter.concepts.forEach(concept => {
            lessons.push({ ...concept, number: idx++, chapterTitle: chapter.title, sectionTitle: "Concepts" });
        });
        (chapter.problems || []).forEach(problem => {
            lessons.push({ ...problem, number: idx++, chapterTitle: chapter.title, sectionTitle: "Practice Problems" });
        });
    });
});

export const chapterInfo = {
    title: "DSA Advanced",
    subtitle: "Conquer Dynamic Programming, Trees, Graphs, and master Technical Interviews.",
    totalLessons: lessons.length,
    estimatedTime: "30+ hours",
    difficulty: "Advanced",
    xpReward: 10000,
}
