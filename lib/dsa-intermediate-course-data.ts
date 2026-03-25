import {
    Lightbulb, Coffee, ArrowRightLeft, Ruler, ListChecks, FileText,
    GitBranch, Trophy, CheckCircle, GraduationCap, TerminalSquare,
    Calculator, Thermometer, Box, Database, Clock, LayoutList, Type,
    Search, ArrowUpDown, RefreshCcw, Lock, Code2, Cpu, Hash, Target,
    Network, Layers, GitMerge, SortAsc, Zap, Braces
} from "lucide-react"

export const courseInfo = {
    title: "DSA Intermediate: Core Data Structures",
    subtitle: "Master the foundational structures that power scalable systems.",
    totalLessons: 54,
    estimatedTime: "25+ hours",
    difficulty: "Intermediate",
    totalXP: 35000,
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
        id: "part-2",
        title: "PART II — Core Data Structures (Intermediate)",
        chapters: [
            {
                id: "chap-9",
                title: "Chapter 9 — Linked Lists",
                concepts: [
                    {
                        id: "node_structure",
                        title: "Node Structure",
                        icon: Box,
                        color: "#ef4444",
                        description: "Unlike Arrays, elements in a Linked List are not stored next to each other in memory.\n\nInstead, each element is a **Node**. A node contains two parts:\n• **Data**: The actual value you want to store.\n• **Pointer (Next)**: A reference (memory address) to the *next* node in the sequence.\n\nBecause they aren't contiguous, you can't access `list[5]` instantly. You must start at the head and walk node by node.",
                        code: `class Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}\n\n// Creating a node\nlet startNode = new Node(10);`,
                        tldr: "A Node holds data and a pointer pointing to the next item.",
                        type: 'concept',
                    },
                    {
                        id: "singly_linked_list",
                        title: "Singly Linked List",
                        icon: ArrowRightLeft,
                        color: "#3b82f6",
                        description: "A **Singly Linked List** is a chain of nodes pointing in one direction.\n\nKey properties:\n• **Head**: The very first node. If you lose the head, you lose the whole list!\n• **Tail**: The last node. Its `next` pointer is usually `null`.\n\nWalking the list (traversal) takes O(n) time.",
                        code: `Head -> [10|*] -> [20|*] -> [30|null]\n\nlet head = new Node(10);\nhead.next = new Node(20);\nhead.next.next = new Node(30);`,
                        tldr: "A one-way chain of nodes, starting from the Head.",
                        type: 'concept',
                    },
                    {
                        id: "doubly_linked_list",
                        title: "Doubly Linked List",
                        icon: GitBranch,
                        color: "#10b981",
                        description: "A **Doubly Linked List** gives each node *two* pointers: one pointing forward (`next`) and one pointing backward (`prev`).\n\nThis uses more memory, but it allows you to traverse the list backwards easily, and makes deleting a specific node easier because you already know its predecessor.",
                        code: `class ListNode {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n    this.prev = null;\n  }\n}\n\nnull <- [Prev|10|Next] <-> [Prev|20|Next] -> null`,
                        tldr: "Nodes point both forwards and backwards.",
                        type: 'concept',
                    },
                    {
                        id: "linked_list_insert_delete",
                        title: "Insertions and Deletions",
                        icon: LayoutList,
                        color: "#f59e0b",
                        description: "The superpower of Linked Lists: **Fast Insertions and Deletions**.\n\nUnlike Arrays where you have to shift millions of elements, in a Linked List, you just snap the pointers and wire them to the new node. If you already have the reference to the insertion point, it takes **O(1)** time.\n\nHowever, *finding* the insertion point still takes O(n) traversing.",
                        code: `// Insert 'B' between 'A' and 'C'\n// A -> C becomes A -> B -> C\n\nlet nodeB = new Node('B');\nnodeB.next = nodeA.next; // B points to C\nnodeA.next = nodeB;      // A points to B`,
                        tldr: "Insertions/Deletions are O(1) if you already hold the reference node.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "reverse_linked_list",
                        title: "Reverse linked list",
                        icon: RefreshCcw,
                        color: "#8b5cf6",
                        description: "Problem: Reverse a singly linked list so the tail becomes the head.\n\n**Algorithm**: Three pointers (`prev`, `curr`, `next`).\n1. Save `curr.next` to `next` so you don't lose the rest of the list.\n2. Flip `curr.next` to point backwards to `prev`.\n3. Shift `prev` and `curr` forward by one step.\n4. Repeat until `curr` is null.",
                        code: `let prev = null;\nlet curr = head;\n\nwhile (curr !== null) {\n  let nextTemp = curr.next;\n  curr.next = prev;\n  prev = curr;\n  curr = nextTemp;\n}\nreturn prev; // new head`,
                        tldr: "Use three pointers to flip the arrows backward step by step.",
                        type: 'practice',
                    },
                    {
                        id: "detect_cycle",
                        title: "Detect cycle",
                        icon: Search,
                        color: "#ef4444",
                        description: "Problem: Determine if a linked list has a cycle (if the tail points back to a middle node unexpectedly giving you an infinite loop).\n\n**Floyd's Tortoise and Hare Algorithm**:\nSend two pointers down the list. `slow` moves 1 step at a time. `fast` moves 2 steps. If there is a cycle, the fast pointer will eventually \"lap\" the slow pointer and they will meet. If `fast` reaches `null`, there is no cycle.",
                        code: `let slow = head, fast = head;\n\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) {\n    return true; // Cycle detected!\n  }\n}\nreturn false;`,
                        tldr: "The slow and fast pointer approach catches infinite loops.",
                        type: 'practice',
                    },
                    {
                        id: "find_middle_node",
                        title: "Find middle node",
                        icon: Target,
                        color: "#06b6d4",
                        description: "Problem: Find the middle node of a linked list in one pass.\n\n**Algorithm**: Two pointers again! `slow` moves 1 step, `fast` moves 2 steps. When `fast` reaches the end of the list, `slow` will be standing exactly in the middle.",
                        code: `let slow = head, fast = head;\n\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n}\nreturn slow; // The middle node!`,
                        tldr: "When the fast pointer reaches the end, the slow pointer is halfway there.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-10",
                title: "Chapter 10 — Stacks",
                concepts: [
                    {
                        id: "stack_basics",
                        title: "Stack basics",
                        icon: Layers,
                        color: "#ec4899",
                        description: "A **Stack** is a data structure that follows the **LIFO** principle (Last In, First Out).\n\nThink of a stack of plates in a cafeteria. You can only add a plate to the top, and you can only take a plate off the top. The last plate you put down is the first one you pick up.",
                        code: `// Stack Operations:\npush(item) // Add to top\npop()      // Remove and return top\npeek()     // Look at top without removing\nisEmpty()  // Check if stack is empty`,
                        tldr: "LIFO: Last In, First Out.",
                        type: 'concept',
                    },
                    {
                        id: "stack_implementation",
                        title: "Implementation",
                        icon: Code2,
                        color: "#10b981",
                        description: "Stacks can be implemented using either an **Array** or a **Linked List**.\n\nWith an array, you `push` elements to the end and `pop` from the end (both O(1)).\nWith a linked list, you insert at the head and remove from the head (both O(1)).",
                        code: `// Array Implementation (JavaScript)\nlet stack = [];\n\nstack.push(10); // [10]\nstack.push(20); // [10, 20]\n\nlet top = stack.pop(); // returns 20. Stack is [10]`,
                        tldr: "Usually backed by an Array or Linked List for O(1) operations.",
                        type: 'concept',
                    },
                    {
                        id: "stack_applications",
                        title: "Applications",
                        icon: GitBranch,
                        color: "#f59e0b",
                        description: "Stacks are used everywhere in computer science!\n\n• **Undo mechanisms**: Press Ctrl+Z? The computer pops your last action off the \"Undo Stack\".\n• **Browser History**: Pressing the back button pops the current page off the stack.\n• **Call Stack**: Keeping track of which function called which function.\n• **Syntax checking**: Matching opening and closing brackets.",
                        code: `// Browser History\nhistory.push('google.com')\nhistory.push('youtube.com')\nhistory.pop() // returns you to google.com`,
                        tldr: "Stacks power \"Undo\", browser history, and recursion.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "valid_parentheses",
                        title: "Valid parentheses",
                        icon: CheckCircle,
                        color: "#3b82f6",
                        description: "Problem: Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\n**Algorithm**:\nUse a Stack. Iterate over the string. If you see an opening bracket, push it onto the stack. If you see a closing bracket, pop the top of the stack and see if they match. If they don't, or if the stack is empty, it's invalid.",
                        code: `// Example String: "({[]})"\n\Push '(', push '{', push '['\nSee ']'. Pop stack ('['). Matches!\nSee '}'. Pop stack ('{'). Matches!\nSee ')'. Pop stack ('('). Matches!\nStack is empty -> Valid!`,
                        tldr: "Push opening brackets. Pop on closing brackets and verify matches.",
                        type: 'practice',
                    },
                    {
                        id: "next_greater_element",
                        title: "Next greater element",
                        icon: ArrowRightLeft,
                        color: "#8b5cf6",
                        description: "Problem: Find the next greater element for every element in an array.\n\n**Algorithm**: Monotonic Stack.\nLoop through from right to left. While the top of the stack is smaller or equal to the current element, pop it. The condition guarantees the stack only contains elements larger than the current. The next greater is the top of the stack.",
                        code: `nums = [2, 1, 2, 4, 3]\n// We want output: [4, 2, 4, -1, -1]`,
                        tldr: "Use a Monotonic Stack to keep track of elements that haven't found their greater match yet.",
                        type: 'practice',
                    },
                    {
                        id: "reverse_stack",
                        title: "Reverse a stack",
                        icon: RefreshCcw,
                        color: "#ef4444",
                        description: "Problem: Reverse a stack using only stack operations (push and pop), without using extra data structures.\n\n**Algorithm**:\nUse recursion! Pop the top element and ask recursion to reverse the rest. Once the recursion bottoms out, use a helper recursive function to insert the popped element at the *bottom* of the now-reversed stack.",
                        code: `function reverse(stack) {\n  if (stack.isEmpty()) return;\n  let temp = stack.pop();\n  reverse(stack);\n  insertAtBottom(stack, temp);\n}`,
                        tldr: "Complex logic using the Call Stack to keep hold of temporary items.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-11",
                title: "Chapter 11 — Queues",
                concepts: [
                    {
                        id: "queue_basics",
                        title: "Queue basics",
                        icon: ArrowRightLeft,
                        color: "#10b981",
                        description: "A **Queue** follows the **FIFO** principle (First In, First Out).\n\nThink of a line of people waiting for tickets. The first person to join the line is the first person to get served. You enqueue (join) at the back, and dequeue (leave) from the front.",
                        code: `// Queue Operations:\nenqueue(item) // Add to the back\ndequeue()     // Remove from the front\nfront()       // Look at the front item`,
                        tldr: "FIFO: First In, First Out.",
                        type: 'concept',
                    },
                    {
                        id: "circular_queue",
                        title: "Circular queue",
                        icon: RefreshCcw,
                        color: "#f59e0b",
                        description: "A normal array-based queue suffers from a major flaw: when you dequeue items from the front, the array gets 'empty' at the front, but your pointers keep creeping to the right until you run out of array space.\n\nA **Circular Queue** wraps around. When the tail reaches the end of the array, it circles back to index 0, reusing the empty spots.",
                        code: `Array Size: 5\n[ X ][ 20 ][ 30 ][ 40 ][ 50 ]\n\nEnqueue 60. Normal array crashes. \nCircular queue writes to index 0!\n[ 60 ][ 20 ][ 30 ][ 40 ][ 50 ]`,
                        tldr: "Reuses empty front indices by circling the tail pointer back to index 0.",
                        type: 'concept',
                    },
                    {
                        id: "deque",
                        title: "Deque (Double Ended Queue)",
                        icon: ArrowUpDown,
                        color: "#3b82f6",
                        description: "A **Deque** (pronounced 'deck') allows insertions and deletions from BOTH ends (front and back).\n\nIt is the flexible hybrid of a Stack and a Queue.",
                        code: `// Deque Operations:\naddFront(item)\naddRear(item)\nremoveFront()\nremoveRear()`,
                        tldr: "You can push and pop from both ends of the list.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "implement_queue",
                        title: "Implement queue using Stacks",
                        icon: LayoutList,
                        color: "#ec4899",
                        description: "Problem: Implement a Queue using only two Stacks.\n\n**Algorithm**:\nLet's call them Stack1 (input) and Stack2 (output).\nTo enqueue: Push to Stack1.\nTo dequeue: If Stack2 is empty, pop EVERYTHING from Stack1 and push it into Stack2. This completely reverses the order (making the oldest item the top of Stack2). Then pop from Stack2.",
                        code: `Enqueue 1, 2, 3 -> Stack1: [1, 2, 3]\n\nDequeue:\nStack1 pops, Stack2 pushes -> Stack2: [3, 2, 1]\nPop Stack2 -> returns 1!`,
                        tldr: "Pour elements from the input stack into the output stack to reverse them.",
                        type: 'practice',
                    },
                    {
                        id: "sliding_window_maximum",
                        title: "Sliding window maximum",
                        icon: Search,
                        color: "#ef4444",
                        description: "Problem: Given an array and a sliding window of size k, find the maximum element in each window as it slides left to right.\n\n**Algorithm**:\nUse a Deque! Maintain indices of useful elements in the deque. The front of the deque will always hold the index of the maximum element for the current window. Remove elements from the back if they are smaller than the current element (they are useless now).",
                        code: `Arr: [1, 3, -1, -3, 5, 3, 6, 7], k=3\nOutput ranges sliding by 1 index...`,
                        tldr: "Use a Deque to dynamically track the largest elements in the window.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-12",
                title: "Chapter 12 — Hash Tables",
                concepts: [
                    {
                        id: "hash_functions",
                        title: "Hash Functions",
                        icon: Calculator,
                        color: "#8b5cf6",
                        description: "A **Hash Table** gives you incredibly fast (O(1)) lookups using a **Hash Function**.\n\nA Hash Function takes a key (like the string \"Alice\"), crunches it mathematically, and outputs an integer index (like 4). The table stores Alice's data exactly at index 4 of its internal array.\n\nNext time you ask for \"Alice\", it runs \"Alice\" through the math, gets 4 again, and instantly pulls the data.",
                        code: `Key = "Alice"\nMath: (65 + 108 + 105 + 99 + 101) % Size\nHash = 4\n\nArray[4] = data`,
                        tldr: "A math function translates keys directly into memory array indices.",
                        type: 'concept',
                    },
                    {
                        id: "collision_handling",
                        title: "Collision Handling",
                        icon: GitMerge,
                        color: "#ef4444",
                        description: "What happens if two totally different keys math out to the *same* index? This is a **Collision**.\n\nAlgorithms handle this in two main ways:\n1. **Chaining**: Each array index actually holds a Linked List. If two items land there, they just link together.\n2. **Open Addressing**: If the index is full, look for the next available empty spot (`index + 1`, `index + 2`).",
                        code: `Index 4 -> [ "Alice" ] -> [ "Bob" ]\n(This is separate chaining, they both hashed to index 4!)`,
                        tldr: "Different keys mapping to the same index require fallbacks like Chaining.",
                        type: 'concept',
                    },
                    {
                        id: "hash_maps",
                        title: "Hash Maps (Dictionaries)",
                        icon: Database,
                        color: "#10b981",
                        description: "A **Hash Map** stores data in **Key-Value pairs**.\n\nEvery key is unique. The key is hashed to find the location, and the value is stored there. If you reassign the key, it overwrites the value.\n• Time complexity for Insert: O(1)\n• Time complexity for Get: O(1)",
                        code: `map["apple"] = "A red fruit"\nmap["dog"] = "An animal"\n\nprint(map["dog"]) // instantly O(1)`,
                        tldr: "The ultimate O(1) Key-Value storage system.",
                        type: 'concept',
                    },
                    {
                        id: "hash_sets",
                        title: "Hash Sets",
                        icon: Box,
                        color: "#3b82f6",
                        description: "A **Hash Set** is identical to a Hash Map, but it *only* stores Keys, no Values.\n\nIt is perfect for answering questions like \"Have I seen this item before?\" because you can check membership in O(1) time.",
                        code: `let seen = new Set();\nseen.add(10);\nseen.add(20);\n\nif (seen.has(10)) { ... } // instant O(1)`,
                        tldr: "A collection of unique keys allowing O(1) existence checks.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "two_sum",
                        title: "Two Sum",
                        icon: Search,
                        color: "#f59e0b",
                        description: "Problem: Given an array of integers and a target, return indices of the two numbers such that they add up to target.\n\n**Algorithm**:\nUse a Hash Map! As you iterate the array, calculate the `complement` (target - current). Check if the `complement` already exists in the map. If it does, you're done! If not, save the current number and its index in the map.",
                        code: `Arr: [2, 7, 11, 15], Target: 9\n\nRead 2: Want 7. Map empty. Map[2]=0.\nRead 7: Want 2. 2 is in map at index 0! Return [0, 1].`,
                        tldr: "Hash the elements you've seen so you can look backwards in O(1) time.",
                        type: 'practice',
                    },
                    {
                        id: "frequency_counter",
                        title: "Frequency counter",
                        icon: ListChecks,
                        color: "#ec4899",
                        description: "Problem: Count how many times each character appears in a string.\n\n**Algorithm**:\nInitialize an empty Hash Map. Traverse the string. For each character, if it exists in the map, increment its value by 1. If it doesn't exist, set it to 1.",
                        code: `String: "AAB"\nMap = {}\n\nRead 'A' -> Map['A'] = 1\nRead 'A' -> Map['A'] = 2\nRead 'B' -> Map['B'] = 1`,
                        tldr: "Use a Hash Map to tally elements in one single O(n) pass.",
                        type: 'practice',
                    },
                    {
                        id: "group_anagrams",
                        title: "Group anagrams",
                        icon: Layers,
                        color: "#8b5cf6",
                        description: "Problem: Group an array of strings into arrays of anagrams.\n\n**Algorithm**:\nCreate a Hash Map where the KEY is the *sorted version* of a string, and the VALUE is an array of the original strings.\nFor each string, sort its letters. Use that as the dictionary key to group them together.",
                        code: `"eat", "tea", "tan", "ate", "nat", "bat"\n\nSorted "eat" -> "aet"\nSorted "tea" -> "aet"\nMap["aet"] = ["eat", "tea", "ate"]`,
                        tldr: "Sort the word to use as the grouping Key in a Hash Map.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-13",
                title: "Chapter 13 — Trees",
                concepts: [
                    {
                        id: "binary_trees",
                        title: "Binary Trees",
                        icon: GitBranch,
                        color: "#10b981",
                        description: "A **Tree** is a hierarchical data structure. Instead of next/prev, a Node has `children`.\n\nIn a **Binary Tree**, each node can have at most *two* children (Left and Right).\n\n• **Root**: The topmost node.\n• **Leaf**: A node with NO children at the very bottom.",
                        code: `class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}`,
                        tldr: "Nodes branch into left and right children instead of a straight line.",
                        type: 'concept',
                    },
                    {
                        id: "tree_traversals",
                        title: "Tree Traversals",
                        icon: ArrowUpDown,
                        color: "#3b82f6",
                        description: "How do you read all the elements of a tree?\n\n**Depth First Search (DFS)**\nGoes deep to the leaves before exploring neighbors. Done using Recursion.\n• *Pre-Order*: Root, Left, Right\n• *In-Order*: Left, Root, Right\n• *Post-Order*: Left, Right, Root\n\n**Breadth First Search (BFS)**\nReads the tree Level-by-Level (top row, then second row, etc). Done using a Queue.",
                        code: `// In-Order Traversal (DFS)\nfunction inOrder(node) {\n  if (!node) return;\n  inOrder(node.left);\n  console.log(node.val);\n  inOrder(node.right);\n}`,
                        tldr: "DFS dives deep using Recursion. BFS scans wide using a Queue.",
                        type: 'concept',
                    },
                    {
                        id: "tree_height_depth",
                        title: "Tree Height and Depth",
                        icon: Ruler,
                        color: "#f59e0b",
                        description: "• **Depth**: The number of edges from the Root down to a specific node.\n• **Height**: The number of edges on the longest downward path from a specific node to a Leaf.\n\nCalculating the max height of a tree is a classic recursive problem: `1 + max(height(left), height(right))`.",
                        code: `    (Root)  --> height 2\n     /  \\\n   (L)  (R) --> height 1\n   / \n (LL)       --> height 0`,
                        tldr: "Depth looks up to the root. Height looks down to the leaves.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "inorder_traversal",
                        title: "Inorder traversal",
                        icon: RefreshCcw,
                        color: "#ef4444",
                        description: "Problem: Return an array of all values in a tree using In-Order traversal.\n\nRecursively process the Left child, process the current node, then recursively process the Right child.",
                        code: `function traverse(node, res) {\n  if (!node) return;\n  traverse(node.left, res);\n  res.push(node.val);\n  traverse(node.right, res);\n}`,
                        tldr: "Left, Root, Right.",
                        type: 'practice',
                    },
                    {
                        id: "height_of_tree",
                        title: "Height of a tree",
                        icon: Ruler,
                        color: "#8b5cf6",
                        description: "Problem: Find the maximum depth of a binary tree.\n\nAlgorithm: If the node is null, return 0. Otherwise return 1 plus the larger of the left branch's height or the right branch's height.",
                        code: `function maxDepth(node) {\n  if (!node) return 0;\n  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));\n}`,
                        tldr: "Recursively ask children for their heights and add 1.",
                        type: 'practice',
                    },
                    {
                        id: "count_leaf_nodes",
                        title: "Count leaf nodes",
                        icon: Target,
                        color: "#ec4899",
                        description: "Problem: Count the total number of leaves (nodes without any children).\n\nIf node is null, return 0. If both node.left and node.right are null, it's a leaf -> return 1! Otherwise return the sum of the leaves on the left and right.",
                        code: `function countLeaves(node) {\n  if (!node) return 0;\n  if (!node.left && !node.right) return 1;\n  return countLeaves(node.left) + countLeaves(node.right);\n}`,
                        tldr: "A Leaf is a node where Left=null and Right=null.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-14",
                title: "Chapter 14 — Binary Search Trees (BST)",
                concepts: [
                    {
                        id: "bst_properties",
                        title: "BST Properties",
                        icon: Target,
                        color: "#ef4444",
                        description: "A **Binary Search Tree** is a Binary Tree with one massive rule:\n\nFor every single node:\n• ALL elements in the Left subtree must be SMALLER.\n• ALL elements in the Right subtree must be LARGER.\n\nBecause of this rule, doing an In-Order traversal of a BST will always print the items in PERFECT sorted order!",
                        code: `      [10]\n     /    \\\n   [5]    [15]\n   / \\    /  \\\n [2] [7] [12] [20]`,
                        tldr: "Left is smaller, Right is larger.",
                        type: 'concept',
                    },
                    {
                        id: "bst_searching",
                        title: "Searching in a BST",
                        icon: Search,
                        color: "#3b82f6",
                        description: "Searching is incredibly fast (O(log n)), just like Binary Search on an array.\n\nStart at the root.\n• Is it your target? Win.\n• Is target smaller? Go Left.\n• Is target larger? Go Right.\nIf you hit null, the value isn't in the tree.",
                        code: `search(node, target)\n  if (!node) return false\n  if (target === node.val) return true\n  if (target < node.val) return search(node.left, target)\n  return search(node.right, target)`,
                        tldr: "If it's smaller, go left. If it's bigger, go right.",
                        type: 'concept',
                    },
                    {
                        id: "bst_insertion_deletion",
                        title: "Insertion & Deletion",
                        icon: LayoutList,
                        color: "#f59e0b",
                        description: "**Insertion** is easy: Just follow the BST rules (left if smaller, right if bigger) until you hit `null`, and place the new node there.\n\n**Deletion** is harder. If the node has 2 children, you must find its In-Order Successor (the smallest element in its right subtree), copy that value, and delete the successor instead.",
                        code: `// Insertion strategy\nTraverse exactly like searching.\nWhen a child is null, assign new Node(val) to it.`,
                        tldr: "Insertion is like a failed search where you build a new home at the end.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "validate_bst",
                        title: "Validate BST",
                        icon: CheckCircle,
                        color: "#10b981",
                        description: "Problem: Given a Binary Tree, determine if it is a valid BST.\n\n**Algorithm**:\nA node must be between a `MIN` and `MAX` range. As you traverse left, update the MAX to be the parent's value. As you traverse right, update the MIN to be the parent's value.",
                        code: `isValid(node, min=-Infinity, max=Infinity)\n  if (!node) return true\n  if (node.val <= min || node.val >= max) return false\n  return isValid(node.left, min, node.val) \n      && isValid(node.right, node.val, max)`,
                        tldr: "Pass down MIN and MAX boundaries during recursive checks.",
                        type: 'practice',
                    },
                    {
                        id: "lowest_common_ancestor",
                        title: "Lowest common ancestor",
                        icon: GitBranch,
                        color: "#ec4899",
                        description: "Problem: Find the lowest common ancestor (LCA) of two given nodes in a BST.\n\n**Algorithm**:\nStart from the root. If both nodes are smaller than root, LCA must be in the left subtree. If both are larger, LCA must be in the right. If one is smaller and one is larger, the current node IS the split point (the LCA)!",
                        code: `findLCA(node, p, q)\n  if (p.val < node.val && q.val < node.val)\n      return findLCA(node.left, p, q)\n  if (p.val > node.val && q.val > node.val)\n      return findLCA(node.right, p, q)\n  return node`,
                        tldr: "The LCA is the exact node where the paths to P and Q diverge.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-15",
                title: "Chapter 15 — Heaps",
                concepts: [
                    {
                        id: "heap_properties",
                        title: "Heap Basics (Min & Max)",
                        icon: SortAsc,
                        color: "#8b5cf6",
                        description: "A **Heap** is a special tree-based structure.\n\n• **Max Heap**: The parent is ALWAYS greater than or equal to its children. (Root is the absolute maximum element).\n• **Min Heap**: The parent is ALWAYS smaller than or equal to its children. (Root is the absolute minimum element).\n\nHeaps are extremely good at one thing: instantly giving you the Max or Min element in O(1) time.",
                        code: `    (100)  <-- Max Heap Root\n    /   \\\n  (40)  (50)\n  / \\\n(10)(15)`,
                        tldr: "A tree where the largest (or smallest) element bubbles to the root.",
                        type: 'concept',
                    },
                    {
                        id: "heap_operations",
                        title: "Heap Operations",
                        icon: LayoutList,
                        color: "#3b82f6",
                        description: "**Insert (O(log n))**: Add the new element to the very bottom, then continuously swap it with its parent until the heap rule is satisfied (`heapify-up`).\n\n**Extract (O(log n))**: Remove the root. Move the very last element to the root, then continuously swap it with its largest child until the rule is satisfied (`heapify-down`).",
                        code: `// Extract Max\nlet max = heap[0];\nheap[0] = heap.pop();\nheapifyDown();`,
                        tldr: "Items inserted bubble UP. Items extracted cause the last item to bubble DOWN.",
                        type: 'concept',
                    },
                    {
                        id: "priority_queues",
                        title: "Priority Queues",
                        icon: ListChecks,
                        color: "#ef4444",
                        description: "A **Priority Queue** is a wrapper around a Heap. \n\nInstead of a normal queue (FIFO), a Priority Queue serves the item with the \"Highest Priority\" first, regardless of when it arrived (e.g., VIPs boarding an airplane). Heaps are the perfect data structure for this.",
                        code: `pq.insert("Patient A", priority=2)\npq.insert("Patient B", priority=10)\n\n// Returns Patient B instantly!\npq.extractMax()`,
                        tldr: "Queues where VIPs skip the line, powered by Heaps.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "k_largest_elements",
                        title: "K largest elements",
                        icon: Copy, // Note: using LayoutList or Hash as placeholders
                        color: "#f59e0b",
                        description: "Problem: Find the K largest elements in an unsorted array.\n\n**Algorithm**: Use a Min-Heap of size K.\nIterate the array. Insert each element into the Min-Heap. If the heap size exceeds K, extract the minimum (the root). By the end, the heap will only contain the K largest elements! Time is O(n log k).",
                        code: `let minHeap = new MinHeap()\nfor num in array:\n  minHeap.push(num)\n  if minHeap.size() > K:\n    minHeap.pop() // throws away smaller items`,
                        tldr: "Maintain a Min-Heap of size K, rejecting smaller elements.",
                        type: 'practice',
                    },
                    {
                        id: "top_k_frequent",
                        title: "Top K frequent numbers",
                        icon: Target,
                        color: "#10b981",
                        description: "Problem: Given an array, return the K most frequent elements.\n\n**Algorithm**:\n1. Use a Hash Map to count the frequencies.\n2. Put those frequencies into a Min-Heap of size K (just like the previous problem).\n3. Return the surviving elements in the heap.",
                        code: `map counts: { '1': 3, '2': 2, '3': 1 }\nHeap stores pairs: [frequency, value]`,
                        tldr: "Count with Hash Map, isolate top K with Min-Heap.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-16",
                title: "Chapter 16 — Graph Fundamentals",
                concepts: [
                    {
                        id: "graph_terminology",
                        title: "Graph Terminology",
                        icon: Network,
                        color: "#ec4899",
                        description: "A **Graph** is a network of **Nodes** (Vertices) connected by **Edges**.\n\nThink of a map: Cities are Vertices, highways are Edges.\n• **Directed**: Edges are one-way streets (Twitter followers).\n• **Undirected**: Edges are two-way roads (Facebook friends).\n• **Weighted**: Edges have a cost/distance (Google Maps distance).",
                        code: `Vertices: A, B, C, D\nEdges: (A-B), (A-C), (C-D)`,
                        tldr: "Vertices connected by Edges. Can have directions and weights.",
                        type: 'concept',
                    },
                    {
                        id: "adjacency_list",
                        title: "Adjacency List",
                        icon: ListChecks,
                        color: "#3b82f6",
                        description: "How do we store graphs in code? Usually an **Adjacency List**.\n\nIt is just an Array (or Hash Map) where `index V` stores a list of all neighbors connected to `V`.",
                        code: `// Adjacency List for Directed Graph\ngraph = {\n  'A': ['B', 'C'],\n  'B': ['D'],\n  'C': ['D'],\n  'D': []\n}`,
                        tldr: "A dictionary tracking \"who is connected to who\".",
                        type: 'concept',
                    },
                    {
                        id: "graph_bfs",
                        title: "BFS Traversal",
                        icon: GitBranch,
                        color: "#8b5cf6",
                        description: "**Breadth-First Search (BFS)** explores level by level, radiating outward like a ripple in a pond.\n\nIt is implemented using a **Queue**. Important: You must track `visited` nodes so you don't get stuck in an infinite cycle!",
                        code: `queue = [startNode]\nvisited.add(startNode)\n\nwhile queue not empty:\n  curr = queue.shift()\n  for neighbor in graph[curr]:\n     if unvisited:\n        queue.push(neighbor)\n        visited.add(neighbor)`,
                        tldr: "Radiates outward using a Queue. Finds shortest paths.",
                        type: 'concept',
                    },
                    {
                        id: "graph_dfs",
                        title: "DFS Traversal",
                        icon: ArrowUpDown,
                        color: "#ef4444",
                        description: "**Depth-First Search (DFS)** plunges as deep as possible down one path before hitting a dead end and turning around (backtracking).\n\nIt is implemented using **Recursion** (or a Stack), tracking `visited` nodes.",
                        code: `function DFS(node, visited) {\n  visited.add(node)\n  for (let neighbor of graph[node]) {\n    if (!visited.has(neighbor)) {\n      DFS(neighbor, visited)\n    }\n  }\n}`,
                        tldr: "Dives deep to the end, using Recursion.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "detect_cycle_graph",
                        title: "Detect cycle",
                        icon: RefreshCcw,
                        color: "#f59e0b",
                        description: "Problem: Given an undirected graph, check if it contains a cycle.\n\n**Algorithm**: Traverse using BFS or DFS. If you visit a node that is already in your `visited` set, and it is NOT the direct parent you just came from, you've found a cycle looping backward!",
                        code: `if neighbor is visited && neighbor != parent:\n    return TRUE // Cycle detected!`,
                        tldr: "If you bump into an already visited node that wasn't your parent, it's a loop.",
                        type: 'practice',
                    },
                    {
                        id: "connected_components",
                        title: "Connected components",
                        icon: LayoutList,
                        color: "#10b981",
                        description: "Problem: Find the number of isolated \"islands\" (connected clusters) in a graph.\n\n**Algorithm**: Iterate through all nodes. If a node is unvisited, increment your `islandCount`, and trigger a DFS/BFS to mark its entire \"island\" as visited. Repeat until all nodes are checked.",
                        code: `count = 0\nfor node in allNodes:\n  if !visited.has(node):\n     count++\n     DFS(node) // marks all connected nodes\nreturn count`,
                        tldr: "Every time you launch a fresh DFS/BFS, you found a new disconnected island.",
                        type: 'practice',
                    },
                    {
                        id: "shortest_path_bfs",
                        title: "Shortest path BFS",
                        icon: Ruler,
                        color: "#3b82f6",
                        description: "Problem: Find the shortest path distance between Node A and Node B in an unweighted graph.\n\n**Algorithm**: BFS guarantees that the first time you reach a node, you have taken the shortest possible route! Just track the `distance` alongside the node as you push it into the Queue.",
                        code: `queue = [[startNode, 0]]\n\nwhile queue:\n  [curr, dist] = queue.shift()\n  if curr == target:\n     return dist\n  // push neighbors with dist + 1`,
                        tldr: "BFS naturally discovers nodes in order of their shortest distance.",
                        type: 'practice',
                    },
                ]
            },
            {
                id: "chap-17",
                title: "Chapter 17 — Greedy Algorithms",
                concepts: [
                    {
                        id: "greedy_strategy",
                        title: "Greedy Strategy",
                        icon: Zap,
                        color: "#f59e0b",
                        description: "A **Greedy Algorithm** makes the optimal, \"best-looking\" choice at the current moment, hoping those local optimizations result in a global optimum.\n\nIt never reconsiders or backtracks. Once a choice is made, it's final. (Because of this, greedy algorithms don't work for *every* problem, but when they do, they are incredibly fast O(n log n)).",
                        code: `Scenario: Give $0.85 change using the fewest coins.\nGreedy Choice: Pick the largest coin possible first.\n-> $0.25, $0.25, $0.25, $0.10. Done!`,
                        tldr: "Always take the obviously best immediate choice.",
                        type: 'concept',
                    },
                    {
                        id: "activity_selection",
                        title: "Activity Selection & Scheduling",
                        icon: LayoutList,
                        color: "#3b82f6",
                        description: "A classic Greedy scenario: You have an auditorium and many events with start and end times. How do you fit the maximum number of events?\n\n**The Trick**: Sort the events by END time. Always greedily pick the event that finishes earliest (which leaves the most room for future events).",
                        code: `Sort by EndTime ascending.\ncurrent_end = -1\ncount = 0\n\nfor event in events:\n  if event.start >= current_end:\n     count++\n     current_end = event.end`,
                        tldr: "Always schedule the task that finishes the fastest.",
                        type: 'concept',
                    },
                ],
                problems: [
                    {
                        id: "minimum_platforms",
                        title: "Minimum platforms",
                        icon: ArrowUpDown,
                        color: "#ec4899",
                        description: "Problem: Given arrival and departure times of trains, find the minimum number of platforms required at the station so no train waits.\n\n**Algorithm**: Sort arrivals and departures separately. Use two pointers. If a train arrives before the earliest departure, you need a new platform (platforms++). Otherwise, a train left, so a platform is freed (platforms--).",
                        code: `Sort(arrivals); Sort(departures)\ni = 0; j = 0; platforms = 0; maxP = 0;\n\nwhile (i < N) {\n  if (arr[i] <= dep[j]) {\n    platforms++; i++; maxP = Math.max(maxP, platforms);\n  } else {\n    platforms--; j++;\n  }\n}`,
                        tldr: "Sort events linearly and track active overlaps.",
                        type: 'practice',
                    },
                    {
                        id: "job_scheduling",
                        title: "Job scheduling",
                        icon: Target,
                        color: "#10b981",
                        description: "Problem: Given jobs with deadlines and profits, maximize total profit (1 job takes 1 unit of time).\n\n**Algorithm**: Sort jobs descending by profit. Greedily try to do the highest paying job on its exact deadline day. If the slot is filled, check the day before, and the day before that. If you run out of days, drop the job.",
                        code: `Sort jobs by Profit DESC.\nCheck slots from deadline down to 1.\nIf slot empty -> schedule it & claim profit!`,
                        tldr: "Greedily grab the biggest payoffs and schedule them as late as possible.",
                        type: 'practice',
                    },
                ]
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
    title: "DSA Intermediate",
    subtitle: "Master the foundational structures that power scalable systems.",
    totalLessons: lessons.length,
    estimatedTime: "25+ hours",
    difficulty: "Intermediate",
    xpReward: 7500,
}

import { Copy } from "lucide-react"; // Import for missing Copy component if used
