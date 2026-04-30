export default function contains(root, n) {
  if (!root) {
    return false;
  }
  // Use native if support
  if (root.contains) {
    return root.contains(n);
  }
  return false;
}