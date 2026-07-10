const Rating = ({ score }) => {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < score ? "⭐" : "✩"}</span>
      ))}
    </div>
  );
};
export default Rating;

/*
props + 배열
Array(5) undefined
-> [...Array(5)] 
*/
