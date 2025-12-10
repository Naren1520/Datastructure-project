# NexStock - C Backend Technical Documentation

## Deep Dive into C Data Structures and Algorithms

---

## Table of Contents
1. [Memory Layout](#memory-layout)
2. [Data Structures in Detail](#data-structures-in-detail)
3. [Algorithms Explained](#algorithms-explained)
4. [Code Flow Examples](#code-flow-examples)
5. [Performance Analysis](#performance-analysis)

---

## 💾 Memory Layout

### **Product Array in Memory**

```
Inventory Global Variables:
┌──────────────────────────────────────────────────────┐
│ struct Product inventory[MAX]  // MAX = 100          │
│ int count = 0                 // number of products  │
└──────────────────────────────────────────────────────┘

After adding 3 products:

┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY ADDRESS SPACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  inventory[0]  (memory: 0x1000)                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │ id: 1                    (4 bytes, int)  │                   │
│  │ name: "Laptop"          (50 bytes, char)│                   │
│  │ price: 50000.00         (4 bytes, float)│                   │
│  │ quantity: 5             (4 bytes, int)  │                   │
│  └─────────────────────────────────────────┘                   │
│  Total size: 62 bytes                                           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  inventory[1]  (memory: 0x1040)                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │ id: 2                    (4 bytes, int)  │                   │
│  │ name: "Mouse"           (50 bytes, char)│                   │
│  │ price: 500.00           (4 bytes, float)│                   │
│  │ quantity: 25            (4 bytes, int)  │                   │
│  └─────────────────────────────────────────┘                   │
│  Total size: 62 bytes                                           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  inventory[2]  (memory: 0x1080)                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │ id: 3                    (4 bytes, int)  │                   │
│  │ name: "Keyboard"        (50 bytes, char)│                   │
│  │ price: 1200.00          (4 bytes, float)│                   │
│  │ quantity: 15            (4 bytes, int)  │                   │
│  └─────────────────────────────────────────┘                   │
│  Total size: 62 bytes                                           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  count = 3   (tracks how many products are in use)              │
│                                                                  │
│  Unused slots: inventory[3] to inventory[99]                    │
│  (Reserved but empty)                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Rental Array in Memory**

```
Rental Global Variables:
┌──────────────────────────────────────────────────────┐
│ struct Rental rentals[MAX]    // MAX = 100           │
│ int rentalCount = 0           // number of rentals   │
└──────────────────────────────────────────────────────┘

After recording 1 rental:

┌─────────────────────────────────────────────────────────────────┐
│  rentals[0]  (memory: 0x2000)                                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │ rentalId: 1702250400000   (8 bytes, long)        │           │
│  │ productId: 1              (4 bytes, int)         │           │
│  │ productName: "Laptop"    (50 bytes, char)        │           │
│  │ renterName: "John Doe"   (50 bytes, char)        │           │
│  │ rentDate: "2025-12-10"   (20 bytes, char)        │           │
│  │ returnDate: "2025-12-17" (20 bytes, char)        │           │
│  │ phoneNumber: "9876543210"(15 bytes, char)        │           │
│  │ address: "123 Main St"  (100 bytes, char)        │           │
│  │ amountPaid: 5000.00       (4 bytes, float)       │           │
│  │ status: "active"         (20 bytes, char)        │           │
│  └──────────────────────────────────────────────────┘           │
│  Total size: 291 bytes                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

##  Data Structures in Detail

### **1. Product Structure**

#### C Definition (inventory.c)
```c
struct Product {
    int id;              // Unique identifier (1-100)
    char name[50];       // Product name (max 49 chars + null terminator)
    float price;         // Price in currency units (₹)
    int quantity;        // Current stock in units
};
```

#### Equivalent in JavaScript (c-backend.js)
```javascript
// Object structure (after reading from JSON)
{
    id: 1,              // number
    name: "Laptop",     // string
    price: 50000.00,    // number (float equivalent)
    quantity: 5         // number (integer)
}
```

#### Typical Use Cases
```c
// Add a product
struct Product newProduct;
newProduct.id = 1;
strcpy(newProduct.name, "Laptop");  // Copy string (max 49 chars)
newProduct.price = 50000.00;
newProduct.quantity = 5;
inventory[count++] = newProduct;    // count becomes 1

// Access product
struct Product p = inventory[0];
printf("Product: %s, Price: %.2f\n", p.name, p.price);

// Modify quantity
inventory[0].quantity -= 1;  // Sell one item
```

### **2. Rental Structure**

#### C Definition (inventory.c)
```c
struct Rental {
    long rentalId;           // Unique rental ID (timestamp)
    int productId;           // Reference to product being rented
    char productName[50];    // Cached product name
    char renterName[50];     // Name of person renting
    char rentDate[20];       // When rental started (YYYY-MM-DD)
    char returnDate[20];     // When rental should end (YYYY-MM-DD)
    char phoneNumber[15];    // Contact number
    char address[100];       // Delivery/billing address
    float amountPaid;        // Rental fee in currency units
    char status[20];         // "active" or "returned"
};
```

#### Equivalent in JavaScript
```javascript
{
    rentalId: 1702250400000,         // number (long)
    productId: 1,                    // number (int)
    productName: "Laptop",           // string
    renterName: "John Doe",          // string
    rentDate: "2025-12-10",          // string (YYYY-MM-DD)
    returnDate: "2025-12-17",        // string (YYYY-MM-DD)
    phoneNumber: "9876543210",       // string
    address: "123 Main St, City",    // string
    amountPaid: 5000.00,             // number (float)
    status: "active"                 // string
}
```

#### Typical Use Case
```c
// Record a rental
struct Rental newRental;
newRental.rentalId = (long)time(NULL);  // Current timestamp
newRental.productId = 1;
strcpy(newRental.productName, "Laptop");
strcpy(newRental.renterName, "John Doe");
strcpy(newRental.rentDate, "2025-12-10");
strcpy(newRental.returnDate, "2025-12-17");
strcpy(newRental.phoneNumber, "9876543210");
strcpy(newRental.address, "123 Main St, City");
newRental.amountPaid = 5000.00;
strcpy(newRental.status, "active");
rentals[rentalCount++] = newRental;

// Mark rental as returned
rentals[0].status = "returned";  // Just change status
```

---

##  Algorithms Explained

### **Algorithm 1: Add Product**

#### C Implementation (inventory.c)
```c
void addProduct() {
    if (count >= MAX) {
        printf("Inventory full!\n");
        return;
    }

    printf("\nEnter Product ID: ");
    scanf("%d", &inventory[count].id);

    // Check if ID already exists - O(n) linear search
    for (int i = 0; i < count; i++) {
        if (inventory[i].id == inventory[count].id) {
            printf("Product ID already exists!\n");
            return;
        }
    }

    printf("Enter Product Name: ");
    scanf("%s", inventory[count].name);
    printf("Enter Price: ");
    scanf("%f", &inventory[count].price);
    printf("Enter Quantity: ");
    scanf("%d", &inventory[count].quantity);

    count++;  // Increment product count
    printf("Product added successfully.\n");
}
```

#### JavaScript Implementation (c-backend.js)
```javascript
function addProduct(id, name, price, quantity) {
    const inventory = readInventory();
    
    // Validation: Check if inventory is full
    if (inventory.products.length >= MAX) {
        return { success: false, error: 'Inventory full!' };
    }

    // Validation: Check if ID already exists - O(n)
    if (inventory.products.find(p => p.id === parseInt(id))) {
        return { success: false, error: 'Product ID already exists!' };
    }

    // Create new product object
    const newProduct = {
        id: parseInt(id),
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity)
    };

    // Add to array (append at end)
    inventory.products.push(newProduct);

    // Persist to file
    if (writeInventory(inventory)) {
        return { success: true, message: 'Product added successfully' };
    } else {
        return { success: false, error: 'Failed to save product' };
    }
}
```

#### Time & Space Analysis
```
Time Complexity: O(n)
  - Linear search for duplicate check: n operations
  - Array append: O(1)
  - File write: O(n) to serialize all products

Space Complexity: O(1)
  - Only stores single product in memory
  - File I/O is external
```

---

### **Algorithm 2: Sort by Name (Bubble Sort)**

#### C Implementation (inventory.c)
```c
void sortByName() {
    struct Product temp;
    
    // Bubble sort algorithm - O(n²)
    for (int i = 0; i < count - 1; i++) {
        for (int j = i + 1; j < count; j++) {
            // Compare product names alphabetically
            if (strcmp(inventory[i].name, inventory[j].name) > 0) {
                // Swap if first > second
                temp = inventory[i];
                inventory[i] = inventory[j];
                inventory[j] = temp;
            }
        }
    }
    printf("Sorted by Name.\n");
}
```

#### Step-by-Step Bubble Sort Example

```
Initial Array:
[Keyboard] [Mouse] [Laptop]

Pass 1:
  Compare Keyboard vs Mouse: K > M? No, no swap
  Compare Keyboard vs Laptop: K > L? Yes, SWAP
  Result: [Laptop] [Mouse] [Keyboard]

Pass 2:
  Compare Laptop vs Mouse: L > M? No, no swap
  Compare Laptop vs Keyboard: L > K? Yes, SWAP
  Result: [Keyboard] [Laptop] [Mouse]

Wait, that's wrong! Let me redo:

Initial: [Keyboard] [Mouse] [Laptop]

Pass 1 (i=0):
  j=1: Compare Keyboard vs Mouse
       "Keyboard" > "Mouse"? No (K < M alphabetically)
  j=2: Compare Keyboard vs Laptop
       "Keyboard" > "Laptop"? Yes (K > L alphabetically)
       SWAP → [Laptop] [Mouse] [Keyboard]

Pass 2 (i=1):
  j=2: Compare Mouse vs Keyboard
       "Mouse" > "Keyboard"? Yes (M > K alphabetically)
       SWAP → [Laptop] [Keyboard] [Mouse]

Final: [Keyboard] [Laptop] [Mouse]
```

#### JavaScript Implementation (c-backend.js)
```javascript
function sortByName() {
    const inventory = readInventory();
    
    // JavaScript sort using comparison
    // (More efficient than bubble sort, but same concept)
    inventory.products.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    
    // Persist sorted data
    writeInventory(inventory);
    
    return {
        success: true,
        message: 'Sorted by Name',
        products: inventory.products
    };
}
```

#### Time & Space Analysis
```
Time Complexity: O(n²)
  - Outer loop: n iterations
  - Inner loop: up to n comparisons
  - Total: n × n = n² operations
  - Example: 100 products = 10,000 comparisons

Space Complexity: O(1)
  - Only uses temporary variable for swapping
  - Sorts in-place (no extra array needed)

Example Performance:
  10 products: ~100 comparisons
  100 products: ~10,000 comparisons
  1000 products: ~1,000,000 comparisons
```

#### Visual Comparison Animation
```
Keyboard  Mouse     Laptop
  |        |         |
  └────────┴─────────┘
   Compare and Swap

After each pass:
Pass 1: [Keyboard] [Laptop] [Mouse]  (largest in position)
Pass 2: [Keyboard] [Laptop] [Mouse]  (sorted!)
```

---

### **Algorithm 3: Search Product (Linear Search)**

#### C Implementation (inventory.c)
```c
void searchProduct() {
    int id, found = 0;
    printf("\nEnter product ID to search: ");
    scanf("%d", &id);

    // Linear search - O(n)
    for (int i = 0; i < count; i++) {
        if (inventory[i].id == id) {
            printf("\nProduct Found:\n");
            printf("ID: %d | Name: %s | Price: %.2f | Qty: %d\n",
                   inventory[i].id, inventory[i].name,
                   inventory[i].price, inventory[i].quantity);
            found = 1;
            break;  // Exit loop when found
        }
    }

    if (!found)
        printf("Product not found.\n");
}
```

#### Search Example

```
Search for ID = 2

inventory[0]: ID = 1, Name = "Laptop"      → Check: 1 == 2? No
inventory[1]: ID = 2, Name = "Mouse"       → Check: 2 == 2? YES! Found!
inventory[2]: ID = 3, Name = "Keyboard"    → (not reached)

Return: { id: 2, name: "Mouse", price: 500.00, quantity: 25 }
```

#### JavaScript Implementation (c-backend.js)
```javascript
function searchProduct(id) {
    const inventory = readInventory();
    
    // Linear search through products array
    const product = inventory.products.find(p => p.id === parseInt(id));
    
    if (product) {
        return { success: true, product: product };
    } else {
        return { success: false, error: 'Product not found' };
    }
}
```

#### Time & Space Analysis
```
Time Complexity: O(n)
  - Best case: O(1) - found at first position
  - Average case: O(n/2) ≈ O(n)
  - Worst case: O(n) - not found or at last position

Space Complexity: O(1)
  - Only stores single result variable
  - No extra arrays created

Example:
  10 products: up to 10 checks
  100 products: up to 100 checks
  1000 products: up to 1000 checks
```

---

### **Algorithm 4: Record Rental**

#### C Implementation (inventory.c)
```c
void recordRental() {
    int id, found = 0;
    
    if (rentalCount >= MAX) {
        printf("Rental records full!\n");
        return;
    }

    printf("\nEnter product ID to rent: ");
    scanf("%d", &id);

    // Linear search to find product - O(n)
    for (int i = 0; i < count; i++) {
        if (inventory[i].id == id) {
            printf("Enter renter name: ");
            scanf("%s", rentals[rentalCount].renterName);
            printf("Enter phone number: ");
            scanf("%s", rentals[rentalCount].phoneNumber);
            printf("Enter address: ");
            scanf("%s", rentals[rentalCount].address);
            printf("Enter return date (YYYY-MM-DD): ");
            scanf("%s", rentals[rentalCount].returnDate);
            printf("Enter amount paid: ");
            scanf("%f", &rentals[rentalCount].amountPaid);

            // Create rental record
            rentals[rentalCount].rentalId = (long)time(NULL);
            rentals[rentalCount].productId = id;
            strcpy(rentals[rentalCount].productName, inventory[i].name);
            strcpy(rentals[rentalCount].rentDate, __DATE__);
            strcpy(rentals[rentalCount].status, "active");

            printf("Rental recorded!\n");
            printf("Rental ID: %ld\n", rentals[rentalCount].rentalId);
            rentalCount++;
            found = 1;
            break;
        }
    }

    if (!found)
        printf("Product not found.\n");
}
```

#### Step-by-Step Rental Recording

```
Step 1: User enters Product ID = 1
Step 2: Search for product with ID 1
        Loop through inventory
        Find: inventory[0] = {id: 1, name: "Laptop", qty: 5}
Step 3: Collect rental details
        Renter: John Doe
        Phone: 9876543210
        Address: 123 Main St
        Return Date: 2025-12-17
        Amount: 5000.00
Step 4: Generate rental record
        rentalId = current timestamp (unique)
        productId = 1
        productName = "Laptop" (cached)
        rentDate = "2025-12-10" (today)
        status = "active"
Step 5: Add to rentals array
        rentals[0] = {full rental record}
        rentalCount++ (becomes 1)
Step 6: Save to inventory.json
        Update: products[0].quantity = 4 (decreased by 1)
        Add: new rental to rentals array
```

#### JavaScript Implementation (c-backend.js)
```javascript
function recordRental(productId, renterName, returnDate, phoneNumber, address, amountPaid) {
    const inventory = readInventory();
    
    // Step 1: Find product by ID - O(n)
    const productIndex = inventory.products.findIndex(
        p => p.id === parseInt(productId)
    );

    // Step 2: Validate product exists
    if (productIndex === -1) {
        return { success: false, error: 'Product not found' };
    }

    // Step 3: Validate product is available
    if (inventory.products[productIndex].quantity <= 0) {
        return { success: false, error: 'Product not available for rent' };
    }

    // Step 4: Decrease product quantity
    inventory.products[productIndex].quantity--;

    // Step 5: Create rental object
    const rental = {
        rentalId: Date.now(),  // Generate unique ID
        productId: parseInt(productId),
        productName: inventory.products[productIndex].name,
        renterName: renterName.trim(),
        rentDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate,
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        amountPaid: parseFloat(amountPaid),
        status: 'active'
    };

    // Step 6: Add rental to array
    inventory.rentals.push(rental);

    // Step 7: Persist to file
    if (writeInventory(inventory)) {
        return {
            success: true,
            message: 'Rental recorded',
            rental: rental
        };
    }
}
```

---

##  Code Flow Examples

### **Complete Flow: Frontend Click to Data Update**

```
┌────────────────────────────────────────────────────────────────┐
│ USER CLICKS "SORT BY NAME" BUTTON                              │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│ FRONTEND: products.html                                        │
│                                                                │
│ HTML: <button onclick="sortByName()">Sort by Name</button>   │
│                                                                │
│ JavaScript function sortByName() {                            │
│     try {                                                      │
│         const res = await fetch(                              │
│             "/api/c/product/sort/name"                        │
│         );                                                     │
│         const result = await res.json();                      │
│         allProducts = result.products;  // Update local array  │
│         displayProducts();               // Redraw table       │
│     } catch (error) { ... }                                   │
│ }                                                              │
└────────────────────────────────────────────────────────────────┘
                              ↓ HTTP GET request
                       /api/c/product/sort/name
┌────────────────────────────────────────────────────────────────┐
│ SERVER: server.js                                              │
│                                                                │
│ const server = http.createServer((req, res) => {             │
│     const pathname = parsedUrl.pathname;                      │
│                                                                │
│     if (pathname === '/api/c/product/sort/name') {           │
│         const result = cBackend.sortByName();                │
│         res.writeHead(200);                                   │
│         res.end(JSON.stringify(result));                      │
│     }                                                          │
│ });                                                            │
└────────────────────────────────────────────────────────────────┘
                              ↓ JavaScript module call
┌────────────────────────────────────────────────────────────────┐
│ C BACKEND: c-backend.js                                        │
│                                                                │
│ function sortByName() {                                       │
│     // 1. Read inventory.json file                            │
│     const inventory = readInventory();                        │
│     // Result: {                                              │
│     //   products: [                                          │
│     //     {id:1, name:"Laptop", price:50000, qty:5},        │
│     //     {id:2, name:"Mouse", price:500, qty:25},          │
│     //     {id:3, name:"Keyboard", price:1200, qty:15}       │
│     //   ]                                                     │
│     // }                                                       │
│                                                                │
│     // 2. Sort products by name (bubble sort)                 │
│     inventory.products.sort((a, b) =>                        │
│         a.name.localeCompare(b.name)                         │
│     );                                                         │
│     // Result: [                                              │
│     //   {id:3, name:"Keyboard", price:1200, qty:15},       │
│     //   {id:1, name:"Laptop", price:50000, qty:5},         │
│     //   {id:2, name:"Mouse", price:500, qty:25}            │
│     // ]                                                       │
│                                                                │
│     // 3. Write back to file                                  │
│     writeInventory(inventory);                                │
│                                                                │
│     // 4. Return sorted array                                 │
│     return {                                                   │
│         success: true,                                        │
│         message: 'Sorted by Name',                            │
│         products: inventory.products  // SORTED!              │
│     };                                                         │
│ }                                                              │
└────────────────────────────────────────────────────────────────┘
                              ↓ JavaScript object returned
┌────────────────────────────────────────────────────────────────┐
│ SERVER: Sends JSON response                                    │
│                                                                │
│ {                                                              │
│     "success": true,                                          │
│     "message": "Sorted by Name",                              │
│     "products": [                                             │
│         {id:3, name:"Keyboard", price:1200, qty:15},          │
│         {id:1, name:"Laptop", price:50000, qty:5},          │
│         {id:2, name:"Mouse", price:500, qty:25}             │
│     ]                                                          │
│ }                                                              │
└────────────────────────────────────────────────────────────────┘
                              ↓ HTTP response received
┌────────────────────────────────────────────────────────────────┐
│ FRONTEND: Processes response                                   │
│                                                                │
│ const result = await res.json();                              │
│ // result.products = sorted array                             │
│                                                                │
│ allProducts = result.products;                                │
│ // Now local array is sorted                                  │
│                                                                │
│ displayProducts();                                             │
│ // Updates HTML table:                                        │
│ // <tr><td>3</td><td>Keyboard</td><td>1200</td><td>15</td>  │
│ // <tr><td>1</td><td>Laptop</td><td>50000</td><td>5</td>    │
│ // <tr><td>2</td><td>Mouse</td><td>500</td><td>25</td>      │
│                                                                │
│ USER SEES: Products sorted A→Z by name!                       │
└────────────────────────────────────────────────────────────────┘
```

---

##  Performance Analysis

### **Big O Notation Reference**

```
O(1)     - Constant time      - Super fast!
O(log n) - Logarithmic        - Very fast
O(n)     - Linear             - Fast
O(n log n) - Linear Logarithmic - Good
O(n²)    - Quadratic          - Slow for large n
O(2ⁿ)    - Exponential        - Very slow
O(n!)    - Factorial          - Extremely slow
```

### **NexStock Operations Analysis**

| Operation | Algorithm | Time | Space | Best Case | Worst Case | Avg Case |
|-----------|-----------|------|-------|-----------|-----------|----------|
| Add Product | Linear Search | O(n) | O(1) | O(1) ID=1 | O(n) ID=100 | O(n/2) |
| Delete Product | Linear Search | O(n) | O(1) | O(1) first | O(n) last | O(n/2) |
| Search Product | Linear Search | O(n) | O(1) | O(1) found | O(n) not found | O(n/2) |
| Sort By Name | Bubble Sort | O(n²) | O(1) | O(n) sorted | O(n²) reverse | O(n²) |
| Get All | Direct | O(1) | O(n) | - | - | - |
| Record Rental | Linear Search | O(n) | O(1) | O(1) first | O(n) last | O(n/2) |

### **Scalability Graph**

```
Time Complexity vs Number of Products

Linear Search: O(n)
├─ 10 products:   10 operations
├─ 100 products:  100 operations
├─ 1000 products: 1000 operations
└─ 10000 products: 10000 operations

Bubble Sort: O(n²)
├─ 10 products:   100 operations
├─ 100 products:  10,000 operations
├─ 1000 products: 1,000,000 operations
└─ 10000 products: 100,000,000 operations (SLOW!)

Visual:
Time
  |     ▲ O(n²) - Bubble Sort
  |    ╱╲
  |   ╱  ╲
  |  ╱    ╲___
  | ╱         ╲
  |╱___________▲ O(n) - Linear Search
  └────────────────── Products
```

---

##  Data Flow Chain

```
inventory.json (Persistent Storage)
       ↓ (File Read)
readInventory() 
       ↓ (Parse JSON)
JavaScript Objects (in memory)
       ↓ (Algorithm Processing)
Modified Objects
       ↓ (File Write)
inventory.json (Updated)
```

---

##  Key Takeaways

1. **Struct Arrays** - Efficient way to store related data
2. **Bubble Sort** - O(n²) but simple to understand
3. **Linear Search** - O(n) but necessary for unindexed data
4. **File I/O** - JSON for easy serialization
5. **Frontend-Backend Contract** - JSON request/response
6. **Data Persistence** - File-based storage strategy
7. **Scalability** - Algorithm complexity becomes critical at scale

---

**This technical documentation explains the complete C backend architecture and algorithms used in NexStock!**
