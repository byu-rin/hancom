import { Button } from "@mui/material";

const SubmitButton = () => {
  return (
    <Button variant="contained" onClick={() => alert("안녕!")}>
      {" "}
      {/* variant=모양, onClick=동작 → 다 props */}
      제출
    </Button>
  );
};
export default SubmitButton;
