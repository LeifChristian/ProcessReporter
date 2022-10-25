let interval = 10000;

let localStoredItems = [
  {
    name: "npm run dev",
    process_ID: 0,
    created: "Wed Nov 22 54169 10:40:42 ",
    pm2_ID: 1,
    status: "stopped",
    read: false,
  },
  {
    name: "npm start",
    process_ID: 0,
    created: "Wed Mar 21 54170 23:57:32 ",
    pm2_ID: 2,
    status: "stopped",
    read: false,
  },
  {
    name: "npm start",
    process_ID: 0,
    created: "Sat Mar 24 54170 01:49:43 ",
    pm2_ID: 2,
    status: "stopped",
    read: false,
  },
];

let tempVar = [
  //   {
  //     name: "npm run dev",
  //     process_ID: 0,
  //     created: "Wed Nov 22 54169 10:40:42 ",
  //     pm2_ID: 1,
  //     status: "stopped",
  //     read: false,
  //   },
  //   {
  //     name: "npm start",
  //     process_ID: 0,
  //     created: "Wed Mar 21 54170 23:57:32 ",
  //     pm2_ID: 2,
  //     status: "stopped",
  //     read: false,
  //   },
  {
    name: "npm start",
    process_ID: 0,
    created: "Sat Mar 24 54170 01:49:43 ",
    pm2_ID: 2,
    status: "stopped",
    read: false,
  },
];

const difference = tempVar.filter(
  (o1) => !localStoredItems.some((o2) => o1.created === o2.created)
);

let go = () => {
  console.log(localStoredItems, "localstoreditems");
  //   console.log(tempVar, "tempVar");
  //   console.log(result, "result");
  console.log(difference, "difference");

  setInterval(function () {
    var date = new Date(); // Or the date you'd like converted.
    var isoDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();

    let timeString = isoDateTime
      .slice(0, 19)
      .replace("T", " ")
      .replace("Z", "");
    console.log(timeString);

    go();
  }, interval);
};

go();
