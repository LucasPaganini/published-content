export type Item = string;

export const getItems = async (
  amount: number,
  pointer: number = 0
): Promise<{ items: Array<Item>; pointer: number; hasMore: boolean }> => {
  // Wait a second to simulate delay
  await new Promise((res) => setTimeout(res, 1000));

  // Get items from ITEMS
  const items = Array.from({ length: amount })
    .map((_, i) => i + pointer)
    .map((index) => ITEMS[index] ?? null)
    .filter((v) => v !== null);
  const lastPointer = items.length + pointer;
  const hasMore = lastPointer < ITEMS.length - 1;

  return { items, pointer: lastPointer, hasMore };
};

const ITEMS: Array<Item> = "Hi beautiful 😉 Subscribe to my newsletter. It's way better than depending on YouTube notifications ❤️ You can do so by going to lucaspaganini.com".split(
  ' '
);

export const isAtTheBottom = (margin = 0): boolean => {
  const viewportHeight = window.innerHeight;
  const pageHeight = window.document.body.scrollHeight;
  const pageScrollY = window.scrollY;

  const pixelsToReachBottom = pageHeight - (pageScrollY + viewportHeight);
  return pixelsToReachBottom - margin <= 0;
};
