const now = new Date();

export default [
  {
    id: 1,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 2,
    title: "Today2",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 3,
    title: "Today23",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },

  {
    id: 4,
    title: "new Today4",
    draggable: true,
    resource: "ddd",
    start: new Date("2023-09-15"),
    end: new Date("2023-09-17"),
  },
  {
    id: 5,
    title: "new Today5",
    start: new Date("2023-09-16"),
    end: new Date("2023-09-17"),
  },
  {
    id: 6,
    title: "new Today6",
    start: new Date("2023-09-11"),
    end: new Date("2023-09-17"),
  },
  {
    id: 7,
    title: "new Today7",
    start: new Date("2023-09-12"),
    end: new Date("2023-09-17"),
  },
];
