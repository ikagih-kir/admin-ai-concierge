import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { fetchHitResultDetail, updateHitResult } from "../../api/hitResult";
import HitResultForm from "./HitResultForm";
import { useParams, useNavigate } from "react-router-dom";

const HitResultEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchHitResultDetail(Number(id)).then(setData);
  }, [id]);

  if (!data) return null;

  return (
    <Box p={3}>
      <Typography variant="h6" mb={2}>
        的中実績 編集
      </Typography>

      <HitResultForm
        initial={data}
        onSubmit={async (form) => {
          await updateHitResult(Number(id), form);
          navigate("/hit-results");
        }}
      />
    </Box>
  );
};

export default HitResultEditPage;
