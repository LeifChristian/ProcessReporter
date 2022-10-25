let courseArray = [
  { id: 1, name: "javascript" },
  { id: 2, name: "typescript" },
  { id: 11, name: "angular" },
  { id: 1, name: "javascript" },
];

const result = courseArray.filter((value, index) => {
  const _value = JSON.stringify(value);
  return (
    index ===
    courseArray.findIndex((obj) => {
      return JSON.stringify(obj) === _value;
    })
  );
});

let go = () => {
  console.log(courseArray, "course array");
  console.log(result, "result");
};

go();
