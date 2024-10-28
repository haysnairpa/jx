class HistoryStack {

  // Stack Initialization
  constructor() {
    this.items = [];
  }

  // Push item to the stack
  // Time Complexity: O(1)
  push(item) {
    this.items.push(item);
    // In the context of the application, this stores the latest search
  }

  // Delete the last item from the stack
  // Time Complexity: O(1)
  pop() {
    // Check if the stack is empty
    if (this.isEmpty()) return "Stack is empty";
    // Delete the last item and return the latest element from the stack
    return this.items.pop();
    // In the context of the application, this deletes the latest search
  }

  // View the item at the top of the stack without deleting it (peek operation)
  // Time Complexity: O(1)
  peek() {
    // Check if the stack is empty
    if (this.isEmpty()) return "Stack is empty";
    // It used to view the latest search without deleting it
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  // Time Complexity: O(1)
  isEmpty() {
    // return true if there is no item in the stackk
    return this.items.length === 0;
  }

  // Get the size of the stack
  size() {
    // it can be used to check how many searches have been made
    return this.items.length;
  }

  // Clear the stack
  clear() {
    // Used to clear the array of the stack, effectively removing all searches
    this.items = [];
  }

  // Print the stack
  print() {
    // Convert the entire search history into a string
    // it also can be useful for debugging or displaying the entire search history
    return this.items.toString();
  }
}

export default HistoryStack;

