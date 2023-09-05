const now = new Date();

export default [
  {
    id: 2,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 1,
    title: "new Today",
    start: new Date("2023-09-15"),
    end: new Date("2023-09-17"),
  },
];
