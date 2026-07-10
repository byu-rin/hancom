const Tag = ({ tags }) => {
  return (
    <div>
      {tags.map(
        (
          tag, // tags(복수 배열) -> 요소 하나는 tag(단수)
        ) => (
          <span key={tag}>{"#" + tag}</span>
        ),
      )}
    </div>
  );
};
export default Tag;
