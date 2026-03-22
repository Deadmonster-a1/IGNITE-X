import { BookOpen, Code2, Terminal, Target, Award, Brain, Database, Cpu, Network, Briefcase, Zap } from "lucide-react"

export type Concept = {
  title: string
  description: string
  codeSnippet?: string
}

export type Problem = {
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  starterCode?: string
  solutionCode?: string
}

export type Mission = {
  title: string
  description: string
  tasks: string[]
}

export type Chapter = {
  id: string
  title: string
  concepts: Concept[]
  problems?: Problem[]
  missions?: Mission[]
}

export type Part = {
  id: string
  title: string
  chapters: Chapter[]
}

export const javaAdvancedCourseInfo = {
  title: "Java Advanced: Architecture & Frameworks",
  subtitle: "Master Design Patterns, Concurrency, JVM Internals, and Spring Boot to engineer production-ready Java applications.",
  totalLessons: 28,
  estimatedTime: "14 Weeks",
  difficulty: "Advanced",
}

export const javaAdvancedCourseCurriculum: Part[] = [
  {
    id: "part-3",
    title: "PART III — Advanced Java & Frameworks",
    chapters: [
      {
        id: "ch22-design-patterns",
        title: "Chapter 22 — Advanced OOP & Design Patterns",
        concepts: [
          {
            title: "SOLID Principles",
            description: "The 5 pillars of object-oriented class design: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
            codeSnippet: `// Single Responsibility
class InvoiceTracker { ... }
class InvoicePrinter { ... }`
          },
          {
            title: "Creational Patterns",
            description: "Singleton, Factory Method, Abstract Factory, and Builder patterns for flexible object creation.",
            codeSnippet: `// Singleton Pattern
public class DatabaseManager {
    private static DatabaseManager instance;
    private DatabaseManager() {}
    public static synchronized DatabaseManager getInstance() {
        if (instance == null) instance = new DatabaseManager();
        return instance;
    }
}`
          },
          {
            title: "Structural & Behavioral Patterns",
            description: "Adapter, Decorator, Observer, and Strategy patterns for flexible system architecture.",
            codeSnippet: `// Strategy Pattern
interface PaymentStrategy { void pay(int amount); }
class CreditCardStrategy implements PaymentStrategy { ... }`
          }
        ],
        missions: [
          {
            title: "Build a Customizable Logger System",
            description: "Use the Singleton and Factory patterns to construct a system-wide logger that can format text to XML, JSON, or plaintext.",
            tasks: [
              "Create the Logger Singleton.",
              "Construct a Formatter Factory.",
              "Implement Strategy for different output streams."
            ]
          }
        ]
      },
      {
        id: "ch23-concurrency",
        title: "Chapter 23 — Multithreading & Concurrency",
        concepts: [
          {
            title: "Thread Lifecycle & Runnables",
            description: "Creating threads using the Thread class vs. implementing the Runnable interface. Understanding thread states (NEW, RUNNABLE, BLOCKED, WAITING).",
            codeSnippet: `Thread t1 = new Thread(() -> {
    System.out.println("Running asynchronously!");
});
t1.start();`
          },
          {
            title: "Synchronization & Locks",
            description: "Preventing race conditions using the 'synchronized' keyword, ReentrantLock, and volatile variables.",
            codeSnippet: `private final ReentrantLock lock = new ReentrantLock();

public void safeIncrement() {
    lock.lock();
    try { count++; } 
    finally { lock.unlock(); }
}`
          },
          {
            title: "Executors & Futures",
            description: "Managing thread pools with the ExecutorService interface and handling asynchronous results with Callable and Future mechanisms.",
            codeSnippet: `ExecutorService executor = Executors.newFixedThreadPool(4);
Future<Integer> result = executor.submit(() -> 42);`
          }
        ],
        problems: [
          {
            title: "Producer-Consumer BlockingQueue",
            description: "Implement the Producer-Consumer pattern using a thread-safe ArrayBlockingQueue.",
            difficulty: "Medium"
          }
        ]
      },
      {
        id: "ch24-jvm-tuning",
        title: "Chapter 24 — JVM Internals & Performance Tuning",
        concepts: [
          {
            title: "Memory Architecture Deep Dive",
            description: "Eden Space, Survivor Spaces, Old Generation (Tenured), and Metaspace.",
            codeSnippet: `// JVM Flags to analyze memory
// -Xms4G -Xmx4G -XX:+PrintGCDetails`
          },
          {
            title: "Garbage Collectors",
            description: "Comparing Serial GC, Parallel GC, G1 GC, and ZGC (Z Garbage Collector) behaviors in production environments."
          },
          {
            title: "JIT Compilation",
            description: "Just-In-Time compiler loop unrolling, method inlining, and escape analysis optimization."
          }
        ]
      },
      {
        id: "ch25-modern-java",
        title: "Chapter 25 — Modern Java Features",
        concepts: [
          {
            title: "Lambdas & Functional Interfaces",
            description: "Simplifying anonymous inner classes using syntax introduced in Java 8.",
            codeSnippet: `List<String> names = Arrays.asList("Alice", "Bob");
names.forEach(name -> System.out.println(name));`
          },
          {
            title: "Streams API",
            description: "Declarative, functional-style processing of collections via map, filter, and reduce.",
            codeSnippet: `int sum = numbers.stream()
    .filter(n -> n % 2 == 0)
    .mapToInt(n -> n * 2)
    .sum();`
          },
          {
            title: "Records & Sealed Classes",
            description: "Immutable data carriers (Records) and restricted inheritance hierarchies (Sealed classes) from Java 14+.",
            codeSnippet: `public record Point(int x, int y) {}`
          }
        ]
      },
      {
        id: "ch26-io-nio",
        title: "Chapter 26 — File I/O and Networking",
        concepts: [
          {
            title: "java.io vs java.nio",
            description: "Blocking I/O Streams vs. Non-blocking Channels and Buffers."
          },
          {
            title: "Socket Programming",
            description: "Establishing TCP connections using ServerSocket and Socket for client-server communication.",
            codeSnippet: `try (ServerSocket server = new ServerSocket(8080)) {
    Socket client = server.accept();
    // Handle client data buffer
}`
          }
        ]
      },
      {
        id: "ch27-spring-boot",
        title: "Chapter 27 — Spring Boot & Microservices",
        concepts: [
          {
            title: "Inversion of Control & DI",
            description: "Dependency Injection via the Spring ApplicationContext and Autowiring.",
            codeSnippet: `@Service
public class UserService {
    private final UserRepository repository;
    
    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}`
          },
          {
            title: "Building REST APIs",
            description: "Creating web endpoints using @RestController, @GetMapping, and @PostMapping.",
            codeSnippet: `@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) { ... }
}`
          },
          {
            title: "Spring Data JPA",
            description: "Abstracting database interactions with Hibernate implementations.",
            codeSnippet: `public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByEmailEndingWith(String domain);
}`
          }
        ],
        missions: [
          {
            title: "Microservice API Deployment",
            description: "Construct a complete RESTful API capable of CRUD operations, backed by an embedded H2 SQL database.",
            tasks: [
              "Create Entity and JPA Repository.",
              "Implement Service Layer logic.",
              "Expose endpoints in a REST Controller."
            ]
          }
        ]
      }
    ]
  }
]
